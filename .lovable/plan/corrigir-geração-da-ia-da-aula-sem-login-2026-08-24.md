# Corrigir geração da IA da aula sem login

## Problema confirmado

O painel administrativo abre sem login, mas o endpoint `/api/public/aula-pacote` ainda executa `requireAdmin()` antes de qualquer ação. Sem sessão, ele devolve `Não autenticado.` e a janela não consegue carregar a aba **Configuração**, onde deveria aparecer o botão de geração.

## Correção

1. Criar uma autorização temporária e específica para o gerenciamento pedagógico sem login.
   - Aplicar somente às rotas necessárias para gerar, revisar e publicar o pacote inteligente da aula.
   - Manter protegidas as rotas sensíveis, como exclusão de usuários, compras, chaves e configurações administrativas críticas.
2. Alinhar o painel com esse modo temporário.
   - Não enviar um cabeçalho `Bearer` vazio.
   - Exibir mensagens de erro úteis caso uma geração individual falhe.
3. Garantir o fluxo completo da aula.
   - Abrir **IA da aula** sem mostrar `Não autenticado`.
   - Na aba **Configuração**, selecionar Aula com Athena, Questões, Flashcards, Resumo, Revisão, Podcast e demais módulos.
   - Usar o botão **GERAR CONTEÚDOS DA AULA** com progresso por módulo.
   - Revisar em **Conteúdos gerados** e publicar em **Publicação**.
4. Validar no navegador uma aula real: carregar estado, gerar ao menos um módulo, confirmar o rascunho e verificar que a publicação fica disponível para os alunos.

## Detalhes técnicos

- Ajustar o guard do backend de forma restrita, sem desativar `requireAdmin()` globalmente.
- Cobrir também o fluxo legado/em lote que chama `kb-preparar` e `gerar-exercicios`, para evitar que outro botão da mesma tela continue retornando 401.
- Não alterar a arquitetura de geração, versionamento ou as tabelas existentes.
