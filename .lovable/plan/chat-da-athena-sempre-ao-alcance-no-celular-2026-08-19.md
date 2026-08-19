# Chat da Athena sempre ao alcance no celular

## Problema

No workspace, a coluna direita (Chat + Estatísticas) vira uma seção empilhada abaixo do conteúdo em telas menores. Como a aula é longa, o aluno precisa rolar até o fim para perguntar algo à Athena. No desktop o layout de duas colunas está bom e não muda.

## Solução (apenas mobile/tablet, até 1200px)

1. **Botão flutuante fixo (FAB)** no canto inferior direito, sempre visível enquanto o aluno lê a aula: ícone de chat com o rótulo "Athena". Some quando o painel está aberto.
2. **Painel deslizante (bottom sheet)** ocupando ~85% da altura da tela, com cantos arredondados, alça de arraste, cabeçalho com as abas Chat / Estatísticas já existentes e botão de fechar.
   - Abre pelo FAB, fecha pelo X, pelo toque no fundo escurecido, arrastando a alça para baixo ou pela tecla Esc.
   - O campo de digitação fica fixo no rodapé do painel, com a conversa rolando acima dele.
   - Ao abrir, rola a conversa para a última mensagem e foca o campo de texto.
3. **Indicador de nova resposta**: quando a Athena responde com o painel fechado, o FAB ganha um ponto de destaque, que some ao abrir.
4. Nada de conteúdo duplicado: é o mesmo bloco `#ws-right` de hoje, apenas reposicionado por CSS/JS quando a tela é estreita. Todo o comportamento de chat, histórico e abas continua igual.

## Detalhes técnicos

- Arquivo: `public/workspace.html` (CSS no `<style>` do topo + um bloco de script no fim).
- Media query `max-width: 1200px`: `.ws-right` passa a `position:fixed; bottom:0; transform:translateY(100%)`, com classe `.open` para exibir; overlay `.ws-sheet-backdrop`; FAB `.ws-chat-fab` visível só nessa faixa.
- Acima de 1200px: FAB e overlay com `display:none`, layout em grade atual intacto.
- Bloqueio de scroll do body enquanto o sheet está aberto; `env(safe-area-inset-bottom)` no rodapé do composer.
- O ponto de "nova resposta" é acionado no mesmo ponto onde a resposta da Athena é adicionada ao histórico, verificando se o sheet está fechado.
