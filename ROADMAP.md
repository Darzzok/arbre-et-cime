# ROADMAP.md — Feuille de route

18 phases courtes. **Une seule phase à la fois**, livrée et validée avant de
passer à la suivante.

Règle commune à toutes les phases : `npm run lint` et `npm run build` doivent
passer avant de déclarer la phase terminée.

Légende : `✅ fait` · `▶ en cours` · `⬜ à faire`

---

## Phase 1 — Initialisation et documentation ✅

Socle technique et documents de référence.

- Projet Next.js 16 / React 19 / TypeScript strict / Tailwind v4 / ESLint 9 / npm
- `.gitignore`, `.env.example` sans secret
- `src/lib/site.ts` — source unique des données d'entreprise
- Jetons de design déclarés dans `globals.css`
- Documentation : `CLAUDE.md`, `PROJECT.md`, `DESIGN_SYSTEM.md`,
  `SEO_STRATEGY.md`, `CONVERSION_STRATEGY.md`, `QUOTE_FLOW.md`,
  `CONTENT_STRATEGY.md`, `ROADMAP.md`

**Sortie :** lint et build au vert, page d'attente en ligne locale.

---

## Phase 2 — Design system ✅

Livré (voir `DESIGN_SYSTEM.md` pour le détail) :

- **Jetons** : palette, échelle typographique fluide en `clamp()` (390 → 1440
  px), rayons 0–8 px, points de rupture alignés sur les largeurs de recette
  (480 / 768 / 1024 / 1440), largeurs maximales, gouttières et rythme vertical
  responsives. Les espaces de noms Tailwind par défaut (`--color-*`, `--text-*`,
  `--radius-*`, `--breakpoint-*`) sont réinitialisés : la charte est rendue
  impossible à contourner.
- **Surfaces** `light` / `dark` pilotées par `data-surface`, avec bascule
  complète des jetons sémantiques (fond, texte, texte secondaire, filets,
  focus, boutons).
- **Primitives** (`src/components/ui/`, toutes composants serveur) :
  `Container`, `Section`, `Display` / `Title` / `Subtitle` / `Lead` / `Body` /
  `Small`, `Button`, `ButtonLink`, `TextLink`, `ArrowLink`, `Eyebrow`,
  `SectionIndex`, `Rule`, `Figure`, `Reveal`.
- **Animation** : `Reveal`, unique primitive, 100 % CSS via
  `animation-timeline: view()`, sans JavaScript ni dépendance, neutralisée sous
  `prefers-reduced-motion`.
- **Accessibilité** : focus visible adapté à la surface (le jaune sécurité
  échouant à 1,96 sur ivoire est réservé aux fonds sombres), cibles tactiles
  ≥ 44 px, boutons et liens strictement distingués, liens soulignés en
  permanence.
- **Route interne `/style-guide`** : palette, contrastes, typographies,
  hiérarchie, boutons, liens, surtitres, surfaces, séparateurs, espacements,
  grille et mouvement. `noindex, nofollow`, hors navigation publique.

**Sortie atteinte :** aucun débordement horizontal à 320 / 390 / 768 / 1024 /
1440 px, contrastes conformes au tableau de `DESIGN_SYSTEM.md`, lint, typecheck
et build au vert. Aucune dépendance ajoutée.

*Reste rattaché à des phases ultérieures :* le lien d'évitement et la barre
d'action mobile sont livrés avec le châssis en phase 4.

---

## Phase 3 — Architecture SEO et routes ✅

Livré (voir `SEO_STRATEGY.md` pour le détail) :

- **Architecture plate, 12 routes publiques** : `/`, `/elagage`, `/abattage`,
  `/dessouchage`, `/entretien-exterieur`, `/realisations`,
  `/zones-intervention`, `/devis`, `/a-propos`, `/contact`,
  `/mentions-legales`, `/politique-confidentialite`. Toutes pré-rendues en
  statique. Slugs définitifs.
- **Source de vérité unique `src/lib/routes.ts`** : chemins, libellés,
  titres, descriptions, intentions SEO, priorités, indexabilité, groupes de
  navigation, fil d'Ariane et rattachement des huit prestations aux quatre
  pages services. Aucune URL n'est écrite en dur ailleurs.
- **Fabrique de métadonnées `buildMetadata()`** (`src/lib/seo.ts`) : titre,
  description, canonique, Open Graph, Twitter, robots. Canonique omise sur les
  pages `noindex`. Emplacement d'image Open Graph prêt, laissé vide tant qu'une
  photographie réelle n'est pas livrée.
- **`sitemap.ts` et `robots.ts`** générés depuis les routes.
  `/style-guide` exclue du sitemap automatiquement et laissée explorable pour
  que son `noindex` soit effectivement lu.
- **Gestion d'environnement** : aucune URL absolue, aucun canonical, aucun
  JSON-LD et sitemap vide lorsque `NEXT_PUBLIC_SITE_URL` est absente en
  production. Vérifié au build : zéro occurrence de `localhost` dans le HTML.
- **Architecture JSON-LD** (`src/lib/structured-data.ts` + `<JsonLd>`) :
  `BreadcrumbList` actif ; `LocalBusiness` et `Service` gelés tant que les
  données client manquent, la check-list étant retournée par
  `missingLocalBusinessData()`.
- **Pages d'attente sémantiques** : un seul `h1`, hiérarchie continue, `main`
  unique, texte contextualisé et distinct par page, maillage interne réel.
  Aucun contenu de remplissage, aucune affirmation commerciale non vérifiée.

**Sortie atteinte :** 16 routes bâties en statique (12 publiques,
`/style-guide`, `/robots.txt`, `/sitemap.xml`, `/_not-found`), métadonnées
distinctes et correctes, lint, typecheck et build au vert. Aucune dépendance
ajoutée.

*Écart assumé avec la phase 1 :* l'arborescence documentée initialement
(`/prestations/elagage`, `/zone-intervention`,
`/politique-de-confidentialite`) est remplacée par l'architecture plate
ci-dessus, sur décision client. `SEO_STRATEGY.md` a été mis à jour.

*Rappel garde-fou :* les pages publiques sont indexables mais portent un
contenu d'attente. **Pas de mise en ligne avant la phase 18.**

---

## Phase 4 — Navigation, header, footer ✅

Livré (voir `DESIGN_SYSTEM.md` § 8) :

- **En-tête à deux variantes**, pilotées par `headerVariant` dans
  `src/lib/routes.ts` : `overlay` transparent sur la page d'accueil (en
  prévision du hero photo), `solid` collant sur les pages internes.
- **Navigation desktop** : Prestations (sous-menu de 4 services), Réalisations,
  Zone d'intervention, À propos, CTA « Devis gratuit ». Sous-menu ouvert au clic
  et au clavier, jamais au seul survol. Pas de méga-menu.
- **Menu mobile** plein écran sous 1024 px : `role="dialog"`, `aria-modal`,
  `Échap`, focus piégé puis rendu, défilement du corps verrouillé, fermeture
  au changement de page y compris via les boutons précédent/suivant.
- **Barre d'action mobile** fixe, marge de sécurité iOS respectée, cale de même
  hauteur en fin de flux pour ne jamais recouvrir le contenu. Désactivable page
  par page via `HIDDEN_ON`. **Aucun numéro inventé** : l'action « Appeler »
  n'apparaît que si `NEXT_PUBLIC_PHONE` est renseignée.
- **Pied de page** serveur : identité, prestations, zone, CTA devis, liens
  légaux. Aucune coordonnée ni adresse fictive.
- **Lien d'évitement** vers `#contenu`, présent sur toutes les pages.
- **Logotype typographique temporaire** — aucun symbole d'arbre inventé.

**Sortie atteinte :** châssis complet, navigable au clavier, sans dépendance au
survol. 25 combinaisons largeur x page vérifiées sans débordement horizontal
(320 / 390 / 768 / 1024 / 1440 px). Lint, typecheck et build au vert. Aucune
dépendance ajoutée.

*Ajustements dans `src/lib/routes.ts` :* ajout du champ `headerVariant`,
remplacement de `primaryNavIds` par `primaryNav` (routes et groupes) et
`ctaRouteId`, libellé « Zones d'intervention » ramené au singulier « Zone
d'intervention » pour coller à la section verrouillée de `PROJECT.md`.

### Phase 4B — Raffinement premium de la navigation ✅

La navigation de la phase 4 était fonctionnelle mais trop institutionnelle.
Reprise du seul châssis, sans toucher aux autres sections :

- **Système de mouvement à trois niveaux** documenté et outillé : Micro
  (180 ms), Reveal (520 ms), Signature (900 ms, réservé au hero, à la carte et
  au devis). Vocabulaire arrêté : filets qui se tracent, masques, translations
  contrôlées ; rebond, zoom, flou et rotation exclus.
- **Logotype renforcé** : « Arbre & Cime » avec esperluette en italique, et
  « ÉLAGAGE · ROUEN » en surtitre au point médian jaune. Toujours aucun symbole
  inventé. Trois tailles.
- **En-tête toujours sur surface sombre**, `fixed`, qui se compacte au
  défilement (112 → 80 px sur desktop) avec fond forêt à 95 % et filet
  inférieur. Les pages internes reçoivent une cale de la hauteur dépliée, donc
  aucun décalage de mise en page.
- **Indicateur de lien** : filet de 1 px tracé depuis la gauche, sans
  déplacement du libellé.
- **Sous-menu Prestations éditorial** : index `01`–`04`, intitulés en Fraunces,
  sous-libellés (`navTagline` ajouté aux routes services).
- **CTA `NavCta`** en remplacement de l'aplat jaune : le jaune sécurité ne
  subsiste qu'en filet de 2 px et en flèche. Permanent dans le menu mobile, où
  il n'y a pas de survol.
- **Menu mobile repensé** : entrées numérotées `01`–`04` en grand, Prestations
  dépliable, CTA pleine largeur, rappel de la zone. Apparition en cascade
  entièrement CSS, relancée à chaque ouverture, neutralisée sous
  `prefers-reduced-motion`.
- **Barre d'action affinée** : 60 px, séparateur vertical, et **apparition
  différée après le hero** sur les routes `overlay`. Cale rendue en permanence
  pour que la hauteur du document reste stable.

**Sortie atteinte :** 25 combinaisons largeur × page sans débordement
horizontal. Lint, typecheck et build au vert. Aucune dépendance ajoutée.

*Correctif technique :* les trois durées ont dû quitter `@theme` pour `:root` —
Tailwind élague les variables de `@theme` qu'aucun utilitaire ne consomme, et
`--duration-signature` n'était pas émise.

*Décision à confirmer :* l'en-tête est désormais **sombre sur toutes les
pages**, et non plus ivoire sur les pages internes. Le jaune sécurité ne
contraste qu'à 1,96 sur ivoire : ses accents y auraient été illisibles.

---

## Phase 5A — Photothèque ✅

Constitution d'une photothèque réelle et exploitable **avant** de développer le
hero, pour ne pas concevoir à vide.

- **18 photographies** sous licence Pexels, téléchargées dans le projet et
  rangées dans `public/images/` : `hero` (4), `services` (9), `details` (2),
  `realisations` (3). Aucune URL de banque n'est utilisée dans le code.
- **`MEDIA_SOURCES.md`** créé comme registre permanent : fichier, dimensions,
  usage prévu, auteur, URL de page source, licence, date, remarques sur logos et
  personnes identifiables.
- **9 images écartées** et le motif du rejet consignés, pour qu'elles ne
  reviennent pas : logo de marque lisible, EPI absents, contexte non européen,
  colorimétrie hors charte, personne face à l'objectif.
- Lisibilité du texte sur les candidates hero **mesurée** et non estimée :
  contraste de l'ivoire sur la zone de titre, avec et sans voile, et variation
  de luminance de la zone.

**Sortie atteinte :** photothèque cohérente en lumière et en colorimétrie,
11,5 Mo au total, licences toutes vérifiables. Lint, typecheck et build au vert.

*Ces images restent un repli :* elles sont à remplacer par les photos du client
dès réception. Aucune n'est légendable avec une commune ou une date.

---

## Phase 5B — Hero ⬜

**Les candidates sont prêtes** (`public/images/hero/`). Le choix final entre les
trois revient au client.

- Photo réelle plein écran, cadrage vertical sur mobile
- `h1` court, chapô d'une phrase, double CTA visible sans défiler à 390 px
- `priority` + `sizes` maîtrisés, aucun décalage de mise en page

**Sortie :** LCP mesuré sous 2,5 s en 4G simulée sur mobile.

---

## Phase 6 — Preuves ⬜

- Expérience, qualifications, sécurité, chantier propre, devis gratuit
- Traitement éditorial : filets et hiérarchie typographique, pas de cartes

**Sortie :** section validée à 390 px, aucun fait non vérifié affiché.

---

## Phase 7 — Prestations ⬜

- Les 8 prestations dans l'ordre de référence, en liste éditoriale
- Lien vers chaque page service
- Contenu des pages services rédigé selon le gabarit de `SEO_STRATEGY.md`

**Sortie :** parcours homepage → page service → CTA fonctionnel de bout en bout.

---

## Phase 8 — Pourquoi Arbre et Cime ⬜

- Trois à quatre différenciateurs argumentés, composition asymétrique
- Appui photo sur le matériel et la méthode

**Sortie :** section validée, aucun adjectif non étayé.

---

## Phase 9 — Réalisations ⬜

**Dépend de la photothèque.**

- Galerie éditoriale de chantiers réels, légendes factuelles
- Avant/après si disponible
- Chargement différé hors premier écran, dimensions explicites

**Sortie :** aucun CLS, navigation clavier de la galerie opérationnelle.

---

## Phase 10 — Carte de zone d'intervention ⬜

- Rouen et la métropole en cœur de cible, rayon jusqu'à 100 km en secondaire
- Carte animée : tracé progressif du rayon, sobre, sans bibliothèque lourde —
  SVG maîtrisé plutôt qu'un fond de carte tiers
- Repli textuel complet : liste des communes principales, lisible sans script
- Animation désactivée sous `prefers-reduced-motion`

**Sortie :** information de zone complète et compréhensible même sans animation.

---

## Phase 11 — Configurateur de devis (UI) ⬜

- Coquille des 5 étapes de `QUOTE_FLOW.md`, sans logique d'envoi
- Progression annoncée textuellement, navigation avant/arrière
- Étape reflétée dans l'URL

**Sortie :** parcours complet cliquable au doigt et au clavier, à 390 px.

---

## Phase 12 — Logique de devis et photos ⬜

- Validation par étape, schéma partagé client/serveur
- Dépôt de 1 à 6 photos, compression côté client, prévisualisation, suppression
- Persistance `sessionStorage` des champs texte (jamais des photos)
- Récapitulatif éditable avant envoi

**Sortie :** formulaire complet, validé, sans envoi réel.

---

## Phase 13 — Envoi et stockage des demandes ⬜

- Route Handler `POST /api/devis`, revalidation serveur systématique
- Stockage objet privé des photos, liens signés
- E-mail de notification à l'entreprise (`reply-to` client) + accusé de
  réception au client
- Limitation de débit, honeypot, journalisation des erreurs
- Variables d'environnement documentées dans `.env.example`

**Sortie :** demande de bout en bout reçue avec photos ; aucun secret exposé.

---

## Phase 14 — SEO technique et local ⬜

- `sitemap.ts`, `robots.ts`
- JSON-LD : `LocalBusiness`, `Service`, `BreadcrumbList`, `FAQPage`
- Open Graph avec photo réelle
- Redirection d'hôte unique, canoniques vérifiées
- Search Console + Google Business Profile alignés sur le NAP du site

**Sortie :** aucune erreur au test des résultats enrichis, sitemap soumis.

---

## Phase 15 — Performance, mobile, accessibilité ⬜

- Budgets : LCP < 2,5 s, INP < 200 ms, CLS < 0,1 en 4G mobile
- Audit des images, des fontes et du JavaScript embarqué
- Audit accessibilité : contrastes, focus, clavier, lecteur d'écran, cibles
  tactiles
- Vérification complète sous `prefers-reduced-motion`

**Sortie :** Lighthouse mobile ≥ 95 en performance et accessibilité sur la
homepage et une page service.

---

## Phase 16 — Analytics et conversions ⬜

- Analytics respectueux de la vie privée
- Six événements de `CONVERSION_STRATEGY.md` instrumentés
- Tableau de bord de suivi des abandons par étape du configurateur

**Sortie :** chaque événement vérifié manuellement en conditions réelles.

---

## Phase 17 — Recette (QA) ⬜

- Parcours testés sur iOS Safari, Android Chrome, desktop Chrome et Firefox
- Test à 390 px, 768 px, 1280 px, 1920 px
- Vérification des liens `tel:` et `mailto:`, des formulaires, des 404
- Relecture orthographique et typographique de tous les textes
- Vérification finale : aucune donnée factice, aucune image générée

**Sortie :** liste de recette signée, aucun défaut bloquant ouvert.

---

## Phase 18 — Mise en production ⬜

- Domaine, DNS, HTTPS, en-têtes de sécurité
- Variables d'environnement de production renseignées
- Mentions légales et politique de confidentialité publiées
- Sitemap soumis, GBP à jour, suivi actif
- Sauvegarde et procédure de mise à jour transmises au client

**Sortie :** site en ligne, suivi opérationnel, documentation à jour.

---

## Dépendances critiques

| Bloque | En attente de |
| --- | --- |
| Qualité finale des phases 5B et 9 | Photothèque client — un repli libre est en place depuis la phase 5A |
| Phases 4, 14, 18 | Téléphone, e-mail, domaine définitifs |
| Phase 13 | Hébergement, fournisseur d'envoi, adresse de réception |
| Phases 14, 18 | Raison sociale, SIREN, mentions légales, assurances |
| Phase 6 | Justificatifs des qualifications et de l'expérience |
