"use client";

import { ChoiceCard } from "@/components/quote/choice-card";
import { ChoiceChip } from "@/components/quote/choice-chip";
import { ChoiceGroup, Field, TextareaField } from "@/components/quote/field";
import { PhotoPicker, type QuotePhoto } from "@/components/quote/photo-picker";
import { QuoteSummary } from "@/components/quote/quote-summary";
import { TextLink } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  CONSTRAINT_EXCLUSIVE,
  CONSTRAINT_OPTIONS,
  HEIGHT_OPTIONS,
  NEED_OPTIONS,
  type QuoteDraft,
  type QuoteErrors,
  countOptionsFor,
  countQuestionFor,
  needsHeight,
  zoneNoteFor,
} from "@/lib/quote-flow";
import { getRoute } from "@/lib/routes";
import { area, site } from "@/lib/site";

/**
 * Le corps de chacune des cinq étapes.
 *
 * Regroupées dans un seul fichier à dessein : elles partagent exactement le
 * même contrat (`draft`, `errors`, `onField`) et se lisent bien les unes à la
 * suite des autres. Les éclater en cinq fichiers de trente lignes rendrait le
 * parcours plus difficile à suivre, pas plus modulaire.
 */

type StepProps = {
  draft: QuoteDraft;
  errors: QuoteErrors;
  onField: <K extends keyof QuoteDraft>(field: K, value: QuoteDraft[K]) => void;
};

const CARD_SIZES = "(min-width: 48rem) 22rem, (min-width: 30rem) 45vw, 92vw";

/* ------------------------------------------------------- 1 — Besoin --- */

export function StepBesoin({ draft, errors, onField }: StepProps) {
  return (
    <ChoiceGroup id="besoin" legend="Type d’intervention" error={errors.besoin}>
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {NEED_OPTIONS.map((option, index) => {
          // « Je ne sais pas encore » occupe la rangée entière : c'est une
          // réponse d'un autre ordre que les quatre prestations, et la placer
          // dans la grille comme une cinquième carte laisserait un trou.
          const wide = option.id === "je-ne-sais-pas";

          return (
            <li key={option.id} className={cn(wide && "sm:col-span-2")}>
              <ChoiceCard
                index={index}
                name="besoin"
                value={option.id}
                checked={draft.besoin === option.id}
                onChange={(value) => onField("besoin", value)}
                label={option.label}
                description={option.description}
                image={option.image}
                alt={option.alt}
                position={option.position}
                sizes={CARD_SIZES}
                compact={wide}
                describedBy={errors.besoin ? "besoin-erreur" : undefined}
              />
            </li>
          );
        })}
      </ul>
    </ChoiceGroup>
  );
}

/* ----------------------------------------------------- 2 — Chantier --- */

const chipRow = "flex flex-wrap gap-2.5";

export function StepChantier({ draft, errors, onField }: StepProps) {
  const countOptions = countOptionsFor(draft.besoin);

  function toggleConstraint(value: string) {
    const current = draft.contraintes;

    // « Aucune de ces situations » est exclusive dans les deux sens : la
    // cocher vide le reste, cocher autre chose la retire. Sans cette règle on
    // laisse le visiteur produire une réponse contradictoire.
    if (value === CONSTRAINT_EXCLUSIVE) {
      onField("contraintes", current.includes(value) ? [] : [value]);
      return;
    }

    const next = current.includes(value)
      ? current.filter((id) => id !== value)
      : [...current.filter((id) => id !== CONSTRAINT_EXCLUSIVE), value];

    onField("contraintes", next);
  }

  return (
    <div className="space-y-8">
      <ChoiceGroup
        id="nombre"
        legend={countQuestionFor(draft.besoin)}
        error={errors.nombre}
      >
        <div className={chipRow}>
          {countOptions.map((option, index) => (
            <ChoiceChip
              key={option.id}
              index={index}
              type="radio"
              name="nombre"
              value={option.id}
              checked={draft.nombre === option.id}
              onChange={(value) => onField("nombre", value)}
              label={option.label}
              describedBy={errors.nombre ? "nombre-erreur" : undefined}
            />
          ))}
        </div>
      </ChoiceGroup>

      {/* Question posée seulement quand elle a un sens : une souche n'a pas de
          hauteur. Voir `needsHeight` dans quote-flow.ts. */}
      {needsHeight(draft.besoin) ? (
        <ChoiceGroup
          id="hauteur"
          legend="Quelle hauteur approximative ?"
          hint="Une estimation suffit — comparez à une maison : un étage ≈ 3 m."
          error={errors.hauteur}
        >
          <div className={chipRow}>
            {HEIGHT_OPTIONS.map((option, index) => (
              <ChoiceChip
                key={option.id}
                index={index}
                type="radio"
                name="hauteur"
                value={option.id}
                checked={draft.hauteur === option.id}
                onChange={(value) => onField("hauteur", value)}
                label={option.label}
                describedBy={errors.hauteur ? "hauteur-erreur" : undefined}
              />
            ))}
          </div>
        </ChoiceGroup>
      ) : null}

      <ChoiceGroup
        id="contraintes"
        legend="Y a-t-il des contraintes sur place ?"
        hint="Plusieurs réponses possibles. C’est ce qui fait le plus varier un devis."
        error={errors.contraintes}
      >
        <div className={chipRow}>
          {CONSTRAINT_OPTIONS.map((option, index) => (
            <ChoiceChip
              key={option.id}
              index={index}
              type="checkbox"
              name="contraintes"
              value={option.id}
              checked={draft.contraintes.includes(option.id)}
              onChange={toggleConstraint}
              label={option.label}
              describedBy={errors.contraintes ? "contraintes-erreur" : undefined}
            />
          ))}
        </div>
      </ChoiceGroup>
    </div>
  );
}

/* ------------------------------------------------------- 3 — Photos --- */

type StepPhotosProps = {
  photos: readonly QuotePhoto[];
  onAdd: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  rejections: readonly string[];
};

export function StepPhotos(props: StepPhotosProps) {
  return (
    <div className="space-y-5">
      <PhotoPicker {...props} />

      <p className="font-sans text-caption text-(--surface-fg-muted)">
        Cette étape est facultative — vous pouvez la passer. Une photo du pied
        de l’arbre et une vue d’ensemble permettent souvent un devis sans visite
        préalable.
      </p>
    </div>
  );
}

/* --------------------------------------------------------- 4 — Lieu --- */

export function StepLieu({ draft, errors, onField }: StepProps) {
  const note = zoneNoteFor(draft.codePostal);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-[9rem_1fr]">
        <Field
          id="code-postal"
          label="Code postal"
          value={draft.codePostal}
          error={errors.codePostal}
          onChange={(event) =>
            // Le clavier numérique d'iOS laisse passer d'autres caractères :
            // on filtre à la saisie plutôt que de refuser à la validation.
            onField("codePostal", event.target.value.replace(/\D/g, "").slice(0, 5))
          }
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="76000"
        />

        <Field
          id="ville"
          label="Commune"
          value={draft.ville}
          error={errors.ville}
          onChange={(event) => onField("ville", event.target.value)}
          autoComplete="address-level2"
          placeholder={area.city}
        />
      </div>

      <Field
        id="adresse"
        label="Adresse"
        optional
        hint="Utile seulement si vous souhaitez une visite. Sinon, à la prise de rendez-vous."
        value={draft.adresse}
        onChange={(event) => onField("adresse", event.target.value)}
        autoComplete="street-address"
      />

      {/* Retour de zone : jamais bloquant, jamais une promesse de couverture. */}
      <div aria-live="polite" className="empty:hidden">
        {note ? (
          <p className="rounded-card border border-(--surface-rule) bg-(--surface-inset) p-4 text-left font-sans text-caption text-(--surface-fg)">
            {note}
          </p>
        ) : null}
      </div>

      <p className="text-left font-sans text-caption text-(--surface-fg-muted)">
        {site.shortName} intervient principalement dans la {area.metro} et peut
        se déplacer jusqu’à {area.maxRadiusKm} km selon le chantier.
      </p>
    </div>
  );
}

/* -------------------------------------------------- 5 — Coordonnées --- */

type StepCoordonneesProps = StepProps & {
  photoCount: number;
  onJump: (index: number) => void;
};

export function StepCoordonnees({
  draft,
  errors,
  onField,
  photoCount,
  onJump,
}: StepCoordonneesProps) {
  const politique = getRoute("politique-confidentialite");

  return (
    <div className="space-y-8">
      <QuoteSummary draft={draft} photoCount={photoCount} onJump={onJump} />

      <div className="space-y-6">
        <Field
          id="nom"
          label="Nom"
          value={draft.nom}
          error={errors.nom}
          onChange={(event) => onField("nom", event.target.value)}
          autoComplete="name"
        />

        <Field
          id="telephone"
          label="Téléphone"
          type="tel"
          hint="Le rappel est le moyen le plus rapide d’obtenir un chiffrage."
          value={draft.telephone}
          error={errors.telephone}
          onChange={(event) => onField("telephone", event.target.value)}
          inputMode="tel"
          autoComplete="tel"
          placeholder="06 12 34 56 78"
        />

        <Field
          id="email"
          label="E-mail"
          type="email"
          value={draft.email}
          error={errors.email}
          onChange={(event) => onField("email", event.target.value)}
          inputMode="email"
          autoComplete="email"
          placeholder="prenom.nom@exemple.fr"
        />

        <TextareaField
          id="commentaire"
          label="Précisions"
          optional
          hint="Un délai souhaité, un accès particulier, tout ce qui nous aiderait."
          value={draft.commentaire}
          onChange={(event) => onField("commentaire", event.target.value)}
        />
      </div>

      {/* Consentement : case réelle, visible, jamais pré-cochée. */}
      <div className="text-left">
        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-edge",
            "has-[:focus-visible]:outline has-[:focus-visible]:outline-2",
            "has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--focus-ring)",
          )}
        >
          <input
            type="checkbox"
            checked={draft.consentement}
            onChange={(event) => onField("consentement", event.target.checked)}
            aria-invalid={errors.consentement ? true : undefined}
            aria-describedby={
              errors.consentement ? "consentement-erreur" : undefined
            }
            className="sr-only"
          />

          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-edge border",
              "motion-safe:transition-colors motion-safe:duration-(--duration-micro)",
              draft.consentement
                ? "border-safety bg-safety text-charcoal"
                : errors.consentement
                  ? "border-2 border-safety text-transparent"
                  : "border-(--surface-rule) text-transparent",
            )}
          >
            <svg viewBox="0 0 16 16" className="size-3.5">
              <path
                d="M3.5 8.5l3 3 6-6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span className="font-sans text-caption leading-relaxed text-(--surface-fg)">
            J’accepte que mes informations soient utilisées pour établir ce
            devis et me recontacter. Elles ne sont transmises à personne
            d’autre.{" "}
            <TextLink href={politique.path}>
              Politique de confidentialité
            </TextLink>
          </span>
        </label>

        {errors.consentement ? (
          <p
            id="consentement-erreur"
            className="mt-2 font-sans text-caption font-semibold text-(--surface-fg)"
          >
            {errors.consentement}
          </p>
        ) : null}
      </div>
    </div>
  );
}
