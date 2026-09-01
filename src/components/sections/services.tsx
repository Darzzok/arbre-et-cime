import Image from "next/image";
import Link from "next/link";

import {
  Body,
  Capsule,
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
 * `SEO_STRATEGY.md` § 4. Le rappel en fin de section porte cette information —
 * elle ne doit pas disparaître.
 *
 * GRILLE ASYMÉTRIQUE — REFAITE EN PHASE 15B.3
 * -------------------------------------------
 * La version précédente était une grille 2 × 2 de quatre cartes **strictement
 * identiques** : même largeur, même ratio 4:3, même hauteur. C'est le motif que
 * `CLAUDE.md` § 6 interdit nommément.
 *
 * La grille passe donc à douze colonnes, sur deux rangées de proportions
 * inversées :
 *
 * | Rangée | Gauche | Droite |
 * | --- | --- | --- |
 * | 1 | **Élagage** — 7/12, haute | **Abattage** — 5/12, haute |
 * | 2 | **Dessouchage** — 5/12, basse | **Entretien** — 7/12, basse |
 *
 * L'inversion 7/5 puis 5/7 est ce qui produit l'asymétrie : deux rangées 7/5
 * identiques auraient seulement déplacé le problème. Les deux hauteurs
 * distinctes (32 rem puis 24 rem) hiérarchisent : l'élagage est le cœur de
 * métier, il occupe la plus grande surface de la page.
 *
 * La mise en page est déclarée **par identifiant de route**, pas par index :
 * réordonner `serviceRoutes` ne peut pas casser silencieusement la grille.
 *
 * MOBILE : une colonne, hauteur unique. L'asymétrie n'a aucun sens sur 390 px,
 * où toutes les cartes occupent de toute façon la pleine largeur.
 */

type ServiceCard = {
  image: string;
  alt: string;
  /** Cadrage : ces photos sont recadrées fort, le sujet doit rester dedans. */
  position: string;
  /** Capsule de catégorie, affichée sur la photographie. */
  capsule: string;
  /** Une ligne. Le détail est sur la page du service. */
  description: string;
  /** Emprise sur la grille de douze colonnes, à partir de `lg`. */
  span: string;
  /** Hauteur de la carte. Deux valeurs seulement, jamais quatre. */
  height: string;
};

const cards: Record<string, ServiceCard> = {
  elagage: {
    image: "/images/services/elagage-travail-sur-corde-securite.jpg",
    alt: "Élagueur-grimpeur suspendu à sa corde, taillant les branches d’un arbre au pied d’un bâtiment",
    position: "object-[center_38%]",
    capsule: "Cœur de métier",
    description: "Préserver, équilibrer et sécuriser les arbres.",
    span: "lg:col-span-7",
    height: "h-[21rem] sm:h-[24rem] lg:h-[32rem]",
  },
  abattage: {
    image: "/images/services/abattage-arbre-tombe-intervention-urgence.jpg",
    alt: "Grand arbre abattu, débité en sections sur un terrain arboré",
    position: "object-center",
    capsule: "Urgences",
    description: "Retirer l’arbre, y compris en situation complexe.",
    span: "lg:col-span-5",
    height: "h-[21rem] sm:h-[24rem] lg:h-[32rem]",
  },
  dessouchage: {
    image: "/images/services/dessouchage-rogneuse-en-action.jpg",
    alt: "Rogneuse de souche en action, tête de rognage et copeaux de bois frais au pied d’une clôture",
    /* La machine occupe la moitié droite du cadre, le tronc au premier plan
       la gauche. Sur une carte plus haute que large, un centrage montrerait
       surtout le flou d avant-plan. */
    position: "object-[64%_center]",
    capsule: "Remise en état",
    description: "Libérer la zone après la coupe.",
    span: "lg:col-span-5",
    height: "h-[21rem] sm:h-[24rem] lg:h-[24rem]",
  },
  "entretien-exterieur": {
    image: "/images/services/taille-de-haie-taille-haie-thermique.jpg",
    alt: "Taille d’une haie de conifères au taille-haie thermique",
    position: "object-[center_42%]",
    capsule: "Entretien",
    description: "Haies, débroussaillage et espaces extérieurs.",
    span: "lg:col-span-7",
    height: "h-[21rem] sm:h-[24rem] lg:h-[24rem]",
  },
};

/**
 * Les cartes larges occupent 7/12 du conteneur (soit ~640 px en 1440), les
 * étroites 5/12 (~450 px). On annonce la plus grande des deux : servir 450 px
 * à une carte de 640 remonterait une image floue.
 */
const CARD_SIZES = "(min-width: 64rem) 46vw, 100vw";

export function Services() {
  return (
    <Section surface="light" aria-labelledby="prestations-titre">
      <Container>
        <Reveal className="mx-auto max-w-reading">
          <Eyebrow>Prestations</Eyebrow>
          {/* Titre volontairement contenu : ce sont les cartes qui portent la
              section, pas le titre. */}
          <Title
            id="prestations-titre"
            className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
          >
            Nos interventions
          </Title>
          <Body className="mt-4 text-(--surface-fg-muted)">
            Quatre interventions, quatre pages : la méthode, les cas traités et
            ce qui fait varier un devis.
          </Body>
        </Reveal>

        <ul className="mt-10 grid gap-(--card-gap) md:grid-cols-2 lg:mt-14 lg:grid-cols-12">
          {serviceRoutes.map((route) => {
            const card = cards[route.id];

            if (!card) {
              return null;
            }

            return (
              <Reveal as="li" key={route.id} className={card.span}>
                <Link
                  href={route.path}
                  className={cn(
                    "group relative block overflow-hidden rounded-card no-underline",
                    card.height,
                  )}
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes={CARD_SIZES}
                    /* 68 et non 75 : ces photographies sont recouvertes d un
                       degrade allant de 0,93 a 0,04. Le detail des zones
                       basses n est pas visible, son cout de transfert si —
                       mesure a 257 Ko pour les quatre cartes. */
                    quality={68}
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
                    <Capsule variant="photo">{card.capsule}</Capsule>

                    <h3
                      className={cn(
                        "mt-4 font-display text-subtitle leading-tight",
                        "text-(--surface-heading)",
                        "motion-safe:transition-transform",
                        "motion-safe:duration-(--duration-micro) motion-safe:ease-cime",
                        "motion-safe:group-hover:-translate-y-0.5",
                        "motion-safe:group-focus-visible:-translate-y-0.5",
                      )}
                    >
                      {route.navLabel}
                    </h3>

                    <p className="mx-auto mt-2 max-w-[42ch] font-sans text-caption leading-relaxed text-(--surface-fg-muted)">
                      {card.description}
                    </p>

                    <span className="mt-5 inline-flex items-center justify-center gap-2.5 font-sans text-caption font-semibold text-(--surface-fg)">
                      Découvrir
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
          <Body className="mx-auto max-w-reading text-(--surface-fg-muted)">
            L’abattage difficile, le débroussaillage, la taille de haies et
            l’évacuation des déchets sont traités à l’intérieur de ces quatre
            pages, selon la nature du chantier.
          </Body>
        </Reveal>
      </Container>
    </Section>
  );
}
