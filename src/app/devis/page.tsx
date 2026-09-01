import type { Metadata } from "next";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { QuoteConfigurator } from "@/components/quote";
import { Container, Display, Eyebrow, Lead, Section } from "@/components/ui";
import { ESTIMATED_MINUTES, STEP_COUNT } from "@/lib/quote";
import { buildMetadata } from "@/lib/seo";
import { area, site } from "@/lib/site";

export const metadata: Metadata = buildMetadata("devis");

/**
 * Page du configurateur de devis — livrée en phase 11 (interface seule).
 *
 * **Composant serveur.** Seul `<QuoteConfigurator>` est client : l'en-tête
 * éditorial, le `h1` et les repères de confiance sont dans le HTML initial,
 * lisibles sans JavaScript et sans coût d'hydratation.
 *
 * SEO : la page est une page de conversion, pas une page éditoriale
 * (`SEO_STRATEGY.md`). Ses métadonnées et sa canonique viennent de
 * `routes.ts` via `buildMetadata`, un seul `h1`, et **aucun texte ajouté pour
 * les moteurs**.
 *
 * L'isolement visuel demandé au brief vient du cadre, pas d'un changement de
 * châssis : en-tête et pied de page du site sont conservés, mais la page n'a
 * ni photo de couverture, ni section annexe, ni maillage interne en bas de
 * page. Rien ne dispute l'attention au parcours.
 */
export default function DevisPage() {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <Section surface="light" spacing="tight">
        <Container width="prose">
          <Eyebrow>Devis gratuit et sans engagement</Eyebrow>

          <Display as="h1" className="mt-4 text-title">
            Demander un devis
          </Display>

          <Lead className="mt-5 text-(--surface-fg-muted)">
            {STEP_COUNT} étapes, environ {ESTIMATED_MINUTES} minutes. Décrivez
            le chantier, ajoutez quelques photos : {site.shortName} vous répond
            avec un chiffrage, souvent sans visite préalable.
          </Lead>
        </Container>
      </Section>

      {/*
        Le configurateur occupe une largeur supérieure à la colonne de lecture :
        les cartes de l'étape 1 et les pastilles de l'étape 2 ont besoin de deux
        colonnes au-delà de 480 px, sans quoi le parcours s'allonge inutilement.
      */}
      <Section surface="light" spacing="none" plain className="pb-(--section-space)">
        {/*
          `width="full"` et non la largeur par défaut : `cn()` ne fusionne pas
          les classes Tailwind concurrentes, et `max-w-content` resterait posée
          à côté de `max-w-[52rem]` — c'est la première qui gagnait, le
          configurateur s'étalant sur 1 144 px au lieu de 832.
        */}
        <Container width="full" className="max-w-[52rem]">
          <QuoteConfigurator />
        </Container>
      </Section>

      {/* Repères de confiance, sous le parcours : ils rassurent sans détourner. */}
      <Section surface="light" spacing="tight" plain>
        <Container width="prose">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-(--surface-rule) pt-8 font-sans text-caption text-(--surface-fg-muted)">
            <li>Devis gratuit</li>
            <li>Sans engagement</li>
            <li>Données non transmises à des tiers</li>
            <li>{area.metro} et jusqu’à {area.maxRadiusKm} km</li>
          </ul>
        </Container>
      </Section>
    </main>
  );
}
