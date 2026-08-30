import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("abattage");

export default function AbattagePage() {
  return (
    <PlaceholderPage
      id="abattage"
      eyebrow="Prestation"
      heading="Abattage et démontage"
      lead="Supprimer un arbre devenu dangereux, trop imposant ou condamné — y compris lorsque l’accès interdit la nacelle et impose un démontage par sections."
      upcoming={[
        "Abattage direct et démontage par sections, en rétention",
        "Les cas d’accès difficile ou dangereux : proximité de bâti, ligne électrique, voie publique",
        "La prise en charge des urgences, notamment après un coup de vent",
        "Le devenir du bois et l’évacuation des déchets",
        "Ce qu’il faut vérifier avant d’abattre : réglementation et voisinage",
      ]}
      phase="phase 7"
      related={["dessouchage", "elagage", "devis"]}
    />
  );
}
