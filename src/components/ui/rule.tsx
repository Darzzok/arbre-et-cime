import { cn } from "@/lib/cn";

/**
 * - `full`  : filet pleine largeur, separation de blocs
 * - `short` : filet court (72 px), marqueur editorial sous un surtitre
 * - `hair`  : filet pleine largeur tres discret, a l'interieur d'une liste
 */
export type RuleWidth = "full" | "short" | "hair";

// Preflight donne deja a `<hr>` un unique filet superieur de 1 px : on ne
// touche qu'a sa largeur, son epaisseur et sa couleur.
const widthClasses: Record<RuleWidth, string> = {
  full: "w-full",
  short: "w-18 border-t-2",
  hair: "w-full",
};

type RuleProps = {
  width?: RuleWidth;
  className?: string;
};

/**
 * Separateur. Remplace les cartes et les ombres portees : la structure
 * editoriale se lit au filet, pas au rectangle (charte verrouillee).
 *
 * Rendu en `<hr>` : separation semantique reelle, annoncee comme telle.
 * Un `<hr>` est deja `role="separator"`, aucun ARIA a ajouter.
 */
export function Rule({ width = "full", className }: RuleProps) {
  return (
    <hr
      className={cn(
        "border-(--surface-rule)",
        widthClasses[width],
        width === "hair" && "opacity-60",
        className,
      )}
    />
  );
}
