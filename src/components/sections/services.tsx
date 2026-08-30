import Image from "next/image";
import Link from "next/link";

import {
  Body,
  Container,
  Eyebrow,
  Reveal,
  Section,
  Title,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { serviceRoutes } from "@/lib/routes";

/**
 * Section 3 des 7 sections VERROUILLÉES — les prestations.
 *
 * Quatre pages services, pas huit : les prestations secondaires (abattage
 * difficile, débroussaillage, taille de haies, évacuation) sont traitées à
 * l'intérieur de leur page parente, conformément au rattachement défini dans
 * `SEO_STRATEGY.md` § 4.
 *
 * **Cartes photographiques** — direction arrêtée par le client en phase 6B, en
 * remplacement du traitement éditorial de la phase 6. Photo plein fond, dégradé
 * progressif, contenu ancré en bas. C'est le seul endroit du site où le motif
 * « carte » est autorisé, et le seul où le rayon dépasse 8 px.
 */

type ServiceCard = {
  image: string;
  alt: string;
  /** Cadrage : ces photos sont recadrées fort, le sujet doit rester dedans. */
  position: string;
  description: string;
};

const cards: Record<string, ServiceCard> = {
  elagage: {
    image: "/images/services/elagage-travail-sur-corde-securite.jpg",
    alt: "Élagueur-grimpeur suspendu à sa corde, taillant les branches d’un arbre au pied d’un bâtiment",
    position: "object-[center_38%]",
    description: "Préserver, équilibrer et sécuriser les arbres.",
  },
  abattage: {
    image: "/images/services/abattage-arbre-tombe-intervention-urgence.jpg",
    alt: "Grand arbre abattu, débité en sections sur un terrain arboré",
    position: "object-center",
    description:
      "Abattage et démontage lorsque l’arbre doit être retiré, y compris en situation complexe.",
  },
  dessouchage: {
    image: "/images/services/dessouchage-souche-fraiche-sciure.jpg",
    alt: "Souche fraîchement coupée, entourée de sciure",
    position: "object-center",
    description:
      "Retirer ou réduire une souche pour libérer et remettre en état la zone.",
  },
  "entretien-exterieur": {
    image: "/images/services/taille-de-haie-taille-haie-thermique.jpg",
    alt: "Taille d’une haie de conifères au taille-haie thermique",
    position: "object-[center_42%]",
    description:
      "Taille de haies, débroussaillage et entretien des espaces extérieurs.",
  },
};

/** Grille 2×2 au-delà de 1024 px : chaque carte occupe la moitié de la largeur. */
const CARD_SIZES = "(min-width: 64rem) 46vw, 100vw";

export function Services() {
  return (
    <Section surface="light" aria-labelledby="prestations-titre">
      <Container>
        <Reveal className="max-w-reading">
          <Eyebrow>Prestations</Eyebrow>
          {/* Titre volontairement contenu : 30 px sur mobile, 36 px sur
              desktop, au lieu des 46 px de l'échelle `text-title`. Ce sont les
              cartes qui portent la section, pas le titre. */}
          <Title
            id="prestations-titre"
            className="mt-4 lg:text-[2.25rem] lg:leading-[1.1]"
          >
            Nos interventions
          </Title>
          <Body className="mt-4 text-(--surface-fg-muted)">
            Quatre interventions, quatre pages : la méthode, les cas traités et
            ce qui fait varier un devis.
          </Body>
        </Reveal>

        <ul className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-2 lg:gap-7">
          {serviceRoutes.map((route, index) => {
            const card = cards[route.id];

            if (!card) {
              return null;
            }

            return (
              <Reveal as="li" key={route.id}>
                <Link
                  href={route.path}
                  className={cn(
                    "group relative block overflow-hidden rounded-card no-underline",
                    "h-[21rem] sm:h-[24rem] lg:h-auto lg:aspect-[4/3]",
                  )}
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes={CARD_SIZES}
                    className={cn(
                      "object-cover",
                      card.position,
                      "motion-safe:transition-transform",
                      "motion-safe:duration-(--duration-reveal) motion-safe:ease-cime",
                      "motion-safe:group-hover:scale-[1.03]",
                      "motion-safe:group-focus-visible:scale-[1.03]",
                    )}
                  />

                  {/* Dégradé de base — garantit la lisibilité du contenu. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,37,30,0.93)_0%,rgba(20,37,30,0.74)_26%,rgba(20,37,30,0.30)_54%,rgba(20,37,30,0.04)_82%)]"
                  />

                  {/* Voile qui s'ajoute au survol : l'image s'enfonce
                      légèrement, elle ne s'éclaircit jamais. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0 bg-forest/22 opacity-0",
                      "motion-safe:transition-opacity",
                      "motion-safe:duration-(--duration-reveal) motion-safe:ease-cime",
                      "group-hover:opacity-100 group-focus-visible:opacity-100",
                    )}
                  />

                  {/* Filet d'accent, révélé au survol et au focus. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-card",
                      "border border-transparent",
                      "motion-safe:transition-colors",
                      "motion-safe:duration-(--duration-reveal) motion-safe:ease-cime",
                      "group-hover:border-safety/45 group-focus-visible:border-safety/45",
                    )}
                  />

                  <div
                    data-surface="dark"
                    className="absolute inset-x-0 bottom-0 p-6 lg:p-7"
                  >
                    <span
                      aria-hidden="true"
                      className="font-sans text-eyebrow font-semibold tabular-nums text-(--color-safety)"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3
                      className={cn(
                        "mt-2.5 font-display text-subtitle leading-tight",
                        "text-(--surface-heading)",
                        "motion-safe:transition-transform",
                        "motion-safe:duration-(--duration-micro) motion-safe:ease-cime",
                        "motion-safe:group-hover:-translate-y-0.5",
                        "motion-safe:group-focus-visible:-translate-y-0.5",
                      )}
                    >
                      {route.navLabel}
                    </h3>

                    <p className="mt-2 max-w-[42ch] font-sans text-caption leading-relaxed text-(--surface-fg-muted)">
                      {card.description}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2.5 font-sans text-caption font-semibold text-(--surface-fg)">
                      Voir le service
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className={cn(
                          "size-3.5 shrink-0 text-(--color-safety)",
                          "motion-safe:transition-transform",
                          "motion-safe:duration-(--duration-micro) motion-safe:ease-cime",
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
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-10 lg:mt-14">
          <Body className="max-w-reading text-(--surface-fg-muted)">
            L’abattage difficile, le débroussaillage, la taille de haies et
            l’évacuation des déchets sont traités à l’intérieur de ces quatre
            pages, selon la nature du chantier.
          </Body>
        </Reveal>
      </Container>
    </Section>
  );
}
