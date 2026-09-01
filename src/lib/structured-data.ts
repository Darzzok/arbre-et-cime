import { area, services, site } from "./site";
import { breadcrumbFor, getRoute, type RouteId } from "./routes";
import { absoluteUrl, isRouteIndexable, SITE_INDEXABLE } from "./seo";

/**
 * Donnees structurees (JSON-LD).
 *
 * PRINCIPE : on ne balise que des faits verifies. Chaque fabrique retourne
 * `null` tant qu'une donnee indispensable manque, et le composant `<JsonLd>`
 * ne rend alors rien. Aucune valeur n'est inventee, aucune valeur de
 * remplissage n'est emise : un balisage faux est plus penalisant qu'un
 * balisage absent.
 */

export type JsonLdNode = Record<string, unknown>;

/* -------------------------------------------------------------------------- */
/* Fil d'Ariane — seul schema actif a ce stade                                 */
/* -------------------------------------------------------------------------- */

/**
 * Ne depend d'aucune donnee client en attente : uniquement des routes et de
 * l'origine publique. Actif des que `NEXT_PUBLIC_SITE_URL` est renseignee ET
 * que le site est indexable — un balisage decrivant la place d'une page dans
 * un site qui ne doit pas etre indexe n'aurait aucun destinataire, et
 * pointerait vers l'URL de preproduction.
 */
export function breadcrumbSchema(id: RouteId): JsonLdNode | null {
  const trail = breadcrumbFor(id);

  if (!site.url || trail.length < 2 || !isRouteIndexable(getRoute(id))) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.path),
    })),
  };
}

/* -------------------------------------------------------------------------- */
/* LocalBusiness — EN ATTENTE de donnees client                                */
/* -------------------------------------------------------------------------- */

/**
 * Informations encore manquantes pour publier un `LocalBusiness` honnete.
 * Cette liste est la reference de la phase 14 : tant qu'elle n'est pas vide,
 * `localBusinessSchema()` retourne `null`.
 */
export function missingLocalBusinessData(): readonly string[] {
  const missing: string[] = [];

  if (!site.url) missing.push("NEXT_PUBLIC_SITE_URL (domaine definitif)");
  if (!site.phone) missing.push("NEXT_PUBLIC_PHONE (telephone public)");
  if (!site.email) missing.push("NEXT_PUBLIC_EMAIL (e-mail public)");

  // Non modelisees dans le code tant qu'elles ne sont pas confirmees : publier
  // une adresse ou des horaires approximatifs abimerait la coherence NAP avec
  // la fiche Google Business Profile (cf. SEO_STRATEGY.md).
  missing.push("adresse postale OU choix explicite d'une zone de service seule");
  missing.push("horaires d'ouverture et conditions d'urgence");
  missing.push("raison sociale et SIREN");

  return missing;
}

/**
 * Retourne `null` tant que `missingLocalBusinessData()` n'est pas vide.
 * La forme ci-dessous documente la structure cible ; elle n'est jamais emise
 * partiellement.
 */
export function localBusinessSchema(): JsonLdNode | null {
  if (missingLocalBusinessData().length > 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${site.url}#entreprise`,
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    areaServed: [
      { "@type": "City", name: area.city },
      { "@type": "AdministrativeArea", name: area.metro },
      { "@type": "AdministrativeArea", name: area.department },
    ],
    knowsAbout: services.map((service) => service.label),
  };
}

/* -------------------------------------------------------------------------- */
/* Service — depend de LocalBusiness                                           */
/* -------------------------------------------------------------------------- */

/**
 * Un `Service` sans fournisseur identifie n'a aucune valeur : ce schema reste
 * donc gele tant que `localBusinessSchema()` retourne `null`.
 */
export function serviceSchema(id: RouteId): JsonLdNode | null {
  const provider = localBusinessSchema();
  const route = getRoute(id);
  const url = absoluteUrl(route.path);

  if (!provider || !url || route.group !== "service") {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: route.navLabel,
    description: route.description,
    url,
    serviceType: route.navLabel,
    provider: { "@id": `${site.url}#entreprise` },
    areaServed: [
      { "@type": "City", name: area.city },
      { "@type": "AdministrativeArea", name: area.metro },
    ],
  };
}

/* -------------------------------------------------------------------------- */
/* Pages locales (phase 14)                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Fil d'Ariane d'une page ville : Accueil > Zone d'intervention > Ville.
 *
 * C'est le SEUL JSON-LD emis par une page ville, et c'est deliberé.
 *
 * **Aucun `LocalBusiness` par commune.** Arbres & Cimes est une entreprise
 * unique, basee a Rouen ; declarer vingt-trois etablissements reviendrait a
 * affirmer vingt-trois implantations qui n'existent pas. Une page ville decrit
 * une **zone de service**, pas une agence — et une adresse locale inventee est
 * exactement le genre de donnee qui detruit la confiance d'un moteur comme
 * d'un visiteur.
 *
 * Le `LocalBusiness` unique du site reste gele tant que les donnees client
 * manquent (voir `missingLocalBusinessData`), et `areaServed` sera le bon
 * endroit pour exprimer la couverture geographique le jour venu.
 */
export function locationBreadcrumbSchema(input: {
  slug: string;
  nom: string;
}): JsonLdNode | null {
  const zones = getRoute("zones-intervention");
  const home = getRoute("home");

  // Meme garde que `breadcrumbSchema` : un balisage decrivant la place d'une
  // page dans un site qui ne doit pas etre indexe n'a aucun destinataire, et
  // pointerait vers l'URL de preproduction.
  if (!site.url || !SITE_INDEXABLE) {
    return null;
  }

  const items = [
    { label: home.navLabel, path: home.path },
    { label: zones.navLabel, path: zones.path },
    { label: input.nom, path: `${zones.path}/${input.slug}` },
  ];

  const listItems = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: absoluteUrl(item.path),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: listItems,
  };
}
