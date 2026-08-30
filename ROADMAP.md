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

## Phase 2 — Design system ⬜

- Échelle typographique complète appliquée (mobile → large)
- Primitives : `Section`, `Container`, `Overline`, `Rule`, `CtaPrimary`,
  `CtaPhone`, `Figure`
- Utilitaires de révélation à l'apparition, avec repli `prefers-reduced-motion`
- Page de démonstration interne des jetons et primitives (non indexée)

**Sortie :** toutes les primitives visibles côte à côte à 390 px et en large,
contrastes conformes au tableau de `DESIGN_SYSTEM.md`.

---

## Phase 3 — Architecture SEO et routes ⬜

- Création de l'arborescence de `SEO_STRATEGY.md` (prestations, zone,
  réalisations, devis, contact, pages légales)
- Slugs définitifs alignés sur `ServiceSlug`
- `generateMetadata` par route, canoniques
- Fil d'Ariane

**Sortie :** toutes les routes répondent en statique avec des métadonnées
distinctes et correctes.

---

## Phase 4 — Navigation, header, footer ⬜

- En-tête compact : logotype, bouton d'appel, ouverture du menu
- Menu mobile pleine hauteur, fermeture au clavier et à l'`Échap`
- Barre d'action mobile persistante (appeler / devis), `safe-area` respectée
- Footer : NAP, prestations, zone, mentions, rappel CTA
- Lien d'évitement vers le contenu principal

**Sortie :** châssis complet, navigable au clavier, sans dépendance au survol.

---

## Phase 5 — Hero ⬜

**Dépend de la réception des photos client.**

- Photo réelle plein écran, cadrage vertical sur mobile
- `h1` court, chapô d'une phrase, double CTA visible sans défiler à 390 px
- `priority` + `sizes` maîtrisés, aucun décalage de mise en page

**Sortie :** LCP mesuré sous 2,5 s en 4G simulée sur mobile.

---

## Phase 6 — Preuves ⬜

- Expérience, qualifications, sécurité, chantier propre, devis gratuit
- Traitement éditorial : filets et hiérarchie typographique, pas de cartes

**Sortie :** section validée à 390 px, aucun fait non vérifié affiché.

---

## Phase 7 — Prestations ⬜

- Les 8 prestations dans l'ordre de référence, en liste éditoriale
- Lien vers chaque page service
- Contenu des pages services rédigé selon le gabarit de `SEO_STRATEGY.md`

**Sortie :** parcours homepage → page service → CTA fonctionnel de bout en bout.

---

## Phase 8 — Pourquoi Arbre et Cime ⬜

- Trois à quatre différenciateurs argumentés, composition asymétrique
- Appui photo sur le matériel et la méthode

**Sortie :** section validée, aucun adjectif non étayé.

---

## Phase 9 — Réalisations ⬜

**Dépend de la photothèque.**

- Galerie éditoriale de chantiers réels, légendes factuelles
- Avant/après si disponible
- Chargement différé hors premier écran, dimensions explicites

**Sortie :** aucun CLS, navigation clavier de la galerie opérationnelle.

---

## Phase 10 — Carte de zone d'intervention ⬜

- Rouen et la métropole en cœur de cible, rayon jusqu'à 100 km en secondaire
- Carte animée : tracé progressif du rayon, sobre, sans bibliothèque lourde —
  SVG maîtrisé plutôt qu'un fond de carte tiers
- Repli textuel complet : liste des communes principales, lisible sans script
- Animation désactivée sous `prefers-reduced-motion`

**Sortie :** information de zone complète et compréhensible même sans animation.

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
| Phases 5, 9 | Photothèque client |
| Phases 4, 14, 18 | Téléphone, e-mail, domaine définitifs |
| Phase 13 | Hébergement, fournisseur d'envoi, adresse de réception |
| Phases 14, 18 | Raison sociale, SIREN, mentions légales, assurances |
| Phase 6 | Justificatifs des qualifications et de l'expérience |
