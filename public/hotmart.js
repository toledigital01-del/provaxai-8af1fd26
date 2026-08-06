/* Configuração do checkout Hotmart do Prova X.
   Cole aqui os links de checkout gerados na Hotmart (Produto > Links). */
window.PX_HOTMART = {
  // Ex.: "https://pay.hotmart.com/XXXXXXXX?off=abcdefgh"
  mensal: "",
  anual: "",
};

window.pxHotmartCheckout = function (ciclo) {
  var cfg = window.PX_HOTMART || {};
  var url = ciclo === "anual" ? cfg.anual : cfg.mensal;
  if (!url) {
    alert(
      "O link de checkout da Hotmart ainda não foi configurado.\nAdicione-o em public/hotmart.js.",
    );
    return;
  }
  var email = "";
  try {
    var u = JSON.parse(localStorage.getItem("px_user") || "null");
    email = (u && u.email) || "";
  } catch (e) {}
  if (email) {
    url += (url.indexOf("?") === -1 ? "?" : "&") + "email=" + encodeURIComponent(email);
  }
  window.location.href = url;
};
