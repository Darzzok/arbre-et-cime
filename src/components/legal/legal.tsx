import type { ReactNode } from "react";

import {
  ArrowLink,
  Body,
  Capsule,
  Container,
  Display,
  Lead,
  Reveal,
  Section,
  SectionPattern,
  Small,
  Title,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { getRoute, type RouteId } from "@/lib/routes";

/**
 * Briques communes aux deux pages légales — phase 16B.
 *
 * POURQUOI UN MODULE PARTAGÉ
 * --------------------------
 * `/mentions-legales` et `/politique-confidentialite` se lisent comme une
 * paire : même ouverture, même colonne, même pied. Dupliquer ce squelette
 * garantirait qu'il diverge à la première correction. Ce fichier ne contient
 * donc **aucun texte juridique** — seulement la forme. Le contenu vit dans
 * chaque page, où on peut le relire d'un bloc.
 *
 * SOBRIÉTÉ ASSUMÉE
 * ----------------
 * Pas de photographie, pas de grande carte, pas d'appel à l'action. Une page
 * légale n'a pas à convertir : elle doit se lire vite et se vérifier. La seule
 * concession au design du site est le hero, qui rattache visuellement ces deux
 * pages au reste.
 *
 * LA COLONNE RESTE `max-w-reading`
 * --------------------------------
 * 40 rem, soit 55 à 70 caractères. Le site est centré (décision client
 * `VERROUILLÉE`, `DESIGN_SYSTEM.md` § 4) et cette contrainte pèse justement
 * sur les paragraphes longs. La parade n'est pas de désobéir : c'est d'écrire
 * **court**. Aucun bloc de ces deux pages ne dépasse quatre lignes.
 */

/**
 * Date d'édition des deux pages.
 *
 * CONSTANTE, ET NON `new Date()` : une date calculée au rendu changerait à
 * chaque build et prétendrait une mise à jour qui n'a pas eu lieu. Elle se
 * modifie à la main, quand le texte change réellement.
 */
export const LEGAL_UPDATED = {
  iso: "2026-09-01",
  label: "1ᵉʳ septembre 2026",
} as const;

/* ------------------------------------------------------------------ Hero -- */

type LegalHeroProps = {
  /** `id` du `h1`, repris par l'`aria-labelledby` de la section. */
  id: string;
  title: string;
  lead: string;
};

/**
 * Ouverture compacte, sur la surface d'ancrage.
 *
 * `spacing="compact"` et non `standard` : un hero pleine hauteur devant un
 * texte administratif serait une emphase déplacée.
 */
export function LegalHero({ id, title, lead }: LegalHeroProps) {
  return (
    <Section surface="deep-forest" spacing="compact" aria-labelledby={id}>
      <SectionPattern pattern="contour" opacity={0.05} />

      <Container className="relative">
        <Reveal className="mx-auto max-w-reading">
          <Capsule variant="dark">Informations légales</Capsule>

          {/* Volontairement plus petit que les autres `h1` du site : ces pages
              sont obligatoires, pas mises en avant. */}
          <Display
            id={id}
            as="h1"
            className="mt-5 text-title lg:text-[2.75rem] lg:leading-[1.08]"
          >
            {title}
          </Display>

          <Lead className="mt-5 text-(--surface-fg-muted)">{lead}</Lead>
        </Reveal>
      </Container>
    </Section>
  );
}

/* --------------------------------------------------------------- Article -- */

type LegalArticleProps = {
  /** `id` du `h2`. Sert d'ancre et nomme la section pour les technologies
      d'assistance. */
  id: string;
  title: string;
  children: ReactNode;
};

/**
 * Un article de la page : un `h2`, puis son texte.
 *
 * Rendu en `<section aria-labelledby>` — une page légale est une suite de
 * rubriques numérotables, et un lecteur d'écran doit pouvoir sauter de l'une à
 * l'autre. Le filet supérieur remplace la carte : la séparation se lit au
 * trait (charte verrouillée), pas au rectangle.
 */
export function LegalArticle({ id, title, children }: LegalArticleProps) {
  return (
    <Reveal
      as="section"
      aria-labelledby={id}
      className={cn(
        "mx-auto max-w-reading",
        "border-t border-(--surface-rule) pt-9 first:border-t-0 first:pt-0",
      )}
    >
      <Title as="h2" id={id} className="text-subtitle">
        {title}
      </Title>

      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </Reveal>
  );
}

/**
 * Empilement d'articles. Rendu en `<div>` (`plain`) : la section n'a pas de
 * titre propre, ce sont les articles qu'elle contient qui en portent un.
 */
export function LegalArticles({
  surface = "light",
  children,
}: {
  surface?: "light" | "sand";
  children: ReactNode;
}) {
  return (
    <Section surface={surface} plain>
      <Container>
        <div className="flex flex-col gap-9">{children}</div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------- Liste de données -- */

export type LegalDatum = {
  label: string;
  /** `null` = donnée non confirmée : l'entrée n'est alors pas rendue. */
  value: string | null;
};

/**
 * Fiche d'identité, en `<dl>`.
 *
 * UNE ENTRÉE SANS VALEUR N'EST PAS RENDUE. Pas de « — », pas de
 * « à compléter » ligne à ligne : une fiche trouée se lit comme une fiche
 * bâclée. Ce qui manque est annoncé une seule fois, en clair, par le bloc
 * d'avertissement de la page — c'est plus honnête et plus lisible.
 *
 * Empilé et centré : le site est centré, et un `dt`/`dd` sur deux colonnes
 * casserait à 320 px sur les libellés longs.
 */
export function LegalData({ items }: { items: readonly LegalDatum[] }) {
  const rendus = items.filter(
    (item): item is LegalDatum & { value: string } => item.value !== null,
  );

  return (
    <dl className="mx-auto grid gap-5 sm:grid-cols-2">
      {rendus.map((item) => (
        <div key={item.label}>
          <dt className="font-sans text-caption text-(--surface-fg-muted)">
            {item.label}
          </dt>
          {/* `break-words` : l'e-mail ne doit pas déborder à 320 px. */}
          <dd className="mt-1 font-sans text-body font-semibold break-words text-(--surface-heading)">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ----------------------------------------------------------------- Liste -- */

/**
 * Énumération.
 *
 * Le bloc est centré, ses éléments sont ferrés à gauche : c'est l'idiome déjà
 * employé par `/404` et par le récapitulatif du devis. Une puce centrée
 * obligerait l'œil à rechercher le début de chaque ligne, ce que la réserve
 * technique de `DESIGN_SYSTEM.md` § 4 signale déjà comme le point faible du
 * centrage.
 */
export function LegalList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mx-auto flex flex-col gap-2.5 text-left">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-2.5 size-1.5 shrink-0 rounded-pill bg-(--color-safety)"
          />
          <Body as="span" className="text-(--surface-fg-muted)">
            {item}
          </Body>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ Pied -- */

/**
 * Date d'édition et renvoi vers l'autre page légale.
 *
 * Les deux pages se répondent : on arrive sur l'une, on doit pouvoir passer à
 * l'autre sans revenir au pied de page.
 *
 * La surface est un paramètre : ce bloc suit la dernière section de la page et
 * ne peut pas partager sa couleur. Deux surfaces identiques d'affilée est le
 * défaut que la phase 15B a passé son temps à corriger.
 */
export function LegalFooter({
  other,
  surface = "light",
}: {
  other: RouteId;
  surface?: "light" | "sand";
}) {
  const route = getRoute(other);

  return (
    <Section surface={surface} spacing="compact">
      <Container>
        <Reveal className="mx-auto max-w-reading">
          <Small>
            Dernière mise à jour :{" "}
            <time dateTime={LEGAL_UPDATED.iso}>{LEGAL_UPDATED.label}</time>
          </Small>

          <div className="mt-5 flex justify-center">
            <ArrowLink href={route.path}>{route.navLabel}</ArrowLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
