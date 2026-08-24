import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requirePedagogicalAdmin } from '@/lib/px-server'

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

/* Lê imagens (foto de apostila, print, slide) transcrevendo com IA de visão. */
async function extractImagem(b64: string, mime: string): Promise<string> {
  const apiKey = process.env['LOVABLE_API_KEY']
  if (!apiKey) throw new Error('IA indisponível para ler imagens no momento.')
  const dataUrl = b64.startsWith('data:') ? b64 : `data:${mime || 'image/png'};base64,${b64}`
  const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Transcreva fielmente TODO o conteúdo textual desta imagem (apostila, slide, prova ou anotação) em Markdown simples, preservando títulos, listas, tabelas e fórmulas. Não resuma, não comente, não invente. Se não houver texto, responda apenas: SEM_TEXTO.',
            },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  })
  if (!r.ok) throw new Error('Não consegui ler a imagem agora. Tente novamente.')
  const data = (await r.json()) as any
  const texto = String(data?.choices?.[0]?.message?.content || '').trim()
  return /^SEM_TEXTO/i.test(texto) ? '' : texto
}

/* Lê qualquer arquivo de texto (txt, md, csv, json, html, srt, código…) sem etapa extra. */
function lerTextoDireto(bytes: Uint8Array, nome: string): string {
  const raw = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  return /\.html?$/i.test(nome) ? stripHtml(raw) : raw.replace(/\u0000/g, '').trim()
}

function ehImagem(nome: string, mime: string): boolean {
  return /^image\//i.test(mime || '') || /\.(png|jpe?g|webp|gif|bmp|heic|heif|tiff?)$/i.test(nome || '')
}

export const Route = createFileRoute('/api/public/kb-ingest')({
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

        try {
          const nome = body.nome || ''
          const mime = body.mime || ''

          if (body.tipo === 'texto') {
            return Response.json({ texto: (body.texto || '').trim(), origem: 'texto' })
          }
          if (body.tipo === 'imagem') {
            if (!body.arquivo_base64) return Response.json({ error: 'Imagem ausente.' }, { status: 400 })
            const texto = await extractImagem(body.arquivo_base64, mime)
            if (!texto) return Response.json({ error: 'Não encontrei texto legível nesta imagem.' }, { status: 422 })
            return Response.json({ texto, origem: nome || 'imagem' })
          }
          if (body.tipo === 'txt') {
            const raw = body.texto ?? (body.arquivo_base64 ? lerTextoDireto(base64ToBytes(body.arquivo_base64), nome) : '')
            return Response.json({ texto: raw.trim(), origem: nome || 'arquivo.txt' })
          }
          if (body.tipo === 'pdf' || body.tipo === 'auto') {
            if (!body.arquivo_base64) return Response.json({ error: 'Arquivo ausente.' }, { status: 400 })
            const bytes = base64ToBytes(body.arquivo_base64)

            if (body.tipo === 'auto' && ehImagem(nome, mime)) {
              const texto = await extractImagem(body.arquivo_base64, mime)
              if (!texto) return Response.json({ error: 'Não encontrei texto legível nesta imagem.' }, { status: 422 })
              return Response.json({ texto, origem: nome || 'imagem' })
            }

            const ehPdf = body.tipo === 'pdf' || /pdf/i.test(mime) || /\.pdf$/i.test(nome)
            if (ehPdf) {
              const texto = await extractPdf(bytes)
              if (texto) return Response.json({ texto, origem: nome || 'arquivo.pdf' })
              return Response.json(
                { error: 'Não consegui ler texto deste PDF (parece digitalizado). Envie as páginas como imagem que eu transcrevo.' },
                { status: 422 },
              )
            }

            const direto = lerTextoDireto(bytes, nome)
            if (direto) return Response.json({ texto: direto, origem: nome || 'arquivo' })
            return Response.json({ error: 'Não consegui ler este tipo de arquivo. Envie PDF, texto ou imagem.' }, { status: 422 })
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
