# Corrigir "Não autenticado." ao testar/salvar a chave da Anthropic

## O que está acontecendo

A mensagem "✗ chave inválida: Não autenticado." não vem da Anthropic — vem do próprio Prova X.

Confirmado no código:

- O botão "Testar chave" chama o endpoint de teste, que exige login de administrador. Como o painel está operando sem login, ele responde "Não autenticado." (erro 401) e o painel exibe isso como se a chave fosse inválida.
- Além disso, o painel envia o cabeçalho de autorização com um token vazio (`Bearer ` sem nada), o que reforça a rejeição.
- Outros botões da Central de IA (status das integrações, rotas dos agentes, prompts, doutrina, RAG, copiloto) usam a mesma exigência de login e ficam no mesmo problema enquanto o painel estiver sem senha.

O salvamento da chave em si já passa pelo endpoint novo sem login; o que trava é o teste logo em seguida, que dá a impressão de que nada foi salvo.

## Correção

1. Liberar os endpoints administrativos de conteúdo/IA para operar sem login enquanto o painel estiver nesse modo temporário:
   - teste de chave, status das integrações e Central de IA (rotas, prompts, doutrina)
   - RAG (configurações, prévia, métricas, reindexação) e extração de edital/curso
   Ações sensíveis (excluir usuário, dados de compras) continuam exigindo administrador de verdade.
2. Nunca enviar cabeçalho de autorização vazio: o painel só envia o token quando existir sessão.
3. Melhorar as mensagens no painel:
   - distinguir "chave salva" de "teste da chave"
   - quando o teste falhar por bloqueio de acesso, mostrar "não foi possível testar agora (acesso restrito)" em vez de "chave inválida"
   - confirmar visivelmente "Chave salva" logo após o salvamento, mesmo que o teste não rode

## Verificação

- Colar a chave da Anthropic e salvar: deve aparecer confirmação de salva e a chave mascarada na lista.
- Clicar em "Testar chave": deve retornar "chave válida" (ou o erro real da Anthropic), nunca "Não autenticado".
- Gerar conteúdo de uma aula usando Anthropic para confirmar que a chave está valendo.

## Detalhes técnicos

- Trocar `requireAdmin` por `requirePedagogicalAdmin` em: `ai-test.ts`, `ai-status.ts`, `ai-central.ts`, `rag-settings.ts`, `rag-preview.ts`, `rag-metrics.ts`, `kb-embed.ts`, `kb-edital.ts`, `kb-autocourse.ts`, `kb-classify.ts`, `admin-copilot.ts`, `kb-drive.ts`. Manter `requireAdmin` em `admin-delete-user.ts`.
- Em `public/px-console-8f21c.html`: `cfgTestarChave` e demais chamadas passam a omitir `Authorization` quando não houver sessão, e o tratamento de erro 401/403 exibe aviso de acesso em vez de "chave inválida".
- Sem migração de banco.
