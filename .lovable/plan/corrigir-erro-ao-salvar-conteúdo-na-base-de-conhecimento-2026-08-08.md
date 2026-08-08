# Corrigir erro ao salvar conteúdo na base de conhecimento

## O que está acontecendo

O erro `null value in column "disciplina"` acontece porque o painel não consegue enxergar a lista de matérias, então salva o conteúdo sem matéria definida.

Causa confirmada: o arquivo de dados (`public/data.js`) declara as listas de matérias e tópicos como `const TOPICS` e `const DISCIPLINAS_POR_CONCURSO`. Declarações desse tipo não ficam disponíveis em `window`, e o console administrativo lê exatamente `window.DISCIPLINAS_POR_CONCURSO` / `window.TOPICS`. Resultado: lista vazia, matéria selecionada fica indefinida e o salvamento envia matéria nula ao banco.

Isso afeta qualquer material carregado (PDF, TXT, site, vídeo, texto) e também a publicação do curso montado pela IA, porque ambos usam a mesma matéria selecionada.

## Correção

1. No console administrativo (`public/px-console-8f21c.html`):
   - Ler as matérias e tópicos pelo nome global com verificação segura (`typeof`), em vez de depender de `window.X`, cobrindo os dois casos.
   - Se ainda assim a lista vier vazia, montar a lista a partir das matérias já existentes no banco (`knowledge_docs`) e da tabela de disciplinas do curso, para o painel nunca ficar sem matérias.
2. Travas de segurança antes de gravar:
   - Bloquear salvar e publicar quando não houver matéria selecionada, mostrando um aviso claro em português em vez de estourar erro do banco.
   - Aplicar a mesma trava no salvamento individual e na publicação em lote do curso gerado pela IA.
3. Expor as listas em `window` no `public/data.js` para que qualquer outra página que as consulte dessa forma continue funcionando.

## Verificação

- Abrir a aba Base de conhecimento (IA): a coluna de matérias deve listar as disciplinas do edital PRF.
- Salvar um conteúdo em uma matéria e em um tópico: deve gravar sem erro.
- Carregar um PDF/site/vídeo e publicar o curso montado pela IA: deve publicar nos tópicos sem o erro de matéria nula.

## Detalhes técnicos

- Sem migração de banco; a restrição `NOT NULL` em `knowledge_docs.disciplina` está correta e permanece.
- Alterações apenas em `public/px-console-8f21c.html` e `public/data.js`.
