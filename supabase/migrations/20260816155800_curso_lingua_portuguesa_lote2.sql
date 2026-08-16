-- Lote 2 do curso completo PRF: Língua Portuguesa (peso 12, segunda maior do edital).
-- Mesmo padrão do lote 1: conteúdo original, "modo aprovação", topico/disciplina batendo
-- exatamente com os nomes reais da tabela public.topics (já sincronizada com data.js).

INSERT INTO public.knowledge_docs (course_slug, disciplina, topico, titulo, conteudo, publicado, ordem) VALUES

('prf-2021', 'Língua Portuguesa', 'Compreensão e Interpretação de Textos', 'Compreensão e Interpretação de Textos: como a banca testa leitura', $md1$
## Mapa do tópico — o que cai e por quê

Interpretação de texto não é um tópico isolado — é a porta de entrada de praticamente toda a prova de Português da Cebraspe, porque a banca constrói a maioria dos itens em cima de um texto-base e pergunta o que ele "permite inferir", "não permite inferir" ou "generaliza incorretamente". Dominar a lógica de leitura da Cebraspe rende pontos até em questões que, na superfície, parecem ser de outro assunto.

## Teoria essencial

A Cebraspe trabalha com um formato de item muito característico: apresenta um trecho do texto entre aspas (às vezes reescrito, às vezes literal) e pede para o candidato julgar se aquela afirmação está **certa** ou **errada** em relação ao que o texto efetivamente diz. Isso exige duas competências separadas: entender o que o texto diz **literalmente** e entender o que ele **permite inferir** sem exagero.

A diferença entre esses dois níveis é o cerne do tópico. Uma inferência correta é aquela que decorre logicamente do que está escrito, sem acrescentar informação nova nem extrapolar além do que o autor afirmou. Já uma inferência errada — a mais comum em prova — costuma vir de uma **generalização indevida**: o texto fala de um caso específico, e o item afirma que aquilo vale "sempre", "para todos" ou "em qualquer situação", quando o texto não autoriza essa extensão.

Outro mecanismo clássico é a **paráfrase com troca de sentido**: o item reescreve uma frase do texto usando palavras diferentes, mas na reescrita muda sutilmente o sentido original — troca uma causa por uma consequência, inverte uma relação de tempo, ou troca um termo por um "quase sinônimo" que na verdade carrega um sentido diferente no contexto. Ler apenas "por cima", reconhecendo palavras parecidas com as do texto, é exatamente o que faz o candidato cair nesse tipo de pegadinha.

A **coesão referencial** também é testada dentro de interpretação: pronomes, advérbios e expressões que retomam algo dito antes (anáfora) ou anunciam algo que vem depois (catáfora) precisam ser rastreados com precisão — a banca gosta de perguntar "a que o pronome 'isso' se refere no texto?" justamente porque, se o candidato perder o fio da meada, erra a questão inteira.

Por fim, vale destacar que a Cebraspe **não costuma exigir opinião do candidato** sobre o tema do texto — o julgamento é sempre em relação ao que **o texto afirma**, não ao que é verdade no mundo real ou ao que o candidato pessoalmente acha. Um item pode estar "certo" mesmo contrariando o senso comum, desde que reproduza fielmente o que o autor escreveu.

## Como a Cebraspe cobra este assunto

O padrão mais comum é pegar uma afirmação pontual do texto e generalizá-la ("o texto afirma que X sempre acontece", quando na verdade o texto só descreveu um caso). Outro padrão é inverter uma relação de causa e efeito, ou trocar um verbo modal ("pode" por "deve"), mudando a força da afirmação original.

## Pegadinhas e palavras-armadilha

- Generalizações: "todos", "sempre", "nunca", "qualquer" — quando o texto só falou de um caso específico.
- Paráfrase que muda o sentido: cuidado com sinônimos que não são realmente equivalentes no contexto.
- Inversão de causa e consequência, ou de ordem temporal dos fatos.
- Confundir "o texto diz que X é verdade" com "X é de fato verdade" — julgue pelo texto, não pelo mundo real.
- Pronomes e referências: rastreie sempre a que exatamente cada "isso", "essa", "tal fato" se refere.

## Letra de lei

Não se aplica letra de lei específica a este tópico — a base é a lógica textual e o padrão de cobrança consolidado da própria banca Cebraspe em provas anteriores da carreira policial.

## Resumo relâmpago para revisão

- Julgue sempre pelo que o texto diz, não pelo que você acha certo no mundo real.
- Desconfie de generalizações ("sempre", "todos", "nunca") quando o texto trouxe só um exemplo.
- Verifique se a paráfrase do item preserva o sentido original ou o distorce sutilmente.
- Rastreie pronomes e referências até a palavra ou ideia exata que eles retomam.

## Treino rápido

**1.** Em textos de prova, um item pode ser considerado incorreto mesmo reproduzindo palavras semelhantes às do texto-base, caso altere a relação lógica original entre as ideias.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** Quando o texto descreve um caso específico, é válido o item que generaliza essa informação para todos os casos semelhantes, desde que use vocabulário coerente com o tema.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Generalizar informação pontual do texto para "todos os casos" é uma das pegadinhas mais clássicas de interpretação.

**3.** O julgamento de um item de interpretação deve considerar exclusivamente o que o texto afirma, ainda que essa afirmação contrarie o conhecimento de mundo do candidato.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** Pronomes como "isso" e "essa" sempre retomam o substantivo mais próximo, independentemente do contexto da frase.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A referência precisa ser identificada pelo contexto, não por uma regra fixa de proximidade.
$md1$, true, 1),

('prf-2021', 'Língua Portuguesa', 'Ortografia Oficial', 'Ortografia Oficial: regras que a banca mais cobra', $md2$
## Mapa do tópico — o que cai e por quê

Ortografia é o tópico mais "decoreba" de Português — e justamente por isso costuma render pontos fáceis para quem revisa as regras certas. A Cebraspe não pede que você decore o dicionário inteiro: ela repete, prova após prova, um conjunto relativamente pequeno de casos clássicos de confusão (porque/por que, mal/mau, uso do X e do S, dígrafos), então o retorno de estudar esse tópico é alto.

## Teoria essencial

O caso mais recorrente de prova é a família **porque / por que / porquê / por quê**. "Porque" (junto, sem acento) introduz explicação ou causa e aparece em resposta a uma pergunta. "Por que" (separado, sem acento) é usado em perguntas diretas ou indiretas, e também quando equivale a "pelo qual/pela qual". "Porquê" (junto, com acento) é substantivo, geralmente precedido de artigo ("o porquê da demissão"). "Por quê" (separado, com acento) aparece no fim de frase ou isolado, geralmente em perguntas.

Outro par clássico é **mal / mau**. "Mal" é advérbio (opõe-se a "bem": "ele se saiu mal na prova") ou substantivo abstrato ("o mal do século"). "Mau" é adjetivo (opõe-se a "bom": "um mau aluno"). O teste rápido é substituir por "bem" (se couber, é "mal") ou por "bom" (se couber, é "mau").

A grafia com **S ou Z** costuma confundir em sufixos de formação de palavras: sufixos como "-ês/-esa" (indicando nacionalidade ou título) usam S ("francês", "marquesa"), enquanto sufixos como "-ez/-eza" (formando substantivos abstratos a partir de adjetivos) usam Z ("acidez", "beleza"). Verbos terminados em "-isar" versus "-izar" também são fonte comum de erro: em geral, quando existe um substantivo correlato terminado em "-ISO", o verbo se escreve com S ("analisar", de "análise"); quando não existe essa relação, o verbo costuma ser com Z ("civilizar", de "civilização").

O uso de **X ou CH** não segue uma regra totalmente previsível, mas há padrões úteis: depois de ditongo, geralmente se usa X ("caixa", "frouxo" — exceto poucas exceções como "recauchutar"), e depois da sílaba inicial "en-", geralmente se usa X quando a palavra não deriva de outra grafada com "ch" ("enxame", mas "encher", que deriva de "cheio").

Os **dígrafos** (dois caracteres representando um único som, como "rr", "ss", "ch", "lh", "nh", "qu", "gu") também aparecem em prova, principalmente para testar se o candidato sabe separar sílabas corretamente sem quebrar o dígrafo.

## Como a Cebraspe cobra este assunto

O padrão típico é apresentar uma frase do texto-base com um desses pares homófonos ou grafias variáveis e perguntar se a grafia empregada está correta, ou pedir a substituição por outra forma mantendo a correção gramatical. É comum também testar se o candidato reconhece o emprego de "porquê" substantivado dentro de um trecho do texto.

## Pegadinhas e palavras-armadilha

- "Porque" (explicação) × "por que" (pergunta) × "porquê" (substantivo) × "por quê" (fim de frase/isolado) — o teste da pergunta funciona bem: se dá pra perguntar "por qual razão?", é "por que" separado.
- "Mal" (advérbio/substantivo abstrato, testa com "bem") × "mau" (adjetivo, testa com "bom").
- Verbo com relação a substantivo em "-ISO" → geralmente S ("pesquisar"/"pesquisa" é exceção clássica a checar com atenção, mas o padrão "analisar/análise" é o mais cobrado).
- Sufixo "-ês/-esa" (nacionalidade/título) com S; "-ez/-eza" (substantivo abstrato) com Z.

## Letra de lei

Base normativa: **Acordo Ortográfico da Língua Portuguesa** e o **Vocabulário Ortográfico da Língua Portuguesa (VOLP)**, referência oficial de grafia adotada em concursos públicos.

## Resumo relâmpago para revisão

- Porque (explica) / Por que (pergunta) / Porquê (substantivo) / Por quê (fim de frase).
- Mal = advérbio ou substantivo abstrato (testa com "bem"); Mau = adjetivo (testa com "bom").
- "-ês/-esa" com S (nacionalidade/título); "-ez/-eza" com Z (substantivo abstrato).
- Verbo ligado a substantivo em "-ISO" tende a S ("analisar"/"análise").

## Treino rápido

**1.** Na frase "Ninguém entendeu o porquê da decisão", o emprego da palavra "porquê" está correto, por se tratar de uso substantivado precedido de artigo.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** A frase "Ele se comportou muito mau durante a reunião" está grafada corretamente, pois "mau" é a forma adequada para modificar o verbo "comportar-se".
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Como o termo modifica o verbo (função de advérbio, testável por "bem"), a forma correta é "mal".

**3.** Substantivos abstratos formados a partir de adjetivos com o sufixo "-eza", como "beleza" e "riqueza", são grafados com Z.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** A expressão "por que" deve ser sempre grafada junto e sem acento quando inicia uma pergunta direta.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Em perguntas diretas ou indiretas, a forma correta é separada ("por que"), não junta ("porque").
$md2$, true, 2),

('prf-2021', 'Língua Portuguesa', 'Acentuação Gráfica', 'Acentuação Gráfica: as regras que decidem a prova', $md3$
## Mapa do tópico — o que cai e por quê

Acentuação é um tópico de regra fechada — ao contrário de interpretação, aqui existe resposta certa objetiva e decorável. A Cebraspe gosta de testar as regras de acentuação das paroxítonas (porque têm mais exceções) e os casos de acento diferencial, que sobreviveram mesmo depois do Acordo Ortográfico eliminar boa parte dos acentos diferenciais antigos.

## Teoria essencial

A classificação da sílaba tônica organiza toda a regra: palavras **oxítonas** (tônica na última sílaba), **paroxítonas** (tônica na penúltima) e **proparoxítonas** (tônica na antepenúltima).

As **proparoxítonas são sempre acentuadas**, sem exceção ("médico", "ônibus", "sábado") — é a regra mais simples e mais segura do tópico.

As **oxítonas** são acentuadas quando terminam em **A, E, O** (seguidas ou não de S), em **EM/ENS** (quando têm mais de uma sílaba) e em **ditongos abertos ÉI, ÉU, ÓI** tônicos ("sofá", "vocês", "avós", "também", "parabéns", "herói", "chapéu"). Monossílabos tônicos terminados em A, E, O (seguidos ou não de S) também seguem essa regra ("pá", "pé", "pó", "más").

As **paroxítonas** são a classe com mais exceções: a regra geral é que **não são acentuadas**, mas há acentuação quando terminam em terminações "menos comuns" para paroxítona — **L, N, R, X, PS, Ã(S), ÃO(S), UM/UNS, I(S), US, DITONGO** ("fácil", "hífen", "caráter", "tórax", "bíceps", "órfã", "órgão", "álbum", "táxi", "vírus", "história"). Terminações comuns de paroxítona como A, E, O, EM, AM **não recebem acento** ("casa", "pele", "carro", "imagem", "andaram").

Os **hiatos** (encontro de duas vogais em sílabas separadas) recebem acento no I e no U tônicos, sozinhos na sílaba ou seguidos de S, quando não formam sílaba com consoante além do S ("saída", "baú", "egoísta"), mas não se acentua quando a vogal seguinte é NH ("rainha") ou quando o I/U é seguido de outra letra que não S formando nova sílaba ("saguão").

O **acento diferencial** sobreviveu ao Acordo Ortográfico apenas em poucos casos específicos — o mais cobrado em prova é **pôde** (passado, pretérito perfeito) versus **pode** (presente), além de "pôr" (verbo) versus "por" (preposição). A maioria dos outros diferenciais antigos ("pára/para", "pêlo/pelo", "pólo/polo") foi eliminada pelo Acordo, e é justamente aí que mora a pegadinha mais comum: a banca testa se o candidato ainda acredita, erroneamente, que essas palavras continuam distinguidas por acento.

## Como a Cebraspe cobra este assunto

O padrão mais comum é apresentar uma palavra do texto-base e perguntar se ela segue a mesma regra de acentuação de outra palavra dada, testando se o candidato sabe classificar corretamente a sílaba tônica e aplicar a regra correspondente. Também é comum testar se o candidato sabe que acentos diferenciais antigos (como em "pára") foram extintos pelo Acordo Ortográfico.

## Pegadinhas e palavras-armadilha

- Proparoxítona: **sempre** acentuada, sem exceção — regra mais segura pra fixar primeiro.
- Paroxítona: só acentua em terminações "raras" (L, N, R, X, PS, ÃO, UM, I, US, ditongo) — as terminações comuns (A, E, O, EM, AM) não levam acento.
- "Pôde" (passado) tem acento; "pode" (presente) não tem — essa é a distinção diferencial mais cobrada hoje.
- Acentos diferenciais antigos como "pára" (verbo) foram **extintos** — hoje "para" não leva acento em nenhuma função.
- Hiato: acento no I/U tônico sozinho na sílaba, exceto antes de NH.

## Letra de lei

Base normativa: **Acordo Ortográfico da Língua Portuguesa**, que reformulou as regras de acentuação (incluindo a extinção do trema e da maior parte dos acentos diferenciais) e é a referência vigente adotada em concursos.

## Resumo relâmpago para revisão

- Proparoxítona: sempre acentuada.
- Oxítona: acentua em A, E, O, EM/ENS, ditongos abertos tônicos (final).
- Paroxítona: acentua só em terminações raras (L, N, R, X, PS, ÃO, UM, I, US, ditongo); não acentua em A, E, O, EM, AM.
- Hiato: acento no I/U tônico isolado na sílaba (exceto antes de NH).
- Diferencial sobrevivente: pôde (passado) × pode (presente). "Pára" não existe mais com acento.

## Treino rápido

**1.** Todas as palavras proparoxítonas da língua portuguesa são acentuadas graficamente, sem exceção.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** A palavra "imagem", por ser paroxítona terminada em "-em", deve receber acento gráfico, assim como ocorre com "hífen".
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Paroxítonas terminadas em "-em" não são acentuadas; "hífen" é acentuada por terminar em "-en", terminação diferente e sujeita a acento.

**3.** Após o Acordo Ortográfico vigente, a forma verbal "para" (terceira pessoa do singular do verbo parar) continua sendo diferenciada da preposição "para" por meio de acento gráfico.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Esse acento diferencial foi extinto; ambas as formas são grafadas "para", sem acento.

**4.** Na frase "Ele não pôde comparecer à reunião", o acento circunflexo em "pôde" está correto, por se tratar da forma no pretérito perfeito, distinta da forma "pode" no presente.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**
$md3$, true, 3),

('prf-2021', 'Língua Portuguesa', 'Classes de Palavras', 'Classes de Palavras: identificação e função na frase', $md4$
## Mapa do tópico — o que cai e por quê

Classes de palavras é a base sobre a qual toda a sintaxe é construída — e a Cebraspe raramente pergunta "isso é substantivo ou verbo?" de forma isolada. O que ela realmente testa é se você reconhece a classe de uma palavra **pelo contexto de uso**, já que muitas palavras mudam de classe dependendo da frase (a mesma palavra "que" pode ser pronome relativo, conjunção ou até substantivo).

## Teoria essencial

As classes variáveis (que flexionam em gênero, número, grau ou pessoa/modo/tempo) são **substantivo, adjetivo, artigo, numeral, pronome e verbo**. As invariáveis são **advérbio, preposição, conjunção e interjeição**.

O ponto mais explorado em prova é o comportamento **camaleônico** de certas palavras conforme o contexto. A palavra "que" é o exemplo mais clássico: pode ser **pronome relativo** (retoma um termo anterior e inicia oração subordinada adjetiva: "o livro que comprei"), **conjunção integrante** (introduz oração subordinada substantiva, sem retomar nada: "espero que ele venha"), **conjunção causal, comparativa ou consecutiva**, dependendo do sentido, ou até **substantivo** quando precedido de artigo ("o quê" isolado, ou "um quê de mistério").

Palavras como "como", "que", "quando" e "onde" também alternam entre função de **advérbio interrogativo/relativo** e **conjunção**, a depender de retomarem ou não um antecedente e de terem ou não valor circunstancial próprio.

Os **pronomes** merecem atenção especial porque têm subclasses com comportamento distinto: pessoais (retos e oblíquos), possessivos, demonstrativos, relativos, indefinidos e interrogativos. A prova costuma testar a **regência e a colocação** desses pronomes tanto quanto a classificação em si (esse ponto se conecta diretamente ao tópico de Regência e ao de Sintaxe).

O **advérbio** é a classe invariável que modifica verbo, adjetivo ou outro advérbio, indicando circunstância (tempo, modo, lugar, intensidade, negação, afirmação, dúvida). A confusão mais comum é classificar como adjetivo uma palavra que, na frase, está modificando um verbo (função adverbial) — por exemplo, "ele fala rápido": aqui "rápido" modifica o verbo "fala", funcionando como advérbio, mesmo tendo forma idêntica ao adjetivo.

As **preposições** essenciais (a, de, em, com, para, por, entre outras) estabelecem relação de subordinação entre termos, e seu domínio é pré-requisito direto para o tópico de Regência — a preposição exigida por um verbo ou nome é justamente o que define se a regência está correta.

## Como a Cebraspe cobra este assunto

O item típico pega uma palavra do texto-base e afirma sua classe gramatical, testando se o candidato reconhece o valor contextual correto (por exemplo, afirmar que um "que" é conjunção integrante quando na verdade é pronome relativo, ou vice-versa). Também é comum pedir a classificação de uma palavra que, na frase específica, exerce função diferente da mais "óbvia" (advérbio com forma de adjetivo, por exemplo).

## Pegadinhas e palavras-armadilha

- "Que" muda de classe conforme retoma (pronome relativo) ou não (conjunção integrante) um termo anterior — sempre teste se dá pra substituir por "o qual/a qual" (se der, é pronome relativo).
- Palavras com forma de adjetivo podem funcionar como advérbio quando modificam verbo, não substantivo ("falar alto", "custar caro").
- "Como", "quando", "onde": podem ser conjunção ou advérbio (relativo/interrogativo) dependendo de retomarem antecedente.
- Classificar uma palavra "pela forma" sem olhar a função na frase é o erro mais comum do tópico.

## Letra de lei

Não se aplica letra de lei específica — o tópico é regido pela gramática normativa da língua portuguesa, conforme consolidada nas gramáticas de referência adotadas em concursos públicos.

## Resumo relâmpago para revisão

- Variáveis: substantivo, adjetivo, artigo, numeral, pronome, verbo. Invariáveis: advérbio, preposição, conjunção, interjeição.
- "Que" muda de classe: pronome relativo (retoma termo, testa com "o qual") x conjunção integrante (não retoma nada).
- Palavra com forma de adjetivo pode ser advérbio se modificar verbo, não substantivo.
- Classifique sempre pela função na frase, nunca só pela forma da palavra isolada.

## Treino rápido

**1.** Na frase "Espero que ele chegue a tempo", a palavra "que" exerce função de pronome relativo, retomando o termo "ele".
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Trata-se de conjunção integrante, pois não retoma nenhum termo anterior; apenas introduz a oração subordinada substantiva objetiva direta.

**2.** Na frase "O produto custou caro demais", a palavra "caro" exerce função adverbial, modificando o verbo "custar".
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**3.** A palavra "que" mantém sempre a mesma classificação gramatical, independentemente do contexto em que é empregada na frase.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** É uma das palavras mais camaleônicas da língua, podendo ser pronome relativo, conjunção integrante, conjunção causal, entre outras funções, conforme o contexto.

**4.** As classes gramaticais consideradas invariáveis, por não sofrerem flexão de gênero, número ou grau, incluem o advérbio, a preposição, a conjunção e a interjeição.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**
$md4$, true, 4),

('prf-2021', 'Língua Portuguesa', 'Sintaxe da Oração e do Período', 'Sintaxe da Oração e do Período: termos e orações', $md5$
## Mapa do tópico — o que cai e por quê

Sintaxe é o tópico mais "estrutural" da disciplina — exige que você enxergue a frase como um esqueleto de funções (sujeito, predicado, complementos) e não apenas como uma sequência de palavras. A Cebraspe adora usar sintaxe para justificar pontuação e concordância, então dominar esse tópico destrava outros também.

## Teoria essencial

Toda oração se organiza em torno de um verbo (ou locução verbal), e os termos se distribuem em **termos essenciais** (sujeito e predicado), **termos integrantes** (complementos que o verbo ou nome exigem: objeto direto, objeto indireto, complemento nominal, agente da passiva) e **termos acessórios** (que apenas acrescentam informação, sem serem exigidos pela regência: adjunto adnominal, adjunto adverbial, aposto, vocativo).

O **sujeito** pode ser simples (um núcleo), composto (mais de um núcleo), oculto/desinencial (identificável pela terminação verbal, mesmo sem estar escrito), indeterminado (quando não se sabe ou não importa quem pratica a ação — verbo na 3ª pessoa do plural sem referente claro, ou verbo transitivo indireto/intransitivo/de ligação na 3ª pessoa do singular com "se" partícula de indeterminação) ou inexistente (oração sem sujeito, com verbos impessoais como "haver" no sentido de existir, ou verbos que indicam fenômenos da natureza).

A distinção entre **objeto direto** (complemento sem preposição obrigatória, ligado a verbo transitivo direto) e **objeto indireto** (complemento preposicionado, ligado a verbo transitivo indireto) é a base para o tópico seguinte de Regência — errar essa distinção compromete a análise de regência inteira.

O **período composto** se forma pela combinação de duas ou mais orações, que podem se relacionar por **coordenação** (orações independentes sintaticamente, uma não é termo da outra — sindéticas, ligadas por conjunção, ou assindéticas, sem conjunção) ou por **subordinação** (uma oração exerce função sintática dentro da outra — substantiva, adjetiva ou adverbial, conforme a função que exerce).

As **orações subordinadas substantivas** exercem função de substantivo dentro do período (sujeito, objeto direto, objeto indireto, predicativo, complemento nominal ou aposto da oração principal). As **orações subordinadas adjetivas** funcionam como adjetivo, geralmente introduzidas por pronome relativo, podendo ser **restritivas** (delimitam o sentido do antecedente, sem vírgula) ou **explicativas** (acrescentam informação sobre todo o antecedente, com vírgula) — essa distinção tem impacto direto na pontuação e no sentido da frase. As **orações subordinadas adverbiais** exercem função de advérbio, indicando circunstância (causa, condição, concessão, tempo, finalidade, entre outras) em relação à oração principal.

## Como a Cebraspe cobra este assunto

A banca costuma pedir a classificação sintática de um termo específico dentro de uma frase do texto-base, ou testar se a mudança de pontuação (inserir ou remover vírgula antes de uma oração adjetiva, por exemplo) altera o sentido da frase — especialmente na diferença entre restritiva e explicativa.

## Pegadinhas e palavras-armadilha

- Objeto direto (sem preposição obrigatória) × objeto indireto (com preposição exigida pelo verbo) — a preposição é a chave da distinção.
- Oração adjetiva restritiva (sem vírgula, delimita sentido) × explicativa (com vírgula, generaliza sobre todo o antecedente) — a presença da vírgula muda o sentido da frase inteira.
- Sujeito indeterminado ≠ oração sem sujeito: o primeiro existe mas não é identificado; o segundo simplesmente não tem sujeito (verbos impessoais).
- "Haver" no sentido de existir é impessoal (sem sujeito); "existir", nesse mesmo sentido, tem sujeito normal e concorda com ele.

## Letra de lei

Não se aplica letra de lei específica — o tópico é regido pela gramática normativa e pela nomenclatura gramatical de referência adotada em concursos públicos.

## Resumo relâmpago para revisão

- Termos essenciais: sujeito e predicado. Integrantes: complementos exigidos (OD, OI, complemento nominal, agente da passiva). Acessórios: adjunto adnominal, adjunto adverbial, aposto, vocativo.
- Objeto direto sem preposição obrigatória; objeto indireto com preposição exigida.
- Coordenação: orações independentes. Subordinação: uma oração é termo sintático da outra (substantiva, adjetiva ou adverbial).
- Adjetiva restritiva (sem vírgula) x explicativa (com vírgula) — muda o sentido.
- "Haver" (existir) é impessoal, sem sujeito; "existir" tem sujeito normal.

## Treino rápido

**1.** Na frase "Os candidatos, que estudaram bastante, foram aprovados", a oração adjetiva entre vírgulas tem valor explicativo, informando que todos os candidatos mencionados estudaram bastante.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** A ausência de vírgula antes de uma oração subordinada adjetiva iniciada por "que" nunca altera o sentido da frase em relação à mesma oração separada por vírgula.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A presença ou ausência de vírgula distingue oração restritiva de explicativa, alterando diretamente o sentido da frase.

**3.** Na frase "Havia muitos candidatos na sala de espera", o verbo "havia" é impessoal, e a oração não possui sujeito.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** Todo complemento verbal precedido de preposição classifica-se necessariamente como objeto direto, desde que o verbo seja transitivo.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Complemento preposicionado ligado a verbo transitivo indireto é objeto indireto, não objeto direto — a presença de preposição exigida pelo verbo é justamente o traço que caracteriza o objeto indireto.
$md5$, true, 5),

('prf-2021', 'Língua Portuguesa', 'Concordância Verbal e Nominal', 'Concordância Verbal e Nominal: casos que a banca mais cobra', $md6$
## Mapa do tópico — o que cai e por quê

Concordância é um dos tópicos com maior retorno de estudo em prova de carreira policial, porque a Cebraspe repete um conjunto relativamente previsível de casos especiais — sujeito composto, expressões partitivas, verbos impessoais, "mais de um" — ano após ano. Dominar esses casos específicos vale mais do que revisar a regra geral (que a maioria dos candidatos já sabe de cor).

## Teoria essencial

A regra geral de **concordância verbal** é que o verbo concorda em número e pessoa com o sujeito. O desafio aparece nos casos especiais. Com **sujeito composto anteposto ao verbo**, o verbo vai para o plural ("O aluno e o professor chegaram"). Quando o sujeito composto vem **depois** do verbo, admite-se tanto o plural quanto a concordância com o núcleo mais próximo, embora a norma culta prefira o plural em contextos formais de prova.

A expressão **"mais de um"** seguida de substantivo no singular exige verbo no **singular** ("Mais de um candidato faltou à prova"), exceto quando a ideia é de reciprocidade, situação em que o verbo vai para o plural ("Mais de um deputado se cumprimentaram").

Expressões **partitivas e coletivas** ("a maioria de", "grande parte de", "a maior parte de") seguidas de substantivo no plural admitem tanto a concordância com o núcleo da expressão (singular) quanto com o termo no plural que a segue — a banca costuma aceitar as duas formas, mas testa se o candidato reconhece que ambas são válidas (o erro típico é achar que só uma das duas está certa).

Verbos que indicam **fenômenos da natureza** ("chover", "nevar", "amanhecer") são impessoais quando empregados em sentido próprio, ficando sempre na 3ª pessoa do singular, sem sujeito. O verbo **"haver"** no sentido de **existir** também é impessoal e fica sempre no singular ("Havia muitos problemas" — nunca "Haviam"); já o verbo **"existir"**, sinônimo nesse contexto, é pessoal e concorda normalmente com o sujeito ("Existiam muitos problemas").

Na **concordância nominal**, o ponto mais cobrado é o adjetivo **"anexo"** (e similares como "incluso", "obrigado", "próprio"), que concorda em gênero e número com o substantivo a que se refere, mesmo quando funciona como uma espécie de advérbio na frase ("Seguem anexos os documentos", "A ata segue anexa ao processo").

Também é cobrado o caso de **um adjetivo qualificando dois ou mais substantivos**: se o adjetivo vem depois dos substantivos, vai para o plural (concordando com todos, geralmente no masculino se houver gêneros diferentes); se vem antes, pode concordar só com o substantivo mais próximo ("Comprou terno e gravata novos" ou "novo terno e gravata").

## Como a Cebraspe cobra este assunto

O padrão típico é apresentar uma frase do texto-base (ou uma reescrita dela) contendo um dos casos especiais e perguntar se a concordância está correta — especialmente "mais de um" no singular, "haver" impessoal, e a flexão de "anexo".

## Pegadinhas e palavras-armadilha

- "Mais de um" + substantivo singular → verbo no **singular** (exceto reciprocidade).
- "Haver" (existir) é impessoal, **sempre singular** — "Haviam muitos" está errado; o certo é "Havia muitos".
- "Anexo" concorda em gênero e número com o substantivo, mesmo em contexto que parece advérbio ("documentos anexos", nunca "documentos anexo").
- Expressões partitivas ("a maioria de + plural") aceitam concordância no singular OU no plural — não existe "só uma" resposta certa aqui, a banca testa se você sabe que ambas são válidas.

## Letra de lei

Não se aplica letra de lei específica — o tópico é regido pela gramática normativa da língua portuguesa conforme consolidada nas gramáticas de referência adotadas em concursos públicos.

## Resumo relâmpago para revisão

- "Mais de um" + singular → verbo singular (exceto reciprocidade).
- "Haver" (existir) impessoal → sempre singular ("havia", nunca "haviam").
- "Existir" (mesmo sentido) → pessoal, concorda normalmente com o sujeito.
- "Anexo" concorda em gênero/número com o substantivo, sempre.
- Partitivas + plural: aceita singular ou plural, ambos corretos.

## Treino rápido

**1.** A frase "Haviam muitos documentos anexos ao processo" está corretamente escrita, tanto na concordância verbal quanto na nominal.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** "Haver" no sentido de existir é impessoal e deve permanecer no singular: "Havia muitos documentos anexos ao processo".

**2.** Na frase "Mais de um servidor faltou à reunião", a concordância verbal no singular está de acordo com a norma culta.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**3.** A expressão "a maioria dos policiais aprovou a medida" admite, segundo a norma culta, a forma alternativa "a maioria dos policiais aprovaram a medida", sendo ambas corretas.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** O adjetivo "anexo", por funcionar como advérbio em determinados contextos, deve permanecer invariável, independentemente do gênero e número do substantivo a que se refere.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** "Anexo" é adjetivo e sempre concorda em gênero e número com o substantivo, mesmo em contextos que lembram uso adverbial.
$md6$, true, 6),

('prf-2021', 'Língua Portuguesa', 'Regência', 'Regência Verbal e Nominal: a preposição certa', $md7$
## Mapa do tópico — o que cai e por quê

Regência é onde a Cebraspe testa se você conhece a preposição exigida por verbos e nomes específicos — e o ponto mais cobrado, disparado, é o uso do acento grave indicando **crase**, que depende diretamente de regência (o verbo ou nome precisa exigir a preposição "a" para que a crase seja sequer possível). Sem entender regência, é impossível acertar crase de forma consistente.

## Teoria essencial

A **regência verbal** trata da relação entre o verbo e seus complementos: verbos transitivos diretos não exigem preposição ("Encontrei o relatório"), verbos transitivos indiretos exigem preposição específica ("Obedeço às normas" — regência de "obedecer" pede "a"), e alguns verbos são transitivos diretos e indiretos ao mesmo tempo, com dois complementos ("Informei o chefe do ocorrido" ou "Informei o ocorrido ao chefe").

Um grupo de verbos merece atenção redobrada por mudar de sentido conforme a regência. **"Assistir"**, no sentido de "ver, presenciar", é transitivo indireto e pede a preposição "a" ("assisti ao jogo"); no sentido de "prestar assistência, ajudar", é transitivo direto ("o médico assistiu o paciente"); no sentido de "morar", é intransitivo com "em" ("assiste em Brasília"). **"Visar"**, no sentido de "ter como objetivo", pede a preposição "a" quando seguido de infinitivo ("visa a melhorar o atendimento"), mas é transitivo direto no sentido de "mirar" ou "dar visto em documento" ("visou o passaporte"). **"Chegar"** e **"ir"**, indicando destino, pedem a preposição "a" (não "em"): "chegar a São Paulo", não "chegar em São Paulo" — esse é um dos desvios mais comuns da fala cotidiana que a norma culta rejeita.

A **regência nominal** trata da preposição exigida por substantivos, adjetivos e advérbios: "obediente **a**", "capaz **de**", "favorável **a**", "necessário **a/de**", cada nome tendo sua própria exigência, muitas vezes ligada ao verbo de mesma raiz (quem é "obediente a" também "obedece a").

A **crase** é a fusão da preposição "a" com o artigo feminino "a(s)", representada pelo acento grave (à). Para haver crase, é preciso que **simultaneamente**: o termo regente exija a preposição "a" (regência) **e** o termo regido admita o artigo "a" (normalmente substantivo feminino determinado). Por isso, não se usa crase antes de palavra masculina, antes de verbo, antes da maioria dos pronomes pessoais e demonstrativos que não admitem artigo, nem quando o verbo/nome regente não exige a preposição "a". Já é obrigatória em expressões de tempo determinadas ("às 14 horas"), locuções adverbiais femininas de instrumento/modo/causa ("às pressas", "à mão") e diante de nomes de lugares femininos que admitem artigo.

## Como a Cebraspe cobra este assunto

O item clássico pede para julgar se determinado emprego de crase (ou de preposição) está correto numa frase extraída ou baseada no texto, geralmente envolvendo um verbo de regência variável (assistir, visar, aspirar, obedecer, chegar) ou uma expressão de lugar/tempo.

## Pegadinhas e palavras-armadilha

- "Assistir" muda de regência conforme o sentido: ver/presenciar (a), ajudar (direto, sem preposição), morar (em).
- "Chegar a" e "ir a" (destino) — nunca "chegar em"/"ir em" na norma culta cobrada em prova.
- Crase exige a preposição "a" (regência) **e** o artigo "a" (palavra feminina determinada) ao mesmo tempo — falta de qualquer um dos dois impede a crase.
- Não existe crase antes de palavra masculina, verbo, ou pronome que não admite artigo (isso inclui a maioria dos pronomes demonstrativos e pessoais).

## Letra de lei

Não se aplica letra de lei específica — o tópico é regido pela gramática normativa da língua portuguesa, com a crase regulada pelas regras de fusão da preposição "a" com o artigo "a(s)" consolidadas nas gramáticas de referência.

## Resumo relâmpago para revisão

- Regência = preposição exigida pelo verbo/nome; crase só existe quando o regente exige "a" e o regido admite artigo "a".
- "Assistir": ver (a) / ajudar (direto) / morar (em).
- "Chegar a", "ir a" (não "em") — regra de destino na norma culta.
- Crase obrigatória: horas determinadas, locuções adverbiais femininas de instrumento/modo, lugares femininos que admitem artigo.
- Nunca crase antes de palavra masculina ou verbo.

## Treino rápido

**1.** Na frase "Assisti ao documentário sobre o trânsito brasileiro", o emprego da preposição "a" está correto, pois o verbo "assistir" no sentido de "ver, presenciar" é transitivo indireto.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** A frase "O policial chegou em São Paulo na manhã seguinte" está de acordo com a norma culta da língua portuguesa quanto à regência do verbo "chegar".
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A norma culta exige a preposição "a" para indicar destino com o verbo "chegar": "chegou a São Paulo".

**3.** O uso da crase é sempre determinado exclusivamente pela presença de um substantivo feminino após a preposição, independentemente da regência do termo anterior.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A crase exige simultaneamente que o termo regente exija a preposição "a" e que o termo regido admita o artigo "a" — não basta apenas o substantivo ser feminino.

**4.** Na frase "O projeto visa a reduzir os acidentes de trânsito", o emprego da preposição "a" antes do infinitivo está de acordo com a regência do verbo "visar" no sentido de "ter como objetivo".
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**
$md7$, true, 7),

('prf-2021', 'Língua Portuguesa', 'Pontuação', 'Pontuação: a vírgula e seus efeitos de sentido', $md8$
## Mapa do tópico — o que cai e por quê

Pontuação raramente é cobrada de forma isolada e "decoreba" — a Cebraspe prefere testar se você entende que a pontuação **carrega sentido**, ou seja, que inserir ou remover uma vírgula pode mudar completamente o que a frase comunica. É por isso que pontuação conversa tão diretamente com sintaxe: para pontuar bem, você precisa primeiro reconhecer a função de cada termo na frase.

## Teoria essencial

A vírgula, sinal mais versátil e mais cobrado da pontuação, tem um conjunto de empregos bem definidos. Ela separa **termos coordenados de mesma função sintática** (itens de uma enumeração: "Comprei arroz, feijão e carne"), separa o **aposto explicativo** ("Brasília, capital do Brasil, foi inaugurada em 1960"), isola o **vocativo** ("Cuidado, motorista!"), marca a **elipse do verbo** ("Eu gosto de café; ela, de chá") e separa **orações coordenadas assindéticas** (sem conjunção) ou **sindéticas** com determinadas conjunções (adversativas como "mas", por exemplo, sempre pedem vírgula antes).

O uso mais testado em prova é a vírgula em relação à **ordem dos termos na oração**. Quando um **adjunto adverbial** é deslocado para o início da frase (fora de sua posição natural, que é depois do verbo), o uso da vírgula é facultativo se o adjunto for curto, mas passa a ser recomendado (e cobrado como correto) quando o adjunto é longo, para marcar a pausa e facilitar a leitura. Já entre **sujeito e verbo**, e entre **verbo e complemento** (objeto direto ou indireto), a regra é clara e cobrada com frequência: **não se separa por vírgula**, salvo se houver um termo intercalado entre eles (que aí exige duas vírgulas, uma antes e outra depois do termo intercalado) — colocar uma única vírgula isolando sujeito do verbo é um dos erros mais clássicos de prova, e a Cebraspe adora testar exatamente esse ponto.

Já discutido no tópico de sintaxe, a vírgula também é o que distingue a oração adjetiva **restritiva** (sem vírgula, delimita o sentido do antecedente) da **explicativa** (com vírgula, generaliza a informação para todo o antecedente) — e isso não é só uma questão de estilo, muda o significado real da frase.

O **ponto e vírgula** é usado para separar itens de uma enumeração mais complexa (quando os itens já contêm vírgula interna), para separar orações coordenadas de sentido mais distante entre si, e em enumerações de incisos legais e regulamentares.

Os **dois pontos** introduzem uma explicação, uma citação, uma enumeração ou a fala em discurso direto, sempre anunciando algo que vem detalhar ou esclarecer o que foi dito antes.

## Como a Cebraspe cobra este assunto

O padrão típico apresenta uma frase (geralmente do texto-base) com determinada pontuação e pergunta se a reescrita, inserindo ou removendo uma vírgula, mantém a correção gramatical e o mesmo sentido — testando principalmente a regra de não separar sujeito de verbo, e a distinção entre restritiva e explicativa.

## Pegadinhas e palavras-armadilha

- **Nunca** separar sujeito de verbo, ou verbo de complemento, por vírgula — exceto quando há termo intercalado (aí são duas vírgulas, não uma).
- Adjunto adverbial deslocado para o início: vírgula facultativa se curto, recomendada se longo — não existe regra "sempre obrigatória" aqui.
- Oração adjetiva restritiva (sem vírgula) x explicativa (com vírgula) — muda o sentido, não é só estilo.
- Conjunção adversativa ("mas") sempre pede vírgula antes dela.

## Letra de lei

Não se aplica letra de lei específica — o tópico é regido pela gramática normativa da língua portuguesa conforme consolidada nas gramáticas de referência adotadas em concursos públicos.

## Resumo relâmpago para revisão

- Vírgula nunca separa sujeito-verbo ou verbo-complemento (salvo termo intercalado, com duas vírgulas).
- Aposto explicativo e vocativo sempre isolados por vírgula.
- Restritiva (sem vírgula) x explicativa (com vírgula) — sentidos diferentes.
- Adjunto adverbial deslocado: vírgula facultativa (curto) ou recomendada (longo).
- Ponto e vírgula: enumerações complexas ou itens já com vírgula interna.

## Treino rápido

**1.** Na frase "O candidato, que estudou muito, foi aprovado", a vírgula isola uma oração adjetiva restritiva, delimitando o sentido de "candidato".
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** O uso da vírgula caracteriza oração adjetiva explicativa, não restritiva; a restritiva não admite vírgula.

**2.** A frase "Os policiais, apreenderam o veículo irregular" está corretamente pontuada, pois a vírgula marca a separação natural entre sujeito e verbo.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Não se separa sujeito de verbo por vírgula; a forma correta é sem vírgula: "Os policiais apreenderam o veículo irregular".

**3.** Quando um adjunto adverbial extenso é deslocado para o início da oração, o uso da vírgula após ele é recomendado para marcar a pausa e facilitar a leitura.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** Havendo um termo intercalado entre o sujeito e o verbo da oração, é correto o uso de vírgulas antes e depois desse termo.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**
$md8$, true, 8),

('prf-2021', 'Língua Portuguesa', 'Redação Oficial', 'Redação Oficial: princípios e padrão do Manual da Presidência', $md9$
## Mapa do tópico — o que cai e por quê

Redação Oficial é um tópico de "regras institucionais" — não é gramática pura, é o conjunto de princípios que regem como a Administração Pública se comunica por escrito, oficializado pelo Manual de Redação da Presidência da República. Para a PRF, esse conhecimento tem aplicação prática direta: o servidor vai redigir ofícios, memorandos e relatórios ao longo de toda a carreira.

## Teoria essencial

O Manual de Redação da Presidência da República estabelece um conjunto de **atributos** que todo texto oficial deve ter, e a prova testa justamente se o candidato reconhece cada um deles pelo nome e pela definição correta. A **impessoalidade** significa que o texto oficial não expressa opiniões pessoais de quem o redige, mas a posição do órgão que representa — daí a ausência de marcas de primeira pessoa subjetiva e a predominância da terceira pessoa ou de construções na voz passiva/impessoal.

A **clareza** exige que o texto seja compreendido em uma única leitura, sem margem a interpretações dúbias, o que implica evitar frases muito longas, ambiguidades e jargão desnecessário. A **concisão** é o princípio de transmitir o máximo de informação com o mínimo de palavras necessárias — não se confunde com texto incompleto, mas com ausência de redundância e de rodeios.

A **formalidade** e a **padronização** dizem respeito ao tratamento uniforme dispensado aos destinatários (uso de pronomes de tratamento adequados ao cargo, como "Vossa Excelência" para autoridades de determinado nível hierárquico, ou "Vossa Senhoria" para outros casos) e à observância de diagramação e estrutura padronizadas para cada tipo de documento. A **uniformidade** garante que documentos do mesmo tipo, produzidos por órgãos diferentes da Administração, sigam o mesmo padrão redacional, facilitando a tramitação e a compreensão em toda a máquina pública.

Entre os principais **tipos de expediente** tratados pelo Manual estão o **ofício** (comunicação externa entre órgãos ou com particulares, de caráter formal), o **memorando** (comunicação interna, geralmente entre unidades de um mesmo órgão, com trâmite mais ágil e menos formal que o ofício) e a **exposição de motivos** (documento dirigido a autoridade superior para informar sobre determinado assunto ou propor alguma medida). Cada um desses documentos segue estrutura própria (cabeçalho, vocativo, corpo do texto, fecho), mas todos compartilham os mesmos princípios de impessoalidade, clareza, concisão e formalidade.

Um ponto frequentemente testado é a diferença entre o **fecho** usado para autoridades de escalão superior (como Chefes de Poder) e o usado para as demais autoridades — o Manual padronizou fórmulas de fechamento mais simples do que as tradicionais "Respeitosamente" e "Atenciosamente" costumavam variar em versões antigas, e a prova gosta de testar se o candidato conhece a versão vigente.

## Como a Cebraspe cobra este assunto

O item típico apresenta a definição de um dos princípios (impessoalidade, clareza, concisão, formalidade) e pergunta se o nome atribuído está correto, ou apresenta um trecho de documento oficial (real ou fictício) e pede para identificar se ele respeita ou viola algum desses princípios — por exemplo, um trecho redigido em primeira pessoa e tom pessoal, que violaria a impessoalidade.

## Pegadinhas e palavras-armadilha

- Impessoalidade ≠ ausência de posicionamento do órgão — o texto expressa a posição institucional, não a opinião pessoal de quem assina.
- Concisão ≠ texto incompleto ou telegráfico — é ausência de redundância, mantendo toda a informação necessária.
- Ofício (comunicação externa) x Memorando (comunicação interna) — não confundir a finalidade de cada tipo de expediente.
- O padrão atual de fecho é mais simples do que fórmulas antigas — desconfie de item que descreve fórmulas de tratamento excessivamente rebuscadas como sendo o padrão vigente.

## Letra de lei

Base normativa: **Manual de Redação da Presidência da República** (edição vigente), documento oficial que padroniza a comunicação escrita da Administração Pública Federal.

## Resumo relâmpago para revisão

- Princípios centrais: impessoalidade, clareza, concisão, formalidade, padronização, uniformidade.
- Impessoalidade: posição do órgão, não opinião pessoal de quem redige.
- Concisão: máximo de informação com o mínimo de palavras, sem redundância — não é texto incompleto.
- Ofício = comunicação externa; Memorando = comunicação interna.
- Fechos padronizados são mais simples do que fórmulas tradicionais antigas.

## Treino rápido

**1.** A impessoalidade na redação oficial significa que o texto deve evitar qualquer tipo de posicionamento, inclusive institucional, restringindo-se à mera descrição de fatos.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A impessoalidade veda a opinião pessoal de quem redige, mas não impede que o texto expresse a posição institucional do órgão.

**2.** O memorando é o expediente adequado para a comunicação formal entre um órgão público e um particular externo à Administração.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** O memorando é destinado à comunicação interna, entre unidades administrativas; a comunicação externa formal é feita, em regra, por ofício.

**3.** A concisão em redação oficial é atingida transmitindo-se o máximo de informação necessária com o mínimo de palavras, sem prejuízo da clareza e da completude do conteúdo.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** O Manual de Redação da Presidência da República padronizou o uso de fórmulas de fecho mais simples do que as tradicionalmente empregadas em versões anteriores da redação oficial.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**
$md9$, true, 9);
