import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const SUPABASE_URL = 'https://rdokrryisfkhmevcxlws.supabase.co'
const SUPABASE_KEY = 'sb_publishable_9ILwlXJNPJ5ZzpALdbmfBA_gRAtH4Qr'

const Body = z.object({
  tipo: z.enum(['pdf', 'txt', 'url', 'texto', 'video', 'imagem', 'auto']),
  nome: z.string().max(300).optional(),
  mime: z.string().max(120).optional(),
  url: z.string().max(2000).optional(),
  texto: z.string().max(400000).optional(),
  arquivo_base64: z.string().max(30_000_000).optional(),
})

async function requireAdmin(request: Request): Promise<{ ok: true; token: string } | { ok: false; res: Response }> {
  const auth = request.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) return { ok: false, res: Response.json({ error: 'Não autenticado.' }, { status: 401 }) }
  const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  })
  if (!u.ok) return { ok: false, res: Response.json({ error: 'Sessão inválida.' }, { status: 401 }) }
  const user = (await u.json()) as { id: string }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/has_role`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ _user_id: user.id, _role: 'admin' }),
  })
  const isAdmin = r.ok && (await r.json()) === true
  if (!isAdmin) return { ok: false, res: Response.json({ error: 'Acesso restrito a administradores.' }, { status: 403 }) }
  return { ok: true, token }
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.includes(',') ? b64.slice(b64.indexOf(',') + 1) : b64
  const bin = atob(clean)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function extractPdf(bytes: Uint8Array): Promise<string> {
  const { extractText, getDocumentProxy } = await import('unpdf')
  const doc = await getDocumentProxy(bytes)
  const { text } = await extractText(doc, { mergePages: true })
  return String(text || '').replace(/\n{3,}/g, '\n\n').trim()
}

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{6,})/)
  return m?.[1] ?? null
}

async function extractVideo(url: string): Promise<string> {
  const id = youtubeId(url)
  if (!id) return ''
  for (const lang of ['pt', 'pt-BR', 'en']) {
    try {
      const r = await fetch(`https://video.google.com/timedtext?lang=${lang}&v=${id}`)
      if (!r.ok) continue
      const xml = await r.text()
      if (!xml.trim()) continue
      const parts = [...xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map((m) => stripHtml(m[1] || ''))
      if (parts.length) return parts.join(' ').replace(/\s{2,}/g, ' ').trim()
    } catch {
      /* tenta próximo idioma */
    }
  }
  return ''
}

export const Route = createFileRoute('/api/public/kb-ingest')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const gate = await requireAdmin(request)
        if (!gate.ok) return gate.res

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        try {
          if (body.tipo === 'texto') {
            return Response.json({ texto: (body.texto || '').trim(), origem: 'texto' })
          }
          if (body.tipo === 'txt') {
            const raw = body.texto ?? (body.arquivo_base64 ? new TextDecoder().decode(base64ToBytes(body.arquivo_base64)) : '')
            return Response.json({ texto: raw.trim(), origem: body.nome || 'arquivo.txt' })
          }
          if (body.tipo === 'pdf') {
            if (!body.arquivo_base64) return Response.json({ error: 'Arquivo ausente.' }, { status: 400 })
            const texto = await extractPdf(base64ToBytes(body.arquivo_base64))
            if (!texto) return Response.json({ error: 'Não consegui ler texto deste PDF (pode ser digitalizado/imagem).' }, { status: 422 })
            return Response.json({ texto, origem: body.nome || 'arquivo.pdf' })
          }
          if (body.tipo === 'url') {
            if (!body.url) return Response.json({ error: 'Informe o endereço do site.' }, { status: 400 })
            const r = await fetch(body.url, { headers: { 'User-Agent': 'Mozilla/5.0 ProvaXBot' } })
            if (!r.ok) return Response.json({ error: 'Não consegui acessar esse endereço.' }, { status: 422 })
            const ct = r.headers.get('content-type') || ''
            if (ct.includes('application/pdf')) {
              const texto = await extractPdf(new Uint8Array(await r.arrayBuffer()))
              return Response.json({ texto, origem: body.url })
            }
            const texto = stripHtml(await r.text())
            if (!texto) return Response.json({ error: 'A página não retornou texto legível.' }, { status: 422 })
            return Response.json({ texto, origem: body.url })
          }
          // vídeo
          if (!body.url) return Response.json({ error: 'Informe o link do vídeo.' }, { status: 400 })
          const texto = await extractVideo(body.url)
          if (!texto)
            return Response.json(
              { error: 'Não encontrei legendas/transcrição neste vídeo. Cole a transcrição como texto.' },
              { status: 422 },
            )
          return Response.json({ texto, origem: body.url })
        } catch (e) {
          return Response.json({ error: 'Falha ao processar o material: ' + (e as Error).message }, { status: 500 })
        }
      },
    },
  },
})
