/* Recursos da aula gerados uma única vez e reaproveitados por todos os alunos
   (resumo inteligente, exercícios de lacunas, etc). */
import { SUPABASE_URL, serviceHeaders } from './px-server'

const eq = (v: string) => `eq.${encodeURIComponent(v)}`

function filtro(curso: string, disciplina: string, topico: string | null | undefined, tipo: string) {
  return (
    `course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&tipo=${eq(tipo)}` +
    (topico ? `&topico=${eq(topico)}` : '&topico=is.null')
  )
}

/** Lê um recurso já preparado. Devolve null quando ainda não existe. */
export async function lerRecurso<T = unknown>(
  curso: string,
  disciplina: string,
  topico: string | null | undefined,
  tipo: string,
): Promise<{ dados: T; modelo: string | null } | null> {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/aula_recursos?select=dados,modelo&${filtro(curso, disciplina, topico, tipo)}&limit=1`,
      { headers: serviceHeaders() },
    )
    if (!r.ok) return null
    const rows = (await r.json()) as Array<{ dados: T; modelo: string | null }>
    return rows[0] ?? null
  } catch {
    return null
  }
}

/** Guarda (ou substitui) um recurso preparado da aula. Best-effort. */
export async function salvarRecurso(
  curso: string,
  disciplina: string,
  topico: string | null | undefined,
  tipo: string,
  dados: unknown,
  modelo?: string | null,
) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/aula_recursos?${filtro(curso, disciplina, topico, tipo)}`, {
      method: 'DELETE',
      headers: serviceHeaders({ Prefer: 'return=minimal' }),
    })
    await fetch(`${SUPABASE_URL}/rest/v1/aula_recursos`, {
      method: 'POST',
      headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify({
        course_slug: curso,
        disciplina,
        topico: topico || null,
        tipo,
        dados,
        modelo: modelo || null,
      }),
    })
  } catch {
    /* cache é best-effort */
  }
}
