/* Prova X — camada de analytics da landing page.
   Envia eventos para o Google Analytics (gtag) quando um measurement ID está
   configurado, e sempre empilha em window.dataLayer para outras ferramentas. */
(function () {
  var GA_ID = window.PX_GA_ID || ""; // ex.: "G-XXXXXXX"

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  if (GA_ID) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_ID, { page_path: location.pathname });
  }

  function track(name, params) {
    var payload = params || {};
    payload.page_path = location.pathname;
    try { window.gtag("event", name, payload); } catch (e) {}
    window.dataLayer.push(Object.assign({ event: name }, payload));
  }
  window.pxTrack = track;

  function label(el) {
    return (el.getAttribute("data-evt-label") || el.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);
  }
  function section(el) {
    var s = el.closest("section[id], header, footer");
    return (s && (s.id || s.tagName.toLowerCase())) || "page";
  }

  /* ---- Cliques em CTA ---- */
  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("a.btn, button.btn, [data-evt]");
    if (!el) return;
    var name = el.getAttribute("data-evt") || "cta_click";
    track(name, {
      cta_label: label(el),
      cta_section: section(el),
      cta_href: el.getAttribute("href") || null,
    });
  }, true);

  /* ---- Profundidade de rolagem ---- */
  var marks = [25, 50, 75, 100], seen = {};
  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - innerHeight;
    var pct = max > 0 ? Math.round((scrollY / max) * 100) : 100;
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      if (pct >= m && !seen[m]) { seen[m] = 1; track("scroll_depth", { percent_scrolled: m }); }
    }
    if (seen[100]) removeEventListener("scroll", onScroll);
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Conversões: início de checkout mensal/anual ---- */
  var PLANS = {
    mensal: { value: 47, item_id: "prf-mensal", item_name: "Prova X PRF — Mensal" },
    anual: { value: 397, item_id: "prf-anual", item_name: "Prova X PRF — Anual" },
  };
  function wrap() {
    var orig = window.pxHotmartCheckout;
    if (typeof orig !== "function" || orig.__pxTracked) return false;
    var wrapped = function (ciclo) {
      var p = PLANS[ciclo] || PLANS.mensal;
      track("begin_checkout", {
        currency: "BRL",
        value: p.value,
        plan: ciclo,
        items: [{ item_id: p.item_id, item_name: p.item_name, price: p.value, quantity: 1 }],
      });
      track(ciclo === "anual" ? "checkout_anual" : "checkout_mensal", { value: p.value, currency: "BRL" });
      return orig.apply(this, arguments);
    };
    wrapped.__pxTracked = true;
    window.pxHotmartCheckout = wrapped;
    return true;
  }
  if (!wrap()) {
    var tries = 0;
    var t = setInterval(function () { if (wrap() || ++tries > 40) clearInterval(t); }, 100);
  }

  /* ---- Retorno do checkout (?purchase=success) ---- */
  try {
    var q = new URLSearchParams(location.search);
    if (q.get("purchase") === "success") {
      var plano = q.get("plan") || "desconhecido";
      var pl = PLANS[plano];
      track("purchase_confirmed", {
        currency: "BRL",
        plan: plano,
        value: pl ? pl.value : undefined,
      });
    }
  } catch (e) {}

  track("page_view", { page_title: document.title });
})();
