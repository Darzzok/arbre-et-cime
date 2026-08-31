import type { Metadata } from "next";
import Link from "next/link";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { ZoneMap } from "@/components/map/zone-map";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Body,
  ButtonLink,
  Container,
  Display,
  Eyebrow,
  Lead,
  Reveal,
  Section,
  Small,
  Subtitle,
  Title,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { METROPOLE_CITIES } from "@/lib/map-content";
import { getRoute, serviceRoutes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { area } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata("zones-intervention");

/**
 * Page `/zones-intervention`. Composant SERVEUR ; seule la carte est cliente.
 *
 * **Refaite au correctif de la phase 10**, autour d'une seule idée : la carte
 * est la page. Elle n'est plus enfermée dans un panneau sombre, elle occupe la
 * pleine largeur de lecture sur fond ivoire, et tout le reste s'organise
 * autour d'elle.
 *
 * Six blocs : hero, carte, cœur de zone, déplacements plus larges, secteurs,
 * conversion.
 *
 * **Le risque factuel reste le rayon.** Un cercle de 100 km se lit comme une
 * promesse de couverture. Le texte le contredit à trois endroits : le chapô,
 * le bloc « déplacements », et la phrase de chaque repère de la carte.
 *
 * **Aucune page locale n'est créée.** L'architecture les permet
 * (`SEO_STRATEGY.md` § 3) ; aucune des quatre conditions n'est remplie.
 */

const devis = getRoute("devis");

/** Ce qui décide réellement d'un déplacement lointain. */
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
  return (
    <>
      <JsonLd data={breadcrumbSchema("zones-intervention")} />
      {/* Aucune `GeoCircle` ni `areaServed` : ces propriétés appartiennent à
          `LocalBusiness`, gelé faute de domaine, téléphone et adresse
          (SEO_STRATEGY.md § 7). Les émettre seules ne décrirait rien. */}

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {/* ------------------------------------------- 1. Hero compact --- */}
        <Section surface="light" spacing="tight" aria-labelledby="zones-titre">
          <Container>
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
            </Reveal>
          </Container>
        </Section>

        {/* ----------------------------------- 2. Grande carte signature ---
            Pas de panneau, pas de cadre : la carte est posée sur l'ivoire de
            la page. C'est la correction principale du correctif — l'ancienne
            version l'enfermait dans un rectangle sombre qui la faisait passer
            pour une capture technique. */}
        {/* Carte XXL : pleine largeur du conteneur de contenu, soit environ
            1 144 px en 1440. C'est la pièce focale de la page. */}
        <Section surface="light" spacing="tight" plain>
          <Container width="wide">
            <Reveal>
              <ZoneMap
                variant="page"
                className="mx-auto max-w-[60rem]"
                title={`Carte de la zone d’intervention : la ${area.metro} au centre, la ${area.department} en zone principale, la Seine, ${area.city} et les communes de repère`}
              />
            </Reveal>
          </Container>
        </Section>

        {/* ---------------------------------------- 3. Zones en texte --- */}
        <Section surface="light" aria-labelledby="zones-coeur">
          <Container width="prose">
            <Reveal>
              <Eyebrow>Deux échelles</Eyebrow>
              <Title id="zones-coeur" as="h2" className="mt-4">
                Le cœur, et le reste
              </Title>
            </Reveal>

            {/* Repli textuel de la carte : la même information, sans le
                dessin (`CLAUDE.md` § 5). */}
            <div className="mt-9 grid gap-8 sm:grid-cols-2 sm:gap-10">
              <Reveal className="border-t border-(--surface-rule) pt-5">
                <Subtitle as="h3">Cœur de zone</Subtitle>
                <Body className="mt-3 text-(--surface-fg-muted)">
                  {area.city} et les 71 communes de la {area.metro}, des deux
                  rives de la Seine. C’est là que les délais sont les plus
                  courts et qu’une intervention ponctuelle se cale le plus
                  facilement.
                </Body>
              </Reveal>

              <Reveal className="border-t border-(--surface-rule) pt-5">
                <Subtitle as="h3">Déplacements élargis</Subtitle>
                <Body className="mt-3 text-(--surface-fg-muted)">
                  La {area.department} et les secteurs voisins, selon le
                  chantier. Un trajet plus lointain se décide au cas par cas —
                  il n’est jamais automatique.
                </Body>
              </Reveal>
            </div>
          </Container>
        </Section>
        {/* -------------------------------- 4. Déplacements plus larges --- */}
        <Section
          surface="light"
          spacing="tight"
          aria-labelledby="zones-deplacements"
        >
          <Container width="prose">
            <Reveal>
              <Eyebrow>Au-delà de la métropole</Eyebrow>
              <Title id="zones-deplacements" as="h2" className="mt-4">
                Jusqu’à {area.maxRadiusKm} km, selon le chantier
              </Title>
              <Body className="mt-5">
                Le rayon de {area.maxRadiusKm} km est une possibilité, pas une
                couverture automatique. Toutes les adresses qu’il contient ne
                sont pas desservies d’office : un déplacement lointain se décide
                chantier par chantier, sur quatre critères.
              </Body>
            </Reveal>

            <ul className="mt-9 grid gap-px sm:grid-cols-2 sm:gap-x-8">
              {distanceFactors.map((factor) => (
                <Reveal
                  as="li"
                  key={factor.title}
                  className="border-t border-(--surface-rule) py-5"
                >
                  <h3 className="font-display text-subtitle leading-tight text-(--surface-heading)">
                    {factor.title}
                  </h3>
                  <Body className="mt-2.5 text-(--surface-fg-muted)">
                    {factor.body}
                  </Body>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        {/* --------------------------------- 5. Communes principales --- */}
        <Section surface="light" aria-labelledby="zones-communes">
          <Container width="prose">
            <Reveal>
              <Eyebrow>Communes</Eyebrow>
              <Title id="zones-communes" as="h2" className="mt-4">
                Quelques repères du cœur de zone
              </Title>
              <Body className="mt-4 text-(--surface-fg-muted)">
                Sept communes parmi les 71 de la métropole, avec leur distance
                réelle à {area.city}. Ce n’est pas une liste de secteurs
                desservis d’office.
              </Body>
            </Reveal>

            {/* Liste, pas cartes : un filet, un nom, une distance. */}
            <Reveal>
              <ul className="mt-8">
                {METROPOLE_CITIES.map((city) => (
                  <li
                    key={city.code}
                    className={cn(
                      "flex items-baseline justify-center gap-4",
                      "border-t border-(--surface-rule) py-4",
                    )}
                  >
                    <span className="font-display text-subtitle text-(--surface-heading)">
                      {city.nom}
                    </span>
                    <span className="font-sans text-caption tabular-nums text-(--surface-fg-muted)">
                      {city.km === 0 ? "cœur de zone" : `${city.km} km`}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <Small className="mx-auto mt-9 block max-w-reading">
                Le plus simple reste de demander : une commune et quelques
                photos suffisent pour dire si le chantier est réalisable, et
                dans quels délais.
              </Small>
            </Reveal>
          </Container>
        </Section>
        {/* ----------------------------------------- 6. Conversion --- */}
        <Section surface="light" aria-labelledby="zones-cta">
          <Container>
            <Reveal>
              <div
                data-surface="dark"
                className={cn(
                  "rounded-card bg-(--surface-bg) text-(--surface-fg)",
                  "p-7 sm:p-10 lg:p-14",
                )}
              >
                <Title id="zones-cta" as="h2" className="mx-auto max-w-[20ch]">
                  Votre chantier est dans la zone ?
                </Title>
                <Body className="mx-auto mt-5 max-w-reading text-(--surface-fg-muted)">
                  Indiquez la commune et décrivez la situation : c’est la façon
                  la plus rapide de savoir si l’intervention est réalisable, et
                  sous quel délai. Le devis est gratuit.
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

            <Reveal className="mt-16 lg:mt-20">
              <Eyebrow as="h2">Les interventions</Eyebrow>
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
