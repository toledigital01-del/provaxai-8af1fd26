/* Utilitários compartilhados pelos endpoints HTTP do Prova X. */

export const SUPABASE_URL = 'https://rdokrryisfkhmevcxlws.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_9ILwlXJNPJ5ZzpALdbmfBA_gRAtH4Qr'

export function bearer(request: Request) {
  const auth = request.headers.get('authorization') || ''
  return auth.startsWith('Bearer ') ? auth.slice(7) : ''
}

/** Retorna o id do usuário autenticado ou null. */
export async function currentUser(request: Request): Promise<string | null> {
  const token = bearer(request)
  if (!token) return null
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  })
  if (!r.ok) return null
  const u = (await r.json()) as { id?: string }
  return u.id || null
}

/** Retorna uma Response de erro quando o chamador não é admin; null quando é. */
export async function requireAdmin(request: Request): Promise<Response | null> {
  const token = bearer(request)
  const userId = await currentUser(request)
  if (!userId) return Response.json({ error: 'Não autenticado.' }, { status: 401 })
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/has_role`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ _user_id: userId, _role: 'admin' }),
  })
  if (!(r.ok && (await r.json()) === true))
    return Response.json({ error: 'Acesso restrito a administradores.' }, { status: 403 })
  return null
}

/** Lê uma configuração pública da plataforma (platform_settings). */
export async function getSetting<T = unknown>(chave: string): Promise<T | null> {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/platform_settings?select=valor&chave=eq.${encodeURIComponent(chave)}&limit=1`,
      { headers: { apikey: SUPABASE_KEY } },
    )
    if (!r.ok) return null
    const rows = (await r.json()) as Array<{ valor: T }>
    return rows[0]?.valor ?? null
  } catch {
    return null
  }
}

export function aiKeys() {
  return {
    lovable: process.env['LOVABLE_API_KEY'],
    openai: process.env['OPENAI_API_KEY'],
    gemini: process.env['GEMINI_API_KEY'],
    anthropic: process.env['ANTHROPIC_API_KEY'],
  }
}
