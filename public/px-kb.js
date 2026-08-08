/* Prova X — base de conhecimento (leitura para o aluno) + Athena com contexto */
(function () {
  var PX = (window.PX = window.PX || {});
  var SB_URL = 'https://rdokrryisfkhmevcxlws.supabase.co';
  var SB_KEY = 'sb_publishable_9ILwlXJNPJ5ZzpALdbmfBA_gRAtH4Qr';
  var cache = {};

  /* Busca o conteúdo teórico publicado de uma disciplina (todos os tópicos) */
  PX.kbDisciplina = async function (disciplina, curso) {
    var key = (curso || 'prf-2021') + '|' + disciplina;
    if (cache[key]) return cache[key];
    var qs =
      'select=titulo,topico,conteudo&course_slug=eq.' +
      encodeURIComponent(curso || 'prf-2021') +
      '&disciplina=eq.' + encodeURIComponent(disciplina) +
      '&publicado=is.true';
    try {
      var r = await fetch(SB_URL + '/rest/v1/knowledge_docs?' + qs, { headers: { apikey: SB_KEY } });
      cache[key] = r.ok ? await r.json() : [];
    } catch (e) { cache[key] = []; }
    return cache[key];
  };

  /* Conteúdo de um tópico específico (com fallback para a visão geral da matéria) */
  PX.kbTopico = async function (disciplina, topico, curso) {
    var docs = await PX.kbDisciplina(disciplina, curso);
    return (
      docs.find(function (d) { return d.topico === topico; }) ||
      docs.find(function (d) { return !d.topico; }) ||
      null
    );
  };

  /* Markdown simples -> HTML seguro */
  PX.kbHTML = function (md) {
    var esc = function (s) {
      return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });
    };
    var out = [];
    var lista = false;
    esc(md || '').split(/\r?\n/).forEach(function (ln) {
      var l = ln.trim();
      var li = l.match(/^[-*]\s+(.*)$/);
      if (li) { if (!lista) { out.push('<ul>'); lista = true; } out.push('<li>' + inline(li[1]) + '</li>'); return; }
      if (lista) { out.push('</ul>'); lista = false; }
      if (!l) return;
      var h = l.match(/^(#{1,4})\s+(.*)$/);
      if (h) { out.push('<h3>' + inline(h[2]) + '</h3>'); return; }
      out.push('<p>' + inline(l) + '</p>');
    });
    if (lista) out.push('</ul>');
    function inline(t) {
      return t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|\W)\*(\S.*?\S|\S)\*/g, '$1<i>$2</i>');
    }
    return out.join('');
  };

  /* Pergunta à Athena usando a base de conhecimento como fonte */
  PX.athenaAsk = async function (disciplina, topico, pergunta, curso) {
    try {
      var r = await fetch('/api/public/athena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disciplina: disciplina, topico: topico || null, pergunta: pergunta, curso: curso || 'prf-2021' }),
      });
      var j = await r.json();
      if (!r.ok) return j.error || 'Não consegui responder agora.';
      return j.resposta;
    } catch (e) {
      return 'Não consegui falar com a Athena agora. Tente novamente.';
    }
  };
})();
