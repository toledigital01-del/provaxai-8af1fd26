/* Configuração do checkout Hotmart do Prova X.
   Links gerados na Hotmart (Produto > Links / Ofertas). */
window.PX_HOTMART = {
  mensal: "https://pay.hotmart.com/I107044926Q",
  // Enquanto a oferta anual não existir, cai no mesmo checkout.
  // Basta trocar por "https://pay.hotmart.com/I107044926Q?off=CODIGO_DA_OFERTA_ANUAL".
  anual: "https://pay.hotmart.com/I107044926Q",
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
