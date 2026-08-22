import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { currentUser, usosHoje, serviceHeaders, SUPABASE_URL } from '@/lib/px-server'
import { fetchKnowledge, baseTexto, fonteInstrucao } from '@/lib/kb-context'
import { AIError } from '@/lib/ai-gateway'
import { agentChat, rotaDoAgente } from '@/lib/ai-router'
import { lerRecurso, salvarRecurso } from '@/lib/aula-recursos'

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).optional().nullable(),
  curso: z.string().max(80).optional(),
  regerar: z.boolean().optional(),
})

/* Módulos extras publicados pelo admin no pacote da aula (revisão inteligente,
   pontos-chave e pegadinhas) — prontos, sem custo de geração para o aluno. */
async function extrasPublicados(curso: string, disciplina: string, topico?: string | null) {
  if (!topico) return {}
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/aula_recursos?select=tipo,dados&course_slug=eq.${encodeURIComponent(curso)}` +
        `&disciplina=${encodeURIComponent(disciplina)}&topico=eq.${encodeURIComponent(topico)}` +
        `&tipo=in.(revisao,pontos,pegadinhas)`,
      { headers: serviceHeaders() },
    )
    if (!r.ok) return {}
    const rows = (await r.json()) as Array<{ tipo: string; dados: { conteudo?: string } }>
    const out: Record<string, string> = {}
    ;(Array.isArray(rows) ? rows : []).forEach((x) => {
      const c = (x.dados?.conteudo || '').trim()
      if (c) out[x.tipo] = c
    })
    return out
  } catch {
    return {}
  }
}

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

        // Resumo já preparado no painel (gerado uma vez, reaproveitado por todos).
        if (!body.regerar) {
          const pronto = await lerRecurso<{ resumo?: string; fontes?: number }>(curso, body.disciplina, body.topico, 'resumo')
          if (pronto && (pronto.dados?.resumo || '').trim())
            return Response.json({
              resumo: pronto.dados.resumo,
              fontes: pronto.dados.fontes ?? 0,
              modelo: pronto.modelo,
              cache: true,
              extras: await extrasPublicados(curso, body.disciplina, body.topico),
            })
        }

        const rota = await rotaDoAgente('resumos')
        const limite = rota.limiteDiario
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
          const r = await agentChat({
            agent: 'resumos',
            system,
            user: `Disciplina: ${body.disciplina}${body.topico ? ` | Tópico: ${body.topico}` : ''}\n\nGere o resumo.`,
            userId,
            ferramenta: 'resumo',
            disciplina: body.disciplina,
            topico: body.topico ?? null,
          })
          const resumo = r.texto
          if (!resumo) return Response.json({ error: 'Não consegui gerar o resumo agora.' }, { status: 502 })
          await salvarRecurso(curso, body.disciplina, body.topico, 'resumo', { resumo, fontes: docs.length }, r.model)
          return Response.json({
            resumo,
            fontes: docs.length,
            modelo: r.model,
            cache: false,
            extras: await extrasPublicados(curso, body.disciplina, body.topico),
          })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'Não consegui gerar o resumo agora.' }, { status: err.status || 502 })
        }
      },
    },
  },
})
