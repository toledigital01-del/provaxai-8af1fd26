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

/**
 * Autorização temporária para as ferramentas pedagógicas do painel.
 *
 * O console administrativo está, por decisão do produto, operando sem login.
 * Somente rotas de criação/publicação de conteúdo devem usar este guard; ações
 * sensíveis (usuários, compras, integrações e chaves) continuam em requireAdmin.
 */
export async function requirePedagogicalAdmin(request: Request): Promise<Response | null> {
  const token = bearer(request)
  if (!token) return null
  return requireAdmin(request)
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

const NOMES = {
  lovable: 'LOVABLE_API_KEY',
  openai: 'OPENAI_API_KEY',
  gemini: 'GEMINI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  elevenlabs: 'ELEVENLABS_API_KEY',
} as const

export type KeyName = keyof typeof NOMES

/** Chaves salvas pelo administrador no painel (tabela api_keys). */
async function keysDoBanco(): Promise<Partial<Record<KeyName, string>>> {
  const service = process.env['SUPABASE_SERVICE_ROLE_KEY']
  if (!service) return {}
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/api_keys?select=chave,valor`, {
      headers: { apikey: service, Authorization: `Bearer ${service}` },
    })
    if (!r.ok) return {}
    const rows = (await r.json()) as Array<{ chave: string; valor: string }>
    const out: Partial<Record<KeyName, string>> = {}
    rows.forEach((row) => {
      const nome = (Object.keys(NOMES) as KeyName[]).find((k) => NOMES[k] === row.chave)
      if (nome && row.valor && row.valor.trim()) out[nome] = row.valor.trim()
    })
    return out
  } catch {
    return {}
  }
}

/** Chaves efetivas: o que o admin salvou no painel tem prioridade sobre o ambiente. */
export async function aiKeys() {
  const db = await keysDoBanco()
  const env = (k: KeyName) => process.env[NOMES[k]]
  return {
    lovable: db.lovable || env('lovable'),
    openai: db.openai || env('openai'),
    gemini: db.gemini || env('gemini'),
    anthropic: db.anthropic || env('anthropic'),
    elevenlabs: db.elevenlabs || env('elevenlabs'),
  }
}

/** Cabeçalhos com a chave de serviço (uso exclusivo do servidor). */
export function serviceHeaders(extra: Record<string, string> = {}) {
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY'] || ''
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra }
}

/** true quando o usuário tem compra vitalícia do curso ou assinatura ativa (ou é admin). */
export async function hasCourseAccess(userId: string, slug: string): Promise<boolean> {
  const h = serviceHeaders()
  const [acesso, assin, admin] = await Promise.all([
    fetch(
      `${SUPABASE_URL}/rest/v1/course_access?select=id,expira_em,courses!inner(slug)&user_id=eq.${userId}&courses.slug=eq.${encodeURIComponent(slug)}`,
      { headers: h },
    ).then((r) => (r.ok ? r.json() : [])),
    fetch(
      `${SUPABASE_URL}/rest/v1/subscriptions?select=status,current_period_end&user_id=eq.${userId}&status=in.(active,trialing)`,
      { headers: h },
    ).then((r) => (r.ok ? r.json() : [])),
    fetch(`${SUPABASE_URL}/rest/v1/user_roles?select=role&user_id=eq.${userId}&role=eq.admin`, {
      headers: h,
    }).then((r) => (r.ok ? r.json() : [])),
  ])
  const agora = Date.now()
  const vivo = (d: string | null) => !d || new Date(d).getTime() > agora
  return (
    (Array.isArray(admin) && admin.length > 0) ||
    (Array.isArray(acesso) && acesso.some((a: { expira_em: string | null }) => vivo(a.expira_em))) ||
    (Array.isArray(assin) && assin.some((s: { current_period_end: string | null }) => vivo(s.current_period_end)))
  )
}

/** Quantas chamadas o aluno já fez hoje em determinada ferramenta. */
export async function usosHoje(userId: string, ferramenta: string): Promise<number> {
  const inicio = new Date()
  inicio.setUTCHours(0, 0, 0, 0)
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/ai_logs?select=id&user_id=eq.${userId}&ferramenta=eq.${encodeURIComponent(ferramenta)}&created_at=gte.${inicio.toISOString()}`,
    { headers: serviceHeaders({ Prefer: 'count=exact' }) },
  )
  if (!r.ok) return 0
  const rows = (await r.json()) as unknown[]
  return Array.isArray(rows) ? rows.length : 0
}

/** Registra o uso de IA para acompanhamento de consumo. */
export async function registrarUsoIA(reg: {
  user_id: string
  ferramenta: string
  modelo?: string
  agent_slug?: string
  provider?: string
  discipline_nome?: string | null
  topic_nome?: string | null
  pergunta?: string
  resposta?: string
  tokens_entrada?: number
  tokens_saida?: number
  duracao_ms?: number
  sucesso?: boolean
}) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/ai_logs`, {
      method: 'POST',
      headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify({
        ...reg,
        pergunta: (reg.pergunta || '').slice(0, 4000),
        resposta: (reg.resposta || '').slice(0, 8000),
      }),
    })
  } catch {
    /* log é best-effort */
  }
}
