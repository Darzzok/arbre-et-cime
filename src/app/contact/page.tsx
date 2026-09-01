import type { Metadata } from "next";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { JsonLd } from "@/components/seo/json-ld";
import {
  ArrowLink,
  Body,
  ButtonLink,
  Capsule,
  CapsuleGroup,
  Card,
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
import { ESTIMATED_MINUTES, STEP_COUNT } from "@/lib/quote";
import { getRoute } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { area, contact, mailtoHref, site, telHref } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata("contact");

/**
 * Page `/contact` — construite en phase 15B.6. Composant SERVEUR.
 *
 * ELLE ÉTAIT ENCORE UN PLACEHOLDER
 * --------------------------------
 * Jusqu'ici, `/contact` rendait `PlaceholderPage` : un titre, une liste de ce
 * qui viendrait « en phase 4 », et **aucun moyen de joindre qui que ce soit**.
 * Mesuré : 0 lien `mailto:`, 0 lien `tel:`. C'était la seule page du site dont
 * la fonction n'était pas remplie.
 *
 * ELLE N'EST PAS UN DOUBLON DE `/devis`
 * -------------------------------------
 * Les deux pages répondent à deux besoins différents :
 *
 * | Page | Le visiteur veut… |
 * | --- | --- |
 * | `/contact` | poser une question, parler à quelqu'un |
 * | `/devis` | faire chiffrer un chantier qu'il a déjà en tête |
 *
 * D'où l'ordre des blocs : l'e-mail d'abord, le devis ensuite — proposé, pas
 * imposé. Une page de contact qui renvoie immédiatement vers un formulaire de
 * cinq étapes ne répond pas à la question posée.
 *
 * ELLE EST COURTE, ET C'EST LE POINT
 * ----------------------------------
 * Quatre blocs. On doit comprendre comment joindre {site.shortName} en quelques
 * secondes ; tout ce qui allonge la page travaille contre elle.
 *
 * LE TÉLÉPHONE N'EST PAS INVENTÉ
 * ------------------------------
 * La carte téléphone n'existe que si `contact.phoneConfirmed` est vrai. Pas de
 * carte vide, pas de numéro fictif, pas de bouton désactivé, pas de « bientôt
 * disponible » — et la grille se rééquilibre d'elle-même.
 */

const devis = getRoute("devis");
const zones = getRoute("zones-intervention");

/** Les trois échelles, en version courte. Formulations reprises telles quelles. */
const ZONES = [
  `${area.city} & ${area.metro}`,
  area.department,
  `Déplacements jusqu’à ${area.maxRadiusKm} km selon chantier`,
];

export default function ContactPage() {
  const mailto = mailtoHref();
  const tel = telHref();

  /* Le nombre de cartes décide de la grille : avec la seule carte e-mail, deux
     colonnes laisseraient une moitié vide. */
  const cartes = (mailto ? 1 : 0) + (tel ? 1 : 0);

  return (
    <>
      <JsonLd data={breadcrumbSchema("contact")} />

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {/* ---------------------------------------------------- 1. Hero --- */}
        <Section surface="deep-forest" aria-labelledby="contact-titre">
          <SectionPattern pattern="rings" opacity={0.05} />

          <Container className="relative">
            <Reveal className="mx-auto max-w-reading">
              <Capsule variant="dark">Contact</Capsule>

              <Display
                id="contact-titre"
                as="h1"
                className="mt-5 lg:text-[3.25rem] lg:leading-[1.06]"
              >
                Parlons de votre chantier
              </Display>

              {/*
                L'intention SEO de la route est « contacter un élagueur à Rouen »
                (`SEO_STRATEGY.md`). Le `h1` demandé au brief ne la porte pas :
                le chapô la reprend donc mot pour mot, et les métadonnées de
                `routes.ts` restent inchangées.
              */}
              <Lead className="mt-5 text-(--surface-fg-muted)">
                Une question avant de demander un devis ? Écrivez directement à{" "}
                {site.shortName}, élagueur-grimpeur à {area.city} et dans la{" "}
                {area.metro}.
              </Lead>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------------ 2. Cartes contact --- */}
        <Section surface="light" aria-labelledby="contact-canaux">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow>Nous joindre</Eyebrow>
              <Title
                id="contact-canaux"
                as="h2"
                className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
              >
                {cartes > 1 ? "Deux façons de nous joindre" : "Par e-mail"}
              </Title>
            </Reveal>

            <div
              className={cn(
                "mx-auto mt-10 grid gap-(--card-gap) lg:mt-12",
                cartes > 1 ? "max-w-4xl sm:grid-cols-2" : "max-w-xl",
              )}
            >
              {/* -------- E-mail -------- */}
              {mailto ? (
                <Reveal className="h-full">
                  <Card as="div" tone="sand" padding="lg" className="h-full">
                    <Capsule variant="light">E-mail</Capsule>

                    <h3 className="mt-4 font-display text-subtitle leading-tight text-(--surface-heading)">
                      Écrire à {site.shortName}
                    </h3>

                    <Body className="mx-auto mt-3 max-w-[38ch] text-(--surface-fg-muted)">
                      Pour une question, une précision ou un premier échange.
                    </Body>

                    {/* L'adresse est écrite en clair : elle se copie, se
                        vérifie, et fonctionne même sans client de messagerie
                        configuré. */}
                    <p className="mt-5 font-sans text-body break-words text-(--surface-heading)">
                      {contact.email}
                    </p>

                    <div className="mt-6 w-full sm:mx-auto sm:w-fit">
                      <ButtonLink
                        href={mailto}
                        variant="secondary"
                        size="lg"
                        block
                        data-cta="email"
                        data-cta-source="contact"
                      >
                        Envoyer un e-mail
                      </ButtonLink>
                    </div>
                  </Card>
                </Reveal>
              ) : null}

              {/* -------- Téléphone --------
                  Rendu UNIQUEMENT si le numéro est confirmé. Sans lui, rien :
                  pas de carte vide, pas de bouton désactivé, pas de mention
                  « bientôt disponible ». */}
              {tel ? (
                <Reveal className="h-full">
                  <Card as="div" tone="sand" padding="lg" className="h-full">
                    <Capsule variant="light">Téléphone</Capsule>

                    <h3 className="mt-4 font-display text-subtitle leading-tight text-(--surface-heading)">
                      Appeler {site.shortName}
                    </h3>

                    <Body className="mx-auto mt-3 max-w-[38ch] text-(--surface-fg-muted)">
                      Pour une urgence ou un échange direct.
                    </Body>

                    <p className="mt-5 font-sans text-body text-(--surface-heading)">
                      {contact.phoneDisplay}
                    </p>

                    <div className="mt-6 w-full sm:mx-auto sm:w-fit">
                      <ButtonLink
                        href={tel}
                        variant="secondary"
                        size="lg"
                        block
                        data-cta="appel"
                        data-cta-source="contact"
                      >
                        Appeler
                      </ButtonLink>
                    </div>
                  </Card>
                </Reveal>
              ) : null}
            </div>
          </Container>
        </Section>

        {/* ------------------------------------------- 3. Entrée devis ---
            Proposée après l'e-mail, jamais avant : une page de contact qui
            renvoie d'abord vers un parcours de cinq étapes ne répond pas à la
            question que le visiteur est venu poser. */}
        <Section surface="sand" aria-labelledby="contact-devis">
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
                  <CapsuleGroup>
                    <Capsule variant="accent">Devis gratuit</Capsule>
                    <Capsule variant="dark">
                      Environ {ESTIMATED_MINUTES} minutes
                    </Capsule>
                    <Capsule variant="dark">Photos facultatives</Capsule>
                  </CapsuleGroup>

                  <Title
                    id="contact-devis"
                    as="h2"
                    className="mx-auto mt-6 max-w-[22ch] lg:text-[2.75rem] lg:leading-[1.06]"
                  >
                    Vous avez déjà les informations du chantier ?
                  </Title>

                  <Body className="mx-auto mt-5 max-w-[52ch] text-(--surface-fg-muted)">
                    Le devis guidé permet de préciser votre besoin, le chantier,
                    le lieu, et d’ajouter quelques photos. {STEP_COUNT} étapes,
                    sans engagement.
                  </Body>

                  <div className="mt-9 w-full sm:mx-auto sm:w-fit">
                    <ButtonLink
                      href={devis.path}
                      variant="primary"
                      size="lg"
                      block
                      data-cta="devis"
                      data-cta-source="contact"
                    >
                      Commencer mon devis
                    </ButtonLink>
                  </div>
                </div>
              </Card>
            </Reveal>
          </Container>
        </Section>

        {/* --------------------------------------------------- 4. Zone ---
            Bloc compact, sans la carte. Elle appartient à
            `/zones-intervention` : la charger ici coûterait le composant client
            et n'ajouterait rien à une page qui doit se lire en quelques
            secondes. */}
        <Section
          surface="light"
          spacing="compact"
          aria-labelledby="contact-zone"
        >
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <Card as="div" tone="sand" padding="lg">
                <Eyebrow>Zone d’intervention</Eyebrow>

                <h2
                  id="contact-zone"
                  className="mt-4 font-display text-subtitle leading-tight text-(--surface-heading)"
                >
                  Où {site.shortName} intervient
                </h2>

                <ul className="mt-5 flex flex-wrap justify-center gap-2">
                  {ZONES.map((zone) => (
                    <li key={zone}>
                      <Capsule variant="light" dot>
                        {zone}
                      </Capsule>
                    </li>
                  ))}
                </ul>

                <Small className="mx-auto mt-5 block max-w-[52ch] text-(--surface-fg-muted)">
                  Le rayon est une possibilité, pas une couverture automatique :
                  la zone exacte se confirme avec votre demande.
                </Small>

                <div className="mt-6">
                  <ArrowLink href={zones.path}>Voir les zones</ArrowLink>
                </div>
              </Card>
            </Reveal>
          </Container>
        </Section>
      </main>
    </>
  );
}
