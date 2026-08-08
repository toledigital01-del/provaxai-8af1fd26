# Nova Landing Page do Prova X

A landing atual (`public/index.html`, 754 linhas) foi claramente adaptada de outro produto: traz logos de MIT, Yale, Harvard, Stanford e Princeton, um contador "1.000.000+", um item de menu "Vagas — Contratando" e um bloco genérico de "notas, flashcards, quiz, podcast". Nada disso fala com quem estuda para concurso público no Brasil, e boa parte é alegação que o Prova X não pode sustentar.

A proposta é jogar fora essa página e escrever uma nova, do zero, focada em um público só: quem quer passar na PRF.

## O que a nova página comunica

Uma narrativa única, de cima a baixo:

1. **Hero** — promessa direta ("O edital da PRF inteiro, com uma IA que estuda junto com você"), CTA primário para o checkout/cadastro e secundário para ver o curso. Ao lado, um preview real do produto (workspace com Athena, tópicos e barra de progresso) em vez de ilustração genérica.
2. **Prova social honesta** — em vez de universidades americanas, números verificáveis do próprio produto: 303 tópicos mapeados, 15 disciplinas, cobertura completa do edital PRF 2021.
3. **O problema** — três dores do concurseiro: edital gigante sem saber por onde começar, esquecer o que estudou, estudar sem saber se está evoluindo.
4. **A solução em 4 pilares** — Aula com Athena IA, Questões e Simulados no padrão Cebraspe (certo/errado com anulação), Revisão Inteligente e Cronograma Adaptativo. Cada pilar com um visual do recurso real.
5. **Como funciona** — três passos: escolha a disciplina, estude com a Athena, fixe com questões e revisão.
6. **Curso PRF em destaque** — card grande com a capa, disciplinas listadas e CTA para acessar.
7. **Preços** — os dois planos reais (mensal R$47 / anual R$397), com o toggle e os links Hotmart já configurados.
8. **FAQ** — perguntas de concurseiro: serve para outros concursos, como funciona o acesso, garantia, cancelamento.
9. **CTA final + rodapé** com termos, privacidade e contato.

Some da página: logos de universidades, "1.000.000+ alunos", menu "Vagas", seção de comparação genérica e a listagem "Explorar/Blog" que não tem conteúdo próprio ainda.

## Direção visual

Mantenho o azul da marca e o modo claro/escuro que já existem — a mudança é de nível de acabamento, não de identidade:

- Tipografia expressiva de verdade (Sora para títulos, tamanhos grandes, tracking apertado) em vez do stack de sistema atual.
- Superfícies em camadas: fundo levemente tonalizado, cards com borda fina e sombra suave, sem o "branco chapado" atual.
- Um detalhe gráfico consistente: barra vertical colorida por área (já usada nas disciplinas), reaproveitada como assinatura visual da landing.
- Micro-interações discretas: entrada em fade/slide ao rolar, hover com elevação, brilho sutil no CTA. Nada de animação chamativa.
- Mobile-first de verdade: hero, planos e pilares testados em 390px antes de subir.

## Detalhes técnicos

- Reescrita completa de `public/index.html`, mantendo o mesmo caminho (é a rota pública `/index.html`) e a mesma stack da página: Tailwind via CDN + `public/shell.css` para tokens compartilhados, sem novas dependências.
- Reaproveita `public/hotmart.js` para os CTAs de compra (ofertas `ldzo9adn` mensal e `gmnkhe7e` anual) e `public/px-auth.js` para trocar o botão "Entrar" por "Meu painel" quando já há sessão.
- Metadados de SEO próprios: title, description, canonical, `og:*`/`twitter:*` e JSON-LD de `Course` + `FAQPage`.
- A página inicial de aluno (`home.html`), preços e demais telas ficam intocadas.
- A `public/index-preview.html`, que é resquício da versão antiga, é removida.
