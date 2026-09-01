import type { Metadata } from "next";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { QuoteConfigurator } from "@/components/quote";
import {
  Capsule,
  CapsuleGroup,
  Container,
  Display,
  Lead,
  Reveal,
  Section,
} from "@/components/ui";
import { ESTIMATED_MINUTES, STEP_COUNT } from "@/lib/quote";
import { buildMetadata } from "@/lib/seo";
import { area, site } from "@/lib/site";

export const metadata: Metadata = buildMetadata("devis");

/**
 * Page du configurateur de devis — interface livrée en phase 11, présentation
 * revue en phase 15B.6.
 *
 * **Composant serveur.** Seul `<QuoteConfigurator>` est client : l'entrée
 * éditoriale, le `h1` et les repères de confiance sont dans le HTML initial,
 * lisibles sans JavaScript et sans coût d'hydratation.
 *
 * LE `h1` RESTE « DEMANDER UN DEVIS »
 * -----------------------------------
 * Le brief de la phase 15B.6 proposait « Parlons de votre chantier ». Cette
 * formulation est allée à `/contact` : c'est là qu'elle décrit ce que le
 * visiteur vient faire. Ici, une soixantaine de boutons du site portent
 * exactement les mots « Demander un devis » — arriver sur une page qui les
 * répète est ce qui confirme au visiteur qu'il est au bon endroit. Changer le
 * titre romprait cette continuité, et le titre de la route dans `routes.ts`
 * dit déjà la même chose.
 *
 * L'ISOLEMENT VISUEL EST DÉLIBÉRÉ
 * -------------------------------
 * En-tête et pied de page sont conservés, mais la page n'a ni photo de
 * couverture, ni section annexe, ni maillage interne en bas de page. **Rien ne
 * dispute l'attention au parcours** — c'est la seule page du site dans ce cas,
 * et c'est ce qui la fait aboutir.
 *
 * SEO : page de conversion, pas page éditoriale (`SEO_STRATEGY.md`).
 * Métadonnées et canonique viennent de `routes.ts`, un seul `h1`, et **aucun
 * texte ajouté pour les moteurs**.
 */
export default function DevisPage() {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      {/* ------------------------------------------- 1. Entrée compacte ---
          `spacing="compact"` et non `standard` : sur cette page, chaque pixel
          au-dessus de la première question est un pixel qui retarde le
          parcours. */}
      <Section surface="sand" spacing="compact">
        <Container width="prose">
          <Reveal>
            <CapsuleGroup>
              <Capsule variant="accent">Devis gratuit</Capsule>
              <Capsule variant="light">
                Environ {ESTIMATED_MINUTES} minutes
              </Capsule>
              <Capsule variant="light">{STEP_COUNT} étapes</Capsule>
            </CapsuleGroup>

            <Display as="h1" className="mt-6 text-title">
              Demander un devis
            </Display>

            <Lead className="mt-5 text-(--surface-fg-muted)">
              Décrivez le chantier, ajoutez quelques photos : {site.shortName}{" "}
              vous répond avec un chiffrage, souvent sans visite préalable.
            </Lead>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------ 2. Parcours ---
          Le configurateur occupe une largeur supérieure à la colonne de
          lecture : les cartes de l'étape 1 et les pastilles de l'étape 2 ont
          besoin de deux colonnes au-delà de 480 px, sans quoi le parcours
          s'allonge inutilement. */}
      <Section surface="light">
        {/*
          `width="full"` et non la largeur par défaut : `cn()` ne fusionne pas
          les classes Tailwind concurrentes, et `max-w-content` resterait posée
          à côté de `max-w-[56rem]` — c'est la première qui gagnait, le
          configurateur s'étalant sur 1 144 px au lieu de 896.
        */}
        <Container width="full" className="max-w-[56rem]">
          <QuoteConfigurator />

          {/* Repères de confiance, sous le parcours : ils rassurent sans
              détourner. En capsules depuis la phase 15B.6 — une ligne de texte
              séparée par des filets se lisait comme une note de bas de page. */}
          <Reveal className="mt-10 lg:mt-12">
            <CapsuleGroup>
              <Capsule variant="light" dot>
                Sans engagement
              </Capsule>
              <Capsule variant="light" dot>
                Données non transmises à des tiers
              </Capsule>
              <Capsule variant="light" dot>
                {area.metro}, jusqu’à {area.maxRadiusKm} km
              </Capsule>
            </CapsuleGroup>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
