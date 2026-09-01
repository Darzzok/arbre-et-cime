"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import {
  HOME_MARKERS,
  PAGE_MARKERS,
  toX,
  toY,
  type Leader,
  type MapMarker,
} from "@/lib/map-content";
import {
  DEPARTEMENTS,
  MAIN_DEPARTEMENT,
  MAP_ASPECT,
  MAP_VIEW_BOX_ATTR,
  METROPOLE_PATHS,
  REGION_PATH,
  REGION_PATH_LENGTH,
  SEINE_PATH,
  SEINE_PATH_LENGTH,
} from "@/lib/map-data";
import { locationPath } from "@/lib/seo";
import { area } from "@/lib/site";

/**
 * Carte de couverture. Élément signature du site.
 *
 * REFAITE INTÉGRALEMENT AU CORRECTIF 10C
 * ---------------------------------------
 * Les deux versions précédentes partageaient la même erreur de conception :
 * **le sujet de la carte était le cercle de 100 km**, et le territoire n'en
 * était que le fond. Deux conséquences fatales, toutes deux reprochées par le
 * client : le territoire devenait méconnaissable, et les communes de la
 * métropole — distantes de trois kilomètres — tombaient toutes sur le même
 * pixel, donc « flottaient dans le vide » ou disparaissaient.
 *
 * Le sujet est maintenant **le territoire** :
 *
 * | | Avant | Maintenant |
 * | --- | --- | --- |
 * | Cadre | cercle de 100 km centré sur Rouen | **±112 km : le territoire ET la portée entière** |
 * | Cœur de zone | un disque de 25 km inventé | **les 71 communes réelles de la métropole** |
 * | Couverture | 4 anneaux concentriques | **3 surfaces emboîtées** |
 * | 100 km | cercle dominant | **un seul cercle pointillé, tracé en dernier** |
 * | Communes | 5 à 11, tassées ou lointaines | **21 : grappe en étoile + couronne d'azimuts** |
 *
 * TROIS NIVEAUX DE LECTURE
 * ------------------------
 * 1. **Cœur** — la Métropole Rouen Normandie, dessinée commune par commune.
 *    Soixante-et-onze polygones partageant un aplat donnent la texture d'un
 *    vrai découpage administratif ; un disque n'aurait rien dit.
 * 2. **Zone principale** — la Seine-Maritime, aplat plus léger, contour marqué.
 * 3. **Élargie** — le cercle de 100 km, demandé par le client après le 10C.
 *    Il est **pointillé** et non plein (une frontière se lit pleine, une
 *    indication se lit pointillée), il est **seul** — les quatre anneaux
 *    concentriques dessinaient un service gradué qui n'existe pas — et il
 *    porte sa mention « portée maximale indicative » sur la plaque même.
 *    Il dit JUSQU'OÙ, jamais PARTOUT (`CONTENT_STRATEGY.md` § 5 quinquies).
 *
 * LES LIGNES DE RAPPEL
 * --------------------
 * Cinq communes dans dix kilomètres, soit une vingtaine de pixels. Leurs
 * étiquettes sont déportées en étoile et reliées par une ligne de rappel — le
 * procédé cartographique classique pour une grappe dense, et la seule façon de
 * satisfaire « cinq communes lisibles » et « aucune collision » ensemble.
 *
 * ARCHITECTURE : SVG POUR LA GÉOGRAPHIE, HTML POUR LE RESTE
 * ---------------------------------------------------------
 * Le SVG ne porte que des tracés ; repères, lignes de rappel et étiquettes
 * sont du HTML en pixels constants. Un `<text>` SVG grandirait avec la
 * `viewBox` ; un repère HTML devient un vrai `<button>`, avec focus clavier
 * natif et cible tactile de 44 px.
 *
 * L'alignement des deux couches tient à une seule contrainte : le conteneur
 * porte le rapport `MAP_ASPECT` du cadre généré. **Ne pas le remplacer par une
 * valeur écrite à la main.**
 */

/** Portée annoncée, en kilomètres. Un seul cercle, jamais quatre. */
const REACH_KM = 100;
const REACH_CIRCUMFERENCE = Math.round(2 * Math.PI * REACH_KM);

type ZoneMapProps = {
  variant: "home" | "page" | "local";
  /** Nom accessible de la figure. */
  title: string;
  className?: string;
  /**
   * Variante `local` : code INSEE de la commune mise en avant, et jeu de
   * repères restreint. Une page ville ne montre pas vingt-trois points — elle
   * montre la commune, Rouen, et quelques voisins pour situer.
   */
  highlight?: string;
  markers?: readonly MapMarker[];
};

export function ZoneMap({
  variant,
  title,
  className,
  highlight,
  markers: markersProp,
}: ZoneMapProps) {
  const markers =
    markersProp ?? (variant === "home" ? HOME_MARKERS : PAGE_MARKERS);

  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(highlight ?? null);
  const [hovered, setHovered] = useState<string | null>(null);
  // `useId` produit des deux-points, illégaux dans une référence `url(#…)`.
  const id = useId().replace(/:/g, "");

  /* Le survol prime sur la sélection : on explore à la souris sans perdre le
     repère épinglé au clic. */
  const shown = markers.find((mark) => mark.code === (hovered ?? active));

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const play = () => node.setAttribute("data-play", "");

    if (typeof IntersectionObserver === "undefined") {
      play();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play();
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className}>
      <div
        ref={rootRef}
        data-map=""
        /* `--map-leader` met les lignes de rappel a l'echelle de la carte.
           Elles sont definies en pixels — c'est ce qui garde le texte a taille
           constante — mais un rappel de 76 px sur une carte de 280 px pousse
           l'etiquette hors du cadre. Mesure a 320 px : Mont-Saint-Aignan et
           Bois-Guillaume sortaient. */
        className="relative w-full overflow-hidden rounded-card [--map-leader:0.36] sm:[--map-leader:0.72] lg:[--map-leader:1]"
        style={{ aspectRatio: MAP_ASPECT }}
      >
        <svg
          viewBox={MAP_VIEW_BOX_ATTR}
          role="img"
          aria-labelledby={`${id}-titre`}
          className="absolute inset-0 size-full"
        >
          <title id={`${id}-titre`}>{title}</title>

          <defs>
            {/* La Seine s'estompe avec l'éloignement : son tracé s'arrête net à
                l'estuaire et file vers la Bourgogne bien au-delà du cadre. */}
            <radialGradient
              id={`${id}-fade`}
              gradientUnits="userSpaceOnUse"
              cx="0"
              cy="0"
              r="150"
            >
              <stop offset="0" stopColor="white" stopOpacity="1" />
              <stop offset="0.5" stopColor="white" stopOpacity="0.9" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id={`${id}-seine-mask`}>
              <rect x="-112" y="-112" width="224" height="224" fill={`url(#${id}-fade)`} />
            </mask>

          </defs>

          {/* --------------------------------------------------- Mer ---
              Le fond du cadre. Tout ce qui n'est pas recouvert par un
              département est la Manche : c'est ce qui donne enfin un
              contraste figure/fond, et ce qui faisait défaut aux deux
              versions précédentes, où le territoire flottait sur l'ivoire. */}
          <rect
            data-map-sea=""
            x="-112"
            y="-112"
            width="224"
            height="224"
            fill="var(--map-sea)"
          />

          {/* PAS de halo pour la zone élargie.
              Un dégradé radial posé sur tout le cadre a été essayé : ses coins
              restaient teintés, et l'ensemble se lisait comme un rectangle gris
              posé sous la carte — exactement l'effet « schéma » à éliminer. Le
              troisième niveau est donc porté par le texte seul, ce qui est
              aussi ce que demande le brief : la limite de 100 km doit rester
              secondaire. */}

          {/* -------------------------------------------------- Terre ---
              Les dix départements du cadre, en aplat OPAQUE. C'est
              l'opacité qui crée le trait de côte : la terre couvre la mer,
              et la découpe se lit d'elle-même. */}
          <g data-map-land="">
            {DEPARTEMENTS.filter((d) => d.code !== MAIN_DEPARTEMENT).map((d) => (
              <path
                key={d.code}
                d={d.d}
                /* Terre en ivoire PLEIN sur une mer en pierre : c'est le
                   couple qui donne le trait de côte et le contraste
                   figure/fond. La plaque étant délimitée par ses coins
                   arrondis, la terre ne se confond plus avec le fond de page
                   comme lorsqu'elle flottait sans cadre. */
                fill="var(--map-land)"
                stroke="var(--map-line-soft)"
                strokeWidth="0.45"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* --------------------------------------- 2. Zone principale ---
              La Seine-Maritime : aplat affirmé et contour net. C'est elle le
              territoire reconnaissable au premier coup d'œil. */}
          {DEPARTEMENTS.filter((d) => d.code === MAIN_DEPARTEMENT).map((d) => (
            <path
              key={d.code}
              data-map-main=""
              d={d.d}
              fill="var(--map-region)"
              stroke="var(--map-line)"
              strokeWidth="1"
              strokeLinejoin="round"
              style={{ "--map-main-length": 900 } as React.CSSProperties}
            />
          ))}

          {/* Contour régional, en filet de contexte. */}
          <path
            data-map-outline=""
            d={REGION_PATH}
            fill="none"
            stroke="var(--map-line-soft)"
            strokeWidth="0.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={
              { "--map-outline-length": REGION_PATH_LENGTH } as React.CSSProperties
            }
          />

          {/* ------------------------------------------------- 1. Cœur ---
              Les 71 communes de la métropole. Le filet interne donne la
              texture d'un découpage réel — c'est ce qui fait lire
              « métropole » plutôt que « tache ». */}
          <g data-map-metropole="">
            {METROPOLE_PATHS.map((d, index) => (
              <path
                key={index}
                d={d}
                fill="var(--map-core)"
                stroke="var(--color-ivory)"
                strokeOpacity="0.28"
                strokeWidth="0.2"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* --------------------------------------------------- Seine --- */}
          <path
            data-map-seine=""
            d={SEINE_PATH}
            fill="none"
            stroke="var(--color-forest)"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            mask={`url(#${id}-seine-mask)`}
            style={
              { "--map-seine-length": SEINE_PATH_LENGTH } as React.CSSProperties
            }
          />
          {/* --------------------------------------- Portée de 100 km ---
              UN cercle, pas quatre anneaux. Il se trace au
              `stroke-dashoffset` en dernier, par-dessus le territoire :
              c'est une portée posée sur une carte, pas un radar qui la
              remplace. Trait fin, pointillé long, forêt à 45 % — assez présent
              pour être lu, assez discret pour ne pas devenir le sujet.

              Le cadre a été élargi à ±112 km exprès pour qu'il tienne entier :
              un cercle rogné aux quatre coins se lit comme une carte coupée. */}
          <circle
            data-map-reach=""
            cx="0"
            cy="0"
            r={REACH_KM}
            fill="none"
            /* Jaune sécurité, seule couleur chaude de la charte. C'est la
               deuxième et dernière occurrence de l'accent sur la carte, avec
               Rouen — les deux marquent la même chose : la zone de
               l'entreprise. Sans elle, la carte restait un camaïeu de verts et
               de gris, et c'est ce qui la faisait paraître fade. */
            stroke="var(--color-safety)"
            strokeOpacity="0.85"
            strokeWidth="1.1"
            strokeDasharray="7 5"
            strokeLinecap="round"
            style={
              {
                "--map-reach-circumference": REACH_CIRCUMFERENCE,
              } as React.CSSProperties
            }
          />
        </svg>

        {/* --------------------------------------- Étiquette de portée ---
            Posée SUR le cercle, au nord-ouest — secteur sans commune. */}
        <span
          aria-hidden="true"
          data-map-reach-label=""
          style={{
            left: `${toX(-REACH_KM * Math.SQRT1_2)}%`,
            top: `${toY(-REACH_KM * Math.SQRT1_2)}%`,
          }}
          className={cn(
            "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2",
            "rounded-edge bg-safety px-2 py-0.5",
            "font-sans text-[0.6875rem] font-semibold tabular-nums",
            "text-charcoal",
          )}
        >
          {REACH_KM} km
        </span>

        {/* ---------------------------------------------------- Communes --- */}
        {markers.map((mark, index) => (
          <CityMarker
            key={mark.code}
            mark={mark}
            index={index}
            isActive={active === mark.code}
            isHighlighted={highlight === mark.code}
            onToggle={() =>
              setActive((current) => (current === mark.code ? null : mark.code))
            }
            onPreview={setHovered}
          />
        ))}

        {/* --------------------------------------- Repère de déplacement ---
            La limite de 100 km, en bas à gauche, hors du territoire dessiné.
            Secondaire par construction : c'est une mention, pas un tracé. */}
        <p
          data-map-reach-note=""
          className={cn(
            "absolute bottom-1 left-1 max-w-[11rem] text-left",
            "rounded-edge bg-(--surface-bg)/90 px-2.5 py-1.5",
            "font-sans text-[0.6875rem] leading-snug text-(--surface-fg-muted)",
          )}
        >
          Portée maximale indicative —{" "}
          <span className="font-semibold text-(--surface-heading)">
            selon le chantier
          </span>
        </p>
      </div>

      {/* ------------------------------------------- Ligne contextuelle ---
          Alimentée indifféremment par le survol, le focus clavier et le tap.
          Hauteur réservée : sans elle, chaque survol décalerait ce qui suit. */}
      <p
        aria-live="polite"
        className={cn(
          "mt-5 flex min-h-12 items-start justify-center",
          "font-sans text-caption text-pretty text-(--surface-fg-muted)",
        )}
      >
        {shown ? (
          <span>
            <span className="font-semibold text-(--surface-heading)">
              {shown.nom}
            </span>
            {" — "}
            {shown.note}
            {/*
              Le point n'est pas qu'un repère : il ouvre la page locale.
              Le lien est posé ICI plutôt que sur le point lui-même — une cible
              de 11 px qui navigue au clic piégerait autant qu'elle servirait,
              alors qu'un survol ou un tap révèle d'abord l'information, puis
              propose d'aller plus loin.
            */}
            {/*
              Pas d'auto-lien : sur une page ville, le repère mis en avant EST
              la page courante. Proposer « Voir la zone » renverrait sur
              elle-même — un lien mort du point de vue de l'utilisateur, et un
              auto-référencement inutile dans le maillage.
            */}
            {shown.slug && shown.code !== highlight ? (
              <>
                {" · "}
                <Link
                  href={locationPath(shown.slug)}
                  className="font-semibold text-(--surface-heading) underline underline-offset-4"
                >
                  Voir la zone
                  <span aria-hidden="true"> →</span>
                  <span className="sr-only"> de {shown.nom}</span>
                </Link>
              </>
            ) : null}
          </span>
        ) : (
          <span className="opacity-70">
            Touchez ou survolez une commune pour connaître sa distance depuis{" "}
            {area.city}.
          </span>
        )}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/*
 * Étiquette collée au point, pour les repères isolés.
 *
 * Les côtés « gauche » et « droite » basculent EN DESSOUS du point sous
 * 480 px. Mesuré : à 320 px, Le Havre à 19 % de la largeur et Beauvais à 82 %
 * poussaient tous deux leur étiquette hors du cadre. En dessous du point, elle
 * reste dans le cadre quelle que soit la largeur.
 */
const sidePlacement: Record<NonNullable<MapMarker["side"]>, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 pb-1",
  bottom: "top-full left-1/2 -translate-x-1/2 pt-1",
  left: "top-full left-1/2 -translate-x-1/2 pt-1 sm:top-1/2 sm:left-auto sm:right-full sm:translate-x-0 sm:-translate-y-1/2 sm:pt-0 sm:pr-2",
  right:
    "top-full left-1/2 -translate-x-1/2 pt-1 sm:top-1/2 sm:left-full sm:translate-x-0 sm:-translate-y-1/2 sm:pt-0 sm:pl-2",
};

/**
 * Alignement horizontal de l'étiquette au bout de son rappel.
 *
 * Un rappel majoritairement VERTICAL doit porter une étiquette **centrée** :
 * l'aligner à droite la décale d'une demi-largeur vers l'extérieur, ce qui
 * suffit à la sortir du cadre. Mesuré sur Mont-Saint-Aignan, dont le rappel
 * monte vers le nord — à 320 px, l'alignement à droite le rognait.
 *
 * Un rappel majoritairement horizontal, lui, doit s'aligner du côté opposé au
 * point, sinon l'étiquette recouvre son propre rappel.
 */
function labelAnchor({ dx, dy }: Leader): string {
  if (Math.abs(dx) < Math.abs(dy)) return "-50%";
  return dx < 0 ? "-100%" : "0";
}

/**
 * Seuil d'apparition d'un repère secondaire.
 *
 * Seuil unique à 768 px, et c'est un choix MESURÉ, pas prudentiel.
 *
 * Un seuil plus bas a été tenté pour densifier la bande 480-768 px, où la
 * carte paraît clairsemée. Résultat au banc de collisions : quatre chevauchements
 * à 480 px (dont Amiens hors cadre), trois à 500, et « Gisors x Vernon »
 * persistant jusqu'à 640 px. La couronne ne tient réellement qu'à partir de
 * ~700 px de largeur de carte.
 *
 * En **une seule expression** : `cn()` ne fusionne pas les classes Tailwind
 * concurrentes. Deux entrées « hidden » puis « hidden md:block » laisseraient
 * les deux en place, et c'est la seconde qui gagnerait.
 */
function secondaryVisibility(mark: MapMarker): string {
  return mark.secondary ? "hidden md:block" : "";
}

type CityMarkerProps = {
  mark: MapMarker;
  index: number;
  isActive: boolean;
  isHighlighted: boolean;
  onToggle: () => void;
  onPreview: (code: string | null) => void;
};

function CityMarker({
  mark,
  index,
  isActive,
  isHighlighted,
  onToggle,
  onPreview,
}: CityMarkerProps) {
  const leader = mark.leader;
  const length = leader ? Math.hypot(leader.dx, leader.dy) : 0;
  const angle = leader ? (Math.atan2(leader.dy, leader.dx) * 180) / Math.PI : 0;

  return (
    <div
      data-map-marker=""
      style={
        {
          left: `${toX(mark.x)}%`,
          top: `${toY(mark.y)}%`,
          "--map-marker-index": index,
        } as React.CSSProperties
      }
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2",
        secondaryVisibility(mark),
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={() => onPreview(mark.code)}
        onMouseLeave={() => onPreview(null)}
        onFocus={() => onPreview(mark.code)}
        onBlur={() => onPreview(null)}
        aria-pressed={isActive}
        className="group relative flex size-11 items-center justify-center rounded-full"
      >
        <span className="sr-only">
          {mark.nom} — {mark.note}
        </span>

        {/* Ligne de rappel, tracée du point vers l'étiquette déportée. */}
        {leader ? (
          <span
            aria-hidden="true"
            data-map-leader=""
            style={{
              width: `calc(${length}px * var(--map-leader, 1))`,
              transform: `rotate(${angle}deg)`,
            }}
            className={cn(
              "absolute left-1/2 top-1/2 h-px origin-left",
              isActive || mark.isCenter
                ? "bg-(--surface-fg-muted)/70"
                : "bg-(--surface-fg-muted)/45",
              "motion-safe:transition-colors motion-safe:duration-(--duration-micro)",
              "group-hover:bg-(--surface-fg-muted)/80",
              "group-focus-visible:bg-(--surface-fg-muted)/80",
            )}
          />
        ) : null}

        {/* Micro-pulsation sur Rouen : deux battements, puis plus rien. */}
        {mark.isCenter ? (
          <span
            aria-hidden="true"
            data-map-pulse=""
            className="absolute size-2.5 rounded-full bg-safety opacity-0"
          />
        ) : null}

        <span
          aria-hidden="true"
          className={cn(
            "relative block rounded-full",
            mark.isCenter
              ? "size-2.5 bg-safety ring-[3px] ring-(--surface-bg)"
              : isHighlighted
                ? // Commune de la page : même accent que Rouen, en plus large.
                  "size-3 bg-safety ring-[3px] ring-(--surface-bg)"
                : "size-[0.4375rem] bg-(--color-forest) ring-2 ring-(--surface-bg)",
            "motion-safe:transition-transform",
            "motion-safe:duration-(--duration-micro) motion-safe:ease-cime",
            "group-hover:scale-150 group-focus-visible:scale-150",
            isActive && "scale-150",
          )}
        />

        {/* Étiquette : à l'extrémité du rappel, ou collée au point. */}
        <span
          aria-hidden="true"
          style={
            leader
              ? {
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(${leader.dx}px * var(--map-leader, 1)), calc(${leader.dy}px * var(--map-leader, 1))) translate(${labelAnchor(leader)}, -50%)`,
                }
              : undefined
          }
          className={cn(
            "absolute whitespace-nowrap font-sans text-caption",
            !leader && mark.side ? sidePlacement[mark.side] : "",
            mark.isCenter || isHighlighted
              ? "font-semibold text-(--surface-heading)"
              : "text-(--surface-fg)",
            /*
              Étiquette différée : le point reste visible et cliquable, le nom
              n'apparaît qu'au survol, au focus ou au tap. C'est ce qui permet
              d'avoir plus de points que de place pour les nommer, sans jamais
              produire de collision. En UNE expression : cn() ne fusionne pas
              les classes concurrentes.
            */
            mark.labelOnInteraction && !isActive && !isHighlighted
              ? "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:transition-opacity motion-safe:duration-(--duration-micro)"
              : "opacity-100",
          )}
        >
          {mark.nom}
        </span>
      </button>
    </div>
  );
}
