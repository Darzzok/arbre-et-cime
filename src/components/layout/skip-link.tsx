import { cn } from "@/lib/cn";

/** Ancre du contenu principal. Chaque page pose cet `id` sur son `<main>`. */
export const MAIN_CONTENT_ID = "contenu";

/**
 * Lien d'evitement.
 *
 * Invisible tant qu'il n'a pas le focus, il apparait au premier `Tab` et permet
 * de sauter la navigation. Il est rendu en clair sur foret pour rester lisible
 * quelle que soit la variante d'en-tete qui le suit.
 */
export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:absolute focus:left-(--gutter) focus:top-3 focus:z-50",
        "focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-edge",
        "focus:bg-forest focus:px-4 focus:font-sans focus:text-body",
        "focus:font-semibold focus:text-ivory focus:no-underline",
      )}
    >
      Aller au contenu principal
    </a>
  );
}
