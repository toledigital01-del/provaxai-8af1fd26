import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin, SUPABASE_URL, serviceHeaders } from '@/lib/px-server'
import { reindexarDesatualizados } from '@/lib/rag'

/* Relatório de RAG da Athena (somente admin): taxa de sucesso, cobertura por
   aula e frequência de fallback, com filtros por curso/disciplina.
   Ao abrir, o relatório também roda o job de reindexação: qualquer disciplina
   com material mais novo que o índice é reindexada automaticamente. */

type Evento = {
  disciplina: string
  rag_ativo: boolean
  trechos: number
  sim_media: number | null
  motivo_fallback: string | null
  created_at: string
}

async function handler(request: Request) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  const url = new URL(request.url)
  let curso = url.searchParams.get('curso') || 'prf-2021'
  let disciplina = url.searchParams.get('disciplina') || ''
  if (request.method === 'POST') {
    const b = (await request.json().catch(() => ({}))) as { curso?: string; disciplina?: string }
    curso = b.curso || curso
    disciplina = b.disciplina || disciplina
  }
  const eq = (v: string) => `eq.${encodeURIComponent(v)}`
  const h = serviceHeaders()

  // Job em segundo plano: reindexa o que estiver velho antes de medir cobertura.
  const reindex = await reindexarDesatualizados(curso, disciplina || undefined, 5).catch(() => null)

  let qEv = `select=disciplina,rag_ativo,trechos,sim_media,motivo_fallback,created_at&course_slug=${eq(curso)}&order=created_at.desc&limit=5000`
  if (disciplina) qEv += `&disciplina=${eq(disciplina)}`
  const [evR, chunksR, docsR] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/rag_events?${qEv}`, { headers: h }),
    fetch(`${SUPABASE_URL}/rest/v1/kb_chunks?select=disciplina,topico&course_slug=${eq(curso)}&limit=10000`, { headers: h }),
    fetch(
      `${SUPABASE_URL}/rest/v1/knowledge_docs?select=disciplina,topico&course_slug=${eq(curso)}&publicado=is.true&limit=1000`,
      { headers: h },
    ),
  ])

  const eventos: Evento[] = evR.ok ? ((await evR.json()) as Evento[]) : []
  const chunks = chunksR.ok ? ((await chunksR.json()) as Array<{ disciplina: string; topico: string | null }>) : []
  const docs = docsR.ok ? ((await docsR.json()) as Array<{ disciplina: string; topico: string | null }>) : []

  const lista = Array.isArray(eventos) ? eventos : []
  const comRag = lista.filter((e) => e.rag_ativo)
  const sims = comRag.map((e) => e.sim_media).filter((n): n is number => typeof n === 'number')
  const fallbacks: Record<string, number> = {}
  lista.filter((e) => !e.rag_ativo).forEach((e) => {
    const m = e.motivo_fallback || 'sem_trechos'
    fallbacks[m] = (fallbacks[m] || 0) + 1
  })

  // Por disciplina
  const porDisc: Record<string, { total: number; rag: number; simSoma: number; simN: number }> = {}
  lista.forEach((e) => {
    const d = (porDisc[e.disciplina] ||= { total: 0, rag: 0, simSoma: 0, simN: 0 })
    d.total++
    if (e.rag_ativo) d.rag++
    if (typeof e.sim_media === 'number') {
      d.simSoma += e.sim_media
      d.simN++
    }
  })

  // Cobertura: aulas publicadas (docs com tópico) que já têm trechos indexados
  const chunkSet = new Set(
    (Array.isArray(chunks) ? chunks : []).map((c) => `${c.disciplina}¦${c.topico || ''}`),
  )
  const chunkDisc = new Set((Array.isArray(chunks) ? chunks : []).map((c) => c.disciplina))
  const aulas = (Array.isArray(docs) ? docs : []).filter((d) => d.topico)
  const coberturaPorDisc: Record<string, { aulas: number; cobertas: number }> = {}
  aulas.forEach((d) => {
    const c = (coberturaPorDisc[d.disciplina] ||= { aulas: 0, cobertas: 0 })
    c.aulas++
    if (chunkSet.has(`${d.disciplina}¦${d.topico}`) || chunkDisc.has(d.disciplina)) c.cobertas++
  })

  return Response.json({
    curso,
    disciplina: disciplina || null,
    reindex,
    resumo: {
      perguntas: lista.length,
      ragOk: comRag.length,
      taxaSucesso: lista.length ? Math.round((comRag.length / lista.length) * 100) : null,
      simMedia: sims.length ? Math.round((sims.reduce((a, b) => a + b, 0) / sims.length) * 100) : null,
      trechosMedios: comRag.length
        ? Math.round((comRag.reduce((a, e) => a + e.trechos, 0) / comRag.length) * 10) / 10
        : null,
      fallbacks,
    },
    porDisciplina: Object.entries(porDisc)
      .map(([d, v]) => ({
        disciplina: d,
        perguntas: v.total,
        taxaSucesso: v.total ? Math.round((v.rag / v.total) * 100) : null,
        simMedia: v.simN ? Math.round((v.simSoma / v.simN) * 100) : null,
      }))
      .sort((a, b) => b.perguntas - a.perguntas),
    cobertura: Object.entries(coberturaPorDisc)
      .map(([d, v]) => ({
        disciplina: d,
        aulas: v.aulas,
        cobertas: v.cobertas,
        pct: v.aulas ? Math.round((v.cobertas / v.aulas) * 100) : null,
      }))
      .sort((a, b) => a.disciplina.localeCompare(b.disciplina, 'pt-BR')),
    trechosPorDisciplina: (Array.isArray(chunks) ? chunks : []).reduce<Record<string, number>>((acc, c) => {
      acc[c.disciplina] = (acc[c.disciplina] || 0) + 1
      return acc
    }, {}),
    ultimos: lista.slice(0, 20).map((e) => ({
      disciplina: e.disciplina,
      rag_ativo: e.rag_ativo,
      trechos: e.trechos,
      sim_media: e.sim_media,
      motivo_fallback: e.motivo_fallback,
      created_at: e.created_at,
    })),
  })
}

export const Route = createFileRoute('/api/public/rag-metrics')({
  server: {
    handlers: {
      GET: ({ request }) => handler(request),
      POST: ({ request }) => handler(request),
    },
  },
})
