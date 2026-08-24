import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { doutrina, salvarDoutrina, DOUTRINA_PADRAO } from '@/lib/doutrina'
import { SUPABASE_URL, serviceHeaders, requirePedagogicalAdmin, aiKeys } from '@/lib/px-server'
import { MODELOS, chatEx, AIError, type Provider } from '@/lib/ai-gateway'
import { AGENTES } from '@/lib/ai-router'

/* Central de IA (admin): lista agentes e rotas, salva roteamento, testa
   modelos com uma chamada real e registra o resultado em ai_integrations. */

const PROVEDORES = Object.keys(MODELOS) as Provider[]

const NOMES: Record<string, string> = {
  lovable: 'IA inclusa (Lovable)',
  openai: 'OpenAI (GPT)',
  gemini: 'Google Gemini',
  anthropic: 'Anthropic (Claude)',
  elevenlabs: 'ElevenLabs (voz)',
}

const SalvarRota = z.object({
  acao: z.literal('salvar_rota'),
  agent: z.string().min(1).max(60),
  provider: z.string().min(1),
  model: z.string().max(120).optional().default(''),
  custom_model: z.string().max(120).optional().default(''),
  fallback_provider: z.string().max(40).optional().default(''),
  fallback_model: z.string().max(120).optional().default(''),
  fallback_ativo: z.boolean().optional().default(true),
  prompt_extra: z.string().max(4000).optional().default(''),
  limite_diario: z.number().int().min(0).max(10000).optional().default(0),
})

const TestarModelo = z.object({
  acao: z.literal('testar_modelo'),
  provider: z.string().min(1),
  model: z.string().min(1).max(120),
})

const SalvarPrompt = z.object({
  acao: z.literal('salvar_prompt'),
  agent: z.string().min(1).max(60),
  prompt_extra: z.string().max(4000),
})

const SalvarDoutrina = z.object({
  acao: z.literal('salvar_doutrina'),
  texto: z.string().max(40000),
})

const LerDoutrina = z.object({ acao: z.literal('ler_doutrina') })

const Body = z.discriminatedUnion('acao', [SalvarRota, TestarModelo, SalvarPrompt, SalvarDoutrina, LerDoutrina])

function modeloValido(provider: Provider, model: string, custom: string) {
  if (custom) return /^[\w./:-]{2,120}$/.test(custom) // formato livre, sem espaços
  return MODELOS[provider].includes(model)
}

async function registrarTeste(provedor: string, ok: boolean, detalhe: string) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/ai_integrations`, {
      method: 'POST',
      headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({
        provedor,
        nome: NOMES[provedor] || provedor,
        ultimo_teste: new Date().toISOString(),
        teste_ok: ok,
        teste_detalhe: detalhe.slice(0, 300),
        updated_at: new Date().toISOString(),
      }),
    })
  } catch {
    /* registro é best-effort */
  }
}

export const Route = createFileRoute('/api/public/ai-central')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied
        const h = serviceHeaders()
        const [rotasR, integR] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/ai_agent_settings?select=*`, { headers: h }).then((r) => (r.ok ? r.json() : [])),
          fetch(`${SUPABASE_URL}/rest/v1/ai_integrations?select=*`, { headers: h }).then((r) => (r.ok ? r.json() : [])),
        ])
        const k = await aiKeys()
        return Response.json({
          agentes: AGENTES,
          rotas: Array.isArray(rotasR) ? rotasR : [],
          integracoes: Array.isArray(integR) ? integR : [],
          conectado: {
            lovable: !!k.lovable,
            openai: !!k.openai,
            gemini: !!k.gemini,
            anthropic: !!k.anthropic,
            elevenlabs: !!k.elevenlabs,
          },
          modelos: MODELOS,
        })
      },

      POST: async ({ request }) => {
        const denied = await requirePedagogicalAdmin(request)
        if (denied) return denied

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        if (body.acao === 'salvar_rota') {
          if (!AGENTES.some((a) => a.slug === body.agent))
            return Response.json({ error: 'Agente desconhecido.' }, { status: 400 })
          if (!PROVEDORES.includes(body.provider as Provider))
            return Response.json({ error: 'Provedor desconhecido.' }, { status: 400 })
          if (!modeloValido(body.provider as Provider, body.model, body.custom_model))
            return Response.json(
              { error: 'Modelo inválido: escolha um do catálogo ou informe um identificador personalizado válido (sem espaços).' },
              { status: 400 },
            )
          const fbProv = body.fallback_provider
          if (fbProv && !PROVEDORES.includes(fbProv as Provider))
            return Response.json({ error: 'Provedor de fallback desconhecido.' }, { status: 400 })

          const r = await fetch(`${SUPABASE_URL}/rest/v1/ai_agent_settings`, {
            method: 'POST',
            headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
            body: JSON.stringify({
              agent_slug: body.agent,
              provider: body.provider,
              model: body.model || MODELOS[body.provider as Provider][0],
              custom_model: body.custom_model || null,
              fallback_provider: fbProv || null,
              fallback_model: body.fallback_model || null,
              fallback_ativo: body.fallback_ativo,
              prompt_extra: body.prompt_extra || null,
              limite_diario: body.limite_diario,
              updated_at: new Date().toISOString(),
            }),
          })
          if (!r.ok) return Response.json({ error: 'Não consegui salvar a rota.' }, { status: 502 })
          return Response.json({ ok: true })
        }

        if (body.acao === 'ler_doutrina') {
          return Response.json({ texto: await doutrina(), padrao: DOUTRINA_PADRAO })
        }

        if (body.acao === 'salvar_doutrina') {
          const ok = await salvarDoutrina(body.texto)
          if (!ok) return Response.json({ error: 'Não consegui salvar a doutrina.' }, { status: 502 })
          return Response.json({ ok: true, texto: await doutrina() })
        }

        if (body.acao === 'salvar_prompt') {
          if (!AGENTES.some((a) => a.slug === body.agent))
            return Response.json({ error: 'Agente desconhecido.' }, { status: 400 })
          const r = await fetch(
            `${SUPABASE_URL}/rest/v1/ai_agent_settings?agent_slug=eq.${encodeURIComponent(body.agent)}`,
            {
              method: 'PATCH',
              headers: serviceHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
              body: JSON.stringify({ prompt_extra: body.prompt_extra || null, updated_at: new Date().toISOString() }),
            },
          )
          if (!r.ok) return Response.json({ error: 'Não consegui salvar o prompt.' }, { status: 502 })
          return Response.json({ ok: true })
        }

        // testar_modelo: chamada real mínima, sem fallback — queremos saber se ESSA rota funciona.
        const provider = body.provider as Provider
        if (!PROVEDORES.includes(provider)) return Response.json({ error: 'Provedor desconhecido.' }, { status: 400 })
        const keys = await aiKeys()
        const t0 = Date.now()
        try {
          const r = await chatEx({
            provider,
            model: body.model,
            system: 'Você é um verificador de conectividade. Responda apenas: ok',
            user: 'Teste de conexão da Central de IA do Prova X.',
            keys,
            maxTokens: 16,
          })
          const ms = Date.now() - t0
          await registrarTeste(provider, true, `modelo ${r.model} respondeu em ${ms}ms`)
          return Response.json({ ok: true, detalhe: `respondeu em ${(ms / 1000).toFixed(1)}s`, provider: r.provider, model: r.model })
        } catch (e) {
          const err = e as AIError
          const detalhe = err.message || 'falhou'
          await registrarTeste(provider, false, detalhe)
          return Response.json({ ok: false, detalhe, status: err.status || 502 })
        }
      },
    },
  },
})
