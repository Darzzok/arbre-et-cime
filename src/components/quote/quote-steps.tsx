"use client";

import { ChoiceCard } from "@/components/quote/choice-card";
import { ChoiceChip } from "@/components/quote/choice-chip";
import { ChoiceGroup, Field, TextareaField } from "@/components/quote/field";
import { PhotoPicker } from "@/components/quote/photo-picker";
import { QuoteSummary } from "@/components/quote/quote-summary";
import type { useQuoteState } from "@/components/quote/use-quote-state";
import { TextLink } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  CONSTRAINT_OPTIONS,
  COUNT_OPTIONS,
  HEIGHT_OPTIONS,
  NEED_OPTIONS,
  OUTDOOR_SCALE_OPTIONS,
  OUTDOOR_WORK_OPTIONS,
  STUMP_SIZE_OPTIONS,
  countQuestionFor,
} from "@/lib/quote";
import { getRoute } from "@/lib/routes";
import { area, site } from "@/lib/site";

/**
 * Le corps de chacune des cinq étapes.
 *
 * Chaque étape reçoit l'objet d'état complet plutôt qu'une dizaine de props :
 * elles en consomment des parties différentes, et la liste dériverait à chaque
 * évolution du modèle. Le typage reste strict — `ReturnType<typeof
 * useQuoteState>` suit automatiquement le hook.
 */

type State = ReturnType<typeof useQuoteState>;

const CARD_SIZES = "(min-width: 48rem) 22rem, (min-width: 30rem) 45vw, 92vw";
const chipRow = "flex flex-wrap gap-2.5";

/* ------------------------------------------------------- 1 — Besoin --- */

export function StepBesoin({ state }: { state: State }) {
  const { draft, errors, setNeed } = state;

  return (
    <ChoiceGroup id="besoin" legend="Type d’intervention" error={errors.besoin}>
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {NEED_OPTIONS.map((option, index) => {
          // « Je ne sais pas encore » occupe la rangée entière : c'est une
          // réponse d'un autre ordre que les quatre prestations, et la placer
          // comme une cinquième carte laisserait un trou dans la grille.
          const wide = option.id === "inconnu";

          return (
            <li key={option.id} className={cn(wide && "sm:col-span-2")}>
              <ChoiceCard
                index={index}
                name="besoin"
                value={option.id}
                checked={draft.besoin === option.id}
                onChange={() => setNeed(option.id)}
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

/**
 * L'étape 2 change de questions selon le besoin — et c'est la seule étape qui
 * le fasse.
 *
 * Les quatre variantes lisent la même union discriminée que la validation :
 * une question affichée est toujours une question validée, et réciproquement.
 * C'est ce qui empêche le bouton « Continuer » de rester bloqué sur un champ
 * que personne ne voit.
 */
export function StepChantier({ state }: { state: State }) {
  const { draft, errors } = state;
  const chantier = draft.chantier;

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------ Arbre / souche --- */}
      {(chantier.kind === "arbre" || chantier.kind === "souche") && (
        <ChoiceGroup
          id="nombre"
          legend={countQuestionFor(chantier.kind)}
          error={errors.nombre}
        >
          <div className={chipRow}>
            {COUNT_OPTIONS.map((option, index) => (
              <ChoiceChip
                key={option.id}
                index={index}
                type="radio"
                name="nombre"
                value={option.id}
                checked={chantier.nombre === option.id}
                onChange={() => state.setCount(option.id)}
                label={option.label}
                describedBy={errors.nombre ? "nombre-erreur" : undefined}
              />
            ))}
          </div>
        </ChoiceGroup>
      )}

      {chantier.kind === "arbre" && (
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
                checked={chantier.hauteur === option.id}
                onChange={() => state.setHeight(option.id)}
                label={option.label}
                describedBy={errors.hauteur ? "hauteur-erreur" : undefined}
              />
            ))}
          </div>
        </ChoiceGroup>
      )}

      {/* Souche : une taille, décrite par des repères visuels. Jamais un
          diamètre en centimètres — personne ne mesure une souche. */}
      {chantier.kind === "souche" && (
        <ChoiceGroup
          id="taille"
          legend="Quelle taille fait la souche ?"
          hint="Au plus large. S’il y en a plusieurs, prenez la plus grosse."
          error={errors.taille}
        >
          <div className={chipRow}>
            {STUMP_SIZE_OPTIONS.map((option, index) => (
              <ChoiceChip
                key={option.id}
                index={index}
                type="radio"
                name="taille"
                value={option.id}
                checked={chantier.taille === option.id}
                onChange={() => state.setStumpSize(option.id)}
                label={option.label}
                describedBy={errors.taille ? "taille-erreur" : undefined}
              />
            ))}
          </div>
        </ChoiceGroup>
      )}

      {/* ---------------------------------------------------- Extérieur --- */}
      {chantier.kind === "exterieur" && (
        <>
          <ChoiceGroup
            id="travaux"
            legend="Quels travaux ?"
            hint="Plusieurs réponses possibles."
            error={errors.travaux}
          >
            <div className={chipRow}>
              {OUTDOOR_WORK_OPTIONS.map((option, index) => (
                <ChoiceChip
                  key={option.id}
                  index={index}
                  type="checkbox"
                  name="travaux"
                  value={option.id}
                  checked={chantier.travaux.includes(option.id)}
                  onChange={() => state.toggleWork(option.id)}
                  label={option.label}
                  describedBy={errors.travaux ? "travaux-erreur" : undefined}
                />
              ))}
            </div>
          </ChoiceGroup>

          <ChoiceGroup
            id="ampleur"
            legend="Quelle ampleur ?"
            error={errors.ampleur}
          >
            <div className={chipRow}>
              {OUTDOOR_SCALE_OPTIONS.map((option, index) => (
                <ChoiceChip
                  key={option.id}
                  index={index}
                  type="radio"
                  name="ampleur"
                  value={option.id}
                  checked={chantier.ampleur === option.id}
                  onChange={() => state.setScale(option.id)}
                  label={option.label}
                  describedBy={errors.ampleur ? "ampleur-erreur" : undefined}
                />
              ))}
            </div>
          </ChoiceGroup>
        </>
      )}

      {/* ------------------------------------------------------ Inconnu --- */}
      {chantier.kind === "inconnu" && (
        <>
          <TextareaField
            id="description"
            label="Décrivez la situation"
            optional
            hint="En quelques mots, avec vos mots. Nous identifierons l’intervention."
            value={chantier.description}
            onChange={(event) => state.setDescription(event.target.value)}
          />

          <p className="text-left font-sans text-caption text-(--surface-fg-muted)">
            Aucune question technique ici : nous ferons le point ensemble au
            téléphone.
          </p>
        </>
      )}

      {/* Contraintes : posées pour toutes les prestations sauf « je ne sais
          pas ». Un accès difficile conditionne le chiffrage quel que soit le
          travail. */}
      {chantier.kind !== "inconnu" && (
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
                checked={chantier.contraintes.includes(option.id)}
                onChange={() => state.toggleConstraint(option.id)}
                label={option.label}
                describedBy={
                  errors.contraintes ? "contraintes-erreur" : undefined
                }
              />
            ))}
          </div>
        </ChoiceGroup>
      )}
    </div>
  );
}

/* ------------------------------------------------------- 3 — Photos --- */

export function StepPhotos({ state }: { state: State }) {
  return (
    <div className="space-y-5">
      <PhotoPicker
        photos={state.photos}
        onAdd={state.addPhotos}
        onRemove={state.removePhoto}
        rejections={state.rejections}
        accept={state.accept}
      />

      <p className="font-sans text-caption text-(--surface-fg-muted)">
        Cette étape est facultative — vous pouvez la passer. Une photo du pied
        de l’arbre et une vue d’ensemble permettent souvent un devis sans visite
        préalable.
      </p>
    </div>
  );
}

/* --------------------------------------------------------- 4 — Lieu --- */

export function StepLieu({ state }: { state: State }) {
  const { draft, errors, setLieu } = state;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-[9rem_1fr]">
        <Field
          id="code-postal"
          label="Code postal"
          value={draft.lieu.codePostal}
          error={errors.codePostal}
          onChange={(event) =>
            // Le clavier numérique d'iOS laisse passer d'autres caractères :
            // on filtre à la saisie plutôt que de refuser à la validation.
            setLieu("codePostal", event.target.value.replace(/\D/g, "").slice(0, 5))
          }
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="76000"
        />

        <Field
          id="ville"
          label="Commune"
          value={draft.lieu.ville}
          error={errors.ville}
          onChange={(event) => setLieu("ville", event.target.value)}
          autoComplete="address-level2"
          placeholder={area.city}
        />
      </div>

      <Field
        id="adresse"
        label="Adresse"
        optional
        hint="Utile seulement si vous souhaitez une visite. Sinon, à la prise de rendez-vous."
        value={draft.lieu.adresse}
        onChange={(event) => setLieu("adresse", event.target.value)}
        autoComplete="street-address"
      />

      {/*
        AUCUNE DÉDUCTION DE ZONE À PARTIR DU CODE POSTAL.
        Une version précédente affichait « ce secteur est dans le rayon » en
        lisant les deux premiers chiffres. C'était une approximation présentée
        comme un fait : un département n'est ni un rayon, ni une zone
        desservie. Le message est désormais le même pour tout le monde, et il
        est vrai.
      */}
      <p className="rounded-card border border-(--surface-rule) bg-(--surface-inset) p-4 text-left font-sans text-caption text-(--surface-fg)">
        La zone exacte sera confirmée lors de l’étude de votre demande.
      </p>

      <p className="text-left font-sans text-caption text-(--surface-fg-muted)">
        {site.shortName} intervient principalement dans la {area.metro} et se
        déplace jusqu’à {area.maxRadiusKm} km selon le chantier.
      </p>
    </div>
  );
}

/* -------------------------------------------------- 5 — Coordonnées --- */

export function StepCoordonnees({ state }: { state: State }) {
  const { draft, errors, setContact } = state;
  const politique = getRoute("politique-confidentialite");

  return (
    <div className="space-y-8">
      <QuoteSummary
        draft={draft}
        photoCount={state.photos.length}
        onJump={(index) => state.goTo(index, false)}
      />

      <div className="space-y-6">
        <Field
          id="nom"
          label="Nom"
          value={draft.contact.nom}
          error={errors.nom}
          onChange={(event) => setContact("nom", event.target.value)}
          autoComplete="name"
        />

        <Field
          id="telephone"
          label="Téléphone"
          type="tel"
          hint="Le rappel est le moyen le plus rapide d’obtenir un chiffrage."
          value={draft.contact.telephone}
          error={errors.telephone}
          onChange={(event) => setContact("telephone", event.target.value)}
          inputMode="tel"
          autoComplete="tel"
          placeholder="06 12 34 56 78"
        />

        <Field
          id="email"
          label="E-mail"
          type="email"
          value={draft.contact.email}
          error={errors.email}
          onChange={(event) => setContact("email", event.target.value)}
          inputMode="email"
          autoComplete="email"
          placeholder="prenom.nom@exemple.fr"
        />

        <TextareaField
          id="commentaire"
          label="Précisions"
          optional
          hint="Un délai souhaité, un accès particulier, tout ce qui nous aiderait."
          value={draft.contact.commentaire}
          onChange={(event) => setContact("commentaire", event.target.value)}
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
            checked={draft.contact.consentement}
            onChange={(event) =>
              setContact("consentement", event.target.checked)
            }
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
              draft.contact.consentement
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
