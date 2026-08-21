import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getSetting, aiKeys, requireAdmin } from '@/lib/px-server'
import { chat, normalizar, AIError, MODELOS, type Provider } from '@/lib/ai-gateway'

/* Identificador de aula: lê o material bruto de UMA aula e devolve
   o número da aula (Aula 00, 01, 02…) e o título limpo, sem reescrever o conteúdo. */
const Body = z.object({
  disciplina: z.string().min(1).max(200),
  texto: z.string().min(20).max(20000),
  nome_arquivo: z.string().max(300).optional(),
  aulas: z
    .array(z.object({ numero: z.number().int().min(0).max(999), titulo: z.string().max(300) }))
    .max(300)
    .optional(),
  provider: z.enum(['lovable', 'openai', 'gemini', 'anthropic']).optional(),
  modelo: z.string().max(80).optional(),
})

export const Route = createFileRoute('/api/public/kb-aula')({
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

        const existentes = body.aulas || []
        const usados = existentes.map((a) => a.numero)
        const proximo = usados.length ? Math.max(...usados) + 1 : 0

        const system = [
          'Você organiza material de curso para concursos em aulas numeradas.',
          'Receberá o começo do material de UMA aula e a lista de aulas já cadastradas na disciplina.',
          'Tarefa: identificar o NÚMERO da aula e o TÍTULO da aula. NÃO resuma, NÃO reescreva o conteúdo.',
          '- Se o material trouxer "Aula 03", "Aula 3 -", "Capítulo 3" ou equivalente, use esse número.',
          `- Se não houver número explícito, use ${proximo}.`,
          '- O título deve ser curto (máx. 90 caracteres), sem o prefixo "Aula NN" e sem numeração.',
          '- Não repita um título já existente: se for a mesma aula, devolva o mesmo número dela.',
          'Responda SOMENTE com JSON: {"numero":<inteiro>,"titulo":"<título>"}',
        ].join('\n')

        const user = [
          `Disciplina: ${body.disciplina}`,
          body.nome_arquivo ? `Arquivo: ${body.nome_arquivo}` : '',
          existentes.length
            ? `Aulas já cadastradas:\n${existentes.map((a) => `- Aula ${String(a.numero).padStart(2, '0')} - ${a.titulo}`).join('\n')}`
            : 'Nenhuma aula cadastrada ainda.',
          'MATERIAL (início):',
          body.texto.slice(0, 8000),
        ]
          .filter(Boolean)
          .join('\n\n')

        let raw = ''
        try {
          raw = await chat({ provider, model: modelo, system, user, keys: await aiKeys(), maxTokens: 300 })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'A IA não conseguiu identificar a aula.' }, { status: err.status || 502 })
        }

        let parsed: { numero?: number; titulo?: string } = {}
        try {
          parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1))
        } catch {
          return Response.json({ error: 'A IA retornou um formato inesperado. Tente novamente.' }, { status: 502 })
        }

        const numero =
          Number.isInteger(parsed.numero) && (parsed.numero as number) >= 0 && (parsed.numero as number) <= 999
            ? (parsed.numero as number)
            : proximo
        const titulo = String(parsed.titulo || '')
          .replace(/^\s*(aula|cap[íi]tulo)\s*\d+\s*[-–—:.]?\s*/i, '')
          .trim()
          .slice(0, 120)

        if (!titulo) return Response.json({ error: 'Não consegui identificar o título da aula.' }, { status: 422 })

        return Response.json({ numero, titulo, modelo, provider })
      },
    },
  },
})
