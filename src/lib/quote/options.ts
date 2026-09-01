import type {
  ConstraintId,
  CountId,
  HeightId,
  NeedId,
  OutdoorScaleId,
  OutdoorWorkId,
  QuoteStepId,
  StumpSizeId,
} from "@/lib/quote/types";

/**
 * Le vocabulaire affiché : étapes, options, libellés.
 *
 * Séparé de `types.ts` (ce qu'une donnée peut valoir) et de `validation.ts`
 * (ce qu'elle doit valoir) : ici on ne décide que de la **formulation**. C'est
 * le fichier qu'on ouvre pour changer un mot, et le seul.
 */

/* --------------------------------------------------------------- Étapes -- */

export type QuoteStep = {
  id: QuoteStepId;
  label: string;
  title: string;
  intro?: string;
};

/** VERROUILLÉ : 5 étapes, dans cet ordre. Aucune sixième. */
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
      "Quelques réponses suffisent à cadrer un devis. « Je ne sais pas » est une réponse valable.",
  },
  {
    id: "photos",
    label: "Photos",
    title: "Montrez-nous le chantier",
    intro:
      "Quelques photos permettent de mieux comprendre la situation avant de vous recontacter.",
  },
  { id: "lieu", label: "Lieu", title: "Où se trouve le chantier ?" },
  {
    id: "coordonnees",
    label: "Coordonnées",
    title: "Comment vous recontacter ?",
  },
] as const;

export const STEP_COUNT = QUOTE_STEPS.length;

export const ESTIMATED_MINUTES = 2;

export function stepIndexOf(id: QuoteStepId): number {
  return QUOTE_STEPS.findIndex((step) => step.id === id);
}

export function stepAt(index: number): QuoteStep {
  // L'index vient toujours d'un calcul borné, mais `noUncheckedIndexedAccess`
  // ne le sait pas. Repli sur la première étape plutôt qu'un `!`.
  return QUOTE_STEPS[index] ?? QUOTE_STEPS[0]!;
}

/* --------------------------------------------------------------- Besoin -- */

export type NeedOption = {
  id: NeedId;
  label: string;
  description: string;
  /** Photo déjà licenciée et inscrite à `MEDIA_SOURCES.md`. Aucune nouvelle. */
  image?: string;
  alt?: string;
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
    id: "inconnu",
    label: "Je ne sais pas encore",
    description: "Décrivez la situation, nous identifierons l’intervention.",
  },
] as const;

export function needLabel(id: string): string {
  return NEED_OPTIONS.find((option) => option.id === id)?.label ?? "";
}

/* ------------------------------------------------------------- Réponses -- */

export type Choice<T extends string> = { id: T; label: string };

export const COUNT_OPTIONS: readonly Choice<CountId>[] = [
  { id: "1", label: "1" },
  { id: "2-3", label: "2 à 3" },
  { id: "4-10", label: "4 à 10" },
  { id: "10-plus", label: "Plus de 10" },
] as const;

export const HEIGHT_OPTIONS: readonly Choice<HeightId>[] = [
  { id: "moins-5", label: "Moins de 5 m" },
  { id: "5-10", label: "5 à 10 m" },
  { id: "10-20", label: "10 à 20 m" },
  { id: "plus-20", label: "Plus de 20 m" },
  { id: "inconnu", label: "Je ne sais pas" },
] as const;

/**
 * Taille de souche — décrite par des repères du quotidien.
 *
 * Un particulier ne mesure pas un diamètre au mètre ruban, et un devis n'en a
 * pas besoin à ce stade. Les repères choisis sont visuels et sans ambiguïté
 * (`CLAUDE.md` : ne jamais demander une donnée technique que le client ne peut
 * pas fournir).
 */
export const STUMP_SIZE_OPTIONS: readonly Choice<StumpSizeId>[] = [
  { id: "petite", label: "Petite — comme une assiette" },
  { id: "moyenne", label: "Moyenne — comme un couvercle de poubelle" },
  { id: "grande", label: "Grande — plus large qu’un couvercle de poubelle" },
  { id: "inconnu", label: "Je ne sais pas" },
] as const;

export const OUTDOOR_WORK_OPTIONS: readonly Choice<OutdoorWorkId>[] = [
  { id: "taille-de-haies", label: "Taille de haies" },
  { id: "debroussaillage", label: "Débroussaillage" },
  { id: "espaces-verts", label: "Entretien d’espaces verts" },
  { id: "autre", label: "Autre" },
] as const;

export const OUTDOOR_SCALE_OPTIONS: readonly Choice<OutdoorScaleId>[] = [
  { id: "petit", label: "Une haie ou un petit espace" },
  { id: "moyen", label: "Plusieurs haies, ou un jardin" },
  { id: "grand", label: "Un terrain entier" },
  { id: "inconnu", label: "Je ne sais pas" },
] as const;

export const CONSTRAINT_OPTIONS: readonly Choice<ConstraintId>[] = [
  { id: "acces-difficile", label: "Accès difficile" },
  { id: "habitation", label: "Proche d’une habitation" },
  { id: "route", label: "Proche d’une route" },
  { id: "cables", label: "Proximité de câbles" },
  { id: "aucune", label: "Aucune de ces situations" },
  { id: "autre", label: "Autre" },
] as const;

/** Résout un libellé, ou une chaîne vide — jamais `undefined` à l'écran. */
export function choiceLabel<T extends string>(
  options: readonly Choice<T>[],
  id: string,
): string {
  return options.find((option) => option.id === id)?.label ?? "";
}

export function choiceLabels<T extends string>(
  options: readonly Choice<T>[],
  ids: readonly string[],
): string {
  return ids
    .map((id) => choiceLabel(options, id))
    .filter(Boolean)
    .join(", ");
}

/* --------------------------------------------------------------- Photos -- */

export const MAX_PHOTOS = 5;

/**
 * 10 Mo par fichier — décidé, pas repris par habitude.
 *
 * Une photo d'iPhone 15 en HEIC pèse 2 à 3 Mo, la même en JPEG 12 Mpx environ
 * 5 Mo. 10 Mo laisse passer toutes les photos de téléphone actuelles, y
 * compris en mode « haute efficacité » désactivé, tout en écartant les fichiers
 * qui ne sont manifestement pas des photos de chantier (captures d'écran
 * d'appareil photo reflex, panoramas de 40 Mo).
 *
 * En phase 13, la compression côté client ramènera ces fichiers sous 1 Mo
 * avant envoi : cette limite protège la mémoire du navigateur, pas le réseau.
 */
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

/** `image/*` en dernier recours : Android renseigne mal certains types. */
export const PHOTO_ACCEPT_ATTR = `${ACCEPTED_PHOTO_TYPES.join(",")},image/*`;

export function formatBytes(bytes: number): string {
  const mo = bytes / (1024 * 1024);
  if (mo >= 1) return `${mo.toFixed(mo >= 10 ? 0 : 1).replace(".", ",")} Mo`;
  return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
}
