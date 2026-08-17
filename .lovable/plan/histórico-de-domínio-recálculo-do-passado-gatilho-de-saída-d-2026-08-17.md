# Histórico de domínio: recálculo do passado + gatilho de saída da página

## Respostas às duas perguntas (verificado no banco)

1. **Só os novos.** A fórmula ponderada passou a valer a partir da mudança; as linhas antigas continuam com o valor calculado pela regra antiga. Hoje existe exatamente **1 linha** em `dominio_snapshots` (dia 2026-08-17, `dominio = 50`, `por_disciplina = {}`). Esse 50 é a média simples dos **2 tópicos já tocados**; pela fórmula atual (ponderada sobre os **91 tópicos** do edital) o valor correto do dia seria **1**. Ou seja: o único ponto do histórico está errado e vale reprocessar.

2. **Não existe gatilho de saída.** Os gatilhos hoje são: sincronizar progresso (login), salvar progresso, registrar sessão de estudo e responder questão — todos com debounce de 30s. Não há `beforeunload` nem `visibilitychange`. E o acesso do dia seguinte **não recupera** o dia perdido: `saveSnapshot()` sempre grava com a data de *hoje* (fuso São Paulo), nunca retroativa. Se o aluno estudar e a última alteração cair dentro da janela de debounce e ele fechar a aba, aquele dia fica sem registro (ou com um valor defasado).

## O que fazer

### 1. Reprocessar o histórico existente (uma vez)
Migração única que recalcula todas as linhas de `dominio_snapshots` a partir de `topic_progress`, com a mesma fórmula da tela:

- `dominio` = soma dos domínios dos tópicos do curso ÷ total de tópicos do curso (91 hoje, contado dinamicamente na tabela `topics`), arredondado.
- `acertos_pct`, `questoes`, `tempo_segundos` = agregados de `topic_progress` do aluno.
- `por_disciplina` = índice por disciplina, no mesmo formato que o app grava.

Observação honesta: `topic_progress` guarda só o estado **atual**, não o estado histórico de cada dia. Com 1 linha (a de hoje) isso é exato. Se no futuro houver linhas de dias passados, o recálculo as aproximaria pelo estado atual — por isso o certo é rodar agora, enquanto o histórico é de um único dia.

### 2. Gatilho de segurança na saída da página
Em `public/px-auth.js`:

- Adicionar listener de `visibilitychange` (quando `document.visibilityState === 'hidden'`) e de `pagehide`, chamando `PX.saveSnapshot(true)` — ignora o debounce, pois é a última chance de gravar.
- Usar `navigator.sendBeacon` para o envio nesse momento (requisição `fetch` normal pode ser abortada quando a aba fecha), com fallback para o upsert atual quando `sendBeacon` não estiver disponível.
- `beforeunload` não é usado sozinho: é pouco confiável em mobile; `pagehide`/`visibilitychange` cobrem os dois casos.
- Registrar o listener uma única vez e só quando houver usuário logado, para não gerar chamadas em páginas públicas.

### 3. Rede de proteção contra dia perdido
Ao sincronizar o progresso no primeiro acesso do dia, se o último snapshot for de um dia anterior e `topic_progress` tiver `updated_at` posterior a esse snapshot, gravar também uma linha para a data desse último acesso — assim um dia de estudo encerrado sem gravação é recuperado no acesso seguinte, em vez de sumir.

## Detalhes técnicos

- Arquivo tocado: `public/px-auth.js` (listeners de saída, `sendBeacon`, recuperação do dia anterior).
- Uma migração SQL de dados (UPDATE em `dominio_snapshots`), sem mudança de schema — a coluna `por_disciplina` já existe.
- Sem alterações visuais; `public/desempenho.html` continua com estado vazio até 3 pontos.
