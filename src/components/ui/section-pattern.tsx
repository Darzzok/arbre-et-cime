import { cn } from "@/lib/cn";

/**
 * Fonds de section — introduits en phase 15B.
 *
 * DEUX MOTIFS, PAS UN PAR PAGE
 * ----------------------------
 * Le brief autorise deux ou trois motifs cohérents. Il y en a **deux**, et
 * c'est volontaire : un troisième n'aurait servi qu'à éviter la répétition,
 * c'est-à-dire à faire du décor. Deux motifs employés à bon escient se lisent
 * comme un système ; cinq se lisent comme une absence de système.
 *
 * | Motif | Ce que c'est | Où |
 * | --- | --- | --- |
 * | `rings` | cernes de bois, arcs concentriques décentrés | surfaces sombres d'ancrage |
 * | `contour` | courbes de niveau, lignes souples parallèles | bandeaux, cartes larges |
 *
 * TROIS CONTRAINTES TENUES
 * ------------------------
 * - **Aucune image générée** : deux `<svg>` inline, tracés à la main en
 *   coordonnées rondes. Pas de fichier, pas de requête, pas de licence.
 * - **Jamais porteur d'information** : `aria-hidden`, `pointer-events-none`,
 *   et une opacité telle que retirer le motif ne change rien à la
 *   compréhension de la page.
 * - **Coût nul ou presque** : quelques centaines d'octets dans le HTML, aucun
 *   JavaScript, aucune animation. Composant serveur.
 *
 * Le tracé utilise `currentColor` : le motif prend la couleur du texte de sa
 * surface et fonctionne donc sur les quatre surfaces sans variante.
 */

export type PatternName = "rings" | "contour";

type SectionPatternProps = {
  pattern: PatternName;
  /**
   * Opacité du tracé. Défaut volontairement bas — au-delà de 0,1 le motif
   * cesse d'être une texture et devient un dessin.
   */
  opacity?: number;
  className?: string;
};

export function SectionPattern({
  pattern,
  opacity = 0.06,
  className,
}: SectionPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      style={{ opacity }}
    >
      {pattern === "rings" ? <Rings /> : <Contour />}
    </div>
  );
}

/**
 * Cernes de bois — arcs concentriques dont le centre est décalé hors cadre.
 *
 * Le décentrement est ce qui empêche la lecture « cible » : un arbre ne pousse
 * pas en cercles parfaitement concentriques, et une cible n'a rien à faire ici.
 */
function Rings() {
  const rayons = [120, 170, 225, 285, 350, 420, 495, 575];

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMaxYMid slice"
      className="absolute inset-0 size-full text-current"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.25">
        {rayons.map((r, i) => (
          <ellipse
            key={r}
            cx="690"
            cy="300"
            rx={r}
            /* Les cernes s'aplatissent vers l'extérieur, comme un tronc dont
               la croissance ralentit. */
            ry={r * (0.88 - i * 0.015)}
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Courbes de niveau — lignes souples parallèles, jamais rigoureusement
 * identiques : chacune décale son amplitude, ce qui évite l'effet de trame.
 */
function Contour() {
  const lignes = [0, 1, 2, 3, 4, 5, 6];

  return (
    <svg
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full text-current"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.25">
        {lignes.map((i) => {
          const y = 40 + i * 52;
          const a = 26 - i * 2.4;
          return (
            <path
              key={i}
              d={`M0 ${y} C 200 ${y - a}, 400 ${y + a}, 600 ${y} S 1000 ${y + a}, 1200 ${y - a / 2}`}
            />
          );
        })}
      </g>
    </svg>
  );
}
