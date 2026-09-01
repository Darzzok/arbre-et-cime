import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Surface d'arriere-plan. Bascule tous les jetons semantiques (globals.css).
 *
 * QUATRE SURFACES DEPUIS LA PHASE 15B
 * -----------------------------------
 * La direction demande de pouvoir alterner clair → sombre → clair → sombre
 * sans dupliquer une ligne de CSS. Deux surfaces n'y suffisaient pas : deux
 * sections claires consecutives se confondaient, et la seule surface sombre
 * finissait par tout porter.
 *
 * | Surface | Fond | Emploi |
 * | --- | --- | --- |
 * | `light` | ivoire chaud | surface par defaut |
 * | `sand` | sable doux | second fond clair — separe sans changer de registre |
 * | `dark` | foret | surface sombre courante |
 * | `deep-forest` | foret profond | **ancrage** — a reserver aux moments forts |
 *
 * `deep-forest` ne doit pas devenir la surface sombre par defaut : c'est son
 * rarete qui lui donne son poids.
 */
export type Surface = "light" | "sand" | "dark" | "deep-forest";

/**
 * Rythme vertical.
 *
 * Trois niveaux depuis la phase 15B — `compact`, `standard`, `signature`. Une
 * hauteur unique partout produisait une page reguliere au point d'etre
 * monotone.
 *
 * Les quatre valeurs de la phase 2 (`none`, `tight`, `default`, `loose`)
 * restent acceptees : les pages livrees les emploient, et cette sous-phase ne
 * doit toucher aucune page. Elles sont mappees sur les nouveaux jetons.
 */
export type SectionSpacing =
  | "none"
  | "compact"
  | "standard"
  | "signature"
  /* Alias historiques — conserves tant que les pages ne sont pas refaites. */
  | "tight"
  | "default"
  | "loose";

const spacingClasses: Record<SectionSpacing, string> = {
  none: "",
  compact: "py-(--space-compact)",
  standard: "py-(--space-standard)",
  signature: "py-(--space-signature)",
  tight: "py-(--space-compact)",
  default: "py-(--space-standard)",
  loose: "py-(--space-signature)",
};

type SectionProps = {
  surface?: Surface;
  spacing?: SectionSpacing;
  /**
   * Rend une balise `<div>` au lieu de `<section>`.
   * Une `<section>` doit porter un nom accessible : passer `aria-labelledby`
   * pointant sur son titre, sinon utiliser `plain`.
   */
  plain?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * Bandeau pleine largeur : pose la surface et le rythme vertical.
 * N'impose PAS de gouttiere ni de largeur maximale : composer avec
 * `<Container>` a l'interieur. Cette separation permet les debords photo pleine
 * largeur exiges par la mise en page.
 */
export function Section({
  surface = "light",
  spacing = "standard",
  plain = false,
  className,
  children,
  ...rest
}: SectionProps) {
  const Tag = plain ? "div" : "section";

  return (
    <Tag
      data-surface={surface}
      className={cn(
        "bg-(--surface-bg) text-(--surface-fg)",
        spacingClasses[spacing],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
