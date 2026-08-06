/* Checkout Hotmart do Prova X — popup (checkoutMode=2) com fallback para redirect. */
window.PX_HOTMART = {
  mensal: "https://pay.hotmart.com/I107044926Q",
  // Enquanto a oferta anual não existir, cai no mesmo checkout.
  // Basta trocar por "https://pay.hotmart.com/I107044926Q?off=CODIGO_DA_OFERTA_ANUAL".
  anual: "https://pay.hotmart.com/I107044926Q",
};

(function () {
  function withParams(url, params) {
    Object.keys(params).forEach(function (k) {
      if (!params[k]) return;
      if (url.indexOf(k + "=") !== -1) return;
      url += (url.indexOf("?") === -1 ? "?" : "&") + k + "=" + encodeURIComponent(params[k]);
    });
    return url;
  }

  function userEmail() {
    try {
      var u = JSON.parse(localStorage.getItem("px_user") || "null");
      return (u && u.email) || "";
    } catch (e) {
      return "";
    }
  }

  function buildUrl(ciclo) {
    var cfg = window.PX_HOTMART || {};
    var url = ciclo === "anual" ? cfg.anual : cfg.mensal;
    if (!url) return "";
    return withParams(url, { checkoutMode: "2", email: userEmail() });
  }

  function ensureAnchor(ciclo) {
    var id = "px-hotmart-" + ciclo;
    var a = document.getElementById(id);
    if (!a) {
      a = document.createElement("a");
      a.id = id;
      a.className = "hotmart-fb hotmart__button-checkout";
      a.style.display = "none";
      a.setAttribute("onclick", "return false;");
      document.body.appendChild(a);
    }
    a.href = buildUrl(ciclo);
    return a;
  }

  function loadWidget() {
    if (document.getElementById("px-hotmart-widget")) return;
    var s = document.createElement("script");
    s.id = "px-hotmart-widget";
    s.src = "https://static.hotmart.com/checkout/widget.min.js";
    document.head.appendChild(s);
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://static.hotmart.com/css/hotmart-fb.min.css";
    document.head.appendChild(link);
  }

  function init() {
    ensureAnchor("mensal");
    ensureAnchor("anual");
    loadWidget();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.pxHotmartCheckout = function (ciclo) {
    var url = buildUrl(ciclo);
    if (!url) {
      alert("O link de checkout da Hotmart ainda não foi configurado.");
      return;
    }
    var a = ensureAnchor(ciclo);
    // O widget da Hotmart intercepta o clique e abre o checkout em popup.
    a.click();
    // Fallback: se o widget não abriu o overlay, redireciona.
    setTimeout(function () {
      var overlay = document.querySelector(
        "#hotmart-checkout-container, .hotmart-fb-iframe, iframe[src*='pay.hotmart.com']",
      );
      if (!overlay) window.location.href = url;
    }, 1200);
  };
})();
