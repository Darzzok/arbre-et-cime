import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type TypographyProps = {
  /**
   * Balise rendue. La taille visuelle et le niveau semantique sont
   * INDEPENDANTS : choisir `as` selon la structure du document, jamais selon
   * l'apparence souhaitee (un seul `h1` par page, aucun saut de niveau).
   */
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

function create(baseClassName: string, defaultTag: ElementType) {
  return function Typography({
    as,
    className,
    children,
    ...rest
  }: TypographyProps) {
    const Tag = as ?? defaultTag;

    return (
      <Tag className={cn(baseClassName, className)} {...rest}>
        {children}
      </Tag>
    );
  };
}

/** Sora 40 → 72 px. Reserve au titre principal d'un ecran (hero, page). */
export const Display = create(
  "font-display text-display text-(--surface-heading) text-balance",
  "h1",
);

/** Sora 34 → 56 px. Titre de section. */
export const Title = create(
  "font-display text-title text-(--surface-heading) text-balance",
  "h2",
);

/** Sora 22 → 27 px. Sous-titre, intitule de bloc. */
export const Subtitle = create(
  "font-display text-subtitle text-(--surface-heading) text-balance",
  "h3",
);

/** Inter 17 → 19 px. Chapo : une phrase, juste sous un titre. */
export const Lead = create(
  "font-sans text-lead text-(--surface-fg) text-pretty",
  "p",
);

/** Inter 16 → 18 px. Texte courant. Jamais en dessous de 16 px. */
export const Body = create(
  "font-sans text-body text-(--surface-fg) text-pretty",
  "p",
);

/** Inter 13 → 14 px. Legende, mention, precision secondaire. */
export const Small = create(
  "font-sans text-caption text-(--surface-fg-muted) text-pretty",
  "p",
);
