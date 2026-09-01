"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useScrollPast } from "@/components/layout/use-scroll-past";
import { cn } from "@/lib/cn";
import { ctaRouteId, getRoute, routeList, type RouteId } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Barre d'action persistante, mobile uniquement.
 *
 * Le trafic attendu est majoritairement mobile et souvent urgent : les actions
 * de conversion doivent rester atteignables au pouce (cf.
 * CONVERSION_STRATEGY.md).
 */

/**
 * Mécanisme de désactivation, page par page.
 *
 * Ajouter une `RouteId` ici suffit à masquer la barre sur cette page — prévu
 * pour `/devis`, où le configurateur portera lui-même son action principale et
 * où une barre fixe gênerait la saisie.
 * Laissé vide aujourd'hui : aucune page n'a encore de raison de la masquer.
 */
/*
 * Sur /devis, la barre proposerait « Devis gratuit » à quelqu'un qui est déjà
 * dans le configurateur, et recouvrirait ses boutons Retour / Continuer —
 * les deux cibles les plus utilisées de la page. L'appel reste accessible par
 * l'en-tête et par l'écran final du parcours.
 */
const HIDDEN_ON: readonly RouteId[] = ["devis"];

const cta = getRoute(ctaRouteId);

export function MobileActionBar() {
  const pathname = usePathname();

  /*
   * Sur une page à hero photo, la barre ne doit pas recouvrir le visuel dès
   * l'arrivée : elle apparaît une fois les trois quarts du premier écran
   * franchis. Sur les pages internes, qui n'ont pas de hero, elle est là
   * immédiatement.
   */
  const overlayRoute =
    routeList.find((route) => route.path === pathname)?.headerVariant ===
    "overlay";
  const pastHero = useScrollPast(0, 0.75);
  const visible = !overlayRoute || pastHero;

  const hidden = HIDDEN_ON.some((id) => getRoute(id).path === pathname);

  if (hidden) {
    return null;
  }

  // Aucun numéro n'est inventé : tant que `NEXT_PUBLIC_PHONE` n'est pas
  // renseignée, l'action téléphone disparaît et le devis occupe toute la
  // largeur. Renseigner la variable suffit à la faire apparaître.
  const hasPhone = site.phone.length > 0;

  return (
    <>
      {/*
       * Cale rendue en permanence, même quand la barre est encore masquée :
       * la hauteur du document reste stable, et l'apparition de la barre ne
       * provoque aucun saut de défilement.
       */}
      <div
        aria-hidden="true"
        className="h-[calc(3.75rem+env(safe-area-inset-bottom))] lg:hidden"
      />

      <div
        data-surface="dark"
        aria-hidden={!visible}
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 lg:hidden",
          "border-t border-(--surface-rule) bg-forest/95",
          "pb-[env(safe-area-inset-bottom)]",
          "motion-safe:transition-[transform,opacity]",
          "motion-safe:duration-(--duration-reveal) motion-safe:ease-cime",
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0",
        )}
      >
        <nav
          aria-label="Actions rapides"
          className={cn(
            "mx-auto flex max-w-content items-stretch",
            "divide-x divide-(--surface-rule) px-(--gutter)",
          )}
        >
          {hasPhone ? (
            <a
              href={`tel:${site.phone}`}
              tabIndex={visible ? undefined : -1}
              className={cn(
                "flex min-h-15 flex-1 items-center justify-center gap-2.5",
                "font-sans text-body font-semibold text-(--surface-fg)",
                "no-underline",
              )}
            >
              <PhoneGlyph />
              Appeler
            </a>
          ) : null}

          {/*
           * Action principale. Le jaune sécurité reste une TOUCHE — le libellé
           * et la flèche — et non un aplat plein largeur : la charte impose la
           * parcimonie, et un bandeau jaune de bord à bord en bas d'écran
           * écraserait la photographie autant que le contenu.
           */}
          <Link
            href={cta.path}
            tabIndex={visible ? undefined : -1}
            className={cn(
              "group flex min-h-15 flex-1 items-center justify-center gap-2.5",
              "font-sans text-body font-semibold text-(--color-safety)",
              "no-underline",
            )}
          >
            Demander un devis
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-4 shrink-0"
            >
              <path
                d="M2 8h11M9 4l4 4-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </Link>
        </nav>
      </div>
    </>
  );
}

function PhoneGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0">
      <path
        d="M3 2.5h3l1 3-1.5 1a7 7 0 0 0 3 3l1-1.5 3 1v3a1 1 0 0 1-1 1A11 11 0 0 1 2 3.5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}
