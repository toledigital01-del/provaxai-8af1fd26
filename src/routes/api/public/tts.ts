import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { currentUser, getSetting } from '@/lib/px-server'

const Body = z.object({
  texto: z.string().min(1).max(4000),
  voice_id: z.string().max(60).optional(),
})

export const Route = createFileRoute('/api/public/tts')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await currentUser(request)
        if (!userId) return Response.json({ error: 'Entre na sua conta para ouvir o áudio.' }, { status: 401 })

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const key = process.env['ELEVENLABS_API_KEY']
        if (!key) return Response.json({ error: 'Narração por voz ainda não está conectada.' }, { status: 503 })

        const cfg = (await getSetting<{ ativo?: boolean; voice_id?: string; model?: string }>('voz_elevenlabs')) || {}
        if (cfg.ativo === false) return Response.json({ error: 'Narração por voz desativada.' }, { status: 503 })

        const voice = body.voice_id || cfg.voice_id || '9BWtsMINqrJLrRacOk9x'
        const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}`, {
          method: 'POST',
          headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
          body: JSON.stringify({ text: body.texto, model_id: cfg.model || 'eleven_turbo_v2_5' }),
        })
        if (!r.ok) return Response.json({ error: 'Não consegui gerar o áudio agora.' }, { status: 502 })
        return new Response(r.body, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } })
      },
    },
  },
})
