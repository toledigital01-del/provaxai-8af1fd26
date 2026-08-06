# Integração Hotmart — criar o produto, pegar o token (hottok) e ligar tudo

## Parte 0 — Criar o produto na Hotmart (é isso que está faltando)

O campo "Selecione um produto" está vazio porque ainda não existe produto cadastrado. Crie antes de configurar o webhook:

1. No menu lateral, clique em **Produtos** > **Cadastrar produto**.
2. Formato: escolha **Assinatura** (cobrança recorrente mensal/anual) — é o modelo do Prova X. Se preferir venda avulsa, escolha "Curso online / Área de membros".
3. Preencha:
   - **Nome do produto**: `Prova X — Curso PRF`
   - **Idioma**: Português (Brasil) — **Moeda**: Real (BRL)
   - **Categoria**: Educação / Concursos
   - **Página de vendas**: o endereço público do app (ex.: `https://provaxai.lovable.app`)
4. Em **Preço / Ofertas**, crie duas ofertas: **R$ 29,00 mensal** e **R$ 290,00 anual**.
5. Salve. O produto nasce como **rascunho** — isso já basta para aparecer na lista do webhook. Para vender de verdade, depois envie para **análise/aprovação** da Hotmart.
6. Volte em **Ferramentas > Webhook** e agora o produto aparecerá no seletor.

## Parte 1 — Cadastrar o webhook e pegar o hottok

1. **Ferramentas** (ou "Aplicativos") > **Webhook (Postback)** > **Cadastrar Webhook**.
2. Preencha:
   - **Nome da configuração**: `Prova X`
   - **Produto**: o produto criado na Parte 0
   - **URL para envio de dados**: `https://provaxai.lovable.app/api/public/hotmart/webhook`
     (atenção: não é `.../index.html` — precisa ser exatamente esse caminho)
   - **Versão**: 2.0.0 (Recomendado)
   - **Eventos**: marque os que existirem na sua lista — **Compra aprovada**, **Compra completa**, **Compra reembolsada**, **Compra cancelada**, **Chargeback**, **Compra expirada** e **Assinatura cancelada**. "Reativação de assinatura" só aparece em contas com produto de assinatura configurado; se não estiver na lista, ignore.
3. Salve. A Hotmart mostra o token **hottok** (sequência longa de letras e números) na tela e no e-mail de confirmação.
4. Copie esse valor. Quando eu pedir, você cola no formulário seguro do Lovable (fica guardado como segredo, nunca no código).

Observação: se o webhook já existir, o hottok aparece ao clicar em **Editar**.


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
