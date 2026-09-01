import { locationByCode } from "@/content/locations";
import { CITIES, MAP_VIEW_BOX, type MapCity } from "@/lib/map-data";
import { area } from "@/lib/site";

/**
 * Ce que la carte AFFICHE, à partir des données projetées de `map-data.ts`.
 *
 * La séparation est volontaire : `map-data.ts` est généré et ne contient que
 * des faits géographiques ; ce fichier-ci porte les décisions éditoriales —
 * quelles communes montrer, comment les qualifier, où poser leur étiquette.
 *
 * **Aucune commune n'est décrite comme desservie.** Le rayon de 100 km est un
 * argument commercial (`PROJECT.md` § 1), pas une couverture. Les libellés
 * disent « déplacement possible selon le chantier », jamais « nous intervenons
 * à ».
 */

/* ------------------------------------------------------------- Position -- */

/** Kilomètres depuis Rouen → pourcentage dans le cadre. */
export const toX = (km: number) =>
  ((km - MAP_VIEW_BOX.minX) / MAP_VIEW_BOX.width) * 100;
export const toY = (km: number) =>
  ((km - MAP_VIEW_BOX.minY) / MAP_VIEW_BOX.height) * 100;

/* -------------------------------------------------------------- Niveaux -- */

/**
 * Trois niveaux de lecture, et pas un de plus. C'est la structure demandée au
 * correctif 10C, en remplacement des quatre anneaux concentriques.
 */
export const ZONE_LEVELS = [
  {
    id: "coeur",
    label: "Cœur de zone",
    detail: `${area.city} et les 71 communes de la ${area.metro}`,
  },
  {
    id: "proche",
    label: "Zone principale",
    detail: `${area.department}, de la vallée de Seine au littoral`,
  },
  {
    id: "elargie",
    label: "Déplacements",
    detail: `Jusqu’à ${area.maxRadiusKm} km selon le chantier`,
  },
] as const;

/* -------------------------------------------------------------- Repères -- */

/**
 * Communes membres de la Métropole Rouen Normandie, parmi celles connues.
 *
 * Vérifié commune par commune : Barentin, Louviers et Yvetot **n'en font pas
 * partie** malgré leur proximité. C'est le genre d'approximation qu'un lecteur
 * local repère immédiatement.
 */
const METROPOLE_CODES = new Set([
  "76540", // Rouen
  "76451", // Mont-Saint-Aignan
  "76108", // Bois-Guillaume
  "76681", // Sotteville-lès-Rouen
  "76322", // Le Grand-Quevilly
  "76575", // Saint-Étienne-du-Rouvray
  "76231", // Elbeuf
  "76165", // Caudebec-lès-Elbeuf
]);

/**
 * Décalage de l'étiquette par rapport au point, en **pixels**.
 *
 * C'est le cœur du système de placement. Les cinq communes de la métropole
 * sont à trois ou quatre kilomètres les unes des autres, soit une vingtaine de
 * pixels : posées contre leur point, leurs étiquettes se superposeraient
 * quelle que soit la taille de la carte. C'est le défaut qui a fait rejeter les
 * deux versions précédentes.
 *
 * Elles sont donc **déportées en étoile** autour de la grappe, chacune reliée à
 * son point par une ligne de rappel — le procédé cartographique classique pour
 * une zone dense. Les angles suivent la position réelle de chaque commune :
 * Bois-Guillaume au nord-est part vers le nord-est, Le Grand-Quevilly au
 * sud-ouest part vers le sud-ouest. Aucune ligne n'en croise une autre.
 *
 * En pixels et non en pourcentage : la longueur du rappel doit rester
 * constante quelle que soit la largeur de la carte, comme le texte qu'elle
 * porte.
 */
export type Leader = { dx: number; dy: number };

export type MapMarker = MapCity & {
  /** Rouen : point d'accent, jamais masqué. */
  isCenter: boolean;
  inMetropole: boolean;
  /** Présent : étiquette déportée, reliée par une ligne de rappel. */
  leader?: Leader;
  /** Sinon : étiquette collée au point, pour les repères isolés. */
  side?: "top" | "bottom" | "left" | "right";
  /** Phrase affichée au survol, au focus et au tap. */
  note: string;
  /** Masqué sous 768 px, où la grappe devient trop dense. */
  secondary: boolean;
  /**
   * Le point existe toujours ; l'étiquette, elle, peut n'apparaître qu'à
   * l'interaction.
   *
   * C'est la hiérarchisation demandée au brief de phase 14 : vingt-trois noms
   * affichés en permanence se percuteraient quelle que soit la taille de la
   * carte. Les communes trop serrées pour porter une étiquette permanente
   * gardent donc un point cliquable et se nomment au survol, au focus ou au
   * tap — l'information n'est jamais perdue, elle est différée.
   */
  labelOnInteraction: boolean;
  /** Page locale correspondante. Toujours présente : c'est la règle du site. */
  slug: string | null;
};

const byCode = new Map(CITIES.map((city) => [city.code, city]));

function marker(
  code: string,
  placement: { leader?: Leader; side?: MapMarker["side"] },
  {
    secondary = false,
    labelOnInteraction = false,
  }: { secondary?: boolean; labelOnInteraction?: boolean } = {},
): MapMarker {
  const city = byCode.get(code);

  // Erreur de construction, pas d'exécution : si un code disparaît des données
  // générées, le build doit échouer bruyamment plutôt que trouer la carte.
  if (!city) {
    throw new Error(
      `Commune « ${code} » absente de map-data.ts. Relancer scripts/build-map-data.mjs ?`,
    );
  }

  const isCenter = code === "76540";
  const inMetropole = METROPOLE_CODES.has(code);

  const note = isCenter
    ? `Cœur de zone · ${area.metro}`
    : inMetropole
      ? `Cœur de zone · ${area.metro}, à ${city.km} km de ${area.city}`
      : `À ${city.km} km de ${area.city} · déplacement possible selon le chantier`;

  /*
   * Tout point public renvoie à sa page locale.
   *
   * Le rapprochement se fait par code INSEE contre `src/content/locations.ts`,
   * qui fait foi. Si un point n'y trouve pas de correspondance, `slug` vaut
   * `null` et le point reste affiché sans lien — mais le contrôle de la phase
   * 14 (`scripts/check-locations.mjs`) échoue, ce qui rend l'oubli visible au
   * lieu de le laisser passer.
   */
  const slug = locationByCode(code)?.slug ?? null;

  return {
    ...city,
    isCenter,
    inMetropole,
    note,
    secondary,
    labelOnInteraction,
    slug,
    ...placement,
  };
}

/**
 * La grappe de la métropole — cinq communes dans dix kilomètres.
 *
 * Étiquettes déportées en étoile, reliées par une ligne de rappel. Les angles
 * suivent la position réelle de chaque commune ; aucune ligne n'en croise une
 * autre. C'est le seul moyen de les rendre lisibles à cette échelle.
 */
const CLUSTER: readonly MapMarker[] = [
  marker("76540", { side: "right" }), // Rouen — étiquette collée : c'est le centre
  marker("76451", { leader: { dx: -34, dy: -58 } }), // Mont-Saint-Aignan, nord
  marker("76108", { leader: { dx: 64, dy: -50 } }, { secondary: true }), // Bois-Guillaume, nord-est. Secondaire : sous 768 px, la grappe ne tient que deux étiquettes.
  marker("76681", { leader: { dx: 70, dy: 38 } }, { secondary: true }), // Sotteville, sud-est
  marker("76322", { leader: { dx: -78, dy: 34 } }, { secondary: true }), // Le Grand-Quevilly, sud-ouest

  /*
   * Saint-Étienne-du-Rouvray — 6 km, au cœur de la grappe.
   *
   * Point permanent, étiquette à l'interaction seulement : à cette distance
   * du centre, une sixième étiquette déportée croiserait celles de Sotteville
   * et du Grand-Quevilly quelle que soit la longueur du rappel. Le brief
   * demandait justement d'éviter les collisions plutôt que d'afficher
   * vingt-trois noms.
   */
  marker("76575", { side: "bottom" }, { labelOnInteraction: true }),

  /* Elbeuf — 19 km au sud, hors grappe : la place existe pour un nom. */
  marker("76231", { side: "bottom" }, { secondary: true }),
];

/**
 * Couronne de repères, répartie sur seize azimuts À L'INTÉRIEUR du cercle.
 *
 * Toutes ces communes sont à moins de 100 km de Rouen : la couronne remplit la
 * portée annoncée au lieu de la border. Chacune est choisie pour son **azimut**
 * et sa distance, pas pour sa notoriété.
 *
 * **PLUS AUCUNE COMMUNE LITTORALE.** Le Havre, Dieppe, Fécamp et Le Tréport
 * ont été retirés sur demande du client. La couronne ne touche donc plus la
 * côte, et la règle qui existait ici — « une commune littorale porte son
 * étiquette vers l'intérieur des terres » — n'a plus d'objet.
 *
 * Elle reste consignée parce qu'elle redeviendrait nécessaire au premier
 * repère côtier réintroduit : posée côté large, une étiquette de port se lit
 * comme une ville en pleine mer, alors même que son point est sur la terre
 * (ce qui avait été vérifié par test point-dans-polygone — le défaut était
 * typographique, pas géographique).
 */
const RING: readonly MapMarker[] = [
  marker("80001", { side: "bottom" }, { secondary: true }), // Abbeville — 91 km
  /* Étiquette à GAUCHE et non à droite : Amiens est le repère le plus à
     l est du cadre, et son nom sortait de la carte à 768 px (mesuré). */
  marker("80021", { side: "left" }, { secondary: true }), // Amiens — 100 km, sur le cercle

  // Est et sud-est.
  marker("60057", { side: "right" }), // Beauvais — 72 km
  marker("27284", { side: "bottom" }, { secondary: true }), // Gisors — 52 km
  marker("78361", { side: "bottom" }, { secondary: true }), // Mantes-la-Jolie — 66 km
  marker("27681", { side: "right" }, { secondary: true }), // Vernon — 48 km

  // Sud.
  marker("27375", { side: "right" }, { secondary: true }), // Louviers — 25 km
  marker("27229", { side: "bottom" }), // Évreux — 47 km

  // Sud-ouest et ouest.
  marker("27056", { side: "bottom" }, { secondary: true }), // Bernay — 53 km
  marker("14366", { side: "bottom" }, { secondary: true }), // Lisieux — 70 km
  marker("27467", { side: "bottom" }, { secondary: true }), // Pont-Audemer — 42 km

  marker("76758", { side: "top" }, { secondary: true }), // Yvetot — 30 km
];

/**
 * Page d'accueil et page `/zones-intervention` partagent le **même** jeu de
 * repères : la section d'accueil a été recomposée en bandeau, la carte y prend
 * toute la largeur du conteneur, exactement comme sur la page.
 */
export const HOME_MARKERS: readonly MapMarker[] = [...CLUSTER, ...RING];
export const PAGE_MARKERS: readonly MapMarker[] = HOME_MARKERS;
/**
 * Communes du cœur de zone, listées **sous** la carte.
 *
 * La carte en étiquette cinq ; celles-ci sont les sept dont la distance est
 * vérifiée. La liste des 71 communes n'a pas sa place ici : ce serait du
 * bourrage, interdit par `SEO_STRATEGY.md` § 1.
 */
export const METROPOLE_CITIES = [
  "76540",
  "76451",
  "76108",
  "76681",
  "76322",
  "76575",
  "76231",
].map((code) => {
  const city = byCode.get(code);
  if (!city) throw new Error(`Commune « ${code} » absente de map-data.ts.`);
  return { code, nom: city.nom, km: city.km };
});
