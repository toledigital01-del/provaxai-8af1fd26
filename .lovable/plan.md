# Auditoria do Prova X — o que melhorar para o aluno e para o painel

Levantamento feito lendo as páginas do aluno, o console administrativo e consultando o banco de verdade. Abaixo está o que encontrei, com sugestões em ordem de impacto.

## O que está sólido

- Navegação aluno: Concursos → Disciplina → Tópico → Workspace, com trava de acesso em todas as páginas pagas.
- Desempenho, Cobertura do edital e snapshots diários de domínio funcionando.
- Console admin com base de conhecimento, montagem de curso por IA, alunos, preços e integrações de IA.

## Problemas confirmados (dados reais do banco)

1. **Curso incompleto: 9 das 15 disciplinas não têm nenhuma aula publicada.** Só 44 dos 91 tópicos têm conteúdo (Português, Constitucional, Trânsito, Administrativo, Penal e Informática). O aluno que assinar hoje encontra "conteúdo em preparação" na maior parte do edital.
2. **Banco de questões raso: 182 questões para 91 tópicos (2 por tópico)** e 182 flashcards (2 por tópico). Não sustenta simulado nem revisão.
3. **Nenhuma tentativa de questão foi registrada (`question_attempts` = 0 linhas).** As telas de Questões/Simulado não gravam no banco, então "acertos, erros e saldo Cebraspe" no Desempenho nunca saem de zero, mesmo com o aluno praticando.
4. **Anotações só ficam no navegador.** O workspace salva em `localStorage`; a tabela `notes` está vazia. Trocar de aparelho ou limpar o cache apaga tudo.
5. **Cronograma só fica no navegador.** A tabela `study_blocks` está vazia; o plano não acompanha o aluno entre dispositivos e não alimenta o "estudo do dia".
6. **Revisão espaçada não usa o algoritmo.** Os flashcards têm `ease`, `intervalo_dias` e `due_at` no banco, mas a tela não atualiza esses campos — não existe fila real de "cards para hoje".
7. **Athena sem trava de acesso pago.** A verificação está comentada no endpoint: qualquer conta logada consome créditos de IA.
8. **`admin.html` e `painel.html` entregam o endereço secreto do console** para quem digitar o caminho.
9. **Suporte existe no admin, mas não no app do aluno.** A tabela `support_tickets` está pronta e sem nenhuma tela para abrir chamado.

## Sugestões para o aluno

**Essenciais (destravam a venda)**
- Gravar cada resposta em `question_attempts` e cada sessão de estudo, ligando Desempenho/Cobertura aos números reais.
- Migrar anotações e cronograma do navegador para o banco (`notes`, `study_blocks`), mantendo o que já existe no aparelho.
- Ativar a revisão espaçada de verdade: botões Errei/Difícil/Bom/Fácil recalculando `ease`/`intervalo_dias`/`due_at` e uma fila "cards de hoje".
- Reativar a trava de acesso da Athena e o limite diário por aluno.

**Experiência**
- Tela inicial com "próxima ação recomendada" (tópico mais fraco por peso do edital × domínio) em vez de só cards.
- Onboarding curto no primeiro login: data da prova, horas por dia, dias de descanso → gera o cronograma.
- Marcar tópico como concluído direto no workspace, com atualização imediata da barra de domínio.
- Ofensiva/sequência de dias estudados e meta semanal simples.
- Central de ajuda com abertura de chamado (usa `support_tickets`) e página de conta (dados, plano, sair).
- Simulado completo cronometrado no padrão Cebraspe, com relatório final por disciplina.

## Sugestões para o painel administrativo

- **Semáforo de prontidão do curso**: por disciplina, quantos tópicos têm aula, questões e flashcards, e o que falta publicar — hoje isso só aparece consultando o banco.
- **Geração de questões e flashcards por IA em lote** por tópico, com revisão antes de publicar (mesmo fluxo de rascunho já usado nas aulas).
- **Fila de suporte**: responder chamados dos alunos direto no painel.
- **Painel de custo de IA**: consumo por dia, por ferramenta e por aluno a partir de `ai_logs`, com alerta de limite.
- **Visão de engajamento**: alunos ativos na semana, tópicos mais e menos estudados, alunos parados há 7+ dias.
- Remover `admin.html` e `painel.html`.

## Ordem sugerida

1. Registro real de questões/sessões + anotações e cronograma no banco.
2. Revisão espaçada + trava da Athena + remoção dos atalhos do painel.
3. Semáforo de prontidão e geração em lote de questões/flashcards (fecha a lacuna de conteúdo das 9 disciplinas).
4. Onboarding, próxima ação recomendada, suporte e conta.
5. Métricas de custo e engajamento no painel.

## Detalhes técnicos

- `public/workspace.html` / `public/solve.html` / `public/flashcard.html`: chamar `PX.logAttempt` e `PX.logSession` em cada resposta; substituir `localStorage` de anotações por `PX.saveNote`/`PX.getNote` com migração única do conteúdo local.
- `public/cronograma.html`: persistir via `study_plans` (já existe) e materializar blocos em `study_blocks`; leitura do dia no workspace.
- SRS: nova função em `px-auth.js` (`PX.reviewCard`) aplicando SM-2 simplificado sobre `flashcards.ease/intervalo_dias/due_at`; fila filtrada por `due_at <= hoje`.
- `src/routes/api/public/athena.ts`: reativar `hasCourseAccess` e o corte por `limite_diario` de `ai_settings`.
- Novo endpoint de geração em lote reaproveitando `ai-gateway.ts` e o contexto de `kb-context.ts`, gravando em `questions`/`flashcards` como rascunho.
- Excluir `public/admin.html` e `public/painel.html`.
