/* Roteador central de IA: cada função da plataforma (agente) tem seu provedor,
   modelo, fallback e prompt complementar guardados em ai_agent_settings.
   Nenhuma chave é lida aqui — as chaves chegam via aiKeys() dentro do handler. */
import { SUPABASE_URL, serviceHeaders, getSetting, aiKeys, registrarUsoIA } from './px-server'
import { chatEx, normalizar, MODELOS, type Provider, type Keys } from './ai-gateway'

export type AgentSlug =
  | 'athena'
  | 'geracao_aulas'
  | 'geracao_questoes'
  | 'revisao'
  | 'resumos'
  | 'flashcards'
  | 'assistente_admin'
  | 'analise_desempenho'
  | 'tarefas_simples'

export const AGENTES: Array<{ slug: AgentSlug; nome: string; descricao: string; grupo: 'aluno' | 'admin' }> = [
  { slug: 'athena', nome: 'Athena', descricao: 'Professora virtual que conversa com os alunos', grupo: 'aluno' },
  { slug: 'geracao_aulas', nome: 'Geração de aulas', descricao: 'Aulas completas, roteiros de podcast e base da Athena', grupo: 'aluno' },
  { slug: 'geracao_questoes', nome: 'Geração de questões', descricao: 'Questões certo/errado e preencher espaços', grupo: 'aluno' },
  { slug: 'revisao', nome: 'Revisão inteligente', descricao: 'Revisões, pegadinhas de prova e correção de redação', grupo: 'aluno' },
  { slug: 'resumos', nome: 'Resumos', descricao: 'Resumo inteligente e pontos-chave', grupo: 'aluno' },
  { slug: 'flashcards', nome: 'Flashcards', descricao: 'Cartões de memorização', grupo: 'aluno' },
  { slug: 'assistente_admin', nome: 'Assistente administrativo', descricao: 'Copiloto do painel e montagem de cursos', grupo: 'admin' },
  { slug: 'analise_desempenho', nome: 'Análise de desempenho', descricao: 'Leituras sobre o progresso dos alunos', grupo: 'admin' },
  { slug: 'tarefas_simples', nome: 'Tarefas simples', descricao: 'Classificações, títulos e chamadas curtas de baixo custo', grupo: 'admin' },
]

export type Rota = {
  provider: Provider
  model: string
  fallbackProvider?: Provider | undefined
  fallbackModel?: string | undefined
  fallbackAtivo: boolean
  promptExtra: string
  limiteDiario: number
}

const PADRAO_AGENTE: Rota = {
  provider: 'anthropic',
  model: 'claude-sonnet-4-5',
  fallbackProvider: 'lovable',
  fallbackModel: 'google/gemini-3-flash-preview',
  fallbackAtivo: true,
  promptExtra: '',
  limiteDiario: 0,
}

/* Configurações antigas (platform_settings) que continuam valendo como
   fallback caso a rota do agente ainda não exista no banco. */
const LEGADO: Partial<Record<AgentSlug, string>> = {
  athena: 'ia_athena',
  assistente_admin: 'ia_sistema',
  tarefas_simples: 'ia_sistema',
}

const PROVEDORES = ['lovable', 'openai', 'gemini', 'anthropic'] as const

function provedorValido(p: unknown): p is Provider {
  return (PROVEDORES as readonly string[]).includes(String(p))
}

function modeloDaRota(row: { provider?: string; model?: string; custom_model?: string | null }): string {
  const custom = (row.custom_model || '').trim()
  if (custom) return custom
  const catalogo = MODELOS[(row.provider || '') as Provider] || []
  return catalogo.includes(row.model || '') ? (row.model as string) : (catalogo[0] ?? PADRAO_AGENTE.model)
}

function rotaDeLinha(row: {
  provider?: string
  model?: string
  custom_model?: string | null
  fallback_provider?: string | null
  fallback_model?: string | null
  fallback_ativo?: boolean
  prompt_extra?: string | null
  limite_diario?: number
  [k: string]: unknown
}): Rota {
  const provider = provedorValido(row.provider) ? row.provider : PADRAO_AGENTE.provider
  return {
    provider,
    model: modeloDaRota({ ...row, provider }),
    fallbackProvider: provedorValido(row.fallback_provider) ? row.fallback_provider : undefined,
    fallbackModel: (row.fallback_model || '').trim() || undefined,
    fallbackAtivo: row.fallback_ativo !== false,
    promptExtra: (row.prompt_extra || '').trim(),
    limiteDiario: Number(row.limite_diario) > 0 ? Math.floor(Number(row.limite_diario)) : 0,
  }
}

/** Todas as rotas de uma vez (uma consulta só) — usado por pacotes com vários agentes. */
export async function rotasGerais(): Promise<Record<string, Rota>> {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/ai_agent_settings?select=*`, { headers: serviceHeaders() })
    if (r.ok) {
      const rows = (await r.json()) as Array<Record<string, unknown> & { agent_slug: string }>
      if (Array.isArray(rows) && rows.length) {
        const mapa: Record<string, Rota> = {}
        rows.forEach((row) => {
          mapa[row.agent_slug] = rotaDeLinha(row)
        })
        return mapa
      }
    }
  } catch {
    /* cai no legado/default */
  }
  return {}
}

/** Rota efetiva de um agente: banco → configuração antiga → padrão. */
export async function rotaDoAgente(agent: AgentSlug): Promise<Rota> {
  const todas = await rotasGerais()
  if (todas[agent]) return todas[agent]!
  const chave = LEGADO[agent]
  if (chave) {
    const c = normalizar(await getSetting(chave))
    return { ...PADRAO_AGENTE, provider: c.provider, model: c.model, limiteDiario: c.limiteDiario }
  }
  return PADRAO_AGENTE
}

/** Chamada de chat já roteada pelo agente, com prompt complementar,
 *  fallback configurado e registro de uso (tokens, duração, sucesso). */
export async function agentChat(opts: {
  agent: AgentSlug
  system: string
  user: string
  maxTokens?: number
  userId?: string | null
  ferramenta?: string
  disciplina?: string | null
  topico?: string | null
  /** Sobrescreve a rota (ex.: admin escolheu um modelo pontualmente na tela). */
  override?: { provider: Provider; model: string }
  keys?: Keys
}): Promise<{ texto: string; provider: Provider; model: string }> {
  const rota = opts.override
    ? { ...PADRAO_AGENTE, provider: opts.override.provider, model: opts.override.model }
    : await rotaDoAgente(opts.agent)
  const keys = opts.keys || (await aiKeys())
  const system = rota.promptExtra ? `${opts.system}\n\n${rota.promptExtra}` : opts.system
  const t0 = Date.now()
  const ferramenta = opts.ferramenta || opts.agent
  try {
    const r = await chatEx({
      provider: rota.provider,
      model: rota.model,
      system,
      user: opts.user,
      keys,
      maxTokens: opts.maxTokens,
      fallbackPrimeiro:
        rota.fallbackAtivo && rota.fallbackProvider
          ? { provider: rota.fallbackProvider, model: rota.fallbackModel || MODELOS[rota.fallbackProvider][0]! }
          : undefined,
    })
    if (opts.userId)
      await registrarUsoIA({
        user_id: opts.userId,
        ferramenta,
        modelo: r.model,
        agent_slug: opts.agent,
        provider: r.provider,
        discipline_nome: opts.disciplina ?? null,
        topic_nome: opts.topico ?? null,
        pergunta: opts.user,
        resposta: r.texto,
        tokens_entrada: r.usage.entrada,
        tokens_saida: r.usage.saida,
        duracao_ms: Date.now() - t0,
        sucesso: true,
      })
    return { texto: r.texto, provider: r.provider, model: r.model }
  } catch (e) {
    if (opts.userId)
      await registrarUsoIA({
        user_id: opts.userId,
        ferramenta,
        agent_slug: opts.agent,
        provider: rota.provider,
        modelo: rota.model,
        discipline_nome: opts.disciplina ?? null,
        topic_nome: opts.topico ?? null,
        pergunta: opts.user,
        resposta: (e as Error).message || 'erro',
        duracao_ms: Date.now() - t0,
        sucesso: false,
      })
    throw e
  }
}

/* Mapeia cada módulo do Pacote de Conteúdo Inteligente para o agente dono. */
export const AGENTE_DO_MODULO: Record<string, AgentSlug> = {
  aula: 'geracao_aulas',
  podcast: 'geracao_aulas',
  athena_knowledge: 'geracao_aulas',
  summary: 'resumos',
  key_points: 'resumos',
  review: 'revisao',
  traps: 'revisao',
  questions: 'geracao_questoes',
  lacunas: 'geracao_questoes',
  flashcards: 'flashcards',
}

/** Rotas por módulo do pacote de aula, resolvidas numa única consulta. */
export async function rotasPacote(): Promise<Record<string, { provider: Provider; model: string }>> {
  const todas = await rotasGerais()
  const out: Record<string, { provider: Provider; model: string }> = {}
  for (const [modulo, agent] of Object.entries(AGENTE_DO_MODULO)) {
    const r = todas[agent]
    if (r) out[modulo] = { provider: r.provider, model: r.model }
  }
  return out
}
