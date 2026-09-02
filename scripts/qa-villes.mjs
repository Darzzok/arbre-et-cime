/**
 * Invariant des communes — phase 17.
 *
 * Une seule question : le nombre de communes est-il le MÊME partout ?
 *
 * Le brief de recette parlait de 23 communes. Il y en a 19 : quatre communes
 * littorales — Dieppe, Le Tréport, Fécamp, Le Havre — ont été retirées sur
 * demande du client après la phase 15B.5, avec leurs pages. Ce script établit
 * le nombre réel plutôt que de le supposer.
 *
 * USAGE
 *   node scripts/qa-villes.mjs [origine]
 */

import { readFileSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3100";

const src = readFileSync("src/content/locations.ts", "utf8");
const geo = JSON.parse(readFileSync("data/geo/communes.json", "utf8"));
const carte = readFileSync("src/lib/map-data.ts", "utf8");

/* --- 1. Les communes déclarées --- */
const slugs = [...src.matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]);
const tiers = [...src.matchAll(/tier: "(core|primary|extended)"/g)].map((m) => m[1]);

/* --- 2. Les voisins cités --- */
const voisins = new Set();
for (const m of src.matchAll(/voisins: \[([^\]]*)\]/g))
  for (const v of m[1].matchAll(/"([a-z0-9-]+)"/g)) voisins.add(v[1]);

/* --- 3. Le hub, tel qu'il est SERVI --- */
const hub = await fetch(BASE + "/zones-intervention").then((r) => r.text());
const liensHub = new Set(
  [...hub.matchAll(/href="\/zones-intervention\/([a-z0-9-]+)"/g)].map((m) => m[1]),
);

/*
 * --- 4. Les repères de la carte, comptés SUR LE RENDU ---
 *
 * Et non sur la source. `HOME_MARKERS` est un tableau dérivé
 * (`[...CLUSTER, ...RING]`) : le compter à l'expression régulière donnait 6 au
 * lieu de 19, parce que les entrées sont réparties sur plusieurs déclarations
 * et formatées sur plusieurs lignes. Un invariant qui se trompe de source ne
 * protège rien — on compte donc les `data-map-marker` réellement émis.
 *
 * `map-data.ts` reste lu pour mémoire : il contient 26 entrées, dont les
 * villes de contexte qui cadrent la carte sans être des communes desservies.
 * Ce nombre n'a pas à valoir 19.
 */
const reperesRendus = (hub.match(/data-map-marker/g) ?? []).length;
const entreesCarte = [
  ...carte.slice(carte.indexOf("export const CITIES")).matchAll(/nom: "([^"]+)"/g),
].length;

/* --- 5. Chaque page répond-elle ? --- */
const statuts = {};
for (const s of slugs) {
  const r = await fetch(`${BASE}/zones-intervention/${s}`);
  const html = await r.text();
  statuts[s] = {
    statut: r.status,
    h1: (html.match(/<h1[\s>]/g) ?? []).length,
    title: /<title>[^<]+<\/title>/.test(html),
    description: /<meta name="description" content="[^"]+"/.test(html),
  };
}

/* --- Bilan --- */
const defauts = [];

const doublons = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (doublons.length) defauts.push("slugs dupliqués : " + doublons.join(", "));

for (const v of voisins)
  if (!slugs.includes(v)) defauts.push(`voisin inconnu : « ${v} »`);

for (const s of slugs) {
  const e = statuts[s];
  if (e.statut !== 200) defauts.push(`${s} → HTTP ${e.statut}`);
  if (e.h1 !== 1) defauts.push(`${s} → ${e.h1} h1`);
  if (!e.title) defauts.push(`${s} → title vide`);
  if (!e.description) defauts.push(`${s} → description absente`);
  if (!liensHub.has(s)) defauts.push(`${s} → absent du hub /zones-intervention`);
}

for (const l of liensHub)
  if (!slugs.includes(l)) defauts.push(`hub → lien vers une commune inconnue : ${l}`);

/**
 * LES CINQ COMPTES DE L'INVARIANT.
 *
 * Ils doivent être égaux. C'est la seule règle de ce fichier.
 */
const INVARIANT = {
  "locations.ts (communes)": slugs.length,
  "slugs uniques": new Set(slugs).size,
  "pages générées (HTTP 200)": Object.values(statuts).filter((e) => e.statut === 200)
    .length,
  "liens du hub": liensHub.size,
  "repères de la carte (rendus)": reperesRendus,
};

const valeurs = Object.values(INVARIANT);
const attendu = valeurs[0];
const coherent = valeurs.every((v) => v === attendu);

console.log("INVARIANT DU PÉRIMÈTRE LOCAL");
for (const [k, v] of Object.entries(INVARIANT))
  console.log("   " + k.padEnd(30), String(v).padStart(3), v === attendu ? "" : " ← ÉCART");
console.log("");
console.log("   → " + valeurs.join(" = "), coherent ? "  OK" : "  ** INCOHÉRENT **");
console.log("");

/* Pour mémoire, et volontairement HORS invariant : ces deux jeux contiennent
   les villes de contexte qui cadrent la carte sans être desservies. */
console.log("Hors invariant (contexte cartographique)");
console.log("   data/geo/communes.json".padEnd(33), geo.length);
console.log("   map-data.ts (CITIES)".padEnd(33), entreesCarte);
console.log("");
console.log("NIVEAUX  core", tiers.filter((t) => t === "core").length,
  "| primary", tiers.filter((t) => t === "primary").length,
  "| extended", tiers.filter((t) => t === "extended").length);
console.log("");

if (!coherent) defauts.push("les cinq comptes de l'invariant ne sont pas égaux");

if (defauts.length === 0) console.log("AUCUN DÉFAUT.");
else {
  console.log("DÉFAUTS :", defauts.length);
  for (const d of defauts) console.log("   -", d);
}
