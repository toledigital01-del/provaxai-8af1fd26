import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SUPABASE_URL, currentUser, requireAdmin, serviceHeaders } from '@/lib/px-server'

const Body = z.object({ user_id: z.string().uuid() })

export const Route = createFileRoute('/api/public/admin-delete-user')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await requireAdmin(request)
        if (denied) return denied

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const admin = await currentUser(request)
        if (admin === body.user_id)
          return Response.json({ error: 'Você não pode excluir a sua própria conta por aqui.' }, { status: 400 })

        if (!process.env['SUPABASE_SERVICE_ROLE_KEY'])
          return Response.json({ error: 'Exclusão indisponível: chave de serviço ausente.' }, { status: 500 })

        const alvo = await fetch(`${SUPABASE_URL}/rest/v1/user_roles?select=role&user_id=eq.${body.user_id}&role=eq.admin`, {
          headers: serviceHeaders(),
        })
        const ehAdmin = alvo.ok && ((await alvo.json()) as unknown[]).length > 0
        if (ehAdmin)
          return Response.json(
            { error: 'Este aluno é administrador. Remova o papel de admin antes de excluir.' },
            { status: 400 },
          )

        // Solta referências que não caem em cascata antes de remover a conta.
        await fetch(`${SUPABASE_URL}/rest/v1/api_keys?updated_by=eq.${body.user_id}`, {
          method: 'PATCH',
          headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
          body: JSON.stringify({ updated_by: null }),
        }).catch(() => {})

        // Apaga a conta de autenticação; as tabelas do app caem em cascata (ON DELETE CASCADE).

        const r = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${body.user_id}`, {
          method: 'DELETE',
          headers: serviceHeaders({ 'Content-Type': 'application/json' }),
        })
        if (!r.ok) {
          const txt = await r.text().catch(() => '')
          return Response.json({ error: 'Não consegui excluir esta conta. ' + txt.slice(0, 200) }, { status: 502 })
        }

        await fetch(`${SUPABASE_URL}/rest/v1/admin_logs`, {
          method: 'POST',
          headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
          body: JSON.stringify({ admin_id: admin, acao: 'excluir_aluno', alvo_tipo: 'profile', alvo_id: body.user_id, detalhes: {} }),
        }).catch(() => {})

        return Response.json({ ok: true })
      },
    },
  },
})
