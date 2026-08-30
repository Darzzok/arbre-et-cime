import Link from "next/link";

import { cn } from "@/lib/cn";
import { ctaRouteId, getRoute } from "@/lib/routes";

const cta = getRoute(ctaRouteId);

type NavCtaProps = {
  /** `bar` pour l'en-tete, `row` pour la ligne pleine largeur du menu mobile. */
  layout?: "bar" | "row";
  className?: string;
};

/**
 * CTA éditorial de la navigation.
 *
 * Il remplace l'aplat jaune plein : sur un en-tête posé au-dessus d'une
 * photographie, un gros rectangle saturé écrase l'image et fait « bandeau
 * marketing ». Ici le jaune sécurité n'apparaît que par touches — un filet de
 * 2 px qui se trace sous le libellé, et la flèche — pendant que le libellé
 * reste dans la couleur de la surface. La charte est respectée à la lettre :
 * l'accent reste rare et ne devient jamais une grande surface.
 *
 * Réservé à la navigation. Le CTA plein (`Button variant="primary"`) reste la
 * référence dans le corps des pages, où il doit dominer.
 */
export function NavCta({ layout = "bar", className }: NavCtaProps) {
  return (
    <Link
      href={cta.path}
      className={cn(
        "group inline-flex items-center gap-3 no-underline",
        layout === "bar"
          ? "min-h-11"
          : "min-h-16 w-full justify-between border-y border-(--surface-rule)",
        className,
      )}
    >
      <span className="relative">
        <span
          className={cn(
            "font-sans font-semibold tracking-tight text-(--surface-fg)",
            layout === "bar" ? "text-body" : "text-subtitle",
          )}
        >
          Demander un devis
        </span>

        {/* Rail permanent : le lien reste identifiable sans survol. */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-0 h-px w-full bg-(--surface-rule)"
        />

        {/*
         * Accent jaune sécurité — niveau Micro, tracé depuis la gauche.
         *
         * Dans le menu mobile (`row`) il est PERMANENT : un écran tactile n'a
         * pas de survol, un accent qui n'apparaît qu'au hover n'y existerait
         * tout simplement jamais.
         */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute -bottom-1.5 left-0 h-0.5 w-full origin-left bg-safety",
            "motion-safe:transition-transform",
            "motion-safe:duration-(--duration-micro) motion-safe:ease-line",
            layout === "row"
              ? "scale-x-100"
              : cn(
                  "scale-x-0",
                  "group-hover:scale-x-100 group-focus-visible:scale-x-100",
                ),
          )}
        />
      </span>

      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className={cn(
          "size-4 shrink-0 text-safety",
          "motion-safe:transition-transform motion-safe:duration-(--duration-micro)",
          "motion-safe:ease-cime",
          "motion-safe:group-hover:translate-x-1",
          "motion-safe:group-focus-visible:translate-x-1",
        )}
      >
        <path
          d="M2 8h11M9 4l4 4-4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </svg>
    </Link>
  );
}
