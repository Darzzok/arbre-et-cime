import Image from "next/image";

import {
  Body,
  Container,
  Eyebrow,
  Lead,
  Reveal,
  Section,
  Subtitle,
  Title,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/**
 * Section 4 des 7 sections VERROUILLÉES — pourquoi Arbre et Cime.
 *
 * Surface **claire**. La première version de la phase 8 posait un aplat
 * charbon plein écran juste avant un pied de page forêt : deux masses sombres
 * consécutives, écrasantes et froides. La contrainte « aucune section ne doit
 * se terminer en forêt » (DESIGN_SYSTEM.md § 8) est ici satisfaite bien plus
 * simplement — une section claire donne au pied de page toute sa marche.
 *
 * Composition **asymétrique en deux colonnes**, pas une grille de cartes :
 *   colonne gauche  titre, texte d'introduction, photographie ;
 *   colonne droite  les quatre arguments, en rythme vertical.
 *
 * Les arguments ne sont PAS encadrés. Ils sont séparés par des filets d'un
 * pixel et scandés par un numéro serti entre deux accents jaunes : leurs
 * hauteurs suivent la longueur du texte, ce qui casse l'effet « quatre
 * rectangles identiques » reproché à la version précédente. C'est aussi ce qui
 * les distingue des cartes photographiques de la section Prestations, juste
 * au-dessus.
 */

/**
 * Quatre arguments, tous **confirmés par le client** (`PROJECT.md`).
 *
 * Volontairement absents, faute de confirmation : assurance, certification,
 * garantie, diagnostic sanitaire, disponibilité permanente.
 *
 * « Selon la prestation » et « peuvent être » ne sont pas des précautions de
 * style : le client a indiqué que l'évacuation était possible, pas
 * systématique. Ces formulations doivent le rester.
 */
const advantages = [
  {
    title: "Travail sécurisé",
    body:
      "Intervention préparée selon la configuration du chantier, l’accès et " +
      "l’environnement immédiat. Utilisation d’équipements professionnels et " +
      "adaptation de la méthode aux contraintes rencontrées.",
  },
  {
    title: "Flexibilité",
    body:
      "Jardin clos, passage étroit, arbre proche d’un bâtiment ou " +
      "intervention urgente : l’organisation s’adapte au terrain et à la " +
      "situation du client.",
  },
  {
    title: "Professionnel diplômé",
    body:
      "CS Taille et soins des arbres et BP Paysagiste / gestion des milieux " +
      `naturels, avec environ ${site.experienceYears} ans d’expérience métier.`,
  },
  {
    title: "Chantier propre",
    body:
      "Selon la prestation, les branches, bois et déchets verts peuvent être " +
      "débités, broyés ou évacués afin de laisser une zone propre après " +
      "intervention.",
  },
];

export function Why() {
  return (
    <Section surface="light" aria-labelledby="pourquoi-titre">
      <Container>
        {/* `items-stretch` (defaut) et non `items-start` : la colonne gauche
            prend la hauteur de la rangee, fixee par la colonne d'arguments.
            C'est ce qui permet a la photographie d'aligner son bas sur le
            dernier argument, au lieu de laisser un vide sous elle. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16 xl:gap-x-24">
          {/* ---------------------------------------- Colonne éditoriale --- */}
          <div className="lg:col-span-6 lg:flex lg:flex-col">
            <Reveal>
              <Eyebrow>Pourquoi Arbre &amp; Cime</Eyebrow>

              {/* H2 volontairement bridé sous sa taille fluide maximale (46 px) :
                  dans une colonne de six douzièmes il occuperait quatre lignes
                  et écraserait le texte qui le suit. */}
              <Title
                id="pourquoi-titre"
                className="mt-5 lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Un professionnel qui s’adapte à chaque chantier
              </Title>

              <Lead className="mt-6 text-(--surface-fg-muted)">
                Chaque chantier commence par la même chose : comprendre ce que
                vous attendez de l’arbre, puis regarder ce que le terrain permet
                réellement. L’accès, l’environnement immédiat et l’état du sujet
                décident de la méthode.
              </Lead>

              <Body className="mt-4 text-(--surface-fg-muted)">
                Le reste suit dans cet ordre : sécuriser la zone, travailler
                avec du matériel professionnel adapté, et laisser l’espace
                propre une fois l’intervention terminée.
              </Body>
            </Reveal>

            {/* Photographie de chantier réel, jusqu'ici inutilisée sur le site.
                Cadrage vertical sur mobile — où elle est le seul visuel de la
                section — puis paysage à 640 px. À partir de 1024 px elle n'a
                plus de ratio fixe : elle occupe toute la hauteur restante de la
                colonne, ce qui aligne son bas sur le dernier argument. `lazy`
                et sans priorité : le LCP est le hero.

                `sizes` est volontairement bien supérieur à la largeur du cadre :
                celui-ci est plus haut que large alors que la source est en 3:2,
                donc `object-cover` cale sur la hauteur et rend une largeur bien
                plus grande. Annoncer la largeur du cadre servirait une image
                trop petite, remontée floue. */}
            <Reveal className="mt-10 lg:mt-12 lg:min-h-72 lg:flex-1">
              <figure className="relative aspect-[4/5] overflow-hidden rounded-card sm:aspect-[3/2] lg:aspect-auto lg:h-full">
                <Image
                  src="/images/hero/demontage-arbre-tronconneuse-sciure.jpg"
                  alt="Élagueur-grimpeur encordé démontant un arbre à la tronçonneuse, sciure en suspension dans la lumière"
                  fill
                  sizes="(min-width: 64rem) 60rem, 150vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>
          </div>

          {/* ------------------------------------------ Colonne arguments --- */}
          {/* Décalée d'une colonne (7 sur 12) : la gouttière supplémentaire qui
              en résulte est ce qui rend la composition asymétrique plutôt que
              simplement coupée en deux. */}
          <ul className="lg:col-span-5 lg:col-start-8">
            {advantages.map((advantage, index) => (
              <Reveal
                as="li"
                key={advantage.title}
                className={cn(
                  "group border-t border-(--surface-rule) py-8 lg:py-9",
                  // Le premier argument ouvre la colonne sans filet : le filet
                  // sépare, il n'encadre pas.
                  "first:border-t-0 first:pt-0",
                  "last:pb-0",
                )}
              >
                {/* Numéro serti entre deux accents jaunes. Seul mouvement de la
                    section avec le Reveal : les filets s'allongent au survol,
                    sans déplacer une seule ligne de texte. */}
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center gap-3"
                >
                  <span
                    className={cn(
                      "block h-px w-5 bg-safety",
                      "motion-safe:transition-[width]",
                      "motion-safe:duration-(--duration-reveal) motion-safe:ease-line",
                      "group-hover:w-10",
                    )}
                  />
                  <span className="font-sans text-eyebrow font-semibold tabular-nums text-(--surface-fg-muted)">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "block h-px w-5 bg-safety",
                      "motion-safe:transition-[width]",
                      "motion-safe:duration-(--duration-reveal) motion-safe:ease-line",
                      "group-hover:w-10",
                    )}
                  />
                </div>

                <Subtitle as="h3" className="mt-5">
                  {advantage.title}
                </Subtitle>

                <Body className="mt-3 text-(--surface-fg-muted)">
                  {advantage.body}
                </Body>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
