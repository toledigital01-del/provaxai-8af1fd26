# Histórico do índice de domínio — o que já existe e o que falta

## 1. Estado atual (verificado)

O histórico **já existe**, não é preciso criar nada novo:

- Tabela `dominio_snapshots` no banco, com `user_id`, `course_slug`, `dia` (data), `dominio`, `acertos_pct`, `questoes`, `tempo_segundos`, e chave única por `user_id + course_slug + dia` (upsert, uma linha por dia — sem duplicidade).
- Gravação sem cron: `PX.saveSnapshot()` em `public/px-auth.js` é chamado ao sincronizar o progresso (login) e a cada `PX.saveProgress()`.
- Leitura: `PX.getSnapshots(90)` alimenta o gráfico de Evolução na aba Geral (`public/desempenho.html`), que já mantém o estado vazio enquanto houver menos de 3 pontos.

Hoje há apenas 1 linha gravada no banco (a de hoje), o que é coerente com a rotina recém-criada.

## 2. Problema real encontrado

O valor gravado no snapshot **não é o mesmo** exibido na tela:

- Tela: `desempenhoAgregado()` em `public/data.js` → média ponderada do domínio sobre **todos** os tópicos do edital.
- Snapshot: `PX.resumoGeral()` em `px-auth.js` → média simples apenas sobre os tópicos **já tocados** pelo aluno.

Resultado: a curva de evolução vai ficar sistematicamente acima do índice mostrado no KPI (hoje 50% no snapshot). Precisa ser o mesmo número.

## 3. Mudanças propostas

1. **Unificar o cálculo**: `PX.saveSnapshot()` passa a usar `desempenhoAgregado('prf-2021')` quando `public/data.js` estiver carregado (mesmo divisor: total de tópicos do currículo), com `resumoGeral()` só como fallback nas páginas que não carregam `data.js`. Grava `dominio`, `acertos_pct`, `questoes` e `tempo_segundos` a partir da mesma fonte.
2. **Ampliar os gatilhos**: chamar `PX.saveSnapshot()` também em `PX.logAttempt()` (questão respondida) e ao revisar flashcard / concluir aula, com um "debounce" simples (no máximo uma gravação a cada ~30s por sessão) para não gerar chamadas repetidas.
3. **Breakdown por disciplina**: gravar também um campo JSON opcional `por_disciplina` no snapshot (nome da disciplina → índice de domínio), via migração que adiciona a coluna. Custo baixo e permite, no futuro, evolução por disciplina.
4. **Gráfico**: manter a leitura atual, mas limitar a janela a ~84 dias (12 semanas) e continuar com o estado vazio até 3 pontos — sem mudança de comportamento visível.

## 4. Detalhes técnicos

- Migração: `ALTER TABLE public.dominio_snapshots ADD COLUMN por_disciplina jsonb NOT NULL DEFAULT '{}'::jsonb;` (RLS e grants já existentes permanecem).
- Arquivos tocados: `public/px-auth.js` (cálculo + gatilhos + debounce), `public/desempenho.html` (janela de 84 dias).
- Nenhuma alteração no layout ou nas cores da aba Geral.
