import Link from "next/link";

import { NavCta } from "@/components/layout/nav-cta";
import { Wordmark } from "@/components/layout/wordmark";
import { Body, Container, Eyebrow, Small } from "@/components/ui";
import { cn } from "@/lib/cn";
import { footerGroups, getRoute } from "@/lib/routes";
import { area, site } from "@/lib/site";

/**
 * Pied de page. Composant SERVEUR : aucun etat, aucun JavaScript.
 *
 * Ne contient AUCUNE donnee inventee. Le telephone, l'e-mail et l'adresse ne
 * s'affichent que lorsqu'ils existent reellement dans l'environnement ; a
 * defaut ils disparaissent, plutot que d'afficher un numero fictif.
 */
export function SiteFooter() {
  const hasPhone = site.phone.length > 0;
  const hasEmail = site.email.length > 0;

  return (
    <footer data-surface="dark" className="bg-(--surface-bg) text-(--surface-fg)">
      <Container className="py-12 lg:py-16">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-24">
          {/* -------- Identite -------- */}
          <div className="lg:max-w-80">
            <Wordmark size="lg" />
            <Body className="mt-5 text-(--surface-fg-muted)">
              {site.trade} à {area.city} et dans la {area.metro}. Élagage,
              abattage, dessouchage et entretien extérieur.
            </Body>
            <Body className="mt-3 text-(--surface-fg-muted)">
              Déplacement possible jusqu’à {area.maxRadiusKm} km selon les
              chantiers.
            </Body>

            {hasPhone || hasEmail ? (
              <ul className="mt-5 flex flex-col items-center gap-1">
                {hasPhone ? (
                  <li>
                    <a
                      href={`tel:${site.phone}`}
                      className="font-sans text-body font-semibold text-(--surface-fg) underline decoration-1 underline-offset-[0.25em] decoration-(--surface-rule)"
                    >
                      {site.phoneDisplay || site.phone}
                    </a>
                  </li>
                ) : null}
                {hasEmail ? (
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="font-sans text-body text-(--surface-fg) underline decoration-1 underline-offset-[0.25em] decoration-(--surface-rule)"
                    >
                      {site.email}
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}

            {/* CTA éditorial, pas un aplat jaune : chaque page se termine déjà
                par un bouton plein quelques centaines de pixels plus haut. Deux
                aplats coup sur coup enfreindraient la règle de parcimonie
                (DESIGN_SYSTEM.md § 1) et alourdiraient le pied de page. */}
            <div className="mt-7">
              <NavCta />
            </div>
          </div>

          {/* -------- Colonnes de liens -------- */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-16">
            {footerGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <Eyebrow as="p">{group.title}</Eyebrow>
                <ul className="mt-4 flex flex-col items-center gap-1">
                  {group.ids.map((id) => {
                    const route = getRoute(id);
                    return (
                      <li key={id}>
                        <Link
                          href={route.path}
                          className={cn(
                            "inline-flex min-h-9 items-center font-sans text-body",
                            "text-(--surface-fg-muted) no-underline",
                            "transition-colors duration-(--duration-micro) ease-cime",
                            "hover:text-(--surface-fg) focus-visible:text-(--surface-fg)",
                          )}
                        >
                          {route.navLabel}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-(--surface-rule) pt-6">
          <Small>
            © {new Date().getFullYear()} {site.name} — {area.city},{" "}
            {area.department}. Site en cours de construction.
          </Small>
        </div>
      </Container>
    </footer>
  );
}
