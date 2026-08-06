# Nova capa do Curso PRF

Trocar completamente a imagem de destaque do curso na página inicial por uma foto realista de patrulha da PRF.

## O que muda

- Gerar uma nova imagem: rodovia federal brasileira, viatura policial com giroflex ligado, luz de fim de tarde, clima realista e cinematográfico, sem texto sobre a imagem.
- Substituir a capa atual usada no card de destaque "Curso Polícia Rodoviária Federal" na página inicial.
- Ajustar o enquadramento (corte) para que o assunto principal fique visível tanto em desktop quanto no celular.
- Nada mais muda: layout, textos, progresso e navegação do card permanecem iguais.

## Detalhes técnicos

- Nova imagem gerada em `public/curso-prf.jpg` (mesmo caminho já referenciado), formato paisagem widescreen.
- A antiga imagem é substituída, sem alteração em `public/home.html` além de, se necessário, `object-position` para o enquadramento.
