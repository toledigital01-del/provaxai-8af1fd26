import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requirePedagogicalAdmin, serviceHeaders, SUPABASE_URL } from '@/lib/px-server'

/* Auditoria das aulas com Athena IA antes de liberar para o aluno.
   Aponta dois problemas que deixam a aula invisível na navegação:
   - órfã: o tópico da aula não existe na grade da disciplina;
   - vínculo incompleto: a aula existe, mas os conteúdos derivados
     (resumo, questões, flashcards, podcast…) apontam para outro tópico. */

const Body = z.object({ curso: z.string().max(80).optional() })

const eq = (v: string) => `eq.${encodeURIComponent(v)}`

async function ler<T>(path: string): Promise<T[]> {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: serviceHeaders() })
    if (!r.ok) return []
    const rows = await r.json()
    return Array.isArray(rows) ? (rows as T[]) : []
  } catch {
    return []
  }
}

const chave = (d: string, t: string) => `${(d || '').trim().toLowerCase()}||${(t || '').trim().toLowerCase()}`

export const Route = createFileRoute('/api/public/kb-auditoria')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json().catch(() => ({})))
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }
        const curso = body.curso || 'prf-2021'

        // Grade oficial: disciplinas do curso e seus tópicos.
        const cursos = await ler<{ id: string }>(`courses?select=id&slug=${eq(curso)}&limit=1`)
        const cursoId = cursos[0]?.id
        if (!cursoId) return Response.json({ error: 'Curso não encontrado.' }, { status: 404 })

        const discs = await ler<{ id: string; nome: string }>(
          `disciplines?select=id,nome&course_id=${eq(cursoId)}`,
        )
        const topicos = await ler<{ discipline_id: string; nome: string }>(
          `topics?select=discipline_id,nome&discipline_id=in.(${discs.map((d) => d.id).join(',') || '00000000-0000-0000-0000-000000000000'})`,
        )
        const nomePorDisc = new Map(discs.map((d) => [d.id, d.nome]))
        const naGrade = new Set(topicos.map((t) => chave(nomePorDisc.get(t.discipline_id) || '', t.nome)))

        const aulas = await ler<{ disciplina: string; topico: string; titulo: string | null; formato: string | null; updated_at: string }>(
          `aulas_ia?select=disciplina,topico,titulo,formato,updated_at&course_slug=${eq(curso)}&user_id=is.null&order=disciplina.asc`,
        )
        const recursos = await ler<{ disciplina: string; topico: string | null; tipo: string }>(
          `aula_recursos?select=disciplina,topico,tipo&course_slug=${eq(curso)}`,
        )

        const recursosPorAula = new Map<string, string[]>()
        recursos.forEach((r) => {
          const k = chave(r.disciplina, r.topico || '')
          recursosPorAula.set(k, (recursosPorAula.get(k) || []).concat(r.tipo))
        })

        const ESPERADOS = ['resumo', 'lacunas', 'podcast', 'mapa_mental']

        const itens = aulas.map((a) => {
          const k = chave(a.disciplina, a.topico)
          const tem = recursosPorAula.get(k) || []
          const faltando = ESPERADOS.filter((t) => !tem.includes(t))
          const orfa = !naGrade.has(k)
          // Recursos gravados em outro tópico da mesma disciplina (vínculo torto).
          const soltos = Array.from(recursosPorAula.keys()).filter(
            (rk) => rk.startsWith(`${(a.disciplina || '').trim().toLowerCase()}||`) && rk !== k && !naGrade.has(rk),
          )
          return {
            disciplina: a.disciplina,
            topico: a.topico,
            titulo: a.titulo || a.topico,
            formato: a.formato || 'markdown',
            atualizada_em: a.updated_at,
            orfa,
            faltando,
            recursos_soltos: soltos.length,
            situacao: orfa ? 'orfa' : faltando.length ? 'incompleta' : 'ok',
          }
        })

        return Response.json({
          curso,
          total: itens.length,
          orfas: itens.filter((i) => i.orfa).length,
          incompletas: itens.filter((i) => i.situacao === 'incompleta').length,
          ok: itens.filter((i) => i.situacao === 'ok').length,
          itens: itens.sort((a, b) => (a.situacao === b.situacao ? 0 : a.situacao === 'orfa' ? -1 : b.situacao === 'orfa' ? 1 : a.situacao === 'incompleta' ? -1 : 1)),
        })
      },
    },
  },
})
