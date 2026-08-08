# Auditoria em CSV/PDF, leitura direta dos materiais e curso completo

## 1. Exportar o log (prévia e execuções reais)

No bloco "Manutenção da base", ao lado do log, dois botões: **Baixar CSV** e **Baixar PDF**.

- O log passa a ser gravado como registros estruturados (data/hora, ação, modo prévia ou real, documento, título/tópico, disciplina de origem, disciplina de destino, resultado, mensagem de erro), além do texto que já aparece na tela.
- CSV: uma linha por documento processado, com cabeçalho e separador compatível com Excel brasileiro.
- PDF: relatório com cabeçalho (curso, matéria, usuário, data, tipo da operação), resumo (total de documentos, órfãos antes/depois, quantos viram órfãos, quantos recuperam disciplina), tabela por disciplina e a lista detalhada.
- Nome do arquivo: `provax-reindex-previa-AAAA-MM-DD-HHMM.csv/pdf` ou `provax-reindex-execucao-...`.
- Os botões ficam habilitados assim que houver log; cada nova operação começa um log novo (como hoje).

## 2. Fim do passo "extrair": leitura direta do material

Hoje é preciso clicar em "Ler arquivos"/"Extrair site"/"Extrair vídeo" e só depois montar o curso. Muda para:

- **Arquivos**: ao escolher (ou arrastar) os arquivos, a leitura começa sozinha, sem botão. Área de arrastar-e-soltar aceitando PDF, textos, imagens (OCR) e vários arquivos de uma vez.
- **Links**: colar o endereço e sair do campo (ou apertar Enter) já busca o conteúdo — some a distinção manual entre site e vídeo; o sistema identifica sozinho pelo endereço.
- **Barra de progresso do carregamento**: por arquivo (nome, posição na fila, porcentagem) e total, com a lista de fontes já carregadas (nome, tamanho em caracteres, botão para remover uma fonte).
- O botão "Montar curso" fica desabilitado enquanto houver leitura em andamento e habilita sozinho quando o material estiver pronto — sem etapa manual de extração.
- Os botões antigos "Ler arquivos", "Extrair site" e "Extrair vídeo" saem da tela.

## 3. Curso completo cobrindo todos os assuntos da matéria

Hoje a IA recebe todos os tópicos numa única chamada e costuma devolver só parte deles.

- A geração passa a ser feita em lotes de tópicos, em sequência, com barra de progresso ("aula 12 de 47").
- Ao final, o sistema confere a lista oficial do edital e **regera automaticamente os tópicos que ficaram faltando**, até cobrir todos (com limite de tentativas para não travar).
- O painel de revisão mostra "Cobertura: 47 de 47 tópicos" e destaca em vermelho qualquer tópico ainda sem aula, com botão "Gerar os que faltam".
- O material enviado é fatiado por relevância para cada lote, de modo que apostilas grandes não estourem o limite do modelo.

## Detalhes técnicos

- `public/px-console-8f21c.html`: registros de log estruturados (`KB_LOG_ROWS`), exportadores CSV (Blob + download) e PDF (geração via janela de impressão com layout próprio, sem nova dependência); auto-ingestão no `change` do input de arquivo e no `blur`/Enter do campo de link; detecção de vídeo por padrão de URL (YouTube/Vimeo) para escolher `tipo` no `kb-ingest`; barra de progresso reutilizando o componente já existente; laço de geração em lotes chamando `kb-autocourse` várias vezes e mesclando resultados em `KB_GERADAS` sem duplicar tópicos.
- `src/routes/api/public/kb-autocourse.ts`: aceita um subconjunto de tópicos por chamada (já aceita) e ganha validação para responder somente com tópicos do lote; nenhuma mudança de contrato que quebre chamadas atuais.
- `public/px-kb-payload.js` / `tests/kb-payload.test.ts`: teste novo garantindo que a mesclagem de lotes não duplica tópicos nem perde disciplina.
- Sem migração de banco.
