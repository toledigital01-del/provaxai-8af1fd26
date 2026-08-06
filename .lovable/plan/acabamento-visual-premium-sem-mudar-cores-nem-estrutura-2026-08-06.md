# Acabamento visual premium (sem mudar cores nem estrutura)

Objetivo: dar sensação de produto caro, mantendo exatamente a mesma paleta, o mesmo layout e as mesmas funcionalidades. Só refinamento de acabamento.

## O que muda

1. **Profundidade e sombras**
   - Trocar as sombras "chapadas" por sombras em camadas (uma bem sutil de contato + uma difusa), como em apps premium.
   - Bordas de 1px mais suaves (usando a mesma cor, só com opacidade menor).

2. **Cantos e espaçamento**
   - Padronizar raio de canto entre cards, botões, inputs e modais (hoje há valores diferentes espalhados).
   - Padronizar respiros internos dos cards e distância entre blocos, numa escala única (8/12/16/24/32) — nada muda de lugar, só fica mais alinhado.

3. **Tipografia**
   - Escala de títulos e textos mais consistente, com peso e altura de linha ajustados.
   - Números grandes (KPIs, percentuais) com espaçamento entre letras levemente reduzido, que é o que dá aspecto de painel caro.

4. **Microinterações**
   - Hover suave em cards e itens de menu (elevação leve + transição de 150–200ms), sem trocar cor.
   - Estado de foco visível e elegante em botões, inputs e links (acessibilidade).
   - Barras de progresso e checkboxes com transição animada em vez de salto seco.

5. **Detalhes finos**
   - Ícones e textos alinhados opticamente nos itens de menu e nas linhas de tópico.
   - Divisórias mais discretas; scrollbar customizada e discreta.
   - Skeleton/fade suave ao carregar listas, em vez de o conteúdo aparecer de repente.
   - Modais com entrada suave e fundo com leve desfoque.

6. **Modo escuro**
   - Mesmos refinamentos calibrados para o tema escuro (sombras não funcionam igual no escuro; ali o realce vem de bordas sutis).

## Detalhes técnicos

- Trabalho concentrado em `public/shell.css`, com variáveis novas para sombra, raio e transição, reaproveitadas nas páginas.
- Ajustes pontuais de classes nas páginas (`home.html`, `disciplina.html`, `workspace.html`, `dashboard.html`, `cronograma.html`, `cobertura.html`, `resolver.html`) apenas onde houver estilo inline que atrapalhe a padronização.
- Nenhuma alteração em valores de cor da marca, hierarquia de navegação, textos ou lógica.
- Respeito a `prefers-reduced-motion` para quem desativa animações.

## Verificação

Comparação visual antes/depois em desktop e celular, nos temas claro e escuro, confirmando que nada mudou de posição e que todos os botões continuam funcionando.
