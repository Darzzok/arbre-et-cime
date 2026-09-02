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

/* -------------------------------------------------------------------------- */
/* Contact — source de verite unique                                          */
/* -------------------------------------------------------------------------- */

/**
 * Adresse publique de l'entreprise.
 *
 * CONFIRMEE par le client (phase 15B.2). Elle est ecrite ici parce qu'elle est
 * destinee a etre affichee : une adresse de contact publique figure de toute
 * facon en clair dans le HTML servi. Ce n'est pas un secret, et la regle
 * `CLAUDE.md` § 9 vise les cles et jetons, pas les coordonnees publiques.
 *
 * Reste surchargeable par l'environnement, pour pouvoir changer d'adresse sans
 * redeployer le code.
 */
const PUBLIC_EMAIL =
  process.env.NEXT_PUBLIC_EMAIL?.trim() || "aec.elagage76@gmail.com";

/**
 * Telephone public — CONFIRME par le client.
 *
 * Il est reste vide de la phase 4 a la phase 15B.6, et le site s'est construit
 * autour de cette absence : aucun bouton « Appeler » n'etait rendu, nulle part.
 * Le mecanisme n'a pas change, seule la valeur est arrivee — et elle fait
 * apparaitre le bouton dans la soixantaine d'emplacements deja prevus.
 *
 * DEUX FORMES, DEUX USAGES
 * ------------------------
 * `tel:` exige le format international sans espaces ; l'affichage exige les
 * groupes de deux chiffres a la francaise. Les deux decrivent le meme numero,
 * et c'est cette source unique qui garantit qu'ils ne divergeront pas.
 *
 * Ecrit ici plutot que reserve a l'environnement, exactement comme l'e-mail :
 * une coordonnee publique confirmee n'est pas un secret (`CLAUDE.md` § 9 vise
 * les cles et les jetons), et un site deploye ne doit pas perdre son numero
 * parce qu'une variable manque sur l'hebergeur.
 *
 * Reste surchargeable par l'environnement, pour pouvoir changer de numero sans
 * redeployer le code.
 */
const PUBLIC_PHONE = process.env.NEXT_PUBLIC_PHONE?.trim() || "+33628778240";
const PUBLIC_PHONE_DISPLAY =
  process.env.NEXT_PUBLIC_PHONE_DISPLAY?.trim() || "06 28 77 82 40";

/**
 * Etat des canaux de contact.
 *
 * POURQUOI UN DRAPEAU DE CONFIRMATION
 * -----------------------------------
 * « La valeur est vide » et « la valeur n'est pas confirmee » sont deux choses
 * differentes, et les composants doivent pouvoir les distinguer sans deviner.
 * Un canal non confirme n'est jamais affiche : ni bouton, ni lien, ni mention.
 *
 * C'est ce drapeau — et lui seul — qui decide de l'apparition du bouton
 * « Appeler ». Depuis la phase 15B.6, le numero est confirme : le drapeau vaut
 * donc vrai, et le bouton est rendu dans tous les emplacements prevus —
 * en-tete, menu mobile, barre d'action mobile, hero de page, carte de
 * conversion finale et carte telephone de /contact.
 *
 * Le pied de page fait exception : il ne porte AUCUN appel a l'action, sur
 * demande explicite du client, repetee deux fois.
 */
export const contact = {
  email: PUBLIC_EMAIL,
  emailConfirmed: PUBLIC_EMAIL.length > 0,

  phone: PUBLIC_PHONE,
  /** Forme lisible (« 06 12 34 56 78 »). Repli sur `phone` si absente. */
  phoneDisplay: PUBLIC_PHONE_DISPLAY || PUBLIC_PHONE,
  phoneConfirmed: PUBLIC_PHONE.length > 0,

  /** Chemins des deux points de conversion. Ecrits ici pour eviter une
      dependance circulaire : `routes.ts` importe deja `site.ts`. */
  quotePath: "/devis",
  contactPath: "/contact",
} as const;

/** `mailto:` pret a l'emploi, ou `null` si aucun e-mail confirme. */
export function mailtoHref(): string | null {
  return contact.emailConfirmed ? `mailto:${contact.email}` : null;
}

/** `tel:` pret a l'emploi, ou `null` tant que le numero n'est pas confirme. */
export function telHref(): string | null {
  return contact.phoneConfirmed ? `tel:${contact.phone}` : null;
}

export const site = {
  name: "Arbres et Cimes Élagage",
  /**
   * Forme courte, telle que le client l'ecrit lui-meme — esperluette comprise.
   * A employer dans les titres ou le nom complet serait lourd. Ne remplace pas
   * `name` dans les metadonnees, le pied de page ni les donnees structurees.
   */
  shortName: "Arbres & Cimes",
  legalName: "Arbres et Cimes Élagage",
  trade: "Élagueur-grimpeur",
  /**
   * Origine publique validee, ou `null` si aucune URL exploitable.
   * Ne jamais passer directement a `new URL()` sans verifier la nullite.
   */
  url: resolveSiteOrigin(),
  /**
   * Coordonnees — conservees ici pour compatibilite. La source de verite est
   * `contact` ci-dessous, qui porte en plus l'etat de CONFIRMATION de chaque
   * canal. Preferer `contact` dans tout nouveau code.
   */
  phone: PUBLIC_PHONE,
  phoneDisplay: PUBLIC_PHONE_DISPLAY,
  email: PUBLIC_EMAIL,
  /** Nom du responsable. Confirme par le client en phase 8. */
  manager: "Cédric Simon",
  experienceYears: 10,
  /** Annee de creation de l'activite. */
  foundedYear: 2023,
  /** Anciennete a son compte, en annees. A relire chaque annee. */
  selfEmployedYears: 3,
} as const;

/**
 * IDENTITE LEGALE — source unique, comme le reste.
 *
 * Communiquee par le client en phase 16B : « auto-entrepreneur », SIRET
 * 928 119 403 00014.
 *
 * « Auto-entrepreneur » designe depuis 2016 un ENTREPRENEUR INDIVIDUEL place
 * sous le regime fiscal de la micro-entreprise. C'est la formulation retenue :
 * elle dit la meme chose, dans les termes qui ont cours.
 */
export const legal = {
  /** Forme juridique. CONFIRMEE par le client. */
  form: "Entrepreneur individuel — régime de la micro-entreprise",

  /**
   * SIRET, en presentation conventionnelle : les neuf chiffres du SIREN par
   * groupes de trois, puis les cinq du NIC.
   *
   * SA CLE DE CONTROLE A ETE VERIFIEE
   * ---------------------------------
   * Un SIREN et un SIRET portent une cle de controle (algorithme de Luhn).
   * `928119403` et `92811940300014` la verifient tous les deux.
   *
   * Le controle n'est pas une precaution de style. Le premier numero
   * communique se terminait par un `9` au lieu d'un `3` : il echouait a la
   * cle, et il aurait ete publie tel quel sans cette verification. Un SIRET
   * faux sur des mentions legales est PIRE que pas de SIRET du tout — il se
   * controle en trente secondes sur l'annuaire des entreprises et fait passer
   * toute la page pour une fabrication.
   *
   * **Toute modification de ce numero doit repasser par la cle de Luhn.**
   */
  siret: "928 119 403 00014",

  /** Vrai : cle de controle verifiee (SIREN et SIRET). */
  siretConfirmed: true,

  /**
   * Commune du siege — CONFIRMEE par le client (phase 16B) : Le Grand-Quevilly.
   *
   * LA COMMUNE, PAS L'ADRESSE COMPLETE
   * ----------------------------------
   * Le client a communique la commune, pas la voie ni le code postal. Rien
   * n'est complete d'office : ni numero de rue devine, ni code postal recopie
   * de memoire. Le code present dans `data/geo/communes.json` (76322) est un
   * code INSEE, PAS un code postal — les deux ne se confondent pas.
   *
   * A NE PAS CONFONDRE AVEC L'ANCRAGE COMMERCIAL
   * ---------------------------------------------
   * Rouen reste le coeur du secteur d'intervention et la cible SEO principale,
   * mais **le site n'affirme plus d'implantation rouennaise** : les
   * formulations « basee a Rouen » et « commune d'attache » ont ete corrigees
   * en phase 17, precisement parce que ce champ dit autre chose.
   *
   * Siege administratif et ancrage commercial ne se confondent pas. Le premier
   * est ici, le second est Rouen, et les deux peuvent coexister sans mentir :
   * Le Grand-Quevilly appartient a la Metropole Rouen Normandie, a cinq
   * kilometres de Rouen.
   *
   * **Ce champ ne sert qu'aux mentions legales.** Il ne doit pas etre injecte
   * dans les textes editoriaux, les metadonnees ni les donnees structurees
   * sans decision explicite du client.
   */
  siege: "Le Grand-Quevilly",

  /**
   * FAUX : aucune assurance a afficher.
   *
   * Le client a repondu « pas d'assurance a mettre » en phase 16B. On
   * n'affiche donc rien — ni mention, ni ligne vide, ni « nous consulter ». Le
   * champ existe pour que la reponse soit ENREGISTREE : sans lui, la question
   * se reposerait a chaque relecture des mentions legales.
   */
  assuranceAffichee: false,
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
