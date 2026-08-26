/* DOUTRINA PEDAGÓGICA DO PROVA X.

   Este é o "prompt-mestre" que rege TODA a geração administrativa de conteúdo
   (aulas, resumos, revisões, questões, flashcards, pegadinhas, podcast, mapa
   mental, metadados e base da Athena). Ele é injetado antes de qualquer regra
   específica de módulo, de forma que a identidade e as regras editoriais valem
   para todos os agentes.

   O administrador pode reescrever a doutrina pelo painel (Central de IA →
   Doutrina pedagógica); nesse caso o texto salvo em `platform_settings`
   (chave `prompt_mestre`) substitui o padrão abaixo. */
import { SUPABASE_URL, getSetting, serviceHeaders } from './px-server'

export const CHAVE_DOUTRINA = 'prompt_mestre'

export const DOUTRINA_PADRAO = `# IA ADMINISTRATIVA PEDAGÓGICA DO PROVA X

## 1. Identidade
Você é a IA Administrativa Pedagógica do Prova X, plataforma premium de preparação para concursos públicos.
Escreve como um professor sênior de cursinho de elite: técnico, direto, didático e confiável. Nunca como chatbot.

## 2. Missão
Transformar material bruto (edital, PDF, legislação, doutrina, aula) em conteúdo de estudo pronto para o aluno,
com profundidade de curso pago, foco absoluto no que cai em prova e fidelidade total à fonte.

## 3. Regras inegociáveis de veracidade
- Nunca invente lei, artigo, súmula, julgado, prazo, percentual, competência ou número.
- Só afirme o que puder ser sustentado pelo material fornecido; havendo dúvida, escreva a regra geral sem inventar exceção.
- Nunca cite jurisprudência sem identificar o tribunal e o instrumento (ex.: STF, Súmula Vinculante nº X) e apenas quando constar do material.
- Não cite "o material", "o PDF", "o texto acima" — o aluno não vê a fonte; escreva como aula autoral.
- Não use linguagem de IA ("como modelo de linguagem", "posso ajudar com...", "espero ter ajudado").

## 4. Padrão de aula
- Markdown hierárquico: "# " título, "## " seções, "### " subtítulos, listas, tabelas comparativas quando houver contraste.
- Negrito nos termos técnicos, prazos, competências e palavras que a banca troca.
- Sequência: abertura contextualizada → conceitos-base → desenvolvimento aprofundado → exceções e detalhes →
  pontos que mais caem → erros comuns → síntese final.
- Explique do zero: o aluno pode nunca ter visto o tema. Use exemplos concretos e comparações.
- Profundidade acima de brevidade: aula completa, sem enrolação e sem repetição vazia.

## 5. Questões
- Padrão Cebraspe: assertiva única, julgamento CERTO (C) ou ERRADO (E), sem alternativas.
- Toda questão tem comentário explicando o porquê do gabarito e apontando a armadilha.
- Classifique a origem: "real" (prova efetivamente aplicada, com banca/órgão/ano identificados no material),
  "inedita" (criada por você a partir do material) ou "nao_verificada".
- NUNCA rotule como real uma questão que você não conseguiu confirmar no material. Na dúvida, é inédita.
- Distribua entre literalidade da norma, interpretação, exceção e pegadinha clássica.

## 6. Pegadinhas
Sempre no formato "Armadilha (como a banca escreve errado) → Verdade (como a norma realmente é)",
cobrindo troca de prazo, troca de competência, generalização indevida e palavras-armadilha
(sempre, nunca, apenas, exclusivamente, é vedado, poderá, deverá).

## 7. Coerência editorial
- Terminologia uniforme em todos os módulos da mesma aula.
- Nada de contradição entre aula, resumo, revisão, questões e flashcards.
- Cada módulo deve poder ser estudado isoladamente e ainda assim fazer sentido.

## 8. Checklist antes de entregar
1) Fidelidade à fonte  2) Estrutura hierárquica correta  3) Foco em prova  4) Sem invenção
5) Sem meta-referência ao material  6) Português impecável  7) Densidade compatível com curso premium.`

let cache: { valor: string; ate: number } | null = null

/** Texto vigente da doutrina (custom do painel ou padrão). */
export async function doutrina(): Promise<string> {
  if (cache && cache.ate > Date.now()) return cache.valor
  const salvo = await getSetting<unknown>(CHAVE_DOUTRINA)
  const txt =
    typeof salvo === 'string'
      ? salvo
      : salvo && typeof salvo === 'object' && typeof (salvo as { texto?: string }).texto === 'string'
        ? (salvo as { texto: string }).texto
        : ''
  const valor = txt.trim() || DOUTRINA_PADRAO
  cache = { valor, ate: Date.now() + 60_000 }
  return valor
}

/** Salva (ou restaura) a doutrina editada no painel. */
export async function salvarDoutrina(texto: string) {
  const valor = texto.trim()
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/platform_settings?on_conflict=chave`, {
      method: 'POST',
      headers: serviceHeaders({
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      }),
      body: JSON.stringify({ chave: CHAVE_DOUTRINA, valor: valor || DOUTRINA_PADRAO, publico: true }),
    })
    if (!r.ok) {
      console.error('[salvarDoutrina] falha ao gravar:', r.status, await r.text().catch(() => ''))
      return false
    }
    cache = null
    return true
  } catch (error) {
    console.error('[salvarDoutrina] erro inesperado:', error)
    return false
  }
}

/* ---------- status editorial da aula ---------- */

export const STATUS_EDITORIAL = [
  { valor: 'rascunho', rotulo: 'Rascunho', cor: '#64748B' },
  { valor: 'em_revisao', rotulo: 'Em revisão', cor: '#B45309' },
  { valor: 'revisado', rotulo: 'Revisado', cor: '#1D4ED8' },
  { valor: 'aprovado', rotulo: 'Aprovado', cor: '#047857' },
  { valor: 'publicado', rotulo: 'Publicado', cor: '#065F46' },
  { valor: 'desatualizado', rotulo: 'Desatualizado', cor: '#B91C1C' },
] as const

export type StatusEditorial = (typeof STATUS_EDITORIAL)[number]['valor']

export type Editorial = {
  status: string
  versao_rotulo: string
  metadados: Record<string, unknown>
  observacoes: string | null
  ultima_verificacao: string | null
  ultima_atualizacao: string | null
  proxima_revisao: string | null
}

const eq = (v: string) => `eq.${encodeURIComponent(v)}`

export async function lerEditorial(curso: string, disciplina: string, topico: string): Promise<Editorial> {
  const vazio: Editorial = {
    status: 'rascunho',
    versao_rotulo: 'v1.0',
    metadados: {},
    observacoes: null,
    ultima_verificacao: null,
    ultima_atualizacao: null,
    proxima_revisao: null,
  }
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/aula_editorial?course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&topico=${eq(topico)}&limit=1`,
      { headers: serviceHeaders() },
    )
    if (!r.ok) return vazio
    const rows = (await r.json()) as Editorial[]
    return rows[0] ? { ...vazio, ...rows[0] } : vazio
  } catch {
    return vazio
  }
}

export async function salvarEditorial(
  curso: string,
  disciplina: string,
  topico: string,
  dados: Partial<Editorial> & { atualizado_por?: string | null },
) {
  const body: Record<string, unknown> = {
    course_slug: curso,
    disciplina,
    topico,
    ultima_atualizacao: new Date().toISOString(),
  }
  for (const k of ['status', 'versao_rotulo', 'metadados', 'observacoes', 'proxima_revisao', 'ultima_verificacao', 'atualizado_por'] as const) {
    const v = (dados as Record<string, unknown>)[k]
    if (v !== undefined) body[k] = v
  }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/aula_editorial?on_conflict=course_slug,disciplina,topico`, {
    method: 'POST',
    headers: serviceHeaders({
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    }),
    body: JSON.stringify(body),
  })
  return r.ok
}
