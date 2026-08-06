/* Dados compartilhados: materiais, disciplinas, tópicos e helpers do workspace */

const TOPICS = {
  'Língua Portuguesa': ['Compreensão e Interpretação de Textos','Ortografia Oficial','Acentuação Gráfica','Classes de Palavras','Sintaxe da Oração e do Período','Concordância Verbal e Nominal','Regência','Pontuação','Redação Oficial'],
  'Raciocínio Lógico-Matemático': ['Estruturas Lógicas','Lógica de Argumentação','Diagramas Lógicos','Razão e Proporção','Porcentagem e Juros','Análise Combinatória','Probabilidade','Estatística Básica'],
  'Informática': ['Conceitos de Internet e Intranet','Sistemas Operacionais','Editores de Texto e Planilhas','Segurança da Informação','Redes de Computadores','Computação em Nuvem'],
  'Física': ['Cinemática','Dinâmica','Energia e Trabalho','Colisões e Quantidade de Movimento','Óptica','Eletricidade Básica'],
  'Ética no Serviço Público': ['Código de Ética do Servidor','Moralidade Administrativa','Improbidade Administrativa','Conflito de Interesses'],
  'Geopolítica Brasileira': ['Formação Territorial','Fronteiras e Faixa de Fronteira','Recursos Naturais','Rodovias e Logística Nacional','Segurança Pública e Geopolítica'],
  'Língua Inglesa': ['Reading Comprehension','Vocabulary','Verb Tenses','Prepositions and Connectors'],
  'Língua Espanhola': ['Comprensión Lectora','Vocabulario','Tiempos Verbales','Conectores'],
  'Legislação de Trânsito': ['Sistema Nacional de Trânsito','Normas Gerais de Circulação','Sinalização de Trânsito','Habilitação','Infrações e Penalidades','Crimes de Trânsito','Registro e Licenciamento de Veículos'],
  'Direito Administrativo': ['Princípios da Administração Pública','Atos Administrativos','Poderes Administrativos','Licitações e Contratos','Servidores Públicos','Responsabilidade Civil do Estado','Controle da Administração'],
  'Direito Constitucional': ['Poder Constituinte','Princípios Fundamentais','Direitos e Garantias Fundamentais','Nacionalidade','Direitos Políticos','Organização do Estado','Administração Pública','Segurança Pública','Controle de Constitucionalidade'],
  'Direito Penal': ['Aplicação da Lei Penal','Teoria do Crime','Crimes contra a Pessoa','Crimes contra o Patrimônio','Crimes contra a Administração Pública','Penas e Medidas de Segurança'],
  'Direito Processual Penal': ['Inquérito Policial','Ação Penal','Prova','Prisão e Medidas Cautelares','Competência','Habeas Corpus'],
  'Legislação Penal Especial': ['Lei de Drogas (11.343/06)','Estatuto do Desarmamento','Lei de Tortura','Crimes Hediondos','Lei Maria da Penha','Abuso de Autoridade'],
  'Direitos Humanos e Cidadania': ['Declaração Universal dos Direitos Humanos','Convenções Internacionais','Direitos Humanos na Constituição','Cidadania e Participação Social']
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
  'lei8112': ['Direito Administrativo','Ética no Serviço Público']
};

const MATERIALS = [
  { id:'prf-2021', title:'Concurso PRF 2021', type:'Edital', folder:'Concursos', disc:15, top:96, pag:214, envio:'12/03/2026', acesso:'hoje', tempo:'14h32', pct:18 },
  { id:'ctb', title:'Código de Trânsito Brasileiro', type:'Legislação', folder:'Direito', disc:6, top:42, pag:138, envio:'02/03/2026', acesso:'ontem', tempo:'6h10', pct:34 },
  { id:'dconst', title:'Apostila de Direito Constitucional', type:'Apostila', folder:'Direito', disc:1, top:9, pag:96, envio:'21/02/2026', acesso:'há 3 dias', tempo:'9h45', pct:52 },
  { id:'portugues', title:'Curso Completo de Português', type:'Curso', folder:'Concursos', disc:4, top:38, pag:180, envio:'15/02/2026', acesso:'há 5 dias', tempo:'11h20', pct:41 },
  { id:'info', title:'Manual de Informática', type:'PDF', folder:'Trabalho', disc:2, top:18, pag:74, envio:'10/02/2026', acesso:'há 1 semana', tempo:'3h05', pct:22 },
  { id:'biologia', title:'Biologia', type:'Livro', folder:'Faculdade', disc:5, top:47, pag:320, envio:'28/01/2026', acesso:'há 2 semanas', tempo:'8h50', pct:12 },
  { id:'dadm', title:'Apostila de Direito Administrativo', type:'Apostila', folder:'Direito', disc:1, top:7, pag:88, envio:'20/01/2026', acesso:'há 2 semanas', tempo:'5h15', pct:29 },
  { id:'cf88', title:'Constituição Federal', type:'Legislação', folder:'Concursos', disc:9, top:64, pag:250, envio:'12/01/2026', acesso:'há 3 semanas', tempo:'12h40', pct:37 },
  { id:'lei9503', title:'Lei 9.503/97', type:'Legislação', folder:'Direito', disc:3, top:21, pag:110, envio:'05/01/2026', acesso:'há 1 mês', tempo:'2h30', pct:15 },
  { id:'lei8112', title:'Lei 8.112/90', type:'Legislação', folder:'Concursos', disc:2, top:16, pag:64, envio:'02/01/2026', acesso:'há 1 mês', tempo:'1h55', pct:8 },
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

/* status pseudo-determinístico por tópico */
function statusOf(name) {
  const r = _hash(name) % 100;
  return r < 30 ? 'nao' : r < 58 ? 'apr' : r < 84 ? 'fam' : 'dom';
}

function progressOf(name) {
  const st = statusOf(name);
  const base = { nao: 5, apr: 35, fam: 65, dom: 90 }[st];
  return Math.min(99, base + (_hash(name) % 10));
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
        items.push({ kind: 'Resumo', label: `Resumo de ${t}`, sub: d, href: `workspace.html?${base}&tab=conteudo` });
        items.push({ kind: 'Anotação', label: `Anotações de ${t}`, sub: d, href: `workspace.html?${base}&tab=anotacoes` });
      });
    });
  });
  return items;
}

/* Regra de roteamento: >1 disciplina abre a grid de disciplinas; 1 disciplina vai direto aos tópicos */
function materialHref(m) {
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
