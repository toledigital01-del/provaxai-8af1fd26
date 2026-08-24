import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requirePedagogicalAdmin, SUPABASE_URL, serviceHeaders } from '@/lib/px-server'
import { indexarEscopo } from '@/lib/rag'

/* Indexação RAG da base de conhecimento (somente admin).
   POST grava/atualiza os embeddings de um curso, disciplina ou aula;
   GET devolve quantos trechos já estão indexados por disciplina. */

const Body = z.object({
  curso: z.string().min(1).max(80),
  disciplina: z.string().max(200).optional(),
  topico: z.string().max(300).optional().nullable(),
})

export const Route = createFileRoute('/api/public/kb-embed')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied
        const curso = new URL(request.url).searchParams.get('curso') || 'prf-2021'
        const r = await fetch(
          `${SUPABASE_URL}/rest/v1/kb_chunks?select=disciplina,topico&course_slug=eq.${encodeURIComponent(curso)}&limit=10000`,
          { headers: serviceHeaders() },
        )
        const rows = r.ok ? ((await r.json()) as Array<{ disciplina: string; topico: string | null }>) : []
        const porDisciplina: Record<string, number> = {}
        ;(Array.isArray(rows) ? rows : []).forEach((x) => {
          porDisciplina[x.disciplina] = (porDisciplina[x.disciplina] || 0) + 1
        })
        return Response.json({ total: Array.isArray(rows) ? rows.length : 0, porDisciplina })
      },

      POST: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied
        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }
        try {
          const res = await indexarEscopo({ curso: body.curso, disciplina: body.disciplina, topico: body.topico })
          return Response.json({ ok: true, ...res })
        } catch (e) {
          return Response.json({ error: (e as Error).message.slice(0, 300) }, { status: 502 })
        }
      },
    },
  },
})
