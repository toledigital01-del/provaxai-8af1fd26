import { describe, expect, it } from 'vitest'
import {
  diagnosticarAula,
  temConteudoVisivel,
  textoVisivel,
  versaoConteudo,
} from '../src/lib/aula-html-util'

const PAGINA = `<!doctype html><html><head><meta charset="utf-8"><title>Aula 00</title>
<style>body{font-family:system-ui}h1{color:#123}</style></head>
<body><main><h1>Organização administrativa</h1>
<p>A administração direta é composta pelos órgãos integrantes da pessoa jurídica.</p>
</main><script>console.log('oi')</script></body></html>`

/* Banco falso que replica o fluxo real: salvar HTML -> publicar -> aluno lê. */
function fakeFluxo() {
  const aulas = new Map<string, { conteudo: string; formato: string; updated_at: string }>()
  const cache = new Map<string, string>()
  const chave = (c: string, d: string, t: string) => [c, d, t].join('|')
  return {
    salvar(c: string, d: string, t: string, html: string) {
      if (!temConteudoVisivel(html)) throw new Error('HTML sem conteúdo visível.')
      aulas.set(chave(c, d, t), { conteudo: html, formato: 'html', updated_at: new Date().toISOString() })
      return true
    },
    publicar(c: string, d: string, t: string) {
      const reg = aulas.get(chave(c, d, t))
      const diag = diagnosticarAula(reg)
      if (!diag.ok) return { ok: false, campo: diag.campo }
      cache.delete(chave(c, d, t)) // invalidação imediata
      return { ok: true, versao: versaoConteudo(reg!.conteudo) }
    },
    aluno(c: string, d: string, t: string) {
      const k = chave(c, d, t)
      if (cache.has(k)) return cache.get(k)!
      const reg = aulas.get(k)
      if (!reg) return null
      cache.set(k, reg.conteudo)
      return reg.conteudo
    },
    cache,
  }
}

describe('conteúdo visível da aula HTML', () => {
  it('ignora estilos, scripts e head ao medir o texto', () => {
    const txt = textoVisivel(PAGINA)
    expect(txt).toContain('administração direta')
    expect(txt).not.toContain('system-ui')
    expect(txt).not.toContain('console.log')
  })

  it('rejeita HTML que só tem estilo/script', () => {
    expect(temConteudoVisivel('<style>body{color:red}</style><script>var a=1</script>')).toBe(false)
    expect(temConteudoVisivel(PAGINA)).toBe(true)
  })

  it('não confunde página completa com conteúdo vazio', () => {
    expect(diagnosticarAula({ conteudo: PAGINA, formato: 'html' }).ok).toBe(true)
  })
})

describe('diagnóstico de campo faltando', () => {
  it('aponta o registro ausente', () => {
    const d = diagnosticarAula(null)
    expect(d.ok).toBe(false)
    expect(d.campo).toBe('aulas_ia')
  })

  it('aponta o campo de conteúdo vazio', () => {
    const d = diagnosticarAula({ conteudo: '   ', formato: 'html' })
    expect(d.campo).toBe('aulas_ia.conteudo')
  })
})

describe('fluxo subir HTML -> publicar -> aluno', () => {
  it('entrega a aula ao aluno depois de publicar', () => {
    const f = fakeFluxo()
    f.salvar('prf-2021', 'Direito Administrativo', 'Aula 00', PAGINA)
    const pub = f.publicar('prf-2021', 'Direito Administrativo', 'Aula 00')
    expect(pub.ok).toBe(true)
    expect(f.aluno('prf-2021', 'Direito Administrativo', 'Aula 00')).toContain('administração direta')
  })

  it('publicar invalida o cache e entrega a versão nova', () => {
    const f = fakeFluxo()
    f.salvar('prf-2021', 'Direito Administrativo', 'Aula 00', PAGINA)
    f.publicar('prf-2021', 'Direito Administrativo', 'Aula 00')
    f.aluno('prf-2021', 'Direito Administrativo', 'Aula 00') // aquece o cache
    const nova = PAGINA.replace('administração direta', 'administração indireta')
    f.salvar('prf-2021', 'Direito Administrativo', 'Aula 00', nova)
    f.publicar('prf-2021', 'Direito Administrativo', 'Aula 00')
    expect(f.aluno('prf-2021', 'Direito Administrativo', 'Aula 00')).toContain('administração indireta')
  })

  it('recusa salvar HTML sem texto visível', () => {
    const f = fakeFluxo()
    expect(() => f.salvar('prf-2021', 'X', 'Aula 01', '<style>a{}</style>')).toThrow()
  })

  it('a versão muda quando o conteúdo muda', () => {
    expect(versaoConteudo(PAGINA)).not.toBe(versaoConteudo(PAGINA + '<p>extra</p>'))
    expect(versaoConteudo(PAGINA)).toBe(versaoConteudo(PAGINA))
  })
})
