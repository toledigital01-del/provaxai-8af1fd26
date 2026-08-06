# Menu do tópico sobreposto + limpeza de navegação + paleta clara

Observação importante: este projeto é HTML + CSS puro em `public/` (não há Tailwind nas telas do painel). As regras Tailwind pedidas serão aplicadas como os valores equivalentes em CSS (`bg-slate-50` = `#F8FAFC`, `blue-600` = `#2563EB`, `amber-500` = `#F59E0B`, `emerald-500` = `#10B981`, etc.), sem instalar nada.

## 1. Menu do tópico sobrepondo a barra da esquerda (imagens 2 e 3)

Arquivos: `public/workspace.html` (+ pequeno ajuste em `public/shell.js` para permitir a troca).

- Ao abrir o Workspace de um tópico, a coluna de itens do tópico (Conteúdo, Tutor IA, Flashcards, Questões, Simulados, Teste Escrito, Preencher Espaços, Podcast, Anotações) passa a ocupar a barra lateral esquerda existente, no lugar do menu global (Hoje, Meus Materiais, Recentes...), como no modelo antigo da imagem 3.
- No topo dessa barra: seta "‹" de voltar + o nome do tópico/disciplina. Clicar na seta restaura o menu global (volta para a tela de disciplina/tópicos).
- A coluna esquerda interna atual do workspace (`.ws-left`) deixa de existir; o layout passa a 2 colunas (centro + painel inteligente à direita).
- Logo e rodapé de usuário permanecem; muda somente o conteúdo de navegação.

## 2. Remover o item "App"

Arquivo: `public/shell.js` — remover a entrada `App` da lista `NAV`. `public/app.html` fica no projeto, apenas sem link no menu.

## 3. Paleta clara (somente estilo)

Arquivos: `public/shell.css`, `public/study-sets.html`, `public/dashboard.html`, `public/disciplinas.html`, `public/disciplina.html`, `public/workspace.html`.

1. Fundo geral da área de trabalho: `#F8FAFC`; cards permanecem brancos, ganhando profundidade natural.
2. Ação principal: botões/CTAs, links ativos e foco em `#2563EB` com hover `#1D4ED8` e texto branco.
3. Cards "Enviar / Colar / Gravar": borda padrão `#E2E8F0`, hover com borda `#2563EB` + sombra leve e transição suave.
4. Barras de "Índice de domínio" com cor semântica pelo percentual: <40% `#F59E0B`, 40–70% `#3B82F6`, >70% `#10B981`.
5. Cards de disciplina: borda vertical de 4px à esquerda por área — Trânsito/Penal Especial `#2563EB`; Direitos (Constitucional, Administrativo, Penal, Processual Penal, Direitos Humanos, Ética) `#4F46E5`; Básicas/Exatas (Português, RLM, Informática, Física, Inglês, Espanhol, Geopolítica) `#059669`.
6. "IA recomenda estudar": cards com fundo levemente quente (`#FFFBEB` translúcido) e borda `#FDE68A`.
7. Laranja da marca (`#F97316` / `#FF4D00`) mantido só em badges de tipo (Edital, Legislação) e ícones de marca.

## Fora de escopo

Sem dark mode, sem mudanças de layout/grid/margens estruturais, sem novas funcionalidades, sem alterar dados, rotas ou lógica.
