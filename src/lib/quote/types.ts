/**
 * Modèle de données du configurateur de devis.
 *
 * Aucun JSX, aucune dépendance React : ce module est importable depuis le
 * serveur comme depuis le navigateur. C'est la condition pour que la route
 * `POST /api/devis` de la phase 13 revalide avec **exactement les mêmes
 * règles** (`QUOTE_FLOW.md` § 4).
 *
 * POURQUOI UNE UNION DISCRIMINÉE POUR LE CHANTIER
 * -----------------------------------------------
 * La phase 11 modélisait le chantier par un objet plat : `nombre`, `hauteur`,
 * `contraintes`. Suffisant pour deux prestations, intenable pour cinq — il
 * aurait fallu ajouter `travaux`, `ampleur`, `taille`, `description`, tous
 * facultatifs, tous vides la plupart du temps. Un modèle où six champs sur
 * huit sont vides ne dit plus rien de ce qu'il représente, et le compilateur
 * n'y interdit plus rien : on peut lire `hauteur` sur un dessouchage.
 *
 * Ici le chantier est une **union discriminée par `kind`**. Lire `hauteur` sur
 * un chantier de souche est une **erreur de compilation**, pas un bug qu'on
 * découvre en recette. La règle métier « une souche n'a pas de hauteur » est
 * portée par le type, pas par une convention.
 */

/* --------------------------------------------------------------- Étapes -- */

export type QuoteStepId =
  | "besoin"
  | "chantier"
  | "photos"
  | "lieu"
  | "coordonnees";

/* --------------------------------------------------------------- Besoin -- */

export type NeedId =
  | "elagage"
  | "abattage"
  | "dessouchage"
  | "entretien-exterieur"
  | "inconnu";

/* --------------------------------------------- Vocabulaire des réponses -- */

/** Fourchettes : jamais un nombre exact, qui donnerait une fausse précision. */
export type CountId = "1" | "2-3" | "4-10" | "10-plus";

export type HeightId = "moins-5" | "5-10" | "10-20" | "plus-20" | "inconnu";

/** Souche : décrite par des repères visuels, jamais en centimètres. */
export type StumpSizeId = "petite" | "moyenne" | "grande" | "inconnu";

export type OutdoorWorkId =
  | "taille-de-haies"
  | "debroussaillage"
  | "espaces-verts"
  | "autre";

export type OutdoorScaleId = "petit" | "moyen" | "grand" | "inconnu";

export type ConstraintId =
  | "acces-difficile"
  | "habitation"
  | "route"
  | "cables"
  | "autre"
  | "aucune";

/** « Aucune » annule toute autre contrainte, et réciproquement. */
export const CONSTRAINT_EXCLUSIVE = "aucune" satisfies ConstraintId;

/* ------------------------------------------------------------- Chantier -- */

/**
 * Les contraintes sont sur la base commune, et c'est délibéré.
 *
 * Un accès difficile, une habitation ou des câbles à proximité conditionnent
 * le chiffrage quelle que soit la prestation. Les porter sur chaque variante
 * les rendrait incompatibles au changement de service, et on perdrait une
 * réponse déjà donnée pour rien (§ 4 du brief : ne nettoyer que ce qui est
 * réellement invalide).
 */
type ChantierBase = {
  contraintes: readonly ConstraintId[];
};

/** Élagage et abattage : un arbre a un nombre et une hauteur. */
export type ChantierArbre = ChantierBase & {
  kind: "arbre";
  nombre: CountId | "";
  hauteur: HeightId | "";
};

/** Dessouchage : une souche a un nombre et une taille — jamais une hauteur. */
export type ChantierSouche = ChantierBase & {
  kind: "souche";
  nombre: CountId | "";
  taille: StumpSizeId | "";
};

/** Entretien extérieur : ce n'est pas un sujet à compter, c'est un travail. */
export type ChantierExterieur = ChantierBase & {
  kind: "exterieur";
  travaux: readonly OutdoorWorkId[];
  ampleur: OutdoorScaleId | "";
};

/**
 * « Je ne sais pas » : aucune question technique.
 *
 * Quelqu'un qui ne sait pas nommer l'intervention ne saura pas davantage
 * estimer une hauteur. Lui poser la question le ferait sortir du parcours —
 * exactement ce que le brief interdit. Une description libre, et le reste se
 * règle au téléphone.
 */
export type ChantierInconnu = ChantierBase & {
  kind: "inconnu";
  description: string;
};

export type Chantier =
  | ChantierArbre
  | ChantierSouche
  | ChantierExterieur
  | ChantierInconnu;

export type ChantierKind = Chantier["kind"];

/* ----------------------------------------------------------- Demande --- */

export type QuoteLieu = {
  codePostal: string;
  ville: string;
  adresse: string;
};

export type QuoteContact = {
  nom: string;
  telephone: string;
  email: string;
  commentaire: string;
  consentement: boolean;
};

export type QuoteDraft = {
  besoin: NeedId | "";
  chantier: Chantier;
  lieu: QuoteLieu;
  contact: QuoteContact;
};

/* ------------------------------------------------------------- Erreurs -- */

/**
 * Clés d'erreur — plates et explicites plutôt que des chemins imbriqués.
 *
 * Chaque clé correspond à un contrôle réel de l'interface, donc à un
 * `aria-describedby` réel. Un chemin du genre `chantier.nombre` obligerait
 * chaque composant à savoir où il vit dans le modèle.
 */
export type QuoteFieldKey =
  | "besoin"
  | "nombre"
  | "hauteur"
  | "taille"
  | "travaux"
  | "ampleur"
  | "contraintes"
  | "description"
  | "codePostal"
  | "ville"
  | "adresse"
  | "nom"
  | "telephone"
  | "email"
  | "commentaire"
  | "consentement";

export type QuoteErrors = Partial<Record<QuoteFieldKey, string>>;
