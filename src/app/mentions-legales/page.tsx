import type { Metadata } from "next";

import {
  LegalArticle,
  LegalArticles,
  LegalData,
  LegalFooter,
  LegalHero,
  type LegalDatum,
} from "@/components/legal/legal";
import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Body,
  Card,
  Container,
  Reveal,
  Section,
  Small,
  Subtitle,
} from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { area, contact, host, legal, site } from "@/lib/site";
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
 * n'est recopiée en dur ici. Et surtout : **rien n'est inventé**.
 *
 * Deux absences sont des DÉCISIONS du client, pas des trous : l'assurance
 * (`legal.assuranceAffichee`) et l'adresse postale complète du siège
 * (`legal.adresseCompleteAffichee`). Elles ne sont donc ni affichées, ni
 * annoncées « à venir » — annoncer une publication qui n'aura pas lieu serait
 * la même faute que d'inventer la donnée.
 *
 * L'entreprise reste identifiable : la commune du siège et le SIRET sont
 * publiés, et le SIRET suffit à retrouver la fiche publique de l'entreprise.
 *
 * PLUS D'ENCADRÉ « EN COURS DE FINALISATION » — DEMANDE CLIENT
 * ------------------------------------------------------------
 * La fiche éditeur était suivie d'un encadré listant les mentions restant à
 * publier. Il n'avait plus qu'une entrée, l'adresse postale complète, et le
 * client a tranché : elle ne sera pas publiée. L'encadré annonçait donc une
 * publication qui n'aurait jamais lieu.
 *
 * Il est retiré, avec la liste qui l'alimentait. Le drapeau
 * `legal.adresseCompleteAffichee` reste la trace de la décision côté données,
 * et `LEGAL_CHECKLIST.md` § 1 la trace côté dossier — de sorte que personne ne
 * lise plus tard cette absence comme un oubli.
 *
 * Si une mention devait un jour redevenir « en attente », c'est un bloc à
 * réécrire, pas à ressusciter : le cas ne se présente plus.
 *
 * Un SIRET plausible mais faux serait la pire faute possible sur cette page :
 * invérifiable pour le client, immédiatement vérifiable par n'importe qui
 * d'autre.
 *
 * L'HÉBERGEUR EST DÉSORMAIS NOMMÉ
 * -------------------------------
 * La rubrique annonçait une publication « dès que l'hébergement de production
 * sera en place ». Il l'est : le client a confirmé la mise en ligne chez
 * Hostinger. L'annonce est donc remplacée par l'information elle-même.
 *
 * L'identité vient de `host` (`site.ts`), relevée sur les conditions générales
 * publiées par Hostinger — pas écrite de mémoire. C'était la condition posée
 * en phase 16B pour renseigner cette rubrique.
 *
 * Le téléphone de l'hébergeur n'y figure pas : Hostinger n'en publie pas. Une
 * valeur `null` retire la ligne, elle n'affiche pas un trou — même règle que
 * pour le téléphone de l'entreprise.
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
  /* La commune, telle que confirmée. Ni voie ni code postal : le client a
     décidé de ne pas publier l'adresse complète (`adresseCompleteAffichee`). */
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

            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------------------ 2. Articles --- */}
        <LegalArticles surface="sand">
          <LegalArticle id="mentions-hebergement" title="Hébergement">
            <Body className="mx-auto text-(--surface-fg-muted)">
              Le site est hébergé par {host.name}, {host.address}.
            </Body>

            {/* Le téléphone suit la même règle que partout : `null` retire la
                ligne. Hostinger n'en publie pas — cf. `host.phone`. */}
            {host.phone ? (
              <Body className="mx-auto text-(--surface-fg-muted)">
                Téléphone : {host.phone}
              </Body>
            ) : null}

            <Body className="mx-auto text-(--surface-fg-muted)">
              Site de l’hébergeur : {host.website}
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
