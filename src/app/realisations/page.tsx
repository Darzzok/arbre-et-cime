import type { Metadata } from "next";
import Image from "next/image";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { JsonLd } from "@/components/seo/json-ld";
import {
  ArrowLink,
  Body,
  ButtonLink,
  Capsule,
  CapsuleGroup,
  Card,
  CardLink,
  Container,
  Display,
  Eyebrow,
  Lead,
  Reveal,
  Section,
  SectionPattern,
  Small,
  Title,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { readingCriteria, realisations } from "@/lib/realisations-content";
import { serviceRoutes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { contact, site, telHref } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata("realisations");

/**
 * Page `/realisations` — refaite en phase 15B.4. Composant SERVEUR.
 *
 * CE QUI ÉTAIT À REFAIRE
 * ----------------------
 * La collection était une grille de six fiches strictement identiques, chacune
 * composée d'une photographie et de trois lignes de légende. Mesurée avant
 * modification, elle formait **une seule section de 2 575 px en 1440 et de
 * 3 594 px en 390** — près de quatre écrans mobiles d'affilée, sans une seule
 * rupture de surface ni de rythme.
 *
 * Elle devient un portfolio alterné : une grande carte, une petite, et
 * l'inverse à la rangée suivante. Six cartes, trois rangées, aucune identique
 * à sa voisine.
 *
 * LE RISQUE PRINCIPAL DE CETTE PAGE N'EST PAS VISUEL, IL EST FACTUEL
 * -----------------------------------------------------------------
 * Une page de réalisations appelle naturellement des communes, des dates, des
 * hauteurs d'arbre et des durées de chantier. **Aucune de ces informations
 * n'est confirmée** : les photographies viennent d'une banque libre de droit et
 * ne documentent aucun chantier d'Arbres et Cimes.
 *
 * La page le **dit**, en clair, plutôt que de laisser croire le contraire par
 * omission. La mention de transparence reste unique, en `Small`, juste sous la
 * collection qu'elle qualifie. Elle n'a pas été déplacée ni atténuée par la
 * refonte, et elle ne doit pas l'être : elle disparaîtra avec les photographies
 * du client, pas avant.
 *
 * Aucune route `[slug]` de réalisation n'est créée : il n'y a rien à détailler
 * tant qu'aucun chantier réel n'est documenté.
 */

/**
 * Emprise de chaque carte sur la grille de douze colonnes.
 *
 * L'alternance 7/5 puis 5/7 puis 7/5 est ce qui produit le rythme : trois
 * rangées 7/5 identiques auraient seulement remplacé une monotonie par une
 * autre. La grande carte change de côté à chaque rangée.
 */
const SPANS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-7",
  "lg:col-span-5",
];

export default function RealisationsPage() {
  const tel = telHref();

  return (
    <>
      <JsonLd data={breadcrumbSchema("realisations")} />
      {/* Aucun `ImageObject` ni `CreativeWork` : baliser des photographies de
          banque comme des réalisations de l'entreprise serait exactement le
          type d'affirmation non vérifiable que SEO_STRATEGY.md § 1 interdit. */}

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {/* ---------------------------------------------- 1. Hero court ---
            HERO SANS PHOTOGRAPHIE — demande client, après la phase 15B.4.
            La page en compte six juste en dessous ; une septième en tête
            n ajoutait rien. Aucune image prioritaire : le portfolio est
            entièrement paresseux. */}
        <Section surface="dark" aria-labelledby="realisations-titre">
          <SectionPattern pattern="rings" opacity={0.045} />

          <Container className="relative">
            <Reveal className="mx-auto max-w-reading">
              <CapsuleGroup>
                <Capsule variant="dark" dot>
                  Types d’intervention
                </Capsule>
                <Capsule variant="dark" dot>
                  {realisations.length} situations
                </Capsule>
              </CapsuleGroup>

              <Display
                id="realisations-titre"
                as="h1"
                className="mt-6 lg:text-[3.25rem] lg:leading-[1.06]"
              >
                Réalisations &amp; interventions
              </Display>

              <Lead className="mt-5 text-(--surface-fg-muted)">
                {/* « Arbre et Cime » au singulier subsistait ici : reliquat de
                      l ancien nom, corrigé partout ailleurs en phase 15B. La
                      source unique évite qu il revienne. */}
                Les principaux types de chantiers pris en charge par{" "}
                {site.shortName} : ce qu’une situation impose, et comment elle
                se traite.
              </Lead>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------------------ 2. Portfolio --- */}
        <Section surface="sand" aria-labelledby="realisations-collection">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>La collection</Eyebrow>
              <Title
                id="realisations-collection"
                as="h2"
                className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Ce que montre un chantier
              </Title>
              <Body className="mt-4 text-(--surface-fg-muted)">
                {realisations.length} situations, des plus courantes aux plus
                contraintes. Ce qu’elles montrent, et ce qu’elles imposent sur
                le terrain.
              </Body>
            </Reveal>

            <ul className="mt-12 grid gap-(--card-gap) md:grid-cols-2 lg:mt-14 lg:grid-cols-12">
              {realisations.map((item, index) => {
                const grande = SPANS[index] === "lg:col-span-7";

                return (
                  <Reveal
                    as="li"
                    key={item.id}
                    className={cn("h-full", SPANS[index])}
                  >
                    <Card
                      as="figure"
                      tone="plain"
                      padding="none"
                      className="m-0 flex h-full flex-col"
                    >
                      <div
                        className={cn(
                          "relative w-full overflow-hidden",
                          // La grande carte respire davantage ; la petite reste
                          // compacte pour que la rangée garde sa dynamique.
                          grande
                            ? "aspect-[2/1] lg:aspect-[16/9]"
                            : "aspect-[2/1] lg:aspect-[4/3]",
                        )}
                      >
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          loading="lazy"
                          sizes={
                            grande
                              ? "(min-width: 64rem) 46vw, (min-width: 48rem) 50vw, 100vw"
                              : "(min-width: 64rem) 34vw, (min-width: 48rem) 50vw, 100vw"
                          }
                          className={cn("object-cover", item.position)}
                        />
                      </div>

                      <figcaption className="p-5 lg:p-7">
                        <Capsule variant="light">{item.category}</Capsule>

                        <h3 className="mt-4 font-display text-[1.25rem] leading-tight text-(--surface-heading) text-balance lg:text-subtitle">
                          {item.title}
                        </h3>

                        {/* `text-caption` et non `Body` : six légendes de deux à
                            trois lignes coûtaient 351 px de hauteur chacune à
                            390 px de large. Le texte est intégralement conservé,
                            c est son corps qui descend d un cran. */}
                        <p className="mx-auto mt-3 max-w-[52ch] font-sans text-caption leading-relaxed text-(--surface-fg-muted) text-pretty">
                          {item.body}
                        </p>
                      </figcaption>
                    </Card>
                  </Reveal>
                );
              })}
            </ul>

            {/* UNIQUE mention de transparence de la page. Elle était doublée au
                premier jet — un avertissement en tête de collection et un rappel
                en pied de page —, ce qui la faisait passer d'une précision
                honnête à une mise en garde insistante. Une seule fois, en
                `Small`, juste sous la collection qu'elle qualifie : lisible pour
                qui se pose la question, discrète pour les autres. */}
            <Reveal>
              <Small className="mx-auto mt-10 block max-w-reading lg:mt-12">
                Visuels illustratifs des types d’intervention proposés. Les
                réalisations d’Arbres et Cimes seront présentées ici avec leurs
                propres photographies.
              </Small>
            </Reveal>
          </Container>
        </Section>

        {/*
          RAPPEL À MI-PAGE — ajouté en phase 17B, sur relevé d'audit.

          Mesuré : `/realisations` fait 8,4 écrans à 390 px et ne portait qu'UN
          appel au devis, tout en bas. Or c'est ici, juste après le portfolio,
          que le visiteur est convaincu — pas trois écrans plus loin.

          Une ligne, un lien fléché : le bouton primaire reste unique et final.
          Deux boutons identiques à quatre écrans d'intervalle donneraient
          l'impression d'une page qui insiste.
        */}
        <Section surface="light" spacing="compact" plain>
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Body className="text-(--surface-fg-muted)">
                Un chantier qui ressemble au vôtre ?{" "}
                <ArrowLink
                  href={contact.quotePath}
                  data-cta="devis"
                  data-cta-source="realisations-milieu"
                >
                  Faites-le chiffrer
                </ArrowLink>
              </Body>
            </Reveal>
          </Container>
        </Section>

        {/* -------------------------------- 3. Chaque chantier est différent ---
            Cinq critères, cinq cartes compactes. C'est le seul aplat sombre du
            corps de la page, et il tombe entre le portfolio et la conversion. */}
        <Section surface="deep-forest" aria-labelledby="realisations-lecture">
          <SectionPattern pattern="contour" opacity={0.04} />

          <Container className="relative">
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>Lire un chantier</Eyebrow>
              <Title
                id="realisations-lecture"
                as="h2"
                className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Ce qui décide de la méthode
              </Title>
              <Body className="mt-4 text-(--surface-fg-muted)">
                Deux arbres identiques ne donnent pas le même chantier. Cinq
                éléments pèsent plus que l’essence ou la hauteur.
              </Body>
            </Reveal>

            {/*
              Six colonnes à partir de 1024 px, cinq critères : les deux
              premiers en occupent trois chacun, les trois suivants deux. La
              grille tombe juste sur deux rangées, sans cellule vide.
            */}
            <ul className="mt-10 grid grid-cols-2 gap-(--card-gap) lg:mt-14 lg:grid-cols-6">
              {readingCriteria.map((criterion, index) => (
                <Reveal
                  as="li"
                  key={criterion.title}
                  className={cn(
                    "h-full",
                    index < 2 ? "lg:col-span-3" : "lg:col-span-2",
                  )}
                >
                  <Card as="div" tone="forest" padding="md" className="h-full">
                    <span
                      aria-hidden="true"
                      className="mx-auto block h-0.5 w-4 bg-safety"
                    />
                    <h3 className="mt-5 font-display text-subtitle leading-tight text-(--surface-heading)">
                      {criterion.title}
                    </h3>
                    <Body className="mx-auto mt-3 max-w-[40ch] text-(--surface-fg-muted)">
                      {criterion.body}
                    </Body>
                  </Card>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        {/* --------------------------------------------- 4. Conversion --- */}
        <Section surface="light" aria-labelledby="realisations-cta">
          <Container>
            <Reveal>
              <Card
                as="div"
                tone="deep"
                padding="none"
                className="mx-auto max-w-5xl"
              >
                <SectionPattern pattern="contour" opacity={0.05} />

                <div className="relative px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
                  <Capsule variant="accent">Devis gratuit</Capsule>

                  <Title
                    id="realisations-cta"
                    as="h2"
                    className="mx-auto mt-6 max-w-[18ch] lg:text-[3rem] lg:leading-[1.04]"
                  >
                    Un chantier à nous montrer ?
                  </Title>

                  <Body className="mx-auto mt-5 max-w-[52ch] text-(--surface-fg-muted)">
                    Quelques photos valent souvent mieux qu’une longue
                    description : l’accès, l’environnement immédiat et l’état de
                    l’arbre s’y lisent d’un coup d’œil.
                  </Body>

                  <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                    <div className="w-full sm:w-fit">
                      <ButtonLink
                        href={contact.quotePath}
                        variant="primary"
                        size="lg"
                        block
                        data-cta="devis"
                        data-cta-source="realisations-final"
                      >
                        Demander un devis
                      </ButtonLink>
                    </div>

                    {tel ? (
                      <div className="w-full sm:w-fit">
                        <ButtonLink
                          href={tel}
                          variant="light"
                          size="lg"
                          block
                          data-cta="appel"
                          data-cta-source="realisations-final"
                        >
                          Appeler
                        </ButtonLink>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            </Reveal>

            {/* Maillage vers les quatre pages services, en cartes compactes. */}
            <Reveal className="mt-16 lg:mt-20">
              <Eyebrow as="h2">Les interventions en détail</Eyebrow>

              <ul className="mt-6 grid grid-cols-2 gap-(--card-gap) lg:grid-cols-4">
                {serviceRoutes.map((service) => (
                  <li key={service.id} className="h-full">
                    <CardLink
                      href={service.path}
                      tone="plain"
                      padding="md"
                      className="flex h-full flex-col justify-center"
                    >
                      <span className="font-display text-subtitle leading-tight text-(--surface-heading)">
                        {service.navLabel}
                      </span>

                      {service.navTagline ? (
                        <span className="mt-2 font-sans text-caption text-(--surface-fg-muted)">
                          {service.navTagline}
                        </span>
                      ) : null}

                      <span className="mt-4 inline-flex items-center justify-center gap-2.5 font-sans text-caption font-semibold text-(--surface-fg)">
                        Découvrir
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          className={cn(
                            // Suit la surface : le jaune sécurité ne contraste
                            // qu'à 1,96 sur ivoire.
                            "size-3.5 shrink-0 text-(--surface-fg-muted)",
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
                    </CardLink>
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
