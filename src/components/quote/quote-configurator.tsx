"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import type { QuotePhoto } from "@/components/quote/photo-picker";
import { QuoteRecap, QuoteSending } from "@/components/quote/quote-outcome";
import { QuoteProgress } from "@/components/quote/quote-progress";
import {
  StepBesoin,
  StepChantier,
  StepCoordonnees,
  StepLieu,
  StepPhotos,
} from "@/components/quote/quote-steps";
import { Body, Button } from "@/components/ui";
import {
  DRAFT_STORAGE_KEY,
  EMPTY_DRAFT,
  ESTIMATED_MINUTES,
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  type QuoteDraft,
  type QuoteErrors,
  STEP_COUNT,
  formatBytes,
  isAcceptedPhoto,
  isStepComplete,
  parseDraft,
  serialiseDraft,
  stepAt,
  validateStep,
} from "@/lib/quote-flow";
import { getRoute } from "@/lib/routes";

/**
 * Configurateur de devis — orchestration des 5 étapes VERROUILLÉES.
 *
 * SEUL composant client de la page. La page `/devis` reste un composant
 * serveur : métadonnées, `h1`, cadre éditorial et pied de page ne coûtent rien
 * au navigateur. C'est la règle du projet — `"use client"` le plus bas
 * possible dans l'arbre (`CLAUDE.md` § 4).
 *
 * PHASE 11 — INTERFACE UNIQUEMENT
 * -------------------------------
 * Rien n'est envoyé. Pas de route serveur, pas de stockage distant, pas
 * d'e-mail. L'écran final le dit explicitement plutôt que de mimer une
 * confirmation : une fausse confirmation d'envoi serait un mensonge affiché à
 * un visiteur réel, le site étant déjà déployé publiquement.
 *
 * ÉTAT
 * ----
 * Une seule source de vérité : `draft` pour le texte, `photos` pour les
 * fichiers. Les deux sont séparés parce qu'ils n'ont pas la même durée de vie —
 * le brouillon texte survit à un rechargement, les fichiers non.
 */

const devis = getRoute("devis");

/* ------------------------------------------------- Brouillon stocké --- */

/*
 * `sessionStorage` est une source externe : elle se lit avec
 * `useSyncExternalStore`, pas avec un `setState` dans un effet.
 *
 * C'est la seule façon d'obtenir un rendu serveur cohérent (instantané vide)
 * ET la valeur réelle côté client sans écart d'hydratation ni rendu en
 * cascade. L'instantané est mis en cache au premier appel : le brouillon ne
 * change pas sous nos pieds, et une lecture par rendu ferait boucler le
 * composant à chaque sauvegarde.
 */
let storedSnapshot: string | null = null;
let storedRead = false;

function subscribeToStoredDraft(): () => void {
  return () => {};
}

function readStoredDraft(): string | null {
  if (!storedRead) {
    storedRead = true;
    try {
      storedSnapshot = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    } catch {
      // Navigation privée, stockage refusé : pas de brouillon, pas d'erreur.
      storedSnapshot = null;
    }
  }
  return storedSnapshot;
}

/** Sur le serveur il n'y a jamais de brouillon. */
function noStoredDraft(): null {
  return null;
}

/**
 * Durée de la séquence de préparation, en millisecondes.
 *
 * Trois lignes cochées à 380 ms d'intervalle, plus une respiration finale.
 * Calée sur le travail réellement effectué, pas allongée pour faire sérieux :
 * une attente fabriquée est une attente quand même.
 */
const SENDING_MS = 1800;

/** Identifiant d'aperçu local. `crypto.randomUUID` n'existe pas partout. */
let photoSeq = 0;
function nextPhotoId(): string {
  photoSeq += 1;
  return `photo-${photoSeq}`;
}

export function QuoteConfigurator() {
  const [draft, setDraft] = useState<QuoteDraft>(EMPTY_DRAFT);
  const [photos, setPhotos] = useState<readonly QuotePhoto[]>([]);
  const [rejections, setRejections] = useState<readonly string[]>([]);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [direction, setDirection] = useState<"avant" | "arriere">("avant");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  /*
   * `dirty` garde la sauvegarde silencieuse tant que rien n'a été saisi.
   * Sans lui, le premier rendu écraserait aussitôt un brouillon existant par
   * un formulaire vide — avant même que la personne ait pu le reprendre.
   */
  const [dirty, setDirty] = useState(false);
  const [resumeDismissed, setResumeDismissed] = useState(false);

  const storedRaw = useSyncExternalStore(
    subscribeToStoredDraft,
    readStoredDraft,
    noStoredDraft,
  );

  const storedDraft = useMemo(() => parseDraft(storedRaw), [storedRaw]);

  /*
   * Le brouillon n'est JAMAIS réinjecté d'office : la reprise est proposée,
   * puis choisie. Retrouver un formulaire pré-rempli sans l'avoir demandé
   * surprend, et sur un poste partagé cela expose des coordonnées.
   */
  const canResume =
    !resumeDismissed &&
    !dirty &&
    stepIndex === 0 &&
    storedDraft !== null &&
    Boolean(storedDraft.besoin || storedDraft.nom || storedDraft.codePostal);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const step = stepAt(stepIndex);
  const isLast = stepIndex === STEP_COUNT - 1;

  /* ------------------------------------------------------- Persistance --- */

  useEffect(() => {
    if (!dirty || submitted) return;

    try {
      window.sessionStorage.setItem(DRAFT_STORAGE_KEY, serialiseDraft(draft));
    } catch {
      // Quota ou stockage refusé : la saisie en cours n'est pas affectée.
    }
  }, [draft, dirty, submitted]);

  /* ---------------------------------------------------------- Nettoyage --- */

  /*
   * Les `blob:` des aperçus doivent être révoqués, sinon les fichiers restent
   * en mémoire tant que l'onglet vit. Le `ref` évite de recréer l'effet à
   * chaque ajout de photo — on ne veut nettoyer qu'au démontage.
   */
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

  /* ------------------------------------------------------------- Focus --- */

  /*
   * Le focus se déplace sur le titre de l'étape à chaque changement
   * (`QUOTE_FLOW.md` § 4) : sans cela, un utilisateur au clavier reste sur le
   * bouton « Continuer » d'un écran qui n'existe plus, et un lecteur d'écran
   * n'annonce jamais l'étape atteinte. Jamais au premier rendu, où déplacer le
   * focus volerait la position de lecture.
   */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex, submitted]);

  /* --------------------------------------------------------- Séquence --- */

  /*
   * La séquence de préparation laisse la place au récapitulatif au bout de
   * `SENDING_MS`. Le `setState` est dans un callback de `setTimeout`, pas dans
   * le corps de l'effet : c'est bien une synchronisation avec une source
   * externe (l'horloge), pas un rendu en cascade.
   *
   * Sous `prefers-reduced-motion`, la séquence est sautée entièrement — une
   * animation d'attente est exactement ce que ce réglage demande d'éviter.
   */
  useEffect(() => {
    if (!sending) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const timer = window.setTimeout(
      () => {
        setSending(false);
        setSubmitted(true);
      },
      reduced ? 0 : SENDING_MS,
    );

    return () => window.clearTimeout(timer);
  }, [sending]);

  /* -------------------------------------------------------- Historique --- */

  /*
   * L'étape est reflétée dans l'URL (`?etape=3`) : le bouton « précédent » du
   * navigateur revient d'une étape au lieu de quitter le configurateur, et la
   * phase 16 pourra mesurer l'abandon par étape.
   *
   * `history.pushState` direct, sans le routeur : il n'y a pas de navigation
   * Next à déclencher, l'URL n'est qu'un miroir. Le retour en arrière est
   * borné par `furthest` — on ne saute jamais une étape obligatoire, y compris
   * par l'URL.
   */
  useEffect(() => {
    function onPopState() {
      const raw = new URLSearchParams(window.location.search).get("etape");
      const target = Number.parseInt(raw ?? "1", 10) - 1;
      const safe = Number.isFinite(target)
        ? Math.min(Math.max(target, 0), furthest)
        : 0;

      setDirection(safe < stepIndex ? "arriere" : "avant");
      setStepIndex(safe);
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [furthest, stepIndex]);

  const goTo = useCallback(
    (index: number, push: boolean) => {
      const safe = Math.min(Math.max(index, 0), STEP_COUNT - 1);

      setDirection(safe < stepIndex ? "arriere" : "avant");
      setStepIndex(safe);
      setErrors({});
      setFurthest((current) => Math.max(current, safe));

      const url = `${devis.path}${safe === 0 ? "" : `?etape=${safe + 1}`}`;
      if (push) {
        window.history.pushState(null, "", url);
      } else {
        window.history.replaceState(null, "", url);
      }
    },
    [stepIndex],
  );

  /* -------------------------------------------------------------- Champs --- */

  const onField = useCallback(
    <K extends keyof QuoteDraft>(field: K, value: QuoteDraft[K]) => {
      setDraft((current) => ({ ...current, [field]: value }));
      setDirty(true);

      // L'erreur d'un champ disparaît dès qu'on le corrige. La validation
      // complète, elle, reste au passage à l'étape suivante : signaler une
      // erreur pendant la frappe est agressif et prématuré.
      setErrors((current) => {
        if (!(field in current)) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    },
    [],
  );

  /* -------------------------------------------------------------- Photos --- */

  /*
   * Le tri est fait AVANT toute mise à jour d'état, jamais à l'intérieur d'un
   * updater : une fonction passée à `setPhotos` est exécutée pendant le rendu,
   * possiblement deux fois en développement. Y accumuler les refus dans un
   * tableau extérieur donnait une liste vide au moment de l'afficher — et des
   * doublons de `createObjectURL` au second passage.
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
        if (!isAcceptedPhoto(file)) {
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

        accepted.push({
          id: nextPhotoId(),
          file,
          url: URL.createObjectURL(file),
        });
      }

      if (accepted.length > 0) {
        setPhotos((current) => [...current, ...accepted]);
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

  /* ---------------------------------------------------------- Navigation --- */

  const complete = isStepComplete(step.id, draft);

  function handleContinue() {
    const found = validateStep(step.id, draft);

    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    if (isLast) {
      // PHASE 11 : aucun envoi. Le brouillon est purgé pour ne pas laisser des
      // coordonnées derrière soi, et l'écran final annonce la simulation.
      try {
        window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Sans stockage disponible, il n'y a rien à purger.
      }
      setSending(true);
      return;
    }

    goTo(stepIndex + 1, true);
  }

  /* ------------------------------------------------------------- Rendu --- */

  if (sending) {
    return <QuoteSending photoCount={photos.length} />;
  }

  if (submitted) {
    return (
      <QuoteRecap
        draft={draft}
        photos={photos}
        onEdit={() => {
          setSubmitted(false);
          setDirty(true);
          goTo(0, false);
        }}
      />
    );
  }

  const errorList = Object.values(errors).filter(Boolean);

  return (
    /*
      LE CONFIGURATEUR EST UN OBJET, PAS UNE SUITE DE BLOCS
      -----------------------------------------------------
      Première version : tout posé à plat sur l'ivoire de la page. Résultat —
      un formulaire pâle, sans hiérarchie, que rien ne distinguait du texte
      éditorial au-dessus.

      Désormais un panneau fermé, en deux zones franches :
      - un **bandeau forêt** qui porte la progression, le numéro et la question
        de l'étape. C'est le seul aplat sombre de la page : il capte l'œil, et
        il donne au jaune de la progression un fond où il contraste (7,16) ;
      - un **corps ivoire** qui porte les contrôles, là où la saisie demande de
        la clarté et non de l'effet.

      Le découpage n'est pas décoratif : il sépare « où j'en suis » de « ce que
      je dois faire », les deux questions que se pose la personne à chaque
      étape.
    */
    <div className="overflow-hidden rounded-card border border-(--surface-rule) text-left">
      {/* ---------------------------------------------- Bandeau sombre --- */}
      <div
        data-surface="dark"
        className="bg-(--surface-bg) px-5 py-7 sm:px-8 sm:py-9 lg:px-10"
      >
        <QuoteProgress
          current={stepIndex}
          furthest={furthest}
          onJump={(index) => goTo(index, false)}
        />

        {/* Le titre est keyé à part de la progression : remonter la barre à
            chaque étape la ferait repartir de zéro au lieu de progresser. */}
        <div
          key={`entete-${stepIndex}`}
          data-quote-step=""
          data-direction={direction}
          className="mt-8 flex gap-4 sm:gap-5"
        >
          <span
            aria-hidden="true"
            className="mt-1 font-sans text-caption font-semibold tabular-nums tracking-[0.12em] text-(--color-safety)"
          >
            {String(stepIndex + 1).padStart(2, "0")}
          </span>

          <div className="min-w-0">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-title text-(--surface-heading) text-balance"
            >
              {step.title}
            </h2>

            {step.intro ? (
              <Body className="mt-3 max-w-reading text-(--surface-fg-muted)">
                {step.intro}
              </Body>
            ) : null}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ Corps clair --- */}
      <div className="bg-(--surface-bg) px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
      {canResume && storedDraft ? (
        <div className="mb-8 flex flex-col gap-3 rounded-card border border-(--surface-rule) bg-(--surface-inset) p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-caption text-(--surface-fg)">
            Une demande commencée est enregistrée dans cet onglet.
          </p>

          <div className="flex shrink-0 gap-4">
            <button
              type="button"
              onClick={() => {
                setDraft(storedDraft);
                setDirty(true);
                setResumeDismissed(true);
              }}
              className="rounded-edge font-sans text-caption font-semibold text-(--surface-fg) underline underline-offset-4"
            >
              Reprendre
            </button>

            <button
              type="button"
              onClick={() => {
                setResumeDismissed(true);
                try {
                  window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
                } catch {
                  // Rien à purger si le stockage est indisponible.
                }
              }}
              className="rounded-edge font-sans text-caption text-(--surface-fg-muted) underline underline-offset-4"
            >
              Recommencer
            </button>
          </div>
        </div>
      ) : null}

      {/*
        `key` sur l'étape : React remonte le bloc, ce qui rejoue l'animation
        d'entrée. `data-direction` en donne le sens — glissement vers la gauche
        en avançant, vers la droite en revenant.
      */}
      <div
        key={stepIndex}
        data-quote-step=""
        data-direction={direction}
      >
        <div>
          {step.id === "besoin" ? (
            <StepBesoin draft={draft} errors={errors} onField={onField} />
          ) : null}

          {step.id === "chantier" ? (
            <StepChantier draft={draft} errors={errors} onField={onField} />
          ) : null}

          {step.id === "photos" ? (
            <StepPhotos
              photos={photos}
              onAdd={addPhotos}
              onRemove={removePhoto}
              rejections={rejections}
            />
          ) : null}

          {step.id === "lieu" ? (
            <StepLieu draft={draft} errors={errors} onField={onField} />
          ) : null}

          {step.id === "coordonnees" ? (
            <StepCoordonnees
              draft={draft}
              errors={errors}
              onField={onField}
              photoCount={photos.length}
              onJump={(index) => goTo(index, false)}
            />
          ) : null}
        </div>
      </div>

      {/*
        Récapitulatif d'erreurs annoncé. Il double les messages posés sous
        chaque champ : ceux-ci restent la source, celui-ci existe pour que le
        clic sur « Continuer » ne soit jamais silencieux.
      */}
      <div aria-live="polite" className="mt-8 empty:mt-0">
        {errorList.length > 0 ? (
          <p className="sr-only">
            {errorList.length === 1
              ? "Une information manque pour continuer."
              : `${errorList.length} informations manquent pour continuer.`}{" "}
            {errorList.join(" ")}
          </p>
        ) : null}
      </div>

      {/* ------------------------------------------------------ Navigation --- */}
      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-(--surface-rule) pt-8 sm:flex-row sm:items-center sm:justify-between">
        {stepIndex > 0 ? (
          <Button
            variant="outline"
            onClick={() => goTo(stepIndex - 1, false)}
            className="sm:w-auto"
            block
          >
            Retour
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {/*
          `aria-disabled` et non `disabled` : un bouton réellement désactivé
          sort du parcours de tabulation et, surtout, ne peut plus rien
          expliquer. Ici il paraît inactif, reste atteignable, et le clic
          affiche ce qui manque. C'est la seule façon de tenir ensemble
          « Continuer désactivé si informations manquantes » et « l'erreur doit
          être découvrable ».
        */}
        {/*
          La VARIANTE change, pas l'opacité. Un bouton translucide paraît raté,
          pas indisponible — et `cn()` ne fusionnant pas les classes, forcer un
          fond par-dessus `variantClasses.primary` aurait laissé les deux en
          place. Basculer la variante donne deux états francs, et le bouton
          « s'allume » quand l'étape est complète : la récompense arrive au
          moment où l'information est réunie.
        */}
        <Button
          variant={complete ? "primary" : "outline"}
          size="lg"
          onClick={handleContinue}
          aria-disabled={!complete}
          className="sm:w-auto"
          block
        >
          {isLast ? "Envoyer ma demande" : "Continuer"}
        </Button>
        </div>

        {stepIndex === 0 ? (
          <p className="mt-6 text-center font-sans text-caption text-(--surface-fg-muted)">
            Environ {ESTIMATED_MINUTES} minutes. Gratuit et sans engagement.
          </p>
        ) : null}
      </div>
    </div>
  );
}
