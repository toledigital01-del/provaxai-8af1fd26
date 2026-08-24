import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { aiKeys, requirePedagogicalAdmin } from '@/lib/px-server'
import { chat, AIError, MODELOS, type Provider } from '@/lib/ai-gateway'
import { rotaDoAgente } from '@/lib/ai-router'

const Body = z.object({
  material: z.string().min(50).max(400000),
  cargo: z.string().max(160).optional(),
  banca: z.string().max(60).optional(),
  modelo: z.string().max(80).optional(),
  provider: z.enum(['lovable', 'openai', 'gemini', 'anthropic']).optional(),
  parte: z.number().int().min(1).max(20).optional(),
  total_partes: z.number().int().min(1).max(20).optional(),
})

type Topico = { nome: string; subtopicos?: string[] }
type Disciplina = { nome: string; area?: string; topicos?: Topico[] }

const limpar = (s: unknown, max: number) =>
  String(s ?? '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s•\-–—*]+/, '')
    .replace(/[;.,]\s*$/, '')
    .trim()
    .slice(0, max)

export const Route = createFileRoute('/api/public/kb-edital')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const salvo = await rotaDoAgente('assistente_admin')
        const provider: Provider = body.provider || salvo.provider
        const modelo = MODELOS[provider].includes(body.modelo || '')
          ? (body.modelo as string)
          : body.provider
            ? MODELOS[provider][0]!
            : salvo.model

        const banca = (body.banca || 'Cebraspe').trim()
        const cargo = (body.cargo || '').trim()
        const parte = body.parte || 1
        const totalPartes = body.total_partes || 1

        const system = [
          'Você extrai a grade de conteúdos programáticos de editais de concurso público com precisão absoluta.',
          'Receberá o texto bruto de um edital (ou um pedaço dele) e deve devolver a estrutura completa de disciplinas, tópicos e subtópicos.',
          'Regras obrigatórias:',
          '- Copie os nomes EXATAMENTE como estão no edital; não resuma, não traduza, não reescreva, não invente nada.',
          '- Remova apenas a numeração inicial ("1", "1.1", "I -", "a)") e a pontuação final.',
          '- Cada item separado por ponto e vírgula ou numeração vira um tópico/subtópico distinto.',
          '- Um item com desdobramentos numerados (1.1, 1.2) vira tópico com subtopicos.',
          '- Não crie disciplinas que não estejam no conteúdo programático (ignore cronograma, inscrição, remuneração, anexos administrativos).',
          '- Mantenha a ordem original do edital.',
          '- area: use "basica" para língua portuguesa, raciocínio lógico, informática e afins; "especifica" para as demais.',
          'Responda SOMENTE com JSON válido:',
          '{"disciplinas":[{"nome":"<disciplina>","area":"basica|especifica","topicos":[{"nome":"<tópico>","subtopicos":["<subtópico>"]}]}]}',
        ].join('\n')

        const user = [
          cargo ? `Cargo/Concurso: ${cargo}` : '',
          `Banca: ${banca}`,
          totalPartes > 1 ? `Este é o pedaço ${parte} de ${totalPartes} do edital. Extraia apenas o que aparece neste pedaço.` : '',
          `TEXTO DO EDITAL:\n${body.material}`,
        ]
          .filter(Boolean)
          .join('\n\n')

        let raw = ''
        try {
          raw = await chat({ provider, model: modelo, system, user, keys: await aiKeys(), maxTokens: 16000 })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'A IA não conseguiu ler o edital agora.' }, { status: err.status || 502 })
        }

        const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)
        let parsed: { disciplinas?: Disciplina[] }
        try {
          parsed = JSON.parse(json)
        } catch {
          return Response.json({ error: 'A IA retornou um formato inesperado. Tente novamente.' }, { status: 502 })
        }

        const disciplinas = (parsed.disciplinas || [])
          .map((d) => {
            const nome = limpar(d?.nome, 200)
            const vistos = new Set<string>()
            const topicos = (d?.topicos || [])
              .map((t) => {
                const tn = limpar(t?.nome, 300)
                const subs = (t?.subtopicos || [])
                  .map((s) => limpar(s, 300))
                  .filter((s) => s.length > 1)
                  .filter((s, i, arr) => arr.indexOf(s) === i)
                return { nome: tn, subtopicos: subs }
              })
              .filter((t) => t.nome.length > 1 && !vistos.has(t.nome.toLowerCase()) && vistos.add(t.nome.toLowerCase()))
            return { nome, area: d?.area === 'basica' ? 'basica' : 'especifica', topicos }
          })
          .filter((d) => d.nome.length > 1 && d.topicos.length > 0)

        if (!disciplinas.length)
          return Response.json({ error: 'Não encontrei conteúdo programático neste texto.' }, { status: 422 })

        const totalTopicos = disciplinas.reduce((a, d) => a + d.topicos.length, 0)
        const totalSub = disciplinas.reduce((a, d) => a + d.topicos.reduce((b, t) => b + t.subtopicos.length, 0), 0)
        return Response.json({ disciplinas, totais: { disciplinas: disciplinas.length, topicos: totalTopicos, subtopicos: totalSub }, modelo, provider })
      },
    },
  },
})
