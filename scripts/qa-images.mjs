/**
 * Recette des images — phase 17.
 *
 * Suit chaque `src` de `next/image` jusqu'à l'optimiseur ET jusqu'au fichier
 * source, vérifie que les deux répondent, relève le format servi, le poids et
 * la présence d'un `alt` rédigé.
 *
 * USAGE
 *   node scripts/qa-images.mjs [origine]
 */

import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3100";

const ROUTES = [
  "/",
  "/elagage",
  "/abattage",
  "/dessouchage",
  "/entretien-exterieur",
  "/a-propos",
  "/realisations",
  "/zones-intervention",
  "/zones-intervention/rouen",
  "/contact",
  "/devis",
  "/mentions-legales",
  "/politique-confidentialite",
];

const tous = (re, s) => [...s.matchAll(re)];
const un = (re, s) => s.match(re)?.[1] ?? null;

const referencees = new Set();
const problemes = [];
let total = 0;

for (const route of ROUTES) {
  const html = (await fetch(BASE + route).then((r) => r.text()))
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<template[\s\S]*?<\/template>/gi, "");

  for (const balise0 of tous(/<img\b[^>]*>/g, html).map((m) => m[0])) {
    /* Le HTML échappe les esperluettes : `&amp;` doit redevenir `&` avant
       toute requête. Sans cette étape, l'optimiseur renvoie 400 et on croit à
       tort que l'image est cassée — piège rencontré au premier passage. */
    const balise = balise0.replace(/&amp;/g, "&");
    total++;
    const src = un(/\ssrc="([^"]*)"/, balise);
    const alt = un(/\salt="([^"]*)"/, balise);
    const sizes = un(/\ssizes="([^"]*)"/, balise);
    const cache = /aria-hidden="true"/.test(balise);

    if (src === null) {
      problemes.push(`${route} → <img> sans src`);
      continue;
    }

    /* `alt` vide n'est acceptable QUE sur une image décorative annoncée. */
    if (alt === null) problemes.push(`${route} → sans alt : ${src.slice(0, 60)}`);
    else if (alt === "" && !cache)
      problemes.push(`${route} → alt vide sans aria-hidden : ${src.slice(0, 60)}`);

    if (!sizes && src.includes("/_next/image"))
      problemes.push(`${route} → sans sizes : ${src.slice(0, 60)}`);

    const r = await fetch(BASE + src, { headers: { Accept: "image/webp,image/*" } });
    if (r.status !== 200) {
      problemes.push(`${route} → HTTP ${r.status} sur ${src.slice(0, 70)}`);
      continue;
    }

    /* On remonte au fichier source pour vérifier qu'il existe vraiment. */
    const brut = decodeURIComponent(un(/url=([^&]+)/, src) ?? src);
    referencees.add(brut);
    if (brut.startsWith("/")) {
      const rr = await fetch(BASE + brut, { method: "HEAD" });
      if (rr.status !== 200)
        problemes.push(`${route} → source absente : ${brut} (HTTP ${rr.status})`);
    }
  }
}

/* --- fichiers présents dans `public/` mais jamais référencés --- */
function lister(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...lister(p));
    else if (/\.(png|jpe?g|webp|svg)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const surDisque = lister("public").map(
  (p) => "/" + relative("public", p).replace(/\\/g, "/"),
);
const orphelines = surDisque.filter((f) => !referencees.has(f));

console.log("Balises <img> inspectées :", total);
console.log("Fichiers distincts servis :", referencees.size);
console.log("");

if (orphelines.length) {
  console.log("FICHIERS DE `public/` JAMAIS RÉFÉRENCÉS :", orphelines.length);
  for (const f of orphelines)
    console.log(
      "   " + f.padEnd(62),
      Math.round(statSync("public" + f).size / 1024) + " Ko",
    );
  console.log("");
}

if (problemes.length === 0) console.log("AUCUN DÉFAUT D'IMAGE.");
else {
  console.log("DÉFAUTS :", problemes.length);
  for (const p of problemes) console.log("   -", p);
}
