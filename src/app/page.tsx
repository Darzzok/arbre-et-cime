import type { Metadata } from "next";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { Container, Display, Eyebrow, Lead, Section, Small } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { area, site } from "@/lib/site";

export const metadata: Metadata = buildMetadata("home");

/**
 * Page d'attente.
 * La homepage definitive est VERROUILLEE a 7 sections + footer (voir
 * PROJECT.md). Elle sera construite phase par phase a partir de la phase 5 de
 * ROADMAP.md — ce fichier ne prefigure ni sa structure ni son design.
 */
export default function Home() {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <Section
        surface="dark"
        spacing="loose"
        aria-labelledby="accueil-titre"
        className="flex min-h-dvh items-center"
      >
        <Container>
          <Eyebrow>Socle technique — chantier en cours</Eyebrow>

          <Display id="accueil-titre" className="mt-5 max-w-[14ch]">
            {site.name}
          </Display>

          <Lead className="mt-6 max-w-reading">
            {site.trade} à {area.city} et dans la {area.metro}. Environ{" "}
            {site.experienceYears} ans d’expérience, devis gratuit, intervention
            rapide et chantier propre.
          </Lead>

          <Small className="mt-8 max-w-reading">
            Le design et les sections du site sont documentés dans les fichiers
            de référence à la racine du dépôt et seront développés phase par
            phase.
          </Small>
        </Container>
      </Section>
    </main>
  );
}
