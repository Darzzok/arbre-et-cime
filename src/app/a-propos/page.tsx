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
  Title,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { getRoute, serviceRoutes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { area, contact, qualifications, site, telHref } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata("a-propos");

/**
 * Page « À propos » — refaite en phase 15B.4. Composant SERVEUR.
 *
 * CE QUI ÉTAIT À REFAIRE
 * ----------------------
 * Mesuré avant modification : **six sections, dont cinq ivoire à la suite**,
 * 5 530 px en 1440 et 5 417 px en 390. La section « manière de travailler »
 * atteignait 1 496 px de texte narratif d'un seul tenant, avec des paragraphes
 * allant jusqu'à 326 signes. C'était la page la plus littéraire du site.
 *
 * La narration est conservée — c'est elle qui porte la confiance — mais elle
 * est **redistribuée** : chaque étape du récit devient une carte, dans l'ordre
 * où elle se déroulait déjà. Rien n'est supprimé, tout est rendu scannable.
 *
 * L'intention SEO reste la **marque et la vérification de confiance**
 * (`SEO_STRATEGY.md` § 3), pas « élagueur Rouen » qui appartient à la page
 * d'accueil.
 *
 * **Rien n'est affirmé au-delà de ce que le client a confirmé.** Ni assurance,
 * ni SIREN, ni label, ni disponibilité permanente, ni nombre de chantiers, ni
 * avis. Les seuls chiffres affichés viennent de `src/lib/site.ts`.
 */

const zones = getRoute("zones-intervention");

/**
 * Trois repères chiffrés, tous dans `site.ts`.
 *
 * Ils se lisent comme une progression : une dizaine d'années de métier, dont
 * environ trois à son compte, depuis la création de l'entreprise en 2023.
 * **Aucune date supplémentaire n'est inventée.**
 */
const milestones = [
  { value: `≈ ${site.experienceYears} ans`, label: "de pratique du métier" },
  { value: `≈ ${site.selfEmployedYears} ans`, label: "à son compte" },
  { value: String(site.foundedYear), label: "création de l’entreprise" },
];

/**
 * Ce que chaque formation apporte. Les intitulés, eux, sont des faits et
 * viennent de `site.ts`.
 *
 * Indexé par intitulé plutôt que par position : ajouter une qualification dans
 * `site.ts` sans écrire son explication ici devient une **erreur de
 * compilation**, au lieu d'afficher silencieusement un titre sans texte.
 *
 * Le sigle est repris tel quel de l'intitulé officiel. **Aucune équivalence,
 * aucun niveau, aucun organisme n'est ajouté** : ce sont les seules mentions
 * que le client a confirmées.
 */
const qualificationDetails: Record<
  (typeof qualifications)[number],
  { sigle: string; body: string }
> = {
  "CS Taille et soins des arbres": {
    sigle: "CS",
    body: "Certificat de spécialisation consacré à l’arbre lui-même : sa physiologie, les techniques de taille et de grimpe, et ce qu’une coupe produit réellement sur ce qui repousse ensuite.",
  },
  "BP Paysagiste / gestion des milieux naturels": {
    sigle: "BP",
    body: "Brevet professionnel plus large : l’aménagement et l’entretien des espaces végétalisés, la lecture d’un terrain, et la gestion d’un milieu au-delà du seul arbre.",
  },
};

/**
 * Les quatre temps d'une intervention.
 *
 * Ce sont **exactement** les quatre moments que la version précédente racontait
 * en quatre paragraphes de 200 à 326 signes. Le texte de chaque carte reprend
 * les formulations d'origine, y compris les réserves : « selon la prestation »
 * n'est pas une précaution de style, c'est une limite que le client a posée.
 */
const STEPS = [
  {
    numero: "01",
    titre: "Comprendre",
    detail:
      "Conserver l’arbre, le supprimer, dégager une vue : la réponse ne conduit pas au même chantier.",
  },
  {
    numero: "02",
    titre: "Sécuriser",
    detail:
      "Zone établie avant la première coupe, selon l’accès et ce qu’il y a autour.",
  },
  {
    numero: "03",
    titre: "Intervenir",
    detail:
      "Démontage par sections quand rien ne peut tomber d’un bloc, coupe directe quand la place le permet.",
  },
  {
    numero: "04",
    titre: "Nettoyer",
    detail:
      "Débitage, broyage ou évacuation des déchets verts, selon la prestation.",
  },
] as const;

/**
 * Trois publics — et RIEN de plus.
 *
 * Une première version leur donnait une ligne de détail chacun (« copropriétés »,
 * « gestionnaires de patrimoine », « alignements »). Ces précisions n étaient
 * confirmées nulle part : `PROJECT.md` liste trois intitulés de clientèle, pas
 * des segments de marché. Elles sont retirées.
 *
 * Bénéfice mesuré au passage : la section coûtait 1 165 px en 390 px de large
 * pour trois mots par carte, contre 422 px avant refonte. En capsules, 80.
 */
const CLIENTS = ["Particuliers", "Professionnels", "Collectivités"];

export default function AProposPage() {
  const tel = telHref();

  return (
    <>
      <JsonLd data={breadcrumbSchema("a-propos")} />
      {/* Aucun schéma `Person` : avec un nom et un métier, sans `LocalBusiness`
          publiable pour le rattacher (gelé, cf. SEO_STRATEGY.md § 7), il ne
          décrirait rien d'exploitable. On ne balise que des faits utiles. */}

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {/* ---------------------------------------------------- 1. Hero ---
            HERO SANS PHOTOGRAPHIE — demande client, après la phase 15B.4.

            Le hero photographique plein cadre imposait un dégradé fort et une
            hauteur minimale de 26 rem uniquement pour que son texte reste
            lisible ; la carte photo qui l avait remplacé a été retirée à son
            tour. Reste un bloc de texte sur forêt, avec son motif de cernes.

            La page n a plus d image prioritaire : sa première photographie est
            celle du parcours, paresseuse. */}
        <Section surface="dark" aria-labelledby="apropos-titre">
          <SectionPattern pattern="rings" opacity={0.045} />

          <Container className="relative">
            <Reveal className="mx-auto max-w-reading">
              <CapsuleGroup>
                <Capsule variant="dark" dot>
                  ≈ {site.experienceYears} ans de métier
                </Capsule>
                <Capsule variant="dark" dot>
                  Entreprise créée en {site.foundedYear}
                </Capsule>
                <Capsule variant="dark" dot>
                  Professionnel diplômé
                </Capsule>
              </CapsuleGroup>

              <Display
                id="apropos-titre"
                as="h1"
                className="mt-6 lg:text-[3.25rem] lg:leading-[1.06]"
              >
                À propos d’{site.shortName}
              </Display>

              {/*
                « INSTALLÉE À ROUEN » AFFIRMAIT UNE ADRESSE — corrigé phase 17.

                Le siège est au Grand-Quevilly (`legal.siege`), pas à Rouen.
                Le chapô dit maintenant ce qui est vrai et suffisant : une
                activité qui INTERVIENT sur ce secteur. Rouen reste nommée, et
                reste la cible SEO principale.
              */}
              <Lead className="mt-5 text-(--surface-fg-muted)">
                Une activité d’élagage, d’abattage et d’entretien des arbres,
                qui intervient à {area.city} et dans la {area.metro}.
              </Lead>

              {/* Le nom du dirigeant est le sujet de la page : il est mis en
                    évidence plutôt que noyé en fin de chapô. */}
              <p className="mt-7 font-display text-subtitle text-(--surface-heading)">
                {site.manager}
              </p>
              <p className="mt-1.5 font-sans text-caption uppercase tracking-[0.12em] text-(--surface-fg-muted)">
                {site.trade}
              </p>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------------------ 2. Parcours ---
            Une grande carte horizontale, et non une chronologie : les trois
            repères sont posés à l'intérieur, sous le texte qu'ils chiffrent. */}
        <Section surface="sand" aria-labelledby="apropos-parcours">
          <Container>
            <Reveal>
              <Card as="div" tone="plain" padding="none">
                <div className="grid lg:grid-cols-12">
                  <div className="relative aspect-[16/9] lg:col-span-5 lg:aspect-auto lg:min-h-80">
                    <Image
                      src="/images/details/materiel-harnais-corde-grimpe.jpg"
                      alt="Élagueur lovant une corde de grimpe rouge, harnais et mousquetons à la ceinture"
                      fill
                      loading="lazy"
                      sizes="(min-width: 64rem) 34rem, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-7 sm:p-10 lg:col-span-7 lg:p-14">
                    <Eyebrow>Le parcours</Eyebrow>
                    <Title
                      id="apropos-parcours"
                      as="h2"
                      className="mt-4 lg:text-[2.25rem] lg:leading-[1.1]"
                    >
                      Un métier appris sur le terrain
                    </Title>

                    <Body className="mt-5 text-(--surface-fg-muted)">
                      {site.manager} exerce le métier d’
                      {site.trade.toLowerCase()} depuis une dizaine d’années.
                      L’essentiel s’apprend là où il s’apprend vraiment : en
                      hauteur, sur des chantiers dont aucun ne ressemble tout à
                      fait au précédent.
                    </Body>
                    <Body className="mt-4 text-(--surface-fg-muted)">
                      {site.name} est né de cela, en {site.foundedYear}.
                      L’entreprise est volontairement restée à taille humaine :
                      c’est la même personne qui prend l’appel, regarde l’arbre
                      et grimpe dedans.
                    </Body>

                    <ul className="mt-9 grid grid-cols-3 gap-4 sm:gap-6">
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
                  </div>
                </div>
              </Card>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------------ 3. Qualifications ---
            Le bloc le plus factuel de la page, et le seul différenciateur réel
            face à la concurrence locale (`PROJECT.md`). Il passe sur forêt
            profond : c'est ce qui lui donne le poids que sa position en milieu
            de page ne lui donnait pas. */}
        <Section surface="deep-forest" aria-labelledby="apropos-qualifications">
          <SectionPattern pattern="rings" opacity={0.04} />

          <Container className="relative">
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>Qualifications</Eyebrow>
              <Title
                id="apropos-qualifications"
                as="h2"
                className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Deux formations, deux échelles
              </Title>
              <Body className="mt-4 text-(--surface-fg-muted)">
                L’une est centrée sur l’arbre, l’autre sur le milieu dans lequel
                il pousse.
              </Body>
            </Reveal>

            <ul className="mt-12 grid gap-(--card-gap) lg:mt-14 lg:grid-cols-2">
              {qualifications.map((qualification) => {
                const detail = qualificationDetails[qualification];

                return (
                  <Reveal as="li" key={qualification} className="h-full">
                    <Card
                      as="div"
                      tone="forest"
                      padding="md"
                      className="h-full"
                    >
                      <Capsule variant="dark">{detail.sigle}</Capsule>

                      <h3 className="mt-5 font-display text-subtitle leading-tight text-(--surface-heading)">
                        {qualification}
                      </h3>

                      <Body className="mx-auto mt-4 max-w-[46ch] text-(--surface-fg-muted)">
                        {detail.body}
                      </Body>
                    </Card>
                  </Reveal>
                );
              })}
            </ul>

            <Reveal className="mt-10 lg:mt-12">
              <Body className="mx-auto max-w-reading text-(--surface-fg-muted)">
                Ce que cela change tient en une question. Devant un arbre, elle
                n’est pas seulement « comment le couper », mais « qu’est-ce
                qu’il faut lui faire, et qu’est-ce que cela donnera dans deux
                ans ».
              </Body>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------ 4. Manière de travailler --- */}
        <Section surface="light" aria-labelledby="apropos-methode">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>La manière de travailler</Eyebrow>
              <Title
                id="apropos-methode"
                as="h2"
                className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Comment se déroule une intervention
              </Title>
              <Body className="mt-5 text-(--surface-fg-muted)">
                Tout commence par une question simple : qu’attendez-vous de cet
                arbre ? Le reste — la méthode, le matériel, la fin de chantier —
                en découle.
              </Body>
            </Reveal>

            <div className="mt-12 grid gap-(--card-gap) lg:mt-14 lg:grid-cols-12 lg:items-stretch">
              {/* UNE colonne à 390 px, et non deux. Mesuré : à 171 px de large, ces
                  quatre détails passaient de 225 à 410 px de haut chacun — la
                  mise en deux colonnes coûtait plus qu elle ne rapportait.
                  Les cartes des pages services, elles, tiennent en deux
                  colonnes parce que leur détail fait une ligne. */}
              <ol className="grid gap-(--card-gap) sm:grid-cols-2 lg:col-span-7">
                {STEPS.map((step) => (
                  <Reveal as="li" key={step.numero} className="h-full">
                    <Card as="div" tone="sand" padding="md" className="h-full">
                      <span
                        aria-hidden="true"
                        className="font-sans text-eyebrow font-semibold tabular-nums tracking-[0.24em] text-(--surface-fg-muted)"
                      >
                        {step.numero}
                      </span>
                      <h3 className="mt-3 font-display text-subtitle leading-tight text-(--surface-heading)">
                        {step.titre}
                      </h3>
                      <Body className="mx-auto mt-3 max-w-[38ch] text-(--surface-fg-muted)">
                        {step.detail}
                      </Body>
                    </Card>
                  </Reveal>
                ))}
              </ol>

              {/* La photographie ferme la section en montrant l'étape que le
                  texte nomme en dernier — le débitage et l'évacuation. */}
              <Reveal className="lg:col-span-5">
                <figure className="relative m-0 aspect-[16/9] overflow-hidden rounded-card lg:aspect-auto lg:h-full lg:min-h-72">
                  <Image
                    src="/images/realisations/chantier-debitage-epi-protection.jpg"
                    alt="Débitage d’un tronc à la tronçonneuse, pantalon de protection et chaussures de sécurité, billons de bouleau au sol"
                    fill
                    loading="lazy"
                    sizes="(min-width: 64rem) 40rem, 100vw"
                    className="object-cover object-[center_55%]"
                  />
                </figure>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* --------------------------------------------- 5. Clients / zone ---
            Volontairement compacte : la carte et le détail des communes
            appartiennent à /zones-intervention. */}
        <Section surface="sand" aria-labelledby="apropos-clients">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>Pour qui</Eyebrow>
              <Title
                id="apropos-clients"
                as="h2"
                className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Le cadre change, la manière de procéder non
              </Title>
              <Body className="mt-4 text-(--surface-fg-muted)">
                Les demandes viennent aussi bien de particuliers que de
                professionnels et de collectivités.
              </Body>
            </Reveal>

            <Reveal className="mt-8">
              <CapsuleGroup>
                {CLIENTS.map((client) => (
                  <Capsule key={client} variant="light" dot>
                    {client}
                  </Capsule>
                ))}
              </CapsuleGroup>
            </Reveal>

            <Reveal className="mt-10">
              <Card as="div" tone="plain" padding="lg">
                <h3 className="font-display text-subtitle leading-tight text-(--surface-heading)">
                  Où intervient {site.shortName}
                </h3>
                <Body className="mx-auto mt-3 max-w-[60ch] text-(--surface-fg-muted)">
                  Le cœur de l’activité, c’est {area.city} et la {area.metro}.
                  Au-delà, des déplacements restent possibles jusqu’à{" "}
                  {area.maxRadiusKm} km, selon la nature du chantier et le
                  calendrier.
                </Body>
                <div className="mt-5">
                  <ArrowLink href={zones.path}>
                    Voir la zone d’intervention
                  </ArrowLink>
                </div>
              </Card>
            </Reveal>
          </Container>
        </Section>

        {/* -------------------------------------------- 6. Conversion --- */}
        <Section surface="light" aria-labelledby="apropos-cta">
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
                    id="apropos-cta"
                    as="h2"
                    className="mx-auto mt-6 max-w-[18ch] lg:text-[3rem] lg:leading-[1.04]"
                  >
                    Parlons de votre chantier
                  </Title>

                  <Body className="mx-auto mt-5 max-w-[48ch] text-(--surface-fg-muted)">
                    Quelques lignes sur la situation et l’accès, une photo si
                    vous en avez : c’est souvent tout ce qu’il faut pour vous
                    répondre.
                  </Body>

                  <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                    <div className="w-full sm:w-fit">
                      <ButtonLink
                        href={contact.quotePath}
                        variant="primary"
                        size="lg"
                        block
                        data-cta="devis"
                        data-cta-source="a-propos-final"
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
                          data-cta-source="a-propos-final"
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
