import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getSetting, aiKeys, currentUser, usosHoje, registrarUsoIA, serviceHeaders, SUPABASE_URL } from '@/lib/px-server'
import { materialIntegral } from '@/lib/kb-context'
import { chat, normalizar, AIError } from '@/lib/ai-gateway'

/* Episódio de podcast cobrindo a matéria INTEIRA.
   O roteiro é gerado uma vez por tópico/curso oficial e fica em cache
   (tabela podcasts_ia), de forma que o texto e — junto com o cache de áudio
   do /api/public/tts — também a narração são reaproveitados por todos os
   alunos, sem custo repetido. */

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).optional().nullable(),
  curso: z.string().max(80).optional(),
  regerar: z.boolean().optional(),
})

type Fala = { who: string; texto: string }

const eq = (v: string) => `eq.${encodeURIComponent(v)}`

function extrairRoteiro(txt: string): Fala[] {
  const bruto = txt.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  const ini = bruto.indexOf('[')
  const fim = bruto.lastIndexOf(']')
  if (ini < 0 || fim <= ini) return []
  try {
    const arr = JSON.parse(bruto.slice(ini, fim + 1)) as Array<{ who?: string; texto?: string }>
    return arr
      .filter((f) => f && typeof f.texto === 'string' && f.texto.trim())
      .map((f) => ({ who: f.who === 'Rafael' ? 'Rafael' : 'Ana', texto: String(f.texto).trim() }))
      .slice(0, 30)
  } catch {
    return []
  }
}

export const Route = createFileRoute('/api/public/podcast')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await currentUser(request) // null = convidado (liberado por enquanto)

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        const topico = body.topico || null
        const filtro =
          `course_slug=${eq(curso)}&disciplina=${eq(body.disciplina)}&` +
          (topico ? `topico=${eq(topico)}` : 'topico=is.null') +
          '&user_id=is.null'

        // 1) Cache do roteiro — episódio já pronto sai na hora e sem custo.
        if (!body.regerar) {
          const hit = (await fetch(`${SUPABASE_URL}/rest/v1/podcasts_ia?select=roteiro,modelo&${filtro}&limit=1`, {
            headers: serviceHeaders(),
          })
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => [])) as Array<{ roteiro?: Fala[]; modelo?: string }>
          const roteiro = hit[0]?.roteiro
          if (Array.isArray(roteiro) && roteiro.length)
            return Response.json({ roteiro, modelo: hit[0]?.modelo || null, cache: true })
        }

        const cfg = normalizar(await getSetting('ia_athena'))
        const limite = cfg.limiteDiario ?? 0
        if (userId && limite > 0 && (await usosHoje(userId, 'podcast')) >= limite)
          return Response.json({ error: `Você atingiu o limite de ${limite} episódios hoje. Volte amanhã.` }, { status: 429 })

        const base = await materialIntegral(curso, body.disciplina, topico)

        const system = [
          'Você roteiriza um podcast de estudos para concursos da plataforma Prova X, em português do Brasil.',
          'Dois apresentadores conversam: Ana (professora, começa o episódio) e Rafael (aluno curioso que provoca perguntas).',
          'O episódio deve cobrir A MATÉRIA INTEIRA do material abaixo, sem pular partes, de forma progressiva:',
          'abertura, conceitos-base, desenvolvimento capítulo a capítulo com exemplos, comparações e casos práticos,',
          'pegadinhas e palavras-armadilha da banca Cebraspe, e um fechamento com revisão rápida dos pontos-chave.',
          'Escreva de 18 a 24 falas alternadas, cada uma com 4 a 7 frases densas de conteúdo — nada de enrolação,',
          'saudação longa ou conversa fiada: cada fala precisa ensinar algo concreto do material.',
          'Não invente lei, prazo, número ou julgado que não esteja no material. Não cite "o material" nem "o PDF".',
          'Responda SOMENTE com um JSON válido no formato [{"who":"Ana","texto":"..."},{"who":"Rafael","texto":"..."}] — sem markdown, sem comentários.',
          base
            ? '\n--- MATERIAL DA MATÉRIA ---\n' + base
            : 'ATENÇÃO: ainda não há material cadastrado para esta matéria. Diga isso na primeira fala e faça um episódio curto e geral.',
        ].join('\n')

        try {
          const saida = await chat({
            provider: cfg.provider,
            model: cfg.model,
            system,
            user: `Disciplina: ${body.disciplina}${topico ? ` | Tópico em foco: ${topico}` : ''}\n\nGere o roteiro completo em JSON, cobrindo toda a matéria.`,
            keys: await aiKeys(),
            maxTokens: 12000,
          })
          const roteiro = extrairRoteiro(saida || '')
          if (userId) await registrarUsoIA({
            user_id: userId,
            ferramenta: 'podcast',
            modelo: cfg.model,
            discipline_nome: body.disciplina,
            topic_nome: topico,
            pergunta: 'podcast',
            resposta: saida || '',
          })
          if (!roteiro.length) { console.error('roteiro vazio; saida:', (saida||'').slice(0,600)) }
          if (!roteiro.length) return Response.json({ error: 'Não consegui gerar o episódio agora.' }, { status: 502 })

          // 2) Guarda o roteiro para os próximos alunos ouvirem sem gerar de novo.
          if (base) {
            try {
              await fetch(`${SUPABASE_URL}/rest/v1/podcasts_ia?${filtro}`, {
                method: 'DELETE',
                headers: serviceHeaders({ Prefer: 'return=minimal' }),
              })
              await fetch(`${SUPABASE_URL}/rest/v1/podcasts_ia`, {
                method: 'POST',
                headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
                body: JSON.stringify({
                  course_slug: curso,
                  disciplina: body.disciplina,
                  topico,
                  user_id: null,
                  roteiro,
                  modelo: cfg.model,
                }),
              })
            } catch {
              /* cache é best-effort */
            }
          }

          return Response.json({ roteiro, fontes: base ? 1 : 0, modelo: cfg.model, cache: false })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'Não consegui gerar o episódio agora.' }, { status: err.status || 502 })
        }
      },
    },
  },
})
