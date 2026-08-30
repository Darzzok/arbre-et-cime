import Link from "next/link";

import { cn } from "@/lib/cn";
import { area, site } from "@/lib/site";

type WordmarkProps = {
  className?: string;
  /** `lg` est reserve au pied de page et au menu mobile. */
  size?: "sm" | "md" | "lg";
};

const nameClasses: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "text-[1.25rem]",
  md: "text-subtitle",
  lg: "text-title",
};

/**
 * Logotype typographique TEMPORAIRE.
 *
 * Aucun symbole ni faux logo n'est inventé : tant qu'un logo réel n'est pas
 * fourni, l'identité repose entièrement sur la typographie de la charte.
 *
 * Composition :
 *   Arbre & Cime          Fraunces, esperluette en italique
 *   ÉLAGAGE · ROUEN       Manrope, surtitre interlettré
 *
 * L'esperluette et l'ancrage géographique font le travail d'un logotype :
 * ils donnent une signature reconnaissable et disent le métier et le lieu,
 * ce qui sert aussi le référencement local.
 *
 * À remplacer par le logo réel dès réception (cf. PROJECT.md, points ouverts).
 */
export function Wordmark({ className, size = "md" }: WordmarkProps) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — retour à l’accueil`}
      className={cn(
        "group inline-flex flex-col justify-center gap-1 no-underline",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "font-display leading-none whitespace-nowrap",
          "tracking-tight text-(--surface-heading)",
          nameClasses[size],
        )}
      >
        Arbre{" "}
        <span className="italic text-(--surface-fg-muted)">&amp;</span> Cime
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "font-sans text-eyebrow font-semibold uppercase whitespace-nowrap",
          "text-(--surface-fg-muted)",
        )}
      >
        Élagage
        <span className="mx-1.5 text-(--color-safety)">·</span>
        {area.city}
      </span>
    </Link>
  );
}
