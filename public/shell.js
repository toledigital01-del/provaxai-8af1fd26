/* Shell compartilhado: sidebar + topbar com pesquisa global */
(function () {
  const NAV = [
    { id: 'hoje', href: 'dashboard.html', label: 'Hoje', icon: '<path d="M12 2v4M5 8h14M4 8h16v12H4z"/><path d="M9 13h2v2H9z"/>' },
    { id: 'materiais', href: 'study-sets.html', label: 'Meus Materiais', icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>' },
    { id: 'resolver', href: 'solve.html', label: 'Resolver', icon: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>' },
    { id: 'corretor', href: 'paper-grader.html', label: 'Corretor', icon: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 12 2 2 4-4"/>' },
    { id: 'app', href: 'app.html', label: 'App', icon: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M12 18h.01"/>' },
  ];

  function icon(d) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  }

  function sidebarHTML(active) {
    return `
      <a href="dashboard.html" class="shell-logo">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><path d="M16 2C16 2 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 2 16 2Z" fill="#FF4D00"/><path d="M16 8C16 8 11 14 11 18C11 20.8 13.2 23 16 23C18.8 23 21 20.8 21 18C21 14 16 8 16 8Z" fill="#FF8040"/></svg>
        <span>Studley</span>
      </a>
      <nav class="shell-nav">
        <div class="shell-sec">Workspace</div>
        ${NAV.map(n => `<a href="${n.href}" class="nav-item${n.id === active ? ' active' : ''}">${icon(n.icon)}<span>${n.label}</span></a>`).join('')}
        <div class="shell-sec">Recentes</div>
        ${MATERIALS.slice(0, 4).map(m => `<a href="${materialHref(m)}" class="nav-item">${icon('<path d="M4 4h10l6 6v10H4z"/>')}<span>${m.title}</span></a>`).join('')}
      </nav>
      <div class="shell-foot">
        <button class="user-chip" onclick="alert('Perfil em breve!')">
          <div class="avatar">F</div>
          <span style="flex:1;font-size:0.84rem;font-weight:500;">Fernando</span>
        </button>
      </div>`;
  }

  function topbarHTML(right) {
    return `
      <div class="gsearch">
        <div class="gsearch-input">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#98a0b0" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input id="gq" placeholder="Pesquisar qualquer tópico..." autocomplete="off">
          <span class="kbd">⌘K</span>
        </div>
        <div class="gresults" id="gres"></div>
      </div>
      <div style="flex:1"></div>
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

  window.renderShell = function (opts) {
    opts = opts || {};
    const side = document.getElementById('shell-sidebar');
    const top = document.getElementById('shell-topbar');
    if (side) { side.className = 'shell-sidebar'; side.innerHTML = sidebarHTML(opts.active); }
    if (top) { top.className = 'shell-topbar'; top.innerHTML = topbarHTML(opts.right); mountSearch(); }
  };
})();
