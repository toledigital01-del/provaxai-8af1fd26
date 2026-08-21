import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { currentUser, getSetting, aiKeys } from '@/lib/px-server'

/* Narração por voz.
   Preferência: ElevenLabs (vozes multilíngues baratas — modelo flash v2.5).
   Se não houver chave válida do ElevenLabs, cai automaticamente na voz do
   Lovable AI, para que o áudio nunca fique indisponível para o aluno. */

const Body = z.object({
  texto: z.string().min(1).max(4000),
  voz: z.enum(['ana', 'rafael']).optional(),
  voice_id: z.string().max(60).optional(),
})

// Vozes escolhidas: baratas (flash v2.5) e com boa naturalidade em português.
const VOZES = {
  ana: { eleven: 'EXAVITQu4vr4xnSDxMaL', lovable: 'coral' }, // Sarah — feminina
  rafael: { eleven: 'JBFqnCBsd6RMkjVDRZzb', lovable: 'onyx' }, // George — masculina
} as const

const MP3 = { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' }

export const Route = createFileRoute('/api/public/tts')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await currentUser(request) // convidado também pode ouvir por enquanto

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const cfg = (await getSetting<{ ativo?: boolean; voice_id?: string; model?: string }>('voz_elevenlabs')) || {}
        if (cfg.ativo === false) return Response.json({ error: 'Narração por voz desativada.' }, { status: 503 })

        const perfil = VOZES[body.voz || 'ana']
        const keys = await aiKeys()

        // 1) ElevenLabs
        if (keys.elevenlabs) {
          const voice = body.voice_id || (body.voz ? perfil.eleven : cfg.voice_id || perfil.eleven)
          try {
            const r = await fetch(
              `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`,
              {
                method: 'POST',
                headers: { 'xi-api-key': keys.elevenlabs, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
                body: JSON.stringify({
                  text: body.texto,
                  model_id: cfg.model || 'eleven_flash_v2_5',
                  voice_settings: { stability: 0.45, similarity_boost: 0.8, speed: 1.0 },
                }),
              },
            )
            if (r.ok && r.body) return new Response(r.body, { headers: MP3 })
            console.error('ElevenLabs falhou', r.status, await r.text().catch(() => ''))
          } catch (e) {
            console.error('ElevenLabs indisponível', e)
          }
        }

        // 2) Lovable AI (fallback automático)
        const lov = keys.lovable || process.env['LOVABLE_API_KEY']
        if (!lov) return Response.json({ error: 'Narração por voz ainda não está conectada.' }, { status: 503 })
        const r2 = await fetch('https://ai.gateway.lovable.dev/v1/audio/speech', {
          method: 'POST',
          headers: { Authorization: `Bearer ${lov}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'openai/gpt-4o-mini-tts',
            input: body.texto,
            voice: perfil.lovable,
            response_format: 'mp3',
            stream_format: 'audio',
          }),
        })
        if (!r2.ok || !r2.body) {
          const detalhe = await r2.text().catch(() => '')
          console.error('TTS Lovable falhou', r2.status, detalhe)
          const msg =
            r2.status === 429
              ? 'Muitas gerações de áudio agora. Tente em instantes.'
              : r2.status === 402
                ? 'Os créditos de IA do app acabaram. Recarregue para continuar ouvindo.'
                : 'Não consegui gerar o áudio agora.'
          return Response.json({ error: msg }, { status: r2.status === 429 ? 429 : 502 })
        }
        return new Response(r2.body, { headers: MP3 })
      },
    },
  },
})
