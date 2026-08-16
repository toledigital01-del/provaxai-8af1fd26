-- Lote 6 do curso completo PRF: Informática (peso 8).

INSERT INTO public.knowledge_docs (course_slug, disciplina, topico, titulo, conteudo, publicado, ordem) VALUES

('prf-2021', 'Informática', 'Conceitos de Internet e Intranet', 'Internet e Intranet: conceitos, protocolos e navegação', $md1$
## Mapa do tópico — o que cai e por quê

Esse tópico mistura conceitos que parecem óbvios do dia a dia com terminologia técnica precisa que a Cebraspe adora testar — a diferença entre internet e intranet, os protocolos por trás de cada ação cotidiana (navegar, enviar e-mail, transferir arquivo) e os componentes de uma URL são os pontos mais recorrentes.

## Teoria essencial

A **internet** é uma rede mundial de computadores interligados, pública e de acesso amplo. A **intranet** utiliza a mesma tecnologia e os mesmos protocolos da internet (TCP/IP, HTTP), mas é restrita a uma organização, com acesso controlado — é, na prática, "a internet de dentro de casa" de uma empresa ou órgão. A **extranet** é uma extensão controlada da intranet, permitindo acesso a parceiros ou clientes externos específicos, mediante autenticação, sem abrir totalmente a rede ao público.

Os principais **protocolos** cobrados em prova: **HTTP** (transferência de páginas web, sem criptografia) e **HTTPS** (versão segura, com criptografia via TLS/SSL, indicada pelo cadeado no navegador); **FTP** (transferência de arquivos entre computadores); **SMTP** (envio de e-mails), **POP3** (recebimento de e-mail, baixando as mensagens para o dispositivo local, geralmente removendo do servidor) e **IMAP** (recebimento de e-mail, mantendo sincronização com o servidor, permitindo acesso de múltiplos dispositivos); **DNS** (traduz nomes de domínio em endereços IP, funcionando como uma espécie de "lista telefônica" da internet); **DHCP** (atribui endereços IP automaticamente aos dispositivos numa rede).

Uma **URL** (Uniform Resource Locator) é composta por: protocolo (https://), subdomínio/host, domínio, e caminho do recurso — entender essa estrutura ajuda a identificar phishing (URLs que imitam domínios legítimos com pequenas variações).

**Navegadores** (Chrome, Firefox, Edge) compartilham funcionalidades básicas: histórico de navegação, favoritos/marcadores, modo de navegação anônima/privada (que não salva histórico local, mas não torna o usuário anônimo perante o site visitado ou o provedor de internet), cache (armazenamento local de dados de páginas para acelerar carregamentos futuros) e cookies (pequenos arquivos que sites armazenam no navegador para lembrar preferências e sessões).

## Como a Cebraspe cobra este assunto

O item costuma testar a diferença entre POP3 e IMAP (o primeiro tende a remover a mensagem do servidor, o segundo mantém sincronizado em múltiplos dispositivos), ou afirma que a navegação anônima torna o usuário completamente invisível na internet — o que é falso, pois o provedor de acesso e o site visitado ainda podem registrar a atividade.

## Pegadinhas e palavras-armadilha

- Navegação anônima **não** torna o usuário invisível para o provedor de internet ou para o site acessado — apenas evita salvar histórico/cookies localmente.
- POP3: baixa e-mails para o dispositivo (geralmente remove do servidor). IMAP: mantém sincronizado com o servidor, acessível de vários dispositivos.
- HTTPS usa criptografia (TLS/SSL); HTTP não — o cadeado no navegador indica conexão HTTPS.
- Intranet usa os **mesmos protocolos** da internet (TCP/IP), só que em rede restrita — não é uma tecnologia diferente.
- DNS traduz nome de domínio em IP — sem DNS, seria preciso digitar o número IP diretamente para acessar um site.

## Letra de lei

Não se aplica letra de lei específica — o tópico é regido por conceitos técnicos consolidados de redes e internet, cobrados conforme o padrão usual da banca Cebraspe para concursos de nível médio/superior.

## Resumo relâmpago para revisão

- Internet (pública) x Intranet (restrita, mesmos protocolos) x Extranet (acesso controlado a terceiros).
- HTTP/HTTPS (páginas web), FTP (arquivos), SMTP (envio de e-mail), POP3/IMAP (recebimento), DNS (nome→IP), DHCP (IP automático).
- Navegação anônima: não salva histórico local, mas não garante anonimato total.
- Cookies e cache: armazenamento local para personalização e desempenho.

## Treino rápido

**1.** O protocolo IMAP mantém as mensagens de e-mail sincronizadas com o servidor, permitindo o acesso pelo mesmo usuário a partir de múltiplos dispositivos.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** A navegação em modo anônimo garante o anonimato completo do usuário perante o provedor de acesso à internet e os sites visitados.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** O modo anônimo apenas evita salvar histórico e cookies localmente; não impede que o provedor ou os sites registrem a atividade.

**3.** A intranet utiliza protocolos e tecnologias distintos dos empregados na internet pública, o que garante sua segurança intrínseca.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A intranet utiliza os mesmos protocolos da internet (como TCP/IP), diferenciando-se pelo acesso restrito, não pela tecnologia empregada.

**4.** O protocolo DNS é responsável por traduzir nomes de domínio em endereços IP correspondentes.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**
$md1$, true, 1),

('prf-2021', 'Informática', 'Sistemas Operacionais', 'Sistemas Operacionais: Windows e Linux para concurso', $md2$
## Mapa do tópico — o que cai e por quê

A prova testa noções operacionais básicas de Windows e Linux — atalhos de teclado, gerenciamento de arquivos, estrutura de diretórios — sempre em nível de usuário comum, não de administrador de sistemas avançado. É um tópico de prática direta: quem usa o computador no dia a dia com atenção já sai na frente.

## Teoria essencial

O **Windows** organiza arquivos em uma estrutura hierárquica de pastas, com o **Explorador de Arquivos** (Windows Explorer/File Explorer) como ferramenta central de navegação. Atalhos de teclado cobrados com frequência: **Ctrl+C** (copiar), **Ctrl+X** (recortar), **Ctrl+V** (colar), **Ctrl+Z** (desfazer), **Ctrl+A** (selecionar tudo), **Alt+Tab** (alternar entre janelas abertas), **Windows+E** (abrir o Explorador de Arquivos), **Windows+L** (bloquear a tela), **F2** (renomear arquivo selecionado), **Delete** (mover para a Lixeira) e **Shift+Delete** (excluir permanentemente, sem passar pela Lixeira).

A **Lixeira** armazena temporariamente arquivos excluídos, permitindo restauração, até ser esvaziada manualmente ou (dependendo de configuração) automaticamente ao atingir determinado limite de espaço. Arquivos excluídos de unidades removíveis (pendrive) ou compartilhamentos de rede, em geral, **não** vão para a Lixeira, sendo removidos diretamente.

O **Linux** é um sistema operacional de código aberto, com diversas distribuições (Ubuntu, Debian, Fedora, entre outras). Sua estrutura de diretórios segue um padrão hierárquico único a partir da raiz **"/"** (diferente do Windows, que usa letras de unidade como C:, D:), com diretórios padronizados como **/home** (arquivos dos usuários), **/etc** (arquivos de configuração do sistema), **/bin** (executáveis essenciais) e **/root** (diretório pessoal do superusuário). O Linux é case-sensitive (diferencia maiúsculas de minúsculas em nomes de arquivos e comandos), diferente do Windows, que geralmente não diferencia.

Comandos básicos de terminal Linux frequentemente cobrados: **ls** (listar arquivos do diretório), **cd** (mudar de diretório), **pwd** (mostrar diretório atual), **mkdir** (criar diretório), **rm** (remover arquivo), **cp** (copiar) e **mv** (mover ou renomear).

## Como a Cebraspe cobra este assunto

O item costuma testar o atalho correto para uma ação específica no Windows, ou pergunta sobre a estrutura de diretórios do Linux (se o sistema usa letras de unidade como o Windows, por exemplo — pegadinha clássica, pois o Linux não usa essa convenção).

## Pegadinhas e palavras-armadilha

- Linux **não** usa letras de unidade (C:, D:) como o Windows — usa uma árvore única a partir da raiz "/".
- Shift+Delete exclui **permanentemente**, sem passar pela Lixeira; Delete apenas move para a Lixeira (em regra).
- Arquivos excluídos de pendrive/rede geralmente **não** vão para a Lixeira do Windows.
- Linux é **case-sensitive** (diferencia maiúsculas de minúsculas); o Windows, em geral, não diferencia em nomes de arquivo.

## Letra de lei

Não se aplica letra de lei específica — o tópico é regido por conceitos técnicos consolidados de sistemas operacionais, no nível de usuário comum cobrado por concursos.

## Resumo relâmpago para revisão

- Atalhos Windows: Ctrl+C/X/V/Z/A, Alt+Tab, Win+E, Win+L, F2, Delete (Lixeira) x Shift+Delete (permanente).
- Linux: estrutura em árvore única a partir de "/", case-sensitive, comandos ls/cd/pwd/mkdir/rm/cp/mv.
- Lixeira: não recebe, em regra, exclusões de mídia removível ou rede.

## Treino rápido

**1.** No sistema operacional Linux, a estrutura de diretórios é organizada a partir de letras de unidade, de forma semelhante ao Windows.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** O Linux organiza seus diretórios em uma árvore hierárquica única, a partir da raiz "/", sem uso de letras de unidade.

**2.** A combinação de teclas Shift+Delete exclui permanentemente um arquivo selecionado, sem enviá-lo para a Lixeira.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**3.** O sistema operacional Linux diferencia maiúsculas de minúsculas em nomes de arquivos e comandos, característica conhecida como case-sensitive.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** Arquivos excluídos de um pendrive conectado ao computador são, em regra, enviados para a Lixeira do Windows, da mesma forma que arquivos excluídos do disco local.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** Arquivos excluídos de unidades removíveis, em geral, não passam pela Lixeira, sendo removidos diretamente.
$md2$, true, 2),

('prf-2021', 'Informática', 'Editores de Texto e Planilhas', 'Editores de Texto e Planilhas: Word, Excel e LibreOffice', $md3$
## Mapa do tópico — o que cai e por quê

Esse tópico testa uso prático de Word e Excel (e seus equivalentes no LibreOffice) — a prova gosta de descrever uma ação específica (aplicar uma fórmula, usar um recurso de formatação) e perguntar se o resultado descrito está correto, então conhecer as funções mais usadas do dia a dia profissional é o caminho mais direto.

## Teoria essencial

No **Microsoft Word** (e no equivalente **LibreOffice Writer**), recursos frequentemente cobrados incluem: **estilos** (formatação padronizada aplicável a títulos e parágrafos, que também alimenta o **sumário automático**, gerado a partir dos estilos de título aplicados ao documento), **controle de alterações** (registra edições feitas por revisores, permitindo aceitar ou rejeitar cada mudança), **quebra de página e de seção** (a quebra de seção permite configurações diferentes, como orientação de página ou numeração, em partes distintas do mesmo documento) e **mala direta** (recurso para gerar documentos personalizados em lote, a partir de uma base de dados, como cartas ou etiquetas com nomes diferentes).

No **Microsoft Excel** (e equivalente **LibreOffice Calc**), o domínio de fórmulas é o ponto mais testado. A função **SOMA** soma um intervalo de células; **MÉDIA** calcula a média aritmética; **SE** (ou **IF**) retorna um valor caso uma condição seja verdadeira e outro caso seja falsa (ex.: =SE(A1>10;"Aprovado";"Reprovado")); **PROCV** (procura vertical) busca um valor na primeira coluna de um intervalo e retorna um valor correspondente de outra coluna na mesma linha; **CONT.SE** conta quantas células de um intervalo atendem a determinado critério; **SOMASE** soma valores de um intervalo que atendem a determinado critério.

A distinção entre **referência relativa** (A1, que se ajusta automaticamente ao ser copiada para outra célula) e **referência absoluta** (\$A\$1, fixada com o símbolo de cifrão, que não muda ao ser copiada) é um dos pontos mais cobrados de Excel — errar essa distinção é a causa mais comum de fórmula copiada incorretamente na vida real e também na prova.

O recurso de **classificar e filtrar** organiza e exibe seletivamente dados de uma planilha, sem alterar os dados originais, apenas a forma de visualização. **Tabelas dinâmicas** permitem resumir, analisar e apresentar grandes volumes de dados de forma reorganizável, sem necessidade de fórmulas manuais complexas.

## Como a Cebraspe cobra este assunto

O item costuma apresentar uma fórmula específica de Excel e perguntar qual seria o resultado, ou descreve o comportamento de uma referência (relativa/absoluta) ao ser copiada para outra célula, testando se o candidato sabe prever o efeito prático.

## Pegadinhas e palavras-armadilha

- Referência relativa (A1) muda ao copiar; referência absoluta (\$A\$1) permanece fixa — o cifrão "trava" a referência.
- PROCV busca sempre na **primeira coluna** do intervalo definido, retornando valor de coluna à direita, na mesma linha.
- Sumário automático do Word depende dos **estilos de título** aplicados corretamente ao texto, não de formatação manual de fonte/tamanho.
- Quebra de **seção** (não de página) é o recurso que permite configurações diferentes de página dentro do mesmo documento.

## Letra de lei

Não se aplica letra de lei específica — o tópico é regido por conhecimento prático das ferramentas Microsoft Office e LibreOffice, no nível de usuário cobrado por concursos.

## Resumo relâmpago para revisão

- Word: estilos, sumário automático, controle de alterações, quebra de seção, mala direta.
- Excel: SOMA, MÉDIA, SE, PROCV, CONT.SE, SOMASE.
- Referência relativa (muda ao copiar) x absoluta (\$, fixa ao copiar).
- PROCV: busca na primeira coluna, retorna de coluna à direita.

## Treino rápido

**1.** Ao copiar a fórmula de uma célula contendo referência absoluta (como \$A\$1) para outra célula, o valor referenciado permanece inalterado.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** A função PROCV realiza a busca de um valor na última coluna do intervalo definido, retornando o valor correspondente da primeira coluna.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A função PROCV busca o valor na **primeira** coluna do intervalo, retornando o valor correspondente de uma coluna posterior (à direita).

**3.** O sumário automático do Microsoft Word é gerado a partir dos estilos de título aplicados ao longo do documento.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** A quebra de página, no Microsoft Word, permite a aplicação de configurações distintas de orientação e numeração entre diferentes partes do mesmo documento.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** É a quebra de **seção**, não a quebra de página, que permite configurações distintas entre partes do documento.
$md3$, true, 3),

('prf-2021', 'Informática', 'Segurança da Informação', 'Segurança da Informação: vírus, malware e proteção', $md4$
## Mapa do tópico — o que cai e por quê

Segurança da informação é um dos tópicos de maior retorno em Informática — a Cebraspe testa tanto os conceitos fundamentais (confidencialidade, integridade, disponibilidade) quanto a diferenciação entre os tipos de malware, que costumam ser confundidos entre si.

## Teoria essencial

Os três pilares clássicos da segurança da informação são conhecidos pela sigla **CID**: **confidencialidade** (garantir que a informação só é acessível a quem tem autorização), **integridade** (garantir que a informação não seja alterada de forma não autorizada) e **disponibilidade** (garantir que a informação esteja acessível quando necessário, a quem tem direito de acessá-la). Alguns autores acrescentam **autenticidade** (garantir a identidade de quem produziu ou enviou a informação) e **não repúdio** (impedir que o autor negue a autoria de uma ação).

Entre os tipos de **malware**, a distinção mais cobrada é: **vírus** (programa que se anexa a um arquivo hospedeiro e precisa da execução deste para se propagar); **worm** (verme, se propaga automaticamente pela rede, sem necessidade de um arquivo hospedeiro ou ação do usuário, explorando vulnerabilidades); **trojan** (cavalo de troia, se disfarça de programa legítimo para induzir o usuário a executá-lo, geralmente abrindo uma porta de acesso ao invasor); **spyware** (monitora e coleta informações do usuário sem seu conhecimento, como hábitos de navegação); **keylogger** (tipo específico de spyware que registra as teclas digitadas, capturando senhas e dados sensíveis); **ransomware** (sequestra dados, geralmente criptografando arquivos, e exige pagamento de resgate para restaurar o acesso); **adware** (exibe propagandas indesejadas, podendo ser malicioso ou apenas incômodo).

O **phishing** não é tecnicamente um malware, mas uma técnica de **engenharia social**: mensagens fraudulentas (e-mail, SMS, mensagem) que se passam por instituições confiáveis para induzir a vítima a fornecer dados sensíveis (senhas, dados bancários) ou clicar em links maliciosos.

Ferramentas de proteção incluem o **antivírus** (detecta e remove malware conhecido, geralmente por assinatura ou comportamento), o **firewall** (controla o tráfego de rede, permitindo ou bloqueando conexões conforme regras definidas, funcionando como uma barreira entre a rede interna e externa) e o **backup** (cópia de segurança dos dados, essencial para recuperação em caso de perda, corrupção ou ataque de ransomware).

A **criptografia** protege a confidencialidade dos dados, podendo ser **simétrica** (mesma chave para criptografar e descriptografar, mais rápida, mas exige compartilhamento seguro da chave) ou **assimétrica** (par de chaves pública/privada — o que uma criptografa, só a outra descriptografa —, usada, por exemplo, na assinatura digital e em conexões HTTPS).

## Como a Cebraspe cobra este assunto

O item costuma descrever o comportamento de um malware específico (se propaga sozinho pela rede, sem ação do usuário, por exemplo) e pergunta se a classificação atribuída (worm, vírus, trojan) está correta — a confusão entre vírus (precisa de hospedeiro e execução) e worm (autopropagação) é a mais recorrente.

## Pegadinhas e palavras-armadilha

- Vírus: precisa de **arquivo hospedeiro e execução** pelo usuário para se propagar. Worm: propaga-se **sozinho** pela rede, sem hospedeiro nem ação do usuário.
- Trojan: se disfarça de programa **legítimo** — não se autorreplica como vírus/worm, geralmente abre acesso ao invasor.
- Keylogger é um tipo específico de **spyware**, voltado à captura de teclas digitadas.
- Phishing é técnica de **engenharia social**, não malware propriamente dito.
- Criptografia assimétrica usa **par de chaves** (pública/privada); simétrica usa **uma única chave** compartilhada.

## Letra de lei

Não se aplica letra de lei específica — o tópico é regido por conceitos técnicos consolidados de segurança da informação, cobrados no padrão usual de concursos.

## Resumo relâmpago para revisão

- CID: confidencialidade, integridade, disponibilidade (+ autenticidade, não repúdio, para alguns autores).
- Vírus (hospedeiro + execução) x Worm (autopropagação) x Trojan (disfarce) x Spyware/Keylogger (monitoramento/captura) x Ransomware (sequestro de dados) x Adware (propaganda).
- Phishing: engenharia social, não malware.
- Firewall: controla tráfego de rede. Antivírus: detecta/remove malware. Backup: recuperação de dados.
- Criptografia simétrica (uma chave) x assimétrica (par de chaves pública/privada).

## Treino rápido

**1.** O worm, ao contrário do vírus, é capaz de se propagar automaticamente por meio de rede, sem necessidade de um arquivo hospedeiro ou de ação direta do usuário.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** O trojan (cavalo de troia) caracteriza-se pela autorreplicação automática, disseminando-se de forma independente entre diferentes computadores de uma rede.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** O trojan se disfarça de programa legítimo para induzir sua execução, mas não se autorreplica automaticamente como vírus ou worm.

**3.** O phishing é uma técnica de engenharia social que utiliza mensagens fraudulentas para induzir a vítima a fornecer dados sensíveis ou acessar links maliciosos.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** A criptografia assimétrica utiliza uma única chave, compartilhada entre remetente e destinatário, para criptografar e descriptografar a informação.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A criptografia assimétrica utiliza um par de chaves distintas (pública e privada); o uso de uma única chave compartilhada caracteriza a criptografia simétrica.
$md4$, true, 4),

('prf-2021', 'Informática', 'Redes de Computadores', 'Redes de Computadores: tipos, topologias e equipamentos', $md5$
## Mapa do tópico — o que cai e por quê

Redes é um tópico mais técnico dentro de Informática, e a Cebraspe costuma testar em nível conceitual — tipos de rede por abrangência, equipamentos básicos e a diferença entre eles, sem exigir profundidade de configuração de rede propriamente dita.

## Teoria essencial

Quanto à **abrangência geográfica**, as redes se classificam em: **LAN** (Local Area Network, rede local, restrita a um ambiente físico limitado, como um escritório ou residência), **MAN** (Metropolitan Area Network, abrangência de uma cidade ou região metropolitana) e **WAN** (Wide Area Network, abrangência ampla, como um país ou continente — a internet é o maior exemplo de WAN).

Os principais **equipamentos de rede**: o **hub** é um equipamento simples que retransmite o sinal recebido para todas as portas, sem inteligência de encaminhamento (tecnologia hoje praticamente obsoleta); o **switch** encaminha os dados apenas para a porta de destino correta, identificada pelo endereço MAC, sendo mais eficiente que o hub; o **roteador** (router) interliga redes diferentes, direcionando o tráfego entre elas com base no endereço IP, sendo o equipamento que conecta a rede local à internet; o **modem** converte sinais digitais em analógicos (e vice-versa) para transmissão pela linha de acesso à internet (hoje muitos equipamentos combinam modem e roteador em um único aparelho).

O **endereço IP** identifica um dispositivo numa rede, podendo ser **IPv4** (formato de quatro números de 0 a 255, separados por pontos, como 192.168.0.1) ou **IPv6** (formato mais longo, criado para suprir o esgotamento de endereços IPv4). O **endereço MAC** é um identificador físico único, atribuído pelo fabricante à placa de rede do dispositivo, e não muda com a rede à qual o dispositivo se conecta (diferente do IP, que pode variar).

O **Wi-Fi** é o padrão de rede sem fio mais utilizado, baseado no protocolo **IEEE 802.11**, com protocolos de segurança evoluindo de WEP (obsoleto e inseguro) para WPA e WPA2/WPA3 (mais seguros, com criptografia mais robusta). O **Bluetooth** é tecnologia de curto alcance para conexão sem fio entre dispositivos próximos (fones, teclados, transferência de arquivos pequenos), diferente do Wi-Fi em alcance e finalidade típica.

## Como a Cebraspe cobra este assunto

O item costuma testar a diferença entre hub e switch (o switch direciona o tráfego apenas ao destinatário, o hub retransmite para todas as portas), ou pede a classificação correta de uma rede pelo alcance geográfico descrito (LAN, MAN, WAN).

## Pegadinhas e palavras-armadilha

- Hub: retransmite para **todas** as portas (sem inteligência). Switch: encaminha só para o **destino correto** (mais eficiente).
- Roteador: interliga **redes diferentes** (LAN à internet, por exemplo), com base em IP. Switch: opera dentro de uma **mesma rede local**, com base em MAC.
- Endereço MAC: fixo, atribuído pelo fabricante, não muda entre redes. Endereço IP: pode variar conforme a rede.
- WEP é protocolo de segurança Wi-Fi **obsoleto e inseguro** — WPA2/WPA3 são os padrões atuais recomendados.

## Letra de lei

Não se aplica letra de lei específica — o tópico é regido por conceitos técnicos consolidados de redes de computadores.

## Resumo relâmpago para revisão

- LAN (local) x MAN (metropolitana) x WAN (ampla, ex.: internet).
- Hub (retransmite a todos) x Switch (encaminha ao destino, por MAC) x Roteador (interliga redes, por IP) x Modem (converte sinal para acesso à internet).
- IP (pode variar) x MAC (fixo, do fabricante).
- Wi-Fi (IEEE 802.11, WEP obsoleto, WPA2/WPA3 seguros) x Bluetooth (curto alcance).

## Treino rápido

**1.** O switch, ao contrário do hub, encaminha os dados recebidos apenas para a porta correspondente ao dispositivo de destino, identificado pelo endereço MAC.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** O endereço IP de um dispositivo é fixo e definido pelo fabricante, não podendo ser alterado ao conectar-se a redes diferentes.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** O endereço IP pode variar conforme a rede à qual o dispositivo se conecta; o endereço fixo, definido pelo fabricante, é o endereço MAC.

**3.** Uma rede que abrange todo o território de um país, interligando diversas cidades, é classificada como WAN (Wide Area Network).
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**4.** O protocolo de segurança WEP é atualmente considerado o padrão mais seguro para redes Wi-Fi, superior ao WPA2 e ao WPA3.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** O WEP é protocolo obsoleto e inseguro; WPA2 e WPA3 são os padrões atuais mais seguros.
$md5$, true, 5),

('prf-2021', 'Informática', 'Computação em Nuvem', 'Computação em Nuvem: modelos de serviço e implantação', $md6$
## Mapa do tópico — o que cai e por quê

Computação em nuvem é um tópico mais conceitual e recente dentro de Informática, cobrado principalmente através dos modelos de serviço (o que a nuvem oferece) e de implantação (onde a nuvem está hospedada) — a Cebraspe gosta de testar a sigla de cada modelo e um exemplo prático correspondente.

## Teoria essencial

**Computação em nuvem** é o modelo de disponibilização de recursos computacionais (armazenamento, processamento, software) sob demanda, pela internet, sem necessidade de o usuário possuir ou gerenciar diretamente a infraestrutura física correspondente.

Os **modelos de serviço** mais cobrados: **IaaS** (Infrastructure as a Service, infraestrutura como serviço — o provedor oferece recursos de infraestrutura virtualizada, como servidores, armazenamento e rede, cabendo ao usuário instalar e gerenciar sistema operacional, aplicações e dados); **PaaS** (Platform as a Service, plataforma como serviço — o provedor oferece um ambiente completo para desenvolvimento e implantação de aplicações, incluindo sistema operacional e ferramentas, cabendo ao usuário apenas desenvolver e gerenciar suas próprias aplicações); **SaaS** (Software as a Service, software como serviço — o provedor oferece a aplicação pronta para uso final, acessível via navegador ou aplicativo, sem que o usuário precise instalar ou gerenciar nada além de usar o software, como e-mail baseado em nuvem ou editores de texto online).

Os **modelos de implantação**: **nuvem pública** (infraestrutura compartilhada entre múltiplos clientes, gerenciada por um provedor terceiro, geralmente mais econômica); **nuvem privada** (infraestrutura dedicada a uma única organização, oferecendo maior controle e segurança, podendo ser hospedada internamente ou por terceiro de forma exclusiva); **nuvem híbrida** (combinação de nuvem pública e privada, permitindo que dados e aplicações transitem entre ambas, conforme necessidade); **nuvem comunitária** (compartilhada por organizações com interesses comuns, como especificidades regulatórias de um mesmo setor).

Entre as vantagens da computação em nuvem, destacam-se a **elasticidade** (capacidade de aumentar ou diminuir recursos conforme a demanda, de forma ágil), a **redução de custo de infraestrutura própria** (o cliente paga pelo uso, sem investimento inicial em hardware) e o **acesso remoto** a partir de qualquer dispositivo conectado à internet.

## Como a Cebraspe cobra este assunto

O item costuma descrever um cenário (uma empresa usa um serviço de e-mail acessado pelo navegador, sem instalar nada localmente) e pergunta qual modelo de serviço corresponde (nesse caso, SaaS), ou testa se o candidato sabe diferenciar nuvem pública de privada quanto ao compartilhamento de infraestrutura.

## Pegadinhas e palavras-armadilha

- SaaS: aplicação **pronta para uso final** (ex.: e-mail, editor de texto online) — usuário só usa, não desenvolve nem gerencia infraestrutura.
- PaaS: ambiente para **desenvolver** aplicações — usuário gerencia a aplicação, não a infraestrutura/sistema operacional.
- IaaS: infraestrutura **virtualizada** — usuário gerencia sistema operacional, aplicações e dados por conta própria.
- Nuvem pública: infraestrutura **compartilhada** entre clientes. Nuvem privada: infraestrutura **dedicada** a uma única organização.

## Letra de lei

Não se aplica letra de lei específica — o tópico é regido por conceitos técnicos consolidados de computação em nuvem (modelo de referência NIST, amplamente adotado como base conceitual).

## Resumo relâmpago para revisão

- IaaS (infraestrutura) x PaaS (plataforma de desenvolvimento) x SaaS (software pronto para uso).
- Nuvem pública (compartilhada) x privada (dedicada) x híbrida (combinação) x comunitária (grupo com interesse comum).
- Vantagens: elasticidade, redução de custo com infraestrutura própria, acesso remoto.

## Treino rápido

**1.** Um serviço de e-mail acessado inteiramente pelo navegador, sem necessidade de instalação local de software, é um exemplo de modelo SaaS (Software as a Service).
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**

**2.** No modelo IaaS, o provedor de nuvem é responsável por gerenciar diretamente as aplicações e os dados do cliente, cabendo a este apenas o uso final do software.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** No IaaS, o provedor oferece apenas a infraestrutura virtualizada; o gerenciamento de sistema operacional, aplicações e dados é responsabilidade do cliente.

**3.** A nuvem privada caracteriza-se pelo compartilhamento de infraestrutura entre múltiplas organizações distintas, sem qualquer forma de segregação de recursos.
( ) CERTO ( ) ERRADO
**Gabarito: ERRADO.** A nuvem privada é dedicada a uma única organização; o compartilhamento de infraestrutura entre múltiplos clientes é característica da nuvem pública.

**4.** A elasticidade é uma característica da computação em nuvem que permite o aumento ou a redução de recursos computacionais conforme a demanda do usuário.
( ) CERTO ( ) ERRADO
**Gabarito: CERTO.**
$md6$, true, 6);
