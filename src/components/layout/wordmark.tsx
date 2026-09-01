import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { area, site } from "@/lib/site";

type WordmarkProps = {
  className?: string;
  /** `lg` est reserve au menu mobile et a la style guide. */
  size?: "sm" | "md" | "lg";
  /**
   * `lockup` : symbole + nom, en ligne. Pour une barre horizontale.
   * `full`   : le logo complet du client, tel quel. Demande de la hauteur.
   */
  variant?: "lockup" | "full";
};

const nameClasses: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "text-[1.25rem]",
  md: "text-subtitle",
  lg: "text-title",
};

/** Hauteur du symbole, calee sur la taille du nom qu'il accompagne. */
const symbolClasses: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

/**
 * Logotype — logo reel du client, livre en phase 15B.
 *
 * DEUX TRAITEMENTS, ET POURQUOI
 * -----------------------------
 * Le logo fourni est un **bloc vertical** : la feuille au-dessus, puis
 * « Arbres et Cimes Élagage » sur deux lignes, puis « Arboriste Grimpeur ».
 * Le fichier de navigation lui-meme fait 354 x 420 px.
 *
 * Dans une barre d'en-tete de 72 px de haut, ce bloc tiendrait sur environ
 * 50 px de large et son texte tomberait sous 8 px — illisible. Le logo n'est
 * donc pas utilise tel quel partout :
 *
 * - **`lockup`** (en-tete, menu mobile) : le **symbole reel** — la feuille —
 *   accompagne du nom compose dans la typographie du site. C'est une
 *   composition horizontale, lisible a 40 px de haut, qui porte la marque
 *   sans deformer le logo ni rendre son texte illisible.
 * - **`full`** (pied de page) : le **logo complet**, tel que fourni. Le pied
 *   de page est centre et dispose de la hauteur necessaire.
 *
 * Le nom compose reprend `site.shortName` : il suit donc automatiquement toute
 * correction de la source unique (`CLAUDE.md` § 4).
 */
export function Wordmark({
  className,
  size = "md",
  variant = "lockup",
}: WordmarkProps) {
  /*
    PAS d'`aria-label` qui remplacerait le texte : WCAG 2.5.3 demande que le
    nom accessible CONTIENNE le texte visible. Le texte porte donc lui-meme le
    nom, et la destination s'ajoute en `sr-only` (releve en phase 15).
  */
  const base = cn(
    "group inline-flex min-h-11 no-underline",
    variant === "full" ? "flex-col items-center" : "items-center gap-3",
    className,
  );

  if (variant === "full") {
    return (
      <Link href="/" className={base}>
        <Image
          src="/brand/logo-footer.webp"
          alt={site.name}
          width={540}
          height={640}
          sizes="176px"
          className="h-auto w-44"
        />
        <span className="sr-only">— retour à l’accueil</span>
      </Link>
    );
  }

  return (
    <Link href="/" className={base}>
      {/* Le symbole seul : c'est la partie du logo qui reste lisible petite. */}
      <Image
        src="/brand/logo-symbol.png"
        alt=""
        aria-hidden="true"
        width={1280}
        height={1115}
        sizes="56px"
        className={cn("w-auto shrink-0", symbolClasses[size])}
      />

      <span className="flex flex-col justify-center gap-1">
        <span
          className={cn(
            "font-display leading-none whitespace-nowrap",
            "tracking-tight text-(--surface-heading)",
            nameClasses[size],
          )}
        >
          Arbres{" "}
          <span className="italic text-(--surface-fg-muted)">&amp;</span> Cimes
        </span>

        <span
          className={cn(
            "font-sans text-eyebrow font-semibold uppercase whitespace-nowrap",
            "text-(--surface-fg-muted)",
          )}
        >
          Élagage
          <span className="mx-1.5 text-(--color-safety)">·</span>
          {area.city}
        </span>
      </span>

      <span className="sr-only">— retour à l’accueil</span>
    </Link>
  );
}
