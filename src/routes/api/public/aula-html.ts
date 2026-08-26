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

function temConteudoVisivel(html: string) {
  const semBlocosTecnicos = html
    .replace(/<style\b[^>]*>[\s\S]*?(?:<\/style>|$)/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?(?:<\/script>|$)/gi, '')
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<(?:meta|link)\b[^>]*>/gi, '')
  return semBlocosTecnicos.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').trim().length >= 20
}

/* Garante que o tópico exista na grade do aluno — sem isso a aula fica órfã:
   salva no banco, mas sem lugar na navegação do curso. */
async function garantirTopico(curso: string, disciplina: string, topico: string) {
  const cur = await fetch(
    `${SUPABASE_URL}/rest/v1/courses?select=id&slug=${eq(curso)}&limit=1`,
    { headers: serviceHeaders() },
  )
  const cursos = cur.ok ? ((await cur.json()) as Array<{ id: string }>) : []
  if (!cursos.length) return
  const dis = await fetch(
    `${SUPABASE_URL}/rest/v1/disciplines?select=id&course_id=${eq(cursos[0]!.id)}&nome=${eq(disciplina)}&limit=1`,
    { headers: serviceHeaders() },
  )
  const discs = dis.ok ? ((await dis.json()) as Array<{ id: string }>) : []
  if (!discs.length) return
  const discId = discs[0]!.id
  const tp = await fetch(
    `${SUPABASE_URL}/rest/v1/topics?select=id,ordem&discipline_id=${eq(discId)}`,
    { headers: serviceHeaders() },
  )
  const tops = tp.ok ? ((await tp.json()) as Array<{ id: string; ordem: number }>) : []
  const jaExiste = await fetch(
    `${SUPABASE_URL}/rest/v1/topics?select=id&discipline_id=${eq(discId)}&nome=${eq(topico)}&limit=1`,
    { headers: serviceHeaders() },
  )
  const achou = jaExiste.ok ? ((await jaExiste.json()) as Array<{ id: string }>) : []
  if (achou.length) return
  const ordem = tops.reduce((m, t) => Math.max(m, typeof t.ordem === 'number' ? t.ordem : 0), -1) + 1
  await fetch(`${SUPABASE_URL}/rest/v1/topics`, {
    method: 'POST',
    headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({ discipline_id: discId, nome: topico, ordem }),
  })
}

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

        if (!temConteudoVisivel(body.html)) {
          return Response.json(
            { error: 'O arquivo contém apenas estilos ou scripts, sem o conteúdo visível da aula. Envie o HTML completo, incluindo o conteúdo da página.' },
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

        await garantirTopico(curso, body.disciplina, body.topico)

        return Response.json({ ok: true, formato: 'html', tamanho: body.html.length })
      },
    },
  },
})
