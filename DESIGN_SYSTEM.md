# DESIGN_SYSTEM.md — Système de design

Direction : **arboriculture éditoriale premium**. Peu d'éléments, beaucoup de
matière. La charte ci-dessous est `VERROUILLÉE`.

Implémentation : Tailwind CSS v4, jetons déclarés dans `@theme` de
`src/app/globals.css`. **Pas de `tailwind.config.js`.** Aucune couleur
hexadécimale ne doit être écrite directement dans un composant.

**État : jetons et primitives livrés en phase 2, châssis en phase 4.**
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

Les deux colonnes de texte secondaire passent AA ou mieux : c'est le critère qui
a déterminé le choix mousse / pierre.

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

## 4. Mise en page éditoriale asymétrique — `VERROUILLÉ`

Le site n'utilise **pas** de grille de cartes uniformes. La composition est
asymétrique et respire.

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

### Interdits de composition

- **Très peu de cartes.** Quand une répétition est nécessaire (les 8
  prestations), on privilégie une **liste éditoriale** : filets horizontaux,
  numérotation, typographie hiérarchisée — pas huit rectangles à ombre portée.
- **Ombres portées : interdites** en décor. La profondeur vient du contraste de
  fond (forêt / ivoire) et des photos.
- **Rayons de bordure : 0 à 8 px.** `rounded-edge` (2 px) par défaut,
  `rounded-soft` (8 px) pour les cadres média. Rien au-delà n'existe.
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

> **Piège à connaître.** `cn()` ne fusionne pas les classes Tailwind
> concurrentes. Passer `hidden` en `className` à un `ButtonLink` dont la
> base contient `inline-flex` ne masque rien : les deux règles coexistent et
> l'ordre de la feuille de style tranche. La visibilité et le partage de largeur
> se portent donc sur une **enveloppe**, jamais sur la primitive. Le cas s'est
> réellement produit en phase 4 sur le CTA de l'en-tête.

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
