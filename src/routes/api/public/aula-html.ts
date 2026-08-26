import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requirePedagogicalAdmin, serviceHeaders, SUPABASE_URL } from '@/lib/px-server'

/* Aula escrita fora do app como página HTML pronta (CSS e interatividade próprios).
   Grava direto em `aulas_ia` com formato='html' — não passa pela geração de IA. */

const Body = z.object({
  curso: z.string().max(80).optional(),
  disciplina: z.string().min(1).max(200),
  topico: z.string().min(1).max(300),
  html: z.string().min(200).max(2_000_000),
})

const eq = (v: string) => `eq.${encodeURIComponent(v)}`

export const Route = createFileRoute('/api/public/aula-html')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const bloqueio = await requirePedagogicalAdmin(request)
        if (bloqueio) return bloqueio

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json(
            { error: 'Cole o HTML completo da aula (mínimo 200 caracteres, máximo 2 MB).' },
            { status: 400 },
          )
        }

        const curso = body.curso || 'prf-2021'
        const filtro =
          `course_slug=${eq(curso)}&disciplina=${eq(body.disciplina)}&topico=${eq(body.topico)}&user_id=is.null`

        const del = await fetch(`${SUPABASE_URL}/rest/v1/aulas_ia?${filtro}`, {
          method: 'DELETE',
          headers: serviceHeaders({ Prefer: 'return=minimal' }),
        })
        if (!del.ok)
          return Response.json({ error: 'Não consegui substituir a aula anterior.' }, { status: 502 })

        const post = await fetch(`${SUPABASE_URL}/rest/v1/aulas_ia`, {
          method: 'POST',
          headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
          body: JSON.stringify({
            course_slug: curso,
            disciplina: body.disciplina,
            topico: body.topico,
            user_id: null,
            titulo: body.topico,
            conteudo: body.html,
            formato: 'html',
            modelo: null,
          }),
        })
        if (!post.ok)
          return Response.json(
            { error: 'Não consegui salvar a aula em HTML: ' + (await post.text().catch(() => '')) },
            { status: 502 },
          )

        return Response.json({ ok: true, formato: 'html', tamanho: body.html.length })
      },
    },
  },
})
