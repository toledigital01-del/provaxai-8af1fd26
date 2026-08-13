/* Roteador de provedores de IA usado pelos endpoints do servidor.
   Nenhuma chave é lida aqui: elas chegam como argumento, sempre de dentro de um handler. */

export type Provider = 'lovable' | 'openai' | 'gemini' | 'anthropic'

export type Keys = {
  lovable?: string | undefined
  openai?: string | undefined
  gemini?: string | undefined
  anthropic?: string | undefined
}

export const MODELOS: Record<Provider, string[]> = {
  lovable: [
    'google/gemini-3-flash-preview',
    'google/gemini-3.1-pro-preview',
    'openai/gpt-5.6-sol',
    'openai/gpt-5.6-terra',
  ],
  openai: ['gpt-5.2', 'gpt-5.2-mini', 'gpt-4.1', 'gpt-4o-mini'],
  gemini: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash'],
  anthropic: ['claude-sonnet-4-5', 'claude-opus-4-1', 'claude-haiku-4-5'],
}

export const PADRAO = { provider: 'lovable' as Provider, model: 'google/gemini-3-flash-preview' }

export function normalizar(cfg: unknown): { provider: Provider; model: string; limiteDiario: number } {
  const c = (cfg || {}) as { provider?: string; model?: string; limiteDiario?: number; limite_diario?: number }
  const provider = (['lovable', 'openai', 'gemini', 'anthropic'] as string[]).includes(c.provider || '')
    ? (c.provider as Provider)
    : PADRAO.provider
  const model = MODELOS[provider].includes(c.model || '') ? (c.model as string) : MODELOS[provider][0]!
  const bruto = Number(c.limiteDiario ?? c.limite_diario ?? 0)
  const limiteDiario = Number.isFinite(bruto) && bruto > 0 ? Math.floor(bruto) : 0
  return { provider, model, limiteDiario }
}

export function keyDe(provider: Provider, keys: Keys) {
  return provider === 'lovable' ? keys.lovable : keys[provider]
}

export class AIError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// Ordem de fallback quando o provedor configurado falha (sem crédito, fora do
// ar, sem chave). Só entra em jogo quando existe uma chave salva pra ele.
const FALLBACK_ORDER: Provider[] = ['gemini', 'anthropic', 'openai', 'lovable']

/** Uma chamada de chat, com a mesma assinatura para todos os provedores.
 *  Se o provedor configurado falhar por falta de crédito/disponibilidade,
 *  tenta automaticamente o próximo provedor que tiver chave salva. */
export async function chat(opts: {
  provider: Provider
  model: string
  system: string
  user: string
  keys: Keys
  maxTokens?: number
}): Promise<string> {
  const tentar = async (provider: Provider, model: string) =>
    callProvider({ ...opts, provider, model })

  try {
    return await tentar(opts.provider, opts.model)
  } catch (e) {
    const err = e as AIError
    if (!(err instanceof AIError) || ![402, 429, 503].includes(err.status)) throw err

    for (const fallback of FALLBACK_ORDER) {
      if (fallback === opts.provider) continue
      if (!keyDe(fallback, opts.keys)) continue
      try {
        return await tentar(fallback, MODELOS[fallback][0]!)
      } catch {
        continue
      }
    }
    throw err
  }
}

async function callProvider(opts: {
  provider: Provider
  model: string
  system: string
  user: string
  keys: Keys
  maxTokens?: number
}): Promise<string> {
  const key = keyDe(opts.provider, opts.keys)
  if (!key) throw new AIError(503, 'A IA escolhida não está conectada. Configure a chave em Configurações.')

  if (opts.provider === 'anthropic') {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: opts.model,
        max_tokens: opts.maxTokens || 8000,
        system: opts.system,
        messages: [{ role: 'user', content: opts.user }],
      }),
    })
    if (!r.ok) throw new AIError(r.status === 429 ? 429 : 502, 'A IA (Anthropic) não respondeu agora.')
    const j = (await r.json()) as any
    return (j?.content || []).map((p: any) => p?.text || '').join('') || ''
  }

  if (opts.provider === 'gemini') {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(opts.model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: opts.system }] },
          contents: [{ role: 'user', parts: [{ text: opts.user }] }],
        }),
      },
    )
    if (!r.ok) throw new AIError(r.status === 429 ? 429 : 502, 'A IA (Gemini) não respondeu agora.')
    const j = (await r.json()) as any
    return (j?.candidates?.[0]?.content?.parts || []).map((p: any) => p?.text || '').join('') || ''
  }

  const url =
    opts.provider === 'openai'
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://ai.gateway.lovable.dev/v1/chat/completions'
  const payload: Record<string, unknown> = {
    model: opts.model,
    messages: [
      { role: 'system', content: opts.system },
      { role: 'user', content: opts.user },
    ],
  }
  if (opts.provider === 'lovable' && opts.model.startsWith('openai/')) payload['reasoning_effort'] = 'none'
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (r.status === 429) throw new AIError(429, 'Limite de uso da IA atingido. Tente em instantes.')
  if (r.status === 402) throw new AIError(402, 'Créditos de IA esgotados.')
  if (!r.ok) throw new AIError(502, 'A IA não respondeu agora.')
  const j = (await r.json()) as any
  return j?.choices?.[0]?.message?.content || ''
}
