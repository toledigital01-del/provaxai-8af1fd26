# Revisão geral do Prova X — erros encontrados e melhorias

Fiz uma varredura no app (páginas, endpoints e banco). Achei um erro que está quebrando o site para visitantes deslogados, duas brechas que deixam conteúdo pago e a IA acessíveis de graça, e alguns pontos de acabamento.

## 1. Erro confirmado: visitante deslogado não consegue carregar os cursos

Nas requisições reais do preview, a leitura de `courses` volta com erro:
`permission denied for function is_admin`.

Causa verificada: as regras de leitura pública de `courses`, `plans`, `coupons`, `questions`, `platform_settings` e `flashcards` chamam a função `is_admin()`, mas essa função só está liberada para usuários logados. Para quem não está logado, a leitura inteira falha.

Correção: liberar a execução da função para visitantes, ou reescrever as regras públicas para não dependerem dela. Vou pela segunda opção (mais segura): a regra pública passa a checar só o dado público (curso publicado, plano ativo, questão ativa etc.) e a visão de administrador vira uma regra separada, só para logados.

## 2. Conteúdo pago está legível sem assinatura

A base de conhecimento (`knowledge_docs`) tem uma regra que permite qualquer visitante ler todo documento marcado como publicado. Como a chave pública do app fica no navegador, dá para baixar o curso inteiro sem pagar, mesmo com a trava das páginas funcionando.

Correção: remover a leitura pública desses documentos. As aulas passam a ser lidas só por quem está logado e com acesso ativo ao curso; o servidor continua lendo tudo normalmente para a Athena.

## 3. A Athena responde para qualquer um, sem login

O endpoint da Athena aceita perguntas sem nenhuma verificação. Qualquer pessoa (ou robô) pode chamar e gastar seus créditos de IA.

Correção: exigir usuário autenticado com acesso ao curso, e aplicar um limite diário por aluno (o campo de limite já existe nas configurações de IA, hoje não é aplicado). Registrar cada chamada em `ai_logs` para você acompanhar consumo e custo.

## 4. O endereço secreto do painel está exposto

`admin.html` e `painel.html` são páginas públicas que redirecionam direto para o console secreto — ou seja, o endereço "escondido" é descoberto por quem digitar `/admin.html`.

Correção: apagar os dois redirecionamentos e manter só o acesso pelo endereço direto.

## 5. Chaves de API guardadas em texto puro

As chaves que você acabou de salvar ficam legíveis para qualquer conta com papel de administrador. Enquanto só você for admin, o risco é baixo.

Melhoria: nunca devolver o valor da chave para a tela (só "salva/não salva") e registrar em log toda gravação e remoção. Criptografia de verdade exigiria mover as chaves para o cofre da plataforma — dá para fazer depois, se quiser.

## 6. Melhorias de acabamento (opcionais, sem mudar o visual)

- Página `app.html` ainda tem conteúdo de exemplo (mock) — decidir se remove ou liga nos dados reais.
- Segurança de senha vazada está desligada no login; recomendo ligar.
- Padronizar a mensagem de erro quando a IA não tem chave configurada, em vez de erro genérico.

## Ordem sugerida de execução

1. Correção das regras de leitura (item 1) — desbloqueia o site para visitantes.
2. Fechar o conteúdo pago (item 2) e proteger a Athena (item 3).
3. Remover os redirecionamentos do painel (item 4) e o endurecimento das chaves (item 5).
4. Acabamentos do item 6.

## Detalhes técnicos

- Migração SQL: recriar as políticas `courses_public_read`, `plans_read`, `coupons_read`, `questions_read`, `settings_read`, `flashcards_read` separando `TO anon` (sem `is_admin()`) de `TO authenticated`; remover `knowledge_docs_read_published_anon` e condicionar a leitura autenticada a `course_access`/assinatura ativa.
- `src/routes/api/public/athena.ts`: usar `currentUser(request)` + verificação de acesso ao curso, contagem diária em `ai_logs` contra `ai_settings.limite_diario`, e gravação de tokens/custo.
- Excluir `public/admin.html` e `public/painel.html`.
- `public/px-console-8f21c.html`: manter os campos de chave sempre vazios na renderização e chamar `logAdmin` em salvar/remover.
