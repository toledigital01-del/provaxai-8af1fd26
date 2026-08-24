import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requirePedagogicalAdmin } from '@/lib/px-server'
import { buscarTrechos, configRag, escopoDesatualizado, escopoIndexado } from '@/lib/rag'

/* Pré-visualização do RAG (somente admin): mostra exatamente quais trechos
   a Athena receberia para uma pergunta, com a similaridade de cada um,
   sem chamar o modelo de chat e sem gastar a pergunta do aluno. */

const Body = z.object({
  curso: z.string().min(1).max(80),
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).optional().nullable(),
  pergunta: z.string().min(3).max(2000),
})

export const Route = createFileRoute('/api/public/rag-preview')({
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

        const cfg = await configRag(body.curso, body.disciplina)
        const [indexado, desatualizado] = await Promise.all([
          escopoIndexado(body.curso, body.disciplina),
          escopoDesatualizado(body.curso, body.disciplina),
        ])
        if (!indexado) {
          return Response.json({
            cfg,
            indexado: false,
            desatualizado: true,
            trechos: [],
            aviso: 'Esta disciplina ainda não foi indexada. Na primeira pergunta real a Athena indexa automaticamente — ou abra o relatório de RAG para indexar agora.',
          })
        }

        const trechos = await buscarTrechos({
          pergunta: body.pergunta,
          curso: body.curso,
          disciplina: body.disciplina,
          topico: body.topico,
          max: cfg.topK,
          threshold: cfg.threshold,
        })

        let usado = 0
        const fontes = trechos.map((t, i) => {
          const dentroDoLimite = usado + t.trecho.length <= cfg.maxChars
          if (dentroDoLimite) usado += t.trecho.length
          return {
            n: i + 1,
            titulo: t.titulo || t.topico || t.disciplina,
            disciplina: t.disciplina,
            topico: t.topico,
            similaridade: Math.round(t.similarity * 100),
            caracteres: t.trecho.length,
            entraNoContexto: dentroDoLimite,
            trecho: t.trecho.slice(0, 600),
          }
        })

        return Response.json({
          cfg,
          indexado: true,
          desatualizado,
          contextoUsado: usado,
          trechos: fontes,
          aviso: desatualizado
            ? 'Há material mais novo que o índice — a Athena reindexa sozinha na próxima pergunta, então o resultado real pode ser ainda melhor.'
            : fontes.length
              ? null
              : 'Nenhum trecho passou no corte de similaridade. Na prática a Athena cairia no modo clássico (leitura direta dos documentos).',
        })
      },
    },
  },
})
