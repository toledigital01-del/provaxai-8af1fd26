/* Cache persistente do conteúdo já publicado.
   Os artefatos da aula (aula, resumo, lacunas, podcast, mapa) mudam apenas
   quando o professor publica de novo, então a resposta pode ser guardada:
   - na memória do servidor (evita ida ao banco em chamadas próximas);
   - na borda/navegador, via Cache-Control (abre instantaneamente na volta).
   Também mede o tempo gasto e devolve em Server-Timing, para a telemetria. */

type Entrada = { valor: unknown; expira: number }

const memoria = new Map<string, Entrada>()
const TTL_PADRAO = 10 * 60 * 1000
const MAX_ITENS = 400

export function cacheChave(rota: string, partes: Array<string | null | undefined>) {
  return rota + '|' + partes.map((p) => (p || '').trim().toLowerCase()).join('|')
}

export function cacheLer<T>(chave: string): T | null {
  const e = memoria.get(chave)
  if (!e) return null
  if (Date.now() > e.expira) {
    memoria.delete(chave)
    return null
  }
  return e.valor as T
}

export function cacheGravar(chave: string, valor: unknown, ttlMs = TTL_PADRAO) {
  if (memoria.size >= MAX_ITENS) {
    const primeira = memoria.keys().next().value
    if (primeira) memoria.delete(primeira)
  }
  memoria.set(chave, { valor, expira: Date.now() + ttlMs })
}

export function cacheLimpar(prefixo: string) {
  for (const k of memoria.keys()) if (k.startsWith(prefixo)) memoria.delete(k)
}

/** Resposta de conteúdo publicado: cacheável na borda e no navegador. */
export function jsonPublicado(dados: Record<string, unknown>, inicio: number, deMemoria = false) {
  return Response.json(dados, {
    headers: {
      'Cache-Control': 'public, max-age=120, s-maxage=86400, stale-while-revalidate=604800',
      'Server-Timing': `app;dur=${Math.round(performance.now() - inicio)}, fonte;desc="${deMemoria ? 'memoria' : 'banco'}"`,
    },
  })
}

/** Resposta que não deve ser reaproveitada (erros, geração sob demanda). */
export function jsonDireto(dados: Record<string, unknown>, inicio: number, status = 200) {
  return Response.json(dados, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Server-Timing': `app;dur=${Math.round(performance.now() - inicio)}`,
    },
  })
}
