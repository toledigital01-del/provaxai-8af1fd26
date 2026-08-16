-- Lote 11 do curso completo PRF: Física (peso 6), com foco em física aplicada ao trânsito.

INSERT INTO public.knowledge_docs (course_slug, disciplina, topico, titulo, conteudo, publicado, ordem) VALUES

('prf-2021', 'Física', 'Cinemática', 'Cinemática: MRU, MRUV e a física da frenagem', $md1$
## Mapa do tópico — o que cai e por quê

Cinemática é a base da Física cobrada na prova, e tem uma conexão direta com sua futura profissão: entender a relação entre velocidade, aceleração e distância de frenagem é literalmente física aplicada ao trabalho de um policial rodoviário, o que costuma aparecer nos enunciados da banca.

## Teoria essencial

O **Movimento Retilíneo Uniforme (MRU)** ocorre quando um corpo se desloca em linha reta com **velocidade constante** (aceleração nula) — a posição varia linearmente com o tempo, segundo a equação S = S₀ + v×t, onde S₀ é a posição inicial, v é a velocidade constante e t é o tempo decorrido.

O **Movimento Retilíneo Uniformemente Variado (MRUV)** ocorre quando a **aceleração é constante** e diferente de zero — a velocidade varia linearmente com o tempo (v = v₀ + a×t), e a posição varia segundo a equação horária S = S₀ + v₀×t + (a×t²)/2. Uma equação frequentemente usada, que dispensa o tempo, é a **equação de Torricelli**: v² = v₀² + 2×a×ΔS, especialmente útil em problemas de frenagem, em que se conhece a velocidade inicial, a desaceleração e se quer encontrar a distância percorrida até a parada (velocidade final igual a zero).

Na física da **frenagem de um veículo**, a distância total percorrida até a parada completa se divide em duas fases: a **distância de reação** (percorrida durante o tempo de reação do condutor, entre perceber o perigo e efetivamente acionar o freio — nessa fase, o veículo ainda se desloca em velocidade praticamente constante, como um MRU) e a **distância de frenagem propriamente dita** (percorrida durante a desaceleração até a parada, um MRUV com aceleração negativa). A distância total de parada é a soma dessas duas fases — um erro comum em prova é calcular apenas uma das duas fases e ignorar a outra.

Um ponto de destaque físico, frequentemente cobrado: a distância de frenagem (fase de desaceleração) é proporcional ao **quadrado da velocidade** (pela equação de Torricelli, isolando ΔS = v²/(2×a)) — isso significa que dobrar a velocidade **não dobra**, mas sim **quadruplica** a distância necessária para parar (mantida a mesma desaceleração), um dos fatos mais importantes e mais cobrados da física de trânsito, e também um dos principais fundamentos técnicos por trás dos limites de velocidade regulamentados.

## Como a Cebraspe cobra este assunto

O item costuma testar se o candidato sabe que a distância de frenagem cresce com o **quadrado** da velocidade (não linearmente), ou apresenta um problema numérico simples de MRU/MRUV, exigindo aplicação direta das equações horárias ou de Torricelli.

## Pegadinhas e palavras-armadilha

- Distância de frenagem é proporcional ao **quadrado** da velocidade — dobrar a velocidade **quadruplica** a distância de frenagem, não dobra.
- Distância total de parada = distância de **reação** (velocidade ~constante) + distância de **frenagem** (desaceleração até zero) — nunca esquecer a fase de reação.
- MRU: velocidade constante, aceleração nula. MRUV: aceleração constante, diferente de zero.
- Equação de Torricelli (v² = v₀² + 2×a×ΔS) dispensa o tempo — útil quando o problema não fornece o tempo diretamente.

## Letra de lei

Não se aplica letra de lei — o tópico é regido por leis físicas consolidadas da mecânica clássica (cinemática), cobradas no padrão usual de concursos, com aplicação prática à física do trânsito.

## Resumo relâmpago para revisão

- MRU: v constante, S = S₀ + v×t.
- MRUV: a constante, v = v₀ + a×t, S = S₀ + v₀t + at²/2, Torricelli v² = v₀² + 2aΔS.
- Distância de parada = reação (MRU) + frenagem (MRUV, desaceleração).
- Distância de frenagem ∝ velocidade² — dobrar v quadruplica a distância de frenagem.

## Treino rápido

**1.** A distância necessária para a frenagem completa de um veículo é diretamente proporcional à velocidade inicial, de modo que dobrar a velocidade dobra a distância de frenagem, mantida a mesma desaceleração.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A distância de frenagem é proporcional ao quadrado da velocidade; dobrar a velocidade quadruplica a distância de frenagem, não a dobra.

**2.** A distância total percorrida por um veículo até sua parada completa após identificado um perigo compreende tanto a distância de reação do condutor quanto a distância de frenagem propriamente dita.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**3.** No Movimento Retilíneo Uniformemente Variado, a aceleração do corpo é constante e diferente de zero, enquanto a velocidade varia linearmente com o tempo.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** A equação de Torricelli é especialmente útil para a resolução de problemas cinemáticos em que se conhece o intervalo de tempo decorrido, mas não a velocidade inicial do corpo.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A equação de Torricelli é útil justamente quando **não** se conhece o tempo, relacionando velocidades e deslocamento diretamente.
$md1$, true, 1),

('prf-2021', 'Física', 'Dinâmica', 'Dinâmica: Leis de Newton e força de atrito', $md2$
## Mapa do tópico — o que cai e por quê

Dinâmica explica **por que** os corpos se movem do jeito que a cinemática descreve — e as três Leis de Newton, junto com o conceito de força de atrito, são a base teórica por trás de fenômenos práticos do trânsito como derrapagem e capacidade de frenagem em diferentes condições de pista.

## Teoria essencial

A **Primeira Lei de Newton (Lei da Inércia)** afirma que um corpo permanece em repouso, ou em movimento retilíneo uniforme, a menos que uma força resultante externa atue sobre ele — é essa inércia que explica, por exemplo, por que os ocupantes de um veículo são lançados para frente numa freada brusca (o corpo do ocupante "tende" a manter seu estado de movimento, mesmo que o veículo já tenha desacelerado), justificando a obrigatoriedade do cinto de segurança.

A **Segunda Lei de Newton** estabelece que a força resultante sobre um corpo é igual ao produto de sua massa pela aceleração (F = m×a) — quanto maior a massa de um veículo, maior a força necessária para produzir a mesma aceleração (ou desaceleração), o que explica por que veículos mais pesados, em geral, exigem maior distância de frenagem, para uma mesma força de frenagem aplicada.

A **Terceira Lei de Newton (Ação e Reação)** afirma que, para toda ação, existe uma reação de mesma intensidade, mesma direção e sentido oposto, atuando em corpos diferentes — é o princípio por trás, por exemplo, da força que os pneus exercem sobre o solo (ação) e a reação do solo sobre os pneus, que efetivamente impulsiona ou freia o veículo.

A **força de atrito** se opõe ao movimento relativo entre duas superfícies em contato, sendo proporcional à força normal (a força de contato perpendicular entre as superfícies) e ao **coeficiente de atrito**, que depende da natureza das superfícies envolvidas. O atrito pode ser **estático** (entre superfícies sem movimento relativo entre si, como o pneu que ainda "agarra" o solo antes de derrapar) ou **cinético/dinâmico** (entre superfícies já em movimento relativo, como o pneu já derrapando sobre o asfalto) — o coeficiente de atrito estático é, em geral, **maior** que o cinético, o que explica por que a frenagem controlada (sem travar totalmente as rodas, mantendo o atrito estático) é mais eficiente do que a derrapagem total (atrito cinético, menor).

Pista molhada, com óleo, ou gelo reduz significativamente o coeficiente de atrito disponível entre pneu e solo, aumentando a distância de frenagem necessária para a mesma velocidade — é o fundamento físico direto por trás da recomendação de reduzir velocidade e aumentar distância de segurança em condições adversas de pista.

## Como a Cebraspe cobra este assunto

O item costuma relacionar uma das Leis de Newton a uma situação prática de trânsito (lançamento do ocupante numa freada, necessidade de maior força para frear veículo mais pesado), ou testa se o candidato sabe que o atrito estático é, em geral, maior que o cinético — explicando por que a frenagem sem travamento total das rodas é mais eficiente.

## Pegadinhas e palavras-armadilha

- Primeira Lei (Inércia): explica o lançamento do ocupante numa freada brusca — justifica o cinto de segurança.
- Segunda Lei (F=ma): veículo mais pesado precisa de **mais força** para a mesma desaceleração — maior distância de frenagem, para mesma força de frenagem aplicada.
- Atrito **estático** (sem escorregamento) é, em geral, **maior** que o **cinético** (com escorregamento/derrapagem) — frenagem controlada é mais eficiente que derrapagem total.
- Pista molhada/oleosa: **reduz** o coeficiente de atrito, aumentando a distância de frenagem.

## Letra de lei

Não se aplica letra de lei — o tópico é regido pelas Leis de Newton e pelos conceitos consolidados de força de atrito, cobrados no padrão usual de concursos, com aplicação prática à física do trânsito.

## Resumo relâmpago para revisão

- 1ª Lei (Inércia): corpo mantém estado de movimento, salvo força externa — explica lançamento em freada.
- 2ª Lei (F=ma): mais massa exige mais força para mesma aceleração/desaceleração.
- 3ª Lei (Ação-Reação): forças iguais, sentidos opostos, corpos diferentes.
- Atrito estático > atrito cinético (em geral) — frenagem controlada mais eficiente que derrapagem.
- Pista molhada/oleosa reduz atrito, aumenta distância de frenagem.

## Treino rápido

**1.** O lançamento do corpo de um ocupante para frente durante uma freada brusca do veículo é explicado pela Primeira Lei de Newton, relativa à inércia dos corpos.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** O coeficiente de atrito cinético entre duas superfícies é, em geral, maior do que o coeficiente de atrito estático entre as mesmas superfícies.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Em geral, o coeficiente de atrito estático é maior do que o cinético, o que torna a frenagem controlada (sem travamento total das rodas) mais eficiente que a derrapagem.

**3.** Segundo a Segunda Lei de Newton, veículos de maior massa exigem maior força para produzir a mesma desaceleração que veículos de menor massa.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** Condições de pista molhada ou com presença de óleo aumentam o coeficiente de atrito disponível entre o pneu e o solo, reduzindo a distância necessária para a frenagem do veículo.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Pista molhada ou oleosa **reduz** o coeficiente de atrito, **aumentando** a distância necessária para a frenagem.
$md2$, true, 2),

('prf-2021', 'Física', 'Energia e Trabalho', 'Energia, Trabalho e Potência aplicados ao movimento de veículos', $md3$
## Mapa do tópico — o que cai e por quê

Energia e trabalho conectam com o tópico anterior de dinâmica — a energia cinética de um veículo em movimento é o conceito central para entender a gravidade de um impacto em colisão, um dos pontos mais aplicados à realidade de acidentes de trânsito.

## Teoria essencial

O **trabalho** de uma força é o produto da força pela distância percorrida na direção da força (W = F × d × cos θ, onde θ é o ângulo entre a força e o deslocamento) — trabalho positivo quando a força favorece o movimento, negativo quando se opõe a ele (como a força de atrito numa frenagem, que realiza trabalho negativo sobre o veículo).

A **energia cinética** de um corpo em movimento é dada por Ec = (m×v²)/2, onde m é a massa e v é a velocidade — assim como na distância de frenagem, a energia cinética é proporcional ao **quadrado da velocidade**, o que significa que dobrar a velocidade de um veículo **quadruplica** sua energia cinética. Esse é o fundamento físico por trás da gravidade desproporcional dos acidentes em alta velocidade: um pequeno aumento de velocidade representa um aumento muito maior de energia envolvida numa eventual colisão.

O **Teorema do Trabalho-Energia Cinética** estabelece que o trabalho realizado pela força resultante sobre um corpo é igual à variação de sua energia cinética (W = ΔEc) — é esse teorema que explica, formalmente, por que a força de frenagem precisa realizar trabalho (negativo) equivalente a toda a energia cinética do veículo para levá-lo à parada completa: quanto maior a energia cinética inicial (proporcional ao quadrado da velocidade), maior o trabalho de frenagem necessário, o que se traduz em maior distância de frenagem para a mesma força de freio disponível.

A **potência** é a taxa de realização de trabalho por unidade de tempo (P = W/t), medida em watts no Sistema Internacional — no contexto de veículos, a potência do motor está relacionada à capacidade de realizar trabalho (acelerar o veículo, vencer resistências) num determinado intervalo de tempo, sendo distinta do conceito de energia total disponível.

O **Princípio da Conservação de Energia**, em sistemas sem perdas por atrito ou outras dissipações, estabelece que a energia mecânica total (soma da energia cinética e potencial) se conserva — em situações reais de trânsito, contudo, parte significativa da energia cinética se dissipa como calor (atrito nos freios, deformação estrutural em colisões), o que explica por que a energia "desaparecida" do movimento se manifesta como dano físico ao veículo e aos ocupantes numa colisão.

## Como a Cebraspe cobra este assunto

O item costuma testar se o candidato sabe que a energia cinética cresce com o quadrado da velocidade (mesma lógica da distância de frenagem), relacionando esse fato à gravidade desproporcional de acidentes em velocidades mais altas.

## Pegadinhas e palavras-armadilha

- Energia cinética é proporcional ao **quadrado** da velocidade — dobrar a velocidade **quadruplica** a energia cinética, não dobra.
- Trabalho da força de atrito numa frenagem é **negativo** (se opõe ao movimento).
- Teorema do Trabalho-Energia: W = ΔEc — conecta força de frenagem à energia cinética que precisa ser dissipada.
- Numa colisão, energia cinética se dissipa como calor/deformação — não "desaparece", se transforma.

## Letra de lei

Não se aplica letra de lei — o tópico é regido por conceitos consolidados de física mecânica clássica (trabalho, energia, potência), cobrados no padrão usual de concursos.

## Resumo relâmpago para revisão

- Trabalho: W = F×d×cosθ. Trabalho de atrito na frenagem: negativo.
- Energia cinética: Ec = mv²/2 — proporcional ao quadrado da velocidade.
- Teorema Trabalho-Energia: W = ΔEc.
- Potência: P = W/t.
- Em colisão, energia cinética se transforma em calor/deformação, não desaparece.

## Treino rápido

**1.** A energia cinética de um veículo em movimento é diretamente proporcional ao quadrado de sua velocidade, de modo que dobrar a velocidade quadruplica a energia cinética envolvida.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** O trabalho realizado pela força de atrito durante a frenagem de um veículo é positivo, contribuindo para aumentar a energia cinética do sistema.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** O trabalho da força de atrito na frenagem é negativo, pois se opõe ao movimento, reduzindo a energia cinética do veículo.

**3.** Segundo o Teorema do Trabalho-Energia Cinética, o trabalho realizado pela força resultante sobre um corpo é igual à variação de sua energia cinética.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** Em uma colisão veicular, a energia cinética do veículo simplesmente desaparece, sem se converter em nenhuma outra forma de energia.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A energia cinética se transforma em outras formas de energia, como calor e deformação estrutural, não desaparecendo.
$md3$, true, 3),

('prf-2021', 'Física', 'Colisões e Quantidade de Movimento', 'Quantidade de Movimento e Colisões: conservação e tipos de choque', $md4$
## Mapa do tópico — o que cai e por quê

Esse tópico é o que mais se conecta diretamente com acidentes de trânsito reais — entender como a quantidade de movimento se conserva numa colisão explica fenômenos como a diferença de dano entre colisão frontal e traseira, e entre veículos de massas muito diferentes.

## Teoria essencial

A **quantidade de movimento** (momento linear) de um corpo é o produto de sua massa pela velocidade (Q = m×v), uma grandeza **vetorial** (tem direção e sentido, não só magnitude). O **Princípio da Conservação da Quantidade de Movimento** estabelece que, num sistema isolado de forças externas (como uma colisão, considerando o instante muito curto do impacto, em que forças externas ao sistema dos dois veículos são desprezíveis frente às forças internas do choque), a quantidade de movimento total do sistema **antes** da colisão é igual à quantidade de movimento total **depois** da colisão — esse princípio é válido independentemente do tipo de colisão.

As colisões se classificam, quanto à conservação de energia, em: **colisão perfeitamente elástica** (conserva tanto a quantidade de movimento quanto a energia cinética total do sistema — situação praticamente teórica, rara em colisões reais entre veículos, mais comum em partículas subatômicas ou aproximações de esferas rígidas); **colisão parcialmente elástica** (conserva a quantidade de movimento, mas parte da energia cinética se dissipa, geralmente como deformação e calor — a maioria das colisões reais entre veículos se enquadra aqui); e **colisão perfeitamente inelástica** (os corpos permanecem unidos após o choque, movendo-se com velocidade comum — conserva a quantidade de movimento, mas há a **maior perda possível** de energia cinética entre os tipos de colisão, para uma dada quantidade de movimento inicial).

Num choque entre dois veículos de **massas muito diferentes** (por exemplo, um veículo de passeio colidindo com um caminhão), a conservação da quantidade de movimento explica por que o veículo de **menor massa** sofre variação de velocidade proporcionalmente **muito maior** do que o de maior massa — é essa assimetria física que justifica por que os danos e riscos aos ocupantes tendem a ser muito mais graves no veículo mais leve envolvido na colisão.

O **impulso** de uma força é o produto da força pelo intervalo de tempo de sua aplicação (I = F×Δt), sendo numericamente igual à variação da quantidade de movimento do corpo (**Teorema do Impulso**: I = ΔQ) — esse conceito explica por que dispositivos de segurança como airbags e cintos de segurança, ao **aumentarem o tempo** de desaceleração do corpo do ocupante numa colisão (em vez de uma parada abrupta e quase instantânea), **reduzem a força** média aplicada sobre o corpo para produzir a mesma variação de quantidade de movimento — mesma variação de momento, distribuída num tempo maior, resulta em força de impacto menor sobre o ocupante.

## Como a Cebraspe cobra este assunto

O item costuma testar se o candidato sabe que a quantidade de movimento se conserva em qualquer tipo de colisão (mesmo quando a energia cinética não se conserva), ou explora o Teorema do Impulso para explicar por que airbags e cintos reduzem a força de impacto sobre o ocupante, ao aumentarem o tempo de desaceleração.

## Pegadinhas e palavras-armadilha

- Quantidade de movimento se conserva **em qualquer tipo de colisão** — elástica, parcialmente elástica ou perfeitamente inelástica.
- Energia cinética **não se conserva sempre** — só na colisão perfeitamente elástica; a inelástica tem a maior perda.
- Colisão perfeitamente inelástica: corpos **permanecem unidos**, movendo-se com velocidade comum após o choque.
- Airbag/cinto: aumentam o **tempo** de desaceleração, **reduzindo a força** de impacto (Teorema do Impulso, I=ΔQ constante).
- Veículo de menor massa numa colisão sofre variação de velocidade **proporcionalmente maior** que o de maior massa.

## Letra de lei

Não se aplica letra de lei — o tópico é regido por conceitos consolidados de física mecânica clássica (quantidade de movimento, colisões, impulso), cobrados no padrão usual de concursos.

## Resumo relâmpago para revisão

- Q = m×v (vetorial). Conservação da quantidade de movimento: válida em qualquer colisão.
- Elástica: conserva Q e energia cinética. Parcialmente elástica: conserva Q, perde parte da energia. Perfeitamente inelástica: conserva Q, maior perda de energia, corpos unidos após o choque.
- Impulso: I = F×Δt = ΔQ — base física de airbag/cinto (mais tempo, menos força).
- Massas muito diferentes: veículo mais leve sofre variação de velocidade proporcionalmente maior.

## Treino rápido

**1.** A quantidade de movimento total de um sistema se conserva apenas em colisões perfeitamente elásticas, não se aplicando às colisões inelásticas.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A conservação da quantidade de movimento é válida em qualquer tipo de colisão, elástica ou inelástica; o que varia entre os tipos é a conservação (ou não) da energia cinética.

**2.** O funcionamento do airbag, ao aumentar o tempo de desaceleração do corpo do ocupante durante uma colisão, reduz a força média de impacto sobre o ocupante, para uma mesma variação de quantidade de movimento.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**3.** Na colisão perfeitamente inelástica, os corpos envolvidos permanecem unidos após o choque, movendo-se com velocidade comum.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** Em uma colisão entre veículos de massas muito diferentes, o veículo de maior massa sofre variação de velocidade proporcionalmente maior do que o veículo de menor massa.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** É o veículo de **menor** massa que sofre variação de velocidade proporcionalmente maior, em razão da conservação da quantidade de movimento do sistema.
$md4$, true, 4),

('prf-2021', 'Física', 'Óptica', 'Óptica: reflexão, refração e visibilidade no trânsito', $md5$
## Mapa do tópico — o que cai e por quê

Óptica é um tópico mais curto dentro de Física, mas com aplicação direta e relevante ao trânsito noturno e em condições de baixa visibilidade — reflexão, refração e a formação de imagens em espelhos são os conceitos mais cobrados.

## Teoria essencial

A **reflexão da luz** ocorre quando um raio luminoso incide sobre uma superfície e retorna ao meio de origem, obedecendo à **lei da reflexão**: o ângulo de incidência é igual ao ângulo de reflexão, ambos medidos em relação à normal (linha perpendicular à superfície no ponto de incidência). A reflexão pode ser **regular** (superfícies lisas e polidas, como espelhos, produzindo imagem nítida) ou **difusa** (superfícies rugosas, espalhando a luz em várias direções, sem formar imagem definida) — o asfalto molhado, por exemplo, torna-se mais próximo de uma reflexão regular do que o asfalto seco, o que explica o ofuscamento característico causado pelos faróis de veículos que trafegam em sentido contrário em pista molhada à noite.

Os **espelhos planos** formam imagens **virtuais** (não podem ser projetadas em anteparo), **direitas** (não invertidas verticalmente) e de **tamanho igual** ao objeto, situadas à mesma distância do espelho que o objeto está, mas do lado oposto. Os **espelhos esféricos** (côncavos e convexos) são amplamente utilizados em retrovisores veiculares: o **espelho convexo** produz sempre uma imagem **virtual, direita e reduzida**, ampliando o campo de visão do observador — é por isso que retrovisores externos frequentemente trazem a inscrição "objetos no espelho estão mais próximos do que parecem", já que a imagem reduzida cria a falsa impressão de maior distância real.

A **refração** é o desvio sofrido pela luz ao passar de um meio para outro de densidade óptica diferente (como do ar para a água, ou do ar para o vidro), decorrente da mudança de velocidade de propagação da luz entre os meios — é o fenômeno que explica, por exemplo, distorções visuais através de para-brisas molhados ou com defeitos, e a importância de manter os vidros do veículo limpos e em boas condições para a correta percepção visual do condutor.

Em condições de **baixa visibilidade** (neblina, chuva intensa, poeira), a dispersão da luz pelas partículas em suspensão no ar reduz significativamente a capacidade de percepção visual à distância, o que fundamenta fisicamente a exigência de redução de velocidade e maior distância de segurança nessas condições, além do uso adequado de faróis (luz baixa, que ilumina mais próximo e reduz o ofuscamento por reflexão difusa na neblina, sendo geralmente mais eficaz que a luz alta nessas condições).

## Como a Cebraspe cobra este assunto

O item costuma testar as características da imagem formada por espelhos planos (virtual, direita, mesmo tamanho) ou por espelhos convexos usados em retrovisores (virtual, direita, reduzida, campo de visão ampliado), ou explora o fenômeno da reflexão regular em pista molhada como causa do ofuscamento noturno.

## Pegadinhas e palavras-armadilha

- Espelho plano: imagem **virtual, direita, mesmo tamanho** do objeto.
- Espelho convexo (retrovisor): imagem **virtual, direita, reduzida** — amplia campo de visão, mas distorce a percepção de distância (objetos parecem mais longe do que estão).
- Reflexão **regular** (superfície lisa/polida, como asfalto molhado) forma imagem/ofuscamento mais definido do que a reflexão **difusa** (superfície rugosa, como asfalto seco).
- Refração: mudança de **velocidade de propagação** da luz ao mudar de meio — explica distorções em vidros molhados/defeituosos.

## Letra de lei

Não se aplica letra de lei — o tópico é regido por conceitos consolidados de óptica geométrica, cobrados no padrão usual de concursos.

## Resumo relâmpago para revisão

- Reflexão: ângulo incidência = ângulo reflexão. Regular (lisa) x difusa (rugosa).
- Espelho plano: imagem virtual, direita, mesmo tamanho.
- Espelho convexo (retrovisor): imagem virtual, direita, reduzida — campo de visão ampliado, distância percebida menor que a real.
- Refração: desvio da luz ao mudar de meio (mudança de velocidade de propagação).

## Treino rápido

**1.** O espelho convexo utilizado em retrovisores veiculares produz imagem real, invertida e ampliada do objeto observado.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** O espelho convexo produz imagem virtual, direita e reduzida, não real, invertida nem ampliada.

**2.** O asfalto molhado tende a produzir reflexão mais próxima da regular do que o asfalto seco, o que explica o maior ofuscamento causado por faróis de veículos em sentido contrário durante a noite, em pista molhada.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**3.** A imagem formada por um espelho plano é sempre virtual, direita e de tamanho igual ao do objeto observado.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** O fenômeno da refração da luz decorre exclusivamente da variação da intensidade luminosa, sem qualquer relação com a mudança de velocidade de propagação entre meios diferentes.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A refração decorre da mudança de velocidade de propagação da luz ao passar de um meio para outro de densidade óptica diferente.
$md5$, true, 5),

('prf-2021', 'Física', 'Eletricidade Básica', 'Eletricidade Básica: corrente, tensão, resistência e circuitos veiculares', $md6$
## Mapa do tópico — o que cai e por quê

Eletricidade básica fecha a disciplina de Física com conceitos que têm aplicação direta ao sistema elétrico de um veículo — a Lei de Ohm e os conceitos de circuito em série e paralelo são a base teórica cobrada, sempre em nível introdutório.

## Teoria essencial

A **corrente elétrica** é o fluxo ordenado de cargas elétricas através de um condutor, medida em **ampères (A)**. A **tensão elétrica** (ou diferença de potencial) é a "força" que impulsiona essa corrente através do circuito, medida em **volts (V)** — no sistema elétrico de um veículo convencional, a bateria fornece tipicamente 12 volts de tensão nominal. A **resistência elétrica** é a oposição que um material oferece à passagem da corrente, medida em **ohms (Ω)**.

A **Lei de Ohm** relaciona essas três grandezas: **U = R × i** (tensão igual ao produto da resistência pela corrente) — a partir dessa relação, para uma tensão fixa (como a da bateria do veículo), quanto maior a resistência de um componente, menor será a corrente que passa por ele, e vice-versa.

Em um **circuito em série**, os componentes são conectados um após o outro, formando um único caminho para a corrente — a corrente elétrica é a **mesma** em todos os pontos do circuito, mas a tensão se **divide** entre os componentes, proporcionalmente à resistência de cada um; se um componente falha (circuito aberto), toda a corrente do circuito é interrompida. Em um **circuito em paralelo**, os componentes são conectados em ramos distintos, oferecendo caminhos alternativos para a corrente — a tensão é a **mesma** em todos os ramos, mas a corrente total se **divide** entre eles, proporcionalmente ao inverso da resistência de cada ramo; se um componente falha, os demais ramos continuam funcionando normalmente, já que cada um tem seu próprio caminho.

O sistema elétrico automotivo utiliza predominantemente circuitos em **paralelo** para os diversos componentes (faróis, lanternas, rádio, ar-condicionado) — é essa configuração que garante que a falha de um componente (por exemplo, uma lâmpada de farol queimada) não interrompa o funcionamento dos demais sistemas elétricos do veículo, ao contrário do que ocorreria numa ligação em série, em que uma falha interromperia toda a corrente do circuito.

A **potência elétrica** é dada por P = U × i (tensão vezes corrente), medida em **watts (W)** — grandeza relevante para dimensionar a capacidade de componentes elétricos e a carga total exigida do sistema, incluindo o alternador e a bateria do veículo.

## Como a Cebraspe cobra este assunto

O item costuma testar se o candidato sabe diferenciar o comportamento de circuitos em série (corrente igual, tensão dividida, falha interrompe tudo) e em paralelo (tensão igual, corrente dividida, falha isolada), aplicando essa lógica ao sistema elétrico veicular, ou testa a aplicação numérica direta da Lei de Ohm.

## Pegadinhas e palavras-armadilha

- Lei de Ohm: **U = R × i** — para tensão fixa, mais resistência significa menos corrente.
- Circuito **série**: corrente igual em todos os pontos, tensão se divide; falha de um componente interrompe todo o circuito.
- Circuito **paralelo**: tensão igual em todos os ramos, corrente se divide; falha de um componente **não** afeta os demais ramos.
- Sistema elétrico veicular: predominantemente em **paralelo**, justamente para que a falha de um componente não desligue os demais.
- Potência: P = U × i.

## Letra de lei

Não se aplica letra de lei — o tópico é regido por conceitos consolidados de eletricidade básica (Lei de Ohm, circuitos elétricos), cobrados no padrão usual de concursos.

## Resumo relâmpago para revisão

- Corrente (A), tensão (V), resistência (Ω) — Lei de Ohm: U = R×i.
- Série: corrente igual, tensão dividida, falha interrompe tudo.
- Paralelo: tensão igual, corrente dividida, falha isolada.
- Sistema elétrico veicular: predominantemente paralelo.
- Potência: P = U×i.

## Treino rápido

**1.** Em um circuito elétrico em série, a corrente elétrica é a mesma em todos os pontos do circuito, enquanto a tensão se divide entre os componentes.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** O sistema elétrico de um veículo é predominantemente configurado em série, de modo que a falha de um componente, como uma lâmpada, interrompe o funcionamento de todos os demais sistemas elétricos.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** O sistema elétrico veicular é predominantemente configurado em paralelo, justamente para que a falha de um componente não afete o funcionamento dos demais.

**3.** Em um circuito elétrico em paralelo, a tensão é a mesma em todos os ramos do circuito, enquanto a corrente total se divide entre eles.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** Segundo a Lei de Ohm, mantida constante a tensão aplicada a um circuito, o aumento da resistência elétrica de um componente resulta em aumento proporcional da corrente que o percorre.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Mantida a tensão constante, o aumento da resistência resulta em **diminuição** da corrente, não em aumento, conforme a relação U=R×i.
$md6$, true, 6);
