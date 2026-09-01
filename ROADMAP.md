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
- **Logotype renforcé** : « Arbres & Cimes » avec esperluette en italique, et
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

## Phase 5B — Hero ✅

Section 1 des 7 sections verrouillées. Photographie n°1 de
`MEDIA_SOURCES.md` (`elagueur-grimpeur-arbre-mature.jpg`), imposée par le
client.

- **Plein cadre à toutes les largeurs** (`object-cover`), et **direction
  artistique** : source verticale sous 1024 px, source paysage au-dessus,
  servies par un `<picture>` alimenté par `getImageProps()`. Une seule des deux
  est téléchargée.
- **Composition asymétrique** : texte dans la zone calme — colonne de droite
  sur desktop, bloc ancré en bas sur mobile. Le sujet n'est jamais recouvert.
- **`min-h-svh`** et non `dvh` : pas de saut de mise en page quand la barre
  d'URL de Safari mobile se rétracte. `min(100svh, 56rem)` sur desktop, la
  bande de preuves restant sous la ligne de flottaison.
- **Entrée au chargement 100 % CSS** — surtitre, démasquage du titre, filet
  tracé, texte, CTA, preuves — entièrement enfermée dans
  `prefers-reduced-motion: no-preference`. La photographie n'est jamais
  animée.
- **Bande de preuves** en quatre colonnes filetées, aucune carte, sous la
  ligne de flottaison sur mobile.
- **Aucun numéro inventé** : l'action « Appeler » n'est pas rendue tant que
  `NEXT_PUBLIC_PHONE` est vide.

**Sortie atteinte :** hero plein cadre de 320 à 1440 px, aucun débordement
horizontal, CTA dans le premier écran partout, pied de page jamais visible
dans le premier écran, contrastes mesurés sur la composition réelle (titre
8,71 à 9,64 ; chapô 7,08 à 8,13 ; surtitre 4,93 à 5,53), préchargements
d'image portés par requête média et une seule image téléchargée par format,
un seul `h1`. Lint, typecheck et build au vert. Aucune dépendance ajoutée.

*Correctif en cours de phase :* une première version recadrait trop sur
mobile ; une seconde, en `object-contain` sur fond flouté, montrait la photo
entière mais donnait une image encadrée au milieu d'un faux fond et cassait
l'impact du hero. Les deux ont été abandonnées au profit de la direction
artistique à deux sources.

*Reste à faire :* mesurer le LCP réel en 4G simulée sur appareil, une fois le
site déployé (phase 15).

---

## Phase 6 — Preuves et Prestations ✅

Sections 2 et 3 des 7 sections verrouillées.

**Bande de preuves** (`src/components/sections/proof-band.tsx`) — quatre
repères, tous vérifiables dans `PROJECT.md` : 10 ans d'expérience, diplômé,
devis gratuit, 100 km. Posée sur la même surface forêt que le hero, elle s'y
rattache visuellement. **Aucune carte, aucun pictogramme, aucune ombre** : des
filets d'un pixel et de la typographie. Quatre colonnes au-delà de 1024 px,
2 × 2 en dessous. Rendue en `<div>` et non en `<section>` : sans titre
visible, un point de repère anonyme n'aiderait personne.

**Prestations** (`src/components/sections/services.tsx`) — les quatre pages
services, index `01`–`04`, grandes photographies, texte très court, lien
éditorial à flèche. Les quatre prestations secondaires sont explicitement
rattachées à leur page parente par une phrase de bas de section.

- **Composition asymétrique** : empans 5/7 puis 7/5, second bloc de chaque
  rangée décalé vers le bas. Motif désormais documenté dans
  `DESIGN_SYSTEM.md` § 4.
- **Cadrages choisis par photographie** (portrait 4/5, paysage 3/2) : aucun
  recadrage fort, et l'alternance des proportions fait le rythme.
- **Images** : les quatre retenues sont celles de `public/images/services/`
  les plus lisibles et les plus cohérentes chromatiquement. Écartées : la
  tronçonneuse à marque lisible et l'arbre en têtard au ciel bleu saturé.
- **Lien étiré** : bloc entièrement cliquable, nom accessible réduit à
  l'intitulé plus « voir la prestation ».

**Sortie atteinte :** aucun débordement horizontal de 320 à 1440 px,
hiérarchie `h1 > h2 > h3 ×4` sans saut, une seule image en `eager` (le hero)
et quatre en `lazy`, liens descriptifs, animations au niveau Reveal
neutralisées sous `prefers-reduced-motion`. Lint, typecheck et build au vert.
Aucune dépendance ajoutée.

### Phase 6B — Reprise en style premium moderne ✅

Le traitement éditorial de la phase 6 a été jugé trop « magazine », la bande
de preuves trop massive. Reprise des deux seules sections concernées :

- **Bande de preuves compacte** : hauteur ramenée de 240 à **120 px** sur
  desktop, valeurs passées de Fraunces 46 px à **Manrope 26 px** (20 px sur
  mobile), accent jaune réduit à un trait de 16 px. Une réglure, plus une
  section.
- **Cartes photographiques** : photo plein fond, rayon 16 px, dégradé
  progressif, contenu ancré en bas, index en jaune sécurité. Grille 2 × 2 au
  delà de 1024 px, une carte par ligne en dessous (336 px de haut).
- **Interactions au survol** : image à `scale 1.03` en 520 ms, voile qui
  s'ajoute, filet d'accent révélé, titre remonté de 2 px et flèche avancée de
  4 px en 180 ms. Tout sous `motion-safe`, rien d'essentiel au survol.
- **Titre de section** ramené de 46 à **36 px**, chapô raccourci, ton plus
  direct.

**Sortie atteinte :** aucun débordement de 320 à 1440 px, rayon 16 px partout,
quatre images en `lazy`, hiérarchie de titres inchangée. Lint, typecheck et
build au vert. Aucune dépendance ajoutée.

*Deux règles générales assouplies sur cette seule section*, sur décision
client et documentées comme exception dans `DESIGN_SYSTEM.md` § 4 : « très peu
de cartes » et « rayons de 0 à 8 px ». Le jeton `--radius-card` isole la
dérogation.

---

## Phase 7 — Pages services ✅

Les quatre pages `/elagage`, `/abattage`, `/dessouchage` et
`/entretien-exterieur` sont développées.

- **Cinq blocs** par page : hero photographique, intention, cas
  d'intervention, méthode et sécurité, conversion. Gabarit détaillé dans
  `SEO_STRATEGY.md` § 5.
- **Contenu réuni dans `src/lib/services-content.ts`** — un seul fichier à
  relire pour vérifier que les quatre pages disent des choses réellement
  différentes. Chaque page a son angle propre et sa précision de fin
  (tableau dans `CONTENT_STRATEGY.md` § 6).
- **Deux photographies par page**, toutes distinctes, prises de
  `public/images/services/` et `public/images/details/`.
- **Maillage interne** : chaque page renvoie aux trois autres services et
  porte deux CTA vers `/devis`.
- **JSON-LD** : `BreadcrumbList` actif, `Service` toujours gelé — il dépend
  de `LocalBusiness`, lui-même en attente des données client.

**Sortie atteinte :** quatre `title` et `description` uniques (45 à 62
caractères), canoniques présentes, un seul `h1` par page, hiérarchie
`h1 > h2 ×5 > h3` sans saut, une image en `eager` et une en `lazy` par page,
aucun débordement de 320 à 1440 px. Lint, typecheck et build au vert. Aucune
dépendance ajoutée.

*Correctif de contraste :* sur `/elagage`, le surtitre du hero tombait devant
un bâtiment en pierre claire et descendait à **3,28** — sous le seuil AA. Le
palier médian du dégradé a été appuyé et le surtitre passé en ivoire : les
quatre pages sont désormais entre 6,6 et 11,4.

*Correctif de clôture de page :* la section de conversion était en forêt et
tombait directement sur le pied de page, lui aussi en forêt — 1 754 px de
sombre d'un seul tenant, avec le logotype et un second bouton jaune répétés à
300 px d'intervalle. La section est passée en clair avec un panneau sombre
arrondi, et le CTA du pied de page en version éditoriale. Règle ajoutée à
`DESIGN_SYSTEM.md` § 8 : aucune section ne se termine en forêt.

*Reste à écrire, après retour client :* la FAQ de chaque page et le détail
de ce qui fait varier un devis.

---

## Phase 8 — Pourquoi Arbres et Cimes ✅

Section 4 des 7 sections verrouillées
(`src/components/sections/why.tsx`).

**Livrée une première fois, puis entièrement refaite sur correctif client.**
Le premier jet a été rejeté en bloc : « la version actuelle ne convient pas du
tout ». Sept griefs, tous fondés — fond noir trop lourd, photographie hors
sujet, section froide, quatre cartes identiques trop rigides, manque de
contenu, manque de respiration, rendu générique.

### Ce qui a été refait

- **Surface claire** au lieu de charbon. La première version posait un aplat
  sombre plein écran juste avant un pied de page forêt : deux masses sombres
  consécutives. La surface `charcoal` créée pour l'occasion a été **retirée du
  système** — plus aucun emploi. Une section claire règle la contrainte de
  clôture du `DESIGN_SYSTEM.md` § 8 sans mécanisme.
- **Composition en deux colonnes asymétriques** au lieu d'une grille : à
  gauche titre, introduction et photographie ; une colonne laissée vide ; à
  droite les quatre arguments. Motif documenté dans `DESIGN_SYSTEM.md` § 4.
- **Arguments non encadrés** : des filets d'un pixel qui séparent au lieu de
  bordures qui entourent, un numéro serti entre deux accents jaunes, des
  hauteurs libres (199 à 254 px en 1440). C'est ce qui casse l'effet « quatre
  rectangles clonés ».
- **Vrai texte d'introduction** — deux paragraphes — là où il n'y avait qu'une
  ligne de chapô, et arguments passés de deux à trois lignes. Textes fournis
  par le client, repris mot pour mot.
- **Photographie changée** : le cordage sur baudrier, jugé hors sujet, cède la
  place à `hero/demontage-arbre-tronconneuse-sciure.jpg` — un vrai chantier,
  grimpeur encordé à la tronçonneuse. Jusqu'ici inutilisée sur le site.
  **Aucune image téléchargée**, `MEDIA_SOURCES.md` n'a changé que sa mention
  d'usage.
- **La photographie ferme la colonne** : rangée en `items-stretch`, colonne en
  `flex-col`, photo en `flex-1` puis `h-full`. Son bas s'aligne au pixel sur le
  dernier argument. Sans cela la colonne gauche s'arrêtait 166 px trop haut et
  laissait un vide.

### Ce qui n'a pas bougé

Les quatre arguments restent ceux de `PROJECT.md` : sécurité, flexibilité,
diplômes, chantier propre. Aucune assurance, certification, garantie ni
disponibilité n'a été inventée pour « étoffer » la section.

Le **filet supérieur du pied de page**, ajouté au premier jet, reste en place :
il ne coûte rien et servira si une section sombre devait un jour le précéder.

**Sortie atteinte :** aucun débordement de 320 à 1440 px. Une colonne sous
1024 px, dans l'ordre texte puis photo puis arguments ; deux colonnes au-delà,
à hauteurs égales (960/960 en 1024, 922/922 en 1440). Contrastes sur ivoire :
charbon 15,51 · mousse 5,15. Quatre `h3` sous le `h2` de section, aucun lien
dans les blocs, seul mouvement l'allongement des filets au survol. Lint,
typecheck et build au vert. Aucune dépendance ajoutée.

*Hauteurs de section :* 2 059 px en 320, 1 957 en 430, 1 765 en 768, 1 216 en
1024, 1 178 en 1440. Plus haut que la version rejetée (1 286 / 1 022), et
c'est assumé — le grief principal était le manque de contenu.

---

## Page `/a-propos` ✅ — hors séquence

**Cette page n'appartient à aucune des 18 phases.** Le découpage d'origine
traitait les pages d'entreprise en fin de parcours ; le client l'a demandée
juste après la phase 8. C'est noté ici pour que la numérotation reste lisible :
il n'y a pas deux phases 8.

Six blocs (`src/app/a-propos/page.tsx`) : hero, parcours, qualifications,
manière de travailler, zone, conversion. Les types de clients — particuliers,
professionnels, collectivités — sont intégrés en une phrase à la méthode plutôt
qu'en septième bloc.

- **Cinq faits nouvellement confirmés** entrent dans `src/lib/site.ts` :
  `manager`, `foundedYear`, `selfEmployedYears`, `shortName`, et la liste
  `qualifications`. Rien n'est recopié en dur dans la page.
- **Trois photographies**, toutes existantes, aucun téléchargement : le hero en
  fond de section, le harnais et la corde au parcours, le broyage en fin de
  méthode.
- **Un seul aplat sombre** en dehors du hero : le panneau de conversion. La
  page est ivoire, conformément à la consigne.
- **`qualificationDetails` est indexé par intitulé**, pas par position :
  ajouter une qualification dans `site.ts` sans écrire son explication devient
  une erreur de compilation au lieu d'un titre affiché sans texte.
- **Aucun schéma `Person`** — voir `SEO_STRATEGY.md` § 5 bis.

**Le point qui a coûté le plus de travail : le dégradé du hero.** Le dégradé
partagé des pages services laissait le surtitre à 1,92 de contraste et le `h1`
à 2,11 — très en dessous d'AA. Diagnostic : ce n'est pas la photographie, c'est
la **hauteur**. Un hero court est presque entièrement rempli par son texte, qui
remonte donc dans le haut du cadre, là où un dégradé ancré en bas est nul par
construction. Les quatre autres photographies candidates ont été mesurées au
même endroit : toutes pires (1,57 à 1,67).

Corrigé en deux temps — hero porté de 22 à 26rem, puis dégradé calibré page par
page. Quatre réglages ont été mesurés ; le plus léger qui tienne AA a été
retenu, les trois autres éteignaient l'arbre. Résultat au pixel le plus
défavorable : **5,52 / 5,43 / 9,58 en 320 px**, 8,47 / 10,02 / 11,30 en 1440.

**Sortie atteinte :** aucun débordement de 320 à 1440 px. Un `h1` unique,
hiérarchie `h2`/`h3` continue, neuf titres au total. Trois images, une seule en
`priority` (le hero), les deux autres en `lazy`. Aucune dépendance ajoutée.
Lint, typecheck et build au vert.

*Hauteurs de page :* 6 514 px en 320, 6 186 en 390, 6 011 en 768, 5 570 en
1024, 5 821 en 1440.

---

## Phase 9 — Réalisations ✅

Section 5 des 7 sections verrouillées
(`src/components/sections/realisations.tsx`) et page `/realisations`
(`src/app/realisations/page.tsx`). Contenu commun dans
`src/lib/realisations-content.ts`.

La phase était annoncée « dépend de la photothèque ». Elle a été livrée
**sans** la photothèque client, ce qui a déplacé tout l'enjeu : le problème
n'était pas de construire une galerie, mais d'écrire une page de réalisations
qui ne ment pas.

### Ce qui a été construit

- **Accueil, « Quelques interventions »** : trois cartes, anatomie
  volontairement différente de celle des Prestations — photographie pleine
  puis légende SOUS l'image, jamais de texte incrusté. Deux grilles de cartes
  identiques sur la même page auraient donné le « site généré » que
  `PROJECT.md` interdit.
- **`/realisations`** : hero compact, collection de quatre situations,
  « Ce qui décide de la méthode » (cinq critères), conversion et maillage.
- **Aucune route `/realisations/[slug]`** : une page par chantier n'a de
  valeur qu'avec une commune et un contexte réels. Voir `SEO_STRATEGY.md`
  § 5 quater.
- **Métadonnées réécrites** : l'ancienne description annonçait des
  « photographies réelles et situées ». C'était faux.

### La transparence comme parti pris

Les photographies viennent d'une banque libre de droit. La page **le dit**,
en tête de collection et en pied de page, plutôt que de le taire. Un visiteur
qui reconnaît une image de banque non signalée cesse de croire le reste du
site ; prévenu, il lit la page pour ce qu'elle est.

Aucun titre ne porte de commune, de date, de client, de hauteur ni de durée.
Les titres décrivent une **situation**, les textes disent ce que la
photographie montre puis ce que cela implique techniquement — deux choses
vérifiables sur l'image elle-même.

### Deux découvertes en cours de phase

1. **`public/images/realisations/` ne contient que trois fichiers**, dont un
   déjà employé sur `/a-propos`. La collection a été complétée par deux
   photographies prélevées parmi les **inutilisées** du dossier `services/`,
   sans rien télécharger ni dupliquer. Trois à quatre photographies de
   chantier supplémentaires régleraient la question — décision client.
2. **La fiche de `abattage-tronconnage-grume.jpg` était fausse** : elle
   affirmait « aucun logo lisible » alors que la marque STIHL est
   parfaitement lisible. Corrigé dans `MEDIA_SOURCES.md`. Le cadrage du hero
   la sort du champ sous 1024 px, mais le point est à faire valider.

### Refactorisation induite

Le hero de `/realisations` a rencontré exactement le seuil de contraste
documenté en phase 8 : à 26rem avec le dégradé partagé, surtitre à 3,20.
Le dégradé « hero compact » servant désormais deux pages, il a été extrait en
primitive — **`src/components/ui/hero-scrim.tsx`**, deux variantes,
`default` et `compact`. Les quatre pages services et `/a-propos` l'adoptent :
la chaîne de 300 caractères n'existe plus qu'à un seul endroit, avec sa
justification chiffrée.

**Sortie atteinte :** aucun débordement de 320 à 1440 px. Un `h1` unique,
quatorze titres, hiérarchie `h2`/`h3` continue. Cinq images sur la page, une
seule en `priority` (le hero), les quatre autres en `lazy` avec cadre
d'aspect fixé — aucun CLS possible. Contrastes du hero au pixel le plus
défavorable : 6,35 / 7,77 / 10,97 en 320 px, 9,84 / 10,47 / 11,32 en 1440.
Aucune dépendance ajoutée. Lint, typecheck et build au vert.

*Resserrage :* les cartes de l'accueil étaient en 4/5 sur mobile, ce qui
portait la section à 2 167 px. Passées en 4/3 sous 1024 px : **1 642 px**.

### Phase 9B — Photothèque réalisations et transparence ✅

Correctif client sur la seule section Réalisations et la page
`/realisations`. La phase 9 était validée techniquement ; ce qui restait à
régler tenait entièrement à la **photothèque** et au **vocabulaire**.

- **Quatre photographies téléchargées** (Pexels, licence libre, aucune en
  Pexels+), portant `public/images/realisations/` de trois à sept fichiers.
  Détail complet dans `MEDIA_SOURCES.md` § 6.
- **Nouveau hero de `/realisations`.** L'ancienne photographie portait un logo
  STIHL parfaitement lisible et un avant-bras tatoué très reconnaissable ;
  elle est écartée, pas recadrée. La nouvelle est un abattage en forêt, EPI
  complet, visage masqué par la visière, cadrage 16/9 natif.
- **Plus aucune photographie sur deux pages.** Le broyeur servait sur trois
  emplacements (accueil, `/realisations`, `/a-propos`) ; il ne sert plus que
  dans la collection. `/a-propos` reçoit à la place une photographie de
  débitage, qui illustre le même paragraphe.
- **Titre d'accueil corrigé** : « Quelques interventions » laissait entendre
  des chantiers réellement menés. Remplacé par « Des interventions adaptées à
  chaque situation » — exact, et meilleur argument commercial.
- **Une seule mention de transparence**, en `Small` sous la collection. Elle
  était doublée : répétée, une précision honnête devient une mise en garde.
- **Collection portée de quatre à six entrées**, couvrant élagage, abattage,
  gestion du bois et évacuation.

**Quatre candidates ont été téléchargées puis supprimées** après inspection à
taille réelle : t-shirt SIEMENS, sweat d'une entreprise concurrente, broyeur
de marque dans un pavillon nord-américain, opérateur en baskets. Aucun de ces
détails n'était visible en vignette — d'où la règle ajoutée au registre :
**toute candidate se contrôle affichée en pleine largeur.**

*Non couvert :* aucune photographie d'entretien extérieur n'a été retenue,
faute de candidate montrant un professionnel équipé. La catégorie reste
absente de la collection.

**Sortie atteinte :** aucun débordement de 320 à 1440 px, contrastes du hero
7,46 / 8,51 / 11,25 en 390 px, sept images sur `/realisations` dont une seule
en `priority`. Lint, typecheck et build au vert. Aucune dépendance ajoutée.
---

## Phase 10 — Zone d'intervention et carte ✅

Section 6 des 7 sections verrouillées (`src/components/sections/zone.tsx`),
page `/zones-intervention`, et la carte elle-même
(`src/components/map/zone-map.tsx`).

### Données : réelles, publiques, figées dans le dépôt

Aucun tracé n'est dessiné à la main. Contours de la Normandie et de ses cinq
départements depuis **france-geojson** (d'après l'IGN, licence ODbL) ;
coordonnées des 18 communes depuis **`geo.api.gouv.fr`** (Étalab, Licence
Ouverte 2.0). Sources, licences et obligations : `MAP_DATA_SOURCES.md`.

Les sources brutes restent versionnées dans `data/geo/` : le pipeline demeure
reproductible même si un dépôt tiers disparaît.

### Zéro dépendance, et comment

Projeter du GeoJSON en SVG appelle `d3-geo`. Elle n'a pas été installée : la
projection tient en quinze lignes et s'exécute **à l'écriture**, pas au
runtime (`scripts/build-map-data.mjs`). Le site n'embarque que des chaînes `d`
figées — **273 Ko de GeoJSON réduits à 12 Ko de TypeScript**, sans perte
visible au-delà de 300 px.

Aucun appel réseau, aucune clé d'API, aucun fond de tuiles. Le coût réseau de
la carte est nul au-delà du HTML.

### Projection azimutale équidistante centrée sur Rouen

Choix imposé par ce que la carte affirme. En Mercator, un « cercle de 100 km »
n'en est pas un : la distance réelle varie de plusieurs kilomètres selon la
direction, et la carte mentirait discrètement. Dans cette projection, toute
distance depuis le centre est exacte — les quatre rayons sont de vrais
`<circle>` et chaque distance affichée est la bonne.

### Architecture : deux couches

SVG pour la géométrie, **HTML pour les points et les étiquettes**. Un `<text>`
SVG grandirait avec la `viewBox` ; un point HTML devient un vrai `<button>`,
avec focus clavier natif et cible tactile de 44 px. Détail dans
`DESIGN_SYSTEM.md` § 8 bis.

### Ce qui a été corrigé en cours de route, par la mesure

- **Bulles flottantes** sortant du panneau pour les communes de bord.
  Remplacées par une **ligne contextuelle unique** sous la carte, alimentée par
  le survol, le focus et le tap, annoncée en `aria-live`.
- **Étiquette du Havre hors cadre à 320 px.** Les étiquettes latérales
  basculent désormais sous le point en dessous de 480 px.
- **Paliers 25 et 50 km** tombant sur Elbeuf, Yvetot et Barentin. Ils ne sont
  plus étiquetés ; la légende et la ligne contextuelle portent l'information.
- **Le piège `cn()`, une seconde fois.** `"hidden"` et `"hidden lg:block"` en
  deux entrées ne masquent rien : `lg:block` l'emporte. La visibilité se
  calcule maintenant en une seule expression.
- **`overflow-visible` sur le SVG**, qui laissait la Manche déborder du
  panneau. Retiré : c'est la `viewBox` qui rogne, volontairement.

### Honnêteté du rayon

Un cercle de 100 km se lit comme une promesse de couverture. Le contraire est
écrit à **trois endroits** — chapô, bloc dédié, et chaque repère de la carte.
Aucune commune n'est présentée comme desservie. Caen, à 110 km, est chargée
dans les données mais jamais affichée.

Barentin, Louviers et Yvetot ne sont **pas** dans la Métropole Rouen
Normandie : le code le vérifie par code INSEE et ne les qualifie jamais ainsi.

**Sortie atteinte :** aucun débordement et **aucune collision d'étiquette** de
320 à 1440 px, vérifié par mesure des rectangles. Information de zone complète
en HTML — zone principale, rayon, département, distances — donc lisible sans
la carte. Repères navigables au clavier, `aria-live` sur la ligne
contextuelle. Séquence d'animation entièrement neutralisée sous
`prefers-reduced-motion`, avec l'état final comme défaut. Aucune dépendance
ajoutée. Lint, typecheck et build au vert.

*Aucune page locale créée*, conformément au § 3 de `SEO_STRATEGY.md` :
l'architecture les permet, aucune des quatre conditions n'est remplie.

### Phase 10B — Refonte visuelle de la carte et de la page ✅

Correctif client sur la seule section Zone et la page `/zones-intervention`.
La géographie de la phase 10 était juste ; sa **présentation** ne l'était pas.
Neuf griefs, tous fondés : rendu technique, carte trop petite, Normandie peu
lisible, quatre cercles concentriques dominants, étiquettes tassées, absence
de relief, section enfermée dans un panneau sombre, mobile compact, faible
sensation premium.

#### Ce qui a été refait

- **Sortie du panneau sombre.** La carte est posée sur l'ivoire, sans cadre.
  C'était le grief central : enfermée, elle passait pour une capture technique.
- **Un seul cercle de portée** au lieu de quatre anneaux de force égale, plus
  un palier pointillé presque invisible et un cœur de zone teinté. La zone se
  lit comme une étendue, pas comme un radar.
- **La Seine**, ajoutée depuis Natural Earth (domaine public). C'est elle qui
  rend Rouen identifiable au premier coup d'œil — un point sur un aplat vert
  ne dit rien à personne. Fondu radial pour que le fleuve ne pendouille pas
  aux bords du cadre.
- **Seine-Maritime appuyée**, les quatre autres départements en fond.
- **Cadre resserré de ±160 à ±120 km** : la portée occupe 83 % de la largeur
  contre 62 %.
- **Carte agrandie** : 641 px sur l'accueil et 736 px sur la page en 1440,
  contre 588 et 672. Sur mobile, 350 px contre 302.
- **Étiquettes réduites** de 6 à 5 sur l'accueil, de 11 à 8 sur la page.
  Légende supprimée : la carte se lit sans mode d'emploi.
- **Séquence d'animation réordonnée** : la géographie s'installe d'abord, la
  portée arrive en dernier. L'ancienne faisait naître quatre anneaux l'un
  après l'autre, soit exactement l'effet radar exclu par le brief.
- **Composition d'accueil ouverte** : texte sur cinq colonnes, carte sur sept,
  repères en lignes à filet au lieu d'un tableau à trois colonnes.
- **Page recomposée** autour de la carte, avec les communes de la métropole en
  **puces nominatives** — elles tiennent dans six kilomètres et ne peuvent pas
  être étiquetées sur une carte qui montre 100 km.

#### Correction de fidélité

La tolérance de simplification est passée de 1,1 à 0,7 km pour les
départements : à 1,1 km le littoral était rogné au point que **Le Havre,
pourtant en Seine-Maritime, tombait visuellement en mer**. Coût : 12 → 18 Ko
de données. La côte est un repère fort de cette carte.

**Sortie atteinte :** zéro collision d'étiquette et zéro débordement de 320 à
1440 px, vérifié par comparaison des rectangles à chaque largeur. Aucune
dépendance ajoutée, aucun appel réseau. Lint, typecheck et build au vert.

### Phase 10C — Refonte totale de la carte ✅

Deuxième rejet de la carte. Cette fois la consigne était explicite : **repartir
de zéro sur la conception**, sans amélioration incrémentale.

#### Le diagnostic

Les deux versions précédentes avaient la même faute : **le sujet était le
cercle de 100 km**, le territoire n'en était que le fond. D'où, mécaniquement,
les dix défauts listés par le client — territoire méconnaissable, villes dans
le vide, cercle dominant, rendu administratif, densité mobile catastrophique.

Aucun réglage ne pouvait corriger ça : à l'échelle du rayon, les communes de
la métropole sont à vingt pixels les unes des autres.

#### Le changement de sujet

| | Avant | Maintenant |
| --- | --- | --- |
| Cadre | cercle de 100 km | **la Seine-Maritime entière** |
| Cœur de zone | disque de 25 km inventé | **les 71 communes réelles de la métropole** |
| Couverture | 4 anneaux | **3 surfaces emboîtées** |
| Mer | inexistante | **aplat pierre, trait de côte réel** |
| 100 km | cercle dominant | **mention en bas de plaque** |
| Communes | tassées ou lointaines | **5, avec lignes de rappel** |

#### Deux sources géographiques ajoutées

- **Les 71 communes de la Métropole Rouen Normandie** (`geo.api.gouv.fr`,
  EPCI 200023414, Licence Ouverte). Dessinées séparément plutôt qu'unies : le
  filet interne donne la texture d'un vrai découpage administratif, là où un
  disque ne disait rien.
- **Les dix-neuf départements qui touchent le cadre**, et non les cinq normands.
  C'est ce qui permet la distinction terre/mer : sans eux, l'espace non
  couvert mélangeait la Manche et l'Oise.

#### Ce qui a débloqué le rendu

Le client a signalé en cours de route que la section « manquait de couleur et
de relief ». La cause était identifiable : **la terre avait la couleur exacte
du fond de page**. Le couple **mer pierre / terre ivoire**, plus la plaque à
coins arrondis, donne enfin un contraste figure/fond et quatre niveaux de
lecture.

#### Les lignes de rappel

Cinq communes dans dix kilomètres : leurs étiquettes sont déportées en étoile
et reliées par une ligne de rappel. C'est la seule façon de tenir « cinq
communes lisibles » et « aucune collision » ensemble. La longueur du rappel
est mise à l'échelle (`--map-leader` : 0,36 / 0,72 / 1) — mesuré, un rappel
pleine longueur poussait Mont-Saint-Aignan 11 px hors du cadre à 320 px.

Mont-Saint-Aignan a aussi vu son rappel redressé vers le nord, ce qui est
géographiquement plus juste **et** résout le débordement.

#### Reprise après retours client

Quatre demandes, toutes traitées :

- **« Des villes pour remplir l'espace »** — le cadre s'élargit à ±112 km et
  la carte passe de 5 à **16 communes** (21 après la seconde reprise) : la
  grappe de la métropole plus une couronne de repères choisis par **azimut**,
  pas par notoriété. Six
  communes ont été ajoutées aux données (Bolbec, Pont-Audemer, Vernon,
  Le Tréport, Lillebonne, Forges-les-Eaux).
- **« Un cercle d'intervention animé »** — la portée de 100 km revient, mais
  en **un seul cercle**, pointillé, tracé au `stroke-dashoffset` en dernier,
  par-dessus le territoire. Le cadre a été élargi exprès pour qu'il tienne
  entier : un cercle rogné aux quatre coins se lit comme une carte coupée.
- **« Des couleurs moins fades »** — la palette d'opacités empilées (3 à 16 %)
  cède la place à **quatre aplats opaques** déclarés en jetons
  (`--map-sea`, `--map-land`, `--map-region`, `--map-core`), dérivés des six
  couleurs de la charte. L'échelle de valeurs porte enfin la lisibilité.
- **« Des villes dans l'eau »** — Le Havre tombait en mer. Cause : le trait de
  côte était **doublement simplifié**, la version amont de france-geojson puis
  la nôtre à 0,7 km. Correction en deux temps : source pleine précision, et
  tolérance **par département** — 0,3 km pour la Seine-Maritime qui porte le
  littoral, 1 km pour les autres qui ne sont qu'un fond. Vérifié par test
  point-dans-polygone : Le Havre, Dieppe, Fécamp et Le Tréport sont tous à
  l'intérieur du tracé.
- **« Titre et texte au-dessus de la carte »** — la section d'accueil passe en
  bandeau : en-tête centré, trois colonnes de niveaux, puis la carte sur
  **toute la largeur du conteneur** (1 144 px en 1440, contre 715 en deux
  colonnes). Accueil et page partagent désormais le même jeu de repères.

#### Seconde reprise après retours client

Deux demandes de plus, et une correction qu'elles ont révélée :

- **« Les points de ville sont encore dans la mer »** — cette fois le reproche
  était **faux au sens strict et juste visuellement**. Le test
  point-dans-polygone, relancé sur les trente communes chargées, renvoyait
  **zéro commune hors terre** : la correction du trait de côte tenait. Mais
  les étiquettes du Havre, de Fécamp et du Tréport étaient posées **côté
  large**, et une étiquette en mer se lit comme une ville en mer. D'où la
  règle inscrite dans `map-content.ts` : *une commune littorale porte son
  étiquette vers l'intérieur des terres*. Le Havre est le cas limite — son
  étiquette part vers l'est, parce qu'au sud il y a l'estuaire.
- **« Encore de la couleur, c'est fade »** — seconde passe de saturation. Le
  cœur de zone passe d'un mélange à base de mousse à un mélange à base de
  **forêt** (62 % + mousse), la mer de 30 à 44 % de forêt. Surtout, le cercle
  de 100 km passe du vert au **jaune sécurité** : en forêt à 45 % il se
  confondait avec les limites départementales, alors que c'est l'élément que
  la section annonce dans son titre.
- **« Des villes dans le cercle des 100 km »** — la couronne, qui bordait la
  portée, la **remplit** désormais : Louviers (25), Yvetot (30), Pont-Audemer
  (42), Évreux (47), Vernon (48), Gisors (52) et six autres sont à l'intérieur
  du cercle. Vingt et un repères au total, tous à moins de 100 km. Caen
  (110 km) a été retirée des données : la montrer laisserait croire qu'elle
  est dans la portée annoncée.

Deux communes ont été **retirées de l'affichage** à la mesure, non à l'œil :
Gournay-en-Bray (même azimut que Beauvais) et Honfleur (coincée entre
Pont-Audemer et Lisieux). Aucun placement ne les libérait.

La cadence de pose des repères est passée de 110 à **60 ms** : à 21 repères,
110 ms faisait durer la seule pose 3,3 s et le semis devenait un égrenage.

**Sortie atteinte :** zéro collision et zéro débordement sur les **deux
pages**, aux six largeurs 320 / 390 / 430 / 768 / 1024 / 1440, vérifié par
comparaison deux à deux des rectangles de toutes les étiquettes et par test de
contenance dans la plaque. Carte de 280 px (mobile) à 1 144 px (accueil,
1440 px) ; 960 px sur la page. Animation de 2,9 s, sans boucle. Aucune
dépendance ajoutée, aucun appel réseau. Lint, typecheck et build au vert.

---

## Phase 11 — Configurateur de devis (UI) ✅

Interface complète des 5 étapes VERROUILLÉES, **sans aucun envoi**.

### Architecture

Un seul composant client, `QuoteConfigurator`, monté dans une page qui reste
serveur. `src/lib/quote-flow.ts` porte le modèle, les options et la validation
sans une ligne de JSX : les règles sont ainsi isolées de l'affichage et
transposables telles quelles côté serveur en phase 13, comme l'exige
`QUOTE_FLOW.md` § 4.

### Deux écarts avec la spécification, demandés au brief

- **Étape 1 ramenée à cinq choix uniques** (les 4 pages services + « je ne sais
  pas ») au lieu d'une sélection multiple parmi 8 prestations, plus urgence et
  type de demandeur. Trois questions à la première étape, dont deux sans effet
  sur le chiffrage.
- **Étape 2 ramenée à trois questions** au lieu de six, dont une seule
  adaptative : la hauteur disparaît quand elle n'a pas de sens (souche, haie).

Le récapitulatif éditable exigé par `QUOTE_FLOW.md` § 2 est livré **dans
l'étape 5**, pas en sixième étape : le brief l'interdisait explicitement.

### Décisions notables

- **`aria-disabled` plutôt que `disabled`** sur « Continuer ». Un bouton
  réellement désactivé sort de la tabulation et n'explique rien. Ici il paraît
  inactif, reste atteignable, et le clic affiche ce qui manque — seule façon de
  tenir ensemble « désactivé si informations manquantes » et « l'erreur doit
  être découvrable ».
- **Aucun rouge.** La charte n'en contient pas et il n'en a pas été introduit :
  une erreur se signale par un filet épaissi en jaune sécurité, un pictogramme
  et un texte explicite — trois signaux dont aucun n'est chromatique seul.
- **Le brouillon n'est jamais réinjecté d'office** : la reprise est proposée
  par un bandeau, puis choisie. Retrouver un formulaire pré-rempli sans l'avoir
  demandé surprend, et sur un poste partagé cela expose des coordonnées.
- **`useSyncExternalStore` pour lire `sessionStorage`**, pas un `setState` dans
  un effet : c'est la seule lecture qui donne un rendu serveur cohérent sans
  écart d'hydratation ni rendu en cascade.
- **L'écran final ne dit pas « envoyé »**, parce que rien ne l'est. Le site
  étant déployé publiquement, une confirmation fabriquée serait un mensonge
  affiché à un visiteur réel.

### Trois défauts trouvés à la mesure, pas à l'œil

1. **Les refus de photos ne s'affichaient jamais** : le tableau des messages
   était rempli à l'intérieur d'un updater `setPhotos`, donc lu vide à
   l'extérieur — et dupliqué au double passage de développement. Tri déplacé
   avant toute mise à jour d'état.
2. **Le configurateur s'étalait sur 1 144 px au lieu de 832** : `cn()` ne
   fusionne pas les classes concurrentes, `max-w-content` restait posée à côté
   de `max-w-[52rem]`. Troisième occurrence de ce piège dans le projet.
3. **Le voile de la section 7 passait derrière la photo** (`-z-10` sur un
   frère lui-même positionné) : le titre se retrouvait sur une image en pleine
   lumière. Corrigé, puis vérifié par recomposition — 13,91 et 9,46.

**Sortie atteinte :** parcours complet réalisable au clavier ; focus déplacé
sur le titre à chaque étape ; cibles tactiles à 44 px minimum mesurées ; zéro
débordement horizontal à 320 / 390 / 430 / 768 / 1024 / 1440 px sur l'accueil
et sur `/devis` ; aucune dépendance ajoutée ; lint, typecheck et build au vert.

- Coquille des 5 étapes de `QUOTE_FLOW.md`, sans logique d'envoi
- Progression annoncée textuellement, navigation avant/arrière
- Étape reflétée dans l'URL

**Sortie :** parcours complet cliquable au doigt et au clavier, à 390 px.

---

## Phase 12 — Logique du configurateur et photos locales ✅

La phase 11 avait livré l'interface ; la phase 12 livre le **fonctionnement**,
toujours sans une seule requête réseau.

### Découpage

Le composant de 630 lignes qui portait tout est réduit à une **vue**. La
logique est répartie ainsi :

| Fichier | Rôle |
| --- | --- |
| `src/lib/quote/types.ts` | Modèle, union discriminée du chantier |
| `src/lib/quote/options.ts` | Étapes, options, libellés, limites photos |
| `src/lib/quote/conditional.ts` | Questions par prestation, changement de besoin |
| `src/lib/quote/validation.ts` | Règles, pures et sans dépendance |
| `src/lib/quote/persistence.ts` | `sessionStorage`, ce qui est stocké et ce qui ne l'est pas |
| `src/lib/quote/events.ts` | Points d'émission, inertes |
| `src/components/quote/use-quote-state.ts` | Tout l'état, hors de la vue |

`src/lib/quote/` ne contient **ni JSX, ni React** : les règles y sont lisibles
d'un bloc et sans contexte d'affichage, donc transposables sans ambiguïté dans
l'endpoint PHP de la phase 13. `validation.ts` fait foi.

### Le type porte la règle métier

Le chantier est une **union discriminée par `kind`** plutôt qu'un objet plat
rempli de champs facultatifs. Lire `hauteur` sur un dessouchage est désormais
une **erreur de compilation**. « Une souche n'a pas de hauteur » n'est plus une
convention à respecter, c'est une contrainte du compilateur.

### Trois décisions notables

- **Restauration automatique après rechargement**, ce que la phase 11 refusait.
  Le refus était justifié tant que le stockage contenait des coordonnées ; il
  ne l'est plus depuis qu'il n'en contient aucune. La règle a changé parce que
  le risque a disparu, pas par confort.
- **Aucune déduction de zone à partir du code postal.** La version précédente
  lisait les deux premiers chiffres pour annoncer « dans le rayon ». Un
  département n'est ni un rayon ni une zone desservie : c'était une
  approximation présentée comme un fait. Message unique et vrai désormais.
- **Le focus est sorti du hook.** `react-hooks/refs` refuse qu'un objet
  contenant un `RefObject` traverse le rendu — à juste titre. Le focus est de
  toute façon une préoccupation de vue, pas de logique métier.

### Douze scénarios exécutés, pas douze scénarios prévus

A à L, déroulés dans le navigateur. Résultats notables :

- **dessouchage** : aucune question de hauteur, une question de taille ;
- **entretien extérieur** : travaux + ampleur, ni nombre ni hauteur ;
- **je ne sais pas** : zéro champ technique, « Continuer » actif d'emblée ;
- **arbre → souche** : « 4 à 10 » et « accès difficile » conservés, hauteur
  vidée ; **élagage → abattage** : rien perdu ;
- **photos** : 5 acceptées, 6ᵉ refusée, doublon refusé (« est déjà jointe »),
  PDF refusé, 11 Mo refusé avec le poids affiché ;
- **téléphone** : `0612345678`, `06 12 34 56 78`, `+33 6 12 34 56 78`,
  `06.12.34.56.78`, `0033612345678` acceptés ; `06 12 34` refusé ;
- **stockage** : **212 octets**, sans nom, téléphone, e-mail ni commentaire —
  vérifié par recherche de chaîne sur le contenu réel ;
- **rechargement à l'étape 5** : étape restaurée, coordonnées vides, bandeau
  « photos à ajouter de nouveau ».

**Sortie atteinte :** zéro débordement horizontal à 320 / 390 / 430 / 768 /
1024 / 1440 px ; champs à 17 px (pas de zoom iOS) ; **aucune dépendance
ajoutée** ; lint, typecheck et build au vert.

*Tests automatisés :* aucun. Le projet n'a pas d'infrastructure de tests, et en
monter une supposait soit une dépendance, soit une modification de `tsconfig`
et de la convention d'import de tout le module — au-delà de « quelques tests
ciblés ». Les modules de `src/lib/quote/` sont en revanche **conçus pour être
testables** : fonctions pures, sans React ni DOM. Un exécuteur peut être ajouté
en une étape le jour où le projet en accueille un.

## Phase 13 — Envoi de la demande par e-mail ⬜

**Architecture VERROUILLÉE**, simplifiée après la phase 12 :

```
Next.js (statique)
  └── multipart/form-data
        └── endpoint PHP (Hostinger)
              ├── validation serveur
              ├── envoi SMTP  →  adresse unique de l'entreprise
              └── suppression des fichiers temporaires
```

- `fetch` en **multipart/form-data** depuis `submit()` — point de branchement
  unique, déjà isolé en phase 12.
- **Endpoint PHP sur Hostinger**, pas de route Next.js : le site est
  intégralement statique, lui ajouter un runtime Node imposerait un hébergement
  applicatif pour une seule fonction. PHP est déjà là.
- **Revalidation côté PHP** de toutes les règles de `validateStep()`.
- **Un seul e-mail**, à l'entreprise, `reply-to` sur l'adresse du client.
- **Photos** : reçues en temporaire, contrôlées (type MIME réel, taille,
  nombre), jointes à l'e-mail, puis **supprimées**.
- Honeypot, délai minimal de remplissage, limitation de débit.
- Écran de confirmation réel côté client.

**Écartés explicitement** — et c'est la simplification qui définit cette
phase : base de données, stockage objet, liens signés, CRM, numéro de demande,
accusé de réception au prospect, conservation des demandes. **L'e-mail est
l'enregistrement.** Rien à sécuriser dans la durée, rien à purger, rien à
déclarer au titre d'une conservation.

**Bloqué pour l'instant :** le site n'est ni hébergé sur Hostinger ni rattaché
à un domaine. **Aucun SMTP réel ne doit être configuré avant.** Les identifiants
d'envoi et l'adresse de réception vivront dans la configuration du serveur,
jamais dans le dépôt.

**Sortie :** demande de bout en bout reçue par e-mail avec ses photos ; aucun
fichier conservé sur le serveur ; aucun secret exposé.

---

## Phase 14 — SEO technique, SEO local et pages villes ✅

### Vingt-trois pages locales

Une par commune de la carte, sous `/zones-intervention/[ville]`,
entièrement générées au build par `generateStaticParams` — aucun runtime
Node, le site reste exportable tel quel.

> Le brief annonçait « 22 pages » mais en énumérait **23** (Rouen → Amiens,
> 23 URLs). La liste explicite a été suivie.

### Source unique

`src/content/locations.ts` fait foi pour la carte, les pages, le hub, le
maillage et le sitemap. Avant, la liste vivait à trois endroits — et
divergeait déjà : Saint-Étienne-du-Rouvray et Elbeuf étaient cités dans le
texte de `/zones-intervention` sans exister sur la carte. Les deux ont
rejoint la carte et ont leur page.

**Les coordonnées saisies à la main étaient fausses.** Écrites de mémoire,
elles s'écartaient jusqu'à 2,3 km des centroïdes officiels — sans que les
distances arrondies au kilomètre le laissent voir. Elles ont été remplacées
par les valeurs de `geo.api.gouv.fr`, et un contrôle automatique refuse
désormais tout écart.

### Trois niveaux, définis par des faits

| Niveau | Règle | Nombre |
| --- | --- | --- |
| `core` | membre de la Métropole Rouen Normandie | 7 |
| `primary` | ≤ 60 km de Rouen | 9 |
| `extended` | > 60 km de Rouen | 7 |

Ce découpage reproduit exactement les exemples du brief, sans qu'aucune
commune ait été classée à la main.

### Anti-doorway : mesuré, pas espéré

**70 à 89 % de phrases propres** par page ; la paire la plus proche
(Fécamp / Yvetot) ne partage que **30 %** de ses phrases. Le contrôle
échoue si deux pages partagent une phrase éditoriale.

### Carte interactive

Les 23 points renvoient vers leur page. **22 étiquettes permanentes, 1
différée** (Saint-Étienne-du-Rouvray, trop au cœur de la grappe) : le point
existe et reste cliquable, le nom apparaît au survol, au focus ou au tap.
C'est la hiérarchisation demandée — zéro collision mesurée aux six largeurs.

### Audit SEO de toutes les routes

Mené sur le **HTML réellement produit**, pas sur les intentions :

- 38 documents analysés, **1 seul `h1` par page** partout ;
- **aucune canonique émise**, aucune occurrence de `localhost` ni de
  `vercel.app` ;
- `noindex, follow` sur toutes les pages publiques ;
- titres de 28 à 60 caractères, descriptions jusqu'à 160 — **aucune
  duplication** de titre ni de description ;
- sitemap **vide** et `robots.txt` sans ligne `Sitemap`, conformes au
  mode préproduction.

**Un défaut trouvé et corrigé : la page 404 héritait du titre de la page
d'accueil.** Deux URLs portaient le même `<title>`. `src/app/not-found.tsx`
a été créée, avec son propre titre, sa description, et un `noindex` **en
dur** — une 404 ne s'indexe jamais, y compris après le lancement.

*Reste `/_global-error`, page interne de Next sans `<meta robots>` : ce
n'est pas une URL routable, elle n'est ni liée ni au sitemap.*

### Données structurées

**Aucun `LocalBusiness` par commune** : une entreprise, une fiche. Une
page ville décrit une zone de service, pas une agence. Seul un
`BreadcrumbList` est prévu, et il reste inactif tant que le site n'est pas
indexable — d'où **0 JSON-LD** dans le HTML actuel, ce qui est le
comportement attendu en préproduction.

### Documentation

- `SEO_STRATEGY.md` § 5 sexies (pages locales), § 9 bis (check-list Google
  Business Profile, 16 points), § 9 ter (check-list de passage en production,
  12 points). La règle `VERROUILLÉ` du § 1 qui interdisait les pages villes
  a été **amendée explicitement**, en nommant qui l'a levée et par quel
  garde-fou mesuré elle est remplacée.
- `CONTENT_STRATEGY.md` § 5 sexies : de quoi parle un texte local, et la
  liste de ce qui y est interdit.

**Sortie atteinte :** 40 routes générées (17 + 23), `SITE_INDEXABLE` reste
`false`, zéro débordement horizontal et zéro collision de carte aux six
largeurs, aucune dépendance ajoutée, lint, typecheck et build au vert.
## Phase 15 — Performance, mobile, accessibilité ✅

Audit mené sur le **build de production**, pas sur le serveur de
développement. Mesures complètes et conditions dans `PERFORMANCE_AUDIT.md`.

### Résultat

| | Avant | Après |
| --- | --- | --- |
| Accessibilité | 96-100 | **100 sur les 8 mesures** |
| Bonnes pratiques | 96 | **100 sur les 8 mesures** |
| Performance | 95-98 | 94-99 |
| CLS | 0 | **0** |

Le SEO reste à 63-66 : `is-crawlable` échoue parce que le site répond
`noindex` en préproduction. **C'est le garde-fou qui fonctionne**, pas un
défaut — il remontera seul en phase 18.

### Sept défauts trouvés, sept corrigés

1. **Onze liens du pied de page à 36 px** — sous la règle des 44 px que le
   projet s'impose. Seul endroit du site où elle était enfreinte.
2. **Logotype à 40 px** — même règle.
3. **Nom accessible du logotype ne contenant pas son texte visible**
   (WCAG 2.5.3), sur l'en-tête *et* le pied de page. Une commande vocale
   « clique sur Arbres et Cimes » ne trouvait pas la cible.
4. **Invite de la carte à 2,86 de contraste** — une `opacity-70` empilée
   sur un jeton déjà mis en sourdine.
5. **`favicon.ico` absent** — 404 en console. Icône typographique ajoutée,
   dans la continuité du logotype provisoire, sans inventer de symbole.
6. **Ligne de 164 caractères en 1440 px** dans la section devis.
7. **Opacité redondante** sur l'animation du titre du hero.

### Un point reste OUVERT

Sur la page d'accueil, Chrome attribue le LCP au **logotype de l'en-tête**
(146 × 22 px). La photographie du hero (329 160 px²) n'est **jamais**
candidate, alors qu'elle est `eager`, `fetchPriority="high"`,
préchargée, non animée, et à 0,59 bit/pixel — bien au-dessus du seuil
d'exclusion de Chrome.

L'opacité redondante du `h1` a été retirée (elle l'excluait à juste titre
pendant 990 ms) : le titre est désormais opaque dès la première image, et
**reste non candidat**. La correction est juste sur le fond mais n'a pas
déplacé la métrique — 3,0-3,2 s après contre 2,9-3,7 s avant, dans le bruit
de mesure (±0,3 s relevé sur trois passages).

Ce n'est pas une urgence : **FCP 0,9 s**, **Speed Index 0,9 s**, **CLS 0**,
**TBT 30-40 ms**, et les sept autres routes sont entre 2,0 et 2,7 s. À
revérifier sur le domaine de production, en conditions réseau réelles.

### Non testable avec l'outillage actuel

**Le clavier réel** : l'automatisation ne délivre pas les événements clavier
à l'onglet (vérifié — un écouteur `keydown` ne reçoit rien). L'audit a été
mené structurellement ; la tabulation de bout en bout **reste à faire à la
main**. Idem pour le clavier virtuel sur téléphone réel.

### Vérifié sans rien changer

Zéro débordement horizontal aux **huit largeurs** (320 → 1440) ; un seul
`h1` par page sur 38 documents ; aucun ID dupliqué ; aucune imbrication
invalide ; champs du devis tous étiquetés, à 16 px (pas de zoom iOS) ;
aucune erreur console ; aucune tâche longue.

**Mouvement réduit vérifié empiriquement** : sous
`--force-prefers-reduced-motion`, la page entière est visible, carte
comprise.

**Sortie atteinte :** lint, typecheck et build au vert, 40 routes,
`SITE_INDEXABLE` toujours `false`, aucune dépendance ajoutée.
### Phase 15B — Logotype réel et correction du nom ✅

Le client a fourni son logo. Deux conséquences, dont une qui dépassait la
simple intégration graphique.

**Le nom du site était faux.** Le logo porte « Arbres et Cimes Élagage », au
pluriel ; tout le site écrivait « Arbre et Cime ». **77 occurrences
corrigées dans 22 fichiers**, code et documentation compris.

Effet de bord mesuré : le nom gagnant deux caractères, **trois titres
dépassaient 60 caractères**. Raccourcis — « Zones d'intervention depuis
Rouen », « Devis d'élagage gratuit », « Entretien extérieur à Rouen ». Tous
les titres tiennent désormais (max 60), aucun dupliqué.

**Le logo ne s'intègre pas tel quel.** C'est un bloc vertical dessiné pour
fond clair :

- dans l'en-tête (72 px), son texte tomberait sous 8 px ;
- dans le pied de page (forêt), son texte charbon devient quasi illisible —
  vérifié à l'écran après un premier essai.

D'où le **lockup** : symbole réel + nom composé dans la typographie du site.
La variante `variant="full"` existe et attend une **version claire du
logo**, à demander au client.

**CTA « Demander un devis » retiré du pied de page**, sur demande. Il reste
accessible depuis l'en-tête, la barre d'action mobile et le bloc de
conversion qui termine chaque page. Le lien « Devis gratuit » de la colonne
de navigation demeure : c'est un lien de liste, pas un appel à l'action.

Icônes réelles en place (`favicon.ico`, `icon.png`,
`apple-icon.png`) ; l'icône typographique provisoire de la phase 15 est
retirée.

*Non modifié, et signalé au client :* le logo porte « **Arboriste
Grimpeur** » là où le site dit « **Élagueur-grimpeur** ». Ce second terme
est le mot-clé SEO principal — il porte les 23 `h1` des pages villes et
l'essentiel des titres. Le changer est une décision éditoriale, pas une
correction ; elle n'a pas été prise sans demande explicite.

**Sortie atteinte :** lint, typecheck et build au vert, 40 routes, titres et
descriptions tous conformes, `SITE_INDEXABLE` toujours `false`.

---

### Phase 15B.1 — Nouveau langage visuel ✅

La direction éditoriale (serif expressive, grands filets, hauteur de section
unique) a été jugée trop magazine pour un site de service. Cette sous-phase
refait **les fondations**, pas les pages.

**Aucune page n'a été retouchée** — c'était la contrainte. Elles héritent
pourtant du nouveau langage, parce que les changements portent sur les
jetons et les primitives, jamais sur les vues.

### Ce qui change

- **Sora + Inter** remplacent Fraunces + Manrope. Graisses explicites (600/700
  et 400/500/600) plutôt que deux fontes variables : le projet n'en utilise
  que cinq.
- **Palette** : huit jetons au lieu de six — `deep-forest` et `sand`
  s'ajoutent. **Les noms ne changent pas, seules les valeurs**, ce qui évite
  toute retouche de page.
- **Quatre surfaces** au lieu de deux : l'alternance clair/sombre se fait
  sans CSS dupliqué.
- **Trois rythmes verticaux** (`compact`, `standard`, `signature`). Les noms
  de la phase 2 restent acceptés et pointent sur les nouveaux jetons.
- **Nouvelles primitives** : `Card` / `CardLink`, `Capsule` / `CapsuleGroup`,
  `SectionPattern`. Toutes **composants serveur**, aucune n'a besoin de JS.
- **Boutons refaits** : quatre variantes, rayon 12 px, état `loading`.
- **Figure** : rayon `card`, calques `scrim` et `gradient`.

### Une primitive plutôt que sept composants

Le brief listait sept usages de carte. Ils ne diffèrent que par la surface,
le rembourrage et le fait d'être cliquables : sept composants auraient
produit sept fois la même logique d'état, avec sept occasions de diverger.
Une primitive, cinq tons, la composition laissée à l'appelant — ce qui évite
aussi la grille de cartes identiques que `CLAUDE.md` § 6 interdit.

### Un défaut trouvé pendant la phase, et corrigé

Le `Label` du style-guide portait `opacity-80` sur un jeton **déjà mis en
sourdine** : contraste **3,53**, sous le seuil AA. C'est exactement la règle
écrite en phase 15 (« ne pas empiler une opacité sur un jeton atténué »),
enfreinte dans le fichier qui sert de référence. Corrigé — le style-guide
repasse à **100**.

### Mesures

| | Avant (phase 15) | Après |
| --- | --- | --- |
| Accessibilité `/` | 100 | **100** |
| Accessibilité `/devis` | 100 | **100** |
| Accessibilité `/style-guide` | — | **100** |
| Performance | 94-99 | 96-97 |
| CLS | 0 | **0** |
| Polices préchargées | 60 Ko | **76 Ko** |

Les 16 Ko de polices supplémentaires sont le coût assumé du changement
typographique : cinq graisses réellement employées, aucune superflue.

*Signalé sans être poursuivi :* Lighthouse relève `image-aspect-ratio` sur
l'emblème de l'en-tête — artefact d'arrondi de l'optimiseur (ratio servi
1,143 contre 1,148 déclaré, soit 0,4 %). Le corriger imposerait de servir une
image deux fois plus lourde pour un écart invisible. Il vient de
l'intégration du logo (15B), pas de cette phase.

**Sortie atteinte :** lint, typecheck et build au vert, 40 routes,
`SITE_INDEXABLE` toujours `false`, aucun `localhost` dans le HTML, **aucune
dépendance ajoutée**.

---

### Phase 15B.2 — Châssis : en-tête, navigation, CTA, pied de page ✅

La 15B.1 avait refait les jetons sans toucher aux pages. Cette sous-phase
applique la nouvelle direction au **châssis**, et à lui seul.

### Ce qui change

- **Cinq entrées de navigation** — Prestations (groupe), Réalisations, Zones,
  À propos, **Contact** — plus le CTA devis. `Contact` devient une entrée
  principale : c'est le second chemin de conversion.
- **Le CTA devis devient un bouton plein** (jaune sécurité, texte forêt,
  contraste 8,06) au lieu d'un lien souligné. Dans une barre de navigation,
  un lien souligné se lit comme une entrée de menu de plus.
- **Contact centralisé** dans `src/lib/site.ts` : `contact.phoneConfirmed`,
  `contact.emailConfirmed`, `mailtoHref()`, `telHref()`.
- **Pied de page sur forêt profond**, en deux zones : conversion, puis
  pied compact — identité et coordonnées à gauche, trois colonnes de liens
  à droite. Les coordonnées ont quitté la grille : l’adresse e-mail a besoin
  de 180 px et la colonne n’en faisait que 76.
- **Menu mobile monté à l'ouverture seulement.**
- **Le `Reveal` n'anime plus l'opacité** (voir ci-dessous).

### Le bouton « Appeler » n'existe pas, et c'est voulu

Le numéro du client n'est pas confirmé. `contact.phoneConfirmed` est donc
faux, et **aucun bouton d'appel n'est rendu** — ni en-tête, ni menu mobile,
ni barre d'action, ni pied de page. Aucun numéro fictif n'a été écrit nulle
part.

Renseigner `NEXT_PUBLIC_PHONE` les fait tous apparaître d'un coup, sans
toucher une ligne de composant.

> **Conséquence pour la phase 16 :** le parcours d'appel n'est pas mesurable
> aujourd'hui. Les repères `data-cta="appel"` existent mais ne sont rendus
> par aucun élément.

### Un effet supprimé plutôt qu'optimisé une troisième fois

Le fondu du `Reveal` faisait tomber le contraste à **2,10** sur
`/zones-intervention/rouen` et **1,22** sur `/realisations`. La phase 15
avait resserré sa plage de 60 % à 40 % ; cette phase l'a d'abord plafonnée à
`min(40%, 180px)`. **Les deux réglages ont échoué de façon identique** — un
fondu lié au défilement traverse toujours des valeurs intermédiaires.

`CLAUDE.md` § 7 tranche : l'effet est supprimé, pas optimisé. Le `Reveal`
n'anime plus que `translateY`.

Ces deux routes n'avaient jamais été auditées — `/realisations` était absente
du tableau de la phase 15. Le défaut est donc **préexistant**, révélé par un
périmètre d'audit élargi de 8 à 13 routes.

### Le point laissé ouvert en 15B.1 est résolu

`image-aspect-ratio` était mis sur le compte d'un arrondi de l'optimiseur
(0,4 %). La vraie cause est ailleurs : le menu mobile, monté en permanence,
laissait une **seconde image de logotype dans une boîte de 0 × 0 px**.
L'audit calculait un rapport sur cette boîte. Le montage conditionnel du
panneau supprime le signalement — l'emblème de l'en-tête, lui, était
conforme.

### Un défaut d'outillage, pas de site

Le premier passage donnait a11y 96 et best practices 88, avec un `500` sur un
chunk JavaScript : le serveur servait un build remplacé à chaud. Après
redémarrage propre et **sans aucune modification de code**, a11y 100.

> **Redémarrer le serveur de production après chaque build avant de mesurer.**

### Mesures

| | Phase 15 | Phase 15B.2 |
| --- | --- | --- |
| Routes auditées | 8 | **13** (15 passages) |
| Accessibilité | 100 | **100 partout** |
| Bonnes pratiques | 100 | **100 partout** |
| Performance | 94-99 | 92-99 |
| CLS | 0 | **0 partout** |
| Débordement horizontal | — | **0 sur 48 combinaisons** |
| Cibles sous 44 px | 0 | **0** |

Balayage responsive : 8 routes × 6 largeurs (320, 390, 430, 768, 1024,
1440 px).

*Corrigé au passage :* le préchargement des photos LCP ne portait pas
`fetchpriority="high"` — `priority` sur `<Image>` pose le `<link>` mais pas
l'attribut. Corrigé sur `service-page.tsx`, `/a-propos` et `/realisations`,
vérifié dans le HTML servi.

*Reste ouvert :* l'attribution du LCP sur `/` (voir `PERFORMANCE_AUDIT.md`
§ 5). À revérifier sur le domaine de production.

**Sortie atteinte :** lint, typecheck et build au vert, `SITE_INDEXABLE`
toujours `false`, **aucune dépendance ajoutée**, aucun numéro inventé.

---

### Phase 15B.3 — Refonte visuelle de la page d'accueil ✅

Les jetons (15B.1) puis le châssis (15B.2) étant refaits, cette sous-phase
applique la direction à **la page d'accueil**. Les sept sections verrouillées
et leur ordre sont inchangés ; aucune autre page n'est touchée.

### Le vrai défaut était le rythme, pas les sections

Mesuré avant toute modification, à 1440 px : **six sections sur sept étaient
claires**, et cinq consécutives partageaient le même ivoire — 6 855 px d'aplat
ininterrompu. La seule rupture était une bande de preuves de 121 px.

Nouveau rythme : photo → **sable** → ivoire → **forêt profond** → **sable** →
ivoire → **sable + carte forêt profond**. Deux sections voisines ne partagent
plus jamais la même surface.

### Ce qui change, section par section

- **Hero** — hauteur 900 → 640 px (le bouton tombait sous la ligne de
  flottaison), colonne 896 → 1 088 px, trois capsules à la place du surtitre.
  La direction artistique deux sources est **conservée et vérifiée au réseau**.
- **Preuves** — bande de filets → quatre cartes KPI sur sable.
- **Prestations** — grille 2 × 2 de cartes identiques → **grille asymétrique**
  7/5 puis 5/7, sur deux hauteurs.
- **Pourquoi** — quatre paragraphes sur ivoire → **forêt profond**, grande
  carte photo (5/12) et quatre cartes de confiance (7/12).
- **Réalisations** — trois vignettes égales → **une grande carte et deux
  petites**, sur sable.
- **Zone** — carte et moteur **inchangés** ; capsule, cartes d'information,
  CTA « Explorer toutes les zones ».
- **Devis** — trois moments numérotés → **carte forêt profond sur bande
  sable**. La bande claire est ce qui empêche la carte de fusionner avec le
  pied de page sombre, problème déjà rencontré en phase 11.

### L'alignement centré n'a pas été touché

Le brief demandait au hero d'« utiliser davantage la largeur ». C'est une
question de largeur, pas d'alignement : le centrage de tout le contenu est une
**décision client** posée une fois pour toutes dans `globals.css`
(`DESIGN_SYSTEM.md` § 4). La colonne a été élargie, pas ferrée à gauche.

### Le point LCP resté ouvert depuis la phase 15 est résolu

`/` n'avait, depuis la phase 15, **aucune phase de chargement de ressource**
dans sa décomposition LCP : la métrique était attribuée à un élément de texte,
la photographie du hero n'étant jamais candidate. Elle l'est désormais, relevé
sur deux passages consécutifs.

Conséquence sur le chiffre : LCP 3,2-3,3 → 3,6-3,8 s, performance 92-93 →
89-90. **Le chiffre a empiré, la mesure s'est améliorée** — les deux valeurs ne
décrivent pas le même élément.

### Deux défauts trouvés en mesurant

1. **`images.qualities` manquait dans `next.config.ts`.** Next 16 n'honore que
   les qualités déclarées : le hero demandait 78 depuis la **phase 5B**, les
   cartes services 68, et les deux étaient servis à 75 **sans le moindre
   avertissement**. Vérifié dans le HTML : 173 URLs d'images, toutes en `q=75`.
   Corrigé — poids images de la page : 393 → **328 Ko**.
2. **Capsules du hero à 3,64 de contraste.** `variant="dark"` pose un fond
   d'ivoire à 10 %, qui ne masque rien sur une photographie. Nouvelle variante
   `photo` (forêt 80 %) : **11,53** sur la photo servie, 8,05 dans le pire cas
   théorique.

### Un palier tablette manquait depuis l'origine

Les grilles passaient de 1 à 12 colonnes sans rien entre 480 et 1024 px. À
768 px, Prestations mesurait 2 069 px et Réalisations 2 098 px.
`md:grid-cols-2` ramène la page de 8 589 à **7 114 px** à cette largeur.

### Mesures

| | Avant | Après |
| --- | --- | --- |
| Accessibilité `/` | 100 | **100** |
| Bonnes pratiques `/` | 100 | **100** |
| CLS | 0 | **0** |
| Performance `/` | 92-93 | 89-90 |
| LCP `/` | 3,2-3,3 s (texte) | 3,6-3,8 s (**photo du hero**) |
| Poids images de la page | 393 Ko | **328 Ko** |
| Hauteur de `main` en 390 px | 8 967 px | **8 409 px** |
| Hauteur de `main` en 768 px | 8 589 px | **7 114 px** |
| Section la plus longue en 390 px | 2 005 px | **1 883 px** |
| Débordement horizontal (6 largeurs) | 0 | **0** |
| Cibles sous 44 px | 0 | **0** |

**Sortie atteinte :** lint, typecheck et build au vert, `SITE_INDEXABLE`
toujours `false`, métadonnées et données structurées **non touchées**, moteur
cartographique **non touché**, **aucune dépendance ajoutée**, aucune image
générée, aucune nouvelle photographie téléchargée.

---

### Phase 15B.4 — Pages services, À propos et Réalisations ✅

Après les jetons (15B.1), le châssis (15B.2) et la page d'accueil (15B.3),
cette sous-phase refait **six pages** : les quatre services, `/a-propos` et
`/realisations`. `/zones-intervention`, les pages villes, `/contact` et
`/devis` ne sont pas touchés.

### Quatre pages services qui étaient quatre clones

Mesuré avant modification : **même hero de 608 px, mêmes cinq sections, même
dernière section de 1 158 px**, totaux entre 4 144 et 4 487 px. Et sur les six
pages, la seule rupture de surface était le hero — tout le reste était ivoire.

Le gabarit reste unique ; c'est le **parcours de surfaces** qui change, déclaré
dans `services-content.ts` :

| Page | Ouvre sur |
| --- | --- |
| `/elagage` | forêt — le hero se fond dans la barre d'en-tête |
| `/abattage` | forêt profond — la teinte la plus dense, la prestation la plus technique |
| `/dessouchage` | sable — une prestation de sol, photographie panoramique |
| `/entretien-exterieur` | ivoire — la plus claire, cadrage 21/9 |

Dans chaque page, deux sections voisines ne partagent jamais la même surface.

### La forme de la photo décide de la composition

`heroLayout` vaut `cote` ou `dessous` : une carte verticale se pose à côté du
texte, une carte panoramique dessous, pleine largeur. Champ **déclaré**, pas
déduit d'une classe CSS — une première version cherchait `16/` dans le nom de
la classe de cadrage, ce qui se serait cassé en silence au premier changement
de ratio.

### Aucune perte de contenu, et c'est vérifié automatiquement

Un contrôle compare chaque chaîne rédactionnelle de `services-content.ts` au
HTML servi, texte visible et attributs `alt` compris :

```
Chaînes rédactionnelles vérifiées : 66
Absentes du HTML servi            : 0
```

### Deux défauts trouvés en mesurant

1. **Le jaune sécurité en texte sur fond clair, encore.** Les numéros d'étapes
   étaient en `--color-safety` : **1,76 sur ivoire, 1,51 sur sable**. La règle
   est celle du § 1 du design system, enfreinte dans un fichier qui la cite
   trois fois en commentaire. Accessibilité revenue à **100** après correction.
2. **Un ajout non confirmé.** La refonte avait donné aux trois publics une
   ligne de détail chacun — « copropriétés », « gestionnaires de patrimoine ».
   Rien ne les confirme : `PROJECT.md` liste trois intitulés, pas des segments.
   Retirés, et les publics rendus en capsules.

### Un reliquat de l'ancien nom

L'accroche de `/realisations` disait encore « Arbre et Cime » au singulier, en
dur. Elle passe par `site.shortName`. Le `h1` de la page, lui, est resté
inchangé : une première version de cette refonte l'avait réécrit, c'était une
modification d'intention SEO non demandée, elle a été annulée.

### Ce que « deux colonnes sur mobile » coûte vraiment

| Cartes | 1 colonne | 2 colonnes | Verdict |
| --- | --- | --- | --- |
| Étapes des services (1 ligne) | 4 × 171 px | 2 × ~200 px | gain |
| Étapes de `/a-propos` (2 lignes) | 4 × 225 px | 4 × **410 px** | perte |

La règle n'est donc pas « deux colonnes sur mobile », mais **deux colonnes
seulement si le détail tient sur une ligne à pleine largeur**.

### Mesures

| Page | Perf | A11y | BP | LCP | CLS | 1440 | 390 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/elagage` | 94 | **100** | **100** | 3,1 s | **0** | +4 % | +12 % |
| `/abattage` | 94 | **100** | **100** | 3,1 s | **0** | **−4 %** | +13 % |
| `/dessouchage` | 94 | **100** | **100** | 3,1 s | **0** | +12 % | +13 % |
| `/entretien-exterieur` | 93 | **100** | **100** | 3,2 s | **0** | +13 % | +14 % |
| `/a-propos` | 94 | **100** | **100** | 3,1 s | **0** | **−7 %** | +16 % |
| `/realisations` | 92 | **100** | **100** | 3,4 s | **0** | **−8 %** | **+1 %** |

**La hausse sur mobile est attribuée, pas subie** : le hero explique 41 % du
delta des pages services, la photographie étant passée de fond — qui ne coûte
aucune hauteur — à carte, ce que le brief demandait explicitement.

Six largeurs contrôlées (320 à 1440) : **0 débordement, 0 cible sous 44 px, un
seul `h1` par page, une seule image prioritaire par page.**

**Sortie atteinte :** lint, typecheck et build au vert, `SITE_INDEXABLE`
toujours `false`, métadonnées, données structurées, sitemap et pages villes
**non touchés**, **aucune dépendance ajoutée**, **aucune image téléchargée**.

---

### Correctif après 15B.4 — heros sans photographie ✅

**Demande client :** retirer l'image des sections d'accueil de toutes les pages
sauf la principale, et n'employer qu'une seule image sur mobile comme sur
ordinateur.

- **Pages services, `/a-propos`, `/realisations`** : la carte photographique du
  hero est retirée. Reste un bloc de texte sur la surface d'ouverture, avec son
  motif. Le parcours de surfaces — forêt, forêt profond, sable, ivoire —
  continue de différencier les quatre pages services.
- **Page d'accueil** : la direction artistique à deux sources est supprimée.
  `<picture>`, `getImageProps` et les deux `preload()` manuels disparaissent au
  profit d'un simple `<Image priority>`. C'est la source **horizontale** qui est
  retenue : la verticale est meilleure sur mobile mais ne montre que 37 % de sa
  hauteur en bandeau large, où le grimpeur se retrouve tranché.
- **Nettoyage** : `heroLayout`, `heroAspect` et le champ `hero` du contenu ont
  été retirés — sans image à placer, ils ne décrivaient plus rien.

**Une seule image prioritaire subsiste sur tout le site**, celle du hero de
l'accueil. Toutes les autres pages n'en ont aucune.

### Mesures

| Page | Perf | LCP | Images | Hauteur 1440 |
| --- | --- | --- | --- | --- |
| `/elagage` | 94 → **96** | 3,1 → **2,8 s** | 210 → **68 Ko** | 4 667 → **4 162 px** |
| `/abattage` | 94 → **96** | 3,1 → **2,8 s** | 204 → **55 Ko** | 4 295 → **4 188 px** |
| `/dessouchage` | 94 → **97** | 3,1 → **2,6 s** | 216 → **65 Ko** | 4 657 → **4 073 px** |
| `/entretien-exterieur` | 93 → **97** | 3,2 → **2,6 s** | 231 → **34 Ko** | 4 697 → **4 124 px** |
| `/a-propos` | 94 → **95** | 3,1 → **2,9 s** | 201 → **111 Ko** | 5 162 → **5 054 px** |
| `/realisations` | 92 → **96** | 3,4 → **2,8 s** | 473 → **339 Ko** | 5 060 → **4 939 px** |
| `/` | 91 | 3,4 s | 328 → **283 Ko** | 8 141 px |

**Les six pages repassent sous leur hauteur d'avant la phase 15B.4 en 1440**, et
l'écart résiduel sur mobile tombe de +12/16 % à +8/12 %. Accessibilité **100**,
bonnes pratiques **100**, **CLS 0** partout.

Trois photographies deviennent inemployées — les anciens heros de l'accueil
mobile, de `/a-propos` et de `/realisations`. **Elles sont conservées sur
disque et restent au registre** (`MEDIA_SOURCES.md` § 12), pas supprimées.

---

### Phase 15B.5 — Zones, carte et 23 pages villes ✅

Les deux dernières pages restées dans l'état d'avant la refonte visuelle :
`/zones-intervention` et le gabarit des 23 pages locales.

### Le constat

`/zones-intervention` : **six sections, toutes ivoire**, avec un hub de
communes de **2 234 px** en 390. Le gabarit local : **sept sections, toutes
ivoire**, identique pour Rouen comme pour une commune à 100 km.

### Le moteur cartographique n'a pas bougé d'une ligne

`zone-map.tsx` est **inchangé**. Projection, coordonnées, 23 communes,
classification, distances, tracé SVG, interactions, animations et calcul des
voisins sont intacts, `locations.ts` n'a pas été modifié, et aucune commune n'a
été déplacée. `MAP_DATA_SOURCES.md` n'est donc pas touché : il ne devait l'être
que si une donnée géographique changeait.

### Ce que la carte a gagné

Elle est posée dans un panneau ivoire qui occupe **toute** la largeur du
conteneur, tandis que le dessin passe de 960 à **1 024 px**. Son rapport vient
du cadre géographique généré — elle est carrée, et l'étirer à 1 320 px la
rendrait aussi haute qu'un écran et demi. **C'est le panneau qui prend la
largeur, pas le dessin.**

### Un gabarit local, trois ouvertures

Seule la surface du hero varie — forêt pour le cœur de zone, sable pour la
zone principale, ivoire pour les déplacements élargis. Une commune à 100 km n'a
pas à s'annoncer avec la même assurance que Rouen.

Un défaut a été trouvé puis corrigé en cours de route : les pages `extended`
étaient les seules à enchaîner deux surfaces claires. La section qui suit le
hero calcule désormais sa propre surface.

### Vocabulaire interne, vocabulaire public

`core`, `primary` et `extended` : **0 occurrence** dans le HTML servi, vérifié
sur quatre pages. Le visiteur lit « Zone principale d'intervention »,
« Interventions possibles selon le chantier » ou « Déplacement à étudier ».

### Aucune perte d'unicité SEO

Contrôle automatique des quatre champs propres à chaque commune, comparés au
HTML servi :

```
Champs uniques par commune vérifiés : 92 (sur 23 communes)
Absents du HTML servi               : 0
```

### Invariant 23 vérifié

23 communes déclarées → **23 pages conformes** (h1, title, description,
`noindex`, carte) → **23 liens distincts** sur le hub → **23 repères** de
44 × 44 px sur la carte, tous dotés d'un nom accessible.

### Mesures

| Page | 390 | 1440 | Perf | A11y | BP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/zones-intervention` | 5 729 → 6 730 | 5 929 → **6 299** | 95 | **100** | **100** | **0** |
| `…/rouen` | 3 330 → 3 947 | 4 001 → 4 525 | 95 | **100** | **100** | **0** |
| `…/amiens` | 3 284 → 3 877 | 3 960 → 4 506 | 96 | **100** | **100** | **0** |

24 combinaisons (4 pages × 6 largeurs) : **0 débordement, 0 cible sous 44 px,
un seul `h1`, 0 surface adjacente identique, carte jamais coupée, aucun nom de
commune tronqué.** Aucune requête géographique au runtime, aucune bibliothèque
cartographique ajoutée.

**Sortie atteinte :** lint, typecheck et build au vert, 43 routes statiques
dont les 23 pages villes, `SITE_INDEXABLE` toujours `false`, slugs,
`generateStaticParams`, métadonnées, canoniques, sitemap et classification
**non touchés**, **aucune dépendance ajoutée**.

**Avec cette phase, les 15 pages du site sont refondues.**

---

### Correctif — pied de page sans appel au devis ✅

**Demande client.** La zone de conversion du pied de page est retirée :
capsule « Devis gratuit », titre, phrase et bouton. Le pied conserve
l'identité, les coordonnées, les trois colonnes de liens et le légal.

C'est la **deuxième** fois que ce bloc est retiré — une première en phase 15B,
une seconde ici. Le brief de la 15B.2 l'avait fait revenir sous une forme
différente ; la demande portait sur la fonction, pas sur la forme. La règle est
désormais écrite dans le composant lui-même et dans `DESIGN_SYSTEM.md` :
**ne pas le réintroduire sans demande explicite**.

| | Avant | Après |
| --- | --- | --- |
| Hauteur du pied en 390 px | ~1 000 px | **860 px** |
| Hauteur du pied en 1440 px | ~700 px | **532 px** |
| Liens vers `/devis` dans le pied | 1 | **0** |
| Capsules, boutons, titres | 3 | **0** |

Vérifié sur 16 combinaisons (8 pages × 2 largeurs). Accessibilité **100**,
bonnes pratiques **100**, **CLS 0** conservés. Lint, typecheck et build au vert.

---

### Phase 15B.6 — Contact, devis et cohérence finale ✅

Dernière sous-phase de la refonte visuelle.

### `/contact` n'existait pas

Elle rendait `PlaceholderPage` : **0 lien `mailto:`, 0 lien `tel:`**. C'était
la seule page du site dont la fonction n'était pas remplie.

Quatre blocs : hero forêt profond, cartes de contact, entrée vers le devis,
zone. **2 406 px en 1440, 2 147 px en 390** — la page la plus courte du site
après `/devis`, et c'est le point.

La carte téléphone n'existe que si le numéro est confirmé ; sans elle, la
grille se rééquilibre d'elle-même.

### `/devis` avait déjà hérité du design system

Mesuré avant modification : Sora + Inter, rayons 18 / 12 / 2 / pill. Le
configurateur, écrit en phases 11-12, a suivi la réécriture de jetons de la
15B.1 **sans être rouvert** — les noms de jetons n'avaient pas changé, seules
leurs valeurs. C'est la démonstration que le système tient.

Il restait à faire : une entrée à capsules, un rythme sable → ivoire, et les
repères en capsules. **La logique du configurateur n'a pas été touchée.**

Le `h1` reste « Demander un devis » : une soixantaine de boutons du site
portent ces trois mots, et la continuité entre le bouton et la page d'arrivée
vaut plus qu'une formulation plus jolie. « Parlons de votre chantier » est allé
à `/contact`.

### Un piège désamorcé dans `.env.example`

Le fichier livrait `NEXT_PUBLIC_PHONE=+33000000000` — une valeur
**syntaxiquement valide**. Le copier en `.env.local` au déploiement suffisait à
publier un numéro fictif dans une soixantaine d'emplacements, ce que
`CLAUDE.md` interdit. Les trois valeurs de contact sont désormais vides.

### Parcours du devis vérifié de bout en bout à 390 px

Les cinq étapes, la validation bloquante et ses deux messages d'erreur, l'ajout
de photos, la phrase de réserve sur la zone, le récapitulatif intégré à
l'étape 5 avec ses quatre boutons « Modifier », et l'envoi : **0 requête
réseau**, écran « Votre demande est prête », aucune fausse confirmation.

### Basculement du téléphone, testé

Build de test avec `NEXT_PUBLIC_PHONE` renseigné — **aucun numéro en dur** :
le bouton « Appeler » apparaît en en-tête, dans le menu mobile, la barre
d'action mobile, les heros, les cartes de conversion et la carte contact.
Retour à la configuration réelle : **0 lien `tel:` sur 13 routes**.

### Mesures finales

| Route | Perf | A11y | BP | LCP | CLS | 1440 | 390 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/contact` | **97** | **100** | **100** | 2,5 s | **0** | 2 406 | 2 147 |
| `/devis` | **96** | **100** | **100** | 2,7 s | **0** | 2 000 | 2 238 |
| `/` | 92 | **100** | **100** | 3,4 s | **0** | 8 141 | 8 457 |

**72 combinaisons** (12 routes × 6 largeurs) : 0 débordement, 0 cible sous
44 px, un seul `h1` par page, **0 surface adjacente identique**.

Cohérence : deux polices (Sora, Inter), **aucun reliquat Fraunces ni Manrope**,
une famille de rayons, une famille de boutons. Variété : douze suites de
surfaces différentes, quatre anatomies de carte, trois compositions de hero.

**Sortie atteinte :** lint, typecheck et build au vert, 43 routes statiques,
`SITE_INDEXABLE` toujours `false`, métadonnées, sitemap, robots, données
structurées et pages villes **non touchés**, **aucune dépendance ajoutée**.

---

## Phase 15B — TERMINÉE

Six sous-phases, douze routes refondues plus les 22 autres pages villes.

| Sous-phase | Objet |
| --- | --- |
| 15B.1 | jetons, typographies, primitives |
| 15B.2 | en-tête, navigation, pied de page, CTA |
| 15B.3 | page d'accueil |
| 15B.4 | services, à propos, réalisations |
| 15B.5 | zones, carte, 23 pages villes |
| 15B.6 | contact, devis, cohérence finale |

**Aucune dépendance ajoutée sur l'ensemble des six sous-phases.**

---

### Correctif — le téléphone est confirmé ✅

**`06 28 77 82 40`**, communiqué par le client après la phase 15B.6.

Il vit dans `src/lib/site.ts` sous deux formes tirées d'une source unique :
`+33628778240` pour les liens `tel:`, `06 28 77 82 40` pour l'affichage. Écrit
là plutôt que réservé à l'environnement, exactement comme l'e-mail : une
coordonnée publique confirmée n'est pas un secret, et un site déployé ne doit
pas perdre son numéro parce qu'une variable manque sur l'hébergeur. Les
variables d'environnement restent des surcharges.

### Aucun bouton n'a eu besoin d'être ajouté

Le site s'est construit pendant six sous-phases autour de l'absence de ce
numéro : chaque emplacement portait déjà son bouton « Appeler », conditionné à
`contact.phoneConfirmed`. **Renseigner la valeur a suffi.**

| Emplacement | Vérifié |
| --- | --- |
| En-tête, menu mobile, barre d'action mobile | oui |
| Hero de page — accueil, 4 services, zones, 23 villes | oui |
| Carte de conversion finale de chaque page | oui |
| Carte téléphone de `/contact` — apparue d'elle-même | oui |
| Coordonnées du pied de page | oui |
| Bouton CTA dans le pied de page | **aucun**, conforme à la demande |

### Mesures

4 à 5 liens `tel:` par page, 2 sur `/devis`. Sur **72 combinaisons** (12 routes
× 6 largeurs) : 0 débordement, 0 cible tactile sous 44 px, et **aucun autre
numéro que `+33628778240`**.

Accessibilité **100**, bonnes pratiques **100**, **CLS 0** conservés
(`/` 92, `/contact` 96, `/elagage` 96). Lint, typecheck et build au vert.

`PROJECT.md` § 7 : le point « numéro de téléphone et e-mail publics » passe de
**ouvert** à **confirmé**.

---

### Correctif carte — repères littoraux, lisibilité, chevauchements ✅

Trois signalements du client sur la carte.

### « Les points sont en mer » — ils ne l'étaient pas

Test point-dans-polygone contre tous les départements dessinés :
**0 repère sur 30 ne tombe sur la mer**. Dieppe a 1,20 km de marge au trait de
côte, Le Tréport 1,28, Fécamp 3,08, Le Havre 2,91.

Le défaut venait de l'**anneau** du point, qui valait `--surface-bg`. Depuis la
phase 15B.5, la carte est posée dans une carte sur fond sable : les 23 points
portaient un disque sable sur une terre ivoire, très visible dès qu'ils
touchaient la mer. L'anneau prend désormais `--map-land` et passe de 2 à
1,5 px — rayon extérieur 1,20 → **1,09 km**, sous la marge de Dieppe.

Limite assumée : le point étant dimensionné en pixels, son empreinte au sol
croît quand la carte rétrécit (1,09 km à 1 024 px, 1,80 km à 623 px). En
dessous d'environ 950 px, aucun point visible ne peut rester à plus de 1,20 km
d'un rivage.

### « On ne voit pas bien les villes en noir »

Les noms traversent jusqu'à trois fonds et croisent les filets de contour. Ils
portent désormais un liseré ivoire : **contraste 15,84** quel que soit le fond,
sans toucher à la couleur du texte.

### Chevauchements — trois causes, toutes corrigées

1. **Amiens** poussait son nom hors du cadre à 768 px : étiquette retournée
   vers l'intérieur.
2. **Cartes locales** : `secondary` était levé pour tous les repères, alors
   qu'il encode « cette étiquette ne tient pas sous 768 px ». Une carte locale
   mesure 301 px — elle a moins de place, pas plus. Levé pour la commune de la
   page et Rouen seulement.
3. **Grappe métropolitaine** : ses rappels en étoile, dessinés pour 1 024 px,
   s'empilaient à 301 px. Étiquette collée au point sur les cartes locales.
4. **`side` gauche/droite retombe sous le point en dessous de 480 px** — deux
   communes voisines se retrouvaient alignées. Les deux noms nommés se placent
   maintenant sur l'axe vertical.

### Vérification

| Portée | Résultat |
| --- | --- |
| Carte générale — 390, 768, 1 024, 1 440 | 0 chevauchement, 0 hors-cadre |
| Accueil — 390, 1 440 | 0 chevauchement |
| **23 cartes locales — 390 et 1 440** | **0 chevauchement, 0 hors-cadre** |

Moteur cartographique **non touché** : projection, coordonnées, classification,
distances, `locations.ts`, `map-data.ts` et les données géographiques sont
inchangés. Accessibilité **100**, bonnes pratiques **100**, **CLS 0**
(`/zones-intervention` 96, `…/dieppe` 96, `/` 92). Lint, typecheck et build au
vert.

---

### Retrait des quatre communes littorales ✅

**Demande du client :** retirer Le Havre, Dieppe, Fécamp et Le Tréport — de la
carte comme du site.

| | Avant | Après |
| --- | --- | --- |
| Communes de travail (`communes.json`) | 30 | **26** |
| Repères sur la carte générale | 23 | **19** |
| Pages locales | 23 | **19** |
| Routes statiques | 43 | **39** |

### Neuf pages citaient ces communes comme voisines

Le contrôle d'intégrité exige 3 à 5 voisins **existants** par page. Plutôt que
de rapiécer neuf listes à la main, les voisinages ont été **recalculés par
distance orthodromique** sur les 19 communes restantes : dix pages ont changé
de voisins, toutes conformes.

Effet de bord assumé, à signaler au client : le nord-est du cadre s'étant vidé,
les voisins les plus proches d'Abbeville et d'Amiens sont désormais à 87 et
96 km. Ce sont réellement les plus proches, mais un bloc « Autour d'Abbeville »
qui cite Mont-Saint-Aignan reste discutable.

### Le générateur de carte est déterministe — vérifié

`src/lib/map-data.ts` a été régénéré par `scripts/build-map-data.mjs` après
retrait des quatre communes de la source. Le différentiel se limite aux
**quatre lignes de `CITIES`** : trait de côte, contours départementaux, Seine,
71 communes de la métropole et cadre de projection sont identiques au caractère
près. Cette propriété n'avait jamais été vérifiée.

### Trois conséquences traitées

1. La carte ne touche plus la côte : la règle des étiquettes littorales n'a
   plus d'objet, elle reste consignée pour un éventuel retour.
2. Le groupe « Reste de la Seine-Maritime » ne contient plus qu'Yvetot, et sa
   description ne dit plus « au littoral ».
3. Les commentaires du code qui citaient ces communes comme exemples de mesure
   ont été reformulés : la mesure reste vraie, la commune n'existe plus.

### Vérification

- Les 4 URL renvoient **« Page introuvable »**.
- **0 lien mort** vers ces slugs sur l'ensemble du site.
- Hub : **19 liens** de communes.
- Carte générale à 390, 768, 1 024, 1 440 et accueil à 390, 1 440 :
  **0 chevauchement, 0 étiquette hors cadre**.
- **19 cartes locales × 2 largeurs** : 0 chevauchement, 0 hors-cadre, un seul
  `h1`, 0 débordement, maillage complet.
- Contrôle d'intégrité : **19 pages, tout cohérent** — niveaux core 7,
  primary 7, extended 5.

Accessibilité **100**, bonnes pratiques **100**, **CLS 0**
(`/zones-intervention` 95, `…/yvetot` 96, `/` 92). `noindex` intact. Lint,
typecheck et build au vert.

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
| Phase 13 | **Hébergement Hostinger et domaine** — sans eux, pas de SMTP |
| Phases 14, 18 | Raison sociale, SIREN, mentions légales, assurances |
| Phase 6 | Justificatifs des qualifications et de l'expérience |
