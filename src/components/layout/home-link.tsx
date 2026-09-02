"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Lien du logotype vers l'accueil.
 *
 * POURQUOI CE COMPOSANT EXISTE
 * ----------------------------
 * Un `<Link>` vers la route SUR LAQUELLE ON SE TROUVE DÉJÀ ne fait rien. Next
 * ne navigue pas — il n'y a nulle part où aller — et ne touche donc pas au
 * défilement. Sur l'accueil, cliquer le logo depuis le bas de page laissait le
 * visiteur exactement où il était. Relevé et reproduit : à 3 694 px de
 * défilement, le clic ne bougeait pas d'un pixel.
 *
 * Le geste est pourtant universel : on clique le logo pour revenir en haut.
 * C'est même sa seule fonction quand on est déjà sur l'accueil.
 *
 * CE QU'IL FAIT, ET RIEN DE PLUS
 * ------------------------------
 * Si le chemin courant est déjà la cible, on annule la navigation et on
 * remonte. Sinon, on laisse `<Link>` faire son travail : la navigation entre
 * pages fonctionnait déjà et n'est pas touchée.
 *
 * POURQUOI IL EST SÉPARÉ DE `Wordmark`
 * ------------------------------------
 * `usePathname()` impose un composant client. `Wordmark` est employé dans
 * l'en-tête — déjà client — mais aussi dans le **pied de page**, qui est un
 * composant serveur. Isoler la seule ligne qui a besoin du client évite de
 * faire basculer le logotype entier, et avec lui son `next/image`.
 *
 * MOUVEMENT RÉDUIT RESPECTÉ
 * -------------------------
 * Le défilement est animé par défaut, instantané si le visiteur a demandé
 * moins de mouvement. `scroll-behavior: auto` est déjà forcé globalement dans
 * ce cas (`globals.css`), mais un `scrollTo` programmatique porte son propre
 * comportement : il faut le décider ici aussi.
 */
export function HomeLink({
  href = "/",
  className,
  onActivate,
  children,
}: {
  href?: string;
  className?: string;
  /**
   * Appelé à CHAQUE clic, navigation ou non.
   *
   * Sert au menu mobile, qui ne se ferme que sur changement de chemin. Sans ce
   * rappel, cliquer le logo depuis le menu ouvert alors qu'on est déjà sur
   * l'accueil laissait le panneau ouvert **et le défilement verrouillé** — le
   * visiteur se retrouvait bloqué. Régression introduite puis corrigée en
   * même temps que le retour en haut.
   */
  onActivate?: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        onActivate?.();

        if (pathname !== href) return;

        event.preventDefault();

        const reduit = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        /*
         * Deux trames d'attente avant de défiler.
         *
         * `onActivate` ferme le menu par un changement d'état ; le verrou
         * `overflow: hidden` du corps n'est levé qu'à l'effet suivant. Défiler
         * dans la même trame ne produirait rien du tout.
         */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: reduit ? "auto" : "smooth" });
          });
        });
      }}
    >
      {children}
    </Link>
  );
}
