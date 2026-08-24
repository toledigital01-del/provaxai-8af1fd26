import { describe, expect, it } from 'vitest'
import { extrairPdf, precisaTranscricao, transcricaoUtil } from '../src/lib/kb-extract'

const paragrafo = (n: number) => 'Conteúdo da aula sobre legislação de trânsito. '.repeat(n)

/* Cenários de PDF: da apostila digital limpa ao escaneado torto e ilegível. */
const CENARIOS = {
  digitalLimpo: { texto: paragrafo(200), paginas: 10 },
  escaneadoSemCamada: { texto: '', paginas: 12 },
  escaneadoLixo: { texto: '1\n2\n3\nfl. 22', paginas: 12 },
  escaneadoParcial: { texto: paragrafo(2), paginas: 40 }, // OCR ruim da gráfica
}

function deps(cenario: { texto: string; paginas: number }, transcricoes: Record<string, string>) {
  const usados: string[] = []
  return {
    usados,
    lerCamadaTexto: async () => cenario,
    transcrever: async (modelo: string) => {
      usados.push(modelo)
      const r = transcricoes[modelo]
      if (r === undefined) throw new Error('modelo indisponível')
      return r
    },
  }
}

describe('extração de PDFs com qualidades diferentes', () => {
  it('PDF digital com camada de texto não gasta IA', async () => {
    const d = deps(CENARIOS.digitalLimpo, {})
    const r = await extrairPdf(d)
    expect(r.qualidade).toBe('texto')
    expect(d.usados).toHaveLength(0)
    expect(r.texto.length).toBeGreaterThan(1000)
  })

  it('PDF escaneado sem camada de texto é transcrito por IA', async () => {
    const d = deps(CENARIOS.escaneadoSemCamada, { 'google/gemini-3-flash-preview': paragrafo(30) })
    const r = await extrairPdf(d)
    expect(r.qualidade).toBe('ocr')
    expect(r.texto.length).toBeGreaterThan(200)
  })

  it('PDF escaneado que só devolve números de página cai para a IA', async () => {
    const d = deps(CENARIOS.escaneadoLixo, { 'google/gemini-3-flash-preview': paragrafo(30) })
    const r = await extrairPdf(d)
    expect(r.qualidade).toBe('ocr')
    expect(r.texto).not.toContain('fl. 22')
  })

  it('OCR parcial da gráfica (pouco texto para muitas páginas) também é retranscrito', async () => {
    const d = deps(CENARIOS.escaneadoParcial, { 'google/gemini-3-flash-preview': paragrafo(80) })
    const r = await extrairPdf(d)
    expect(r.qualidade).toBe('ocr')
    expect(r.texto.length).toBeGreaterThan(CENARIOS.escaneadoParcial.texto.length)
  })

  it('quando o modelo rápido responde SEM_TEXTO, tenta o modelo robusto', async () => {
    const d = deps(CENARIOS.escaneadoSemCamada, {
      'google/gemini-3-flash-preview': 'SEM_TEXTO',
      'google/gemini-3.1-pro-preview': paragrafo(50),
    })
    const r = await extrairPdf(d)
    expect(d.usados).toEqual(['google/gemini-3-flash-preview', 'google/gemini-3.1-pro-preview'])
    expect(r.qualidade).toBe('ocr')
  })

  it('quando o modelo rápido falha por erro de rede, o robusto salva a aula', async () => {
    const d = deps(CENARIOS.escaneadoSemCamada, { 'google/gemini-3.1-pro-preview': paragrafo(50) })
    const r = await extrairPdf(d)
    expect(r.qualidade).toBe('ocr')
    expect(r.tentativas).toContain('ia:google/gemini-3-flash-preview:falhou')
  })

  it('se a IA falhar em tudo mas houver algum texto nativo, ele é aproveitado', async () => {
    const d = deps(CENARIOS.escaneadoParcial, {})
    const r = await extrairPdf(d)
    expect(r.qualidade).toBe('texto')
    expect(r.texto).toBe(CENARIOS.escaneadoParcial.texto.trim())
  })

  it('PDF realmente vazio devolve "vazio" (mensagem amigável, sem erro 500)', async () => {
    const d = deps(CENARIOS.escaneadoSemCamada, { 'google/gemini-3-flash-preview': 'SEM_TEXTO', 'google/gemini-3.1-pro-preview': '' })
    const r = await extrairPdf(d)
    expect(r).toMatchObject({ texto: '', qualidade: 'vazio' })
  })

  it('leitura do PDF corrompida não derruba a extração', async () => {
    const r = await extrairPdf({
      lerCamadaTexto: async () => { throw new Error('pdf corrompido') },
      transcrever: async () => paragrafo(20),
    })
    expect(r.qualidade).toBe('ocr')
    expect(r.tentativas).toContain('camada-texto:falhou')
  })

  it('regras de qualidade', () => {
    expect(precisaTranscricao('', 3)).toBe(true)
    expect(precisaTranscricao(paragrafo(200), 10)).toBe(false)
    expect(transcricaoUtil('SEM_TEXTO')).toBe(false)
    expect(transcricaoUtil(paragrafo(5))).toBe(true)
  })
})
