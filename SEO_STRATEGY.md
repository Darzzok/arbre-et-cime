# SEO_STRATEGY.md — Stratégie SEO locale

Objectif : être une réponse évidente sur les recherches **« élagueur Rouen »** et
leurs variantes, sur la carte comme dans les résultats classiques, puis
transformer ce trafic en demandes de devis.

Principe directeur : **le SEO du site est ancré à Rouen et à la Métropole Rouen
Normandie.** Le rayon de 100 km est une **information commerciale**, affichée et
rassurante, mais il n'est ni un mot-clé cible, ni un prétexte à multiplier des
pages villes.

---

## 1. Ce que l'on ne fera pas

- **Aucune génération massive de pages villes.** Pas de gabarit dupliqué sur
  50 communes avec le nom substitué : c'est du contenu à faible valeur, mal
  toléré, et cela dilue l'autorité du site.
- Pas de page « élagage 100 km autour de Rouen » : personne ne cherche cela.
- Pas de contenu rédigé pour le moteur plutôt que pour le client.
- Pas de balisage de données structurées décrivant des faits non vérifiables
  (avis inventés, tarifs fictifs, zone de service exagérée).

---

## 2. Cible de mots-clés

### Cœur — priorité absolue

| Intention | Requêtes types |
| --- | --- |
| Métier + ville | élagueur Rouen, élagueur grimpeur Rouen, élagage Rouen |
| Service + ville | abattage arbre Rouen, dessouchage Rouen, taille de haie Rouen |
| Métropole | élagueur métropole rouennaise, élagage Seine-Maritime |
| Urgence | élagage urgence Rouen, abattage arbre dangereux Rouen, arbre tombé Rouen |
| Commercial | devis élagage Rouen, prix abattage arbre Rouen, tarif élagage |

### Secondaire — pages services

Une intention par prestation : « abattage difficile », « démontage arbre par
cordes », « débroussaillage terrain », « évacuation déchets verts », etc.

### Longue traîne éditoriale — plus tard

« quand élaguer un arbre en Normandie », « faut-il une autorisation pour abattre
un arbre », « élagage et voisinage : quelles règles », « comment reconnaître un
arbre dangereux ». Ces sujets servent l'autorité et la conversion, pas le
volume.

---

## 3. Architecture de routes

```
/                                   Homepage (7 sections verrouillées)
/prestations                        Vue d'ensemble des 8 prestations
/prestations/elagage
/prestations/abattage
/prestations/abattage-difficile
/prestations/dessouchage
/prestations/debroussaillage
/prestations/taille-de-haies
/prestations/entretien-exterieur
/prestations/evacuation-des-dechets
/zone-intervention                  Rouen, métropole, rayon commercial
/realisations                       Chantiers réels (si volume photo suffisant)
/devis                              Configurateur en 5 étapes
/contact                            NAP, horaires, urgences
/mentions-legales
/politique-de-confidentialite
```

Les slugs sont **sans accent, en minuscules, avec tirets**, et alignés sur
`ServiceSlug` dans `src/lib/site.ts`. Ils sont définitifs : les changer plus tard
coûterait des redirections inutiles.

### Pages locales — au cas par cas, jamais en série

L'architecture doit **permettre** d'ajouter plus tard quelques pages locales,
sans en faire un automatisme :

```
/elagueur/[ville]     ex. /elagueur/mont-saint-aignan
```

Conditions cumulatives pour créer une telle page :

1. la commune représente une demande réelle et récurrente ;
2. il existe **au moins trois chantiers réalisés** documentés par des photos ;
3. le contenu est spécifique (essences, contraintes d'accès, réglementation
   locale, quartiers) et non substituable ;
4. le texte utile dépasse 500 mots réellement informatifs.

Candidates plausibles à moyen terme : Mont-Saint-Aignan, Bois-Guillaume,
Sotteville-lès-Rouen, Le Grand-Quevilly, Barentin, Elbeuf. **Aucune n'est créée
tant que les conditions ci-dessus ne sont pas remplies.**

---

## 4. Gabarit d'une page service

1. `h1` : « Prestation à Rouen et dans la métropole rouennaise ».
2. Chapô : le problème du client, pas la prestation.
3. Photo réelle de la prestation.
4. Comment intervient Arbre et Cime : méthode, matériel, sécurité.
5. Cas de figure traités (accès difficile, proximité de bâti, urgence).
6. Ce qui est inclus — dont évacuation des déchets.
7. Éléments qui font varier le devis (hauteur, accès, essence, évacuation).
8. Zone d'intervention.
9. CTA appel + devis.
10. FAQ ciblée (3 à 5 questions réelles).

Longueur cible : 700 à 1 200 mots utiles. Chaque page doit répondre à une
question qu'un client se pose vraiment.

---

## 5. Métadonnées

- `metadataBase` alimenté par `NEXT_PUBLIC_SITE_URL` — déjà en place dans
  `layout.tsx`.
- Gabarit de titre : `%s | Arbre et Cime Élagage`, titre par défaut incluant
  « Élagueur-grimpeur à Rouen ».
- `title` de page : 55–60 caractères, **la ville dans les 40 premiers**.
- `description` : 140–155 caractères, avec un bénéfice concret et un appel à
  l'action (« Devis gratuit »).
- `alternates.canonical` sur chaque page.
- Open Graph avec une **photo réelle** de chantier.
- Une seule langue : `fr`. Pas de `hreflang`.

---

## 6. Données structurées (JSON-LD)

À implémenter en phase 14, **uniquement sur des faits vérifiés** :

- **`LocalBusiness`** (ou `HomeAndConstructionBusiness`) sur la homepage :
  `name`, `telephone`, `email`, `url`, `image`, `priceRange`, `areaServed`
  (Rouen + Métropole Rouen Normandie + Seine-Maritime), `geo`, `openingHours`.
  Si le client ne souhaite pas publier d'adresse, on décrit une **zone de
  service** sans `address` postale complète plutôt que d'inventer une adresse.
- **`Service`** sur chaque page prestation, rattaché au `LocalBusiness`, avec
  `areaServed`.
- **`BreadcrumbList`** sur les pages internes.
- **`FAQPage`** là où une FAQ réelle existe.
- **`AggregateRating` / `Review`** : seulement si des avis authentiques et
  affichés existent. Jamais autrement.

---

## 7. SEO technique

- `app/sitemap.ts` et `app/robots.ts` générés depuis les routes réelles.
- URLs canoniques absolues, sans slash final, une seule variante d'hôte
  (redirection `www` ↔ apex décidée une fois pour toutes).
- HTML statique par défaut : toutes les pages du site sont pré-rendues.
- Images `next/image`, dimensions explicites, `alt` rédigé, pas de CLS.
- Cœur des Web Vitals : cibles définies en phase 15.
- HTTPS, HSTS, en-têtes de sécurité de base.
- Pas de contenu clé injecté côté client : le texte doit être dans le HTML
  initial.

---

## 8. SEO local hors site — déterminant

Le classement dans le pack local dépend surtout de signaux **hors site**. À
piloter avec le client :

1. **Google Business Profile** : catégorie principale « Service d'élagage »,
   zone de service (Rouen + communes de la métropole), photos réelles récentes,
   description, horaires, prestations listées, publications régulières.
2. **Cohérence NAP** stricte entre le site, GBP et les annuaires — d'où la
   source unique `src/lib/site.ts`.
3. **Avis clients** : sollicitation systématique après chantier, réponse à
   chaque avis. C'est le levier le plus rentable du projet.
4. Annuaires professionnels pertinents (Pages Jaunes, annuaires paysagistes,
   fédérations arboricoles), sans inscription de masse.
5. Mentions locales : presse locale, partenariats, clients professionnels et
   collectivités qui peuvent citer l'entreprise.

---

## 9. Mesure

- Google Search Console : positions sur les requêtes « + Rouen », pages
  d'entrée, couverture.
- Google Business Profile Insights : appels, itinéraires, vues.
- Analytics respectueux de la vie privée (cf. `CONVERSION_STRATEGY.md`) :
  conversions `tel:` et devis, par page d'entrée.
- Revue mensuelle : positions cœur, volume de demandes de devis, part mobile.
