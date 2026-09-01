import { getLocation, neighboursOf, type Location } from "@/content/locations";
import { HOME_MARKERS, type MapMarker } from "@/lib/map-content";

/**
 * Jeu de repères d'une carte locale.
 *
 * Une page ville ne montre pas les vingt-trois points : elle montre **la
 * commune, Rouen, et deux ou trois voisins** — juste de quoi se situer. Au-delà,
 * la carte redevient la carte générale et cesse de répondre à la question que
 * se pose le visiteur, qui est « où est-ce, par rapport à eux ? ».
 *
 * Les repères sont repris tels quels de `HOME_MARKERS` — mêmes placements,
 * mêmes lignes de rappel, mêmes réglages déjà mesurés. Rien n'est recalculé
 * pour l'occasion : c'est ce qui garantit qu'une carte locale ne peut pas
 * produire de collision que la carte générale n'aurait pas.
 */
export function localMarkers(location: Location): readonly MapMarker[] {
  const wanted = new Set<string>(["76540", location.id]);

  /*
   * Deux voisins suffisent à donner une échelle ; au-delà on rebâtit la carte
   * générale en plus petit.
   *
   * On compte les voisins RETENUS, pas les voisins parcourus : Rouen figure
   * souvent en tête de liste pour les communes de la métropole, et l'y compter
   * ferait tomber la carte à trois points au lieu de quatre.
   */
  for (const voisin of neighboursOf(location)) {
    if (wanted.size >= 4) break;
    wanted.add(voisin.id);
  }

  const selected = HOME_MARKERS.filter((mark) => wanted.has(mark.code));

  /*
   * Sur une carte locale, tous les repères retenus portent leur nom : ils sont
   * trois ou quatre, la place existe. `secondary` (masqué sous 768 px) et
   * `labelOnInteraction` sont donc neutralisés ici — ces réglages servaient à
   * désengorger une carte de vingt-trois points, problème qui n'existe plus.
   */
  return selected.map((mark) => ({
    ...mark,
    secondary: false,
    labelOnInteraction: false,
  }));
}

/** Variante par slug, pour les appels depuis une page. */
export function localMarkersFor(slug: string): readonly MapMarker[] {
  const location = getLocation(slug);
  return location ? localMarkers(location) : HOME_MARKERS;
}
