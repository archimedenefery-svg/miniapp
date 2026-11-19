/* =============================================================================
   FICHE DE LA BOUTIQUE (mini app)
   =============================================================================
   ➜ C'EST LE SEUL FICHIER À MODIFIER POUR CHANGER LA BOUTIQUE.
     Les autres fichiers (index.html, style.css, app.js) n'ont pas besoin d'être touchés.

   COMMENT OUVRIR CE FICHIER : clic droit > Ouvrir avec > Bloc-notes
   (ou Visual Studio Code si vous l'avez).

   LES 5 RÈGLES À RESPECTER (sinon la page reste vide) :
   1. Le texte s'écrit ENTRE GUILLEMETS DROITS : "Mon texte"
      (pas les guillemets courbes “ ” de Word, pas les « »).
   2. Chaque ligne d'information finit par une VIRGULE :  name: "SWEETZONE",
   3. On ne modifie QUE ce qui est entre guillemets, ou les nombres (prix).
      Ne supprimez pas les mots avant les deux-points (name:, price:, ...).
   4. On ne supprime jamais les accolades { } ni les crochets [ ].
   5. Pour un guillemet DANS un texte, écrivez \"  (barre oblique puis guillemet).
      Les apostrophes ' s'écrivent normalement.

   Les lignes qui commencent par //  sont des commentaires : elles servent
   uniquement d'explication et sont ignorées par l'ordinateur.

   APRÈS MODIFICATION : enregistrer (Ctrl+S), puis renvoyer ce fichier sur GitHub
   (voir GUIDE_MODIFICATION.md). Les clients voient le changement en 1 à 2 minutes.
   ============================================================================= */

window.SHOP = {

  // ---------------------------------------------------------------------------
  // 1. IDENTITÉ DE LA BOUTIQUE
  // ---------------------------------------------------------------------------

  // Nom affiché en grand en haut de l'écran
  name: "SWEETZONE",

  // Logo : nom du fichier image placé dans le dossier "images".
  // Exemple : logo: "images/logo.png",
  // Laisser vide ("") pour afficher l'emoji ci-dessous à la place.
  logo: "",

  // Emoji affiché si aucun logo n'est mis (copier-coller un emoji depuis Internet)
  logo_emoji: "🍪",

  // Monnaie écrite après chaque prix
  currency: "FCFA",

  // Langue des boutons au premier lancement : "fr" (français) ou "en" (anglais)
  default_lang: "fr",

  // ---------------------------------------------------------------------------
  // 2. COULEURS
  // Format : # suivi de 6 caractères (ex : "#ff0000" = rouge).
  // Pour trouver le code d'une couleur : chercher "color picker" sur Google.
  // ---------------------------------------------------------------------------
  theme: {
    bg: "#0f1328",      // fond de la page (bleu nuit)
    card: "#1a1f3a",    // fond des cadres
    accent: "#d4b96a",  // couleur des prix, icônes, contour du logo (doré)
    text: "#f5ecd7",    // couleur du texte (crème)
  },

  // ---------------------------------------------------------------------------
  // 3. LIENS DES BOUTONS
  // Laisser "" (vide) pour cacher un bouton.
  // ---------------------------------------------------------------------------
  links: {
    // Compte Telegram qui répond aux clients. Format : https://t.me/pseudo
    telegram_support: "https://t.me/TON_PSEUDO",

    // Numéro WhatsApp. Format : https://wa.me/237 suivi du numéro, sans espace ni +
    whatsapp: "https://wa.me/237600000000",

    // Canal Telegram de la boutique (onglet "Groupes"). Format : https://t.me/nomducanal
    channel: "https://t.me/TON_CANAL",
  },

  // ---------------------------------------------------------------------------
  // 4. ONGLET "INFOS"
  // Une ligne laissée vide ("") n'est pas affichée.
  // ---------------------------------------------------------------------------
  info: {
    welcome: "🍪 BIENVENUE CHEZ SWEETZONE ! 🍬",
    description: "Biscuits, bonbons et gourmandises sélectionnés, livrés rapidement.",
    delivery: "Douala — livraison sous 24 h",
    hours: "Lun–Sam : 9 h – 20 h",
    payment: "Paiement à la livraison ou Mobile Money",
  },

  // ---------------------------------------------------------------------------
  // 5. CATÉGORIES (les grandes bannières de l'onglet "Menu")
  // Une catégorie = une ligne entre { }.
  //   id       : code court, SANS espace ni accent, unique (sert à relier les produits)
  //   name     : nom affiché
  //   emoji    : dessin affiché sur la bannière
  //   image    : photo de fond (ex : "images/biscuits.jpg"), ou "" pour un dégradé
  //   gradient : 2 couleurs du dégradé (utilisé seulement si pas d'image)
  // POUR AJOUTER une catégorie : copier une ligne entière, la coller en dessous,
  // puis changer id, name, emoji.
  // POUR SUPPRIMER : effacer la ligne entière (et ses produits plus bas).
  // ---------------------------------------------------------------------------
  categories: [
    { id: "biscuits",  name: "Biscuits",        emoji: "🍪", image: "", gradient: ["#7a4b1e", "#d49a4c"] },
    { id: "bonbons",   name: "Bonbons",         emoji: "🍬", image: "", gradient: ["#8a1f5c", "#e46aa8"] },
    { id: "chocolats", name: "Chocolats",       emoji: "🍫", image: "", gradient: ["#3b2016", "#8a5a3c"] },
    { id: "autres",    name: "Autres douceurs", emoji: "🧁", image: "", gradient: ["#2a4a7a", "#6aa0e4"] },
  ],

  // ---------------------------------------------------------------------------
  // 6. PRODUITS
  // Un produit = un bloc entre { }.
  //   id          : code unique (p1, p2, p3...). Deux produits ne doivent pas avoir le même.
  //   category    : DOIT être identique à l'"id" d'une catégorie ci-dessus
  //   name        : nom du produit
  //   format      : poids, quantité ou conditionnement
  //   price       : prix en chiffres, SANS guillemets, SANS espace, SANS "FCFA" (ex : 1500)
  //   emoji       : dessin affiché si pas de photo
  //   image       : photo (ex : "images/cookies.jpg"), ou "" pour l'emoji
  //   available   : true = en stock ; false = affiché "Épuisé" (sans guillemets)
  //   description : petit texte affiché quand on touche le produit
  // POUR AJOUTER un produit : copier un bloc { ... }, (accolades ET virgule
  // comprises), le coller à la suite, puis changer l'id et les infos.
  // ---------------------------------------------------------------------------
  products: [
    {
      id: "p1",
      category: "biscuits",
      name: "Cookies pépites chocolat",
      format: "Paquet 200 g",
      price: 1500,
      emoji: "🍪",
      image: "",
      available: true,
      description: "Cookies croustillants aux pépites de chocolat.",
    },
    {
      id: "p2",
      category: "biscuits",
      name: "Biscuits beurre",
      format: "Boîte 300 g",
      price: 2000,
      emoji: "🧈",
      image: "",
      available: true,
      description: "Biscuits sablés pur beurre.",
    },
    {
      id: "p3",
      category: "biscuits",
      name: "Gaufrettes vanille",
      format: "Paquet 150 g",
      price: 1000,
      emoji: "🧇",
      image: "",
      available: true,
      description: "Gaufrettes fourrées à la vanille.",
    },
    {
      id: "p4",
      category: "bonbons",
      name: "Bonbons acidulés",
      format: "Sachet 250 g",
      price: 1200,
      emoji: "🍬",
      image: "",
      available: true,
      description: "Assortiment de bonbons acidulés aux fruits.",
    },
    {
      id: "p5",
      category: "bonbons",
      name: "Sucettes",
      format: "Lot de 10",
      price: 1000,
      emoji: "🍭",
      image: "",
      available: true,
      description: "Sucettes parfums variés.",
    },
    {
      id: "p6",
      category: "bonbons",
      name: "Guimauves",
      format: "Sachet 200 g",
      price: 1500,
      emoji: "☁️",
      image: "",
      available: false,
      description: "Guimauves moelleuses.",
    },
    {
      id: "p7",
      category: "chocolats",
      name: "Tablette lait",
      format: "100 g",
      price: 1500,
      emoji: "🍫",
      image: "",
      available: true,
      description: "Chocolat au lait.",
    },
    {
      id: "p8",
      category: "chocolats",
      name: "Bouchées pralinées",
      format: "Boîte de 12",
      price: 3500,
      emoji: "🎁",
      image: "",
      available: true,
      description: "Bouchées fourrées praliné.",
    },
    {
      id: "p9",
      category: "autres",
      name: "Cupcakes",
      format: "Lot de 4",
      price: 3000,
      emoji: "🧁",
      image: "",
      available: true,
      description: "Cupcakes glaçage crème.",
    },
    {
      id: "p10",
      category: "autres",
      name: "Beignets sucrés",
      format: "Lot de 6",
      price: 1000,
      emoji: "🍩",
      image: "",
      available: true,
      description: "Beignets sucrés du jour.",
    },
  ],

  // ---------------------------------------------------------------------------
  // 7. AVIS CLIENTS (onglet "Avis")
  // N'ajoutez que de VRAIS avis reçus de clients.
  // Modèle à copier entre les crochets [ ] (enlever les // au début) :
  //   { name: "Prénom", stars: 5, text: "Ce que le client a dit" },
  // stars = note de 1 à 5, sans guillemets.
  // Liste vide = l'onglet affiche "Aucun avis pour le moment".
  // ---------------------------------------------------------------------------
  reviews: [
  ],

};
