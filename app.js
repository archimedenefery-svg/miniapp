/* =============================================================================
   APP.JS — LE "MOTEUR" DE LA MINI APP
   =============================================================================
   ➜ NON-INFORMATICIEN : VOUS N'AVEZ PAS BESOIN DE MODIFIER CE FICHIER.
     Pour changer les produits, prix, couleurs, liens, textes : config.js.
     Seule exception : les textes des boutons (section 2 ci-dessous).

   Ce fichier fait fonctionner la page :
     - il lit la fiche de la boutique (config.js) ;
     - il dessine l'écran correspondant à l'onglet touché en bas ;
     - il gère la recherche, la langue, la fiche produit et les liens.

   Les lignes entre /* ... *\/ ou après // sont des explications, ignorées
   par l'ordinateur.
   ============================================================================= */


/* -----------------------------------------------------------------------------
   1. CONNEXION À TELEGRAM
   Quand la page est ouverte dans Telegram, Telegram fournit des outils
   (fermer, vibrer, ouvrir un lien...). Ouverte dans un navigateur normal
   (pour tester sur PC), ces outils n'existent pas : "tg" vaut alors null
   et la page fonctionne quand même.
   ----------------------------------------------------------------------------- */
// "let" et non "const" : le fichier de Telegram peut arriver APRÈS cette page
// (chargement "async" dans index.html). connecterTelegram() le branche alors.
let tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;


/* -----------------------------------------------------------------------------
   2. TEXTES DES BOUTONS ET TITRES (français / anglais)
   ✏️ MODIFIABLE : vous pouvez changer le texte ENTRE GUILLEMETS à droite
   des deux-points. Ne touchez pas au mot à gauche (ex : tab_menu).
   Ces textes changent quand le client choisit FR ou EN en haut à droite.
   (Les noms de produits, eux, se modifient dans config.js.)
   ----------------------------------------------------------------------------- */
const I18N = {
  fr: {
    tab_groups: "Groupes",          // barre du bas, 1er onglet
    tab_contact: "Contact",         // barre du bas, 2e onglet
    tab_menu: "Menu",               // barre du bas, 3e onglet
    tab_reviews: "Avis",            // barre du bas, 4e onglet
    tab_info: "Infos",              // barre du bas, 5e onglet
    search: "Rechercher un produit...",  // texte gris dans la barre de recherche
    channels: "Canaux officiels",   // titre de l'onglet Groupes
    channel_btn: "Canal Telegram",  // bouton de l'onglet Groupes
    support: "Support",             // titre de l'onglet Contact
    telegram: "Telegram",           // bouton bleu de l'onglet Contact
    whatsapp: "WhatsApp",           // bouton vert de l'onglet Contact
    products: "produits",           // sous le nom des catégories : "3 produits"
    results: "Résultats",           // titre quand on fait une recherche
    no_result: "Aucun produit trouvé.",
    no_reviews: "Aucun avis pour le moment.",
    out: "Épuisé",                  // produit avec available: false
    order_hint: "La commande depuis le panier arrive à l'étape suivante. En attendant, contacte le support.",
    contact_order: "Commander via le support",  // bouton dans la fiche produit
    delivery: "Livraison",          // onglet Infos
    hours: "Horaires",              // onglet Infos
    payment: "Paiement",            // onglet Infos
  },
  en: {
    tab_groups: "Groups",
    tab_contact: "Contact",
    tab_menu: "Menu",
    tab_reviews: "Reviews",
    tab_info: "Info",
    search: "Search a product...",
    channels: "Official channels",
    channel_btn: "Telegram channel",
    support: "Support",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    products: "products",
    results: "Results",
    no_result: "No product found.",
    no_reviews: "No reviews yet.",
    out: "Sold out",
    order_hint: "Cart ordering comes in the next step. Meanwhile, contact support.",
    contact_order: "Order via support",
    delivery: "Delivery",
    hours: "Hours",
    payment: "Payment",
  },
};


/* ============================ ⛔ À PARTIR D'ICI : NE PAS MODIFIER ⛔ ============================
   (sauf si vous savez programmer — les explications restent là pour comprendre)
   ================================================================================================ */


/* -----------------------------------------------------------------------------
   3. MÉMOIRE DE LA PAGE ("état")
   La page retient ici ce qui est affiché en ce moment. Dès qu'une de ces
   valeurs change (clic, recherche...), l'écran est redessiné.
   ----------------------------------------------------------------------------- */
const state = {
  cfg: null,        // la fiche boutique (contenu de config.js)
  lang: "fr",       // langue choisie
  tab: "menu",      // onglet affiché à l'ouverture : "menu"
  category: null,   // catégorie ouverte (null = on voit la liste des catégories)
  query: "",        // ce que le client a tapé dans la recherche
  sheet: null,      // produit affiché en grand (null = aucun)
};


/* -----------------------------------------------------------------------------
   4. PETITS OUTILS
   ----------------------------------------------------------------------------- */

// $("#nom") = "trouve l'élément de la page qui porte ce nom"
const $ = (sel) => document.querySelector(sel);

// t("clé") = "donne le texte de la section 2 dans la langue choisie"
const t = (key) => (I18N[state.lang] || I18N.fr)[key] || key;

// esc(texte) = protège les textes de config.js : un caractère spécial
// (< > & ") dans un nom de produit ne peut pas casser la page.
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// price(1500) = "1 500 FCFA" (ajoute un espace tous les 3 chiffres + la monnaie)
const price = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + (state.cfg.currency || "");


/* -----------------------------------------------------------------------------
   5. DESSINS DES ICÔNES (format SVG = dessin décrit par des coordonnées)
   ----------------------------------------------------------------------------- */
const ICON = {
  // icône de l'onglet Groupes (schéma en arbre)
  layers: '<svg class="big-icon" viewBox="0 0 24 24"><path d="M8 3h8v5h-3v2h7v4h2v7h-6v-7h2v-2H6v2h2v7H2v-7h2v-4h7V8H8z"/></svg>',
  // icône de l'onglet Contact (2 bulles)
  chat: '<svg class="big-icon" viewBox="0 0 24 24"><path d="M3 4h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3.5V15H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M19 8h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1v3l-4-3h-5a2 2 0 0 1-2-2v-1h7a3 3 0 0 0 3-3z"/></svg>',
  // avion en papier Telegram
  telegram: '<svg viewBox="0 0 24 24"><path d="M21.9 4.3 18.6 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.2L6 13.5 1.1 12c-1.1-.3-1.1-1.1.2-1.6L20.5 3c.9-.3 1.7.2 1.4 1.3Z"/></svg>',
  // logo WhatsApp
  whatsapp: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>',
};


/* -----------------------------------------------------------------------------
   6. OUVERTURE DES LIENS
   Dans Telegram : un lien t.me s'ouvre dans Telegram, les autres (WhatsApp...)
   dans le navigateur du téléphone. Hors Telegram : nouvel onglet.
   ----------------------------------------------------------------------------- */
function openLink(url) {
  if (!url) return;                                      // lien vide : on ne fait rien
  if (tg && /^https:\/\/t\.me\//.test(url) && tg.openTelegramLink) tg.openTelegramLink(url);
  else if (tg && tg.openLink) tg.openLink(url);
  else window.open(url, "_blank");
}


/* -----------------------------------------------------------------------------
   7. APPLIQUER LA FICHE BOUTIQUE (couleurs, logo, nom) — une fois au démarrage
   ----------------------------------------------------------------------------- */
function applyConfig() {
  const c = state.cfg;

  // Couleurs : remplace les couleurs par défaut de style.css par celles de config.js
  for (const [k, v] of Object.entries(c.theme || {})) document.documentElement.style.setProperty("--" + k, v);

  // Couleur de la barre du haut de Telegram (ignoré si l'appli Telegram est trop ancienne)
  try { tg && tg.setHeaderColor(c.theme.bg); tg && tg.setBackgroundColor(c.theme.bg); } catch (e) {}

  document.title = c.name;                     // nom dans l'onglet du navigateur
  $("#shop-name").textContent = c.name;        // grand titre
  // Logo : l'image si elle est indiquée, sinon l'emoji
  $("#logo").innerHTML = c.logo ? `<img src="${esc(c.logo)}" alt="">` : esc(c.logo_emoji || "🛍️");
}

// Met les textes de la section 2 dans la langue choisie
function applyLang() {
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  $("#search").placeholder = t("search");
  $("#lang").value = state.lang;
}


/* -----------------------------------------------------------------------------
   8. LES ÉCRANS
   Chaque fonction ci-dessous fabrique le contenu d'un écran (en HTML,
   le langage des pages web) à partir des infos de config.js.
   ----------------------------------------------------------------------------- */

// Écran MENU : les grandes bannières de catégories
function viewCategories() {
  const { categories, products } = state.cfg;
  return categories.map((cat) => {
    // nombre de produits rangés dans cette catégorie
    const count = products.filter((p) => p.category === cat.id).length;
    const [a, b] = cat.gradient || ["#333", "#555"];
    // fond : la photo si elle existe, sinon le dégradé de 2 couleurs
    const bg = cat.image ? `background-image:url('${esc(cat.image)}')` : `background:linear-gradient(135deg, ${a}, ${b})`;
    return `<button class="banner" data-cat="${esc(cat.id)}">
        <div class="bg" style="${bg}"></div>
        ${cat.image ? "" : `<div class="emoji">${esc(cat.emoji)}</div>`}
        <div class="label"><strong>${esc(cat.name)}</strong><small>${count} ${t("products")}</small></div>
      </button>`;
  }).join("");
}

// Une vignette de produit (photo ou emoji, nom, format, prix, "Épuisé")
function productCard(p) {
  const thumb = p.image ? `style="background-image:url('${esc(p.image)}')"` : `style="background:rgba(255,255,255,.04)"`;
  return `<button class="product ${p.available ? "" : "out"}" data-prod="${esc(p.id)}">
      <div class="thumb" ${thumb}>${p.image ? "" : esc(p.emoji || "🛍️")}</div>
      <div class="meta">
        <span class="name">${esc(p.name)}</span>
        <span class="format">${esc(p.format)}</span>
        <span class="price">${price(p.price)}</span>
        ${p.available ? "" : `<span class="tag-out">${t("out")}</span>`}
      </div>
    </button>`;
}

// Écran MENU > une catégorie : flèche retour + produits sur 2 colonnes
function viewProducts() {
  const cat = state.cfg.categories.find((c) => c.id === state.category);
  const list = state.cfg.products.filter((p) => p.category === state.category);
  return `<div class="section-head"><button class="back" data-back>←</button><h2>${esc(cat ? cat.name : "")}</h2></div>
    ${list.length ? `<div class="grid">${list.map(productCard).join("")}</div>` : `<p class="empty">${t("no_result")}</p>`}`;
}

// Écran RECHERCHE : produits dont le nom, format ou description contient le mot tapé
function viewSearch() {
  const q = state.query.toLowerCase();
  const list = state.cfg.products.filter((p) => (p.name + " " + p.format + " " + (p.description || "")).toLowerCase().includes(q));
  return `<div class="section-head"><h2>${t("results")}</h2></div>
    ${list.length ? `<div class="grid">${list.map(productCard).join("")}</div>` : `<p class="empty">${t("no_result")}</p>`}`;
}

// Écran GROUPES : bouton vers le canal Telegram
function viewGroups() {
  return `<div class="card">${ICON.layers}<h2>${t("channels")}</h2>
      <button class="btn" data-link="${esc(state.cfg.links.channel)}">${ICON.telegram}${t("channel_btn")}</button></div>`;
}

// Écran CONTACT : boutons Telegram et WhatsApp (cachés si le lien est vide)
function viewContact() {
  const l = state.cfg.links;
  return `<div class="card">${ICON.chat}<h2>${t("support")}</h2>
      ${l.telegram_support ? `<button class="btn" data-link="${esc(l.telegram_support)}">${ICON.telegram}${t("telegram")}</button>` : ""}
      ${l.whatsapp ? `<button class="btn whatsapp" data-link="${esc(l.whatsapp)}">${ICON.whatsapp}${t("whatsapp")}</button>` : ""}
    </div>`;
}

// Écran AVIS : uniquement les avis écrits dans config.js
function viewReviews() {
  const r = state.cfg.reviews || [];
  if (!r.length) return `<div class="card"><p class="empty">${t("no_reviews")}</p></div>`;
  return r.map((x) => `<div class="review"><div class="who">${esc(x.name)}</div>
      <div class="stars">${"★".repeat(x.stars || 5)}${"☆".repeat(5 - (x.stars || 5))}</div><p>${esc(x.text)}</p></div>`).join("");
}

// Écran INFOS : logo, nom, accueil, livraison, horaires, paiement
function viewInfo() {
  const c = state.cfg, i = c.info || {};
  return `<div class="card">
      <div class="logo" style="margin-top:0">${c.logo ? `<img src="${esc(c.logo)}" alt="">` : esc(c.logo_emoji || "🛍️")}</div>
      <h2 style="font-family:Inter;text-transform:none;font-weight:400;margin:8px 0 14px">${esc(c.name)}</h2>
      <p><strong>${esc(i.welcome)}</strong><br>${esc(i.description)}</p>
      <div class="info-rows">
        ${i.delivery ? `<div>🚚 <span><b>${t("delivery")} :</b> ${esc(i.delivery)}</span></div>` : ""}
        ${i.hours ? `<div>🕘 <span><b>${t("hours")} :</b> ${esc(i.hours)}</span></div>` : ""}
        ${i.payment ? `<div>💳 <span><b>${t("payment")} :</b> ${esc(i.payment)}</span></div>` : ""}
      </div></div>`;
}

// FICHE PRODUIT : la fenêtre qui monte du bas quand on touche un produit
function renderSheet() {
  const p = state.sheet;
  // montrer ou cacher la fenêtre et le voile sombre derrière
  $("#sheet").classList.toggle("hidden", !p);
  $("#sheet-bg").classList.toggle("hidden", !p);
  if (!p) return;
  const thumb = p.image ? `style="background-image:url('${esc(p.image)}')"` : `style="background:rgba(255,255,255,.05)"`;
  $("#sheet").innerHTML = `<button class="close" data-close>✕</button>
    <div class="thumb" ${thumb}>${p.image ? "" : esc(p.emoji || "🛍️")}</div>
    <h3>${esc(p.name)}</h3><div class="format">${esc(p.format)}</div>
    <p>${esc(p.description)}</p>
    <div class="price">${price(p.price)}</div>
    ${p.available ? "" : `<p class="tag-out">${t("out")}</p>`}
    <p class="format">${t("order_hint")}</p>
    <button class="btn" data-link="${esc(state.cfg.links.telegram_support)}">${ICON.telegram}${t("contact_order")}</button>`;
}


/* -----------------------------------------------------------------------------
   9. DESSINER L'ÉCRAN
   Choisit quel écran afficher selon la mémoire (section 3), allume l'onglet
   actif en bas et affiche/cache la flèche "retour" de Telegram.
   ----------------------------------------------------------------------------- */
function render() {
  let html;
  if (state.query) html = viewSearch();                                                // une recherche est en cours
  else if (state.tab === "menu") html = state.category ? viewProducts() : viewCategories();
  else html = { groups: viewGroups, contact: viewContact, reviews: viewReviews, info: viewInfo }[state.tab]();
  $("#view").innerHTML = html;

  // onglet du bas en surbrillance
  document.querySelectorAll(".tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.tab === state.tab));
  renderSheet();

  // flèche retour de Telegram (en haut à gauche) seulement s'il y a quelque chose à fermer
  if (tg && tg.BackButton) (state.sheet || state.category) ? tg.BackButton.show() : tg.BackButton.hide();
}

// Retour arrière : ferme la fiche produit, sinon revient à la liste des catégories
function goBack() {
  if (state.sheet) state.sheet = null;
  else if (state.category) state.category = null;
  render();
}


/* -----------------------------------------------------------------------------
   10. RÉACTIONS AUX GESTES DU CLIENT
   Un seul "écouteur" surveille tous les clics de la page et regarde quelle
   étiquette porte l'élément touché :
     data-tab  = onglet du bas        data-cat   = bannière de catégorie
     data-prod = produit              data-link  = bouton lien
     data-back = flèche retour        data-close = croix de la fiche
   ----------------------------------------------------------------------------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-tab],[data-cat],[data-prod],[data-link],[data-back],[data-close],#sheet-bg");
  if (!el) return;                                                   // clic dans le vide
  if (el.dataset.tab) {                                              // onglet du bas
    state.tab = el.dataset.tab; state.category = null; state.query = ""; $("#search").value = ""; window.scrollTo(0, 0);
  }
  else if (el.dataset.cat) { state.category = el.dataset.cat; window.scrollTo(0, 0); }                 // catégorie
  else if (el.dataset.prod) { state.sheet = state.cfg.products.find((p) => p.id === el.dataset.prod); } // produit
  else if (el.dataset.link) { openLink(el.dataset.link); return; }                                    // lien
  else if ("back" in el.dataset || "close" in el.dataset || el.id === "sheet-bg") { goBack(); return; } // retour/fermer
  if (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();  // petite vibration du téléphone
  render();
});

// Recherche : la liste se met à jour à chaque lettre tapée
$("#search").addEventListener("input", (e) => { state.query = e.target.value.trim(); render(); });

// Choix de la langue (retenu sur le téléphone pour la prochaine ouverture)
$("#lang").addEventListener("change", (e) => {
  state.lang = e.target.value;
  try { localStorage.setItem("lang", state.lang); } catch (_) {}
  applyLang(); render();
});


/* -----------------------------------------------------------------------------
   11. DÉMARRAGE DE LA PAGE
   ----------------------------------------------------------------------------- */
// Branche les outils Telegram dès qu'ils sont disponibles (tout de suite, ou plus
// tard si le fichier de Telegram arrive après la page). Une seule fois.
let telegramBranche = false;
function connecterTelegram() {
  if (telegramBranche || !(window.Telegram && window.Telegram.WebApp)) return;
  telegramBranche = true;
  tg = window.Telegram.WebApp;
  tg.ready();                                   // prévient Telegram que la page est prête
  tg.expand();                                  // plein écran
  tg.BackButton && tg.BackButton.onClick(goBack);
  if (state.cfg) { try { tg.setHeaderColor(state.cfg.theme.bg); tg.setBackgroundColor(state.cfg.theme.bg); } catch (e) {} render(); }
}
window.connecterTelegram = connecterTelegram;

function init() {
  connecterTelegram();

  // window.SHOP est créé par config.js. S'il n'existe pas, c'est que config.js
  // est absent ou contient une faute de frappe (virgule, guillemet, accolade).
  if (!window.SHOP) {
    $("#view").innerHTML = `<p class="empty">⚠️ Fiche boutique illisible.<br>Vérifiez config.js : une virgule, un guillemet ou une accolade manque probablement près de votre dernière modification.</p>`;
    return;
  }
  state.cfg = window.SHOP;

  // Langue : celle choisie la dernière fois, sinon celle de config.js
  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (_) {}
  state.lang = saved || state.cfg.default_lang || "fr";

  applyConfig();
  applyLang();
  render();
}

init();
