import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Capsule — primitive d'etiquette, introduite en phase 15B.
 *
 * Remplace progressivement le surtitre editorial « 01 ——— SECTION » par un
 * objet compact et scannable : c'est le changement de registre demande par la
 * nouvelle direction.
 *
 * TROIS VARIANTES, CHOISIES PAR LA SURFACE
 * ----------------------------------------
 * | Variante | Fond | Texte | Contraste | Ou |
 * | --- | --- | --- | --- | --- |
 * | `light` | sable | foret | 12,22 | surfaces claires |
 * | `dark` | ivoire 10 % | ivoire | — | surfaces sombres |
 * | `accent` | jaune | foret | 8,06 | **rare** — une seule par ecran |
 *
 * La variante `accent` suit la meme regle de parcimonie que le bouton
 * primaire : c'est la rarete du jaune qui lui donne sa valeur.
 *
 * DECORATIVE PAR DEFAUT
 * ---------------------
 * Une capsule qui repete une information deja portee par le titre voisin ne
 * doit pas etre annoncee deux fois. `decorative` la retire de l'arbre
 * d'accessibilite — c'est le cas le plus frequent, d'ou la demande explicite
 * du brief de ne pas polluer l'accessibilite.
 *
 * COMPOSANT SERVEUR : aucune interaction, aucun etat.
 */

export type CapsuleVariant = "light" | "dark" | "accent";

const variantClasses: Record<CapsuleVariant, string> = {
  light: "bg-sand text-forest",
  dark: "bg-ivory/10 text-ivory",
  accent: "bg-safety text-forest",
};

const dotClasses: Record<CapsuleVariant, string> = {
  light: "bg-moss",
  dark: "bg-safety",
  accent: "bg-forest",
};

type CapsuleProps = {
  as?: ElementType;
  variant?: CapsuleVariant;
  /** Pastille ronde en tete — un etat, une categorie. Purement visuelle. */
  dot?: boolean;
  /**
   * Retire la capsule de l'arbre d'accessibilite. Vrai par defaut : la
   * plupart des capsules redisent ce que le titre voisin dit deja.
   */
  decorative?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

export function Capsule({
  as = "span",
  variant = "light",
  dot = false,
  decorative = true,
  className,
  children,
  ...rest
}: CapsuleProps) {
  const Tag = as;

  return (
    <Tag
      {...(decorative ? { "aria-hidden": "true" } : {})}
      className={cn(
        // 32 px de haut, 36 px avec la pastille : la fourchette du brief.
        "inline-flex min-h-8 items-center gap-2 rounded-pill px-3.5 py-1.5",
        "font-sans text-caption font-semibold tracking-tight",
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn("size-1.5 shrink-0 rounded-pill", dotClasses[variant])}
        />
      ) : null}
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */

type CapsuleGroupProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Rangee de capsules. Existe pour une seule raison : le site est centre
 * (`main { text-align: center }`), et une rangee `flex` ne suit pas
 * `text-align` — elle a besoin de `justify-center`. L'oublier decale toute la
 * rangee a gauche, erreur deja commise en phase 4.
 */
export function CapsuleGroup({ className, children }: CapsuleGroupProps) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {children}
    </div>
  );
}
