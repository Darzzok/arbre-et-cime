import type { MetadataRoute } from "next";

import { absoluteUrl, SITE_INDEXABLE } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * robots.txt.
 *
 * Le crawl reste TOUJOURS autorise, y compris tant que le site n'est pas
 * indexable. C'est volontaire et c'est le point le plus contre-intuitif du
 * dispositif : un `Disallow: /` empecherait les moteurs de lire les balises
 * `noindex` des pages, et des URLs pourraient rester indexees sans description,
 * sans moyen de les faire disparaitre. Laisser explorer et repondre `noindex`
 * est la seule combinaison qui desindexe reellement.
 *
 * Meme raisonnement pour `/style-guide`, qui n'est pas interdite ici.
 *
 * Les lignes `Sitemap` et `Host` ne sont ecrites que si le site est indexable
 * ET qu'une origine publique valide existe : jamais de reference `localhost`,
 * et aucun renvoi vers un sitemap volontairement vide.
 */
export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = SITE_INDEXABLE ? absoluteUrl("/sitemap.xml") : null;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    ...(sitemapUrl && site.url ? { sitemap: sitemapUrl, host: site.url } : {}),
  };
}
