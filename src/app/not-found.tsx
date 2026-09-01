import type { Metadata } from "next";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import {
  ArrowLink,
  Body,
  ButtonLink,
  Container,
  Display,
  Eyebrow,
  Section,
} from "@/components/ui";
import { getRoute, serviceRoutes } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Page 404.
 *
 * Ajoutée en phase 14 après audit : sans elle, Next servait la page d'erreur
 * par défaut, qui **héritait du titre de la page d'accueil**. Deux URLs
 * différentes portaient donc le même `<title>` — exactement le genre de
 * duplication qu'un audit doit lever, et un mauvais signal si le site venait à
 * être exploré.
 *
 * `noindex, follow` en dur, quel que soit l'état du site : une page 404 ne
 * s'indexe jamais, même après le lancement. C'est la seule page dont la
 * directive ne dépend pas de `SITE_INDEXABLE` — parce que la règle ne dépend
 * pas de l'environnement, elle est absolue.
 *
 * Pas de canonique : une URL introuvable n'a pas d'URL de référence.
 *
 * Le contenu est utile plutôt que décoratif. Une 404 sur un site local sert
 * surtout à rattraper une faute de frappe ou un lien périmé : les quatre pages
 * services, la zone d'intervention et le devis y sont donc directement
 * accessibles.
 */
export const metadata: Metadata = {
  title: { absolute: `Page introuvable | ${site.name}` },
  description:
    "Cette page n’existe pas ou plus. Retrouvez les prestations d’élagage, d’abattage et d’entretien extérieur d’Arbres et Cimes, ou demandez un devis.",
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function NotFound() {
  const zones = getRoute("zones-intervention");
  const devis = getRoute("devis");

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <Section surface="light">
        <Container width="prose">
          <Eyebrow>Erreur 404</Eyebrow>

          <Display as="h1" className="mt-4 text-title">
            Cette page n’existe pas
          </Display>

          <Body className="mt-5 text-(--surface-fg-muted)">
            Le lien est peut-être périmé, ou l’adresse comporte une faute de
            frappe. Voici par où reprendre.
          </Body>

          <ul className="mt-10 grid gap-x-8 gap-y-4 text-left sm:grid-cols-2">
            {serviceRoutes.map((route) => (
              <li
                key={route.id}
                className="border-t border-(--surface-rule) pt-3"
              >
                <ArrowLink href={route.path}>{route.navLabel}</ArrowLink>
              </li>
            ))}
            <li className="border-t border-(--surface-rule) pt-3">
              <ArrowLink href={zones.path}>{zones.navLabel}</ArrowLink>
            </li>
            <li className="border-t border-(--surface-rule) pt-3">
              <ArrowLink href={getRoute("realisations").path}>
                {getRoute("realisations").navLabel}
              </ArrowLink>
            </li>
          </ul>

          <div className="mt-12 flex justify-center">
            <ButtonLink href={devis.path} variant="primary" size="lg">
              Demander un devis
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </main>
  );
}
