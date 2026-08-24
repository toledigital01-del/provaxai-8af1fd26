import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requirePedagogicalAdmin } from '@/lib/px-server'

/* Prepara TUDO de uma aula na publicação: aula da Athena, resumo inteligente,
   questões, flashcards, lacunas e roteiro do podcast. Cada item é gerado uma
   única vez e fica salvo — o aluno só lê o que já está pronto. */

const ITENS = ['aula', 'resumo', 'questoes', 'flashcards', 'lacunas', 'podcast'] as const
type Item = (typeof ITENS)[number]

const Body = z.object({
  curso: z.string().max(80).optional(),
  disciplina: z.string().min(1).max(200),
  topico: z.string().min(1).max(300),
  itens: z.array(z.enum(ITENS)).optional(),
  regerar: z.boolean().optional(),
})

export const Route = createFileRoute('/api/public/kb-preparar')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const negado = await requirePedagogicalAdmin(request)
        if (negado) return negado

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        const itens = (body.itens?.length ? body.itens : [...ITENS]) as Item[]
        const origem = new URL(request.url).origin
        const auth = request.headers.get('authorization') || ''

        const chamar = async (rota: string, dados: Record<string, unknown>) => {
          const r = await fetch(`${origem}/api/public/${rota}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: auth } : {}) },
            body: JSON.stringify(dados),
          })
          const j = (await r.json().catch(() => ({}))) as Record<string, unknown>
          return { ok: r.ok, status: r.status, j }
        }

        const base = { curso, disciplina: body.disciplina, topico: body.topico }
        const regerar = !!body.regerar
        const resultados: Array<{ item: Item; ok: boolean; detalhe: string }> = []

        for (const item of itens) {
          try {
            let res: { ok: boolean; status: number; j: Record<string, unknown> }
            if (item === 'aula') res = await chamar('aula-ia', { ...base, regerar })
            else if (item === 'resumo') res = await chamar('resumo', { ...base, regerar })
            else if (item === 'lacunas') res = await chamar('lacunas', { ...base, regerar })
            else if (item === 'podcast') res = await chamar('podcast', { ...base, regerar })
            else res = await chamar('gerar-exercicios', { ...base, tipo: item, regerar })

            const j = res.j
            const detalhe = res.ok
              ? j['cache'] === true
                ? 'já estava pronto'
                : typeof j['criados'] === 'number'
                  ? `${j['criados']} item(ns) gerados`
                  : 'gerado agora'
              : String(j['error'] || `falhou (${res.status})`)
            resultados.push({ item, ok: res.ok, detalhe })
          } catch {
            resultados.push({ item, ok: false, detalhe: 'falha de conexão' })
          }
        }

        // Registra no pacote da aula (aula_conteudos) versões publicadas do que
        // já está no ar, para o painel "IA da Aula" enxergar o que foi preparado.
        try {
          await chamar('aula-pacote', { acao: 'sincronizar', ...base })
        } catch {
          /* sincronização é best-effort */
        }

        return Response.json({
          ok: resultados.every((r) => r.ok),
          aula: body.topico,
          disciplina: body.disciplina,
          resultados,
        })
      },
    },
  },
})
