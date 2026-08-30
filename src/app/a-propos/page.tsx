import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("a-propos");

export default function AProposPage() {
  return (
    <PlaceholderPage
      id="a-propos"
      eyebrow="L’entreprise"
      heading="Arbre et Cime Élagage"
      lead="Une entreprise d’élagage-grimpe établie dans la région rouennaise, portée par une dizaine d’années de pratique du métier."
      upcoming={[
        "Le parcours et les qualifications : CS Taille et soins des arbres, BP Paysagiste",
        "La méthode de travail : grimpe, sécurité, propreté du chantier",
        "Le matériel professionnel utilisé",
        "Les attestations d’assurance et les informations légales de l’entreprise",
      ]}
      phase="phase 8"
      related={["realisations", "contact"]}
    />
  );
}
