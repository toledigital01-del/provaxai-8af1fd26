/* Prova X — camada de backend (contas, progresso, material, cronograma) */
(function () {
  const SUPABASE_URL = 'https://rdokrryisfkhmevcxlws.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_9ILwlXJNPJ5ZzpALdbmfBA_gRAtH4Qr';

  const PX = (window.PX = window.PX || {});
  PX.user = null;
  PX.profile = null;
  PX.roles = [];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = resolve; s.onerror = () => reject(new Error('falha ao carregar ' + src));
      document.head.appendChild(s);
    });
  }

  async function getCreateClient() {
    if (window.supabase && window.supabase.createClient) return window.supabase.createClient;
    // bundle local (funciona no preview mesmo sem acesso a CDNs externos)
    try {
      await loadScript('supabase.js');
      if (window.supabase && window.supabase.createClient) return window.supabase.createClient;
    } catch (e) {}
    const mod = await import('https://esm.sh/@supabase/supabase-js@2.58.0');
    return mod.createClient;
  }

  async function boot() {
    try {
      const createClient = await getCreateClient();
      const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'px-auth' },
      });
      PX.sb = sb;
      const { data } = await sb.auth.getSession();
      await hydrate(data.session);
      sb.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') hydrate(session);
      });
    } catch (e) {
      PX.bootError = e;
      console.error('[PX] backend indisponível:', e);
    }
    return PX;
  }

  async function hydrate(session) {
    PX.session = session || null;
    PX.user = session ? session.user : null;
    PX.profile = null;
    PX.roles = [];
    PX.syncCurriculo();
    if (!PX.user) return;
    try {
      const [{ data: prof }, { data: roles }] = await Promise.all([
        PX.sb.from('profiles').select('*').eq('id', PX.user.id).maybeSingle(),
        PX.sb.from('user_roles').select('role').eq('user_id', PX.user.id),
      ]);
      PX.profile = prof || null;
      PX.roles = (roles || []).map(r => r.role);
    } catch (e) { console.error('[PX] perfil:', e); }
    PX.syncProgresso();
  }

  /* ---------- Sincronização com o painel administrativo ---------- */
  /* currículo (cursos → disciplinas → tópicos) publicado pelo admin */
  PX.syncCurriculo = async function () {
    try {
      const [{ data: cursos }, { data: discs }, { data: tops }] = await Promise.all([
        PX.sb.from('courses').select('id,slug').order('ordem'),
        PX.sb.from('disciplines').select('id,course_id,nome,ordem,peso,incidencia').order('ordem'),
        PX.sb.from('topics').select('discipline_id,nome,ordem').order('ordem'),
      ]);
      if (!cursos || !discs || !discs.length) return;
      const porDisc = {};
      const ordemDisc = {};
      (tops || []).forEach(t => {
        (porDisc[t.discipline_id] = porDisc[t.discipline_id] || []).push(t.nome);
        (ordemDisc[t.discipline_id] = ordemDisc[t.discipline_id] || {})[t.nome] =
          typeof t.ordem === 'number' ? t.ordem : null;
      });
      const slugDe = {};
      cursos.forEach(c => { slugDe[c.id] = c.slug; });
      const out = {};
      const pesos = {};
      const aulas = {};
      discs.forEach(d => {
        if (typeof d.peso === 'number') pesos[d.nome] = { peso: d.peso, incidencia: d.incidencia };
        const slug = slugDe[d.course_id];
        if (!slug) return;
        out[slug] = out[slug] || {};
        out[slug][d.nome] = porDisc[d.id] || [];
        aulas[d.nome] = ordemDisc[d.id] || {};
      });
      localStorage.setItem('px_curriculo_v1', JSON.stringify({ cursos: out, ts: Date.now() }));
      localStorage.setItem('px_pesos_v1', JSON.stringify(pesos));
      localStorage.setItem('px_aulas_v1', JSON.stringify(aulas));


    } catch (e) { /* mantém o currículo em cache */ }
  };

  /* progresso real do aluno usado pelas telas (data.js lê este cache) */
  PX.syncProgresso = async function () {
    if (!PX.user) return;
    try {
      const { data } = await PX.sb.from('topic_progress').select('*').eq('user_id', PX.user.id);
      const map = {};
      (data || []).forEach(r => {
        map[r.topic_nome] = {
          status: r.status, dominio: r.dominio, tempo_segundos: r.tempo_segundos,
          questoes_respondidas: r.questoes_respondidas, questoes_certas: r.questoes_certas,
          last_access_at: r.last_access_at,
        };
      });
      localStorage.setItem('px_prog_cache_v1', JSON.stringify(map));
      bindExitSnapshot();
      await PX.recuperarDiaPerdido();
      PX.saveSnapshot();
    } catch (e) {}

  };

  /* ---------- Histórico de evolução (snapshot diário do índice de domínio) ---------- */
  PX.resumoGeral = function () {
    let map = {};
    try { map = JSON.parse(localStorage.getItem('px_prog_cache_v1')) || {}; } catch (e) {}
    const rows = Object.keys(map).map(k => map[k]);
    let dom = 0, seg = 0, q = 0, c = 0;
    rows.forEach(r => {
      dom += Math.min(100, r.dominio || 0);
      seg += r.tempo_segundos || 0;
      q += r.questoes_respondidas || 0;
      c += r.questoes_certas || 0;
    });
    const total = rows.length || 1;
    return {
      dominio: Math.round(dom / total),
      tempo_segundos: seg,
      questoes: q,
      certas: c,
      acertos_pct: q ? Math.round((c / q) * 100) : 0,
    };
  };

  /* Mesma fonte de verdade da tela: desempenhoAgregado() quando data.js está carregado. */
  PX.resumoDoDia = function () {
    if (typeof desempenhoAgregado === 'function') {
      try {
        const agg = desempenhoAgregado('prf-2021');
        const T = agg.totals;
        const por = {};
        (agg.discs || []).forEach(d => { por[d.name] = d.pct || 0; });
        return {
          dominio: T.dominioMedio, acertos_pct: T.acertoPct,
          questoes: T.questoes, tempo_segundos: T.tempo_segundos, por_disciplina: por,
        };
      } catch (e) {}
    }
    const r = PX.resumoGeral();
    r.por_disciplina = {};
    return r;
  };

  let _snapTs = 0;

  /* grava o snapshot; keepalive garante o envio mesmo quando a aba está fechando */
  async function upsertSnapshot(row, keepalive) {
    if (keepalive && typeof fetch === 'function') {
      const token = (PX.session && PX.session.access_token) || SUPABASE_KEY;
      try {
        await fetch(SUPABASE_URL + '/rest/v1/dominio_snapshots?on_conflict=user_id,course_slug,dia', {
          method: 'POST', keepalive: true,
          headers: {
            'Content-Type': 'application/json', apikey: SUPABASE_KEY,
            Authorization: 'Bearer ' + token, Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify(row),
        });
        return;
      } catch (e) { /* cai no caminho normal */ }
    }
    try {
      await PX.sb.from('dominio_snapshots').upsert(row, { onConflict: 'user_id,course_slug,dia' });
    } catch (e) {}
  }

  PX.saveSnapshot = async function (force, opts) {
    if (!PX.user) return;
    const o = opts || {};
    const agora = Date.now();
    if (!force && agora - _snapTs < 30000) return;   /* no máximo 1 gravação a cada 30s */
    const r = PX.resumoDoDia();
    if (!r.tempo_segundos && !r.questoes && !r.dominio) return;
    _snapTs = agora;
    const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    await upsertSnapshot({
      user_id: PX.user.id, course_slug: 'prf-2021', dia: o.dia || hoje,
      dominio: r.dominio, acertos_pct: r.acertos_pct,
      questoes: r.questoes, tempo_segundos: r.tempo_segundos,
      por_disciplina: r.por_disciplina || {},
    }, !!o.keepalive);
  };

  /* gatilho de segurança: última chance de gravar antes de a aba sumir */
  let _exitBound = false;
  function bindExitSnapshot() {
    if (_exitBound || typeof window === 'undefined') return;
    _exitBound = true;
    const onExit = function () {
      if (!PX.user) return;
      PX.saveSnapshot(true, { keepalive: true });
    };
    window.addEventListener('pagehide', onExit);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') onExit();
    });
  }

  /* recupera um dia de estudo que ficou sem registro (aba fechada antes de gravar) */
  PX.recuperarDiaPerdido = async function () {
    if (!PX.user) return;
    try {
      const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
      const [{ data: snaps }, { data: prog }] = await Promise.all([
        PX.sb.from('dominio_snapshots').select('dia').eq('user_id', PX.user.id)
          .eq('course_slug', 'prf-2021').order('dia', { ascending: false }).limit(1),
        PX.sb.from('topic_progress').select('updated_at').eq('user_id', PX.user.id)
          .order('updated_at', { ascending: false }).limit(1),
      ]);
      const ultimoSnap = snaps && snaps[0] ? snaps[0].dia : null;
      if (!prog || !prog[0]) return;
      const diaProg = new Date(prog[0].updated_at)
        .toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
      if (diaProg === hoje) return;                      /* nada a recuperar */
      if (ultimoSnap && ultimoSnap >= diaProg) return;   /* já registrado */
      await PX.saveSnapshot(true, { dia: diaProg });
    } catch (e) {}
  };

  PX.getSnapshots = async function (dias) {
    await PX.ready;
    if (!PX.user) return [];
    const desde = new Date(Date.now() - (dias || 90) * 86400000).toISOString().slice(0, 10);
    const { data } = await PX.sb.from('dominio_snapshots').select('dia,dominio,acertos_pct,questoes')
      .eq('user_id', PX.user.id).gte('dia', desde).order('dia');
    return data || [];
  };


  PX.ready = boot();



  /* ---------- Autenticação ---------- */
  PX.signUp = async function (email, password, fullName) {
    await PX.ready;
    return PX.sb.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + '/home.html', data: { full_name: fullName || '' } },
    });
  };

  PX.signIn = async function (email, password) {
    await PX.ready;
    const res = await PX.sb.auth.signInWithPassword({ email, password });
    if (!res.error && res.data.user) {
      await hydrate(res.data.session);
      PX.sb.from('login_events').insert({ user_id: res.data.user.id, user_agent: navigator.userAgent }).then(() => {});
      PX.sb.from('profiles').update({ last_login_at: new Date().toISOString() }).eq('id', res.data.user.id).then(() => {});
    }
    return res;
  };

  PX.signInWithGoogle = async function (nextUrl) {
    await PX.ready;
    try {
      const { createLovableAuth } = await import('https://esm.sh/@lovable.dev/cloud-auth-js@1.1.2');
      if (nextUrl) sessionStorage.setItem('px_next', nextUrl);
      const auth = createLovableAuth();
      const result = await auth.signInWithOAuth('google', { redirect_uri: window.location.origin + '/login.html' });
      if (result.redirected) return { redirected: true };
      if (result.error) return { error: result.error };
      await PX.sb.auth.setSession(result.tokens);
      await hydrate((await PX.sb.auth.getSession()).data.session);
      return { ok: true };
    } catch (e) {
      return { error: e };
    }
  };

  PX.signOut = async function () {
    await PX.ready;
    await PX.sb.auth.signOut();
    PX.user = null; PX.profile = null; PX.roles = [];
    window.location.href = 'login.html';
  };

  PX.isAdmin = function () { return PX.roles.indexOf('admin') >= 0; };

  /* redireciona para o login quando não há sessão */
  PX.requireAuth = async function () {
    await PX.ready;
    if (!PX.user) {
      const next = location.pathname.split('/').pop() + location.search;
      location.href = 'login.html?next=' + encodeURIComponent(next);
      return null;
    }
    return PX.user;
  };

  PX.requireAdmin = async function () {
    const u = await PX.requireAuth();
    if (!u) return null;
    if (!PX.isAdmin()) { location.href = 'home.html'; return null; }
    return u;
  };

  PX.displayName = function () {
    if (PX.profile && PX.profile.full_name) return PX.profile.full_name;
    if (PX.user && PX.user.email) return PX.user.email.split('@')[0];
    return 'Aluno';
  };

  /* ---------- Progresso ---------- */
  PX.saveProgress = async function (p) {
    await PX.ready;
    if (!PX.user) return null;
    const row = {
      user_id: PX.user.id,
      course_slug: p.course || '',
      discipline_nome: p.disc,
      topic_nome: p.topic,
      last_access_at: new Date().toISOString(),
    };
    if (p.status) row.status = p.status;
    if (typeof p.dominio === 'number') row.dominio = p.dominio;
    const res = await PX.sb.from('topic_progress').upsert(row, { onConflict: 'user_id,course_slug,discipline_nome,topic_nome' });
    try {
      const map = JSON.parse(localStorage.getItem('px_prog_cache_v1')) || {};
      map[p.topic] = Object.assign({}, map[p.topic], {
        status: row.status || (map[p.topic] && map[p.topic].status) || 'apr',
        dominio: typeof row.dominio === 'number' ? row.dominio : (map[p.topic] && map[p.topic].dominio) || 0,
        last_access_at: row.last_access_at,
      });
      localStorage.setItem('px_prog_cache_v1', JSON.stringify(map));
    } catch (e) {}
    PX.saveSnapshot(true);
    return res;
  };


  PX.getProgress = async function (disc) {
    await PX.ready;
    if (!PX.user) return [];
    let q = PX.sb.from('topic_progress').select('*').eq('user_id', PX.user.id);
    if (disc) q = q.eq('discipline_nome', disc);
    const { data } = await q;
    return data || [];
  };

  PX.logSession = async function (disc, topic, ferramenta, segundos) {
    await PX.ready;
    if (!PX.user) return;
    PX.sb.from('study_sessions').insert({
      user_id: PX.user.id, discipline_nome: disc, topic_nome: topic, ferramenta, segundos: segundos || 0,
    }).then(() => {});
    PX.saveSnapshot();
  };

  PX.logAttempt = async function (a) {
    await PX.ready;
    if (!PX.user) return;
    PX.sb.from('question_attempts').insert({
      user_id: PX.user.id, discipline_nome: a.disc, topic_nome: a.topic || null,
      question_id: a.question_id || null,
      resposta: a.resposta, correta: !!a.correta, segundos: a.segundos || 0,
    }).then(() => {});

    PX.saveSnapshot();
  };

  /* ---------- Pastas e material próprio ---------- */
  PX.listFolders = async function () {
    await PX.ready;
    if (!PX.user) return [];
    const { data } = await PX.sb.from('folders').select('*').order('created_at');
    return data || [];
  };
  PX.createFolder = async function (nome) {
    await PX.ready;
    return PX.sb.from('folders').insert({ user_id: PX.user.id, nome }).select().single();
  };
  PX.listMaterials = async function () {
    await PX.ready;
    if (!PX.user) return [];
    const { data } = await PX.sb.from('user_materials').select('*').order('created_at', { ascending: false });
    return data || [];
  };
  PX.createMaterial = async function (m) {
    await PX.ready;
    return PX.sb.from('user_materials').insert({
      user_id: PX.user.id, nome: m.nome, tipo: m.tipo || 'texto',
      source_url: m.source_url || null, conteudo: m.conteudo || null,
      folder_id: m.folder_id || null, topics: m.topics || [],
    }).select().single();
  };
  PX.deleteMaterial = async function (id) {
    await PX.ready;
    return PX.sb.from('user_materials').delete().eq('id', id);
  };

  /* ---------- Anotações ---------- */
  PX.saveNote = async function (disc, topic, conteudo) {
    await PX.ready;
    if (!PX.user) return null;
    const { data } = await PX.sb.from('notes').select('id')
      .eq('user_id', PX.user.id).eq('discipline_nome', disc).eq('topic_nome', topic).maybeSingle();
    if (data) return PX.sb.from('notes').update({ conteudo }).eq('id', data.id);
    return PX.sb.from('notes').insert({ user_id: PX.user.id, discipline_nome: disc, topic_nome: topic, conteudo });
  };
  PX.getNote = async function (disc, topic) {
    await PX.ready;
    if (!PX.user) return null;
    const { data } = await PX.sb.from('notes').select('conteudo')
      .eq('user_id', PX.user.id).eq('discipline_nome', disc).eq('topic_nome', topic).maybeSingle();
    return data ? data.conteudo : null;
  };

  /* ---------- Revisão espaçada (SM-2 simplificado) ---------- */
  /* nota: 0 = errei, 1 = difícil, 2 = bom, 3 = fácil */
  PX.reviewCard = async function (cardId, nota) {
    await PX.ready;
    if (!PX.user || !cardId) return null;
    const { data: atual } = await PX.sb.from('flashcard_reviews')
      .select('ease,intervalo_dias,repeticoes').eq('user_id', PX.user.id).eq('card_id', cardId).maybeSingle();
    let ease = atual ? Number(atual.ease) || 2.5 : 2.5;
    let rep = atual ? atual.repeticoes || 0 : 0;
    let intervalo = atual ? atual.intervalo_dias || 0 : 0;
    const q = Math.max(0, Math.min(3, Number(nota) || 0));
    if (q === 0) { rep = 0; intervalo = 0; ease = Math.max(1.3, ease - 0.2); }
    else {
      rep += 1;
      ease = Math.max(1.3, Math.min(3.0, ease + (q === 1 ? -0.15 : q === 2 ? 0 : 0.1)));
      intervalo = rep === 1 ? (q === 1 ? 1 : 2) : rep === 2 ? (q === 1 ? 3 : 6) : Math.round(intervalo * ease) || 6;
      if (q === 1) intervalo = Math.max(1, Math.round(intervalo * 0.6));
    }
    const due = new Date(Date.now() + Math.max(0, intervalo) * 86400000).toISOString();
    return PX.sb.from('flashcard_reviews').upsert({
      user_id: PX.user.id, card_id: cardId, ease, intervalo_dias: intervalo,
      repeticoes: rep, due_at: due, last_review_at: new Date().toISOString(),
    }, { onConflict: 'user_id,card_id' });
  };

  /* revisões do aluno indexadas por card (para montar a fila de hoje) */
  PX.reviewMap = async function () {
    await PX.ready;
    if (!PX.user) return {};
    const { data } = await PX.sb.from('flashcard_reviews')
      .select('card_id,due_at,intervalo_dias,repeticoes').eq('user_id', PX.user.id);
    const map = {};
    (data || []).forEach(r => { map[r.card_id] = r; });
    return map;
  };

  /* ---------- Cronograma ---------- */
  PX.getPlan = async function () {
    await PX.ready;
    if (!PX.user) return null;
    const { data } = await PX.sb.from('study_plans').select('*').eq('user_id', PX.user.id).maybeSingle();
    return data;
  };
  PX.savePlan = async function (plan) {
    await PX.ready;
    if (!PX.user) return null;
    return PX.sb.from('study_plans').upsert(
      { user_id: PX.user.id, course_slug: plan.course_slug || 'prf-2021', data_prova: plan.data_prova || null, horas_por_dia: plan.horas_por_dia || 3, dias_descanso: plan.dias_descanso || [] },
      { onConflict: 'user_id' }
    );
  };

  /* blocos de estudo materializados do dia (concluir/desmarcar acompanha o aluno) */
  PX.getBlocks = async function (dia) {
    await PX.ready;
    if (!PX.user) return [];
    let q = PX.sb.from('study_blocks').select('*').eq('user_id', PX.user.id);
    if (dia) q = q.eq('dia', dia);
    const { data } = await q;
    return data || [];
  };
  PX.saveBlocks = async function (blocos) {
    await PX.ready;
    if (!PX.user || !blocos || !blocos.length) return null;
    return PX.sb.from('study_blocks').upsert(
      blocos.map(b => ({
        user_id: PX.user.id, dia: b.dia, discipline_nome: b.disc,
        topic_nome: b.topic || null, minutos: b.minutos || 0, concluido: !!b.concluido,
      })),
      { onConflict: 'user_id,dia,discipline_nome,topic_nome' }
    );
  };


  /* ---------- Catálogo ---------- */
  PX.listCourses = async function () {
    await PX.ready;
    const { data } = await PX.sb.from('courses').select('*').order('ordem');
    return data || [];
  };
  PX.listPlans = async function () {
    await PX.ready;
    const { data } = await PX.sb.from('plans').select('*').eq('ativo', true).order('ordem');
    return data || [];
  };
  PX.hasCourseAccess = async function (courseSlug) {
    await PX.ready;
    if (!PX.user) return false;
    if (PX.isAdmin()) return true;
    const { data: subs } = await PX.sb.from('subscriptions').select('status').eq('user_id', PX.user.id).eq('status', 'ativa').limit(1);
    if (subs && subs.length) return true;
    if (courseSlug) {
      const { data: course } = await PX.sb.from('courses').select('id').eq('slug', courseSlug).maybeSingle();
      if (course) {
        const { data: acc } = await PX.sb.from('course_access').select('id').eq('user_id', PX.user.id).eq('course_id', course.id).limit(1);
        if (acc && acc.length) return true;
      }
    }
    return false;
  };

  /* bloqueia a página se o aluno não tiver conta ou assinatura/acesso ativo */
  PX.requirePro = async function (courseSlug) {
    const u = await PX.requireAuth();
    if (!u) return null;
    const acesso = await PX.hasCourseAccess(courseSlug);
    if (!acesso) {
      location.href = 'pricing.html?locked=1';
      return null;
    }
    return u;
  };
})();
