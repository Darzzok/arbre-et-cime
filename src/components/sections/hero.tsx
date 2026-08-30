import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { preload } from "react-dom";

import { Body, ButtonLink, Container, Display, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/cn";
import { getRoute } from "@/lib/routes";
import { area, site } from "@/lib/site";

/**
 * Hero de la page d'accueil — section 1 des 7 sections VERROUILLÉES.
 *
 * Composant SERVEUR : aucun JavaScript client, aucune bibliothèque
 * d'animation. L'entrée au chargement est entièrement portée par des keyframes
 * CSS (voir `globals.css`, bloc « Hero »).
 *
 * Photographie verrouillée en phase 5A : candidate n°1 de `MEDIA_SOURCES.md`.
 * Ne pas la remplacer sans mettre le registre à jour.
 */

/**
 * DIRECTION ARTISTIQUE — deux sources, un seul téléchargement.
 *
 * Une photographie en 4:3 ne peut pas remplir un viewport mobile en 0,46 sans
 * en perdre 65 % de la largeur : le grimpeur devient un gros plan et le
 * chantier disparaît. Plutôt que de dégrader le cadrage, on change de source
 * sous 1024 px — c'est exactement l'usage prévu pour la candidate verticale
 * retenue en phase 5A (`MEDIA_SOURCES.md`).
 *
 * Les deux sont servies par un `<picture>` : le navigateur n'en télécharge
 * qu'une, celle que son media query désigne.
 */
const HERO_DESKTOP = {
  src: "/images/hero/elagueur-grimpeur-arbre-mature.jpg",
  width: 2400,
  height: 1800,
};

const HERO_MOBILE = {
  src: "/images/hero/elagueur-ascension-tronc-vertical.jpg",
  width: 1400,
  height: 2094,
};

/**
 * Un seul texte alternatif : les deux fichiers montrent la même chose — un
 * élagueur-grimpeur au travail dans un arbre, sur cordes. La formulation reste
 * vraie quelle que soit la source servie.
 */
const HERO_ALT =
  "Élagueur-grimpeur au travail dans un grand arbre, harnais et cordes de grimpe";

/**
 * Point de rupture de la bascule, aligné sur `lg` (voir DESIGN_SYSTEM.md § 4).
 * Les deux requêtes média sont strictement complémentaires : à toute largeur,
 * une seule des deux sources est désignée — donc une seule est préchargée, et
 * une seule est téléchargée.
 */
const HERO_MEDIA_DESKTOP = "(min-width: 64rem)";
const HERO_MEDIA_MOBILE = "(max-width: 63.999rem)";

const devis = getRoute("devis");

/** Style en ligne portant l'échelonnement de l'entrée. */
function step(index: number): CSSProperties {
  return { "--hero-index": index } as CSSProperties;
}

export function Hero() {
  // Aucun numéro n'est inventé : sans `NEXT_PUBLIC_PHONE`, l'action « Appeler »
  // n'est pas rendue du tout, plutôt qu'un `tel:` vide ou un faux numéro.
  const hasPhone = site.phone.length > 0;

  // `getImageProps` donne les jeux d'URLs optimisées de Next sans passer par le
  // composant `<Image>`, ce qui permet de les monter dans un vrai `<picture>` —
  // la seule façon de faire de la direction artistique sans télécharger les
  // deux fichiers.
  const shared = {
    alt: HERO_ALT,
    sizes: "100vw",
    priority: true,
    quality: 78,
  } as const;

  const { props: desktopImage } = getImageProps({ ...shared, ...HERO_DESKTOP });
  const { props: mobileImage } = getImageProps({ ...shared, ...HERO_MOBILE });

  /*
   * `getImageProps` ne pose ni `fetchpriority` ni lien de préchargement —
   * c'est le composant `<Image>` qui s'en charge, et on ne l'utilise pas ici.
   * Le hero étant l'élément LCP, on les rétablit à la main.
   *
   * `media` sur un préchargement d'image est bien pris en charge : chaque
   * source n'est préchargée que sur le format qui la sert réellement.
   */
  preload(desktopImage.src, {
    as: "image",
    imageSrcSet: desktopImage.srcSet,
    imageSizes: desktopImage.sizes,
    fetchPriority: "high",
    media: HERO_MEDIA_DESKTOP,
  });

  preload(mobileImage.src, {
    as: "image",
    imageSrcSet: mobileImage.srcSet,
    imageSizes: mobileImage.sizes,
    fetchPriority: "high",
    media: HERO_MEDIA_MOBILE,
  });

  return (
    <section aria-labelledby="hero-titre" className="relative isolate">
      {/* ---------------------------------------------------------------
          Bloc photographique. `min-h-svh` et non `dvh` : sur Safari mobile,
          `dvh` change de valeur quand la barre d'URL se rétracte, ce qui fait
          sauter la mise en page en cours de défilement. `svh` correspond à la
          hauteur la plus petite — le hero tient toujours, sans jamais bouger.
          --------------------------------------------------------------- */}
      {/* `data-surface="dark"` est indispensable, pas décoratif : c'est lui qui
          bascule `--surface-heading`, `--surface-fg` et `--surface-fg-muted`
          vers le jeu ivoire/pierre. Sans lui, les primitives typographiques
          rendraient du texte forêt sur une photographie sombre. */}
      <div
        data-surface="dark"
        className="relative flex min-h-svh items-end overflow-hidden lg:min-h-[min(100svh,56rem)]"
      >
        {/* ---------------------------------------------------------------
            La photographie, plein cadre.

            `object-cover` sans compromis : l'image remplit toute la section à
            toutes les largeurs. C'est le `<picture>` qui règle le problème du
            recadrage mobile — en changeant de source, pas en rétrécissant
            l'image.
            --------------------------------------------------------------- */}
        <picture>
          <source
            media={HERO_MEDIA_DESKTOP}
            srcSet={desktopImage.srcSet}
            sizes={desktopImage.sizes}
          />
          {/* `<img>` et non `<Image>` : c'est le seul moyen de faire de la
              direction artistique sans télécharger les deux sources. Les URLs,
              le `srcSet` et l'optimisation restent ceux de next/image, fournis
              par `getImageProps`. */}
          <img
            {...mobileImage}
            alt={HERO_ALT}
            fetchPriority="high"
            loading="eager"
            className={cn(
              "absolute inset-0 -z-10 size-full object-cover",
              // Mobile : léger décalage vers la gauche pour garder le grimpeur
              // et son point d'ancrage entiers dans le cadre.
              "object-[32%_center]",
              // Desktop : recadrage vertical, remonté pour conserver le
              // houppier et les cordes au-dessus du grimpeur.
              "lg:object-[center_36%]",
            )}
          />
        </picture>

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

        <Container className="relative pt-28 pb-14 lg:pt-0 lg:pb-0">
          {/* Colonne centrée, assez large pour que « Élagueur-grimpeur »
              tienne sur une ligne à 76 px. */}
          <div className="mx-auto w-full lg:max-w-4xl">
            <Eyebrow data-hero style={step(0)}>
              <span aria-hidden="true" className="text-(--color-safety)">
                01
              </span>
              <span aria-hidden="true" className="mx-2.5 opacity-60">
                —
              </span>
              Élagage · Abattage · Entretien
            </Eyebrow>

            {/* Le titre monte depuis sous son masque. Le `pb` évite que la
                jambe du « g » soit rognée par l'`overflow-hidden`. */}
            <div className="mt-5 -mb-[0.12em] overflow-hidden lg:mt-6">
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
                <ButtonLink href={devis.path} variant="primary" size="lg" block>
                  Demander un devis
                </ButtonLink>
              </div>

              {hasPhone ? (
                <div className="w-full sm:w-fit">
                  <ButtonLink
                    href={`tel:${site.phone}`}
                    variant="outline"
                    size="lg"
                    block
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
