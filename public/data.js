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
  'lei8112': ['Direito Administrativo','Ética no Serviço Público'],
  'pf-2026': []
};

const MATERIALS = [
  { id:'prf-2021', title:'Concurso PRF', type:'Edital', folder:'Concursos', disc:15, top:96, pag:214, envio:'12/03/2026', acesso:'hoje', tempo:'14h32', pct:18 },
  { id:'pf-2026', title:'Concurso PF', type:'Edital', folder:'Concursos', disc:0, top:0, pag:0, envio:'—', acesso:'—', tempo:'—', pct:0, soon:true },
];

/* ---- Currículo vindo do banco (sincronizado pelo painel administrativo) ----
   px-auth.js grava o cache; aqui ele sobrescreve o currículo local. */
function aplicarCurriculoDoBanco(){
  let cache = null;
  try { cache = JSON.parse(localStorage.getItem('px_curriculo_v1')); } catch(e) {}
  if (!cache || !cache.cursos) return;
  Object.keys(cache.cursos).forEach(slug => {
    const discs = cache.cursos[slug] || {};
    const nomes = Object.keys(discs);
    if (!nomes.length) return;
    DISCIPLINAS_POR_CONCURSO[slug] = nomes;
    nomes.forEach(d => { if ((discs[d] || []).length) TOPICS[d] = discs[d]; });
  });
}
aplicarCurriculoDoBanco();


/* contadores reais dos cards de concurso */
(function atualizarContadores(){
  let prog = {};
  try { prog = JSON.parse(localStorage.getItem('px_prog_cache_v1')) || {}; } catch(e) {}
  let seg = 0, ultimo = null;
  Object.keys(prog).forEach(k => {
    seg += prog[k].tempo_segundos || 0;
    const la = prog[k].last_access_at;
    if (la && (!ultimo || la > ultimo)) ultimo = la;
  });
  MATERIALS.forEach(m => {
    const discs = DISCIPLINAS_POR_CONCURSO[m.id] || [];
    m.disc = discs.length;
    m.top = discs.reduce((a, d) => a + ((TOPICS[d] || []).length), 0);
    if (m.soon) return;
    const tops = discs.reduce((acc, d) => acc.concat(TOPICS[d] || []), []);
    const soma = tops.reduce((a, t) => a + Math.min(100, (prog[t] && prog[t].dominio) || 0), 0);
    m.pct = tops.length ? Math.round(soma / tops.length) : 0;
    const h = Math.floor(seg / 3600), mi = Math.floor((seg % 3600) / 60);
    m.tempo = seg ? (h ? h + 'h' + String(mi).padStart(2, '0') : mi + 'min') : '—';
    m.acesso = ultimo ? (Math.floor((Date.now() - new Date(ultimo).getTime()) / 86400000) <= 0 ? 'hoje' : new Date(ultimo).toLocaleDateString('pt-BR')) : '—';
  });
})();



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

/* ---- Progresso real do aluno (cache do banco, preenchido por px-auth.js) ---- */
const PX_PROG_KEY = 'px_prog_cache_v1';
/* Override em memória: usado pelo painel admin para ver o desempenho de outro aluno
   (somente leitura) sem trocar de conta. null = usa o cache do usuário logado. */
var PX_PROG_OVERRIDE = null;
function pxProgAll() {
  if (PX_PROG_OVERRIDE) return PX_PROG_OVERRIDE;
  try { return JSON.parse(localStorage.getItem(PX_PROG_KEY)) || {}; } catch (e) { return {}; }
}
function pxProgGet(topic) { return pxProgAll()[topic] || null; }

function pxProgSaveAll(map) {
  try { localStorage.setItem(PX_PROG_KEY, JSON.stringify(map || {})); } catch (e) {}
}

/* status real do tópico (banco) com override local de "estudado" */
function statusOf(name) {
  const p = pxProgGet(name);
  if (p && p.status) return p.status;
  if (pxStudyGet(name).done) return 'dom';
  return 'nao';
}

function progressOf(name) {
  const p = pxProgGet(name);
  if (p && typeof p.dominio === 'number' && p.dominio > 0) return Math.min(100, p.dominio);
  if (pxStudyGet(name).done) return 100;
  return 0;
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


/* Rótulo de aula: os tópicos do edital são exibidos como "Aula 00 - Nome".
   A numeração vem do painel administrativo (campo "ordem" de cada tópico);
   se o próprio nome já vier como "Aula 03 - ...", esse número é respeitado. */
let AULA_ORDEM = (function(){
  try { return JSON.parse(localStorage.getItem('px_aulas_v1')) || {}; } catch(e) { return {}; }
})();
function aulaTitulo(nome) {
  const m = /^\s*aula\s*(\d+)\s*[-–—:.]\s*(.+)$/i.exec(String(nome || ''));
  return m ? m[2].trim() : String(nome || '');
}
function aulaNumero(disc, nome) {
  const o = (AULA_ORDEM[disc] || {})[nome];
  if (typeof o === 'number' && o >= 0) return String(o).padStart(2, '0');
  const m = /^\s*aula\s*(\d+)\s*[-–—:.]\s*/i.exec(String(nome || ''));
  if (m) return String(parseInt(m[1], 10)).padStart(2, '0');
  const i = (TOPICS[disc] || []).indexOf(nome);
  return i < 0 ? null : String(i).padStart(2, '0');
}
function aulaLabel(disc, nome) {
  const n = aulaNumero(disc, nome);
  const t = aulaTitulo(nome);
  return n === null ? t : `Aula ${n} - ${t}`;
}
window.aulaNumero = aulaNumero;
window.aulaTitulo = aulaTitulo;
window.aulaLabel = aulaLabel;

/* O painel administrativo pode reordenar/renomear as aulas a qualquer momento:
   quando px-auth.js atualiza o cache, recarregamos currículo + numeração e
   avisamos a tela para redesenhar (window.pxRerender). */
function pxRecarregarCurriculo(){
  try { AULA_ORDEM = JSON.parse(localStorage.getItem('px_aulas_v1')) || {}; } catch(e) { AULA_ORDEM = {}; }
  aplicarCurriculoDoBanco();
  if (typeof window.pxRerender === 'function') { try { window.pxRerender(); } catch(e) {} }
}
window.pxRecarregarCurriculo = pxRecarregarCurriculo;
window.addEventListener('px:curriculo', pxRecarregarCurriculo);
window.addEventListener('storage', function(e){
  if (e && (e.key === 'px_aulas_v1' || e.key === 'px_curriculo_v1')) pxRecarregarCurriculo();
});



function disciplinaInfo(nome) {
  const topics = (TOPICS[nome] || []).map(t => ({ name: t, st: statusOf(t), prog: progressOf(t) }));
  const pct = topics.length ? Math.round(topics.reduce((a, t) => a + t.prog, 0) / topics.length) : 0;
  return { name: nome, topics, pct };
}

/* estatísticas reais do painel inteligente do workspace */
function _fmtTempo(seg) {
  const s = Math.max(0, seg || 0);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h ? `${h}h${String(m).padStart(2, '0')}` : `${m}min`;
}
function _fmtQuando(iso) {
  if (!iso) return '—';
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return dias <= 0 ? 'Hoje' : dias === 1 ? 'Ontem' : `Há ${dias} dias`;
}
function topicStats(name) {
  const p = pxProgGet(name) || {};
  const q = p.questoes_respondidas || 0;
  const c = p.questoes_certas || 0;
  const dom = progressOf(name);
  return {
    dominio: dom,
    tempo: _fmtTempo(p.tempo_segundos),
    questoes: q,
    acertos: q ? Math.round((c / q) * 100) : 0,
    flashcards: p.flashcards || 0,
    revisao: p.revisao || (dom >= 70 ? 'Em 1 semana' : dom > 0 ? 'Amanhã' : 'Hoje'),
    dificuldade: dom >= 70 ? 'Fácil' : dom >= 40 ? 'Média' : 'Alta',
    acesso: _fmtQuando(p.last_access_at),
    status: statusOf(name),
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
        items.push({ kind: 'Aula', label: aulaLabel(d, t), sub: `${m.title} · ${d}`, href: `workspace.html?${base}` });
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

/* Pesos oficiais vindos do banco (tabela disciplines), sincronizados por px-auth.js.
   Têm prioridade sobre a tabela fixa acima, para o admin recalibrar sem mexer no código. */
const PX_PESO_KEY = 'px_pesos_v1';
function pesosDoBanco() {
  try { return JSON.parse(localStorage.getItem(PX_PESO_KEY)) || {}; } catch (e) { return {}; }
}

function pesoDe(disc) {
  const db = pesosDoBanco()[disc];
  if (db && typeof db.peso === 'number') {
    return { peso: db.peso, incidencia: typeof db.incidencia === 'number' ? db.incidencia : (PESO_EDITAL[disc] || {}).incidencia || 50 };
  }
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

/* Exposição global explícita: declarações `const` de topo não entram em `window`,
   e várias telas (inclusive o console administrativo) leem por `window.X`. */
window.TOPICS = TOPICS;
window.DISCIPLINAS_POR_CONCURSO = DISCIPLINAS_POR_CONCURSO;

/* ===== Agregação única de desempenho =====
   Fonte de verdade compartilhada por Desempenho (Geral / Por disciplina / Por tópico)
   e Cobertura do edital. Não recalcular esses números em outro lugar. */
function fmtTempoSeg(seg) { return _fmtTempo(seg); }

function desempenhoAgregado(concursoId) {
  const discs = disciplinasDe(concursoId || 'prf-2021').map(function (nome) {
    const info = disciplinaInfo(nome);
    let q = 0, c = 0, tempo = 0;
    const conta = { nao: 0, apr: 0, fam: 0, dom: 0 };
    info.topics.forEach(function (t) {
      const p = pxProgGet(t.name) || {};
      q += p.questoes_respondidas || 0;
      c += p.questoes_certas || 0;
      tempo += p.tempo_segundos || 0;
      conta[t.st] = (conta[t.st] || 0) + 1;
    });
    return Object.assign({}, info, {
      questoes: q, certas: c, erros: q - c, tempo_segundos: tempo,
      acertoPct: q ? Math.round((c / q) * 100) : 0,
      conta: conta, peso: pesoDe(nome),
    });
  });

  const t = { topicos: 0, questoes: 0, certas: 0, erros: 0, tempo_segundos: 0, conta: { nao: 0, apr: 0, fam: 0, dom: 0 } };
  let somaDominioTopicos = 0;
  discs.forEach(function (d) {
    t.topicos += d.topics.length;
    somaDominioTopicos += d.topics.reduce(function (a, tp) { return a + (tp.prog || 0); }, 0);
    t.questoes += d.questoes;
    t.certas += d.certas;
    t.erros += d.erros;
    t.tempo_segundos += d.tempo_segundos;
    ['nao', 'apr', 'fam', 'dom'].forEach(function (s) { t.conta[s] += d.conta[s] || 0; });
  });
  t.saldo = t.certas - t.erros;
  t.acertoPct = t.questoes ? Math.round((t.certas / t.questoes) * 100) : 0;
  /* média ponderada por tópico: soma do domínio de cada tópico / total de tópicos do edital */
  t.dominioMedio = t.topicos ? Math.round(somaDominioTopicos / t.topicos) : 0;

  t.tempo = _fmtTempo(t.tempo_segundos);
  return { discs: discs, totals: t };
}
