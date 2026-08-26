import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { aiKeys, requirePedagogicalAdmin, SUPABASE_URL, serviceHeaders } from '@/lib/px-server'
import { chat, AIError } from '@/lib/ai-gateway'
import { rotaDoAgente } from '@/lib/ai-router'

/* Extrai questões REAIS de apostilas enviadas pelo administrador.
   Regra de ouro: a IA aqui NUNCA inventa, resume ou parafraseia — só copia
   questões completas que já estão escritas no material (enunciado literal,
   gabarito C/E e identificação de banca/órgão/ano quando constarem).
   Depois classifica cada questão no tópico do edital (mesma lógica do
   kb-classify) e grava na tabela `questions` com origem='real'. */

const Body = z.object({
  curso: z.string().max(80).optional(),
  disciplina: z.string().min(1).max(200),
  topicos: z.array(z.string().max(300)).max(400).optional(),
  texto: z.string().min(50).max(120000),
  parte: z.number().int().min(1).max(40).optional(),
  total_partes: z.number().int().min(1).max(40).optional(),
})

type Questao = {
  enunciado: string
  gabarito: string
  banca: string | null
  orgao: string | null
  cargo: string | null
  ano: number | null
  comentario: string | null
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()

const txt = (v: unknown, max: number): string | null => {
  const s = String(v ?? '').replace(/\s+/g, ' ').trim()
  return s ? s.slice(0, max) : null
}

export const Route = createFileRoute('/api/public/kb-questoes-reais')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        const topicos = (body.topicos || []).filter(Boolean)
        const keys = await aiKeys()

        /* ----- 1. extração literal das questões reais ----- */
        const rota = await rotaDoAgente('tarefas_simples')
        const adminExtra = await rotaDoAgente('assistente_admin')
        const system = [
          'Você extrai questões REAIS de provas anteriores a partir do texto bruto de uma apostila de questões.',
          'Tarefa ÚNICA: copiar cada questão real completa que aparecer no texto. NUNCA invente, NUNCA parafraseie, NUNCA complete lacunas.',
          'Regras obrigatórias:',
          '- Copie o enunciado LITERALMENTE, incluindo a numeração apenas se fizer parte do item.',
          '- Só extraia itens de julgamento CERTO/ERRADO (estilo Cebraspe/CESPE) cujo gabarito esteja indicado no texto (gabarito, chave de resposta, "C"/"E").',
          '- Se o gabarito não estiver escrito no material, DESCARTE a questão.',
          '- Preencha banca, orgao, cargo e ano SOMENTE quando estiverem escritos no material (ex.: "Cebraspe · PRF · Policial Rodoviário Federal · 2021"); caso contrário use null.',
          '- Se houver comentário/justificativa da banca no texto, copie-o resumido em "comentario"; senão use null.',
          '- Descarte capas, índices, propagandas, textos de teoria e questões incompletas.',
          ...(adminExtra.promptExtra
            ? ['', 'Orientação adicional do administrador (siga, mas sem deixar de responder no formato JSON pedido):', adminExtra.promptExtra]
            : []),
          'Responda SOMENTE com JSON válido:',
          '{"questoes":[{"enunciado":"...","gabarito":"C","banca":"Cebraspe","orgao":"PRF","cargo":"Policial Rodoviário Federal","ano":2021,"comentario":null}]}',
        ].join('\n')

        const user = [
          body.total_partes && body.total_partes > 1
            ? `Este é o pedaço ${body.parte || 1} de ${body.total_partes} da apostila. Extraia apenas o que aparecer neste pedaço.`
            : '',
          `TEXTO DA APOSTILA:\n${body.texto}`,
        ]
          .filter(Boolean)
          .join('\n\n')

        let raw = ''
        try {
          raw = await chat({ provider: rota.provider, model: rota.model, system, user, keys, maxTokens: 16000 })
        } catch (e) {
          const err = e as AIError
          return Response.json({ error: err.message || 'A IA não conseguiu ler a apostila agora.' }, { status: err.status || 502 })
        }

        const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)
        let parsed: { questoes?: Array<Record<string, unknown>> }
        try {
          parsed = JSON.parse(json)
        } catch {
          return Response.json({ error: 'A IA retornou um formato inesperado. Tente novamente.' }, { status: 502 })
        }

        const questoes: Questao[] = []
        const vistos = new Set<string>()
        for (const q of parsed.questoes || []) {
          const enunciado = txt(q['enunciado'], 2000)
          if (!enunciado || enunciado.length < 25) continue
          const gab = String(q['gabarito'] || '').trim().toUpperCase()
          const gabarito = gab.startsWith('C') ? 'C' : gab.startsWith('E') ? 'E' : null
          if (!gabarito) continue
          const chave = norm(enunciado).slice(0, 200)
          if (vistos.has(chave)) continue
          vistos.add(chave)
          const anoNum = Number(q['ano'])
          questoes.push({
            enunciado,
            gabarito,
            banca: txt(q['banca'], 60),
            orgao: txt(q['orgao'], 80),
            cargo: txt(q['cargo'], 120),
            ano: Number.isInteger(anoNum) && anoNum > 1990 && anoNum < 2100 ? anoNum : null,
            comentario: txt(q['comentario'], 2000),
          })
        }

        if (!questoes.length)
          return Response.json({ extraidas: 0, salvas: 0, duplicadas: 0, sem_topico: 0, porTopico: {}, modelo: rota.model })

        /* ----- 2. classificação no tópico do edital (lógica do kb-classify) ----- */
        const topicoPorIndice = new Map<number, string>()
        if (topicos.length) {
          const validos = new Set(topicos)
          const LOTE = 12
          for (let ini = 0; ini < questoes.length; ini += LOTE) {
            const trechos = questoes.slice(ini, ini + LOTE).map((q, j) => ({ i: ini + j, amostra: q.enunciado.slice(0, 900) }))
            const sysC = [
              'Você organiza material de estudo para concursos.',
              'Receberá a lista oficial de tópicos de uma disciplina e vários trechos (enunciados de questões).',
              'Tarefa ÚNICA: dizer a qual tópico da lista cada trecho pertence. NÃO reescreva, NÃO resuma, NÃO comente.',
              '- Use exatamente o texto de um tópico da lista.',
              '- Se o trecho não pertencer claramente a nenhum tópico, devolva "topico": "".',
              'Responda SOMENTE com JSON válido: {"mapa":[{"i":<número do trecho>,"topico":"<tópico exato ou vazio>"}]}',
            ].join('\n')
            const userC = [
              `Disciplina: ${body.disciplina}`,
              `Tópicos oficiais:\n${topicos.map((t) => `- ${t}`).join('\n')}`,
              'TRECHOS:',
              trechos.map((t) => `[${t.i}]\n${t.amostra}`).join('\n\n---\n\n'),
            ].join('\n\n')
            try {
              const rawC = await chat({ provider: rota.provider, model: rota.model, system: sysC, user: userC, keys, maxTokens: 4000 })
              const jsonC = rawC.slice(rawC.indexOf('{'), rawC.lastIndexOf('}') + 1)
              const parsedC = JSON.parse(jsonC) as { mapa?: Array<{ i: number; topico?: string }> }
              for (const m of parsedC.mapa || []) {
                if (m && Number.isInteger(m.i) && m.topico && validos.has(m.topico)) topicoPorIndice.set(m.i, m.topico)
              }
            } catch {
              /* classificação falhou neste lote — salva sem tópico */
            }
          }
        }

        /* ----- 3. deduplica contra o que já existe no banco ----- */
        const existentes = new Set<string>()
        try {
          const r = await fetch(
            `${SUPABASE_URL}/rest/v1/questions?course_slug=eq.${encodeURIComponent(curso)}&discipline_nome=eq.${encodeURIComponent(body.disciplina)}&select=enunciado&limit=5000`,
            { headers: serviceHeaders() },
          )
          if (r.ok) {
            for (const row of (await r.json()) as Array<{ enunciado: string }>) {
              existentes.add(norm(row.enunciado || '').slice(0, 200))
            }
          }
        } catch {
          /* segue sem deduplicar contra o banco */
        }

        const novas = questoes.filter((q) => !existentes.has(norm(q.enunciado).slice(0, 200)))
        const duplicadas = questoes.length - novas.length

        /* ----- 4. grava como questões reais verificadas ----- */
        const porTopico: Record<string, number> = {}
        let semTopico = 0
        const linhas = novas.map((q, idx) => {
          const originalIdx = questoes.indexOf(q)
          void idx
          const topico = topicoPorIndice.get(originalIdx) || null
          if (topico) porTopico[topico] = (porTopico[topico] || 0) + 1
          else semTopico++
          return {
            course_slug: curso,
            discipline_nome: body.disciplina,
            topic_nome: topico,
            enunciado: q.enunciado,
            tipo: 'ce',
            gabarito: q.gabarito,
            alternativas: [],
            comentario: q.comentario,
            banca: q.banca || 'Cebraspe',
            orgao: q.orgao,
            cargo: q.cargo,
            ano: q.ano,
            nivel: null,
            origem: 'real',
            verificada: true,
            fonte: 'apostila enviada pelo administrador',
            ativa: true,
          }
        })

        let salvas = 0
        if (linhas.length) {
          const r = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
            method: 'POST',
            headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
            body: JSON.stringify(linhas),
          })
          if (!r.ok) {
            const detalhe = await r.text().catch(() => '')
            return Response.json({ error: `Falha ao gravar as questões extraídas (${r.status}). ${detalhe.slice(0, 200)}` }, { status: 502 })
          }
          salvas = linhas.length
        }

        return Response.json({ extraidas: questoes.length, salvas, duplicadas, sem_topico: semTopico, porTopico, modelo: rota.model })
      },
    },
  },
})
