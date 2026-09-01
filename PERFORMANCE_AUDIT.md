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
