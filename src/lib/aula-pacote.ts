/* Pacote de Conteúdo Inteligente da aula.
   Cada aula tem módulos gerados por IA (resumo, revisão, questões, flashcards,
   lacunas, pontos-chave, pegadinhas, podcast e base da Athena), todos com
   histórico de versões na tabela `aula_conteudos`. O administrador gera,
   revisa, edita, acrescenta, melhora, regenera e publica; o aluno só consome
   o que estiver publicado (a publicação copia o conteúdo para os depósitos
   que a tela do aluno já lê: aulas_ia, aula_recursos, questions, flashcards
   e podcasts_ia). */
import { SUPABASE_URL, serviceHeaders } from './px-server'
import { materialIntegral } from './kb-context'
import { salvarRecurso } from './aula-recursos'
import { chat, type Provider, type Keys } from './ai-gateway'
import { doutrina } from './doutrina'

export const MODULOS = [
  { tipo: 'aula', rotulo: 'Aula com Athena IA', formato: 'md' },
  { tipo: 'summary', rotulo: 'Resumo inteligente', formato: 'md' },
  { tipo: 'review', rotulo: 'Revisão inteligente', formato: 'md' },
  { tipo: 'questions', rotulo: 'Questões', formato: 'json' },
  { tipo: 'flashcards', rotulo: 'Flashcards', formato: 'json' },
  { tipo: 'lacunas', rotulo: 'Preencher espaços', formato: 'json' },
  { tipo: 'key_points', rotulo: 'Pontos-chave', formato: 'md' },
  { tipo: 'traps', rotulo: 'Pegadinhas de prova', formato: 'md' },
  { tipo: 'podcast', rotulo: 'Podcast', formato: 'json' },
  { tipo: 'mapa_mental', rotulo: 'Mapa mental', formato: 'md' },
  { tipo: 'metadados', rotulo: 'Metadados pedagógicos', formato: 'json' },
  { tipo: 'athena_knowledge', rotulo: 'Base de conhecimento da Athena', formato: 'md' },
] as const

export type TipoModulo = (typeof MODULOS)[number]['tipo']
export const TIPOS = MODULOS.map((m) => m.tipo) as TipoModulo[]

const eq = (v: string) => `eq.${encodeURIComponent(v)}`

export function filtroAula(curso: string, disciplina: string, topico: string, tipo?: string) {
  return (
    `course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&topico=${eq(topico)}` +
    (tipo ? `&tipo=${eq(tipo)}` : '')
  )
}

export type Versao = {
  id: string
  tipo: string
  conteudo: string
  meta: Record<string, unknown>
  versao: number
  origem: string
  publicado: boolean
  instrucao: string | null
  created_at: string
  updated_at: string
}

/* Questões REAIS extraídas de apostilas pelo administrador (origem='real').
   Elas têm prioridade sobre itens inéditos gerados pela IA e nunca são
   apagadas por gerações/publicações de IA. */
export type QuestaoReal = {
  enunciado: string
  gabarito: string
  comentario: string | null
  banca: string | null
  orgao: string | null
  cargo: string | null
  ano: number | null
  nivel: string | null
}

export async function questoesReais(curso: string, disciplina: string, topico: string): Promise<QuestaoReal[]> {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/questions?course_slug=${eq(curso)}&discipline_nome=${eq(disciplina)}&topic_nome=${eq(topico)}&origem=eq.real&ativa=is.true&select=enunciado,gabarito,comentario,banca,orgao,cargo,ano,nivel&order=ano.desc.nullslast&limit=60`,
      { headers: serviceHeaders() },
    )
    if (!r.ok) return []
    return (await r.json()) as QuestaoReal[]
  } catch {
    return []
  }
}

/* ---------- leitura de versões ---------- */

export async function versoes(curso: string, disciplina: string, topico: string, tipo?: string): Promise<Versao[]> {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/aula_conteudos?${filtroAula(curso, disciplina, topico, tipo)}&order=tipo.asc,versao.desc`,
    { headers: serviceHeaders() },
  )
  if (!r.ok) return []
  const rows = (await r.json()) as Versao[]
  return Array.isArray(rows) ? rows : []
}

export async function proximaVersao(curso: string, disciplina: string, topico: string, tipo: string) {
  const rows = await versoes(curso, disciplina, topico, tipo)
  return rows.reduce((max, v) => Math.max(max, v.versao || 0), 0) + 1
}

export async function salvarVersao(opts: {
  curso: string
  disciplina: string
  topico: string
  tipo: TipoModulo | 'config'
  conteudo: string
  meta?: Record<string, unknown>
  origem?: string
  publicado?: boolean
  instrucao?: string | null
  userId?: string | null
}) {
  const versao = opts.tipo === 'config' ? 1 : await proximaVersao(opts.curso, opts.disciplina, opts.topico, opts.tipo)
  if (opts.tipo === 'config') {
    // configuração é uma linha só por aula (sempre versão 1)
    await fetch(`${SUPABASE_URL}/rest/v1/aula_conteudos?${filtroAula(opts.curso, opts.disciplina, opts.topico, 'config')}`, {
      method: 'DELETE',
      headers: serviceHeaders({ Prefer: 'return=minimal' }),
    }).catch(() => null)
  }
  if (opts.publicado) {
    await fetch(
      `${SUPABASE_URL}/rest/v1/aula_conteudos?${filtroAula(opts.curso, opts.disciplina, opts.topico, opts.tipo)}`,
      {
        method: 'PATCH',
        headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify({ publicado: false }),
      },
    ).catch(() => null)
  }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/aula_conteudos`, {
    method: 'POST',
    headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
    body: JSON.stringify({
      course_slug: opts.curso,
      disciplina: opts.disciplina,
      topico: opts.topico,
      tipo: opts.tipo,
      conteudo: opts.conteudo,
      meta: opts.meta || {},
      versao,
      origem: opts.origem || 'ia',
      publicado: !!opts.publicado,
      instrucao: opts.instrucao || null,
      criado_por: opts.userId || null,
    }),
  })
  if (!r.ok) return null
  const rows = (await r.json()) as Versao[]
  return rows[0] || null
}

/* ---------- publicação: copia para os depósitos que o aluno lê ---------- */

function parseJson<T>(txt: string): T | null {
  try {
    return JSON.parse(txt) as T
  } catch {
    const bruto = String(txt || '').trim().replace(/^```(?:json)?/i, '').replace(/```\s*$/, '').trim()
    const ini = bruto.indexOf('[')
    const fim = bruto.lastIndexOf(']')
    if (ini < 0 || fim <= ini) return null
    try {
      return JSON.parse(bruto.slice(ini, fim + 1)) as T
    } catch {
      return null
    }
  }
}

async function delRest(path: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'DELETE',
    headers: serviceHeaders({ Prefer: 'return=minimal' }),
  }).catch(() => null)
}

async function postRest(tabela: string, linhas: unknown | unknown[]) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
    method: 'POST',
    headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify(linhas),
  })
  return r.ok
}

async function atualizarOuInserirRest(tabela: string, filtro: string, linha: Record<string, unknown>) {
  const patch = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?${filtro}`, {
    method: 'PATCH',
    headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
    body: JSON.stringify({ ...linha, updated_at: new Date().toISOString() }),
  })
  if (!patch.ok) {
    console.error(`[publicarVersao] PATCH em ${tabela} falhou:`, patch.status, await patch.text().catch(() => ''))
    return false
  }
  const atualizadas = (await patch.json().catch(() => [])) as unknown[]
  if (atualizadas.length > 0) return true

  const post = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
    method: 'POST',
    headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify(linha),
  })
  if (!post.ok) {
    console.error(`[publicarVersao] POST em ${tabela} falhou:`, post.status, await post.text().catch(() => ''))
    return false
  }
  return true
}

/** Marca a versão como publicada no histórico (só chamada após a cópia dar certo). */
async function marcarPublicada(v: Versao & { course_slug: string; disciplina: string; topico: string }) {
  const { course_slug: curso, disciplina, topico, tipo } = v
  // só uma versão publicada por módulo
  await fetch(`${SUPABASE_URL}/rest/v1/aula_conteudos?${filtroAula(curso, disciplina, topico, tipo)}`, {
    method: 'PATCH',
    headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({ publicado: false }),
  }).catch(() => null)
  await fetch(`${SUPABASE_URL}/rest/v1/aula_conteudos?id=${eq(v.id)}`, {
    method: 'PATCH',
    headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({ publicado: true }),
  }).catch(() => null)
}

/** Publica a versão: copia para onde o aluno lê e, só se a cópia der certo,
    marca como publicada. Insere o novo conteúdo ANTES de apagar o antigo,
    para nunca ficar sem versão no ar se o POST falhar. */
export async function publicarVersao(v: Versao & { course_slug: string; disciplina: string; topico: string }) {
  const { course_slug: curso, disciplina, topico, tipo } = v

  const finalizar = async (ok: boolean) => {
    if (ok) await marcarPublicada(v)
    return ok
  }

  if (tipo === 'aula') {
    const filtro = `course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&topico=${eq(topico)}&user_id=is.null`
    const ok = await atualizarOuInserirRest('aulas_ia', filtro, {
      course_slug: curso,
      disciplina,
      topico,
      user_id: null,
      titulo: topico,
      conteudo: v.conteudo,
      modelo: (v.meta?.['modelo'] as string) || null,
    })
    if (!ok) return false
    return finalizar(true)
  }
  if (tipo === 'summary')
    return finalizar(await salvarRecurso(curso, disciplina, topico, 'resumo', { resumo: v.conteudo, fontes: 0 }, (v.meta?.['modelo'] as string) || null))
  if (tipo === 'review')
    return finalizar(await salvarRecurso(curso, disciplina, topico, 'revisao', { conteudo: v.conteudo }, (v.meta?.['modelo'] as string) || null))
  if (tipo === 'key_points')
    return finalizar(await salvarRecurso(curso, disciplina, topico, 'pontos', { conteudo: v.conteudo }, (v.meta?.['modelo'] as string) || null))
  if (tipo === 'traps')
    return finalizar(await salvarRecurso(curso, disciplina, topico, 'pegadinhas', { conteudo: v.conteudo }, (v.meta?.['modelo'] as string) || null))
  if (tipo === 'mapa_mental')
    return finalizar(await salvarRecurso(curso, disciplina, topico, 'mapa_mental', { conteudo: v.conteudo }, (v.meta?.['modelo'] as string) || null))
  if (tipo === 'metadados') {
    const itens = parseJson<unknown[]>(v.conteudo)
    if (!Array.isArray(itens) || !itens.length) return false
    return finalizar(await salvarRecurso(curso, disciplina, topico, 'metadados', { dados: itens[0] }, (v.meta?.['modelo'] as string) || null))
  }
  if (tipo === 'athena_knowledge')
    return finalizar(await salvarRecurso(curso, disciplina, topico, 'athena', { conteudo: v.conteudo }, (v.meta?.['modelo'] as string) || null))
  if (tipo === 'lacunas') {
    const frases = parseJson<unknown[]>(v.conteudo)
    if (!Array.isArray(frases)) return false
    return finalizar(await salvarRecurso(curso, disciplina, topico, 'lacunas', { frases }, (v.meta?.['modelo'] as string) || null))
  }
  if (tipo === 'podcast') {
    const roteiro = parseJson<unknown[]>(v.conteudo)
    if (!Array.isArray(roteiro) || !roteiro.length) return false
    const filtro = `course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&topico=${eq(topico)}&user_id=is.null`
    const antes = new Date().toISOString()
    const ok = await postRest('podcasts_ia', {
      course_slug: curso,
      disciplina,
      topico,
      user_id: null,
      roteiro,
      modelo: (v.meta?.['modelo'] as string) || null,
    })
    if (!ok) return false
    await delRest(`podcasts_ia?${filtro}&created_at=lt.${encodeURIComponent(antes)}`)
    return finalizar(true)
  }
  if (tipo === 'questions') {
    const itens = parseJson<Array<Record<string, unknown>>>(v.conteudo)
    if (!Array.isArray(itens) || !itens.length) return false
    const filtro = `course_slug=${eq(curso)}&discipline_nome=${eq(disciplina)}&topic_nome=${eq(topico)}`
    const antes = new Date().toISOString()
    const ok = await postRest(
      'questions',
      itens
        .filter((q) => String(q['enunciado'] || '').trim().length > 10)
        .map((q) => {
          const txt = (k: string) => {
            const val = q[k]
            return val == null || val === '' ? null : String(val).trim()
          }
          const origem = String(q['origem'] || 'inedita').toLowerCase()
          const org = origem === 'real' ? 'real' : origem === 'nao_verificada' ? 'nao_verificada' : 'inedita'
          return {
            course_slug: curso,
            discipline_nome: disciplina,
            topic_nome: topico,
            enunciado: String(q['enunciado']).trim(),
            tipo: 'ce',
            gabarito: String(q['gabarito'] || 'C').trim().toUpperCase().startsWith('C') ? 'C' : 'E',
            alternativas: [],
            comentario: String(q['comentario'] || '').trim() || null,
            banca: txt('banca') || 'Cebraspe',
            origem: org,
            verificada: org === 'real',
            orgao: txt('orgao'),
            cargo: txt('cargo'),
            nivel: txt('nivel'),
            fonte: org === 'real' ? txt('fonte') || 'material da aula' : null,
            ativa: true,
          }
        }),
    )
    if (!ok) return false
    await delRest(`questions?${filtro}&created_at=lt.${encodeURIComponent(antes)}`)
    return finalizar(true)
  }
  if (tipo === 'flashcards') {
    const itens = parseJson<Array<{ frente?: string; verso?: string }>>(v.conteudo)
    if (!Array.isArray(itens) || !itens.length) return false
    const filtro = `course_slug=${eq(curso)}&discipline_nome=${eq(disciplina)}&topic_nome=${eq(topico)}&is_oficial=is.true`
    const antes = new Date().toISOString()
    const ok = await postRest(
      'flashcards',
      itens
        .filter((c) => String(c.frente || '').trim() && String(c.verso || '').trim())
        .map((c) => ({
          user_id: null,
          course_slug: curso,
          discipline_nome: disciplina,
          topic_nome: topico,
          frente: String(c.frente).trim(),
          verso: String(c.verso).trim(),
          is_oficial: true,
        })),
    )
    if (!ok) return false
    await delRest(`flashcards?${filtro}&created_at=lt.${encodeURIComponent(antes)}`)
    return finalizar(true)
  }
  return false
}

/** Despublica o módulo: some da tela do aluno, mas as versões ficam guardadas. */
export async function despublicarModulo(curso: string, disciplina: string, topico: string, tipo: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/aula_conteudos?${filtroAula(curso, disciplina, topico, tipo)}`, {
    method: 'PATCH',
    headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({ publicado: false }),
  }).catch(() => null)

  if (tipo === 'aula')
    return delRest(`aulas_ia?course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&topico=${eq(topico)}&user_id=is.null`)
  if (tipo === 'summary') return delRest(`aula_recursos?${filtroRecurso(curso, disciplina, topico, 'resumo')}`)
  if (tipo === 'review') return delRest(`aula_recursos?${filtroRecurso(curso, disciplina, topico, 'revisao')}`)
  if (tipo === 'key_points') return delRest(`aula_recursos?${filtroRecurso(curso, disciplina, topico, 'pontos')}`)
  if (tipo === 'traps') return delRest(`aula_recursos?${filtroRecurso(curso, disciplina, topico, 'pegadinhas')}`)
  if (tipo === 'athena_knowledge') return delRest(`aula_recursos?${filtroRecurso(curso, disciplina, topico, 'athena')}`)
  if (tipo === 'mapa_mental') return delRest(`aula_recursos?${filtroRecurso(curso, disciplina, topico, 'mapa_mental')}`)
  if (tipo === 'metadados') return delRest(`aula_recursos?${filtroRecurso(curso, disciplina, topico, 'metadados')}`)
  if (tipo === 'lacunas') return delRest(`aula_recursos?${filtroRecurso(curso, disciplina, topico, 'lacunas')}`)
  if (tipo === 'podcast')
    return delRest(`podcasts_ia?course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&topico=${eq(topico)}&user_id=is.null`)
  if (tipo === 'questions')
    return delRest(`questions?course_slug=${eq(curso)}&discipline_nome=${eq(disciplina)}&topic_nome=${eq(topico)}`)
  if (tipo === 'flashcards')
    return delRest(`flashcards?course_slug=${eq(curso)}&discipline_nome=${eq(disciplina)}&topic_nome=${eq(topico)}&is_oficial=is.true`)
}

function filtroRecurso(curso: string, disciplina: string, topico: string, tipo: string) {
  return `course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&topico=${eq(topico)}&tipo=${eq(tipo)}`
}

/* ---------- geração ---------- */

export type QuestoesCfg = {
  quantidade?: number | undefined
  dificuldade?: string | undefined
  prioridades?: string[] | undefined
  comentarios?: boolean | undefined
}

export type GerarCtx = {
  curso: string
  disciplina: string
  topico: string
  material: string
  instrucoes?: string | undefined
  questoes?: QuestoesCfg | undefined
  provider: Provider
  model: string
  /** Rotas por módulo (Central de IA): quando presente, cada módulo usa seu agente. */
  rotas?: Partial<Record<TipoModulo, { provider: Provider; model: string }>> | undefined
  /** Doutrina pedagógica vigente (prompt-mestre). Injetada em todos os módulos. */
  doutrina?: string | undefined
  keys: Keys
}

function jsonArray<T>(txt: string): T[] {
  const arr = parseJson<T[]>(txt)
  return Array.isArray(arr) ? arr : []
}

function promptBase(ctx: GerarCtx, regras: string[]) {
  const extra = (ctx.instrucoes || '').trim()
  return [
    (ctx.doutrina || '').trim(),
    '--- TAREFA ESPECÍFICA DESTE MÓDULO ---',
    ...regras,
    extra ? `Instruções do professor responsável pelo conteúdo (siga com prioridade):\n"${extra}"` : '',
    '\n--- MATERIAL DA AULA ---\n' + ctx.material.slice(0, 90000),
  ]
    .filter(Boolean)
    .join('\n')
}

/** Aplica ao contexto a rota do agente dono do módulo, quando configurada. */
function rotear(ctx: GerarCtx, tipo: TipoModulo): GerarCtx {
  const r = ctx.rotas?.[tipo]
  return r ? { ...ctx, provider: r.provider, model: r.model } : ctx
}

/** Gera UM módulo da aula. Devolve { conteudo, meta } pronto para salvarVersao. */
export async function gerarModulo(tipo: TipoModulo, ctx0: GerarCtx): Promise<{ conteudo: string; meta: Record<string, unknown> }> {
  const ctx = rotear({ ...ctx0, doutrina: ctx0.doutrina || (await doutrina()) }, tipo)
  const user = `Disciplina: ${ctx.disciplina} | Aula: ${ctx.topico}\n\nGere o conteúdo agora.`

  if (tipo === 'aula') {
    const system = promptBase(ctx, [
      'Você é a Athena, professora experiente de cursinho para concursos públicos (banca Cebraspe).',
      'Sua tarefa: transformar o material bruto abaixo em uma AULA EXPOSITIVA completa, como se você estivesse',
      'ensinando o assunto do zero em sala de aula, com didática, exemplos e linguagem clara.',
      'Formato obrigatório (Markdown): comece com "# " no título da aula; use "## " nas seções,',
      '"### " nos subtítulos, listas com "- " e tabelas quando ajudar a comparar.',
      'Estrutura obrigatória: ## Abertura · ## Conceitos-base · ## Desenvolvimento da matéria (### numerados) ·',
      '## Exemplos e aplicações práticas · ## Pegadinhas da banca e palavras-armadilha ·',
      '## Esquema de revisão · ## Fixação — 10 assertivas certo/errado no estilo Cebraspe, com gabarito comentado.',
      'Regras: português do Brasil, 1ª pessoa do professor; destaque em **negrito** conceitos-chave, prazos e exceções;',
      'parágrafos curtos; não invente lei, número, prazo ou julgado que não esteja no material.',
      'Tamanho: aula completa e aprofundada, entre 2.500 e 4.000 palavras. Responda apenas com a aula em Markdown.',
    ])
    const conteudo = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 16000 })
    return { conteudo: conteudo.trim(), meta: { modelo: ctx.model } }
  }

  if (tipo === 'summary') {
    const system = promptBase(ctx, [
      'Você é a Athena, professora de concursos da plataforma Prova X.',
      'Gere um RESUMO INTELIGENTE de estudo em português do Brasil, focado em prova (banca Cebraspe, certo/errado).',
      'Formato: 3 a 6 blocos iniciados por "## " seguidos de parágrafo curto (2 a 4 linhas).',
      'Grife os trechos essenciais (definições, prazos, requisitos, exceções) entre **asteriscos duplos**.',
      'Sem introdução nem conclusão. Responda apenas com o resumo em Markdown.',
    ])
    const conteudo = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 8000 })
    return { conteudo: conteudo.trim(), meta: { modelo: ctx.model } }
  }

  if (tipo === 'review') {
    const system = promptBase(ctx, [
      'Você é a Athena, professora de concursos da plataforma Prova X.',
      'Monte uma REVISÃO INTELIGENTE da aula: os pontos que o aluno precisa revisar na véspera da prova.',
      'Formato Markdown: agrupe em seções "## "; dentro de cada seção, uma lista "- " de pontos de revisão',
      'curtos e densos (1 a 2 linhas cada), sempre com **negrito** no termo-chave.',
      'Inclua ao final uma seção "## Se lembrar de só 5 coisas" com os 5 pontos mais cobrados.',
      'Não invente nada fora do material. Responda apenas com a revisão em Markdown.',
    ])
    const conteudo = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 8000 })
    return { conteudo: conteudo.trim(), meta: { modelo: ctx.model } }
  }

  if (tipo === 'questions') {
    const q = ctx.questoes || {}
    const total = Math.min(30, Math.max(5, Number(q.quantidade) || 12))
    const dif = String(q.dificuldade || 'misto')
    const prior = Array.isArray(q.prioridades) ? q.prioridades : []

    /* Questões reais extraídas de apostilas têm prioridade: entram primeiro e
       a IA só precisa completar o que faltar para a meta configurada. */
    const reais = await questoesReais(ctx.curso, ctx.disciplina, ctx.topico)
    const itensReais = reais.map((r) => ({
      enunciado: r.enunciado,
      gabarito: r.gabarito,
      comentario: r.comentario || '',
      origem: 'real' as const,
      nivel: r.nivel || 'medio',
      banca: r.banca || 'Cebraspe',
      orgao: r.orgao,
      ano: r.ano,
      cargo: r.cargo,
      ja_publicada: true,
    }))
    const faltam = total - itensReais.length
    if (faltam <= 0) {
      return {
        conteudo: JSON.stringify(itensReais, null, 2),
        meta: { modelo: 'banco', itens: itensReais.length, reais: itensReais.length, ineditas: 0, config: q },
      }
    }

    const difTxt =
      dif === 'facil' ? 'todas de dificuldade fácil (conceito direto)'
      : dif === 'medio' ? 'todas de dificuldade média (exigem atenção a detalhes)'
      : dif === 'dificil' ? 'todas de dificuldade difícil (exceções, pegadinhas e casos combinados)'
      : 'misture dificuldades: cerca de metade fáceis/médias e metade exigentes, como numa prova real'
    const priTxt: string[] = []
    if (prior.includes('legislacao')) priTxt.push('priorize a letra da lei (legislação seca)')
    if (prior.includes('conceitos')) priTxt.push('priorize conceitos e definições')
    if (prior.includes('pegadinhas')) priTxt.push('priorize pegadinhas e palavras-armadilha da banca')
    if (prior.includes('importantes')) priTxt.push('priorize os pontos mais importantes e mais cobrados da aula')
    const jaTem = itensReais.map((r) => r.enunciado)
    const system = promptBase(ctx, [
      'Você elabora itens de prova no estilo Cebraspe (julgamento CERTO/ERRADO), em português do Brasil.',
      `Crie ${faltam} itens sobre o material abaixo, equilibrando CERTO e ERRADO, ${difTxt}.`,
      'Nos itens errados, use os erros clássicos da banca: troca de prazo, de autoridade competente,',
      'generalização indevida, inversão de exceção, troca de palavra-chave.',
      priTxt.length ? 'Prioridades do professor: ' + priTxt.join('; ') + '.' : '',
      'Cada item: afirmação objetiva de 1 a 3 linhas, sem pergunta e sem alternativas.',
      q.comentarios
        ? 'O comentário deve ser COMPLETO: explique por que está certo/errado e cite o ponto do material.'
        : 'O comentário deve ser uma justificativa curta.',
      'Não invente lei, prazo, número ou julgado que não esteja no material.',
      ...(jaTem.length
        ? [
            `Já existem ${jaTem.length} questões reais deste tópico gravadas no banco. NÃO repita nem os enunciados nem os mesmos pontos cobrados; foque em outros aspectos do material.`,
            'Enunciados já existentes: ' + jaTem.map((e) => e.slice(0, 140)).join(' || '),
            'Classifique a ORIGEM de cada item criado por você como "inedita" (jamais "real").',
          ]
        : [
            'Classifique a ORIGEM de cada item: "real" apenas quando a questão constar do material com banca/órgão/ano',
            'identificáveis (informe também "banca", "orgao", "ano" e "cargo" quando existirem); caso contrário use "inedita".',
            'Na dúvida sobre a procedência, use "inedita" — jamais rotule como real algo não confirmado no material.',
          ]),
      'Informe o nível de cada item em "nivel": "facil", "medio" ou "dificil".',
      'Responda SOMENTE com JSON válido: [{"enunciado":"...","gabarito":"C","comentario":"...","origem":"inedita","nivel":"medio","banca":"Cebraspe","orgao":null,"ano":null,"cargo":null}]',
    ])
    const saida = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 12000 })
    const geradas = jsonArray<Record<string, unknown>>(saida)
      .filter((x) => String(x['enunciado'] || '').trim().length > 10)
      .slice(0, faltam)
      .map((x) => {
        const origem = String(x['origem'] || 'inedita').toLowerCase()
        const nivel = String(x['nivel'] || dif || 'medio').toLowerCase()
        const txt = (k: string) => {
          const v = x[k]
          return v == null || v === '' ? null : String(v).trim()
        }
        return {
          enunciado: String(x['enunciado']).trim(),
          gabarito: String(x['gabarito'] || 'C').trim().toUpperCase().startsWith('C') ? 'C' : 'E',
          comentario: String(x['comentario'] || '').trim(),
          origem: jaTem.length ? 'inedita' : origem === 'real' ? 'real' : origem === 'nao_verificada' ? 'nao_verificada' : 'inedita',
          nivel: ['facil', 'medio', 'dificil'].includes(nivel) ? nivel : 'medio',
          banca: txt('banca') || 'Cebraspe',
          orgao: txt('orgao'),
          ano: txt('ano'),
          cargo: txt('cargo'),
        }
      })
    const itens = [...itensReais, ...geradas]
    if (!itens.length) throw new Error('A IA não devolveu questões válidas.')
    return {
      conteudo: JSON.stringify(itens, null, 2),
      meta: { modelo: ctx.model, itens: itens.length, reais: itensReais.length, ineditas: geradas.length, config: q },
    }

  }

  if (tipo === 'flashcards') {
    const system = promptBase(ctx, [
      'Você cria flashcards de memorização para concursos, em português do Brasil.',
      'Crie 18 cartões sobre o material abaixo, cobrindo definições, prazos, requisitos, exceções e competências.',
      'A frente é uma pergunta curta e direta; o verso é a resposta objetiva (1 a 3 linhas).',
      'Não invente conteúdo que não esteja no material.',
      'Responda SOMENTE com JSON válido: [{"frente":"...","verso":"..."}]',
    ])
    const saida = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 10000 })
    const itens = jsonArray<{ frente?: string; verso?: string }>(saida)
      .filter((c) => String(c.frente || '').trim() && String(c.verso || '').trim())
      .slice(0, 30)
      .map((c) => ({ frente: String(c.frente).trim(), verso: String(c.verso).trim() }))
    if (!itens.length) throw new Error('A IA não devolveu flashcards válidos.')
    return { conteudo: JSON.stringify(itens, null, 2), meta: { modelo: ctx.model, itens: itens.length } }
  }

  if (tipo === 'lacunas') {
    const system = promptBase(ctx, [
      'Você cria exercícios de completar lacunas para concursos, em português do Brasil.',
      'Gere 3 frases afirmativas e corretas sobre o material, cada uma com 1 ou 2 lacunas marcadas exatamente por "___".',
      'As lacunas devem cair sobre termos técnicos decisivos (prazo, autoridade competente, requisito, exceção).',
      'Responda SOMENTE com JSON válido: [{"frase":"... ___ ...","respostas":["termo1"]}] — a ordem de "respostas" segue a ordem das lacunas. Sem markdown.',
    ])
    const saida = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 4000 })
    const itens = jsonArray<{ frase?: string; respostas?: unknown }>(saida)
      .map((f) => ({
        frase: String(f?.frase || '').trim(),
        respostas: Array.isArray(f?.respostas) ? (f.respostas as unknown[]).map((r) => String(r).trim()) : [],
      }))
      .filter((f) => f.frase.includes('___') && f.respostas.length > 0)
      .slice(0, 5)
    if (!itens.length) throw new Error('A IA não devolveu lacunas válidas.')
    return { conteudo: JSON.stringify(itens, null, 2), meta: { modelo: ctx.model, itens: itens.length } }
  }

  if (tipo === 'key_points') {
    const system = promptBase(ctx, [
      'Você é a Athena, professora de concursos da plataforma Prova X.',
      'Extraia os PONTOS-CHAVE da aula em Markdown: uma lista "- " com os conceitos, regras, prazos e exceções',
      'que o aluno não pode esquecer, cada um com **negrito** no termo principal e explicação de 1 linha.',
      'Agrupe por assunto com "## " quando houver mais de um. Não invente nada fora do material.',
      'Responda apenas com os pontos-chave em Markdown.',
    ])
    const conteudo = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 8000 })
    return { conteudo: conteudo.trim(), meta: { modelo: ctx.model } }
  }

  if (tipo === 'traps') {
    const system = promptBase(ctx, [
      'Você é a Athena, professora de concursos especialista na banca Cebraspe.',
      'Liste as PEGADINHAS DE PROVA desta aula em Markdown: cada pegadinha é um item "- " no formato',
      '"**Armadilha:** como a banca escreve errado → **Verdade:** como o material realmente diz".',
      'Inclua trocas de prazo, de competência, generalizações e palavras-armadilha (sempre/nunca/apenas/é vedado...).',
      'Termine com "## Palavras-armadilha" listando as palavras que a banca mais troca neste tema.',
      'Não invente pegadinhas que não tenham base no material. Responda apenas em Markdown.',
    ])
    const conteudo = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 8000 })
    return { conteudo: conteudo.trim(), meta: { modelo: ctx.model } }
  }

  if (tipo === 'podcast') {
    const system = promptBase(ctx, [
      'Você roteiriza um podcast de estudos para concursos da plataforma Prova X, em português do Brasil.',
      'Dois apresentadores conversam: Ana (professora, começa o episódio) e Rafael (aluno curioso que provoca perguntas).',
      'O episódio cobre a aula inteira, de forma progressiva: abertura, conceitos-base, desenvolvimento com exemplos,',
      'pegadinhas da banca Cebraspe e fechamento com revisão rápida dos pontos-chave.',
      'Escreva de 18 a 24 falas alternadas, cada uma com 4 a 7 frases densas de conteúdo — sem enrolação.',
      'Não invente lei, prazo, número ou julgado que não esteja no material. Não cite "o material" nem "o PDF".',
      'Responda SOMENTE com JSON válido: [{"who":"Ana","texto":"..."},{"who":"Rafael","texto":"..."}]',
    ])
    const saida = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 12000 })
    const falas = jsonArray<{ who?: string; texto?: string }>(saida)
      .filter((f) => f && String(f.texto || '').trim())
      .map((f) => ({ who: f.who === 'Rafael' ? 'Rafael' : 'Ana', texto: String(f.texto).trim() }))
      .slice(0, 30)
    if (!falas.length) throw new Error('A IA não devolveu o roteiro do podcast.')
    const minutos = Math.max(4, Math.round(falas.reduce((s, f) => s + f.texto.length, 0) / 900))
    return { conteudo: JSON.stringify(falas, null, 2), meta: { modelo: ctx.model, falas: falas.length, minutos } }
  }

  if (tipo === 'mapa_mental') {
    const system = promptBase(ctx, [
      'Monte o MAPA MENTAL textual desta aula em Markdown, pronto para memorização visual.',
      'Use listas aninhadas com no máximo 4 níveis: tema central (# ), ramos (## ), sub-ramos ("- ") e detalhes ("  - ").',
      'Cada nó é curto (até 8 palavras), com os termos técnicos em negrito e os prazos/números destacados.',
      'Cubra toda a aula, na mesma ordem lógica do conteúdo, sem inventar informação.',
    ])
    const conteudo = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 6000 })
    return { conteudo: conteudo.trim(), meta: { modelo: ctx.model } }
  }

  if (tipo === 'metadados') {
    const system = promptBase(ctx, [
      'Produza os METADADOS PEDAGÓGICOS desta aula para o catálogo interno da plataforma.',
      'Responda SOMENTE com JSON válido, um único objeto dentro de um array:',
      '[{"resumo_uma_linha":"...","nivel":"basico|intermediario|avancado","tempo_estudo_min":45,',
      '"pre_requisitos":["..."],"objetivos_aprendizagem":["..."],"palavras_chave":["..."],',
      '"itens_edital":["..."],"leis_citadas":["..."],"incidencia_prova":"alta|media|baixa"}]',
      'Todos os campos precisam refletir o material — nada de suposição sobre o que não está nele.',
    ])
    const saida = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 3000 })
    const itens = jsonArray<Record<string, unknown>>(saida)
    if (!itens.length) throw new Error('A IA não devolveu os metadados.')
    return { conteudo: JSON.stringify(itens, null, 2), meta: { modelo: ctx.model } }
  }

  // athena_knowledge
  const system = promptBase(ctx, [
    'Você organiza a BASE DE CONHECIMENTO que a tutora IA (Athena) usará para tirar dúvidas dos alunos sobre esta aula.',
    'Estruture em Markdown com as seções: ## Definições essenciais · ## Regras e prazos · ## Exceções ·',
    '## Erros comuns e pegadinhas · ## Resumo em 10 linhas.',
    'Tudo precisa ser fiel ao material: nada de inventar lei, prazo ou julgado.',
    'Escreva de forma compacta e objetiva — este texto será usado como referência de verdade pela tutora.',
  ])
  const conteudo = await chat({ provider: ctx.provider, model: ctx.model, system, user, keys: ctx.keys, maxTokens: 8000 })
  return { conteudo: conteudo.trim(), meta: { modelo: ctx.model } }
}

/** Acrescenta conteúdo novo ao módulo, sem apagar o que já existe. */
export async function acrescentarModulo(tipo: TipoModulo, ctx0: GerarCtx, atual: string, instrucao: string) {
  const ctx = rotear({ ...ctx0, doutrina: ctx0.doutrina || (await doutrina()) }, tipo)
  const formato = MODULOS.find((m) => m.tipo === tipo)?.formato
  const system = [
    (ctx.doutrina || '').trim(),
    'Você é a Athena, professora de concursos da plataforma Prova X.',
    'O administrador quer ACRESCENTAR conteúdo a um material já existente. Gere APENAS a parte nova pedida,',
    formato === 'json'
      ? 'no MESMO formato JSON do conteúdo atual (um array com somente os itens novos).'
      : 'em Markdown, pronta para ser anexada ao final do conteúdo atual (comece com um título "## ").',
    'Não repita o que já existe. Não invente nada fora do material da aula.',
    '\n--- CONTEÚDO ATUAL ---\n' + atual.slice(0, 30000),
    '\n--- MATERIAL DA AULA ---\n' + ctx.material.slice(0, 60000),
  ].join('\n')
  const novo = await chat({
    provider: ctx.provider,
    model: ctx.model,
    system,
    user: `Pedido do administrador: "${instrucao}"\n\nGere somente a parte nova.`,
    keys: ctx.keys,
    maxTokens: 8000,
  })
  if (formato === 'json') {
    const atuais = jsonArray<unknown>(atual)
    const novos = jsonArray<unknown>(novo)
    if (!novos.length) throw new Error('A IA não devolveu itens novos válidos.')
    return { conteudo: JSON.stringify([...atuais, ...novos], null, 2), meta: { itens: atuais.length + novos.length } }
  }
  if (!novo.trim()) throw new Error('A IA não devolveu conteúdo novo.')
  return { conteudo: atual.trim() + '\n\n' + novo.trim(), meta: {} }
}

/** Melhora/reescreve o conteúdo atual seguindo a instrução do administrador. */
export async function melhorarModulo(tipo: TipoModulo, ctx0: GerarCtx, atual: string, instrucao: string) {
  const ctx = rotear({ ...ctx0, doutrina: ctx0.doutrina || (await doutrina()) }, tipo)
  const formato = MODULOS.find((m) => m.tipo === tipo)?.formato
  const system = [
    (ctx.doutrina || '').trim(),
    'Você é a Athena, professora de concursos da plataforma Prova X.',
    'Reescreva o conteúdo abaixo seguindo a instrução do administrador, mantendo as informações corretas',
    'e a fidelidade ao material da aula. Não perca conteúdo importante sem motivo.',
    formato === 'json'
      ? 'Responda SOMENTE com o JSON completo no mesmo formato (array de itens).'
      : 'Responda SOMENTE com o conteúdo completo reescrito em Markdown.',
    '\n--- CONTEÚDO ATUAL ---\n' + atual.slice(0, 40000),
    '\n--- MATERIAL DA AULA (referência de verdade) ---\n' + ctx.material.slice(0, 50000),
  ].join('\n')
  const novo = await chat({
    provider: ctx.provider,
    model: ctx.model,
    system,
    user: `Instrução: "${instrucao}"\n\nReescreva o conteúdo completo.`,
    keys: ctx.keys,
    maxTokens: 14000,
  })
  if (formato === 'json') {
    const itens = jsonArray<unknown>(novo)
    if (!itens.length) throw new Error('A IA não devolveu uma versão válida.')
    return { conteudo: JSON.stringify(itens, null, 2), meta: { itens: itens.length } }
  }
  if (!novo.trim()) throw new Error('A IA não devolveu uma versão válida.')
  return { conteudo: novo.trim(), meta: {} }
}

/* ---------- sincronização com o que já está no ar (gerado pelo fluxo antigo) ---------- */

/** Lê os depósitos atuais do aluno e grava versões publicadas para módulos
 *  que ainda não têm nenhuma versão registrada no pacote. */
export async function sincronizarPacote(curso: string, disciplina: string, topico: string) {
  const existentes = await versoes(curso, disciplina, topico)
  const tem = (t: string) => existentes.some((v) => v.tipo === t)
  let criados = 0

  const gravar = async (tipo: TipoModulo, conteudo: string, meta: Record<string, unknown>) => {
    if (!conteudo || tem(tipo)) return
    const ok = await salvarVersao({ curso, disciplina, topico, tipo, conteudo, meta, publicado: true, origem: 'ia' })
    if (ok) criados++
  }

  const buscaUm = async (path: string) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: serviceHeaders() }).catch(() => null)
    if (!r || !r.ok) return null
    const rows = (await r.json()) as unknown[]
    return Array.isArray(rows) && rows.length ? rows : null
  }

  const base = `course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&topico=${eq(topico)}`

  const aula = await buscaUm(`aulas_ia?select=conteudo,modelo&${base}&user_id=is.null&limit=1`)
  if (aula) await gravar('aula', String((aula[0] as { conteudo?: string }).conteudo || ''), { modelo: (aula[0] as { modelo?: string }).modelo })

  const recursos = await buscaUm(`aula_recursos?select=tipo,dados,modelo&${base}`) as Array<{ tipo: string; dados: Record<string, unknown>; modelo?: string }> | null
  if (recursos) {
    for (const r of recursos) {
      const d = r.dados || {}
      if (r.tipo === 'resumo' && d['resumo']) await gravar('summary', String(d['resumo']), { modelo: r.modelo })
      if (r.tipo === 'revisao' && d['conteudo']) await gravar('review', String(d['conteudo']), { modelo: r.modelo })
      if (r.tipo === 'pontos' && d['conteudo']) await gravar('key_points', String(d['conteudo']), { modelo: r.modelo })
      if (r.tipo === 'pegadinhas' && d['conteudo']) await gravar('traps', String(d['conteudo']), { modelo: r.modelo })
      if (r.tipo === 'athena' && d['conteudo']) await gravar('athena_knowledge', String(d['conteudo']), { modelo: r.modelo })
      if (r.tipo === 'lacunas' && Array.isArray(d['frases'])) await gravar('lacunas', JSON.stringify(d['frases'], null, 2), { modelo: r.modelo, itens: (d['frases'] as unknown[]).length })
    }
  }

  const pod = await buscaUm(`podcasts_ia?select=roteiro,modelo&${base}&user_id=is.null&limit=1`)
  if (pod) {
    const roteiro = (pod[0] as { roteiro?: unknown[] }).roteiro
    if (Array.isArray(roteiro) && roteiro.length) await gravar('podcast', JSON.stringify(roteiro, null, 2), { modelo: (pod[0] as { modelo?: string }).modelo, falas: roteiro.length })
  }

  const qs = await buscaUm(`questions?select=enunciado,gabarito,comentario&course_slug=${eq(curso)}&discipline_nome=${eq(disciplina)}&topic_nome=${eq(topico)}&limit=40`)
  if (qs) await gravar('questions', JSON.stringify(qs, null, 2), { itens: qs.length })

  const fs = await buscaUm(`flashcards?select=frente,verso&course_slug=${eq(curso)}&discipline_nome=${eq(disciplina)}&topic_nome=${eq(topico)}&is_oficial=is.true&limit=60`)
  if (fs) await gravar('flashcards', JSON.stringify(fs, null, 2), { itens: fs.length })

  return criados
}

export { materialIntegral }
