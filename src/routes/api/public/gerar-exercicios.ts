import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getSetting, aiKeys, requireAdmin, serviceHeaders, SUPABASE_URL } from '@/lib/px-server'
import { materialIntegral } from '@/lib/kb-context'
import { chat, normalizar, AIError } from '@/lib/ai-gateway'

/* Gera e GRAVA questões (certo/errado, estilo Cebraspe) e flashcards oficiais
   de uma aula. Uso exclusivo do painel administrativo: o conteúdo é criado
   uma única vez, na publicação, e depois é só leitura para todos os alunos. */

const Body = z.object({
  curso: z.string().max(80).optional(),
  disciplina: z.string().min(1).max(200),
  topico: z.string().min(1).max(300),
  tipo: z.enum(['questoes', 'flashcards']),
  regerar: z.boolean().optional(),
})

const eq = (v: string) => `eq.${encodeURIComponent(v)}`

function extrairJson<T>(txt: string): T[] {
  const bruto = (txt || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  const ini = bruto.indexOf('[')
  const fim = bruto.lastIndexOf(']')
  if (ini < 0 || fim <= ini) return []
  try {
    const arr = JSON.parse(bruto.slice(ini, fim + 1))
    return Array.isArray(arr) ? (arr as T[]) : []
  } catch {
    return []
  }
}

async function contar(tabela: string, filtro: string) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?select=id&${filtro}&limit=1`, {
    headers: serviceHeaders(),
  })
  if (!r.ok) return 0
  const rows = (await r.json()) as unknown[]
  return Array.isArray(rows) ? rows.length : 0
}

export const Route = createFileRoute('/api/public/gerar-exercicios')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const negado = await requireAdmin(request)
        if (negado) return negado

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        const tabela = body.tipo === 'questoes' ? 'questions' : 'flashcards'
        const filtro =
          `course_slug=${eq(curso)}&discipline_nome=${eq(body.disciplina)}&topic_nome=${eq(body.topico)}` +
          (body.tipo === 'flashcards' ? '&is_oficial=is.true' : '')

        if (!body.regerar && (await contar(tabela, filtro)) > 0)
          return Response.json({ ok: true, cache: true, criados: 0 })

        const material = await materialIntegral(curso, body.disciplina, body.topico)
        if (material.length < 200)
          return Response.json({ error: 'Sem material suficiente nesta aula.' }, { status: 422 })

        const cfg = normalizar(await getSetting('ia_athena'))
        const system =
          body.tipo === 'questoes'
            ? [
                'Você elabora itens de prova no estilo Cebraspe (julgamento CERTO/ERRADO), em português do Brasil.',
                'Crie 12 itens sobre o material abaixo: 6 corretos e 6 errados, misturando os erros clássicos da banca',
                '(troca de prazo, de autoridade competente, generalização indevida, inversão de exceção).',
                'Cada item deve ser uma afirmação objetiva de 1 a 3 linhas, sem pergunta e sem alternativas.',
                'Não invente lei, prazo, número ou julgado que não esteja no material.',
                'Responda SOMENTE com JSON válido: [{"enunciado":"...","gabarito":"C","comentario":"justificativa curta"}]',
              ].join('\n')
            : [
                'Você cria flashcards de memorização para concursos, em português do Brasil.',
                'Crie 15 cartões sobre o material abaixo, cobrindo definições, prazos, requisitos, exceções e competências.',
                'A frente é uma pergunta curta e direta; o verso é a resposta objetiva (1 a 3 linhas).',
                'Não invente conteúdo que não esteja no material.',
                'Responda SOMENTE com JSON válido: [{"frente":"...","verso":"..."}]',
              ].join('\n')

        let saida = ''
        try {
          saida = await chat({
            provider: cfg.provider,
            model: cfg.model,
            system: system + '\n\n--- MATERIAL DA AULA ---\n' + material.slice(0, 60000),
            user: `Disciplina: ${body.disciplina} | Aula: ${body.topico}\n\nGere o JSON.`,
            keys: await aiKeys(),
            maxTokens: 8000,
          })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'Falha na IA.' }, { status: err.status || 502 })
        }

        let linhas: Record<string, unknown>[] = []
        if (body.tipo === 'questoes') {
          linhas = extrairJson<{ enunciado?: string; gabarito?: string; comentario?: string }>(saida)
            .filter((q) => String(q.enunciado || '').trim().length > 20)
            .slice(0, 20)
            .map((q) => ({
              course_slug: curso,
              discipline_nome: body.disciplina,
              topic_nome: body.topico,
              enunciado: String(q.enunciado).trim(),
              tipo: 'ce',
              gabarito: String(q.gabarito || 'C').trim().toUpperCase().startsWith('C') ? 'C' : 'E',
              alternativas: [],
              comentario: String(q.comentario || '').trim() || null,
              banca: 'Cebraspe',
              ativa: true,
            }))
        } else {
          linhas = extrairJson<{ frente?: string; verso?: string }>(saida)
            .filter((c) => String(c.frente || '').trim() && String(c.verso || '').trim())
            .slice(0, 25)
            .map((c) => ({
              user_id: null,
              course_slug: curso,
              discipline_nome: body.disciplina,
              topic_nome: body.topico,
              frente: String(c.frente).trim(),
              verso: String(c.verso).trim(),
              is_oficial: true,
            }))
        }

        if (!linhas.length) return Response.json({ error: 'A IA não devolveu itens válidos.' }, { status: 502 })

        // Substitui o conteúdo anterior da aula para não duplicar.
        await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?${filtro}`, {
          method: 'DELETE',
          headers: serviceHeaders({ Prefer: 'return=minimal' }),
        }).catch(() => null)

        const ins = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
          method: 'POST',
          headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
          body: JSON.stringify(linhas),
        })
        if (!ins.ok)
          return Response.json({ error: 'Não consegui salvar os itens gerados.' }, { status: 500 })

        return Response.json({ ok: true, cache: false, criados: linhas.length, modelo: cfg.model })
      },
    },
  },
})
