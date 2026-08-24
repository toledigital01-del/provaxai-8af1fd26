import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { requirePedagogicalAdmin, aiKeys, currentUser } from '@/lib/px-server'
import { rotaDoAgente, rotasPacote } from '@/lib/ai-router'
import {
  TIPOS,
  MODULOS,
  type TipoModulo,
  versoes,
  salvarVersao,
  publicarVersao,
  despublicarModulo,
  gerarModulo,
  acrescentarModulo,
  melhorarModulo,
  sincronizarPacote,
  materialIntegral,
  filtroAula,
} from '@/lib/aula-pacote'
import { SUPABASE_URL, serviceHeaders } from '@/lib/px-server'
import { doutrina, lerEditorial, salvarEditorial, STATUS_EDITORIAL } from '@/lib/doutrina'

/* Painel "IA da Aula": o administrador gera, edita, acrescenta, melhora,
   regenera, versiona e publica cada módulo de conteúdo inteligente da aula.
   Uso exclusivo do admin — o aluno só recebe o que for publicado. */

const Body = z.object({
  acao: z.enum([
    'listar',
    'gerar',
    'salvar',
    'acrescentar',
    'melhorar',
    'regenerar',
    'publicar',
    'despublicar',
    'historico',
    'restaurar',
    'sincronizar',
    'salvar-config',
    'salvar-editorial',
  ]),
  curso: z.string().max(80).optional(),
  disciplina: z.string().min(1).max(200),
  topico: z.string().min(1).max(300),
  tipo: z.string().max(40).optional(),
  conteudo: z.string().max(400000).optional(),
  instrucao: z.string().max(2000).optional(),
  modo: z.enum(['original', 'com-alteracoes', 'acrescentando']).optional(),
  publicar: z.boolean().optional(),
  versaoId: z.string().max(60).optional(),
  editorial: z
    .object({
      status: z.string().max(30).optional(),
      versao_rotulo: z.string().max(20).optional(),
      observacoes: z.string().max(4000).optional(),
      proxima_revisao: z.string().max(20).optional(),
      verificado: z.boolean().optional(),
    })
    .optional(),
  config: z
    .object({
      instrucoes: z.string().max(4000).optional(),
      questoes: z
        .object({
          quantidade: z.number().int().min(5).max(30).optional(),
          dificuldade: z.string().max(20).optional(),
          prioridades: z.array(z.string().max(30)).max(6).optional(),
          comentarios: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
})

function tipoValido(t?: string): t is TipoModulo {
  return !!t && (TIPOS as string[]).includes(t)
}

async function carregarCtx(curso: string, disciplina: string, topico: string, body: z.infer<typeof Body>) {
  const material = await materialIntegral(curso, disciplina, topico)
  const rotaBase = await rotaDoAgente('geracao_aulas')
  const rotas = await rotasPacote()
  const salva = await lerConfig(curso, disciplina, topico)
  const instrucoes = (body.config?.instrucoes ?? salva.instrucoes ?? '').trim()
  const questoes = body.config?.questoes ?? salva.questoes
  return {
    curso,
    disciplina,
    topico,
    material,
    instrucoes,
    questoes,
    provider: rotaBase.provider,
    model: rotaBase.model,
    rotas,
    doutrina: await doutrina(),
    keys: await aiKeys(),
  }
}

type PacoteConfig = {
  instrucoes?: string
  questoes?: { quantidade?: number; dificuldade?: string; prioridades?: string[]; comentarios?: boolean }
}

async function lerConfig(curso: string, disciplina: string, topico: string): Promise<PacoteConfig> {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/aula_conteudos?${filtroAula(curso, disciplina, topico, 'config')}&select=meta&limit=1`,
      { headers: serviceHeaders() },
    )
    if (!r.ok) return {}
    const rows = (await r.json()) as Array<{ meta: PacoteConfig }>
    return rows[0]?.meta || {}
  } catch {
    return {}
  }
}

export const Route = createFileRoute('/api/public/aula-pacote')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const negado = await requirePedagogicalAdmin(request)
        if (negado) return negado
        const userId = await currentUser(request)

        let body: z.infer<typeof Body>
        try {
          body = Body.parse(await request.json())
        } catch {
          return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
        }

        const curso = body.curso || 'prf-2021'
        const { disciplina, topico } = body

        /* ----- listar o estado de todos os módulos da aula ----- */
        if (body.acao === 'listar') {
          const todas = await versoes(curso, disciplina, topico)
          const config = await lerConfig(curso, disciplina, topico)
          const modulos = MODULOS.map((m) => {
            const vs = todas.filter((v) => v.tipo === m.tipo)
            const atual = vs[0] || null
            const pub = vs.find((v) => v.publicado) || null
            return {
              tipo: m.tipo,
              rotulo: m.rotulo,
              formato: m.formato,
              totalVersoes: vs.length,
              atual: atual
                ? {
                    versao: atual.versao,
                    origem: atual.origem,
                    publicado: atual.publicado,
                    atualizado_em: atual.updated_at,
                    caracteres: atual.conteudo.length,
                    meta: atual.meta,
                  }
                : null,
              versaoPublicada: pub ? pub.versao : null,
            }
          })
          const editorial = await lerEditorial(curso, disciplina, topico)
          return Response.json({ modulos, config, editorial, statusEditorial: STATUS_EDITORIAL })
        }

        /* ----- salvar as instruções/configurações da aula ----- */
        if (body.acao === 'salvar-config') {
          await salvarVersao({
            curso,
            disciplina,
            topico,
            tipo: 'config',
            conteudo: '',
            meta: {
              instrucoes: (body.config?.instrucoes || '').trim(),
              questoes: body.config?.questoes || {},
            },
            origem: 'admin',
            userId,
          })
          return Response.json({ ok: true })
        }

        /* ----- status editorial da aula ----- */
        if (body.acao === 'salvar-editorial') {
          const e = body.editorial || {}
          const validos = STATUS_EDITORIAL.map((s) => s.valor) as string[]
          if (e.status && !validos.includes(e.status))
            return Response.json({ error: 'Status editorial inválido.' }, { status: 400 })
          const ok = await salvarEditorial(curso, disciplina, topico, {
            ...(e.status ? { status: e.status } : {}),
            ...(e.versao_rotulo ? { versao_rotulo: e.versao_rotulo } : {}),
            ...(e.observacoes !== undefined ? { observacoes: e.observacoes || null } : {}),
            ...(e.proxima_revisao ? { proxima_revisao: e.proxima_revisao } : {}),
            ...(e.verificado ? { ultima_verificacao: new Date().toISOString() } : {}),
            atualizado_por: userId,
          })
          if (!ok) return Response.json({ error: 'Não consegui salvar o status editorial.' }, { status: 502 })
          return Response.json({ ok: true, editorial: await lerEditorial(curso, disciplina, topico) })
        }

        /* ----- histórico de versões de um módulo ----- */
        if (body.acao === 'historico') {
          if (!tipoValido(body.tipo)) return Response.json({ error: 'Módulo inválido.' }, { status: 400 })
          const vs = await versoes(curso, disciplina, topico, body.tipo)
          return Response.json({
            versoes: vs.map((v) => ({
              id: v.id,
              versao: v.versao,
              origem: v.origem,
              publicado: v.publicado,
              instrucao: v.instrucao,
              caracteres: v.conteudo.length,
              criado_em: v.created_at,
              meta: v.meta,
              conteudo: v.conteudo,
            })),
          })
        }

        if (body.acao === 'restaurar') {
          if (!body.versaoId || !tipoValido(body.tipo))
            return Response.json({ error: 'Versão inválida.' }, { status: 400 })
          const vs = await versoes(curso, disciplina, topico, body.tipo)
          const alvo = vs.find((v) => v.id === body.versaoId)
          if (!alvo) return Response.json({ error: 'Versão não encontrada.' }, { status: 404 })
          const nova = await salvarVersao({
            curso,
            disciplina,
            topico,
            tipo: body.tipo,
            conteudo: alvo.conteudo,
            meta: { ...(alvo.meta || {}), restaurada_da_versao: alvo.versao },
            origem: 'admin',
            instrucao: `Restaurada da versão ${alvo.versao}`,
            userId,
          })
          if (!nova) return Response.json({ error: 'Não consegui restaurar.' }, { status: 500 })
          return Response.json({ ok: true, versao: nova.versao })
        }

        /* ----- publicar / despublicar ----- */
        if (body.acao === 'publicar') {
          await salvarEditorial(curso, disciplina, topico, { status: 'publicado', atualizado_por: userId }).catch(() => null)
        }
        if (body.acao === 'publicar' || body.acao === 'despublicar') {
          if (!tipoValido(body.tipo)) return Response.json({ error: 'Módulo inválido.' }, { status: 400 })
          if (body.acao === 'despublicar') {
            await despublicarModulo(curso, disciplina, topico, body.tipo)
            return Response.json({ ok: true })
          }
          const vs = await versoes(curso, disciplina, topico, body.tipo)
          const alvo = body.versaoId ? vs.find((v) => v.id === body.versaoId) : vs[0]
          if (!alvo) return Response.json({ error: 'Nada para publicar neste módulo.' }, { status: 422 })
          const ok = await publicarVersao({ ...alvo, course_slug: curso, disciplina, topico })
          if (!ok) return Response.json({ error: 'Não consegui publicar este conteúdo.' }, { status: 500 })
          return Response.json({ ok: true, versao: alvo.versao })
        }

        /* ----- edição manual ----- */
        if (body.acao === 'salvar') {
          if (!tipoValido(body.tipo)) return Response.json({ error: 'Módulo inválido.' }, { status: 400 })
          const conteudo = (body.conteudo || '').trim()
          if (!conteudo) return Response.json({ error: 'Conteúdo vazio.' }, { status: 422 })
          const formato = MODULOS.find((m) => m.tipo === body.tipo)?.formato
          if (formato === 'json') {
            try {
              const arr = JSON.parse(conteudo)
              if (!Array.isArray(arr) || !arr.length) throw new Error('vazio')
            } catch {
              return Response.json({ error: 'JSON inválido — confira o conteúdo antes de salvar.' }, { status: 422 })
            }
          }
          const vs = await versoes(curso, disciplina, topico, body.tipo)
          const nova = await salvarVersao({
            curso,
            disciplina,
            topico,
            tipo: body.tipo,
            conteudo,
            meta: { ...(vs[0]?.meta || {}), editado_manualmente: true },
            origem: vs.length ? 'ia+admin' : 'admin',
            instrucao: body.instrucao || 'Editado manualmente',
            publicado: false,
            userId,
          })
          if (!nova) return Response.json({ error: 'Não consegui salvar.' }, { status: 500 })
          if (body.publicar) await publicarVersao({ ...nova, course_slug: curso, disciplina, topico })
          return Response.json({ ok: true, versao: nova.versao, publicado: !!body.publicar })
        }

        /* ----- ações que usam IA ----- */
        if (['gerar', 'acrescentar', 'melhorar', 'regenerar'].includes(body.acao)) {
          if (!tipoValido(body.tipo)) return Response.json({ error: 'Módulo inválido.' }, { status: 400 })
          const ctx = await carregarCtx(curso, disciplina, topico, body)
          if (ctx.material.length < 200)
            return Response.json(
              { error: 'Ainda não há material suficiente nesta aula para a IA trabalhar.' },
              { status: 422 },
            )
          const vs = await versoes(curso, disciplina, topico, body.tipo)
          const atual = vs[0] || null
          const tipo = body.tipo

          try {
            let resultado: { conteudo: string; meta: Record<string, unknown> }
            let instrucaoUsada = body.instrucao || null

            if (body.acao === 'gerar') {
              if (atual && !body.modo) {
                // geração simples respeita o que já existe: não sobrescreve à toa
                if (body.publicar && !atual.publicado)
                  await publicarVersao({ ...atual, course_slug: curso, disciplina, topico })
                return Response.json({ ok: true, cache: true, versao: atual.versao })
              }
              resultado = await gerarModulo(tipo, ctx)
              instrucaoUsada = instrucaoUsada || 'Gerado a partir do material da aula'
            } else if (body.acao === 'acrescentar') {
              if (!atual) return Response.json({ error: 'Gere o conteúdo primeiro para depois acrescentar.' }, { status: 422 })
              if (!body.instrucao?.trim())
                return Response.json({ error: 'Escreva o que deseja acrescentar.' }, { status: 422 })
              resultado = await acrescentarModulo(tipo, ctx, atual.conteudo, body.instrucao.trim())
            } else if (body.acao === 'melhorar') {
              if (!atual) return Response.json({ error: 'Gere o conteúdo primeiro para depois melhorar.' }, { status: 422 })
              if (!body.instrucao?.trim())
                return Response.json({ error: 'Escolha ou escreva como melhorar.' }, { status: 422 })
              resultado = await melhorarModulo(tipo, ctx, atual.conteudo, body.instrucao.trim())
            } else {
              // regenerar — nunca apaga a versão anterior
              const modo = body.modo || 'original'
              if (modo === 'original' || !atual) {
                resultado = await gerarModulo(tipo, ctx)
                instrucaoUsada = instrucaoUsada || 'Regenerado a partir do material original'
              } else if (modo === 'com-alteracoes') {
                resultado = await melhorarModulo(
                  tipo,
                  ctx,
                  atual.conteudo,
                  body.instrucao?.trim() ||
                    'Reescreva mantendo as edições e melhorias já feitas pelo administrador, completando o que estiver fraco a partir do material da aula.',
                )
                instrucaoUsada = instrucaoUsada || 'Regenerado considerando as alterações do administrador'
              } else {
                const fresco = await gerarModulo(tipo, ctx)
                resultado = await acrescentarModulo(
                  tipo,
                  ctx,
                  atual.conteudo,
                  body.instrucao?.trim() || 'Acrescente informações novas e relevantes do material que ainda não estejam no conteúdo atual.',
                )
                void fresco
                instrucaoUsada = instrucaoUsada || 'Regenerado acrescentando novas informações'
              }
            }

            if (!resultado.conteudo.trim())
              return Response.json({ error: 'A IA não devolveu conteúdo válido.' }, { status: 502 })

            const publicarAgora = !!body.publicar
            const nova = await salvarVersao({
              curso,
              disciplina,
              topico,
              tipo,
              conteudo: resultado.conteudo,
              meta: { ...(atual?.meta || {}), ...resultado.meta },
              origem: body.acao === 'gerar' || body.acao === 'regenerar' ? 'ia' : 'ia+admin',
              instrucao: instrucaoUsada,
              publicado: publicarAgora,
              userId,
            })
            if (!nova) return Response.json({ error: 'Não consegui salvar a nova versão.' }, { status: 500 })
            if (publicarAgora) await publicarVersao({ ...nova, course_slug: curso, disciplina, topico })
            return Response.json({
              ok: true,
              cache: false,
              versao: nova.versao,
              caracteres: resultado.conteudo.length,
              meta: nova.meta,
              publicado: publicarAgora,
            })
          } catch (e) {
            const msg = e instanceof Error ? e.message : 'Falha na IA.'
            const status = (e as { status?: number }).status || 502
            return Response.json({ error: msg }, { status })
          }
        }

        /* ----- sincronizar o que já está no ar (fluxo de publicação antigo) ----- */
        if (body.acao === 'sincronizar') {
          const criados = await sincronizarPacote(curso, disciplina, topico)
          return Response.json({ ok: true, criados })
        }

        return Response.json({ error: 'Ação desconhecida.' }, { status: 400 })
      },
    },
  },
})
