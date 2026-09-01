import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type EyebrowProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * Surtitre : Inter 12 px, majuscules, interlettrage 0,12em.
 * Seul endroit du site ou les majuscules sont autorisees.
 * Porte du texte reel (il est lu par les lecteurs d'ecran), contrairement a
 * `SectionIndex` qui est purement ornemental.
 */
export function Eyebrow({
  as = "p",
  className,
  children,
  ...rest
}: EyebrowProps) {
  const Tag = as;

  return (
    <Tag
      className={cn(
        "font-sans text-eyebrow font-semibold uppercase",
        "text-(--surface-fg-muted)",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

type SectionIndexProps = {
  /** Rang de la section, 1-based. Affiche sur deux chiffres. */
  value: number;
  /** Total optionnel : rend « 03 / 07 ». */
  total?: number;
  className?: string;
};

/**
 * Numerotation editoriale d'une section.
 * ORNEMENT typographique : masque aux technologies d'assistance, car le rang
 * d'une section n'apporte aucune information a un lecteur d'ecran, qui dispose
 * deja de la structure de titres.
 */
export function SectionIndex({ value, total, className }: SectionIndexProps) {
  const format = (n: number) => n.toString().padStart(2, "0");

  return (
    <span
      aria-hidden="true"
      className={cn(
        "font-sans text-eyebrow font-semibold tabular-nums whitespace-nowrap",
        "text-(--surface-fg-muted)",
        className,
      )}
    >
      {format(value)}
      {total !== undefined ? ` / ${format(total)}` : null}
    </span>
  );
}
