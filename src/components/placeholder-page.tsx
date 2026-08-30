import { JsonLd } from "@/components/seo/json-ld";
import {
  ArrowLink,
  Body,
  Container,
  Display,
  Eyebrow,
  Lead,
  Rule,
  Section,
  Small,
  Subtitle,
} from "@/components/ui";
import { getRoute, type RouteId } from "@/lib/routes";
import { breadcrumbSchema } from "@/lib/structured-data";

type PlaceholderPageProps = {
  id: RouteId;
  /** Rubrique affichee en surtitre. */
  eyebrow: string;
  /** Titre `h1`. Ne reprend pas mot pour mot le `title` de la metadonnee. */
  heading: string;
  /** Une a deux phrases : l'intention reelle de la page, pas du remplissage. */
  lead: string;
  /** Ce que la page contiendra une fois developpee. */
  upcoming: readonly string[];
  /** Phase de ROADMAP.md qui livrera cette page. */
  phase: string;
  /** Maillage interne : routes utiles depuis cette page. */
  related?: readonly RouteId[];
};

/**
 * Gabarit TEMPORAIRE des pages de la phase 3.
 *
 * Il pose la structure semantique definitive (un seul `h1`, `main`, hierarchie
 * de titres continue) sans prefigurer le design des pages. Chaque page qui
 * recoit son contenu reel dans une phase ulterieure cesse d'utiliser ce
 * gabarit ; le fichier disparait quand la derniere page est developpee.
 */
export function PlaceholderPage({
  id,
  eyebrow,
  heading,
  lead,
  upcoming,
  phase,
  related = [],
}: PlaceholderPageProps) {
  const relatedRoutes = related
    .filter((relatedId) => relatedId !== id)
    .map((relatedId) => getRoute(relatedId));

  return (
    <>
      <JsonLd data={breadcrumbSchema(id)} />

      <main>
        <Section
          surface="dark"
          spacing="loose"
          aria-labelledby="page-titre"
        >
          <Container>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Display id="page-titre" className="mt-5 max-w-[18ch]">
              {heading}
            </Display>
            <Lead className="mt-6 max-w-reading">{lead}</Lead>
          </Container>
        </Section>

        <Section surface="light" aria-labelledby="page-preparation">
          <Container>
            <Subtitle as="h2" id="page-preparation">
              Contenu en préparation
            </Subtitle>

            <Body className="mt-5 max-w-reading">
              Cette page est en place pour l’architecture du site. Son contenu
              définitif est prévu en {phase} et présentera :
            </Body>

            <ul className="mt-6 max-w-reading">
              {upcoming.map((item) => (
                <li key={item} className="border-t border-(--surface-rule) py-4">
                  <Body as="span">{item}</Body>
                </li>
              ))}
            </ul>

            {relatedRoutes.length > 0 ? (
              <>
                <Rule width="short" className="mt-12" />
                <Body className="mt-6 max-w-reading font-semibold">
                  Voir aussi
                </Body>
                <ul className="mt-4 flex flex-col gap-1">
                  {relatedRoutes.map((route) => (
                    <li key={route.id}>
                      <ArrowLink href={route.path}>{route.navLabel}</ArrowLink>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <Small className="mt-12 max-w-reading">
              Site en cours de construction. Les informations légales, les
              coordonnées et les photographies de chantiers seront publiées
              avant la mise en ligne.
            </Small>
          </Container>
        </Section>
      </main>
    </>
  );
}
