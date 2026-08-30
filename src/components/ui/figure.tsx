import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Rapports de cadrage autorises.
 * `portrait` est le format de reference sur mobile : c'est lui qui sert le
 * plein ecran a 390 px sans recadrage destructeur.
 */
export type FigureAspect = "portrait" | "landscape" | "wide" | "square" | "free";

const aspectClasses: Record<FigureAspect, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  wide: "aspect-[16/9]",
  square: "aspect-square",
  free: "",
};

type FigureProps = {
  aspect?: FigureAspect;
  /**
   * Legende visible. Sur les realisations elle porte l'information factuelle
   * (commune, prestation, contrainte) : elle est preferable a un `alt` long,
   * car elle profite a tous les visiteurs.
   */
  caption?: ReactNode;
  className?: string;
  /** L'image elle-meme — toujours un `next/image` en production. */
  children: ReactNode;
};

/**
 * Cadre media : verrouille le rapport de cadrage AVANT le chargement de
 * l'image, ce qui supprime tout decalage de mise en page (CLS).
 *
 * Rappel charte VERROUILLEE : uniquement de vraies photographies. Aucune image
 * generee ne represente l'activite, les chantiers, le materiel ou les
 * personnes.
 */
export function Figure({
  aspect = "landscape",
  caption,
  className,
  children,
}: FigureProps) {
  return (
    <figure className={cn("m-0", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-edge bg-(--surface-inset)",
          "[&>img]:size-full [&>img]:object-cover",
          aspectClasses[aspect],
        )}
      >
        {children}
      </div>
      {caption ? (
        <figcaption
          className={cn(
            "mt-3 font-sans text-caption text-(--surface-fg-muted) text-pretty",
          )}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
