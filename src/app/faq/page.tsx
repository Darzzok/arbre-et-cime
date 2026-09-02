import type { Metadata } from "next";

import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { JsonLd } from "@/components/seo/json-ld";
import {
  ArrowLink,
  Body,
  ButtonLink,
  Capsule,
  CapsuleGroup,
  Container,
  Display,
  Eyebrow,
  Lead,
  Reveal,
  Section,
  SectionPattern,
  Title,
} from "@/components/ui";
import { FAQ } from "@/content/faq";
import { getRoute } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { area, telHref } from "@/lib/site";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata("faq");

/**
 * Page `/faq` — ajoutée en phase 17B, sur relevé d'audit. Composant SERVEUR.
 *
 * CE QU'ELLE VIENT COMBLER
 * ------------------------
 * Le site répondait à « élagueur à Rouen » et à rien d'autre. Aucune page ne
 * visait « quand élaguer un arbre », « faut-il une autorisation pour abattre »
 * ou « que devient le bois » — les requêtes qui amènent le premier contact,
 * souvent des semaines avant la demande de devis.
 *
 * DEUX GAINS D'UN SEUL COUP
 * -------------------------
 * 1. La longue traîne, avec le balisage `FAQPage` — **le seul schéma riche du
 *    site qui ne dépende d'aucune donnée client en attente**. `LocalBusiness`
 *    et `Service` attendent le domaine, l'adresse et les horaires ; celui-ci
 *    ne décrit que du contenu déjà publié.
 * 2. Le volume éditorial qui manquait : cette page ajoute à elle seule plus de
 *    mots que n'en porte une page service.
 *
 * PAS D'ACCORDÉON
 * ---------------
 * Les réponses sont toutes visibles. Un accordéon économiserait de la hauteur
 * et coûterait trois choses : du JavaScript client sur une page qui n'en a pas
 * besoin, la recherche `Ctrl+F` dans le contenu replié, et le risque que
 * Google traite le texte masqué comme secondaire. La page est longue ; c'est
 * son objet.
 *
 * ANCRES STABLES
 * --------------
 * Chaque question porte un `id` qui vient du contenu, pas de son rang. Une
 * question insérée au milieu ne déplace donc aucun lien déjà partagé.
 */

const devis = getRoute("devis");
const zones = getRoute("zones-intervention");
const contact = getRoute("contact");

export default function FaqPage() {
  const tel = telHref();

  return (
    <>
      <JsonLd data={breadcrumbSchema("faq")} />
      <JsonLd data={faqSchema(FAQ)} />

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {/* ---------------------------------------------------- 1. Hero --- */}
        <Section surface="deep-forest" aria-labelledby="faq-titre">
          <SectionPattern pattern="rings" opacity={0.05} />

          <Container className="relative">
            <Reveal className="mx-auto max-w-reading">
              <Capsule variant="dark">Questions fréquentes</Capsule>

              <Display
                id="faq-titre"
                as="h1"
                className="mt-5 lg:text-[3.25rem] lg:leading-[1.06]"
              >
                Ce qu’on nous demande le plus
              </Display>

              <Lead className="mt-5 text-(--surface-fg-muted)">
                Les réponses d’un arboriste-grimpeur à {area.city} — sur la
                période de taille, l’autorisation d’abattage, le devenir du
                bois et ce qui fait varier un devis.
              </Lead>

              <CapsuleGroup className="mt-8">
                <Capsule variant="dark" dot>
                  {FAQ.length} questions
                </Capsule>
                <Capsule variant="dark" dot>
                  Aucun tarif inventé
                </Capsule>
              </CapsuleGroup>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------------------ 2. Sommaire --- */}
        <Section surface="sand" spacing="compact" aria-labelledby="faq-sommaire">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Eyebrow id="faq-sommaire">Aller directement à</Eyebrow>

              {/*
                Un sommaire d'ancres, pas une navigation : il fait gagner du
                temps sur une page longue, et il donne aux moteurs la liste des
                intentions couvertes dès le haut du document.
              */}
              <ul className="mx-auto mt-5 flex flex-wrap justify-center gap-2.5">
                {FAQ.map((entry) => (
                  <li key={entry.id}>
                    <a
                      href={`#${entry.id}`}
                      className="inline-flex min-h-11 items-center rounded-pill border border-(--surface-rule) px-4 font-sans text-caption text-(--surface-fg) no-underline motion-safe:transition-colors motion-safe:duration-(--duration-micro) hover:border-(--surface-fg-muted) hover:text-(--surface-heading) focus-visible:border-(--surface-fg-muted)"
                    >
                      {entry.question}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------------------ 3. Réponses --- */}
        <Section surface="light" plain>
          <Container>
            <div className="mx-auto flex max-w-reading flex-col gap-10">
              {FAQ.map((entry) => (
                <Reveal
                  as="section"
                  key={entry.id}
                  id={entry.id}
                  aria-labelledby={`${entry.id}-titre`}
                  /* `scroll-mt` : l'en-tête est collant, sans cette marge une
                     ancre place le titre dessous. */
                  className="scroll-mt-28 border-t border-(--surface-rule) pt-9 first:border-t-0 first:pt-0"
                >
                  <Title
                    as="h2"
                    id={`${entry.id}-titre`}
                    className="text-subtitle"
                  >
                    {entry.question}
                  </Title>

                  <div className="mt-5 flex flex-col gap-4">
                    {entry.reponse.map((paragraphe) => (
                      <Body
                        key={paragraphe.slice(0, 40)}
                        className="mx-auto text-(--surface-fg-muted)"
                      >
                        {paragraphe}
                      </Body>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>

        {/* ---------------------------------------------------- 4. Suite --- */}
        <Section surface="deep-forest" aria-labelledby="faq-suite">
          <SectionPattern pattern="contour" opacity={0.05} />

          <Container className="relative">
            <Reveal className="mx-auto max-w-reading">
              <Title
                id="faq-suite"
                as="h2"
                className="lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Votre question n’y est pas ?
              </Title>

              <Body className="mt-5 text-(--surface-fg-muted)">
                Décrivez votre situation : c’est souvent plus rapide que de
                chercher la bonne réponse, et le chiffrage se fait dans la
                foulée.
              </Body>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <div className="w-full sm:w-fit">
                  <ButtonLink
                    href={devis.path}
                    variant="primary"
                    size="lg"
                    block
                    data-cta="devis"
                    data-cta-source="faq"
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
                      data-cta-source="faq"
                    >
                      Appeler
                    </ButtonLink>
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex flex-col items-center gap-2">
                <ArrowLink href={zones.path}>{zones.navLabel}</ArrowLink>
                <ArrowLink href={contact.path}>{contact.navLabel}</ArrowLink>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>
    </>
  );
}
