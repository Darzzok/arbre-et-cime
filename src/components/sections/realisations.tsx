import Image from "next/image";
import Link from "next/link";

import { Body, Container, Eyebrow, Reveal, Section, Title } from "@/components/ui";
import { cn } from "@/lib/cn";
import { homeRealisations } from "@/lib/realisations-content";
import { getRoute } from "@/lib/routes";

/**
 * Section 5 des 7 sections VERROUILLÉES — quelques interventions.
 *
 * **Anatomie de carte différente de celle des Prestations**, et c'est
 * délibéré : les deux sections vivent sur la même page, sur la même surface
 * claire, et deux grilles de cartes photographiques identiques donneraient
 * exactement le « site généré » que `PROJECT.md` interdit.
 *
 *   Prestations   texte INCRUSTÉ sur la photographie, dégradé forêt, index
 *                 01–04, quatre cartes.
 *   Réalisations  photographie pleine, puis légende SOUS l'image sur l'ivoire.
 *                 Trois cartes, aucun texte sur la photo.
 *
 * Sortir le texte de l'image a un second mérite : ces trois photographies sont
 * claires et contrastées, un texte incrusté aurait exigé un dégradé par image
 * (le piège documenté dans `DESIGN_SYSTEM.md` § 5).
 *
 * Les trois cartes pointent vers `/realisations`. Leur nom accessible contient
 * le titre de la carte, elles ne se réduisent donc pas à trois liens
 * indiscernables pour un lecteur d'écran.
 */

const realisationsRoute = getRoute("realisations");

export function Realisations() {
  return (
    <Section surface="light" aria-labelledby="realisations-titre">
      <Container>
        <Reveal className="mx-auto max-w-reading">
          <Eyebrow>Réalisations</Eyebrow>
          {/* « Quelques interventions » laissait entendre des chantiers
              réellement menés par Arbres et Cimes, ce que ces photographies ne
              documentent pas. Le titre porte désormais sur l'ADAPTATION à la
              situation : c'est exact, et c'est aussi l'argument commercial. */}
          <Title id="realisations-titre" as="h2" className="mt-4">
            Des interventions adaptées à chaque situation
          </Title>
          <Body className="mt-4 text-(--surface-fg-muted)">
            En hauteur, au ras des habitations, ou une fois l’arbre au sol :
            c’est la situation qui décide de la méthode, pas l’inverse.
          </Body>
        </Reveal>

        {/* `max-w` sur chaque carte tant qu'elles sont empilées : à 768 px
            elles s'étiraient sur 689 px, ce qui portait la section à 2 394 px —
            une photographie de 517 px de haut pour une simple reprise de trois
            éléments. */}
        <ul className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {homeRealisations.map((item) => (
            <Reveal
              as="li"
              key={item.id}
              className="mx-auto w-full max-w-[26rem] lg:max-w-none"
            >
              <Link
                href={realisationsRoute.path}
                className="group block no-underline"
              >
                {/* Paysage tant que les cartes sont empilées, portrait dès
                    qu'elles passent en trois colonnes. En 4/5 sur mobile, la
                    section atteignait 2 167 px — trop pour une reprise de
                    trois éléments sur la page d'accueil. */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-card lg:aspect-[4/5]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 64rem) 34rem, 100vw"
                    className={cn(
                      "object-cover",
                      item.position,
                      // Zoom très léger au survol. `overflow-hidden` du parent
                      // le contient ; aucun texte ne bouge, puisque le texte
                      // est en dehors du cadre.
                      "motion-safe:transition-transform",
                      "motion-safe:duration-(--duration-reveal) motion-safe:ease-cime",
                      "motion-safe:group-hover:scale-[1.04]",
                      "motion-safe:group-focus-visible:scale-[1.04]",
                    )}
                  />
                </div>

                <p className="mt-5 font-sans text-eyebrow font-semibold uppercase text-(--surface-fg-muted)">
                  {item.category}
                </p>

                <h3 className="mt-2.5 font-display text-subtitle leading-tight text-(--surface-heading) text-balance">
                  {item.title}
                </h3>

                <p className="mt-2.5 font-sans text-caption leading-relaxed text-pretty text-(--surface-fg-muted)">
                  {item.teaser}
                </p>

                <span className="mt-4 flex items-center justify-center gap-2.5">
                  <span
                    className={cn(
                      "font-sans text-caption font-semibold text-(--surface-fg)",
                      "underline decoration-1 underline-offset-[0.25em]",
                      "decoration-(--surface-rule)",
                      "transition-[text-decoration-color]",
                      "duration-(--duration-micro) ease-cime",
                      "group-hover:decoration-(--surface-fg)",
                      "group-focus-visible:decoration-(--surface-fg)",
                    )}
                  >
                    Voir les réalisations
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className={cn(
                      // Suit la surface : le jaune sécurité ne contraste qu'à
                      // 1,96 sur ivoire.
                      "size-4 shrink-0 text-(--surface-fg-muted)",
                      "motion-safe:transition-transform",
                      "motion-safe:duration-(--duration-micro) motion-safe:ease-cime",
                      "motion-safe:group-hover:translate-x-1",
                      "motion-safe:group-focus-visible:translate-x-1",
                    )}
                  >
                    <path
                      d="M2 8h11M9 4l4 4-4 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
