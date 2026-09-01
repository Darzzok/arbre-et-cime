import { ZoneMap } from "@/components/map/zone-map";
import {
  ArrowLink,
  Body,
  Capsule,
  Card,
  Container,
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
 * LE MOTEUR CARTOGRAPHIQUE N'EST PAS TOUCHÉ
 * -----------------------------------------
 * `ZoneMap`, la projection, les 23 communes, l'interaction, la séquence
 * d'animation et les liens vers les pages villes sont **inchangés**. La phase
 * 15B.3 ne refait que l'environnement visuel de la carte.
 *
 * POURQUOI LA SECTION RESTE SUR IVOIRE
 * ------------------------------------
 * La question a été posée : forêt ou clair. La carte tranche à elle seule.
 * Son échelle de valeurs est construite **du clair vers le sombre** — terre
 * ivoire, département, mer, cœur de zone (`DESIGN_SYSTEM.md` § 8 bis). Sur une
 * section forêt, la terre ivoire deviendrait la zone la plus lumineuse de
 * l'écran et inverserait la lecture : le fond passerait devant le sujet.
 *
 * La régler pour du sombre supposerait de retoucher la palette géographique
 * pour une raison purement chromatique — ce que le brief interdit
 * explicitement. La section reste donc claire, et le rythme est tenu
 * autrement : « Pourquoi » en forêt profond et « Réalisations » en sable la
 * précèdent, la section devis la suit avec sa carte sombre.
 *
 * COMPOSITION EN BANDEAU — CONSERVÉE DEPUIS LE CORRECTIF 10C
 * ---------------------------------------------------------
 * Le texte coiffe la carte et celle-ci prend **toute la largeur du
 * conteneur** — 1 320 px en 1440. Elle reste le sujet, pas une illustration.
 *
 * Les trois niveaux de zone sont aussi le **repli textuel** de la carte
 * (`CLAUDE.md` § 5 : aucune information réservée à un seul canal). Ils passent
 * de filets supérieurs à des cartes, mais restent une `<dl>` : c'est une liste
 * de définitions, pas une grille décorative.
 */

const zones = getRoute("zones-intervention");

export function Zone() {
  return (
    <Section surface="light" aria-labelledby="zone-titre">
      <Container>
        {/* ------------------------------------------------- En-tête --- */}
        <Reveal className="mx-auto max-w-reading">
          <Capsule variant="light">Zone d’intervention</Capsule>

          <Title
            id="zone-titre"
            as="h2"
            className="mt-5 lg:text-[2.5rem] lg:leading-[1.08]"
          >
            Jusqu’à {area.maxRadiusKm} km autour de {area.city}
          </Title>

          <Body className="mt-5 text-(--surface-fg-muted)">
            {site.shortName} travaille au cœur de la métropole rouennaise et se
            déplace plus largement selon la nature et les contraintes du
            chantier.
          </Body>
        </Reveal>

        {/* --------------------------------------------------- Niveaux --- */}
        <Reveal>
          <dl className="mx-auto mt-10 grid max-w-4xl gap-(--card-gap) sm:grid-cols-3 lg:mt-12">
            {ZONE_LEVELS.map((level) => (
              <Card
                key={level.id}
                as="div"
                tone="sand"
                padding="md"
                className="h-full"
              >
                <dt className="font-sans text-eyebrow font-semibold uppercase tracking-[0.12em] text-(--surface-fg-muted)">
                  {level.label}
                </dt>
                <dd className="mt-2.5 font-sans text-body leading-snug text-(--surface-fg) text-pretty">
                  {level.detail}
                </dd>
              </Card>
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
          <ArrowLink href={zones.path}>Explorer toutes les zones</ArrowLink>
        </Reveal>
      </Container>
    </Section>
  );
}
