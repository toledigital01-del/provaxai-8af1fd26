/* Shell compartilhado: sidebar + topbar com pesquisa global */

/* ---- Tema (claro / escuro) ---- */
(function () {
  var KEY = 'px_theme';
  function apply(t) {
    document.body.classList.toggle('dark', t === 'dark');
    var b = document.getElementById('px-theme-btn');
    if (b) b.innerHTML = t === 'dark' ? window.__pxSunIcon : window.__pxMoonIcon;
  }
  window.__pxMoonIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  window.__pxSunIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  window.pxTheme = function () {
    try { return localStorage.getItem(KEY) || 'light'; } catch (e) { return 'light'; }
  };
  window.pxSetTheme = function (t) {
    try { localStorage.setItem(KEY, t); } catch (e) {}
    apply(t);
  };
  window.pxToggleTheme = function () { pxSetTheme(pxTheme() === 'dark' ? 'light' : 'dark'); };
  window.__pxApplyTheme = function () { apply(pxTheme()); };
  if (document.body) apply(pxTheme());
  else document.addEventListener('DOMContentLoaded', function () { apply(pxTheme()); });
})();

(function () {

  const NAV = [
    { id: 'inicio', href: 'home.html', label: 'Início', icon: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>' },
    { id: 'cronograma', href: 'cronograma.html', label: 'Cronograma', icon: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/>' },
    { id: 'estatisticas', href: 'dashboard.html', label: 'Estatísticas', icon: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>' },
    { id: 'cobertura', href: 'cobertura.html', label: 'Cobertura do edital', icon: '<path d="M9 11.5l2 2 4-4.5"/><rect x="4" y="3.5" width="16" height="17" rx="2"/>' },
    { id: 'resolver', href: 'resolver.html', label: 'Resolver', icon: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>' },


  ];




  function icon(d) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  }

  function sidebarHTML(active, topicNav) {
    const nav = topicNav
      ? `<nav class="shell-nav">
          ${topicNav.label ? `<div class="shell-sec">${topicNav.label}</div>` : ''}
          ${topicNav.items}
        </nav>`
      : `<nav class="shell-nav">
          <div class="shell-sec">Workspace</div>
          ${NAV.map(n => `<a href="${n.href}" class="nav-item${n.id === active ? ' active' : ''}">${icon(n.icon)}<span>${n.label}</span></a>`).join('')}
        </nav>`;

    return `
      <a href="home.html" class="shell-logo">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><path d="M16 2C16 2 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 2 16 2Z" fill="#FF4D00"/><path d="M16 8C16 8 11 14 11 18C11 20.8 13.2 23 16 23C18.8 23 21 20.8 21 18C21 14 16 8 16 8Z" fill="#FF8040"/></svg>
        <span>Prova X</span>
      </a>
      ${nav}
      <div class="shell-foot">
        <button class="user-chip" id="px-user-chip" onclick="pxUserMenu()">
          <div class="avatar" id="px-avatar">·</div>
          <span style="flex:1;font-size:0.84rem;font-weight:500;" id="px-username">Carregando…</span>
        </button>
      </div>`;

  }


  function topbarHTML(right) {
    return `
      <button class="shell-burger" aria-label="Menu" onclick="toggleSidebar()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      <div class="gsearch">
        <div class="gsearch-input">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#98a0b0" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input id="gq" placeholder="Pesquisar qualquer tópico..." autocomplete="off">
          <span class="kbd">⌘K</span>
        </div>
        <div class="gresults" id="gres"></div>
      </div>
      <div style="flex:1"></div>
      <button class="theme-toggle" id="px-theme-btn" aria-label="Alternar tema" title="Alternar modo escuro" onclick="pxToggleTheme()"></button>
      ${right || ''}`;
  }

  function mountSearch() {
    const input = document.getElementById('gq');
    const box = document.getElementById('gres');
    if (!input || !box) return;
    let index = null;

    function run() {
      const q = input.value.trim().toLowerCase();
      if (!q) { box.classList.remove('open'); return; }
      if (!index) index = searchIndex();
      const seen = new Set();
      const hits = [];
      for (const it of index) {
        if (hits.length >= 24) break;
        const key = it.kind + it.label + it.sub;
        if (seen.has(key)) continue;
        if (it.label.toLowerCase().includes(q) || it.sub.toLowerCase().includes(q)) {
          seen.add(key); hits.push(it);
        }
      }
      box.innerHTML = hits.length
        ? hits.map(h => `<a class="gres" href="${h.href}"><span class="gk">${h.kind}</span><span style="min-width:0"><span class="gl">${h.label}</span><br><span class="gs">${h.sub}</span></span></a>`).join('')
        : '<div class="gempty">Nada encontrado</div>';
      box.classList.add('open');
    }

    input.addEventListener('input', run);
    input.addEventListener('focus', run);
    document.addEventListener('click', e => {
      if (!e.target.closest('.gsearch')) box.classList.remove('open');
    });
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input.focus(); input.select(); }
      if (e.key === 'Escape') { box.classList.remove('open'); input.blur(); }
    });
  }

  window.toggleSidebar = function () {
    document.body.classList.toggle('sidebar-open');
  };

  /* Gesto de arrastar (celular): abre da borda esquerda, fecha arrastando para a esquerda */
  function mountSwipe() {
    if (window.__swipeMounted) return;
    window.__swipeMounted = true;
    let x0 = null, y0 = null, fromEdge = false;
    document.addEventListener('touchstart', e => {
      if (window.innerWidth > 860 || e.touches.length !== 1) return;
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
      fromEdge = x0 < 28;
    }, { passive: true });
    document.addEventListener('touchend', e => {
      if (x0 === null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - x0, dy = Math.abs(t.clientY - y0);
      x0 = null;
      if (dy > 60 || Math.abs(dx) < 55) return;
      const open = document.body.classList.contains('sidebar-open');
      if (dx > 0 && fromEdge && !open) document.body.classList.add('sidebar-open');
      if (dx < 0 && open) document.body.classList.remove('sidebar-open');
    }, { passive: true });
  }

  window.renderShell = function (opts) {
    opts = opts || {};
    const side = document.getElementById('shell-sidebar');
    const top = document.getElementById('shell-topbar');
    if (side) { side.className = 'shell-sidebar'; side.innerHTML = sidebarHTML(opts.active, opts.topicNav); }
    if (top) { top.className = 'shell-topbar'; top.innerHTML = topbarHTML(opts.right); mountSearch(); }
    if (window.__pxApplyTheme) window.__pxApplyTheme();
    if (!document.getElementById('shell-scrim')) {
      const sc = document.createElement('div');
      sc.id = 'shell-scrim';
      sc.className = 'shell-scrim';
      sc.onclick = () => document.body.classList.remove('sidebar-open');
      document.body.appendChild(sc);
    }
    mountSwipe();
    if (side) side.addEventListener('click', e => { if (e.target.closest('a, .ws-item')) document.body.classList.remove('sidebar-open'); });
  };
})();

/* ============ Sessão do aluno (Lovable Cloud) ============ */
(function () {
  if (!window.PX) {
    var s = document.createElement('script');
    s.src = 'px-auth.js';
    document.head.appendChild(s);
  }
  function paint() {
    var chip = document.getElementById('px-username');
    var av = document.getElementById('px-avatar');
    if (!chip || !window.PX || !PX.user) return;
    var nome = PX.displayName();
    chip.textContent = nome;
    av.textContent = (nome[0] || 'A').toUpperCase();
  }
  window.pxUserMenu = function () {
    if (!window.PX || !PX.user) return;
    var opts = PX.isAdmin() ? '\n1 - Painel administrativo\n2 - Sair' : '\n1 - Sair';
    var r = prompt(PX.displayName() + ' (' + PX.user.email + ')' + opts, '1');
    if (r === null) return;
    if (PX.isAdmin() && r.trim() === '1') location.href = 'admin.html';
    else PX.signOut();
  };
  var tries = 0;
  var t = setInterval(function () {
    if (++tries > 200) return clearInterval(t);
    if (!window.PX || !PX.ready) return;
    clearInterval(t);
    PX.requirePro('prf-2021').then(function (u) {
      if (!u) return;
      paint();
      var p = setInterval(function () { if (document.getElementById('px-username')) paint(); }, 400);
      setTimeout(function () { clearInterval(p); }, 4000);
    });
  }, 40);
})();
