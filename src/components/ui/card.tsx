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
 * COMPOSANT SERVEUR. `interactive` rend un lien reel, jamais un `div`
 * cliquable.
 */

export type CardTone = "plain" | "sand" | "forest" | "deep" | "accent";
export type CardPadding = "none" | "sm" | "md" | "lg";

const toneClasses: Record<CardTone, string> = {
  plain: "bg-(--surface-bg) border-(--surface-rule)",
  sand: "bg-sand border-forest/10",
  forest: "bg-forest border-ivory/10",
  deep: "bg-deep-forest border-ivory/10",
  accent: "bg-safety border-forest/15",
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
  className,
}: Omit<BaseProps, "children">) {
  return cn(
    shell,
    toneClasses[tone],
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
  className,
  children,
  ...rest
}: CardProps) {
  const Tag = as;
  const surface = toneSurface[tone];

  return (
    <Tag
      {...(surface ? { "data-surface": surface } : {})}
      className={classesFor({ tone, padding, interactive, className })}
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
  className,
  children,
  ...rest
}: CardLinkProps) {
  const surface = toneSurface[tone];
  const classes = classesFor({ tone, padding, interactive, className });
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
