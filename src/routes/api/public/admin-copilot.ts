import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getSetting, aiKeys, requireAdmin } from '@/lib/px-server'
import { chat, normalizar, AIError } from '@/lib/ai-gateway'

/* Copiloto do painel administrativo. IA separada da Athena (usa a config "ia_sistema"):
   ajuda o admin a organizar o edital, cobrir tópicos e operar a base de conhecimento. */
const Body = z.object({
  pergunta: z.string().min(1).max(4000),
  contexto: z.string().max(20000).optional(),
  historico: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(4000) }))
    .max(10)
    .optional(),
})

export const Route = createFileRoute('/api/public/admin-copilot')({
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

        const cfg = normalizar(await getSetting('ia_sistema'))

        const system = [
          'Você é o copiloto administrativo do Prova X (plataforma de estudos para concursos).',
          'Fala com o ADMINISTRADOR da plataforma, nunca com o aluno. Você não é a Athena.',
          'Sua função: ajudar a montar e revisar o curso — conferir se o material cobre todo o edital,',
          'apontar tópicos sem material, sugerir como classificar documentos, orientar sobre os botões do painel',
          '(carregar edital, enviar material por texto/site/vídeo/documento/Drive, distribuir com IA, revisar e publicar).',
          'Responda em português do Brasil, curto e direto, em parágrafos de 2-4 linhas. Sem títulos markdown e sem emojis.',
          'Quando houver lacunas de cobertura no contexto abaixo, cite as matérias e tópicos concretos que faltam.',
          body.contexto ? `\n--- ESTADO ATUAL DO PAINEL ---\n${body.contexto}` : '',
        ].join('\n')

        const user = [
          ...(body.historico || []).map((m) => `${m.role === 'user' ? 'Admin' : 'Você'}: ${m.content}`),
          `Admin: ${body.pergunta}`,
        ].join('\n\n')

        try {
          const resposta = await chat({
            provider: cfg.provider,
            model: cfg.model,
            system,
            user,
            keys: await aiKeys(),
            maxTokens: 2000,
          })
          return Response.json({ resposta: resposta || 'Não consegui responder agora.', modelo: cfg.model })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'A IA não respondeu agora.' }, { status: err.status || 502 })
        }
      },
    },
  },
})
