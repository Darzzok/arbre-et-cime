import type { Metadata } from "next";

import { ServicePage } from "@/components/services/service-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("elagage");

/**
 * Page service. Structure et contenu sont fournis par `ServicePage` et
 * `src/lib/services-content.ts` — voir la note de ce dernier sur la
 * différenciation réelle entre les quatre pages.
 */
export default function ElagagePage() {
  return <ServicePage id="elagage" />;
}
