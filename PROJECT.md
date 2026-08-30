# PROJECT.md — Arbre et Cime Élagage

Document de cadrage. Il décrit **le client, le positionnement et les décisions
verrouillées**. Toute décision marquée `VERROUILLÉ` ne se modifie que sur
demande explicite du client.

---

## 1. Le client

**Arbre et Cime Élagage** — élagueur-grimpeur.

- **Zone principale :** Rouen et la Métropole Rouen Normandie.
- **Zone étendue :** jusqu'à 100 km selon les chantiers. C'est un **argument
  commercial**, pas un axe SEO (cf. `SEO_STRATEGY.md`).
- **Clientèle :** particuliers, professionnels, collectivités.

### Prestations

1. Élagage
2. Abattage
3. Abattage difficile / dangereux
4. Dessouchage
5. Débroussaillage
6. Taille de haies
7. Entretien extérieur
8. Évacuation des déchets

Cet ordre est la référence : il est repris à l'identique dans la section
Prestations, dans la navigation et dans `src/lib/site.ts`.

### Arguments de vente

- Environ **10 ans d'expérience** métier
- **Devis gratuit**
- **Intervention rapide**, prise en charge des **urgences**
- **Travail sécurisé** (grimpe, démontage, cordes)
- **Matériel professionnel**
- **Chantier propre** — évacuation comprise
- **Flexibilité** sur les chantiers et les créneaux

### Qualifications

- **CS Taille et soins des arbres**
- **BP Paysagiste / gestion des milieux naturels**

Ces deux qualifications sont des différenciateurs forts face à la concurrence
locale : elles doivent être visibles dans la section Preuves et sur les pages
services, jamais reléguées en bas de page.

---

## 2. Positionnement — `VERROUILLÉ`

**Arboriculture éditoriale premium.**

Le site doit se lire comme le carnet de travail d'un professionnel exigeant :
peu d'éléments, beaucoup de matière. La photographie porte l'émotion ; la
typographie porte l'autorité ; le texte porte la précision technique.

**Ce que le site est :**

- sur mesure, dense en information utile, sobre ;
- construit autour de vraies photos de chantiers ;
- rassurant sur la sécurité et la propreté d'exécution ;
- direct sur le passage à l'action (appeler / demander un devis).

**Ce que le site n'est pas :**

- une grille de cartes génériques avec icônes ;
- un empilement de sections marketing interchangeables ;
- un catalogue d'effets visuels ;
- un site « propre mais anonyme » que 300 concurrents pourraient réutiliser.

**Interdits fermes :** images générées par IA représentant l'activité, dégradés
décoratifs, illustrations vectorielles d'arbres, stock photos manifestement hors
contexte (essences ou paysages non normands), texte de remplissage.

---

## 3. Homepage — `VERROUILLÉ`

La homepage est **courte**. Sept sections, dans cet ordre, plus le footer.
**Aucune section supplémentaire sans validation explicite du client.**

| # | Section | Rôle |
| --- | --- | --- |
| 1 | **Hero photo plein écran** | Impact immédiat, identification du métier et de la zone, double CTA (appeler / devis) |
| 2 | **Preuves** | Expérience, qualifications, sécurité, chantier propre — crédibilité avant argumentaire |
| 3 | **Prestations** | Les 8 prestations, entrée vers les pages services |
| 4 | **Pourquoi Arbre et Cime** | Différenciation : méthode, sécurité, propreté, réactivité |
| 5 | **Réalisations** | Photos réelles de chantiers, avant/après si disponible |
| 6 | **Zone d'intervention** | Rouen et métropole en cœur de cible, carte animée jusqu'à 100 km (phase 10) |
| 7 | **Devis interactif** | Entrée du configurateur en 5 étapes (cf. `QUOTE_FLOW.md`) |
| — | **Footer** | NAP, prestations, zone, mentions, rappel CTA |

À cela s'ajoute la **barre d'action mobile** persistante (appeler / devis), qui
n'est pas une section mais un élément de châssis (cf. § 5).

---

## 4. Architecture cible

```
src/
  app/
    layout.tsx                 # châssis global, fontes, métadonnées
    page.tsx                   # homepage (7 sections verrouillées)
    globals.css                # jetons @theme Tailwind v4
    (services)/                # pages services dédiées — phase 3
    ...                        # pages locales utiles — plus tard, au cas par cas
  components/
    layout/                    # header, footer, barre d'action mobile
    sections/                  # une section homepage = un composant
    ui/                        # primitives partagées
    quote/                     # configurateur de devis — phases 11 à 13
  lib/
    site.ts                    # NAP, zone, prestations — source de vérité
public/
  photos/                      # photographies réelles, optimisées
```

Règle : **une section homepage = un composant serveur**, isolé, testable
visuellement seul, sans dépendance à ses voisins.

---

## 5. Mobile-first — `VERROUILLÉ`

Le trafic attendu est très majoritairement mobile (recherche locale, souvent
dans l'urgence). Le mobile n'est pas une adaptation : c'est la conception de
référence.

- **Largeur de conception : ~390 px.** Chaque section est dessinée et validée à
  cette largeur avant toute version large.
- **Navigation compacte :** logo + bouton d'appel + menu. Pas de méga-menu.
- **CTA téléphone et devis immédiatement accessibles**, sans défilement, dès le
  premier écran.
- **Barre d'action mobile** persistante en bas de viewport : `Appeler` (action
  primaire) et `Devis gratuit` (action secondaire). Elle ne masque jamais du
  contenu utile — le `body` réserve la hauteur correspondante.
- **Aucune interaction dépendant uniquement du hover.** Tout effet de survol a
  un équivalent au tap et au focus clavier.
- **Performances élevées :** budget et objectifs détaillés en phase 15.
- **Animations réduites sur mobile**, et neutralisées sous
  `prefers-reduced-motion: reduce`.

---

## 6. Contraintes techniques structurantes

- Aucune donnée d'entreprise en dur dans les composants : tout passe par
  `src/lib/site.ts`.
- Aucun secret versionné ; `.env.example` documente les variables sans valeur.
- Les photos livrées par le client sont la ressource critique du projet : le
  planning de la phase 5 (Hero) dépend de leur réception.

---

## 7. Points ouverts à confirmer avec le client

1. Nom de domaine définitif (`NEXT_PUBLIC_SITE_URL`).
2. Numéro de téléphone et e-mail de contact publics.
3. Adresse professionnelle : affichée publiquement ou zone de service seule
   (impacte le balisage `LocalBusiness`, cf. `SEO_STRATEGY.md`).
4. Forme juridique, SIREN, assurance décennale / RC pro, mentions légales.
5. Photothèque : volume, qualité, droits, présence d'avant/après.
6. Avis clients existants (Google Business Profile ou autres) réutilisables.
7. Hébergement retenu et adresse de réception des demandes de devis.
