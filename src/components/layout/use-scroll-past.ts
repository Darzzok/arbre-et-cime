"use client";

import { useEffect, useState } from "react";

/**
 * Indique si la page a defile au-dela d'un seuil.
 *
 * Le seuil vaut `offset` pixels, plus `viewportRatio` fois la hauteur du
 * viewport — ce qui permet d'exprimer « une fois le hero passe » sans connaitre
 * la hauteur de l'ecran au rendu serveur.
 *
 * Les deux parametres sont des primitives : les dependances de l'effet restent
 * stables, l'ecouteur n'est pose qu'une fois.
 *
 * Cout : un ecouteur passif, une lecture de `scrollY` par image au maximum
 * (aucune lecture de geometrie, donc aucun recalcul de mise en page force), et
 * un rendu uniquement quand le booleen change reellement.
 */
export function useScrollPast(offset: number, viewportRatio = 0): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const threshold = offset + viewportRatio * window.innerHeight;
      // `setPast` avec une valeur identique ne declenche pas de rendu.
      setPast(window.scrollY > threshold);
    };

    const schedule = () => {
      if (frame === 0) {
        frame = requestAnimationFrame(measure);
      }
    };

    // Mesure initiale differee : couvre le rechargement en cours de page sans
    // appeler setState de maniere synchrone depuis le corps de l'effet.
    schedule();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame !== 0) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [offset, viewportRatio]);

  return past;
}
