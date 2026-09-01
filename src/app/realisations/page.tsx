import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Body,
  ButtonLink,
  Container,
  Display,
  Eyebrow,
  HeroScrim,
  Lead,
  Reveal,
  Section,
  Small,
  Subtitle,
  Title,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { readingCriteria, realisations } from "@/lib/realisations-content";
import { getRoute, serviceRoutes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata("realisations");

/**
 * Page `/realisations`. Composant SERVEUR, aucun JavaScript.
 *
 * Quatre blocs : hero compact, collection, lecture des chantiers, conversion.
 *
 * **Le risque principal de cette page n'est pas visuel, il est factuel.** Une
 * page de réalisations appelle naturellement des communes, des dates, des
 * hauteurs d'arbre et des durées de chantier. Aucune de ces informations n'est
 * confirmée : les photographies viennent d'une banque libre de droit et ne
 * documentent aucun chantier d'Arbres et Cimes. La page le **dit**, en clair,
 * plutôt que de laisser croire le contraire par omission — c'est ce qui la rend
 * crédible, pas ce qui l'affaiblit.
 *
 * Aucune route `[slug]` de réalisation n'est créée : il n'y a rien à détailler
 * tant qu'aucun chantier réel n'est documenté. Elles viendront avec les photos
 * du client, avec commune, contexte, contraintes et avant/après.
 */

const devis = getRoute("devis");

export default function RealisationsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("realisations")} />
      {/* Aucun `ImageObject` ni `CreativeWork` : baliser des photographies de
          banque comme des réalisations de l'entreprise serait exactement le
          type d'affirmation non vérifiable que SEO_STRATEGY.md § 1 interdit. */}

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {/* -------------------------------------------- 1. Hero compact --- */}
        {/* Même hauteur que celui de `/a-propos` (26rem) : sous ce seuil, le
            bloc de texte remonte dans la partie claire du dégradé et le
            contraste s'effondre — voir DESIGN_SYSTEM.md § 5. */}
        <section
          aria-labelledby="realisations-titre"
          data-surface="dark"
          className={cn(
            "relative isolate flex items-end overflow-hidden",
            "min-h-[26rem] sm:min-h-[29rem] lg:min-h-[32rem]",
          )}
        >
          {/* Photographie remplacée au correctif 9B. La précédente portait un
              logo de marque parfaitement lisible sur la tronçonneuse et un
              avant-bras tatoué très reconnaissable — deux choses à éviter sur
              une page qui doit rester neutre. Celle-ci est un abattage réel en
              forêt, EPI complet, visage masqué par la visière, aucune marque
              lisible. Cadrage 16/9 natif : bien adapté à un hero large. */}
          <Image
            src="/images/realisations/chantier-abattage-foret-tronconneuse.jpg"
            alt="Bûcheron en casque et visière réalisant une coupe d’abattage à la tronçonneuse au pied d’un hêtre"
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-[60%_center]"
          />
          <HeroScrim variant="compact" />

          <Container className="relative py-12 lg:py-14">
            <div className="mx-auto max-w-reading">
              {/* Rendu à la main plutôt qu'avec `Eyebrow` : `cn()` ne fusionne
                  pas deux classes de couleur concurrentes, et il faut ici de
                  l'ivoire, pas de la pierre (DESIGN_SYSTEM.md § 8). */}
              <p className="font-sans text-eyebrow font-semibold uppercase text-(--surface-fg)">
                Preuve par l’exemple
              </p>
              <Display
                id="realisations-titre"
                as="h1"
                className="mt-4 lg:text-[3.25rem] lg:leading-[1.06]"
              >
                Réalisations &amp; interventions
              </Display>
              <Lead className="mt-5">
                Les principaux types de chantiers pris en charge par Arbre et
                Cime : ce qu’une situation impose, et comment elle se traite.
              </Lead>
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------- 2. Collection --- */}
        <Section surface="light" aria-labelledby="realisations-collection">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>Types d’intervention</Eyebrow>
              <Title
                id="realisations-collection"
                as="h2"
                className="mt-4"
              >
                Ce que montre un chantier
              </Title>

              <Body className="mt-4 text-(--surface-fg-muted)">
                Six situations, des plus courantes aux plus contraintes. Ce
                qu’elles montrent, et ce qu’elles imposent sur le terrain.
              </Body>
            </Reveal>

            {/* `max-w` sur chaque carte tant qu'elles sont empilées : sans
                cela, une photographie plein conteneur atteint 517 px de haut à
                768 px. */}
            <ul className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-14">
              {realisations.map((item) => (
                <Reveal
                  as="li"
                  key={item.id}
                  className="mx-auto w-full max-w-[30rem] lg:max-w-none"
                >
                  <figure className="m-0">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-card sm:aspect-[3/2]">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        loading="lazy"
                        sizes="(min-width: 64rem) 36rem, 100vw"
                        className={cn("object-cover", item.position)}
                      />
                    </div>

                    <figcaption>
                      <p className="mt-5 font-sans text-eyebrow font-semibold uppercase text-(--surface-fg-muted)">
                        {item.category}
                      </p>
                      <Subtitle as="h3" className="mt-2.5">
                        {item.title}
                      </Subtitle>
                      <Body className="mt-3 text-(--surface-fg-muted)">
                        {item.body}
                      </Body>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>

            {/* UNIQUE mention de transparence de la page. Elle était doublée
                au premier jet — un avertissement en tête de collection et un
                rappel en pied de page —, ce qui la faisait passer d'une
                précision honnête à une mise en garde insistante. Une seule
                fois, en `Small`, juste sous la collection qu'elle qualifie :
                lisible pour qui se pose la question, discrète pour les autres.
                Elle disparaîtra avec les photographies du client. */}
            <Reveal>
              <Small className="mx-auto mt-10 block max-w-reading lg:mt-12">
                Visuels illustratifs des types d’intervention proposés. Les
                réalisations d’Arbres et Cimes seront présentées ici avec leurs
                propres photographies.
              </Small>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------ 3. Lecture des chantiers --- */}
        {/* Volontairement compacte : filets et rythme vertical, pas cinq
            cartes de plus. Ces cinq critères sont ceux qui se lisent sur une
            photographie — c'est ce qui justifie qu'ils soient ici plutôt que
            sur une page service. */}
        <Section
          surface="light"
          spacing="tight"
          aria-labelledby="realisations-lecture"
        >
          <Container width="prose">
            <Reveal>
              <Eyebrow>Lire un chantier</Eyebrow>
              <Title id="realisations-lecture" as="h2" className="mt-4">
                Ce qui décide de la méthode
              </Title>
              <Body className="mt-4 text-(--surface-fg-muted)">
                Deux arbres identiques ne donnent pas le même chantier. Cinq
                éléments pèsent plus que l’essence ou la hauteur.
              </Body>
            </Reveal>

            <ul className="mt-9">
              {readingCriteria.map((criterion) => (
                <Reveal
                  as="li"
                  key={criterion.title}
                  className="border-t border-(--surface-rule) py-6 first:border-t-0 first:pt-0 last:pb-0"
                >
                  {/* Tiret au-dessus, centré : en rangée il resterait collé au
                      bord gauche pendant que le texte se centre. */}
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-3 block h-px w-5 bg-safety"
                  />
                  <h3 className="font-display text-subtitle leading-tight text-(--surface-heading)">
                    {criterion.title}
                  </h3>
                  <Body className="mt-2.5 text-(--surface-fg-muted)">
                    {criterion.body}
                  </Body>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        {/* --------------------------------------------- 4. Conversion ---
            Section CLAIRE contenant un panneau sombre : une section en forêt
            tomberait sur un pied de page lui aussi en forêt
            (DESIGN_SYSTEM.md § 8). */}
        <Section surface="light" aria-labelledby="realisations-cta">
          <Container>
            <Reveal>
              <div
                data-surface="dark"
                className={cn(
                  "rounded-card bg-(--surface-bg) text-(--surface-fg)",
                  "p-7 sm:p-10 lg:p-14",
                )}
              >
                <Title
                  id="realisations-cta"
                  as="h2"
                  className="mx-auto max-w-[18ch]"
                >
                  Un chantier à nous montrer ?
                </Title>
                <Body className="mx-auto mt-5 max-w-reading text-(--surface-fg-muted)">
                  Quelques photos valent souvent mieux qu’une longue
                  description : l’accès, l’environnement immédiat et l’état de
                  l’arbre s’y lisent d’un coup d’œil. Joignez-les à votre
                  demande, le devis est gratuit.
                </Body>
                <div className="mt-8 w-full sm:mx-auto sm:w-fit">
                  <ButtonLink
                    href={devis.path}
                    variant="primary"
                    size="lg"
                    block
                  >
                    Demander un devis
                  </ButtonLink>
                </div>
              </div>
            </Reveal>

            {/* Maillage vers les quatre pages services, sur fond clair : c'est
                cette bande qui sépare le panneau du pied de page. */}
            <Reveal className="mt-16 lg:mt-20">
              <Eyebrow as="h2">Les interventions en détail</Eyebrow>
              <ul className="mt-5">
                {serviceRoutes.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={service.path}
                      className={cn(
                        "group flex flex-col items-center gap-2",
                        "border-t border-(--surface-rule) py-5 no-underline",
                      )}
                    >
                      <span className="font-display text-subtitle text-(--surface-heading)">
                        {service.navLabel}
                      </span>
                      <span className="flex items-center justify-center gap-3">
                        {service.navTagline ? (
                          <span className="hidden font-sans text-caption text-(--surface-fg-muted) sm:inline">
                            {service.navTagline}
                          </span>
                        ) : null}
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          className={cn(
                            "size-4 shrink-0 text-(--surface-fg-muted)",
                            "motion-safe:transition-transform",
                            "motion-safe:duration-(--duration-micro)",
                            "motion-safe:ease-cime",
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
                  </li>
                ))}
              </ul>

            </Reveal>
          </Container>
        </Section>
      </main>
    </>
  );
}
