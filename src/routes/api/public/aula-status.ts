import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requirePedagogicalAdmin, serviceHeaders, SUPABASE_URL } from '@/lib/px-server'
import { cacheChave, cacheLimpar } from '@/lib/px-cache'
import { diagnosticarAula, versaoConteudo } from '@/lib/aula-html-util'

/* Status detalhado de publicação de uma aula, para o admin saber exatamente
   o que o aluno recebe (e o que está faltando quando não recebe nada). */

const Body = z.object({
  curso: z.string().max(80).optional(),
  disciplina: z.string().min(1).max(200),
  topico: z.string().min(1).max(300),
  forcar: z.boolean().optional(),
  previa: z.boolean().optional(),
})

const eq = (v: string) => `eq.${encodeURIComponent(v)}`

export const Route = createFileRoute('/api/public/aula-status')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const bloqueio = await requirePedagogicalAdmin(request)
        if (bloqueio) return bloqueio

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }
        const curso = body.curso || 'prf-2021'
        const { disciplina, topico } = body

        // Re-sincronização forçada: derruba a aula e todos os artefatos em cache.
        if (body.forcar) {
          cacheLimpar(cacheChave('aula-ia', [curso, disciplina, topico]))
          cacheLimpar(cacheChave('recurso', [curso, disciplina, topico]))
          cacheLimpar(cacheChave('resumo', [curso, disciplina, topico]))
          cacheLimpar(cacheChave('mapa', [curso, disciplina, topico]))
          cacheLimpar(cacheChave('podcast', [curso, disciplina, topico]))
        }

        const filtro = `course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&topico=${eq(topico)}&user_id=is.null`
        const aulaRows = await fetch(
          `${SUPABASE_URL}/rest/v1/aulas_ia?select=titulo,conteudo,formato,modelo,updated_at&${filtro}&limit=1`,
          { headers: serviceHeaders() },
        )
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
        const aula = (aulaRows as Array<{
          titulo?: string
          conteudo?: string
          formato?: string
          modelo?: string
          updated_at?: string
        }>)[0]

        const diag = diagnosticarAula(aula)

        // Tópico precisa existir na grade, senão a aula fica órfã (invisível).
        let naGrade = false
        const cur = await fetch(`${SUPABASE_URL}/rest/v1/courses?select=id&slug=${eq(curso)}&limit=1`, {
          headers: serviceHeaders(),
        })
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
        const cursoId = (cur as Array<{ id: string }>)[0]?.id
        if (cursoId) {
          const dis = await fetch(
            `${SUPABASE_URL}/rest/v1/disciplines?select=id&course_id=${eq(cursoId)}&nome=${eq(disciplina)}&limit=1`,
            { headers: serviceHeaders() },
          )
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => [])
          const discId = (dis as Array<{ id: string }>)[0]?.id
          if (discId) {
            const tp = await fetch(
              `${SUPABASE_URL}/rest/v1/topics?select=id&discipline_id=${eq(discId)}&nome=${eq(topico)}&limit=1`,
              { headers: serviceHeaders() },
            )
              .then((r) => (r.ok ? r.json() : []))
              .catch(() => [])
            naGrade = (tp as unknown[]).length > 0
          }
        }

        const recursos = await fetch(
          `${SUPABASE_URL}/rest/v1/aula_recursos?select=tipo,updated_at&course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&topico=${eq(topico)}`,
          { headers: serviceHeaders() },
        )
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])

        const conteudo = String(aula?.conteudo || '')
        return Response.json({
          ok: diag.ok && naGrade,
          formato: aula?.formato || null,
          titulo: aula?.titulo || null,
          modelo: aula?.modelo || null,
          atualizadoEm: aula?.updated_at || null,
          versao: conteudo ? versaoConteudo(conteudo) : null,
          caracteres: diag.caracteres,
          caracteresVisiveis: diag.caracteresVisiveis,
          campoFaltando: naGrade ? diag.campo : diag.campo || 'topics.nome',
          motivo: naGrade
            ? diag.motivo
            : diag.motivo ||
              'A aula está salva, mas o tópico não existe na grade da disciplina — o aluno não vê o link.',
          naGrade,
          recursos: (recursos as Array<{ tipo: string; updated_at?: string }>).map((r) => r.tipo),
          cacheLimpo: !!body.forcar,
          previa: body.previa ? conteudo : undefined,
        })
      },
    },
  },
})
