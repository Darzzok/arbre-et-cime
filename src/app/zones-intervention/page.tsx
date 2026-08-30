import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("zones-intervention");

export default function ZonesInterventionPage() {
  return (
    <PlaceholderPage
      id="zones-intervention"
      eyebrow="Zone d’intervention"
      heading="Rouen, sa métropole, et au-delà"
      lead="La zone principale couvre Rouen et la Métropole Rouen Normandie. Un déplacement plus lointain, jusqu’à 100 km, reste possible selon la nature du chantier."
      upcoming={[
        "Les communes de la métropole rouennaise couvertes en zone principale",
        "Une carte de la zone d’intervention",
        "Les conditions d’un déplacement au-delà de la métropole",
        "Le délai d’intervention selon l’éloignement et l’urgence",
      ]}
      phase="phase 10"
      related={["contact", "devis"]}
    />
  );
}
