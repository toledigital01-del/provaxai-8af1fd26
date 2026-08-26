import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { currentUser, serviceHeaders, SUPABASE_URL } from '@/lib/px-server'
import { AIError } from '@/lib/ai-gateway'
import { agentChat } from '@/lib/ai-router'
import { cacheChave, cacheGravar, cacheLer, cacheLimpar, jsonPublicado } from '@/lib/px-cache'


/* Aula explicada pela Athena, gerada a partir do material carregado.
   - Cursos oficiais (slug existente em `courses`): a aula é gerada UMA vez e
     fica compartilhada com todos os alunos (user_id nulo).
   - Pastas/materiais do próprio aluno: a aula é gerada a partir do material
     dele e fica vinculada ao usuário. */

const Body = z.object({
  disciplina: z.string().min(1).max(200),
  topico: z.string().min(1).max(300),
  curso: z.string().max(80).optional(),
  regerar: z.boolean().optional(),
})

const eq = (v: string) => `eq.${encodeURIComponent(v)}`

async function cursoOficial(slug: string) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/courses?select=id&slug=${eq(slug)}&limit=1`, {
    headers: serviceHeaders(),
  })
  if (!r.ok) return false
  const rows = (await r.json()) as unknown[]
  return Array.isArray(rows) && rows.length > 0
}

/** Texto bruto do material daquele tópico (base oficial ou material do aluno). */
async function materialDoTopico(curso: string, disciplina: string, topico: string, userId: string, oficial: boolean) {
  const partes: string[] = []
  if (oficial) {
    const kd = await fetch(
      `${SUPABASE_URL}/rest/v1/knowledge_docs?select=titulo,sumario,topico,conteudo&course_slug=${eq(curso)}&disciplina=${eq(disciplina)}&limit=30`,
      { headers: serviceHeaders() },
    )
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
    const docs = (kd as Array<{ titulo?: string; sumario?: string; topico?: string; conteudo?: string }>).filter(
      (d) => d.topico === topico || !d.topico,
    )
    docs.forEach((d) => {
      const t = [d.sumario || '', d.conteudo || ''].join('\n').trim()
      if (t) partes.push(`### ${d.titulo || d.topico || disciplina}\n${t.slice(0, 60000)}`)
    })

    const kb = await fetch(
      `${SUPABASE_URL}/rest/v1/kb_documentos?select=nome_arquivo,topic_nome,texto_extraido&course_slug=${eq(curso)}&discipline_nome=${eq(disciplina)}&limit=40`,
      { headers: serviceHeaders() },
    )
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
    ;(kb as Array<{ nome_arquivo?: string; topic_nome?: string; texto_extraido?: string }>)
      .filter((d) => d.topic_nome === topico || !d.topic_nome)
      .forEach((d) => {
        const t = (d.texto_extraido || '').trim()
        if (t) partes.push(`### ${d.nome_arquivo || 'material'}\n${t.slice(0, 60000)}`)
      })
  } else {
    const um = await fetch(
      `${SUPABASE_URL}/rest/v1/user_materials?select=nome,conteudo,topics&user_id=${eq(userId)}&order=created_at.desc&limit=20`,
      { headers: serviceHeaders() },
    )
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
    const rows = um as Array<{ nome?: string; conteudo?: string; topics?: unknown }>
    const casa = rows.filter((d) => JSON.stringify(d.topics || []).includes(topico))
    ;(casa.length ? casa : rows.slice(0, 4)).forEach((d) => {
      const t = (d.conteudo || '').trim()
      if (t) partes.push(`### ${d.nome || 'material do aluno'}\n${t.slice(0, 60000)}`)
    })
  }
  return partes.join('\n\n').slice(0, 500000)
}

export const Route = createFileRoute('/api/public/aula-ia')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const t0 = performance.now()
        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        const filtroOficial =
          `${SUPABASE_URL}/rest/v1/aulas_ia?select=titulo,conteudo,modelo,formato,updated_at` +
          `&course_slug=${eq(curso)}&disciplina=${eq(body.disciplina)}&topico=${eq(body.topico)}&user_id=is.null&limit=1`

        const chave = cacheChave('aula-ia', [curso, body.disciplina, body.topico])
        if (body.regerar) cacheLimpar(chave)

        // Caminho rápido do aluno: memória do servidor e, se faltar, uma única
        // leitura do conteúdo já publicado — sempre cacheável na borda.
        if (!body.regerar) {
          // Consulte a versão publicada atual antes de usar qualquer cópia local.
          // Uma aula HTML pode ser substituída no admin e precisa aparecer para
          // o aluno imediatamente, inclusive quando outro servidor atende a chamada.
          const pronto = await fetch(filtroOficial, { headers: serviceHeaders() })
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => [])
          const hit = (pronto as Array<{ titulo?: string; conteudo?: string; modelo?: string; formato?: string }>)[0]
          if (hit && (hit.conteudo || '').trim()) {
            const dados = {
              aula: hit.conteudo,
              titulo: hit.titulo || body.topico,
              modelo: hit.modelo || null,
              formato: hit.formato === 'html' ? 'html' : 'markdown',
              cache: true,
              compartilhada: true,
            }
            cacheGravar(chave, dados)
            return jsonPublicado(dados, t0)
          }
        }


        const [userId, oficial] = await Promise.all([currentUser(request), cursoOficial(curso)])
        const dono = oficial ? null : userId
        if (!oficial && !userId)
          return Response.json({ error: 'Entre na sua conta para usar seu próprio material.' }, { status: 401 })

        const filtroDono = dono ? `user_id=${eq(dono)}` : 'user_id=is.null'
        const cacheUrl =
          `${SUPABASE_URL}/rest/v1/aulas_ia?select=titulo,conteudo,modelo,formato,updated_at` +
          `&course_slug=${eq(curso)}&disciplina=${eq(body.disciplina)}&topico=${eq(body.topico)}&${filtroDono}&limit=1`

        if (!body.regerar && !oficial) {
          const cache = await fetch(cacheUrl, { headers: serviceHeaders() })
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => [])
          const hit = (cache as Array<{ titulo?: string; conteudo?: string; modelo?: string; formato?: string }>)[0]
          if (hit && (hit.conteudo || '').trim())
            return Response.json({
              aula: hit.conteudo,
              titulo: hit.titulo || body.topico,
              modelo: hit.modelo || null,
              formato: hit.formato === 'html' ? 'html' : 'markdown',
              cache: true,
              compartilhada: oficial,
            })
        }

        if (!body.regerar && oficial)
          return Response.json({ error: 'A aula ainda não foi publicada pelo professor.' }, { status: 404 })

        const material = await materialDoTopico(curso, body.disciplina, body.topico, userId || '', oficial)
        if (material.length < 200)
          return Response.json(
            { error: 'Ainda não há material suficiente carregado para esta aula. Envie o conteúdo em "Conteúdo".' },
            { status: 422 },
          )

        const system = [
          'Você é a Athena, professora experiente de cursinho para concursos públicos (banca Cebraspe).',
          'Sua tarefa: transformar o material bruto abaixo em uma APOSTILA COMPLETA do tópico,',
          'cobrindo 100% dos assuntos, subtópicos, leis, artigos, prazos, exceções e exemplos que constam no material.',
          'A apostila É o material de estudo do aluno — ele NÃO tem acesso ao texto original, então nada pode ficar de fora.',
          '',
          'Formato obrigatório (Markdown): comece com "# " no título da aula; use "## " nas seções,',
          '"### " nos subtítulos de cada assunto interno, listas com "- " e tabelas quando ajudar a comparar.',
          'Estrutura obrigatória das seções:',
          '## Abertura — mapa do tópico: tudo o que será estudado e por que isso cai na prova',
          '## Apostila completa — desenvolva CADA assunto do material em um subtítulo ### próprio,',
          '  na mesma ordem do material, explicando do zero: conceito, regra, exceções, prazos, exemplos e comparações.',
          '  Não resuma, não pule partes: se está no material, está na apostila, com a mesma profundidade ou maior.',
          '## Jurisprudência, súmulas e letra de lei — reproduza os dispositivos citados no material',
          '## Pegadinhas da banca e palavras-armadilha de CADA assunto (não só no geral)',
          '## Esquema de revisão — mapa em tópicos curtos de TODO o conteúdo, para revisão final',
          '## Fixação — 10 assertivas certo/errado no estilo Cebraspe cobrindo os pontos mais cobrados, com gabarito comentado',
          '',
          'Regras: escreva em português do Brasil, na 1ª pessoa do professor falando com o aluno;',
          'sempre destaque em **negrito** conceitos-chave, prazos, exceções e as palavras que a banca costuma trocar;',
          'use parágrafos curtos (3 a 5 linhas) e nunca despeje texto corrido sem título;',
          'não invente lei, número, prazo ou julgado que não esteja no material; não cite "o material" nem "o PDF".',
          'Tamanho: apostila COMPLETA e aprofundada — sem teto de palavras; escreva o quanto for necessário',
          'para cobrir todo o conteúdo, normalmente de 6.000 a 15.000 palavras. Nunca entregue um resumo.',
          'Responda apenas com a apostila em Markdown.',

          '\n--- MATERIAL DE APOIO ---\n' + material,
        ].join('\n')

        let aula = ''
        let modeloUsado = ''
        try {
          const r = await agentChat({
            agent: 'geracao_aulas',
            system,
            user: `Disciplina: ${body.disciplina}\nTópico: ${body.topico}\n\nEscreva a apostila completa, cobrindo todos os assuntos do material.`,
            maxTokens: 60000,
            userId,
            ferramenta: 'aula-ia',
            disciplina: body.disciplina,
            topico: body.topico,
          })
          aula = r.texto
          modeloUsado = r.model
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'Não consegui montar a aula agora.' }, { status: err.status || 502 })
        }
        if (!aula.trim()) return Response.json({ error: 'Não consegui montar a aula agora.' }, { status: 502 })

        try {
          const filtroDel =
            `course_slug=${eq(curso)}&disciplina=${eq(body.disciplina)}&topico=${eq(body.topico)}&${filtroDono}`
          await fetch(`${SUPABASE_URL}/rest/v1/aulas_ia?${filtroDel}`, {
            method: 'DELETE',
            headers: serviceHeaders({ Prefer: 'return=minimal' }),
          })
          await fetch(`${SUPABASE_URL}/rest/v1/aulas_ia`, {
            method: 'POST',
            headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),

            body: JSON.stringify({
              course_slug: curso,
              disciplina: body.disciplina,
              topico: body.topico,
              user_id: dono,
              titulo: body.topico,
              conteudo: aula,
              formato: 'markdown',
              modelo: modeloUsado,
            }),
          })
        } catch {
          /* cache é best-effort */
        }

        return Response.json({ aula, titulo: body.topico, modelo: modeloUsado, formato: 'markdown', cache: false, compartilhada: oficial })
      },
    },
  },
})
