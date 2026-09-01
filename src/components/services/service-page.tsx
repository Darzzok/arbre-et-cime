import Image from "next/image";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
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
  Title,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { getRoute, type RouteId } from "@/lib/routes";
import { servicesContent } from "@/lib/services-content";
import { area, contact, site, telHref } from "@/lib/site";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";

/**
 * Gabarit des quatre pages services — refait en phase 15B.4.
 *
 * CE QUI ÉTAIT À REFAIRE
 * ----------------------
 * Mesuré avant modification : les quatre pages avaient **le même hero de
 * 608 px, les mêmes cinq sections, la même dernière section de 1 158 px**, et
 * des totaux compris entre 4 144 et 4 487 px. Surtout, **toutes les sections
 * hors hero étaient ivoire** — quatre pages qui se déroulaient exactement de la
 * même façon.
 *
 * UN GABARIT, QUATRE PARCOURS DE SURFACES
 * ---------------------------------------
 * La structure reste unique : c'est ce que les moteurs attendent de pages
 * sœurs, et ce qui empêche l'une de dériver. Ce qui varie est déclaré dans
 * `services-content.ts` sous `theme` — la suite des surfaces, les motifs, la
 * forme de la carte photographique.
 *
 * LE HERO N A PLUS DE PHOTOGRAPHIE
 * ---------------------------------
 * Retirée sur demande du client après la phase 15B.4. Ce qui différencie les
 * quatre pages reste entier — la surface d ouverture et le motif de fond —
 * mais la page n a plus d image prioritaire : son LCP est un élément de texte,
 * et sa première photographie est celle de la méthode, paresseuse.
 */

const devis = getRoute("devis");

/**
 * Les quatre temps d'une intervention.
 *
 * **Rien n'est inventé ici** : ces quatre étapes sont la reformulation directe
 * de ce que `/a-propos` décrit déjà en toutes lettres — comprendre la demande,
 * sécuriser la zone avant la première coupe, travailler avec du matériel adapté,
 * puis débiter, broyer ou évacuer selon la prestation.
 *
 * Elles sont communes aux quatre services parce qu'elles le sont réellement.
 * Ce qui distingue les pages, ce sont les `points` propres à chaque prestation,
 * rendus juste en dessous.
 */
const STEPS = [
  {
    numero: "01",
    titre: "Analyser",
    detail: "Ce que vous attendez de l’arbre, et ce que le terrain permet.",
  },
  {
    numero: "02",
    titre: "Sécuriser",
    detail: "Zone de chantier établie avant la première coupe.",
  },
  {
    numero: "03",
    titre: "Intervenir",
    detail: "Matériel professionnel adapté à l’arbre comme à l’accès.",
  },
  {
    numero: "04",
    titre: "Nettoyer",
    detail: "Débitage, broyage ou évacuation selon la prestation.",
  },
] as const;

/**
 * Trois repères, pas six.
 *
 * La version précédente en alignait **six** sur une ligne repliable, dans le
 * panneau de conversion. Le brief de la phase 15B.4 en demande deux ou trois :
 * au-delà, ils cessent d'être lus. « Devis gratuit » n'y figure pas — c'est
 * déjà une capsule du hero, et le répéter en bas de page ne le rend pas plus
 * vrai.
 */
const proofs = [
  `${site.experienceYears}+ ans de métier`,
  "Professionnel diplômé",
  "Matériel professionnel",
];

/** Trois capsules maximum, toutes vérifiables dans `PROJECT.md`. */
const CAPSULES = [
  `${area.city} & Métropole`,
  "Devis gratuit",
  "Travail sécurisé",
];

export function ServicePage({ id }: { id: RouteId }) {
  const content = servicesContent[id];

  if (!content) {
    throw new Error(`Contenu de service manquant pour la route « ${id} ».`);
  }

  const { theme } = content;
  const tel = telHref();

  /* Capsules et cartes sombres : la variante suit la surface qui les porte. */
  const capsuleVariant =
    theme.hero === "dark" || theme.hero === "deep-forest" ? "dark" : "light";

  const conversionCapsule =
    theme.conversion === "dark" || theme.conversion === "deep-forest"
      ? "dark"
      : "light";

  return (
    <>
      <JsonLd data={breadcrumbSchema(id)} />
      {/* Gelé tant que `LocalBusiness` n'est pas publiable : la fabrique
          retourne `null` et rien n'est rendu. */}
      <JsonLd data={serviceSchema(id)} />

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {/* ---------------------------------------------------- 1. Hero ---
            HERO SANS PHOTOGRAPHIE — demande client, après la phase 15B.4.

            La carte photographique a été retirée. Ce qui différencie les quatre
            pages reste entier : la surface d'ouverture (forêt, forêt profond,
            sable, ivoire) et le motif de fond. C'est le seul endroit du site où
            quatre pages sœurs ouvrent sur quatre teintes différentes.

            Conséquence à connaître : ces pages n'ont plus d'image prioritaire.
            Leur LCP est désormais un élément de texte, et la première
            photographie de la page est celle de la méthode — paresseuse. */}
        <Section
          surface={theme.hero}
          spacing="standard"
          aria-labelledby="service-titre"
        >
          {theme.heroPattern ? (
            <SectionPattern pattern={theme.heroPattern} opacity={0.045} />
          ) : null}

          <Container className="relative">
            <Reveal className="mx-auto max-w-reading">
              <CapsuleGroup>
                {CAPSULES.map((label) => (
                  <Capsule key={label} variant={capsuleVariant} dot>
                    {label}
                  </Capsule>
                ))}
              </CapsuleGroup>

              <Display
                id="service-titre"
                as="h1"
                className="mt-6 lg:text-[3.25rem] lg:leading-[1.06]"
              >
                {content.heading}
              </Display>

              <Lead className="mt-5 text-(--surface-fg-muted)">
                {content.lead}
              </Lead>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                {/* La largeur est portée par une ENVELOPPE : `cn()` ne
                    fusionne pas les classes concurrentes. */}
                <div className="w-full sm:w-fit">
                  <ButtonLink
                    href={devis.path}
                    variant="primary"
                    size="lg"
                    block
                    data-cta="devis"
                    data-cta-source={`service-${id}-hero`}
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
                      data-cta-source={`service-${id}-hero`}
                    >
                      Appeler
                    </ButtonLink>
                  </div>
                ) : null}
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ----------------------------------------------- 2. Intention ---
            Le texte d'introduction et la précision propre au service, côte à
            côte. La précision était jusqu'ici enterrée au bas de la colonne de
            méthode, où personne ne la trouvait : elle devient une carte. */}
        <Section surface={theme.intro} aria-labelledby="service-intention">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-(--gutter)">
              <Reveal className="lg:col-span-7">
                <Eyebrow>{content.eyebrow}</Eyebrow>
                <Title
                  id="service-intention"
                  as="h2"
                  className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
                >
                  {content.intro.title}
                </Title>
                {content.intro.paragraphs.map((paragraph) => (
                  <Body
                    key={paragraph}
                    className="mx-auto mt-5 max-w-reading text-(--surface-fg-muted)"
                  >
                    {paragraph}
                  </Body>
                ))}
              </Reveal>

              <Reveal className="lg:col-span-5">
                <Card as="div" tone="plain" padding="lg" className="h-full">
                  <span
                    aria-hidden="true"
                    className="mx-auto block h-0.5 w-4 bg-safety"
                  />
                  <h3 className="mt-5 font-display text-subtitle leading-tight text-(--surface-heading)">
                    {content.note.title}
                  </h3>
                  <Body className="mt-3 text-(--surface-fg-muted)">
                    {content.note.body}
                  </Body>
                </Card>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ---------------------------------------------- 3. Situations --- */}
        <Section surface={theme.cases} aria-labelledby="service-cas">
          {theme.casesPattern ? (
            <SectionPattern pattern={theme.casesPattern} opacity={0.04} />
          ) : null}

          <Container className="relative">
            <Reveal className="mx-auto max-w-reading">
              <Title
                id="service-cas"
                as="h2"
                className="lg:text-[2.5rem] lg:leading-[1.08]"
              >
                {content.cases.title}
              </Title>
              <Body className="mt-4 text-(--surface-fg-muted)">
                {content.cases.intro}
              </Body>
            </Reveal>

            {/*
              GRILLE ASYMÉTRIQUE QUI SE REMPLIT EXACTEMENT.

              Trois colonnes à partir de 1024 px. La première carte en occupe
              deux ; avec quatre situations, la dernière aussi. Dans les deux
              cas — quatre ou cinq situations — la grille tombe juste sur deux
              rangées, sans cellule vide et sans cinq rectangles identiques.
            */}
            <ul className="mt-10 grid gap-(--card-gap) sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
              {content.cases.items.map((item, index) => {
                const large =
                  index === 0 ||
                  (content.cases.items.length === 4 && index === 3);

                return (
                  <Reveal
                    as="li"
                    key={item.title}
                    className={cn("h-full", large && "lg:col-span-2")}
                  >
                    <Card
                      as="div"
                      tone={theme.caseCardTone}
                      padding="md"
                      className="h-full"
                    >
                      <span
                        aria-hidden="true"
                        className="font-sans text-eyebrow font-semibold tabular-nums tracking-[0.2em] text-(--surface-fg-muted)"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-3 font-display text-subtitle leading-tight text-(--surface-heading)">
                        {item.title}
                      </h3>
                      <Body className="mx-auto mt-3 max-w-[46ch] text-(--surface-fg-muted)">
                        {item.body}
                      </Body>
                    </Card>
                  </Reveal>
                );
              })}
            </ul>
          </Container>
        </Section>

        {/* ------------------------------------------------ 4. Méthode --- */}
        <Section surface={theme.method} aria-labelledby="service-methode">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Title
                id="service-methode"
                as="h2"
                className="lg:text-[2.5rem] lg:leading-[1.08]"
              >
                {content.method.title}
              </Title>
              {content.method.paragraphs.map((paragraph) => (
                <Body
                  key={paragraph}
                  className="mt-5 text-(--surface-fg-muted)"
                >
                  {paragraph}
                </Body>
              ))}
            </Reveal>

            <div className="mt-12 grid gap-(--card-gap) lg:mt-14 lg:grid-cols-12 lg:items-stretch">
              {/* Photographie de méthode — paresseuse, jamais prioritaire. */}
              <Reveal className="lg:col-span-5">
                <figure className="relative m-0 aspect-[16/9] overflow-hidden rounded-card lg:aspect-auto lg:h-full lg:min-h-72">
                  <Image
                    src={content.method.image}
                    alt={content.method.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 64rem) 40rem, 100vw"
                    className={cn("object-cover", content.method.position)}
                  />
                </figure>
              </Reveal>

              {/* Les quatre temps, en 2 × 2. */}
              {/* Deux colonnes dès 390 px : un mot de titre et une ligne de détail
                  tiennent dans 171 px, et quatre cartes empilées coûtaient
                  684 px de haut pour quatre phrases courtes. */}
              <ol className="grid grid-cols-2 gap-(--card-gap) lg:col-span-7">
                {/* Le numéro suit la surface, il n est PAS en jaune sécurité.
                  Mesuré : 1,76 sur ivoire et 1,51 sur sable — la règle du § 1
                  du design system (« le jaune ne passe pas en texte sur fond
                  clair ») vaut aussi pour deux chiffres de 12 px. */}
                {STEPS.map((step) => (
                  <Reveal as="li" key={step.numero} className="h-full">
                    <Card as="div" tone="plain" padding="md" className="h-full">
                      <span
                        aria-hidden="true"
                        className="font-sans text-eyebrow font-semibold tabular-nums tracking-[0.24em] text-(--surface-fg-muted)"
                      >
                        {step.numero}
                      </span>
                      <h3 className="mt-3 font-display text-subtitle leading-tight text-(--surface-heading)">
                        {step.titre}
                      </h3>
                      <Body className="mx-auto mt-2.5 max-w-[34ch] text-(--surface-fg-muted)">
                        {step.detail}
                      </Body>
                    </Card>
                  </Reveal>
                ))}
              </ol>
            </div>

            {/* Ce qui est propre à CETTE prestation, sous les quatre temps
                communs. C'est la partie qui distingue les pages entre elles. */}
            <Reveal className="mt-10 lg:mt-12">
              <ul className="mx-auto grid max-w-4xl gap-x-8 gap-y-4 sm:grid-cols-3">
                {content.method.points.map((point) => (
                  <li
                    key={point}
                    className="border-t border-(--surface-rule) pt-4"
                  >
                    <span className="font-sans text-caption leading-relaxed text-(--surface-fg-muted) text-pretty">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>

        {/* --------------------------------------------- 5. Conversion --- */}
        <Section surface={theme.conversion} aria-labelledby="service-cta">
          <Container>
            {/* -------- Trois repères, en capsules --------

                Ils ont d'abord été rendus en cartes. Mesuré : **390 px de
                hauteur à 390 px de large** pour trois faits de quatre mots,
                soit un tiers d'écran mobile. Les capsules disent la même chose
                en 80 px, et reprennent le motif déjà employé par le hero — la
                page ne gagne pas un objet de plus. */}
            <Reveal>
              <CapsuleGroup>
                {proofs.map((proof) => (
                  <Capsule key={proof} variant={conversionCapsule} dot>
                    {proof}
                  </Capsule>
                ))}
              </CapsuleGroup>
            </Reveal>

            {/* -------- Carte de conversion --------
                Forêt profond, quelle que soit la surface de la section : c'est
                le point d'ancrage de la page. La bande claire ou sable qui
                l'entoure est ce qui l'empêche de fusionner avec le pied de
                page, lui aussi sombre. */}
            <Reveal className="mt-(--card-gap)">
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
                    id="service-cta"
                    as="h2"
                    className="mx-auto mt-6 max-w-[18ch] lg:text-[3rem] lg:leading-[1.04]"
                  >
                    {content.ctaTitle}
                  </Title>

                  <Body className="mx-auto mt-5 max-w-[48ch] text-(--surface-fg-muted)">
                    Décrivez la situation en quelques lignes, ajoutez des photos
                    si vous en avez : c’est souvent suffisant pour établir un
                    devis sans visite préalable.
                  </Body>

                  <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                    <div className="w-full sm:w-fit">
                      <ButtonLink
                        href={contact.quotePath}
                        variant="primary"
                        size="lg"
                        block
                        data-cta="devis"
                        data-cta-source={`service-${id}-final`}
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
                          data-cta-source={`service-${id}-final`}
                        >
                          Appeler
                        </ButtonLink>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            </Reveal>

            {/* -------- Maillage interne : trois cartes compactes -------- */}
            <Reveal className="mt-16 lg:mt-20">
              <Eyebrow as="h2">Autres interventions</Eyebrow>

              <ul className="mt-6 grid grid-cols-2 gap-(--card-gap) sm:grid-cols-3">
                {content.related.map((relatedId) => {
                  const related = getRoute(relatedId);

                  return (
                    <li key={relatedId} className="h-full">
                      <CardLink
                        href={related.path}
                        tone="plain"
                        padding="md"
                        className="flex h-full flex-col justify-center"
                      >
                        <span className="font-display text-subtitle leading-tight text-(--surface-heading)">
                          {related.navLabel}
                        </span>

                        {related.navTagline ? (
                          <span className="mt-2 font-sans text-caption text-(--surface-fg-muted)">
                            {related.navTagline}
                          </span>
                        ) : null}

                        <span className="mt-4 inline-flex items-center justify-center gap-2.5 font-sans text-caption font-semibold text-(--surface-fg)">
                          Découvrir
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
                      </CardLink>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </Container>
        </Section>
      </main>
    </>
  );
}
