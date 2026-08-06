/* Dados compartilhados: materiais, disciplinas, tópicos e helpers do workspace */

const TOPICS = {
  'Língua Portuguesa': ['Compreensão e Interpretação de Textos','Tipologia e Gêneros Textuais','Coesão e Coerência Textual','Funções da Linguagem','Ortografia Oficial','Acentuação Gráfica','Emprego do Sinal Indicativo de Crase','Classes de Palavras','Emprego dos Tempos e Modos Verbais','Sintaxe da Oração e do Período','Termos da Oração','Orações Coordenadas e Subordinadas','Concordância Verbal','Concordância Nominal','Regência Verbal','Regência Nominal','Colocação Pronominal','Pontuação','Significação das Palavras (Semântica)','Reescrita e Equivalência de Frases','Redação Oficial (Manual da Presidência da República)'],
  'Raciocínio Lógico-Matemático': ['Estruturas Lógicas','Lógica Sentencial (Proposicional)','Tabelas-Verdade','Equivalências e Negações (De Morgan)','Lógica de Argumentação: Inferências e Deduções','Diagramas Lógicos','Lógica de Primeira Ordem','Operações com Conjuntos','Problemas Aritméticos e Matriciais','Sequências e Séries','Razão e Proporção','Regra de Três Simples e Composta','Porcentagem','Juros Simples e Compostos','Princípios de Contagem','Análise Combinatória','Probabilidade','Estatística Descritiva','Medidas de Tendência Central e Dispersão','Análise de Gráficos e Tabelas'],
  'Informática': ['Conceitos de Internet e Intranet','Navegadores (Chrome, Firefox, Edge)','Correio Eletrônico','Busca e Pesquisa na Internet','Redes Sociais e Grupos de Discussão','Computação em Nuvem','Organização e Gerenciamento de Arquivos e Pastas','Sistema Operacional Windows 10','Sistema Operacional Linux','Microsoft Word','Microsoft Excel','Microsoft PowerPoint','LibreOffice (Writer, Calc, Impress)','Segurança da Informação: Conceitos e Procedimentos','Vírus, Worms e Pragas Virtuais','Antivírus, Firewall e Antispyware','Criptografia e Certificação Digital','Procedimentos de Backup','Redes de Computadores','Noções de Banco de Dados'],
  'Física': ['Grandezas, Unidades e Vetores','Cinemática: MRU e MRUV','Lançamentos e Movimento Circular','Leis de Newton','Força de Atrito','Trabalho e Potência','Energia e Conservação da Energia Mecânica','Quantidade de Movimento e Colisões','Estática e Equilíbrio de Corpos','Gravitação Universal','Hidrostática','Termologia e Calorimetria','Termodinâmica','Óptica Geométrica','Ondulatória e Acústica','Eletrostática','Eletrodinâmica e Circuitos Elétricos','Eletromagnetismo','Física Aplicada ao Trânsito: Frenagem e Colisões'],
  'Ética no Serviço Público': ['Ética e Moral: Conceitos Fundamentais','Ética, Princípios e Valores','Ética e Democracia: Exercício da Cidadania','Ética e Função Pública','Ética no Setor Público','Código de Ética do Servidor (Decreto 1.171/1994)','Comissões de Ética','Lei 8.112/1990: Deveres e Proibições','Regime Disciplinar e Responsabilidades do Servidor','Improbidade Administrativa (Lei 8.429/1992)','Conflito de Interesses (Lei 12.813/2013)','Código de Conduta da Alta Administração Federal','Lei de Acesso à Informação (12.527/2011)','Processo Administrativo (Lei 9.784/1999)'],
  'Geopolítica Brasileira': ['Formação Territorial do Brasil','Organização Político-Administrativa','Regionalização do Brasil (IBGE e Geoeconômica)','Fronteiras e Faixa de Fronteira','Países Limítrofes e Integração Sul-Americana','Domínios Morfoclimáticos','Recursos Naturais e Meio Ambiente','Amazônia e Questões Ambientais','Dinâmica Demográfica e Migrações','Urbanização e Rede Urbana','Estrutura Fundiária e Questão Agrária','Economia Brasileira e Setores Produtivos','Matriz Energética','Transportes e Logística Nacional','Rodovias Federais e Malha Viária','Comércio Exterior e Mercosul','Brasil no Cenário Geopolítico Mundial','Segurança Pública, Fronteiras e Crime Transnacional','Ecoturismo e Patrimônio Ambiental'],
  'Língua Inglesa': ['Reading Comprehension','Vocabulary and Cognates','Word Formation','Verb Tenses','Modal Verbs','Passive Voice','Conditional Sentences','Relative Clauses','Reported Speech','Pronouns','Adjectives and Adverbs','Prepositions','Conjunctions and Connectors','Phrasal Verbs','Textual Interpretation of Technical Texts'],
  'Língua Espanhola': ['Comprensión de Textos Escritos','Vocabulario y Falsos Cognados','Artículos y Sustantivos','Adjetivos','Pronombres','Tiempos Verbales del Indicativo','Modo Subjuntivo','Perífrasis Verbales','Preposiciones','Conectores y Marcadores Discursivos','Voz Pasiva','Oraciones Condicionales','Acentuación y Ortografía','Heterogenéricos, Heterotónicos y Heterosemánticos'],
  'Legislação de Trânsito': ['Disposições Preliminares do CTB','Sistema Nacional de Trânsito: Composição e Competências','Normas Gerais de Circulação e Conduta','Educação para o Trânsito','Sinalização de Trânsito','Engenharia de Tráfego, Operação e Fiscalização','Policiamento Ostensivo de Trânsito','Veículos: Classificação e Segurança','Registro e Licenciamento de Veículos','Condução de Escolares e Transporte de Passageiros','Habilitação: CNH e Permissão para Dirigir','Infrações de Trânsito','Penalidades','Medidas Administrativas','Processo Administrativo: Autuação, Defesa e Recursos (JARI/CETRAN)','Crimes de Trânsito','Resoluções do CONTRAN','Transporte de Cargas: Pesos e Dimensões','Transporte de Produtos Perigosos','Equipamentos Obrigatórios e Dispositivos de Retenção','Anexo I do CTB: Conceitos e Definições','Direção Defensiva','Primeiros Socorros no Trânsito'],
  'Direito Administrativo': ['Estado, Governo e Administração Pública','Conceito, Fontes e Princípios do Direito Administrativo','Regime Jurídico-Administrativo','Organização Administrativa: Direta e Indireta','Autarquias, Fundações, Empresas Públicas e Sociedades de Economia Mista','Entidades Paraestatais e Terceiro Setor','Poderes Administrativos','Poder de Polícia','Ato Administrativo: Conceito, Requisitos e Atributos','Classificação e Espécies de Atos Administrativos','Extinção e Invalidação dos Atos Administrativos','Processo Administrativo (Lei 9.784/1999)','Agentes Públicos: Classificação e Regime','Lei 8.112/1990: Provimento e Vacância','Direitos, Vantagens e Deveres do Servidor','Processo Administrativo Disciplinar','Licitações: Lei 14.133/2021','Licitações: Lei 8.666/1993 e Pregão (Lei 10.520/2002)','Contratos Administrativos','Serviços Públicos: Concessão e Permissão (Lei 8.987/1995)','Controle da Administração Pública','Controle Externo e Tribunal de Contas','Responsabilidade Civil do Estado','Improbidade Administrativa (Lei 8.429/1992)','Bens Públicos','Intervenção do Estado na Propriedade','Lei de Acesso à Informação (12.527/2011)'],
  'Direito Constitucional': ['Constituição: Conceito, Classificação e Aplicabilidade das Normas','Poder Constituinte','Princípios Fundamentais','Direitos e Deveres Individuais e Coletivos','Remédios Constitucionais','Direitos Sociais','Nacionalidade','Direitos Políticos','Partidos Políticos','Organização Político-Administrativa do Estado','Repartição de Competências','União, Estados, Distrito Federal e Municípios','Intervenção Federal','Administração Pública na Constituição (arts. 37 a 41)','Servidores Públicos na Constituição','Poder Legislativo: Organização e Atribuições','Processo Legislativo','Fiscalização Contábil, Financeira e Orçamentária','Poder Executivo: Atribuições e Responsabilidades','Poder Judiciário: Organização e Competências','Funções Essenciais à Justiça','Defesa do Estado e das Instituições Democráticas','Segurança Pública (art. 144) e a Polícia Rodoviária Federal','Controle de Constitucionalidade','Ordem Econômica e Financeira','Ordem Social'],
  'Direito Penal': ['Aplicação da Lei Penal e Princípios','Lei Penal no Tempo','Lei Penal no Espaço','Teoria do Crime: Fato Típico','Nexo Causal e Imputação Objetiva','Ilicitude e Excludentes','Culpabilidade e Excludentes','Imputabilidade Penal','Crime Consumado e Tentado','Desistência Voluntária e Arrependimento','Erro de Tipo e Erro de Proibição','Concurso de Pessoas','Concurso de Crimes','Penas: Espécies e Cominação','Aplicação da Pena e Dosimetria','Efeitos da Condenação e Medidas de Segurança','Suspensão Condicional da Pena e Livramento Condicional','Extinção da Punibilidade e Prescrição','Crimes contra a Pessoa','Crimes contra o Patrimônio','Crimes contra a Dignidade Sexual','Crimes contra a Fé Pública','Crimes contra a Incolumidade Pública','Crimes contra a Administração Pública','Crimes Praticados por Funcionário Público'],
  'Direito Processual Penal': ['Princípios e Aplicação da Lei Processual Penal','Inquérito Policial','Polícia Judiciária e Polícia Administrativa','Ação Penal Pública e Privada','Jurisdição e Competência','Prova: Princípios e Meios de Prova','Ônus da Prova e Cadeia de Custódia','Busca e Apreensão','Interceptação Telefônica (Lei 9.296/1996)','Prisão em Flagrante','Prisão Preventiva e Temporária','Medidas Cautelares Diversas da Prisão','Liberdade Provisória e Fiança','Audiência de Custódia','Citações e Intimações','Sentença Penal','Procedimentos Comuns e Especiais','Tribunal do Júri','Nulidades','Recursos em Espécie','Habeas Corpus e Mandado de Segurança Criminal','Juizados Especiais Criminais (Lei 9.099/1995)','Acordo de Não Persecução Penal'],
  'Legislação Penal Especial': ['Lei de Drogas (11.343/2006)','Estatuto do Desarmamento (10.826/2003)','Crimes Hediondos (8.072/1990)','Lei de Tortura (9.455/1997)','Lei Maria da Penha (11.340/2006)','Abuso de Autoridade (13.869/2019)','Organização Criminosa (12.850/2013)','Lavagem de Dinheiro (9.613/1998)','Crimes Ambientais (9.605/1998)','Estatuto da Criança e do Adolescente: Aspectos Penais','Estatuto do Idoso: Aspectos Penais','Contravenções Penais (DL 3.688/1941)','Crimes de Trânsito (Lei 9.503/1997)','Identificação Criminal (Lei 12.037/2009)','Terrorismo (Lei 13.260/2016)','Tráfico de Pessoas (Lei 13.344/2016)','Crimes de Trânsito e Legislação Extravagante Correlata'],
  'Direitos Humanos e Cidadania': ['Teoria Geral dos Direitos Humanos','Afirmação Histórica e Dimensões dos Direitos Humanos','Declaração Universal dos Direitos Humanos (1948)','Sistema Global de Proteção (ONU)','Pactos Internacionais de 1966','Sistema Interamericano e Pacto de San José','Corte Interamericana de Direitos Humanos','Direitos Humanos na Constituição de 1988','Incorporação de Tratados Internacionais','Programa Nacional de Direitos Humanos (PNDH-3)','Código de Conduta para Encarregados da Aplicação da Lei','Princípios Básicos sobre o Uso da Força e Armas de Fogo','Regras de Mandela e Tratamento de Presos','Direitos Humanos e Atividade Policial','Convenção contra a Tortura','Convenção sobre a Eliminação da Discriminação Racial','Convenção sobre os Direitos da Criança','Convenção sobre os Direitos das Pessoas com Deficiência','Estatuto da Igualdade Racial (Lei 12.288/2010)','Cidadania e Participação Social']
};


/* concurso_id -> disciplinas */
const DISCIPLINAS_POR_CONCURSO = {
  'prf-2021': ['Língua Portuguesa','Raciocínio Lógico-Matemático','Informática','Física','Ética no Serviço Público','Geopolítica Brasileira','Língua Inglesa','Língua Espanhola','Legislação de Trânsito','Direito Administrativo','Direito Constitucional','Direito Penal','Direito Processual Penal','Legislação Penal Especial','Direitos Humanos e Cidadania'],
  'ctb': ['Legislação de Trânsito','Direito Administrativo','Direito Penal','Direito Processual Penal','Ética no Serviço Público','Direitos Humanos e Cidadania'],
  'dconst': ['Direito Constitucional'],
  'portugues': ['Língua Portuguesa','Raciocínio Lógico-Matemático','Língua Inglesa','Língua Espanhola'],
  'info': ['Informática','Física'],
  'biologia': ['Física','Informática','Língua Portuguesa','Raciocínio Lógico-Matemático','Língua Inglesa'],
  'dadm': ['Direito Administrativo'],
  'cf88': ['Direito Constitucional','Direito Administrativo','Direito Penal','Direito Processual Penal','Direitos Humanos e Cidadania','Ética no Serviço Público','Geopolítica Brasileira','Legislação Penal Especial','Língua Portuguesa'],
  'lei9503': ['Legislação de Trânsito','Direito Administrativo','Direito Penal'],
  'lei8112': ['Direito Administrativo','Ética no Serviço Público'],
  'pf-2026': []
};

const MATERIALS = [
  { id:'prf-2021', title:'Concurso PRF', type:'Edital', folder:'Concursos', disc:15, top:96, pag:214, envio:'12/03/2026', acesso:'hoje', tempo:'14h32', pct:18 },
  { id:'pf-2026', title:'Concurso PF', type:'Edital', folder:'Concursos', disc:0, top:0, pag:0, envio:'—', acesso:'—', tempo:'—', pct:0, soon:true },
];

/* Indicadores visuais de status */
const STATUS_META = {
  nao: { dot: '🔴', label: 'Não Familiar', color: '#EF4444' },
  apr: { dot: '🟡', label: 'Aprendendo',   color: '#F59E0B' },
  fam: { dot: '🟢', label: 'Familiar',     color: '#22C55E' },
  dom: { dot: '🔵', label: 'Dominado',     color: '#3B82F6' },
};

function dotHTML(st) {
  const c = (STATUS_META[st] || STATUS_META.nao).color;
  return `<span class="sdot" style="background:${c}"></span>`;
}

function disciplinasDe(id) {
  return DISCIPLINAS_POR_CONCURSO[id] || Object.keys(TOPICS);
}

function materialById(id) {
  return MATERIALS.find(m => m.id === id);
}

/* hash determinístico */
function _hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 99991;
  return h;
}

/* ---- Marcação manual do aluno: tópico estudado + anotações ---- */
const PX_STUDY_KEY = 'px_topicos_estudados_v1';
function pxStudyAll() {
  try { return JSON.parse(localStorage.getItem(PX_STUDY_KEY)) || {}; } catch (e) { return {}; }
}
function pxStudySaveAll(all) {
  try { localStorage.setItem(PX_STUDY_KEY, JSON.stringify(all)); } catch (e) {}
}
function pxStudyGet(topic) {
  return pxStudyAll()[topic] || { done: false, note: '' };
}
function pxStudySet(topic, patch) {
  const all = pxStudyAll();
  all[topic] = Object.assign({ done: false, note: '' }, all[topic], patch, { ts: Date.now() });
  pxStudySaveAll(all);
  return all[topic];
}
function pxStudyToggle(topic) {
  const cur = pxStudyGet(topic);
  return pxStudySet(topic, { done: !cur.done });
}

/* status pseudo-determinístico por tópico (com override do aluno) */
function statusOf(name) {
  if (pxStudyGet(name).done) return 'dom';
  const r = _hash(name) % 100;
  return r < 30 ? 'nao' : r < 58 ? 'apr' : r < 84 ? 'fam' : 'dom';
}

function progressOf(name) {
  if (pxStudyGet(name).done) return 100;
  const st = statusOf(name);
  const base = { nao: 5, apr: 35, fam: 65, dom: 90 }[st];
  return Math.min(99, base + (_hash(name) % 10));
}

/* ---- Validação de cobertura do edital ----
   EDITAL_REF é a referência oficial por disciplina (capítulo do edital).
   Tudo que estiver na referência e não estiver em TOPICS aparece como "faltando". */
const EDITAL_REF = {};

function coberturaEdital(concursoId) {
  const discs = disciplinasDe(concursoId || 'prf-2021');
  return discs.map(d => {
    const app = TOPICS[d] || [];
    const ref = EDITAL_REF[d] || app;
    const cobertos = ref.filter(t => app.includes(t));
    const faltando = ref.filter(t => !app.includes(t));
    const extras = app.filter(t => !ref.includes(t));
    const estudados = app.filter(t => pxStudyGet(t).done);
    const pct = ref.length ? Math.round((cobertos.length / ref.length) * 100) : 100;
    return { disc: d, app, ref, cobertos, faltando, extras, estudados, pct };
  });
}


function disciplinaInfo(nome) {
  const topics = (TOPICS[nome] || []).map(t => ({ name: t, st: statusOf(t), prog: progressOf(t) }));
  const pct = topics.length ? Math.round(topics.reduce((a, t) => a + t.prog, 0) / topics.length) : 0;
  return { name: nome, topics, pct };
}

/* estatísticas do painel inteligente do workspace */
function topicStats(name) {
  const h = _hash(name);
  const st = statusOf(name);
  return {
    dominio: progressOf(name),
    tempo: `${1 + (h % 6)}h${String(h % 60).padStart(2, '0')}`,
    questoes: 12 + (h % 80),
    acertos: 55 + (h % 40),
    flashcards: 8 + (h % 30),
    revisao: ['Hoje', 'Amanhã', 'Em 3 dias', 'Em 1 semana'][h % 4],
    dificuldade: ['Fácil', 'Média', 'Alta'][h % 3],
    acesso: ['Hoje', 'Ontem', 'Há 3 dias'][h % 3],
    status: st,
  };
}

/* Índice para a pesquisa global */
function searchIndex() {
  const items = [];
  MATERIALS.forEach(m => {
    items.push({ kind: 'Material', label: m.title, sub: m.type, href: materialHref(m) });
    disciplinasDe(m.id).forEach(d => {
      const dHref = `disciplina.html?id=${encodeURIComponent(m.id)}&title=${encodeURIComponent(m.title)}&type=${encodeURIComponent(m.type)}&disc=${encodeURIComponent(d)}`;
      items.push({ kind: 'Disciplina', label: d, sub: m.title, href: dHref });
      (TOPICS[d] || []).forEach(t => {
        const base = `id=${encodeURIComponent(m.id)}&title=${encodeURIComponent(m.title)}&type=${encodeURIComponent(m.type)}&disc=${encodeURIComponent(d)}&topic=${encodeURIComponent(t)}`;
        items.push({ kind: 'Tópico', label: t, sub: `${m.title} · ${d}`, href: `workspace.html?${base}` });
        items.push({ kind: 'Flashcards', label: `Flashcards de ${t}`, sub: d, href: `workspace.html?${base}&tab=flashcards` });
        items.push({ kind: 'Questões', label: `Questões de ${t}`, sub: d, href: `workspace.html?${base}&tab=questoes` });
        items.push({ kind: 'Lição', label: `Lição de ${t}`, sub: d, href: `workspace.html?${base}&tab=tutor` });
        items.push({ kind: 'Anotação', label: `Anotações de ${t}`, sub: d, href: `workspace.html?${base}&tab=anotacoes` });
      });
    });
  });
  return items;
}

/* Regra de roteamento: >1 disciplina abre a grid de disciplinas; 1 disciplina vai direto aos tópicos */
function materialHref(m) {
  if (m.soon) return 'javascript:void(0)';
  const base = `id=${encodeURIComponent(m.id)}&type=${encodeURIComponent(m.type)}&title=${encodeURIComponent(m.title)}`;
  const discs = disciplinasDe(m.id);
  if (discs.length > 1) return `disciplinas.html?${base}`;
  return `disciplina.html?${base}&disc=${encodeURIComponent(discs[0])}`;
}

/* classe de cor semântica da barra de progresso */
function fillClass(pct) {
  return pct < 40 ? 'lvl-low' : pct <= 70 ? 'lvl-mid' : 'lvl-high';
}

/* categoria visual da disciplina (borda esquerda colorida) */
const AREA_DIREITO = ['Direito Constitucional','Direito Administrativo','Direito Penal','Direito Processual Penal','Direitos Humanos e Cidadania','Ética no Serviço Público'];
const AREA_TRANSITO = ['Legislação de Trânsito','Legislação Penal Especial'];
function areaClass(nome) {
  if (AREA_TRANSITO.includes(nome)) return 'area-transito';
  if (AREA_DIREITO.includes(nome)) return 'area-direito';
  return 'area-basica';
}

/* Itens do menu do tópico (workspace), agrupados por objetivo */
const WS_TABS = [
  { id:'tutor', group:'Aprender', ic:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 8l10 5 10-5z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>`, label:'Aula com Athena IA' },
  { id:'podcast', group:'Aprender', ic:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="13" width="4" height="7" rx="2"/><rect x="17.5" y="13" width="4" height="7" rx="2"/></svg>`, label:'Podcast' },
  { id:'questoes', group:'Praticar', ic:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.6 2.6 0 1 1 3.4 2.5c-.6.2-.9.8-.9 1.4v.4"/><path d="M12 17h.01"/></svg>`, label:'Questões' },
  { id:'simulados', group:'Praticar', ic:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m15 9-4.5 1.5L9 15l4.5-1.5z"/></svg>`, label:'Simulado' },
  { id:'flashcards', group:'Praticar', ic:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="14" height="12" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v11"/></svg>`, label:'Flashcards' },
  { id:'resumo', group:'Praticar', ic:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16M4 10h10M4 15h16M4 20h7"/></svg>`, label:'Revisão Inteligente' },

  { id:'revisao', group:'Revisar', ic:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/><path d="M12 8v4l2.5 2"/></svg>`, label:'Revisão Espaçada' },
  { id:'anotacoes', group:'Revisar', ic:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`, label:'Anotações' },
  { id:'evolucao', group:'Evolução', ic:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>`, label:'Estatísticas' },
];

/* Monta o menu agrupado do tópico. render(tab) deve devolver o HTML do item. */
function wsMenuHTML(render) {
  const cronoIc = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/></svg>`;
  let out = `<a class="ws-item" href="cronograma.html" style="text-decoration:none;"><span class="ic">${cronoIc}</span><span>Cronograma</span></a>`;
  let last = null;
  WS_TABS.forEach(t => {
    if (t.group !== last) { out += `<div class="shell-sec ws-group">${t.group}</div>`; last = t.group; }
    out += render(t);
  });
  return out;
}

/* ===== Peso do edital x incidência em provas PRF (Cebraspe) =====
   incidencia: 0-100 (quanto cai em prova) · peso: itens/questões típicas */
const PESO_EDITAL = {
  'Língua Portuguesa': { peso: 12, incidencia: 92 },
  'Raciocínio Lógico-Matemático': { peso: 8, incidencia: 74 },
  'Informática': { peso: 8, incidencia: 70 },
  'Física': { peso: 6, incidencia: 55 },
  'Ética no Serviço Público': { peso: 5, incidencia: 60 },
  'Geopolítica Brasileira': { peso: 6, incidencia: 58 },
  'Língua Inglesa': { peso: 5, incidencia: 45 },
  'Língua Espanhola': { peso: 5, incidencia: 40 },
  'Legislação de Trânsito': { peso: 14, incidencia: 96 },
  'Direito Administrativo': { peso: 10, incidencia: 85 },
  'Direito Constitucional': { peso: 10, incidencia: 88 },
  'Direito Penal': { peso: 9, incidencia: 80 },
  'Direito Processual Penal': { peso: 8, incidencia: 72 },
  'Legislação Penal Especial': { peso: 7, incidencia: 68 },
  'Direitos Humanos e Cidadania': { peso: 6, incidencia: 62 },
};

function pesoDe(disc) {
  return PESO_EDITAL[disc] || { peso: 5, incidencia: 50 };
}

/* Prioridade adaptativa de um tópico: incidência + peso do edital + fraqueza do aluno */
function prioridadeTopico(disc, topico) {
  const p = pesoDe(disc);
  const dominio = progressOf(topico);
  const fraqueza = 100 - dominio;
  const dif = { 'Fácil': 0, 'Média': 8, 'Alta': 16 }[topicStats(topico).dificuldade] || 0;
  return Math.round(p.incidencia * 0.4 + p.peso * 2.2 + fraqueza * 0.5 + dif);
}



/* ============ Material próprio do aluno (fora do curso) ============
   Disciplinas criadas pelo aluno a partir de PDF, link, texto ou gravação.
   Persistidas no navegador e injetadas nas mesmas estruturas do curso,
   de modo que todas as ferramentas (workspace, chat, flashcards, etc.)
   funcionem igual às disciplinas prontas. */
const MEU_ID = 'meu-material';
const PX_STORE_KEY = 'px_meu_material_v1';

function meuMaterialGet() {
  try { return JSON.parse(localStorage.getItem(PX_STORE_KEY)) || []; }
  catch (e) { return []; }
}
function meuMaterialSave(list) {
  try { localStorage.setItem(PX_STORE_KEY, JSON.stringify(list)); } catch (e) {}
  meuMaterialMount();
}
function meuMaterialAdd(disc) {
  const list = meuMaterialGet();
  list.push(disc);
  meuMaterialSave(list);
  return disc;
}
function meuMaterialRemove(name) {
  meuMaterialSave(meuMaterialGet().filter(d => d.name !== name));
}

/* injeta as disciplinas do aluno nas estruturas globais */
function meuMaterialMount() {
  const list = meuMaterialGet();
  DISCIPLINAS_POR_CONCURSO[MEU_ID] = list.map(d => d.name);
  list.forEach(d => { TOPICS[d.name] = d.topics && d.topics.length ? d.topics : ['Conteúdo geral']; });
  const idx = MATERIALS.findIndex(m => m.id === MEU_ID);
  const entry = {
    id: MEU_ID, title: 'Meu Material', type: 'Pessoal', folder: 'Pessoais',
    disc: list.length, top: list.reduce((a, d) => a + (d.topics || []).length, 0),
    pag: 0, envio: '—', acesso: 'hoje', tempo: '—',
    pct: list.length ? Math.round(list.reduce((a, d) => a + disciplinaInfo(d.name).pct, 0) / list.length) : 0,
  };
  if (list.length) { if (idx >= 0) MATERIALS[idx] = entry; else MATERIALS.push(entry); }
  else if (idx >= 0) MATERIALS.splice(idx, 1);
}
meuMaterialMount();

/* ============ Curso em destaque ============ */
const CURSOS = [
  {
    id: 'prf-2021',
    nome: 'Curso Polícia Rodoviária Federal',
    tag: 'CURSO COMPLETO',
    capa: 'curso-prf.jpg',
    resumo: 'Curso completo para a PRF: planejamento de estudos, aulas com a Athena IA, flashcards, questões e simulados no padrão Cebraspe.',
    bullets: ['15 disciplinas do edital', '96 tópicos com trilha guiada', 'Questões e simulados Certo/Errado', 'Revisão espaçada e inteligente'],
  },
];

/* ============ Continue de onde parou ============
   Guarda o último tópico aberto por disciplina (e o global). */
const PX_LAST_KEY = 'px_ultimo_topico_v1';

function pxLastAll() {
  try { return JSON.parse(localStorage.getItem(PX_LAST_KEY)) || {}; }
  catch (e) { return {}; }
}
function pxLastSet(entry) {
  if (!entry || !entry.disc || !entry.topic) return;
  const all = pxLastAll();
  const rec = { ...entry, ts: Date.now() };
  all['disc:' + entry.disc] = rec;
  all.__global = rec;
  try { localStorage.setItem(PX_LAST_KEY, JSON.stringify(all)); } catch (e) {}
}
function pxLastGet(disc) {
  const all = pxLastAll();
  return (disc ? all['disc:' + disc] : all.__global) || null;
}

/* Total de tópicos do edital calculado a partir de TOPICS */
(function () {
  const m = MATERIALS.find(x => x.id === 'prf-2021');
  if (m) {
    const ds = DISCIPLINAS_POR_CONCURSO['prf-2021'];
    m.disc = ds.length;
    m.top = ds.reduce((a, d) => a + (TOPICS[d] || []).length, 0);
  }
})();
