/* Recursos da aula gerados uma única vez e reaproveitados por todos os alunos
   (resumo inteligente, exercícios de lacunas, etc). */
import { SUPABASE_URL, serviceHeaders } from './px-server'
import { cacheChave, cacheGravar, cacheLer, cacheLimpar } from './px-cache'

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
  /* Conteúdo publicado muda só quando o professor republica: guardamos na
     memória do servidor para o aluno não esperar o banco a cada aba. */
  const chave = cacheChave('recurso', [curso, disciplina, topico, tipo])
  const memo = cacheLer<{ dados: T; modelo: string | null }>(chave)
  if (memo) return memo
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/aula_recursos?select=dados,modelo&${filtro(curso, disciplina, topico, tipo)}&limit=1`,
      { headers: serviceHeaders() },
    )
    if (!r.ok) return null
    const rows = (await r.json()) as Array<{ dados: T; modelo: string | null }>
    const hit = rows[0] ?? null
    if (hit) cacheGravar(chave, hit)
    return hit
  } catch {
    return null
  }
}


/** Guarda (ou substitui) um recurso preparado da aula.
    Atualiza a linha existente para respeitar a chave única e só cria uma nova
    quando o recurso ainda não existe. */
export async function salvarRecurso(
  curso: string,
  disciplina: string,
  topico: string | null | undefined,
  tipo: string,
  dados: unknown,
  modelo?: string | null,
): Promise<boolean> {
  // Publicação nova invalida o que estava guardado na memória do servidor.
  cacheLimpar(cacheChave('recurso', [curso, disciplina, topico, tipo]))
  const alvo = filtro(curso, disciplina, topico, tipo)
  try {
    const patch = await fetch(`${SUPABASE_URL}/rest/v1/aula_recursos?${alvo}`, {
      method: 'PATCH',
      headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
      body: JSON.stringify({ dados, modelo: modelo || null, updated_at: new Date().toISOString() }),
    })
    if (!patch.ok) {
      console.error(`[salvarRecurso] PATCH falhou (${tipo}):`, patch.status, await patch.text().catch(() => ''))
      return false
    }
    const atualizadas = (await patch.json().catch(() => [])) as unknown[]
    if (atualizadas.length > 0) return true

    const post = await fetch(`${SUPABASE_URL}/rest/v1/aula_recursos`, {
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
    if (!post.ok) {
      console.error(`[salvarRecurso] POST falhou (${tipo}):`, post.status, await post.text().catch(() => ''))
      return false
    }
    return true
  } catch (e) {
    console.error(`[salvarRecurso] erro inesperado (${tipo}):`, e)
    return false
  }
}
