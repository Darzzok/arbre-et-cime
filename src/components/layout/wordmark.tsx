import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

type WordmarkProps = {
  className?: string;
  /** `lg` est reserve au menu mobile et a la style guide. */
  size?: "sm" | "md" | "lg";
  /**
   * `lockup` : le logo en LIGNE — symbole a gauche, nom a droite.
   * `full`   : le logo complet, empile. Demande de la hauteur.
   */
  variant?: "lockup" | "full";
};

/**
 * Hauteur du logotype en ligne.
 *
 * Plus haute que l'ancien symbole seul (`h-8`), et il le faut : c'est
 * desormais le texte du logo qui doit rester lisible, pas seulement la feuille.
 * A `h-12`, ses trois lignes retrouvent ~12 px chacune.
 */
const lockupClasses: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "h-11",
  md: "h-12",
  lg: "h-14",
};

/**
 * Logotype — logo reel du client. NOUVELLE VERSION livree en phase 16B.
 *
 * PLUS AUCUN TEXTE RECOMPOSE
 * --------------------------
 * Jusqu'ici, l'en-tete affichait le symbole du client accompagne d'un nom
 * compose dans la typographie du site — « Arbres & Cimes / ÉLAGAGE · ROUEN ».
 * Le client a demande que ce soit **son logo**, avec **son texte**, et l'a
 * confirme apres que la contrainte de hauteur lui a ete signalee.
 *
 * LE BLOC VERTICAL NE POUVAIT PAS ENTRER DANS LA BARRE
 * ----------------------------------------------------
 * Le maitre detoure fait 905 x 912 — quasiment carre — et son pave de texte
 * occupe 31 % de sa hauteur pour TROIS lignes. Dans une barre de 81 px, un
 * logo de 56 px de haut donne 17 px de texte au total, soit **moins de 6 px
 * par ligne**. Atteindre 10 px demanderait un logo de 97 px de haut, donc une
 * barre plus haute que le logo lui-meme.
 *
 * LE LOGO EST DONC REAGENCE, PAS REDESSINE
 * -----------------------------------------
 * `scripts/build-brand-assets.mjs` decoupe les deux composants du maitre — le
 * symbole et le pave de texte — et les repose **cote a cote**. Aucun pixel
 * n'est redessine, aucune typographie n'est substituee : c'est le dessin du
 * client, dans un autre agencement. Le resultat fait 1917 x 512, soit un
 * rapport de 3,74:1 qui entre dans une barre de navigation.
 *
 * | Variante | Ou | Fichier |
 * | --- | --- | --- |
 * | `lockup` | en-tete, menu mobile | `logo-lockup.png` — le logo en ligne |
 * | `full` | pied de page | `logo-complet.png` — le logo empile, tel que fourni |
 *
 * LE NOM ACCESSIBLE VIENT DE L'`alt`
 * ----------------------------------
 * Il n'y a plus de texte visible : WCAG 2.5.3 ne s'applique donc plus. L'`alt`
 * porte le nom de l'entreprise depuis `site.ts`, source unique, et la
 * destination s'ajoute en `sr-only`.
 */
export function Wordmark({
  className,
  size = "md",
  variant = "lockup",
}: WordmarkProps) {
  const base = cn(
    "group inline-flex min-h-11 items-center no-underline",
    className,
  );

  if (variant === "full") {
    return (
      <Link href="/" className={base}>
        <Image
          src="/brand/logo-complet.png"
          alt={site.name}
          width={905}
          height={912}
          sizes="192px"
          className="h-auto w-48"
        />
        <span className="sr-only">— retour à l’accueil</span>
      </Link>
    );
  }

  return (
    <Link href="/" className={base}>
      {/*
        `w-auto` + une hauteur fixe : c'est la HAUTEUR qui est contrainte dans
        une barre de navigation, jamais la largeur. Le rapport 3,74:1 fait le
        reste.
      */}
      <Image
        src="/brand/logo-lockup.png"
        alt={site.name}
        width={1917}
        height={512}
        sizes="200px"
        /*
          `loading="eager"` ET NON `priority` — mesure.
          `priority` ajoute un `<link rel=preload>` qui entre en concurrence
          avec la photographie du hero, elle-meme en `fetchPriority="high"`.
          Mesure sur l'accueil : LCP passe de 2,9 s a 4,3 s et la performance
          de 91 a 85 pour un fichier de 9 Ko. `eager` suffit : le logotype
          n'est pas differe, mais il ne double pas la file de prechargement.
        */
        loading="eager"
        className={cn("w-auto shrink-0", lockupClasses[size])}
      />

      <span className="sr-only">— retour à l’accueil</span>
    </Link>
  );
}
