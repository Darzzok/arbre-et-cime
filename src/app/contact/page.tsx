import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("contact");

export default function ContactPage() {
  return (
    <PlaceholderPage
      id="contact"
      eyebrow="Contact"
      heading="Nous joindre"
      lead="Pour un chantier à Rouen ou dans la métropole rouennaise, un conseil sur un arbre, ou une intervention en urgence après un coup de vent."
      upcoming={[
        "Le téléphone, canal principal, y compris pour les urgences",
        "L’adresse e-mail et les créneaux de disponibilité",
        "Le renvoi vers le devis en ligne pour une demande détaillée",
        "Un rappel de la zone d’intervention",
      ]}
      phase="phase 4, dès que les coordonnées publiques seront confirmées"
      related={["devis", "zones-intervention"]}
    />
  );
}
