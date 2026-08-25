/* Prova X — base de conhecimento (leitura para o aluno) + Athena com contexto */
(function () {
  var PX = (window.PX = window.PX || {});
  var SB_URL = 'https://rdokrryisfkhmevcxlws.supabase.co';
  var SB_KEY = 'sb_publishable_9ILwlXJNPJ5ZzpALdbmfBA_gRAtH4Qr';
  var cache = {};

  /* Espera a sessão do aluno terminar de carregar antes de checar login/acesso.
     Sem isso, uma checagem de acesso que roda antes da sessão hidratar sempre
     via "não logado", mesmo com o aluno já autenticado (falso 401). */
  function waitForSessao() {
    return new Promise(function (resolve) {
      if (window.PX && window.PX.ready) return resolve();
      var tries = 0;
      var t = setInterval(function () {
        if (window.PX && window.PX.ready) { clearInterval(t); resolve(); }
        else if (++tries > 200) { clearInterval(t); resolve(); }
      }, 50);
    });
  }

  /* Token da sessão atual (o conteúdo é restrito a alunos com acesso ativo) */
  PX.token = PX.token || async function () {
    try {
      await waitForSessao();
      if (!PX.sb) return '';
      if (PX.ready) await PX.ready;
      var s = await PX.sb.auth.getSession();
      return (s && s.data && s.data.session && s.data.session.access_token) || '';
    } catch (e) { return ''; }
  };

  /* O aluno logado tem acesso ativo a este curso? (compra, assinatura ou admin) */
  PX.temAcesso = async function (curso) {
    try {
      var tk = await PX.token();
      if (!tk) return false;
      var r = await fetch(SB_URL + '/rest/v1/rpc/has_course_access', {
        method: 'POST',
        headers: { apikey: SB_KEY, Authorization: 'Bearer ' + tk, 'Content-Type': 'application/json' },
        body: JSON.stringify({ _slug: curso || 'prf-2021' }),
      });
      return r.ok ? (await r.json()) === true : false;
    } catch (e) { return false; }
  };


  /* Busca o conteúdo teórico publicado de uma disciplina (todos os tópicos).
     Devolve { status, docs }: status é o código HTTP (0 = falha de rede, 401 = sem login). */
  PX.kbFetch = async function (disciplina, curso) {
    var key = (curso || 'prf-2021') + '|' + disciplina;
    if (cache[key]) return cache[key];
    /* Conteúdo publicado já aberto antes: reaproveita do navegador (7 dias) */
    var lsKey = 'px:kbdocs|' + key;
    var salvo = null;
    try {
      var raw = localStorage.getItem(lsKey);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && o.t && Date.now() - o.t < 7 * 24 * 60 * 60 * 1000) salvo = o.v;
        else localStorage.removeItem(lsKey);
      }
    } catch (e) { salvo = null; }
    if (salvo && salvo.docs) { cache[key] = salvo; return salvo; }
    var qs =
      'select=titulo,sumario,topico,conteudo,modo_exibicao,pdf_url&course_slug=eq.' +
      encodeURIComponent(curso || 'prf-2021') +
      '&disciplina=eq.' + encodeURIComponent(disciplina) +
      '&publicado=is.true';
    try {
      var h = { apikey: SB_KEY };
      var tk = await PX.token();
      if (!tk) return { status: 401, docs: [] };
      h.Authorization = 'Bearer ' + tk;
      var r = await fetch(SB_URL + '/rest/v1/knowledge_docs?' + qs, { headers: h });
      var docs = r.ok ? await r.json() : [];
      var res = { status: r.status, docs: Array.isArray(docs) ? docs : [] };
      if (r.ok) {
        cache[key] = res;
        try { localStorage.setItem(lsKey, JSON.stringify({ t: Date.now(), v: res })); } catch (e) { /* cota */ }
      }
      return res;
    } catch (e) {
      return { status: 0, docs: [] };
    }
  };

  PX.kbDisciplina = async function (disciplina, curso) {
    return (await PX.kbFetch(disciplina, curso)).docs;
  };

  /* Conteúdo de um tópico específico (com fallback para a visão geral da matéria) */
  PX.kbTopico = async function (disciplina, topico, curso) {
    var res = await PX.kbFetch(disciplina, curso);
    var docs = res.docs;
    return (
      docs.find(function (d) { return d.topico === topico; }) ||
      docs.find(function (d) { return !d.topico; }) ||
      null
    );
  };

  /* Igual ao anterior, mas informando também o status da consulta */
  PX.kbTopicoDetalhe = async function (disciplina, topico, curso) {
    var res = await PX.kbFetch(disciplina, curso);
    var docs = res.docs;
    var doc =
      docs.find(function (d) { return d.topico === topico; }) ||
      docs.find(function (d) { return !d.topico; }) ||
      null;
    return { status: res.status, doc: doc, total: docs.length };
  };

  /* Link temporário (assinado) para abrir o PDF de uma aula guardado no armazenamento */
  PX.pdfAulaUrl = async function (caminho) {
    if (!caminho) return '';
    if (/^https?:\/\//i.test(caminho)) return caminho;
    try {
      await waitForSessao();
      if (PX.ready) await PX.ready;
      if (!PX.sb) return '';
      var r = await PX.sb.storage.from('aulas-pdf').createSignedUrl(caminho, 3600);
      return (r && r.data && r.data.signedUrl) || '';
    } catch (e) { return ''; }
  };



  /* Leitura autenticada genérica de uma tabela do banco (mesmo padrão do kbFetch) */
  async function tabela(path) {
    try {
      var tk = await PX.token();
      if (!tk) return { status: 401, rows: [] };
      var r = await fetch(SB_URL + '/rest/v1/' + path, {
        headers: { apikey: SB_KEY, Authorization: 'Bearer ' + tk },
      });
      var rows = r.ok ? await r.json() : [];
      return { status: r.status, rows: Array.isArray(rows) ? rows : [] };
    } catch (e) {
      return { status: 0, rows: [] };
    }
  }

  function filtroTopico(disciplina, topico, curso) {
    var qs = 'discipline_nome=eq.' + encodeURIComponent(disciplina) +
      '&course_slug=eq.' + encodeURIComponent(curso || 'prf-2021');
    if (topico) qs += '&topic_nome=eq.' + encodeURIComponent(topico);
    return qs;
  }

  /* Questões oficiais do tópico. Devolve { status, rows } */
  PX.questoesTopico = async function (disciplina, topico, curso) {
    return tabela('questions?select=id,enunciado,gabarito,comentario&' +
      filtroTopico(disciplina, topico, curso) + '&ativa=is.true&limit=30');
  };

  /* Flashcards oficiais do tópico. Devolve { status, rows } */
  PX.flashcardsTopico = async function (disciplina, topico, curso) {
    return tabela('flashcards?select=id,frente,verso&' +
      filtroTopico(disciplina, topico, curso) + '&is_oficial=is.true&limit=50');
  };


  /* Material completo (texto integral dos documentos-fonte da matéria). */
  PX.materialCompleto = async function (disciplina, curso) {
    return tabela('kb_documentos?select=nome_arquivo,tipo,topic_nome,texto_extraido,criado_em' +
      '&course_slug=eq.' + encodeURIComponent(curso || 'prf-2021') +
      '&discipline_nome=eq.' + encodeURIComponent(disciplina) +
      '&order=criado_em.asc');
  };

  /* Chamada autenticada aos endpoints de IA do Prova X (/api/public/...) */
  PX.iaPost = async function (rota, dados) {
    try {
      var tk = null;
      try { tk = await PX.token(); } catch (e) { tk = null; }
      var cab = { 'Content-Type': 'application/json' };
      if (tk) cab.Authorization = 'Bearer ' + tk;
      var r = await fetch('/api/public/' + rota, {
        method: 'POST',
        headers: cab,
        body: JSON.stringify(dados || {}),
      });
      var j = await r.json();
      if (!r.ok) return { erro: j.error || 'Não consegui responder agora.', status: r.status };
      return j;
    } catch (e) {
      return { erro: 'Falha de conexão. Tente novamente.', status: 0 };
    }
  };

  /* ---------- Cache do conteúdo já publicado ----------
     Uma vez aberto, o material da aula fica guardado no navegador (memória +
     localStorage por 7 dias), então ao voltar na aba ele abre na hora, sem
     esperar a IA e sem gerar de novo. */
  var iaMem = {};
  var CACHE_MS = 7 * 24 * 60 * 60 * 1000;
  var CACHE_PREFIX = 'px:ia:';

  function chaveIA(rota, dados) {
    var d = dados || {};
    var partes = Object.keys(d).sort().map(function (k) { return k + '=' + String(d[k]); });
    return CACHE_PREFIX + rota + '|' + partes.join('&');
  }

  function lerLocal(k) {
    try {
      var raw = localStorage.getItem(k);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || !o.t || Date.now() - o.t > CACHE_MS) { localStorage.removeItem(k); return null; }
      return o.v;
    } catch (e) { return null; }
  }

  function gravarLocal(k, v) {
    try { localStorage.setItem(k, JSON.stringify({ t: Date.now(), v: v })); } catch (e) { /* cota cheia */ }
  }

  /* Igual ao iaPost, mas reaproveitando a resposta já obtida antes.
     forcar = true refaz a chamada e substitui o que estava guardado. */
  PX.iaPostCache = async function (rota, dados, forcar) {
    var k = chaveIA(rota, dados);
    if (!forcar) {
      if (iaMem[k]) return iaMem[k];
      var salvo = lerLocal(k);
      if (salvo) { iaMem[k] = salvo; return salvo; }
    }
    var j = await PX.iaPost(rota, dados);
    if (j && !j.erro) { iaMem[k] = j; gravarLocal(k, j); }
    return j;
  };

  /* Limpa o que estiver guardado de uma rota (usado ao "gerar novamente") */
  PX.iaCacheLimpar = function (rota, dados) {
    var k = chaveIA(rota, dados);
    delete iaMem[k];
    try { localStorage.removeItem(k); } catch (e) { /* ignora */ }
  };



  /* Markdown simples -> HTML seguro (títulos, listas, citação, negrito, itálico, grifo, código) */
  PX.kbHTML = function (md) {
    var esc = function (s) {
      return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });
    };
    var out = [];
    var ul = false, ol = false;
    var fechaListas = function () {
      if (ul) { out.push('</ul>'); ul = false; }
      if (ol) { out.push('</ol>'); ol = false; }
    };
    esc(md || '').split(/\r?\n/).forEach(function (ln) {
      var l = ln.trim();
      var li = l.match(/^[-*]\s+(.*)$/);
      if (li) {
        if (ol) { out.push('</ol>'); ol = false; }
        if (!ul) { out.push('<ul style="margin:6px 0 12px;padding-left:22px">'); ul = true; }
        out.push('<li style="margin:3px 0">' + inline(li[1]) + '</li>');
        return;
      }
      var oli = l.match(/^\d+[.)]\s+(.*)$/);
      if (oli) {
        if (ul) { out.push('</ul>'); ul = false; }
        if (!ol) { out.push('<ol style="margin:6px 0 12px;padding-left:22px">'); ol = true; }
        out.push('<li style="margin:3px 0">' + inline(oli[1]) + '</li>');
        return;
      }
      fechaListas();
      if (!l) return;
      var q = l.match(/^>\s?(.*)$/);
      if (q) {
        out.push('<blockquote style="margin:10px 0;padding:8px 14px;border-left:3px solid var(--brand,#154C9B);background:var(--surface,#F8FAFC);border-radius:0 8px 8px 0;color:#475569">' + inline(q[1]) + '</blockquote>');
        return;
      }
      var h = l.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        var n = Math.min(h[1].length, 4);
        var estilo = n === 1
          ? 'font-size:1.45rem;font-weight:800;margin:6px 0 14px;line-height:1.25'
          : n === 2
            ? 'font-size:1.12rem;font-weight:800;margin:26px 0 10px;padding-bottom:6px;border-bottom:2px solid var(--line,#e2e8f0)'
            : 'font-size:1rem;font-weight:700;margin:20px 0 8px;color:var(--brand,#154C9B)';
        out.push('<h' + (n + 1) + ' style="' + estilo + '">' + inline(h[2]) + '</h' + (n + 1) + '>');
        return;
      }
      out.push('<p>' + inline(l) + '</p>');
    });
    fechaListas();
    function inline(t) {
      return t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
        .replace(/==(.+?)==/g, '<mark style="background:#FEF08A;padding:0 3px;border-radius:3px">$1</mark>')
        .replace(/`([^`]+)`/g, '<code style="background:var(--surface,#F1F5F9);padding:1px 5px;border-radius:4px;font-size:0.92em">$1</code>')
        .replace(/(^|\W)\*(\S.*?\S|\S)\*/g, '$1<i>$2</i>');
    }
    return out.join('');

  };

  /* Pergunta à Athena usando a base de conhecimento como fonte */
  PX.athenaAsk = async function (disciplina, topico, pergunta, curso) {
    try {
      var tk = await PX.token();
      var r = await fetch('/api/public/athena', {
        method: 'POST',
        headers: (function () {
          var h = { 'Content-Type': 'application/json' };
          if (tk) h.Authorization = 'Bearer ' + tk;
          return h;
        })(),
        body: JSON.stringify({ disciplina: disciplina, topico: topico || null, pergunta: pergunta, curso: curso || 'prf-2021' }),
      });
      var j = await r.json();
      if (!r.ok) return j.error || 'Não consegui responder agora.';
      var resp = j.resposta;
      // Origem dos trechos usados pela Athena (quando a busca inteligente está ativa)
      if (Array.isArray(j.fontes) && j.fontes.length) {
        var lista = j.fontes
          .map(function (f) { return '[Fonte ' + f.n + '] ' + (f.titulo || f.topico || f.disciplina); })
          .join(' · ');
        resp += '\n\n—\n📚 Fontes consultadas: ' + lista;
      }
      return resp;
    } catch (e) {
      return 'Não consegui falar com a Athena agora. Tente novamente.';
    }
  };
})();
