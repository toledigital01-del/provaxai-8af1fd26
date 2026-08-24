import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requirePedagogicalAdmin } from '@/lib/px-server'

/* Importação do Google Drive para a biblioteca da base de conhecimento.
   Aceita link de pasta, link de arquivo único ou o próprio ID.
   Usa o conector do Google Drive (gateway da Lovable). Quando há mais de uma
   conta conectada, tenta cada credencial até uma conseguir ler a pasta. */

const Body = z.object({
  pasta_url: z.string().min(5).max(2000),
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).nullable().optional(),
})

const GATEWAY = 'https://connector-gateway.lovable.dev/google_drive/drive/v3'

type Arquivo = { id: string; name: string; mimeType: string; webViewLink?: string }

/** Extrai o ID de pasta (ou arquivo) de qualquer formato de link do Drive. */
function driveId(url: string): { id: string; arquivo: boolean } | null {
  const u = url.trim()
  const folder = u.match(/\/folders\/([A-Za-z0-9_-]{10,})/)
  if (folder?.[1]) return { id: folder[1], arquivo: false }
  const file = u.match(/\/(?:file|document|spreadsheets|presentation)\/d\/([A-Za-z0-9_-]{10,})/)
  if (file?.[1]) return { id: file[1], arquivo: true }
  const qid = u.match(/[?&]id=([A-Za-z0-9_-]{10,})/)
  if (qid?.[1]) return { id: qid[1], arquivo: false }
  if (/^[A-Za-z0-9_-]{10,}$/.test(u)) return { id: u, arquivo: false }
  return null
}

function headers(lovable: string, conn: string) {
  return { Authorization: `Bearer ${lovable}`, 'X-Connection-Api-Key': conn }
}

/* Parâmetros que fazem o Drive enxergar também drives compartilhados. */
const DRIVE_COMUM = {
  supportsAllDrives: 'true',
  includeItemsFromAllDrives: 'true',
}

async function meta(id: string, h: Record<string, string>): Promise<Arquivo> {
  const qs = new URLSearchParams({ fields: 'id,name,mimeType,webViewLink', ...DRIVE_COMUM })
  const r = await fetch(`${GATEWAY}/files/${id}?${qs}`, { headers: h })
  if (!r.ok) throw new Error(`Google Drive respondeu ${r.status}: ${(await r.text()).slice(0, 300)}`)
  return (await r.json()) as Arquivo
}

async function listar(id: string, h: Record<string, string>): Promise<Arquivo[]> {
  const out: Arquivo[] = []
  const pastas = [id]
  const vistos = new Set<string>()
  while (pastas.length) {
    const atual = pastas.shift()!
    if (vistos.has(atual)) continue
    vistos.add(atual)
    let pageToken: string | undefined
    do {
      const qs = new URLSearchParams({
        q: `'${atual}' in parents and trashed=false`,
        fields: 'nextPageToken,files(id,name,mimeType,webViewLink)',
        pageSize: '200',
        corpora: 'allDrives',
        ...DRIVE_COMUM,
      })
      if (pageToken) qs.set('pageToken', pageToken)
      const r = await fetch(`${GATEWAY}/files?${qs}`, { headers: h })
      if (!r.ok) throw new Error(`Google Drive respondeu ${r.status}: ${(await r.text()).slice(0, 300)}`)
      const j = (await r.json()) as { files?: Arquivo[]; nextPageToken?: string }
      for (const f of j.files || []) {
        if (f.mimeType === 'application/vnd.google-apps.folder') pastas.push(f.id)
        else out.push(f)
      }
      pageToken = j.nextPageToken
    } while (pageToken)
  }
  return out
}

const EXPORT_MIME: Record<string, string> = {
  'application/vnd.google-apps.document': 'text/plain',
  'application/vnd.google-apps.presentation': 'text/plain',
  'application/vnd.google-apps.spreadsheet': 'text/csv',
}

/* Baixa (ou exporta, no caso dos formatos Google) o conteúdo textual de um arquivo. */
async function baixarTexto(f: Arquivo, h: Record<string, string>): Promise<string> {
  if (f.mimeType.startsWith('application/vnd.google-apps')) {
    const alvo = EXPORT_MIME[f.mimeType]
    if (!alvo) return ''
    const qs = new URLSearchParams({ mimeType: alvo, ...DRIVE_COMUM })
    const r = await fetch(`${GATEWAY}/files/${f.id}/export?${qs}`, { headers: h })
    return r.ok ? (await r.text()).trim() : ''
  }
  const qs = new URLSearchParams({ alt: 'media', ...DRIVE_COMUM })
  const r = await fetch(`${GATEWAY}/files/${f.id}?${qs}`, { headers: h })
  if (!r.ok) return ''
  if (/pdf/i.test(f.mimeType) || /\.pdf$/i.test(f.name)) {
    try {
      const { extractText, getDocumentProxy } = await import('unpdf')
      const doc = await getDocumentProxy(new Uint8Array(await r.arrayBuffer()))
      const { text } = await extractText(doc, { mergePages: true })
      return String(text || '').trim()
    } catch {
      return ''
    }
  }
  if (/^text\//i.test(f.mimeType) || /json|csv|markdown|xml|html/i.test(f.mimeType) || /\.(txt|md|csv|json|srt|vtt)$/i.test(f.name))
    return (await r.text()).trim()
  return ''
}

export const Route = createFileRoute('/api/public/kb-drive')({
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

        const lovable = process.env['LOVABLE_API_KEY']
        const chaves = [process.env['GOOGLE_DRIVE_API_KEY_1'], process.env['GOOGLE_DRIVE_API_KEY']].filter(
          (k): k is string => !!k,
        )
        if (!lovable || !chaves.length) {
          return Response.json(
            { error: 'O Google Drive ainda não está conectado. Conecte a conta do Google nas configurações para importar pastas.' },
            { status: 503 },
          )
        }

        const alvo = driveId(body.pasta_url)
        if (!alvo) return Response.json({ error: 'Link do Google Drive inválido. Copie o endereço da pasta ou do arquivo.' }, { status: 400 })

        let ultimoErro = ''
        for (const conn of chaves) {
          const h = headers(lovable, conn)
          try {
            let arquivos: Arquivo[]
            if (alvo.arquivo) {
              arquivos = [await meta(alvo.id, h)]
            } else {
              const info = await meta(alvo.id, h)
              arquivos =
                info.mimeType === 'application/vnd.google-apps.folder' ? await listar(alvo.id, h) : [info]
            }
            const out: Array<{ nome: string; origem_url: string; texto: string }> = []
            for (const f of arquivos) {
              const texto = await baixarTexto(f, h)
              if (texto) out.push({ nome: f.name, origem_url: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`, texto })
            }
            if (!out.length)
              return Response.json(
                {
                  error:
                    'Encontrei ' +
                    arquivos.length +
                    ' arquivo(s), mas nenhum com texto legível (PDF, texto, Google Docs/Planilhas/Apresentações).',
                },
                { status: 422 },
              )
            return Response.json({ arquivos: out, total: arquivos.length })
          } catch (e) {
            ultimoErro = (e as Error).message
          }
        }
        return Response.json(
          {
            error:
              'Não consegui ler esta pasta com as contas do Google conectadas. Verifique se ela está compartilhada com a conta conectada. Detalhe: ' +
              ultimoErro,
          },
          { status: 502 },
        )
      },
    },
  },
})
