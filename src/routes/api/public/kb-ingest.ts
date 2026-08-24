import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requirePedagogicalAdmin, SUPABASE_URL, serviceHeaders } from '@/lib/px-server'
import { extrairPdf, type ResultadoExtracao } from '@/lib/kb-extract'

const Body = z.object({
  tipo: z.enum(['pdf', 'txt', 'url', 'texto', 'video', 'imagem', 'auto']),
  nome: z.string().max(300).optional(),
  mime: z.string().max(120).optional(),
  url: z.string().max(2000).optional(),
  texto: z.string().max(400000).optional(),
  arquivo_base64: z.string().max(30_000_000).optional(),
  /* Quando informada, o texto extraído já é guardado na biblioteca da matéria
     para revisão/edição antes de publicar a aula. */
  disciplina: z.string().max(200).optional(),
  topico: z.string().max(300).optional(),
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

const limpaB64 = (b64: string) => (b64.includes(',') ? b64.slice(b64.indexOf(',') + 1) : b64)

const PROMPT_TRANSCRICAO =
  'Transcreva fielmente TODO o conteúdo textual deste documento em Markdown simples, preservando títulos, listas, tabelas e fórmulas, na ordem das páginas. Não resuma, não comente, não invente. Se realmente não houver texto legível, responda apenas: SEM_TEXTO.'

/** Chamada única de visão no gateway (PDF ou imagem). */
async function visaoIA(dataUrl: string, modelo: string): Promise<string> {
  const apiKey = process.env['LOVABLE_API_KEY']
  if (!apiKey) return ''
  const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelo,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: PROMPT_TRANSCRICAO },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  })
  if (!r.ok) return ''
  const data = (await r.json()) as any
  return String(data?.choices?.[0]?.message?.content || '').trim()
}

/** Camada de texto nativa do PDF + número de páginas (para medir a qualidade). */
async function camadaTextoPdf(bytes: Uint8Array): Promise<{ texto: string; paginas: number }> {
  const { extractText, getDocumentProxy } = await import('unpdf')
  const doc = await getDocumentProxy(bytes)
  const { text } = await extractText(doc, { mergePages: true })
  return {
    texto: String(text || '').replace(/\n{3,}/g, '\n\n').trim(),
    paginas: Number((doc as any)?.numPages) || 1,
  }
}

async function processarPdf(b64: string, bytes: Uint8Array): Promise<ResultadoExtracao> {
  const clean = limpaB64(b64)
  const grande = clean.length > 14_000_000
  return extrairPdf({
    lerCamadaTexto: () => camadaTextoPdf(bytes),
    transcrever: async (modelo) => (grande ? '' : visaoIA(`data:application/pdf;base64,${clean}`, modelo)),
  })
}

async function processarImagem(b64: string, mime: string): Promise<ResultadoExtracao> {
  const dataUrl = b64.startsWith('data:') ? b64 : `data:${mime || 'image/png'};base64,${b64}`
  return extrairPdf({
    lerCamadaTexto: async () => ({ texto: '', paginas: 1 }),
    transcrever: (modelo) => visaoIA(dataUrl, modelo),
  })
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

/* Lê qualquer arquivo de texto (txt, md, csv, json, html, srt, código…). */
function lerTextoDireto(bytes: Uint8Array, nome: string): string {
  const raw = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  return /\.html?$/i.test(nome) ? stripHtml(raw) : raw.replace(/\u0000/g, '').trim()
}

function ehImagem(nome: string, mime: string): boolean {
  return /^image\//i.test(mime || '') || /\.(png|jpe?g|webp|gif|bmp|heic|heif|tiff?)$/i.test(nome || '')
}

/** Guarda o texto extraído na biblioteca da matéria (revisão antes de publicar). */
async function salvarNaBiblioteca(reg: {
  disciplina?: string
  topico?: string
  nome: string
  tipo: string
  origem_url?: string
  texto: string
}): Promise<string | null> {
  if (!reg.disciplina || !reg.texto) return null
  try {
    const linha = {
      course_slug: 'prf-2021',
      discipline_nome: reg.disciplina,
      topic_nome: reg.topico || null,
      nome_arquivo: reg.nome || 'material',
      tipo: reg.tipo,
      origem_url: reg.origem_url || null,
      texto_extraido: reg.texto,
      status_direitos: 'material_proprio',
    }
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/kb_documentos${reg.origem_url ? '?on_conflict=course_slug,origem_url' : ''}`,
      {
        method: 'POST',
        headers: serviceHeaders({
          'Content-Type': 'application/json',
          Prefer: reg.origem_url ? 'resolution=merge-duplicates,return=representation' : 'return=representation',
        }),
        body: JSON.stringify(linha),
      },
    )
    if (!r.ok) return null
    const rows = (await r.json()) as Array<{ id: string }>
    return rows?.[0]?.id ?? null
  } catch {
    return null
  }
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

        const nome = body.nome || ''
        const mime = body.mime || ''

        /* Resposta única para todos os caminhos: extrai, guarda e devolve. */
        const responder = async (
          texto: string,
          origem: string,
          tipo: string,
          extra: Record<string, unknown> = {},
        ) => {
          const doc_id = await salvarNaBiblioteca({
            disciplina: body.disciplina,
            topico: body.topico,
            nome: origem,
            tipo,
            origem_url: /^https?:\/\//i.test(origem) ? origem : undefined,
            texto,
          })
          return Response.json({ texto, origem, doc_id, salvo: !!doc_id, ...extra })
        }

        try {
          if (body.tipo === 'texto') {
            const t = (body.texto || '').trim()
            if (!t) return Response.json({ error: 'Nenhum texto informado.' }, { status: 400 })
            return responder(t, nome || 'texto colado', 'texto')
          }

          if (body.tipo === 'imagem' || (body.tipo === 'auto' && ehImagem(nome, mime))) {
            if (!body.arquivo_base64) return Response.json({ error: 'Imagem ausente.' }, { status: 400 })
            const r = await processarImagem(body.arquivo_base64, mime)
            if (!r.texto)
              return Response.json({ error: 'Não encontrei texto legível nesta imagem.' }, { status: 422 })
            return responder(r.texto, nome || 'imagem', 'imagem', { ocr: true, qualidade: r.qualidade })
          }

          if (body.tipo === 'txt') {
            const raw =
              body.texto ??
              (body.arquivo_base64 ? lerTextoDireto(base64ToBytes(body.arquivo_base64), nome) : '')
            if (!raw.trim()) return Response.json({ error: 'Arquivo de texto vazio.' }, { status: 422 })
            return responder(raw.trim(), nome || 'arquivo.txt', 'texto')
          }

          if (body.tipo === 'pdf' || body.tipo === 'auto') {
            if (!body.arquivo_base64) return Response.json({ error: 'Arquivo ausente.' }, { status: 400 })
            const bytes = base64ToBytes(body.arquivo_base64)
            const ehPdf = body.tipo === 'pdf' || /pdf/i.test(mime) || /\.pdf$/i.test(nome)

            if (ehPdf) {
              const r = await processarPdf(body.arquivo_base64, bytes)
              if (!r.texto)
                return Response.json(
                  {
                    error:
                      'Não consegui ler texto deste PDF (parece digitalizado e a transcrição por IA falhou). Envie as páginas como imagem.',
                  },
                  { status: 422 },
                )
              return responder(r.texto, nome || 'arquivo.pdf', 'pdf', {
                ocr: r.qualidade === 'ocr',
                qualidade: r.qualidade,
              })
            }

            const direto = lerTextoDireto(bytes, nome)
            if (direto) return responder(direto, nome || 'arquivo', 'texto')
            return Response.json(
              { error: 'Não consegui ler este tipo de arquivo. Envie PDF, texto ou imagem.' },
              { status: 422 },
            )
          }

          if (body.tipo === 'url') {
            if (!body.url) return Response.json({ error: 'Informe o endereço do site.' }, { status: 400 })
            const r = await fetch(body.url, { headers: { 'User-Agent': 'Mozilla/5.0 ProvaXBot' } })
            if (!r.ok) return Response.json({ error: 'Não consegui acessar esse endereço.' }, { status: 422 })
            const ct = r.headers.get('content-type') || ''
            if (ct.includes('application/pdf')) {
              const bytes = new Uint8Array(await r.arrayBuffer())
              const res = await extrairPdf({
                lerCamadaTexto: () => camadaTextoPdf(bytes),
                transcrever: async () => '',
              })
              if (!res.texto)
                return Response.json({ error: 'O PDF deste endereço não tem texto legível.' }, { status: 422 })
              return responder(res.texto, body.url, 'pdf')
            }
            const texto = stripHtml(await r.text())
            if (!texto) return Response.json({ error: 'A página não retornou texto legível.' }, { status: 422 })
            return responder(texto, body.url, 'url')
          }

          // vídeo
          if (!body.url) return Response.json({ error: 'Informe o link do vídeo.' }, { status: 400 })
          const texto = await extractVideo(body.url)
          if (!texto)
            return Response.json(
              { error: 'Não encontrei legendas/transcrição neste vídeo. Cole a transcrição como texto.' },
              { status: 422 },
            )
          return responder(texto, body.url, 'video')
        } catch (e) {
          return Response.json({ error: 'Falha ao processar o material: ' + (e as Error).message }, { status: 500 })
        }
      },
    },
  },
})
