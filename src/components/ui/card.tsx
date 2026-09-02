import NextLink from "next/link";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Carte — primitive unique, introduite en phase 15B.
 *
 * UNE PRIMITIVE, PAS SEPT COMPOSANTS
 * ----------------------------------
 * Le brief liste sept usages : KPI, service, visuel, confiance, info, sombre,
 * CTA, contact. Ils ne different que par trois choses — la **surface**, le
 * **rembourrage**, et le fait d'etre **cliquable ou non**. Ecrire sept
 * composants aurait produit sept fois la meme logique de bordure et d'etat,
 * avec sept occasions de diverger.
 *
 * La composition interne (titre, valeur, image, bouton) reste au choix de
 * l'appelant : c'est ce qui evite la grille de cartes identiques que
 * `CLAUDE.md` § 6 interdit.
 *
 * SURFACES
 * --------
 * | `tone` | Fond | Emploi |
 * | --- | --- | --- |
 * | `plain` | fond de la section | carte discrete, delimitee par son seul filet |
 * | `sand` | sable | KPI, info, confiance sur surface claire |
 * | `forest` | foret | carte sombre au milieu du clair |
 * | `deep` | foret profond | bloc CTA, moment d'ancrage |
 * | `accent` | jaune | **rare** — un seul par ecran |
 *
 * Une carte `forest`, `deep` ou `accent` **bascule ses jetons de surface** :
 * tout ce qu'elle contient s'adapte sans prop conditionnelle.
 *
 * FORMES ET ETATS
 * ---------------
 * Rayon 18 px, bordure fine, **aucune ombre** — la direction demande des
 * surfaces solides, pas du relief. L'interaction se lit a la bordure et a une
 * translation de 2 px : assez pour repondre, trop peu pour bouger la page.
 *
 * `bordered={false}` RETIRE LE FILET — phase 16B
 * ----------------------------------------------
 * Une carte dont le fond tranche deja sur la section n'a pas besoin d'etre
 * cernee en plus : le filet devient un trait de plus a lire, pas une limite
 * utile. C'est le cas des quatre cartes de prestations des pages villes, ou
 * quatre rectangles cernes sur une meme grille produisaient exactement le
 * motif que `CLAUDE.md` § 6 interdit.
 *
 * La bordure reste PRESENTE mais transparente : la boite garde ses dimensions,
 * donc aucun decalage de mise en page, et l'etat de survol continue de la
 * colorer. C'est une VARIANTE du composant, pas une `className` qui ecrase —
 * `cn()` ne fusionne pas les classes concurrentes (voir `src/lib/cn.ts`).
 *
 * COMPOSANT SERVEUR. `interactive` rend un lien reel, jamais un `div`
 * cliquable.
 */

export type CardTone = "plain" | "sand" | "forest" | "deep" | "accent";
export type CardPadding = "none" | "sm" | "md" | "lg";

const toneBackground: Record<CardTone, string> = {
  plain: "bg-(--surface-bg)",
  sand: "bg-sand",
  forest: "bg-forest",
  deep: "bg-deep-forest",
  accent: "bg-safety",
};

/**
 * Couleur du filet, SEPAREE du fond.
 *
 * Concatener `border-transparent` apres `border-(--surface-rule)` ne
 * garantirait rien : `cn()` ne fusionne pas les classes concurrentes et c'est
 * l'ordre de la feuille de style qui tranche, pas celui de l'attribut. On
 * choisit donc la classe, on ne l'ecrase pas.
 */
const toneBorder: Record<CardTone, string> = {
  plain: "border-(--surface-rule)",
  sand: "border-forest/10",
  forest: "border-ivory/10",
  deep: "border-ivory/10",
  accent: "border-forest/15",
};

/**
 * Les tons sombres et l'accent basculent les jetons semantiques : le contenu
 * d'une carte n'a pas a savoir sur quel fond il est pose.
 */
const toneSurface: Record<CardTone, string | undefined> = {
  plain: undefined,
  sand: "sand",
  forest: "dark",
  deep: "deep-forest",
  // Sur le jaune, les roles de texte sont ceux d'une surface claire.
  accent: "light",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

type BaseProps = {
  tone?: CardTone;
  padding?: CardPadding;
  /** Reaction au survol et au focus. Sans lien, reste purement visuel. */
  interactive?: boolean;
  /**
   * Filet peripherique. `false` le rend transparent — la boite garde sa
   * taille, le survol continue de la colorer. Voir le docblock.
   */
  bordered?: boolean;
  className?: string;
  children: ReactNode;
};

const shell =
  "relative block overflow-hidden rounded-card border no-underline " +
  "motion-safe:transition-[border-color,translate] " +
  "motion-safe:duration-(--duration-micro) motion-safe:ease-cime";

const interactiveShell =
  "group motion-safe:hover:-translate-y-0.5 hover:border-(--surface-fg-muted) " +
  "focus-visible:border-(--surface-fg-muted)";

function classesFor({
  tone = "plain",
  padding = "md",
  interactive = false,
  bordered = true,
  className,
}: Omit<BaseProps, "children">) {
  return cn(
    shell,
    toneBackground[tone],
    /* Sans filet, on garde la meme EPAISSEUR en transparent : la boite ne
       change pas de dimensions, et le survol continue de la colorer. */
    bordered ? toneBorder[tone] : "border-transparent",
    paddingClasses[padding],
    interactive && interactiveShell,
    className,
  );
}

type CardProps = BaseProps & {
  as?: ElementType;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

export function Card({
  as = "div",
  tone = "plain",
  padding,
  interactive,
  bordered,
  className,
  children,
  ...rest
}: CardProps) {
  const Tag = as;
  const surface = toneSurface[tone];

  return (
    <Tag
      {...(surface ? { "data-surface": surface } : {})}
      className={classesFor({
        tone,
        padding,
        interactive,
        bordered,
        className,
      })}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */

type CardLinkProps = BaseProps & { href: string } & Omit<
    HTMLAttributes<HTMLElement>,
    "className" | "children"
  >;

/**
 * Carte entierement cliquable.
 *
 * Un vrai `<a>`, jamais un `div` avec `onClick` : le nom accessible est le
 * contenu de la carte, la navigation clavier fonctionne, et le clic milieu
 * ouvre bien un nouvel onglet.
 *
 * Consequence a connaitre : **aucun autre lien ni bouton ne doit se trouver a
 * l'interieur** — un lien dans un lien est du HTML invalide, et l'audit de la
 * phase 15 le detecte.
 */
export function CardLink({
  href,
  tone = "plain",
  padding,
  interactive = true,
  bordered,
  className,
  children,
  ...rest
}: CardLinkProps) {
  const surface = toneSurface[tone];
  const classes = classesFor({
    tone,
    padding,
    interactive,
    bordered,
    className,
  });
  const props = surface ? { "data-surface": surface } : {};

  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <NextLink href={href} className={classes} {...props} {...rest}>
        {children}
      </NextLink>
    );
  }

  return (
    <a href={href} className={classes} {...props} {...rest}>
      {children}
    </a>
  );
}
