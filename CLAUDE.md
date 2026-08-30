# CLAUDE.md — Règles permanentes du projet

Ce fichier fait autorité pour toute intervention automatisée ou assistée sur ce
dépôt. Il est lu avant chaque tâche. En cas de contradiction avec une idée
« d'amélioration » spontanée, **ce fichier gagne**.

---

## 1. Projet

Site vitrine sur mesure de **Arbre et Cime Élagage**, élagueur-grimpeur basé à
Rouen. Objectif commercial unique : **générer des demandes de devis qualifiées**
(appel téléphonique ou configurateur de devis).

Documents de référence, à lire selon le sujet traité :

| Fichier | Sujet |
| --- | --- |
| `PROJECT.md` | Contexte client, positionnement, décisions verrouillées |
| `DESIGN_SYSTEM.md` | Couleurs, typographies, grille, mouvement, composants |
| `SEO_STRATEGY.md` | SEO local Rouen, architecture de routes, données structurées |
| `CONVERSION_STRATEGY.md` | Parcours, CTA, preuves, mesure |
| `QUOTE_FLOW.md` | Configurateur de devis en 5 étapes |
| `CONTENT_STRATEGY.md` | Ton, rédaction, photographie, nommage des médias |
| `ROADMAP.md` | Découpage en 18 phases et critères de sortie |

---

## 2. Stack (verrouillée)

- **Next.js 16** — App Router uniquement, Turbopack
- **React 19**
- **TypeScript strict** (`strict: true`, `noUncheckedIndexedAccess: true`)
- **Tailwind CSS v4** — configuration par `@theme` dans `src/app/globals.css`,
  pas de `tailwind.config.js`
- **ESLint 9** — flat config (`eslint.config.mjs`)
- **npm** — pas de pnpm, pas de yarn, pas de bun

`next lint` n'existe plus en Next 16 : la commande de lint est `npm run lint`
(= `eslint`).

---

## 3. Règles permanentes

1. **Ne jamais modifier une décision verrouillée sans demande explicite du
   client.** Sont verrouillés : la liste et l'ordre des 7 sections de la
   homepage, la charte graphique, la stack, le périmètre du configurateur de
   devis. Repérables par la mention `VERROUILLÉ` dans la documentation.
2. **Ne jamais ajouter de section, de fonctionnalité, de page ou de dépendance
   non demandée.** Toute dépendance nouvelle doit être justifiée par un besoin
   réel, sans équivalent natif Next/React/CSS, et validée avant installation.
3. **Mobile-first, sans exception.** Toute interface se conçoit d'abord à
   ~390 px de large, puis s'élargit. Jamais l'inverse.
4. **SEO local prioritaire.** Rouen et la métropole rouennaise avant tout autre
   arbitrage éditorial ou technique.
5. **Vraie photographie uniquement.** Aucune image générée par IA ne représente
   l'activité, les chantiers, le matériel ou les personnes. Photos client en
   priorité ; à défaut, banques d'images libres réellement adaptées au métier.
6. **Pas de look « site généré par IA ».** Pas de grilles de cartes identiques,
   pas de dégradés violets, pas d'icônes décoratives en série, pas de sections
   « Features / Testimonials / CTA » interchangeables, pas de texte creux.
7. **Performance et accessibilité priment sur l'effet.** Un effet visuel qui
   coûte du LCP, du CLS ou de l'accessibilité est supprimé, pas optimisé.
8. **Mettre à jour la documentation dès qu'une décision structurante change.**
   Un changement d'architecture, de charte ou de parcours sans mise à jour du
   `.md` correspondant est un travail incomplet.
9. **Ne jamais exposer de secret.** Aucune clé, aucun token, aucune adresse
   privée en dur dans le code ni dans un fichier versionné. Les secrets vivent
   dans `.env.local` (ignoré par git) et sont documentés, vides, dans
   `.env.example`.
10. **Ne jamais activer l'indexation avant le lancement définitif.** Le site est
    déployé publiquement alors que ses pages portent encore un contenu
    d'attente. `NEXT_PUBLIC_SITE_INDEXABLE` ne passe à `"true"` qu'en phase 18,
    sur décision explicite du client, et une seule fois. Ne jamais contourner
    `SITE_INDEXABLE` (`src/lib/seo.ts`) en écrivant des directives `robots`,
    une `canonical` ou une entrée de sitemap directement dans une page.
11. **Exécuter `npm run lint` puis `npm run build` avant de déclarer une étape
    terminée.** Une étape n'est pas terminée si l'un des deux échoue.

---

## 4. Conventions de code

- Composants serveur par défaut. `"use client"` seulement si état, événement ou
  API navigateur est réellement nécessaire, et le plus bas possible dans l'arbre.
- Arborescence : `src/app` (routes), `src/components` (UI), `src/lib` (données,
  utilitaires), `public` (médias servis).
- Les informations d'entreprise (nom, téléphone, e-mail, zone, prestations)
  proviennent **exclusivement** de `src/lib/site.ts`. Jamais recopiées en dur.
- Images via `next/image`, avec `alt` descriptif rédigé (cf.
  `CONTENT_STRATEGY.md`), `sizes` explicite, `priority` réservé au visuel LCP.
- Pas de `any`, pas de `@ts-expect-error` sans commentaire justifiant.
- Textes en français, avec apostrophes typographiques (`’`) dans le contenu
  affiché.
- Classes Tailwind uniquement à partir des jetons `@theme` : pas de couleur
  hexadécimale écrite à la volée dans un composant.

---

## 5. Accessibilité et mouvement — minimum non négociable

- Aucune information ni interaction accessible **uniquement** au survol.
- Contraste AA minimum sur tout texte ; les combinaisons validées sont listées
  dans `DESIGN_SYSTEM.md`.
- Navigation clavier complète, focus visible (`--focus-ring` : forêt sur surface
  claire, jaune sécurité sur surface sombre — voir `DESIGN_SYSTEM.md` § 8).
- `prefers-reduced-motion: reduce` neutralise animations et transitions — la
  règle globale est déjà en place dans `globals.css`, ne pas la contourner.
- Cibles tactiles ≥ 44 × 44 px.

---

## 6. Commandes

```bash
npm run dev        # développement
npm run lint       # ESLint (obligatoire avant de clore une étape)
npm run typecheck  # tsc --noEmit
npm run build      # build de production (obligatoire avant de clore une étape)
npm start          # serveur de production
```

---

## 7. Git

- Aucun commit ni push automatique : le client déclenche lui-même.
- Messages de commit en français, à l'impératif, préfixés par la phase :
  `phase 2 : jetons de design et typographies`.
