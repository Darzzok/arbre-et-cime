import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("realisations");

export default function RealisationsPage() {
  return (
    <PlaceholderPage
      id="realisations"
      eyebrow="Preuve par l’exemple"
      heading="Chantiers réalisés"
      lead="Des photographies réelles de chantiers menés à Rouen et dans la métropole, avec à chaque fois la commune, la prestation et la contrainte particulière."
      upcoming={[
        "Une sélection de chantiers datés et situés",
        "Des avant/après lorsque la comparaison est parlante",
        "Les chantiers d’accès difficile, les plus représentatifs du métier",
      ]}
      phase="phase 9, une fois la photothèque livrée"
      related={["elagage", "abattage", "devis"]}
    />
  );
}
