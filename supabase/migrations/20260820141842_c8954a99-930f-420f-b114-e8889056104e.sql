
-- 1) Publicar a aula anterior
UPDATE public.knowledge_docs
SET status = 'publicado', publicado = true, updated_at = now()
WHERE id = 'f5c83eb9-aef4-4cb3-83e5-a5e49a6b7083';

-- 2) Inserir a Aula 01 completa (Introdução ao Direito Administrativo)
INSERT INTO public.knowledge_docs (course_slug, disciplina, topico, titulo, conteudo, publicado, status, ordem)
VALUES (
  'prf-2021',
  'Direito Administrativo',
  'Introdução ao Direito Administrativo',
  'Introdução ao Direito Administrativo: conceito, fontes, Estado, Governo, Administração Pública e sistemas administrativos — aula completa',
  $aula01$
## Mapa do tópico — o que cai e por quê

Esta é a aula de fundação de todo o Direito Administrativo. Nenhum outro tema da disciplina se sustenta sem ela: quando você estudar ato administrativo, poderes administrativos, licitação ou responsabilidade civil do Estado, estará apenas aplicando, em situações específicas, as ideias que fixamos aqui.

Na prova da PRF (Cebraspe), a introdução costuma aparecer em três formatos:

1. **Conceito e critérios do Direito Administrativo** — itens curtos que trocam o nome de um critério pelo conteúdo de outro (é o erro clássico: dizer que o critério do serviço público foi adotado majoritariamente no Brasil).
2. **Estado, Governo e Administração Pública** — o examinador embaralha os sentidos (subjetivo x objetivo, amplo x estrito) e espera que o candidato confunda "quem executa" com "o que é executado".
3. **Fontes e sistemas administrativos** — aqui a pegadinha quase sempre está em afirmar que o Brasil adotou o contencioso administrativo (sistema francês) ou que a decisão administrativa faz coisa julgada.

Guarde desde já a régua de correção mental para esta aula:

- Direito Administrativo é **ramo do direito público interno**, **não codificado**, que estuda a **função administrativa** e os órgãos, entidades e agentes que a exercem.
- O Brasil adotou o **sistema inglês** (unicidade de jurisdição / jurisdição una).
- **Administração Pública** em sentido subjetivo responde "**quem**"; em sentido objetivo, "**o que**".

---

## 1. O que é Direito Administrativo

### 1.1 Direito público interno

A primeira classificação que a banca cobra é simples, mas rende itens: o Direito Administrativo é ramo do **direito público**, porque disciplina relações em que o Estado atua **na qualidade de Estado**, com prerrogativas que o particular não tem. E é **interno**, porque cuida das relações dentro do ordenamento nacional — as relações entre Estados soberanos são objeto do Direito Internacional Público.

Isso não significa que a Administração jamais se submeta a normas de direito privado. Quando o Estado loca um imóvel, emite um cheque ou atua por meio de uma empresa pública que explora atividade econômica, aplicam-se regras civis e empresariais, **parcialmente derrogadas** por normas públicas. Guarde a expressão: o direito privado incide sobre a Administração de forma **parcialmente derrogada pelo direito público** — nunca de forma pura.

### 1.2 O problema do conceito: por que existem tantos critérios

Não há definição legal de Direito Administrativo. A doutrina construiu, ao longo do tempo, diferentes **critérios** (ou escolas) para delimitar o que pertence à disciplina. A prova não exige que você concorde com nenhum; exige que você reconheça cada um pelo nome e saiba qual prevalece no Brasil.

**a) Critério legalista (exegético, empírico ou francês)**
Reduz o Direito Administrativo ao conjunto de leis administrativas existentes em determinado momento. É o critério mais pobre: confunde a **ciência** com o seu **objeto de estudo**. Se o Direito Administrativo fosse só a lei, bastaria ler o Diário Oficial. Está superado.

**b) Critério do Poder Executivo**
Define o Direito Administrativo como o direito que rege o Poder Executivo. Falha por dois lados: **de menos**, porque ignora que Legislativo e Judiciário também praticam função administrativa (quando nomeiam servidores, licitam, aplicam sanções disciplinares); e **de mais**, porque o Executivo também exerce funções atípicas legislativas (medida provisória) e julgadoras em sentido impróprio.

**c) Critério do serviço público**
Nascido na Escola de Bordeaux (Duguit, Jèze), toma o serviço público como núcleo da disciplina. Em sentido **amplo**, alcançaria toda a atividade estatal — inclusive legislar e julgar —, o que é excessivo; em sentido **estrito**, alcançaria apenas prestações materiais ao usuário, o que deixa de fora poder de polícia, fomento e intervenção. Insuficiente nas duas versões.

**d) Critério das relações jurídicas**
Direito Administrativo seria o conjunto de normas que regem as relações entre Administração e administrados. É verdadeiro, mas incompleto: existem normas puramente **internas** (organização de órgãos, hierarquia, competências) que não envolvem nenhum particular e nem por isso deixam de ser administrativas.

**e) Critério teleológico (finalístico)**
Define a disciplina como o sistema de princípios e regras que disciplina a **concretização dos fins do Estado**. Aponta na direção certa (a finalidade pública), mas é vago demais para servir sozinho.

**f) Critério negativista (ou residual)**
Direito Administrativo seria tudo o que **sobra** da atividade estatal depois de retiradas a função legislativa e a função jurisdicional. Também exclui a atividade estatal regida pelo direito privado. É um critério de eliminação: define pelo que a disciplina **não** é.

**g) Critério da Administração Pública (Hely Lopes Meirelles) — o prevalecente**
Direito Administrativo é o **conjunto harmônico de princípios jurídicos que regem os órgãos, os agentes e as atividades públicas tendentes a realizar concreta, direta e imediatamente os fins desejados pelo Estado**. É a fórmula mais cobrada em prova, e você deve reconhecê-la pelos três advérbios: **concreta**, **direta** e **imediata**.

> **Alerta de banca.** Sempre que um item disser que o Direito Administrativo realiza os fins do Estado de modo *abstrato*, *indireto* ou *mediato*, o item está errado. Abstrata e geral é a **função legislativa**; indireta e mediata (porque depende de provocação) é a **função jurisdicional**.

### 1.3 Objeto de estudo

O objeto do Direito Administrativo é a **função administrativa**, onde quer que ela seja exercida. Logo, o objeto compreende:

- os **órgãos e entidades** que integram a Administração Direta e Indireta;
- os **agentes públicos** que atuam em nome do Estado;
- as **atividades administrativas** propriamente ditas (atos, contratos, poderes, serviços, polícia administrativa, fomento, intervenção na propriedade);
- os **bens públicos** afetados a essas atividades;
- os mecanismos de **controle** dessa atuação.

E não compreende: a atividade legislativa típica, a atividade jurisdicional típica e a atividade de governo em sentido político (atos de governo, também chamados atos políticos), que orbitam o Direito Constitucional.

---

## 2. Estado: elementos, poderes e funções

### 2.1 Os três elementos

O Estado é **pessoa jurídica de direito público** dotada de soberania, formada por três elementos indissociáveis:

- **Povo** — o componente humano, o conjunto de pessoas vinculadas ao Estado pelo vínculo da nacionalidade (não confundir com "população", que é dado demográfico, nem com "cidadãos", que é recorte político).
- **Território** — a base física sobre a qual o Estado exerce sua soberania.
- **Governo soberano** — o poder político capaz de se autodeterminar internamente e de se relacionar em pé de igualdade no plano externo.

No Brasil, a **República Federativa do Brasil** é a pessoa jurídica soberana. União, Estados, Distrito Federal e Municípios são pessoas jurídicas de direito público **autônomas** — têm autonomia (capacidade de autogoverno, auto-organização, autoadministração e autolegislação nos limites da Constituição), mas **não soberania**. A soberania pertence à República como um todo.

> **Detalhe que cai.** A União não é o Estado brasileiro; é ente federativo interno. Quem representa o Brasil nas relações internacionais é a República Federativa do Brasil, atuando por meio da União (CF, art. 21, I).

### 2.2 Formas de Estado, formas de governo, sistemas de governo

Três eixos diferentes que o examinador adora misturar:

| Eixo | Pergunta que responde | Opções | Brasil |
|---|---|---|---|
| **Forma de Estado** | Como o poder se distribui no território? | Unitário / Federado (composto) | Federação |
| **Forma de governo** | Como se dá o acesso ao poder e a relação governante–governado? | República / Monarquia | República |
| **Sistema de governo** | Como se relacionam Executivo e Legislativo? | Presidencialismo / Parlamentarismo | Presidencialismo |

**Estado unitário x federado.** No unitário há um único centro de poder político (podendo haver descentralização meramente administrativa); no federado há repartição constitucional de competências entre entes autônomos, com indissolubilidade do vínculo (CF, art. 1º e art. 18).

**República x Monarquia.** A república caracteriza-se por **eletividade**, **temporariedade** dos mandatos e **responsabilidade** do governante (dever de prestar contas). A monarquia, por **hereditariedade**, **vitaliciedade** e, classicamente, **irresponsabilidade** do monarca.

**Presidencialismo x Parlamentarismo.**

| Aspecto | Presidencialismo | Parlamentarismo |
|---|---|---|
| Chefia | Chefe de Estado e de Governo concentrados no Presidente | Chefias separadas: Chefe de Estado (monarca ou presidente) e Chefe de Governo (primeiro-ministro) |
| Independência entre Poderes | Rígida | Colaboração intensa entre Executivo e Legislativo |
| Mandato | Fixo | Depende da confiança do parlamento; o gabinete pode cair |
| Dissolução do parlamento | Não existe | Pode ocorrer, com convocação de novas eleições |

### 2.3 Poderes e funções do Estado

Poder estatal é **uno e indivisível**; o que se reparte é o **exercício** das funções (Montesquieu, na versão adotada pela CF/88, art. 2º: Legislativo, Executivo e Judiciário, independentes e harmônicos).

Cada Poder tem funções **típicas** (as que justificam sua existência) e **atípicas** (exercidas em caráter acessório):

| Poder | Função típica | Funções atípicas |
|---|---|---|
| Legislativo | Legislar e fiscalizar (controle externo, com auxílio dos Tribunais de Contas) | Administrar (nomear servidores, licitar) e julgar (Senado, no impeachment — CF, art. 52, I e II) |
| Executivo | Administrar (função administrativa) | Legislar (medida provisória, lei delegada) e julgar em sentido impróprio (processo administrativo disciplinar, contencioso tributário) |
| Judiciário | Julgar com definitividade | Administrar (concursos, contratos, gestão de pessoal) e legislar em sentido impróprio (regimentos internos) |

**Observação estrutural:** os Municípios **não possuem Poder Judiciário** em sua estrutura; possuem Executivo e Legislativo. O Distrito Federal tem Executivo e Legislativo próprios, mas o Judiciário e o Ministério Público do DF são organizados e mantidos pela União (CF, art. 21, XIII).

### 2.4 Caracterizando a função administrativa

A função administrativa distingue-se das demais por quatro marcas:

1. **Concretude** — atua sobre casos concretos, individualizando comandos legais (a função legislativa produz normas gerais e abstratas, inovando originariamente no ordenamento).
2. **Imediatidade / direção** — persegue os fins estatais de modo direto e imediato, sem depender de provocação (a função jurisdicional é **inerte**: depende de provocação — princípio da inércia).
3. **Subordinação à lei** — é infralegal: só pode fazer o que a lei autoriza (legalidade estrita).
4. **Revisibilidade** — os atos administrativos **não fazem coisa julgada material**; são sempre revisíveis pelo Judiciário quanto à legalidade e à juridicidade. A definitividade é atributo da função jurisdicional.

> **Exemplo prático.** O Congresso aprova a lei que cria um programa de fiscalização de rodovias (função legislativa: geral e abstrata). O Executivo edita o decreto regulamentador, contrata, nomeia policiais, define os pontos de fiscalização e autua condutores (função administrativa: concreta e direta). Um condutor autuado vai ao Judiciário e obtém decisão definitiva sobre a legalidade da multa (função jurisdicional: provocada e definitiva).

Como todos os Poderes praticam função administrativa em algum grau, o Direito Administrativo alcança os três — e é por isso que o critério do Poder Executivo é insuficiente.

---

## 3. Governo

**Governo** é o conjunto de órgãos e agentes incumbidos da **condução política** dos negócios públicos, definindo diretrizes e estabelecendo objetivos. Hely Lopes Meirelles fala em atividade **política e discricionária**, exercida mediante atos de **soberania** ou, ao menos, de **autonomia política**.

Sentidos da expressão:

- **Formal (orgânico)** — o conjunto de Poderes e órgãos constitucionais responsáveis pela direção do Estado.
- **Material (funcional)** — o complexo de funções estatais básicas.
- **Operacional** — a condução política concreta dos negócios públicos.

**Atos de governo (atos políticos).** São manifestações de alto grau de discricionariedade política, praticadas com fundamento direto na Constituição: sanção e veto, declaração de guerra e celebração de paz, decretação de estado de defesa e de sítio, nomeação de Ministros, indulto, iniciativa de leis. Não se confundem com atos administrativos comuns e, em regra, **não se sujeitam a controle judicial de mérito** — o Judiciário pode examinar apenas a compatibilidade formal e os limites constitucionais, jamais a conveniência política.

**Governo x Administração.** A diferença é de plano de atuação: o **Governo decide** (traça diretrizes, escolhe prioridades, exerce comando político); a **Administração executa** (concretiza, operacionaliza, aplica). A Administração é instrumental — é o aparelhamento de que o Estado dispõe para realizar aquilo que o Governo decidiu.

| Governo | Administração Pública (sentido estrito) |
|---|---|
| Atividade política e discricionária | Atividade neutra, vinculada à lei |
| Comando, iniciativa, fixação de diretrizes | Execução, conduta hierarquizada |
| Responsabilidade constitucional e política | Responsabilidade técnica e legal |
| Atua com autonomia/soberania | Atua com poderes de decisão limitados por lei |

---

## 4. Administração Pública: os sentidos que a banca embaralha

Esta é a seção que mais gera item de prova. Trabalhe com dois pares de sentidos.

### 4.1 Sentido amplo x sentido estrito

- **Sentido amplo** — abrange tanto os **órgãos de governo** (que exercem função política, traçando diretrizes) quanto os **órgãos administrativos** (que executam), e, no plano da atividade, abrange tanto a **função política** quanto a **função administrativa**.
- **Sentido estrito** — abrange somente os **órgãos administrativos** e a **função administrativa** (execução das políticas públicas). Exclui a atividade de governo.

### 4.2 Sentido subjetivo x sentido objetivo

- **Sentido subjetivo (formal ou orgânico)** — responde **QUEM** realiza a atividade. É o conjunto de **órgãos, entidades e agentes** que o ordenamento jurídico indica como incumbidos da função administrativa. Escreve-se, na convenção doutrinária, com iniciais **maiúsculas**: *Administração Pública*.
- **Sentido objetivo (material ou funcional)** — responde **O QUE** é realizado. É a própria **atividade administrativa** exercida pelo Estado. Escreve-se com iniciais **minúsculas**: *administração pública*.

Mnemônico que funciona: **S**ubjetivo = **S**ujeitos. **O**bjetivo = **O**bra (a atividade que é feita).

Aviso importante: no critério **formal/subjetivo**, é Administração Pública tudo aquilo que o ordenamento **formalmente rotular** como tal — mesmo que, materialmente, o órgão pratique atos que não sejam administrativos. Por isso um órgão pode integrar formalmente a Administração e praticar ato de natureza legislativa atípica, e vice-versa.

### 4.3 Cruzando os dois eixos

|  | Sentido amplo | Sentido estrito |
|---|---|---|
| **Subjetivo (quem)** | Órgãos de governo + órgãos administrativos | Apenas órgãos e entidades administrativas |
| **Objetivo (o quê)** | Função política + função administrativa | Apenas função administrativa |

### 4.4 As atividades da administração em sentido objetivo (Di Pietro)

Quatro grandes blocos:

1. **Serviço público** — prestação de utilidade ou comodidade material destinada à satisfação da coletividade, sob regime predominantemente público (transporte rodoviário, energia elétrica, telecomunicações — CF, art. 21).
2. **Polícia administrativa** — limitação e condicionamento de direitos, liberdades e da propriedade em favor do interesse coletivo, inclusive com aplicação de sanções. É aqui que se encaixa boa parte da atuação da PRF.
3. **Fomento** — incentivo à iniciativa privada de utilidade pública: subvenções, financiamentos em condições especiais, benefícios fiscais, convênios.
4. **Intervenção** — intervenção na propriedade privada (tombamento, requisição, servidão administrativa, desapropriação, ocupação temporária, limitação administrativa) e intervenção no domínio econômico (regulação, repressão ao abuso do poder econômico, atuação das agências reguladoras).

Parte da doutrina inclui ainda a **regulação** como categoria autônoma, sobretudo pela atuação das agências reguladoras.

### 4.5 Administração introversa e extroversa

- **Introversa** — atuação voltada para dentro: relações internas entre órgãos, entidades e agentes do próprio aparato estatal (gestão de pessoal, organização interna, contratos internos de gestão).
- **Extroversa** — atuação voltada para fora: relações com particulares e com a coletividade em geral (aplicação de multa, licenciamento, prestação de serviço público, poder de polícia).

### 4.6 Sentido operacional e instrumental

Hely Lopes Meirelles acrescenta duas leituras úteis:

- **Sentido operacional** — o desempenho perene e sistemático, legal e técnico, dos serviços do Estado ou por ele assumidos, em benefício da coletividade (o próprio "fazer").
- **Sentido instrumental** — a Administração como **instrumento**, aparelhamento de que o Estado se serve para a consecução de seus fins. Não é fim em si mesma.

Resumo de bolso: **Estado** = pessoa jurídica soberana (povo + território + governo). **Governo** = condução política, define o que fazer. **Administração Pública** = estrutura e atividade que executam o que foi definido.

---

## 5. Fontes do Direito Administrativo

Fonte é a origem, o modo pelo qual a norma jurídica se revela. Classificação padrão:

- **Primárias (diretas, imediatas)** — por si sós geram a norma jurídica. Aqui está a **lei** (em sentido amplo) e, para parte da doutrina, a **jurisprudência de observância obrigatória** e os **princípios**.
- **Secundárias (indiretas, mediatas)** — influenciam a produção da norma, mas não a criam por si: **doutrina**, **costume**, **praxe administrativa** e a jurisprudência não vinculante.

Outro corte:

- **Escritas** (lei, súmulas, atos normativos) x **não escritas** (costume, praxe, princípios gerais implícitos).
- **Organizadas** (lei, jurisprudência sistematizada) x **inorganizadas** (costume e praxe administrativa).

### 5.1 Lei — a fonte primária por excelência

"Lei" aqui é lei em **sentido amplo**: Constituição, emendas, leis complementares, ordinárias e delegadas, medidas provisórias, decretos legislativos, resoluções e também os **atos normativos infralegais** (decretos regulamentares, instruções normativas, portarias, resoluções de agências), desde que compatíveis com a lei.

A lei é fonte primária porque ninguém é obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei (CF, art. 5º, II) e porque a Administração está sujeita à **legalidade estrita** (CF, art. 37, *caput*): só pode agir conforme autorização legal.

**Direito Administrativo não é codificado.** Não existe um "Código de Direito Administrativo" brasileiro. As normas estão dispersas: CF/88 (arts. 37 a 41 e outros), Lei 8.112/1990 (servidores federais), Lei 9.784/1999 (processo administrativo federal), Lei 14.133/2021 (licitações e contratos), Lei 8.987/1995 (concessões), Lei 12.527/2011 (acesso à informação), Lei 13.303/2016 (estatais), Decreto-Lei 200/1967 (organização administrativa federal), entre muitas outras.

Cuidado com a palavra "codificação": o fato de existirem leis gerais **não** transforma a disciplina em codificada. Doutrinariamente discute-se a **codificação total, parcial ou a não codificação** — o Brasil se enquadra no modelo **não codificado**, com codificação apenas parcial de temas específicos.

### 5.2 Jurisprudência

É o conjunto de decisões reiteradas dos tribunais no mesmo sentido. Em regra é fonte **secundária**, porque orienta sem obrigar. Torna-se, porém, **primária/vinculante** em hipóteses específicas:

- **Súmula vinculante** do STF (CF, art. 103-A, incluído pela EC 45/2004): aprovada por 2/3 dos membros, após reiteradas decisões sobre matéria constitucional, com efeito vinculante em relação aos demais órgãos do Judiciário e à **administração pública direta e indireta**, nas esferas federal, estadual e municipal.
- **Decisões definitivas de mérito em ADI e ADC** (CF, art. 102, § 2º): eficácia contra todos e efeito vinculante relativamente aos órgãos do Judiciário e à Administração Pública direta e indireta.
- Precedentes qualificados do CPC (repetitivos, repercussão geral, IRDR), que vinculam a atividade judicial e, na prática administrativa, tendem a ser observados.

Existe ainda a **jurisprudência administrativa**: decisões reiteradas de órgãos julgadores administrativos, como Tribunais de Contas, CARF e conselhos de contribuintes. Ela orienta a Administração, mas não vincula o Judiciário.

> **Súmula comum x súmula vinculante.** A súmula comum do STF ou do STJ é apenas persuasiva; a súmula vinculante obriga a Administração e os demais órgãos judiciais, cabendo **reclamação** ao STF contra ato administrativo ou decisão que a contrarie.

### 5.3 Doutrina

É o trabalho científico dos estudiosos: constrói conceitos, classifica institutos, propõe soluções para lacunas. Fonte **secundária**, mas de peso enorme em uma disciplina não codificada — é justamente por isso que o Direito Administrativo é, tradicionalmente, considerado um "direito de construção doutrinária e jurisprudencial". Boa parte das teorias que a banca cobra (atributos do ato administrativo, teoria dos motivos determinantes, teoria do órgão) nasceu na doutrina antes de virar lei ou súmula.

### 5.4 Costume e praxe administrativa

**Costume** é a prática reiterada, uniforme e constante, acompanhada da convicção de sua obrigatoriedade. **Praxe administrativa** é a rotina interna da repartição, prática burocrática consolidada, não escrita e inorganizada.

Regras que caem:

- O costume é fonte **secundária** e **não escrita**.
- Admite-se o costume ***secundum legem*** (conforme a lei) e o ***praeter legem*** (supletivo, para suprir lacuna).
- **Não se admite** o costume ***contra legem***: prática reiterada não revoga lei nem convalida ilegalidade.
- Hely Lopes Meirelles lembra que a praxe influencia a produção do direito na medida em que supre a lei ou informa a doutrina.

### 5.5 Princípios gerais de direito

Princípios são normas de otimização que dão unidade e coerência ao sistema. Podem ser **explícitos** (CF, art. 37: legalidade, impessoalidade, moralidade, publicidade, eficiência) ou **implícitos/reconhecidos** (supremacia do interesse público, indisponibilidade, autotutela, razoabilidade, proporcionalidade, motivação, segurança jurídica, continuidade). Boa parte da doutrina os classifica como fonte **primária**, dado seu caráter normativo; outra parte os coloca como fonte secundária quando não positivados. A banca costuma aceitar a leitura de que princípios **são normas** e vinculam a Administração, ainda que implícitos.

### 5.6 Quadro-resumo das fontes

| Fonte | Espécie | Escrita? | Observação-chave |
|---|---|---|---|
| Lei (sentido amplo) | Primária | Sim | Fonte principal; disciplina não codificada |
| Súmula vinculante / ADI-ADC | Primária (vinculante) | Sim | Vincula o Judiciário e a Administração direta e indireta |
| Jurisprudência comum | Secundária | Sim | Persuasiva |
| Doutrina | Secundária | Sim | Peso elevado em ramo não codificado |
| Costume / praxe | Secundária | Não | Nunca *contra legem* |
| Princípios | Primária (majoritário) | Explícitos ou implícitos | Normatividade plena |

---

## 6. Sistemas administrativos: quem controla a Administração

Sistema administrativo é o regime adotado por um país para o **controle da legalidade dos atos administrativos**. Existem dois modelos históricos.

### 6.1 Sistema francês (contencioso administrativo, dualidade de jurisdição)

Há **duas jurisdições paralelas**: a comum, para litígios entre particulares, e a administrativa, encabeçada pelo **Conselho de Estado**, para litígios que envolvam a Administração. As decisões do contencioso administrativo fazem **coisa julgada** e não podem ser revistas pelo Judiciário comum.

A origem é histórica e política: após a Revolução Francesa, prevaleceu uma leitura rígida da separação de Poderes segundo a qual "julgar a Administração ainda é administrar" — daí retirar do Judiciário comum o controle dos atos administrativos.

### 6.2 Sistema inglês (jurisdição una, unicidade de jurisdição)

Todos os litígios, inclusive os que envolvem a Administração, podem ser levados ao **Poder Judiciário comum**, que profere a última palavra com força de coisa julgada. É o modelo do *rule of law*.

### 6.3 O Brasil adotou o sistema inglês

Fundamento constitucional: **CF, art. 5º, XXXV** — "a lei não excluirá da apreciação do Poder Judiciário lesão ou ameaça a direito" (princípio da **inafastabilidade da jurisdição**).

Consequências que a banca cobra:

- Existe processo administrativo no Brasil (e ele é importante), mas a decisão administrativa **não faz coisa julgada material**; faz, no máximo, "coisa julgada administrativa", que significa apenas a **impossibilidade de revisão na própria via administrativa** (definitividade interna).
- O interessado **não precisa esgotar a via administrativa** para ir ao Judiciário, salvo exceções constitucionais expressas.
- O controle judicial recai sobre a **legalidade e a juridicidade** do ato (incluindo razoabilidade, proporcionalidade e moralidade). O Judiciário **não substitui** o administrador no juízo de **mérito** (conveniência e oportunidade) dos atos discricionários.

**Exceções aparentes** (casos em que a Constituição exige prévio percurso administrativo, sem afastar o Judiciário):

- **Justiça desportiva** (CF, art. 217, § 1º): só se admite ação judicial após esgotadas as instâncias da justiça desportiva, que tem prazo máximo de 60 dias para decidir.
- **Habeas data**: a jurisprudência (Súmula 2 do STJ) exige prova de recusa administrativa prévia — falta de interesse de agir sem isso.
- **Reclamação por descumprimento de súmula vinculante** contra ato administrativo: exige-se o prévio esgotamento das vias administrativas (Lei 11.417/2006, art. 7º, § 1º).
- Discussão sobre benefícios previdenciários: o STF exige prévio requerimento administrativo (RE 631.240) como condição de interesse de agir.

Em nenhuma dessas hipóteses há dualidade de jurisdição: são apenas condicionantes de acesso, não retirada do controle judicial.

---

## 7. Regimes jurídicos da Administração Pública

### 7.1 Regime de direito público x regime de direito privado

A Administração pode atuar sob dois regimes:

- **Regime jurídico de direito público** — regra geral. A Administração atua com **prerrogativas** (posição de superioridade em relação ao particular) e sob **sujeições** (limitações que o particular não tem). Aqui a relação é **vertical**.
- **Regime jurídico de direito privado parcialmente derrogado** — em situações específicas, a Administração atua em posição de relativa igualdade com o particular (contratos de locação em que é locatária, emissão de títulos, atuação de empresas estatais exploradoras de atividade econômica — CF, art. 173, § 1º). Mesmo aqui, **nunca há direito privado puro**: incidem sempre normas públicas como concurso, licitação (adaptada), controle externo e princípios do art. 37.

Quando a lei silencia, presume-se o regime **público**, pois é o regime natural da função administrativa.

### 7.2 Regime jurídico-administrativo em sentido estrito

Chama-se **regime jurídico-administrativo** o conjunto de prerrogativas e sujeições próprias do direito público, sustentado por dois **supraprincípios** que formam a chamada **bipolaridade** do Direito Administrativo:

1. **Supremacia do interesse público sobre o privado** — origem das **prerrogativas**: autoexecutoriedade, presunção de legitimidade, imperatividade, cláusulas exorbitantes nos contratos, poder de polícia, desapropriação, autotutela, prazos processuais diferenciados.
2. **Indisponibilidade do interesse público** — origem das **sujeições**: legalidade, concurso público, licitação, publicidade, motivação, prestação de contas, impossibilidade de renúncia a bens e direitos públicos sem autorização legal.

A fórmula que a banca gosta: prerrogativas **sem** sujeições geraria autoritarismo; sujeições **sem** prerrogativas inviabilizaria o atendimento do interesse coletivo. O regime jurídico-administrativo é exatamente o equilíbrio entre os dois polos.

> **Cuidado conceitual.** "Regime jurídico da Administração Pública" é expressão **ampla** (abrange tanto o regime público quanto o privado parcialmente derrogado). "Regime jurídico-administrativo" é expressão **estrita** (apenas o regime de direito público, com prerrogativas e sujeições). Trocar as duas é erro clássico induzido em prova.

---

## 8. Aplicação prática no dia a dia da PRF

Não estude esta aula como teoria solta: quase tudo que o policial rodoviário federal faz é ilustração viva dos conceitos acima.

- **Abordagem e fiscalização em rodovia federal** — exercício de **polícia administrativa** (atividade da administração em sentido objetivo), atuação **extroversa**, sob **regime de direito público**, fundada na **supremacia do interesse público** e limitada pela **legalidade** e pela **proporcionalidade**.
- **Auto de infração de trânsito** — ato administrativo concreto, direto e imediato: função administrativa em estado puro. Revisível administrativamente (JARI, CETRAN) e, sempre, pelo Judiciário — reflexo do **sistema inglês**.
- **Recurso do condutor julgado pela JARI** — processo administrativo; a decisão gera **coisa julgada administrativa** apenas, nunca coisa julgada material.
- **Nomeação de aprovados em concurso da PRF, licitação para compra de viaturas, PAD contra servidor** — atuação **introversa**, ainda dentro da função administrativa, sujeita a legalidade, publicidade e controle do TCU.
- **Definição de metas nacionais de segurança viária pelo Ministério** — atividade de **Governo** (direção política), que a PRF depois **executa** como Administração.
- **Convênio com órgão estadual para operação integrada** — pode envolver **fomento** e cooperação, com regras públicas de prestação de contas.

---

## 9. Tabela de incidência: o que mais cai desta aula

| Assunto | Peso relativo | Formato típico de cobrança |
|---|---|---|
| Sentidos de Administração Pública (subjetivo/objetivo, amplo/estrito) | Muito alto | Item conceitual com troca de definição |
| Sistema administrativo brasileiro (inglês) | Muito alto | Afirmar contencioso administrativo / coisa julgada administrativa |
| Fontes (primária x secundária; costume; jurisprudência vinculante) | Alto | Classificação e limites do costume |
| Conceito e critérios do Direito Administrativo | Alto | Nome do critério x conteúdo |
| Função administrativa (concreta, direta, imediata, revisível) | Alto | Trocar advérbios; alegar definitividade |
| Estado, Governo, formas e sistemas de governo | Médio | Diferenciar autonomia x soberania |
| Regime jurídico-administrativo (bipolaridade) | Médio | Prerrogativa x sujeição |
| Administração introversa/extroversa | Médio-baixo | Exemplos aplicados |

---

## 10. Resumo relâmpago (revisão de véspera)

- Direito Administrativo: ramo do **direito público interno**, **não codificado**, de construção **doutrinária e jurisprudencial**.
- Conceito prevalecente (Hely): princípios que regem órgãos, agentes e atividades públicas para realizar **concreta, direta e imediatamente** os fins do Estado.
- Critérios: legalista, Poder Executivo, serviço público, relações jurídicas, teleológico, negativista/residual e **Administração Pública (prevalecente)**.
- Estado = povo + território + governo soberano. Entes federativos têm **autonomia**, não soberania.
- Brasil: forma de Estado **federada**, forma de governo **republicana**, sistema de governo **presidencialista**.
- Todos os Poderes exercem função administrativa (típica no Executivo, atípica nos demais).
- Função administrativa: **concreta, direta, imediata, infralegal e revisível** (sem coisa julgada material).
- Governo **decide** (político e discricionário); Administração **executa** (instrumental e vinculada).
- Administração Pública: **subjetivo = quem** (órgãos, entidades, agentes); **objetivo = o que** (serviço público, polícia, fomento, intervenção).
- **Introversa** = para dentro; **extroversa** = para fora.
- Fontes: **lei** (primária), jurisprudência (secundária, salvo SV e ADI/ADC), doutrina (secundária), **costume** (secundária, jamais *contra legem*), princípios.
- Sistema administrativo brasileiro: **inglês / jurisdição una** (CF, art. 5º, XXXV). Exceções aparentes: justiça desportiva, habeas data, reclamação por SV, previdenciário.
- Regime jurídico-administrativo: **supremacia** (prerrogativas) + **indisponibilidade** (sujeições) = bipolaridade.

---

## 11. Glossário essencial

- **Autonomia** — capacidade de autodeterminação nos limites fixados pela Constituição (entes federativos).
- **Soberania** — poder supremo, não subordinado a nenhum outro, atributo da República Federativa do Brasil.
- **Coisa julgada administrativa** — impossibilidade de revisão na própria via administrativa; não impede o controle judicial.
- **Cláusulas exorbitantes** — prerrogativas contratuais da Administração que extrapolam o direito privado comum.
- **Derrogação parcial** — incidência de normas públicas sobre relações regidas primariamente pelo direito privado.
- **Praxe administrativa** — rotina burocrática não escrita e inorganizada.
- **Ato de governo (ato político)** — ato de alta discricionariedade fundado diretamente na Constituição.
- **Bipolaridade do Direito Administrativo** — tensão permanente entre prerrogativas e sujeições.

---

## 12. Banco de questões comentadas (estilo Cebraspe — Certo/Errado)

**1.** O Direito Administrativo é ramo do direito público interno que disciplina, entre outros temas, os órgãos, os agentes e as atividades voltadas à realização concreta e imediata dos fins do Estado.
**Gabarito: CERTO.** É a definição prevalecente, apoiada no critério da Administração Pública.

**2.** Segundo o critério legalista, o Direito Administrativo confunde-se com o conjunto de leis administrativas vigentes, razão pela qual esse critério é criticado por reduzir a ciência ao seu objeto.
**Gabarito: CERTO.** Crítica clássica ao critério exegético.

**3.** O critério do Poder Executivo é suficiente para delimitar o Direito Administrativo, pois somente esse Poder exerce função administrativa.
**Gabarito: ERRADO.** Legislativo e Judiciário também exercem função administrativa atípica.

**4.** O critério negativista define o Direito Administrativo como a atividade estatal remanescente, excluídas as funções legislativa e jurisdicional.
**Gabarito: CERTO.** É a definição por eliminação.

**5.** O Direito Administrativo brasileiro é codificado, uma vez que a Lei 9.784/1999 reúne as normas gerais da disciplina.
**Gabarito: ERRADO.** Não há codificação; a Lei 9.784/1999 trata apenas do processo administrativo federal.

**6.** A função administrativa realiza os fins do Estado de modo abstrato e mediato.
**Gabarito: ERRADO.** É concreta, direta e imediata; abstrata e geral é a função legislativa.

**7.** A inércia é característica típica da função jurisdicional, que depende de provocação da parte interessada.
**Gabarito: CERTO.**

**8.** Os atos administrativos, quando não mais recorríveis na esfera administrativa, adquirem coisa julgada material.
**Gabarito: ERRADO.** Adquirem apenas coisa julgada administrativa; permanecem revisíveis pelo Judiciário.

**9.** O poder estatal é uno e indivisível, sendo divisível apenas o exercício das funções estatais.
**Gabarito: CERTO.**

**10.** O Senado Federal, ao julgar o Presidente da República por crime de responsabilidade, exerce função atípica jurisdicional em sentido amplo.
**Gabarito: CERTO.** Trata-se de função atípica de julgamento.

**11.** Os Municípios brasileiros possuem Poder Judiciário próprio em sua estrutura.
**Gabarito: ERRADO.** Possuem Executivo e Legislativo.

**12.** O Estado é pessoa jurídica de direito público composta por povo, território e governo soberano.
**Gabarito: CERTO.**

**13.** Estados-membros e Municípios são dotados de soberania, o que lhes permite auto-organização.
**Gabarito: ERRADO.** São dotados de autonomia; a soberania pertence à República Federativa do Brasil.

**14.** A eletividade, a temporariedade e a responsabilidade do governante são características da forma republicana de governo.
**Gabarito: CERTO.**

**15.** No parlamentarismo, as chefias de Estado e de governo concentram-se em uma única autoridade.
**Gabarito: ERRADO.** Essa concentração caracteriza o presidencialismo.

**16.** No presidencialismo, o mandato do chefe do Executivo é fixo, não dependendo da confiança do parlamento.
**Gabarito: CERTO.**

**17.** A federação é forma de Estado; a república é forma de governo; o presidencialismo é sistema de governo.
**Gabarito: CERTO.**

**18.** O Governo caracteriza-se por atividade política e discricionária de comando, ao passo que a Administração desempenha conduta hierarquizada e vinculada à lei.
**Gabarito: CERTO.**

**19.** Os atos de governo, por serem atos administrativos comuns, submetem-se integralmente ao controle judicial de mérito.
**Gabarito: ERRADO.** São atos políticos, de alta discricionariedade; o controle judicial é de compatibilidade constitucional, não de mérito político.

**20.** A Administração Pública em sentido subjetivo compreende o conjunto de órgãos, entidades e agentes incumbidos da função administrativa.
**Gabarito: CERTO.**

**21.** Em sentido objetivo, a Administração Pública corresponde ao conjunto de pessoas jurídicas que integram a Administração Direta e Indireta.
**Gabarito: ERRADO.** Essa é a acepção subjetiva; a objetiva é a atividade administrativa em si.

**22.** A Administração Pública em sentido estrito abrange tanto os órgãos de governo quanto os órgãos administrativos.
**Gabarito: ERRADO.** Isso é o sentido amplo; o estrito abrange apenas os órgãos administrativos e a função administrativa.

**23.** Fomento, polícia administrativa, serviço público e intervenção são atividades compreendidas na administração pública em sentido material.
**Gabarito: CERTO.**

**24.** A concessão de benefício fiscal a empresa que se instala em região carente é exemplo de atividade de fomento.
**Gabarito: CERTO.**

**25.** A administração introversa refere-se às relações da Administração com particulares, ao passo que a extroversa alcança as relações internas do aparato estatal.
**Gabarito: ERRADO.** Os conceitos estão invertidos.

**26.** A aplicação de multa de trânsito por policial rodoviário federal constitui manifestação da administração extroversa e do exercício de polícia administrativa.
**Gabarito: CERTO.**

**27.** A nomeação de servidores aprovados em concurso do Poder Judiciário é exemplo de exercício de função administrativa atípica.
**Gabarito: CERTO.**

**28.** A lei é fonte primária do Direito Administrativo, aí compreendidos os atos normativos infralegais compatíveis com ela.
**Gabarito: CERTO.**

**29.** A doutrina é fonte primária do Direito Administrativo, pois cria diretamente normas jurídicas obrigatórias.
**Gabarito: ERRADO.** É fonte secundária; orienta, mas não cria norma obrigatória.

**30.** Admite-se, no Direito Administrativo, o costume *contra legem*, desde que reiterado e uniforme na repartição.
**Gabarito: ERRADO.** Prática reiterada não revoga lei nem convalida ilegalidade.

**31.** O costume administrativo é fonte secundária e não escrita do Direito Administrativo.
**Gabarito: CERTO.**

**32.** A súmula vinculante do STF produz efeito vinculante em relação à administração pública direta e indireta, nas esferas federal, estadual e municipal.
**Gabarito: CERTO.** CF, art. 103-A.

**33.** A aprovação de súmula vinculante exige decisão de dois terços dos membros do STF, após reiteradas decisões sobre matéria constitucional.
**Gabarito: CERTO.**

**34.** As decisões definitivas de mérito proferidas em ação direta de inconstitucionalidade possuem eficácia contra todos e efeito vinculante em relação à Administração Pública.
**Gabarito: CERTO.** CF, art. 102, § 2º.

**35.** A jurisprudência, como regra geral, é fonte secundária do Direito Administrativo, tornando-se vinculante em hipóteses expressamente previstas.
**Gabarito: CERTO.**

**36.** As decisões dos Tribunais de Contas e de conselhos de contribuintes integram a chamada jurisprudência administrativa.
**Gabarito: CERTO.**

**37.** Os princípios, ainda que implícitos, possuem normatividade e vinculam a atuação da Administração Pública.
**Gabarito: CERTO.**

**38.** A praxe administrativa é fonte escrita e organizada do Direito Administrativo.
**Gabarito: ERRADO.** É não escrita e inorganizada.

**39.** No sistema francês, os litígios envolvendo a Administração são julgados por jurisdição administrativa própria, cujas decisões fazem coisa julgada.
**Gabarito: CERTO.**

**40.** O Brasil adotou o sistema do contencioso administrativo, no qual as decisões administrativas não podem ser revistas pelo Judiciário.
**Gabarito: ERRADO.** O Brasil adotou o sistema inglês, de jurisdição una.

**41.** O fundamento constitucional do sistema de jurisdição una é o princípio da inafastabilidade da jurisdição, previsto no art. 5º, XXXV, da Constituição Federal.
**Gabarito: CERTO.**

**42.** Como regra, é necessário o esgotamento da via administrativa para que o interessado possa buscar o Poder Judiciário.
**Gabarito: ERRADO.** Não há essa exigência como regra; existem apenas exceções constitucionais e jurisprudenciais pontuais.

**43.** A exigência de esgotamento das instâncias da justiça desportiva antes do ingresso em juízo é exceção aparente à inafastabilidade da jurisdição.
**Gabarito: CERTO.** CF, art. 217, § 1º.

**44.** O controle judicial dos atos administrativos discricionários alcança o mérito, permitindo ao juiz substituir a valoração de conveniência feita pelo administrador.
**Gabarito: ERRADO.** O controle é de legalidade e juridicidade; o mérito não é substituído pelo Judiciário.

**45.** A expressão "regime jurídico da Administração Pública" é mais ampla do que "regime jurídico-administrativo", pois abrange também o regime de direito privado parcialmente derrogado.
**Gabarito: CERTO.**

**46.** A supremacia do interesse público é o fundamento das sujeições impostas à Administração, enquanto a indisponibilidade gera as prerrogativas.
**Gabarito: ERRADO.** A relação está invertida: supremacia gera prerrogativas; indisponibilidade gera sujeições.

**47.** A autoexecutoriedade dos atos administrativos e as cláusulas exorbitantes nos contratos são exemplos de prerrogativas do regime jurídico-administrativo.
**Gabarito: CERTO.**

**48.** A exigência de concurso público e de licitação constitui sujeição decorrente da indisponibilidade do interesse público.
**Gabarito: CERTO.**

**49.** Quando atua sob regime de direito privado, a Administração Pública fica integralmente livre da incidência de normas de direito público.
**Gabarito: ERRADO.** O regime privado é sempre parcialmente derrogado por normas públicas.

**50.** A Administração Pública é instrumental, pois constitui o aparelhamento de que o Estado se serve para a consecução de seus fins, não sendo um fim em si mesma.
**Gabarito: CERTO.**

**51.** A função legislativa inova originariamente no ordenamento jurídico por meio de atos normativos primários.
**Gabarito: CERTO.**

**52.** O Poder Executivo pode exercer função atípica legislativa, como na edição de medidas provisórias.
**Gabarito: CERTO.**

**53.** A revisibilidade dos atos administrativos pelo Poder Judiciário é incompatível com o sistema de jurisdição una.
**Gabarito: ERRADO.** É exatamente o que caracteriza esse sistema.

**54.** A regulação exercida por agências reguladoras pode ser compreendida como manifestação da intervenção do Estado no domínio econômico.
**Gabarito: CERTO.**

**55.** O tombamento e a desapropriação são exemplos de intervenção do Estado na propriedade privada.
**Gabarito: CERTO.**

**56.** No sentido formal ou subjetivo, considera-se Administração Pública tudo aquilo que o ordenamento jurídico assim indicar, ainda que a atividade concretamente exercida não tenha natureza administrativa.
**Gabarito: CERTO.**

**57.** A decisão de um recurso administrativo por junta administrativa de recursos de infrações impede que o condutor discuta a multa em juízo.
**Gabarito: ERRADO.** Nenhuma decisão administrativa afasta o controle judicial.

**58.** A definição de diretrizes nacionais de segurança viária por autoridade ministerial configura atividade de governo, ao passo que a fiscalização diária em rodovia federal configura função administrativa.
**Gabarito: CERTO.**

**59.** O Direito Administrativo é considerado, tradicionalmente, um direito de construção doutrinária e jurisprudencial, em razão da ausência de codificação.
**Gabarito: CERTO.**

**60.** Em caso de silêncio da lei quanto ao regime aplicável a determinada atuação estatal, presume-se o regime de direito privado.
**Gabarito: ERRADO.** Presume-se o regime de direito público, natural da função administrativa.
$aula01$,
  true,
  'publicado',
  0
);
