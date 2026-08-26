# Ajustar contraste e alinhamento das aulas

## Objetivo
Melhorar somente a leitura do conteúdo das aulas nos modos claro e escuro, mantendo o layout e as funcionalidades atuais.

## Alterações
1. **Aulas em HTML pronto**
   - Normalizar fundo e cor do texto dentro do iframe nos dois temas, inclusive quando o HTML enviado trouxer cores inline próprias.
   - No modo escuro, garantir alto contraste para parágrafos, listas, títulos, negritos, tabelas, links, citações e códigos.
   - Preservar cores semânticas de destaques quando forem legíveis e corrigir os trechos que hoje ficam praticamente pretos sobre o fundo escuro.

2. **Aulas renderizadas pelo sistema**
   - Refinar as cores de texto principal, secundário, títulos, marcações, callouts, tabelas e glossário nos modos claro e escuro.
   - Remover regras de cor que dependem de valores frágeis e usar os tokens já existentes do tema.

3. **Texto justificado**
   - Aplicar alinhamento justificado apenas ao conteúdo corrido da aula (parágrafos e textos de callouts), com hifenização e quebra de palavras adequadas.
   - Manter títulos, listas, tabelas, botões e demais controles com seu alinhamento natural.
   - Em telas estreitas, preservar espaçamento confortável para evitar grandes lacunas entre palavras.

4. **Validação visual**
   - Conferir a mesma aula em modo claro e escuro, incluindo HTML pronto e conteúdo Markdown.
   - Validar contraste, hierarquia visual, legibilidade e ausência de texto escuro invisível no tema noturno.
