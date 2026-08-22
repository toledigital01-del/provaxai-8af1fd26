import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requireAdmin, currentUser } from '@/lib/px-server'
import { AIError } from '@/lib/ai-gateway'
import { agentChat } from '@/lib/ai-router'

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

        const system = [
          'Você é o copiloto administrativo do Prova X (plataforma de estudos para concursos).',
          'Fala com o ADMINISTRADOR da plataforma, nunca com o aluno. Você não é a Athena.',
          'Sua função: ajudar a montar e revisar o curso — conferir se o material cobre todo o edital,',
          'apontar tópicos sem material, sugerir como classificar documentos, orientar sobre os botões do painel',
          '(carregar edital, enviar material por texto/site/vídeo/documento/Drive, distribuir com IA, revisar e publicar).',
          'Responda em português do Brasil, curto e direto, em parágrafos de 2-4 linhas. Sem títulos markdown e sem emojis.',
          'Sempre que houver lacunas no contexto, entregue RECOMENDAÇÕES ACIONÁVEIS: uma linha por matéria, no formato',
          '"Matéria — tópicos que faltam: X, Y, Z. Anexar: <documento/trecho concreto>". Nomeie a fonte de forma específica',
          '(ex.: CTB arts. 161-255, Lei 9.784/1999, súmulas do STJ sobre o tema, apostila própria do capítulo, jurisprudência recente),',
          'nunca respostas genéricas como "adicione mais material". Priorize as matérias com mais tópicos descobertos e',
          'aponte também documentos já enviados que ainda estão sem tópico atribuído.',
          body.contexto ? `\n--- ESTADO ATUAL DO PAINEL ---\n${body.contexto}` : '',
        ].join('\n')

        const user = [
          ...(body.historico || []).map((m) => `${m.role === 'user' ? 'Admin' : 'Você'}: ${m.content}`),
          `Admin: ${body.pergunta}`,
        ].join('\n\n')

        try {
          const userId = await currentUser(request)
          const r = await agentChat({
            agent: 'assistente_admin',
            system,
            user,
            maxTokens: 2000,
            userId,
            ferramenta: 'admin_copilot',
          })
          return Response.json({ resposta: r.texto || 'Não consegui responder agora.', modelo: r.model })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'A IA não respondeu agora.' }, { status: err.status || 502 })
        }
      },
    },
  },
})
