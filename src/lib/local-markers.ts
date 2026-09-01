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
 * mêmes lignes de rappel, mêmes réglages déjà mesurés.
 *
 * **Cette reprise ne suffit pourtant pas à écarter les collisions**, contrairement
 * à ce que ce commentaire affirmait. Voir plus bas : lever `secondary` pour
 * tous les repères en réintroduisait une, mesurée sur `/zones-intervention/rouen`
 * à 390 px.
 */
export function localMarkers(location: Location): readonly MapMarker[] {
  const wanted = new Set<string>(["76540", location.id]);

  /*
   * LES DEUX ÉTIQUETTES NOMMÉES S'ÉCARTENT L'UNE DE L'AUTRE.
   *
   * Une carte locale n'affiche que deux noms : celui de la commune et celui de
   * Rouen. Les poser toujours du même côté suffit à les faire se rencontrer dès
   * que la commune est dans l'axe — mesuré sur une commune plein nord de
   * Rouen, où l'étiquette de Rouen montait vers le nord pendant que celle de
   * la commune descendait vers le sud.
   *
   * Le côté est donc déduit de la position réelle de la commune : chacune pose
   * son nom du côté OPPOSÉ à l'autre.
   *
   * TOUJOURS SUR L'AXE VERTICAL, et c'est mesuré. Les côtés « gauche » et
   * « droite » retombent SOUS le point en dessous de 480 px — c'est une
   * protection voulue de `sidePlacement`, sans quoi les étiquettes latérales
   * sortent du cadre sur un téléphone. Conséquence : sur une carte locale, deux
   * communes voisines placées l'une à gauche et l'autre à droite se retrouvent
   * toutes deux sous leur point, à quelques pixels d'écart. Relevé sur
   * `/le-grand-quevilly`, à 5 km de Rouen.
   *
   * Haut et bas, eux, sont honorés à toutes les largeurs.
   */
  const cible = HOME_MARKERS.find((m) => m.code === location.id);
  // `y` croît vers le sud dans la projection : `dy < 0` = commune au nord.
  const dy = cible?.y ?? 0;

  const cote = (estRouen: boolean): MapMarker["side"] => {
    // Commune pile dans l'axe : on tranche par défaut, Rouen au-dessus.
    if (dy === 0) return estRouen ? "top" : "bottom";
    const signe = estRouen ? -1 : 1;
    return dy * signe < 0 ? "top" : "bottom";
  };

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
   * `secondary` N'EST LEVÉ QUE POUR LA COMMUNE DE LA PAGE ET POUR ROUEN.
   *
   * La version précédente le levait pour tous les repères, avec ce
   * raisonnement : « ils sont trois ou quatre, la place existe ». C'était faux,
   * et mesurable — sur `/zones-intervention/rouen` à 390 px, les étiquettes de
   * Mont-Saint-Aignan et de Bois-Guillaume se chevauchaient.
   *
   * La raison tient à ce que `secondary` encode réellement : non pas « repère
   * peu important », mais **« cette étiquette ne tient pas sous 768 px »**. Or
   * une carte locale mesure 301 px à 390 px de large — elle n'a pas plus de
   * place que la carte générale, elle en a moins. Réduire le nombre de points
   * ne rallonge pas les noms disponibles autour du centre.
   *
   * Deux repères doivent malgré tout être nommés en toutes circonstances :
   * la commune dont on lit la page, et Rouen, qui donne l'échelle. Ceux-là
   * seuls sont affranchis.
   *
   * `labelOnInteraction` reste levé : il désengorgeait une grappe de six noms
   * au centre de la carte générale, situation qui n'existe pas ici.
   */
  return selected.map((mark) => {
    const essentiel = mark.code === "76540" || mark.code === location.id;

    /*
     * LES LIGNES DE RAPPEL DE LA GRAPPE NE SURVIVENT PAS AU CHANGEMENT
     * D'ÉCHELLE.
     *
     * Elles font rayonner six étiquettes autour de Rouen sur une carte de
     * 1 024 px. Une carte locale en mesure 301 à 390 px : les mêmes décalages,
     * réduits par `--map-leader`, empilent les noms les uns sur les autres et
     * en poussent hors du cadre. Mesuré sur `/bois-guillaume` (Mont-Saint-Aignan
     * × Bois-Guillaume) et sur `/sotteville-les-rouen` (Rouen ×
     * Saint-Étienne-du-Rouvray, et Sotteville elle-même hors cadre).
     *
     * Sur une carte locale, l'étiquette se colle donc sous son point. Avec deux
     * noms affichés, la place existe sans rayonnement.
     */
    const place: Pick<MapMarker, "leader" | "side"> = essentiel
      ? { leader: undefined, side: cote(mark.code === "76540") }
      : { leader: undefined, side: mark.side };

    return {
      ...mark,
      ...place,
      secondary: essentiel ? false : mark.secondary,
      /*
       * Seules la commune de la page et Rouen portent leur nom en permanence.
       * Les deux voisins gardent leur point — cliquable, annoncé au lecteur
       * d'écran — et révèlent leur nom au survol ou au tap, comme sur la carte
       * générale. C'est ce qui rend la collision structurellement impossible
       * plutôt que rattrapée au cas par cas.
       */
      labelOnInteraction: !essentiel,
    };
  });
}

/** Variante par slug, pour les appels depuis une page. */
export function localMarkersFor(slug: string): readonly MapMarker[] {
  const location = getLocation(slug);
  return location ? localMarkers(location) : HOME_MARKERS;
}
