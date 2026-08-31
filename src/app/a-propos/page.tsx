import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { JsonLd } from "@/components/seo/json-ld";
import {
  ArrowLink,
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
import { getRoute, serviceRoutes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { area, qualifications, site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata("a-propos");

/**
 * Page « À propos ». Composant SERVEUR, aucun JavaScript.
 *
 * Six blocs, pas plus : hero compact, parcours, qualifications, manière de
 * travailler, zone, conversion. L'intention SEO est la **marque et la
 * vérification de confiance** (`SEO_STRATEGY.md` § 3) — pas « élagueur Rouen »,
 * qui appartient à la page d'accueil. Cette page ne doit donc pas concurrencer
 * la homepage sur son propre mot-clé.
 *
 * Contenu rédigé directement ici, et non dans un fichier de `src/lib` comme les
 * pages services : ce fichier-là existe parce que quatre pages sœurs doivent
 * être relues ensemble pour vérifier qu'aucune n'est la copie d'une autre. Une
 * page unique n'a pas ce problème.
 *
 * **Rien n'est affirmé au-delà de ce que le client a confirmé.** Ni assurance,
 * ni SIREN, ni label, ni disponibilité permanente, ni nombre de chantiers, ni
 * avis. Les seuls chiffres affichés viennent de `src/lib/site.ts`.
 */

const devis = getRoute("devis");
const zones = getRoute("zones-intervention");

/**
 * Trois repères chiffrés, discrets — pas une frise chronologique.
 *
 * Ils se lisent comme une progression et non comme trois faits séparés :
 * une dizaine d'années de métier, dont environ trois à son compte, depuis la
 * création de l'entreprise en 2023.
 */
const milestones = [
  {
    value: `≈ ${site.experienceYears} ans`,
    label: "de pratique du métier",
  },
  {
    value: `≈ ${site.selfEmployedYears} ans`,
    label: "à son compte",
  },
  {
    value: String(site.foundedYear),
    label: "création de l’entreprise",
  },
];

/**
 * Ce que chaque formation apporte. Les intitulés, eux, sont des faits et
 * viennent de `site.ts`.
 *
 * Indexé par intitulé plutôt que par position : ajouter une qualification dans
 * `site.ts` sans écrire son explication ici devient une **erreur de
 * compilation**, au lieu d'afficher silencieusement un titre sans texte.
 */
const qualificationDetails: Record<(typeof qualifications)[number], string> = {
  "CS Taille et soins des arbres":
    "Certificat de spécialisation consacré à l’arbre lui-même : sa physiologie, les techniques de taille et de grimpe, et ce qu’une coupe produit réellement sur ce qui repousse ensuite.",
  "BP Paysagiste / gestion des milieux naturels":
    "Brevet professionnel plus large : l’aménagement et l’entretien des espaces végétalisés, la lecture d’un terrain, et la gestion d’un milieu au-delà du seul arbre.",
};

export default function AProposPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("a-propos")} />
      {/* Aucun schéma `Person` : avec un nom et un métier, sans `LocalBusiness`
          publiable pour le rattacher (gelé, cf. SEO_STRATEGY.md § 7), il ne
          décrirait rien d'exploitable. On ne balise que des faits utiles. */}

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {/* ------------------------------------------ 1. Hero compact ---
            Photographie en fond de section, texte posé dessus — même principe
            que les pages services.

            La hauteur est le paramètre critique, pas la photographie. Un hero
            trop court est entièrement rempli par son texte : le surtitre
            remonte alors tout en haut du cadre, là où le dégradé est nul par
            construction. Mesuré à 22rem, il tombait à 1,92 de contraste.
            À 26rem le bloc de texte redescend dans la partie dense du dégradé.
            Cela reste nettement plus court que le hero de la page d'accueil
            (100svh) et que celui des pages services (30/34/38rem).
            ---------------------------------------------------------------- */}
        <section
          aria-labelledby="apropos-titre"
          data-surface="dark"
          className={cn(
            "relative isolate flex items-end overflow-hidden",
            "min-h-[26rem] sm:min-h-[29rem] lg:min-h-[32rem]",
          )}
        >
          <Image
            src="/images/hero/elagueur-ascension-arbre-hiver.jpg"
            alt="Élagueur-grimpeur encordé dans la charpente d’un grand arbre dépourvu de feuilles, en hiver"
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-[center_35%]"
          />
          <HeroScrim variant="compact" />

          <Container className="relative py-12 lg:py-14">
            <div className="mx-auto max-w-reading">
              {/* Rendu à la main plutôt qu'avec `Eyebrow` : `cn()` ne fusionne
                  pas deux classes de couleur concurrentes (DESIGN_SYSTEM.md
                  § 8), et il faut ici de l'ivoire, pas de la pierre. */}
              <p className="font-sans text-eyebrow font-semibold uppercase text-(--surface-fg)">
                L’entreprise
              </p>
              {/* `Display` bridé sous sa taille fluide maximale (76 px) : sur
                  une page dont la consigne est « pas de titres gigantesques »,
                  76 px écraserait tout le reste. */}
              <Display
                id="apropos-titre"
                as="h1"
                className="mt-4 lg:text-[3.25rem] lg:leading-[1.06]"
              >
                À propos d’{site.shortName}
              </Display>
              <Lead className="mt-5">
                Une activité d’élagage, d’abattage et d’entretien des arbres
                installée à {area.city} et dans la {area.metro}. Derrière
                l’entreprise, un {site.trade.toLowerCase()} : {site.manager}.
              </Lead>
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------- 2. Parcours --- */}
        {/* Photographie à gauche, texte à droite : l'inverse de la section
            « Pourquoi » de la page d'accueil, pour que les deux compositions ne
            se superposent pas dans la mémoire du visiteur. */}
        <Section surface="light" aria-labelledby="apropos-parcours">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-16">
              <Reveal className="lg:col-span-5">
                <div className="relative aspect-[4/5] overflow-hidden rounded-card">
                  <Image
                    src="/images/details/materiel-harnais-corde-grimpe.jpg"
                    alt="Élagueur lovant une corde de grimpe rouge, harnais et mousquetons à la ceinture"
                    fill
                    sizes="(min-width: 64rem) 34rem, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>

              <Reveal className="lg:col-span-6 lg:col-start-7">
                <Eyebrow>Le parcours</Eyebrow>
                <Title id="apropos-parcours" as="h2" className="mt-5">
                  Un métier appris sur le terrain
                </Title>

                <Body className="mt-6 text-(--surface-fg-muted)">
                  {site.manager} exerce le métier d’{site.trade.toLowerCase()}{" "}
                  depuis une dizaine d’années. L’essentiel s’apprend là où il
                  s’apprend vraiment : en hauteur, sur des chantiers dont aucun
                  ne ressemble tout à fait au précédent.
                </Body>
                <Body className="mt-4 text-(--surface-fg-muted)">
                  {site.name} est né de cela, en {site.foundedYear} — environ
                  trois ans à son compte aujourd’hui, sur une dizaine d’années
                  de pratique. L’entreprise est volontairement restée à taille
                  humaine : c’est la même personne qui prend l’appel, regarde
                  l’arbre et grimpe dedans.
                </Body>

                {/* Trois repères, pas une frise : filet au-dessus, chiffre en
                    Fraunces, libellé discret. Ils s'empilent sous 640 px. */}
                <ul className="mt-9 grid gap-5 sm:grid-cols-3 sm:gap-6">
                  {milestones.map((milestone) => (
                    <li
                      key={milestone.label}
                      className="border-t border-(--surface-rule) pt-4"
                    >
                      <p className="font-display text-subtitle text-(--surface-heading)">
                        {milestone.value}
                      </p>
                      <p className="mt-1 font-sans text-caption text-(--surface-fg-muted) text-pretty">
                        {milestone.label}
                      </p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ---------------------------------------- 3. Qualifications --- */}
        {/* Colonne de lecture unique, sans photographie ni panneau : c'est le
            bloc le plus factuel de la page, il n'a pas besoin d'être vendu. */}
        <Section
          surface="light"
          spacing="tight"
          aria-labelledby="apropos-qualifications"
        >
          <Container width="prose">
            <Reveal>
              <Eyebrow>Qualifications</Eyebrow>
              <Title id="apropos-qualifications" as="h2" className="mt-5">
                Deux formations, deux échelles
              </Title>
              <Body className="mt-5 text-(--surface-fg-muted)">
                L’une est centrée sur l’arbre, l’autre sur le milieu dans lequel
                il pousse.
              </Body>
            </Reveal>

            <ul className="mt-9">
              {qualifications.map((qualification) => (
                <Reveal
                  as="li"
                  key={qualification}
                  className="border-t border-(--surface-rule) py-7 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-4 block h-px w-5 bg-safety"
                  />
                  <Subtitle as="h3">{qualification}</Subtitle>
                  <Body className="mt-3 text-(--surface-fg-muted)">
                    {qualificationDetails[qualification]}
                  </Body>
                </Reveal>
              ))}
            </ul>

            <Reveal>
              <Rule className="mt-10" />
              <Body className="mt-8">
                Ce que cela change tient en une question. Devant un arbre, elle
                n’est pas seulement « comment le couper », mais « qu’est-ce
                qu’il faut lui faire, et qu’est-ce que cela donnera dans deux
                ans ».
              </Body>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------ 4. Manière de travailler --- */}
        {/* Narratif, pas six blocs : la méthode se raconte dans l'ordre où elle
            se déroule. La photographie ferme la section en montrant l'étape que
            le texte nomme en dernier — le broyage et l'évacuation. */}
        <Section surface="light" aria-labelledby="apropos-methode">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>La manière de travailler</Eyebrow>
              <Title id="apropos-methode" as="h2" className="mt-5">
                Comment se déroule une intervention
              </Title>

              <Body className="mt-6">
                Tout commence par une question simple : qu’attendez-vous de cet
                arbre ? Le conserver en le soulageant, le supprimer, dégager une
                vue, sécuriser une limite de propriété — la réponse ne conduit
                pas au même chantier.
              </Body>
              <Body className="mt-4 text-(--surface-fg-muted)">
                Vient ensuite ce que le terrain impose. L’accès, la place
                disponible, ce qu’il y a autour — une toiture, une clôture, un
                massif — et l’état du sujet lui-même. Ce sont ces contraintes
                qui décident de la méthode : grimpe et démontage par sections
                quand rien ne peut tomber d’un bloc, coupe plus directe quand la
                place le permet.
              </Body>
              <Body className="mt-4 text-(--surface-fg-muted)">
                Le reste tient à la préparation. Zone sécurisée avant la
                première coupe, matériel professionnel adapté à l’arbre comme à
                l’accès, et une fin de chantier qui ne laisse pas le travail à
                moitié fait : selon la prestation, les branches, le bois et les
                déchets verts sont débités, broyés ou évacués.
              </Body>
              <Body className="mt-4 text-(--surface-fg-muted)">
                Les demandes viennent aussi bien de particuliers que de
                professionnels et de collectivités. Le cadre change, la manière
                de procéder non.
              </Body>
            </Reveal>

            <Reveal className="mt-12 lg:mt-16">
              <figure className="relative aspect-[3/2] overflow-hidden rounded-card lg:aspect-[16/7]">
                {/* Remplacée au correctif 9B. Le broyeur figurait ici, sur la
                    page d'accueil ET sur `/realisations` : trois emplacements
                    pour une seule photographie. Il ne sert plus que dans la
                    collection de `/realisations`. Celle-ci illustre le même
                    paragraphe — « les branches, le bois et les déchets verts
                    sont débités » — et n'apparaît nulle part ailleurs. */}
                <Image
                  src="/images/realisations/chantier-debitage-epi-protection.jpg"
                  alt="Débitage d’un tronc à la tronçonneuse, pantalon de protection et chaussures de sécurité, billons de bouleau au sol"
                  fill
                  sizes="(min-width: 64rem) 78rem, 100vw"
                  className="object-cover object-[center_55%]"
                />
              </figure>
            </Reveal>
          </Container>
        </Section>

        {/* -------------------------------------------------- 5. Zone --- */}
        {/* Volontairement courte : la carte et le détail des communes
            appartiennent à /zones-intervention (phase 10). */}
        <Section surface="light" spacing="tight" aria-labelledby="apropos-zone">
          <Container width="prose">
            <Reveal>
              <Eyebrow>Zone d’intervention</Eyebrow>
              <Title id="apropos-zone" as="h2" className="mt-5">
                Où intervient {site.shortName}
              </Title>
              <Body className="mt-5 text-(--surface-fg-muted)">
                Le cœur de l’activité, c’est {area.city} et la {area.metro}.
                Au-delà, des déplacements restent possibles jusqu’à{" "}
                {area.maxRadiusKm} km, selon la nature du chantier et le
                calendrier.
              </Body>
              <div className="mt-6">
                <ArrowLink href={zones.path}>
                  Voir la zone d’intervention
                </ArrowLink>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* -------------------------------------------- 6. Conversion ---
            Section CLAIRE contenant un panneau sombre, comme les pages
            services : une section entièrement en forêt tomberait sur un pied de
            page lui aussi en forêt (DESIGN_SYSTEM.md § 8). C'est le seul aplat
            sombre de la page avec le hero.
            ---------------------------------------------------------------- */}
        <Section surface="light" aria-labelledby="apropos-cta">
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
                  id="apropos-cta"
                  as="h2"
                  className="mx-auto max-w-[16ch]"
                >
                  Parlons de votre chantier
                </Title>
                <Body className="mx-auto mt-5 max-w-reading text-(--surface-fg-muted)">
                  Quelques lignes sur la situation et l’accès, une photo si vous
                  en avez : c’est souvent tout ce qu’il faut pour vous répondre.
                  Le devis est gratuit.
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

            {/* Maillage secondaire vers les prestations, sur fond clair : c'est
                cette bande qui sépare le panneau du pied de page. */}
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
                            // Suit la surface : le jaune sécurité ne contraste
                            // qu'à 1,96 sur ivoire.
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
