import type { Metadata } from "next";
import type { ReactNode } from "react";

import { NavCta } from "@/components/layout/nav-cta";
import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { Wordmark } from "@/components/layout/wordmark";
import {
  ArrowLink,
  Body,
  Button,
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
        <SectionIndex value={index} total={12} />
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
  return (
    <Eyebrow className="mb-3 opacity-80">{children}</Eyebrow>
  );
}

/* -------------------------------------------------------------------------- */
/* Donnees de demonstration                                                    */
/* -------------------------------------------------------------------------- */

const palette = [
  { name: "Vert foret profond", hex: "#14251E", token: "forest", swatch: "bg-forest" },
  { name: "Ivoire naturel", hex: "#F3F0E8", token: "ivory", swatch: "bg-ivory" },
  { name: "Charbon", hex: "#171918", token: "charcoal", swatch: "bg-charcoal" },
  { name: "Vert mousse", hex: "#516B54", token: "moss", swatch: "bg-moss" },
  { name: "Pierre", hex: "#CBC8BD", token: "stone", swatch: "bg-stone" },
  { name: "Jaune securite", hex: "#D8A62A", token: "safety", swatch: "bg-safety" },
];

const contrasts = [
  { pair: "charbon sur ivoire", ratio: "15,51", verdict: "AAA — texte courant" },
  { pair: "foret sur ivoire", ratio: "14,04", verdict: "AAA — titres" },
  { pair: "ivoire sur foret", ratio: "14,04", verdict: "AAA — texte inverse" },
  { pair: "pierre sur foret", ratio: "9,55", verdict: "AAA — secondaire sombre" },
  { pair: "charbon sur jaune", ratio: "7,91", verdict: "AAA — libelle des CTA" },
  { pair: "jaune sur foret", ratio: "7,16", verdict: "AAA — focus sur sombre" },
  { pair: "mousse sur ivoire", ratio: "5,15", verdict: "AA — secondaire clair" },
  { pair: "mousse sur foret", ratio: "2,73", verdict: "Echec — decor seul" },
  { pair: "jaune sur ivoire", ratio: "1,96", verdict: "Echec — jamais de texte" },
];

const typeScale = [
  { token: "text-display", usage: "Titre d'ecran", size: "40 → 76 px", font: "Fraunces" },
  { token: "text-title", usage: "Titre de section", size: "30 → 46 px", font: "Fraunces" },
  { token: "text-subtitle", usage: "Sous-titre", size: "22 → 26 px", font: "Fraunces" },
  { token: "text-lead", usage: "Chapo", size: "17 → 19 px", font: "Manrope" },
  { token: "text-body", usage: "Texte courant", size: "16 → 17 px", font: "Manrope" },
  { token: "text-caption", usage: "Legende", size: "13 → 14 px", font: "Manrope" },
  { token: "text-eyebrow", usage: "Surtitre", size: "12 px fixe", font: "Manrope" },
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
                  <Label>Fraunces — titres</Label>
                  <p className="font-display text-[2.5rem] leading-none">
                    Élagage&nbsp;Ag
                  </p>
                  <Small className="mt-4">
                    Serif variable. Reservee aux titres. Jamais en majuscules.
                  </Small>
                </Frame>
                <Frame>
                  <Label>Manrope — UI et texte</Label>
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
                pas fourni. Fraunces pour le nom, Manrope en surtitre pour
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

              <Label>CTA éditorial de navigation</Label>
              <div className="grid gap-6 md:grid-cols-2">
                <Frame surface="dark">
                  <Label>En-tête — survol / focus trace l’accent</Label>
                  <NavCta />
                </Frame>
                <Frame surface="dark">
                  <Label>Menu mobile — accent permanent</Label>
                  <NavCta layout="row" />
                </Frame>
              </div>
              <Small className="mt-4 max-w-reading">
                Le jaune sécurité n’est plus un aplat plein : il ne reste que le
                filet de 2 px et la flèche. L’en-tête étant toujours sur surface
                sombre, l’accent conserve un contraste de 7,16 — impossible sur
                un en-tête ivoire, où il tomberait à 1,96.
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
