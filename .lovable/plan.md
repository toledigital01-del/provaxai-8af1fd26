# Por que a aula em HTML não aparece para o aluno

## Diagnóstico (verificado no banco e no código)

**1. A aula foi salva? SIM.**
Existe o registro em `aulas_ia`:
- curso `prf-2021`, disciplina `Legislação de Trânsito`, tópico `Aula 00 - Disposições Preliminares e Vias`
- `formato = 'html'`, 6.016 caracteres de conteúdo, salvo hoje às 08:57 (UTC)

**2. O tópico bate com o currículo? NÃO — esta é a causa real.**
A disciplina "Legislação de Trânsito" (curso PRF 2021) está hoje com **zero tópicos cadastrados** na grade do aluno. Não existe "Aula 00 - Disposições Preliminares e Vias" nem qualquer outro tópico. Como a tela do aluno monta a lista de aulas a partir dessa grade (e, sem tópicos, mostra apenas um "Conteúdo geral" genérico), a aula ficou **órfã**: está no banco, mas não tem lugar na navegação.

Não há, portanto, um "nome certo" já cadastrado para você resalvar — a lista está vazia. O nome precisa ser criado no currículo.

**3. O código do aluno já renderiza HTML? SIM, já está implementado.**
- `src/routes/api/public/aula-ia.ts` devolve `formato: 'html'` quando o registro é HTML.
- `public/workspace.html` trata `r.formato === 'html'` e chama `renderAulaHTML()`, que monta o iframe isolado com ajuste automático de altura.
Ou seja, assim que o tópico existir na grade, a aula abre corretamente.

## Correção proposta

1. **Criar o tópico na grade** de Legislação de Trânsito com exatamente o nome usado na aula: `Aula 00 - Disposições Preliminares e Vias` (ordem 0), para o aluno passar a ver e abrir a aula.
2. **Evitar que isso se repita:** na aba "Aula pronta (HTML)" do painel admin, o campo "Nome da aula" passa a ser um seletor dos tópicos já cadastrados na disciplina, com a opção "criar novo tópico" — ao salvar com um nome novo, o tópico é criado automaticamente no currículo (no fim da ordem). Assim nenhuma aula em HTML nasce órfã.
3. **Aviso visível:** se por qualquer motivo o tópico não existir, a lista de aulas do admin marca a aula como "fora da grade do aluno".

## Detalhes técnicos

- Migração/insert em `public.topics` para `discipline_id = bf7e89b1-90a7-4ff7-be02-7bf1e4fa5420`.
- `src/routes/api/public/aula-html.ts`: após gravar em `aulas_ia`, garante o `topics` correspondente (busca por `discipline_id` + `nome`; insere se faltar) usando a chave de serviço.
- `public/px-console-8f21c.html`: o painel da aba HTML carrega os tópicos da disciplina selecionada e oferece seleção/criação; marcador de aula órfã na listagem.
- Nada muda em `public/workspace.html` nem no endpoint `aula-ia` — a renderização por iframe já funciona.
