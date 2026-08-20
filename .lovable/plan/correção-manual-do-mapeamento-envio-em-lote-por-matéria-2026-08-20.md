# Correção manual do mapeamento + envio em lote por matéria

## 1. Corrigir o mapeamento trecho a trecho

Hoje, depois de "Guardar material nos tópicos", a revisão mostra o resultado já agrupado por tópico: dá para editar o texto colado, mas não dá para dizer "este trecho foi para o tópico errado, mande para outro".

A revisão passa a mostrar **cada trecho do material** com o tópico que a IA escolheu ao lado:

- Lista com: nome do arquivo de origem, primeiras linhas do trecho, tamanho e um **seletor com todos os tópicos do edital** daquela matéria (mais a opção "Ignorar este trecho").
- Trechos que a IA não conseguiu encaixar aparecem no topo, marcados como "sem tópico", em vez de serem descartados em silêncio.
- Ao trocar o tópico no seletor, o trecho fica marcado como **ajustado por você** (etiqueta azul) e nunca mais é sobrescrito por uma nova rodada da IA.
- Filtros rápidos: "todos", "sem tópico", "ajustados por mim".
- Botão **"Reclassificar só o que eu marquei"**: reenvia à IA apenas os trechos que você selecionou (por exemplo, os que ficaram sem tópico), preservando todo o resto — nada de refazer a classificação inteira.
- Abaixo da lista, o resumo por tópico continua existindo (quantos trechos e quantos caracteres cada tópico vai receber), com as caixas de marcar/desmarcar e a escolha entre somar ou substituir o conteúdo atual. O texto final gravado é a junção dos trechos na ordem em que aparecem.
- A revisão fica guardada no navegador enquanto você estiver na matéria, para não perder o trabalho ao trocar de aba dentro do painel.

## 2. Envio em lote por matéria

Dentro da caixa de uma matéria, a aba "Documento" ganha um **modo lote**:

- Seleção ou arraste de vários arquivos de uma vez (PDF, texto, imagens), com uma fila visível: cada arquivo mostra "na fila / lendo / pronto / falhou" e o número de caracteres extraídos.
- Leitura em paralelo controlado (3 por vez) em vez de um por um, com barra de progresso geral e possibilidade de remover um arquivo da fila.
- Arquivos que falharem não interrompem os demais e ganham um botão "tentar de novo".
- Uma única escolha de direitos autorais vale para todo o lote (continua obrigatória).
- Ao terminar a leitura, opção **"Classificar automaticamente ao final"**: já dispara a distribuição nos tópicos e abre a tela de revisão do item 1.
- No fim, um resumo: "X arquivos lidos · Y caracteres · Z tópicos com material · N trechos sem tópico".

Isso permite cadastrar a base de uma matéria do zero em uma única passagem: escolhe a matéria, joga todos os arquivos, a IA distribui, você corrige o que ficou errado e salva.

## Detalhes técnicos

- `public/px-console-8f21c.html`: `kbDistribuir()` passa a guardar `KB_TRECHOS` (trecho, origem, tópico sugerido, tópico final, flag `manual`) em vez de montar `KB_GERADAS` direto; `KB_GERADAS` vira uma visão derivada, recalculada a cada ajuste, consumida pelo `kbPublicarGeradas()` já existente (sem mudança na gravação em `knowledge_docs` nem no fluxo de rascunho/revisão).
- Nova função `kbReclassificarSelecionados()` chamando o mesmo `POST /api/public/kb-classify` apenas com os índices marcados; trechos com `manual = true` são excluídos do envio.
- Fila de upload: refatorar `kbIngestFiles()` para uma fila com estado por arquivo e concorrência 3, reaproveitando `kb-ingest` e `kbLibGravar` sem alterar as rotas do servidor.
- Nenhuma mudança de banco de dados nem de API; `kb-classify.ts` continua como está (limite de 40 trechos por chamada já é respeitado pelos lotes).
