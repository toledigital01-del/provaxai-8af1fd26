import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requireAdmin, serviceHeaders, SUPABASE_URL } from '@/lib/px-server'

/* Teste rápido de uma chave de integração: faz a chamada mais barata possível
   (listar modelos ou uma completude mínima) e devolve ok/erro em português. */

const Body = z.object({ env: z.string().min(2).max(80) })

async function valorDaChave(env: string): Promise<string> {
  const fromEnv = process.env[env]
  if (fromEnv && fromEnv.trim()) return fromEnv.trim()
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/api_keys?select=valor&chave=eq.${encodeURIComponent(env)}&limit=1`,
      { headers: serviceHeaders() },
    )
    if (!r.ok) return ''
    const rows = (await r.json()) as Array<{ valor: string }>
    return (rows[0]?.valor || '').trim()
  } catch {
    return ''
  }
}

async function testar(env: string, key: string): Promise<{ ok: boolean; detalhe: string }> {
  const curto = async (r: Response) => (await r.text()).slice(0, 200)

  if (env === 'OPENAI_API_KEY') {
    const r = await fetch('https://api.openai.com/v1/models?limit=1', {
      headers: { Authorization: `Bearer ${key}` },
    })
    return r.ok ? { ok: true, detalhe: 'chave válida' } : { ok: false, detalhe: await curto(r) }
  }

  if (env === 'GEMINI_API_KEY') {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: { 'x-goog-api-key': key },
    })
    return r.ok ? { ok: true, detalhe: 'chave válida' } : { ok: false, detalhe: await curto(r) }
  }

  if (env === 'ANTHROPIC_API_KEY') {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 1, messages: [{ role: 'user', content: 'oi' }] }),
    })
    return r.ok ? { ok: true, detalhe: 'chave válida' } : { ok: false, detalhe: await curto(r) }
  }

  if (env === 'ELEVENLABS_API_KEY') {
    const r = await fetch('https://api.elevenlabs.io/v1/user', { headers: { 'xi-api-key': key } })
    return r.ok ? { ok: true, detalhe: 'chave válida' } : { ok: false, detalhe: await curto(r) }
  }

  if (env === 'LOVABLE_API_KEY') {
    const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'oi' }],
      }),
    })
    return r.ok ? { ok: true, detalhe: 'chave válida' } : { ok: false, detalhe: await curto(r) }
  }

  if (env.startsWith('GOOGLE_DRIVE_API_KEY')) {
    const lovable = await valorDaChave('LOVABLE_API_KEY')
    if (!lovable) return { ok: false, detalhe: 'a IA inclusa (LOVABLE_API_KEY) precisa estar configurada para testar o Drive' }
    const r = await fetch('https://connector-gateway.lovable.dev/google_drive/drive/v3/files?pageSize=1', {
      headers: { Authorization: `Bearer ${lovable}`, 'X-Connection-Api-Key': key },
    })
    return r.ok ? { ok: true, detalhe: 'Drive acessível' } : { ok: false, detalhe: await curto(r) }
  }

  return { ok: false, detalhe: 'não há teste automático para esta integração; a chave está salva.' }
}

export const Route = createFileRoute('/api/public/ai-test')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await requireAdmin(request)
        if (denied) return denied

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ ok: false, detalhe: 'Requisição inválida.' }, { status: 400 })
        }

        const key = await valorDaChave(body.env)
        if (!key) return Response.json({ ok: false, detalhe: 'Nenhuma chave salva para esta integração.' })

        try {
          const res = await testar(body.env, key)
          return Response.json(res)
        } catch (e) {
          return Response.json({ ok: false, detalhe: (e as Error).message.slice(0, 200) })
        }
      },
    },
  },
})
