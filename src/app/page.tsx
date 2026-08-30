import type { Metadata } from "next";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { Hero } from "@/components/sections/hero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("home");

/**
 * Page d'accueil.
 *
 * Structure VERROUILLÉE à 7 sections + footer (voir PROJECT.md) :
 *   1. Hero photo plein écran            — livré en phase 5B
 *   2. Preuves                           — phase 6
 *   3. Prestations                       — phase 7
 *   4. Pourquoi Arbre et Cime            — phase 8
 *   5. Réalisations                      — phase 9
 *   6. Zone d'intervention               — phase 10
 *   7. Devis interactif                  — phases 11 à 13
 *
 * N'ajouter aucune autre section sans demande explicite du client.
 */
export default function Home() {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <Hero />
    </main>
  );
}
