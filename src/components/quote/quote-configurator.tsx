"use client";

import { QuoteRecap, QuoteSending } from "@/components/quote/quote-outcome";
import { QuoteProgress } from "@/components/quote/quote-progress";
import {
  StepBesoin,
  StepChantier,
  StepCoordonnees,
  StepLieu,
  StepPhotos,
} from "@/components/quote/quote-steps";
import { useQuoteState } from "@/components/quote/use-quote-state";
import { useEffect, useRef } from "react";
import { Body, Button } from "@/components/ui";
import { ESTIMATED_MINUTES } from "@/lib/quote";
import { getRoute } from "@/lib/routes";

/**
 * Configurateur de devis — 5 étapes VERROUILLÉES.
 *
 * Ce composant ne fait plus que **rendre**. Toute la logique — état,
 * validation, conditionnel, photos, persistance, historique, mesure — vit dans
 * `useQuoteState`, et les règles métier pures dans `src/lib/quote/`. C'est ce
 * que demandait le brief de phase 12 : éviter un composant qui contient tout.
 *
 * SEUL composant client de la page. `/devis` reste un composant serveur :
 * métadonnées, `h1` et cadre éditorial ne coûtent rien au navigateur.
 *
 * PHASE 12 — TOUJOURS AUCUN ENVOI
 * --------------------------------
 * Le point de branchement de la phase 13 est unique : le bloc final de
 * `submit()` dans `use-quote-state.ts`. Rien à changer ici.
 */

const devis = getRoute("devis");

export function QuoteConfigurator() {
  const state = useQuoteState(devis.path);

  /*
   * Le focus est géré ICI et non dans le hook.
   *
   * Un `RefObject` placé dans l'objet d'état traverserait le rendu jusqu'aux
   * composants d'étape, ce que `react-hooks/refs` interdit : la valeur d'un
   * ref n'est pas stable et ne doit pas influencer un rendu. Déplacer le focus
   * ici est de toute façon plus juste — c'est une préoccupation de vue, pas de
   * logique métier.
   *
   * Le focus se pose sur le titre à chaque changement d'étape
   * (`QUOTE_FLOW.md` § 4), mais **jamais au premier rendu**, où il volerait la
   * position de lecture de la page.
   */
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [state.stepIndex, state.status]);
  const {
    step,
    stepIndex,
    furthest,
    direction,
    errors,
    complete,
    isLast,
    status,
    photos,
    droppedPhotos,
  } = state;

  if (status === "sending") {
    return <QuoteSending photoCount={photos.length} />;
  }

  if (status === "ready") {
    return (
      <QuoteRecap
        draft={state.draft}
        photos={photos}
        onEdit={state.editFromRecap}
        onRestart={state.restart}
      />
    );
  }

  const errorList = Object.values(errors).filter(Boolean);

  return (
    /*
      Un panneau fermé, en deux zones franches : un bandeau forêt qui porte
      « où j'en suis », un corps ivoire qui porte « ce que je dois faire ».
      Voir `DESIGN_SYSTEM.md` § 8 ter.
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
          onJump={(index) => state.goTo(index, false)}
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
        {/*
          Les fichiers ne survivent pas à un rechargement — et ne doivent pas
          survivre. Le dire est plus honnête que de laisser croire que les
          photos sont toujours jointes.
        */}
        {droppedPhotos > 0 ? (
          <div className="mb-8 flex flex-col gap-3 rounded-card border border-(--surface-rule) bg-(--surface-inset) p-4 sm:flex-row sm:items-center sm:justify-between">
            {/*
              L'ACCORD SUIVAIT LE PLURIEL EN TOUTE CIRCONSTANCE — relevé en
              recette phase 17. Avec une seule photo, la phrase se lisait
              « mais les 1 photo sont à ajouter de nouveau ». Le déterminant et
              le verbe s'accordent maintenant avec le nombre, comme le « s ».
            */}
            <p className="font-sans text-caption text-(--surface-fg)">
              Vos réponses ont été retrouvées, mais{" "}
              {droppedPhotos > 1
                ? `les ${droppedPhotos} photos sont`
                : "la photo est"}{" "}
              à ajouter de nouveau.
            </p>

            <button
              type="button"
              onClick={state.dismissPhotosNotice}
              className="shrink-0 rounded-edge font-sans text-caption font-semibold text-(--surface-fg-muted) underline underline-offset-4 hover:text-(--surface-fg)"
            >
              J’ai compris
            </button>
          </div>
        ) : null}

        <div key={stepIndex} data-quote-step="" data-direction={direction}>
          {step.id === "besoin" ? <StepBesoin state={state} /> : null}
          {step.id === "chantier" ? <StepChantier state={state} /> : null}
          {step.id === "photos" ? <StepPhotos state={state} /> : null}
          {step.id === "lieu" ? <StepLieu state={state} /> : null}
          {step.id === "coordonnees" ? <StepCoordonnees state={state} /> : null}
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

        {/* ---------------------------------------------- Navigation --- */}
        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-(--surface-rule) pt-8 sm:flex-row sm:items-center sm:justify-between">
          {stepIndex > 0 ? (
            <Button
              variant="outline"
              onClick={() => state.goTo(stepIndex - 1, false)}
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
            sort de la tabulation et ne peut plus rien expliquer. Ici il paraît
            inactif, reste atteignable, et le clic affiche ce qui manque.
            La VARIANTE change, pas l'opacité — un bouton translucide paraît
            raté, pas indisponible.
          */}
          <Button
            variant={complete ? "primary" : "outline"}
            size="lg"
            onClick={state.submit}
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
