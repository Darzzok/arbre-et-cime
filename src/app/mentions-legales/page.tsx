import type { Metadata } from "next";

import {
  LegalArticle,
  LegalArticles,
  LegalData,
  LegalFooter,
  LegalHero,
  LegalList,
  type LegalDatum,
} from "@/components/legal/legal";
import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Body,
  Capsule,
  Card,
  Container,
  Reveal,
  Section,
  Small,
  Subtitle,
} from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { area, contact, legal, site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata("mentions-legales");

/**
 * Page `/mentions-legales` — écrite en phase 16B. Composant SERVEUR.
 *
 * ELLE ÉTAIT UN PLACEHOLDER
 * -------------------------
 * Jusqu'ici, la page annonçait ce qu'elle publierait « en phase 18 ». Une page
 * de mentions légales qui ne mentionne rien ne remplit ni son obligation, ni
 * sa fonction de vérification.
 *
 * CE QUI EST AFFICHÉ EST CONFIRMÉ. CE QUI MANQUE EST DIT.
 * ------------------------------------------------------
 * Toutes les données viennent de `src/lib/site.ts`, source unique. Aucune
 * n'est recopiée en dur ici. Et surtout : **rien n'est inventé**. La forme
 * juridique, le numéro d'identification, l'adresse professionnelle et
 * l'assurance ne sont pas connus à ce jour — ils ne figurent donc pas dans la
 * fiche, et leur absence est signalée explicitement au visiteur plutôt que
 * maquillée.
 *
 * Un SIRET plausible mais faux serait la pire faute possible sur cette page :
 * invérifiable pour le client, immédiatement vérifiable par n'importe qui
 * d'autre.
 *
 * L'HÉBERGEUR N'EST PAS NOMMÉ, ET C'EST VOULU
 * -------------------------------------------
 * Le site est en préproduction. L'hébergement définitif est prévu chez
 * Hostinger (`QUOTE_FLOW.md` § envoi) mais n'est pas en place. Nommer
 * l'hébergeur de préproduction reviendrait à publier une information fausse le
 * jour de la bascule ; inventer une adresse Hostinger serait pire. La rubrique
 * annonce donc l'échéance, et `LEGAL_CHECKLIST.md` porte le blocage.
 *
 * LES ATTRIBUTIONS CARTOGRAPHIQUES SONT ENFIN PORTÉES
 * ---------------------------------------------------
 * `MAP_DATA_SOURCES.md` § 2 signalait depuis la phase 14 : « À faire avant la
 * mise en production : reporter ces attributions dans les mentions légales du
 * site. Ce n'est pas fait à ce jour. » La licence ODbL l'exige. C'est fait.
 *
 * AUCUN LIEN EXTERNE
 * ------------------
 * Vérifié : le site ne contient aucun `href` vers un domaine tiers. La page ne
 * porte donc pas de rubrique « liens externes » — elle ne décrirait rien.
 */

/**
 * Fiche de l'éditeur.
 *
 * Le téléphone suit `contact.phoneConfirmed`, comme partout ailleurs sur le
 * site : une valeur `null` retire l'entrée, elle n'affiche pas un trou.
 */
const EDITEUR: readonly LegalDatum[] = [
  { label: "Nom commercial", value: site.name },
  { label: "Activité", value: site.trade },
  { label: "Forme juridique", value: legal.form },
  /* Retenu tant que la clé de contrôle du numéro n'est pas vérifiée — voir
     `legal.siretConfirmed` dans `site.ts`. */
  { label: "SIRET", value: legal.siretConfirmed ? legal.siret : null },
  { label: "Responsable de la publication", value: site.manager },
  /* La commune, telle que confirmée. Ni voie ni code postal ne sont ajoutés :
     le client ne les a pas communiqués. */
  { label: "Commune du siège", value: legal.siege },
  { label: "E-mail", value: contact.emailConfirmed ? contact.email : null },
  {
    label: "Téléphone",
    value: contact.phoneConfirmed ? contact.phoneDisplay : null,
  },
  {
    label: "Zone d’intervention",
    value: `${area.city} et la ${area.metro}`,
  },
];

/**
 * Ce qui n'est pas encore publiable. Énuméré, pas contourné.
 *
 * LA LISTE S'EST VIDÉE AU FUR ET À MESURE, ET C'EST VOULU
 * -------------------------------------------------------
 * Elle est construite à partir des drapeaux de `site.ts` : une donnée
 * confirmée apparaît dans la fiche et disparaît d'ici, sans double saisie et
 * sans risque d'oubli. En phase 16B elle a perdu la forme juridique, puis le
 * SIRET, puis la commune du siège.
 *
 * L'assurance n'y figure pas : le client a répondu qu'il n'y en avait **pas à
 * afficher** (`legal.assuranceAffichee`). Une absence assumée n'est pas une
 * information manquante — l'annoncer « à venir » serait faux.
 *
 * Reste l'adresse postale complète : le client a donné la commune, pas la voie
 * ni le code postal.
 */
const A_COMPLETER = [
  ...(legal.siretConfirmed
    ? []
    : ["Le numéro d’identification de l’entreprise (SIRET)"]),
  "L’adresse postale complète du siège",
];

export default function MentionsLegalesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("mentions-legales")} />

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        <LegalHero
          id="mentions-titre"
          title="Mentions légales"
          lead={`Qui édite ce site, à quoi engagent les informations qu’il publie, et à qui appartiennent les contenus qu’on y trouve.`}
        />

        {/* ------------------------------------------ 1. Fiche éditeur --- */}
        <Section surface="light" aria-labelledby="mentions-editeur">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Subtitle as="h2" id="mentions-editeur">
                Éditeur du site
              </Subtitle>

              <Card as="div" tone="sand" padding="lg" className="mt-7">
                <LegalData items={EDITEUR} />
              </Card>

              {/*
                L'AVERTISSEMENT EST VISIBLE, PAS ENFOUI.

                Le site est déployé publiquement pendant sa préparation. Un
                visiteur qui cherche un SIRET doit apprendre en une phrase
                qu'il n'y est pas encore — plutôt que de parcourir la page en
                se demandant s'il a mal lu.
              */}
              <div className="mt-7 rounded-card border border-(--surface-rule) p-6 lg:p-7">
                <Capsule variant="light">En cours de finalisation</Capsule>

                <Body className="mx-auto mt-4 text-(--surface-fg-muted)">
                  Le site est en cours de préparation. Les mentions suivantes ne
                  sont pas encore publiées et le seront sur cette page avant sa
                  mise en ligne définitive :
                </Body>

                <div className="mt-5">
                  <LegalList items={A_COMPLETER} />
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------------------ 2. Articles --- */}
        <LegalArticles surface="sand">
          <LegalArticle id="mentions-hebergement" title="Hébergement">
            <Body className="mx-auto text-(--surface-fg-muted)">
              Le site est actuellement déployé sur un environnement de
              préproduction, le temps de sa préparation.
            </Body>
            <Body className="mx-auto text-(--surface-fg-muted)">
              L’identité et les coordonnées de l’hébergeur définitif seront
              publiées ici dès que l’hébergement de production sera en place, et
              en tout état de cause avant la mise en ligne du site.
            </Body>
          </LegalArticle>

          <LegalArticle
            id="mentions-propriete"
            title="Propriété intellectuelle"
          >
            <Body className="mx-auto text-(--surface-fg-muted)">
              La structure du site, ses textes et les éléments graphiques qui
              lui sont propres — mise en page, motifs, cartographie — sont
              protégés au titre du droit d’auteur, dans les limites applicables.
            </Body>

            <Body className="mx-auto text-(--surface-fg-muted)">
              Les photographies, en revanche, ne sont pas toutes la propriété de{" "}
              {site.name}. Une partie provient de banques d’images libres et
              reste soumise à la licence de son auteur.
            </Body>

            {/*
              ATTRIBUTION CARTOGRAPHIQUE — OBLIGATION DE LICENCE.

              La carte de la zone d'intervention est dessinée à partir de
              données ouvertes sous ODbL et Licence Ouverte 2.0. L'ODbL impose
              l'attribution. Sources détaillées : `MAP_DATA_SOURCES.md` § 2.
            */}
            <div className="mt-2">
              <Small className="mx-auto">
                Données cartographiques : contours régionaux et départementaux
                d’après l’IGN (ADMIN-EXPRESS), via france-geojson — licence
                ODbL. Coordonnées et limites communales : Étalab / DINUM
                (geo.api.gouv.fr), d’après l’INSEE et l’IGN — Licence Ouverte
                2.0.
              </Small>
            </div>
          </LegalArticle>

          <LegalArticle id="mentions-responsabilite" title="Responsabilité">
            <Body className="mx-auto text-(--surface-fg-muted)">
              Les informations publiées sur ce site sont fournies à titre
              informatif. Elles décrivent des prestations, elles ne valent pas
              engagement contractuel.
            </Body>

            <Body className="mx-auto text-(--surface-fg-muted)">
              La faisabilité d’une intervention, sa méthode, son délai et son
              prix sont confirmés après étude de la demande, et le cas échéant
              après visite du chantier. Les distances portées par la carte sont
              données à vol d’oiseau : elles situent, elles ne garantissent pas
              un déplacement.
            </Body>

            <Body className="mx-auto text-(--surface-fg-muted)">
              Si une information vous paraît inexacte ou périmée, signalez-la à{" "}
              {contact.email} : elle sera corrigée.
            </Body>
          </LegalArticle>
        </LegalArticles>

        <LegalFooter other="politique-confidentialite" />
      </main>
    </>
  );
}
