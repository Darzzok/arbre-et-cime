import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { ZoneMap } from "@/components/map/zone-map";
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
  Title,
  type Surface,
} from "@/components/ui";
import {
  LOCATIONS,
  getLocation,
  neighboursOf,
  type Location,
  type LocationTier,
} from "@/content/locations";
import { cn } from "@/lib/cn";
import { localMarkers } from "@/lib/local-markers";
import { getRoute, serviceRoutes } from "@/lib/routes";
import { buildLocationMetadata, locationPath } from "@/lib/seo";
import { area, contact, qualifications, site, telHref } from "@/lib/site";
import { locationBreadcrumbSchema } from "@/lib/structured-data";

/**
 * Page locale — une par commune de la carte (phase 14), refaite en 15B.5.
 *
 * UNE SEULE LANDING PAR VILLE
 * ---------------------------
 * Pas de `/elagage-rouen`, `/abattage-rouen` et consorts : ces pages
 * n'existeraient que pour les moteurs et se cannibaliseraient entre elles.
 *
 * CE QUI ÉTAIT À REFAIRE
 * ----------------------
 * Mesuré avant refonte : **sept sections, toutes ivoire** sur les 23 pages,
 * soit six successions de surfaces identiques. Le gabarit ne distinguait pas
 * non plus une commune du cœur de zone d'une commune à 100 km : seuls les
 * textes changeaient.
 *
 * CE QUI EST STRICTEMENT CONSERVÉ
 * -------------------------------
 * `generateStaticParams`, les slugs, les métadonnées, le `h1`, les textes
 * propres à chaque commune (`intro`, `contexte`, `servicesIntro`), la
 * classification, la distance calculée, la carte locale, les voisins calculés
 * et le maillage. **Aucune réécriture SEO.**
 *
 * VOCABULAIRE INTERNE / VOCABULAIRE PUBLIC
 * ----------------------------------------
 * `core`, `primary` et `extended` n'apparaissent nulle part dans l'interface.
 * Ce que le visiteur lit, ce sont les libellés de `TIER_LABEL`, qui disent le
 * niveau d'engagement en clair — et jamais plus que ce qui est vrai.
 */

type PageProps = { params: Promise<{ ville: string }> };

export function generateStaticParams() {
  return LOCATIONS.map((location) => ({ ville: location.slug }));
}

/** Titre court et régulier : « Élagueur à X | Arbres & Cimes ». */
/**
 * LE TITRE LAISSAIT UN TIERS DE LA VITRINE VIDE — corrigé en phase 17B.
 *
 * « Élagueur à Rouen | Arbres & Cimes » fait **37 signes** quand un résultat
 * de recherche en affiche près de 60. Sur les communes à nom court, plus d'un
 * tiers de la place disponible n'était pas utilisé.
 *
 * Le département comble l'écart et travaille : il lève l'ambiguïté entre les
 * homonymes, et il porte une requête réelle — « élagueur 76 » se cherche
 * autant que « élagueur Rouen ».
 *
 * LE TITRE RESTE BORNÉ À 60 SIGNES, et c'est mesuré ici même. Sur les noms
 * longs — Saint-Étienne-du-Rouvray, Mantes-la-Jolie — l'ajout ferait déborder :
 * la marque saute alors, jamais la commune. Le nom de la commune est ce qui
 * fait cliquer ; « Arbres & Cimes » est ce que le visiteur découvrira ensuite.
 */
const DEPARTEMENT_CODE: Record<string, string> = {
  "Seine-Maritime": "76",
  Eure: "27",
  Calvados: "14",
  Oise: "60",
  Somme: "80",
  Yvelines: "78",
};

const TITRE_MAX = 60;

function titleFor(location: Location): string {
  const code = DEPARTEMENT_CODE[location.departement];
  const base = code
    ? `Élagueur ${location.a} (${code})`
    : `Élagueur ${location.a}`;

  const complet = `${base} | ${site.shortName}`;
  return complet.length <= TITRE_MAX ? complet : base;
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
 * Pour une commune `extended`, la phrase est celle imposée au brief de la
 * phase 14, au mot près : promettre une intervention à cent kilomètres serait
 * un mensonge commercial, et le visiteur qui se déplacerait pour rien s'en
 * souviendrait.
 */
const TIER_LABEL = {
  core: "Zone principale d’intervention",
  primary: "Interventions possibles selon le chantier",
  extended: "Déplacement à étudier",
} as const;

/**
 * VARIATION VISUELLE PAR NIVEAU — introduite en phase 15B.5.
 *
 * Un seul gabarit, trois ouvertures. Ce n'est pas trois designs : seule la
 * **surface du hero** change, et avec elle la variante de capsule qu'elle
 * impose. Tout le reste de la page est identique d'une commune à l'autre.
 *
 * L'intensité suit l'engagement réel :
 *
 * | Niveau | Hero | Lecture |
 * | --- | --- | --- |
 * | `core` | forêt | l'aplat le plus affirmé — c'est la zone d'attache |
 * | `primary` | sable | intermédiaire, chaleureux, sans l'autorité du forêt |
 * | `extended` | ivoire | le plus neutre — la page la plus prudente du site |
 *
 * Une commune à 100 km n'a pas à s'annoncer avec la même assurance que Rouen.
 */
const HERO_SURFACE: Record<LocationTier, Surface> = {
  core: "dark",
  primary: "sand",
  extended: "light",
};

/**
 * Distance annoncée : toujours « à vol d’oiseau », jamais « en voiture ».
 *
 * Elle est calculée depuis les centroïdes officiels ; l’écrire comme une
 * distance routière serait faux, et vérifiable en trente secondes par
 * n’importe quel visiteur.
 */
function distanceLine(location: Location): string {
  if (location.km === 0) {
    /*
     * « COMMUNE D'ATTACHE » AFFIRMAIT UNE IMPLANTATION — corrigé en phase 17.
     *
     * Le siège de l'entreprise est au Grand-Quevilly, pas à Rouen. Écrire que
     * Rouen est la commune d'attache laissait entendre une adresse
     * rouennaise ; la phrase dit maintenant ce qui est vrai et suffisant :
     * Rouen est le centre du secteur, pas le domicile de l'entreprise.
     *
     * Le centre cartographique, les distances et les voisins sont inchangés :
     * Rouen reste le point de projection et la cible SEO principale.
     *
     * La phrase ne reprend pas non plus le chapô de la commune, qui dit déjà
     * « Rouen se situe au cœur du secteur d'intervention ». Ce bloc-ci est le
     * repère de DISTANCE : pour toutes les autres communes il annonce des
     * kilomètres, il dit donc ici d'où ces kilomètres sont comptés.
     */
    return `${location.nom} est le point de référence du secteur : toutes les distances annoncées s’y rapportent.`;
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
  const tel = telHref();

  const heroSurface = HERO_SURFACE[location.tier];
  const heroCapsule =
    heroSurface === "dark" || heroSurface === "deep-forest" ? "dark" : "light";

  /* La section qui SUIT le hero ne peut pas partager sa surface. Sur une
     commune `extended`, le hero est ivoire : les prestations passent alors sur
     sable. Mesuré avant correction — les pages `extended` étaient les seules à
     enchaîner deux surfaces identiques. */
  const apresHero: Surface = heroSurface === "light" ? "sand" : "light";

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <JsonLd
        data={locationBreadcrumbSchema({
          slug: location.slug,
          nom: location.nom,
        })}
      />

      {/* ------------------------------------------------------- Hero ---
          Pas de photographie : vingt-trois pages ne peuvent pas avoir
          vingt-trois heros photo sans réemployer trois fois la même image.
          La surface, le motif et la capsule suffisent à situer la page. */}
      <Section surface={heroSurface} aria-labelledby="ville-titre">
        <SectionPattern pattern="contour" opacity={0.05} />

        <Container className="relative">
          <Reveal className="mx-auto max-w-reading">
            <Capsule variant={heroCapsule}>{TIER_LABEL[location.tier]}</Capsule>

            <Display
              id="ville-titre"
              as="h1"
              className="mt-5 text-title lg:text-[3rem] lg:leading-[1.06]"
            >
              Élagueur {location.a}
            </Display>

            <Lead className="mt-5 text-(--surface-fg-muted)">
              {location.intro}
            </Lead>
          </Reveal>

          {/* Bloc géographique — la distance calculée, présentée comme un
              repère et non comme une ligne de légende perdue sous le chapô. */}
          <Reveal className="mt-9">
            <Card
              as="div"
              tone={heroSurface === "dark" ? "forest" : "plain"}
              padding="md"
              className="mx-auto max-w-reading"
            >
              <p className="font-sans text-caption leading-relaxed text-(--surface-fg-muted) text-pretty">
                {distanceLine(location)} {location.departement},{" "}
                {location.region}.
              </p>
            </Card>
          </Reveal>

          <Reveal className="mt-8">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              {/* La largeur est portée par une ENVELOPPE : `cn()` ne fusionne
                  pas les classes concurrentes. */}
              <div className="w-full sm:w-fit">
                <ButtonLink
                  href={devis.path}
                  variant="primary"
                  size="lg"
                  block
                  data-cta="devis"
                  data-cta-source={`ville-${location.slug}-hero`}
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
                    data-cta-source={`ville-${location.slug}-hero`}
                  >
                    Appeler
                  </ButtonLink>
                </div>
              ) : null}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* --------------------------------------------------- Prestations ---
          Cartes DÉLIBÉRÉMENT plus petites que celles de l'accueil et des pages
          services : ici elles servent le maillage et la compréhension, pas la
          démonstration. Deux colonnes dès 390 px.

          SANS FILET — demande client, phase 16B. Quatre rectangles cernés sur
          une même grille produisaient exactement le motif de cartes identiques
          que `CLAUDE.md` § 6 interdit. Le fond de la carte tranche déjà sur la
          section : le filet n'ajoutait qu'un trait à lire. La bordure reste
          transparente, donc le survol continue de la révéler et aucune
          dimension ne bouge. */}
      <Section surface={apresHero} aria-labelledby="interventions">
        <Container>
          <Reveal className="mx-auto max-w-reading">
            <Eyebrow>Prestations</Eyebrow>
            <Title
              id="interventions"
              as="h2"
              className="mt-4 lg:text-[2.25rem] lg:leading-[1.1]"
            >
              Nos interventions {location.a}
            </Title>
            <Body className="mt-4 text-(--surface-fg-muted)">
              {location.servicesIntro}
            </Body>
          </Reveal>

          <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-(--card-gap) lg:mt-12 lg:grid-cols-4">
            {serviceRoutes.map((route) => (
              <Reveal as="li" key={route.id} className="h-full">
                <CardLink
                  href={route.path}
                  tone={apresHero === "sand" ? "plain" : "sand"}
                  padding="md"
                  bordered={false}
                  className="flex h-full flex-col justify-center"
                >
                  {/*
                    « DESSOUCHAGE » NE TIENT PAS EN 22 px SUR DEUX COLONNES.

                    Mesuré à 320 px : la carte fait 132 px, il en reste 92 une
                    fois le rembourrage retiré, et le mot en réclame 150. La
                    carte porte `overflow-hidden` : il était donc COUPÉ, pas
                    débordé — on lisait « Dessouchag ». Idem à 390 px.

                    Le titre passe donc au corps de texte sous 480 px et ne
                    reprend sa taille de sous-titre qu'ensuite. Mesuré après
                    correction : plus aucune troncature à 390, 768 ni 1 440 px.

                    Restent les écrans de 320 px, sous le plancher de conception
                    du projet, où « Dessouchage » réclame encore 112 px pour 92
                    disponibles. Deux filets de sécurité, dans cet ordre :
                    `hyphens-auto` (la page est en `lang="fr"`) coupe le mot
                    proprement quand le navigateur dispose du dictionnaire ;
                    `break-words` le renvoie à la ligne quand il ne l'a pas.
                    Une césure ou un retour à la ligne valent mieux qu'un mot
                    coupé au ciseau par `overflow-hidden`.
                  */}
                  <span className="font-display text-body leading-tight hyphens-auto break-words text-(--surface-heading) sm:text-subtitle">
                    {route.navLabel}
                  </span>
                  {route.navTagline ? (
                    <span className="mt-2 font-sans text-caption leading-relaxed text-(--surface-fg-muted)">
                      {route.navTagline}
                    </span>
                  ) : null}
                </CardLink>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* -------------------------------------------------- Bloc local ---
          C'est LE bloc qui distingue les 23 pages entre elles. Son texte n'a
          pas été touché : il vient de `locations.ts`, une commune à la fois. */}
      <Section surface="deep-forest" aria-labelledby="contexte-local">
        <SectionPattern pattern="rings" opacity={0.04} />

        <Container className="relative">
          <Reveal className="mx-auto max-w-reading">
            <Eyebrow>Sur le terrain</Eyebrow>
            <Title
              id="contexte-local"
              as="h2"
              className="mt-4 lg:text-[2.25rem] lg:leading-[1.1]"
            >
              {location.tier === "extended"
                ? `Ce qui conditionne un déplacement ${location.a}`
                : `Le contexte ${location.a}`}
            </Title>

            <Body className="mt-5 text-(--surface-fg-muted)">
              {location.contexte}
            </Body>
          </Reveal>

          {/* L'engagement, en clair et sans adoucissement. */}
          <Reveal className="mt-9">
            <Card
              as="div"
              tone="forest"
              padding="lg"
              className="mx-auto max-w-reading"
            >
              <span
                aria-hidden="true"
                className="mx-auto block h-0.5 w-4 bg-safety"
              />
              <p className="mt-4 font-sans text-body leading-relaxed text-(--surface-fg) text-pretty">
                {engagement(location)}
              </p>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------ Carte locale --- */}
      <Section surface="light" aria-labelledby="carte-locale">
        <Container>
          <Reveal className="mx-auto max-w-reading">
            <Eyebrow>Situation</Eyebrow>
            <Title
              id="carte-locale"
              as="h2"
              className="mt-4 lg:text-[2.25rem] lg:leading-[1.1]"
            >
              {location.nom} et {site.shortName}
            </Title>
          </Reveal>

          <Reveal className="mt-10 lg:mt-12">
            <Card as="div" tone="sand" padding="none">
              <div className="p-4 sm:p-6 lg:p-8">
                <ZoneMap
                  variant="local"
                  highlight={location.id}
                  markers={localMarkers(location)}
                  className="mx-auto max-w-[44rem]"
                  title={`Carte situant ${location.nom} par rapport à Rouen`}
                />
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------- Voisins --- */}
      <Section surface="sand" aria-labelledby="voisins">
        <Container>
          <Reveal className="mx-auto max-w-reading">
            <Eyebrow>Maillage local</Eyebrow>
            <Title
              id="voisins"
              as="h2"
              className="mt-4 lg:text-[2.25rem] lg:leading-[1.1]"
            >
              Autour {location.de}
            </Title>
          </Reveal>

          {/* Trois à cinq voisins, calculés — jamais choisis à la main. */}
          <ul className="mx-auto mt-9 grid max-w-4xl gap-x-8 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {voisins.map((voisin) => (
              <li
                key={voisin.slug}
                className="border-t border-(--surface-rule)"
              >
                <ArrowLink
                  href={locationPath(voisin.slug)}
                  className="flex min-h-12 w-full items-center justify-between gap-3 py-3"
                >
                  {voisin.nom}
                </ArrowLink>
              </li>
            ))}
          </ul>

          <Reveal className="mt-10">
            <ArrowLink href={zones.path}>
              Voir toute la zone d’intervention
            </ArrowLink>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------------- CTA --- */}
      <Section surface="light" aria-labelledby="cta-ville">
        <Container>
          {/* Les repères de confiance, en capsules : quatre lignes de liste à
              filet coûtaient une section entière pour quatre faits courts. */}
          <Reveal>
            <CapsuleGroup>
              <Capsule variant="light" dot>
                {site.experienceYears}+ ans de métier
              </Capsule>
              {qualifications.map((titre) => (
                <Capsule key={titre} variant="light" dot>
                  {titre}
                </Capsule>
              ))}
              <Capsule variant="light" dot>
                Chantier laissé propre
              </Capsule>
            </CapsuleGroup>
          </Reveal>

          <Reveal className="mt-10 lg:mt-12">
            <Card
              as="div"
              tone="deep"
              padding="none"
              className="mx-auto max-w-5xl"
            >
              <SectionPattern pattern="contour" opacity={0.05} />

              <div className="relative px-6 py-11 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
                <Capsule variant="accent">Devis gratuit</Capsule>

                {/* La formulation reste prudente pour les communes éloignées :
                    « un chantier », pas « besoin d'un élagueur ». */}
                <Title
                  id="cta-ville"
                  as="h2"
                  className={cn(
                    "mx-auto mt-6 max-w-[20ch]",
                    "lg:text-[2.75rem] lg:leading-[1.06]",
                  )}
                >
                  {location.tier === "extended"
                    ? `Un chantier ${location.a} ?`
                    : `Besoin d’un élagueur ${location.a} ?`}
                </Title>

                <Body className="mx-auto mt-5 max-w-[48ch] text-(--surface-fg-muted)">
                  Décrivez le chantier en quelques minutes, ajoutez des photos
                  si vous en avez : c’est ce qui permet de chiffrer le plus
                  vite.
                </Body>

                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                  <div className="w-full sm:w-fit">
                    <ButtonLink
                      href={contact.quotePath}
                      variant="primary"
                      size="lg"
                      block
                      data-cta="devis"
                      data-cta-source={`ville-${location.slug}-final`}
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
                        data-cta-source={`ville-${location.slug}-final`}
                      >
                        Appeler
                      </ButtonLink>
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
