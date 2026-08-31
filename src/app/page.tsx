import type { Metadata } from "next";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { Hero } from "@/components/sections/hero";
import { ProofBand } from "@/components/sections/proof-band";
import { Realisations } from "@/components/sections/realisations";
import { Services } from "@/components/sections/services";
import { Why } from "@/components/sections/why";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("home");

/**
 * Page d'accueil.
 *
 * Structure VERROUILLÉE à 7 sections + footer (voir PROJECT.md) :
 *   1. Hero photo plein écran            — livré en phase 5B
 *   2. Preuves                           — livré en phase 6
 *   3. Prestations                       — livré en phase 6
 *   4. Pourquoi Arbre et Cime            — livré en phase 8
 *   5. Réalisations                      — livré en phase 9
 *   6. Zone d'intervention               — phase 10
 *   7. Devis interactif                  — phases 11 à 13
 *
 * N'ajouter aucune autre section sans demande explicite du client.
 */
export default function Home() {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <Hero />
      <ProofBand />
      <Services />
      <Why />
      <Realisations />
    </main>
  );
}
