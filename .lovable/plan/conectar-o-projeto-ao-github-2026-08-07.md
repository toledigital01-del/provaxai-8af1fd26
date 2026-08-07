# Conectar o projeto ao GitHub

## O que vai acontecer

A conexão com o GitHub é feita pela integração nativa do Lovable e precisa ser autorizada por você — não é algo que eu consiga executar por comando. Depois de conectada, a sincronização passa a ser automática e bidirecional: o que eu mudar aqui vai para o repositório, e o que você enviar no GitHub volta para cá.

## Passo a passo (você faz)

1. No editor, abra o menu **+** (canto inferior esquerdo do chat) → **GitHub** → **Connect project**.
2. Autorize o app do Lovable na conta `toledigital01-del`.
3. Escolha a conta/organização de destino.
4. Clique em **Create Repository**.

## Sobre o repositório `provaxai`

O Lovable ainda não importa nem publica dentro de um repositório já existente: ele cria um repo novo com o código atual. Para consolidar tudo em `provaxai`, depois da conexão:

- clone o repo criado pelo Lovable,
- adicione `provaxai` como remote,
- faça merge/push do conteúdo para lá.

Alternativa sem clonar: usar **Download codebase** no editor de código e subir o conteúdo manualmente para `provaxai`.

## O que eu faço em seguida

Assim que a conexão estiver ativa, confirmo que os arquivos do projeto (páginas em `public/`, rotas em `src/routes/`, webhook da Hotmart) apareceram no repositório e sigo com o próximo passo que você escolher — por exemplo, a fase de publicação (desativar o modo convidado, paywall por assinatura, links de oferta Hotmart, termos e privacidade).
