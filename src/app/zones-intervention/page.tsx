import type { Metadata } from "next";
import Link from "next/link";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { ZoneMap } from "@/components/map/zone-map";
import { JsonLd } from "@/components/seo/json-ld";
import {
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
import { LOCATION_GROUPS } from "@/content/locations";
import { cn } from "@/lib/cn";
import { getRoute, serviceRoutes } from "@/lib/routes";
import { buildMetadata, locationPath } from "@/lib/seo";
import { area, contact, telHref } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata("zones-intervention");

/**
 * Page `/zones-intervention`. Composant SERVEUR ; seule la carte est cliente.
 *
 * REFAITE EN PHASE 15B.5
 * ----------------------
 * Mesurée avant refonte : **six sections, toutes ivoire**, soit cinq
 * successions de surfaces identiques. 5 729 px en 390 et 5 929 px en 1440, dont
 * un hub de communes de **2 234 px** en 390 — la dernière page du site restée
 * dans l'état d'avant la refonte visuelle.
 *
 * LE MOTEUR CARTOGRAPHIQUE N'EST PAS TOUCHÉ
 * -----------------------------------------
 * Projection, coordonnées, 23 communes, classification, distances, tracé SVG,
 * interactions, animations et calcul des voisins sont **inchangés**. Aucune
 * commune n'a été déplacée. Seul l'environnement de la carte change : surface,
 * conteneur, proportions, et la façon dont les niveaux sont présentés.
 *
 * LE RISQUE FACTUEL RESTE LE RAYON
 * --------------------------------
 * Un cercle de 100 km se lit comme une promesse de couverture. Le texte le
 * contredit à quatre endroits : le chapô, la capsule du hero, la carte des
 * déplacements élargis, et la mention portée par la carte elle-même. Aucune de
 * ces formulations ne doit être adoucie.
 *
 * VOCABULAIRE INTERNE / VOCABULAIRE PUBLIC
 * ----------------------------------------
 * `core`, `primary` et `extended` sont des identifiants de données. Ils
 * n'apparaissent nulle part dans l'interface, et les regroupements affichés
 * suivent des faits géographiques (métropole, département), jamais un
 * découpage commercial.
 */

const devis = getRoute("devis");

/**
 * Les trois niveaux, avec leur libellé PUBLIC.
 *
 * Les textes reprennent mot pour mot ceux de la version précédente, y compris
 * la réserve « il n'est jamais automatique » : c'est une limite posée par le
 * client, pas une précaution de style.
 */
const ZONE_CARDS = [
  {
    id: "coeur",
    label: "Cœur de zone",
    resume: `${area.city} & ${area.metro}`,
    body: `${area.city} et les 71 communes de la ${area.metro}, des deux rives de la Seine. C’est là que les délais sont les plus courts et qu’une intervention ponctuelle se cale le plus facilement.`,
  },
  {
    id: "proche",
    label: "Zone principale",
    resume: `${area.department} et secteurs proches`,
    body: `La ${area.department}, de la vallée de Seine au littoral. Les interventions y sont possibles selon la nature du chantier.`,
  },
  {
    id: "elargie",
    label: "Déplacements élargis",
    resume: `Jusqu’à ${area.maxRadiusKm} km selon le chantier`,
    body: "Un trajet plus lointain se décide au cas par cas — il n’est jamais automatique.",
  },
];

/** Ce qui décide réellement d'un déplacement lointain. Contenu inchangé. */
const distanceFactors = [
  {
    title: "Le type d’intervention",
    body: "Une taille ponctuelle et un démontage sur plusieurs jours ne se déplacent pas dans les mêmes conditions.",
  },
  {
    title: "L’ampleur du chantier",
    body: "Le volume de bois détermine le matériel à emmener et le nombre de rotations.",
  },
  {
    title: "L’accès au terrain",
    body: "Ce qui peut être acheminé sur place conditionne la méthode, donc la faisabilité.",
  },
  {
    title: "L’organisation",
    body: "Un chantier éloigné s’organise plus facilement s’il peut être regroupé avec un autre du même secteur.",
  },
];

export default function ZonesInterventionPage() {
  const tel = telHref();

  return (
    <>
      <JsonLd data={breadcrumbSchema("zones-intervention")} />
      {/* Aucune `GeoCircle` ni `areaServed` : ces propriétés appartiennent à
          `LocalBusiness`, gelé faute de domaine, téléphone et adresse
          (SEO_STRATEGY.md § 7). Les émettre seules ne décrirait rien. */}

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {/* ---------------------------------------------------- 1. Hero --- */}
        <Section surface="deep-forest" aria-labelledby="zones-titre">
          <SectionPattern pattern="contour" opacity={0.05} />

          <Container className="relative">
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>{area.metro}</Eyebrow>

              <Display
                id="zones-titre"
                as="h1"
                className="mt-4 lg:text-[3.25rem] lg:leading-[1.06]"
              >
                Zone d’intervention
              </Display>

              <Lead className="mt-5 text-(--surface-fg-muted)">
                {area.city} au cœur des déplacements : la métropole rouennaise
                et la {area.department} en zone principale, et des trajets plus
                lointains selon la nature du chantier.
              </Lead>

              {/* Trois capsules, pas quatre. La troisième porte sa réserve
                  AVEC elle : « jusqu'à 100 km » seul se lirait comme une
                  couverture garantie. */}
              <CapsuleGroup className="mt-8">
                <Capsule variant="dark" dot>
                  {area.city} &amp; Métropole
                </Capsule>
                <Capsule variant="dark" dot>
                  {area.department}
                </Capsule>
                <Capsule variant="dark" dot>
                  Jusqu’à {area.maxRadiusKm} km selon chantier
                </Capsule>
              </CapsuleGroup>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                {/* La largeur est portée par une ENVELOPPE : `cn()` ne fusionne
                    pas les classes concurrentes. */}
                <div className="w-full sm:w-fit">
                  <ButtonLink
                    href={devis.path}
                    variant="primary"
                    size="lg"
                    block
                    data-cta="devis"
                    data-cta-source="zones-hero"
                  >
                    Demander un devis
                  </ButtonLink>
                </div>

                {tel ? (
                  <div className="w-full sm:w-fit">
                    <ButtonLink
                      href={tel}
                      variant="outline"
                      size="lg"
                      block
                      data-cta="appel"
                      data-cta-source="zones-hero"
                    >
                      Appeler
                    </ButtonLink>
                  </div>
                ) : null}
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------------ 2. Carte signature ---
            La carte est posée dans un panneau ivoire qui occupe TOUTE la
            largeur du conteneur — 1 320 px en 1440. La carte elle-même reste
            bornée à 64 rem : son rapport est celui du cadre géographique
            généré, elle est carrée, et l'étirer à 1 320 px la rendrait aussi
            haute qu'un écran et demi. C'est le panneau qui occupe la largeur,
            pas le dessin. */}
        <Section surface="sand" aria-labelledby="zones-carte">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Title
                id="zones-carte"
                as="h2"
                className="lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Où nous intervenons
              </Title>
              <Body className="mt-4 text-(--surface-fg-muted)">
                Touchez ou survolez une commune pour connaître sa distance
                depuis {area.city} et ouvrir sa page.
              </Body>
            </Reveal>

            <Reveal className="mt-10 lg:mt-12">
              <Card as="div" tone="plain" padding="none">
                <div className="p-4 sm:p-8 lg:p-10">
                  <ZoneMap
                    variant="page"
                    className="mx-auto max-w-[64rem]"
                    title={`Carte de la zone d’intervention : la ${area.metro} au centre, la ${area.department} en zone principale, la Seine, ${area.city} et les communes de repère`}
                  />
                </div>
              </Card>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------------- 3. Trois niveaux ---
            Repli textuel de la carte : la même information, sans le dessin
            (`CLAUDE.md` § 5 — aucune information réservée à un seul canal). */}
        <Section surface="light" aria-labelledby="zones-niveaux">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>Trois échelles</Eyebrow>
              <Title
                id="zones-niveaux"
                as="h2"
                className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Le cœur, et le reste
              </Title>
            </Reveal>

            <ul className="mt-10 grid gap-(--card-gap) lg:mt-12 lg:grid-cols-3">
              {ZONE_CARDS.map((zone) => (
                <Reveal as="li" key={zone.id} className="h-full">
                  <Card as="div" tone="sand" padding="lg" className="h-full">
                    <Capsule variant="light">{zone.label}</Capsule>

                    <h3 className="mt-4 font-display text-subtitle leading-tight text-(--surface-heading) text-balance">
                      {zone.resume}
                    </h3>

                    <Body className="mx-auto mt-3 max-w-[44ch] text-(--surface-fg-muted)">
                      {zone.body}
                    </Body>
                  </Card>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        {/* --------------------------------------- 4. Hub des 23 communes ---
            Une grille typographique, pas vingt-trois cartes. Les groupes
            suivent des faits géographiques (appartenance à la métropole, puis
            département), jamais un découpage commercial : un visiteur qui
            connaît la région doit retrouver sa commune là où il l'attend.
            Voir `src/content/locations.ts`. */}
        <Section surface="sand" aria-labelledby="zones-communes">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>Communes</Eyebrow>
              <Title
                id="zones-communes"
                as="h2"
                className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Une page par commune
              </Title>
              <Body className="mt-4 text-(--surface-fg-muted)">
                Chaque commune de la carte a sa page : distance réelle à{" "}
                {area.city}, contexte local, et ce que cela change pour
                organiser un chantier. Ce n’est pas une liste de secteurs
                desservis d’office.
              </Body>
            </Reveal>

            <div className="mt-12 space-y-10 lg:mt-14 lg:space-y-12">
              {LOCATION_GROUPS.map((groupe) => (
                <Reveal key={groupe.id}>
                  <div className="mx-auto max-w-5xl text-left">
                    <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 text-center lg:justify-start lg:text-left">
                      <h3 className="font-sans text-eyebrow font-semibold uppercase tracking-[0.24em] text-(--surface-heading)">
                        {groupe.titre}
                      </h3>
                      <p className="font-sans text-caption text-(--surface-fg-muted)">
                        {groupe.detail}
                      </p>
                    </div>

                    {/*
                      Deux colonnes dès 480 px, trois à partir de 1024. Les noms
                      les plus longs — Saint-Étienne-du-Rouvray,
                      Sotteville-lès-Rouen — tiennent sur une ligne dans une
                      demi-colonne ; c'est la distance, à droite, qui est
                      autorisée à se replier.
                    */}
                    <ul className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                      {groupe.locations.map((ville) => (
                        <li
                          key={ville.slug}
                          className="border-t border-(--surface-rule)"
                        >
                          <Link
                            href={locationPath(ville.slug)}
                            className={cn(
                              "group flex min-h-12 items-center justify-between gap-3",
                              "py-3 no-underline",
                              "motion-safe:transition-colors",
                              "motion-safe:duration-(--duration-micro)",
                              "hover:text-(--surface-heading)",
                            )}
                          >
                            <span className="font-sans text-body text-(--surface-fg)">
                              {ville.nom}
                            </span>

                            <span className="flex shrink-0 items-center gap-2.5">
                              <span className="font-sans text-caption tabular-nums text-(--surface-fg-muted)">
                                {ville.km === 0 ? "cœur" : `${ville.km} km`}
                              </span>
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 16 16"
                                className={cn(
                                  // Suit la surface : le jaune sécurité ne
                                  // contraste qu'à 1,96 sur ivoire.
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
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <Small className="mx-auto mt-12 block max-w-reading">
                Le plus simple reste de demander : une commune et quelques
                photos suffisent pour dire si le chantier est réalisable.
              </Small>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------- 5. Critères de déplacement --- */}
        <Section surface="deep-forest" aria-labelledby="zones-deplacements">
          <SectionPattern pattern="rings" opacity={0.04} />

          <Container className="relative">
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>Au-delà de la métropole</Eyebrow>
              <Title
                id="zones-deplacements"
                as="h2"
                className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Jusqu’à {area.maxRadiusKm} km, selon le chantier
              </Title>
              <Body className="mt-5 text-(--surface-fg-muted)">
                Le rayon de {area.maxRadiusKm} km est une possibilité, pas une
                couverture automatique. Toutes les adresses qu’il contient ne
                sont pas desservies d’office : un déplacement lointain se décide
                chantier par chantier, sur quatre critères.
              </Body>
            </Reveal>

            <ul className="mt-10 grid gap-(--card-gap) sm:grid-cols-2 lg:mt-14">
              {distanceFactors.map((factor) => (
                <Reveal as="li" key={factor.title} className="h-full">
                  <Card as="div" tone="forest" padding="lg" className="h-full">
                    <span
                      aria-hidden="true"
                      className="mx-auto block h-0.5 w-4 bg-safety"
                    />
                    <h3 className="mt-5 font-display text-subtitle leading-tight text-(--surface-heading)">
                      {factor.title}
                    </h3>
                    <Body className="mx-auto mt-3 max-w-[44ch] text-(--surface-fg-muted)">
                      {factor.body}
                    </Body>
                  </Card>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        {/* ----------------------------------------------- 6. Conversion --- */}
        <Section surface="light" aria-labelledby="zones-cta">
          <Container>
            <Reveal>
              <Card
                as="div"
                tone="deep"
                padding="none"
                className="mx-auto max-w-5xl"
              >
                <SectionPattern pattern="contour" opacity={0.05} />

                <div className="relative px-6 py-11 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
                  {/*
                    « Zone confirmée avec votre demande » et non « zone
                    couverte » : la confirmation vient de l'échange, jamais du
                    cercle tracé sur la carte.
                  */}
                  <CapsuleGroup>
                    <Capsule variant="accent">Devis gratuit</Capsule>
                    <Capsule variant="dark">
                      Zone confirmée avec votre demande
                    </Capsule>
                  </CapsuleGroup>

                  <Title
                    id="zones-cta"
                    as="h2"
                    className="mx-auto mt-6 max-w-[20ch] lg:text-[3rem] lg:leading-[1.04]"
                  >
                    Votre chantier est dans la zone ?
                  </Title>

                  <Body className="mx-auto mt-5 max-w-[48ch] text-(--surface-fg-muted)">
                    Indiquez la commune et décrivez le chantier : c’est ce qui
                    permet de dire si l’intervention est réalisable, et à
                    quelles conditions.
                  </Body>

                  <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                    <div className="w-full sm:w-fit">
                      <ButtonLink
                        href={contact.quotePath}
                        variant="primary"
                        size="lg"
                        block
                        data-cta="devis"
                        data-cta-source="zones-final"
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
                          data-cta-source="zones-final"
                        >
                          Appeler
                        </ButtonLink>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            </Reveal>

            {/* Maillage vers les prestations, en cartes compactes. */}
            <Reveal className="mt-16 lg:mt-20">
              <Eyebrow as="h2">Les interventions</Eyebrow>

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
