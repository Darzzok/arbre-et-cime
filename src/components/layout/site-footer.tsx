import Link from "next/link";

import { NavCta } from "@/components/layout/nav-cta";
import { Wordmark } from "@/components/layout/wordmark";
import {
  Body,
  Capsule,
  Container,
  SectionPattern,
  Small,
  Title,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { footerGroups, getRoute } from "@/lib/routes";
import { area, contact, mailtoHref, site, telHref } from "@/lib/site";

/**
 * Pied de page — refait en phase 15B.2.
 *
 * DEUX ZONES, ET POURQUOI
 * -----------------------
 * 1. **Une zone de conversion** en tête, sur forêt profond : c'est la dernière
 *    occasion de convertir quelqu'un qui a fait défiler toute une page sans
 *    cliquer. Le CTA devis y avait été retiré en phase 15B sur demande ; il
 *    revient ici sous une forme différente — un bloc identifié, pas un lien
 *    perdu dans une colonne.
 * 2. **Un pied compact** : l'identité et les coordonnées à gauche, trois
 *    colonnes de liens à droite, le légal en bas. Volontairement dense — un
 *    pied de page n'est pas une page.
 *
 * COMPOSANT SERVEUR. Aucun état, aucun JavaScript.
 *
 * LE TÉLÉPHONE N'EST PAS INVENTÉ
 * ------------------------------
 * Tout ce qui touche à l'appel passe par `contact.phoneConfirmed`. Tant que le
 * numéro n'est pas confirmé, ni bouton, ni ligne, ni mention.
 */
export function SiteFooter() {
  const mailto = mailtoHref();
  const tel = telHref();

  return (
    <footer
      data-surface="deep-forest"
      className="relative isolate overflow-hidden bg-(--surface-bg) text-(--surface-fg)"
    >
      {/* Motif existant, opacité très basse : une texture, pas un dessin. */}
      <SectionPattern pattern="rings" opacity={0.05} />

      {/* ------------------------------------------ Zone de conversion --- */}
      <Container className="relative py-(--space-compact)">
        <div className="mx-auto max-w-reading">
          <Capsule variant="accent">Devis gratuit</Capsule>

          <Title as="p" className="mt-5 text-title">
            Un arbre à entretenir, sécuriser ou abattre ?
          </Title>

          <Body className="mx-auto mt-4 max-w-[46ch] text-(--surface-fg-muted)">
            Décrivez le chantier en quelques minutes. Sans engagement.
          </Body>

          <div className="mt-8 flex justify-center">
            <NavCta
              layout="inline"
              size="lg"
              source="footer"
              className="flex-col sm:flex-row"
            />
          </div>
        </div>
      </Container>

      {/* ------------------------------------------------ Pied compact --- */}
      <Container className="relative border-t border-(--surface-rule) py-(--space-compact)">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          {/* -------- Identité et coordonnées --------

              LES COORDONNÉES SONT ICI, PAS DANS UNE COLONNE.

              Elles occupaient une quatrième colonne de liens. Mesuré en phase
              15B.2 : l’adresse a besoin de ~180 px pour tenir sur une ligne,
              et cette colonne n’en faisait que 76 px à 480 px, 98 px à
              1024 px. `break-all` la coupait alors au milieu de « gmail ».

              Le bloc d’identité fait 288 px : l’adresse y tient d’un tenant à
              toutes les largeurs, et les coordonnées se lisent avec le nom de
              l’entreprise plutôt qu’en bout de rangée. Le lien « Demander un
              devis » a été retiré : il doublait le CTA situé juste au-dessus.
              --------------------------------------------------------------- */}
          <div className="lg:max-w-72">
            <Wordmark size="sm" />
            <Body className="mt-5 text-(--surface-fg-muted)">
              {site.trade} à {area.city} et dans la {area.metro}.
            </Body>
            <Small className="mt-3 block text-(--surface-fg-muted)">
              Déplacement possible jusqu’à {area.maxRadiusKm} km selon les
              chantiers.
            </Small>

            {/* Rien ne s’affiche tant que la donnée n’est pas confirmée : le
                téléphone n’est pas inventé (cf. `contact.phoneConfirmed`). */}
            {mailto || tel ? (
              <ul className="mt-4 flex flex-col items-center gap-0.5 lg:items-start">
                {mailto ? (
                  <li>
                    <FooterLink href={mailto} external>
                      {contact.email}
                    </FooterLink>
                  </li>
                ) : null}

                {tel ? (
                  <li>
                    <FooterLink href={tel} external>
                      {contact.phoneDisplay}
                    </FooterLink>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>

          {/* -------- Colonnes de liens -------- */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 lg:gap-x-14">
            {footerGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <FooterHeading>{group.title}</FooterHeading>
                <ul className="mt-3 flex flex-col items-center gap-0.5 lg:items-start">
                  {group.ids.map((id) => {
                    const route = getRoute(id);
                    return (
                      <li key={id}>
                        <FooterLink href={route.path}>
                          {route.navLabel}
                        </FooterLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-(--surface-rule) pt-6">
          <Small className="text-(--surface-fg-muted)">
            © {new Date().getFullYear()} {site.name} — {area.city},{" "}
            {area.department}. Site en cours de construction.
          </Small>
        </div>
      </Container>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-eyebrow font-semibold uppercase tracking-[0.12em] text-(--surface-fg-muted)">
      {children}
    </p>
  );
}

/**
 * Lien de pied de page.
 *
 * `min-h-11` — 44 px, la règle du projet (`CLAUDE.md` § 5). Ces liens étaient à
 * 36 px avant la phase 15 : c'était le seul endroit du site où la règle était
 * enfreinte. C'est la hauteur de la zone tactile qui change, pas celle du texte.
 */
function FooterLink({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const classes = cn(
    "inline-flex min-h-11 items-center font-sans text-ui",
    "text-(--surface-fg-muted) no-underline",
    "motion-safe:transition-colors motion-safe:duration-(--duration-micro)",
    "motion-safe:ease-cime",
    "hover:text-(--surface-fg) focus-visible:text-(--surface-fg)",
  );

  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
