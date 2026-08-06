/* Dados compartilhados: disciplinas por concurso/material e tópicos por disciplina */

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

function disciplinasDe(id) {
  return DISCIPLINAS_POR_CONCURSO[id] || Object.keys(TOPICS);
}

/* status pseudo-determinístico por tópico */
function statusOf(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  const r = h % 100;
  return r < 58 ? 'nao' : r < 80 ? 'apr' : r < 93 ? 'fam' : 'dom';
}

function disciplinaInfo(nome) {
  const topics = (TOPICS[nome] || []).map(t => ({ name: t, st: statusOf(t) }));
  const dom = topics.filter(t => t.st === 'dom').length;
  const fam = topics.filter(t => t.st === 'fam').length;
  const pct = topics.length ? Math.round(((dom + fam * 0.5) / topics.length) * 100) : 0;
  return { name: nome, topics, pct };
}
