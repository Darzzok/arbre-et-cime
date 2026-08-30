import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Surface d'arriere-plan. Bascule tous les jetons semantiques (voir globals.css). */
export type Surface = "light" | "dark";

/** Rythme vertical. `--section-space` vaut 72 / 96 / 128 px selon la largeur. */
export type SectionSpacing = "none" | "tight" | "default" | "loose";

const spacingClasses: Record<SectionSpacing, string> = {
  none: "",
  tight: "py-[calc(var(--section-space)*0.6)]",
  default: "py-(--section-space)",
  loose: "py-[calc(var(--section-space)*1.35)]",
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
 * largeur exiges par la mise en page editoriale asymetrique.
 */
export function Section({
  surface = "light",
  spacing = "default",
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
