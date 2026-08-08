# Voltar o projeto ao commit `df352ca`

O commit `df352ca` está no repositório **`provaxai`** (o que está sincronizado com este projeto):

- **df352cad** — 06/08/2026 20:14 — "Corrige login/paywall, preços, páginas legais e prepara conteúdo real do curso"

O repositório está 12 commits à frente desse ponto.

## O que muda ao voltar

A diferença entre `df352ca` e o estado atual é pequena e bem delimitada:

- `public/shell.css` — perde as 164 linhas do acabamento visual premium (sombras em camadas, raios padronizados, microinterações, ajustes de tipografia e de modo escuro)
- `package.json` e `bun.lock` — voltam à versão anterior de dependências
- arquivos de plano em `.lovable/` — irrelevantes para o app

Nada mais é afetado: telas, conteúdo do curso, login/paywall, Hotmart, admin e banco de dados permanecem exatamente como estão hoje.

## Passos

1. Baixar o conteúdo do commit `df352ca` do repositório `provaxai`.
2. Restaurar no projeto os arquivos que diferem: `public/shell.css`, `package.json` e `bun.lock`.
3. Preservar os arquivos gerenciados pela plataforma (`src/integrations/supabase/*`, `src/routeTree.gen.ts`, `.env`, `supabase/config.toml`, histórico em `.lovable/plan/`).
4. Reinstalar dependências conforme o `package.json` restaurado.
5. Conferir a aplicação na pré-visualização (home, disciplinas, workspace) nos temas claro e escuro, sem erros de build ou de console.

## Detalhes técnicos

- Restauração feita arquivo a arquivo via API do GitHub na árvore do commit `df352ca`, sem alterar o histórico do repositório remoto.
- O banco de dados não é tocado.
- Após a restauração, o próximo sync envia esse estado para o `provaxai` como um novo commit (o histórico anterior continua preservado no GitHub).

## Verificação

Build sem erros, servidor de desenvolvimento respondendo e telas principais conferidas na pré-visualização.
