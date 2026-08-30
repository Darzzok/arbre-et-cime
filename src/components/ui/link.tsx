import NextLink from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type BaseLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

/** Les routes internes passent par next/link ; `tel:`, `mailto:` et l'externe non. */
function isInternal(href: string): boolean {
  return href.startsWith("/") || href.startsWith("#");
}

function Anchor({ href, className, children, ...rest }: BaseLinkProps) {
  if (isInternal(href)) {
    return (
      <NextLink href={href} className={className} {...rest}>
        {children}
      </NextLink>
    );
  }

  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

/**
 * Lien dans le fil du texte.
 * Le soulignement est PERMANENT : le lien reste identifiable sans survol et
 * sans dependre de la seule couleur. Le survol et le focus ne font que
 * renforcer le trait.
 */
export function TextLink({ className, children, ...rest }: BaseLinkProps) {
  return (
    <Anchor
      className={cn(
        "font-sans font-medium text-(--surface-fg) underline",
        "decoration-1 underline-offset-[0.25em] decoration-(--surface-rule)",
        "transition-[text-decoration-color] duration-(--duration-cime) ease-cime",
        "hover:decoration-(--surface-fg) focus-visible:decoration-(--surface-fg)",
        className,
      )}
      {...rest}
    >
      {children}
    </Anchor>
  );
}

/**
 * Lien d'action editorial, avec chevron.
 * Le chevron est TOUJOURS visible (jamais revele au survol) ; seul son
 * deplacement de 2 px est conditionne au survol/focus, et il est neutralise
 * sous `prefers-reduced-motion`.
 */
export function ArrowLink({ className, children, ...rest }: BaseLinkProps) {
  return (
    <Anchor
      className={cn(
        "group inline-flex min-h-11 items-center gap-2.5 font-sans font-semibold",
        "text-body text-(--surface-fg) no-underline",
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          "underline decoration-1 underline-offset-[0.25em]",
          "decoration-(--surface-rule)",
          "transition-[text-decoration-color] duration-(--duration-cime) ease-cime",
          "group-hover:decoration-(--surface-fg)",
          "group-focus-visible:decoration-(--surface-fg)",
        )}
      >
        {children}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className={cn(
          "size-4 shrink-0",
          "motion-safe:transition-transform motion-safe:duration-(--duration-cime)",
          "motion-safe:ease-cime",
          "motion-safe:group-hover:translate-x-0.5",
          "motion-safe:group-focus-visible:translate-x-0.5",
        )}
      >
        <path
          d="M2 8h11M9 4l4 4-4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </svg>
    </Anchor>
  );
}
