# Escolha de IA + montagem de curso focada em aprovação

## O que muda no painel

Na aba **Base de conhecimento (IA)**, o bloco "Montar curso com IA" ganha:

1. **Seletor de IA** — lista com os melhores modelos disponíveis, cada um com uma explicação curta de quando usar:
  - **Máxima qualidade (padrão)** — melhor raciocínio pedagógico e escrita de aula.
  - **Raciocínio profundo** — para matérias densas de lei seca e jurisprudência; mais lento.
  - **Material gigante** — janela de contexto enorme, ideal quando você sobe apostilas/PDFs muito extensos.
  - **Rápido e econômico** — o modelo usado hoje; bom para testes.
   A escolha fica salva no navegador para os próximos usos.
2. **Campo "Banca"** (padrão Cebraspe, editável: FGV, FCC, Vunesp, Cesgranrio, IBFC, Outra) e **campo "Cargo/Concurso"** (pré-preenchido com Polícia Rodoviária Federal).
3. **Nível de profundidade** — Essencial (aula enxuta), Completo (padrão) ou Aprofundado (aula longa com jurisprudência e casos).
4. **Modo aprovação** (ligado por padrão): instrui a IA a priorizar o que mais cai, marcar o grau de incidência de cada assunto e incluir os blocos de fixação na aula.

## Como a IA passa a montar a aula

O prompt do montador é reescrito para produzir aula orientada à aprovação, com esta estrutura fixa por tópico:

- Mapa do tópico e por que ele cai
- Teoria essencial (com **negrito** nos pontos cobrados)
- Como a banca informada cobra este assunto (padrão de enunciado, formato certo/errado quando Cebraspe)
- Pegadinhas e palavras-armadilha ("sempre", "exclusivamente", prazos, competências)
- Jurisprudência/súmulas e letra de lei quando o material trouxer
- Resumo relâmpago para revisão
- 3 a 5 assertivas no estilo da banca, com gabarito comentado

Regras mantidas: só usa tópicos exatos da lista do edital, não inventa lei nem número fora do material, saída em JSON validado no servidor.

Cada aula gerada passa a trazer também uma **etiqueta de incidência** (alta/média/baixa) estimada pela IA, exibida no painel de revisão que já existe, ao lado de "novo" / "sobrescreve conteúdo atual".

## Detalhes técnicos

- `src/routes/api/public/kb-autocourse.ts`: aceita `modelo`, `banca`, `cargo`, `profundidade` e `modo_aprovacao` no corpo, validados por Zod. O `modelo` é conferido contra uma allowlist no servidor (`openai/gpt-5.6-sol`, `openai/gpt-5.5-pro`, `google/gemini-3.1-pro-preview`, `google/gemini-3-flash-preview`) — qualquer outro valor cai no padrão `openai/gpt-5.6-sol`. Todos funcionam pelo endpoint de chat do gateway já usado hoje.
- O schema JSON de resposta ganha o campo opcional `incidencia` ("alta" | "media" | "baixa"), tratado com valor padrão quando ausente.
- `public/px-console-8f21c.html`: novos controles no bloco de montagem, persistência das preferências em `localStorage`, envio dos parâmetros e exibição da etiqueta de incidência no painel de revisão.
- Timeouts: modelos de raciocínio demoram mais, então a mensagem de progresso passa a avisar "pode levar alguns minutos" e o botão fica desabilitado durante a geração.
- Nada muda no chat da Athena nesta etapa (continua no modelo rápido); posso trocar depois se quiser. mantemha a ia atual como padrao por enuqanto a gemini que é grtuita
- &nbsp;