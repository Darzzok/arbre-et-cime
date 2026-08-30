# DESIGN_SYSTEM.md — Système de design

Direction : **arboriculture éditoriale premium**. Peu d'éléments, beaucoup de
matière. La charte ci-dessous est `VERROUILLÉE`.

Implémentation : Tailwind CSS v4, jetons déclarés dans `@theme` de
`src/app/globals.css`. **Pas de `tailwind.config.js`.** Aucune couleur
hexadécimale ne doit être écrite directement dans un composant.

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

### Règle d'usage du jaune sécurité

Il évoque l'EPI et la signalisation de chantier — il ne fonctionne que s'il
reste rare. **Maximum une occurrence pleine par écran visible.** Autorisé :
remplissage du CTA primaire, anneau de focus, indicateur de progression du
configurateur, micro-repères sur la carte de zone. Interdit : fond de section,
grands aplats, texte courant, décor.

### Contrastes mesurés (WCAG 2.1)

| Combinaison | Ratio | Verdict |
| --- | --- | --- |
| charbon sur ivoire | 15,51 | AAA — texte courant clair |
| forêt sur ivoire | 14,04 | AAA — titres sur fond clair |
| ivoire sur forêt | 14,04 | AAA — texte courant sombre |
| pierre sur forêt | 9,55 | AAA — texte secondaire sombre |
| charbon sur jaune sécurité | 7,91 | AAA — **libellé des CTA pleins** |
| jaune sécurité sur forêt | 7,16 | AAA — accent lisible sur fond sombre |
| mousse sur ivoire | 5,15 | AA — surtitres et texte secondaire clair |
| mousse sur pierre | 3,50 | Échec texte — **décor / bordures uniquement** |
| mousse sur forêt | 2,73 | Échec texte — **décor uniquement** |
| jaune sécurité sur ivoire | 1,96 | **Échec — jamais de texte jaune sur ivoire** |

À retenir : le CTA primaire est **jaune rempli, libellé charbon**. Jamais de
texte jaune sur fond clair.

---

## 2. Typographie — `VERROUILLÉ`

- **Titres : Fraunces** (serif variable, `--font-display`).
- **UI et texte courant : Manrope** (`--font-sans`).

Chargées par `next/font/google` dans `src/app/layout.tsx`, sous-ensemble latin,
`display: swap`, auto-hébergées par Next — aucun appel réseau tiers au runtime.

### Échelle (mobile 390 px → large)

| Usage | Fonte | Mobile | Large | Notes |
| --- | --- | --- | --- | --- |
| Hero H1 | Fraunces | 40 / 1,05 | 76 / 1,0 | `text-wrap: balance` |
| H2 de section | Fraunces | 30 / 1,1 | 46 / 1,05 | |
| H3 | Fraunces | 22 / 1,2 | 26 / 1,2 | |
| Chapô | Manrope | 17 / 1,55 | 19 / 1,55 | |
| Texte courant | Manrope | 16 / 1,65 | 17 / 1,65 | jamais sous 16 px |
| Surtitre | Manrope | 12 / 1,2 | 12 / 1,2 | majuscules, interlettrage 0,24em, couleur mousse |
| Légende photo | Manrope | 13 / 1,5 | 14 / 1,5 | couleur pierre ou mousse |

Règles : longueur de ligne 60–75 caractères en texte courant ; `balance` sur les
titres, `pretty` sur les paragraphes ; pas de titre tout en majuscules en
Fraunces (les majuscules sont réservées au surtitre Manrope).

---

## 3. Mise en page éditoriale asymétrique — `VERROUILLÉ`

Le site n'utilise **pas** de grille de cartes uniformes. La composition est
asymétrique et respire.

- **Mobile (~390 px) :** une colonne, gouttière latérale 20 px
  (`--spacing-gutter`), rythme vertical 72 px entre blocs
  (`--spacing-section`). L'asymétrie s'exprime par des débords photo pleine
  largeur, des décalages d'un demi-pas et des filets courts, pas par des
  colonnes.
- **Large :** grille 12 colonnes, largeur maximale de contenu 1240 px. Les blocs
  s'appuient sur des empans **inégaux** (7/5, 8/4, 5/7) et alternent le côté
  d'ancrage d'une section à l'autre.
- **Très peu de cartes.** Quand une répétition est nécessaire (les 8
  prestations), on privilégie une **liste éditoriale** : filets horizontaux,
  numérotation, typographie hiérarchisée — pas huit rectangles à ombre portée.
- **Ombres portées : interdites** en décor. La profondeur vient du contraste de
  fond (forêt / ivoire) et des photos.
- **Rayons de bordure :** 0 à 2 px. Angles francs, cohérents avec l'outil et le
  chantier.

---

## 4. Photographie — `VERROUILLÉ`

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

---

## 5. Mouvement — sobre et technique

- Durée par défaut **320 ms** (`--duration-cime`), courbe
  `cubic-bezier(0.22, 0.61, 0.36, 1)` (`--ease-cime`).
- Vocabulaire autorisé : révélation à l'apparition (opacité + 12 px de montée),
  filets qui se tracent, léger parallaxe sur le hero, transitions d'état des
  CTA, tracé progressif du rayon sur la carte de zone.
- Interdits : rebonds, rotations décoratives, compteurs animés, effets de
  particules, carrousels automatiques, apparitions en cascade sur plus de trois
  éléments.
- **Mobile : amplitude réduite** (montée 6 px, pas de parallaxe) et aucune
  animation déclenchée au défilement au-delà du premier écran.
- **`prefers-reduced-motion: reduce` neutralise tout** — la règle globale est
  déjà en place dans `globals.css`. Ne pas la contourner ; une animation ne doit
  jamais porter d'information seule.

---

## 6. Composants de châssis

### CTA

| Niveau | Apparence | Usage |
| --- | --- | --- |
| Primaire | Fond `safety`, libellé `charcoal`, angles francs | « Devis gratuit », une seule occurrence par écran |
| Téléphone | Fond `forest` sur clair, bordure `ivory` sur sombre | « Appeler » — toujours un `tel:` réel |
| Tertiaire | Lien souligné à l'offset, couleur `moss` ou `stone` | Navigation dans le contenu |

Hauteur minimale 48 px, cible tactile ≥ 44 × 44 px, libellé explicite (jamais
« En savoir plus » seul).

### Barre d'action mobile

Fixée en bas de viewport, visible dès le hero, deux actions : « Appeler »
(sombre) et « Devis gratuit » (jaune sécurité). Fond `forest`, filet supérieur
`moss`. Respecte `env(safe-area-inset-bottom)`. Masquée à partir du breakpoint
large. Le `body` réserve sa hauteur pour ne jamais recouvrir de contenu.

### En-tête

Compact : logotype, bouton d'appel, ouverture du menu. Pas de méga-menu. Le menu
mobile est une feuille pleine hauteur listant les prestations dans l'ordre de
référence, la zone d'intervention, et le CTA devis en pied de feuille.

---

## 7. Accessibilité

- Contraste AA minimum sur tout texte (tableau de la section 1).
- Focus visible : contour 2 px `safety`, offset 3 px — déjà appliqué globalement.
- Navigation clavier complète, ordre de tabulation logique, lien d'évitement
  vers le contenu principal (à ajouter en phase 4).
- Aucune information portée uniquement par la couleur, le survol ou l'animation.
- Structure de titres continue : un seul `h1` par page, pas de saut de niveau.
- Formulaires : `label` visible associé, erreurs textuelles explicites,
  `aria-live` sur le récapitulatif d'erreurs du configurateur.

---

## 8. Jetons implémentés

Déclarés dans `src/app/globals.css` :

- Couleurs : `--color-forest`, `--color-ivory`, `--color-charcoal`,
  `--color-moss`, `--color-stone`, `--color-safety`
- Typographies : `--font-display`, `--font-sans`
- Rythme : `--spacing-gutter`, `--spacing-section`
- Mouvement : `--ease-cime`, `--duration-cime`

Toute évolution de cette liste implique une mise à jour de ce document.
