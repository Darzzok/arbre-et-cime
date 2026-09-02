/**
 * Audit de contenu — phase 17.
 *
 * Cherche dans le HTML SERVI les affirmations qu'aucune donnée du projet ne
 * soutient. Le texte rendu est la seule source qui compte : une promesse peut
 * naître d'un gabarit, pas seulement d'un fichier de contenu.
 *
 * USAGE
 *   node scripts/qa-contenu.mjs [origine]
 */

import { readFileSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3100";

/** Motifs interdits. Chacun décrit une affirmation invérifiable. */
const INTERDITS = [
  [/24\s*\/\s*7|24h\s*\/\s*24|7j\s*\/\s*7/i, "disponibilité permanente"],
  [
    /intervention garantie|garantie? d[eu] (?:délai|résultat)|satisfait ou rembours/i,
    "garantie",
  ],
  [/\b\d+\s*(?:avis|étoiles?)\b|note google|⭐/i, "avis ou note"],
  /* Le VERBE « assurer » est courant et légitime — « les prestations sont
     assurées à Rouen ». On ne cible que le nom, en contexte de couverture. */
  [
    /\bassurances?\b|\bnous sommes assurés\b|\bcouverture (?:RC|responsabilité)/i,
    "mention d’assurance",
  ],
  [/décennale|RC ?pro\b/i, "assurance décennale / RC pro"],
  /*
   * Le mot « tarif » seul ne prouve rien : « il n'y a pas de tarif au forfait »
   * NIE un prix, elle n'en affiche pas. Le motif exige donc un CHIFFRE — c'est
   * un montant qu'on cherche, pas un champ lexical.
   */
  [
    /\b\d+\s*€|\bà partir de \d|\btarifs? (?:de |à )?\d|\bprix (?:fixe|ferme)\b|\b\d+\s*(?:euros?|EUR)\b/i,
    "montant affiché",
  ],
  [/sous \d+ ?(?:h|heures?|jours?)\b/i, "délai chiffré"],
  [
    /\b(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b.*\d{1,2}h/i,
    "horaires",
  ],
  /* Le téléphone CONFIRMÉ est neutralisé avant analyse (voir `texte()`) : ce
     motif ne peut donc plus attraper qu'un numéro étranger à la source
     unique — exactement ce que la recette cherche. */
  [/\b0[1-9](?:[ .-]?\d{2}){4}\b/, "numéro étranger à site.ts"],
  [
    /\b\d{1,3}[, ]?(?:rue|avenue|boulevard|impasse|chemin|place) /i,
    "adresse postale en dur",
  ],
  [/certifi(?:é|cation) (?:ISO|QUALIBAT|RGE)/i, "certification non confirmée"],
  [
    /nos \d+ (?:clients|chantiers|réalisations)|plus de \d+ (?:clients|chantiers)/i,
    "volumétrie client",
  ],
];

/** Sur une commune `extended`, le discours ne doit jamais être affirmatif. */
const EXTENDED_INTERDITS = [
  /intervient (?:régulièrement|systématiquement|quotidiennement)/i,
  /nous sommes (?:présents|implantés|basés) à/i,
  /votre élagueur à/i,
  /agence à/i,
];

const EXTENDED_ATTENDUS = [
  /déplacement/i,
  /selon (?:la nature|le chantier|l['’]ampleur)/i,
  /peut être envisagé|à étudier/i,
];

const ROUTES = await (async () => {
  const hub = await fetch(BASE + "/zones-intervention").then((r) => r.text());
  const villes = [
    ...new Set(
      [...hub.matchAll(/href="(\/zones-intervention\/[a-z0-9-]+)"/g)].map(
        (m) => m[1],
      ),
    ),
  ];
  return [
    "/",
    "/elagage",
    "/abattage",
    "/dessouchage",
    "/entretien-exterieur",
    "/a-propos",
    "/realisations",
    "/zones-intervention",
    "/contact",
    "/devis",
    "/mentions-legales",
    "/politique-confidentialite",
    ...villes,
  ];
})();

/*
 * Coordonnées CONFIRMÉES, lues dans la SOURCE UNIQUE.
 *
 * Elles sont neutralisées avant analyse : sans cela, le téléphone confirmé du
 * client — rendu depuis `site.ts` à une soixantaine d'endroits — ressortirait
 * sur chaque page comme un « numéro en dur », et noierait les vraies
 * trouvailles sous trente faux positifs. C'est le piège du premier passage.
 */
const siteTs = readFileSync("src/lib/site.ts", "utf8");
const TEL_CONFIRME =
  siteTs.match(/PUBLIC_PHONE_DISPLAY[\s\S]*?\|\|\s*"([^"]+)"/)?.[1] ?? null;

/** Ne garde que le texte visible. */
function texte(html) {
  const t = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "’")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");

  return TEL_CONFIRME ? t.replaceAll(TEL_CONFIRME, "[téléphone confirmé]") : t;
}

const trouvailles = [];

for (const route of ROUTES) {
  const html = await fetch(BASE + route).then((r) => r.text());
  const t = texte(html);

  for (const [re, libelle] of INTERDITS) {
    const m = t.match(re);
    if (m) {
      const i = Math.max(0, m.index - 60);
      trouvailles.push({
        route,
        libelle,
        extrait: "…" + t.slice(i, m.index + m[0].length + 60).trim() + "…",
      });
    }
  }
}

/* --- Communes `extended` : le discours doit rester conditionnel --- */
const hub = await fetch(BASE + "/zones-intervention").then((r) => r.text());
const villes = [
  ...new Set(
    [...hub.matchAll(/href="(\/zones-intervention\/[a-z0-9-]+)"/g)].map(
      (m) => m[1],
    ),
  ),
];

const extended = [];
for (const v of villes) {
  const t = texte(await fetch(BASE + v).then((r) => r.text()));
  if (!/Déplacement à étudier/i.test(t)) continue;
  extended.push(v);

  for (const re of EXTENDED_INTERDITS)
    if (re.test(t))
      trouvailles.push({
        route: v,
        libelle: "discours affirmatif sur commune éloignée",
        extrait: String(re),
      });

  const reserves = EXTENDED_ATTENDUS.filter((re) => re.test(t)).length;
  if (reserves === 0)
    trouvailles.push({
      route: v,
      libelle: "aucune réserve de déplacement",
      extrait: "—",
    });
}

console.log("Routes auditées :", ROUTES.length);
console.log("Communes « Déplacement à étudier » :", extended.length);
console.log("   " + extended.map((v) => v.split("/").pop()).join(", "));
console.log("");

if (trouvailles.length === 0) console.log("AUCUNE AFFIRMATION NON SOUTENUE.");
else {
  console.log("À VÉRIFIER :", trouvailles.length);
  for (const t of trouvailles) {
    console.log("");
    console.log(`  [${t.libelle}] ${t.route}`);
    console.log("   " + t.extrait.slice(0, 200));
  }
}
