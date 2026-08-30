import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("elagage");

export default function ElagagePage() {
  return (
    <PlaceholderPage
      id="elagage"
      eyebrow="Prestation"
      heading="Élagage et taille douce"
      lead="Tailler un arbre que l’on conserve : réduire, éclaircir, sécuriser, sans compromettre sa santé ni sa forme naturelle."
      upcoming={[
        "Les types de taille pratiqués et ce qui les distingue",
        "Le travail en grimpe, sur cordes et harnais, là où la nacelle ne passe pas",
        "Les périodes d’intervention selon l’essence, sous climat normand",
        "Ce qui fait varier un devis : hauteur, accès, essence, évacuation",
        "Les questions les plus fréquentes des propriétaires",
      ]}
      phase="phase 7"
      related={["abattage", "entretien-exterieur", "devis"]}
    />
  );
}
