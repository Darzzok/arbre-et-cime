import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("mentions-legales");

export default function MentionsLegalesPage() {
  return (
    <PlaceholderPage
      id="mentions-legales"
      eyebrow="Informations légales"
      heading="Mentions légales"
      lead="Cette page publiera les informations légales de l’entreprise et du site, conformément aux obligations applicables."
      upcoming={[
        "L’identité de l’entreprise : raison sociale, forme juridique, SIREN",
        "L’adresse et les coordonnées de contact",
        "Le responsable de la publication et l’hébergeur du site",
        "Les assurances professionnelles souscrites",
      ]}
      phase="phase 18, avant la mise en production"
      related={["politique-confidentialite", "contact"]}
    />
  );
}
