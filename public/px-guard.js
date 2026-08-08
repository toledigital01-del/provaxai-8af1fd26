/* Prova X — trava de acesso das páginas protegidas.
   Exige (1) sessão autenticada e (2) assinatura/acesso ativo.
   Basta incluir <script src="px-guard.js"></script> no <head> da página. */
(function () {
  var CURSO = (window.PX_GUARD_COURSE || 'prf-2021');

  // Esconde o conteúdo até a verificação terminar (evita "piscar" a área paga).
  var style = document.createElement('style');
  style.id = 'px-guard-style';
  style.textContent = 'html.px-checking body{visibility:hidden !important;}';
  document.documentElement.appendChild(style);
  document.documentElement.classList.add('px-checking');

  function release() {
    document.documentElement.classList.remove('px-checking');
  }

  function loadAuth() {
    return new Promise(function (resolve, reject) {
      if (window.PX && window.PX.ready) return resolve();
      var s = document.createElement('script');
      s.src = 'px-auth.js';
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('px-auth')); };
      document.head.appendChild(s);
    });
  }

  loadAuth()
    .then(function () { return window.PX.requirePro(CURSO); })
    .then(function (u) { if (u) release(); /* sem acesso: requirePro já redirecionou */ })
    .catch(function (e) {
      console.error('[PX] trava de acesso:', e);
      var next = location.pathname.split('/').pop() + location.search;
      location.href = 'login.html?next=' + encodeURIComponent(next);
    });

  // Falha-segura: se nada respondeu em 12s, manda para o login em vez de liberar.
  setTimeout(function () {
    if (document.documentElement.classList.contains('px-checking')) {
      var next = location.pathname.split('/').pop() + location.search;
      location.href = 'login.html?next=' + encodeURIComponent(next);
    }
  }, 12000);
})();
