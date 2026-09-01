import Image from "next/image";

import {
  Body,
  Capsule,
  Card,
  Container,
  Eyebrow,
  Lead,
  Reveal,
  Section,
  SectionPattern,
  Title,
} from "@/components/ui";
import { site } from "@/lib/site";

/**
 * Section 4 des 7 sections VERROUILLÉES — pourquoi Arbres et Cimes.
 *
 * REFAITE EN PHASE 15B.3 — LE POINT D'ANCRAGE SOMBRE DE LA PAGE
 * ------------------------------------------------------------
 * Mesurée avant refonte : **1 206 px en 1440, 2 005 px en 390**, sur ivoire,
 * entre deux autres sections ivoire. C'était la plus longue section de texte
 * de la page, et rien ne la distinguait de ses voisines.
 *
 * Elle passe sur **forêt profond**. C'est le seul aplat sombre du corps de la
 * page, et il tombe au bon endroit : après les prestations, quand le visiteur
 * a vu ce qui est proposé et cherche à savoir à qui il a affaire.
 *
 * Le motif `rings` est posé à 4 % — une texture, pas un dessin. Il reprend le
 * traitement du pied de page, ce qui fait de ces deux blocs sombres une même
 * famille plutôt que deux accidents.
 *
 * DE QUATRE PARAGRAPHES À QUATRE CARTES
 * -------------------------------------
 * La version précédente empilait quatre arguments de 200 à 260 signes, séparés
 * par des filets. Les textes sont ramenés à une ligne chacun et passent en
 * cartes.
 *
 * **Ce qui a été retiré l'a été sans perte d'information :** l'ancienneté du
 * métier est portée par la bande de preuves (« 10+ / Années d'expérience »),
 * et les nuances contractuelles sont conservées mot pour mot — « selon les
 * accès », « selon le besoin ». Le client a indiqué que l'évacuation était
 * possible, pas systématique : cette réserve ne se raccourcit pas.
 *
 * PROPORTIONS
 * -----------
 * Desktop : la carte photographique occupe 5/12 (~45 %), les quatre cartes de
 * confiance les 7/12 restants, en 2 × 2. Mobile : introduction, photographie,
 * puis les cartes — la photographie sert de respiration entre le texte
 * d'ouverture et la grille.
 */

/**
 * Quatre arguments, tous **confirmés par le client** (`PROJECT.md`).
 *
 * Volontairement absents, faute de confirmation : assurance, certification,
 * garantie, diagnostic sanitaire, disponibilité permanente.
 */
const advantages = [
  {
    title: "Travail sécurisé",
    body: "Intervention préparée selon les accès, les bâtiments et l’environnement immédiat.",
  },
  {
    title: "Flexibilité",
    body: "Organisation adaptée au terrain et aux contraintes du chantier.",
  },
  {
    title: "Professionnel diplômé",
    body: "CS Taille et soins des arbres, et BP Paysagiste / gestion des milieux naturels.",
  },
  {
    title: "Chantier propre",
    body: "Débitage, broyage ou évacuation des déchets verts selon le besoin.",
  },
];

export function Why() {
  return (
    <Section surface="deep-forest" aria-labelledby="pourquoi-titre">
      <SectionPattern pattern="rings" opacity={0.04} />

      <Container className="relative">
        <Reveal className="mx-auto max-w-reading">
          <Eyebrow>Pourquoi Arbres &amp; Cimes</Eyebrow>

          <Title
            id="pourquoi-titre"
            className="mt-4 lg:text-[2.5rem] lg:leading-[1.08]"
          >
            Un professionnel qui s’adapte à votre chantier
          </Title>

          <Lead className="mt-5 text-(--surface-fg-muted)">
            Comprendre ce que vous attendez de l’arbre, puis regarder ce que le
            terrain permet réellement. L’accès, l’environnement immédiat et
            l’état du sujet décident de la méthode.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-(--card-gap) lg:mt-16 lg:grid-cols-12 lg:items-stretch">
          {/* ------------------------------------ Carte photographique --- */}
          {/* `sizes` volontairement supérieur à la largeur du cadre : à partir
              de 1024 px la carte n'a plus de ratio fixe, elle prend la hauteur
              de la grille de droite. `object-cover` cale alors sur la hauteur
              et rend une largeur bien plus grande que celle du cadre.
              `lazy` et sans priorité : le LCP est le hero. */}
          <Reveal className="lg:col-span-5">
            <figure className="relative m-0 h-full min-h-72 overflow-hidden rounded-card">
              <Image
                src="/images/hero/demontage-arbre-tronconneuse-sciure.jpg"
                alt="Élagueur-grimpeur encordé démontant un arbre à la tronçonneuse, sciure en suspension dans la lumière"
                fill
                sizes="(min-width: 64rem) 50rem, 100vw"
                quality={70}
                className="object-cover object-[38%_center]"
              />

              {/* Le cadre est une photographie plein bord : sans ce dégradé,
                  la capsule tomberait sur une zone claire imprévisible. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,rgba(8,26,20,0.88)_0%,rgba(8,26,20,0.45)_45%,rgba(8,26,20,0)_100%)]"
              />

              <figcaption
                data-surface="deep-forest"
                className="absolute inset-x-0 bottom-0 p-6"
              >
                <Capsule variant="photo">Sur le terrain</Capsule>
              </figcaption>
            </figure>
          </Reveal>

          {/* --------------------------------------- Cartes de confiance --- */}
          {/* `forest` sur une section `deep-forest` : les cartes se détachent
              d'un demi-ton, sans devenir un aplat clair au milieu du sombre. */}
          <ul className="grid gap-(--card-gap) sm:grid-cols-2 lg:col-span-7">
            {advantages.map((advantage) => (
              <Reveal as="li" key={advantage.title} className="h-full">
                <Card as="div" tone="forest" padding="lg" className="h-full">
                  <span
                    aria-hidden="true"
                    className="mx-auto block h-0.5 w-4 bg-safety"
                  />

                  <h3 className="mt-5 font-display text-subtitle leading-tight text-(--surface-heading)">
                    {advantage.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-[34ch] font-sans text-caption leading-relaxed text-(--surface-fg-muted) text-pretty">
                    {advantage.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="mt-10 lg:mt-12">
          <Body className="mx-auto max-w-reading text-(--surface-fg-muted)">
            Sécuriser la zone, travailler avec du matériel professionnel adapté,
            et laisser l’espace propre une fois l’intervention terminée — avec
            environ {site.experienceYears} ans de métier derrière chaque
            chantier.
          </Body>
        </Reveal>
      </Container>
    </Section>
  );
}
