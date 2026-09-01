"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  CONSTRAINT_EXCLUSIVE,
  EMPTY_DRAFT,
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  PHOTO_ACCEPT_ATTR,
  STEP_COUNT,
  changeNeed,
  clearProgress,
  emitQuoteEvent,
  formatBytes,
  parseProgress,
  readProgress,
  stepAt,
  validateStep,
  writeProgress,
} from "@/lib/quote";
import type {
  ConstraintId,
  CountId,
  HeightId,
  NeedId,
  OutdoorScaleId,
  OutdoorWorkId,
  QuoteContact,
  QuoteDraft,
  QuoteErrors,
  QuoteLieu,
  StumpSizeId,
} from "@/lib/quote";

/**
 * Toute la logique du configurateur, hors de la vue.
 *
 * Le composant `QuoteConfigurator` ne fait plus que **rendre** : il n'a ni
 * validation, ni persistance, ni gestion de fichiers. C'est ce que demandait
 * le brief — « éviter un énorme composant contenant toute la logique » — et
 * c'est aussi ce qui rend cette logique lisible d'un bloc.
 */

export type QuotePhoto = {
  id: string;
  file: File;
  /** `blob:` — révoqué au retrait et au démontage, sinon la mémoire fuit. */
  url: string;
};

export type QuoteStatus = "form" | "sending" | "ready";

/** Durée de la séquence de préparation. Voir `quote-outcome.tsx`. */
const SENDING_MS = 1800;

/* ----------------------------------------------- Lecture du stockage --- */

/*
 * `sessionStorage` est une source externe : elle se lit avec
 * `useSyncExternalStore`, jamais avec un `setState` dans un effet.
 *
 * C'est la seule lecture qui donne un rendu serveur cohérent (rien) ET la
 * valeur réelle côté client, sans écart d'hydratation ni rendu en cascade.
 * L'instantané est mis en cache au premier appel : le stockage ne change pas
 * sous nos pieds, et une lecture par rendu ferait boucler le composant à
 * chaque sauvegarde.
 */
let snapshotRead = false;
let snapshot: ReturnType<typeof readProgress> = null;

function subscribeToProgress(): () => void {
  return () => {};
}

function getProgressSnapshot() {
  if (!snapshotRead) {
    snapshotRead = true;
    snapshot = readProgress();
  }
  return snapshot;
}

function getServerSnapshot(): null {
  return null;
}

/** Identifiant d'aperçu. `crypto.randomUUID` n'existe pas partout. */
let photoSeq = 0;
function nextPhotoId(): string {
  photoSeq += 1;
  return `photo-${photoSeq}`;
}

/* --------------------------------------------------------------- Hook --- */

export function useQuoteState(devisPath: string) {
  const restored = useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    getServerSnapshot,
  );

  /*
   * ÉTAT DÉRIVÉ PLUTÔT QUE RESTAURÉ
   * --------------------------------
   * `edits` est nul tant que rien n'a été saisi ; le brouillon effectif est
   * alors celui du stockage. Aucun `setState` au montage, donc aucun rendu en
   * cascade et aucun écart d'hydratation — et la reprise est **immédiate**,
   * sans bandeau à cliquer.
   *
   * Ce qui rend cette restauration automatique acceptable, c'est que le
   * stockage ne contient **aucune donnée personnelle** (voir
   * `persistence.ts`) : il n'y a rien à exposer sur un poste partagé.
   */
  const [edits, setEdits] = useState<QuoteDraft | null>(null);
  const [stepOverride, setStepOverride] = useState<number | null>(null);
  const [furthestEdit, setFurthestEdit] = useState<number | null>(null);

  const [photos, setPhotos] = useState<readonly QuotePhoto[]>([]);
  const [rejections, setRejections] = useState<readonly string[]>([]);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [direction, setDirection] = useState<"avant" | "arriere">("avant");
  const [status, setStatus] = useState<QuoteStatus>("form");
  const [photosNoticeDismissed, setPhotosNoticeDismissed] = useState(false);

  const draft = edits ?? restored?.draft ?? EMPTY_DRAFT;
  const stepIndex = stepOverride ?? restored?.stepIndex ?? 0;
  const furthest = Math.max(
    furthestEdit ?? restored?.furthest ?? 0,
    stepIndex,
  );

  const step = stepAt(stepIndex);
  const isLast = stepIndex === STEP_COUNT - 1;

  const started = useRef(false);

  /**
   * Photos perdues au rechargement — le seul reste des fichiers en stockage.
   *
   * Les fichiers ne survivent pas à un rechargement (et ne doivent pas
   * survivre). Le dire est plus honnête que de laisser quelqu'un croire que
   * ses photos sont toujours jointes.
   */
  const droppedPhotos =
    photosNoticeDismissed || photos.length > 0 ? 0 : (restored?.photoCount ?? 0);

  /* ------------------------------------------------------ Persistance --- */

  useEffect(() => {
    // Rien à écrire tant que rien n'a été saisi ni parcouru : cela écraserait
    // une progression existante par un formulaire vide.
    if (!edits && stepOverride === null) return;
    if (status !== "form") return;

    // Un formulaire vide à l'étape 1 n'est pas une progression : après un
    // « Nouvelle demande », il ne faut pas réécrire aussitôt un enregistrement
    // que l'on vient d'effacer.
    if (!draft.besoin && stepIndex === 0 && photos.length === 0) {
      clearProgress();
      return;
    }

    writeProgress({
      draft,
      stepIndex,
      furthest,
      photoCount: photos.length,
    });
  }, [draft, edits, furthest, photos.length, status, stepIndex, stepOverride]);

  /* ---------------------------------------------------------- Nettoyage --- */

  const photosRef = useRef<readonly QuotePhoto[]>([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      for (const photo of photosRef.current) {
        URL.revokeObjectURL(photo.url);
      }
    };
  }, []);

  /* ------------------------------------------------------------ Mesure --- */

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    emitQuoteEvent({ name: "quote_started" });
  }, []);

  /* --------------------------------------------------------- Séquence --- */

  useEffect(() => {
    if (status !== "sending") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const timer = window.setTimeout(
      () => setStatus("ready"),
      reduced ? 0 : SENDING_MS,
    );

    return () => window.clearTimeout(timer);
  }, [status]);

  /* -------------------------------------------------------- Navigation --- */

  const goTo = useCallback(
    (index: number, push: boolean) => {
      const safe = Math.min(Math.max(index, 0), STEP_COUNT - 1);

      setDirection(safe < stepIndex ? "arriere" : "avant");
      setStepOverride(safe);
      setFurthestEdit((current) => Math.max(current ?? furthest, safe));
      setErrors({});

      const url = `${devisPath}${safe === 0 ? "" : `?etape=${safe + 1}`}`;
      if (push) window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);
    },
    [devisPath, furthest, stepIndex],
  );

  useEffect(() => {
    function onPopState() {
      const raw = new URLSearchParams(window.location.search).get("etape");
      const target = Number.parseInt(raw ?? "1", 10) - 1;
      const safe = Number.isFinite(target)
        ? Math.min(Math.max(target, 0), furthest)
        : 0;

      setDirection(safe < stepIndex ? "arriere" : "avant");
      setStepOverride(safe);
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [furthest, stepIndex]);

  /* ------------------------------------------------------------ Saisie --- */

  const clearError = useCallback((key: keyof QuoteErrors) => {
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }, []);

  const apply = useCallback(
    (next: QuoteDraft) => setEdits(next),
    [],
  );

  const setNeed = useCallback(
    (besoin: NeedId) => {
      // `changeNeed` conserve tout ce qui reste valable et ne nettoie que ce
      // qui devient incohérent. Voir `conditional.ts`.
      apply(changeNeed(draft, besoin));
      clearError("besoin");
    },
    [apply, clearError, draft],
  );

  const setCount = useCallback(
    (nombre: CountId) => {
      const c = draft.chantier;
      if (c.kind !== "arbre" && c.kind !== "souche") return;
      apply({ ...draft, chantier: { ...c, nombre } });
      clearError("nombre");
    },
    [apply, clearError, draft],
  );

  const setHeight = useCallback(
    (hauteur: HeightId) => {
      const c = draft.chantier;
      if (c.kind !== "arbre") return;
      apply({ ...draft, chantier: { ...c, hauteur } });
      clearError("hauteur");
    },
    [apply, clearError, draft],
  );

  const setStumpSize = useCallback(
    (taille: StumpSizeId) => {
      const c = draft.chantier;
      if (c.kind !== "souche") return;
      apply({ ...draft, chantier: { ...c, taille } });
      clearError("taille");
    },
    [apply, clearError, draft],
  );

  const toggleWork = useCallback(
    (work: OutdoorWorkId) => {
      const c = draft.chantier;
      if (c.kind !== "exterieur") return;
      const travaux = c.travaux.includes(work)
        ? c.travaux.filter((item) => item !== work)
        : [...c.travaux, work];
      apply({ ...draft, chantier: { ...c, travaux } });
      clearError("travaux");
    },
    [apply, clearError, draft],
  );

  const setScale = useCallback(
    (ampleur: OutdoorScaleId) => {
      const c = draft.chantier;
      if (c.kind !== "exterieur") return;
      apply({ ...draft, chantier: { ...c, ampleur } });
      clearError("ampleur");
    },
    [apply, clearError, draft],
  );

  const setDescription = useCallback(
    (description: string) => {
      const c = draft.chantier;
      if (c.kind !== "inconnu") return;
      apply({ ...draft, chantier: { ...c, description } });
    },
    [apply, draft],
  );

  const toggleConstraint = useCallback(
    (value: ConstraintId) => {
      const c = draft.chantier;
      const current = c.contraintes;

      // « Aucune » est exclusive dans les deux sens : la cocher vide le reste,
      // cocher autre chose la retire. Sans cette règle, on laisse produire une
      // réponse contradictoire.
      const contraintes: ConstraintId[] =
        value === CONSTRAINT_EXCLUSIVE
          ? current.includes(value)
            ? []
            : [value]
          : current.includes(value)
            ? current.filter((id) => id !== value)
            : [
                ...current.filter((id) => id !== CONSTRAINT_EXCLUSIVE),
                value,
              ];

      apply({ ...draft, chantier: { ...c, contraintes } });
      clearError("contraintes");
    },
    [apply, clearError, draft],
  );

  const setLieu = useCallback(
    <K extends keyof QuoteLieu>(key: K, value: QuoteLieu[K]) => {
      apply({ ...draft, lieu: { ...draft.lieu, [key]: value } });
      clearError(key as keyof QuoteErrors);
    },
    [apply, clearError, draft],
  );

  const setContact = useCallback(
    <K extends keyof QuoteContact>(key: K, value: QuoteContact[K]) => {
      apply({ ...draft, contact: { ...draft.contact, [key]: value } });
      clearError(key as keyof QuoteErrors);
    },
    [apply, clearError, draft],
  );

  /* ------------------------------------------------------------ Photos --- */

  /**
   * Tri fait AVANT toute mise à jour d'état.
   *
   * Une fonction passée à `setPhotos` s'exécute pendant le rendu, parfois deux
   * fois en développement : y accumuler les refus donnait une liste vide au
   * moment de l'afficher, et des `createObjectURL` en double.
   */
  const addPhotos = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const refused: string[] = [];
      const accepted: QuotePhoto[] = [];

      for (const file of Array.from(files)) {
        if (photos.length + accepted.length >= MAX_PHOTOS) {
          refused.push(
            `Maximum ${MAX_PHOTOS} photos : « ${file.name} » n’a pas été ajoutée.`,
          );
          continue;
        }

        const isImage =
          file.type.startsWith("image/") ||
          /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);

        if (!isImage) {
          refused.push(
            `« ${file.name} » n’est pas une image (JPEG, PNG, WebP ou HEIC).`,
          );
          continue;
        }

        if (file.size > MAX_PHOTO_BYTES) {
          refused.push(
            `« ${file.name} » pèse ${formatBytes(file.size)} : la limite est de ${formatBytes(MAX_PHOTO_BYTES)}.`,
          );
          continue;
        }

        /*
         * Doublon : même nom, même taille, même date de modification.
         *
         * Trois attributs, parce qu'aucun ne suffit seul — deux photos prises
         * à la suite ont des noms proches et parfois la même taille. Comparer
         * le contenu obligerait à lire chaque fichier en mémoire, ce que le
         * brief interdit précisément (§ 15).
         */
        const duplicate = [...photos, ...accepted].some(
          (existing) =>
            existing.file.name === file.name &&
            existing.file.size === file.size &&
            existing.file.lastModified === file.lastModified,
        );

        if (duplicate) {
          refused.push(`« ${file.name} » est déjà jointe.`);
          continue;
        }

        accepted.push({
          id: nextPhotoId(),
          file,
          url: URL.createObjectURL(file),
        });
      }

      if (accepted.length > 0) {
        setPhotos((current) => [...current, ...accepted]);
        emitQuoteEvent({
          name: "quote_photo_added",
          count: photos.length + accepted.length,
        });
      }

      setRejections(refused);
    },
    [photos],
  );

  const removePhoto = useCallback((id: string) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((photo) => photo.id !== id);
    });
    setRejections([]);
  }, []);

  /* ------------------------------------------------------------- Suite --- */

  const complete = useMemo(
    () => Object.keys(validateStep(step.id, draft)).length === 0,
    [draft, step.id],
  );

  const submit = useCallback(() => {
    const found = validateStep(step.id, draft);

    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    emitQuoteEvent({
      name: "quote_step_completed",
      step: step.id,
      index: stepIndex,
    });

    if (!isLast) {
      goTo(stepIndex + 1, true);
      return;
    }

    /*
     * PHASE 12 : AUCUN ENVOI.
     *
     * On purge la progression et on bascule sur la séquence de préparation,
     * puis le récapitulatif. Le point de branchement de la phase 13 est ici,
     * et nulle part ailleurs : remplacer ce bloc par l'appel à
     * `POST /api/devis` suffira.
     */
    emitQuoteEvent({
      name: "quote_ready_to_submit",
      besoin: draft.besoin,
      photoCount: photos.length,
    });

    clearProgress();
    setStatus("sending");
  }, [draft, goTo, isLast, photos.length, step.id, stepIndex]);

  /** Repartir de zéro : efface la progression et les aperçus. */
  const restart = useCallback(() => {
    for (const photo of photos) URL.revokeObjectURL(photo.url);

    clearProgress();
    snapshotRead = true;
    snapshot = null;

    setPhotos([]);
    setRejections([]);
    setErrors({});
    setEdits(EMPTY_DRAFT);
    setStepOverride(0);
    setFurthestEdit(0);
    setStatus("form");
    setPhotosNoticeDismissed(true);
    window.history.replaceState(null, "", devisPath);
  }, [devisPath, photos]);

  /** Depuis le récapitulatif : revenir au formulaire sans rien perdre. */
  const editFromRecap = useCallback(
    (index: number) => {
      setStatus("form");
      goTo(index, false);
    },
    [goTo],
  );

  return {
    draft,
    photos,
    rejections,
    errors,
    stepIndex,
    furthest,
    direction,
    status,
    step,
    isLast,
    complete,
    droppedPhotos,
    dismissPhotosNotice: () => setPhotosNoticeDismissed(true),
    accept: PHOTO_ACCEPT_ATTR,
    setNeed,
    setCount,
    setHeight,
    setStumpSize,
    toggleWork,
    setScale,
    setDescription,
    toggleConstraint,
    setLieu,
    setContact,
    addPhotos,
    removePhoto,
    goTo,
    submit,
    restart,
    editFromRecap,
  };
}

/** Réexporté pour les tests et la phase 13. */
export { parseProgress };
