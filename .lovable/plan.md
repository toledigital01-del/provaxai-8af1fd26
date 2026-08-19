# Material completo liberado + aula da Athena inalterada

## Decisões confirmadas

1. **Duas abas separadas, nenhuma substitui a outra**
   - **Aula com Athena IA** — continua exatamente como está hoje (Modo Aprovação: Mapa do tópico, Teoria essencial, Como a banca cobra, Pegadinhas, Letra de lei, Resumo relâmpago, Treino rápido). Sem mudança de tamanho, prompt ou conteúdo.
   - **Material completo** — texto integral dos documentos-fonte da matéria, sem resumo, sem corte e **sem nenhuma chamada de IA**. É leitura direta do campo já salvo no banco no momento do upload, então carrega na hora: nada de barra de progresso, geração por partes ou risco de timeout.

2. **Liberar o material como próprio**
   Você confirmou que todo o material já enviado é seu ou de domínio público. Os 13 documentos hoje marcados como "terceiro — verificar direitos" passam a "material próprio" e ficam visíveis na aba Material completo:
   - Legislação de Trânsito: 12 documentos
   - Direito Constitucional: 1 documento

3. **Quando não houver material liberado**
   Se a matéria não tiver nenhum documento com direitos liberados, a aba mostra a mensagem "Material em revisão" — nunca tenta gerar nada no lugar.

## O que será feito

- Atualizar os 13 registros de `kb_documentos` de `terceiro_verificar` para `material_proprio`, registrando a ação no log administrativo.
- Conferir na tela do aluno que a aba Material completo passa a listar os documentos das duas matérias, com o texto integral e a formatação básica (títulos e listas) preservada.
- Conferir que o aviso de documentos retidos some do painel administrativo dessas matérias (contador vai a zero).
- Nenhuma alteração na aba de Aula, no montador de curso ou nos prompts de IA.

## Detalhes técnicos

- Atualização de dados apenas (`UPDATE public.kb_documentos SET status_direitos = 'material_proprio' WHERE status_direitos = 'terceiro_verificar'`), sem mudança de schema.
- A política de leitura em `kb_documentos` já filtra por `dominio_publico`/`material_proprio` + acesso ao curso; ela permanece ligada, servindo de trava para qualquer material futuro que entre como terceiro.
- Novos uploads do Drive continuam entrando como `terceiro_verificar` por padrão, exigindo sua liberação — a trava segue ativa daqui pra frente.
- `PX.materialCompleto` e o RPC `kb_material_retido` já existem e não mudam.
