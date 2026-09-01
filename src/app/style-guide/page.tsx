import type { Metadata } from "next";
import type { ReactNode } from "react";

import { NavCta } from "@/components/layout/nav-cta";
import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { Wordmark } from "@/components/layout/wordmark";
import {
  ArrowLink,
  Body,
  Button,
  Capsule,
  CapsuleGroup,
  Card,
  ButtonLink,
  Container,
  Display,
  Eyebrow,
  Figure,
  Lead,
  Reveal,
  Rule,
  Section,
  SectionIndex,
  SectionPattern,
  Small,
  Subtitle,
  TextLink,
  Title,
} from "@/components/ui";
import { buildMetadata } from "@/lib/seo";

/**
 * Page de reference INTERNE du design system.
 *
 * Elle n'a aucune vocation commerciale ni SEO : pas d'entree dans la
 * navigation publique, pas de lien entrant, et exclusion explicite de
 * l'indexation. Elle sera egalement absente du sitemap (phase 14).
 */
export const metadata: Metadata = buildMetadata("style-guide");

/* -------------------------------------------------------------------------- */
/* Aides locales a cette page uniquement — ne pas reutiliser ailleurs.         */
/* -------------------------------------------------------------------------- */

function Block({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  const id = `bloc-${index}`;

  return (
    <section aria-labelledby={id} className="scroll-mt-24">
      <div className="flex items-baseline gap-4">
        <SectionIndex value={index} total={13} />
        <Rule width="full" className="translate-y-[-0.35em]" />
      </div>
      <Title as="h2" id={id} className="mt-4">
        {title}
      </Title>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Encadre de demonstration, neutre et sans style « carte » de production. */
function Frame({
  children,
  surface = "light",
  className,
}: {
  children: ReactNode;
  surface?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      data-surface={surface}
      className={`rounded-soft border border-(--surface-rule) bg-(--surface-bg) p-5 text-(--surface-fg) sm:p-6 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  /*
    PAS d'`opacity-80` ici. La mousse est deja un jeton mis en sourdine :
    l'attenuer encore la fait tomber a 3,53 sur ivoire, sous le seuil AA
    (releve par l'audit de la phase 15B). C'est exactement la regle inscrite
    a DESIGN_SYSTEM.md — ne pas empiler une opacite sur un jeton attenue.
  */
  return <Eyebrow className="mb-3">{children}</Eyebrow>;
}

/* -------------------------------------------------------------------------- */
/* Donnees de demonstration                                                    */
/* -------------------------------------------------------------------------- */

const palette = [
  { name: "Vert foret", hex: "#10271E", token: "forest", swatch: "bg-forest" },
  { name: "Foret profond", hex: "#081A14", token: "deep-forest", swatch: "bg-deep-forest" },
  { name: "Ivoire chaud", hex: "#F5F3ED", token: "ivory", swatch: "bg-ivory" },
  { name: "Sable doux", hex: "#E7E2D8", token: "sand", swatch: "bg-sand" },
  { name: "Charbon", hex: "#161A18", token: "charcoal", swatch: "bg-charcoal" },
  { name: "Vert mousse", hex: "#4F6B58", token: "moss", swatch: "bg-moss" },
  { name: "Pierre", hex: "#CBC8BD", token: "stone", swatch: "bg-stone" },
  { name: "Accent", hex: "#E4B23C", token: "safety", swatch: "bg-safety" },
];

const contrasts = [
  { pair: "ivoire sur foret profond", ratio: "16,20", verdict: "AAA — texte inverse" },
  { pair: "charbon sur ivoire", ratio: "15,84", verdict: "AAA — texte courant" },
  { pair: "foret sur ivoire", ratio: "14,22", verdict: "AAA — titres" },
  { pair: "ivoire sur foret", ratio: "14,22", verdict: "AAA — texte inverse" },
  { pair: "sable sur foret", ratio: "12,22", verdict: "AAA" },
  { pair: "foret sur sable", ratio: "12,22", verdict: "AAA — titres sur sable" },
  { pair: "pierre sur foret", ratio: "9,42", verdict: "AAA — secondaire sombre" },
  { pair: "charbon sur accent", ratio: "8,98", verdict: "AAA" },
  { pair: "foret sur accent", ratio: "8,06", verdict: "AAA — libelle du CTA primaire" },
  { pair: "mousse sur ivoire", ratio: "5,29", verdict: "AA — secondaire clair" },
  { pair: "mousse sur sable", ratio: "4,55", verdict: "AA — juste au-dessus du seuil" },
  { pair: "mousse sur foret", ratio: "2,69", verdict: "Echec — decor seul" },
  { pair: "accent sur ivoire", ratio: "1,76", verdict: "Echec — jamais de texte" },
];

const typeScale = [
  { token: "text-display", usage: "Titre d'ecran", size: "40 → 72 px", font: "Sora" },
  { token: "text-title", usage: "Titre de section", size: "34 → 56 px", font: "Sora" },
  { token: "text-subtitle", usage: "Sous-titre", size: "22 → 27 px", font: "Sora" },
  { token: "text-lead", usage: "Chapo", size: "17 → 19 px", font: "Inter" },
  { token: "text-body", usage: "Texte courant", size: "16 → 18 px", font: "Inter" },
  { token: "text-caption", usage: "Legende", size: "13 → 14 px", font: "Inter" },
  { token: "text-eyebrow", usage: "Surtitre", size: "12 px fixe", font: "Inter" },
];

const chrome = [
  {
    element: "En-tête — variante overlay",
    behaviour: "Transparent sur la photographie, 112 px de haut au repos",
    where: "Page d’accueil",
  },
  {
    element: "En-tête — au défilement",
    behaviour: "Se compacte à 80 px, fond forêt à 95 %, filet inférieur",
    where: "Toutes les pages",
  },
  {
    element: "Sous-menu Prestations",
    behaviour: "Index 01–04, sous-libellés, ouverture au clic et au clavier",
    where: "≥ 1024 px",
  },
  {
    element: "Menu mobile",
    behaviour: "Plein écran, liens numérotés, apparition en cascade",
    where: "< 1024 px",
  },
  {
    element: "Barre d’action",
    behaviour: "Apparaît après le hero, marge de sécurité iOS",
    where: "< 1024 px",
  },
  {
    element: "Pied de page",
    behaviour: "Sans état, aucune coordonnée inventée",
    where: "Toutes les pages",
  },
];

const motionTiers = [
  {
    tier: "Micro",
    duration: "120–220 ms (180 par défaut)",
    usage: "Liens, boutons, navigation, filets qui se tracent",
    token: "--duration-micro",
  },
  {
    tier: "Reveal",
    duration: "400–650 ms (520 par défaut)",
    usage: "Apparition de contenu, menu mobile, compactage de l’en-tête",
    token: "--duration-reveal",
  },
  {
    tier: "Signature",
    duration: "700–1200 ms (900 par défaut)",
    usage: "Réservé au hero, à la carte de zone et au devis",
    token: "--duration-signature",
  },
];

const spacingScale = [
  { token: "--gutter", value: "20 / 32 / 48 px", usage: "Gouttiere laterale" },
  { token: "--section-space", value: "72 / 96 / 128 px", usage: "Rythme vertical" },
  { token: "--container-reading", value: "672 px", usage: "Colonne de lecture" },
  { token: "--container-content", value: "1240 px", usage: "Contenu de reference" },
  { token: "--container-wide", value: "1440 px", usage: "Bandeau large" },
];

/* -------------------------------------------------------------------------- */

export default function StyleGuidePage() {
  return (
    /* Ferré à gauche, contrairement au reste du site : cette page est une
       référence de développement, faite de tableaux et de spécimens que le
       centrage rendrait illisibles. */
    <main id={MAIN_CONTENT_ID} tabIndex={-1} className="text-left">
      {/* ---------------------------------------------------------------- */}
      <Section surface="dark" spacing="tight" aria-labelledby="sg-titre">
        <Container>
          <Eyebrow>Document interne — hors production</Eyebrow>
          <Display id="sg-titre" className="mt-4 max-w-[16ch]">
            Design system
          </Display>
          <Lead className="mt-6 max-w-reading">
            Reference visuelle des jetons et des primitives d’Arbres et Cimes.
            Cette page sert au developpement : elle n’est pas indexee, n’apparait
            dans aucune navigation et ne represente pas le site final.
          </Lead>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/" variant="outline">
              Retour a l’accueil
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section surface="light">
        <Container>
          <div className="flex flex-col gap-(--section-space)">
            {/* 01 — Palette -------------------------------------------- */}
            <Block index={1} title="Palette">
              <Body className="max-w-reading">
                Six couleurs, aucune autre. Les espaces de noms Tailwind par
                defaut sont reinitialises : <code>bg-white</code> ou{" "}
                <code>text-blue-500</code> n’existent pas dans ce projet.
              </Body>

              <ul className="mt-8 grid grid-cols-2 gap-x-(--gutter) gap-y-8 md:grid-cols-3 lg:grid-cols-6">
                {palette.map((color) => (
                  <li key={color.token}>
                    <div
                      className={`h-24 w-full rounded-edge border border-(--surface-rule) ${color.swatch}`}
                    />
                    <p className="mt-3 font-sans text-body font-semibold">
                      {color.name}
                    </p>
                    <p className="font-sans text-caption text-(--surface-fg-muted) tabular-nums">
                      {color.hex}
                    </p>
                    <p className="font-sans text-caption text-(--surface-fg-muted)">
                      <code>{color.token}</code>
                    </p>
                  </li>
                ))}
              </ul>

              <Label>Contrastes mesures (WCAG 2.1)</Label>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-(--surface-rule)">
                      <th className="py-3 pr-4 font-sans text-caption font-semibold uppercase tracking-wider">
                        Combinaison
                      </th>
                      <th className="py-3 pr-4 font-sans text-caption font-semibold uppercase tracking-wider">
                        Ratio
                      </th>
                      <th className="py-3 font-sans text-caption font-semibold uppercase tracking-wider">
                        Verdict
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contrasts.map((row) => (
                      <tr
                        key={row.pair}
                        className="border-b border-(--surface-rule)"
                      >
                        <td className="py-3 pr-4 font-sans text-body">
                          {row.pair}
                        </td>
                        <td className="py-3 pr-4 font-sans text-body tabular-nums">
                          {row.ratio}
                        </td>
                        <td className="py-3 font-sans text-caption text-(--surface-fg-muted)">
                          {row.verdict}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Block>

            {/* 02 — Typographies --------------------------------------- */}
            <Block index={2} title="Typographies">
              <div className="grid gap-8 md:grid-cols-2">
                <Frame>
                  <Label>Sora — titres</Label>
                  <p className="font-display text-[2.5rem] leading-none">
                    Élagage&nbsp;Ag
                  </p>
                  <Small className="mt-4">
                    Serif variable. Reservee aux titres. Jamais en majuscules.
                  </Small>
                </Frame>
                <Frame>
                  <Label>Inter — UI et texte</Label>
                  <p className="font-sans text-[2.5rem] leading-none font-semibold">
                    Élagage&nbsp;Ag
                  </p>
                  <Small className="mt-4">
                    Interface, texte courant, libelles, surtitres.
                  </Small>
                </Frame>
              </div>

              <Label>Echelle fluide — clamp() entre 390 px et 1440 px</Label>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-(--surface-rule)">
                      <th className="py-3 pr-4 font-sans text-caption font-semibold uppercase tracking-wider">
                        Jeton
                      </th>
                      <th className="py-3 pr-4 font-sans text-caption font-semibold uppercase tracking-wider">
                        Usage
                      </th>
                      <th className="py-3 pr-4 font-sans text-caption font-semibold uppercase tracking-wider">
                        Taille
                      </th>
                      <th className="py-3 font-sans text-caption font-semibold uppercase tracking-wider">
                        Fonte
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeScale.map((row) => (
                      <tr
                        key={row.token}
                        className="border-b border-(--surface-rule)"
                      >
                        <td className="py-3 pr-4 font-sans text-body">
                          <code>{row.token}</code>
                        </td>
                        <td className="py-3 pr-4 font-sans text-body">
                          {row.usage}
                        </td>
                        <td className="py-3 pr-4 font-sans text-body tabular-nums">
                          {row.size}
                        </td>
                        <td className="py-3 font-sans text-caption text-(--surface-fg-muted)">
                          {row.font}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Block>

            {/* 03 — Hierarchie ----------------------------------------- */}
            <Block index={3} title="Hierarchie et paragraphes">
              <Body className="max-w-reading">
                La taille visuelle et le niveau semantique sont independants :
                chaque primitive accepte <code>as</code>. Ci-dessous, les
                niveaux sont rendus en <code>h3</code>/<code>h4</code> pour ne
                pas casser la structure de titres de cette page.
              </Body>

              <Frame className="mt-8">
                <Display as="p">Élagueur-grimpeur a Rouen</Display>
                <Title as="p" className="mt-6">
                  Abattage difficile et dangereux
                </Title>
                <Subtitle as="p" className="mt-6">
                  Demontage par sections, en rétention
                </Subtitle>
                <Lead className="mt-6 max-w-reading">
                  Chapo : une seule phrase, placee juste sous un titre, qui
                  precise l’intention sans repeter le titre.
                </Lead>
                <Body className="mt-4 max-w-reading">
                  Texte courant. La longueur de ligne est bornee a la colonne de
                  lecture (672 px) pour rester entre 60 et 75 caracteres. Le
                  paragraphe utilise <code>text-wrap: pretty</code>, les titres{" "}
                  <code>text-wrap: balance</code>.
                </Body>
                <Small className="mt-4">
                  Mention secondaire : legende, precision, note de bas de bloc.
                </Small>
              </Frame>
            </Block>

            {/* 04 — Boutons -------------------------------------------- */}
            <Block index={4} title="Boutons">
              <Body className="max-w-reading">
                <strong>Button</strong> rend un <code>&lt;button&gt;</code>{" "}
                (action dans la page). <strong>ButtonLink</strong> rend un{" "}
                <code>&lt;a&gt;</code> (navigation, <code>tel:</code>). Les deux
                ne sont jamais interchangeables. Hauteur minimale 48 px.
              </Body>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Frame surface="light">
                  <Label>Surface claire</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary">Devis gratuit</Button>
                    <ButtonLink href="tel:+33000000000" variant="solid">
                      Appeler
                    </ButtonLink>
                    <Button variant="outline">Secondaire</Button>
                    <Button variant="outline" disabled>
                      Desactive
                    </Button>
                  </div>
                </Frame>

                <Frame surface="dark">
                  <Label>Surface sombre</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary">Devis gratuit</Button>
                    <ButtonLink href="tel:+33000000000" variant="solid">
                      Appeler
                    </ButtonLink>
                    <Button variant="outline">Secondaire</Button>
                    <Button variant="outline" disabled>
                      Desactive
                    </Button>
                  </div>
                </Frame>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Frame>
                  <Label>Tailles</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="md">Taille md — 48 px</Button>
                    <Button size="lg">Taille lg — 56 px</Button>
                  </div>
                </Frame>
                <Frame>
                  <Label>Pleine largeur (defaut mobile)</Label>
                  <div className="flex flex-col gap-3">
                    <Button variant="primary" block>
                      Demander un devis gratuit
                    </Button>
                    <ButtonLink href="tel:+33000000000" variant="solid" block>
                      Appeler maintenant
                    </ButtonLink>
                  </div>
                </Frame>
              </div>
            </Block>

            {/* 05 — Liens ---------------------------------------------- */}
            <Block index={5} title="Liens">
              <div className="grid gap-6 md:grid-cols-2">
                <Frame surface="light">
                  <Label>Surface claire</Label>
                  <Body>
                    Un lien dans le fil du texte reste{" "}
                    <TextLink href="/style-guide">souligne en permanence</TextLink>{" "}
                    : il n’est jamais identifie par la seule couleur ni revele au
                    survol.
                  </Body>
                  <div className="mt-5">
                    <ArrowLink href="/style-guide">Voir les prestations</ArrowLink>
                  </div>
                </Frame>
                <Frame surface="dark">
                  <Label>Surface sombre</Label>
                  <Body>
                    Les memes primitives lisent les variables de surface et{" "}
                    <TextLink href="/style-guide">s’inversent</TextLink> sans
                    prop conditionnelle.
                  </Body>
                  <div className="mt-5">
                    <ArrowLink href="/style-guide">Voir la zone d’intervention</ArrowLink>
                  </div>
                </Frame>
              </div>
              <Small className="mt-4 max-w-reading">
                Le chevron de <code>ArrowLink</code> est toujours visible ; seul
                son deplacement de 2 px depend du survol ou du focus, et il est
                neutralise sous <code>prefers-reduced-motion</code>.
              </Small>
            </Block>

            {/* 06 — Surtitres et index --------------------------------- */}
            <Block index={6} title="Surtitres et index de section">
              <div className="grid gap-6 md:grid-cols-2">
                <Frame>
                  <Eyebrow>Zone d’intervention</Eyebrow>
                  <Subtitle as="p" className="mt-3">
                    Rouen et sa metropole
                  </Subtitle>
                  <Small className="mt-3">
                    <code>Eyebrow</code> porte du texte reel, lu par les lecteurs
                    d’ecran.
                  </Small>
                </Frame>
                <Frame>
                  <div className="flex items-baseline gap-4">
                    <SectionIndex value={3} total={7} />
                    <Rule width="full" className="translate-y-[-0.35em]" />
                  </div>
                  <Subtitle as="p" className="mt-3">
                    Prestations
                  </Subtitle>
                  <Small className="mt-3">
                    <code>SectionIndex</code> est un ornement :{" "}
                    <code>aria-hidden</code>, jamais annonce.
                  </Small>
                </Frame>
              </div>
            </Block>

            {/* 07 — Surfaces ------------------------------------------- */}
            <Block index={7} title="Surfaces">
              <Body className="max-w-reading">
                Une surface bascule d’un coup le fond, le texte, le texte
                secondaire, les filets, la couleur de focus et les boutons. Le
                focus passe du foret (sur clair) au jaune securite (sur sombre)
                pour garantir au moins 3:1 contre le fond adjacent.
              </Body>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Frame surface="light">
                  <Label>data-surface=&quot;light&quot;</Label>
                  <Subtitle as="p">Ivoire naturel</Subtitle>
                  <Body className="mt-2">Texte principal — charbon.</Body>
                  <Small className="mt-1">Texte secondaire — mousse.</Small>
                  <Rule className="my-4" />
                  <Button variant="primary">Devis gratuit</Button>
                </Frame>
                <Frame surface="dark">
                  <Label>data-surface=&quot;dark&quot;</Label>
                  <Subtitle as="p">Vert foret profond</Subtitle>
                  <Body className="mt-2">Texte principal — ivoire.</Body>
                  <Small className="mt-1">Texte secondaire — pierre.</Small>
                  <Rule className="my-4" />
                  <Button variant="primary">Devis gratuit</Button>
                </Frame>
              </div>
            </Block>

            {/* 08 — Separateurs ---------------------------------------- */}
            <Block index={8} title="Separateurs">
              <Frame>
                <Label>full — separation de blocs</Label>
                <Rule width="full" />
                <div className="h-8" />
                <Label>short — marqueur editorial</Label>
                <Rule width="short" />
                <div className="h-8" />
                <Label>hair — a l’interieur d’une liste</Label>
                <Rule width="hair" />
              </Frame>
              <Small className="mt-4 max-w-reading">
                Les filets remplacent les cartes et les ombres portees : la
                structure editoriale se lit au trait, pas au rectangle.
              </Small>
            </Block>

            {/* 09 — Espacements ---------------------------------------- */}
            <Block index={9} title="Espacements et largeurs">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-(--surface-rule)">
                      <th className="py-3 pr-4 font-sans text-caption font-semibold uppercase tracking-wider">
                        Variable
                      </th>
                      <th className="py-3 pr-4 font-sans text-caption font-semibold uppercase tracking-wider">
                        Valeur
                      </th>
                      <th className="py-3 font-sans text-caption font-semibold uppercase tracking-wider">
                        Usage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {spacingScale.map((row) => (
                      <tr
                        key={row.token}
                        className="border-b border-(--surface-rule)"
                      >
                        <td className="py-3 pr-4 font-sans text-body">
                          <code>{row.token}</code>
                        </td>
                        <td className="py-3 pr-4 font-sans text-body tabular-nums">
                          {row.value}
                        </td>
                        <td className="py-3 font-sans text-caption text-(--surface-fg-muted)">
                          {row.usage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Label>Gouttiere active a cette largeur</Label>
              <div className="border border-(--surface-rule) bg-(--surface-inset)">
                <div className="border-x-2 border-safety px-(--gutter) py-6">
                  <Small className="text-(--surface-fg)">
                    Les bandes jaunes materialisent <code>--gutter</code> :
                    20 px, puis 32 px des 768 px, puis 48 px des 1024 px.
                  </Small>
                </div>
              </div>
            </Block>

            {/* 10 — Grille et responsive ------------------------------- */}
            <Block index={10} title="Grille et comportement responsive">
              <Body className="max-w-reading">
                Grille de 4 colonnes sur mobile, 8 des 768 px, 12 des 1024 px.
                Les blocs editoriaux s’appuient sur des empans <em>inegaux</em>{" "}
                (7/5, 8/4, 5/7), jamais sur une grille de cartes identiques.
              </Body>

              <Label>Point de rupture actif</Label>
              <div className="flex flex-wrap gap-2 font-sans text-caption">
                <span className="rounded-edge bg-safety px-3 py-1.5 text-charcoal sm:hidden">
                  base — moins de 480 px
                </span>
                <span className="hidden rounded-edge bg-safety px-3 py-1.5 text-charcoal sm:inline md:hidden">
                  sm — 480 px et plus
                </span>
                <span className="hidden rounded-edge bg-safety px-3 py-1.5 text-charcoal md:inline lg:hidden">
                  md — 768 px et plus
                </span>
                <span className="hidden rounded-edge bg-safety px-3 py-1.5 text-charcoal lg:inline xl:hidden">
                  lg — 1024 px et plus
                </span>
                <span className="hidden rounded-edge bg-safety px-3 py-1.5 text-charcoal xl:inline">
                  xl — 1440 px et plus
                </span>
              </div>

              <Label>Colonnes</Label>
              <div className="grid grid-cols-4 gap-(--gutter) md:grid-cols-8 lg:grid-cols-12">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-16 rounded-edge bg-(--surface-inset) ${
                      i >= 4 ? "hidden md:block" : ""
                    } ${i >= 8 ? "md:hidden lg:block" : ""}`}
                  />
                ))}
              </div>

              <Label>Empan asymetrique 7 / 5</Label>
              <div className="grid grid-cols-4 gap-(--gutter) md:grid-cols-8 lg:grid-cols-12">
                <div className="col-span-4 md:col-span-5 lg:col-span-7">
                  <Figure aspect="landscape">
                    <div className="flex size-full items-center justify-center">
                      <Small>Emplacement photo — phase 5</Small>
                    </div>
                  </Figure>
                </div>
                <div className="col-span-4 md:col-span-3 lg:col-span-5">
                  <Subtitle as="p">Chantier propre</Subtitle>
                  <Body className="mt-3">
                    Le cadre media verrouille le rapport de cadrage avant le
                    chargement de l’image : aucun decalage de mise en page.
                  </Body>
                </div>
              </div>

              <Label>Cadrages disponibles</Label>
              <div className="grid grid-cols-2 gap-(--gutter) lg:grid-cols-4">
                {(["portrait", "landscape", "wide", "square"] as const).map(
                  (aspect) => (
                    <Figure key={aspect} aspect={aspect} caption={aspect}>
                      <div className="flex size-full items-center justify-center">
                        <Small className="text-center">Photo reelle</Small>
                      </div>
                    </Figure>
                  ),
                )}
              </div>
            </Block>

            {/* 11 — Mouvement ------------------------------------------ */}
            <Block index={11} title="Mouvement">
              <Body className="max-w-reading">
                Une seule primitive d’animation : <code>Reveal</code>. Opacite
                plus montee de 6 px sur mobile, 12 px au-dela de 768 px. Aucun
                JavaScript, aucune dependance : l’effet repose sur{" "}
                <code>animation-timeline: view()</code>. Sur un navigateur qui ne
                le prend pas en charge, le contenu s’affiche simplement, sans
                clignotement.
              </Body>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {["Preuves", "Prestations", "Realisations"].map((item) => (
                  <Reveal key={item}>
                    <Frame>
                      <Eyebrow>Bloc revele</Eyebrow>
                      <Subtitle as="p" className="mt-2">
                        {item}
                      </Subtitle>
                    </Frame>
                  </Reveal>
                ))}
              </div>
              <Label>Trois niveaux de mouvement</Label>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-(--surface-rule)">
                      <th className="py-3 pr-4 font-sans text-caption font-semibold uppercase tracking-wider">
                        Niveau
                      </th>
                      <th className="py-3 pr-4 font-sans text-caption font-semibold uppercase tracking-wider">
                        Durée
                      </th>
                      <th className="py-3 font-sans text-caption font-semibold uppercase tracking-wider">
                        Usage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {motionTiers.map((row) => (
                      <tr
                        key={row.tier}
                        className="border-b border-(--surface-rule)"
                      >
                        <td className="py-3 pr-4 font-sans text-body">
                          <strong>{row.tier}</strong>
                          <br />
                          <code className="text-caption text-(--surface-fg-muted)">
                            {row.token}
                          </code>
                        </td>
                        <td className="py-3 pr-4 font-sans text-body">
                          {row.duration}
                        </td>
                        <td className="py-3 font-sans text-caption text-(--surface-fg-muted)">
                          {row.usage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Small className="mt-6 max-w-reading">
                Vocabulaire retenu : filets qui se tracent, masques, translations
                contrôlées, progression directionnelle. Exclus : rebond, zoom,
                flou décoratif, rotation. Activer « réduire les animations » dans
                le système d’exploitation doit supprimer entièrement l’effet.
              </Small>
            </Block>

            {/* 12 — Chassis ------------------------------------------- */}
            <Block index={12} title="Châssis du site">
              <Body className="max-w-reading">
                Le logotype est <strong>typographique et temporaire</strong> :
                aucun symbole d’arbre n’est inventé tant qu’un logo réel n’est
                pas fourni. Sora pour le nom, Inter en surtitre pour
                l’activité.
              </Body>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Frame surface="dark">
                  <Label>Taille en-tête (md)</Label>
                  <Wordmark />
                </Frame>
                <Frame surface="dark">
                  <Label>Taille pied de page (lg)</Label>
                  <Wordmark size="lg" />
                </Frame>
              </div>

              <Label>CTA de navigation</Label>
              <div className="grid gap-6 md:grid-cols-2">
                <Frame surface="dark">
                  <Label>En-tête — en ligne</Label>
                  <NavCta source="style-guide" />
                </Frame>
                <Frame surface="dark">
                  <Label>Menu mobile et pied de page — empilé</Label>
                  <NavCta layout="stack" size="lg" source="style-guide" />
                </Frame>
              </div>
              <Small className="mt-4 max-w-reading">
                Depuis la phase 15B.2 le CTA devis est un <strong>bouton
                primaire plein</strong>, plus un lien souligné : dans une barre
                de navigation, un lien souligné se lit comme une entrée de menu
                de plus. C’est la seule occurrence pleine de jaune de l’en-tête.
                Le bouton « Appeler » n’apparaît que si{" "}
                <code>contact.phoneConfirmed</code> est vrai — à ce jour le
                numéro n’est pas confirmé, il est donc absent partout.
              </Small>

              <Label>Éléments de châssis</Label>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-(--surface-rule)">
                      <th className="py-3 pr-4 font-sans text-caption font-semibold uppercase tracking-wider">
                        Élément
                      </th>
                      <th className="py-3 pr-4 font-sans text-caption font-semibold uppercase tracking-wider">
                        Comportement
                      </th>
                      <th className="py-3 font-sans text-caption font-semibold uppercase tracking-wider">
                        Où le vérifier
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chrome.map((row) => (
                      <tr
                        key={row.element}
                        className="border-b border-(--surface-rule)"
                      >
                        <td className="py-3 pr-4 font-sans text-body">
                          {row.element}
                        </td>
                        <td className="py-3 pr-4 font-sans text-body">
                          {row.behaviour}
                        </td>
                        <td className="py-3 font-sans text-caption text-(--surface-fg-muted)">
                          {row.where}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Small className="mt-6 max-w-reading">
                L’en-tête, le menu mobile et la barre d’action ne sont pas
                reproduits ici : ils sont collants ou fixes, porteurs d’état et
                d’identifiants uniques. Les dupliquer dans cette page créerait
                de faux repères de navigation et un rendu trompeur. Ils se
                valident sur les pages réelles, à ~390 px.
              </Small>
            </Block>
            {/* 13 — Direction visuelle phase 15B ------------------------ */}
            <Block index={13} title="Direction visuelle — phase 15B">
              <Body className="max-w-reading">
                Nouvelles fondations : <strong>Sora</strong> pour les titres,{" "}
                <strong>Inter</strong> pour le texte et l’interface, quatre
                surfaces, des capsules, une primitive de carte et deux fonds de
                section. Les pages ne sont pas encore refaites — c’est ce bloc
                qui fait référence.
              </Body>

              {/* ---------------------------------------- Surfaces --- */}
              <Label>Quatre surfaces</Label>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    ["light", "Ivoire chaud", "Surface par défaut"],
                    ["sand", "Sable doux", "Second fond clair"],
                    ["dark", "Forêt", "Surface sombre courante"],
                    ["deep-forest", "Forêt profond", "Ancrage — à garder rare"],
                  ] as const
                ).map(([surface, nom, role]) => (
                  <li
                    key={surface}
                    data-surface={surface}
                    className="rounded-card border border-(--surface-rule) bg-(--surface-bg) p-5 text-(--surface-fg)"
                  >
                    <p className="font-display text-subtitle text-(--surface-heading)">
                      {nom}
                    </p>
                    <p className="mt-1.5 font-sans text-caption text-(--surface-fg-muted)">
                      {role}
                    </p>
                    <code className="mt-3 block font-sans text-caption">
                      data-surface=&quot;{surface}&quot;
                    </code>
                  </li>
                ))}
              </ul>

              {/* ---------------------------------------- Capsules --- */}
              <div className="mt-12">
                <Label>Capsules</Label>
                <Frame>
                  <CapsuleGroup>
                    <Capsule>Devis gratuit</Capsule>
                    <Capsule dot>Professionnel diplômé</Capsule>
                    <Capsule variant="accent">Jusqu’à 100 km</Capsule>
                  </CapsuleGroup>
                </Frame>

                <Frame surface="dark" className="mt-3">
                  <CapsuleGroup>
                    <Capsule variant="dark">Rouen &amp; Métropole</Capsule>
                    <Capsule variant="dark" dot>
                      Sécurité
                    </Capsule>
                    <Capsule variant="accent">Devis gratuit</Capsule>
                  </CapsuleGroup>
                </Frame>

                <Small className="mt-3 block max-w-reading">
                  32 px de haut, rayon pilule. <code>aria-hidden</code> par
                  défaut : une capsule qui redit le titre voisin ne doit pas
                  être annoncée deux fois. Passer{" "}
                  <code>decorative={"{false}"}</code> quand elle porte une
                  information unique.
                </Small>
              </div>

              {/* ------------------------------------------ Boutons --- */}
              <div className="mt-12">
                <Label>Boutons</Label>
                <Frame>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="primary">Demander un devis</Button>
                    <Button variant="secondary">Voir le service</Button>
                    <Button variant="ghost">En savoir plus</Button>
                    <Button variant="primary" loading>
                      Envoi
                    </Button>
                    <Button variant="primary" disabled>
                      Indisponible
                    </Button>
                  </div>
                </Frame>

                <Frame surface="dark" className="mt-3">
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="primary">Demander un devis</Button>
                    <Button variant="light">Appeler</Button>
                    <Button variant="ghost">En savoir plus</Button>
                  </div>
                </Frame>

                <Small className="mt-3 block max-w-reading">
                  Hauteur 48 px (<code>md</code>) et 52 px (<code>lg</code>),
                  rayon 12 px. <strong>Un seul bouton primaire par écran
                  visible</strong> — la règle de parcimonie du jaune survit à la
                  refonte.
                </Small>
              </div>

              {/* -------------------------------------------- Cartes --- */}
              <div className="mt-12">
                <Label>Cartes</Label>
                <ul className="grid gap-(--card-gap) sm:grid-cols-2 lg:grid-cols-3">
                  <li>
                    <Card tone="sand">
                      <p className="font-display text-display text-(--surface-heading)">
                        10
                      </p>
                      <p className="mt-1 font-sans text-caption text-(--surface-fg-muted)">
                        ans d’expérience — carte KPI
                      </p>
                    </Card>
                  </li>

                  <li>
                    <Card tone="plain" interactive>
                      <Capsule>Service</Capsule>
                      <p className="mt-3 font-display text-subtitle text-(--surface-heading)">
                        Élagage
                      </p>
                      <p className="mt-2 font-sans text-caption text-(--surface-fg-muted)">
                        Carte discrète, réagit au survol et au focus.
                      </p>
                    </Card>
                  </li>

                  <li>
                    <Card tone="forest">
                      <p className="font-display text-subtitle text-(--surface-heading)">
                        Carte sombre
                      </p>
                      <p className="mt-2 font-sans text-caption text-(--surface-fg-muted)">
                        Bascule ses jetons : le contenu n’a pas à savoir sur
                        quel fond il est posé.
                      </p>
                    </Card>
                  </li>

                  <li className="sm:col-span-2">
                    <Card tone="deep" padding="lg" className="text-center">
                      <p className="font-display text-title text-(--surface-heading)">
                        Carte CTA
                      </p>
                      <p className="mx-auto mt-3 max-w-[42ch] font-sans text-body text-(--surface-fg-muted)">
                        Ton <code>deep</code> — réservé aux moments d’ancrage.
                      </p>
                      <div className="mt-6 flex justify-center">
                        <Button variant="primary">Demander un devis</Button>
                      </div>
                    </Card>
                  </li>

                  <li>
                    <Card tone="accent">
                      <p className="font-display text-subtitle text-(--surface-heading)">
                        Accent
                      </p>
                      <p className="mt-2 font-sans text-caption">
                        Un seul par écran. Texte forêt, 8,06.
                      </p>
                    </Card>
                  </li>
                </ul>

                <Small className="mt-4 block max-w-reading">
                  Rayon 18 px, bordure fine, <strong>aucune ombre</strong>.
                  L’interaction se lit à la bordure et à une translation de
                  2 px. <code>CardLink</code> rend un lien réel — donc aucun
                  autre lien à l’intérieur.
                </Small>
              </div>

              {/* ------------------------------------------- Fonds --- */}
              <div className="mt-12">
                <Label>Fonds de section</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div
                    data-surface="deep-forest"
                    className="relative isolate overflow-hidden rounded-card bg-(--surface-bg) p-8 text-(--surface-fg)"
                  >
                    <SectionPattern pattern="rings" opacity={0.1} />
                    <p className="relative font-display text-subtitle text-(--surface-heading)">
                      Cernes de bois
                    </p>
                    <p className="relative mt-2 font-sans text-caption text-(--surface-fg-muted)">
                      <code>rings</code> — arcs décentrés, surfaces d’ancrage.
                    </p>
                  </div>

                  <div
                    data-surface="dark"
                    className="relative isolate overflow-hidden rounded-card bg-(--surface-bg) p-8 text-(--surface-fg)"
                  >
                    <SectionPattern pattern="contour" opacity={0.12} />
                    <p className="relative font-display text-subtitle text-(--surface-heading)">
                      Courbes de niveau
                    </p>
                    <p className="relative mt-2 font-sans text-caption text-(--surface-fg-muted)">
                      <code>contour</code> — bandeaux, cartes larges.
                    </p>
                  </div>
                </div>

                <Small className="mt-3 block max-w-reading">
                  Deux motifs, pas un par page. SVG inline,{" "}
                  <code>aria-hidden</code>, <code>currentColor</code>, aucune
                  requête. Opacité par défaut 0,06 : au-delà de 0,1 le motif
                  cesse d’être une texture.
                </Small>
              </div>

              {/* -------------------------------------- Proportions --- */}
              <div className="mt-12">
                <Label>Rythmes verticaux</Label>
                <ul className="grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      ["compact", "48 / 64 / 80", "Bandeau, rappel"],
                      ["standard", "72 / 96 / 128", "La majorité"],
                      ["signature", "96 / 136 / 176", "Moments qui respirent"],
                    ] as const
                  ).map(([nom, valeurs, role]) => (
                    <li key={nom}>
                      <Card tone="sand" padding="sm">
                        <code className="font-sans text-caption font-semibold">
                          {nom}
                        </code>
                        <p className="mt-2 font-sans text-caption tabular-nums text-(--surface-fg-muted)">
                          {valeurs} px
                        </p>
                        <p className="mt-1 font-sans text-caption text-(--surface-fg-muted)">
                          {role}
                        </p>
                      </Card>
                    </li>
                  ))}
                </ul>

                <Small className="mt-3 block max-w-reading">
                  Mobile / 768 / 1024. Colonne de lecture ramenée à{" "}
                  <code>40rem</code> (55-70 caractères à 16-18 px) ; largeur de
                  contenu portée à <code>82.5rem</code> pour occuper réellement
                  un écran de 1440.
                </Small>
              </div>
            </Block>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section surface="dark" spacing="tight" plain>
        <Container>
          <Small className="text-(--surface-fg-muted)">
            Page interne — <code>noindex, nofollow</code>. Aucun lien entrant
            depuis la navigation publique, aucune entree au sitemap.
          </Small>
        </Container>
      </Section>
    </main>
  );
}
