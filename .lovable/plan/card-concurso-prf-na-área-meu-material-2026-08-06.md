# Card "Concurso PRF" na área Meu Material

Na página inicial (onde hoje aparece o card "teste"), incluir um card fixo **Concurso PRF** ao lado das disciplinas próprias do aluno. Ao clicar, abre o conteúdo do curso PRF (grade das 15 disciplinas).

## Comportamento

- O card aparece sempre como primeiro item da grade "Meu material", mesmo quando o aluno ainda não criou nenhuma disciplina (nesse caso a mensagem de estado vazio some, pois já há conteúdo).
- Visual igual aos demais cards: título, linha de meta ("15 disciplinas · curso completo") e barra de índice de domínio com a mesma cor semântica.
- Sem o botão "✕" de remover — é um card do curso, não material do aluno.
- Clique navega para a grade de disciplinas do curso PRF (`disciplinas.html` com o material `prf-2021`), o mesmo destino usado hoje por "Acessar o curso".
- Ao filtrar por uma pasta criada pelo aluno, o card do curso não aparece (a pasta mostra só o material dela).

## Detalhes técnicos

- Alterar apenas `public/home.html`, na função `renderMeu()`.
- Montar o HTML do card reutilizando a classe `.mcard` existente e o helper `materialHref(materialById('prf-2021'))` de `data.js` para o link, mantendo o percentual vindo do próprio material.
- Nenhuma mudança em `data.js`, `shell.js` ou nas telas internas.
