import { ZoneMap } from "@/components/map/zone-map";
import {
  ArrowLink,
  Body,
  Container,
  Eyebrow,
  Reveal,
  Section,
  Title,
} from "@/components/ui";
import { ZONE_LEVELS } from "@/lib/map-content";
import { getRoute } from "@/lib/routes";
import { area, site } from "@/lib/site";

/**
 * Section 6 des 7 sections VERROUILLÉES — zone d'intervention.
 *
 * **Composition en bandeau, décidée au correctif 10C.** Les versions
 * précédentes plaçaient le texte à gauche et la carte à droite : la carte n'y
 * gagnait que sept douzièmes de la largeur, soit 640 px sur un écran de 1440.
 *
 * Ici le texte coiffe la carte et celle-ci prend **toute la largeur du
 * conteneur** — 1 144 px en 1440. Elle passe d'illustration à sujet, et le
 * bloc de tête garde la lecture centrée du reste du site.
 *
 * Les trois niveaux de zone sont rendus en **colonnes de texte**, ce qui est
 * aussi le repli textuel de la carte (`CLAUDE.md` § 5 : aucune information
 * réservée à un seul canal).
 */

const zones = getRoute("zones-intervention");

export function Zone() {
  return (
    <Section surface="light" aria-labelledby="zone-titre">
      <Container>
        {/* ------------------------------------------------- En-tête --- */}
        <Reveal className="mx-auto max-w-reading">
          <Eyebrow>Zone d’intervention</Eyebrow>
          <Title
            id="zone-titre"
            as="h2"
            className="mt-4 lg:text-[2.75rem] lg:leading-[1.06]"
          >
            Jusqu’à {area.maxRadiusKm} km autour de {area.city}
          </Title>
          <Body className="mt-5 text-(--surface-fg-muted)">
            {site.shortName} travaille au cœur de la métropole rouennaise et se
            déplace plus largement selon la nature et les contraintes du
            chantier.
          </Body>
        </Reveal>

        {/* --------------------------------------------------- Niveaux ---
            Trois colonnes à filet supérieur : compact, lisible, et sans le
            poids visuel d'un tableau. */}
        <Reveal>
          <dl className="mx-auto mt-10 grid max-w-4xl gap-x-8 gap-y-5 sm:grid-cols-3 lg:mt-12">
            {ZONE_LEVELS.map((level) => (
              <div
                key={level.id}
                className="border-t border-(--surface-rule) pt-4"
              >
                <dt className="font-sans text-eyebrow font-semibold uppercase text-(--surface-fg-muted)">
                  {level.label}
                </dt>
                <dd className="mt-1.5 font-sans text-body text-(--surface-fg) text-pretty">
                  {level.detail}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* ----------------------------------------------------- Carte --- */}
        <Reveal className="mt-12 lg:mt-14">
          <ZoneMap
            variant="home"
            title={`Carte de la zone d’intervention : la ${area.metro} au centre, la ${area.department} en zone principale, la Seine, ${area.city} et la portée de ${area.maxRadiusKm} km`}
          />
        </Reveal>

        <Reveal className="mt-9">
          <ArrowLink href={zones.path}>Voir la zone d’intervention</ArrowLink>
        </Reveal>
      </Container>
    </Section>
  );
}
