# PERFORMANCE_AUDIT.md — Audit phase 15

Audit de performance, mobile et accessibilité mené en **phase 15**, sur le
**build de production** (`npm run build` + `npm start`), pas sur le serveur de
développement.

Ce document existe pour une raison précise : la phase 15 a produit des mesures
qui ne se redemandent pas gratuitement, et **un point reste ouvert**. Le noter
vaut mieux que de le redécouvrir dans six mois.

---

## 1. Conditions de mesure — à lire avant les chiffres

| | |
| --- | --- |
| Outil | Lighthouse 13.4.1, Chrome headless |
| Profil | **mobile** (par défaut : 4× bridage CPU, réseau lent simulé) |
| Cible | `npm start` sur `localhost:3100`, build de production |
| Date | phase 15 |

**Ce sont des mesures de laboratoire, en local.** Elles ne remplacent pas des
données de terrain : pas de latence réseau réelle, pas de cache froid de
navigateur, pas de diversité d'appareils. Elles servent à comparer un avant et
un après, pas à prédire l'expérience d'un visiteur.

**Variance mesurée : ±0,3 s sur le LCP et ±5 points de performance** d'un
passage à l'autre sur la même page. Trois passages ont donc été faits sur la
page d'accueil ; un écart inférieur à cet ordre de grandeur ne prouve rien.

---

## 2. Résultats — après correction

| Route | Perf | A11y | Best pract. | SEO | FCP | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (1) | 95 | **100** | **100** | 66 | 0,9 s | 3,0 s | **0** | 40 ms |
| `/` (2) | 94 | **100** | **100** | 66 | 0,9 s | 3,2 s | **0** | 30 ms |
| `/` (3) | 94 | **100** | **100** | 66 | 0,9 s | 3,2 s | **0** | 30 ms |
| `/devis` | 99 | **100** | **100** | 66 | 0,8 s | 2,1 s | **0** | 30 ms |
| `/zones-intervention` | 97 | **100** | **100** | 63 | 0,9 s | 2,7 s | **0** | 60 ms |
| `/zones-intervention/rouen` | 99 | **100** | **100** | 63 | 0,9 s | 2,1 s | **0** | 60 ms |
| `/zones-intervention/amiens` | 97 | **100** | **100** | 63 | 0,9 s | 2,6 s | **0** | 40 ms |
| `/elagage` | 99 | **100** | **100** | 66 | 0,8 s | 2,0 s | **0** | 40 ms |

### Le SEO à 63-66 est voulu

`is-crawlable` échoue parce que le site répond `noindex` en préproduction.
C'est le garde-fou de `SEO_STRATEGY.md`, pas un défaut. **Ce score ne doit pas
être « corrigé »** : il remontera seul quand `NEXT_PUBLIC_SITE_INDEXABLE`
passera à `"true"` en phase 18, et pas avant.

---

## 3. Ce qui a été corrigé

| # | Défaut | Mesure avant | Après |
| --- | --- | --- | --- |
| 1 | Liens du pied de page sous la cible tactile du projet | **36 px** de haut | 44 px |
| 2 | Logotype sous la cible tactile | 40 px | 44 px |
| 3 | Nom accessible du logotype ne contenant pas son texte visible (WCAG 2.5.3) | échec, en-tête **et** pied de page | conforme |
| 4 | Invite de la carte en `opacity-70` | **2,86** — sous AA | 5,15 |
| 5 | `favicon.ico` absent → 404 en console | Best practices 96 | **100** |
| 6 | Ligne de texte de 164 caractères en 1440 px | 1 144 px de large | bornée à la colonne de lecture |
| 7 | `opacity` redondante sur l'animation du titre du hero | — | retirée (voir § 5) |

**Effet global : accessibilité 96 → 100 et bonnes pratiques 96 → 100 sur toutes
les routes mesurées.**

### Sur les cibles tactiles

`CLAUDE.md` § 5 impose 44 × 44 px. Le pied de page était **le seul endroit du
site** où la règle était enfreinte — 36 px sur onze liens. Le texte n'a pas
changé de taille ; seule la zone cliquable s'est agrandie.

Reste une exception assumée : le **lien d'évitement**, à 1 × 1 px tant qu'il
n'a pas le focus. C'est le motif standard d'un lien d'évitement ; il reprend
une taille normale dès qu'il est atteint au clavier, c'est-à-dire au seul
moment où il sert.

---

## 4. Ce qui a été vérifié sans rien changer

| Point | Méthode | Résultat |
| --- | --- | --- |
| **CLS** | Lighthouse + `PerformanceObserver` | **0** sur les 8 mesures |
| **Mouvement réduit** | Chrome `--force-prefers-reduced-motion`, capture pleine page | **Toute la page visible**, carte comprise. Aucune section ne dépend d'une animation |
| **Débordement horizontal** | 320 / 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 | **0 px** partout |
| **Un seul `h1`** | HTML produit, 38 documents | conforme |
| **IDs dupliqués** | toutes routes | aucun |
| **Imbrications invalides** (bouton dans bouton, lien dans lien) | toutes routes | aucune |
| **Champs de formulaire** | `/devis`, 5 étapes | `label` réel partout, `type`/`inputMode`/`autocomplete` corrects |
| **Zoom iOS** | taille de police des champs | **16 px minimum** — pas de zoom au focus |
| **`tabindex` positif** | page d'accueil | aucun |
| **Anneau de focus** | style calculé après `focus()` | 2 px, décalage 2 px, couleur adaptée à la surface |
| **Erreurs console** | toutes routes, onglet neuf | aucune |
| **Longues tâches JS** | `PerformanceObserver` | aucune |
| **Parcours devis complet** | 390 px, 5 étapes | 0 débordement, focus déplacé à chaque étape, brouillon purgé en fin |

### Poids réel d'une page (accueil, mobile, production)

| | |
| --- | --- |
| HTML | 33 Ko |
| JavaScript | **183 Ko** (10 fichiers) |
| CSS | 12 Ko |
| Polices | **60 Ko** (2 fichiers préchargés) |
| Images | 155 Ko (3 au-dessus de la ligne de flottaison) |
| **Total** | **~517 Ko** |

Deux polices variables seulement, préchargées, `display: swap`. Aucune graisse
statique inutilisée : Fraunces et Manrope sont chargées en variable, ce qui
couvre 400, 500 et 600 — les seules réellement employées.

---

## 5. Point resté OUVERT — attribution du LCP sur la page d'accueil

**C'est le seul point non résolu de la phase 15, et il est documenté ici parce
qu'il n'est pas expliqué.**

### Le constat

Sur `/`, Chrome attribue le LCP au **logotype de l'en-tête** — un `<span>` de
**146 × 22 px**, soit 3 212 px². Les deux plus grands éléments de la page ne
sont **jamais** candidats :

| Élément | Surface | Candidat LCP ? |
| --- | --- | --- |
| Photographie du hero | 390 × 844 = **329 160 px²** | **non** |
| `h1` du hero | 350 × 88 = 30 800 px² | **non** |
| Logotype de l'en-tête | 146 × 22 = 3 212 px² | oui |

Vérifié par `PerformanceObserver` sur le build de production : seuls deux
petits éléments de texte sont enregistrés, à 60 ms et 88 ms.

### Ce qui a été écarté comme explication

- **L'image n'est pas exclue pour faible entropie** : 95 Ko pour 780 × 1690,
  soit **0,59 bit par pixel**, très au-dessus du seuil d'exclusion de Chrome.
- **Elle n'est pas chargée paresseusement** : `loading="eager"`,
  `fetchPriority="high"`, préchargée avec la bonne `media`, `complete = true`.
- **Elle n'est pas animée** : opacité 1, aucune animation, aucun ancêtre
  transparent (vérifié en relevant l'opacité de toute la chaîne d'ancêtres).
- **Le `h1` l'était** : son animation d'apparition passait par
  `opacity: 0 → 1`, ce qui l'excluait des candidats pendant 990 ms. L'opacité a
  été retirée — elle était **redondante**, le titre étant déjà masqué par un
  parent `overflow-hidden` et une translation. Le `h1` est désormais opaque dès
  la première image… **et reste non candidat.** La correction est juste sur le
  fond, mais elle n'a pas déplacé la métrique (3,0-3,2 s après, contre 2,9-3,7 s
  avant : dans le bruit de mesure).

### Pourquoi ce n'est pas traité comme une urgence

- **FCP 0,9 s** et **Speed Index 0,9 s** : la page est visuellement complète
  très tôt. Le LCP à 3 s décrit le repeint tardif d'un petit texte après
  chargement de la police, pas une page vide pendant trois secondes.
- **CLS 0**, **TBT 30-40 ms** : rien d'autre ne cloche.
- Les sept autres routes mesurées sont entre **2,0 et 2,7 s**.

### À reprendre en conditions réelles

Ce comportement doit être **revérifié sur le domaine de production**, avec un
vrai réseau. Si le LCP reste attribué à un élément de texte, la piste à
explorer est le chargement de la police d'affichage (Fraunces), pas l'image —
qui est déjà optimale.

---

## 6. Ce qui n'a volontairement pas été fait

- **`unused-javascript` (~29 Ko)** et **`legacy-javascript` (~13 Ko)** :
  proviennent du runtime Next/React, pas du code du projet. Les traiter
  supposerait de sortir du cadre du framework pour un gain marginal.
- **Recompression des images sources.** Les 22 photographies pèsent 15,2 Mo sur
  disque, mais elles ne sont **jamais servies telles quelles** : `next/image`
  les redimensionne et les convertit en AVIF/WebP. Le poids servi au-dessus de
  la ligne de flottaison est de 155 Ko. Aucune n'excède 2400 px de large.
  Dégrader les sources ne gagnerait rien au visiteur et interdirait un futur
  recadrage.
- **Réduction des frontières client.** Neuf modules portent `"use client"`, et
  chacun a une raison : en-tête (menu, défilement), barre d'action mobile,
  carte (survol, focus, tap), configurateur (état, fichiers). Aucun composant
  serveur n'a été converti par facilité, et aucun composant client n'est
  superflu.

---

## 7. Ce que l'outillage n'a pas permis de tester

**Le clavier réel.** L'automatisation du navigateur ne délivre pas les
événements clavier à l'onglet (vérifié : un écouteur `keydown` posé sur le
document ne reçoit rien). L'audit clavier a donc été mené **structurellement** —
aucun `tabindex` positif, aucun élément focusable masqué autrement que par
`display: none`, anneau de focus effectif relevé sur le style calculé, `role`,
`aria-expanded` et `aria-controls` présents sur le menu mobile — mais la
**tabulation de bout en bout reste à faire à la main**.

De même pour le **clavier virtuel mobile** : le redimensionnement du viewport à
l'ouverture du clavier ne se simule pas fidèlement. Les garde-fous sont en
place (champs à 16 px, cibles à 44 px, pas de `position: fixed` sur le
formulaire), mais un test sur téléphone réel reste nécessaire.

---

# Mesures de la phase 15B.2

Même protocole que la phase 15 : build de production servi sur `:3100`,
Lighthouse 13.4.1 en headless, profil mobile. **La variance reste de ±0,3 s
sur le LCP et ±5 points de performance** ; un écart inférieur ne prouve rien.

## 1. Résultats — 15 passages, 13 routes

| Route | Perf | A11y | Best pract. | SEO | FCP | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (1) | 92 | **100** | **100** | 66 | 0,9 s | 3,3 s | **0** | 30 ms |
| `/` (2) | 92 | **100** | **100** | 66 | 0,9 s | 3,3 s | **0** | 40 ms |
| `/` (3) | 93 | **100** | **100** | 66 | 0,9 s | 3,2 s | **0** | 70 ms |
| `/elagage` | 95 | **100** | **100** | 66 | 0,8 s | 2,9 s | **0** | 40 ms |
| `/abattage` | 95 | **100** | **100** | 66 | 0,8 s | 2,9 s | **0** | 30 ms |
| `/dessouchage` | 95 | **100** | **100** | 66 | 0,8 s | 2,9 s | **0** | 40 ms |
| `/entretien-exterieur` | 93 | **100** | **100** | 66 | 0,8 s | 3,2 s | **0** | 30 ms |
| `/contact` | 97 | **100** | **100** | 63 | 0,8 s | 2,6 s | **0** | 60 ms |
| `/devis` | 96 | **100** | **100** | 66 | 0,8 s | 2,7 s | **0** | 30 ms |
| `/a-propos` | 95 | **100** | **100** | 66 | 0,8 s | 3,0 s | **0** | 30 ms |
| `/realisations` | 92 | **100** | **100** | 66 | 0,9 s | 3,3 s | **0** | 30 ms |
| `/zones-intervention` | 96 | **100** | **100** | 63 | 0,9 s | 2,8 s | **0** | 50 ms |
| `/zones-intervention/rouen` | 96 | **100** | **100** | 63 | 0,9 s | 2,8 s | **0** | 60 ms |
| `/zones-intervention/amiens` | 99 | **100** | **100** | 63 | 0,9 s | 2,3 s | **0** | 50 ms |
| `/style-guide` | 96 | **100** | **100** | 63 | 0,9 s | 2,7 s | **0** | 40 ms |

**Accessibilité 100 et bonnes pratiques 100 sur les 15 passages. CLS 0
partout.** Le SEO à 63-66 reste le `noindex` de préproduction — voir § 2 de
l'audit de phase 15, ce score ne doit pas être « corrigé ».

## 2. Trois défauts trouvés et corrigés

### a. Le fondu du `Reveal` faisait échouer le contraste — effet supprimé

Mesuré à **2,10** sur `/zones-intervention/rouen` et **1,22** sur
`/realisations` : un bloc `[data-reveal]` était échantillonné à 51 %
d'opacité, et ses huit textes avec lui.

Deux réglages ont été tentés et ont échoué de façon identique — la phase 15
avait resserré la plage de `entry 60%` à `entry 40%`, la phase 15B.2 l'a
plafonnée à `min(40%, 180px)` pour la rendre indépendante de la hauteur du
bloc. **Aucun des deux ne pouvait fonctionner** : un fondu lié au défilement
traverse toujours des valeurs intermédiaires, en réduire la durée ne fait que
déplacer le moment où on les observe.

`CLAUDE.md` § 7 tranche : l'effet est **supprimé, pas optimisé**. Le
`Reveal` n'anime plus que `translateY`. Le mouvement se lit toujours, et une
transformation ne coûte ni contraste ni décalage de mise en page.

**Ces deux routes n'avaient jamais été auditées** : `/realisations` était
absente du tableau de la phase 15. Ce n'est donc pas une régression de la
phase 15B.2 mais un défaut préexistant, révélé par un périmètre d'audit
élargi de 8 à 13 routes.

### b. Le préchargement de la photo LCP n'avait pas `fetchpriority`

`priority` sur `<Image>` pose bien le `<link rel="preload">`, mais Next n'y
ajoute pas `fetchpriority="high"`. Le navigateur téléchargeait donc la photo
du hero à priorité normale, derrière la feuille de style.

Signalé par `lcp-discovery` sur `/elagage`, corrigé sur les trois composants
concernés (`service-page.tsx`, `/a-propos`, `/realisations`) et **vérifié
dans le HTML servi**, pas seulement dans le code.

L'accueil n'était pas touché : son hero utilise `getImageProps` et un
`preload()` écrit à la main, qui posait déjà l'attribut.

### c. Le menu mobile décrivait un logotype de 0 × 0 px

Le panneau restait monté sous `hidden`, ce qui laissait dans le DOM une
seconde image de logotype dans une boîte nulle. `image-aspect-ratio`
calculait un rapport sur cette boîte et signalait une image déformée qui n'a
jamais été affichée. Le contenu du panneau n'est plus monté que lorsqu'il est
ouvert.

## 3. Un faux positif écarté, et pourquoi il faut le savoir

Le premier passage après la refonte donnait **a11y 96, best practices 88** et
un `500` sur un chunk JavaScript. Le serveur servait un build remplacé à
chaud. Après redémarrage propre, sans **aucune** modification de code :
a11y 100, best practices 96.

> **Redémarrer le serveur de production après chaque `npm run build` avant de
> mesurer.** Trois « régressions » de cette phase n'existaient pas.

## 4. Deux limites de l'outillage, à ne pas confondre avec des défauts

Le pilotage headless du navigateur ne restitue pas :

- **`:focus`** — `document.activeElement` est correct, mais `element.matches(':focus')`
  reste faux car le document n'a pas le focus fenêtre. Le lien d'évitement
  mesure donc 1 × 1 px même au focus. Vérifié autrement, dans le CSS produit :
  la règle `.focus\:not-sr-only:focus` existe, et `focus:absolute` est déclarée
  **après** elle — `position: absolute` l'emporte donc bien sur le
  `position: static` de `not-sr-only`. Le lien est sain.
- **`largest-contentful-paint`** — aucune entrée n'est enregistrée dans
  l'onglet piloté. L'attribution du LCP ne peut être lue que par Lighthouse.

> Ne jamais conclure à un défaut d'accessibilité à partir d'une mesure de
> focus prise dans l'onglet piloté.

## 5. Le point du § 5 de la phase 15 reste OUVERT

Sur `/`, le LCP n'a toujours **aucune phase de chargement de ressource** dans
la décomposition Lighthouse — il reste attribué à un élément de **texte**,
alors que la photographie du hero mesure 412 × 823 = 339 076 px², affiche
`opacity: 1` et n'a aucun ancêtre animé (vérifié sur toute la chaîne).

Ce qui a changé depuis la phase 15 : la piste « police d'affichage » désigne
désormais **Sora**, pas Fraunces, la typographie ayant été remplacée en phase
15B.1. Les deux fichiers de police se chargent en 27-30 ms.

**Reste à vérifier sur le domaine de production, avec un vrai réseau.** FCP
0,9 s, Speed Index 0,9 s, CLS 0 et TBT 30-70 ms : rien n'indique une page
réellement lente.

---

# Phase 15B.3 — refonte de la page d'accueil

## 1. Le point du § 5 est RÉSOLU

**Le LCP de `/` est désormais la photographie du hero.** Relevé sur deux
passages consécutifs, avec décomposition complète :

```
element : section.relative > div.relative > picture > img.absolute
phases  : timeToFirstByte 7 ms · resourceLoadDelay 9 ms
          resourceLoadDuration 11 ms · elementRenderDelay 87 ms
```

C'est la première fois que cette section affiche une **phase de chargement de
ressource**. Depuis la phase 15, `/` n'en avait aucune : le LCP était attribué
à un élément de texte, la photographie n'étant jamais candidate.

**Conséquence à assumer sur le chiffre.** Le LCP passe de 3,2-3,3 s à
3,6-3,8 s, et la performance de 92-93 à 89-90. Ce n'est pas une dégradation du
rendu : c'est le passage d'un petit texte à la photographie plein cadre comme
élément mesuré. FCP **0,9 s**, Speed Index **0,9 s**, CLS **0**, TBT
30-60 ms — tout le reste est inchangé.

> Le chiffre a empiré, la mesure s'est améliorée. Les deux valeurs ne
> décrivent pas le même élément et ne se comparent pas directement.

## 2. `images.qualities` manquait — toutes les qualités étaient ignorées

**Next 16 n'honore que les qualités déclarées dans `next.config.ts`.** Le
projet n'en déclarait aucune, donc la valeur par défaut `[75]` s'appliquait, et
**toute autre valeur passée à `<Image quality>` était ignorée en silence** —
sans avertissement au build.

Deux valeurs étaient concernées :

| Emplacement | Demandé | Réellement servi |
| --- | --- | --- |
| Hero (depuis la phase 5B) | 78 | **75** |
| Cartes services (phase 15B.3) | 68 | **75** |

Vérifié dans le HTML servi : **173 URLs d'images générées, toutes en `q=75`**.

Après déclaration de `qualities: [68, 70, 75]` :

| Image | Avant | Après |
| --- | --- | --- |
| Cartes services (4) | 257 Ko | **199 Ko** |
| Photo « Pourquoi » | 36 Ko | **30 Ko** |
| **Total images de la page** | **393 Ko** | **328 Ko** |

Le hero reste à **75**, volontairement : c'est la valeur que le site a toujours
servie, et l'honorer à 78 l'alourdissait de 96 à 102 Ko — sur l'élément LCP,
pour une différence que personne n'a jamais vue.

> **Vérifier une qualité d'image dans le HTML servi, jamais dans le code.**
> Ce réglage était faux depuis la phase 5B sans qu'aucun audit ne le signale.

## 3. Résultats — page d'accueil, mobile

| Passage | Perf | A11y | Best pract. | SEO | FCP | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 89 | **100** | **100** | 66 | 0,9 s | 3,8 s | **0** | 60 ms |
| 2 | 89 | **100** | **100** | 66 | 0,9 s | 3,8 s | **0** | 40 ms |
| 3 | 90 | **100** | **100** | 66 | 0,9 s | 3,6 s | **0** | 60 ms |
| 4 | 89 | **100** | **100** | 66 | 0,9 s | 3,8 s | **0** | 40 ms |

**Accessibilité 100 et bonnes pratiques 100 conservées.** SEO 66 = `noindex` de
préproduction, inchangé.

## 4. Un contraste sous le seuil, trouvé par recomposition

Les capsules ajoutées au hero utilisaient `Capsule variant="dark"` — un fond
d'ivoire à 10 %, qui ne masque rien sur une photographie.

Méthode : redessiner dans un `<canvas>` le recadrage `object-cover` réellement
affiché, échantillonner la bande occupée par les capsules, appliquer l'opacité
du dégradé de lisibilité **à cette hauteur précise**, puis le fond de la
capsule.

| | Contraste |
| --- | --- |
| `dark`, photographie servie | **3,64** — sous AA |
| `photo`, photographie servie | **11,53** |
| `photo`, pixel le plus clair de la bande | **8,12** |
| `photo`, blanc pur théorique | **8,05** |

L'opacité du dégradé ne valait que **0,107** à la hauteur des capsules : le
voile de lisibilité du hero est conçu pour le bas de l'image, pas pour cette
bande.

## 5. Direction artistique du hero — vérifiée au réseau

Deux fichiers distincts, un seul téléchargé :

| Largeur | Fichier servi |
| --- | --- |
| 320 · 390 · 430 · 768 | `elagueur-ascension-tronc-vertical.jpg` |
| 1024 · 1440 | `elagueur-grimpeur-arbre-mature.jpg` |

À 390 px, la source desktop **n'apparaît pas** dans les requêtes réseau.

## 6. Balayage responsive — 6 largeurs

Hauteur totale de `<main>`, et par section :

| Largeur | Avant | Après |
| --- | --- | --- |
| 320 | — | 8 895 px |
| **390** | **8 967 px** | **8 409 px** |
| 430 | — | 8 380 px |
| 768 | 8 589 px | **7 114 px** |
| 1024 | — | 7 794 px |
| 1440 | 7 872 px | 8 141 px |

**Aucun débordement horizontal, aucune cible tactile sous 44 px, un seul `h1`,
à toutes les largeurs.**

La section « Pourquoi » passe de **2 005 px à 1 621 px** en 390 — elle était le
seul dépassement du seuil de 2 000 px signalé au brief.

Le gain à 768 px vient du palier `md:grid-cols-2` ajouté aux deux grilles, qui
manquait entre 480 et 1024 px.

## 7. Mouvement

Les **25 déclarations `animation:`** du projet sont sous
`@media (prefers-reduced-motion: no-preference)` — vérifié une à une en
remontant la garde englobante de chaque déclaration. Sous `reduce`, aucune
n'est appliquée : rien ne peut rester masqué par une animation non jouée.

---

# État final après la phase 15B — les douze routes

Build de production servi sur `:3100`, Lighthouse 13.4.1 headless, profil
mobile. Variance de ±0,3 s sur le LCP et ±5 points de performance : un écart
inférieur ne prouve rien.

| Route | Perf | A11y | Best pract. | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 92 | **100** | **100** | 66 | 3,4 s | **0** |
| `/elagage` | 96 | **100** | **100** | 66 | 2,8 s | **0** |
| `/abattage` | 96 | **100** | **100** | 66 | 2,8 s | **0** |
| `/dessouchage` | 97 | **100** | **100** | 66 | 2,6 s | **0** |
| `/entretien-exterieur` | 97 | **100** | **100** | 66 | 2,6 s | **0** |
| `/a-propos` | 95 | **100** | **100** | 66 | 2,9 s | **0** |
| `/realisations` | 96 | **100** | **100** | 66 | 2,8 s | **0** |
| `/zones-intervention` | 95 | **100** | **100** | 63 | 2,8 s | **0** |
| `…/rouen` | 95 | **100** | **100** | 63 | 2,8 s | **0** |
| `…/amiens` | 96 | **100** | **100** | 63 | 2,8 s | **0** |
| `/contact` | **97** | **100** | **100** | 63 | 2,5 s | **0** |
| `/devis` | **96** | **100** | **100** | 66 | 2,7 s | **0** |

**Accessibilité 100 et bonnes pratiques 100 sur les douze routes. CLS 0
partout.** Le SEO à 63-66 reste le `noindex` de préproduction — il remontera
seul en phase 18.

## La page d'accueil reste la plus lente, et on sait pourquoi

92 contre 95-97 ailleurs, LCP 3,4 s contre 2,5-2,9 s. C'est la **seule page du
site dont le hero porte encore une photographie**, et donc la seule dont
l'élément LCP est une image plein cadre plutôt qu'un texte.

Ce n'est pas une anomalie à corriger : c'est le coût assumé d'une page
d'accueil photographique. Les onze autres pages ont perdu leur image de hero
sur demande du client, et leur LCP a suivi.

## Une seule image prioritaire sur tout le site

Le hero de `/`. Vérifié : exactement un `fetchpriority="high"` par page, et
zéro sur les onze autres routes.

## Ce qui reste OUVERT

L'attribution du LCP de `/` était le point ouvert de la phase 15. Il est
**résolu** depuis la 15B.3 : le LCP est désormais la photographie du hero, avec
une décomposition de chargement complète, alors qu'il était auparavant attribué
à un élément de texte.

Reste à revérifier sur le domaine de production, avec un vrai réseau — la
valeur de 3,4 s est une projection sous throttling simulé, pour un FCP réel de
0,9 s et un Speed Index de 0,9 s.
