# Corrigir erro "permission denied for function has_role" no painel

## O que está acontecendo

Ao abrir a aba **Base de conhecimento (IA)** no painel administrativo, a página tenta ler a tabela de conteúdos (`knowledge_docs`) e recebe o erro `permission denied for function has_role`.

Causa confirmada: as quatro regras de acesso da tabela `knowledge_docs` (leitura, criação, edição e exclusão) usam a função `has_role` para checar se você é administrador, mas essa função não tem permissão de execução concedida ao perfil de usuário logado. Outras funções equivalentes do projeto (`is_admin`, `is_support`, `claim_admin`) já têm essa permissão — só a `has_role` ficou de fora. Por isso o painel abre, o gate de admin passa, mas qualquer leitura ou gravação da base de conhecimento falha.

## Correção

Uma migração de banco que concede permissão de execução da função `has_role` ao perfil autenticado (e ao perfil de serviço, usado pelos endpoints do servidor). Nenhuma regra de acesso é afrouxada: a função continua apenas respondendo "sim/não" sobre o papel do próprio usuário, e as políticas seguem exigindo o papel de administrador para gravar.

## Depois da correção

- A aba **Base de conhecimento (IA)** carrega as matérias e tópicos normalmente.
- O envio de PDF/TXT/site/vídeo, o botão "Montar curso desta matéria" e o novo painel de revisão (marcar quais aulas publicar, editar título e texto antes de publicar) passam a funcionar.
- As aulas publicadas voltam a aparecer para o aluno no workspace e para a Athena.

## Detalhe técnico

```sql
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
```

Após aplicar, valido abrindo o console em `/px-console-8f21c.html` (preview) na aba Base de conhecimento e confirmando que a lista carrega sem erro.

## Links do painel

- Preview (já com as alterações mais recentes): `/px-console-8f21c.html`
- Atalhos equivalentes: `/painel.html` e `/admin.html`
- O endereço publicado só reflete as mudanças depois de publicar o app.
