import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getSetting, aiKeys, requireAdmin } from '@/lib/px-server'
import { chat, normalizar, AIError, MODELOS, type Provider } from '@/lib/ai-gateway'

/* Classificador de material: NÃO reescreve nada.
   Recebe trechos do material e devolve em qual tópico do edital cada um se encaixa. */
const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topicos: z.array(z.string().max(300)).min(1).max(400),
  trechos: z
    .array(z.object({ i: z.number().int().min(0), amostra: z.string().max(6000) }))
    .min(1)
    .max(40),
  modelo: z.string().max(80).optional(),
  provider: z.enum(['lovable', 'openai', 'gemini', 'anthropic']).optional(),
})

export const Route = createFileRoute('/api/public/kb-classify')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await requireAdmin(request)
        if (denied) return denied

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const salvo = normalizar(await getSetting('ia_sistema'))
        const provider: Provider = body.provider || salvo.provider
        const modelo = MODELOS[provider].includes(body.modelo || '')
          ? (body.modelo as string)
          : body.provider
            ? MODELOS[provider][0]!
            : salvo.model

        const system = [
          'Você organiza material de estudo para concursos.',
          'Receberá a lista oficial de tópicos de uma disciplina e vários trechos de material bruto.',
          'Tarefa ÚNICA: dizer a qual tópico da lista cada trecho pertence. NÃO reescreva, NÃO resuma, NÃO comente.',
          '- Use exatamente o texto de um tópico da lista.',
          '- Se o trecho não pertencer a nenhum tópico (capa, índice, propaganda, texto solto), devolva "topico": "".',
          'Responda SOMENTE com JSON válido: {"mapa":[{"i":<número do trecho>,"topico":"<tópico exato ou vazio>"}]}',
        ].join('\n')

        const user = [
          `Disciplina: ${body.disciplina}`,
          `Tópicos oficiais:\n${body.topicos.map((t) => `- ${t}`).join('\n')}`,
          'TRECHOS:',
          body.trechos.map((t) => `[${t.i}]\n${t.amostra}`).join('\n\n---\n\n'),
        ].join('\n\n')

        let raw = ''
        try {
          raw = await chat({ provider, model: modelo, system, user, keys: await aiKeys(), maxTokens: 4000 })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'A IA não conseguiu classificar o material.' }, { status: err.status || 502 })
        }

        const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)
        let parsed: { mapa?: Array<{ i: number; topico?: string }> }
        try {
          parsed = JSON.parse(json)
        } catch {
          return Response.json({ error: 'A IA retornou um formato inesperado. Tente novamente.' }, { status: 502 })
        }

        const validos = new Set(body.topicos)
        const mapa = (parsed.mapa || [])
          .filter((m) => m && Number.isInteger(m.i))
          .map((m) => ({ i: m.i, topico: m.topico && validos.has(m.topico) ? m.topico : '' }))

        return Response.json({ mapa, modelo, provider })
      },
    },
  },
})
