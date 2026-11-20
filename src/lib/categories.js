// The shop's categories. Products are grouped by matching keywords in their
// category (or, if nothing matches, their title), so old products whose
// category was written freely by the AI still land in the right group
// without being edited one by one. Order matters: first match wins.

export const CATEGORIES = [
  { slug: "eclairage-led", label: "Éclairage & LED", keywords: ["eclairage", "led", "lumiere", "lampe", "ambiance"] },
  {
    slug: "electronique-securite",
    label: "Électronique & Sécurité",
    keywords: ["dashcam", "camera", "capteur", "stationnement", "gps", "traceur", "securite", "antivol", "alarme", "electronique"],
  },
  { slug: "batteries-demarrage", label: "Batteries & Démarrage", keywords: ["batterie", "demarr", "booster", "jump", "compresseur"] },
  { slug: "nettoyage-entretien", label: "Nettoyage & Entretien", keywords: ["aspirateur", "nettoyage", "entretien", "lavage"] },
  {
    slug: "confort-interieur",
    label: "Confort & Intérieur",
    keywords: ["appui", "siege", "confort", "interieur", "parfum", "diffuseur", "tapis", "housse", "volant"],
  },
  {
    slug: "chargeurs-outillage",
    label: "Chargeurs & Outillage",
    keywords: ["chargeur", "usb", "outil", "outillage", "cliquet", "douille"],
  },
];

const normalize = (s = "") =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const matchIn = (text) => {
  const t = normalize(text);
  return t ? CATEGORIES.find((c) => c.keywords.some((k) => t.includes(k))) : undefined;
};

/** The shop category of a product ({ category, title }), or null if none fits. */
export const categoryOf = (product) => matchIn(product.category) || matchIn(product.title) || null;

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug) || null;
