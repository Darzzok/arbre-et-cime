import Link from "next/link";

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
    // Filet supérieur : délimite le pied de page quand la section qui le
    // précède est elle aussi sombre. Invisible sur fond clair.
    <footer
      data-surface="dark"
      className="border-t border-(--surface-rule) bg-(--surface-bg) text-(--surface-fg)"
    >
      <Container className="py-12 lg:py-16">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-24">
          {/* -------- Identite -------- */}
          <div className="lg:max-w-80">
            {/*
              PAS `variant="full"` ici, malgre la place disponible.

              Le logo fourni est dessine POUR FOND CLAIR : son contour et son
              texte sont en charbon (#3C3C3B). Pose sur le foret du pied de
              page, « Arbres et Cimes Élagage » devient quasi illisible —
              verifie a l'ecran, ce n'est pas une precaution theorique.

              Le lockup garde donc le symbole (dont le vert reste lisible) et
              compose le nom dans la typographie du site, en ivoire.

              `variant="full"` reste disponible et correct : il pourra servir
              le jour ou le client fournira une version claire/inversee du
              logo, ou sur une surface claire.
            */}
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

            {/* Le CTA « Demander un devis » a ete RETIRE du pied de page sur
                demande du client (phase 15B). Le devis reste accessible depuis
                l'en-tete sur toutes les pages, depuis la barre d'action mobile,
                et depuis le bloc de conversion qui termine chaque page — soit
                trois points d'entree deja presents au moment ou le visiteur
                atteint le pied de page. Le lien « Devis gratuit » de la colonne
                de navigation, lui, reste : c'est un lien de liste, pas un
                appel a l'action. */}
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
                            // 44 px : la regle du projet (`CLAUDE.md` § 5). Ces liens etaient a
// 36 px — mesure en phase 15, seul endroit du site ou la regle etait
// enfreinte. La hauteur de la zone tactile change, pas celle du texte.
"inline-flex min-h-11 items-center font-sans text-body",
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
