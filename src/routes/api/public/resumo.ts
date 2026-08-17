import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getSetting, aiKeys, currentUser, usosHoje, registrarUsoIA } from '@/lib/px-server'
import { fetchKnowledge, baseTexto, fonteInstrucao } from '@/lib/kb-context'
import { chat, normalizar, AIError } from '@/lib/ai-gateway'

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).optional().nullable(),
  curso: z.string().max(80).optional(),
})

export const Route = createFileRoute('/api/public/resumo')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await currentUser(request)
        if (!userId) return Response.json({ error: 'Entre na sua conta para gerar o resumo.' }, { status: 401 })

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        const cfg = normalizar(await getSetting('ia_athena'))
        const limite = cfg.limiteDiario ?? 0
        if (limite > 0 && (await usosHoje(userId, 'resumo')) >= limite)
          return Response.json({ error: `Você atingiu o limite de ${limite} resumos hoje. Volte amanhã.` }, { status: 429 })

        const docs = await fetchKnowledge(curso, body.disciplina, body.topico)
        const base = baseTexto(docs, body.disciplina)

        const system = [
          'Você é a Athena, professora de concursos da plataforma Prova X.',
          'Gere um RESUMO de estudo em português do Brasil, focado em prova (banca Cebraspe, itens certo/errado).',
          'Formato obrigatório: 3 a 5 blocos. Cada bloco começa com um título em uma linha iniciada por "## " ' +
            'e é seguido por um único parágrafo curto (2 a 4 linhas). Marque os trechos essenciais (definições, ' +
            'prazos, requisitos, exceções) entre **asteriscos duplos**. Sem listas, sem emojis, sem introdução ou conclusão.',
          fonteInstrucao(base),
        ].join('\n')

        try {
          const resumo = await chat({
            provider: cfg.provider,
            model: cfg.model,
            system,
            user: `Disciplina: ${body.disciplina}${body.topico ? ` | Tópico: ${body.topico}` : ''}\n\nGere o resumo.`,
            keys: await aiKeys(),
          })
          await registrarUsoIA({
            user_id: userId,
            ferramenta: 'resumo',
            modelo: cfg.model,
            discipline_nome: body.disciplina,
            topic_nome: body.topico ?? null,
            pergunta: 'resumo',
            resposta: resumo || '',
          })
          if (!resumo) return Response.json({ error: 'Não consegui gerar o resumo agora.' }, { status: 502 })
          return Response.json({ resumo, fontes: docs.length, modelo: cfg.model })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'Não consegui gerar o resumo agora.' }, { status: err.status || 502 })
        }
      },
    },
  },
})
