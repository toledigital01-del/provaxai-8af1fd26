-- Lote 7 do curso completo PRF: Raciocínio Lógico-Matemático (peso 8).

INSERT INTO public.knowledge_docs (course_slug, disciplina, topico, titulo, conteudo, publicado, ordem) VALUES

('prf-2021', 'Raciocínio Lógico-Matemático', 'Estruturas Lógicas', 'Estruturas Lógicas: proposições, conectivos e tabela-verdade', $md1$
## Mapa do tópico — o que cai e por quê

Estruturas Lógicas é a base de toda a disciplina de Raciocínio Lógico — sem dominar os conectivos e a tabela-verdade, é impossível resolver questões de argumentação, equivalência ou negação. É também o tópico mais "mecânico": uma vez memorizada a lógica de cada conectivo, a resolução vira quase automática.

## Teoria essencial

Uma **proposição** é uma sentença declarativa que pode ser julgada como **verdadeira (V)** ou **falsa (F)**, nunca as duas ao mesmo tempo (princípio do terceiro excluído) e nunca nenhuma das duas (princípio da não contradição). Proposições simples se combinam através de **conectivos lógicos**, formando proposições compostas.

Os principais conectivos e suas tabelas-verdade: a **conjunção** ("e", símbolo ∧) só é verdadeira quando **ambas** as proposições são verdadeiras — em qualquer outro caso, é falsa. A **disjunção inclusiva** ("ou", símbolo ∨) é verdadeira quando **pelo menos uma** das proposições é verdadeira, só sendo falsa quando ambas são falsas. A **disjunção exclusiva** ("ou... ou...", símbolo ⊻) é verdadeira quando as proposições têm valores **diferentes** entre si (uma V e outra F), sendo falsa quando têm o mesmo valor.

O **condicional** ("se... então...", símbolo →) só é **falso** numa única situação: quando o antecedente é verdadeiro e o consequente é falso — em todos os outros três casos (V-V, F-V, F-F), o condicional é verdadeiro. Essa é a regra mais cobrada e mais contraintuitiva do tópico: um condicional com antecedente falso é sempre **verdadeiro**, independentemente do consequente.

O **bicondicional** ("se e somente se", símbolo ↔) é verdadeiro quando as duas proposições têm o **mesmo** valor lógico (ambas V ou ambas F), sendo falso quando têm valores diferentes.

A **negação** (~, ou ¬) inverte o valor lógico da proposição: nega uma proposição verdadeira, transformando-a em falsa, e vice-versa. Negar proposições compostas segue regras específicas (tratadas no tópico de Equivalências e Negações), mas a regra geral de uma proposição simples é a inversão direta do valor.

## Como a Cebraspe cobra este assunto

O item costuma apresentar uma proposição composta com valores lógicos definidos (ou a definir) para as proposições simples, e perguntar o valor lógico resultante. O erro mais comum é o candidato aplicar a intuição da linguagem comum ao condicional, esquecendo que ele só é falso numa única combinação específica.

## Pegadinhas e palavras-armadilha

- Condicional (→): **falso só quando** antecedente V e consequente F. Em todos os outros casos, verdadeiro — inclusive quando o antecedente é falso.
- Conjunção (∧, "e"): precisa de **ambas** verdadeiras para ser verdadeira.
- Disjunção inclusiva (∨, "ou"): basta **uma** verdadeira para ser verdadeira; só é falsa se ambas forem falsas.
- Bicondicional (↔): verdadeiro quando os valores são **iguais** (V-V ou F-F).
- Disjunção exclusiva: verdadeira quando os valores são **diferentes** (padrão oposto ao bicondicional).

## Letra de lei

Não se aplica letra de lei — o tópico é regido pelas regras formais da lógica proposicional clássica, consolidadas na literatura de Raciocínio Lógico usada em concursos.

## Resumo relâmpago para revisão

- Conjunção (e): V só se ambas V.
- Disjunção inclusiva (ou): F só se ambas F.
- Condicional (se...então): F só se antecedente V e consequente F.
- Bicondicional (se e somente se): V se valores iguais.
- Disjunção exclusiva: V se valores diferentes.

## Treino rápido

**1.** Um condicional cujo antecedente é uma proposição falsa é sempre verdadeiro, independentemente do valor lógico do consequente.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** A disjunção inclusiva entre duas proposições só é verdadeira quando ambas as proposições envolvidas forem verdadeiras simultaneamente.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A disjunção inclusiva é verdadeira quando pelo menos uma das proposições for verdadeira; só é falsa quando ambas forem falsas.

**3.** O bicondicional entre duas proposições é verdadeiro quando ambas possuem o mesmo valor lógico, sejam ambas verdadeiras ou ambas falsas.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** A conjunção entre duas proposições é verdadeira sempre que pelo menos uma delas for verdadeira.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A conjunção exige que **ambas** as proposições sejam verdadeiras; essa é a regra da disjunção inclusiva, não da conjunção.
$md1$, true, 1),

('prf-2021', 'Raciocínio Lógico-Matemático', 'Lógica de Argumentação', 'Lógica de Argumentação: equivalências, negações e validade de argumentos', $md2$
## Mapa do tópico — o que cai e por quê

Esse tópico usa as tabelas-verdade do tópico anterior como ferramenta pra resolver um problema mais aplicado: saber reescrever uma proposição de forma equivalente, negá-la corretamente, e avaliar se um argumento é logicamente válido. É onde a lógica proposicional "vira prova" de verdade.

## Teoria essencial

A **equivalência** mais cobrada é a do condicional: "se P, então Q" (P → Q) é logicamente equivalente a "não P ou Q" (~P ∨ Q) — essa transformação é a chave para resolver a maioria das questões de reescrita de condicional. Também é equivalente à sua **contrapositiva**: "se não Q, então não P" (~Q → ~P) — mas **não** é equivalente à sua **recíproca** ("se Q, então P") nem à sua **inversa** ("se não P, então não Q"), erro clássico de quem confunde as quatro formas.

A **negação de proposições compostas** segue as **Leis de De Morgan**: a negação de "P e Q" (~( P ∧ Q)) é equivalente a "não P ou não Q" (~P ∨ ~Q) — a negação da conjunção transforma o "e" em "ou" e nega cada parte. A negação de "P ou Q" (~(P ∨ Q)) é equivalente a "não P e não Q" (~P ∧ ~Q) — a negação da disjunção transforma o "ou" em "e" e nega cada parte. A negação do condicional "se P, então Q" é "P e não Q" (P ∧ ~Q) — regra frequentemente esquecida, pois muitos candidatos tentam negar um condicional criando outro condicional, o que está errado.

Um **argumento** é composto por premissas e uma conclusão, sendo **válido** quando a conclusão decorre necessariamente da verdade das premissas (se todas as premissas forem verdadeiras, a conclusão obrigatoriamente também é). A validade de um argumento é uma questão de **forma lógica**, não do conteúdo ser verdadeiro no mundo real — um argumento pode ser válido mesmo com premissas factualmente falsas, desde que a estrutura lógica garanta que, SE as premissas fossem verdadeiras, a conclusão também seria.

As **regras de inferência** mais cobradas: **modus ponens** (de "se P então Q" e "P", conclui-se "Q"); **modus tollens** (de "se P então Q" e "não Q", conclui-se "não P"); e o **silogismo hipotético** (de "se P então Q" e "se Q então R", conclui-se "se P então R").

## Como a Cebraspe cobra este assunto

O item mais frequente pede a negação correta de uma frase composta do texto ou de um enunciado lógico, testando diretamente as Leis de De Morgan. Também é comum apresentar um pequeno argumento (premissas + conclusão) e perguntar se ele é válido, testando modus ponens, modus tollens ou a confusão com a recíproca/inversa do condicional.

## Pegadinhas e palavras-armadilha

- Negação de "P e Q" = "não P **ou** não Q" (De Morgan) — troca o conectivo e nega as partes.
- Negação de "P ou Q" = "não P **e** não Q" (De Morgan).
- Negação de "se P então Q" = "P **e** não Q" — nunca vira outro condicional.
- Condicional (P→Q) é equivalente à contrapositiva (~Q→~P), **não** à recíproca (Q→P) nem à inversa (~P→~Q).
- Validade do argumento é sobre a **forma lógica**, não sobre o conteúdo ser verdadeiro na realidade.

## Letra de lei

Não se aplica letra de lei — o tópico é regido pelas regras formais da lógica proposicional e pelas Leis de De Morgan, consolidadas na literatura de Raciocínio Lógico usada em concursos.

## Resumo relâmpago para revisão

- P→Q equivale a ~P∨Q e à contrapositiva ~Q→~P — não à recíproca nem à inversa.
- Negação de "e" vira "ou" (nega as partes); negação de "ou" vira "e" (nega as partes) — Leis de De Morgan.
- Negação de condicional: "P e não Q".
- Modus ponens (P→Q, P ⊢ Q); modus tollens (P→Q, ~Q ⊢ ~P); silogismo hipotético (P→Q, Q→R ⊢ P→R).
- Validade de argumento = questão de forma, não de verdade factual do conteúdo.

## Treino rápido

**1.** A negação da proposição "Choveu e o jogo foi cancelado" é "Não choveu ou o jogo não foi cancelado".
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** A proposição condicional "Se P, então Q" é logicamente equivalente à sua recíproca "Se Q, então P".
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** O condicional é equivalente à sua contrapositiva, não à recíproca.

**3.** A negação da proposição "Se estudei, então fui aprovado" é "Se não estudei, então não fui aprovado".
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A negação correta de um condicional é "estudei e não fui aprovado", não outro condicional.

**4.** Um argumento pode ser considerado logicamente válido mesmo quando suas premissas são factualmente falsas, desde que a estrutura lógica garanta a conclusão a partir da suposta verdade das premissas.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**
$md2$, true, 2),

('prf-2021', 'Raciocínio Lógico-Matemático', 'Diagramas Lógicos', 'Diagramas Lógicos: quantificadores e conjuntos', $md3$
## Mapa do tópico — o que cai e por quê

Diagramas lógicos aparecem quando a questão envolve quantificadores ("todo", "algum", "nenhum") em vez de proposições simples ligadas por conectivos. A ferramenta visual (diagrama de Venn) ajuda a evitar o erro mais comum do tópico: inverter a validade de uma conclusão que "parece" óbvia mas não decorre logicamente das premissas.

## Teoria essencial

As proposições categóricas mais cobradas usam os quantificadores **"todo"** (universal afirmativa: todo A é B, representado por um círculo A totalmente contido no círculo B), **"nenhum"** (universal negativa: nenhum A é B, círculos A e B completamente separados, sem interseção), **"algum"** (particular afirmativa: algum A é B, círculos A e B com interseção parcial, mas não necessariamente total) e **"algum... não"** (particular negativa: algum A não é B, existe parte de A fora de B).

A **negação de "todo A é B"** não é "nenhum A é B" (erro clássico) — é **"algum A não é B"**. Da mesma forma, a negação de "algum A é B" é "nenhum A é B", e a negação de "nenhum A é B" é "algum A é B". Essas quatro proposições se relacionam num esquema de oposições: "todo A é B" e "algum A não é B" são **contraditórias** entre si (uma nega exatamente a outra); "nenhum A é B" e "algum A é B" também são contraditórias entre si.

Um erro extremamente comum é assumir que "todo A é B" implica "todo B é A" — essa inversão **não é válida** logicamente. De "todo A é B", só se pode concluir com certeza que "algum B é A" (se existir pelo menos um elemento em A), não que todo B seja A. Da mesma forma, de "algum A é B" não se pode concluir "todo A é B", nem "todo B é A" — a existência de interseção parcial não garante inclusão total.

Para resolver problemas com **múltiplos conjuntos e quantidades** (típico de questões que pedem "quantas pessoas gostam de A e B, mas não de C"), o diagrama de Venn com três círculos, preenchido da interseção mais específica para a mais geral, é a ferramenta mais segura — evita contar duplamente elementos que pertencem a mais de um conjunto.

## Como a Cebraspe cobra este assunto

O item costuma apresentar uma premissa com quantificador ("todos os policiais são concursados") e uma suposta conclusão, testando se o candidato reconhece corretamente o que pode e o que não pode ser inferido logicamente — a inversão indevida de "todo A é B" para "todo B é A" é a pegadinha mais recorrente.

## Pegadinhas e palavras-armadilha

- Negação de "todo A é B" = "algum A **não** é B" — nunca "nenhum A é B".
- "Todo A é B" **não implica** "todo B é A" — a inclusão é numa direção só.
- "Algum A é B" **não implica** "todo A é B" — interseção parcial não vira inclusão total.
- Em problemas de conjuntos com interseção, sempre calcule da região mais específica (interseção de todos) para a mais geral, evitando contagem duplicada.

## Letra de lei

Não se aplica letra de lei — o tópico é regido pelas regras formais da lógica de classes/quantificadores e da teoria de conjuntos, consolidadas na literatura de Raciocínio Lógico usada em concursos.

## Resumo relâmpago para revisão

- Todo A é B (negação: algum A não é B) | Nenhum A é B (negação: algum A é B).
- "Todo A é B" não implica "todo B é A" — erro clássico de inversão.
- "Algum A é B" não implica "todo A é B".
- Diagrama de Venn: calcular da interseção mais específica pra mais geral, evitando dupla contagem.

## Treino rápido

**1.** A negação da proposição "Todos os candidatos aprovados estudaram" é "Nenhum candidato aprovado estudou".
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A negação correta é "Algum candidato aprovado não estudou", não "nenhum".

**2.** Da premissa "Todo policial é concursado" pode-se concluir logicamente que "Todo concursado é policial".
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A inclusão de "todo A é B" não garante a inversão "todo B é A"; essa é uma inferência inválida.

**3.** Da premissa "Algum servidor é engenheiro" pode-se concluir logicamente que "Nenhum servidor é engenheiro" é uma proposição falsa.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.** "Algum A é B" é a contraditória de "Nenhum A é B" — se uma é verdadeira, a outra é necessariamente falsa.

**4.** Da premissa "Algum aluno é atleta" pode-se concluir logicamente que "Todo aluno é atleta".
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A existência de interseção parcial ("algum") não garante a inclusão total ("todo").
$md3$, true, 3),

('prf-2021', 'Raciocínio Lógico-Matemático', 'Razão e Proporção', 'Razão e Proporção: grandezas diretamente e inversamente proporcionais', $md4$
## Mapa do tópico — o que cai e por quê

Razão e proporção é a porta de entrada da matemática mais "aplicada" da disciplina — regra de três, escala, divisão proporcional. É um tópico de raciocínio direto, sem grande dificuldade conceitual, mas que exige atenção pra identificar corretamente se a relação entre as grandezas é direta ou inversa, já que isso muda completamente o resultado.

## Teoria essencial

**Razão** é a comparação entre duas grandezas por meio de uma divisão (a razão entre A e B é A/B). **Proporção** é a igualdade entre duas razões (A/B = C/D), e sua propriedade fundamental é que o produto dos meios é igual ao produto dos extremos (A×D = B×C) — essa propriedade é a base para resolver regra de três.

Duas grandezas são **diretamente proporcionais** quando, ao aumentar uma, a outra aumenta na mesma proporção (dobrar uma dobra a outra): exemplo clássico é quantidade de produto e preço total (mais produto, mais caro, na mesma razão). Duas grandezas são **inversamente proporcionais** quando, ao aumentar uma, a outra diminui na mesma proporção (dobrar uma reduz a outra pela metade): exemplo clássico é velocidade e tempo de percurso (mais velocidade, menos tempo, mantida a mesma distância) ou número de trabalhadores e tempo para concluir uma tarefa (mais trabalhadores, menos tempo).

Na **regra de três simples**, identificada a relação (direta ou inversa) entre as duas grandezas envolvidas, monta-se a proporção: se direta, mantém-se a mesma orientação das frações; se inversa, inverte-se uma das frações antes de igualar. Na **regra de três composta**, com três ou mais grandezas envolvidas, analisa-se a relação de cada grandeza com a grandeza que contém a incógnita, isoladamente, decidindo se cada uma delas é direta ou inversamente proporcional à grandeza-alvo, e inverte-se apenas as frações das grandezas inversamente proporcionais antes de resolver a equação conjunta.

A **divisão proporcional** distribui uma quantidade entre partes de forma proporcional a valores dados — diretamente proporcional (divide-se a quantidade total proporcionalmente aos valores dados, quanto maior o valor, maior a parte) ou inversamente proporcional (nesse caso, calcula-se primeiro o inverso de cada valor, e então se divide a quantidade proporcionalmente a esses inversos — quanto maior o valor original, menor a parte recebida).

## Como a Cebraspe cobra este assunto

O erro mais induzido em prova é o candidato montar a regra de três como se toda relação fosse diretamente proporcional, sem parar para verificar a lógica da situação (mais trabalhadores terminam a obra mais rápido, não mais devagar) — a Cebraspe adora enunciados que "parecem" diretos, mas são inversos.

## Pegadinhas e palavras-armadilha

- Identifique **sempre** a lógica da relação antes de montar a proporção: aumentar uma grandeza, a outra aumenta (direta) ou diminui (inversa)?
- Velocidade e tempo (mesma distância): inversamente proporcionais.
- Número de trabalhadores e tempo de conclusão (mesma tarefa): inversamente proporcionais.
- Quantidade e preço total: diretamente proporcionais.
- Na regra de três composta, analise **cada grandeza isoladamente** em relação à grandeza-alvo, não em relação às outras grandezas entre si.

## Letra de lei

Não se aplica letra de lei — o tópico é regido por conceitos matemáticos consolidados de razão, proporção e regra de três, cobrados no padrão usual de concursos.

## Resumo relâmpago para revisão

- Proporção: produto dos meios = produto dos extremos.
- Direta: aumenta uma, aumenta a outra, mesma proporção.
- Inversa: aumenta uma, diminui a outra, mesma proporção.
- Regra de três composta: analisar cada grandeza isoladamente em relação à grandeza-alvo.
- Divisão proporcional inversa: usa o inverso dos valores dados antes de dividir.

## Treino rápido

**1.** Se 4 trabalhadores concluem uma obra em 12 dias, mantido o mesmo ritmo de trabalho, 8 trabalhadores concluiriam a mesma obra em 24 dias.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Número de trabalhadores e tempo de conclusão são inversamente proporcionais: dobrando os trabalhadores, o tempo se reduz pela metade (6 dias), não dobra.

**2.** Em uma proporção A/B = C/D, o produto dos meios é sempre igual ao produto dos extremos.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**3.** A quantidade de combustível consumida por um veículo é diretamente proporcional à distância percorrida, mantidas as demais condições constantes.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** Na regra de três composta, todas as grandezas envolvidas devem necessariamente ser tratadas como diretamente proporcionais entre si, para simplificação do cálculo.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Cada grandeza deve ser analisada isoladamente quanto à sua relação (direta ou inversa) com a grandeza que contém a incógnita.
$md4$, true, 4),

('prf-2021', 'Raciocínio Lógico-Matemático', 'Porcentagem e Juros', 'Porcentagem, Juros Simples e Compostos', $md5$
## Mapa do tópico — o que cai e por quê

Porcentagem e juros são conceitos de aplicação financeira direta, e a prova costuma testar tanto o cálculo puro quanto problemas de aumento/desconto sucessivo, onde o erro mais comum é somar percentuais em vez de compor multiplicativamente.

## Teoria essencial

**Porcentagem** é uma razão com denominador 100, representada pelo símbolo %. Para calcular X% de um valor V, multiplica-se V por X/100. Em **aumentos e descontos sucessivos**, o erro mais comum é somar os percentuais diretamente — a forma correta é multiplicar os fatores de cada variação: um aumento de 10% seguido de outro aumento de 20% não resulta em 30% de aumento total, mas em um fator de 1,10 × 1,20 = 1,32, ou seja, **32%** de aumento total (não 30%). O mesmo vale para descontos sucessivos: dois descontos de 10% não somam 20% de desconto, resultam em fator 0,90 × 0,90 = 0,81, ou seja, **19%** de desconto total.

**Juros simples** são calculados sempre sobre o **capital inicial** (principal), sem incidir sobre os juros já acumulados em períodos anteriores — a fórmula é J = C × i × t (juros = capital × taxa × tempo), e o montante final é M = C × (1 + i×t). O crescimento do montante, no regime de juros simples, é **linear** ao longo do tempo.

**Juros compostos** incidem sobre o **montante acumulado** a cada período (juros sobre juros) — a fórmula do montante é M = C × (1 + i)^t, com crescimento **exponencial** ao longo do tempo, sempre superior ao juro simples para períodos maiores que um (para exatamente um período, ambos os regimes produzem o mesmo resultado). Essa diferença de comportamento (linear x exponencial) é o ponto mais cobrado do tópico: quanto maior o número de períodos, maior a diferença entre o montante em juros simples e em juros compostos.

Um erro comum em problemas de **taxa equivalente e taxa proporcional**: em juros simples, a taxa proporcional é obtida por simples divisão/multiplicação linear (ex.: taxa anual dividida por 12 dá a taxa mensal proporcional); em juros compostos, taxas equivalentes exigem cálculo exponencial (não é uma simples divisão linear), já que o efeito composto muda a relação entre períodos.

## Como a Cebraspe cobra este assunto

O item mais recorrente testa se o candidato soma percentuais sucessivos em vez de compor multiplicativamente, ou testa se o candidato sabe que juros compostos crescem de forma exponencial, superando os juros simples para prazos maiores que um único período.

## Pegadinhas e palavras-armadilha

- Aumentos/descontos sucessivos: **multiplicam-se os fatores**, nunca se somam os percentuais diretamente.
- Juros simples: incide só sobre o capital inicial, crescimento **linear**.
- Juros compostos: incide sobre o montante acumulado, crescimento **exponencial**.
- Para um único período, juros simples e compostos produzem o **mesmo** resultado — a diferença só aparece a partir de dois períodos.
- Taxa proporcional (juros simples, cálculo linear) ≠ taxa equivalente (juros compostos, cálculo exponencial).

## Letra de lei

Não se aplica letra de lei — o tópico é regido por conceitos matemáticos consolidados de matemática financeira, cobrados no padrão usual de concursos.

## Resumo relâmpago para revisão

- Aumentos/descontos sucessivos: multiplicar fatores (1+X%)×(1+Y%), nunca somar percentuais.
- Juros simples: J = C×i×t; M = C×(1+i×t) — crescimento linear.
- Juros compostos: M = C×(1+i)^t — crescimento exponencial.
- Para 1 período, simples = composto; a partir de 2 períodos, composto supera o simples.

## Treino rápido

**1.** Um produto que sofre dois descontos sucessivos de 10% cada um tem, ao final, um desconto total equivalente a 20% sobre o preço original.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Descontos sucessivos se compõem multiplicativamente (0,90 × 0,90 = 0,81), resultando em desconto total de 19%, não 20%.

**2.** No regime de juros compostos, o montante cresce de forma exponencial ao longo do tempo, superando o montante equivalente calculado em juros simples, para prazos superiores a um único período.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**3.** Nos juros simples, os juros de cada período incidem sobre o montante acumulado do período anterior, e não apenas sobre o capital inicial.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Nos juros simples, os juros incidem sempre sobre o capital inicial (principal); a incidência sobre o montante acumulado é característica dos juros compostos.

**4.** Para um único período de capitalização, o montante calculado por juros simples é idêntico ao montante calculado por juros compostos, para uma mesma taxa e capital.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**
$md5$, true, 5),

('prf-2021', 'Raciocínio Lógico-Matemático', 'Análise Combinatória', 'Análise Combinatória: arranjo, combinação e permutação', $md6$
## Mapa do tópico — o que cai e por quê

Análise combinatória é o tópico onde mais candidatos travam, porque exige identificar corretamente qual das três ferramentas (arranjo, combinação ou permutação) se aplica ao problema — errar essa identificação inicial invalida todo o cálculo seguinte, por mais que a conta esteja certa.

## Teoria essencial

O **princípio fundamental da contagem (PFC)** afirma que, se um evento pode ocorrer de "m" formas diferentes e, para cada uma dessas formas, um segundo evento pode ocorrer de "n" formas diferentes, o total de formas de os dois eventos ocorrerem em sequência é m × n — é a base de toda a combinatória, aplicável antes de qualquer fórmula específica.

A **permutação simples** conta o número de formas de organizar **todos** os elementos de um conjunto, em sequência, quando a **ordem importa**: Pn = n!. A **permutação com repetição** é usada quando há elementos repetidos no conjunto, dividindo o fatorial total pelo fatorial da quantidade de cada elemento repetido.

O **arranjo** conta agrupamentos de "p" elementos escolhidos entre "n" disponíveis, em que a **ordem importa** e nem todos os elementos são necessariamente usados: A(n,p) = n!/(n-p)!. Exemplo típico: formar uma senha ou definir os três primeiros colocados de uma corrida (1º, 2º e 3º lugar são posições diferentes — trocar a ordem muda o resultado).

A **combinação** conta agrupamentos de "p" elementos escolhidos entre "n" disponíveis, em que a **ordem não importa**: C(n,p) = n!/[p!×(n-p)!]. Exemplo típico: escolher uma comissão de 3 pessoas entre 10 candidatos (não importa a ordem em que as pessoas são escolhidas, o grupo final é o mesmo).

A pergunta-chave para decidir entre arranjo e combinação é sempre: **trocar a ordem dos elementos escolhidos gera um resultado diferente?** Se sim, é arranjo (ou permutação, se usar todos os elementos); se não, é combinação. Formar uma diretoria com cargos distintos (presidente, vice, tesoureiro) é arranjo, porque trocar quem ocupa cada cargo muda o resultado; formar uma comissão sem cargos distintos é combinação, porque o grupo é o mesmo independentemente da ordem de escolha.

## Como a Cebraspe cobra este assunto

O item descreve uma situação prática (formar uma comissão, definir uma sequência de senha, escalar uma equipe com funções distintas) e o erro mais induzido é aplicar a fórmula errada — geralmente usar combinação quando a ordem importa (deveria ser arranjo/permutação), ou vice-versa.

## Pegadinhas e palavras-armadilha

- Pergunta-chave: **a ordem dos elementos escolhidos importa?** Sim → arranjo/permutação. Não → combinação.
- Permutação: usa **todos** os elementos, ordem importa. Arranjo: usa **parte** dos elementos, ordem importa.
- Cargos/funções distintas (presidente, vice, etc.): arranjo. Comissão/grupo sem distinção de função: combinação.
- Posições numeradas (1º, 2º, 3º lugar): arranjo, porque a posição diferencia o resultado.

## Letra de lei

Não se aplica letra de lei — o tópico é regido por fórmulas matemáticas consolidadas de análise combinatória, cobradas no padrão usual de concursos.

## Resumo relâmpago para revisão

- PFC: m × n (eventos sequenciais independentes).
- Permutação (Pn = n!): todos os elementos, ordem importa.
- Arranjo (A(n,p) = n!/(n-p)!): parte dos elementos, ordem importa.
- Combinação (C(n,p) = n!/[p!(n-p)!]): parte dos elementos, ordem não importa.
- Pergunta-chave: trocar a ordem muda o resultado? Sim = arranjo/permutação. Não = combinação.

## Treino rápido

**1.** A escolha de uma comissão de 4 pessoas entre 10 candidatos, sem distinção de função entre os escolhidos, deve ser calculada por meio de combinação, e não de arranjo.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** A definição dos três primeiros colocados (1º, 2º e 3º lugar) de uma corrida com 8 participantes deve ser calculada por meio de combinação, já que se trata da escolha de um subconjunto de participantes.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Como as posições (1º, 2º, 3º) são distintas e a ordem importa, o cálculo correto é por arranjo, não por combinação.

**3.** Na permutação simples de um conjunto de n elementos distintos, todos os elementos do conjunto são utilizados, e o número total de permutações é dado por n fatorial.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** A formação de uma diretoria composta por presidente, vice-presidente e tesoureiro, com cargos distintos entre si, deve ser calculada por meio de combinação simples.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Como os cargos são distintos e a ordem de atribuição importa, o cálculo correto é por arranjo, não por combinação.
$md6$, true, 6),

('prf-2021', 'Raciocínio Lógico-Matemático', 'Probabilidade', 'Probabilidade: conceitos básicos, eventos e probabilidade condicional', $md7$
## Mapa do tópico — o que cai e por quê

Probabilidade conecta diretamente com o que você acabou de estudar em combinatória (muitos problemas de probabilidade exigem contar casos favoráveis e possíveis usando arranjo/combinação) e testa se você entende a diferença entre eventos independentes e eventos condicionados um ao outro.

## Teoria essencial

A **probabilidade** de um evento A ocorrer é definida como P(A) = número de casos favoráveis / número de casos possíveis, sempre um valor entre 0 (impossível) e 1 (certo), podendo ser expressa também em percentual. A **probabilidade do complementar** de um evento (A não ocorrer) é P(não A) = 1 − P(A) — regra simples, mas frequentemente esquecida em problemas que pedem "a probabilidade de pelo menos um" evento ocorrer, que muitas vezes é mais fácil de resolver calculando o complementar ("nenhum ocorrer") e subtraindo de 1.

Para **eventos independentes** (a ocorrência de um não afeta a probabilidade do outro, como dois lançamentos separados de um dado), a probabilidade de ambos ocorrerem é o **produto** das probabilidades individuais: P(A e B) = P(A) × P(B). Para **eventos mutuamente exclusivos** (não podem ocorrer simultaneamente, como tirar um número par ou ímpar num único lançamento de dado), a probabilidade de um **ou** outro ocorrer é a **soma** das probabilidades individuais: P(A ou B) = P(A) + P(B). Quando os eventos não são mutuamente exclusivos (podem ocorrer juntos), a fórmula correta é P(A ou B) = P(A) + P(B) − P(A e B), subtraindo a interseção para não contá-la duas vezes.

A **probabilidade condicional** trata da probabilidade de um evento A ocorrer, **dado que** outro evento B já ocorreu: P(A|B) = P(A e B) / P(B) — a informação de que B ocorreu **muda** o espaço amostral considerado, restringindo-o apenas aos casos em que B é verdadeiro. É essa restrição do espaço amostral que costuma confundir o candidato: a probabilidade condicional não é simplesmente a probabilidade de A calculada normalmente, é recalculada dentro do universo reduzido pela condição de B já ter ocorrido.

Dois eventos A e B são **independentes** exatamente quando P(A|B) = P(A) — ou seja, saber que B ocorreu não muda em nada a probabilidade de A. Se essa igualdade não se verifica, os eventos são **dependentes**.

## Como a Cebraspe cobra este assunto

O item costuma testar se o candidato aplica corretamente a multiplicação (eventos independentes, "e") versus a soma (eventos mutuamente exclusivos, "ou"), ou apresenta uma situação de probabilidade condicional, testando se o candidato recalcula corretamente o espaço amostral reduzido pela condição dada.

## Pegadinhas e palavras-armadilha

- Eventos independentes ("e", ambos ocorrem): **multiplicam-se** as probabilidades.
- Eventos mutuamente exclusivos ("ou", um ou outro): **somam-se** as probabilidades (sem subtrair interseção, pois ela é zero).
- Eventos não exclusivos ("ou", podem ocorrer juntos): soma menos a interseção — P(A)+P(B)−P(A e B).
- Probabilidade condicional: **restringe** o espaço amostral ao evento já ocorrido — não é a probabilidade "normal" de A.
- "Pelo menos um" costuma ser mais fácil via complementar: 1 − P(nenhum ocorrer).

## Letra de lei

Não se aplica letra de lei — o tópico é regido por conceitos matemáticos consolidados de teoria da probabilidade, cobrados no padrão usual de concursos.

## Resumo relâmpago para revisão

- P(A) = casos favoráveis / casos possíveis. P(não A) = 1 − P(A).
- Independentes ("e"): multiplicar. Mutuamente exclusivos ("ou"): somar.
- Não exclusivos ("ou"): P(A)+P(B)−P(A e B).
- Condicional: P(A|B) = P(A e B)/P(B) — espaço amostral restrito a B.
- "Pelo menos um": geralmente mais fácil via 1 − P(nenhum).

## Treino rápido

**1.** A probabilidade de ocorrência de dois eventos independentes simultaneamente é obtida pela soma das probabilidades individuais de cada evento.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Para eventos independentes ocorrendo simultaneamente, a probabilidade é obtida pelo produto das probabilidades individuais, não pela soma.

**2.** A probabilidade condicional de um evento A, dado que um evento B já ocorreu, é calculada considerando-se apenas o espaço amostral restrito aos casos em que B ocorre.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**3.** A probabilidade de ocorrência de pelo menos um entre dois eventos pode ser calculada, de forma equivalente, subtraindo-se de 1 a probabilidade de nenhum dos eventos ocorrer.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** Dois eventos A e B são considerados independentes quando a probabilidade condicional de A, dado B, é diferente da probabilidade não condicional de A.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Eventos são independentes exatamente quando P(A|B) é **igual** a P(A); a diferença entre esses valores indica dependência entre os eventos.
$md7$, true, 7),

('prf-2021', 'Raciocínio Lógico-Matemático', 'Estatística Básica', 'Estatística Básica: medidas de tendência central e dispersão', $md8$
## Mapa do tópico — o que cai e por quê

Estatística fecha a disciplina com conceitos de leitura e resumo de dados — média, mediana, moda e medidas de dispersão. A prova gosta de testar situações em que média e mediana divergem bastante (por causa de valores extremos), já que essa divergência revela se o candidato entende a diferença real entre essas medidas, e não só decorou a fórmula.

## Teoria essencial

A **média aritmética** é a soma de todos os valores dividida pela quantidade de valores. É a medida mais sensível a **valores extremos (outliers)**: um único valor muito alto ou muito baixo pode distorcer bastante a média, mesmo que não represente o comportamento típico do conjunto de dados.

A **mediana** é o valor que ocupa a posição central de um conjunto de dados **ordenado**: se a quantidade de valores é ímpar, é o valor exatamente do meio; se é par, é a média dos dois valores centrais. A mediana é **mais resistente a valores extremos** do que a média — por isso, quando um conjunto de dados tem outliers relevantes (como salários numa empresa, com poucos salários muito altos distorcendo a média), a mediana costuma representar melhor o "valor típico" do conjunto.

A **moda** é o valor que aparece com **maior frequência** no conjunto de dados. Um conjunto pode ser **amodal** (nenhum valor se repete), **unimodal** (um valor mais frequente), **bimodal** (dois valores empatados na maior frequência) ou **multimodal**.

Entre as **medidas de dispersão**, a **amplitude** é a diferença entre o maior e o menor valor do conjunto — a medida mais simples, mas também a mais sensível a valores extremos isolados. O **desvio-padrão** mede o quanto os valores, em média, se afastam da média do conjunto: quanto maior o desvio-padrão, mais dispersos (menos homogêneos) são os dados; quanto menor, mais próximos da média (mais homogêneos) eles são. A **variância** é o desvio-padrão elevado ao quadrado, usada como etapa intermediária de cálculo.

Um ponto de atenção frequentemente testado: quando todos os valores de um conjunto são iguais entre si, o desvio-padrão é **zero** (não há dispersão alguma), e a média coincide exatamente com a mediana e com a moda.

## Como a Cebraspe cobra este assunto

O item costuma apresentar um pequeno conjunto de dados com um valor discrepante (outlier) e perguntar o valor da média ou da mediana, testando se o candidato calcula corretamente cada uma e reconhece que elas podem divergir significativamente quando há valores extremos.

## Pegadinhas e palavras-armadilha

- Média é **sensível** a valores extremos; mediana é **resistente** a eles — em conjuntos com outliers, as duas podem divergir bastante.
- Mediana de conjunto **par**: média dos dois valores centrais, após ordenar os dados. Conjunto **ímpar**: valor central único.
- Desvio-padrão **zero** significa que todos os valores do conjunto são iguais entre si.
- Moda pode não existir (amodal) ou haver mais de uma (bimodal/multimodal) — não é garantido que todo conjunto tenha exatamente uma moda.
- Antes de calcular a mediana, os dados **precisam estar ordenados** — calcular sobre dados desordenados é erro comum.

## Letra de lei

Não se aplica letra de lei — o tópico é regido por conceitos matemáticos consolidados de estatística descritiva, cobrados no padrão usual de concursos.

## Resumo relâmpago para revisão

- Média: soma/quantidade, sensível a outliers.
- Mediana: valor central (dados ordenados), resistente a outliers.
- Moda: valor mais frequente (pode não existir ou haver mais de uma).
- Desvio-padrão: dispersão em torno da média (zero = todos os valores iguais).
- Amplitude: maior valor − menor valor.

## Treino rápido

**1.** A média aritmética é mais sensível à presença de valores extremos (outliers) em um conjunto de dados do que a mediana.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** Em um conjunto de dados com quantidade par de elementos, a mediana corresponde sempre a um dos valores efetivamente presentes no conjunto original.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Quando a quantidade de elementos é par, a mediana é a média dos dois valores centrais, podendo não corresponder a nenhum valor originalmente presente no conjunto.

**3.** Um desvio-padrão igual a zero indica que todos os valores do conjunto de dados são idênticos entre si.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** Todo conjunto de dados possui necessariamente uma única moda, correspondente ao valor de maior frequência entre os observados.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Um conjunto pode ser amodal (sem valor de maior frequência definido) ou apresentar mais de uma moda (bimodal ou multimodal).
$md8$, true, 8);
