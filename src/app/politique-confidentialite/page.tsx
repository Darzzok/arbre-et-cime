import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("politique-confidentialite");

export default function PolitiqueConfidentialitePage() {
  return (
    <PlaceholderPage
      id="politique-confidentialite"
      eyebrow="Informations légales"
      heading="Politique de confidentialité"
      lead="Cette page décrira les données collectées par le formulaire de devis, leur finalité, leur durée de conservation et la façon d’exercer ses droits."
      upcoming={[
        "Les données recueillies par le configurateur de devis, et pourquoi",
        "Le sort des photographies de chantier transmises",
        "La durée de conservation des demandes",
        "Les destinataires : aucun tiers en dehors des prestataires techniques",
        "L’exercice des droits d’accès, de rectification et de suppression",
      ]}
      phase="phase 18, avant la mise en production"
      related={["mentions-legales", "devis"]}
    />
  );
}
