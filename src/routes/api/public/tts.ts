import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { currentUser, getSetting, aiKeys, serviceHeaders, SUPABASE_URL } from '@/lib/px-server'

/* Narração por voz com CACHE PERMANENTE.
   Cada trecho (texto + voz + modelo) é gerado UMA única vez no ElevenLabs e o
   MP3 fica guardado no storage. Todas as reproduções seguintes — do mesmo
   aluno ou de qualquer outro — saem do cache, sem custo novo de narração.
   Se o ElevenLabs não estiver conectado ou falhar, cai na voz do Lovable AI
   para que o áudio nunca fique indisponível. */

const Body = z.object({
  texto: z.string().min(1).max(4000),
  voz: z.enum(['ana', 'rafael']).optional(),
  voice_id: z.string().max(60).optional(),
})

// Vozes escolhidas: naturais em português e no modelo mais barato (flash v2.5).
const VOZES = {
  ana: { eleven: 'EXAVITQu4vr4xnSDxMaL', lovable: 'coral' }, // Sarah — feminina
  rafael: { eleven: 'JBFqnCBsd6RMkjVDRZzb', lovable: 'onyx' }, // George — masculina
} as const

const MP3 = { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=31536000, immutable' }
const BUCKET = 'tts-cache'

async function sha256(txt: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const caminhoDe = (hash: string) => `${hash.slice(0, 2)}/${hash}.mp3`

/** Busca o MP3 já narrado antes (custo zero). */
async function doCache(hash: string): Promise<Response | null> {
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${caminhoDe(hash)}`, {
    headers: serviceHeaders(),
  }).catch(() => null)
  if (!r || !r.ok || !r.body) return null
  // marca o reaproveitamento (best-effort, não bloqueia o áudio)
  fetch(`${SUPABASE_URL}/rest/v1/rpc/noop`, { method: 'POST', headers: serviceHeaders() }).catch(() => {})
  return new Response(r.body, { headers: { ...MP3, 'X-Px-Cache': 'hit' } })
}

/** Guarda o áudio gerado para nunca mais pagar por este mesmo trecho. */
async function guardar(hash: string, voz: string, texto: string, provedor: string, bytes: ArrayBuffer) {
  try {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${caminhoDe(hash)}`, {
      method: 'POST',
      headers: serviceHeaders({ 'Content-Type': 'audio/mpeg', 'x-upsert': 'true' }),
      body: bytes,
    })
    await fetch(`${SUPABASE_URL}/rest/v1/tts_cache?on_conflict=hash`, {
      method: 'POST',
      headers: serviceHeaders({
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      }),
      body: JSON.stringify({
        hash,
        voz,
        caracteres: texto.length,
        caminho: caminhoDe(hash),
        provedor,
      }),
    })
  } catch {
    /* cache é best-effort */
  }
}

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

        const vozNome = body.voz || 'ana'
        const perfil = VOZES[vozNome]
        const keys = await aiKeys()
        const modelo = cfg.model || 'eleven_flash_v2_5'
        const voice = body.voice_id || (body.voz ? perfil.eleven : cfg.voice_id || perfil.eleven)
        const texto = body.texto.trim().replace(/\s+/g, ' ')

        // 0) Cache — o mesmo trecho na mesma voz nunca é narrado duas vezes.
        const hash = await sha256(`${voice}|${modelo}|${texto}`)
        const cache = await doCache(hash)
        if (cache) return cache

        // 1) ElevenLabs (modelo flash: o mais barato com ótima naturalidade)
        if (keys.elevenlabs) {
          try {
            const r = await fetch(
              `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`,
              {
                method: 'POST',
                headers: { 'xi-api-key': keys.elevenlabs, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
                body: JSON.stringify({
                  text: texto,
                  model_id: modelo,
                  voice_settings: { stability: 0.45, similarity_boost: 0.8, speed: 1.0 },
                }),
              },
            )
            if (r.ok) {
              const bytes = await r.arrayBuffer()
              await guardar(hash, vozNome, texto, 'elevenlabs', bytes)
              return new Response(bytes, { headers: { ...MP3, 'X-Px-Cache': 'miss' } })
            }
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
            input: texto,
            voice: perfil.lovable,
            response_format: 'mp3',
            stream_format: 'audio',
          }),
        })
        if (!r2.ok) {
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
        const bytes2 = await r2.arrayBuffer()
        await guardar(hash, vozNome, texto, 'lovable', bytes2)
        return new Response(bytes2, { headers: { ...MP3, 'X-Px-Cache': 'miss' } })
      },
    },
  },
})
