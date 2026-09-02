import type { Metadata } from "next";

import {
  LegalArticle,
  LegalArticles,
  LegalFooter,
  LegalHero,
  LegalList,
} from "@/components/legal/legal";
import { MAIN_CONTENT_ID } from "@/components/layout/skip-link";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Body,
  Card,
  Container,
  Reveal,
  Section,
  TextLink,
  Subtitle,
} from "@/components/ui";
import { getRoute } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { contact, site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata("politique-confidentialite");

/**
 * Page `/politique-confidentialite` — écrite en phase 16B. Composant SERVEUR.
 *
 * ELLE DÉCRIT LE SITE RÉEL, PAS UN SITE TYPE
 * ------------------------------------------
 * C'est le seul intérêt d'une politique de confidentialité : dire ce qui se
 * passe vraiment. Les clauses recopiées d'un autre site décrivent Google
 * Analytics, des cookies de suivi, une base de données et un compte
 * utilisateur — dont ce site n'a **rien**.
 *
 * Vérifié dans le code avant rédaction, et non supposé :
 *
 * | Affirmation | Vérification |
 * | --- | --- |
 * | Aucun outil de mesure | `src/lib/quote/events.ts` — `emitQuoteEvent()` est un corps vide |
 * | Aucun cookie | aucune occurrence de `document.cookie` ni de `cookies()` dans `src/` |
 * | Aucun envoi | `submit()` de `use-quote-state.ts` — le dernier pas bascule l'écran, il n'appelle rien |
 * | Ce que garde le navigateur | `src/lib/quote/persistence.ts` — `StoredShape` |
 *
 * LA LISTE DE `sessionStorage` EST CELLE DU CODE
 * ----------------------------------------------
 * Les champs cités — besoin, chantier, code postal, commune, étape, nombre de
 * photos — sont exactement les clés de `StoredShape`. Ni le nom, ni le
 * téléphone, ni l'e-mail, ni le commentaire, ni l'adresse précise, ni les
 * photographies n'y figurent. Si `persistence.ts` change, ce texte doit
 * changer avec lui.
 *
 * `sessionStorage` N'EST PAS UN COOKIE, et la page le dit. C'est la confusion
 * la plus courante des politiques de confidentialité rédigées à la va-vite,
 * et elle conduit à réclamer un consentement là où il n'y a rien à consentir.
 *
 * AUCUNE DURÉE CHIFFRÉE
 * ---------------------
 * « Trois ans » est le chiffre que tout le monde recopie. Il n'a été décidé
 * par personne ici. La formulation reste donc fonctionnelle jusqu'à ce que le
 * client arrête sa propre règle — inscrite dans `LEGAL_CHECKLIST.md`.
 */

const mentions = getRoute("mentions-legales");

/** Ce que le configurateur peut demander. Repris de `QuoteDraft`. */
const COLLECTE = [
  "Le type d’intervention souhaité et les caractéristiques du chantier : nombre d’arbres, hauteur estimée, contraintes d’accès",
  "Le lieu du chantier : code postal, commune et adresse",
  "Vos coordonnées : nom, téléphone, e-mail",
  "Un commentaire libre, si vous souhaitez en ajouter un",
  "De une à cinq photographies, facultatives",
];

/** Ce à quoi ces informations servent. Rien d’autre. */
const FINALITES = [
  "Comprendre la demande",
  "Vous répondre",
  "Préparer un devis",
  "Organiser un échange, puis le cas échéant une intervention",
];

/** Les droits ouverts, formulés sans promettre de mécanisme automatisé. */
const DROITS = [
  "Accéder aux informations vous concernant",
  "Les faire rectifier si elles sont inexactes",
  "En demander l’effacement, lorsqu’il est applicable",
  "Demander la limitation de leur traitement",
  "Vous opposer à leur traitement, lorsque c’est applicable",
];

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("politique-confidentialite")} />

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        <LegalHero
          id="politique-titre"
          title="Politique de confidentialité"
          lead="Ce que devient une demande de devis : les informations demandées, à quoi elles servent, ce que le site garde, et comment le vérifier."
        />

        {/* ----------------------------------------------- 1. En résumé --- */}
        <Section surface="light" aria-labelledby="politique-resume">
          <Container>
            <Reveal className="mx-auto max-w-reading">
              <Subtitle as="h2" id="politique-resume">
                En résumé
              </Subtitle>

              <Card as="div" tone="sand" padding="lg" className="mt-7">
                <LegalList
                  items={[
                    "Aucun compte, aucun profil publicitaire, aucune revente de données.",
                    "Aucune mesure d’audience, aucun cookie de suivi — et donc aucun bandeau de consentement.",
                    "Un seul destinataire : l’entreprise.",
                    "Les photographies servent à comprendre le chantier, et à rien d’autre.",
                  ]}
                />
              </Card>

              <Body className="mx-auto mt-7 text-(--surface-fg-muted)">
                Le détail de chacun de ces points figure ci-dessous.
              </Body>
            </Reveal>
          </Container>
        </Section>

        {/* ------------------------------------------------ 2. Articles --- */}
        <LegalArticles surface="sand">
          <LegalArticle
            id="politique-responsable"
            title="Qui traite ces informations"
          >
            <Body className="mx-auto text-(--surface-fg-muted)">
              Les demandes adressées par ce site sont traitées par {site.name},
              représentée par {site.manager}.
            </Body>
            <Body className="mx-auto text-(--surface-fg-muted)">
              Contact : {contact.email}. Les informations légales de
              l’entreprise figurent dans les{" "}
              <TextLink href={mentions.path}>
                {mentions.navLabel.toLowerCase()}
              </TextLink>{" "}
              — elles sont encore en cours de finalisation.
            </Body>
          </LegalArticle>

          <LegalArticle
            id="politique-collecte"
            title="Les informations demandées"
          >
            <Body className="mx-auto text-(--surface-fg-muted)">
              Le configurateur de devis peut demander :
            </Body>

            <LegalList items={COLLECTE} />

            <Body className="mx-auto text-(--surface-fg-muted)">
              Rien d’autre. Le site ne demande ni date de naissance, ni
              coordonnées bancaires, ni création de compte, et n’utilise pas la
              géolocalisation de votre appareil.
            </Body>
          </LegalArticle>

          <LegalArticle id="politique-finalite" title="À quoi elles servent">
            <LegalList items={FINALITES} />

            <Body className="mx-auto text-(--surface-fg-muted)">
              Elles ne sont ni revendues, ni utilisées à des fins publicitaires,
              ni exploitées pour constituer un profil.
            </Body>
          </LegalArticle>

          <LegalArticle
            id="politique-fondement"
            title="Pourquoi ce traitement est légitime"
          >
            <Body className="mx-auto text-(--surface-fg-muted)">
              Ces informations sont transmises volontairement, dans le cadre
              d’une demande commerciale. Leur traitement est nécessaire pour y
              répondre et engager, le cas échéant, les démarches
              précontractuelles correspondantes.
            </Body>
            <Body className="mx-auto text-(--surface-fg-muted)">
              Les photographies suivent la même logique : elles sont ajoutées
              volontairement, pour aider à évaluer le chantier.
            </Body>
          </LegalArticle>

          <LegalArticle id="politique-destinataire" title="Qui les reçoit">
            <Body className="mx-auto text-(--surface-fg-muted)">
              Une seule destinataire : l’entreprise. Aucune donnée n’est
              transmise à un tiers à des fins commerciales.
            </Body>
            <Body className="mx-auto text-(--surface-fg-muted)">
              Les prestataires techniques nécessaires au fonctionnement du site
              — hébergement, acheminement des e-mails — peuvent y avoir accès
              dans la stricte mesure de leur intervention.
            </Body>
          </LegalArticle>

          {/*
            L'ÉTAT RÉEL DU SITE, DIT SANS DÉTOUR.

            Le formulaire est complet et vérifiable, mais il n'envoie encore
            rien. Le taire donnerait à cette page l'air de décrire un envoi qui
            n'a pas lieu ; l'écrire permet au visiteur de comprendre pourquoi
            il n'a pas reçu de réponse.
          */}
          <LegalArticle
            id="politique-aujourdhui"
            title="Ce qui se passe aujourd’hui"
          >
            <Body className="mx-auto text-(--surface-fg-muted)">
              Le site est en cours de préparation, et le formulaire de devis{" "}
              <strong className="font-semibold text-(--surface-heading)">
                n’envoie encore aucune demande
              </strong>
              . Le parcours peut être suivi jusqu’au récapitulatif, mais rien ne
              quitte votre navigateur. Pour joindre l’entreprise dès maintenant
              : {contact.email}
              {contact.phoneConfirmed ? ` ou ${contact.phoneDisplay}` : ""}.
            </Body>

            <Body className="mx-auto text-(--surface-fg-muted)">
              Pendant le parcours, le configurateur mémorise dans la session de
              votre navigateur les réponses non personnelles, pour que vous ne
              perdiez pas votre saisie en cas de rechargement :
            </Body>

            <LegalList
              items={[
                "Le type d’intervention et les réponses sur le chantier",
                "Le code postal et la commune",
                "L’étape atteinte et le nombre de photographies ajoutées",
              ]}
            />

            <Body className="mx-auto text-(--surface-fg-muted)">
              Votre nom, votre téléphone, votre e-mail, votre commentaire,
              l’adresse précise du chantier et les photographies elles-mêmes n’y
              sont jamais enregistrés. Cette mémorisation disparaît à la
              fermeture de l’onglet, et le bouton « Nouvelle demande » l’efface
              immédiatement.
            </Body>
          </LegalArticle>

          <LegalArticle
            id="politique-production"
            title="Ce qui se passera une fois le site en ligne"
          >
            <Body className="mx-auto text-(--surface-fg-muted)">
              La demande sera transmise par e-mail à l’entreprise, avec les
              photographies en pièces jointes.
            </Body>
            <Body className="mx-auto text-(--surface-fg-muted)">
              Aucune base de données n’est prévue : les demandes vivront dans la
              boîte de réception professionnelle, pas dans le site. Les fichiers
              transmis sont supprimés du serveur une fois l’e-mail parti.
            </Body>
          </LegalArticle>

          <LegalArticle id="politique-photos" title="Les photographies">
            <Body className="mx-auto text-(--surface-fg-muted)">
              Elles sont facultatives. Elles servent uniquement à comprendre la
              demande — voir l’arbre, son environnement et les accès évite
              souvent une visite préalable.
            </Body>
            <Body className="mx-auto text-(--surface-fg-muted)">
              Elles ne sont jamais publiées automatiquement, ni versées à une
              galerie publique. Une photographie que vous transmettez ne
              pourrait apparaître sur ce site qu’avec votre accord.
            </Body>
          </LegalArticle>

          <LegalArticle
            id="politique-cookies"
            title="Cookies et mesure d’audience"
          >
            <Body className="mx-auto text-(--surface-fg-muted)">
              Ce site ne dépose aucun cookie publicitaire ni aucun cookie de
              mesure d’audience, et aucun outil d’analyse n’y est installé.
              C’est pourquoi vous n’y voyez pas de bandeau de consentement : il
              n’y a rien à consentir.
            </Body>
            <Body className="mx-auto text-(--surface-fg-muted)">
              La mémorisation décrite plus haut n’est pas un cookie. Elle
              utilise le stockage de session du navigateur : un espace propre à
              l’onglet, jamais transmis au serveur, effacé à sa fermeture.
            </Body>
          </LegalArticle>

          <LegalArticle
            id="politique-conservation"
            title="Combien de temps elles sont conservées"
          >
            <Body className="mx-auto text-(--surface-fg-muted)">
              Les données sont conservées pendant la durée nécessaire au
              traitement de la demande et aux obligations administratives ou
              légales applicables.
            </Body>
          </LegalArticle>

          <LegalArticle id="politique-securite" title="Sécurité">
            <Body className="mx-auto text-(--surface-fg-muted)">
              Les échanges avec le site sont chiffrés (HTTPS). Lorsque l’envoi
              réel sera activé, les fichiers déposés seront contrôlés avant
              traitement et ne seront pas conservés sur le serveur.
            </Body>
            <Body className="mx-auto text-(--surface-fg-muted)">
              Ces mesures visent à limiter l’accès non autorisé aux informations
              transmises. Aucune ne garantit une sécurité absolue : elles
              réduisent le risque, elles ne l’annulent pas.
            </Body>
          </LegalArticle>

          <LegalArticle id="politique-droits" title="Vos droits">
            <Body className="mx-auto text-(--surface-fg-muted)">
              Vous pouvez à tout moment demander à :
            </Body>

            <LegalList items={DROITS} />

            <Body className="mx-auto text-(--surface-fg-muted)">
              Une seule adresse pour cela : {contact.email}. La demande est
              traitée par une personne, et non par un dispositif automatisé —
              prévoyez un délai de réponse raisonnable.
            </Body>

            <Body className="mx-auto text-(--surface-fg-muted)">
              Si la réponse ne vous convient pas, vous pouvez adresser une
              réclamation à l’autorité de contrôle compétente : en France, la
              Commission nationale de l’informatique et des libertés (CNIL).
            </Body>
          </LegalArticle>
        </LegalArticles>

        <LegalFooter other="mentions-legales" />
      </main>
    </>
  );
}
