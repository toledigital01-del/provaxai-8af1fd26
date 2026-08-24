# Mapa Mental ligado ao painel administrativo

Hoje a aba "Mapa Mental" do aluno improvisa o mapa a partir do resumo gerado na hora. O painel já tem o módulo "Mapa mental" no pacote "IA da aula" (gerar, editar, melhorar, publicar), e ao publicar ele grava o conteúdo em `aula_recursos` com tipo `mapa_mental`. Falta apenas a ponte: o aluno precisa ler exatamente o mapa publicado pelo administrador.

## O que muda

1. **Fonte oficial do mapa**: a aba do aluno passa a exibir o mapa mental publicado no painel, com o mesmo conteúdo, para todos os alunos, sem custo de geração e sem variação a cada abertura.
2. **Atualização imediata**: quando o administrador reeditar/republicar o módulo "Mapa mental" da aula, a tela do aluno passa a mostrar a nova versão na próxima abertura.
3. **Quando ainda não houver mapa publicado**: a aula mostra um aviso claro ("mapa em produção") e, como hoje, oferece a geração pela Athena como alternativa temporária — sem sobrescrever o conteúdo oficial.
4. **Fora do escopo de um tópico** (visão por disciplina/geral): a aba lista as aulas que já têm mapa publicado, no mesmo padrão das outras abas.

## Detalhes técnicos

- Novo endpoint `src/routes/api/public/mapa.ts`:
  - lê `aula_recursos` (`tipo = 'mapa_mental'`) via `lerRecurso(curso, disciplina, topico, 'mapa_mental')` e devolve `{ conteudo, modelo, cache: true }`;
  - se não existir e o cliente pedir `gerar: true`, chama o agente de IA (mesmo prompt do módulo em `src/lib/aula-pacote.ts`) e devolve o resultado como conteúdo provisório, sem gravar como publicado;
  - segue o padrão dos demais endpoints (`resumo.ts`) para autenticação/limite diário.
- `public/workspace.html`: `renderMapa`/`mapaCarregar` passam a chamar `PX.iaPost('mapa', …)` em vez de reaproveitar `resumo`, e o parser passa a interpretar o Markdown hierárquico do módulo (`#` tema central, `##` ramos, `-`/`  -` folhas) em vez de blocos de resumo, mantendo o visual atual de ramos coloridos.
- Sem mudanças de schema: `aula_recursos` já cobre o caso; publicação e exclusão do módulo já estão implementadas em `src/lib/aula-pacote.ts`.
