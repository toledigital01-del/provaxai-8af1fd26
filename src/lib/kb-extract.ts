/* Extração de material (PDF, imagem, texto) com transcrição por IA para PDFs
   digitalizados. Lógica pura e testável: as dependências (leitura do PDF e
   transcrição por IA) são injetadas. */

export type Qualidade = 'texto' | 'ocr' | 'vazio'

export type ResultadoExtracao = {
  texto: string
  qualidade: Qualidade
  tentativas: string[]
}

/** Modelos de visão, do mais rápido ao mais robusto (PDFs ruins/tortos). */
export const MODELOS_TRANSCRICAO = [
  'google/gemini-3-flash-preview',
  'google/gemini-3.1-pro-preview',
] as const

/** Mínimo de caracteres para considerar que o PDF realmente tem camada de texto. */
export const MIN_CHARS = 200

/**
 * Um PDF escaneado costuma devolver poucos caracteres para muitas páginas
 * (cabeçalhos, números soltos). Nesses casos precisamos transcrever por IA.
 */
export function precisaTranscricao(texto: string, paginas = 1): boolean {
  const limpo = String(texto || '').replace(/\s+/g, ' ').trim()
  const paginasSeguras = Math.max(1, paginas)
  const minimo = Math.max(80, Math.min(MIN_CHARS, 120 * paginasSeguras))
  if (limpo.length < minimo) return true
  return limpo.length / paginasSeguras < 120
}

/** Considera a transcrição da IA aproveitável (evita "SEM_TEXTO" e respostas vazias). */
export function transcricaoUtil(texto: string): boolean {
  const limpo = String(texto || '').trim()
  if (limpo.length < 40) return false
  return !/^SEM_TEXTO/i.test(limpo)
}

export type DepsExtracao = {
  /** Texto da camada nativa do PDF. Deve devolver '' quando não houver. */
  lerCamadaTexto: () => Promise<{ texto: string; paginas: number }>
  /** Transcrição por IA de visão com um modelo específico. */
  transcrever: (modelo: string) => Promise<string>
  modelos?: readonly string[]
}

/**
 * Pipeline garantido: camada de texto → transcrição por IA em cascata de
 * modelos. Só devolve 'vazio' quando todas as tentativas falharem.
 */
export async function extrairPdf(deps: DepsExtracao): Promise<ResultadoExtracao> {
  const tentativas: string[] = []
  let nativo = ''
  let paginas = 1
  try {
    const r = await deps.lerCamadaTexto()
    nativo = String(r.texto || '').trim()
    paginas = r.paginas || 1
    tentativas.push('camada-texto')
  } catch {
    tentativas.push('camada-texto:falhou')
  }

  if (nativo && !precisaTranscricao(nativo, paginas)) {
    return { texto: nativo, qualidade: 'texto', tentativas }
  }

  for (const modelo of deps.modelos ?? MODELOS_TRANSCRICAO) {
    try {
      const t = await deps.transcrever(modelo)
      tentativas.push('ia:' + modelo)
      if (transcricaoUtil(t)) return { texto: t.trim(), qualidade: 'ocr', tentativas }
    } catch {
      tentativas.push('ia:' + modelo + ':falhou')
    }
  }

  if (nativo) return { texto: nativo, qualidade: 'texto', tentativas }
  return { texto: '', qualidade: 'vazio', tentativas }
}
