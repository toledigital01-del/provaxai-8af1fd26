import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const SUPABASE_URL = 'https://rdokrryisfkhmevcxlws.supabase.co'
const SUPABASE_KEY = 'sb_publishable_9ILwlXJNPJ5ZzpALdbmfBA_gRAtH4Qr'

const MODELOS = [
  'google/gemini-3-flash-preview',
  'google/gemini-3.1-pro-preview',
  'openai/gpt-5.6-sol',
  'openai/gpt-5.6-terra',
] as const
const MODELO_PADRAO = 'google/gemini-3-flash-preview'

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topicos: z.array(z.string().max(300)).max(400),
  material: z.string().min(50).max(300000),
  modelo: z.string().max(80).optional(),
  banca: z.string().max(60).optional(),
  cargo: z.string().max(120).optional(),
  profundidade: z.enum(['essencial', 'completo', 'aprofundado']).optional(),
  modo_aprovacao: z.boolean().optional(),
})


async function requireAdmin(request: Request) {
  const auth = request.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) return Response.json({ error: 'Não autenticado.' }, { status: 401 })
  const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  })
  if (!u.ok) return Response.json({ error: 'Sessão inválida.' }, { status: 401 })
  const user = (await u.json()) as { id: string }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/has_role`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ _user_id: user.id, _role: 'admin' }),
  })
  if (!(r.ok && (await r.json()) === true))
    return Response.json({ error: 'Acesso restrito a administradores.' }, { status: 403 })
  return null
}

export const Route = createFileRoute('/api/public/kb-autocourse')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await requireAdmin(request)
        if (denied) return denied

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) return Response.json({ error: 'IA indisponível no momento.' }, { status: 503 })

        const modelo = (MODELOS as readonly string[]).includes(body.modelo || '')
          ? (body.modelo as string)
          : MODELO_PADRAO
        const banca = (body.banca || 'Cebraspe').trim() || 'Cebraspe'
        const cargo = (body.cargo || 'Polícia Rodoviária Federal').trim()
        const prof = body.profundidade || 'completo'
        const aprovacao = body.modo_aprovacao !== false
        const tamanho =
          prof === 'essencial' ? '500 a 900 palavras' : prof === 'aprofundado' ? '1800 a 3500 palavras' : '900 a 2000 palavras'

        const system = [
          `Você é a equipe pedagógica da plataforma Prova X, especialista em aprovação em concursos públicos da banca ${banca} para o cargo de ${cargo}.`,
          'Receberá material bruto (PDF, site, transcrição ou texto) de uma disciplina e a lista oficial de tópicos do edital.',
          'Tarefa: montar o curso, distribuindo e reescrevendo o material em aulas didáticas para os tópicos correspondentes.',
          'Regras:',
          '- Use apenas tópicos da lista fornecida (texto idêntico). Ignore tópicos sem base no material.',
          '- Cada aula em Markdown simples: ## para seções, - para listas, **negrito** para pontos de prova.',
          `- Tamanho de cada aula: ${tamanho}.`,
          '- Não invente legislação, jurisprudência nem números; baseie-se no material fornecido.',
          '- Classifique a incidência do tópico em provas como "alta", "media" ou "baixa".',
          ...(aprovacao
            ? [
                'MODO APROVAÇÃO — cada aula deve seguir exatamente esta estrutura de seções:',
                '## Mapa do tópico — o que cai e por quê',
                '## Teoria essencial (com **negrito** nos pontos cobrados)',
                `## Como a ${banca} cobra este assunto` +
                  (/cebraspe|cespe/i.test(banca) ? ' (itens de certo/errado, generalizações e trocas de termo)' : ' (padrão de enunciado e alternativas)'),
                '## Pegadinhas e palavras-armadilha (sempre, exclusivamente, prazos, competências)',
                '## Letra de lei, súmulas e jurisprudência (somente o que estiver no material)',
                '## Resumo relâmpago para revisão',
                `## Treino rápido — 3 a 5 assertivas no estilo ${banca}, cada uma com gabarito comentado`,
              ]
            : []),
          'Responda SOMENTE com JSON válido no formato:',
          '{"aulas":[{"topico":"<tópico exato>","titulo":"<título da aula>","incidencia":"alta|media|baixa","conteudo":"<markdown>"}]}',
        ].join('\n')

        const user = [
          `Disciplina: ${body.disciplina}`,
          `Banca: ${banca} — Cargo/Concurso: ${cargo}`,
          `Tópicos oficiais:\n${body.topicos.map((t) => `- ${t}`).join('\n')}`,
          `MATERIAL BRUTO:\n${body.material}`,
        ].join('\n\n')

        const payload: Record<string, unknown> = {
          model: modelo,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        }
        if (modelo.startsWith('openai/')) payload['reasoning_effort'] = 'none'

        const ai = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (ai.status === 429) return Response.json({ error: 'Limite de uso da IA atingido. Tente em instantes.' }, { status: 429 })
        if (ai.status === 402) return Response.json({ error: 'Créditos de IA esgotados.' }, { status: 402 })
        if (!ai.ok) return Response.json({ error: 'A IA não conseguiu montar o curso agora.' }, { status: 502 })

        const data = (await ai.json()) as any
        const raw: string = data?.choices?.[0]?.message?.content || ''
        const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)
        let parsed: { aulas?: Array<{ topico: string; titulo?: string; incidencia?: string; conteudo: string }> }
        try {
          parsed = JSON.parse(json)
        } catch {
          return Response.json({ error: 'A IA retornou um formato inesperado. Tente novamente.' }, { status: 502 })
        }
        const validos = new Set(body.topicos)
        const aulas = (parsed.aulas || [])
          .filter((a) => a && typeof a.conteudo === 'string' && a.conteudo.trim() && validos.has(a.topico))
          .map((a) => ({
            topico: a.topico,
            titulo: (a.titulo || a.topico).slice(0, 200),
            incidencia: ['alta', 'media', 'baixa'].includes(String(a.incidencia)) ? String(a.incidencia) : 'media',
            conteudo: a.conteudo,
          }))

        if (!aulas.length) return Response.json({ error: 'A IA não encontrou correspondência com os tópicos do edital.' }, { status: 422 })
        return Response.json({ aulas, modelo })

      },
    },
  },
})
