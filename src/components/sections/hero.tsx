import Image from "next/image";
import type { CSSProperties } from "react";

import {
  Body,
  ButtonLink,
  Capsule,
  CapsuleGroup,
  Container,
  Display,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { area, contact, site, telHref } from "@/lib/site";

/**
 * Hero de la page d'accueil — section 1 des 7 sections VERROUILLÉES.
 *
 * Composant SERVEUR : aucun JavaScript client, aucune bibliothèque
 * d'animation. L'entrée au chargement est entièrement portée par des keyframes
 * CSS (voir `globals.css`, bloc « Hero »).
 *
 * C'est la SEULE page du site dont le hero porte encore une photographie :
 * les pages services, `/a-propos` et `/realisations` l'ont perdue sur demande
 * du client. Elle est donc aussi la seule image prioritaire de tout le site.
 */

/**
 * UNE SEULE SOURCE — décision client, après la phase 15B.4.
 *
 * Le hero servait deux fichiers par direction artistique : une photographie
 * horizontale au-delà de 1024 px, une verticale en dessous, montées dans un
 * `<picture>` pour que le navigateur n'en télécharge qu'une.
 *
 * Le client a demandé la même image partout. Le mécanisme disparaît donc, et
 * avec lui `getImageProps`, le `<picture>` et les deux `preload()` manuels :
 * un `<Image priority>` suffit et pose lui-même son lien de préchargement.
 *
 * C'est la source HORIZONTALE qui est retenue, et pas l'autre. Elle mesure
 * 2400 × 1800 (1,333) contre 1400 × 2094 (0,669), et le hero doit couvrir
 * deux formats opposés :
 *
 * | Format | Rapport | Horizontale | Verticale |
 * | --- | --- | --- | --- |
 * | Mobile 390 × 640 | 0,61 | 46 % de la largeur visible | 91 % — presque natif |
 * | Desktop 1440 × 800 | 1,80 | 74 % de la hauteur visible | **37 %** — le grimpeur est tranché |
 *
 * La verticale est meilleure sur mobile mais **inutilisable** en bandeau
 * large ; l'horizontale se dégrade des deux côtés sans jamais casser. Son
 * cadrage mobile est rattrapé par `object-position`, qui garde le grimpeur
 * dans la fenêtre.
 *
 * Elle est aussi la plus définie des deux, ce qui compte maintenant qu'un seul
 * fichier sert toutes les largeurs.
 */
const HERO_IMAGE = "/images/hero/elagueur-grimpeur-arbre-mature.jpg";

/**
 * Un seul texte alternatif : la photographie montre un élagueur-grimpeur au
 * travail dans un arbre, sur cordes.
 */
const HERO_ALT =
  "Élagueur-grimpeur au travail dans un grand arbre, harnais et cordes de grimpe";

/**
 * Trois repères, pas un de plus (phase 15B.3).
 *
 * Ils remplacent le surtitre « 01 — Élagage · Abattage · Entretien », qui
 * répétait mot pour mot des termes déjà présents dans le paragraphe juste en
 * dessous. Ces trois-là ajoutent quelque chose : la gratuité, la
 * qualification, la zone — c'est-à-dire les trois questions que se pose un
 * visiteur avant de cliquer.
 *
 * Tous vérifiables dans `PROJECT.md`. Aucun tarif, aucun délai, aucune
 * certification inventée.
 */
const CAPSULES = [
  "Devis gratuit",
  "Professionnel diplômé",
  `${area.city} & Métropole`,
];

/** Style en ligne portant l'échelonnement de l'entrée. */
function step(index: number): CSSProperties {
  return { "--hero-index": index } as CSSProperties;
}

export function Hero() {
  // Aucun numéro n'est inventé : sans `NEXT_PUBLIC_PHONE`, l'action « Appeler »
  // n'est pas rendue du tout, plutôt qu'un `tel:` vide ou un faux numéro.
  // La règle vit dans `site.ts` depuis la phase 15B.2 — elle n'est pas
  // réécrite ici.
  const tel = telHref();

  return (
    <section aria-labelledby="hero-titre" className="relative isolate">
      {/* `data-surface="dark"` est indispensable, pas décoratif : c'est lui qui
          bascule `--surface-heading`, `--surface-fg` et `--surface-fg-muted`
          vers le jeu ivoire/pierre. Sans lui, les primitives typographiques
          rendraient du texte forêt sur une photographie sombre. */}
      {/* HAUTEUR REVUE EN PHASE 15B.3.
          Le hero mesurait `min-h-svh` — 900 px sur un écran de 390 × 844, soit
          plus que le viewport une fois l'en-tête déduit : le bouton d'appel à
          l'action tombait sous la ligne de flottaison. Il est ramené à 40 rem
          (640 px), ce qui laisse le titre, la phrase et le bouton dans le
          premier écran, et 44 rem au-delà de 480 px.
          `svh` et non `dvh` : sur Safari mobile, `dvh` change de valeur quand
          la barre d'URL se rétracte, ce qui ferait sauter la mise en page. */}
      <div
        data-surface="dark"
        className={cn(
          "relative flex items-end overflow-hidden",
          "min-h-[40rem] sm:min-h-[44rem]",
          "lg:min-h-[min(92svh,50rem)]",
        )}
      >
        {/* ---------------------------------------------------------------
            La photographie, plein cadre.

            `object-cover` sans compromis : une seule source couvre toutes les
            largeurs. Le recadrage n'est donc plus réglé en changeant de
            fichier, mais par `object-position` — décalé à gauche sous 1024 px
            pour garder le grimpeur dans une fenêtre qui ne montre que 46 % de
            la largeur de l'image, recentré et remonté au-delà.
            --------------------------------------------------------------- */}
        <Image
          src={HERO_IMAGE}
          alt={HERO_ALT}
          fill
          /* Seule image prioritaire du site. `priority` pose le lien de
             préchargement, `fetchPriority` l'attribut que Next n'y met pas
             (mesuré en phase 15B.2). */
          priority
          fetchPriority="high"
          sizes="100vw"
          /* 75 et non 78 : `images.qualities` ne l'a jamais honoré avant la
             phase 15B.3, et 78 alourdissait l'élément LCP de 6 Ko pour une
             différence que personne n'a jamais vue. */
          quality={75}
          className={cn(
            "-z-10 object-cover",
            "object-[36%_center]",
            "lg:object-[center_36%]",
          )}
        />

        {/* Voile de lisibilité mobile — le texte est ancré en bas.
            Le dégradé s'éteint complètement avant la moitié haute : les deux
            tiers supérieurs de la photographie gardent leur densité et leurs
            couleurs d'origine. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(20,37,30,0.94)_0%,rgba(20,37,30,0.88)_24%,rgba(20,37,30,0.72)_46%,rgba(20,37,30,0.32)_64%,rgba(20,37,30,0.06)_82%,rgba(20,37,30,0)_100%)]"
        />

        {/* Protection de l'en-tête : le haut de l'image comporte du ciel clair. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-40 bg-[linear-gradient(to_bottom,rgba(20,37,30,0.62)_0%,rgba(20,37,30,0.24)_45%,rgba(20,37,30,0)_100%)]"
        />

        <Container className="relative pt-24 pb-12 lg:pt-0 lg:pb-16">
          {/* LARGEUR REVUE EN PHASE 15B.3.
              La colonne était bornée à `max-w-4xl` (896 px) au milieu d'un
              conteneur de 1 320 px : une colonne étroite posée sur une très
              grande photographie, ce que le brief nomme précisément. Elle
              passe à 68 rem (1 088 px), ce qui laisse le titre respirer sur
              une ligne et donne au paragraphe une vraie assise.
              L'alignement reste CENTRÉ : c'est une décision client posée une
              fois pour toutes dans `globals.css` (DESIGN_SYSTEM.md § 4). Le
              brief demande d'occuper la largeur, pas de ferrer à gauche. */}
          <div className="mx-auto w-full lg:max-w-[68rem]">
            <div data-hero style={step(0)}>
              <CapsuleGroup>
                {CAPSULES.map((label) => (
                  <Capsule key={label} variant="photo" dot>
                    {label}
                  </Capsule>
                ))}
              </CapsuleGroup>
            </div>

            {/* Le titre monte depuis sous son masque. Le `pb` évite que la
                jambe du « g » soit rognée par l'`overflow-hidden`. */}
            <div className="mt-6 -mb-[0.12em] overflow-hidden lg:mt-7">
              <Display
                as="h1"
                id="hero-titre"
                data-hero-mask
                className="mx-auto max-w-[15ch] pb-[0.12em] lg:max-w-none"
              >
                {/*
                 * `text-balance` couperait volontiers au trait d'union
                 * (« Élagueur- / grimpeur à Rouen »), ce qui hache le mot
                 * composé. Le `nowrap` interdit cette coupure et impose la
                 * seule césure éditoriale acceptable : après le métier.
                 * Restreint à `lg` : sous 1024 px, le titre a besoin de
                 * pouvoir se couper au trait d'union pour tenir à 320 px.
                 * Le texte reste une seule chaîne — aucun impact sur le nom
                 * accessible ni sur le contenu indexé.
                 */}
                <span className="lg:whitespace-nowrap">Élagueur-grimpeur</span>{" "}
                à Rouen
              </Display>
            </div>

            <div
              data-hero-trace
              aria-hidden="true"
              className="mx-auto mt-7 h-px w-16 bg-(--color-safety) lg:mt-8"
            />

            <Body
              data-hero
              style={step(3)}
              className="mx-auto mt-7 max-w-reading text-(--surface-fg) lg:mt-8"
            >
              {site.name} intervient sur l’élagage, l’abattage et l’entretien
              des arbres à {area.city} et dans la {area.metro}
              <span className="hidden sm:inline">
                , pour les particuliers, les professionnels et les collectivités
              </span>
              .
            </Body>

            <div
              data-hero
              style={step(4)}
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:mt-10"
            >
              {/* La largeur est portée par une ENVELOPPE : `cn()` ne fusionne
                  pas les classes concurrentes (cf. DESIGN_SYSTEM.md § 8). */}
              <div className="w-full sm:w-fit">
                <ButtonLink
                  href={contact.quotePath}
                  variant="primary"
                  size="lg"
                  block
                  data-cta="devis"
                  data-cta-source="accueil-hero"
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
                    data-cta-source="accueil-hero"
                  >
                    Appeler
                  </ButtonLink>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
