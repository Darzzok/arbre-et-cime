import type { MetadataRoute } from "next";

import { sitemapRoutes } from "@/lib/routes";
import { absoluteUrl, isRouteIndexable } from "@/lib/seo";

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
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.flatMap((route) => {
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
}
