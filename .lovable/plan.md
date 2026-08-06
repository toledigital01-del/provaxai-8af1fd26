# Integração Hotmart — como pegar o token (hottok) e ligar tudo

## Parte 1 — Passo a passo para obter a chave na Hotmart

1. Acesse [app-vlc.hotmart.com](https://app-vlc.hotmart.com) e faça login na sua conta de **Produtor**.
2. No menu lateral, clique em **Ferramentas** (ou "Aplicativos", dependendo da versão da conta).
3. Procure o card **Webhook (Postback)** e clique em **Adicionar Webhook** / **Configurar**.
4. Preencha:
   - **Nome**: `Prova X`
   - **URL do Webhook**: (eu forneço a URL definitiva quando o app for publicado — formato `https://SEU-APP.lovable.app/api/public/hotmart/webhook`)
   - **Versão**: 2.0.0 (a mais recente disponível)
   - **Produto**: o produto do Prova X
   - **Eventos**: marque os que existirem na sua lista — **Compra aprovada**, **Compra completa**, **Compra reembolsada**, **Compra cancelada**, **Chargeback**, **Compra expirada** e **Assinatura cancelada**. "Reativação de assinatura" só aparece em contas com produto de assinatura/recorrência configurado; se não estiver na lista, ignore — não é obrigatório e o app trata a reativação como uma nova compra aprovada.
5. Salve. A Hotmart mostra na tela (e no e-mail de confirmação) o token chamado **hottok** — é uma sequência longa de letras e números.
6. Copie esse valor. Quando eu pedir, você cola no formulário seguro do Lovable (o valor fica guardado como segredo, nunca aparece no código).

Observação: se o webhook já estiver criado, o hottok aparece ao clicar em **Editar** no webhook existente.

## Parte 2 — Links de checkout (também vindos da Hotmart)

1. Em **Produtos** > seu produto > **Links** (ou "Ofertas").
2. Copie o link de checkout da oferta **mensal** e da oferta **anual** (formato `https://pay.hotmart.com/XXXXXXXX?off=...`).
3. Me envie os dois links — eu ligo aos botões "Assinar Pro" da página de preços.

## Parte 3 — O que eu faço no app

- Endpoint `POST /api/public/hotmart/webhook` que valida o hottok em toda chamada e ignora requisições sem token válido.
- Compra aprovada: registra em `purchases`, libera `course_access` do curso PRF e cria a assinatura em `subscriptions`.
- Reembolso / chargeback / cancelamento: revoga o acesso e marca a compra como reembolsada.
- Se o comprador ainda não tiver conta no app, o evento é registrado e o acesso é liberado assim que ele se cadastrar com o mesmo e-mail.
- Botões "Assinar Pro" (mensal/anual) passam a abrir o checkout Hotmart, já com o e-mail do aluno pré-preenchido.
- Desligamento do Stripe: você precisa desconectar pelo painel de Pagamentos (menu de três pontinhos > Desconectar); eu removo o código do Stripe do app em seguida.

## Detalhes técnicos

- Rota: `src/routes/api/public/hotmart/webhook.ts` (TanStack server route, prefixo público para chamadas externas).
- Validação: comparação do header `x-hotmart-hottok` (ou campo `hottok` do corpo) com o segredo `HOTMART_HOTTOK`.
- Escrita no banco com service role, apenas após a validação do token.
- Configuração dos links de checkout em `public/hotmart.js`.
