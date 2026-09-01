# DESIGN_SYSTEM.md — Système de design

Direction : **arboriculture éditoriale premium**. Peu d'éléments, beaucoup de
matière. La charte ci-dessous est `VERROUILLÉE`.

Implémentation : Tailwind CSS v4, jetons déclarés dans `@theme` de
`src/app/globals.css`. **Pas de `tailwind.config.js`.** Aucune couleur
hexadécimale ne doit être écrite directement dans un composant.

**État : jetons et primitives livrés en phase 2, châssis en phase 4,
hero photographique en phase 5B.**
Référence visuelle vivante sur la route interne
[`/style-guide`](src/app/style-guide/page.tsx) (`noindex, nofollow`, hors
navigation publique).

---

## 1. Couleurs — `VERROUILLÉ`

| Jeton | Hex | Utilitaire Tailwind | Rôle |
| --- | --- | --- | --- |
| Vert forêt profond | `#14251E` | `forest` | Dominante sombre : hero, sections d'ancrage, footer |
| Ivoire naturel | `#F3F0E8` | `ivory` | Fond clair par défaut, texte sur fond forêt |
| Charbon | `#171918` | `charcoal` | Texte principal sur ivoire |
| Vert mousse | `#516B54` | `moss` | Surtitres, filets, états, texte secondaire sur ivoire |
| Pierre | `#CBC8BD` | `stone` | Texte secondaire sur forêt, séparateurs, aplats calmes |
| Jaune sécurité | `#D8A62A` | `safety` | **Accent, avec parcimonie** : CTA primaire, focus, repères |

### Espaces de noms réinitialisés

`--color-*`, `--text-*`, `--radius-*` et `--breakpoint-*` sont remis à zéro dans
`@theme` avant d'être redéfinis. **`bg-white`, `text-blue-500`, `text-9xl` ou
`rounded-3xl` n'existent tout simplement pas dans ce projet** : la charte n'est
pas seulement documentée, elle est rendue impossible à contourner par
inadvertance. Seuls `transparent` et `currentColor` sont conservés en plus des
six couleurs.

### Règle d'usage du jaune sécurité

Il évoque l'EPI et la signalisation de chantier — il ne fonctionne que s'il
reste rare. **Maximum une occurrence pleine par écran visible.** Autorisé :
remplissage du CTA primaire, anneau de focus sur surface sombre, indicateur de
progression du configurateur, micro-repères sur la carte de zone. Interdit :
fond de section, grands aplats, texte courant, décor.

### Contrastes mesurés (WCAG 2.1)

| Combinaison | Ratio | Verdict |
| --- | --- | --- |
| charbon sur ivoire | 15,51 | AAA — texte courant clair |
| forêt sur ivoire | 14,04 | AAA — titres sur fond clair, **focus sur clair** |
| ivoire sur forêt | 14,04 | AAA — texte courant sombre |
| pierre sur forêt | 9,55 | AAA — texte secondaire sombre |
| charbon sur jaune sécurité | 7,91 | AAA — **libellé des CTA pleins** |
| jaune sécurité sur forêt | 7,16 | AAA — accent et **focus sur sombre** |
| mousse sur ivoire | 5,15 | AA — surtitres et texte secondaire clair |
| mousse sur pierre | 3,50 | Échec texte — **décor / bordures uniquement** |
| mousse sur forêt | 2,73 | Échec texte — **décor uniquement** |
| jaune sécurité sur ivoire | 1,96 | **Échec — jamais de texte ni d'anneau jaune sur ivoire** |

À retenir : le CTA primaire est **jaune rempli, libellé charbon**. Jamais de
texte jaune sur fond clair.

---

## 2. Surfaces

Une **surface** est un jeu de variables sémantiques posé par
`data-surface="light" | "dark"`. Les composants ne référencent jamais une
couleur de charte directement : ils lisent ces variables. Conséquence — chaque
primitive fonctionne sur fond clair comme sur fond sombre **sans prop
conditionnelle**.

| Variable | `light` | `dark` |
| --- | --- | --- |
| `--surface-bg` | ivoire | forêt |
| `--surface-fg` | charbon (15,51) | ivoire (14,04) |
| `--surface-fg-muted` | mousse (5,15) | pierre (9,55) |
| `--surface-heading` | forêt (14,04) | ivoire (14,04) |
| `--surface-rule` | mousse 30 % | pierre 32 % |
| `--surface-inset` | mousse 8 % | ivoire 7 % |
| `--focus-ring` | forêt (14,04) | jaune sécurité (7,16) |
| `--btn-solid-bg` / `--btn-solid-fg` | forêt / ivoire | ivoire / forêt |
| `--btn-outline-border` | forêt 45 % | ivoire 45 % |

### Deux surfaces, pas trois

Une troisième surface `charcoal` a été introduite en phase 8 pour séparer une
section sombre d'un pied de page lui aussi sombre, puis **retirée au correctif
de la même phase** : la section concernée est passée en clair, et le charbon
n'avait plus d'emploi. Une surface sans usage n'est pas une réserve, c'est de
la dette.

Elle est documentée ici pour une raison : ne pas la réintroduire par réflexe.
La règle de clôture du § 8 se satisfait bien plus simplement d'une section
claire.

Le pied de page porte un **filet supérieur**, qui le délimite si la section qui
le précède devait un jour être sombre.

Les trois colonnes de texte secondaire passent AA ou mieux : c'est le critère
qui a déterminé le choix mousse / pierre.

---

## 3. Typographie — `VERROUILLÉ`

- **Titres : Fraunces** (serif variable, `--font-display`).
- **UI et texte courant : Manrope** (`--font-sans`).

Chargées par `next/font/google` dans `src/app/layout.tsx`, sous-ensemble latin,
`display: swap`, auto-hébergées par Next — aucun appel réseau tiers au runtime.

### Échelle fluide

Toutes les tailles sauf le surtitre sont en `clamp()`, interpolées linéairement
**entre 390 px et 1440 px de viewport**. En dessous de 390 px la valeur est
bornée au minimum : **le rendu à 320 px est identique à celui de 390 px**, ce
qui élimine toute cause de débordement sur les petits écrans.

| Jeton | Usage | Mobile → Large | Fonte | Interlettrage |
| --- | --- | --- | --- | --- |
| `text-display` | Titre d'écran (hero, `h1`) | 40 → 76 px | Fraunces | −0,02em |
| `text-title` | Titre de section | 30 → 46 px | Fraunces | −0,015em |
| `text-subtitle` | Sous-titre, intitulé de bloc | 22 → 26 px | Fraunces | −0,01em |
| `text-lead` | Chapô | 17 → 19 px | Manrope | — |
| `text-body` | Texte courant | 16 → 17 px | Manrope | — |
| `text-caption` | Légende, mention | 13 → 14 px | Manrope | — |
| `text-eyebrow` | Surtitre | 12 px **fixe** | Manrope | 0,24em |

Règles : jamais de texte sous 16 px en lecture courante ; longueur de ligne
bornée par `max-w-reading` (672 px, soit 60–75 caractères) ; `balance` sur les
titres, `pretty` sur les paragraphes ; **pas de titre tout en majuscules en
Fraunces** (les majuscules sont réservées au surtitre Manrope).

**La taille visuelle et le niveau sémantique sont indépendants.** Chaque
primitive typographique accepte `as` : on choisit la balise selon la structure
du document (un seul `h1`, aucun saut de niveau), jamais selon l'apparence.

---

## 4. Mise en page — `VERROUILLÉ`

Le site n'utilise **pas** de grille de cartes uniformes. La composition
respire.

### Alignement centré — décision client

**Tout le contenu de page et le pied de page sont centrés.** Posé une seule
fois dans `globals.css` :

```css
main,
footer {
  text-align: center;
}
```

Une seule déclaration plutôt qu'un `text-center` sur chaque bloc : rien ne peut
être oublié, et la bascule inverse tient en une ligne.

**Exclus :** l'en-tête et le menu mobile — ce sont des barres de navigation,
pas du contenu éditorial — ainsi que `/style-guide`, faite de tableaux que le
centrage rendrait illisibles (elle porte `text-left`).

Deux conséquences à connaître avant d'écrire un nouveau bloc :

1. **Un bloc à largeur bornée doit porter `mx-auto`.** Sans lui, le texte est
   centré dans une boîte, elle-même collée à gauche.
2. **Une rangée `flex` ne suit pas `text-align`.** Elle a besoin de
   `justify-center`, ou d'être empilée en colonne.

Un accent posé **à côté** d'un texte long ne se centre pas correctement : la
ligne s'étire et l'accent reste collé au bord. Le motif retenu est de le placer
**au-dessus**, centré — c'est ce que font la bande de preuves et les points de
méthode des pages services.

> **Réserve technique.** Le texte courant centré se lit moins bien que ferré à
> gauche : le bord gauche irrégulier oblige l'œil à rechercher le début de
> chaque ligne. L'effet est négligeable sur un titre ou un chapô de trois
> lignes, sensible sur les paragraphes longs des pages services. Décision
> client assumée ; la largeur de lecture reste bornée à `max-w-reading` pour
> limiter la gêne.

### Points de rupture

Alignés sur les largeurs de recette, pas sur les valeurs par défaut de Tailwind.

| Nom | Valeur | Cible |
| --- | --- | --- |
| base | — | 320 → 479 px |
| `sm` | 480 px | grands mobiles |
| `md` | 768 px | tablette |
| `lg` | 1024 px | petit desktop |
| `xl` | 1440 px | grand desktop |

### Gouttières et rythme vertical

Responsives, portés par des variables CSS (pas des jetons statiques) :

| Variable | Mobile | ≥ 768 px | ≥ 1024 px |
| --- | --- | --- | --- |
| `--gutter` | 20 px | 32 px | 48 px |
| `--section-space` | 72 px | 96 px | 128 px |
| `--reveal-shift` | 6 px | 12 px | 12 px |

Consommées via `px-(--gutter)` et `py-(--section-space)`.

### Largeurs maximales

| Jeton | Utilitaire | Valeur | Usage |
| --- | --- | --- | --- |
| `--container-reading` | `max-w-reading` | 672 px | Colonne de lecture |
| `--container-content` | `max-w-content` | 1240 px | Contenu de référence |
| `--container-wide` | `max-w-wide` | 1440 px | Bandeau quasi pleine largeur |

### Grille

4 colonnes sur mobile, 8 dès 768 px, 12 dès 1024 px :

```
grid grid-cols-4 gap-(--gutter) md:grid-cols-8 lg:grid-cols-12
```

Les blocs s'appuient sur des empans **inégaux** (7/5, 8/4, 5/7) et alternent le
côté d'ancrage d'une section à l'autre.

### Deux colonnes asymétriques — motif « éditorial / arguments »

Livré au correctif de la phase 8, section « Pourquoi Arbres & Cimes ». C'est la
réponse du projet au besoin « présenter trois à cinq arguments » **sans**
retomber sur une grille de cartes.

Anatomie, sur `lg:grid-cols-12` :

- **colonne éditoriale**, `col-span-6` — surtitre, `h2`, deux paragraphes,
  puis une photographie ;
- une colonne entière **laissée vide** ;
- **colonne d'arguments**, `col-span-5 col-start-8` — les arguments à la
  suite, séparés par des filets d'un pixel, jamais encadrés.

Trois points font tout le travail :

1. **Le filet sépare, il n'encadre pas.** `border-t` sur chaque entrée,
   `first:border-t-0`. Aucune bordure verticale, aucun fond, aucune ombre.
2. **Les hauteurs sont libres.** Elles suivent la longueur du texte (199 à
   254 px en 1440). C'est exactement ce qui distingue un rythme d'une grille.
3. **La photographie ferme la colonne.** La rangée est en `items-stretch`
   (défaut), la colonne éditoriale en `flex flex-col`, l'enveloppe de la photo
   en `flex-1` et la photo en `aspect-auto h-full`. Son bas s'aligne donc au
   pixel sur le dernier argument, à toute largeur. Sans cela, la colonne
   gauche s'arrêtait 166 px trop haut et laissait un vide.

Sous 1024 px le motif s'empile dans l'ordre du DOM : texte, photographie,
arguments. C'est l'ordre voulu sur mobile — un seul grand visuel, puis la
liste.

> **Conséquence sur `sizes`.** Une photographie en `aspect-auto h-full` prend
> un cadre **plus haut que large**. Avec une source en 3:2 et `object-cover`,
> le navigateur cale sur la hauteur : la largeur réellement rendue dépasse
> largement celle du cadre. Annoncer la largeur du cadre sert une image trop
> petite, remontée floue. D'où `sizes="(min-width: 64rem) 60rem, 150vw"`, très
> au-dessus des dimensions mesurées — et assumé comme tel.

### Cartes photographiques — exception encadrée

**Décision client, phase 6B.** Le traitement éditorial de la phase 6 a été
jugé trop « magazine » ; la section Prestations passe en cartes
photographiques. Cette section est la **seule** du site où le motif « carte »
est autorisé, et la seule où le rayon dépasse 8 px.

Anatomie :

- photographie **plein fond** en `object-cover`, jamais de cadre blanc ;
- rayon `rounded-card` (16 px), réservé à ce composant ;
- dégradé forêt progressif de bas en haut, plus un voile de 22 % qui s'ajoute
  au survol — l'image s'enfonce, elle ne s'éclaircit jamais ;
- contenu ancré en bas : index `01`–`04` en jaune sécurité, titre Fraunces
  `text-subtitle`, description en `text-caption`, mention « Voir le service »
  et flèche ;
- filet d'accent jaune à 45 % révélé au survol et au focus.

**Ce qui reste interdit**, y compris ici : carte blanche à icône, grosse
bordure, ombre portée, glassmorphism, fond flouté.

Le lien enveloppe la carte entière : le nom accessible est l'intitulé du
service, et tout le contenu reste visible sans survol.

> **Note système.** Cette exception contredit deux règles générales — « très
> peu de cartes » (§ 4) et « rayons de 0 à 8 px ». Elle est encadrée par un
> jeton dédié, `--radius-card`, et par ce paragraphe : **ne pas l'étendre à
> d'autres sections** sans nouvelle décision.
>
> **Extension, phase 9 — décision client.** La section « Quelques
> interventions » de la page d'accueil emploie elle aussi des cartes
> photographiques. Le motif n'est donc plus exclusif aux Prestations, mais il
> reste **encadré** : deux sections, pas plus, et deux anatomies
> **délibérément distinctes**, parce qu'elles cohabitent sur la même page et
> sur la même surface claire.
>
> | | Prestations | Réalisations |
> | --- | --- | --- |
> | Texte | **incrusté** sur la photo | **sous** la photo, sur l'ivoire |
> | Voile | dégradé forêt + renfort au survol | aucun |
> | Repère | index `01`–`04` | étiquette de catégorie |
> | Cadrage | portrait constant | paysage empilé, portrait en 3 colonnes |
> | Nombre | quatre | trois |
> | Survol | voile qui s'assombrit | image qui grandit de 4 % |
>
> Sortir le texte de l'image a un second mérite, moins visible : les trois
> photographies de chantier sont claires et contrastées, un texte incrusté
> aurait exigé un dégradé calibré **par image**.
>
> **Une troisième section à cartes serait de trop.** À ce stade la page
> redeviendrait une grille, et c'est précisément ce que `PROJECT.md` interdit.

> Ce qui est encadré ici, c'est le **motif de carte cliquable**, pas le rayon.
> `--radius-card` (16 px) est depuis la phase 7 le rayon des **grands blocs** —
> photographie de méthode des pages services, panneau sombre de conversion,
> photographie de la section « Pourquoi ». `rounded-soft` (8 px) reste celui des
> **petits cadres** en creux. Le critère est la taille du bloc, pas la section.

### Interdits de composition

- **Très peu de cartes.** Quand une répétition est nécessaire (les 8
  prestations), on privilégie une **liste éditoriale** : filets horizontaux,
  numérotation, typographie hiérarchisée — pas huit rectangles à ombre portée.
- **Ombres portées : interdites** en décor. La profondeur vient du contraste de
  fond (forêt / ivoire) et des photos.
- **Rayons de bordure : 0, 2, 8 ou 16 px, rien d'autre.** `rounded-edge` (2 px)
  par défaut, `rounded-soft` (8 px) pour les petits cadres en creux,
  `rounded-card` (16 px) pour les grands blocs — photographies de section et
  panneaux. Rien au-delà n'existe : `rounded-3xl` et `rounded-full` ne sont pas
  générés.
- Aucune esthétique SaaS, IA ou glassmorphism : ni flou d'arrière-plan, ni
  dégradé décoratif, ni bordure lumineuse.

---

## 5. Photographie — `VERROUILLÉ`

Voir aussi `CONTENT_STRATEGY.md`, section photographie.

- **Vraies photographies uniquement.** Photos client en priorité ; à défaut,
  banques d'images libres **réellement adaptées** (essences, matériel, EPI,
  paysage cohérents avec la Normandie).
- **Aucune image générée par IA** pour représenter l'activité, les chantiers, le
  matériel ou les personnes. Sans exception.
- Traitement homogène : lumière naturelle, contraste tenu, saturation basse sur
  les verts, pas de filtre marqué, pas de vignettage.
- Le grimpeur en action et le point de vue depuis la cime sont les visuels les
  plus différenciants : ils vont au hero et aux réalisations.
- Format : `next/image`, AVIF/WebP, `sizes` explicite, `priority` sur le seul
  visuel LCP du hero, `alt` rédigé et descriptif.
- Le composant `Figure` verrouille le rapport de cadrage **avant** le chargement
  de l'image : aucun décalage de mise en page (CLS). Cadrages disponibles :
  `portrait` (4/5, format de référence mobile), `landscape` (3/2), `wide`
  (16/9), `square`, `free`.

### Hero photographique — livré en phase 5B

Le hero est le seul endroit du site où du texte est posé **sur** une
photographie. Le motif est donc codifié une fois pour toutes.

**Surface.** Le bloc porte `data-surface="dark"`. Ce n'est pas décoratif :
sans lui, les primitives typographiques résolvent `--surface-heading` sur le
jeu clair et rendent un titre **vert forêt sur une photo sombre**. L'oubli
s'est réellement produit en phase 5B.

**Plein cadre, sans compromis.** `object-cover` à toutes les largeurs : la
photographie remplit toujours la section entière. Aucune image contenue au
milieu, aucune bande, aucun fond dupliqué.

> Une tentative intermédiaire avait utilisé `object-contain` par-dessus une
> copie floutée de la même image, pour montrer la photo entière partout. Le
> résultat était une image encadrée au centre d'un faux fond : la puissance du
> hero s'effondrait. **Abandonné.** Sur un hero, remplir le cadre prime sur
> montrer l'intégralité du fichier.

#### Le dégradé se calibre sur la HAUTEUR, pas seulement sur la photo

Règle établie sur `/a-propos`, et le piège le plus coûteux du projet à ce jour.

Le dégradé du hero est ancré **en bas** : son opacité tend vers zéro en haut du
cadre. Tant que le hero est haut, le bloc de texte occupe le tiers inférieur et
tombe donc dans la partie dense. **Raccourcir le hero ne déplace pas le
texte : cela déplace le dégradé sous lui.** Le bloc de texte, lui, garde à peu
près la même hauteur — il remonte donc mécaniquement vers la zone claire.

Sur `/a-propos`, à 22rem, le surtitre est tombé à **1,92** de contraste avec le
dégradé des pages services. Le réflexe est d'accuser la photographie. Les
quatre autres candidates ont été mesurées au même endroit : **1,57 à 1,67**,
toutes pires. Le paramètre en cause était la hauteur.

**Marche à suivre quand un hero passe sous 26rem :**

1. rallonger d'abord, si la page le permet — c'est gratuit ;
2. sinon calibrer un dégradé propre à la page, en partant du plus léger et en
   remontant jusqu'au premier qui tienne AA, **jamais au-delà** ;
3. mesurer, ne pas estimer — recomposer photo + dégradé dans un canvas et
   échantillonner le rectangle réel de chaque texte, au **pixel le plus
   défavorable**.

Un dégradé trop appuyé passe AA et éteint la photographie : le hero devient un
aplat vert. C'est un échec, pas une réussite.

| Page | Hauteur mobile | Dégradé | Pires contrastes (surtitre / `h1` / chapô) |
| --- | --- | --- | --- |
| Pages services | 30rem | partagé | 6,64 à 11,38 |
| `/a-propos` | 26rem | propre à la page | 5,52 / 5,43 / 9,58 |

**Une photographie à ciel clair coûte un cran de dégradé.** C'est consigné dans
`MEDIA_SOURCES.md` pour les fichiers concernés : le choix d'une photo de hero
n'est pas seulement esthétique, il engage la lisibilité.

#### La primitive `HeroScrim` — phase 9

Le cas s'étant présenté une seconde fois sur `/realisations` (surtitre à 3,20
avec le dégradé partagé), les deux réglages sont sortis en primitive :
**`src/components/ui/hero-scrim.tsx`**.

```tsx
<HeroScrim />                    // heros de 30rem et plus
<HeroScrim variant="compact" />  // heros de 26 a 29rem
```

Ce n'est pas un rangement cosmétique. La chaîne de dégradé fait 300
caractères ; recopiée, elle se serait désynchronisée à la première retouche,
et la **justification chiffrée** de chaque palier — la seule chose qui empêche
quelqu'un de l'« améliorer » à l'œil — se serait perdue. Elle vit maintenant
en un seul endroit, à côté des mesures qui l'ont produite.

Adopté par les quatre pages services, `/a-propos` et `/realisations`.
**Restent hors primitive, et c'est voulu :** le hero de la page d'accueil
(100svh, calibré à part) et le voile des cartes Prestations — qui n'est pas un
hero mais un fond de carte, avec un renfort au survol.

### Direction artistique — deux sources, un seul téléchargement

Une photographie en 4:3 (1,333) ne peut pas remplir un viewport mobile en 0,46
sans en perdre 65 % de la largeur : le sujet devient un gros plan et le
chantier disparaît. Le recadrage ne se règle donc pas en rétrécissant l'image,
**mais en changeant de source**.

| | Source | Format | Recadrage |
| --- | --- | --- | --- |
| < 1024 px | `elagueur-ascension-tronc-vertical.jpg` | 1400 × 2094 (portrait) | `object-[32%_center]` |
| ≥ 1024 px | `elagueur-grimpeur-arbre-mature.jpg` | 2400 × 1800 (paysage) | `object-[center_36%]` |

Mise en œuvre : un vrai `<picture>` avec un `<source media>`, alimenté par
**`getImageProps()`** de `next/image`. On garde ainsi le `srcSet` optimisé, les
formats modernes et les tailles de `next.config.ts`, tout en laissant le
navigateur ne télécharger **qu'une seule** des deux sources. Vérifié par
Resource Timing : une requête, et c'est la bonne, à chaque format.

`getImageProps` ne pose en revanche **ni `fetchpriority` ni lien de
préchargement** — c'est le composant `<Image>` qui s'en charge, et on ne
l'utilise pas ici. Le hero étant l'élément LCP, les deux sont rétablis à la
main : `fetchPriority="high"` et `loading="eager"` sur l'`<img>`, plus deux
`preload()` de `react-dom` **portés par la même requête média**. Les deux
requêtes étant strictement complémentaires, une seule image est préchargée.

**Un seul texte alternatif**, valable pour les deux fichiers : ils montrent la
même chose — un élagueur-grimpeur au travail dans un arbre, sur cordes.

**Hauteur.** `min-h-svh`, jamais `dvh` : sur Safari mobile, `dvh` change de
valeur quand la barre d'URL se rétracte et la mise en page saute en cours de
défilement. `svh` est la plus petite hauteur de viewport — le hero tient
toujours et ne bouge jamais. Sur desktop, `min(100svh, 56rem)` : un vrai plein
écran, borné pour ne pas devenir absurde sur un très grand moniteur. La bande
de preuves reste ainsi sous la ligne de flottaison à toutes les largeurs, et le
pied de page n'apparaît jamais dans le premier écran.

**Voiles — un dégradé directionnel, pas un filtre.** Un aplat uniforme
écraserait la photographie ; un filtre vert la teinterait. On pose un dégradé
opaque **là où le texte se trouve** et nul ailleurs :

- mobile — texte en bas : `to top`, 0,94 → 0, éteint avant le tiers supérieur ;
- desktop — texte à droite : `to left`, 0,93 → 0,04, quasi nul sur le grimpeur ;
- plus un dégradé haut de 160 px, sur les deux, pour que l'en-tête overlay
  reste lisible au-dessus des trouées de ciel.

**Composition asymétrique.** Le texte occupe la zone calme et ne recouvre
jamais le sujet : colonne de droite (62 %) sur desktop, bloc ancré en bas sur
mobile.

**Contrastes mesurés** sur la composition réelle (photo recadrée + dégradé),
et non estimés :

| Élément | 320 px | 390 px | 1440 px |
| --- | --- | --- | --- |
| Titre (ivoire) | 8,71 | 9,64 | 9,16 |
| Chapô (pierre) | 8,13 | 8,07 | 7,08 |
| Surtitre (pierre) | 5,05 | 4,93 | 5,53 |

Le surtitre est le point le plus tendu de la composition : il se trouve en
haut du bloc de texte, là où le dégradé s'éteint. C'est lui qui fixe la limite
basse des paliers — le calibrer au jugé donnait 3,54, sous le seuil AA.

**Césure du titre.** `text-balance` coupe volontiers au trait d'union
(« Élagueur- / grimpeur à Rouen »), ce qui hache le mot composé. Un
`lg:whitespace-nowrap` sur « Élagueur-grimpeur » impose la seule césure
acceptable, après le métier. Restreint à `lg` : sous 1024 px le titre a besoin
de pouvoir se couper au trait d'union pour tenir à 320 px.

**Bande de preuves.** Quatre colonnes séparées par des filets, deux colonnes
sur mobile. **Aucune carte.** Elle est entièrement sous la ligne de
flottaison : le premier écran reste la photographie, le titre et le CTA.

---

## 6. Mouvement — système à trois niveaux

Toute animation du site relève d'un de ces trois niveaux. **Aucune durée n'est
écrite à la main dans un composant.**

| Niveau | Jeton | Durée | Usage |
| --- | --- | --- | --- |
| **Micro** | `--duration-micro` | 180 ms (plage 120–220) | Liens, boutons, navigation, filets qui se tracent |
| **Reveal** | `--duration-reveal` | 520 ms (plage 400–650) | Apparition de contenu, menu mobile, compactage de l'en-tête |
| **Signature** | `--duration-signature` | 900 ms (plage 700–1200) | **Réservé** au hero, à la carte de zone et au devis |

Courbes : `--ease-cime` `cubic-bezier(0.22, 0.61, 0.36, 1)` pour les sorties,
`--ease-line` `cubic-bezier(0.65, 0, 0.35, 1)` pour le tracé des filets.

Les trois durées sont déclarées dans `:root` et **non dans `@theme`** :
Tailwind élague les variables de `@theme` qu'aucun utilitaire ne consomme, et
`--duration-signature` n'est pas encore utilisée. Dans `:root`, les trois
niveaux existent toujours et forment un système lisible. Elles se consomment
via `duration-(--duration-micro)`.

### Vocabulaire

**Retenu :** filets qui se tracent depuis un bord, masques et révélations,
translations contrôlées (6 à 20 px), progression directionnelle, compactage.

**Exclu :** rebond, zoom, flou décoratif, rotation, compteurs animés, effets de
particules, carrousels automatiques, cascades de plus de quelques éléments.

### Reveal

**`Reveal`** — opacité plus montée de 6 px sur mobile, 12 px au-delà de 768 px.
- Implémentation : **100 % CSS, zéro JavaScript, zéro dépendance**, via
  `animation-timeline: view()`. Le masquage initial est enfermé dans
  `@supports (animation-timeline: view())` : un navigateur sans timelines de
  scroll affiche simplement le contenu, sans clignotement et sans risque de bloc
  invisible. Le contenu est de toute façon toujours présent dans le HTML.
- **Aucun effet dépendant exclusivement du survol.** Tout état de survol a son
  équivalent au focus clavier, et le survol ne révèle jamais une information ou
  un contrôle.
- **`prefers-reduced-motion: reduce` neutralise tout** — règle globale dans
  `globals.css`. Ne pas la contourner ; une animation ne doit jamais porter
  d'information seule.

### Hero — entrée au chargement

Le hero est visible dès le chargement : `Reveal`, déclenché à l'entrée dans le
viewport, n'y produirait aucun effet. L'entrée est donc portée par des
keyframes CSS jouées au chargement, sans JavaScript ni bibliothèque.

| Élément | Effet | Niveau | Décalage |
| --- | --- | --- | --- |
| Surtitre | montée 12 px + opacité | Reveal | 0 ms |
| Titre | **démasquage** : monte depuis sous son propre masque | Signature | 90 ms |
| Filet jaune | tracé depuis la gauche | Signature | 240 ms |
| Texte | montée + opacité | Reveal | 270 ms |
| CTA | montée + opacité | Reveal | 360 ms |
| Preuves | montée + opacité, une par une | Reveal | 450 à 720 ms |

**La photographie n'est jamais animée** : elle est visible immédiatement, ce
qui protège le LCP.

Les trois règles (`[data-hero]`, `[data-hero-mask]`, `[data-hero-trace]`) sont
**entièrement enfermées** dans `@media (prefers-reduced-motion: no-preference)`.
Sous « réduire les animations », aucune animation n'est déclarée du tout : le
hero est lisible instantanément, sans dépendre de la règle globale
d'annulation. Vérifié sur la feuille compilée — trois occurrences, trois dans
le garde-fou.

---

## 7. Primitives livrées

Toutes dans `src/components/ui/`, réexportées par `@/components/ui`.
Toutes sont des **composants serveur** : aucune n'embarque de JavaScript client.

| Primitive | Rôle |
| --- | --- |
| `Container` | Borne horizontale + gouttière responsive. Largeurs : `prose` \| `content` \| `wide` \| `full`, option `bleed` |
| `Section` | Bandeau pleine largeur : pose la surface (`light` \| `dark`) et le rythme vertical (`none` \| `tight` \| `default` \| `loose`) |
| `Display` `Title` `Subtitle` `Lead` `Body` `Small` | Échelle typographique, `as` polymorphe |
| `Button` | **Action** dans la page → `<button>` |
| `ButtonLink` | **Navigation** ou `tel:` / `mailto:` → `<a>` |
| `TextLink` | Lien dans le fil du texte, souligné en permanence |
| `ArrowLink` | Lien d'action éditorial, chevron toujours visible |
| `Eyebrow` | Surtitre — porte du **texte réel**, lu par les lecteurs d'écran |
| `SectionIndex` | Numérotation éditoriale — **ornement**, `aria-hidden` |
| `Rule` | Séparateur `<hr>` : `full` \| `short` \| `hair` |
| `Figure` | Cadre média + légende, rapport de cadrage verrouillé |
| `Reveal` | Unique primitive d'animation |

`Section` et `Container` sont volontairement **séparés** : c'est cette
séparation qui permet les débords photo pleine largeur exigés par la mise en
page asymétrique.

### Boutons et liens ne sont pas interchangeables

`Button` rend un `<button>`, `ButtonLink` un `<a>`. Un lecteur d'écran annonce
« bouton » ou « lien » et l'utilisateur en déduit ce qui va se passer : une
action dans la page, ou un départ vers une autre adresse. **Ne jamais utiliser
l'un pour l'autre au motif qu'ils se ressemblent.**

Variantes : `primary` (jaune sécurité rempli, libellé charbon — une seule
occurrence par écran), `solid` (aplat inversé, action « Appeler »), `outline`
(secondaire). Tailles : `md` (48 px) et `lg` (56 px). Option `block` pour la
pleine largeur, comportement attendu par défaut sur mobile.

### Helper

`cn()` (`src/lib/cn.ts`) concatène des classes, sans dépendance. Il ne fusionne
pas les classes Tailwind concurrentes : la `className` passée à une primitive
doit rester **additive** (espacement, empan, alignement). Un besoin d'écrasement
relève d'une variante à ajouter au composant.

---

## 8. Châssis du site — livré en phase 4, affiné en phase 4B

Composants dans `src/components/layout/`, montés une seule fois dans
`src/app/layout.tsx` : ils encadrent toutes les pages.

| Composant | Nature | Rôle |
| --- | --- | --- |
| `SkipLink` | serveur | Lien d'évitement vers `#contenu`, visible au premier `Tab` |
| `Wordmark` | serveur | Logotype typographique temporaire |
| `SiteHeader` | **client** | En-tête, navigation desktop, sous-menu, menu mobile |
| `MobileActionBar` | **client** | Barre d'action persistante, mobile uniquement |
| `SiteFooter` | serveur | Pied de page |

### Logotype — temporaire

**Aucun symbole ni faux logo n'est inventé.** Tant qu'un logo réel n'est pas
fourni, l'identité repose entièrement sur la typographie :

```
Arbres & Cimes          Fraunces, esperluette en italique
ÉLAGAGE · ROUEN       Manrope, surtitre interlettré, point médian jaune
```

L'esperluette et l'ancrage géographique font le travail d'un logotype : ils
donnent une signature reconnaissable et disent le métier et le lieu. Trois
tailles : `sm` (en-tête compacté), `md` (en-tête), `lg` (pied de page et menu
mobile). À remplacer dès réception du logo réel.

### En-tête

**Toujours sur surface sombre**, y compris sur les pages internes. Deux
raisons : le jaune sécurité ne contraste qu'à **1,96 sur ivoire**, donc les
accents du CTA seraient illisibles sur un en-tête clair ; et un bandeau forêt en
haut, un pied de page forêt en bas, du contenu ivoire entre les deux, donne une
reliure éditoriale nette.

`position: fixed` dans les deux cas. Deux variantes, pilotées par le champ
`headerVariant` de `src/lib/routes.ts`, jamais codées dans une page :

- **`overlay`** — fond transparent au repos, posé sur la photographie plein
  écran. Réservé à la page d'accueil.
- **`solid`** — fond forêt dès le chargement. Toutes les pages internes.
  Une **cale** de la hauteur dépliée rend au flux la place que l'en-tête fixe ne
  prend pas ; elle est en forêt, donc indiscernable de l'en-tête, et ne bouge pas
  quand celui-ci se compacte — aucun décalage de mise en page.

**Au défilement** (au-delà de 24 px), quelle que soit la variante : la hauteur
passe de 112 à 80 px sur desktop (72 → 56 px sur mobile), le fond devient forêt
à 95 %, un filet inférieur apparaît, et le logotype passe en taille `sm`.
Transition au niveau Reveal. Pas de capsule flottante.

Navigation : **Prestations** (sous-menu de 4), Réalisations, Zone
d'intervention, À propos, puis le CTA. Pas de méga-menu. La page courante porte
`aria-current="page"`.

**Indicateur de lien** : un filet de 1 px qui se trace depuis la gauche, au
niveau Micro. Permanent sur la page active, tracé au survol et au focus sinon.
Le libellé ne bouge pas — tout le mouvement est dans le filet.

Le **sous-menu Prestations s'ouvre au clic et au clavier, jamais au seul
survol** : un menu déclenché au passage de la souris est inutilisable au doigt
comme au clavier, et la charte interdit toute interaction dépendant
exclusivement du survol. Présentation éditoriale — index `01`–`04`, intitulé en
Fraunces, sous-libellé (`navTagline`) — plutôt qu'une grille de cartes : c'est
ce qui le distingue d'un méga-menu.

### CTA de navigation

`NavCta` remplace l'aplat jaune plein dans l'en-tête et le menu mobile. Sur un
en-tête posé au-dessus d'une photographie, un gros rectangle saturé écrase
l'image et fait « bandeau marketing ».

Le jaune sécurité n'apparaît plus que par touches : un filet de 2 px sous le
libellé, et la flèche. Le libellé reste dans la couleur de la surface. La règle
de parcimonie de la charte est donc respectée à la lettre.

- `layout="bar"` (en-tête) : le filet se trace au survol et au focus.
- `layout="row"` (menu mobile) : filet **permanent** — un écran tactile n'a pas
  de survol, un accent conditionné au hover n'y existerait jamais.

Le CTA plein (`Button variant="primary"`) reste la référence dans le **corps**
des pages, où il doit dominer.

### Menu mobile

Sous 1024 px. Panneau plein écran, surface `dark`, `role="dialog"` +
`aria-modal`.

Composition : logotype et bouton « Fermer » en tête, puis quatre grandes entrées
numérotées `01`–`04` en Fraunces séparées par des filets — `01 Prestations` se
déplie sur les quatre pages services avec leurs sous-libellés — puis le CTA
éditorial pleine largeur, puis un rappel de la zone d'intervention et un lien
« Nous joindre ».

**Apparition en cascade** : chaque entrée monte de 14 px en fondu, avec 45 ms
d'écart, au niveau Reveal. L'animation est **entièrement CSS** : le panneau
passe de `display: none` à visible, ce qui relance l'animation à chaque
ouverture sans état ni JavaScript supplémentaire. L'échelonnement est porté par
`--menu-index`, posé en style en ligne. Neutralisée sous
`prefers-reduced-motion`.

`Échap` ferme, le défilement du corps est verrouillé, le focus est piégé dans le
panneau puis rendu au bouton d'ouverture. La fermeture au changement de page est
un **ajustement d'état pendant le rendu**, ce qui couvre aussi les boutons
précédent/suivant du navigateur.

Le bouton d'ouverture n'est pas un « hamburger » : deux traits, dont le plus
court s'allonge au survol et au focus.

### Barre d'action mobile

Fixe en bas, sous 1024 px, surface `dark`, fond forêt à 95 %, filet supérieur,
séparateur vertical entre les deux actions, respecte
`env(safe-area-inset-bottom)`. Hauteur compacte : 60 px.

**Apparition différée sur les pages à hero** : sur une route `overlay`, la barre
ne se montre qu'une fois les trois quarts du premier écran franchis, pour ne pas
recouvrir la photographie dès l'arrivée. Sur les pages internes, qui n'ont pas de
hero, elle est présente immédiatement. La **cale est rendue en permanence**, même
quand la barre est encore masquée : la hauteur du document reste stable et
l'apparition ne provoque aucun saut de défilement.

Le jaune sécurité y reste une **touche** — le libellé et la flèche du devis — et
non un aplat de bord à bord, qui écraserait le contenu autant que la charte.

**Aucun numéro n'est inventé.** Tant que `NEXT_PUBLIC_PHONE` est vide,
l'action « Appeler » n'existe pas et « Devis gratuit » occupe toute la largeur ;
renseigner la variable la fait apparaître, sans autre modification.

Désactivation page par page : ajouter la `RouteId` au tableau `HIDDEN_ON` de
`mobile-action-bar.tsx`. Prévu pour `/devis`, où le configurateur portera
lui-même son action principale.

### Pourquoi l'en-tête est un composant client

Quatre besoins réels imposent l'état côté navigateur : le menu mobile, le
sous-menu, **l'état de défilement**, et la lecture du chemin courant (variante
d'en-tête et `aria-current`). Les regrouper dans **une seule** frontière cliente
coûte moins de JavaScript que quatre îlots séparés. Le balisage complet reste
rendu côté serveur au premier chargement : la navigation est dans le HTML
initial.

`useScrollPast` pose un unique écouteur passif et ne lit que `scrollY` (aucune
lecture de géométrie, donc aucun recalcul de mise en page forcé), au plus une
fois par image, et ne provoque un rendu que lorsque le booléen change.

### Pied de page

Composant serveur, sans JavaScript. Identité, prestations, zone d'intervention,
CTA devis, liens légaux. **Aucune donnée inventée** : téléphone, e-mail et
adresse ne s'affichent que s'ils existent réellement dans l'environnement.

Son CTA est **éditorial** (`NavCta`), pas un aplat jaune : chaque page se
termine déjà par un bouton plein quelques centaines de pixels plus haut. Deux
aplats coup sur coup enfreindraient la règle de parcimonie du § 1.

> **Règle de clôture de page.** Le pied de page est en forêt. **Aucune section
> ne doit donc se terminer en forêt** : les deux fonds se confondraient en un
> seul bloc sombre, et le pied de page perdrait son statut de bande de clôture.
> Le cas s'est produit en phase 7 — la section de conversion des pages services
> et le pied de page formaient 1 754 px de sombre d'un seul tenant, soit deux
> écrans mobiles. La solution retenue : une section **claire** contenant un
> **panneau sombre arrondi**. Le panneau concentre le poids visuel du CTA, la
> gouttière claire qui l'entoure rend au pied de page sa fonction.
>
> La phase 8 a d'abord tenté une **seconde issue** — une surface charbon, marche
> tonale sans panneau. Rejetée : deux masses sombres consécutives restent deux
> masses sombres, quelle que soit la nuance. La section « Pourquoi Arbres & Cimes »
> est donc **claire**, ce qui règle la question sans mécanisme. Retenir l'ordre
> des recours : section claire d'abord, panneau sombre encadré ensuite, nouvelle
> surface jamais. Le pied de page porte en outre un filet supérieur.

> **Piège à connaître.** `cn()` ne fusionne pas les classes Tailwind
> concurrentes. Passer `hidden` en `className` à un `ButtonLink` dont la
> base contient `inline-flex` ne masque rien : les deux règles coexistent et
> l'ordre de la feuille de style tranche. La visibilité et le partage de largeur
> se portent donc sur une **enveloppe**, jamais sur la primitive. Le cas s'est
> réellement produit en phase 4 sur le CTA de l'en-tête.

---

## 8 bis. Carte de couverture — refaite au correctif 10C

Pièce signature du site. Sources et licences : `MAP_DATA_SOURCES.md`.

### L'erreur des deux premières versions

Elles partageaient la même faute de conception : **le sujet de la carte était
le cercle de 100 km**, et le territoire n'en était que le fond. Deux
conséquences, toutes deux reprochées par le client :

- le territoire devenait méconnaissable — un aplat vert sans trait de côte ;
- les communes de la métropole, distantes de trois kilomètres, tombaient sur
  le même pixel. Impossible de les étiqueter, donc soit elles disparaissaient,
  soit on affichait des villes lointaines qui « flottaient dans le vide ».

**Le sujet est maintenant le territoire.** Le rayon est devenu une mention.

| | Avant | Maintenant |
| --- | --- | --- |
| Cadre | rayon dimensionnant la carte | **±112 km : le territoire ET la portée entière** |
| Cœur de zone | disque de 25 km inventé | **les 71 communes réelles de la métropole** |
| Couverture | 4 anneaux concentriques | **3 surfaces emboîtées** |
| Mer | inexistante | **aplat pierre, trait de côte réel** |
| 100 km | quatre anneaux dominants | **un seul cercle, pointillé, tracé en dernier** |
| Communes | tassées ou lointaines | **jusqu'à 21, grappe en étoile + couronne d'azimuts** |

### Une échelle de valeurs, pas des opacités empilées

La première palette empilait des opacités de 3 à 16 % : tout se valait, rien ne
ressortait, et le rendu paraissait délavé. Elle est remplacée par des **aplats
opaques** déclarés en jetons dans `globals.css`, dérivés des six couleurs de la
charte — aucune couleur nouvelle.

```css
--map-sea:       forêt 44 % + pierre     /* Manche : plus froid, plus sombre */
--map-land:      ivoire                  /* terre ferme */
--map-region:    mousse 64 % + ivoire    /* Seine-Maritime */
--map-core:      forêt 62 % + mousse     /* métropole */
--map-line:      forêt 72 %              /* limites structurantes */
--map-line-soft: forêt 34 %              /* limites de fond */
```

L'ordre du plus clair au plus sombre porte toute la lisibilité :
**terre < département < mer < cœur de zone**. L'écart entre deux niveaux
voisins est franc, jamais graduel.

> **Deux passes de saturation ont été nécessaires.** Les valeurs d'origine
> (mer 30 %, région 46 %, cœur 82 % de mousse) ont été jugées fades une fois
> en place. Le cœur de zone est passé d'un mélange à base de mousse à un
> mélange à base de **forêt**, ce qui lui donne la densité d'un vrai centre ;
> la mer a été assombrie de 30 à 44 %. C'est l'écart entre les niveaux, pas
> leur teinte, qui a réglé le problème.

### Quatre niveaux de contraste

| Couche | Traitement | Rôle |
| --- | --- | --- |
| Mer | `--map-sea` | fond, donne le trait de côte |
| Terre (19 départements) | `--map-land` | figure contre le fond |
| Seine-Maritime | `--map-region`, contour forêt | zone principale |
| Métropole (71 communes) | `--map-core`, filet ivoire interne | cœur de zone |
| Seine | forêt 55 %, 1,5 px, fondu radial | repère qui situe Rouen |
| **Portée de 100 km** | **jaune sécurité 85 %**, pointillé `7 5` | limite, tracée en dernier |
| Rouen | **jaune sécurité**, anneau ivoire | le centre, une seule fois |

C'est le couple **mer pierre / terre ivoire** qui a débloqué le rendu. Sans
lui, la terre avait la couleur exacte du fond de page et la carte paraissait
vide. Il a fallu charger les dix-neuf départements du cadre, et non les cinq
normands, pour que l'espace restant soit réellement la mer.

Le cercle de portée est passé du vert au **jaune sécurité** : en forêt à 45 %
il se confondait avec les limites départementales, alors que c'est l'élément
que la section entière annonce. Le jaune est la couleur d'accent de la charte,
déjà portée par Rouen ; l'employer ici relie le centre à sa portée. Il n'est
utilisé nulle part ailleurs sur la carte.

La plaque porte `rounded-card` et `overflow-hidden` : elle se lit comme une
carte posée, pas comme un dessin qui déborde.

### Les lignes de rappel

Cinq communes dans dix kilomètres, soit une vingtaine de pixels. Leurs
étiquettes sont **déportées en étoile** et reliées à leur point par une ligne
de rappel — le procédé cartographique classique pour une grappe dense, et la
seule façon de tenir « cinq communes lisibles » et « aucune collision »
ensemble.

Les angles suivent la position réelle : Bois-Guillaume au nord-est part vers
le nord-est, Le Grand-Quevilly au sud-ouest vers le sud-ouest. Aucune ligne
n'en croise une autre.

> **La longueur du rappel est mise à l'échelle**, pas le texte : la variable
> `--map-leader` vaut 0,36 sous 480 px, 0,72 jusqu'à 1024, puis 1. Mesuré à
> 320 px, un rappel pleine longueur poussait Mont-Saint-Aignan hors du cadre.
> Le texte, lui, garde sa taille à toutes les largeurs.
>
> **L'alignement de l'étiquette dépend de l'inclinaison du rappel.** Un rappel
> majoritairement vertical porte une étiquette **centrée** ; l'aligner sur un
> bord la décalerait d'une demi-largeur vers l'extérieur, ce qui suffit à la
> sortir du cadre. Un rappel horizontal, lui, s'aligne du côté opposé au point,
> sinon l'étiquette recouvre son propre trait.

### La règle du littoral

Les repères de la couronne n'ont pas de rappel : leur étiquette est collée au
point, d'un côté choisi commune par commune. Une règle prime sur toutes les
autres :

> **Une commune littorale porte son étiquette vers l'intérieur des terres.**

Une étiquette posée côté large se lit comme **une ville en pleine mer**, même
quand le point, lui, est parfaitement sur la terre — c'est exactement le
défaut signalé sur Le Havre, Fécamp et Le Tréport, alors qu'un test
point-dans-polygone ne trouvait aucune commune hors terre. Le défaut était
typographique, pas géographique.

Le Havre en est le cas limite : son étiquette part vers l'**est**, pas vers le
sud, parce qu'au sud du Havre il y a l'estuaire.

### Deux couches, et pourquoi

SVG pour la géométrie, **HTML pour les repères, les rappels et les
étiquettes**. Un `<text>` SVG grandirait avec la `viewBox` ; un repère HTML
devient un vrai `<button>`, avec focus clavier natif et cible de 44 px.

> **Contrainte d'alignement.** Le conteneur porte le rapport `MAP_ASPECT`
> **généré**. Ne jamais le remplacer par une valeur écrite à la main : les
> deux couches se décaleraient.

### Séquence d'animation — 2,9 s

| t | Étape |
| --- | --- |
| 0 | La mer, puis la terre |
| 120 ms | La Seine-Maritime se détache |
| 200 ms | Le contour régional se trace |
| 420 ms | **La Seine se trace** |
| 760 ms | La métropole se remplit depuis son centre |
| 1 000 ms | Les communes se posent, Rouen en premier — cadence 60 ms |
| 1 200 ms | Deux battements sur Rouen, puis plus rien |
| 1 300 ms | **Le cercle de 100 km se trace**, par-dessus le territoire |
| 2 450 ms | La pastille « 100 km » |
| 2 600 ms | La mention « portée maximale indicative » |

Le cercle se **trace** et n'apparaît pas : c'est ce tracé qui donne la
sensation d'expansion, sans balayage ni halo.

> La cadence des repères est passée de 110 à **60 ms** en même temps que leur
> nombre passait de 16 à 21. À 110 ms, la pose durait 3,3 s à elle seule et le
> semis devenait un égrenage. Une animation signature se règle sur sa durée
> ressentie, pas sur son nombre d'éléments.

Aucune boucle. État par défaut = état final : sans JavaScript ou sous
`prefers-reduced-motion`, la carte est complète immédiatement.

### Responsive — mesuré

Repères affichés, pastille « 100 km » et mention comprises.

| Largeur | Carte accueil | Carte page | Repères |
| --- | --- | --- | --- |
| 320 px | 280 px | 280 px | 7 |
| 390 px | 350 px | 350 px | 7 |
| 430 px | 390 px | 390 px | 7 |
| 768 px | 689 px | 689 px | 23 |
| 1024 px | 913 px | 913 px | 23 |
| 1440 px | **1 144 px** | 960 px | 23 |

Sous 768 px la carte ne conserve que **cinq repères** — Rouen,
Mont-Saint-Aignan, Le Havre, Beauvais, Évreux : mesuré, une grappe de 14 px ne
porte pas trois étiquettes déportées, quelles que soient les longueurs de
rappel. Les autres communes du cœur restent listées sous la carte.

À 1440 px la carte d'accueil est **plus large que celle de la page** : la
section a été recomposée en bandeau et la carte y prend toute la largeur du
conteneur, quand la page la borne à `60rem` pour préserver sa colonne de
lecture.

**Zéro collision et zéro débordement** sur les deux pages, aux six largeurs,
vérifié par comparaison deux à deux des rectangles de toutes les étiquettes et
par test de contenance dans la plaque.

---

## 8 ter. Configurateur de devis — primitives de formulaire

Livrées en phase 11, dans `src/components/quote/`. Elles ne sont pas dans
`src/components/ui/` : elles servent un seul parcours, et les promouvoir en
primitives générales avant d'avoir un second usage serait de l'abstraction
spéculative.

| Composant | Rôle |
| --- | --- |
| `ChoiceCard` | Carte de sélection photographique — étape 1 |
| `ChoiceChip` | Pastille de choix, radio ou case — étape 2 |
| `Field` / `TextareaField` | Champ étiqueté avec erreur reliée |
| `ChoiceGroup` | `fieldset` + `legend` autour d'un groupe |
| `PhotoPicker` | Dépôt de photos, aperçus, refus motivés |
| `QuoteProgress` | Progression, deux traitements |
| `QuoteSummary` | Récapitulatif éditable |

### Le configurateur est un objet, pas une suite de blocs

Première version : tout posé à plat sur l'ivoire. Un formulaire pâle, sans
hiérarchie, que rien ne distinguait du texte éditorial au-dessus — le reproche
exact du client (« c'est fade »).

Le configurateur est désormais un **panneau fermé, en deux zones franches** :

| Zone | Surface | Porte |
| --- | --- | --- |
| Bandeau | **forêt** (`data-surface="dark"`) | progression, numéro, question de l'étape |
| Corps | ivoire | les contrôles |

Le découpage n'est pas décoratif : il sépare **« où j'en suis »** de **« ce que
je dois faire »**, les deux questions que se pose la personne à chaque étape.

C'est aussi ce qui rend la progression lisible. Sur ivoire, le filet jaune
tombait à **1,96** — invisible à un mètre. Sur forêt il atteint **7,16**, et il
devient le premier repère lu en arrivant sur l'étape.

### La pastille est un objet, pas un contour

| État | Traitement |
| --- | --- |
| Au repos | fond `--surface-inset`, filet `--surface-rule` |
| Survol | filet `--surface-fg-muted` |
| **Sélectionné** | **aplat forêt, texte ivoire** (14,04), repère jaune, échelle 1,02 |

Au repos, la pastille a un fond : elle se lit comme une chose qu'on peut
toucher, pas comme un cadre dessiné. Sélectionnée, elle bascule sur le
contraste le plus fort de la charte — le choix retenu se repère d'un coup
d'œil au milieu de six options.

Le jaune sécurité reste réservé au **repère de validation**, une dizaine de
pixels : il ne devient jamais un aplat, conformément à « maximum une occurrence
pleine par écran visible ».

### Le bouton « Continuer » change de variante, pas d'opacité

Étape incomplète → `outline`. Étape complète → `primary`. Un bouton translucide
paraît **raté**, pas indisponible ; et `cn()` ne fusionnant pas les classes,
forcer un fond par-dessus `variantClasses.primary` aurait laissé les deux en
place. Deux variantes donnent deux états francs — et le bouton **s'allume** au
moment où l'information est réunie.

### Cascade des options

Chaque pastille et chaque carte entre avec un retard indexé sur son rang :
`--chip-index`, 40 ms d'écart, 300 ms de durée. Au-delà de 40 ms, six options
mettent une demi-seconde à se poser et l'attente devient perceptible. Le but
est de faire sentir que les choix **arrivent**, pas de les faire attendre.

Le bloc d'étape étant remonté par son `key`, la cascade se rejoue à chaque
étape sans un seul état à gérer.

### Le contrôle natif est toujours là

`ChoiceCard` et `ChoiceChip` enveloppent un `<input>` réel en `sr-only`. Le
brief demandait « pas de radio button visible classique » — **visible**, pas
absent. Conséquences gratuites : navigation aux flèches dans un groupe de
radios, barre d'espace sur une case, annonce « case d'option 2 sur 5 »,
`:focus-visible` natif remonté au conteneur par `has-[:focus-visible]`.

Un `div` avec `role="radio"` aurait produit le même dessin et trois bugs
d'accessibilité à écrire soi-même.

### L'état sélectionné ne repose jamais sur la couleur

Trois signaux simultanés, dont deux non chromatiques : **filet à 2 px**,
**voile**, **pastille de validation**. Et sur les pastilles, la forme du repère
annonce le comportement avant la première sélection — **carré pour un choix
multiple, rond pour un choix unique**.

### L'erreur, sans rouge

La charte ne contient pas de rouge et il n'en a pas été introduit pour
l'occasion. Une erreur se signale par :

1. un **filet épaissi à 2 px en jaune sécurité** sur le champ ;
2. un **pictogramme** devant le message ;
3. un **texte explicite** qui dit quoi faire — « Indiquez un code postal à
   5 chiffres », jamais « champ invalide ».

Le message est **sous le champ**, relié par `aria-describedby`, avec
`aria-invalid` sur le contrôle. Aucun toast, aucun bandeau rouge global : une
erreur se lit là où elle se corrige.

### `aria-disabled` plutôt que `disabled`

Le bouton « Continuer » paraît inactif tant que l'étape est incomplète, mais
reste **focusable et cliquable** : le clic affiche ce qui manque. Un bouton
réellement `disabled` sort de la tabulation et n'explique rien — l'utilisateur
au clavier se retrouve devant un mur muet.

### Transition entre étapes

320 ms, glissement de 20 px + fondu, **sens porté par la navigation** : entrée
par la droite en avançant, par la gauche en revenant. Le mouvement dit où l'on
va ; il n'est pas décoratif.

Aucun composant d'animation, aucun état de transition : le bloc d'étape porte
un `key` sur l'index, React le remonte, et le remontage rejoue l'animation
CSS. Le sens vient d'un attribut `data-direction`.

Tout est sous `prefers-reduced-motion: no-preference`.

### Fin de parcours

| Élément | Traitement |
| --- | --- |
| Anneau de préparation | se **remplit une fois** puis s'arrête — jamais un spinner |
| Lignes cochées | cascade, 380 ms d'intervalle |
| Sceau du récapitulatif | échelle 0,72 → 1 + opacité, **aucun rebond** |
| Blocs du récapitulatif | cascade, 90 ms d'intervalle |

Un *spinner* tourne indéfiniment et ne dit rien du temps restant ; un arc qui
se ferme dit « ça avance et ça va s'arrêter ». C'est le même vocabulaire que
le cercle de portée de la carte de zone — un tracé, pas une rotation.

Sous `prefers-reduced-motion`, la séquence entière est **sautée**, pas
ralentie : faire patienter sans animation serait le pire des deux mondes.

### Mesures

| Contrôle | Hauteur |
| --- | --- |
| Champ de saisie, pastille | 44 px minimum |
| Bouton de navigation | 48 px (`md`) / 56 px (`lg`) |
| Retrait d'une photo | 44 × 44 px |

Taille de police des champs : `--text-body`, soit **16 px minimum** — en
dessous, iOS zoome automatiquement à la mise au point du champ.

---
## 9. Accessibilité

- Contraste AA minimum sur tout texte (tableaux des sections 1 et 2).
- Lien d'évitement vers `#contenu` en tête de page, révélé au premier `Tab`.
- Menu mobile : `role="dialog"`, `aria-modal`, `aria-expanded` / `aria-controls`,
  fermeture par `Échap`, focus piégé puis rendu au bouton d'ouverture,
  défilement du corps verrouillé pendant l'ouverture.
- Page courante signalée par `aria-current="page"` dans toutes les navigations.
- **Focus visible : contour 2 px, offset 2 px, couleur `--focus-ring`** — forêt
  sur surface claire, jaune sécurité sur surface sombre.
  *Correction apportée en phase 2 :* le jaune sécurité ne contraste qu'à **1,96
  contre l'ivoire**, très en deçà des 3:1 exigés pour un indicateur de focus
  (WCAG 2.2, 2.4.11). Il est donc réservé aux surfaces sombres, où il atteint
  7,16. L'identité visuelle du focus jaune est conservée là où elle est lisible.
- Cibles tactiles ≥ 44 × 44 px : boutons à 48 px minimum, `ArrowLink` à 44 px.
- Navigation clavier complète, ordre de tabulation logique, lien d'évitement
  vers le contenu principal (à ajouter en phase 4 avec l'en-tête).
- Aucune information portée uniquement par la couleur, le survol ou l'animation.
  Les liens sont soulignés en permanence.
- Structure de titres continue : un seul `h1` par page, pas de saut de niveau.
  Une `<section>` porte un nom accessible via `aria-labelledby`, sinon on utilise
  l'option `plain` qui rend un `<div>`.
- Formulaires : `label` visible associé, erreurs textuelles explicites,
  `aria-live` sur le récapitulatif d'erreurs du configurateur (phase 12).

---

## 10. Jetons implémentés

Déclarés dans `src/app/globals.css` :

- **Couleurs** : `--color-forest`, `--color-ivory`, `--color-charcoal`,
  `--color-moss`, `--color-stone`, `--color-safety`, `--color-transparent`,
  `--color-current`
- **Typographies** : `--font-display`, `--font-sans`
- **Échelle typographique** : `--text-display`, `--text-title`,
  `--text-subtitle`, `--text-lead`, `--text-body`, `--text-caption`,
  `--text-eyebrow` (+ variantes `--line-height` et `--letter-spacing`)
- **Rayons** : `--radius-none`, `--radius-edge`, `--radius-soft`
- **Points de rupture** : `--breakpoint-sm`, `--breakpoint-md`,
  `--breakpoint-lg`, `--breakpoint-xl`
- **Largeurs** : `--container-reading`, `--container-content`,
  `--container-wide`
- **Rythme responsive** (`:root`) : `--gutter`, `--section-space`,
  `--reveal-shift`
- **Surfaces** (`:root` / `[data-surface]`) : `--surface-bg`, `--surface-fg`,
  `--surface-fg-muted`, `--surface-heading`, `--surface-rule`,
  `--surface-inset`, `--focus-ring`, `--btn-solid-bg`, `--btn-solid-fg`,
  `--btn-outline-border`
- **Mouvement** — courbes dans `@theme` : `--ease-cime`, `--ease-line` ;
  durées dans `:root` : `--duration-micro`, `--duration-reveal`,
  `--duration-signature`
- **Menu mobile** (style en ligne) : `--menu-index`, pour l'échelonnement de
  l'apparition en cascade
- **Carte de zone** (`:root`) : `--map-sea`, `--map-land`, `--map-region`,
  `--map-core`, `--map-line`, `--map-line-soft` — tous dérivés par `color-mix`
  des six couleurs de la charte. En style en ligne : `--map-leader`
  (échelle des lignes de rappel), `--map-marker-index` (cadence de pose),
  `--map-outline-length`, `--map-seine-length`, `--map-reach-circumference`
  (longueurs de tracé, **générées**)
- **Exception** : `--radius-card` (16 px), réservé aux cartes photographiques
  de la section Prestations

Toute évolution de cette liste implique une mise à jour de ce document.

---

## 11. Recette responsive

**Aucun débordement horizontal** : 25 combinaisons vérifiées en phase 4
(5 largeurs x 5 pages : `/`, `/elagage`, `/devis`, `/mentions-legales`,
`/style-guide`), `documentElement.scrollWidth` toujours égal à la largeur du
viewport.

| Largeur | Gouttière | Rythme | `h1` | Texte courant |
| --- | --- | --- | --- | --- |
| 320 px | 20 px | 72 px | 40 px | 16 px |
| 390 px | 20 px | 72 px | 40 px | 16 px |
| 768 px | 32 px | 96 px | 53 px | 16,4 px |
| 1024 px | 48 px | 128 px | 62 px | 16,6 px |
| 1440 px | 48 px | 128 px | 76 px | 17 px |

Les contenus larges par nature (tableaux de la style guide) défilent dans leur
propre conteneur `overflow-x-auto` : ils ne poussent jamais la page.

---

## 9 bis. Règles consolidées par l'audit de phase 15

Trois règles existaient déjà mais n'étaient pas tenues partout. L'audit les
a mesurées ; elles sont désormais vérifiées.

### Cible tactile : 44 px, sans exception négociable

Le pied de page était le **seul endroit du site** où la règle était
enfreinte : onze liens à `min-h-9` (36 px). Corrigé en `min-h-11`.
Le logotype passait de 40 à 44 px.

Une seule exception subsiste, et elle est standard : le **lien d'évitement**,
à 1 × 1 px tant qu'il n'a pas le focus. Il reprend une taille normale au
moment précis où il sert.

> **Ne jamais réduire une zone tactile pour resserrer une mise en page.**
> C'est la hauteur de la zone qui change, jamais celle du texte.

### Le nom accessible doit contenir le texte visible (WCAG 2.5.3)

Le logotype portait `aria-label="Arbres et Cimes Élagage — retour à l'accueil"`
alors qu'il affiche « Arbres & Cimes / ÉLAGAGE · ROUEN ». Une commande vocale
« clique sur Arbres et Cimes » ne trouvait pas la cible.

> **Un `aria-label` ne remplace pas un texte visible, il le complète.**
> Quand un élément porte du texte, ce texte doit faire partie de son nom
> accessible ; la précision s'ajoute en `sr-only`.

### L'opacité ne remplace pas une couleur mise en sourdine

L'invite de la carte portait `opacity-70` sur de la mousse : contraste
**2,86**, sous le seuil AA. La couleur `--surface-fg-muted` existe
précisément pour ça et tient **5,15**.

> **Ne pas empiler une opacité sur un jeton déjà mis en sourdine.** Les
> contrastes du § 1 sont calculés à pleine opacité ; toute transparence
> ajoutée les invalide.

### Fondu d'apparition et contraste — règle remplacée en phase 15B.2

**La règle de phase 15 était fausse, et deux réglages successifs l'ont
prouvé.** Elle disait : resserrer la plage du fondu pour réduire la fenêtre
de contraste insuffisant. La plage est passée de `entry 60%` à `entry 40%`
en phase 15, puis a été plafonnée à `min(40%, 180px)` en phase 15B.2 pour la
rendre indépendante de la hauteur du bloc.

Les deux fois, l'audit a mesuré exactement le même défaut : contraste
**2,10** sur `/zones-intervention/rouen`, **1,22** sur `/realisations`.

La raison est structurelle. Un fondu lié au défilement traverse **toujours**
des valeurs intermédiaires ; en réduire la durée déplace le moment où on les
observe, sans jamais les supprimer. Un réglage ne pouvait donc pas régler ce
problème.

`CLAUDE.md` § 7 tranche : *un effet visuel qui coûte de l'accessibilité est
supprimé, pas optimisé*.

> **Le `Reveal` n'anime plus l'opacité.** Il n'anime que `translateY`. Une
> transformation ne modifie ni la couleur du texte, ni celle du fond, et ne
> provoque aucun décalage de mise en page : son coût en accessibilité est
> nul. Le mouvement se lit toujours.

> **Règle : ne jamais lier l'opacité d'un texte au défilement.** Un fondu
> déclenché au chargement, borné dans le temps (520 ms pour le hero), ne pose
> pas le même problème : il est terminé avant que le texte ne soit lu, et
> aucun audit ne l'a signalé. C'est la liaison au **défilement** qui est en
> cause, parce qu'elle maintient l'état intermédiaire aussi longtemps que le
> visiteur ne fait pas défiler.
>
> Le fondu d'entrée du hero (`cime-hero-rise`) est donc conservé tel quel.

### Animation et LCP

Chrome **exclut des candidats LCP tout élément peint à opacité nulle**.
Animer l'opacité du plus grand texte d'une page le disqualifie donc pendant
toute la durée de l'animation.

> **Quand un masque `overflow-hidden` suffit à cacher un élément, ne pas
> lui ajouter d'animation d'opacité.** Le titre du hero cumulait les deux :
> l'opacité était redondante visuellement et coûteuse à la mesure.

### Longueur de ligne

Tout paragraphe doit porter une largeur maximale. Un texte laissé libre dans
`Container` atteignait **164 caractères** en 1440 px.

### Mouvement réduit — vérifié, pas supposé

Sous `--force-prefers-reduced-motion`, une capture pleine page montre
**tout le contenu visible**, carte comprise. La règle `[data-reveal]` est
enfermée dans `@media (prefers-reduced-motion: no-preference)` : sous
`reduce`, aucune `opacity: 0` n'est jamais posée.

> **Aucune section ne doit dépendre d'une animation pour devenir visible.**
> Se protéger par la règle globale d'annulation ne suffit pas : il faut que
> l'état masqué ne soit jamais appliqué.

Mesures complètes : `PERFORMANCE_AUDIT.md`.

---

## 9 ter. Logotype réel — livré en phase 15B

Le logo du client remplace le logotype typographique provisoire. Fichiers
dans `public/brand/`, icônes dans `src/app/`.

### Le nom était faux

Le logo porte **« Arbres et Cimes Élagage »**, au pluriel. Tout le site
était écrit au singulier — **77 occurrences corrigées dans 22 fichiers**,
code et documentation compris. La source unique est `src/lib/site.ts`.

### Deux traitements, et pourquoi

Le logo fourni est un **bloc vertical** : feuille, puis le nom sur deux
lignes, puis « Arboriste Grimpeur ». Le fichier de navigation lui-même fait
354 × 420 px.

| Variante | Où | Composition |
| --- | --- | --- |
| `lockup` (défaut) | en-tête, menu mobile, pied de page | symbole réel + nom dans la typographie du site |
| `full` | *aucun emplacement à ce jour* | le logo complet, tel que fourni |

**Pourquoi pas le logo complet dans l'en-tête :** dans une barre de 72 px,
le bloc tiendrait sur ~50 px de large et son texte tomberait sous 8 px.

**Pourquoi pas le logo complet dans le pied de page**, alors que la place y
est : le logo est dessiné **pour fond clair**. Son contour et son texte sont
en charbon ; posés sur le forêt du pied de page, « Arbres et Cimes Élagage »
devient quasi illisible. Vérifié à l'écran, ce n'est pas une précaution
théorique.

> **À demander au client : une version claire ou inversée du logo.** Elle
> débloquerait `variant="full"` sur les surfaces sombres. La variante
> existe déjà dans le composant et n'attend que le fichier.

### Les couleurs du logo ne rejoignent pas la charte

Le logo emploie un vert vif, un gris clair et un orange qui ne figurent pas
dans les six couleurs `VERROUILLÉES`. **C'est normal et cela reste ainsi** :
un logo conserve ses couleurs propres. Aucune n'a été ajoutée aux jetons, et
aucune ne doit être reprise ailleurs dans l'interface.

### Icônes

`favicon.ico` (256), `icon.png` (192), `apple-icon.png` (180) dans
`src/app/` — détectées automatiquement par Next, aucune déclaration
manuelle. L'icône typographique provisoire créée en phase 15 a été retirée.

---

# Direction visuelle — phase 15B

La direction d'origine était **éditoriale** : serif expressive, grands
filets, longues compositions de texte, une seule hauteur de section. Elle a
été jugée trop magazine pour un site de service dont l'objectif unique est
la demande de devis.

Cette phase ne refait **aucune page**. Elle refait les fondations sur
lesquelles les pages seront reprises. Référence vivante : `/style-guide`,
bloc 13.

## 1. Typographie — Sora + Inter

| Rôle | Fonte | Graisses |
| --- | --- | --- |
| Titres (`--font-display`) | **Sora** | 600, 700 |
| Texte et interface (`--font-sans`) | **Inter** | 400, 500, 600 |

Fraunces et Manrope ne sont plus chargées ni référencées nulle part.

**Graisses explicites, pas de fonte variable.** Le projet n'utilise que cinq
graisses ; charger deux fontes variables embarquerait tout l'axe, dont
l'essentiel ne serait jamais rendu.

### Échelle

| Jeton | Emploi | Mobile → 1440 |
| --- | --- | --- |
| `text-display` | H1 | 40 → 72 px, interlettrage −0,03em |
| `text-title` | H2 | 34 → 56 px, −0,025em |
| `text-subtitle` | H3 | 22 → 27 px |
| `text-lead` | chapô | 17 → 19 px |
| `text-body` | texte courant | 16 → 18 px |
| `text-ui` | boutons, libellés | 14 → 16 px |
| `text-caption` | légendes, capsules | 13 → 14 px |
| `text-eyebrow` | surtitre | 12 px, interlettrage **0,12em** |

L'interlettrage du surtitre passe de 0,24em à 0,12em : les 0,24em
appartenaient au registre magazine que cette direction abandonne.

## 2. Palette

| Jeton | Valeur | Rôle |
| --- | --- | --- |
| `forest` | `#10271E` | dominante sombre |
| `deep-forest` | `#081A14` | **nouveau** — surfaces d'ancrage |
| `ivory` | `#F5F3ED` | fond clair par défaut |
| `sand` | `#E7E2D8` | **nouveau** — second fond clair, cartes |
| `charcoal` | `#161A18` | texte principal sur clair |
| `moss` | `#4F6B58` | texte secondaire **sur clair uniquement** |
| `stone` | `#CBC8BD` | texte secondaire sur sombre |
| `safety` | `#E4B23C` | accent — actions |

**Les noms de jetons n'ont pas changé, seules les valeurs.** Aucune page n'a
eu à être retouchée.

### Contrastes mesurés

| Combinaison | Ratio | Verdict |
| --- | --- | --- |
| ivoire sur forêt profond | 16,20 | AAA |
| charbon sur ivoire | 15,84 | AAA |
| forêt sur ivoire | 14,22 | AAA |
| forêt sur sable | 12,22 | AAA |
| pierre sur forêt | 9,42 | AAA |
| forêt sur accent | 8,06 | AAA — libellé du CTA primaire |
| mousse sur ivoire | 5,29 | AA |
| mousse sur sable | 4,55 | AA — **juste au-dessus du seuil** |
| mousse sur forêt | 2,69 | **échec** — décor seul |
| accent sur ivoire | 1,76 | **échec** — jamais de texte |

> Mousse sur sable tient à 4,55. **Ne rien empiler dessus** : une opacité
> ajoutée la fait passer sous le seuil. C'est le défaut relevé sur le
> `Label` du style-guide pendant cette phase même (3,53 avec `opacity-80`).

## 3. Quatre surfaces

| Surface | Fond | Emploi |
| --- | --- | --- |
| `data-surface="light"` | ivoire chaud | défaut |
| `data-surface="sand"` | sable | second fond clair |
| `data-surface="dark"` | forêt | surface sombre courante |
| `data-surface="deep-forest"` | forêt profond | **ancrage — à garder rare** |

L'alternance clair → sombre → clair → sombre se fait sans une ligne de CSS
dupliquée. `deep-forest` ne doit pas devenir la surface sombre par défaut :
c'est sa rareté qui lui donne son poids.

## 4. Proportions

| Rythme | Mobile / 768 / 1024 | Emploi |
| --- | --- | --- |
| `compact` | 48 / 64 / 80 | bandeau, rappel |
| `standard` | 72 / 96 / 128 | la majorité |
| `signature` | 96 / 136 / 176 | moments qui respirent |

Les valeurs de la phase 2 (`tight`, `default`, `loose`) restent acceptées et
pointent sur les nouveaux jetons : les pages livrées les emploient, et cette
phase ne devait toucher aucune page.

- `--container-reading` : 42rem → **40rem** (55-70 caractères à 16-18 px)
- `--container-content` : 77.5rem → **82.5rem** — en 1440 px, le contenu
  doit occuper la largeur disponible
- `--card-gap` : 16 / 20 / 24 px

## 5. Rayons

| Jeton | Valeur | Emploi |
| --- | --- | --- |
| `radius-edge` | 2 px | filets, angles francs |
| `radius-soft` | 8 px | encadrés discrets |
| `radius-control` | **12 px** | boutons, champs |
| `radius-card` | **18 px** | cartes, figures |
| `radius-pill` | 9999 px | capsules |

## 6. Cartes — une primitive, pas sept composants

`Card` et `CardLink`. Le brief listait sept usages (KPI, service, visuel,
confiance, info, sombre, CTA, contact) : ils ne diffèrent que par la
**surface**, le **rembourrage** et le fait d'être **cliquables ou non**.
Sept composants auraient produit sept fois la même logique de bordure et
d'état, avec sept occasions de diverger.

Tons : `plain`, `sand`, `forest`, `deep`, `accent`. Les tons sombres et
l'accent **basculent les jetons de surface** — le contenu n'a pas à savoir
sur quel fond il est posé.

Rayon 18 px, bordure fine, **aucune ombre**. L'interaction se lit à la
bordure et à une translation de 2 px.

> `CardLink` rend un **lien réel**, jamais un `div` cliquable. Conséquence :
> aucun autre lien ni bouton à l'intérieur — un lien dans un lien est du HTML
> invalide, et l'audit de la phase 15 le détecte.

## 7. Capsules

`Capsule` + `CapsuleGroup`. 32 px de haut, rayon pilule, trois variantes :
`light` (sable/forêt), `dark` (ivoire 10 %/ivoire), `accent` (jaune/forêt).

**`aria-hidden` par défaut.** Une capsule qui redit ce que le titre voisin
dit déjà ne doit pas être annoncée deux fois. Passer `decorative={false}`
quand elle porte une information unique.

`CapsuleGroup` existe pour une seule raison : le site est centré
(`main { text-align: center }`) et une rangée `flex` ne suit pas
`text-align`. L'oubli du `justify-center` a déjà décalé une rangée en
phase 4.

## 8. Boutons

| Variante | Fond | Texte | Contraste |
| --- | --- | --- | --- |
| `primary` | accent | forêt | 8,06 |
| `secondary` | forêt | ivoire | 14,22 |
| `light` | ivoire | forêt | 14,22 |
| `ghost` | transparent | courant | — |

Hauteurs 48 px (`md`) et 52 px (`lg`), rayon 12 px, cible tactile toujours
≥ 44 px. `solid` et `outline` restent acceptés tant que les pages ne sont
pas refaites.

État `loading` : deux points qui pulsent, **pas un disque qui tourne**. Un
spinner tourne indéfiniment et ne dit rien du temps restant. Le libellé reste
en place — le remplacer ferait sauter la largeur du bouton.

**La règle de parcimonie survit à la refonte : un seul bouton primaire par
écran visible.**

## 9. Fonds de section

`SectionPattern`, deux motifs et pas un de plus :

- **`rings`** — cernes de bois, arcs concentriques **décentrés**. Le
  décentrement empêche la lecture « cible ».
- **`contour`** — courbes de niveau, amplitudes décalées pour éviter la trame.

SVG inline, `currentColor`, `aria-hidden`, `pointer-events-none`, aucune
requête, aucun JavaScript. Opacité par défaut **0,06** : au-delà de 0,1 le
motif cesse d'être une texture et devient un dessin.

> Deux motifs, pas un par page. Un troisième n'aurait servi qu'à éviter la
> répétition, c'est-à-dire à faire du décor.

## 10. Ce qui n'a pas changé

Les trois niveaux d'animation (micro 180 ms, reveal 520 ms, signature
900 ms), la neutralisation sous `prefers-reduced-motion`, les cibles
tactiles à 44 px, la règle du focus visible, et l'interdiction du jaune en
texte sur fond clair.

**Accessibilité vérifiée après refonte : 100 sur `/`, `/devis` et
`/style-guide`.**

---

# Châssis — phase 15B.2

La phase 15B.1 avait refait les jetons sans toucher aux pages. Cette phase
applique la nouvelle direction au **châssis** : en-tête, navigation, menu
mobile, CTA, pied de page. Rien d'autre n'a été repris.

## 1. La navigation compte cinq entrées, plus un CTA

| Entrée | Nature |
| --- | --- |
| Prestations | groupe, ouvre un menu de 4 liens |
| Réalisations | lien |
| Zones | lien (`navShortLabel`) |
| À propos | lien |
| Contact | lien |
| **Demander un devis** | **CTA, pas une entrée de menu** |

`Contact` devient une entrée principale : c'est le second chemin de
conversion, il ne pouvait pas rester au pied de page seul.

`Zones` plutôt que `Zones d'intervention` : le libellé long faisait passer la
barre à six entrées visuellement serrées. `navShortLabel` porte cette
abréviation dans `routes.ts`, pour que le libellé complet reste celui des
titres et du fil d'ariane.

## 2. Le CTA est un bouton plein, plus un lien souligné

Le CTA devis était un lien souligné d'un filet jaune. Dans une barre de
navigation, un lien souligné **se lit comme une sixième entrée de menu** —
il ne remplit donc pas le rôle que `CONVERSION_STRATEGY.md` § 3 lui donne.

Il devient un `Button` primaire : aplat jaune sécurité, texte forêt,
contraste **8,06**. C'est la seule occurrence pleine de jaune de l'en-tête,
ce qui est exactement la règle d'usage du § 1.

## 3. Le bouton « Appeler » dépend d'un fait, pas d'une envie

Tout ce qui touche à l'appel passe par `contact.phoneConfirmed`
(`src/lib/site.ts`). Tant que le numéro n'est pas confirmé par le client :
**ni bouton, ni ligne, ni mention**, nulle part.

Renseigner `NEXT_PUBLIC_PHONE` le fait apparaître partout à la fois —
en-tête, menu mobile, barre d'action, pied de page — sans toucher une ligne
de composant. L'adresse e-mail suit le même mécanisme
(`contact.emailConfirmed`, `mailtoHref()`).

> **Aucun numéro n'est écrit en dur dans un composant.** C'est la règle
> `CLAUDE.md` § 4 appliquée au contact, et la garantie qu'aucun numéro
> fictif ne peut atteindre la production.

## 4. Le menu mobile n'est monté que lorsqu'il est ouvert

Le panneau restait monté en permanence sous `hidden`. Conséquence mesurée :
le logotype existait **en double** dans le DOM, dans une boîte de 0 × 0 px,
et tout audit calculant un rapport largeur/hauteur sur cette boîte signalait
une image déformée qui n'a jamais été affichée.

L'attribut `hidden` reste — il porte la sémantique pour les technologies
d'assistance. C'est le contenu qui devient conditionnel.

Comportement vérifié après le changement : focus déplacé sur « Fermer » à
l'ouverture, rendu au bouton « Menu » à la fermeture, défilement du corps
verrouillé puis restauré, aucune cible sous 44 px, aucun débordement.

## 5. Pied de page — deux zones

Sur **forêt profond**, avec le motif `rings` à 5 % d'opacité.

1. **Zone de conversion** : capsule « Devis gratuit », titre, CTA. C'est la
   dernière occasion de convertir un visiteur qui a fait défiler toute une
   page sans cliquer. Le CTA y avait été retiré en phase 15B sur demande du
   client ; il revient sous une forme différente — un bloc identifié, pas un
   lien perdu dans une colonne.
2. **Pied compact** : l'identité et les coordonnées à gauche, **trois**
   colonnes de liens à droite, le légal en bas.

### Les coordonnées ne sont pas une colonne de liens

Elles en occupaient une quatrième. Mesuré : l'adresse `aec.elagage76@gmail.com`
a besoin d'environ **180 px** pour tenir sur une ligne, et cette colonne n'en
faisait que **76 px à 480 px** et **98 px à 1024 px**. Le `break-all` la
coupait alors au milieu de « gmail ».

Le bloc d'identité fait 288 px : l'adresse y tient d'un tenant **à toutes les
largeurs mesurées** (179 à 204 px, de 320 à 1440 px), et les coordonnées se
lisent avec le nom de l'entreprise plutôt qu'en bout de rangée. Les trois
colonnes restantes y gagnent aussi — « Politique de confidentialité » ne se
casse plus non plus.

Le lien « Demander un devis » du pied a été retiré : il doublait le CTA situé
juste au-dessus.

> **Une adresse e-mail n'est pas un libellé de menu.** Lui réserver une
> colonne de largeur égale à celle de mots de huit caractères garantit
> qu'elle se cassera.

Les liens de pied de page portent `min-h-11`. Ils étaient à 36 px avant la
phase 15 — c'était le seul endroit du site où la règle des 44 px était
enfreinte.

## 6. Ce que la phase a mesuré

- **Accessibilité 100 et bonnes pratiques 100** sur les 15 passages
  Lighthouse (13 routes, 3 passages sur l'accueil).
- **CLS 0** partout.
- **48 combinaisons** (8 routes × 6 largeurs : 320, 390, 430, 768, 1024,
  1440) : aucun débordement horizontal, aucune cible tactile sous 44 px.

---

# Page d'accueil — phase 15B.3

La 15B.1 avait refait les jetons, la 15B.2 le châssis. Cette sous-phase
applique la direction à **la page d'accueil, et à elle seule**. Les sept
sections verrouillées et leur ordre sont inchangés.

## 1. Le rythme des surfaces est le sujet

Mesure avant refonte, à 1440 px : **six sections sur sept étaient claires**, et
cinq consécutives partageaient exactement le même ivoire — 6 855 px d'aplat
ininterrompu. La seule rupture était une bande de preuves de 121 px.

| # | Section | Avant | Après |
| --- | --- | --- | --- |
| 1 | Hero | photo (sombre) | photo (sombre) |
| 2 | Preuves | forêt, bande de 121 px | **sable**, quatre cartes |
| 3 | Prestations | ivoire | ivoire |
| 4 | Pourquoi | ivoire | **forêt profond** |
| 5 | Réalisations | ivoire | **sable** |
| 6 | Zone | ivoire | ivoire |
| 7 | Devis | ivoire | **sable + carte forêt profond** |

> **Deux sections voisines ne partagent plus jamais la même surface.** C'est la
> règle qui remplace « alterner de temps en temps ».

## 2. Pourquoi la carte reste sur ivoire

La question forêt / clair a été tranchée par la carte elle-même. Son échelle de
valeurs va **du clair vers le sombre** — terre ivoire, département, mer, cœur
de zone (§ 8 bis). Sur une section forêt, la terre ivoire deviendrait la zone
la plus lumineuse de l'écran : le fond passerait devant le sujet.

La régler pour du sombre supposerait de retoucher la palette géographique pour
une raison purement chromatique. Le rythme est donc tenu par ses voisines.

## 3. Trois anatomies de carte, jamais une de plus

Le risque d'une page entièrement en cartes est la grille interchangeable que
`PROJECT.md` interdit. Les trois séries de la page d'accueil ne se ressemblent
pas :

| Section | Anatomie |
| --- | --- |
| Preuves | carte pleine, valeur + libellé, **aucune image** |
| Prestations | texte **incrusté** sur la photographie, dégradé forêt |
| Réalisations | photographie **en tête de carte**, texte dessous sur le fond |

## 4. Grille asymétrique des prestations

Douze colonnes, deux rangées de proportions **inversées** :

| Rangée | Gauche | Droite |
| --- | --- | --- |
| 1 | Élagage — 7/12, 32 rem | Abattage — 5/12, 32 rem |
| 2 | Dessouchage — 5/12, 24 rem | Entretien — 7/12, 24 rem |

L'inversion 7/5 puis 5/7 produit l'asymétrie ; deux rangées 7/5 identiques
n'auraient fait que déplacer le problème. Les deux hauteurs hiérarchisent :
l'élagage est le cœur de métier, il occupe la plus grande surface.

**La mise en page est déclarée par identifiant de route, pas par index** :
réordonner `serviceRoutes` ne peut pas casser la grille en silence.

## 5. Un palier tablette était manquant

La grille passait de « une colonne » à « douze colonnes » sans rien entre 480
et 1024 px. Mesure à 768 px : Prestations **2 069 px**, Réalisations
**2 098 px** — deux colonnes vides de chaque côté de cartes bornées à 30 rem.

`md:grid-cols-2` sur les deux grilles ramène la page de 8 589 à **7 114 px** à
cette largeur.

> **Toute grille qui saute de 1 à 12 colonnes doit être vérifiée à 768 px.**

## 6. Capsule `photo` — nouvelle variante

Voir § 7 du bloc phase 15B.1 pour la primitive. La variante `photo` est ajoutée
ici parce que `dark` **ne garantit rien sur une image** : elle pose un fond
d'ivoire à 10 %, donc laisse passer 90 % de ce qu'il y a dessous.

Mesuré sur le hero, en recomposant le recadrage `object-cover` réel puis le
dégradé de lisibilité : les capsules tombaient dans une bande où le dégradé ne
vaut que **0,107** d'opacité, et le texte de 13 px y ressortait à **3,64** —
sous le seuil AA.

`photo` porte son propre fond, forêt à 80 % : **11,53** sur la photographie
servie, **8,12** sur son pixel le plus clair, **8,05** sur un blanc pur
théorique.

> **Une capsule posée sur une image utilise `photo`, jamais `dark`.**
> `dark` reste réservée aux aplats sombres, où le fond réel est connu.

## 7. Le hero

- **Hauteur** : `min-h-svh` (900 px sur un écran de 390 × 844) → **40 rem**
  (640 px), 44 rem au-delà de 480 px. L'ancienne valeur dépassait le viewport
  une fois l'en-tête déduit : le bouton tombait sous la ligne de flottaison.
- **Largeur de contenu** : `max-w-4xl` (896 px) → **68 rem** (1 088 px) dans un
  conteneur de 1 320. La colonne n'est plus une bande étroite posée sur une
  très grande photographie.
- **L'alignement reste centré.** C'est une décision client posée une fois pour
  toutes (§ 4). Occuper la largeur et ferrer à gauche sont deux choses
  différentes ; seule la première était demandée.
- **Trois capsules** remplacent le surtitre « 01 — Élagage · Abattage ·
  Entretien », qui répétait mot pour mot le paragraphe situé juste dessous.
- **Direction artistique inchangée** : deux sources distinctes, desktop
  horizontale et mobile verticale, servies par un `<picture>`. Vérifié au
  réseau — une seule des deux est téléchargée.

## 8. Hiérarchie typographique de la page

Les H2 mesuraient 36, 40, **56**, 44 et 44 px sans logique : le titre le plus
gros de la page était celui des réalisations.

| Niveau | Taille (1440) |
| --- | --- |
| H1 du hero | 72 px |
| Carte CTA finale | 48 px |
| Tous les H2 de section | **40 px** |

La carte finale est le seul titre à dépasser les sections : c'est le moment de
conversion, il porte plus que les autres.

---

# Pages services, À propos et Réalisations — phase 15B.4

## 1. Le constat, mesuré

| Page | Avant, 1440 | Avant, 390 | Surfaces |
| --- | --- | --- | --- |
| `/elagage` | 4 487 px | 5 176 px | dark + **4 × ivoire** |
| `/abattage` | 4 455 px | 5 044 px | dark + **4 × ivoire** |
| `/dessouchage` | 4 144 px | 4 692 px | dark + **4 × ivoire** |
| `/entretien-exterieur` | 4 144 px | 4 745 px | dark + **4 × ivoire** |
| `/a-propos` | 5 530 px | 5 417 px | dark + **5 × ivoire** |
| `/realisations` | 5 487 px | 6 077 px | dark + **3 × ivoire** |

Les quatre services avaient **le même hero de 608 px, les mêmes cinq sections,
la même dernière section de 1 158 px**. C'étaient quatre clones. Et sur les six
pages, la seule rupture de surface était le hero.

## 2. Un gabarit, quatre parcours de surfaces

La structure des pages services reste **unique** — c'est ce que les moteurs
attendent de pages sœurs et ce qui empêche l'une de dériver. Ce qui change est
déclaré dans `services-content.ts` sous `theme` :

| Page | Hero | Intro | Situations | Méthode | Conversion |
| --- | --- | --- | --- | --- | --- |
| `/elagage` | **forêt** | ivoire | forêt profond | ivoire | sable |
| `/abattage` | **forêt profond** | sable | forêt | ivoire | sable |
| `/dessouchage` | **sable** | ivoire | forêt profond | sable | ivoire |
| `/entretien-exterieur` | **ivoire** | sable | forêt | ivoire | sable |

> **Deux sections voisines ne partagent jamais la même surface, et les quatre
> pages ne commencent pas sur la même.** C'est la règle ; le tableau est sa
> vérification.

L'en-tête des pages internes est `solid` — une barre forêt avec sa cale. Un
hero sable ou ivoire passe donc sans aucun problème de contraste, et un hero
forêt se fond dans la barre : sur `/elagage`, l'en-tête et le hero ne font
qu'un seul bloc.

## 3. La forme de la photo décide de la composition du hero

`heroLayout` vaut `cote` ou `dessous` :

| Valeur | Effet | Pages |
| --- | --- | --- |
| `cote` | carte photo **à côté** du texte, 6/12 | élagage (3/4), abattage (4/3) |
| `dessous` | carte photo **sous** le texte, pleine largeur | dessouchage (16/7), entretien (21/9) |

Le champ est **déclaré, pas déduit**. Une première version lisait la classe de
cadrage à la recherche de `16/` : une règle qui inspecte une sous-chaîne CSS se
casse au premier changement de ratio, et en silence.

Sur mobile, tous les heros passent en `aspect-[16/9]`. Un cadrage 4/5 y
coûtait 448 px de hauteur pour une seule photographie.

## 4. Grille de situations qui se remplit exactement

Trois colonnes à partir de 1024 px. La première carte en occupe deux ; **avec
quatre situations, la dernière aussi**.

| Situations | Rangée 1 | Rangée 2 | Cellules vides |
| --- | --- | --- | --- |
| 5 (élagage, abattage) | 2 + 1 | 1 + 1 + 1 | **0** |
| 4 (dessouchage, entretien) | 2 + 1 | 1 + 2 | **0** |

Même principe sur `/realisations` : six colonnes, cinq critères — trois pour
les deux premiers, deux pour les trois suivants.

## 5. Portfolio alterné

Six cartes sur douze colonnes : 7/5, puis **5/7**, puis 7/5. La grande carte
change de côté à chaque rangée. Trois rangées 7/5 identiques auraient remplacé
une monotonie par une autre.

## 6. Ce qui a été mesuré, corrigé, puis re-mesuré

### Le jaune sécurité en texte sur fond clair — encore

Les numéros d'étapes (01–04) étaient rendus en `--color-safety`. Mesuré :
**1,76 sur ivoire, 1,51 sur sable**. C'est la règle du § 1, enfreinte dans un
fichier qui la cite trois fois en commentaire. Les numéros suivent désormais la
surface.

> **La règle vaut aussi pour deux chiffres de 12 px.** Un accent n'est pas
> dispensé du seuil AA parce qu'il est petit.

### Deux colonnes sur mobile : bénéfique ici, nuisible là

Passer les cartes courtes en `grid-cols-2` dès 390 px fait gagner de la hauteur
— mais **seulement si leur texte tient**. Mesures :

| Cartes | 1 colonne | 2 colonnes | Verdict |
| --- | --- | --- | --- |
| Étapes des pages services (1 ligne) | 4 × 171 px | 2 × ~200 px | **gain** |
| Étapes de `/a-propos` (2 lignes) | 4 × 225 px | 4 × **410 px** | **perte** |

À 171 px de large, un détail de deux lignes en occupe huit. La règle n'est donc
pas « deux colonnes sur mobile » mais : **deux colonnes seulement si le détail
tient sur une ligne à pleine largeur.**

## 7. Résultats

| Page | 1440 | 390 |
| --- | --- | --- |
| `/elagage` | 4 487 → 4 667 (+4 %) | 5 176 → 5 804 (+12 %) |
| `/abattage` | 4 455 → 4 295 (**−4 %**) | 5 044 → 5 723 (+13 %) |
| `/dessouchage` | 4 144 → 4 657 (+12 %) | 4 692 → 5 296 (+13 %) |
| `/entretien-exterieur` | 4 144 → 4 697 (+13 %) | 4 745 → 5 395 (+14 %) |
| `/a-propos` | 5 530 → 5 162 (**−7 %**) | 5 417 → 6 270 (+16 %) |
| `/realisations` | 5 487 → 5 060 (**−8 %**) | 6 077 → 6 108 (+1 %) |

**La hausse sur mobile est attribuée, pas subie.** Le hero explique 41 % du
delta des pages services : la photographie est passée de **fond** — qui ne
coûte aucune hauteur — à **carte**, ce que le brief demandait explicitement.
Les capsules et la carte de précision, elles aussi demandées, expliquent le
reste.

Aucune section ne dépasse 1 678 px en 390, sauf le portfolio de
`/realisations` à 3 088 px — six cartes photographiques, contre **3 594 px**
avant refonte.

---

# Correctif après 15B.4 — heros sans photographie

**Demande client.** L'image est retirée de la section d'accueil de toutes les
pages **sauf la page d'accueil**, qui n'emploie plus qu'un seul fichier sur
mobile comme sur ordinateur.

## 1. Ce qui différencie encore les quatre pages services

La carte photographique disparaît ; **le parcours de surfaces reste**. C'est
lui, et non la photographie, qui portait la différenciation :

| Page | Ouvre sur |
| --- | --- |
| `/elagage` | forêt — le hero et la barre d'en-tête ne font qu'un seul bloc |
| `/abattage` | forêt profond |
| `/dessouchage` | sable |
| `/entretien-exterieur` | ivoire |

Les champs `heroLayout` et `heroAspect` ont été **retirés** du thème, ainsi que
le champ `hero` du contenu : sans image à placer, ils ne décrivaient plus rien.
Une donnée qui ne sert plus se retire, elle ne se conserve pas « au cas où ».

## 2. Une seule image prioritaire sur tout le site

Le hero de la page d'accueil. **Toutes les autres pages n'en ont aucune** :
leur LCP est un élément de texte, et leur première photographie est paresseuse.

> **Une page qui ne montre pas de photographie au-dessus de la ligne de
> flottaison ne doit pas en précharger une.**

## 3. Résultats mesurés

| Page | Perf avant | Perf après | LCP avant | LCP après | Images |
| --- | --- | --- | --- | --- | --- |
| `/elagage` | 94 | **96** | 3,1 s | **2,8 s** | 210 → 68 Ko |
| `/abattage` | 94 | **96** | 3,1 s | **2,8 s** | 204 → 55 Ko |
| `/dessouchage` | 94 | **97** | 3,1 s | **2,6 s** | 216 → 65 Ko |
| `/entretien-exterieur` | 93 | **97** | 3,2 s | **2,6 s** | 231 → 34 Ko |
| `/a-propos` | 94 | **95** | 3,1 s | **2,9 s** | 201 → 111 Ko |
| `/realisations` | 92 | **96** | 3,4 s | **2,8 s** | 473 → 339 Ko |

Accessibilité **100** et bonnes pratiques **100** conservées, **CLS 0**.

## 4. Les hauteurs redescendent sous leur valeur d'avant refonte

| Page | Avant 15B.4 (1440) | Après correctif |
| --- | --- | --- |
| `/elagage` | 4 487 px | **4 162 px** |
| `/abattage` | 4 455 px | **4 188 px** |
| `/dessouchage` | 4 144 px | **4 073 px** |
| `/entretien-exterieur` | 4 144 px | **4 124 px** |
| `/a-propos` | 5 530 px | **5 054 px** |
| `/realisations` | 5 487 px | **4 939 px** |

Sur mobile, l'écart résiduel tombe de +12/16 % à **+8/12 %**, et
`/realisations` passe **sous** sa valeur d'origine (6 077 → 5 880 px).

---

# Zones, carte et pages villes — phase 15B.5

Les deux dernières pages restées dans l'état d'avant la refonte visuelle.

## 1. Le constat, mesuré

| Page | 390 | 1440 | Surfaces |
| --- | --- | --- | --- |
| `/zones-intervention` | 5 729 px | 5 929 px | **6 sections, toutes ivoire** |
| `/zones-intervention/[ville]` | ~3 300 px | ~4 000 px | **7 sections, toutes ivoire** |

Le hub des communes atteignait **2 234 px** en 390. Et le gabarit local ne
distinguait pas une commune du cœur de zone d'une commune à 100 km : seuls les
textes changeaient.

## 2. Le moteur cartographique n'a pas été touché

Projection, coordonnées, 23 communes, classification, distances, tracé SVG,
interactions, animations, calcul des voisins, `locations.ts` : **inchangés**.
Aucune commune n'a été déplacée à la main. `zone-map.tsx` n'a pas une ligne de
différence, et `MAP_DATA_SOURCES.md` n'a pas été modifié — il ne devait l'être
que si une donnée géographique changeait.

Ce qui change est autour : surface, panneau, proportions, présentation des
niveaux, et le hub des communes.

## 3. Rythme de `/zones-intervention`

| # | Section | Surface |
| --- | --- | --- |
| 1 | Hero | **forêt profond** + motif `contour` |
| 2 | Carte signature | **sable**, carte dans un panneau ivoire |
| 3 | Trois niveaux | ivoire |
| 4 | Hub des 23 communes | **sable** |
| 5 | Critères de déplacement | **forêt profond** + motif `rings` |
| 6 | Conversion | ivoire, carte forêt profond |

## 4. La carte : c'est le PANNEAU qui prend la largeur, pas le dessin

Le rapport de la carte vient du cadre géographique généré — elle est **carrée**.
L'étirer à 1 320 px la rendrait aussi haute qu'un écran et demi.

La carte est donc posée dans un panneau ivoire qui occupe **toute** la largeur
du conteneur (1 320 px en 1440), tandis que le dessin reste borné à 64 rem —
**1 024 px, contre 960 avant**. Le panneau donne la générosité demandée, le
dessin garde ses proportions.

> **Un élément au rapport imposé ne s'élargit pas : c'est son contenant qui
> occupe la largeur.**

## 5. Vocabulaire interne / vocabulaire public

`core`, `primary` et `extended` sont des identifiants de données. Vérifié sur
le HTML servi : **0 occurrence** sur `/zones-intervention` et sur les pages
villes testées.

| Interne | Public |
| --- | --- |
| `core` | Zone principale d'intervention · Cœur de zone |
| `primary` | Interventions possibles selon le chantier · Zone principale |
| `extended` | Déplacement à étudier · Déplacements élargis |

Les regroupements du hub suivent des **faits géographiques** — métropole,
département — jamais un découpage commercial : un visiteur qui connaît la
région doit retrouver sa commune là où il l'attend.

## 6. Le hub : une grille typographique, pas 23 cartes

Une colonne à 390 px, deux dès 480, trois à partir de 1024. Chaque commune est
une ligne de 48 px : nom à gauche, distance et flèche à droite.

Vérifié : **aucun nom tronqué** à aucune largeur, y compris
Saint-Étienne-du-Rouvray et Sotteville-lès-Rouen. Deux colonnes à 390 px ont
été écartées — à 171 px de large, ces noms se replient sur deux lignes et la
grille perd ce qu'elle gagne.

## 7. Pages villes : un gabarit, trois ouvertures

Seule la **surface du hero** varie. Ce n'est pas trois designs.

| Niveau | Hero | Lecture |
| --- | --- | --- |
| `core` | forêt | l'aplat le plus affirmé — c'est la zone d'attache |
| `primary` | sable | intermédiaire, sans l'autorité du forêt |
| `extended` | ivoire | le plus neutre — la page la plus prudente du site |

**Une commune à 100 km n'a pas à s'annoncer avec la même assurance que Rouen.**

La section qui suit le hero calcule sa propre surface pour ne jamais partager
celle du hero : sur une commune `extended`, les prestations passent sur sable.
Sans cette règle, les pages `extended` étaient les seules à enchaîner deux
surfaces identiques — défaut mesuré puis corrigé.

## 8. Résultats

| Page | 390 | 1440 | Perf | A11y | BP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/zones-intervention` | 5 729 → 6 730 | 5 929 → **6 299** | 95 | **100** | **100** | **0** |
| `…/rouen` (core) | 3 330 → 3 947 | 4 001 → 4 525 | 95 | **100** | **100** | **0** |
| `…/amiens` (extended) | 3 284 → 3 877 | 3 960 → 4 506 | 96 | **100** | **100** | **0** |

24 combinaisons vérifiées (4 pages × 6 largeurs) : **0 débordement, 0 cible
sous 44 px, un seul `h1`, 0 surface adjacente identique, carte jamais coupée,
aucun nom de commune tronqué.**

Interactions de la carte : **23 repères de 44 × 44 px**, tous dotés d'un nom
accessible, survol, focus clavier, tap, sélection et lien vers la page locale —
tous vérifiés après refonte.

---

# Correctif — le pied de page ne porte plus d'appel au devis

**Demande client, après la phase 15B.5.** La zone de conversion du pied de page
est retirée : capsule « Devis gratuit », titre, phrase d'accroche et bouton.

## Ce qui reste

Une seule zone — l'identité et les coordonnées à gauche, trois colonnes de
liens à droite, le légal en bas. Le motif `rings` et la surface forêt profond
sont conservés.

| | Avant | Après |
| --- | --- | --- |
| Hauteur en 390 px | ~1 000 px | **860 px** |
| Hauteur en 1440 px | ~700 px | **532 px** |
| Liens vers `/devis` | 1 | **0** |
| Capsules, boutons, titres | 3 | **0** |

Vérifié sur 16 combinaisons (8 pages × 2 largeurs) : 0 lien devis, 0 capsule,
0 bouton, 0 titre, 0 cible sous 44 px, 0 débordement.

## La règle, et pourquoi elle est écrite ici

> **Le pied de page ne porte aucun appel au devis, sous aucune forme.** Ne pas
> le réintroduire sans demande explicite.

C'est la **deuxième** fois que ce bloc est retiré : une première en phase 15B,
une seconde après la 15B.5. Le brief de la 15B.2 l'avait fait revenir sous une
forme différente ; la demande initiale portait sur la fonction, pas sur la
forme.

L'appel à l'action n'est pas perdu pour autant. Il vit dans **l'en-tête**,
visible en permanence, dans la **barre d'action mobile**, persistante, et dans
la **carte de conversion que porte chaque page**. Il était présent quatre fois
sur un même écran de fin de page ; il l'est trois fois, ce qui suffit
largement.

---

# Contact, devis et clôture de la phase 15B

## 1. `/contact` n'existait pas

Elle rendait `PlaceholderPage` : un titre, une liste de ce qui viendrait
« en phase 4 », et **aucun moyen de joindre qui que ce soit** — 0 lien
`mailto:`, 0 lien `tel:`. C'était la seule page du site dont la fonction
n'était pas remplie.

### Quatre blocs, et pas un de plus

| # | Bloc | Surface |
| --- | --- | --- |
| 1 | Hero | **forêt profond** + motif `rings` |
| 2 | Cartes de contact | ivoire |
| 3 | Entrée vers le devis | **sable**, carte forêt profond |
| 4 | Zone d'intervention | ivoire, carte compacte |

**2 406 px en 1440, 2 147 px en 390** — la page la plus courte du site après
`/devis`. C'est le point : on doit comprendre comment joindre l'entreprise en
quelques secondes.

### Elle n'est pas un doublon de `/devis`

| Page | Le visiteur veut… |
| --- | --- |
| `/contact` | poser une question, parler à quelqu'un |
| `/devis` | faire chiffrer un chantier qu'il a déjà en tête |

D'où l'ordre : l'e-mail **d'abord**, le devis ensuite. Une page de contact qui
renvoie immédiatement vers un parcours de cinq étapes ne répond pas à la
question posée.

### La grille se rééquilibre sans le téléphone

La carte téléphone n'existe que si `contact.phoneConfirmed` est vrai. Sans
elle : `max-w-xl` et une seule colonne, plutôt qu'une moitié vide. Pas de carte
vide, pas de bouton désactivé, pas de « bientôt disponible ».

> **Un canal non confirmé ne se signale pas, il n'existe pas.**

## 2. `/devis` avait déjà hérité du design system

Mesuré avant modification : Sora + Inter, rayons 18 / 12 / 2 / pill. Le
configurateur, écrit en phases 11-12 avec les anciens jetons, a suivi
automatiquement la réécriture de la phase 15B.1 — les **noms** de jetons
n'avaient pas changé, seules leurs valeurs.

C'est la démonstration que le système fonctionne : trois phases de refonte
visuelle plus tard, un composant jamais rouvert est resté cohérent.

Ce qui restait à faire était donc mince : une entrée compacte à capsules, un
rythme de surfaces (sable → ivoire), et les repères de confiance en capsules.
**La logique du configurateur n'a pas été touchée.**

### Le `h1` reste « Demander un devis »

Le brief proposait « Parlons de votre chantier ». Cette formulation est allée à
`/contact`, où elle décrit ce que le visiteur vient faire. Sur `/devis`, une
soixantaine de boutons du site portent exactement les mots « Demander un
devis » : arriver sur une page qui les répète est ce qui confirme au visiteur
qu'il est au bon endroit.

> **Le titre d'une page de destination répète le libellé du bouton qui y
> mène.** Rompre cette continuité coûte plus qu'une formulation plus jolie
> n'apporte.

## 3. État final — les douze routes

| Route | 1440 | 390 | Surfaces |
| --- | --- | --- | --- |
| `/` | 8 141 | 8 457 | light>sand>light>deep>sand>light>sand |
| `/elagage` | 4 162 | 5 503 | dark>light>deep>light>sand |
| `/abattage` | 4 188 | 5 431 | deep>sand>dark>light>sand |
| `/dessouchage` | 4 073 | 5 076 | sand>light>deep>sand>light |
| `/entretien-exterieur` | 4 124 | 5 046 | light>sand>dark>light>sand |
| `/a-propos` | 5 054 | 5 968 | dark>sand>deep>light>sand>light |
| `/realisations` | 4 939 | 5 821 | dark>sand>deep>light |
| `/zones-intervention` | 6 299 | 6 730 | deep>sand>light>sand>deep>light |
| `…/rouen` | 4 525 | 3 947 | dark>light>deep>light>sand>light |
| `…/amiens` | 4 506 | 3 877 | light>sand>deep>light>sand>light |
| `/contact` | **2 406** | **2 147** | deep>light>sand>light |
| `/devis` | **2 000** | **2 238** | sand>light |

**72 combinaisons vérifiées** (12 routes × 6 largeurs) : 0 débordement,
0 cible sous 44 px, un seul `h1` par page, **0 surface adjacente identique**.

## 4. Cohérence sans uniformité

Le risque de cinq phases de refonte est d'avoir remplacé « toutes les pages
éditoriales identiques » par « toutes les pages à quatre cartes identiques ».
Vérification :

- **Douze suites de surfaces différentes** sur douze routes ; aucune page
  n'ouvre comme sa voisine.
- **Quatre anatomies de carte** — KPI sans image, texte incrusté sur
  photographie, photographie en tête de carte, carte de conversion.
- **Trois compositions de hero** — photographie plein cadre (accueil
  uniquement), texte seul sur surface teintée, texte + carte de repère.
- **Grilles asymétriques** : 7/5 puis 5/7 sur les prestations et le portfolio,
  2+1 / 1+1+1 sur les situations, 3+3 / 2+2+2 sur les critères.

Deux polices, une famille de rayons, une famille de boutons — mais pas deux
pages qui se déroulent pareil.

## 5. La phase 15B est close

Douze routes refondues, plus les 21 autres pages villes qui partagent leur
gabarit. Aucune dépendance ajoutée sur l'ensemble des six sous-phases.
