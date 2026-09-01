import type { MetadataRoute } from "next";

import { LOCATIONS } from "@/content/locations";
import { sitemapRoutes } from "@/lib/routes";
import {
  absoluteUrl,
  isRouteIndexable,
  locationPath,
  SITE_INDEXABLE,
} from "@/lib/seo";

/**
 * Sitemap genere a partir de la definition centralisee des routes.
 *
 * Une route n'y figure que si elle est publique, indexable et marquee
 * `inSitemap` : `/style-guide` en est donc exclue automatiquement, sans
 * exception codee en dur.
 *
 * Si aucune origine publique valide n'est disponible (production sans
 * `NEXT_PUBLIC_SITE_URL`), le sitemap est VIDE plutot que de publier des URLs
 * `localhost` ou relatives, qui seraient pires qu'une absence de sitemap.
 *
 * Tant que `NEXT_PUBLIC_SITE_INDEXABLE` ne vaut pas `"true"`, le sitemap est
 * egalement vide : soumettre a l'indexation des pages portant un contenu
 * d'attente serait exactement ce que le garde-fou cherche a empecher.
 *
 * `lastModified` est volontairement omis : le renseigner a la date du build
 * affirmerait que toutes les pages changent a chaque deploiement. Un `lastmod`
 * non fiable est ignore par les moteurs — il sera ajoute page par page quand
 * les contenus auront une vraie date de mise a jour.
 */
/**
 * Les pages locales (phase 14) figurent au sitemap au meme titre que les
 * autres pages publiques : elles sont vingt-trois, generees depuis une source
 * unique, et soumises exactement au meme garde-fou. Aucune n'y entre tant que
 * `NEXT_PUBLIC_SITE_INDEXABLE` ne vaut pas `"true"`.
 *
 * Leur priorite est inferieure a celle des pages services : ce sont des pages
 * de couverture geographique, pas le coeur metier du site. Les distinguer
 * evite de diluer le signal envoye sur les quatre pages qui portent vraiment
 * l'activite.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = sitemapRoutes.flatMap((route) => {
    const url = isRouteIndexable(route) ? absoluteUrl(route.path) : null;

    if (!url) {
      return [];
    }

    return [
      {
        url,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      },
    ];
  });

  const locations = LOCATIONS.flatMap((location) => {
    const url = SITE_INDEXABLE ? absoluteUrl(locationPath(location.slug)) : null;

    if (!url) {
      return [];
    }

    return [
      {
        url,
        changeFrequency: "yearly" as const,
        // Le coeur de zone porte l'intention locale la plus forte ; les
        // deplacements elargis n'ont pas a peser autant.
        priority: location.tier === "core" ? 0.7 : 0.5,
      },
    ];
  });

  return [...pages, ...locations];
}
