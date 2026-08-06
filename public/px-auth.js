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
    if (!PX.user) return;
    try {
      const [{ data: prof }, { data: roles }] = await Promise.all([
        PX.sb.from('profiles').select('*').eq('id', PX.user.id).maybeSingle(),
        PX.sb.from('user_roles').select('role').eq('user_id', PX.user.id),
      ]);
      PX.profile = prof || null;
      PX.roles = (roles || []).map(r => r.role);
    } catch (e) { console.error('[PX] perfil:', e); }
  }


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
    return PX.sb.from('topic_progress').upsert(row, { onConflict: 'user_id,course_slug,discipline_nome,topic_nome' });
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
  };

  PX.logAttempt = async function (a) {
    await PX.ready;
    if (!PX.user) return;
    PX.sb.from('question_attempts').insert({
      user_id: PX.user.id, discipline_nome: a.disc, topic_nome: a.topic,
      resposta: a.resposta, correta: !!a.correta, segundos: a.segundos || 0,
    }).then(() => {});
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
      { user_id: PX.user.id, data_prova: plan.data_prova || null, horas_por_dia: plan.horas_por_dia || 3, dias_descanso: plan.dias_descanso || [] },
      { onConflict: 'user_id' }
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
    const { data: sub } = await PX.sb.from('subscriptions').select('status').eq('user_id', PX.user.id).eq('status', 'ativa').maybeSingle();
    if (sub) return true;
    if (courseSlug) {
      const { data: course } = await PX.sb.from('courses').select('id').eq('slug', courseSlug).maybeSingle();
      if (course) {
        const { data: acc } = await PX.sb.from('course_access').select('id').eq('user_id', PX.user.id).eq('course_id', course.id).maybeSingle();
        if (acc) return true;
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
