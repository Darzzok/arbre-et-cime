import type { Metadata } from "next";

import { getRoute, type RouteDefinition, type RouteId } from "./routes";
import { site } from "./site";

/**
 * Fabrique centralisee des metadonnees.
 *
 * Toutes les pages passent par `buildMetadata` : titre, description,
 * canonique, Open Graph et robots sont decides ici et nulle part ailleurs.
 *
 * Regle d'environnement : `site.url` vaut `null` en production quand
 * `NEXT_PUBLIC_SITE_URL` est absente ou invalide (voir `resolveSiteOrigin`).
 * Dans ce cas AUCUNE URL absolue n'est emise — pas de canonique, pas d'URL
 * Open Graph — plutot qu'une canonique `localhost` ou vide.
 */

/* -------------------------------------------------------------------------- */
/* Garde-fou de preproduction                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Interrupteur global d'indexation.
 *
 * Le site est deploye publiquement AVANT d'avoir son contenu definitif : sans
 * ce garde-fou, des pages d'attente entreraient dans l'index et abimeraient
 * durablement le domaine.
 *
 * Vaut `true` uniquement si `NEXT_PUBLIC_SITE_INDEXABLE` est exactement
 * `"true"`. Toute autre valeur — absente, vide, `"false"`, `"1"`, `"TRUE"` —
 * laisse le site non indexable. Le defaut est donc le comportement SUR.
 *
 * A basculer une seule fois, au lancement definitif (phase 18 de ROADMAP.md).
 */
export const SITE_INDEXABLE =
  process.env.NEXT_PUBLIC_SITE_INDEXABLE?.trim() === "true";

/**
 * Une route est indexable si le site l'est ET si la route n'est pas marquee
 * `noindex` pour son propre compte (cas de `/style-guide`).
 */
export function isRouteIndexable(route: RouteDefinition): boolean {
  return SITE_INDEXABLE && !route.noindex;
}

/**
 * Directives `robots` d'une route. Trois cas, et trois seulement :
 *
 * 1. route interne (`route.noindex`) — `noindex, nofollow, nocache`, quel que
 *    soit l'etat du site ;
 * 2. site non indexable — `noindex, follow` : les pages restent explorees et
 *    les liens internes suivis, donc la structure du site continue d'etre
 *    comprise, mais rien n'entre dans l'index ;
 * 3. site indexable — comportement SEO normal de la phase 3.
 */
function robotsFor(route: RouteDefinition): Metadata["robots"] {
  if (route.noindex) {
    return {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    };
  }

  if (!SITE_INDEXABLE) {
    return {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

/**
 * Image Open Graph partagee.
 *
 * VOLONTAIREMENT NULL tant que la phototheque client n'est pas livree :
 * la charte impose une photographie REELLE (aucune image generee), et une
 * balise `og:image` pointant vers un fichier absent est pire que son absence.
 *
 * Pour l'activer partout : deposer la photo dans `public/og/`, renseigner
 * l'objet ci-dessous (1200 x 630, JPEG optimise), c'est tout.
 */
const OG_IMAGE: {
  url: string;
  width: number;
  height: number;
  alt: string;
} | null = null;

/**
 * Construit une URL absolue a partir d'un chemin interne.
 * Retourne `null` si aucune origine publique valide n'est disponible.
 */
export function absoluteUrl(path: string): string | null {
  if (!site.url) {
    return null;
  }

  const url = new URL(path, site.url).toString();

  // Une seule variante d'URL fait autorite : jamais de slash final, sauf sur
  // la racine ou l'origine nue est deja la forme canonique.
  return url.length > site.url.length ? url.replace(/\/$/, "") : site.url;
}

export function buildMetadata(id: RouteId): Metadata {
  const route = getRoute(id);

  // Pas de canonique — ni d'`og:url` — sur une page non indexable. Demander a
  // la fois de ne pas indexer et de designer une URL de reference est
  // contradictoire ; surtout, cela eviterait de declarer comme canonique
  // l'URL de preproduction Vercel, qui n'est pas l'adresse definitive du site.
  const canonical = isRouteIndexable(route) ? absoluteUrl(route.path) : null;

  const title = route.titleAbsolute
    ? { absolute: route.title }
    : route.title;

  return {
    title,
    description: route.description,

    // Omise si aucune origine publique n'est disponible.
    ...(canonical ? { alternates: { canonical } } : {}),

    robots: robotsFor(route),

    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: site.name,
      title: route.titleAbsolute ? route.title : `${route.title} | ${site.name}`,
      description: route.description,
      ...(canonical ? { url: canonical } : {}),
      ...(OG_IMAGE ? { images: [OG_IMAGE] } : {}),
    },

    twitter: {
      card: OG_IMAGE ? "summary_large_image" : "summary",
      title: route.titleAbsolute ? route.title : `${route.title} | ${site.name}`,
      description: route.description,
      ...(OG_IMAGE ? { images: [OG_IMAGE.url] } : {}),
    },
  };
}
