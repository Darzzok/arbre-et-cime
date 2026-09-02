import Link from "next/link";

import { Wordmark } from "@/components/layout/wordmark";
import { Body, Container, SectionPattern, Small } from "@/components/ui";
import { cn } from "@/lib/cn";
import { footerGroups, getRoute } from "@/lib/routes";
import { area, contact, mailtoHref, site, telHref } from "@/lib/site";

/**
 * Pied de page.
 *
 * UNE SEULE ZONE — le pied compact : l'identité et les coordonnées à gauche,
 * trois colonnes de liens à droite, le légal en bas. Volontairement dense —
 * un pied de page n'est pas une page.
 *
 * PAS DE ZONE DE CONVERSION, ET C'EST UNE DEMANDE RÉPÉTÉE
 * ------------------------------------------------------
 * Le pied a porté un bloc devis — capsule, titre, phrase et bouton — en phase
 * 15B.2. Le client l'avait déjà fait retirer une première fois en phase 15B,
 * et l'a fait retirer à nouveau après la phase 15B.5.
 *
 * **Ne pas le réintroduire sans demande explicite**, sous quelque forme que ce
 * soit. L'appel à l'action vit dans l'en-tête (visible en permanence), dans la
 * barre d'action mobile, et dans la carte de conversion que porte chaque page.
 * Il est présent partout ; le pied de page n'a pas à le répéter une quatrième
 * fois.
 *
 * TOUT EST CENTRÉ — CORRECTIF PHASE 16B
 * -------------------------------------
 * Les listes portaient `lg:items-start` : au-delà de 1 024 px, les liens se
 * ferraient à gauche pendant que leur intitulé de colonne restait centré, la
 * règle globale du site s'appliquant au texte. Mesuré à 1 440 px : les trois
 * intitulés commençaient 28 px à droite de leurs liens, et le bloc d'identité
 * mélangeait un logotype centré, un texte centré et des coordonnées ferrées à
 * gauche. C'est le décalage signalé par le client.
 *
 * `DESIGN_SYSTEM.md` § 4 est pourtant explicite : « tout le contenu de page et
 * **le pied de page** sont centrés », décision client `VERROUILLÉE`. Le
 * `lg:items-start` était l'anomalie, pas le centrage. Il est retiré.
 *
 * L'`items-start` de la RANGÉE, lui, reste : il aligne les colonnes par le
 * haut, c'est un réglage vertical qui ne touche pas au texte.
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

      {/* ------------------------------------------------ Pied compact --- */}
      <Container className="relative py-(--space-compact)">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          {/* -------- Identité et coordonnées --------

              LES COORDONNÉES SONT ICI, PAS DANS UNE COLONNE.

              Elles occupaient une quatrième colonne de liens. Mesuré en phase
              15B.2 : l’adresse a besoin de ~180 px pour tenir sur une ligne,
              et cette colonne n’en faisait que 76 px à 480 px, 98 px à
              1024 px. `break-all` la coupait alors au milieu de « gmail ».

              Le bloc d’identité fait 288 px : l’adresse y tient d’un tenant à
              toutes les largeurs, et les coordonnées se lisent avec le nom de
              l’entreprise plutôt qu’en bout de rangée.

              Aucun lien « Demander un devis » ici non plus : le pied de page ne
              porte plus aucun appel au devis, sous aucune forme.
              --------------------------------------------------------------- */}
          <div className="lg:max-w-72">
            {/*
              LE LOGO COMPLET VIT ICI, ET NULLE PART AILLEURS.

              Le pied de page est la seule zone du site qui dispose de la
              hauteur nécessaire aux quatre lignes du logotype. L'en-tête, lui,
              n'a que 81 px : le bloc complet y tomberait à 48 px de large et
              son texte sous 7 px. C'est le partage posé par `wordmark.tsx`.
            */}
            <Wordmark variant="full" />
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
              <ul className="mt-4 flex flex-col items-center gap-0.5">
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
                <ul className="mt-3 flex flex-col items-center gap-0.5">
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
