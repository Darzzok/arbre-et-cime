import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Largeurs maximales disponibles.
 * - `prose`   : colonne de lecture (672 px), 60-75 caracteres par ligne
 * - `content` : largeur de contenu de reference (1240 px)
 * - `wide`    : bandeaux quasi pleine largeur (1440 px)
 * - `full`    : aucune borne — pour les debords photo pleine largeur
 */
export type ContainerWidth = "prose" | "content" | "wide" | "full";

const widthClasses: Record<ContainerWidth, string> = {
  prose: "max-w-reading",
  content: "max-w-content",
  wide: "max-w-wide",
  full: "",
};

type ContainerProps = {
  as?: ElementType;
  width?: ContainerWidth;
  /** Retire la gouttiere laterale (debord photo gere par l'enfant). */
  bleed?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * Borne horizontale du contenu et gouttiere laterale responsive.
 * La gouttiere est pilotee par `--gutter` : 20 px mobile, 32 px des 768 px,
 * 48 px des 1024 px (voir globals.css).
 */
export function Container({
  as = "div",
  width = "content",
  bleed = false,
  className,
  children,
  ...rest
}: ContainerProps) {
  const Tag = as;

  return (
    <Tag
      className={cn(
        "mx-auto w-full",
        widthClasses[width],
        !bleed && "px-(--gutter)",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
