# Corrigir acesso ao painel administrativo

## O que está acontecendo

Verifiquei o banco: existem 4 contas e apenas `admin@provax.com` tem o papel de administrador. A conta que você está usando hoje (`toledo.digital01@gmail.com`) está registrada apenas como aluno, por isso o painel bloqueia.

O erro "Invalid login credentials" da tela ocorre porque a senha digitada para `admin@provax.com` não confere com a cadastrada — não é possível recuperar essa senha, apenas redefinir.

## Correção proposta

1. Dar o papel de administrador à sua conta pessoal `toledo.digital01@gmail.com`, para você entrar no painel com o login que já usa, sem senha nova.
2. Redefinir a senha da conta `admin@provax.com` para uma senha conhecida (`ProvaX@2026`), mantendo-a como conta admin reserva.
3. Ajustar a tela de bloqueio do painel para, quando a conta logada não for admin, mostrar também o motivo e um botão "Tentar novamente" que recarrega a permissão — hoje ela só oferece sair.

## Detalhes técnicos

- Migração no banco inserindo `('7abdc69e-…','admin')` em `user_roles` (com `ON CONFLICT DO NOTHING`).
- Reset de senha do usuário `admin@provax.com` via API administrativa de autenticação.
- Pequeno ajuste em `public/admin.html` no bloco do gate de permissão (revalidação de papel sem precisar deslogar).

## Verificação

Teste automatizado de navegador: login com a sua conta → painel abre com todas as abas; login com uma conta aluno → bloqueio continua aparecendo.
