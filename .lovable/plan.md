# Fazer o conteúdo publicado aparecer para o aluno

## O que está acontecendo

O material **está salvo e publicado** no banco: a matéria Legislação de Trânsito tem 8 aulas publicadas, incluindo "Sistema Nacional de Trânsito" (o tópico do anexo).

O que aparece na tela não é a aula: é o **texto genérico de reserva** que a página mostra quando não consegue ler o conteúdo. A leitura está sendo bloqueada por duas razões confirmadas:

1. **Nenhum aluno tem acesso liberado.** A tabela de acessos ao curso está vazia e não há assinaturas ativas. A regra de leitura das aulas exige compra, assinatura ou perfil de administrador — sem isso, a consulta volta vazia.
2. **A tela esconde o problema.** Quando não vem conteúdo, ela troca silenciosamente por um texto de exemplo, então parece que a aula existe mas está errada.

## O que será feito

**1. Liberar acesso pelo painel**
Na aba Alunos do console, cada aluno ganha o botão **Liberar acesso ao curso** (e **Remover acesso**), com escolha do curso e validade opcional. Isso grava o acesso do mesmo jeito que a compra da Hotmart faria. Também um atalho **Liberar para mim** para você testar como aluno.

**2. Prévia de administrador**
Como administrador você já enxerga tudo — vai passar a existir também um link "Ver como aluno" que abre a aula na página real para conferir o resultado.

**3. Acabar com a aula falsa**
O texto genérico de reserva sai. No lugar, a tela mostra o estado real:
- Sem login → "Entre para ver esta aula" com botão de login.
- Logado sem acesso → "Este conteúdo faz parte do Curso PRF" com botão para adquirir.
- Com acesso e sem conteúdo cadastrado → "Aula ainda não publicada para este tópico".
- Erro de conexão → mensagem de erro com botão "Tentar de novo".

**4. Conferência de nomes**
A aula só casa se matéria e tópico tiverem exatamente o mesmo texto no painel e na grade do aluno. Vou comparar as duas listas e mostrar, na coluna de tópicos do console, um aviso quando o tópico cadastrado não existir na grade do aluno (conteúdo que nunca vai aparecer).

## Detalhes técnicos

- `public/px-console-8f21c.html`: ações de acesso em `viewAlunos()` gravando em `course_access` (via endpoint admin com chave de serviço, origem `manual`), seletor de curso e validade; marcador de tópico órfão na lista lateral.
- Novo endpoint `src/routes/api/public/admin-access.ts` (POST/DELETE) protegido por `requireAdmin`, validado com Zod.
- `public/workspace.html`: `carregarConteudoKB()` passa a distinguir 401/403/vazio/erro e renderiza o estado correspondente; remoção do bloco `kb-fallback`.
- `public/px-kb.js`: `kbDisciplina` passa a devolver o status HTTP em vez de engolir a falha em array vazio.
- Sem mudança de esquema: `course_access` e as políticas atuais já atendem.
