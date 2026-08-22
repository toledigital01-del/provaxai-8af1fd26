/* RAG da Athena: o material oficial vira trechos com embeddings (vetores de
   significado) na tabela kb_chunks. A cada pergunta, buscamos só os trechos
   relevantes — com escopo por curso/disciplina/aula e limite rígido de
   contexto — em vez de mandar o material inteiro para o modelo.
   Tudo roda no servidor; a chave da IA nunca sai daqui. */
import { SUPABASE_URL, serviceHeaders, aiKeys } from './px-server'

const EMBED_MODEL = 'google/gemini-embedding-2'
const EMBED_URL = 'https://ai.gateway.lovable.dev/v1/embeddings'
const CHUNK_ALVO = 1200 // caracteres por trecho
const CHUNK_OVERLAP = 160 // sobreposição para não cortar ideias no meio
const MAX_CHUNKS_POR_CARGA = 1500 // segurança contra materiais gigantes

/** Limite rígido de contexto RAG enviado ao modelo de chat. */
export const MAX_RAG_CHARS = 12000

export type TrechoRag = {
  id: string
  disciplina: string
  topico: string | null
  titulo: string | null
  trecho: string
  similarity: number
}

type DocFonte = { docId: string | null; disciplina: string; titulo: string; topico: string | null; texto: string }

async function chaveLovable(): Promise<string> {
  const k = await aiKeys()
  return (k.lovable || '').trim()
}

async function embedLote(inputs: string[], key: string): Promise<number[][]> {
  const call = () =>
    fetch(EMBED_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: EMBED_MODEL, input: inputs }),
    })
  let r = await call()
  if (r.status === 429 || r.status >= 500) {
    await new Promise((res) => setTimeout(res, 1500))
    r = await call()
  }
  if (!r.ok) throw new Error('Falha ao gerar embeddings: ' + (await r.text()).slice(0, 200))
  const j = (await r.json()) as { data?: Array<{ index: number; embedding: number[] }> }
  const data = (j.data || []).slice().sort((a, b) => a.index - b.index)
  if (data.length !== inputs.length) throw new Error('Resposta de embeddings incompleta.')
  return data.map((d) => d.embedding)
}

/** Gera embeddings para uma lista de textos (lotes de até 100, limite do provedor). */
export async function embedTextos(textos: string[]): Promise<number[][]> {
  const key = await chaveLovable()
  if (!key) throw new Error('A IA inclusa (LOVABLE_API_KEY) não está configurada.')
  const out: number[][] = []
  for (let i = 0; i < textos.length; i += 100) {
    out.push(...(await embedLote(textos.slice(i, i + 100), key)))
  }
  return out
}

/** Divide o texto em trechos de ~1200 caracteres com sobreposição, sem cortar parágrafo. */
export function chunkTexto(texto: string): string[] {
  const paras = texto
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
  const chunks: string[] = []
  let atual = ''
  for (const p of paras) {
    atual = atual ? atual + '\n' + p : p
    while (atual.length > CHUNK_ALVO) {
      // procura um fim de parágrafo/frase perto do alvo para cortar bonito
      let corte = atual.lastIndexOf('\n', CHUNK_ALVO)
      if (corte < CHUNK_ALVO * 0.5) corte = atual.lastIndexOf('. ', CHUNK_ALVO)
      if (corte < CHUNK_ALVO * 0.5) corte = CHUNK_ALVO
      chunks.push(atual.slice(0, corte + 1).trim())
      atual = atual.slice(Math.max(0, corte + 1 - CHUNK_OVERLAP)).trim()
    }
  }
  if (atual.trim()) chunks.push(atual.trim())
  return chunks
}

function hashTrecho(t: string) {
  let h = 5381
  for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) >>> 0
  return h.toString(36)
}

async function docsDoEscopo(curso: string, disciplina?: string, topico?: string | null): Promise<DocFonte[]> {
  const eq = (v: string) => `eq.${encodeURIComponent(v)}`
  const h = serviceHeaders()
  let qDocs =
    `select=id,titulo,disciplina,topico,sumario,conteudo&course_slug=${eq(curso)}&publicado=is.true&limit=200`
  if (disciplina) qDocs += `&disciplina=${eq(disciplina)}`
  if (topico) qDocs += `&topico=${eq(topico)}`
  let qKb = `select=id,nome_arquivo,discipline_nome,topic_nome,texto_extraido&course_slug=${eq(curso)}&limit=200`
  if (disciplina) qKb += `&discipline_nome=${eq(disciplina)}`
  if (topico) qKb += `&topic_nome=${eq(topico)}`

  const [kd, kb] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/knowledge_docs?${qDocs}`, { headers: h })
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
    fetch(`${SUPABASE_URL}/rest/v1/kb_documentos?${qKb}`, { headers: h })
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
  ])

  const docs: DocFonte[] = []
  ;(kd as Array<{ id: string; titulo?: string; disciplina?: string; topico?: string; sumario?: string; conteudo?: string }>).forEach((d) => {
    const texto = [d.sumario || '', d.conteudo || ''].join('\n').trim()
    if (texto)
      docs.push({
        docId: d.id,
        disciplina: d.disciplina || disciplina || '',
        titulo: d.titulo || d.topico || d.disciplina || disciplina || 'material',
        topico: d.topico || null,
        texto,
      })
  })
  ;(kb as Array<{ id: string; nome_arquivo?: string; discipline_nome?: string; topic_nome?: string; texto_extraido?: string }>).forEach((d) => {
    const texto = (d.texto_extraido || '').trim()
    if (texto)
      docs.push({
        docId: d.id,
        disciplina: d.discipline_nome || disciplina || '',
        titulo: d.nome_arquivo || 'documento',
        topico: d.topic_nome || null,
        texto,
      })
  })
  return docs
}

/** (Re)indexa um escopo: apaga os trechos antigos dele e grava os novos. */
export async function indexarEscopo(opts: { curso: string; disciplina?: string | undefined; topico?: string | null | undefined }) {
  const { curso, disciplina, topico } = opts
  const docs = await docsDoEscopo(curso, disciplina, topico)
  if (!docs.length) return { docs: 0, chunks: 0 }

  const h = serviceHeaders()
  const eq = (v: string) => `eq.${encodeURIComponent(v)}`
  let del = `course_slug=${eq(curso)}`
  if (disciplina) del += `&disciplina=${eq(disciplina)}`
  if (topico) del += `&topico=${eq(topico)}`
  await fetch(`${SUPABASE_URL}/rest/v1/kb_chunks?${del}`, { method: 'DELETE', headers: h }).catch(() => {})

  type Item = { doc: DocFonte; seq: number; trecho: string }
  const itens: Item[] = []
  for (const doc of docs) {
    for (const [seq, trecho] of chunkTexto(doc.texto).entries()) {
      itens.push({ doc, seq, trecho })
      if (itens.length >= MAX_CHUNKS_POR_CARGA) break
    }
    if (itens.length >= MAX_CHUNKS_POR_CARGA) break
  }

  const vetores = await embedTextos(itens.map((i) => i.trecho))
  const linhas = itens.map((i, k) => ({
    course_slug: curso,
    disciplina: disciplina || '',
    topico: i.doc.topico,
    doc_id: i.doc.docId,
    titulo: i.doc.titulo.slice(0, 300),
    seq: i.seq,
    trecho: i.trecho,
    content_hash: hashTrecho(i.trecho),
    embedding: JSON.stringify(vetores[k]),
  }))
  // quando o escopo é o curso inteiro, a disciplina vem do doc
  if (!disciplina) {
    // docsDoEscopo já filtrou por curso; precisamos da disciplina de cada doc
    // (busca feita sem filtro de disciplina não é usada hoje, mas mantemos seguro)
  }

  for (let i = 0; i < linhas.length; i += 200) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/kb_chunks`, {
      method: 'POST',
      headers: { ...h, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(linhas.slice(i, i + 200)),
    })
    if (!r.ok) throw new Error('Falha ao gravar trechos: ' + (await r.text()).slice(0, 200))
  }
  return { docs: docs.length, chunks: linhas.length }
}

/** Busca os trechos mais relevantes para a pergunta dentro do escopo. */
export async function buscarTrechos(opts: {
  pergunta: string
  curso: string
  disciplina?: string | undefined
  topico?: string | null | undefined
  max?: number | undefined
}): Promise<TrechoRag[]> {
  const [vetor] = await embedTextos([opts.pergunta])
  if (!vetor) return []
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/match_kb_chunks`, {
    method: 'POST',
    headers: { ...serviceHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query_embedding: vetor,
      p_curso: opts.curso,
      p_disciplina: opts.disciplina || null,
      p_topico: opts.topico || null,
      match_count: opts.max || 8,
      match_threshold: 0.28,
    }),
  })
  if (!r.ok) return []
  const rows = (await r.json()) as TrechoRag[]
  return Array.isArray(rows) ? rows : []
}

/** true quando já existem trechos indexados para o escopo. */
export async function escopoIndexado(curso: string, disciplina?: string): Promise<boolean> {
  const eq = (v: string) => `eq.${encodeURIComponent(v)}`
  let q = `select=id&course_slug=${eq(curso)}&limit=1`
  if (disciplina) q += `&disciplina=${eq(disciplina)}`
  const r = await fetch(`${SUPABASE_URL}/rest/v1/kb_chunks?${q}`, { headers: serviceHeaders() }).catch(() => null)
  if (!r || !r.ok) return false
  const rows = (await r.json()) as unknown[]
  return Array.isArray(rows) && rows.length > 0
}
