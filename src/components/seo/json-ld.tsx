import type { JsonLdNode } from "@/lib/structured-data";

type JsonLdProps = {
  /** Schema a emettre. `null` = rien n'est rendu (donnee non confirmee). */
  data: JsonLdNode | null;
};

/**
 * Emet un bloc JSON-LD, ou rien du tout.
 *
 * Ne rend jamais de balise vide : une fabrique de `structured-data.ts` qui
 * retourne `null` disparait simplement du HTML.
 */
export function JsonLd({ data }: JsonLdProps) {
  if (!data) {
    return null;
  }

  // `<` est echappe : un contenu textuel ne peut pas refermer la balise script.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
