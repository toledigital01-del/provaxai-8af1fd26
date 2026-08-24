import { createFileRoute } from '@tanstack/react-router'
import { SUPABASE_URL, serviceHeaders, requirePedagogicalAdmin } from '@/lib/px-server'

/* Gestão das chaves de integração de IA (tabela api_keys).
   O console administrativo opera sem login; por isso a gravação passa por aqui,
   usando a chave de serviço, em vez de bater direto no PostgREST com a anon. */

function mascara(v: string) {
  const s = (v || '').trim()
  if (s.length <= 8) return '••••'
  return `${s.slice(0, 4)}••••${s.slice(-4)}`
}

export const Route = createFileRoute('/api/public/ai-keys')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied
        const r = await fetch(`${SUPABASE_URL}/rest/v1/api_keys?select=chave,valor,updated_at`, {
          headers: serviceHeaders(),
        })
        if (!r.ok) return Response.json({ error: 'Não consegui ler as chaves.' }, { status: 502 })
        const rows = (await r.json()) as Array<{ chave: string; valor: string; updated_at: string }>
        return Response.json({
          chaves: rows.map((k) => ({ chave: k.chave, mask: mascara(k.valor), updated_at: k.updated_at })),
        })
      },
      POST: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied
        const body = (await request.json().catch(() => ({}))) as {
          acao?: string
          chave?: string
          valor?: string
        }
        const chave = (body.chave || '').trim()
        if (!chave) return Response.json({ error: 'Informe o nome da variável.' }, { status: 400 })

        if (body.acao === 'remover') {
          const r = await fetch(`${SUPABASE_URL}/rest/v1/api_keys?chave=eq.${encodeURIComponent(chave)}`, {
            method: 'DELETE',
            headers: serviceHeaders({ Prefer: 'return=minimal' }),
          })
          if (!r.ok) return Response.json({ error: 'Não consegui remover a chave.' }, { status: 502 })
          return Response.json({ ok: true })
        }

        const valor = (body.valor || '').trim()
        if (!valor) return Response.json({ error: 'Cole a chave antes de salvar.' }, { status: 400 })
        const r = await fetch(`${SUPABASE_URL}/rest/v1/api_keys?on_conflict=chave`, {
          method: 'POST',
          headers: serviceHeaders({
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=minimal',
          }),
          body: JSON.stringify({ chave, valor, updated_at: new Date().toISOString() }),
        })
        if (!r.ok) {
          const detalhe = await r.text().catch(() => '')
          return Response.json({ error: `Não consegui salvar a chave. ${detalhe}`.trim() }, { status: 502 })
        }
        return Response.json({ ok: true, mask: mascara(valor) })
      },
    },
  },
})
