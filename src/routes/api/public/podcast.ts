import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getSetting, aiKeys, currentUser, usosHoje, registrarUsoIA } from '@/lib/px-server'
import { materialIntegral } from '@/lib/kb-context'
import { chat, normalizar, AIError } from '@/lib/ai-gateway'

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).optional().nullable(),
  curso: z.string().max(80).optional(),
})

type Fala = { who: string; texto: string }

function extrairRoteiro(txt: string): Fala[] {
  const bruto = txt.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  const ini = bruto.indexOf('[')
  const fim = bruto.lastIndexOf(']')
  if (ini < 0 || fim <= ini) return []
  try {
    const arr = JSON.parse(bruto.slice(ini, fim + 1)) as Array<{ who?: string; texto?: string }>
    return arr
      .filter((f) => f && typeof f.texto === 'string' && f.texto.trim())
      .map((f) => ({ who: f.who === 'Rafael' ? 'Rafael' : 'Ana', texto: String(f.texto).trim() }))
      .slice(0, 10)
  } catch {
    return []
  }
}

export const Route = createFileRoute('/api/public/podcast')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await currentUser(request) // null = convidado (liberado por enquanto)

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        const cfg = normalizar(await getSetting('ia_athena'))
        const limite = cfg.limiteDiario ?? 0
        if (userId && limite > 0 && (await usosHoje(userId, 'podcast')) >= limite)
          return Response.json({ error: `Você atingiu o limite de ${limite} episódios hoje. Volte amanhã.` }, { status: 429 })

        const base = await materialIntegral(curso, body.disciplina, body.topico || null)

        const system = [
          'Você roteiriza um podcast de estudos para concursos da plataforma Prova X, em português do Brasil.',
          'Dois apresentadores conversam: Ana (professora, começa o episódio) e Rafael (aluno curioso que provoca perguntas).',
          'O episódio deve cobrir A MATÉRIA INTEIRA do material abaixo, de forma progressiva: abertura, conceitos-base,',
          'desenvolvimento por partes, exemplos, pegadinhas da banca Cebraspe e um fechamento com revisão rápida.',
          'Escreva de 8 a 10 falas alternadas, cada uma com 3 a 5 frases, tom de conversa real e didática.',
          'Não invente lei, prazo, número ou julgado que não esteja no material. Não cite "o material" nem "o PDF".',
          'Responda SOMENTE com um JSON válido no formato [{"who":"Ana","texto":"..."},{"who":"Rafael","texto":"..."}] — sem markdown, sem comentários.',
          base
            ? '\n--- MATERIAL DA MATÉRIA ---\n' + base
            : 'ATENÇÃO: ainda não há material cadastrado para esta matéria. Diga isso na primeira fala e faça um episódio curto e geral.',
        ].join('\n')

        try {
          const saida = await chat({
            provider: cfg.provider,
            model: cfg.model,
            system,
            user: `Disciplina: ${body.disciplina}${body.topico ? ` | Tópico em foco: ${body.topico}` : ''}\n\nGere o roteiro completo em JSON.`,
            keys: await aiKeys(),
            maxTokens: 3000,
          })
          const roteiro = extrairRoteiro(saida || '')
          if (userId) await registrarUsoIA({
            user_id: userId,
            ferramenta: 'podcast',
            modelo: cfg.model,
            discipline_nome: body.disciplina,
            topic_nome: body.topico ?? null,
            pergunta: 'podcast',
            resposta: saida || '',
          })
          if (!roteiro.length) return Response.json({ error: 'Não consegui gerar o episódio agora.' }, { status: 502 })
          return Response.json({ roteiro, fontes: base ? 1 : 0, modelo: cfg.model })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'Não consegui gerar o episódio agora.' }, { status: err.status || 502 })
        }
      },
    },
  },
})
