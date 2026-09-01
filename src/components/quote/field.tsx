import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

/**
 * Champ de saisie et groupe de choix — la mécanique d'erreur du configurateur.
 *
 * Le message d'erreur est **sous le champ**, relié par `aria-describedby`, et
 * le champ porte `aria-invalid`. Pas de toast, pas de bandeau rouge global :
 * une erreur doit être lisible à l'endroit où elle se corrige.
 *
 * Le rouge n'existe pas dans la charte, et il n'est pas introduit ici. Une
 * erreur se signale par un **filet épaissi en jaune sécurité**, un pictogramme
 * et un texte explicite — trois signaux dont aucun n'est chromatique seul
 * (`CLAUDE.md` § 5). C'est aussi ce que demande le brief : « pas d'erreur rouge
 * agressive partout ».
 */

const controlBase =
  "w-full rounded-edge border bg-(--surface-bg) px-4 py-3 " +
  "font-sans text-body text-(--surface-fg) " +
  "placeholder:text-(--surface-fg-muted)/70 " +
  "motion-safe:transition-colors motion-safe:duration-(--duration-micro) " +
  "motion-safe:ease-cime";

/** 48 px : cible tactile confortable, et hauteur cohérente avec `Button`. */
const controlSize = "min-h-12";

function stateClasses(invalid: boolean): string {
  return invalid
    ? "border-2 border-safety"
    : "border-(--surface-rule) hover:border-(--surface-fg-muted) focus:border-(--surface-fg-muted)";
}

/* ----------------------------------------------------------- Message --- */

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-sans text-caption font-semibold text-(--surface-fg)"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="mt-0.5 size-4 shrink-0 text-(--color-safety)"
      >
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 4.5v4.2M8 11.2v.1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <span>{message}</span>
    </p>
  );
}

/* ------------------------------------------------------------- Champ --- */

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;

export function Field({
  id,
  label,
  hint,
  error,
  optional = false,
  ...rest
}: FieldProps) {
  const errorId = `${id}-erreur`;
  const hintId = `${id}-aide`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="text-left">
      <label
        htmlFor={id}
        className="block font-sans text-caption font-semibold uppercase tracking-[0.12em] text-(--surface-fg-muted)"
      >
        {label}
        {optional ? (
          <span className="ml-1.5 font-normal normal-case tracking-normal">
            (facultatif)
          </span>
        ) : null}
      </label>

      {hint ? (
        <p
          id={hintId}
          className="mt-1.5 font-sans text-caption text-(--surface-fg-muted)"
        >
          {hint}
        </p>
      ) : null}

      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn("mt-2", controlBase, controlSize, stateClasses(Boolean(error)))}
        {...rest}
      />

      <FieldError id={errorId} message={error} />
    </div>
  );
}

/* ----------------------------------------------------------- Zone de texte --- */

type TextareaFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">;

export function TextareaField({
  id,
  label,
  hint,
  error,
  optional = false,
  ...rest
}: TextareaFieldProps) {
  const errorId = `${id}-erreur`;
  const hintId = `${id}-aide`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="text-left">
      <label
        htmlFor={id}
        className="block font-sans text-caption font-semibold uppercase tracking-[0.12em] text-(--surface-fg-muted)"
      >
        {label}
        {optional ? (
          <span className="ml-1.5 font-normal normal-case tracking-normal">
            (facultatif)
          </span>
        ) : null}
      </label>

      {hint ? (
        <p
          id={hintId}
          className="mt-1.5 font-sans text-caption text-(--surface-fg-muted)"
        >
          {hint}
        </p>
      ) : null}

      <textarea
        id={id}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn("mt-2 resize-y", controlBase, stateClasses(Boolean(error)))}
        {...rest}
      />

      <FieldError id={errorId} message={error} />
    </div>
  );
}

/* --------------------------------------------------------- Groupe de choix --- */

type ChoiceGroupProps = {
  id: string;
  legend: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

/**
 * `fieldset` + `legend` réels autour d'un groupe de choix.
 *
 * C'est la seule structure qui fasse annoncer « De quelle intervention avez-vous
 * besoin ? — case d'option 2 sur 5 » par un lecteur d'écran. Un titre visuel
 * suivi d'une liste de radios ne le fait pas (`QUOTE_FLOW.md` § 4).
 */
export function ChoiceGroup({
  id,
  legend,
  hint,
  error,
  children,
}: ChoiceGroupProps) {
  const errorId = `${id}-erreur`;
  const hintId = `${id}-aide`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <fieldset className="text-left" aria-describedby={describedBy}>
      <legend className="font-sans text-caption font-semibold uppercase tracking-[0.12em] text-(--surface-fg-muted)">
        {legend}
      </legend>

      {hint ? (
        <p
          id={hintId}
          className="mt-1.5 font-sans text-caption text-(--surface-fg-muted)"
        >
          {hint}
        </p>
      ) : null}

      <div className="mt-3">{children}</div>

      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

export { controlBase, controlSize, stateClasses };
