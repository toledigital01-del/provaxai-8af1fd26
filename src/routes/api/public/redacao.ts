import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getSetting, aiKeys, currentUser, usosHoje, registrarUsoIA } from '@/lib/px-server'
import { fetchKnowledge, baseTexto, fonteInstrucao } from '@/lib/kb-context'
import { chat, normalizar, AIError } from '@/lib/ai-gateway'

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).optional().nullable(),
  texto: z.string().min(20).max(8000),
  curso: z.string().max(80).optional(),
})

export const Route = createFileRoute('/api/public/redacao')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await currentUser(request)
        if (!userId) return Response.json({ error: 'Entre na sua conta para corrigir sua resposta.' }, { status: 401 })

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Escreva pelo menos algumas linhas antes de enviar para correção.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        const cfg = normalizar(await getSetting('ia_athena'))
        const limite = cfg.limiteDiario ?? 0
        if (limite > 0 && (await usosHoje(userId, 'redacao')) >= limite)
          return Response.json({ error: `Você atingiu o limite de ${limite} correções hoje. Volte amanhã.` }, { status: 429 })

        const docs = await fetchKnowledge(curso, body.disciplina, body.topico)
        const base = baseTexto(docs, body.disciplina)

        const system = [
          'Você é a Athena, corretora de discursivas de concurso (padrão Cebraspe), em português do Brasil.',
          'Corrija a resposta do aluno sobre o tópico indicado usando exatamente estes blocos, nesta ordem, ' +
            'cada título numa linha iniciada por "## ":',
          '## Pontos fortes — 2 a 4 itens em lista com "- ".',
          '## Pontos a melhorar — 2 a 4 itens em lista com "- ", apontando o que faltou de conteúdo cobrado pela banca.',
          '## Nota estimada — uma linha no formato "8,5 / 10" seguida de uma frase curta justificando.',
          'Seja específico e honesto; não elogie o que não está no texto. Sem emojis.',
          fonteInstrucao(base),
        ].join('\n')

        try {
          const feedback = await chat({
            provider: cfg.provider,
            model: cfg.model,
            system,
            user: `Disciplina: ${body.disciplina}${body.topico ? ` | Tópico: ${body.topico}` : ''}\n\nRESPOSTA DO ALUNO:\n${body.texto}`,
            keys: await aiKeys(),
          })
          await registrarUsoIA({
            user_id: userId,
            ferramenta: 'redacao',
            modelo: cfg.model,
            discipline_nome: body.disciplina,
            topic_nome: body.topico ?? null,
            pergunta: body.texto,
            resposta: feedback || '',
          })
          if (!feedback) return Response.json({ error: 'Não consegui corrigir agora.' }, { status: 502 })
          return Response.json({ feedback, fontes: docs.length, modelo: cfg.model })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'Não consegui corrigir agora.' }, { status: err.status || 502 })
        }
      },
    },
  },
})
