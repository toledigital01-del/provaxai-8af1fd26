import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requireAdmin } from '@/lib/px-server'

/* Importação de pastas do Google Drive para a biblioteca da base de conhecimento.
   Usa o conector do Google Drive (gateway da Lovable) quando conectado; enquanto as
   credenciais não estiverem cadastradas, devolve uma mensagem clara para o admin. */

const Body = z.object({
  pasta_url: z.string().min(5).max(2000),
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).nullable().optional(),
})

const GATEWAY = 'https://connector-gateway.lovable.dev/google_drive/drive/v3'

type Arquivo = { id: string; name: string; mimeType: string; webViewLink?: string }

function pastaId(url: string): string | null {
  const m = url.match(/\/folders\/([A-Za-z0-9_-]+)/) || url.match(/[?&]id=([A-Za-z0-9_-]+)/)
  return m?.[1] ?? (/^[A-Za-z0-9_-]{10,}$/.test(url.trim()) ? url.trim() : null)
}

function headers(lovable: string, conn: string) {
  return { Authorization: `Bearer ${lovable}`, 'X-Connection-Api-Key': conn }
}

async function listar(id: string, h: Record<string, string>): Promise<Arquivo[]> {
  const out: Arquivo[] = []
  const pastas = [id]
  while (pastas.length) {
    const atual = pastas.shift()!
    const qs = new URLSearchParams({
      q: `'${atual}' in parents and trashed=false`,
      fields: 'files(id,name,mimeType,webViewLink)',
      pageSize: '1000',
    })
    const r = await fetch(`${GATEWAY}/files?${qs}`, { headers: h })
    if (!r.ok) throw new Error(`Google Drive respondeu ${r.status}: ${await r.text()}`)
    const j = (await r.json()) as { files?: Arquivo[] }
    for (const f of j.files || []) {
      if (f.mimeType === 'application/vnd.google-apps.folder') pastas.push(f.id)
      else out.push(f)
    }
  }
  return out
}

/* Baixa (ou exporta, no caso de Google Docs) o conteúdo textual de um arquivo. */
async function baixarTexto(f: Arquivo, h: Record<string, string>): Promise<string> {
  if (f.mimeType.startsWith('application/vnd.google-apps')) {
    if (f.mimeType !== 'application/vnd.google-apps.document') return ''
    const r = await fetch(`${GATEWAY}/files/${f.id}/export?mimeType=text/plain`, { headers: h })
    return r.ok ? (await r.text()).trim() : ''
  }
  const r = await fetch(`${GATEWAY}/files/${f.id}?alt=media`, { headers: h })
  if (!r.ok) return ''
  if (/pdf/i.test(f.mimeType)) {
    const { extractText, getDocumentProxy } = await import('unpdf')
    const doc = await getDocumentProxy(new Uint8Array(await r.arrayBuffer()))
    const { text } = await extractText(doc, { mergePages: true })
    return String(text || '').trim()
  }
  if (/^text\//i.test(f.mimeType) || /json|csv|markdown/i.test(f.mimeType)) return (await r.text()).trim()
  return ''
}

export const Route = createFileRoute('/api/public/kb-drive')({
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

        const lovable = process.env['LOVABLE_API_KEY']
        const conn = process.env['GOOGLE_DRIVE_API_KEY_1'] || process.env['GOOGLE_DRIVE_API_KEY']
        if (!lovable || !conn) {
          return Response.json(
            { error: 'O Google Drive ainda não está conectado. Conecte a conta do Google nas configurações para importar pastas.' },
            { status: 503 },
          )
        }

        const id = pastaId(body.pasta_url)
        if (!id) return Response.json({ error: 'Link de pasta do Google Drive inválido.' }, { status: 400 })

        try {
          const h = headers(lovable, conn)
          const arquivos = await listar(id, h)
          const out: Array<{ nome: string; origem_url: string; texto: string }> = []
          for (const f of arquivos) {
            const texto = await baixarTexto(f, h)
            if (texto) out.push({ nome: f.name, origem_url: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`, texto })
          }
          if (!out.length)
            return Response.json({ error: 'Nenhum arquivo legível encontrado nesta pasta (PDF, texto ou Google Docs).' }, { status: 422 })
          return Response.json({ arquivos: out })
        } catch (e) {
          return Response.json({ error: 'Falha ao ler a pasta do Drive: ' + (e as Error).message }, { status: 502 })
        }
      },
    },
  },
})
