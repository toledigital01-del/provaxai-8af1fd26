import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/px-server'
import { MODELOS } from '@/lib/ai-gateway'

export const Route = createFileRoute('/api/public/ai-status')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = await requireAdmin(request)
        if (denied) return denied
        return Response.json({
          conectado: {
            lovable: !!process.env['LOVABLE_API_KEY'],
            openai: !!process.env['OPENAI_API_KEY'],
            gemini: !!process.env['GEMINI_API_KEY'],
            anthropic: !!process.env['ANTHROPIC_API_KEY'],
            elevenlabs: !!process.env['ELEVENLABS_API_KEY'],
          },
          modelos: MODELOS,
        })
      },
    },
  },
})
