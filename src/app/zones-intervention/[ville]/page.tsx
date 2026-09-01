import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { ZoneMap } from "@/components/map/zone-map";
import { JsonLd } from "@/components/seo/json-ld";
import {
  ArrowLink,
  Body,
  ButtonLink,
  Container,
  Display,
  Eyebrow,
  Lead,
  Reveal,
  Section,
  Subtitle,
  Title,
} from "@/components/ui";
import {
  LOCATIONS,
  getLocation,
  neighboursOf,
  type Location,
} from "@/content/locations";
import { cn } from "@/lib/cn";
import { localMarkers } from "@/lib/local-markers";
import { getRoute, serviceRoutes } from "@/lib/routes";
import { buildLocationMetadata, locationPath } from "@/lib/seo";
import { area, qualifications, site } from "@/lib/site";
import { locationBreadcrumbSchema } from "@/lib/structured-data";

/**
 * Page locale — une par commune de la carte (phase 14).
 *
 * UNE SEULE LANDING PAR VILLE
 * ---------------------------
 * Pas de `/elagage-rouen`, `/abattage-rouen` et consorts : ces pages
 * n'existeraient que pour les moteurs, se cannibaliseraient entre elles et
 * diviseraient l'autorité du site sur des contenus quasi identiques. La
 * répartition est nette et tient en une ligne :
 *
 * - **page service** → intention métier (« comment se passe un abattage ») ;
 * - **page ville**   → intention géographique (« un élagueur près de chez moi »).
 *
 * Chaque page ville renvoie vers les quatre pages services ; aucune ne les
 * duplique.
 *
 * ENTIÈREMENT STATIQUE
 * --------------------
 * `generateStaticParams` produit les vingt-trois routes au build. Aucun
 * runtime Node n'est requis, ce qui garde le site exportable tel quel sur
 * l'hébergement retenu (phase 13).
 *
 * CE QUI N'EST JAMAIS AFFIRMÉ ICI
 * -------------------------------
 * Aucune adresse locale, aucun établissement secondaire, aucun chantier
 * réalisé, aucun délai. Une page ville décrit une **zone de service** depuis
 * Rouen — jamais une implantation. Pour les communes éloignées, la formulation
 * reste conditionnelle du titre au dernier paragraphe.
 */

type PageProps = { params: Promise<{ ville: string }> };

export function generateStaticParams() {
  return LOCATIONS.map((location) => ({ ville: location.slug }));
}

/** Titre court et régulier : « Élagueur à X | Arbres & Cimes ». */
function titleFor(location: Location): string {
  return `Élagueur ${location.a} | ${site.shortName}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { ville } = await params;
  const location = getLocation(ville);

  if (!location) {
    return {};
  }

  return buildLocationMetadata({
    slug: location.slug,
    title: titleFor(location),
    description: location.description,
  });
}

/* -------------------------------------------------------------- Discours -- */

/**
 * La formulation dépend du niveau, et elle n'est jamais adoucie.
 *
 * Pour une commune `extended`, la phrase est celle imposée au brief, au mot
 * près : promettre une intervention à cent kilomètres serait un mensonge
 * commercial, et le visiteur qui se déplacerait pour rien s'en souviendrait.
 */
const TIER_LABEL = {
  core: "Zone principale d’intervention",
  primary: "Interventions possibles selon le chantier",
  extended: "Déplacement à étudier",
} as const;

/**
 * Distance annoncée : toujours « à vol d’oiseau », jamais « en voiture ».
 *
 * Elle est calculée depuis les centroïdes officiels ; l’écrire comme une
 * distance routière serait faux, et vérifiable en trente secondes par
 * n’importe quel visiteur.
 */
function distanceLine(location: Location): string {
  if (location.km === 0) {
    return `${location.nom} est la commune d’attache d’${site.shortName}.`;
  }

  return `À environ ${location.km} km de ${area.city} à vol d’oiseau, au ${location.direction}.`;
}

function engagement(location: Location): string {
  switch (location.tier) {
    case "core":
      return `${location.nom} appartient à la ${area.metro} : c’est la zone principale d’intervention d’${site.shortName}.`;
    case "primary":
      return `Les interventions ${location.a} sont possibles selon la nature du chantier.`;
    case "extended":
      return `Un déplacement jusqu’${location.a} peut être envisagé selon la nature, l’ampleur et l’organisation du chantier.`;
  }
}

/* ------------------------------------------------------------------ Page -- */

export default async function VillePage({ params }: PageProps) {
  const { ville } = await params;
  const location = getLocation(ville);

  if (!location) {
    notFound();
  }

  const zones = getRoute("zones-intervention");
  const devis = getRoute("devis");
  const voisins = neighboursOf(location);

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <JsonLd
        data={locationBreadcrumbSchema({
          slug: location.slug,
          nom: location.nom,
        })}
      />

      {/* ------------------------------------------------------- Hero --- */}
      <Section surface="light" spacing="tight">
        <Container width="prose">
          <Eyebrow>{TIER_LABEL[location.tier]}</Eyebrow>

          <Display as="h1" className="mt-4 text-title">
            Élagueur {location.a}
          </Display>

          <Lead className="mt-5 text-(--surface-fg-muted)">
            {location.intro}
          </Lead>

          <p className="mt-4 font-sans text-caption text-(--surface-fg-muted)">
            {distanceLine(location)} {location.departement}, {location.region}.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ButtonLink href={devis.path} variant="primary" size="lg">
              Demander un devis
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------- Prestations --- */}
      <Section surface="light" spacing="tight" aria-labelledby="interventions">
        <Container>
          <Reveal className="mx-auto max-w-reading">
            <Title id="interventions" as="h2" className="text-subtitle">
              Nos interventions {location.a}
            </Title>
            <Body className="mt-4 text-(--surface-fg-muted)">
              {location.servicesIntro}
            </Body>
          </Reveal>

          <Reveal>
            <ul className="mx-auto mt-10 grid max-w-4xl gap-x-8 gap-y-6 text-left sm:grid-cols-2">
              {serviceRoutes.map((route) => (
                <li
                  key={route.id}
                  className="border-t border-(--surface-rule) pt-4"
                >
                  <h3 className="font-display text-subtitle leading-tight text-(--surface-heading)">
                    <Link
                      href={route.path}
                      className="no-underline hover:underline"
                    >
                      {route.navLabel}
                    </Link>
                  </h3>
                  <p className="mt-2 font-sans text-caption leading-relaxed text-(--surface-fg-muted)">
                    {route.navTagline}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* -------------------------------------------------- Bloc local --- */}
      <Section surface="light" spacing="tight" aria-labelledby="contexte-local">
        <Container width="prose">
          <Reveal>
            <Title id="contexte-local" as="h2" className="text-subtitle">
              {location.tier === "extended"
                ? `Ce qui conditionne un déplacement ${location.a}`
                : `Le contexte ${location.a}`}
            </Title>

            <Body className="mt-4 text-(--surface-fg-muted)">
              {location.contexte}
            </Body>

            <p
              className={cn(
                "mt-6 rounded-card border border-(--surface-rule) bg-(--surface-inset)",
                "p-4 text-left font-sans text-caption text-(--surface-fg)",
              )}
            >
              {engagement(location)}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------ Carte locale --- */}
      <Section surface="light" spacing="tight" aria-labelledby="carte-locale">
        <Container>
          <Reveal className="mx-auto max-w-reading">
            <Title id="carte-locale" as="h2" className="text-subtitle">
              {location.nom} et {site.shortName}
            </Title>
          </Reveal>

          <Reveal className="mx-auto mt-8 max-w-[42rem]">
            <ZoneMap
              variant="local"
              highlight={location.id}
              markers={localMarkers(location)}
              title={`Carte situant ${location.nom} par rapport à Rouen`}
            />
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------- Voisins --- */}
      <Section surface="light" spacing="tight" aria-labelledby="voisins">
        <Container width="prose">
          <Reveal>
            <Title id="voisins" as="h2" className="text-subtitle">
              Secteurs voisins
            </Title>

            <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3">
              {voisins.map((voisin) => (
                <li key={voisin.slug}>
                  <Link
                    href={locationPath(voisin.slug)}
                    className="font-sans text-body text-(--surface-fg)"
                  >
                    {voisin.nom}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ArrowLink href={zones.path}>
                Voir toute la zone d’intervention
              </ArrowLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------- Confiance --- */}
      <Section surface="light" spacing="tight" aria-labelledby="confiance">
        <Container width="prose">
          <Reveal>
            <Title id="confiance" as="h2" className="text-subtitle">
              Un professionnel qualifié
            </Title>

            <ul className="mt-6 grid gap-x-8 gap-y-3 text-left sm:grid-cols-2">
              <li className="border-t border-(--surface-rule) pt-3 font-sans text-caption text-(--surface-fg)">
                Environ {site.experienceYears} ans d’expérience du métier
              </li>
              {qualifications.map((titre) => (
                <li
                  key={titre}
                  className="border-t border-(--surface-rule) pt-3 font-sans text-caption text-(--surface-fg)"
                >
                  {titre}
                </li>
              ))}
              <li className="border-t border-(--surface-rule) pt-3 font-sans text-caption text-(--surface-fg)">
                Travail sécurisé, chantier laissé propre
              </li>
              <li className="border-t border-(--surface-rule) pt-3 font-sans text-caption text-(--surface-fg)">
                Devis gratuit et sans engagement
              </li>
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* ----------------------------------------------------- CTA --- */}
      <Section surface="light" aria-labelledby="cta-ville">
        <Container width="prose">
          <Reveal>
            <Subtitle id="cta-ville" as="h2">
              {location.tier === "extended"
                ? `Un chantier ${location.a} ? Parlons-en.`
                : `Besoin d’un élagueur ${location.a} ?`}
            </Subtitle>

            <Body className="mt-4 text-(--surface-fg-muted)">
              Décrivez le chantier en quelques minutes, ajoutez des photos si
              vous en avez : c’est ce qui permet de chiffrer le plus vite.
            </Body>

            <div className="mt-8 flex justify-center">
              <ButtonLink href={devis.path} variant="primary" size="lg">
                Demander un devis
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
