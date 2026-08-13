import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import {
  SUPABASE_URL,
  getSetting,
  aiKeys,
  currentUser,
  hasCourseAccess,
  usosHoje,
  registrarUsoIA,
  serviceHeaders,
} from '@/lib/px-server'
import { chat, normalizar, AIError } from '@/lib/ai-gateway'

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).optional().nullable(),
  pergunta: z.string().min(1).max(2000),
  curso: z.string().max(80).optional(),
})

async function fetchKnowledge(curso: string, disciplina: string, topico?: string | null) {
  const params = new URLSearchParams({
    select: 'titulo,topico,conteudo',
    course_slug: `eq.${curso}`,
    disciplina: `eq.${disciplina}`,
    publicado: 'is.true',
    limit: '12',
  })
  const res = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_docs?${params}`, {
    headers: serviceHeaders(),
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
        const userId = await currentUser(request)
        if (!userId) return Response.json({ error: 'Faça login para falar com a Athena.' }, { status: 401 })

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        // Trava de acesso pago desativada por enquanto (fase de testes): qualquer
        // aluno logado pode falar com a Athena. Reativar: `if (!(await hasCourseAccess(userId, curso))) return Response.json({ error: 'Seu acesso ao curso não está ativo.' }, { status: 403 })`
        void hasCourseAccess

        const cfgLimite = normalizar(await getSetting('ia_athena'))
        const limite = cfgLimite.limiteDiario ?? 0
        if (limite > 0 && (await usosHoje(userId, 'athena')) >= limite)
          return Response.json(
            { error: `Você atingiu o limite de ${limite} perguntas para a Athena hoje. Volte amanhã.` },
            { status: 429 },
          )

        const docs = await fetchKnowledge(curso, body.disciplina, body.topico)
        const base = docs
          .map((d) => `### ${d.titulo || d.topico || body.disciplina}\n${(d.conteudo || '').slice(0, 12000)}`)
          .join('\n\n')

        const cfg = cfgLimite

        const system = [
          'Você é a Athena, professora de concursos da plataforma Prova X.',
          'Responda em português do Brasil, de forma didática, objetiva e focada em prova (padrão Cebraspe certo/errado).',
          'Formato da resposta: escreva como numa conversa de chat, não como um artigo. Parágrafos curtos (2-4 linhas). ' +
            'No máximo 2-3 pontos principais por resposta — se o assunto tiver mais partes, cubra só o essencial e termine ' +
            'perguntando se o aluno quer que você continue com o próximo ponto. Evite títulos markdown (#, ##) e emojis. ' +
            'Só use lista com marcadores quando for mesmo uma enumeração curta (até 4 itens).',
          base
            ? 'Use PRIORITARIAMENTE o material oficial abaixo como fonte de verdade. Se a resposta não estiver nele, diga isso e complemente com cuidado.\n\n--- MATERIAL OFICIAL ---\n' + base
            : 'Ainda não há material oficial cadastrado para este tópico; responda com base no edital e avise o aluno que o conteúdo detalhado será publicado em breve.',
        ].join('\n')

        try {
          const resposta = await chat({
            provider: cfg.provider,
            model: cfg.model,
            system,
            user: `Disciplina: ${body.disciplina}${body.topico ? ` | Tópico: ${body.topico}` : ''}\n\nPergunta: ${body.pergunta}`,
            keys: await aiKeys(),
          })
          await registrarUsoIA({
            user_id: userId,
            ferramenta: 'athena',
            modelo: cfg.model,
            discipline_nome: body.disciplina,
            topic_nome: body.topico ?? null,
            pergunta: body.pergunta,
            resposta: resposta || '',
          })
          return Response.json({
            resposta: resposta || 'Não consegui responder agora.',
            fontes: docs.length,
            modelo: cfg.model,
          })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'Não consegui responder agora.' }, { status: err.status || 502 })
        }
      },
    },
  },
})
