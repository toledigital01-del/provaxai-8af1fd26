import { createFileRoute } from '@tanstack/react-router'
import { requirePedagogicalAdmin, aiKeys } from '@/lib/px-server'
import { MODELOS } from '@/lib/ai-gateway'

export const Route = createFileRoute('/api/public/ai-status')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied
        const k = await aiKeys()
        return Response.json({
          conectado: {
            lovable: !!k.lovable,
            openai: !!k.openai,
            gemini: !!k.gemini,
            anthropic: !!k.anthropic,
            elevenlabs: !!k.elevenlabs,
          },
          modelos: MODELOS,
        })
      },
    },
  },
})
