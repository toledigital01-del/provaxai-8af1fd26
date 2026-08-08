import { describe, expect, it } from 'vitest'
// @ts-expect-error módulo utilitário em JS clássico compartilhado com o console admin
import PXKB from '../public/px-kb-payload.js'

const DISCS = ['Língua Portuguesa', 'Legislação de Trânsito', 'Raciocínio Lógico']

/* Banco falso que replica a restrição NOT NULL de knowledge_docs.disciplina */
function fakeDb() {
  const rows: any[] = []
  return {
    rows,
    insert(payload: any) {
      if (payload.disciplina == null || String(payload.disciplina).trim() === '')
        throw new Error('null value in column "disciplina" of relation "knowledge_docs" violates not-null constraint')
      rows.push(payload)
      return payload
    },
  }
}

describe('gravação na base de conhecimento', () => {
  it('bloqueia salvar sem matéria selecionada', () => {
    expect(() => PXKB.montarDoc({ disciplina: null, conteudo: 'x', discList: DISCS })).toThrow(/matéria válida/)
    expect(() => PXKB.montarDoc({ disciplina: '  ', conteudo: 'x', discList: DISCS })).toThrow(/matéria válida/)
    expect(() => PXKB.montarDoc({ disciplina: 'Matéria Fantasma', conteudo: 'x', discList: DISCS })).toThrow()
  })

  it('grava com a matéria escolhida', () => {
    const db = fakeDb()
    db.insert(PXKB.montarDoc({ disciplina: 'Língua Portuguesa', topico: 'Crase', conteudo: '## Aula', discList: DISCS }))
    expect(db.rows[0].disciplina).toBe('Língua Portuguesa')
    expect(db.rows[0].topico).toBe('Crase')
  })

  it('montar curso + publicar com troca rápida de matéria nunca grava disciplina nula', async () => {
    const db = fakeDb()
    let discAtual = 'Língua Portuguesa'

    // geração assíncrona iniciada com a matéria A
    const discNaGeracao = PXKB.validarDisciplina(discAtual, DISCS)
    const geracao = new Promise<any[]>((res) =>
      setTimeout(
        () =>
          res(
            ['Crase', 'Concordância'].map((t) => ({
              disciplina: discNaGeracao,
              topico: t,
              titulo: t,
              conteudo: 'conteúdo da aula',
              incluir: true,
            })),
          ),
        5,
      ),
    )

    // usuário troca de matéria (e até para uma inválida) durante a geração
    discAtual = 'Legislação de Trânsito'
    const aulas = await geracao
    discAtual = ''

    // publicar sem matéria válida deve falhar antes de tocar o banco
    expect(() => PXKB.filtrarAulasPublicaveis(aulas, discAtual, DISCS)).toThrow(/matéria válida/)
    expect(db.rows).toHaveLength(0)

    // com a matéria trocada, as aulas da matéria antiga não são publicadas
    expect(PXKB.filtrarAulasPublicaveis(aulas, 'Legislação de Trânsito', DISCS)).toHaveLength(0)

    // voltando à matéria de origem, publica normalmente
    const publicaveis = PXKB.filtrarAulasPublicaveis(aulas, 'Língua Portuguesa', DISCS)
    expect(publicaveis).toHaveLength(2)
    for (const a of publicaveis)
      db.insert(PXKB.montarDoc({ ...a, discList: DISCS, userId: 'u1' }))
    expect(db.rows.every((r) => r.disciplina === 'Língua Portuguesa')).toBe(true)
  })

  it('identifica documentos órfãos (matéria fora do edital)', () => {
    const docs = [
      { id: '1', disciplina: 'Língua Portuguesa' },
      { id: '2', disciplina: 'Matéria Antiga' },
      { id: '3', disciplina: '' },
    ]
    expect(PXKB.encontrarOrfaos(docs, DISCS).map((d: any) => d.id)).toEqual(['2', '3'])
  })
})
