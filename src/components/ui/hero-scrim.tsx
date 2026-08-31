import { cn } from "@/lib/cn";

/**
 * Intensite du voile.
 *
 * - `default` : heros de 30rem et plus (pages services).
 * - `compact` : heros de 26 a 29rem (`/a-propos`, `/realisations`).
 */
export type HeroScrimVariant = "default" | "compact";

/*
 * Deux degrades, et la difference entre eux n'est PAS une affaire de gout.
 *
 * Le voile est ancre en bas : son opacite tend vers zero en haut du cadre.
 * Tant que le hero est haut, le bloc de texte occupe le tiers inferieur et
 * tombe dans la partie dense. Raccourcir le hero ne deplace pas le texte, cela
 * deplace le degrade sous lui : le texte remonte mecaniquement vers la zone
 * claire, et le contraste s'effondre.
 *
 * Mesure a l'appui, sur `/a-propos` a 22rem avec le degrade `default` : le
 * surtitre tombait a 1,92 et le titre a 2,11. Les quatre autres photographies
 * candidates, mesurees au meme endroit, faisaient pires encore (1,57 a 1,67) —
 * le parametre en cause etait la hauteur, pas l'image.
 *
 * `compact` est calibre au plus juste : trois reglages plus appuyes ont ete
 * mesures, tous passaient AA, tous eteignaient la photographie. C'est le plus
 * leger des quatre qui tienne le seuil.
 *
 * Voir DESIGN_SYSTEM.md § 5, « Le degrade se calibre sur la HAUTEUR ».
 */
const variantClasses: Record<HeroScrimVariant, string> = {
  /* Calibre en phase 7 sur la plus exigeante des quatre pages services :
     sur `/elagage`, le surtitre tombe devant un batiment en pierre claire et
     descendait a 3,28 de contraste. Les quatre pages partagent ce reglage. */
  default:
    "bg-[linear-gradient(to_top,rgba(20,37,30,0.94)_0%,rgba(20,37,30,0.86)_26%,rgba(20,37,30,0.60)_52%,rgba(20,37,30,0.24)_74%,rgba(20,37,30,0.02)_92%,rgba(20,37,30,0)_100%)]",

  /* Calibre en phase 8 sur `/a-propos` (arbre d'hiver, ciel clair), verifie en
     phase 9 sur `/realisations`. Pires contrastes mesures, surtitre / titre /
     chapo : 5,52 / 5,43 / 9,58 et 7,50 / 8,24 / 11,12. */
  compact:
    "bg-[linear-gradient(to_top,rgba(20,37,30,0.95)_0%,rgba(20,37,30,0.90)_34%,rgba(20,37,30,0.76)_62%,rgba(20,37,30,0.50)_82%,rgba(20,37,30,0.14)_100%)]",
};

type HeroScrimProps = {
  variant?: HeroScrimVariant;
  className?: string;
};

/**
 * Voile degrade pose entre la photographie d'un hero et son texte.
 *
 * Purement decoratif : `aria-hidden`, aucun contenu, aucune interaction. Il ne
 * porte jamais d'information — il rend seulement lisible celle qui est dessus.
 *
 * Le parent doit etre `relative isolate` et l'image en `-z-10`.
 */
export function HeroScrim({ variant = "default", className }: HeroScrimProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-0 -z-10",
        variantClasses[variant],
        className,
      )}
    />
  );
}
