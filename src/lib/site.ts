/**
 * Source de verite unique des informations d'entreprise.
 * Toute donnee NAP (nom / adresse / telephone) affichee sur le site doit venir
 * d'ici, afin de rester strictement coherente avec la fiche Google Business
 * Profile et les annuaires (cf. SEO_STRATEGY.md).
 */

export const site = {
  name: "Arbre et Cime Élagage",
  legalName: "Arbre et Cime Élagage",
  trade: "Élagueur-grimpeur",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.arbre-et-cime.fr",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",
  experienceYears: 10,
} as const;

/** Zone d'intervention. Rouen et sa metropole = coeur SEO local. */
export const area = {
  city: "Rouen",
  metro: "Métropole Rouen Normandie",
  department: "Seine-Maritime",
  region: "Normandie",
  /** Rayon commercial maximal, argument de vente — pas un mot-cle SEO. */
  maxRadiusKm: 100,
} as const;

export type ServiceSlug =
  | "elagage"
  | "abattage"
  | "abattage-difficile"
  | "dessouchage"
  | "debroussaillage"
  | "taille-de-haies"
  | "entretien-exterieur"
  | "evacuation-des-dechets";

export type Service = {
  slug: ServiceSlug;
  label: string;
};

/** Ordre de reference des prestations (repris homepage + menu + pages services). */
export const services: readonly Service[] = [
  { slug: "elagage", label: "Élagage" },
  { slug: "abattage", label: "Abattage" },
  { slug: "abattage-difficile", label: "Abattage difficile et dangereux" },
  { slug: "dessouchage", label: "Dessouchage" },
  { slug: "debroussaillage", label: "Débroussaillage" },
  { slug: "taille-de-haies", label: "Taille de haies" },
  { slug: "entretien-exterieur", label: "Entretien extérieur" },
  { slug: "evacuation-des-dechets", label: "Évacuation des déchets" },
] as const;
