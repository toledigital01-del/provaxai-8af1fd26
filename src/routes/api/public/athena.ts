import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SUPABASE_URL, currentUser, hasCourseAccess, usosHoje, serviceHeaders } from '@/lib/px-server'
import { AIError } from '@/lib/ai-gateway'
import { agentChat, rotaDoAgente } from '@/lib/ai-router'
import { buscarTrechos, escopoIndexado, indexarEscopo, MAX_RAG_CHARS, type TrechoRag } from '@/lib/rag'

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topico: z.string().max(300).optional().nullable(),
  pergunta: z.string().min(1).max(2000),
  curso: z.string().max(80).optional(),
})

type Fonte = { n: number; titulo: string; disciplina: string; topico: string | null; similaridade: number }

/** Monta o contexto a partir dos trechos RAG, respeitando o limite rígido. */
function montarContexto(trechos: TrechoRag[]) {
  let usado = 0
  const partes: string[] = []
  const fontes: Fonte[] = []
  for (const t of trechos) {
    const n = fontes.length + 1
    const bloco = `### [Fonte ${n}] ${t.titulo || t.topico || t.disciplina}${t.topico ? ` · ${t.topico}` : ''}\n${t.trecho}`
    if (usado + bloco.length > MAX_RAG_CHARS) continue
    usado += bloco.length
    partes.push(bloco)
    fontes.push({
      n,
      titulo: t.titulo || t.topico || t.disciplina,
      disciplina: t.disciplina,
      topico: t.topico,
      similaridade: Math.round(t.similarity * 100),
    })
  }
  return { base: partes.join('\n\n'), fontes }
}

/** Plano B (legado): primeiros documentos publicados, sem busca semântica. */
async function fetchKnowledge(curso: string, disciplina: string, topico?: string | null) {
  const params = new URLSearchParams({
    select: 'titulo,topico,conteudo',
    course_slug: `eq.${curso}`,
    disciplina: `eq.${disciplina}`,
    publicado: 'is.true',
    limit: '12',
  })
  const res = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_docs?${params}`, {
    headers: serviceHeaders(),
  })
  if (!res.ok) return [] as Array<{ titulo?: string; topico?: string; conteudo: string }>
  const rows = (await res.json()) as Array<{ titulo?: string; topico?: string; conteudo: string }>
  const exact = topico ? rows.filter((r) => r.topico === topico) : []
  const geral = rows.filter((r) => !r.topico)
  const outros = rows.filter((r) => !exact.includes(r) && !geral.includes(r))
  return [...exact, ...geral, ...outros].slice(0, 6)
}

export const Route = createFileRoute('/api/public/athena')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await currentUser(request)
        if (!userId) return Response.json({ error: 'Faça login para falar com a Athena.' }, { status: 401 })

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        // Trava de acesso pago desativada por enquanto (fase de testes): qualquer
        // aluno logado pode falar com a Athena. Reativar: `if (!(await hasCourseAccess(userId, curso))) return Response.json({ error: 'Seu acesso ao curso não está ativo.' }, { status: 403 })`
        void hasCourseAccess

        const rota = await rotaDoAgente('athena')
        const limite = rota.limiteDiario
        if (limite > 0 && (await usosHoje(userId, 'athena')) >= limite)
          return Response.json(
            { error: `Você atingiu o limite de ${limite} perguntas para a Athena hoje. Volte amanhã.` },
            { status: 429 },
          )

        // RAG: busca vetorial dos trechos mais relevantes (com indexação
        // automática na primeira pergunta da disciplina). Se falhar ou não
        // houver nada indexado, cai no modo clássico de leitura direta.
        let base = ''
        let fontes: Fonte[] = []
        let ragAtivo = false
        try {
          if (!(await escopoIndexado(curso, body.disciplina))) {
            await indexarEscopo({ curso, disciplina: body.disciplina })
          }
          const trechos = await buscarTrechos({
            pergunta: body.pergunta,
            curso,
            disciplina: body.disciplina,
            topico: body.topico,
            max: 8,
          })
          if (trechos.length) {
            const ctx = montarContexto(trechos)
            base = ctx.base
            fontes = ctx.fontes
            ragAtivo = true
          }
        } catch {
          /* RAG é melhor-esforço: qualquer falha cai no modo clássico */
        }

        if (!ragAtivo) {
          const docs = await fetchKnowledge(curso, body.disciplina, body.topico)
          base = docs
            .map((d) => `### ${d.titulo || d.topico || body.disciplina}\n${(d.conteudo || '').slice(0, 12000)}`)
            .join('\n\n')
          fontes = docs.map((d, i) => ({
            n: i + 1,
            titulo: d.titulo || d.topico || body.disciplina,
            disciplina: body.disciplina,
            topico: d.topico || null,
            similaridade: 0,
          }))
        }

        // Conteúdo inteligente aprovado pelo administrador para esta aula
        // (pacote publicado: resumo, pontos-chave, pegadinhas, base da Athena…).
        if (body.topico) {
          try {
            const eqT = encodeURIComponent(body.topico)
            const r = await fetch(
              `${SUPABASE_URL}/rest/v1/aula_conteudos?select=tipo,conteudo,versao&course_slug=eq.${encodeURIComponent(curso)}` +
                `&disciplina=${encodeURIComponent(body.disciplina)}&topico=eq.${eqT}&publicado=is.true` +
                `&tipo=in.(summary,review,key_points,traps,athena_knowledge)&order=versao.desc`,
              { headers: serviceHeaders() },
            )
            if (r.ok) {
              const rows = (await r.json()) as Array<{ tipo: string; conteudo: string }>
              const vistos = new Set<string>()
              const extras = (Array.isArray(rows) ? rows : [])
                .filter((x) => {
                  if (vistos.has(x.tipo)) return false // só a versão publicada mais recente
                  vistos.add(x.tipo)
                  return (x.conteudo || '').trim()
                })
                .map((x) => `### ${x.tipo}\n${x.conteudo.slice(0, 8000)}`)
                .join('\n\n')
              if (extras) base += '\n\n--- CONTEÚDO INTELIGENTE APROVADO DESTA AULA ---\n' + extras
            }
          } catch {
            /* enriquecimento é best-effort */
          }
        }

        const system = [
          'Você é a Athena, professora de concursos da plataforma Prova X.',
          'Responda em português do Brasil, de forma didática, objetiva e focada em prova (padrão Cebraspe certo/errado).',
          'Formato da resposta: escreva como numa conversa de chat, não como um artigo. Parágrafos curtos (2-4 linhas). ' +
            'No máximo 2-3 pontos principais por resposta — se o assunto tiver mais partes, cubra só o essencial e termine ' +
            'perguntando se o aluno quer que você continue com o próximo ponto. Evite títulos markdown (#, ##) e emojis. ' +
            'Só use lista com marcadores quando for mesmo uma enumeração curta (até 4 itens).',
          ragAtivo
            ? 'Os trechos abaixo foram selecionados por relevância para a pergunta do aluno, cada um com uma etiqueta [Fonte N]. ' +
              'Sempre que usar uma informação de um trecho, indique a origem no fim da frase, ex.: [Fonte 2]. ' +
              'Se nenhum trecho cobrir a pergunta, diga isso com clareza antes de complementar com conhecimento geral.\n\n--- TRECHOS DO MATERIAL OFICIAL ---\n' +
              base
            : base
              ? 'Use PRIORITARIAMENTE o material oficial abaixo como fonte de verdade. Se a resposta não estiver nele, diga isso e complemente com cuidado.\n\n--- MATERIAL OFICIAL ---\n' + base
              : 'Ainda não há material oficial cadastrado para este tópico; responda com base no edital e avise o aluno que o conteúdo detalhado será publicado em breve.',
        ].join('\n')

        try {
          const r = await agentChat({
            agent: 'athena',
            system,
            user: `Disciplina: ${body.disciplina}${body.topico ? ` | Tópico: ${body.topico}` : ''}\n\nPergunta: ${body.pergunta}`,
            userId,
            ferramenta: 'athena',
            disciplina: body.disciplina,
            topico: body.topico ?? null,
          })
          return Response.json({
            resposta: r.texto || 'Não consegui responder agora.',
            fontes,
            modelo: r.model,
          })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'Não consegui responder agora.' }, { status: err.status || 502 })
        }
      },
    },
  },
})
