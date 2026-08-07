# Substituir o projeto atual pelo repositório `provax-ai-assistant`

Você escolheu **substituir tudo**: o conteúdo deste projeto passa a ser exatamente o do repositório `https://github.com/toledigital01-del/provax-ai-assistant.git`.

## Aviso importante

O repositório antigo está congelado numa versão anterior. Ao substituir, saem do projeto (a menos que já estejam lá) as evoluções recentes:

- modo escuro global
- currículo PRF expandido (303 tópicos) e página de cobertura do edital
- acabamento visual premium (`shell.css`)
- integração Hotmart (checkout + webhook)
- painel administrativo e ajustes de autenticação

O código atual continua recuperável pelo histórico de versões do Lovable, e o repositório `provaxai-6cdd8d45` já contém o estado atual sincronizado.

## Passos

1. Baixar o repositório antigo numa pasta temporária e listar o que ele contém.
2. Comparar a árvore de arquivos com o projeto atual e mostrar a você um resumo do que entra, o que sai e o que muda.
3. Substituir os arquivos do projeto pelos do repositório antigo, preservando somente os arquivos gerados/gerenciados pela plataforma:
   - `src/integrations/supabase/*` (client, tipos, middlewares — arquivos automáticos)
   - `src/routeTree.gen.ts`
   - `.env` / `.env.development` e `supabase/config.toml`
   - `.lovable/`
4. Instalar as dependências do `package.json` do repositório antigo e subir o servidor de desenvolvimento.
5. Verificar que a aplicação carrega sem erros de build/console e abrir a tela inicial para conferência visual.

## Detalhes técnicos

- Se o repositório antigo usar outra estrutura de rotas (por exemplo React Router ou `src/pages`), será necessário adaptar para TanStack Start, que é o framework fixo desta plataforma; nesse caso eu ajusto o bootstrap (`src/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`) mantendo as telas iguais.
- O banco de dados **não** é alterado: tabelas, dados e políticas do backend permanecem como estão. Se o código antigo esperar um schema diferente, algumas telas podem falhar até serem ajustadas.
- A sincronização com o GitHub continua apontando para `provaxai-6cdd8d45`; após a substituição, esse repositório passa a refletir o código antigo.

## Verificação

Build sem erros, servidor de desenvolvimento respondendo e navegação pelas telas principais conferida na pré-visualização.
