import Image from "next/image";

import {
  ArrowLink,
  Body,
  Capsule,
  CardLink,
  Container,
  Eyebrow,
  Reveal,
  Section,
  Title,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { homeRealisations } from "@/lib/realisations-content";
import { getRoute } from "@/lib/routes";

/**
 * Section 5 des 7 sections VERROUILLÉES — quelques interventions.
 *
 * TROIS ANATOMIES DE CARTE SUR UNE MÊME PAGE, ET C'EST VOULU
 * ----------------------------------------------------------
 * `PROJECT.md` interdit la grille de cartes interchangeables. La page en
 * compte pourtant trois séries ; elles ne se ressemblent pas :
 *
 * | Section | Anatomie |
 * | --- | --- |
 * | Preuves | carte pleine, valeur + libellé, aucune image |
 * | Prestations | texte **incrusté** sur la photographie, dégradé forêt |
 * | Réalisations | photographie **en tête de carte**, texte dessous sur le fond |
 *
 * Sortir le texte de l'image a un second mérite, relevé en phase 9 : ces trois
 * photographies sont claires et contrastées, un texte incrusté aurait exigé un
 * dégradé par image (le piège documenté dans `DESIGN_SYSTEM.md` § 5).
 *
 * COMPOSITION 7/5 — REFAITE EN PHASE 15B.3
 * ----------------------------------------
 * Trois cartes égales sur trois colonnes devenaient trois vignettes. La
 * première occupe désormais 7/12 sur deux rangées, les deux autres 5/12
 * empilées : une entrée principale et deux rappels, plutôt que trois éléments
 * de même poids.
 *
 * La section passe sur **sable**, entre le forêt profond de « Pourquoi » et
 * l'ivoire de la carte : c'est le palier qui évite de passer du sombre au
 * clair d'un seul coup.
 *
 * HONNÊTETÉ DU TITRE — NE PAS REFORMULER
 * --------------------------------------
 * « Quelques interventions » laissait entendre des chantiers réellement menés
 * par Arbres et Cimes, ce que ces photographies de repli ne documentent pas.
 * Le titre porte sur l'ADAPTATION à la situation : c'est exact, et c'est aussi
 * l'argument commercial. Tant que la photothèque client n'est pas livrée,
 * cette formulation ne se change pas.
 */

const realisationsRoute = getRoute("realisations");

/** Emprise sur la grille de douze colonnes, dans l'ordre de `homeRealisations`. */
const SPANS = ["lg:col-span-7 lg:row-span-2", "lg:col-span-5", "lg:col-span-5"];

export function Realisations() {
  return (
    <Section surface="sand" aria-labelledby="realisations-titre">
      <Container>
        <Reveal className="mx-auto max-w-reading">
          <Eyebrow>Réalisations</Eyebrow>
          <Title
            id="realisations-titre"
            as="h2"
            className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
          >
            Des interventions adaptées à chaque situation
          </Title>
          <Body className="mt-4 text-(--surface-fg-muted)">
            En hauteur, au ras des habitations, ou une fois l’arbre au sol :
            c’est la situation qui décide de la méthode, pas l’inverse.
          </Body>
        </Reveal>

        <ul className="mt-10 grid gap-(--card-gap) md:grid-cols-2 lg:mt-14 lg:grid-cols-12">
          {homeRealisations.map((item, index) => {
            const grand = index === 0;

            return (
              <Reveal
                as="li"
                key={item.id}
                className={cn(
                  "mx-auto w-full max-w-[30rem] md:max-w-none",
                  SPANS[index],
                )}
              >
                <CardLink
                  href={realisationsRoute.path}
                  tone="plain"
                  padding="none"
                  className="flex h-full flex-col"
                >
                  {/* La grande carte n'a pas de ratio fixe au-delà de 1024 px :
                      elle prend la hauteur des deux petites empilées à côté
                      d'elle, gouttière comprise. */}
                  <div
                    className={cn(
                      "relative w-full overflow-hidden",
                      grand
                        ? "aspect-[4/3] lg:aspect-auto lg:min-h-[22rem] lg:flex-1"
                        : "aspect-[4/3] lg:aspect-[16/9]",
                    )}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes={
                        grand
                          ? "(min-width: 64rem) 46vw, 100vw"
                          : "(min-width: 64rem) 34vw, 100vw"
                      }
                      className={cn(
                        "object-cover",
                        item.position,
                        // Zoom très léger. `overflow-hidden` du parent le
                        // contient ; aucun texte ne bouge, le texte est hors
                        // du cadre photographique.
                        "motion-safe:transition-transform",
                        "motion-safe:duration-(--duration-reveal) motion-safe:ease-cime",
                        "motion-safe:group-hover:scale-[1.04]",
                        "motion-safe:group-focus-visible:scale-[1.04]",
                      )}
                    />
                  </div>

                  <div className="p-5 lg:p-6">
                    <Capsule variant="light">{item.category}</Capsule>

                    <h3 className="mt-4 font-display text-subtitle leading-tight text-(--surface-heading) text-balance">
                      {item.title}
                    </h3>

                    <p className="mx-auto mt-2.5 max-w-[44ch] font-sans text-caption leading-relaxed text-pretty text-(--surface-fg-muted)">
                      {item.teaser}
                    </p>
                  </div>
                </CardLink>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-10 lg:mt-12">
          <ArrowLink href={realisationsRoute.path}>
            Voir toutes les interventions
          </ArrowLink>
        </Reveal>
      </Container>
    </Section>
  );
}
