import { chantierKindFor, emptyChantier } from "@/lib/quote/conditional";
import { MAX_PHOTOS, STEP_COUNT } from "@/lib/quote/options";
import { EMPTY_DRAFT } from "@/lib/quote/validation";
import type {
  Chantier,
  ConstraintId,
  CountId,
  HeightId,
  NeedId,
  OutdoorScaleId,
  OutdoorWorkId,
  QuoteDraft,
  StumpSizeId,
} from "@/lib/quote/types";

/**
 * Reprise du parcours après un rechargement.
 *
 * SESSIONSTORAGE, ET NON LOCALSTORAGE — ARBITRAGE
 * -----------------------------------------------
 * Les deux survivent à un F5. Ils diffèrent sur ce qui vient après :
 *
 * | | `sessionStorage` | `localStorage` |
 * | --- | --- | --- |
 * | Survit à un rechargement | oui | oui |
 * | Survit à la fermeture de l'onglet | **non** | oui |
 * | Durée de vie | l'onglet | des mois |
 *
 * Le besoin réel est **le rechargement accidentel pendant les deux minutes du
 * parcours**. `sessionStorage` le couvre entièrement. `localStorage` ne
 * couvrirait rien de plus d'utile, mais laisserait un devis à moitié rempli
 * sur la machine pendant des mois — sur un poste partagé, un ordinateur
 * familial ou un ordinateur professionnel. La minimisation des données tranche
 * sans hésitation.
 *
 * CE QUI N'EST DÉLIBÉRÉMENT PAS PERSISTÉ
 * ---------------------------------------
 * - **nom, téléphone, e-mail, commentaire, adresse précise** — données
 *   personnelles. Elles sont saisies à la toute fin du parcours ; les stocker
 *   ferait courir un risque réel (poste partagé) pour un gain d'ergonomie
 *   quasi nul, puisqu'un rechargement à l'étape 5 est rare et que la ressaisie
 *   y prend vingt secondes.
 * - **le consentement** — un accord se redonne, il ne se restaure pas.
 * - **les photos** — ni fichier, ni base64. Une seule photo de téléphone
 *   saturerait le quota, et conserver l'image d'un domicile dans le navigateur
 *   n'a aucune justification. Seul leur **nombre** est retenu, pour pouvoir
 *   dire « vos photos sont à rajouter ».
 *
 * Ce qui est persisté est donc : le besoin, les réponses chantier, le code
 * postal, la commune, l'étape atteinte, et un compteur de photos.
 */

export const STORAGE_KEY = "arbre-et-cime.devis.progression";

/** Une version, pour qu'un modèle modifié demain ne casse pas la reprise. */
const STORAGE_VERSION = 2;

export type PersistedProgress = {
  draft: QuoteDraft;
  stepIndex: number;
  furthest: number;
  /** Nombre de photos jointes avant le rechargement. Jamais les fichiers. */
  photoCount: number;
};

type StoredShape = {
  v: number;
  besoin: NeedId | "";
  chantier: Chantier;
  codePostal: string;
  ville: string;
  stepIndex: number;
  furthest: number;
  photoCount: number;
};

/* ---------------------------------------------------------- Écriture -- */

export function serialiseProgress(progress: PersistedProgress): string {
  const payload: StoredShape = {
    v: STORAGE_VERSION,
    besoin: progress.draft.besoin,
    chantier: progress.draft.chantier,
    codePostal: progress.draft.lieu.codePostal,
    ville: progress.draft.lieu.ville,
    stepIndex: progress.stepIndex,
    furthest: progress.furthest,
    photoCount: progress.photoCount,
  };

  return JSON.stringify(payload);
}

/* ---------------------------------------------------------- Lecture -- */

const NEEDS: readonly NeedId[] = [
  "elagage",
  "abattage",
  "dessouchage",
  "entretien-exterieur",
  "inconnu",
];

const COUNTS: readonly CountId[] = ["1", "2-3", "4-10", "10-plus"];
const HEIGHTS: readonly HeightId[] = [
  "moins-5",
  "5-10",
  "10-20",
  "plus-20",
  "inconnu",
];
const SIZES: readonly StumpSizeId[] = ["petite", "moyenne", "grande", "inconnu"];
const WORKS: readonly OutdoorWorkId[] = [
  "taille-de-haies",
  "debroussaillage",
  "espaces-verts",
  "autre",
];
const SCALES: readonly OutdoorScaleId[] = ["petit", "moyen", "grand", "inconnu"];
const CONSTRAINTS: readonly ConstraintId[] = [
  "acces-difficile",
  "habitation",
  "route",
  "cables",
  "autre",
  "aucune",
];

function one<T extends string>(allowed: readonly T[], value: unknown): T | "" {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : "";
}

function many<T extends string>(allowed: readonly T[], value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is T =>
      typeof item === "string" && (allowed as readonly string[]).includes(item),
  );
}

function text(value: unknown): string {
  return typeof value === "string" ? value.slice(0, 2000) : "";
}

function clampInt(value: unknown, min: number, max: number): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : min;
  return Math.min(Math.max(Math.trunc(n), min), max);
}

/**
 * Reconstruit un chantier **du bon type**, quoi qu'il y ait dans le stockage.
 *
 * `sessionStorage` est modifiable par l'utilisateur : tout est revalidé, champ
 * par champ, contre les valeurs autorisées. Une valeur inconnue retombe sur
 * du vide plutôt que de traverser jusqu'à l'affichage.
 */
function readChantier(besoin: NeedId | "", raw: unknown): Chantier {
  const kind = chantierKindFor(besoin);
  const base = emptyChantier(kind);
  const source = (typeof raw === "object" && raw !== null ? raw : {}) as Record<
    string,
    unknown
  >;
  const contraintes = many(CONSTRAINTS, source.contraintes);

  switch (base.kind) {
    case "arbre":
      return {
        ...base,
        contraintes,
        nombre: one(COUNTS, source.nombre),
        hauteur: one(HEIGHTS, source.hauteur),
      };
    case "souche":
      return {
        ...base,
        contraintes,
        nombre: one(COUNTS, source.nombre),
        taille: one(SIZES, source.taille),
      };
    case "exterieur":
      return {
        ...base,
        contraintes,
        travaux: many(WORKS, source.travaux),
        ampleur: one(SCALES, source.ampleur),
      };
    case "inconnu":
      return { ...base, contraintes, description: text(source.description) };
  }
}

/**
 * Relit une progression, en se méfiant de tout.
 *
 * Retourne `null` si rien d'exploitable : une reprise ratée doit produire un
 * formulaire vide, jamais une exception au montage du configurateur.
 */
export function parseProgress(raw: string | null): PersistedProgress | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) return null;
  const source = parsed as Record<string, unknown>;

  // Version différente : on préfère repartir de zéro plutôt que de deviner.
  if (source.v !== STORAGE_VERSION) return null;

  const besoin = one(NEEDS, source.besoin);

  return {
    draft: {
      besoin,
      chantier: readChantier(besoin, source.chantier),
      lieu: {
        codePostal: text(source.codePostal).replace(/\D/g, "").slice(0, 5),
        ville: text(source.ville).slice(0, 100),
        // Jamais persistée : elle repart toujours vide.
        adresse: "",
      },
      // Jamais persistées non plus.
      contact: EMPTY_DRAFT.contact,
    },
    stepIndex: clampInt(source.stepIndex, 0, STEP_COUNT - 1),
    furthest: clampInt(source.furthest, 0, STEP_COUNT - 1),
    photoCount: clampInt(source.photoCount, 0, MAX_PHOTOS),
  };
}

/** Y a-t-il quelque chose à reprendre ? Un brouillon vide n'est pas proposé. */
export function hasContent(progress: PersistedProgress): boolean {
  return Boolean(progress.draft.besoin) || progress.stepIndex > 0;
}

/* ------------------------------------------------------------- Accès -- */

/*
 * Les trois accès au stockage sont enfermés ici et ne lèvent jamais :
 * `sessionStorage` peut être refusé (navigation privée, réglage de
 * confidentialité, iframe sans permission). Un stockage indisponible dégrade
 * la reprise, il ne casse pas le parcours.
 */

export function readProgress(): PersistedProgress | null {
  try {
    return parseProgress(window.sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeProgress(progress: PersistedProgress): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, serialiseProgress(progress));
  } catch {
    // Quota atteint ou stockage refusé : la saisie en cours n'est pas affectée.
  }
}

export function clearProgress(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Rien à purger si le stockage est indisponible.
  }
}
