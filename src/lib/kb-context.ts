/* Contexto do material oficial (knowledge_docs) usado pelos endpoints de IA. */
import { SUPABASE_URL, serviceHeaders } from './px-server'

export type KbDoc = { titulo?: string; topico?: string; conteudo: string }

export async function fetchKnowledge(curso: string, disciplina: string, topico?: string | null) {
  const params = new URLSearchParams({
    select: 'titulo,topico,conteudo',
    course_slug: `eq.${curso}`,
    disciplina: `eq.${disciplina}`,
    publicado: 'is.true',
    limit: '12',
  })
  const res = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_docs?${params}`, { headers: serviceHeaders() })
  if (!res.ok) return [] as KbDoc[]
  const rows = (await res.json()) as KbDoc[]
  const exact = topico ? rows.filter((r) => r.topico === topico) : []
  const geral = rows.filter((r) => !r.topico)
  const outros = rows.filter((r) => !exact.includes(r) && !geral.includes(r))
  return [...exact, ...geral, ...outros].slice(0, 6)
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
