import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * - `primary` : jaune securite rempli, libelle charbon (7,91:1).
 *               UNE SEULE occurrence par ecran visible — charte verrouillee.
 * - `solid`   : aplat inverse par rapport a la surface (foret sur clair,
 *               ivoire sur sombre). Action « Appeler ».
 * - `outline` : contour discret, action secondaire.
 */
export type ButtonVariant = "primary" | "solid" | "outline";

export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-edge font-sans " +
  "font-semibold tracking-tight text-body no-underline " +
  "transition-[background-color,border-color,color,opacity] " +
  "duration-(--duration-cime) ease-cime " +
  "disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-safety text-charcoal hover:bg-safety/90 active:bg-safety/80 " +
    "border border-transparent",
  solid:
    "bg-(--btn-solid-bg) text-(--btn-solid-fg) hover:opacity-90 " +
    "active:opacity-80 border border-transparent",
  outline:
    "border border-(--btn-outline-border) text-(--surface-fg) " +
    "hover:border-(--surface-fg) active:opacity-80 bg-transparent",
};

/** Hauteurs >= 48 px : la cible tactile minimale de 44 px est toujours tenue. */
const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 py-2.5",
  lg: "min-h-14 px-7 py-3",
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
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

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
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classesFor({ variant, size, block, className })}
      {...rest}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">;

/** NAVIGATION ou `tel:` / `mailto:` presente avec l'apparence d'un bouton. */
export function ButtonLink({
  variant,
  size,
  block,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a className={classesFor({ variant, size, block, className })} {...rest}>
      {children}
    </a>
  );
}
