# O que falta para publicar e vender

Verifiquei o app: o conteúdo (15 disciplinas, 303 tópicos), o painel admin, o webhook da Hotmart e o checkout já estão prontos. Faltam 5 pontos, todos bloqueantes para cobrar de verdade.

## 1. Desligar o modo convidado (crítico)

Hoje qualquer pessoa entra sem senha: `public/px-auth.js` cria um usuário "convidado" e a checagem de assinatura (`hasActiveSub`) retorna **true** para convidado. Ou seja, o produto inteiro está liberado de graça.

- Remover o login sem senha e voltar o fluxo de e-mail/senha (+ Google) em `public/login.html`.
- Manter o convidado apenas como "demo" limitado, se você quiser — mas sem acesso ao curso.

## 2. Bloqueio de acesso (paywall)

A função que checa assinatura existe, mas nenhuma tela usa. Aluno sem assinatura ativa consegue abrir aula, questões, simulados e cronograma.

- Criar um guard único (`px-auth.js`) chamado em `workspace.html`, `disciplina.html`, `home.html`, `cronograma.html`, `dashboard.html`, `resolver.html`.
- Sem assinatura ativa → tela de bloqueio com botão "Assinar" (checkout Hotmart).
- Liberar 1 tópico gratuito como amostra (recomendado para conversão).

## 3. Oferta anual da Hotmart

`public/hotmart.js` usa o mesmo link para mensal e anual. Preciso do link da oferta anual (`?off=...`) para separar os planos de R$ 29/mês e R$ 290/ano.

## 4. Teste ponta a ponta do pagamento

- Disparar uma compra de teste na Hotmart e confirmar que o webhook grava em `subscriptions`/`purchases` e libera o acesso.
- Testar reembolso/cancelamento revogando o acesso.
- Confirmar que quem compra sem ter conta é liberado ao se cadastrar com o mesmo e-mail.

## 5. Itens legais e de publicação

- Páginas **Termos de Uso** e **Política de Privacidade** (obrigatório para Hotmart e LGPD) + links no rodapé.
- Título e descrição do site (hoje ainda "Lovable App" na raiz) e og:image para compartilhamento.
- Varredura de segurança (RLS/policies) antes de publicar.

## Detalhes técnicos

- `public/px-auth.js`: remover `px_guest`, fazer `hasActiveSub()` consultar `subscriptions` sempre; expor `PX.requirePro()`.
- Guard chamado no topo de cada página protegida, antes do render.
- `public/hotmart.js`: separar `mensal` / `anual` com o código da oferta.
- Novas páginas estáticas `public/termos.html` e `public/privacidade.html`.
- Metadados em `src/routes/__root.tsx` e `public/index.html`.

## Verificação

Teste de navegador: (a) visitante sem login não abre workspace; (b) usuário logado sem assinatura vê a tela de bloqueio; (c) usuário com assinatura ativa acessa tudo; (d) webhook de compra aprovada libera o acesso.
