import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requirePedagogicalAdmin, SUPABASE_URL, serviceHeaders } from '@/lib/px-server'

/* Limites do RAG da Athena por curso/disciplina (somente admin).
   GET ?curso=slug  -> lista as regras do curso
   POST             -> cria/atualiza a regra do escopo (disciplina null = padrão do curso)
   DELETE           -> remove a regra (o escopo volta ao padrão da plataforma) */

const Upsert = z.object({
  curso: z.string().min(1).max(80),
  disciplina: z.string().max(200).optional().nullable(),
  max_chars: z.number().int().min(2000).max(60000),
  top_k: z.number().int().min(1).max(30),
  threshold: z.number().min(0).max(0.95),
})

export const Route = createFileRoute('/api/public/rag-settings')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied
        const curso = new URL(request.url).searchParams.get('curso') || 'prf-2021'
        const r = await fetch(
          `${SUPABASE_URL}/rest/v1/rag_settings?select=id,disciplina,max_chars,top_k,threshold,updated_at&course_slug=eq.${encodeURIComponent(curso)}&order=disciplina.asc`,
          { headers: serviceHeaders() },
        )
        const rows = r.ok ? await r.json() : []
        return Response.json({ regras: Array.isArray(rows) ? rows : [] })
      },

      POST: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied
        let body: z.infer<typeof Upsert>
        try {
          body = Upsert.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida. Verifique os limites (contexto 2.000–60.000, trechos 1–30, similaridade 0–0,95).' }, { status: 400 })
        }
        const r = await fetch(`${SUPABASE_URL}/rest/v1/rag_settings`, {
          method: 'POST',
          headers: serviceHeaders({
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=representation',
          }),
          body: JSON.stringify({
            course_slug: body.curso,
            disciplina: body.disciplina || null,
            max_chars: body.max_chars,
            top_k: body.top_k,
            threshold: body.threshold,
          }),
        })
        if (!r.ok) return Response.json({ error: 'Falha ao salvar: ' + (await r.text()).slice(0, 200) }, { status: 502 })
        const rows = (await r.json()) as unknown[]
        return Response.json({ ok: true, regra: Array.isArray(rows) ? rows[0] : null })
      },

      DELETE: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied
        const id = new URL(request.url).searchParams.get('id')
        if (!id) return Response.json({ error: 'Informe o id da regra.' }, { status: 400 })
        const r = await fetch(`${SUPABASE_URL}/rest/v1/rag_settings?id=eq.${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: serviceHeaders(),
        })
        if (!r.ok) return Response.json({ error: 'Falha ao excluir.' }, { status: 502 })
        return Response.json({ ok: true })
      },
    },
  },
})
