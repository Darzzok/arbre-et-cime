import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Carte de sélection de l'étape 1.
 *
 * **Un vrai `input type="radio"` est présent**, en `sr-only`, enveloppé par le
 * `<label>`. Rien n'est simulé : navigation par flèches dans le groupe,
 * annonce « case d'option », `:focus-visible` natif, et le formulaire reste
 * valide sans JavaScript. Le brief demande « pas de radio button visible
 * classique » — visible, pas absent. Masquer le contrôle et le remplacer par
 * un `div` avec `role="radio"` serait la version fragile de la même idée.
 *
 * L'état sélectionné ne repose jamais sur la seule couleur : bordure marquée,
 * voile, ET pastille de validation (`CLAUDE.md` § 5).
 */

type ChoiceCardProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description: string;
  image?: string;
  alt?: string;
  position?: string;
  /** Renseigné pour `next/image` : ces cartes changent de largeur trois fois. */
  sizes: string;
  describedBy?: string;
  /** Carte basse, pour l'option sans photo qui occupe toute une rangée. */
  compact?: boolean;
  /** ADDITIF uniquement (colonne occupée), jamais une propriété déjà posée. */
  className?: string;
  /** Rang dans le groupe — cadence l'apparition en cascade. */
  index?: number;
};

export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  image,
  alt,
  position,
  sizes,
  describedBy,
  compact = false,
  className,
  index = 0,
}: ChoiceCardProps) {
  return (
    <label
      data-quote-card=""
      style={{ "--chip-index": index } as React.CSSProperties}
      className={cn(
        "group relative block cursor-pointer overflow-hidden rounded-card",
        compact ? "h-[9.5rem]" : "h-[13rem] sm:h-[15rem]",
        // L'anneau de focus suit l'input masqué : sans cette règle, la
        // tabulation dans le groupe n'aurait aucun repère visible.
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2",
        "has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--focus-ring)",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        aria-describedby={describedBy}
        className="sr-only"
      />

      {image ? (
        <Image
          src={image}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          className={cn(
            "object-cover",
            position,
            "motion-safe:transition-transform",
            "motion-safe:duration-(--duration-reveal) motion-safe:ease-cime",
            "group-hover:scale-[1.03]",
            checked && "scale-[1.03]",
          )}
        />
      ) : (
        // Pas de photo pour « Je ne sais pas encore » : inventer une image
        // pour une non-réponse serait du remplissage. Aplat forêt, et le
        // contraste de traitement devient lui-même une information.
        <span aria-hidden="true" className="absolute inset-0 bg-forest" />
      )}

      {/* Dégradé de base — garantit la lisibilité du contenu sur la photo. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
          image &&
            "bg-[linear-gradient(to_top,rgba(20,37,30,0.94)_0%,rgba(20,37,30,0.76)_30%,rgba(20,37,30,0.32)_60%,rgba(20,37,30,0.05)_86%)]",
        )}
      />

      {/* Voile de sélection : l'image s'enfonce, elle ne s'éclaircit jamais. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-forest/25",
          "motion-safe:transition-opacity",
          "motion-safe:duration-(--duration-micro) motion-safe:ease-cime",
          checked ? "opacity-100" : "opacity-0 group-hover:opacity-60",
        )}
      />

      {/* Filet d'accent : 2 px quand sélectionné, discret au survol. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-card",
          "motion-safe:transition-colors",
          "motion-safe:duration-(--duration-micro) motion-safe:ease-cime",
          checked
            ? "border-2 border-safety"
            : "border border-transparent group-hover:border-safety/45",
        )}
      />

      {/* Pastille de validation — troisième signal, non chromatique. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-4 top-4 flex size-7 items-center justify-center rounded-full",
          "bg-safety text-charcoal",
          "motion-safe:transition-[opacity,transform]",
          "motion-safe:duration-(--duration-micro) motion-safe:ease-cime",
          checked ? "opacity-100 motion-safe:scale-100" : "opacity-0 motion-safe:scale-75",
        )}
      >
        <svg viewBox="0 0 16 16" className="size-4">
          <path
            d="M3.5 8.5l3 3 6-6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span
        data-surface="dark"
        className="absolute inset-x-0 bottom-0 block p-5 text-center"
      >
        <span className="block font-display text-subtitle leading-tight text-(--surface-heading)">
          {label}
        </span>
        <span className="mx-auto mt-1.5 block max-w-[34ch] font-sans text-caption leading-relaxed text-(--surface-fg-muted)">
          {description}
        </span>
      </span>
    </label>
  );
}
