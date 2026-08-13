# Trazer o código do GitHub e depois publicar as funções

## Situação atual

- O projeto **não tem** a pasta `supabase/functions/` — nenhuma Edge Function está presente no código.
- As mesmas funcionalidades já existem como endpoints do app:
  - `src/routes/api/public/hotmart/webhook.ts` (webhook da Hotmart, valida o `hottok`)
  - `src/routes/api/public/athena.ts` (chat da Athena, com acesso e limite diário)
- Eu não executo `git pull`. O código do GitHub só chega aqui pela sincronização oficial do Lovable.

## Passo 1 — você conecta/sincroniza (fora do chat)

1. No editor, menu **+** (canto inferior esquerdo do chat) → **GitHub** → **Connect project**.
2. Autorize o app do Lovable na conta `toledigital01-del` e selecione o repositório `studley-provax-ai`.
3. Com a sync ativa, o que estiver no branch `main` passa a aparecer no projeto automaticamente.

Se a conexão já existir e mesmo assim os arquivos não aparecerem, é porque o commit com `supabase/functions/` não está no `main` do repositório conectado — nesse caso, faça o push para `main`.

## Passo 2 — o que eu faço quando os arquivos chegarem

1. Confirmo que `supabase/functions/hotmart-webhook/` e `supabase/functions/athena-chat/` existem no projeto.
2. Reviso o código de cada uma: segredos usados (`HOTMART_HOTTOK`, chaves de IA), validação de assinatura, CORS e uso do service role.
3. Peço os segredos que faltarem antes do deploy.
4. Faço o deploy das duas funções no backend deste projeto e testo chamando cada endpoint, conferindo os logs.

## Ponto de decisão após o deploy

Com as Edge Functions ativas, haverá duas implementações do mesmo comportamento (as funções e as rotas atuais do app). Vou apontar as duplicidades e sugerir qual caminho manter — em especial a URL do webhook configurada na Hotmart, que precisa apontar para apenas um endereço.

## Detalhes técnicos

- Deploy via ferramenta de Edge Functions do backend; `supabase/config.toml` só recebe bloco por função se houver configuração fora do padrão (ex.: `verify_jwt`).
- Nada é alterado no projeto agora — este passo depende do código chegar do GitHub.
