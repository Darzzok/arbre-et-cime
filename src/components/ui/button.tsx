import NextLink from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

/**
 * Boutons — refaits en phase 15B.
 *
 * QUATRE VARIANTES, ET CE QU'ELLES DISENT
 * ---------------------------------------
 * - `primary`   : accent jaune, texte foret (8,06). **Une seule occurrence
 *                 pleine par ecran visible** — la regle de parcimonie survit
 *                 a la refonte, c'est elle qui donne sa force au jaune.
 * - `secondary` : aplat foret, texte ivoire. Action importante mais seconde,
 *                 ou action principale sur une surface deja jaune.
 * - `light`     : aplat ivoire, texte foret. Reserve aux surfaces sombres,
 *                 ou un aplat clair ressort plus qu'un contour.
 * - `ghost`     : sans fond, texte + fleche. Remplace l'ancien `outline` pour
 *                 les actions tertiaires.
 *
 * `outline` et `solid` restent acceptes : les pages livrees les emploient, et
 * cette sous-phase ne doit toucher aucune page. Ils sont mappes sur les
 * nouvelles variantes.
 *
 * FORMES
 * ------
 * Rayon `--radius-control` (12 px) et non plus 2 px : la direction assume des
 * formes plus douces. Hauteurs 48 px (`md`) et 52 px (`lg`), au-dessus de la
 * cible tactile de 44 px imposee par `CLAUDE.md` § 5.
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "light"
  | "ghost"
  /* Alias historiques — conserves tant que les pages ne sont pas refaites. */
  | "solid"
  | "outline";

export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-control font-sans " +
  "font-semibold tracking-tight text-ui no-underline " +
  "transition-[background-color,border-color,color,opacity,translate] " +
  "duration-(--duration-micro) ease-cime " +
  "motion-safe:active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "aria-disabled:pointer-events-auto";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-safety text-forest " +
    "hover:bg-safety/90 active:bg-safety/80",
  secondary:
    "border border-transparent bg-forest text-ivory " +
    "hover:bg-forest/90 active:bg-forest/80",
  light:
    "border border-transparent bg-ivory text-forest " +
    "hover:bg-ivory/90 active:bg-ivory/80",
  ghost:
    "border border-transparent bg-transparent text-(--surface-fg) " +
    "hover:bg-(--surface-inset) active:opacity-80",

  /* `solid` prenait deja l'aplat inverse de la surface : il le garde. */
  solid:
    "border border-transparent bg-(--btn-solid-bg) text-(--btn-solid-fg) " +
    "hover:opacity-90 active:opacity-80",
  outline:
    "border border-(--btn-outline-border) bg-transparent text-(--surface-fg) " +
    "hover:border-(--surface-fg) active:opacity-80",
};

/** Hauteurs >= 48 px : la cible tactile minimale de 44 px est toujours tenue. */
const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 py-2.5",
  lg: "min-h-[3.25rem] px-7 py-3",
};

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Pleine largeur — comportement par defaut attendu sur mobile. */
  block?: boolean;
  className?: string;
  children: ReactNode;
};

function classesFor({
  variant = "primary",
  size = "md",
  block = false,
  className,
}: Omit<SharedProps, "children">) {
  return cn(
    base,
    variantClasses[variant],
    sizeClasses[size],
    block ? "w-full" : "w-auto",
    className,
  );
}

type ButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    /**
     * Etat d'attente. Le libelle reste en place — le remplacer ferait sauter
     * la largeur du bouton, et l'utilisateur perdrait ce sur quoi il vient de
     * cliquer. Le bouton devient inerte et l'annonce se fait par `aria-busy`.
     */
    loading?: boolean;
  };

/**
 * ACTION dans la page (ouvrir un menu, passer a l'etape suivante, soumettre).
 * Pour une NAVIGATION ou un `tel:`, utiliser `ButtonLink` : un bouton et un
 * lien ne sont pas interchangeables pour les technologies d'assistance.
 */
export function Button({
  variant,
  size,
  block,
  className,
  children,
  type = "button",
  loading = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      aria-busy={loading || undefined}
      data-loading={loading ? "" : undefined}
      className={cn(
        classesFor({ variant, size, block, className }),
        loading && "pointer-events-none",
      )}
      {...rest}
    >
      {children}

      {loading ? (
        /* Deux points qui pulsent, pas un disque qui tourne : le mouvement
           reste dans le vocabulaire du projet, et il s'arrete sous
           `prefers-reduced-motion`. */
        <span
          aria-hidden="true"
          data-button-spinner=""
          className="ml-0.5 inline-flex gap-1"
        >
          <span className="size-1.5 rounded-pill bg-current" />
          <span className="size-1.5 rounded-pill bg-current" />
        </span>
      ) : null}
    </button>
  );
}

type ButtonLinkProps = SharedProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className" | "children"
  >;

/**
 * NAVIGATION ou `tel:` / `mailto:` presente avec l'apparence d'un bouton.
 *
 * Comme `TextLink`, les routes internes passent par `next/link` (navigation
 * cliente, prefetch) tandis que `tel:`, `mailto:` et l'externe restent des
 * ancres simples.
 */
export function ButtonLink({
  variant,
  size,
  block,
  className,
  children,
  href,
  ...rest
}: ButtonLinkProps) {
  const classes = classesFor({ variant, size, block, className });

  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <NextLink href={href} className={classes} {...rest}>
        {children}
      </NextLink>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}
