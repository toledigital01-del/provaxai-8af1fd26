import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getSetting, aiKeys, currentUser, usosHoje, registrarUsoIA } from '@/lib/px-server'
import { fetchKnowledge, baseTexto, fonteInstrucao } from '@/lib/kb-context'
import { chat, normalizar, AIError } from '@/lib/ai-gateway'
import { lerRecurso, salvarRecurso } from '@/lib/aula-recursos'

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).optional().nullable(),
  curso: z.string().max(80).optional(),
  regerar: z.boolean().optional(),
})

type Frase = { frase: string; respostas: string[] }

function extrair(txt: string): Frase[] {
  const bruto = txt.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  const ini = bruto.indexOf('[')
  const fim = bruto.lastIndexOf(']')
  if (ini < 0 || fim <= ini) return []
  try {
    const arr = JSON.parse(bruto.slice(ini, fim + 1)) as Array<{ frase?: string; respostas?: unknown }>
    return arr
      .map((f) => ({
        frase: String(f?.frase || '').trim(),
        respostas: Array.isArray(f?.respostas) ? (f.respostas as unknown[]).map((r) => String(r).trim()) : [],
      }))
      .filter((f) => f.frase.includes('___') && f.respostas.length > 0)
      .slice(0, 3)
  } catch {
    return []
  }
}

export const Route = createFileRoute('/api/public/lacunas')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await currentUser(request)
        if (!userId) return Response.json({ error: 'Entre na sua conta para praticar as lacunas.' }, { status: 401 })

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'

        // Exercício já preparado no painel administrativo.
        if (!body.regerar) {
          const pronto = await lerRecurso<{ frases?: Frase[] }>(curso, body.disciplina, body.topico, 'lacunas')
          const frasesProntas = pronto?.dados?.frases
          if (Array.isArray(frasesProntas) && frasesProntas.length)
            return Response.json({ frases: frasesProntas, fontes: 0, modelo: pronto?.modelo, cache: true })
        }

        const cfg = normalizar(await getSetting('ia_athena'))
        const limite = cfg.limiteDiario ?? 0
        if (limite > 0 && (await usosHoje(userId, 'lacunas')) >= limite)
          return Response.json({ error: `Você atingiu o limite de ${limite} exercícios hoje. Volte amanhã.` }, { status: 429 })

        const docs = await fetchKnowledge(curso, body.disciplina, body.topico)
        const base = baseTexto(docs, body.disciplina)

        const system = [
          'Você cria exercícios de completar lacunas para concursos, em português do Brasil.',
          'Gere de 2 a 3 frases afirmativas e corretas sobre o tópico, cada uma com 1 ou 2 lacunas marcadas exatamente por "___".',
          'As lacunas devem cair sobre termos técnicos decisivos (prazo, autoridade competente, requisito, exceção).',
          'Responda SOMENTE com JSON válido: [{"frase":"... ___ ...","respostas":["termo1"]}] — a ordem de "respostas" segue a ordem das lacunas na frase. Sem markdown.',
          fonteInstrucao(base),
        ].join('\n')

        try {
          const saida = await chat({
            provider: cfg.provider,
            model: cfg.model,
            system,
            user: `Disciplina: ${body.disciplina}${body.topico ? ` | Tópico: ${body.topico}` : ''}\n\nGere as frases em JSON.`,
            keys: await aiKeys(),
          })
          const frases = extrair(saida || '')
          await registrarUsoIA({
            user_id: userId,
            ferramenta: 'lacunas',
            modelo: cfg.model,
            discipline_nome: body.disciplina,
            topic_nome: body.topico ?? null,
            pergunta: 'lacunas',
            resposta: saida || '',
          })
          if (!frases.length) return Response.json({ error: 'Não consegui gerar o exercício agora.' }, { status: 502 })
          await salvarRecurso(curso, body.disciplina, body.topico, 'lacunas', { frases }, cfg.model)
          return Response.json({ frases, fontes: docs.length, modelo: cfg.model, cache: false })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'Não consegui gerar o exercício agora.' }, { status: err.status || 502 })
        }
      },
    },
  },
})
