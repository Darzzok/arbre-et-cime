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
  Rule,
  Section,
  Subtitle,
  Title,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { getRoute, type RouteId } from "@/lib/routes";
import { servicesContent } from "@/lib/services-content";
import { area, site } from "@/lib/site";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";

/**
 * Gabarit des quatre pages services.
 *
 * La **structure** est commune — c'est ce qui rend le site cohérent et ce que
 * les moteurs attendent d'un ensemble de pages sœurs. Ce qui doit différer,
 * c'est le **contenu** : il vit intégralement dans `src/lib/services-content.ts`,
 * réuni là pour être relu d'un bloc et vérifier qu'aucune page n'est la copie
 * d'une autre avec un mot-clé permuté.
 *
 * Cinq blocs, pas plus : hero, intention, cas, méthode, conversion.
 */

const devis = getRoute("devis");

/**
 * Repères repris des pages, en version **courte** : la bande de la page
 * d'accueil serait redondante ici, et alourdirait une page déjà dense.
 */
const proofs = [
  `${site.experienceYears} ans d’expérience`,
  "Professionnel diplômé",
  "Devis gratuit",
  "Intervention rapide",
  "Chantier propre",
  `Jusqu’à ${area.maxRadiusKm} km`,
];

export function ServicePage({ id }: { id: RouteId }) {
  const content = servicesContent[id];

  if (!content) {
    throw new Error(`Contenu de service manquant pour la route « ${id} ».`);
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema(id)} />
      {/* Gelé tant que `LocalBusiness` n'est pas publiable : la fabrique
          retourne `null` et rien n'est rendu. S'activera seule en phase 14. */}
      <JsonLd data={serviceSchema(id)} />

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {/* ---------------------------------------------------- 1. Hero --- */}
        <section
          aria-labelledby="service-titre"
          data-surface="dark"
          className={cn(
            "relative isolate flex items-end overflow-hidden",
            // Assez haut pour que la photographie existe au-dessus du texte,
            // assez court pour que le CTA reste dans le premier écran.
            "min-h-[30rem] sm:min-h-[34rem] lg:min-h-[38rem]",
          )}
        >
          <Image
            src={content.hero.image}
            alt={content.hero.alt}
            fill
            /* `priority` pose bien le lien de prechargement, mais Next ne lui ajoute
               pas `fetchpriority=high` : sans cet attribut le navigateur telecharge
               la photo LCP a priorite normale, derriere la feuille de style. Mesure en
               phase 15B.2 sur /elagage — Lighthouse le signale sous lcp-discovery. */
            priority
            fetchPriority="high"
            sizes="100vw"
            className={cn("-z-10 object-cover", content.hero.position)}
          />
          <HeroScrim />

          <Container className="relative py-12 lg:py-16">
            <div className="mx-auto max-w-reading">
              {/* Surtitre en ivoire, pas en pierre : posé haut dans le hero, il
                  tombe là où le dégradé est le plus faible. Sur `/elagage`, la
                  pierre le faisait descendre à 4,51 de contraste — l'ivoire le
                  remonte à 6,6. Rendu à la main plutôt qu'avec `Eyebrow` :
                  `cn()` ne fusionne pas deux classes de couleur concurrentes
                  (cf. DESIGN_SYSTEM.md § 8). */}
              <p className="font-sans text-eyebrow font-semibold uppercase text-(--surface-fg)">
                {content.eyebrow}
              </p>
              <Display id="service-titre" as="h1" className="mt-4">
                {content.heading}
              </Display>
              <Lead className="mt-5">{content.lead}</Lead>
              <div className="mt-8 w-full sm:mx-auto sm:w-fit">
                <ButtonLink href={devis.path} variant="primary" size="lg" block>
                  Demander un devis
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>

        {/* ----------------------------------------------- 2. Intention --- */}
        <Section surface="light" aria-labelledby="service-intention">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Title id="service-intention" as="h2">
                {content.intro.title}
              </Title>
              {content.intro.paragraphs.map((paragraph) => (
                <Body key={paragraph} className="mt-5">
                  {paragraph}
                </Body>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ---------------------------------------------------- 3. Cas --- */}
        <Section surface="light" spacing="tight" aria-labelledby="service-cas">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Title id="service-cas" as="h2">
                {content.cases.title}
              </Title>
              <Body className="mt-4 text-(--surface-fg-muted)">
                {content.cases.intro}
              </Body>
            </Reveal>

            <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-12 lg:gap-5">
              {content.cases.items.map((item, index) => (
                <Reveal
                  as="li"
                  key={item.title}
                  className={cn(
                    "rounded-soft border border-(--surface-rule)",
                    "bg-(--surface-inset) p-6 lg:p-7",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="font-sans text-eyebrow font-semibold tabular-nums text-(--surface-fg-muted)"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Subtitle as="h3" className="mt-2.5">
                    {item.title}
                  </Subtitle>
                  <Body className="mt-3 text-(--surface-fg-muted)">
                    {item.body}
                  </Body>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        {/* ------------------------------------------------ 4. Méthode --- */}
        <Section surface="light" aria-labelledby="service-methode">
          <Container>
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-(--gutter)">
              <Reveal className="lg:col-span-6">
                <Title id="service-methode" as="h2">
                  {content.method.title}
                </Title>
                {content.method.paragraphs.map((paragraph) => (
                  <Body key={paragraph} className="mx-auto mt-5 max-w-reading">
                    {paragraph}
                  </Body>
                ))}

                <ul className="mt-8">
                  {content.method.points.map((point) => (
                    <li
                      key={point}
                      className="border-t border-(--surface-rule) py-5"
                    >
                      {/* Tiret au-dessus, centré — en rangée il restait collé
                          au bord gauche pendant que le texte se centrait. */}
                      <span
                        aria-hidden="true"
                        className="mx-auto mb-3 block h-px w-4 bg-safety"
                      />
                      <Body as="span" className="block">
                        {point}
                      </Body>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 rounded-soft border border-(--surface-rule) p-6">
                  <Subtitle as="h3" className="text-subtitle">
                    {content.note.title}
                  </Subtitle>
                  <Body className="mt-3 text-(--surface-fg-muted)">
                    {content.note.body}
                  </Body>
                </div>
              </Reveal>

              <Reveal className="lg:col-span-6 lg:sticky lg:top-32">
                <div className="relative aspect-[4/5] overflow-hidden rounded-card">
                  <Image
                    src={content.method.image}
                    alt={content.method.alt}
                    fill
                    sizes="(min-width: 64rem) 46vw, 100vw"
                    className={cn("object-cover", content.method.position)}
                  />
                </div>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* --------------------------------------------- 5. Conversion ---
            Section CLAIRE contenant un panneau sombre.

            Une section entièrement en forêt tomberait directement sur le pied
            de page, lui aussi en forêt : les deux se confondaient en un seul
            bloc sombre de plus de 1 700 px, soit deux écrans mobiles d'affilée.
            Le panneau concentre le poids visuel du CTA, et la gouttière claire
            qui l'entoure rend au pied de page son statut de bande de clôture.
            --------------------------------------------------------------- */}
        <Section surface="light" aria-labelledby="service-cta">
          <Container>
            <Reveal>
              <div
                data-surface="dark"
                className={cn(
                  "rounded-card bg-(--surface-bg) text-(--surface-fg)",
                  "p-7 sm:p-10 lg:p-14",
                )}
              >
                {/* Repères en version courte, sur une ligne qui se replie. */}
                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                  {proofs.map((proof) => (
                    <li
                      key={proof}
                      className={cn(
                        "font-sans text-caption text-(--surface-fg-muted)",
                        "flex items-center gap-6",
                        "after:block after:h-3 after:w-px after:bg-(--surface-rule)",
                        "last:after:hidden",
                      )}
                    >
                      {proof}
                    </li>
                  ))}
                </ul>

                <Rule className="mt-7" />

                <Title
                  id="service-cta"
                  as="h2"
                  className="mx-auto mt-9 max-w-[16ch]"
                >
                  Parlons de votre chantier
                </Title>
                <Body className="mx-auto mt-5 max-w-reading text-(--surface-fg-muted)">
                  Décrivez la situation en quelques lignes, ajoutez des photos
                  si vous en avez : c’est souvent suffisant pour établir un
                  devis sans visite préalable.
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

            {/* -------------------------------------- Maillage interne ---
                Sur fond clair, entre le panneau sombre et le pied de page :
                c'est cette bande claire qui sépare les deux. */}
            <Reveal className="mt-16 lg:mt-20">
              <Eyebrow as="h2">Autres interventions</Eyebrow>
              <ul className="mt-5">
                {content.related.map((relatedId) => {
                  const related = getRoute(relatedId);

                  return (
                    <li key={relatedId}>
                      <Link
                        href={related.path}
                        className={cn(
                          "group flex flex-col items-center gap-2",
                          "border-t border-(--surface-rule) py-5 no-underline",
                        )}
                      >
                        <span className="font-display text-subtitle text-(--surface-heading)">
                          {related.navLabel}
                        </span>
                        <span className="flex items-center justify-center gap-3">
                          {related.navTagline ? (
                            <span className="hidden font-sans text-caption text-(--surface-fg-muted) sm:inline">
                              {related.navTagline}
                            </span>
                          ) : null}
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            className={cn(
                              // Suit la surface : le jaune sécurité ne
                              // contraste qu'à 1,96 sur ivoire.
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
