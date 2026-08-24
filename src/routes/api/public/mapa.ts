import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { currentUser, usosHoje, serviceHeaders, SUPABASE_URL } from '@/lib/px-server'
import { fetchKnowledge, baseTexto, fonteInstrucao } from '@/lib/kb-context'
import { AIError } from '@/lib/ai-gateway'
import { agentChat, rotaDoAgente } from '@/lib/ai-router'
import { lerRecurso } from '@/lib/aula-recursos'

/* Mapa mental da aula.
   A fonte oficial é o módulo "Mapa mental" publicado pelo administrador no
   painel "IA da aula" (grava em aula_recursos, tipo = mapa_mental). O aluno
   sempre recebe essa versão; a geração pela Athena só acontece quando o
   professor pede explicitamente (gerar: true) e nunca é gravada como oficial. */

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).optional().nullable(),
  curso: z.string().max(80).optional(),
  gerar: z.boolean().optional(),
})

const eq = (v: string) => `eq.${encodeURIComponent(v)}`

/** Aulas da disciplina (ou do curso) que já têm mapa mental publicado. */
async function aulasComMapa(curso: string, disciplina?: string | null) {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/aula_recursos?select=disciplina,topico&course_slug=${eq(curso)}` +
        `&tipo=${eq('mapa_mental')}&topico=not.is.null` +
        (disciplina ? `&disciplina=${eq(disciplina)}` : '') +
        `&order=disciplina.asc&limit=300`,
      { headers: serviceHeaders() },
    )
    if (!r.ok) return []
    const rows = (await r.json()) as Array<{ disciplina: string; topico: string }>
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}

export const Route = createFileRoute('/api/public/mapa')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await currentUser(request) // null = convidado
        // Acesso liberado sem login por enquanto (fase de testes).

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        const topico = (body.topico || '').trim() || null

        // Sem tópico: devolve a lista de aulas que já têm mapa publicado.
        if (!topico) return Response.json({ aulas: await aulasComMapa(curso, body.disciplina) })

        // Mapa oficial publicado no painel administrativo.
        const pronto = await lerRecurso<{ conteudo?: string }>(curso, body.disciplina, topico, 'mapa_mental')
        const oficial = (pronto?.dados?.conteudo || '').trim()
        if (oficial) return Response.json({ conteudo: oficial, modelo: pronto?.modelo || null, oficial: true, cache: true })

        if (!body.gerar) return Response.json({ conteudo: '', oficial: false, pendente: true })

        // Geração provisória (não substitui o conteúdo oficial).
        const rota = await rotaDoAgente('resumos')
        const limite = rota.limiteDiario
        if (limite > 0 && (await usosHoje(userId, 'mapa')) >= limite)
          return Response.json({ error: `Você atingiu o limite de ${limite} gerações hoje. Volte amanhã.` }, { status: 429 })

        const docs = await fetchKnowledge(curso, body.disciplina, topico)
        const base = baseTexto(docs, body.disciplina)

        const system = [
          'Você é a Athena, professora de concursos da plataforma Prova X.',
          'Monte o MAPA MENTAL textual desta aula em Markdown, pronto para memorização visual.',
          'Use listas aninhadas com no máximo 4 níveis: tema central (# ), ramos (## ), sub-ramos ("- ") e detalhes ("  - ").',
          'Cada nó é curto (até 8 palavras), com os termos técnicos em negrito e os prazos/números destacados.',
          'Cubra toda a aula, na mesma ordem lógica do conteúdo, sem inventar informação.',
          'Responda apenas com o mapa em Markdown.',
          fonteInstrucao(base),
        ].join('\n')

        try {
          const r = await agentChat({
            agent: 'resumos',
            system,
            user: `Disciplina: ${body.disciplina} | Aula: ${topico}\n\nGere o mapa mental agora.`,
            userId,
            ferramenta: 'mapa',
            disciplina: body.disciplina,
            topico,
          })
          const conteudo = (r.texto || '').trim()
          if (!conteudo) return Response.json({ error: 'Não consegui montar o mapa agora.' }, { status: 502 })
          return Response.json({ conteudo, modelo: r.model, oficial: false, cache: false })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'Não consegui montar o mapa agora.' }, { status: err.status || 502 })
        }
      },
    },
  },
})
