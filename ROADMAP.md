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

## Phase 8 — Pourquoi Arbre et Cime ✅

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
