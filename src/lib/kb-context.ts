/* Contexto do material oficial (knowledge_docs) usado pelos endpoints de IA. */
import { SUPABASE_URL, serviceHeaders } from './px-server'
import { textoVisivel } from './aula-html-util'

export type KbDoc = { titulo?: string; topico?: string; conteudo: string }

/* A aula publicada (inclusive a enviada como HTML pronto) é a fonte principal
   do tópico: sem isso, resumo/questões/flashcards/lacunas/podcast ficavam sem
   material e nunca eram gerados. */
export async function textoDaAula(curso: string, disciplina: string, topico?: string | null) {
  if (!topico) return ''
  const eq = (v: string) => `eq.${encodeURIComponent(v)}`
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/aulas_ia?select=conteudo,formato&course_slug=${eq(curso)}` +
        `&disciplina=${eq(disciplina)}&topico=${eq(topico)}&user_id=is.null&limit=1`,
      { headers: serviceHeaders() },
    )
    if (!r.ok) return ''
    const rows = (await r.json()) as Array<{ conteudo?: string; formato?: string }>
    const row = rows[0]
    if (!row?.conteudo) return ''
    return row.formato === 'html' ? textoVisivel(row.conteudo) : row.conteudo
  } catch {
    return ''
  }
}

export async function fetchKnowledge(curso: string, disciplina: string, topico?: string | null) {
  const params = new URLSearchParams({
    select: 'titulo,topico,conteudo',
    course_slug: `eq.${curso}`,
    disciplina: `eq.${disciplina}`,
    publicado: 'is.true',
    limit: '12',
  })
  const res = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_docs?${params}`, { headers: serviceHeaders() })
  const rows = res.ok ? ((await res.json()) as KbDoc[]) : []
  const exact = topico ? rows.filter((r) => r.topico === topico) : []
  const geral = rows.filter((r) => !r.topico)
  const outros = rows.filter((r) => !exact.includes(r) && !geral.includes(r))
  const aula = await textoDaAula(curso, disciplina, topico)
  const daAula: KbDoc[] = aula.trim()
    ? [{ titulo: topico || disciplina, ...(topico ? { topico } : {}), conteudo: aula }]
    : []

  return [...daAula, ...exact, ...geral, ...outros].slice(0, 6)
}


/** Junta os documentos num bloco de texto para o prompt. */
export function baseTexto(docs: KbDoc[], disciplina: string) {
  return docs
    .map((d) => `### ${d.titulo || d.topico || disciplina}\n${(d.conteudo || '').slice(0, 12000)}`)
    .join('\n\n')
}

export function fonteInstrucao(base: string) {
  return base
    ? 'Use PRIORITARIAMENTE o material oficial abaixo como fonte de verdade.\n\n--- MATERIAL OFICIAL ---\n' + base
    : 'ATENÇÃO: ainda NÃO há material oficial cadastrado para este tópico. Avise isso claramente na sua resposta, ' +
        'de forma curta, e trabalhe apenas com o que o edital indica — nunca invente conteúdo detalhado como se fosse oficial.'
}

/** Texto integral da matéria (documentos publicados + arquivos da base),
 *  usado quando a IA precisa cobrir a disciplina inteira e não só um tópico. */
export async function materialIntegral(curso: string, disciplina: string, topico?: string | null) {
  const eq = (v: string) => `eq.${encodeURIComponent(v)}`
  const partes: string[] = []

  const kd = (await fetch(
    `${SUPABASE_URL}/rest/v1/knowledge_docs?select=titulo,sumario,topico,conteudo&course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&limit=40`,
    { headers: serviceHeaders() },
  )
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => [])) as Array<{ titulo?: string; sumario?: string; topico?: string; conteudo?: string }>

  const kb = (await fetch(
    `${SUPABASE_URL}/rest/v1/kb_documentos?select=nome_arquivo,topic_nome,texto_extraido&course_slug=${eq(curso)}&discipline_nome=${eq(disciplina)}&limit=40`,
    { headers: serviceHeaders() },
  )
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => [])) as Array<{ nome_arquivo?: string; topic_nome?: string; texto_extraido?: string }>

  const peso = (t?: string) => (topico && t === topico ? 0 : !t ? 1 : 2)
  kd.sort((a, b) => peso(a.topico) - peso(b.topico))
  kb.sort((a, b) => peso(a.topic_nome) - peso(b.topic_nome))

  kd.forEach((d) => {
    const t = [d.sumario || '', d.conteudo || ''].join('\n').trim()
    if (t) partes.push(`### ${d.titulo || d.topico || disciplina}\n${t.slice(0, 20000)}`)
  })
  kb.forEach((d) => {
    const t = (d.texto_extraido || '').trim()
    if (t) partes.push(`### ${d.nome_arquivo || 'material'}\n${t.slice(0, 20000)}`)
  })
  return partes.join('\n\n').slice(0, 120000)
}
