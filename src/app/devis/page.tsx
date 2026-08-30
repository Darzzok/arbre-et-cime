import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("devis");

export default function DevisPage() {
  return (
    <PlaceholderPage
      id="devis"
      eyebrow="Devis gratuit et sans engagement"
      heading="Demander un devis"
      lead="Décrire le chantier, joindre quelques photos, indiquer le lieu : de quoi établir un devis rapidement, et souvent sans visite préalable."
      upcoming={[
        "Un parcours en cinq étapes : besoin, informations chantier, photos, lieu, coordonnées",
        "L’ajout de photos, qui accélère et fiabilise le chiffrage",
        "Un récapitulatif modifiable avant l’envoi",
        "La confirmation de réception et le délai de réponse annoncé",
      ]}
      phase="phases 11 à 13"
      related={["contact", "elagage", "abattage"]}
    />
  );
}
