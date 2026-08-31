/**
 * Source de verite unique des informations d'entreprise.
 * Toute donnee NAP (nom / adresse / telephone) affichee sur le site doit venir
 * d'ici, afin de rester strictement coherente avec la fiche Google Business
 * Profile et les annuaires (cf. SEO_STRATEGY.md).
 */

/** Origine de repli, reservee au developpement local. */
const DEV_FALLBACK_ORIGIN = "http://localhost:3000";

/**
 * Resout l'origine publique du site a partir de `NEXT_PUBLIC_SITE_URL`, seule
 * source de verite pour l'URL du site.
 *
 * Retourne une origine normalisee (`https://exemple.fr`, sans chemin, sans
 * query, sans slash final) ou `null` si aucune valeur exploitable n'est
 * disponible en production.
 *
 * Cette fonction ne leve JAMAIS : une variable absente, vide ou malformee ne
 * doit pas casser le build (le rendu statique evalue `metadata` a
 * l'import du layout, une exception ici ferait echouer toutes les routes).
 *
 * Consequence pour les consommateurs (sitemap, canoniques, JSON-LD en phase
 * 14) : la valeur peut etre `null`, ce cas doit etre traite explicitement.
 */
function resolveSiteOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isProduction = process.env.NODE_ENV === "production";
  const fallback = isProduction ? null : DEV_FALLBACK_ORIGIN;

  if (!raw) {
    if (isProduction) {
      warnOnServer(
        "NEXT_PUBLIC_SITE_URL est absente ou vide : metadataBase, les URLs canoniques et le sitemap seront omis.",
      );
    }
    return fallback;
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    warnOnServer(
      `NEXT_PUBLIC_SITE_URL invalide (${JSON.stringify(raw)}) : attendu une origine absolue, par exemple https://exemple.fr`,
    );
    return fallback;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    warnOnServer(
      `NEXT_PUBLIC_SITE_URL utilise un protocole non supporte (${parsed.protocol}) : attendu http ou https.`,
    );
    return fallback;
  }

  // `origin` retire d'office le chemin, la query, le fragment et le slash final.
  return parsed.origin;
}

/** Avertit cote serveur uniquement : ces variables sont inlinees cote client. */
function warnOnServer(message: string): void {
  if (typeof window === "undefined") {
    console.warn(`[site] ${message}`);
  }
}

export const site = {
  name: "Arbre et Cime Élagage",
  /**
   * Forme courte, telle que le client l'ecrit lui-meme — esperluette comprise.
   * A employer dans les titres ou le nom complet serait lourd. Ne remplace pas
   * `name` dans les metadonnees, le pied de page ni les donnees structurees.
   */
  shortName: "Arbre & Cime",
  legalName: "Arbre et Cime Élagage",
  trade: "Élagueur-grimpeur",
  /**
   * Origine publique validee, ou `null` si aucune URL exploitable.
   * Ne jamais passer directement a `new URL()` sans verifier la nullite.
   */
  url: resolveSiteOrigin(),
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",
  /** Nom du responsable. Confirme par le client en phase 8. */
  manager: "Cédric Simon",
  experienceYears: 10,
  /** Annee de creation de l'activite. */
  foundedYear: 2023,
  /** Anciennete a son compte, en annees. A relire chaque annee. */
  selfEmployedYears: 3,
} as const;

/**
 * Qualifications reelles, confirmees par le client (`PROJECT.md`).
 *
 * Seuls les INTITULES vivent ici : ce sont des faits. Ce que chaque formation
 * apporte concretement releve de la redaction et reste dans la page qui
 * l'affiche.
 *
 * Ne rien ajouter a cette liste sans document du client. Une certification
 * inventee est le pire risque de credibilite du projet.
 */
export const qualifications = [
  "CS Taille et soins des arbres",
  "BP Paysagiste / gestion des milieux naturels",
] as const;

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
