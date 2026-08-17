# Unificar preços: R$ 47/mês e R$ 397/ano

Preço oficial confirmado: **R$ 47 por mês** e **R$ 397 por ano**. A landing page e a página de planos já mostram esses valores; o desalinhamento está apenas no painel administrativo (banco de dados).

## O que muda

1. **Planos no painel/banco**
   - "Prova X Pro" (mensal): de R$ 49,90 para **R$ 47,00**.
   - "Prova X Pro Anual": de R$ 499,00 para **R$ 397,00**.
   - O plano "Gratuito" (R$ 0) permanece.
   - A tela "Planos e cupons" e o cálculo de receita recorrente (MRR) do painel passam a exibir os valores certos automaticamente, pois leem direto do banco.

2. **Landing page e página de planos**
   - Nenhuma alteração de valor: já estão em R$ 47 / R$ 397, inclusive nos dados estruturados de SEO da landing.
   - Texto comparativo do FAQ ("R$397 equivale a R$33/mês, cerca de 30% mais barato que pagar R$47 todo mês") foi reconferido com os valores confirmados: 397 ÷ 12 = R$ 33/mês, e 397 contra 564 (12 × 47) dá 29,6% de economia. O texto está correto e permanece como está.

3. **Verificação final de divergências**
   - Confirmar por leitura que não sobra nenhuma menção a 49,90 / 499 em nenhum arquivo do projeto.

## Fora do escopo do código (ação sua, na Hotmart)

O valor que o cliente efetivamente paga vem das ofertas da Hotmart, não do sistema. Confirme no painel da Hotmart que as duas ofertas do produto estão em R$ 47 (mensal) e R$ 397 (anual), e ajuste lá se necessário — o site não envia preço ao checkout. Os e-mails de compra também são gerados pela Hotmart; o projeto não envia nenhum e-mail com preço.

## Detalhes técnicos

- Migração SQL de UPDATE na tabela `plans`: `preco_cents` para `4700` (slug `pro-mensal`) e `39700` (slug `pro-anual`). Sem mudança de schema.
- Nenhuma alteração em `public/index.html`, `public/pricing.html`, `public/hotmart.js` ou no webhook — este último grava a compra com o valor informado pela Hotmart (`purchase.price.value`), independente da tabela `plans`.
