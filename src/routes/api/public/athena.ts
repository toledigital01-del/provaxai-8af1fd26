import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).optional().nullable(),
  pergunta: z.string().min(1).max(2000),
  curso: z.string().max(80).optional(),
})

const SUPABASE_URL = 'https://rdokrryisfkhmevcxlws.supabase.co'
const SUPABASE_KEY = 'sb_publishable_9ILwlXJNPJ5ZzpALdbmfBA_gRAtH4Qr'

async function fetchKnowledge(curso: string, disciplina: string, topico?: string | null) {
  const params = new URLSearchParams({
    select: 'titulo,topico,conteudo',
    course_slug: `eq.${curso}`,
    disciplina: `eq.${disciplina}`,
    publicado: 'is.true',
    limit: '12',
  })
  const res = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_docs?${params}`, {
    headers: { apikey: SUPABASE_KEY },
  })
  if (!res.ok) return [] as Array<{ titulo?: string; topico?: string; conteudo: string }>
  const rows = (await res.json()) as Array<{ titulo?: string; topico?: string; conteudo: string }>
  const exact = topico ? rows.filter((r) => r.topico === topico) : []
  const geral = rows.filter((r) => !r.topico)
  const outros = rows.filter((r) => !exact.includes(r) && !geral.includes(r))
  return [...exact, ...geral, ...outros].slice(0, 6)
}

export const Route = createFileRoute('/api/public/athena')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        const docs = await fetchKnowledge(curso, body.disciplina, body.topico)
        const base = docs
          .map((d) => `### ${d.titulo || d.topico || body.disciplina}\n${(d.conteudo || '').slice(0, 12000)}`)
          .join('\n\n')

        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) return Response.json({ error: 'IA indisponível no momento.' }, { status: 503 })

        const system = [
          'Você é a Athena, professora de concursos da plataforma Prova X.',
          'Responda em português do Brasil, de forma didática, objetiva e focada em prova (padrão Cebraspe certo/errado).',
          base
            ? 'Use PRIORITARIAMENTE o material oficial abaixo como fonte de verdade. Se a resposta não estiver nele, diga isso e complemente com cuidado.\n\n--- MATERIAL OFICIAL ---\n' + base
            : 'Ainda não há material oficial cadastrado para este tópico; responda com base no edital e avise o aluno que o conteúdo detalhado será publicado em breve.',
        ].join('\n')

        const ai = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-3-flash-preview',
            messages: [
              { role: 'system', content: system },
              {
                role: 'user',
                content: `Disciplina: ${body.disciplina}${body.topico ? ` | Tópico: ${body.topico}` : ''}\n\nPergunta: ${body.pergunta}`,
              },
            ],
          }),
        })

        if (ai.status === 429) return Response.json({ error: 'Muitas perguntas seguidas. Tente em instantes.' }, { status: 429 })
        if (!ai.ok) return Response.json({ error: 'Não consegui responder agora.' }, { status: 502 })

        const data = (await ai.json()) as any
        const resposta = data?.choices?.[0]?.message?.content || 'Não consegui responder agora.'
        return Response.json({ resposta, fontes: docs.length })
      },
    },
  },
})
