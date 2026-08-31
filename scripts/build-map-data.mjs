/**
 * Génère `src/lib/map-data.ts` à partir des GeoJSON téléchargés dans `data/geo/`.
 *
 * POURQUOI UN SCRIPT D'AUTEUR PLUTÔT QU'UNE DÉPENDANCE
 * ----------------------------------------------------
 * Projeter du GeoJSON en SVG demande une projection cartographique. La réponse
 * habituelle est `d3-geo`. Elle n'a pas été ajoutée : la projection dont ce
 * projet a besoin tient en quinze lignes, et l'exécuter **au moment de
 * l'écriture** plutôt qu'au runtime supprime purement et simplement la
 * dépendance. Le site n'embarque que des chaînes `d` figées.
 *
 * Ce fichier n'est pas exécuté par `npm run build`. Il se relance à la main
 * seulement si les données géographiques changent :
 *
 *     node scripts/build-map-data.mjs
 *
 * PROJECTION : AZIMUTALE ÉQUIDISTANTE CENTRÉE SUR ROUEN
 * -----------------------------------------------------
 * Ce n'est pas un choix esthétique. Dans cette projection, **toute distance
 * mesurée depuis le centre est exacte**, donc les rayons de 25, 50, 75 et
 * 100 km sont de vrais cercles de rayon proportionnel. Avec une Mercator, il
 * aurait fallu tracer des ellipses approchées et le « 100 km » affiché aurait
 * été faux de plusieurs kilomètres selon la direction.
 *
 * Les coordonnées de sortie sont des **kilomètres depuis Rouen** : lisibles,
 * vérifiables, et directement utilisables pour placer les cercles.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/* -------------------------------------------------------------- Réglages -- */

/** Rouen, centre de projection. Source : geo.api.gouv.fr, commune 76540. */
const CENTER = { lon: 1.0912, lat: 49.4412 };

/** Rayon volumétrique moyen de la Terre (IUGG), en kilomètres. */
const EARTH_RADIUS_KM = 6371.0088;

/**
 * Tolérance de simplification, en kilomètres.
 *
 * Resserrée au correctif : à 1,1 km le littoral était rogné au point que Le
 * Havre, pourtant en Seine-Maritime, tombait visuellement en mer. La côte est
 * un repère fort de cette carte, elle mérite ses kilo-octets.
 */
const TOLERANCE = {
  region: 0.5,
  /* La Seine-Maritime porte le trait de côte : il doit être précis, sinon
     Le Havre — dont le centre est à 3 km du rivage — tombe visuellement en
     mer. Les autres départements ne sont qu'un fond de carte. */
  departementPrincipal: 0.3,
  departement: 1,
  metropole: 0.35,
};

/**
 * Aire minimale d'un anneau conservé, en km².
 *
 * Le seuil régional élimine les îlots côtiers parasites. Le seuil métropolitain
 * est bien plus bas, et il le faut : à 4 km², douze des soixante-et-onze
 * communes disparaissaient et la métropole se retrouvait trouée.
 */
const MIN_RING_AREA_KM2 = { default: 4, metropole: 0.4 };

/* ----------------------------------------------------------- Projection -- */

const rad = (deg) => (deg * Math.PI) / 180;

/**
 * Azimutale équidistante. Retourne des kilomètres depuis le centre,
 * x vers l'est, y vers le nord.
 */
function project([lon, lat]) {
  const p0 = rad(CENTER.lat);
  const p = rad(lat);
  const dl = rad(lon - CENTER.lon);

  const cosC = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(dl);
  const c = Math.acos(Math.min(1, Math.max(-1, cosC)));
  // Limite en 0 : c / sin(c) → 1. Sans ce garde-fou, le point central diverge.
  const k = Math.abs(c) < 1e-12 ? 1 : c / Math.sin(c);

  return [
    EARTH_RADIUS_KM * k * Math.cos(p) * Math.sin(dl),
    EARTH_RADIUS_KM *
      k *
      (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(dl)),
  ];
}

/* ------------------------------------------------------- Simplification -- */

/** Distance perpendiculaire d'un point au segment [a, b]. */
function perpendicular(point, a, b) {
  const [px, py] = point;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) return Math.hypot(px - ax, py - ay);

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Ramer–Douglas–Peucker, itératif pour ne pas saturer la pile. */
function simplify(points, tolerance) {
  if (points.length < 3) return points;

  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;

  const stack = [[0, points.length - 1]];

  while (stack.length > 0) {
    const [first, last] = stack.pop();
    let maxDistance = 0;
    let index = 0;

    for (let i = first + 1; i < last; i += 1) {
      const distance = perpendicular(points[i], points[first], points[last]);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }

    if (maxDistance > tolerance) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }

  return points.filter((_, i) => keep[i] === 1);
}

/** Aire d'un anneau, par la formule du lacet. */
function ringArea(points) {
  let sum = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    sum += points[j][0] * points[i][1] - points[i][0] * points[j][1];
  }
  return Math.abs(sum / 2);
}

/* ------------------------------------------------------------- Chemins -- */

const round = (n) => Math.round(n * 10) / 10;

/** Un anneau projeté et simplifié devient un sous-chemin fermé. */
function ringToSubpath(ring, tolerance, minArea) {
  const projected = ring.map(project);
  if (ringArea(projected) < minArea) return null;

  const simplified = simplify(projected, tolerance);
  if (simplified.length < 3) return null;

  return (
    simplified
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${round(x)} ${round(-y)}`)
      .join("") + "Z"
  );
}

/**
 * Une géométrie linéaire (cours d'eau) devient un chemin OUVERT.
 *
 * Distinct de `geometryToPath` : un anneau se ferme par `Z`, une rivière non.
 * Fermer la Seine dessinerait un trait droit de l'estuaire à sa source.
 */
function lineToPath(geometry, tolerance) {
  const lines =
    geometry.type === "LineString" ? [geometry.coordinates] : geometry.coordinates;

  return lines
    .map((line) => {
      const simplified = simplify(line.map(project), tolerance);
      if (simplified.length < 2) return null;
      return simplified
        .map(([x, y], i) => `${i === 0 ? "M" : "L"}${round(x)} ${round(-y)}`)
        .join("");
    })
    .filter(Boolean)
    .join("");
}

/** Toutes les enveloppes extérieures d'une géométrie (les trous sont ignorés). */
function geometryToPath(geometry, tolerance, minArea = MIN_RING_AREA_KM2.default) {
  const polygons =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

  return polygons
    .map((polygon) => ringToSubpath(polygon[0], tolerance, minArea))
    .filter(Boolean)
    .join("");
}

/** Longueur approchée d'un chemin, pour animer un tracé au `stroke-dasharray`. */
function pathLength(d) {
  let length = 0;
  let previous = null;

  for (const match of d.matchAll(/([ML])(-?[\d.]+) (-?[\d.]+)/g)) {
    const point = [Number(match[2]), Number(match[3])];
    if (match[1] === "L" && previous) length += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    previous = point;
  }

  return Math.round(length);
}

/* --------------------------------------------------------------- Sortie -- */

const read = (file) => JSON.parse(readFileSync(file, "utf8"));

/*
 * Le cadre est déclaré ici : le filtrage des départements en dépend.
 *
 * CARRÉ DE ±112 km AUTOUR DE ROUEN. Élargi pour que le cercle de portée de
 * 100 km tienne ENTIER, avec une marge de 12 km. Un cercle rogné aux quatre
 * coins se lit comme une carte coupée — le défaut expressément rejeté.
 *
 * Conséquence assumée : la métropole n'occupe plus que 17 % de la largeur au
 * lieu de 27 %. Elle reste parfaitement lisible parce que le rendu distingue
 * désormais mer, terre, département et métropole par quatre tons — ce n'était
 * pas le cas quand ce cadrage avait été écarté.
 */
const FRAME = { minX: -112, maxX: 112, minY: -112, maxY: 112 };

const region = read("data/geo/region-normandie.geojson");
const departements = read("data/geo/departements-france.geojson");
const communes = read("data/geo/communes.json");
const seine = read("data/geo/seine.geojson");
const metropole = read("data/geo/metropole-rouen-normandie.geojson");

const regionPath = geometryToPath(region.geometry, TOLERANCE.region);
const seinePath = lineToPath(seine.geometry, 0.5);

/*
 * Les 71 communes de la Métropole Rouen Normandie, dessinées SÉPARÉMENT.
 *
 * Pas d'union géométrique : la calculer demanderait une bibliothèque, et le
 * résultat serait moins intéressant. Soixante-et-onze polygones partageant un
 * même aplat et un filet interne très fin donnent la texture d'un vrai
 * découpage administratif — c'est ce qui fait lire « métropole » d'un coup
 * d'œil, là où un disque ne dit rien.
 */
const metropolePaths = metropole.features
  .map((feature) =>
    geometryToPath(feature.geometry, TOLERANCE.metropole, MIN_RING_AREA_KM2.metropole),
  )
  .filter((d) => d.length > 0);

/*
 * TOUS les départements qui touchent le cadre, pas seulement les normands.
 *
 * C'est ce qui permet la distinction TERRE / MER. Avec les seuls cinq
 * départements normands, l'espace non couvert mélangeait la Manche et l'Oise :
 * impossible de colorer la mer sans colorer aussi la Picardie. Les dix
 * départements du cadre couvrent toute la terre ferme ; ce qui reste est
 * réellement la mer, et peut être traité comme telle.
 *
 * Sans ce fond, le territoire flottait sur l'ivoire de la page et la carte
 * paraissait vide — le reproche exact du client.
 */
const inFrame = (feature) => {
  const points = (
    feature.geometry.type === "Polygon"
      ? feature.geometry.coordinates.flat(1)
      : feature.geometry.coordinates.flat(2)
  ).map(project);
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => -p[1]);
  return (
    Math.max(...xs) >= FRAME.minX &&
    Math.min(...xs) <= FRAME.maxX &&
    Math.max(...ys) >= FRAME.minY &&
    Math.min(...ys) <= FRAME.maxY
  );
};

const departementPaths = departements.features
  .filter(inFrame)
  .map((feature) => ({
    code: feature.properties.code,
    nom: feature.properties.nom,
    d: geometryToPath(
      feature.geometry,
      feature.properties.code === "76"
        ? TOLERANCE.departementPrincipal
        : TOLERANCE.departement,
    ),
  }))
  .filter((item) => item.d.length > 0)
  .sort((a, b) => a.code.localeCompare(b.code));

const cities = communes
  .map((commune) => {
    const [x, y] = project(commune.centre.coordinates);
    return {
      code: commune.code,
      nom: commune.nom,
      x: round(x),
      y: round(-y),
      km: Math.round(Math.hypot(x, y)),
      departement: commune.codeDepartement,
    };
  })
  .sort((a, b) => a.km - b.km);

/*
 * CADRE : ROUEN AU CENTRE, LA PORTÉE DE 100 km ENTIÈRE.
 *
 * C'est le changement de sujet de la phase 10C. Les deux cadres précédents
 * étaient centrés sur Rouen et dimensionnés par le rayon de 100 km : la carte
 * racontait un cercle, et le territoire n'était qu'un fond. Deux conséquences
 * fatales — le territoire devenait méconnaissable, et les communes de la
 * métropole, distantes de trois kilomètres, tombaient toutes sur le même
 * pixel.
 *
 * Le cadre est maintenant dicté par le **département**, qui est le territoire
 * réel de l'activité :
 *
 * - la Seine-Maritime tient **entièrement** dedans, avec une marge — donc
 *   aucune impression de carte coupée, et une forme immédiatement
 *   reconnaissable ;
 * - la métropole y occupe 27 % de la largeur, assez pour être une surface et
 *   non un point ;
 * - Rouen tombe à 58 % / 62 %, légèrement hors centre. C'est la géographie
 *   réelle — Rouen est au sud du département — et c'est ce qui distingue une
 *   carte d'un schéma.
 *
 * La limite de 100 km sort du cadre. C'est voulu : le brief la veut
 * **secondaire**, elle passe donc dans le texte et dans un repère de bord.
 */
const { minX, maxX, minY, maxY } = FRAME;

const output = `/**
 * Données cartographiques projetées — GÉNÉRÉ, ne pas modifier à la main.
 *
 * Produit par \`scripts/build-map-data.mjs\`, à relancer seulement si les
 * sources changent. Voir \`MAP_DATA_SOURCES.md\` pour les sources et licences.
 *
 * Unité : kilomètres depuis Rouen, en projection azimutale équidistante.
 * Conséquence utile : les rayons de 25, 50, 75 et 100 km sont de VRAIS
 * cercles, et la distance affichée pour chaque ville est exacte.
 *
 * Axe y déjà inversé pour SVG (y croît vers le sud).
 */

export type MapCity = {
  code: string;
  nom: string;
  x: number;
  y: number;
  /** Distance réelle depuis Rouen, en kilomètres. */
  km: number;
  departement: string;
};

export type MapDepartement = {
  code: string;
  nom: string;
  d: string;
};

/** Centre de projection : Rouen (commune 76540). */
export const MAP_CENTER = { lon: ${CENTER.lon}, lat: ${CENTER.lat} } as const;

/** Cadre SVG, en kilomètres depuis Rouen. */
export const MAP_VIEW_BOX = {
  minX: ${minX},
  minY: ${minY},
  width: ${maxX - minX},
  height: ${maxY - minY},
} as const;

/** Chaîne \`viewBox\` prête à l'emploi. */
export const MAP_VIEW_BOX_ATTR =
  "${minX} ${minY} ${maxX - minX} ${maxY - minY}";

/**
 * Rapport largeur / hauteur du cadre.
 *
 * Le conteneur de la carte DOIT porter ce rapport : c'est lui qui garantit que
 * les repères HTML, positionnés en pourcentages, tombent au kilomètre attendu.
 */
export const MAP_ASPECT = ${Math.round(((maxX - minX) / (maxY - minY)) * 1000) / 1000};

/**
 * Les 71 communes de la Métropole Rouen Normandie, chacune son chemin.
 *
 * Dessinées séparément plutôt qu'unies : soixante-et-onze polygones partageant
 * un aplat et un filet interne très fin donnent la texture d'un vrai découpage
 * administratif. C'est ce qui fait lire « métropole » d'un coup d'œil, là où un
 * disque ne dit rien.
 */
export const METROPOLE_PATHS: readonly string[] = [
${metropolePaths.map((d) => `  "${d}",`).join("\n")}
];

/** Contour de la région Normandie. */
export const REGION_PATH =
  "${regionPath}";

/** Longueur approchée du contour, pour l'animation de tracé. */
export const REGION_PATH_LENGTH = ${pathLength(regionPath)};

/**
 * La Seine. Chemin OUVERT — ne jamais lui appliquer de remplissage.
 *
 * C'est l'élément qui rend Rouen immédiatement identifiable : sans lui, un
 * point sur un aplat vert ne dit rien à personne. Tracé réel issu de Natural
 * Earth, jamais redessiné.
 */
export const SEINE_PATH =
  "${seinePath}";

export const SEINE_PATH_LENGTH = ${pathLength(seinePath)};

/** Département de Rouen : le seul mis en avant sur la carte. */
export const MAIN_DEPARTEMENT = "76";

/** Les cinq départements normands. */
export const DEPARTEMENTS: readonly MapDepartement[] = [
${departementPaths
  .map(
    (item) =>
      `  {\n    code: "${item.code}",\n    nom: ${JSON.stringify(item.nom)},\n    d:\n      "${item.d}",\n  },`,
  )
  .join("\n")}
];

/** Communes de référence, coordonnées réelles. */
export const CITIES: readonly MapCity[] = [
${cities
  .map(
    (city) =>
      `  { code: "${city.code}", nom: ${JSON.stringify(city.nom)}, x: ${city.x}, y: ${city.y}, km: ${city.km}, departement: "${city.departement}" },`,
  )
  .join("\n")}
];
`;

mkdirSync(dirname("src/lib/map-data.ts"), { recursive: true });
writeFileSync("src/lib/map-data.ts", output);

console.log("src/lib/map-data.ts écrit");
console.log(`  contour région   ${regionPath.length} caractères, longueur ${pathLength(regionPath)}`);
for (const d of departementPaths) console.log(`  ${d.code} ${d.nom.padEnd(16)} ${d.d.length} caractères`);
console.log(`  métropole        ${metropolePaths.length} / ${metropole.features.length} communes`);
console.log(`  villes           ${cities.length}`);
console.log(`  viewBox          ${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
