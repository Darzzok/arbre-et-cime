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

Livré au correctif de la phase 8, section « Pourquoi Arbre & Cime ». C'est la
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
Arbre & Cime          Fraunces, esperluette en italique
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
> masses sombres, quelle que soit la nuance. La section « Pourquoi Arbre & Cime »
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
