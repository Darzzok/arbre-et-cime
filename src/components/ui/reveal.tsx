import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type RevealProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * Unique primitive d'animation du projet : opacite + montee legere a
 * l'apparition dans le viewport (6 px sur mobile, 12 px au-dela de 768 px).
 *
 * Composant SERVEUR, sans JavaScript ni dependance : l'animation repose
 * entierement sur `animation-timeline: view()` (voir globals.css).
 *
 * Consequences voulues :
 * - aucun cout d'hydratation, aucun observateur, rien a nettoyer ;
 * - sur un navigateur sans timelines de scroll, le contenu s'affiche
 *   normalement, sans clignotement ;
 * - le contenu est toujours present dans le HTML initial (SEO, sans-JS) ;
 * - `prefers-reduced-motion: reduce` neutralise l'effet.
 *
 * L'animation est purement decorative : elle ne doit jamais porter
 * d'information.
 */
export function Reveal({
  as = "div",
  className,
  children,
  ...rest
}: RevealProps) {
  const Tag = as;

  return (
    <Tag data-reveal="" className={cn(className)} {...rest}>
      {children}
    </Tag>
  );
}
