import type { MetadataRoute } from "next";

import type { ServiceSlug } from "./site";

/**
 * SOURCE DE VERITE UNIQUE des routes du site.
 *
 * Header, footer, fil d'Ariane, sitemap et metadonnees lisent tous ce fichier.
 * Une URL ne doit JAMAIS etre reecrite en dur ailleurs : changer un chemin ici
 * doit suffire a le changer partout.
 */

export type RouteId =
  | "home"
  | "elagage"
  | "abattage"
  | "dessouchage"
  | "entretien-exterieur"
  | "realisations"
  | "zones-intervention"
  | "devis"
  | "a-propos"
  | "contact"
  | "mentions-legales"
  | "politique-confidentialite"
  | "style-guide";

export type RouteGroup =
  | "service" /* prestations */
  | "preuve" /* credibilite */
  | "conversion" /* demande de devis, contact */
  | "entreprise" /* identite */
  | "legal"
  | "interne"; /* hors site public */

export type RouteDefinition = {
  id: RouteId;
  /** Chemin absolu, sans slash final (sauf la racine). */
  path: string;
  /** Libelle court, pour la navigation et le fil d'Ariane. */
  navLabel: string;
  /**
   * Sous-libelle de navigation, 2 a 4 mots. Sert uniquement au sous-menu
   * Prestations : il dit ce que la page resout, pour departager quatre
   * intitules metier proches. Purement editorial, sans effet SEO.
   */
  navTagline?: string;
  /** Titre de page. Passe dans le gabarit `%s | Arbre et Cime Élagage`. */
  title: string;
  /** Titre non gabarise — reserve a la racine. */
  titleAbsolute?: boolean;
  /** 140-155 caracteres, un benefice concret, la ville dans la premiere moitie. */
  description: string;
  /**
   * Intention de recherche principale de la page.
   * Sert de garde-fou redactionnel : une page = une intention, pas de
   * cannibalisation entre pages services.
   */
  intent: string;
  group: RouteGroup;
  /**
   * Contexte visuel de l'en-tete.
   * - `overlay` : en-tete transparent pose SUR un visuel sombre plein ecran
   *   (le futur hero photo de la page d'accueil) ;
   * - `solid`   : en-tete opaque, colle en haut des pages internes.
   */
  headerVariant: "overlay" | "solid";
  /** Exclut la route du sitemap (page interne, ou contenu non encore publie). */
  inSitemap: boolean;
  /** Emet `noindex, nofollow`. Bascule centralisee, route par route. */
  noindex: boolean;
  priority: number;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
};

const definitions: Record<RouteId, RouteDefinition> = {
  home: {
    id: "home",
    path: "/",
    navLabel: "Accueil",
    title: "Arbre et Cime Élagage — Élagueur-grimpeur à Rouen",
    titleAbsolute: true,
    description:
      "Élagueur-grimpeur à Rouen et dans la métropole rouennaise : élagage, abattage, dessouchage et entretien extérieur. Devis gratuit, intervention rapide.",
    intent:
      "élagueur Rouen / élagueur-grimpeur Rouen / élagage Rouen / abattage d’arbres Rouen",
    group: "preuve",
    headerVariant: "overlay",
    inSitemap: true,
    noindex: false,
    priority: 1,
    changeFrequency: "monthly",
  },

  elagage: {
    id: "elagage",
    path: "/elagage",
    navLabel: "Élagage",
    navTagline: "Tailler et conserver",
    title: "Élagage d’arbres à Rouen",
    description:
      "Élagage et taille douce d’arbres à Rouen et dans la métropole rouennaise. Intervention en grimpe, respect de l’arbre, chantier propre. Devis gratuit.",
    intent: "élagage Rouen — taille et entretien d’un arbre que l’on conserve",
    group: "service",
    headerVariant: "solid",
    inSitemap: true,
    noindex: false,
    priority: 0.9,
    changeFrequency: "monthly",
  },

  abattage: {
    id: "abattage",
    path: "/abattage",
    navLabel: "Abattage",
    navTagline: "Supprimer, même en accès difficile",
    title: "Abattage d’arbres à Rouen",
    description:
      "Abattage et démontage d’arbres à Rouen, y compris en accès difficile ou dangereux : travail par cordes, en rétention. Devis gratuit, urgences.",
    intent:
      "abattage d’arbres Rouen — y compris abattage difficile et dangereux (arbre à supprimer)",
    group: "service",
    headerVariant: "solid",
    inSitemap: true,
    noindex: false,
    priority: 0.9,
    changeFrequency: "monthly",
  },

  dessouchage: {
    id: "dessouchage",
    path: "/dessouchage",
    navLabel: "Dessouchage",
    navTagline: "Retirer la souche",
    title: "Dessouchage à Rouen",
    description:
      "Dessouchage et rognage de souches à Rouen et dans la métropole rouennaise, après abattage ou avant un projet d’aménagement. Devis gratuit.",
    intent: "dessouchage Rouen — suppression de la souche après coupe",
    group: "service",
    headerVariant: "solid",
    inSitemap: true,
    noindex: false,
    priority: 0.9,
    changeFrequency: "monthly",
  },

  "entretien-exterieur": {
    id: "entretien-exterieur",
    path: "/entretien-exterieur",
    navLabel: "Entretien extérieur",
    navTagline: "Haies et débroussaillage",
    // 36 caracteres : avec le gabarit « | Arbre et Cime Élagage », le titre
    // complet tient en 60, la cible de SEO_STRATEGY.md § 6. « Entretien
    // exterieur » reste porte par le h1 de la page.
    title: "Taille de haies et entretien à Rouen",
    description:
      "Taille de haies, débroussaillage et entretien extérieur à Rouen et dans la métropole rouennaise. Évacuation des déchets comprise. Devis gratuit.",
    intent:
      "taille de haies et débroussaillage Rouen — entretien récurrent d’un terrain",
    group: "service",
    headerVariant: "solid",
    inSitemap: true,
    noindex: false,
    priority: 0.9,
    changeFrequency: "monthly",
  },

  realisations: {
    id: "realisations",
    path: "/realisations",
    navLabel: "Réalisations",
    title: "Réalisations et chantiers",
    description:
      "Chantiers d’élagage, d’abattage et d’entretien réalisés à Rouen et dans la métropole rouennaise, en photographies réelles et situées.",
    intent:
      "preuve par l’exemple — faible volume de recherche, fort effet sur la conversion",
    group: "preuve",
    headerVariant: "solid",
    inSitemap: true,
    noindex: false,
    priority: 0.7,
    changeFrequency: "monthly",
  },

  "zones-intervention": {
    id: "zones-intervention",
    path: "/zones-intervention",
    navLabel: "Zone d’intervention",
    title: "Zones d’intervention autour de Rouen",
    description:
      "Rouen et la Métropole Rouen Normandie en zone principale, et déplacement possible jusqu’à 100 km selon les chantiers. Devis gratuit.",
    intent:
      "élagueur métropole rouennaise — répondre à « intervenez-vous chez moi ? »",
    group: "preuve",
    headerVariant: "solid",
    inSitemap: true,
    noindex: false,
    priority: 0.7,
    changeFrequency: "monthly",
  },

  devis: {
    id: "devis",
    path: "/devis",
    navLabel: "Devis gratuit",
    title: "Demander un devis d’élagage gratuit",
    description:
      "Décrivez votre chantier à Rouen ou dans la métropole, ajoutez des photos et recevez un devis gratuit et sans engagement, établi rapidement.",
    intent: "devis élagage Rouen — intention commerciale la plus qualifiée",
    group: "conversion",
    headerVariant: "solid",
    inSitemap: true,
    noindex: false,
    priority: 0.9,
    changeFrequency: "monthly",
  },

  "a-propos": {
    id: "a-propos",
    path: "/a-propos",
    navLabel: "À propos",
    title: "L’entreprise et ses qualifications",
    // Volontairement centrée sur la MARQUE et la personne, pas sur « élagueur
    // Rouen » : ce mot-clé appartient a la page d'accueil, et deux pages qui le
    // visent se cannibalisent (SEO_STRATEGY.md § 3).
    description:
      "Arbre et Cime Élagage, c’est Cédric Simon : élagueur-grimpeur diplômé, une dizaine d’années de métier, installé dans la métropole rouennaise depuis 2023.",
    intent:
      "requêtes de marque et vérification de confiance avant prise de contact",
    group: "entreprise",
    headerVariant: "solid",
    inSitemap: true,
    noindex: false,
    priority: 0.5,
    changeFrequency: "yearly",
  },

  contact: {
    id: "contact",
    path: "/contact",
    navLabel: "Contact",
    title: "Contacter un élagueur à Rouen",
    description:
      "Joindre Arbre et Cime Élagage pour un chantier à Rouen ou dans la métropole rouennaise, y compris pour une intervention en urgence.",
    intent: "contact et urgence — intention immédiate, souvent au téléphone",
    group: "conversion",
    headerVariant: "solid",
    inSitemap: true,
    noindex: false,
    priority: 0.7,
    changeFrequency: "yearly",
  },

  "mentions-legales": {
    id: "mentions-legales",
    path: "/mentions-legales",
    navLabel: "Mentions légales",
    title: "Mentions légales",
    description:
      "Informations légales relatives à l’entreprise Arbre et Cime Élagage et au présent site.",
    intent: "obligation légale — aucune intention de recherche",
    group: "legal",
    headerVariant: "solid",
    inSitemap: true,
    noindex: false,
    priority: 0.1,
    changeFrequency: "yearly",
  },

  "politique-confidentialite": {
    id: "politique-confidentialite",
    path: "/politique-confidentialite",
    navLabel: "Politique de confidentialité",
    title: "Politique de confidentialité",
    description:
      "Données collectées par le formulaire de devis, finalité, durée de conservation et exercice des droits.",
    intent: "obligation légale — aucune intention de recherche",
    group: "legal",
    headerVariant: "solid",
    inSitemap: true,
    noindex: false,
    priority: 0.1,
    changeFrequency: "yearly",
  },

  "style-guide": {
    id: "style-guide",
    path: "/style-guide",
    navLabel: "Style guide (interne)",
    title: "Style guide (interne)",
    description:
      "Référence interne du design system. Sans vocation commerciale ni SEO.",
    intent: "aucune — page de développement",
    group: "interne",
    headerVariant: "solid",
    inSitemap: false,
    noindex: true,
    priority: 0,
    changeFrequency: "yearly",
  },
};

export const routes = definitions;

export function getRoute(id: RouteId): RouteDefinition {
  return definitions[id];
}

export const routeList: readonly RouteDefinition[] = Object.values(definitions);

/** Routes du site public, hors pages internes. */
export const publicRoutes: readonly RouteDefinition[] = routeList.filter(
  (route) => route.group !== "interne",
);

/** Routes reellement exposees au sitemap. */
export const sitemapRoutes: readonly RouteDefinition[] = routeList.filter(
  (route) => route.inSitemap && !route.noindex,
);

/* -------------------------------------------------------------------------- */
/* Maillage — consomme par le header et le footer en phase 4                   */
/* -------------------------------------------------------------------------- */

/** Les quatre pages services, dans l'ordre de reference des prestations. */
export const serviceRoutes: readonly RouteDefinition[] = [
  definitions.elagage,
  definitions.abattage,
  definitions.dessouchage,
  definitions["entretien-exterieur"],
];

/**
 * Un element de navigation principale : soit une route, soit un groupe
 * deroulant. Un seul niveau de profondeur — pas de mega-menu.
 */
export type NavItem =
  | { kind: "route"; id: RouteId }
  | { kind: "group"; label: string; ids: readonly RouteId[] };

/**
 * Navigation principale, identique au desktop et au mobile.
 * `Contact` n'y figure pas : la prise de contact passe par le CTA devis, la
 * barre d'action mobile et le footer (cf. CONVERSION_STRATEGY.md).
 */
export const primaryNav: readonly NavItem[] = [
  {
    kind: "group",
    label: "Prestations",
    ids: ["elagage", "abattage", "dessouchage", "entretien-exterieur"],
  },
  { kind: "route", id: "realisations" },
  { kind: "route", id: "zones-intervention" },
  { kind: "route", id: "a-propos" },
];

/** Route du CTA primaire, traitee a part de la navigation. */
export const ctaRouteId: RouteId = "devis";

export type FooterGroup = {
  title: string;
  ids: readonly RouteId[];
};

export const footerGroups: readonly FooterGroup[] = [
  {
    title: "Prestations",
    ids: ["elagage", "abattage", "dessouchage", "entretien-exterieur"],
  },
  {
    title: "L’entreprise",
    ids: ["realisations", "zones-intervention", "a-propos", "contact"],
  },
  {
    title: "Informations",
    ids: ["mentions-legales", "politique-confidentialite"],
  },
];

/* -------------------------------------------------------------------------- */
/* Fil d'Ariane                                                                */
/* -------------------------------------------------------------------------- */

export type BreadcrumbItem = {
  label: string;
  path: string;
};

/**
 * L'architecture est PLATE : toute page publique est fille directe de la
 * racine. La profondeur maximale d'un fil d'Ariane est donc de deux niveaux.
 */
export function breadcrumbFor(id: RouteId): readonly BreadcrumbItem[] {
  const route = definitions[id];
  const home: BreadcrumbItem = {
    label: definitions.home.navLabel,
    path: definitions.home.path,
  };

  if (id === "home") {
    return [home];
  }

  return [home, { label: route.navLabel, path: route.path }];
}

/* -------------------------------------------------------------------------- */
/* Rattachement des prestations aux pages services                             */
/* -------------------------------------------------------------------------- */

/**
 * Les huit prestations de reference (`src/lib/site.ts`, liste VERROUILLEE) se
 * rattachent a quatre pages services seulement. Aucune page dediee n'est creee
 * pour une prestation secondaire : elle est traitee comme une section a
 * l'interieur de sa page parente, ce qui evite de diluer l'autorite du site sur
 * des pages trop minces.
 *
 * `null` = prestation complementaire, presentee selon le contexte du chantier
 * et non rattachee a une page unique.
 */
export const servicePageBySlug: Record<ServiceSlug, RouteId | null> = {
  elagage: "elagage",
  abattage: "abattage",
  "abattage-difficile": "abattage",
  dessouchage: "dessouchage",
  debroussaillage: "entretien-exterieur",
  "taille-de-haies": "entretien-exterieur",
  "entretien-exterieur": "entretien-exterieur",
  "evacuation-des-dechets": null,
};
