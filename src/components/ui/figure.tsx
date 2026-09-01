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
   * Voile pose sur l'image. `scrim` assombrit uniformement (texte pose au
   * centre), `gradient` assombrit par le bas (texte ancre en pied).
   *
   * Il est rendu APRES l'image et sans `z-index` : les trois couches peignent
   * dans l'ordre du DOM. Un `-z-10` ferait passer le voile DERRIERE l'image —
   * erreur commise puis corrigee en phase 11.
   */
  overlay?: "none" | "scrim" | "gradient";
  /** Angles francs, pour les figures qui doivent filer bord a bord. */
  flush?: boolean;
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
  overlay = "none",
  flush = false,
  caption,
  className,
  children,
}: FigureProps) {
  return (
    <figure className={cn("m-0", className)}>
      <div
        className={cn(
          // Rayon `card` depuis la phase 15B : les figures suivent la
          // meme forme que les cartes, sinon les deux se contredisent.
          "relative overflow-hidden bg-(--surface-inset)",
          flush ? "rounded-none" : "rounded-card",
          "[&>img]:size-full [&>img]:object-cover",
          aspectClasses[aspect],
        )}
      >
        {children}

        {overlay === "scrim" ? (
          <span aria-hidden="true" className="absolute inset-0 bg-forest/55" />
        ) : null}

        {overlay === "gradient" ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(16,39,30,0.92)_0%,rgba(16,39,30,0.55)_38%,rgba(16,39,30,0.05)_78%)]"
          />
        ) : null}
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
