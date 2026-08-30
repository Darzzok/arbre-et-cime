import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("entretien-exterieur");

export default function EntretienExterieurPage() {
  return (
    <PlaceholderPage
      id="entretien-exterieur"
      eyebrow="Prestation"
      heading="Taille de haies, débroussaillage et entretien"
      lead="L’entretien récurrent d’un terrain : ramener une haie à hauteur, dégager une parcelle envahie, et repartir avec les déchets."
      upcoming={[
        "Taille de haies : hauteur, largeur et fréquence selon l’essence",
        "Débroussaillage de parcelles et de terrains laissés à l’abandon",
        "Évacuation des déchets verts, selon la nature de l’intervention",
        "L’entretien suivi pour les professionnels et les collectivités",
      ]}
      phase="phase 7"
      related={["elagage", "realisations", "devis"]}
    />
  );
}
