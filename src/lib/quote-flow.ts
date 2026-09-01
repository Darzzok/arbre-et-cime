import { area } from "@/lib/site";

/**
 * Modèle de données et validation du configurateur de devis.
 *
 * Ce fichier ne porte **aucune** logique de rendu et n'est pas un composant
 * client : il est importable depuis le serveur comme depuis le navigateur.
 * C'est voulu — en phase 12, la route `POST /api/devis` revalidera avec
 * `validateStep()`, exactement les mêmes règles que le navigateur.
 * `QUOTE_FLOW.md` § 4 l'exige : « schéma de validation partagé client et
 * serveur ; le serveur revalide toujours, sans exception ».
 *
 * Périmètre VERROUILLÉ : **5 étapes, dans cet ordre.** Aucune sixième.
 */

/* ---------------------------------------------------------------- Étapes -- */

export type QuoteStepId =
  | "besoin"
  | "chantier"
  | "photos"
  | "lieu"
  | "coordonnees";

export type QuoteStep = {
  id: QuoteStepId;
  /** Libellé court — fil de progression desktop. */
  label: string;
  /** Titre de l'étape, `h2` réel, cible du focus au changement d'étape. */
  title: string;
  /** Une phrase sous le titre. Jamais deux. */
  intro?: string;
};

export const QUOTE_STEPS: readonly QuoteStep[] = [
  {
    id: "besoin",
    label: "Besoin",
    title: "De quelle intervention avez-vous besoin ?",
    intro:
      "Si vous hésitez entre deux prestations, choisissez « Je ne sais pas encore » : nous en discuterons.",
  },
  {
    id: "chantier",
    label: "Chantier",
    title: "Parlez-nous du chantier",
    intro:
      "Ces trois réponses suffisent à cadrer un devis. « Je ne sais pas » est une réponse valable.",
  },
  {
    id: "photos",
    label: "Photos",
    title: "Montrez-nous le chantier",
    intro:
      "Quelques photos permettent de mieux comprendre la situation avant de vous recontacter.",
  },
  {
    id: "lieu",
    label: "Lieu",
    title: "Où se trouve le chantier ?",
  },
  {
    id: "coordonnees",
    label: "Coordonnées",
    title: "Comment vous recontacter ?",
  },
] as const;

export const STEP_COUNT = QUOTE_STEPS.length;

/** Durée annoncée sur la page d'accueil et en tête du configurateur. */
export const ESTIMATED_MINUTES = 2;

export function stepIndexOf(id: QuoteStepId): number {
  return QUOTE_STEPS.findIndex((step) => step.id === id);
}

export function stepAt(index: number): QuoteStep {
  // `noUncheckedIndexedAccess` : l'index vient toujours d'un calcul borné, mais
  // le type ne le sait pas. Repli sur la première étape plutôt qu'un `!`.
  return QUOTE_STEPS[index] ?? QUOTE_STEPS[0]!;
}

/* ---------------------------------------------------------------- Besoin -- */

export type NeedId =
  | "elagage"
  | "abattage"
  | "dessouchage"
  | "entretien-exterieur"
  | "je-ne-sais-pas";

export type NeedOption = {
  id: NeedId;
  label: string;
  /** Une ligne, orientée bénéfice, jamais du remplissage. */
  description: string;
  /**
   * Photo de la prestation, reprise de la section Prestations. Aucune image
   * nouvelle : ce sont les mêmes visuels licenciés, déjà inscrits dans
   * `MEDIA_SOURCES.md`.
   */
  image?: string;
  alt?: string;
  /** Cadrage : ces photos sont recadrées fort, le sujet doit rester dedans. */
  position?: string;
};

export const NEED_OPTIONS: readonly NeedOption[] = [
  {
    id: "elagage",
    label: "Élagage",
    description: "Tailler, alléger ou sécuriser un arbre qui reste en place.",
    image: "/images/services/elagage-travail-sur-corde-securite.jpg",
    alt: "Élagueur-grimpeur suspendu à sa corde, taillant les branches d’un arbre au pied d’un bâtiment",
    position: "object-[center_38%]",
  },
  {
    id: "abattage",
    label: "Abattage",
    description: "Retirer un arbre, par abattage direct ou démontage.",
    image: "/images/services/abattage-arbre-tombe-intervention-urgence.jpg",
    alt: "Grand arbre abattu, débité en sections sur un terrain arboré",
    position: "object-center",
  },
  {
    id: "dessouchage",
    label: "Dessouchage",
    description: "Supprimer ou rogner une souche pour libérer le terrain.",
    image: "/images/services/dessouchage-souche-fraiche-sciure.jpg",
    alt: "Souche fraîchement coupée, entourée de sciure",
    position: "object-center",
  },
  {
    id: "entretien-exterieur",
    label: "Entretien extérieur",
    description: "Haies, débroussaillage, remise en état d’un extérieur.",
    image: "/images/services/taille-de-haie-taille-haie-thermique.jpg",
    alt: "Taille d’une haie de conifères au taille-haie thermique",
    position: "object-[center_42%]",
  },
  {
    id: "je-ne-sais-pas",
    label: "Je ne sais pas encore",
    description: "Décrivez la situation, nous identifierons l’intervention.",
  },
] as const;

export function needLabel(id: string): string {
  return NEED_OPTIONS.find((option) => option.id === id)?.label ?? "";
}

/* -------------------------------------------------------------- Chantier -- */

export type Choice = { id: string; label: string };

/**
 * Le libellé de la question « combien » dépend du besoin — pas ses réponses.
 *
 * Compter des souches n'est pas compter des arbres, mais les mêmes fourchettes
 * conviennent aux deux. Adapter l'intitulé et garder l'échelle évite d'inventer
 * une seconde échelle sans valeur pour le chiffrage.
 */
const COUNT_QUESTIONS: Record<NeedId, string> = {
  elagage: "Combien d’arbres sont concernés ?",
  abattage: "Combien d’arbres sont concernés ?",
  dessouchage: "Combien de souches sont concernées ?",
  "entretien-exterieur": "Quelle est l’ampleur de l’intervention ?",
  "je-ne-sais-pas": "Combien de sujets sont concernés ?",
};

const COUNT_OPTIONS_DEFAULT: readonly Choice[] = [
  { id: "1", label: "1" },
  { id: "2-3", label: "2 à 3" },
  { id: "4-10", label: "4 à 10" },
  { id: "10-plus", label: "Plus de 10" },
] as const;

/** L'entretien extérieur se mesure en surface ou en linéaire, pas en unités. */
const COUNT_OPTIONS_EXTERIEUR: readonly Choice[] = [
  { id: "petit", label: "Une haie ou un petit espace" },
  { id: "moyen", label: "Plusieurs haies" },
  { id: "grand", label: "Un terrain entier" },
  { id: "10-plus", label: "Plusieurs terrains" },
] as const;

export const HEIGHT_OPTIONS: readonly Choice[] = [
  { id: "moins-5", label: "Moins de 5 m" },
  { id: "5-10", label: "5 à 10 m" },
  { id: "10-20", label: "10 à 20 m" },
  { id: "plus-20", label: "Plus de 20 m" },
  { id: "inconnu", label: "Je ne sais pas" },
] as const;

export const CONSTRAINT_OPTIONS: readonly Choice[] = [
  { id: "acces-difficile", label: "Accès difficile" },
  { id: "habitation", label: "Proche d’une habitation" },
  { id: "route", label: "Proche d’une route" },
  { id: "cables", label: "Proximité de câbles" },
  { id: "aucune", label: "Aucune de ces situations" },
  { id: "autre", label: "Autre" },
] as const;

/** Exclusif : « aucune » annule toute autre contrainte, et réciproquement. */
export const CONSTRAINT_EXCLUSIVE = "aucune";

export function countQuestionFor(need: string): string {
  return COUNT_QUESTIONS[need as NeedId] ?? COUNT_QUESTIONS["je-ne-sais-pas"];
}

export function countOptionsFor(need: string): readonly Choice[] {
  return need === "entretien-exterieur"
    ? COUNT_OPTIONS_EXTERIEUR
    : COUNT_OPTIONS_DEFAULT;
}

/**
 * La hauteur n'est posée que lorsqu'elle existe.
 *
 * Une souche n'a pas de hauteur, une haie se taille à hauteur d'homme : poser
 * la question quand même produirait une donnée vide et donnerait au parcours
 * l'air d'un formulaire générique. C'est la seule adaptativité de l'étape 2 —
 * la multiplier rendrait le parcours imprévisible.
 */
export function needsHeight(need: string): boolean {
  return need === "elagage" || need === "abattage" || need === "je-ne-sais-pas";
}

export function choiceLabel(options: readonly Choice[], id: string): string {
  return options.find((option) => option.id === id)?.label ?? "";
}

/* --------------------------------------------------------------- Photos -- */

/** Plafond d'interface. Le plafond serveur arrivera en phase 12. */
export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

/** Attribut `accept` de l'input. `image/*` en dernier ressort pour Android. */
export const PHOTO_ACCEPT_ATTR = `${ACCEPTED_PHOTO_TYPES.join(",")},image/*`;

export function isAcceptedPhoto(file: File): boolean {
  // Certains navigateurs ne renseignent pas le type pour un HEIC : on retombe
  // sur l'extension plutôt que de refuser une photo d'iPhone parfaitement
  // valable.
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
}

export function formatBytes(bytes: number): string {
  const mo = bytes / (1024 * 1024);
  if (mo >= 1) return `${mo.toFixed(mo >= 10 ? 0 : 1).replace(".", ",")} Mo`;
  return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
}

/* --------------------------------------------------------------- Brouillon -- */

export type QuoteDraft = {
  besoin: string;
  nombre: string;
  hauteur: string;
  contraintes: readonly string[];
  codePostal: string;
  ville: string;
  adresse: string;
  nom: string;
  telephone: string;
  email: string;
  commentaire: string;
  consentement: boolean;
};

export const EMPTY_DRAFT: QuoteDraft = {
  besoin: "",
  nombre: "",
  hauteur: "",
  contraintes: [],
  codePostal: "",
  ville: "",
  adresse: "",
  nom: "",
  telephone: "",
  email: "",
  commentaire: "",
  consentement: false,
};

export type QuoteField = keyof QuoteDraft;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

/* ------------------------------------------------------------ Validation -- */

const POSTAL_CODE = /^\d{5}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/**
 * Téléphone français, tolérant à la mise en forme.
 *
 * Les espaces, points, tirets et parenthèses sont retirés avant contrôle : un
 * visiteur qui écrit « 06 12 34 56 78 » ne doit pas voir d'erreur. Seule la
 * structure est vérifiée, jamais l'existence du numéro.
 */
export function normalisePhone(value: string): string {
  return value.replace(/[\s.\-()]/g, "");
}

export function isValidPhone(value: string): boolean {
  const digits = normalisePhone(value);
  return /^(?:\+33|0033|0)[1-9]\d{8}$/.test(digits);
}

/**
 * Valide UNE étape et retourne les messages d'erreur par champ.
 *
 * Retourne un objet vide quand l'étape est valide. Les messages sont rédigés
 * pour être lus par la personne qui remplit, pas par un développeur : ils
 * disent quoi faire, jamais « champ invalide ».
 */
export function validateStep(step: QuoteStepId, draft: QuoteDraft): QuoteErrors {
  const errors: QuoteErrors = {};

  if (step === "besoin") {
    if (!draft.besoin) {
      errors.besoin = "Choisissez une intervention pour continuer.";
    }
    return errors;
  }

  if (step === "chantier") {
    if (!draft.nombre) {
      errors.nombre = "Indiquez l’ampleur du chantier.";
    }
    if (needsHeight(draft.besoin) && !draft.hauteur) {
      errors.hauteur =
        "Indiquez une hauteur approximative, ou « Je ne sais pas ».";
    }
    if (draft.contraintes.length === 0) {
      errors.contraintes =
        "Sélectionnez au moins une situation, ou « Aucune de ces situations ».";
    }
    return errors;
  }

  // Étape photos : rien n'est obligatoire. Les photos accélèrent le chiffrage,
  // elles ne conditionnent pas la demande (CONVERSION_STRATEGY.md § 5).
  if (step === "photos") {
    return errors;
  }

  if (step === "lieu") {
    if (!POSTAL_CODE.test(draft.codePostal.trim())) {
      errors.codePostal = "Indiquez un code postal à 5 chiffres.";
    }
    if (draft.ville.trim().length < 2) {
      errors.ville = "Indiquez la commune du chantier.";
    }
    return errors;
  }

  if (!draft.nom.trim()) {
    errors.nom = "Indiquez votre nom.";
  }
  if (!draft.telephone.trim()) {
    errors.telephone = "Indiquez un numéro pour vous rappeler.";
  } else if (!isValidPhone(draft.telephone)) {
    errors.telephone = "Ce numéro semble incomplet. Exemple : 06 12 34 56 78.";
  }
  if (!draft.email.trim()) {
    errors.email = "Indiquez une adresse e-mail.";
  } else if (!EMAIL.test(draft.email.trim())) {
    errors.email = "Cette adresse e-mail semble incomplète.";
  }
  if (!draft.consentement) {
    errors.consentement =
      "Votre accord est nécessaire pour traiter la demande.";
  }

  return errors;
}

/** L'étape est-elle franchissable ? Utilisé pour l'état du bouton Continuer. */
export function isStepComplete(step: QuoteStepId, draft: QuoteDraft): boolean {
  return Object.keys(validateStep(step, draft)).length === 0;
}

/* ------------------------------------------------------------ Persistance -- */

/**
 * Reprise après rechargement accidentel — `sessionStorage`, jamais
 * `localStorage`.
 *
 * Différence assumée : le brouillon vit le temps de l'onglet. Un devis à
 * moitié rempli retrouvé trois semaines plus tard n'aide personne et fait
 * traîner des coordonnées sur un poste peut-être partagé. La minimisation des
 * données prime (`QUOTE_FLOW.md` § 4).
 *
 * **Aucune photo n'est jamais persistée.** Ni fichier, ni base64 : le quota de
 * `sessionStorage` est de quelques mégaoctets, une seule photo de téléphone le
 * saturerait, et stocker l'image d'un domicile dans le navigateur n'a aucune
 * justification.
 */
export const DRAFT_STORAGE_KEY = "arbre-et-cime.devis.brouillon";

export function serialiseDraft(draft: QuoteDraft): string {
  return JSON.stringify(draft);
}

/**
 * Relit un brouillon en se méfiant de son contenu : `sessionStorage` est
 * modifiable par l'utilisateur, et un `JSON.parse` nu ferait planter le
 * configurateur au montage. Tout champ absent ou du mauvais type retombe sur
 * sa valeur vide.
 */
export function parseDraft(raw: string | null): QuoteDraft | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) return null;
  const source = parsed as Record<string, unknown>;

  const text = (key: string): string =>
    typeof source[key] === "string" ? (source[key] as string) : "";

  return {
    besoin: text("besoin"),
    nombre: text("nombre"),
    hauteur: text("hauteur"),
    contraintes: Array.isArray(source.contraintes)
      ? source.contraintes.filter(
          (value): value is string => typeof value === "string",
        )
      : [],
    codePostal: text("codePostal"),
    ville: text("ville"),
    adresse: text("adresse"),
    nom: text("nom"),
    telephone: text("telephone"),
    email: text("email"),
    commentaire: text("commentaire"),
    consentement: source.consentement === true,
  };
}

/* -------------------------------------------------------------- Zone --- */

/**
 * Message de zone affiché à l'étape 4, à partir du seul code postal.
 *
 * **Aucune promesse de couverture.** Le rayon de 100 km est un argument
 * commercial, pas une zone desservie : le message reste ouvert dans tous les
 * cas et n'empêche jamais l'envoi (`QUOTE_FLOW.md` § 2, `CONTENT_STRATEGY.md`
 * § 5 quinquies). Le département seul est utilisé — reconnaître la commune
 * exacte demanderait une base que le site n'embarque pas, et une réponse
 * approximative serait pire que pas de réponse.
 */
export function zoneNoteFor(codePostal: string): string | null {
  const value = codePostal.trim();
  if (!POSTAL_CODE.test(value)) return null;

  const departement = value.slice(0, 2);

  if (departement === "76") {
    return `${area.department} : c’est le cœur de la zone d’intervention.`;
  }

  // Départements limitrophes entièrement ou majoritairement dans le rayon.
  if (["27", "14", "60", "80", "61", "78", "95"].includes(departement)) {
    return `Ce secteur est dans le rayon de ${area.maxRadiusKm} km : déplacement possible selon le chantier.`;
  }

  return "Ce secteur est plus éloigné : indiquez-le quand même, nous vous dirons si le déplacement est possible.";
}
