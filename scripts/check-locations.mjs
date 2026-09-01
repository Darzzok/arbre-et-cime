/**
 * Contrôle d'intégrité des pages locales (phase 14).
 *
 * Vérifie, sans lancer de navigateur, l'invariant central du dispositif :
 *
 *     tout point ville public de la carte possède une page locale,
 *     et toute page locale correspond à un point de la carte.
 *
 * Ce script existe parce que cet invariant est facile à casser sans s'en
 * apercevoir : ajouter un repère à la carte sans créer la page produit un lien
 * mort, et créer une page sans repère produit une page orpheline. Aucun des
 * deux ne fait échouer le build.
 *
 * Lecture par expressions rationnelles, pas par import : le script tourne sous
 * Node nu, sans résolution des alias `@/` ni compilation TypeScript.
 *
 *     node scripts/check-locations.mjs
 */

import { readFileSync } from "node:fs";

const R = 6371.0088;
const rad = (d) => (d * Math.PI) / 180;

function haversine(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const problemes = [];
const ok = (message) => console.log(`  ✓ ${message}`);
const ko = (message) => {
  problemes.push(message);
  console.log(`  ✗ ${message}`);
};

/* ------------------------------------------------------------- Sources --- */

const locationsSrc = readFileSync("src/content/locations.ts", "utf8");
const mapContentSrc = readFileSync("src/lib/map-content.ts", "utf8");
const communes = JSON.parse(readFileSync("data/geo/communes.json", "utf8"));
const byCode = new Map(communes.map((c) => [c.code, c]));

const ENTRY =
  /id: "(\d+)",\s*\n\s*slug: "([a-z-]+)",\s*\n\s*nom: "([^"]+)",[\s\S]*?lon: (-?[\d.]+),\s*\n\s*lat: (-?[\d.]+),\s*\n\s*km: (\d+),[\s\S]*?tier: "(core|primary|extended)",[\s\S]*?voisins: \[([^\]]*)\]/g;

const locations = [...locationsSrc.matchAll(ENTRY)].map((m) => ({
  code: m[1],
  slug: m[2],
  nom: m[3],
  lon: Number(m[4]),
  lat: Number(m[5]),
  km: Number(m[6]),
  tier: m[7],
  voisins: [...m[8].matchAll(/"([a-z-]+)"/g)].map((v) => v[1]),
}));

console.log(`\nPages locales — contrôle d'intégrité\n`);
console.log(`Localisations déclarées : ${locations.length}\n`);

/* ------------------------------------------------------- 1. Unicité --- */

const slugs = locations.map((l) => l.slug);
const codes = locations.map((l) => l.code);

if (new Set(slugs).size === slugs.length) ok("slugs uniques");
else ko("slugs en double : " + slugs.filter((s, i) => slugs.indexOf(s) !== i));

if (new Set(codes).size === codes.length) ok("codes INSEE uniques");
else ko("codes INSEE en double");

/* --------------------------------------- 2. Conformité géographique --- */

const rouenSrc = byCode.get("76540");
const rouen = {
  lon: rouenSrc.centre.coordinates[0],
  lat: rouenSrc.centre.coordinates[1],
};

let geoBad = 0;
for (const l of locations) {
  const c = byCode.get(l.code);
  if (!c) {
    ko(`${l.slug} : code INSEE ${l.code} absent de communes.json`);
    geoBad++;
    continue;
  }
  const [lon, lat] = c.centre.coordinates;
  if (Math.abs(lon - l.lon) > 1e-9 || Math.abs(lat - l.lat) > 1e-9) {
    ko(`${l.slug} : coordonnées non conformes à la source officielle`);
    geoBad++;
  }
  const km = Math.round(haversine(rouen, { lon, lat }));
  if (km !== l.km) {
    ko(`${l.slug} : distance ${l.km} km déclarée, ${km} km recalculée`);
    geoBad++;
  }
  if (c.nom !== l.nom) {
    ko(`${l.slug} : nom "${l.nom}" ≠ "${c.nom}" (source)`);
    geoBad++;
  }
}
if (geoBad === 0) ok("coordonnées, noms et distances conformes à la source");

/* ------------------------------------------- 3. Cohérence des niveaux --- */

const METROPOLE = new Set([
  "76540", "76451", "76108", "76681", "76322", "76575", "76231",
]);

let tierBad = 0;
for (const l of locations) {
  const attendu = METROPOLE.has(l.code)
    ? "core"
    : l.km <= 60
      ? "primary"
      : "extended";
  if (l.tier !== attendu) {
    ko(`${l.slug} : niveau "${l.tier}" alors que la règle donne "${attendu}"`);
    tierBad++;
  }
}
if (tierBad === 0) {
  const compte = locations.reduce((acc, l) => {
    acc[l.tier] = (acc[l.tier] ?? 0) + 1;
    return acc;
  }, {});
  ok(
    `niveaux conformes à la règle — core ${compte.core}, primary ${compte.primary}, extended ${compte.extended}`,
  );
}

/* ------------------------------------------------------- 4. Voisins --- */

const parSlug = new Map(locations.map((l) => [l.slug, l]));
let voisinBad = 0;
for (const l of locations) {
  if (l.voisins.length < 3 || l.voisins.length > 5) {
    ko(`${l.slug} : ${l.voisins.length} voisins (attendu 3 à 5)`);
    voisinBad++;
  }
  for (const v of l.voisins) {
    if (!parSlug.has(v)) {
      ko(`${l.slug} : voisin "${v}" sans page`);
      voisinBad++;
    }
    if (v === l.slug) {
      ko(`${l.slug} : se référence lui-même comme voisin`);
      voisinBad++;
    }
  }
}
if (voisinBad === 0) ok("voisins valides et existants (3 à 5 par page)");

/* --------------------------------------- 5. Carte ↔ pages : bijection --- */

const marqueurs = [...mapContentSrc.matchAll(/marker\("(\d+)"/g)].map(
  (m) => m[1],
);
const uniques = [...new Set(marqueurs)];

const sansPage = uniques.filter((code) => !codes.includes(code));
const sansPoint = codes.filter((code) => !uniques.includes(code));

if (sansPage.length === 0) ok(`${uniques.length} points de carte, tous reliés à une page`);
else ko("points de carte sans page locale : " + sansPage.join(", "));

if (sansPoint.length === 0) ok("toutes les pages locales ont un point sur la carte");
else ko("pages locales sans point de carte : " + sansPoint.join(", "));

/* ------------------------------------------------ 6. Contenu unique --- */

const champs = ["intro", "contexte", "servicesIntro", "description"];
let dupBad = 0;
for (const champ of champs) {
  const valeurs = [
    ...locationsSrc.matchAll(
      new RegExp(`${champ}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`, "g"),
    ),
  ].map((m) => m[1]);

  if (valeurs.length !== locations.length) {
    ko(`${champ} : ${valeurs.length} valeurs pour ${locations.length} villes`);
    dupBad++;
    continue;
  }
  const uniquesChamp = new Set(valeurs);
  if (uniquesChamp.size !== valeurs.length) {
    ko(`${champ} : ${valeurs.length - uniquesChamp.size} doublon(s)`);
    dupBad++;
  }
}
if (dupBad === 0) ok("intro, contexte, servicesIntro et description tous distincts");

/* ------------------------------------------------------------ Bilan --- */

console.log("");
if (problemes.length === 0) {
  console.log(`✅ ${locations.length} pages locales — tout est cohérent\n`);
  process.exit(0);
}

console.log(`❌ ${problemes.length} problème(s)\n`);
process.exit(1);
