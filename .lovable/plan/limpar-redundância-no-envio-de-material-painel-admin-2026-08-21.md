# Limpar redundância no envio de material (painel admin)

## O problema

Na aba "Aulas da matéria" existem hoje **duas áreas que fazem a mesma coisa**:

1. O bloco principal, com abas Texto / Arquivos (1 ou vários) / Website / Vídeo / Google Drive — cada envio vira uma aula numerada.
2. O bloco recolhível "Envio em lote e outras fontes (Drive, site, vídeo, vários arquivos)" — repete Texto, Website, Vídeo e Documento, com outra fila de arquivos e outro botão de cadastrar.

Isso confunde: dois lugares para enviar o mesmo PDF, com resultados diferentes (um vira aula, o outro vira material solto para classificar por tópico).

## O que muda

- **Remover o bloco recolhível "Envio em lote e outras fontes"** inteiro. O envio em lote passa a viver só na aba "Arquivos (1 ou vários)" do bloco principal, junto da escolha de arquivo.
- Na aba "Arquivos", incorporar o que era bom do bloco removido: **área de arrastar e soltar**, fila com estado por arquivo (na fila / lendo / pronto / falhou), barra de progresso geral e botões "tentar de novo" / "remover".
- Preservar, movidos para o fim da aba "Aulas da matéria":
  - o indicador de **cobertura do edital** ("X de Y tópicos com aula");
  - a lista **"Documentos-fonte já enviados"** (biblioteca), agora em um bloco recolhível discreto.
- **Aposentar o fluxo "Guardar material nos tópicos"** (classificação por tópico do edital) e a tela de revisão de trechos que vinham junto. O fluxo oficial hoje é por aula, e manter os dois lado a lado é a origem da confusão. Nada é apagado no banco: as aulas e documentos já cadastrados continuam iguais.

## Outras redundâncias encontradas

- Existe um painel de edição "Conteúdo — matéria › tópico" que não tem mais botão de aba (só é alcançado ao clicar numa aula). Ele será mantido, mas identificado como "Editar aula", já que hoje o editor completo é o modal de edição da aula.
- O botão "Cadastrar aula" muda de texto para "Cadastrar aula(s)" na aba de arquivos — comportamento mantido, sem duplicar botões.
- O painel "Manutenção" (reindexar, órfãos, exportar log) não é redundante e fica como está.

## Detalhes técnicos

- `public/px-console-8f21c.html`: remover o segundo `<div data-pane="aulas">` com o `<details>` (linhas ~1832-1908) e as funções que só ele usava: `kbIngTab`, `kbAdicionarTexto`, `kbDistribuir`, `kbPaintPreview`, `kbPublicarGeradas`, `kbTrecho*`, `kbPreview*` e estados `KB_TRECHOS`/`KB_GERADAS`/`KB_INCLUIR`.
- Mover `#kb-cob-ia` (cobertura) e `#kb-biblioteca` para dentro do pane de aulas; manter `kbPaintBiblioteca()` e o recarregamento de documento na aula.
- Reaproveitar a fila existente (`KB_AULA_FILA` + `kbBindAulaFile`) e trazer o comportamento de drag-and-drop e barra de progresso do `#kb-drop` para dentro da aba de arquivos.
- Nenhuma mudança de banco de dados nem de rotas de API. `kb-classify.ts` deixa de ser chamado pelo painel (rota permanece no projeto).
