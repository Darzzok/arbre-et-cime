# QA_REPORT.md — Recette de préproduction

| | |
| --- | --- |
| **Date** | 2 septembre 2026 |
| **Dernier commit** | `bd1de0f` — *phase 15b.6: finalize contact quote and visual consistency* |
| **État testé** | working tree, phases 16B + correctifs + phase 17 **non commités** |
| **Build** | production (`npm run build`), servi sur `localhost:3100` |
| **Indexation** | `NEXT_PUBLIC_SITE_INDEXABLE=false` — inchangé |
| **Envoi du devis** | volontairement inactif (phase 13, après Hostinger) |
| **Analytics** | **non retenu pour la V1** — décision client |

> **Ce rapport dit ce qui a été mesuré, et ce qui ne l'a pas été.** Les
> vérifications automatisées sont rejouables : `scripts/qa-*.mjs`, serveur de
> production démarré.

---

## 1. Trois prémisses du brief de recette étaient périmées

Elles sont corrigées ici plutôt que suivies, parce que le dépôt dit autre chose.

| Le brief disait | La réalité mesurée |
| --- | --- |
| « 23 villes », tester `/dieppe` et `/le-havre` | **19 communes.** Dieppe, Le Tréport, Fécamp et Le Havre ont été retirés sur demande client après la phase 15B.5, avec leurs pages. **Périmètre confirmé** : la documentation a été alignée sur 19. |
| « téléphone non confirmé — 0 lien `tel:` » | **Téléphone confirmé** en phase 15B.6 : `06 28 77 82 40`. `tel:+33628778240` est rendu partout où il était prévu. |
| « conserver l'icône provisoire », `src/app/icon.svg` | **Logo final livré** en phase 16B. Icônes dérivées du maître : `icon.png`, `apple-icon.png`, `favicon.ico`. Pas de SVG. |
| « aucune donnée inventée : SIRET, adresse » | **SIRET et commune du siège confirmés** en phase 16B, et affichés. Ce sont des données du client, pas des inventions. |

---

## 2. Routes

**31 routes** atteintes en suivant les liens depuis l'accueil, **toutes en HTTP
200**.

| Groupe | Routes |
| --- | --- |
| Accueil | `/` |
| Services | `/elagage` `/abattage` `/dessouchage` `/entretien-exterieur` |
| Preuve | `/realisations` `/a-propos` |
| Zones | `/zones-intervention` + **19 pages villes** |
| Conversion | `/devis` `/contact` |
| Légal | `/mentions-legales` `/politique-confidentialite` |
| Hors navigation | `/style-guide` (`noindex, nofollow, nocache`), `404` |

Aucune route publique inattendue. Aucune route prévue absente.

---

## 3. Défauts trouvés, et ce qui en a été fait

### Corrigés

| # | Défaut | Où | Correction |
| --- | --- | --- | --- |
| 1 | **Aucun retour à l'accueil** dans le contenu de la page 404. Le logotype de l'en-tête y menait, ce qui est insuffisant pour quelqu'un qui arrive depuis un résultat de recherche. | `src/app/not-found.tsx` | Lien « Retour à l'accueil » ajouté sous le bouton devis, qui reste primaire. |
| 2 | **Accord grammatical faux** : avec une seule photo, le bandeau de reprise affichait « mais **les 1 photo sont** à ajouter de nouveau ». | `src/components/quote/quote-configurator.tsx` | Déterminant et verbe accordés au nombre : « la photo est » / « les N photos sont ». |

### Écartés après vérification — ce n'étaient pas des défauts

| Signalement | Verdict |
| --- | --- |
| Lien d'évitement mesuré à 1 × 1 px | **Artefact de mesure.** Testé dans une iframe non focalisée, où `:focus` ne s'applique pas. Au premier `Tab` réel : **230 × 44 px**, visible, sur fond forêt. |
| 73 « textes tronqués » | **Faux positifs.** Ce sont les libellés `sr-only` de la carte, dont `clientWidth` vaut 1 par construction. Après exclusion des éléments masqués : **zéro troncature**. |
| « Numéro de téléphone en dur » sur 31 pages | **Le numéro confirmé**, rendu depuis `site.ts`. Le détecteur a été corrigé pour neutraliser la valeur de la source unique : il ne signale plus qu'un numéro *étranger* à `site.ts`. Il n'y en a aucun. |
| « Mention d'assurance » sur `/zones-intervention/rouen` | Le **verbe** *assurer* : « les prestations sont **assurées** à Rouen ». Détecteur restreint au nom. |
| Requêtes `?_rsc=` pendant le parcours devis | **Préchargement RSC de Next**, déclenché par les liens visibles. Ni mesure, ni envoi de formulaire. |

### Ouvert, à trancher par le client

| Sujet | Détail |
| --- | --- |
| ~~« Basée à Rouen » contre siège au Grand-Quevilly~~ | **CORRIGÉ** — voir § 3 bis. |
| **7 fichiers médias orphelins**, ≈ 4,5 Mo | Restes du retrait des heros de pages intérieures et du changement de photo dessouchage. Aucun n'est servi. Liste au § 11. |
| **Lien en ligne à 20 px de haut** | « mentions légales » dans une phrase de `/politique-confidentialite`. WCAG 2.5.8 **exempte explicitement** les liens dans un bloc de texte ; `CLAUDE.md` § 5 ne mentionne pas cette exception. Conforme, mais à arbitrer si la règle interne doit rester absolue. |
| **Double `<meta name="robots">` sur la 404** | Next émet le sien (`noindex`) en plus du nôtre (`noindex, follow`). Les deux disent noindex : cosmétique. |

---

## 3 bis. Correction du wording géographique de Rouen

Le siège est au Grand-Quevilly. Quatre formulations affirmaient une
implantation **rouennaise** qui n'existe pas.

| Où | Avant | Après |
| --- | --- | --- |
| `locations.ts` — chapô de Rouen | « **Arbres & Cimes est basée à Rouen.** C'est le point de départ de tous les chantiers… » | « **Rouen se situe au cœur du secteur d'intervention** d'Arbres & Cimes. C'est la commune où les chantiers demandent le moins d'organisation préalable… » |
| `locations.ts` — meta description de Rouen | « Élagueur-grimpeur **basé à** Rouen : … » | « Élagueur-grimpeur **à** Rouen : … » |
| `[ville]/page.tsx` — repère de distance | « Rouen est la **commune d'attache** d'Arbres & Cimes. » | « Rouen est le **point de référence du secteur** : toutes les distances annoncées s'y rapportent. » |
| `/a-propos` — chapô | « Une activité … **installée à** Rouen et dans la Métropole » | « Une activité … **qui intervient à** Rouen et dans la Métropole » |

**Ce qui n'a pas bougé** : centre cartographique, projection, distances,
voisins, coordonnées, slugs, niveaux. Rouen reste le point de projection, le
cœur de zone et la cible SEO principale.

**Ce qui est conservé, et devait l'être** — ce sont des expressions de
*service*, pas d'adresse :

- « élagueur à Rouen » (les `h1` et `title` des pages villes)
- « intervention à Rouen », « intervient à Rouen »
- « à Rouen et dans la Métropole Rouen Normandie »

**Vérification :** balayage des 31 routes servies pour
`commune d'attache`, `basé(e) à Rouen`, `installé à Rouen`, `siège à Rouen`,
`domicilié à Rouen`, `implanté à Rouen` → **0 occurrence**. Les trois familles
d'expressions de service sont toujours présentes.

Deux commentaires de code devenus faux ont été corrigés au passage
(`site.ts`, `structured-data.ts`), ainsi que `SEO_STRATEGY.md` qui écrivait
« entreprise unique basée à Rouen ».

> **Une répétition introduite puis corrigée.** La première rédaction faisait
> dire deux fois la même chose sur la même page — « Rouen se situe au cœur du
> secteur » dans le chapô, « Rouen est au cœur du secteur » dans le repère de
> distance. Ce second bloc annonce des kilomètres pour toutes les autres
> communes : il dit maintenant d'où ces kilomètres sont comptés.

---

## 4. Ce qui a été mesuré

### Structure et SEO technique

| Contrôle | Résultat |
| --- | --- |
| Un seul `h1` par page | **31/31** |
| `title` unique | **31/31**, aucun doublon |
| `description` présente | **31/31** |
| `noindex` en préproduction | **31/31** |
| Identifiants HTML dupliqués | **0** |
| `href="#"` | **0** |
| `tabindex` positif | **0** |
| `<img>` sans `alt` | **0** |
| Liens internes cassés | **0** |
| Sitemap | **vide** — attendu tant que `SITE_INDEXABLE=false` |
| `robots.txt` | `Allow: /` sans `Disallow` — exploration permise, indexation bloquée page par page. Cohérent avec la stratégie. |
| Canonique | **absente** — `NEXT_PUBLIC_SITE_URL` non renseignée. Attendu. |
| Open Graph | titre, description, type, locale, `siteName`. **`og:image` volontairement absente** (`OG_IMAGE = null`) : la charte impose une photographie réelle. |
| JSON-LD | fil d'Ariane uniquement. **`LocalBusiness` gelé** faute de domaine et d'adresse complète. |

### Contenu métier — 31 routes auditées

Aucune affirmation non soutenue. Recherché et **non trouvé** : disponibilité
24/7, garantie, avis ou note, prix, délai chiffré, horaires, mention
d'assurance, certification ISO/QUALIBAT/RGE, volumétrie client, numéro
étranger à `site.ts`, adresse postale en dur.

Les **5 communes « Déplacement à étudier »** — Amiens, Abbeville, Beauvais,
Lisieux, Mantes-la-Jolie — portent toutes une réserve et aucune formulation
affirmative.

### Invariant du périmètre local — **19 = 19 = 19 = 19 = 19**

Le périmètre est **volontairement limité à 19 communes** : décision produit
confirmée, prise après la phase 15B.5 qui a retiré Dieppe, Le Tréport, Fécamp
et Le Havre avec leurs pages. **Elles ne doivent pas être restaurées.**

| Source | Compte |
| --- | --- |
| Communes dans `src/content/locations.ts` | **19** |
| Slugs uniques | **19** |
| Pages générées, HTTP 200 | **19** |
| Liens du hub `/zones-intervention` | **19** |
| Repères de la carte **réellement rendus** | **19** |

Hors invariant, et c'est normal : `data/geo/communes.json` et `map-data.ts`
comptent **26** entrées — les sept villes supplémentaires cadrent la carte sans
être desservies.

Niveaux : **core 7 · primary 7 · extended 5**. Aucun slug dupliqué, aucun
voisin inconnu, aucune page sans métadonnées.

> **Un piège corrigé dans le script lui-même.** `qa-villes.mjs` comptait les
> repères en lisant `map-data.ts` à l'expression régulière, et trouvait **6**
> au lieu de 19 : `HOME_MARKERS` est un tableau dérivé (`[...CLUSTER, ...RING]`)
> réparti sur plusieurs déclarations. Il compte désormais les
> `data-map-marker` **émis dans le HTML servi**. Un invariant qui se trompe de
> source ne protège rien.

### Responsive — 104 contrôles

13 routes × 8 largeurs (320, 360, 390, 430, 768, 1024, 1280, 1440).
**Zéro débordement horizontal.** Zéro troncature de texte.

### Configurateur de devis

| Scénario | Résultat |
| --- | --- |
| A — Élagage, 1 arbre, 5–10 m, sans contrainte, sans photo, Rouen | parcours complet jusqu'au récapitulatif |
| B — Abattage | nombre d'arbres + hauteur + contraintes |
| C — **Dessouchage** | « taille de la souche », **aucune hauteur d'arbre** ✔ |
| D — Entretien extérieur | « Quels travaux ? » + « Quelle ampleur ? » |
| E — Je ne sais pas | parcours simplifié, une zone de texte libre |

Validation : l'étape 4 refuse de passer sans code postal ni commune, avec deux
messages d'erreur distincts.

**Photos** — 1 valide acceptée · 5 maximum · 6ᵉ refusée · doublon refusé · PDF
refusé · 11 Mo refusé avec message chiffré (« pèse 11 Mo : la limite est de
10 Mo ») · suppression puis ré-ajout fonctionnels.

**Persistance** — enregistrement mesuré à **197 octets**. Restauré : étape,
besoin, réponses chantier, code postal, commune, nombre de photos.
**Jamais restauré : nom, téléphone, e-mail, commentaire, adresse précise,
photographies.** Bandeau de reprise affiché.

**Envoi — le point critique** : **zéro requête réseau** à la soumission
(`fetch`, `XMLHttpRequest` et `sendBeacon` instrumentés). L'écran final dit
« **Votre demande est prête** », jamais « envoyée ». `sessionStorage` purgé.

### Accessibilité et clavier

- Lien d'évitement : visible au premier `Tab`, **230 × 44 px**.
- Menu mobile : ouverture, `aria-expanded`, verrou de défilement, focus déplacé
  dans le panneau, `Échap` ferme, focus rendu au bouton, verrou levé.
- Sous-menu Prestations : même comportement, 4 liens.
- Nom accessible du logotype : « Arbres et Cimes Élagage — retour à l'accueil ».
- Mouvement réduit : règle globale présente ; **85 éléments animés à opacité 1**.

### Performance — build de production, Lighthouse 13.4.1

| Route | Perf | A11y | BP | SEO | FCP | LCP | CLS | TBT | JS | Images |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 91 | **100** | **100** | 66 | 0,9 s | 3,6 s | **0** | 30 ms | 186 ko | 273 ko |
| `/elagage` | 96 | **100** | **100** | 66 | 0,9 s | 2,8 s | **0** | 50 ms | 186 ko | 73 ko |
| `/zones-intervention` | 95 | **100** | **100** | 66 | 0,9 s | 2,9 s | **0** | 30 ms | 186 ko | 9 ko |
| `/contact` | 97 | **100** | **100** | 66 | 0,8 s | 2,7 s | **0** | 30 ms | 186 ko | 28 ko |
| `/devis` | 96 | **100** | **100** | 66 | 0,8 s | 2,8 s | **0** | 40 ms | 186 ko | 264 ko |

**SEO 66 partout est voulu** : l'audit `is-crawlable` échoue sous `noindex`.
Il remontera au lancement, pas avant.

L'accueil est la page la plus lourde en images (photographie du hero). Son LCP
de 3,6 s est mesuré sous l'étranglement réseau de Lighthouse.

### Bundle et polices

- **Aucune dépendance ajoutée** en phase 15B ni 16B : `package.json` et
  `package-lock.json` identiques au dernier commit.
- `sharp`, employé pour générer les déclinaisons du logo, est **déjà installé
  par Next** et n'intervient qu'au moment de l'écriture.
- Polices : **Sora** (titres) + **Inter** (texte), préchargées en woff2.
  **0 Fraunces, 0 Manrope.**
- CSS : 74 ko. JS : 186 ko transférés.

### Console

**0 erreur** sur 14 routes. Aucune image en échec. Aucun script tiers.

---

## 5. Ce qui n'a pas pu être vérifié ici

| Point | Pourquoi |
| --- | --- |
| iOS Safari, Android Chrome sur appareils réels | pas d'appareil dans l'environnement |
| Rendu des favicons dans l'onglet et sur l'écran d'accueil iOS | idem |
| Composition du `tel:` sur un téléphone | idem |
| Relecture orthographique humaine | un correcteur automatique ne remplace pas une relecture |
| Firefox | non installé dans l'environnement |

---

## 6. Éléments manquants avant la mise en production

Rien dans cette liste n'est un défaut du site : ce sont des **dépendances
externes**. Aucune n'a été comblée par supposition.

### Identité
- [x] Logo final — livré en phase 16B
- [x] Favicon et icônes — dérivés du maître
- [ ] Version claire ou inversée du logo pour fond sombre *(souhaitable, pas bloquant)*

### Contact et informations légales
- [x] E-mail public — `aec.elagage76@gmail.com`
- [x] Téléphone public — `06 28 77 82 40`
- [x] Forme juridique, SIRET, commune du siège
- [ ] **Adresse postale complète** (voie et code postal)
- [ ] TVA — à confirmer : franchise en base probable, donc peut-être rien à afficher
- [ ] Médiateur de la consommation — à vérifier avec le comptable

### Domaine
- [ ] **Nom de domaine définitif** → `NEXT_PUBLIC_SITE_URL`
- Sans lui : pas de canonique, pas de sitemap, pas d'URL absolue, `LocalBusiness` gelé

### Hébergement
- [ ] **Contrat Hostinger** souscrit
- [ ] Coordonnées de l'hébergeur → rubrique « Hébergement » des mentions légales
- [ ] DNS, HTTPS, en-têtes de sécurité

### Formulaire — phase 13
- [ ] Endpoint PHP + SMTP Hostinger
- [ ] `QUOTE_INBOX_EMAIL` dans la configuration serveur, **jamais dans le dépôt**
- [ ] **Réécrire la rubrique « Ce qui se passe aujourd'hui »** de la politique
      de confidentialité le jour où l'envoi est activé : elle décrit un
      formulaire qui n'envoie rien et deviendra fausse à cet instant précis

### SEO
- [ ] `NEXT_PUBLIC_SITE_INDEXABLE=true` — **une seule fois**, sur décision explicite
- [ ] Sitemap soumis à la Search Console
- [ ] Fiche Google Business Profile alignée sur le NAP
- [ ] Décider d'activer `OG_IMAGE` et le balisage `LocalBusiness`

### Décisions client en attente
- [x] ~~Rouen ou Le Grand-Quevilly comme commune d'attache~~ — **tranché** :
      aucune implantation rouennaise n'est affirmée, Rouen reste le cœur de
      zone et la cible SEO
- [ ] Durée interne de conservation des demandes
- [ ] Sort des 7 fichiers médias orphelins

---

## 7. Checklist de lancement — dans l'ordre

1. Domaine acheté et DNS pointé
2. Hébergement Hostinger souscrit, HTTPS actif
3. `NEXT_PUBLIC_SITE_URL` renseignée en production
4. Coordonnées de l'hébergeur ajoutées aux mentions légales
5. Adresse postale complète ajoutée, bloc « En cours de finalisation » retiré
6. Endpoint PHP + SMTP en place, envoi testé de bout en bout
7. Politique de confidentialité mise à jour (§ « Ce qui se passe aujourd'hui »)
8. `LEGAL_UPDATED` remis à la date du jour
9. **`NEXT_PUBLIC_SITE_INDEXABLE=true`** — en dernier
10. Sitemap soumis, Search Console vérifiée, GBP aligné

> **Le site n'est pas prêt pour la production**, et ce n'est pas une question
> de code : les points 1, 2, 3 et 6 dépendent d'achats et de configurations que
> seul le client peut effectuer.

---

## 8. Scripts de recette

Rejouables à tout moment, serveur de production démarré :

```bash
npm run build && node scripts/qa-crawl.mjs && node scripts/qa-images.mjs && node scripts/qa-villes.mjs && node scripts/qa-contenu.mjs
```

| Script | Ce qu'il vérifie |
| --- | --- |
| `qa-crawl.mjs` | routes, `h1`, `title`, `description`, `robots`, identifiants, `alt`, liens, ressources |
| `qa-images.mjs` | chaque image jusqu'à sa source, `alt`, `sizes`, fichiers orphelins |
| `qa-villes.mjs` | invariant des communes, doublons, voisins, métadonnées |
| `qa-contenu.mjs` | affirmations non soutenues, discours des communes éloignées |

---

## 9. Fichiers médias orphelins

Aucun n'est servi. Vérifié par recherche dans `src/` **et** par inspection du
HTML rendu.

| Fichier | Poids |
| --- | --- |
| `public/images/services/dessouchage-souche-fraiche-sciure.jpg` | 1 156 Ko |
| `public/images/realisations/chantier-abattage-foret-tronconneuse.jpg` | 845 Ko |
| `public/images/hero/elagueur-ascension-arbre-hiver.jpg` | 679 Ko |
| `public/images/hero/elagueur-ascension-tronc-vertical.jpg` | 637 Ko |
| `public/images/services/abattage-tronconnage-grume.jpg` | 577 Ko |
| `public/images/details/materiel-cordage-baudrier.jpg` | 552 Ko |
| `public/brand/logo-symbole.png` | 109 Ko — **conservé volontairement** (réserve, source des icônes) |

Total récupérable : **≈ 4,4 Mo**. Décision client — je ne supprime pas de média
sans demande.
