/**
 * Recette automatisée — phase 17.
 *
 * Interroge le SERVEUR DE PRODUCTION et vérifie ce qui se vérifie sans œil
 * humain : routes, titres, `h1`, métadonnées, liens internes, images, `alt`,
 * identifiants dupliqués, `tel:`/`mailto:`, ancres mortes.
 *
 * Aucune dépendance : le HTML est analysé à l'expression régulière, ce qui
 * suffit pour des pages pré-rendues dont on connaît la structure. Un vrai
 * analyseur DOM serait plus élégant ; il ne serait pas plus juste ici, et il
 * coûterait une dépendance que `CLAUDE.md` § 3 interdit sans justification.
 *
 * USAGE
 *   node scripts/qa-crawl.mjs [origine]
 */

const BASE = process.argv[2] ?? "http://localhost:3100";

/* ------------------------------------------------------------- Outils --- */

const pages = new Map();
const echecs = [];
const bilan = (t, m) => echecs.push({ type: t, message: m });

async function charger(chemin) {
  const r = await fetch(BASE + chemin, { redirect: "manual" });
  const html = r.headers.get("content-type")?.includes("text/html")
    ? await r.text()
    : "";
  return { statut: r.status, html };
}

const tous = (re, s) => [...s.matchAll(re)];
const un = (re, s) => s.match(re)?.[1] ?? null;

/** Retire les blocs qui ne sont pas du contenu rendu. */
function nettoyer(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<template[\s\S]*?<\/template>/gi, "");
}

/* ------------------------------------------------ Découverte des routes -- */

const sitemap = await fetch(BASE + "/sitemap.xml").then((r) => r.text());
const dansSitemap = tous(/<loc>([^<]+)<\/loc>/g, sitemap).map((m) =>
  m[1].replace(/^https?:\/\/[^/]+/, ""),
);

/* Le sitemap est vide en préproduction (SITE_INDEXABLE=false) : on part donc
   de l'accueil et on suit les liens internes, comme le ferait un visiteur. */
const file = ["/"];
const vues = new Set(file);

while (file.length) {
  const chemin = file.shift();
  const { statut, html } = await charger(chemin);
  const propre = nettoyer(html);

  const liens = tous(/href="(\/[^"#?]*)"/g, propre)
    .map((m) => m[1])
    .filter((h) => !h.startsWith("/_next") && !/\.[a-z0-9]{2,4}$/i.test(h));

  pages.set(chemin, { statut, html, propre, liens });

  for (const l of liens) {
    const n = l.length > 1 ? l.replace(/\/$/, "") : l;
    if (!vues.has(n)) {
      vues.add(n);
      file.push(n);
    }
  }
}

/* ------------------------------------------------------- Vérifications -- */

const titres = new Map();

for (const [chemin, p] of pages) {
  const { statut, html, propre } = p;

  if (statut !== 200) bilan("statut", `${chemin} → HTTP ${statut}`);

  /* --- un seul h1 --- */
  const h1 = tous(/<h1[\s>]/g, propre).length;
  if (h1 !== 1) bilan("h1", `${chemin} → ${h1} balises h1`);

  /* --- title unique et non vide --- */
  const title = un(/<title>([^<]*)<\/title>/, html);
  if (!title) bilan("title", `${chemin} → aucun <title>`);
  else {
    if (titres.has(title))
      bilan("title", `title dupliqué : « ${title} » — ${titres.get(title)} et ${chemin}`);
    titres.set(title, chemin);
  }

  /* --- description --- */
  const desc = un(/<meta name="description" content="([^"]*)"/, html);
  if (!desc) bilan("description", `${chemin} → aucune meta description`);

  /* --- robots : la préproduction doit rester noindex --- */
  const robots = un(/<meta name="robots" content="([^"]*)"/, html);
  if (!robots || !robots.includes("noindex"))
    bilan("robots", `${chemin} → robots = ${robots ?? "absent"} (noindex attendu)`);

  /* --- identifiants dupliqués --- */
  const ids = tous(/\sid="([^"]+)"/g, propre).map((m) => m[1]);
  const vusIds = new Set();
  for (const id of ids) {
    if (vusIds.has(id)) bilan("id", `${chemin} → id dupliqué « ${id} »`);
    vusIds.add(id);
  }

  /* --- images : alt manquant --- */
  for (const img of tous(/<img\b[^>]*>/g, propre).map((m) => m[0])) {
    if (!/\salt=/.test(img)) {
      const src = un(/src="([^"]*)"/, img) ?? "?";
      bilan("alt", `${chemin} → <img> sans alt (${src.slice(0, 70)})`);
    }
  }

  /* --- ancres mortes --- */
  if (/href="#"/.test(propre)) bilan("lien", `${chemin} → href="#" présent`);

  /* --- tabindex positif --- */
  for (const m of tous(/tabindex="([0-9]+)"/g, propre))
    if (Number(m[1]) > 0) bilan("tabindex", `${chemin} → tabindex=${m[1]}`);
}

/* --- liens internes : chaque cible doit répondre 200 --- */
const cibles = new Set();
for (const p of pages.values()) for (const l of p.liens) cibles.add(l);

for (const cible of cibles) {
  const n = cible.length > 1 ? cible.replace(/\/$/, "") : cible;
  if (pages.has(n)) continue;
  const { statut } = await charger(cible);
  if (statut !== 200) bilan("lien", `cible ${cible} → HTTP ${statut}`);
}

/* --- mailto / tel --- */
const mailtos = new Set();
const tels = new Set();
for (const p of pages.values()) {
  for (const m of tous(/href="(mailto:[^"]+)"/g, p.propre)) mailtos.add(m[1]);
  for (const m of tous(/href="(tel:[^"]+)"/g, p.propre)) tels.add(m[1]);
}

/* --- ressources statiques référencées --- */
const assets = new Set();
for (const p of pages.values()) {
  for (const m of tous(/src="(\/[^"]+\.(?:png|jpg|jpeg|webp|svg|ico))"/g, p.propre))
    assets.add(m[1]);
  for (const m of tous(/href="(\/[^"]+\.(?:png|ico|svg|webmanifest))"/g, p.html))
    assets.add(m[1]);
}
for (const a of assets) {
  const r = await fetch(BASE + a, { method: "HEAD" });
  if (r.status !== 200) bilan("asset", `${a} → HTTP ${r.status}`);
}

/* ------------------------------------------------------------ Rapport --- */

const villes = [...pages.keys()].filter((p) =>
  p.startsWith("/zones-intervention/"),
);

console.log("ROUTES ATTEINTES :", pages.size);
for (const c of [...pages.keys()].sort()) console.log("   ", c);
console.log("");
console.log("Pages villes  :", villes.length);
console.log("Dans sitemap  :", dansSitemap.length, "(0 attendu en préproduction)");
console.log("mailto:       :", [...mailtos].join(", ") || "aucun");
console.log("tel:          :", [...tels].join(", ") || "aucun");
console.log("Ressources    :", assets.size, "vérifiées");
console.log("");

if (echecs.length === 0) {
  console.log("AUCUN DÉFAUT DÉTECTÉ.");
} else {
  console.log("DÉFAUTS :", echecs.length);
  const parType = {};
  for (const e of echecs) (parType[e.type] ??= []).push(e.message);
  for (const [t, ms] of Object.entries(parType)) {
    console.log("");
    console.log(`  [${t}] ${ms.length}`);
    for (const m of ms.slice(0, 25)) console.log("    -", m);
    if (ms.length > 25) console.log(`    … et ${ms.length - 25} autres`);
  }
}
