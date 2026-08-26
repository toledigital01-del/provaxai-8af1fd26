/* Utilidades da aula escrita como página HTML pronta.
   Ficam num módulo próprio para poderem ser testadas sem subir a rota. */

/** Remove estilos, scripts e cabeçalho, deixando só o texto que o aluno lê. */
export function textoVisivel(html: string) {
  return String(html || '')
    .replace(/<style\b[^>]*>[\s\S]*?(?:<\/style>|$)/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?(?:<\/script>|$)/gi, '')
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<(?:meta|link)\b[^>]*>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function temConteudoVisivel(html: string) {
  return textoVisivel(html).length >= 20
}

export type Diagnostico = {
  ok: boolean
  campo: string | null
  motivo: string | null
  caracteres: number
  caracteresVisiveis: number
}

/** Diz exatamente qual campo/registro está faltando para a aula abrir no aluno. */
export function diagnosticarAula(
  registro: { conteudo?: string | null; formato?: string | null } | null | undefined,
): Diagnostico {
  if (!registro)
    return {
      ok: false,
      campo: 'aulas_ia',
      motivo: 'Nenhum registro de aula salvo para este curso/disciplina/tópico.',
      caracteres: 0,
      caracteresVisiveis: 0,
    }
  const conteudo = String(registro.conteudo || '')
  const visivel = textoVisivel(conteudo)
  if (!conteudo.trim())
    return {
      ok: false,
      campo: 'aulas_ia.conteudo',
      motivo: 'O registro existe, mas o campo de conteúdo está vazio.',
      caracteres: 0,
      caracteresVisiveis: 0,
    }
  if (registro.formato === 'html' && visivel.length < 20)
    return {
      ok: false,
      campo: 'aulas_ia.conteudo',
      motivo: 'O HTML salvo só tem estilos/scripts, sem texto visível para o aluno.',
      caracteres: conteudo.length,
      caracteresVisiveis: visivel.length,
    }
  return {
    ok: true,
    campo: null,
    motivo: null,
    caracteres: conteudo.length,
    caracteresVisiveis: visivel.length,
  }
}

/** Assinatura curta e estável do conteúdo, para comparar versões admin x aluno. */
export function versaoConteudo(conteudo: string) {
  const s = String(conteudo || '')
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0
  return h.toString(16).padStart(8, '0') + '-' + s.length
}
