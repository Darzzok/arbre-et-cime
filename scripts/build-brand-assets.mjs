import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

import sharp from "sharp";

/**
 * Génération des déclinaisons du logo — phase 16B.
 *
 * POURQUOI UN SCRIPT PLUTÔT QUE LES FICHIERS LIVRÉS
 * -------------------------------------------------
 * Le lot livré par le client est inexploitable tel quel, et c'est mesurable :
 *
 * 1. **Les noms ne correspondent pas aux contenus.** Chaque fichier porte le
 *    contenu du fichier qui le précède dans l'ordre alphabétique. 13 des 25
 *    fichiers ont une extension qui ment : un `.ico` qui est un PNG, des
 *    `.webp` qui sont des PNG, des `.png` qui sont des WebP. Servir un PNG
 *    sous `Content-Type: image/webp` casse aussi bien le navigateur que
 *    l'optimiseur d'images de Next.
 * 2. **Toutes les déclinaisons « symbole » sont de mauvais recadrages.** Elles
 *    coupent le texte en plein milieu : on y lit « Arbres et » suivi du haut
 *    de la ligne suivante, tronqué. Vérifié à l'œil sur les fichiers 512×512,
 *    1208×913 et 192×192.
 * 3. **Les favicons portent ce texte tronqué**, sur fond blanc opaque. À
 *    16 px, c'est une tache.
 *
 * Un seul fichier du lot est propre : le **maître 1024×1024 transparent**.
 * Toutes les déclinaisons du site en sont donc dérivées ici, une fois, à la
 * main de l'auteur — jamais au build ni à l'exécution.
 *
 * `sharp` N'EST PAS UNE DÉPENDANCE AJOUTÉE
 * ----------------------------------------
 * Il est déjà installé : Next 16 s'en sert pour l'optimisation d'images. Ce
 * script l'emprunte au moment de l'écriture, il n'entre pas dans le bundle et
 * n'apparaît pas dans `package.json` (`CLAUDE.md` § 3 point 2).
 *
 * OÙ SE FAIT LA COUPE SYMBOLE / TEXTE
 * -----------------------------------
 * Elle n'est pas devinée. Le profil de densité d'opacité du maître montre un
 * minimum net entre y = 616 et y = 632 (71 px opaques sur 1024 au creux) entre la pointe basse de
 * la feuille et la ligne « Arbres et », qui remonte à 427 px dès y = 656.
 *
 * USAGE
 * -----
 *   node scripts/build-brand-assets.mjs <chemin du maître 1024x1024>
 */

const SOURCE = process.argv[2];

if (!SOURCE) {
  console.error("Usage : node scripts/build-brand-assets.mjs <maitre.png>");
  process.exit(1);
}

/** Ligne de coupe, relevée sur le profil de densité du maître 1024 px. */
const COUPE_RELATIVE = 616 / 1024;

/** Fond des icônes iOS : Apple ne gère pas la transparence des touch icons. */
const FOND_IOS = { r: 0x14, g: 0x25, b: 0x1e, alpha: 1 };

const maitre = sharp(SOURCE);
const meta = await maitre.metadata();

if (!meta.hasAlpha) {
  console.error("Le maître doit être transparent. Reçu : sans couche alpha.");
  process.exit(1);
}

console.log(`Maître : ${basename(SOURCE)} — ${meta.width}×${meta.height}`);

/* ---------------------------------------------------------------- Outils -- */

/** Boîte englobante réelle de l'encre, dans une bande de lignes donnée. */
async function boite(src, y0, y1) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, channels } = info;
  let xMin = width,
    xMax = -1,
    yMin = y1,
    yMax = -1;

  for (let y = y0; y <= y1; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > 24) {
        if (x < xMin) xMin = x;
        if (x > xMax) xMax = x;
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
      }
    }
  }
  return {
    left: xMin,
    top: yMin,
    width: xMax - xMin + 1,
    height: yMax - yMin + 1,
  };
}

const ecrits = [];
async function ecrire(chemin, buffer) {
  mkdirSync(chemin.replace(/\/[^/]+$/, ""), { recursive: true });
  writeFileSync(chemin, buffer);

  /* On relit CE QU'ON VIENT D'ÉCRIRE plutôt que de faire confiance à ce qu'on
     croit avoir produit — c'est précisément la vérification qui manquait au lot
     livré. `sharp` ne lit pas les ICO : on décode alors l'en-tête à la main. */
  let dim;
  if (buffer.readUInt16LE(0) === 0 && buffer.readUInt16LE(2) === 1) {
    const n = buffer.readUInt16LE(4);
    const tailles = [];
    for (let i = 0; i < n; i++) tailles.push(buffer[6 + i * 16] || 256);
    dim = "ICO " + tailles.join("/");
  } else {
    const m = await sharp(buffer).metadata();
    dim = `${m.width}×${m.height}`;
  }

  ecrits.push({ chemin, dim, ko: Math.round(buffer.length / 1024) });
}

/* ------------------------------------------------------ 1. Logo complet -- */

const boiteComplete = await boite(SOURCE, 0, meta.height - 1);
const complet = await sharp(SOURCE)
  .extract(boiteComplete)
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toBuffer();
await ecrire("public/brand/logo-complet.png", complet);

/* ---------------------------------------------------------- 2. Symbole --- */

const coupe = Math.round(meta.height * COUPE_RELATIVE);
const boiteSymbole = await boite(SOURCE, 0, coupe);
const symboleSource = await sharp(SOURCE).extract(boiteSymbole).toBuffer();

/* Le symbole est plus large que haut : on le pose dans un carré transparent
   pour que toutes les icônes partagent la même géométrie. */
const cote = Math.max(boiteSymbole.width, boiteSymbole.height);
const marge = Math.round(cote * 0.06);
const symboleCarre = await sharp({
  create: {
    width: cote + marge * 2,
    height: cote + marge * 2,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: symboleSource, gravity: "center" }])
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toBuffer();

/*
 * DEUX SYMBOLES, ET LA DIFFÉRENCE COMPTE.
 *
 * Le symbole détouré mesure 779 × 571 — nettement plus large que haut. Le
 * poser dans un carré convient aux icônes, où le système impose une géométrie
 * carrée. Mais dans le logotype de l'en-tête, où la hauteur est contrainte
 * (32 px en `sm`), ce carré fait perdre un tiers de la hauteur utile en
 * transparent : la marque n'occupe plus que ~23 px et se lit comme une tache.
 *
 * Le logotype reçoit donc la version DÉTOURÉE, sans remplissage.
 */
await ecrire(
  "public/brand/logo-symbole.png",
  await sharp(symboleSource)
    .resize({ height: 512, fit: "inside" })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer(),
);

/* ------------------------------------------------------------ 3. Icônes -- */

await ecrire(
  "src/app/icon.png",
  await sharp(symboleCarre)
    .resize(512, 512)
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer(),
);

/* iOS : fond plein, et une marge plus généreuse — l'icône est arrondie par le
   système, un symbole collé aux bords s'y ferait rogner. */
await ecrire(
  "src/app/apple-icon.png",
  await sharp({
    create: { width: 180, height: 180, channels: 4, background: FOND_IOS },
  })
    .composite([
      {
        input: await sharp(symboleCarre).resize(144, 144).toBuffer(),
        gravity: "center",
      },
    ])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer(),
);

/* ------------------------------------------- 4. Logotype horizontal ------ */

/*
 * LE LOGO, RÉAGENCÉ EN LIGNE POUR LA BARRE DE NAVIGATION.
 *
 * Demande explicite du client, maintenue après réserve : c'est le logo réel
 * qui doit figurer dans l'en-tête, pas un nom recomposé dans la typographie du
 * site.
 *
 * LE BLOC VERTICAL NE PEUT PAS Y TENIR, ET LE CALCUL EST SIMPLE
 * -------------------------------------------------------------
 * Le maître détouré fait 905 × 912. Son pavé de texte occupe 31 % de la
 * hauteur et porte TROIS lignes. Dans une barre de 81 px, un logo de 56 px de
 * haut donne 17 px de texte au total, soit **moins de 6 px par ligne**. Pour
 * atteindre 10 px par ligne — le plancher de lisibilité — il faudrait un logo
 * de 97 px de haut, donc une barre plus haute que l'écran ne le supporte sur
 * mobile.
 *
 * CE QUI EST FAIT À LA PLACE
 * --------------------------
 * Les deux composants du logo — le symbole et le pavé de texte — sont
 * découpés dans le maître et **reposés côte à côte**. Aucun pixel n'est
 * redessiné, aucune typographie n'est substituée : c'est le dessin du client,
 * dans un autre agencement.
 *
 * Le pavé de texte est mis à l'échelle de façon à occuper ~78 % de la hauteur
 * du symbole. À 44 px de haut dans la barre, ses trois lignes retrouvent
 * ~11 px chacune — lisibles.
 */
/*
 * LE PAVÉ DE TEXTE NE COMMENCE PAS OÙ FINIT LE SYMBOLE.
 *
 * Les pointes basses de la feuille descendent SOUS la ligne de coupe, au-dessus
 * de « Arbres et ». Partir de `coupe + 1` les embarquait dans le pavé de texte :
 * on voyait deux taches sombres flotter au-dessus du mot, là où l'oeil attend
 * des accents.
 *
 * « Arbres et » n'a aucun accent — rien n'y dépasse légitimement la hauteur de
 * capitale. Tout ce qui se trouve entre la coupe et cette ligne est donc du
 * reste de feuille. Le profil de densité la situe à y = 656, où l'encre passe
 * de ~90 à 427 px par ligne. On part de 650, quelques pixels au-dessus, pour
 * ne rien rogner des lettres.
 */
const boiteTexte = await boite(
  SOURCE,
  Math.round(meta.height * (650 / 1024)),
  meta.height - 1,
);
const texteSource = await sharp(SOURCE).extract(boiteTexte).toBuffer();

/** Hauteur de référence du symbole dans le logotype produit. */
const H_SYMBOLE = 512;
/** Le pavé de texte est calé un peu plus bas que le symbole, optiquement. */
const H_TEXTE = Math.round(H_SYMBOLE * 0.78);
/** Gouttière entre les deux, proportionnelle. */
const GOUTTIERE = Math.round(H_SYMBOLE * 0.09);

const symboleH = await sharp(symboleSource)
  .resize({ height: H_SYMBOLE, fit: "inside" })
  .toBuffer();
const texteH = await sharp(texteSource)
  .resize({ height: H_TEXTE, fit: "inside" })
  .toBuffer();

const mS = await sharp(symboleH).metadata();
const mT = await sharp(texteH).metadata();

const largeurLockup = mS.width + GOUTTIERE + mT.width;

await ecrire(
  "public/brand/logo-lockup.png",
  await sharp({
    create: {
      width: largeurLockup,
      height: H_SYMBOLE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: symboleH, left: 0, top: 0 },
      {
        input: texteH,
        left: mS.width + GOUTTIERE,
        top: Math.round((H_SYMBOLE - mT.height) / 2),
      },
    ])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer(),
);

/* ------------------------------------------------------- 5. favicon.ico -- */

/*
 * IL EN FAUT UN, ET IL DOIT ÊTRE REFAIT.
 *
 * `src/app/favicon.ico` existe depuis la phase 15B et Next l'émet AVANT
 * `icon.png` : c'est lui que l'onglet affiche. Le laisser en place aurait
 * laissé l'ANCIEN logo dans l'onglet pendant que tout le reste changeait.
 *
 * `sharp` ne sait pas écrire d'ICO. Le conteneur est donc assemblé à la main —
 * il est trivial : un en-tête de 6 octets, un répertoire de 16 octets par
 * taille, puis les charges utiles. Depuis Windows Vista, une entrée ICO peut
 * contenir un PNG tel quel, ce que fait tout générateur moderne.
 */
async function construireIco(source, tailles) {
  const images = await Promise.all(
    tailles.map(async (t) => ({
      taille: t,
      png: await sharp(source)
        .resize(t, t)
        .png({ compressionLevel: 9 })
        .toBuffer(),
    })),
  );

  const entete = Buffer.alloc(6);
  entete.writeUInt16LE(0, 0); // réservé
  entete.writeUInt16LE(1, 2); // type : 1 = icône
  entete.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const repertoire = [];

  for (const { taille, png } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(taille >= 256 ? 0 : taille, 0); // 0 signifie 256
    e.writeUInt8(taille >= 256 ? 0 : taille, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // réservé
    e.writeUInt16LE(1, 4); // plans
    e.writeUInt16LE(32, 6); // bits par pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    repertoire.push(e);
    offset += png.length;
  }

  return Buffer.concat([entete, ...repertoire, ...images.map((i) => i.png)]);
}

await ecrire(
  "src/app/favicon.ico",
  await construireIco(symboleCarre, [16, 32, 48, 64, 128, 256]),
);

/* PAS D IMAGE OPEN GRAPH ICI.
 *
 * `OG_IMAGE` vaut deliberement `null` dans `src/lib/seo.ts` : la charte impose
 * une PHOTOGRAPHIE reelle, et la phototheque client n est pas livree. Emettre
 * une carte de partage au logo serait un changement de strategie SEO, pas une
 * consequence du changement de logo. Le jour ou le client la demande, elle se
 * genere ici en quelques lignes.
 */

/* ------------------------------------------------------------- Rapport -- */

console.log("");
console.log("Coupe symbole / texte : y =", coupe);
console.log("Boîte du logo complet :", JSON.stringify(boiteComplete));
console.log("Boîte du symbole seul :", JSON.stringify(boiteSymbole));
console.log("");
for (const e of ecrits)
  console.log(`  ${e.chemin.padEnd(34)} ${e.dim.padEnd(12)} ${e.ko} Ko`);

/* Empreinte du maître, pour pouvoir prouver plus tard d'où viennent ces
   fichiers (le lot livré contenait quatre générations de logos différentes). */
const { createHash } = await import("node:crypto");
console.log("");
console.log(
  "SHA-256 du maître :",
  createHash("sha256").update(readFileSync(SOURCE)).digest("hex").slice(0, 32),
);
