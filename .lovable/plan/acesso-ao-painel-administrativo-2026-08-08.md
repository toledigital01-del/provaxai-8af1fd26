# Acesso ao painel administrativo

## Diagnóstico

O endereço antigo `/admin.html` foi removido quando o console virou oculto — por isso o 404. O console atual responde normalmente:

- Publicado: `https://provaxai.lovable.app/px-console-8f21c.html` (HTTP 200 verificado)
- Preview: `https://id-preview--ddfae121-d904-462a-a84a-1f536e8aa399.lovable.app/px-console-8f21c.html`

As contas `toledo.digital01@gmail.com` e `admin@provax.com` já possuem o papel `admin` no banco.

## O que fazer

1. Recriar `public/admin.html` como uma página mínima de redirecionamento (com `noindex`) que envia para `/px-console-8f21c.html`, para que o endereço antigo pare de dar 404.
2. Adicionar um atalho mais fácil de digitar: `public/painel.html`, também apenas redirecionando para o console real, com `noindex` e sem nenhum link a partir do app ou da landing page.
3. Confirmar em `public/robots.txt` que todos esses caminhos ficam bloqueados para buscadores.
4. Não alterar o gate de login nem as permissões: o console continua exigindo conta com papel de administrador.

## Detalhes técnicos

- Redirecionamentos feitos via `<meta http-equiv="refresh">` + `location.replace`, sem depender de rotas do servidor.
- `public/robots.txt`: entradas `Disallow` para `/px-console-8f21c.html`, `/admin.html` e `/painel.html`.
- Alterações de frontend só entram no ar depois de clicar em Publicar → Atualizar.
