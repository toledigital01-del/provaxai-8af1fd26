# Finalizar Hotmart — passo a passo

Status atual do app: webhook pronto e ativo, token `hottok` salvo, botões de assinatura já chamam o checkout Hotmart. Falta apenas cadastrar o produto/ofertas na Hotmart e me enviar os 2 links de checkout.

## O que você faz na Hotmart

1. **Criar o produto**
   - Menu lateral > Produtos > Cadastrar produto
   - Formato: Assinatura
   - Nome: `Prova X — Curso PRF` · Idioma: Português (BR) · Moeda: Real · Categoria: Educação
   - Página de vendas: `https://provaxai.lovable.app`
   - Salvar (pode ficar como rascunho)

2. **Criar as duas ofertas** (dentro do produto > Ofertas / Preço)
   - Mensal: R$ 29,00 — cobrança recorrente mensal
   - Anual: R$ 290,00 — cobrança recorrente anual

3. **Copiar os links de checkout**
   - Produto > Links / Divulgação > copiar o link de cada oferta
   - Formato esperado: `https://pay.hotmart.com/XXXXXXXX?off=YYYYYYY`

4. **Configurar o webhook**
   - Ferramentas > Webhook (Postback) > Cadastrar
   - URL exata (sem `/index.html` no final):
     `https://provaxai.lovable.app/api/public/hotmart/webhook`
   - Versão: 2.0.0
   - Eventos a marcar: Compra aprovada, Compra completa, Compra cancelada, Compra reembolsada, Chargeback, Assinatura cancelada, Troca de plano
   - Salvar

5. **Me enviar** os dois links (mensal e anual) aqui no chat.

## O que eu faço depois que você enviar os links

- Gravar os links das ofertas mensal e anual em `public/hotmart.js`
- Ligar os botões "Assinar Pro" mensal/anual de `public/pricing.html` a cada oferta, já passando o e-mail do aluno no checkout
- Testar o endpoint do webhook com um evento de compra aprovada e confirmar que a assinatura é liberada no banco

## Detalhes técnicos

- Endpoint: `src/routes/api/public/hotmart/webhook.ts` — valida o header `hottok` contra o secret `HOTMART_HOTTOK` e grava em `subscriptions` / `purchases`
- Front: `public/hotmart.js` monta a URL de checkout e pré-preenche o e-mail do usuário logado
