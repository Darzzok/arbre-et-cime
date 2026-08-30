import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("dessouchage");

export default function DessouchagePage() {
  return (
    <PlaceholderPage
      id="dessouchage"
      eyebrow="Prestation"
      heading="Dessouchage et rognage"
      lead="Faire disparaître une souche après une coupe, pour replanter, poser une terrasse, ou simplement retrouver un terrain praticable."
      upcoming={[
        "Rognage et extraction : deux méthodes, deux résultats, deux budgets",
        "Les contraintes d’accès de la machine selon le terrain",
        "La remise en état du sol après intervention",
        "L’articulation avec un abattage mené le même jour",
      ]}
      phase="phase 7"
      related={["abattage", "entretien-exterieur", "devis"]}
    />
  );
}
