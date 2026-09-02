# MAP_DATA_SOURCES.md — Données cartographiques

**Registre permanent.** Toute donnée géographique entrant dans le projet est
inscrite ici avec sa source, sa licence et sa date de récupération. Une donnée
absente de ce registre est une donnée à retirer.

Constitué en **phase 10** (roadmap), le 31 août 2026. Mis à jour au correctif
**10C** et aux ajustements qui l'ont suivi.

---

## 1. Principe

La carte de la zone d'intervention est un **SVG construit sur mesure à partir
de données publiques**. Le site n'appelle aucun service cartographique au
runtime :

- **pas de Google Maps** — iframe lourde, hors charte, conditions d'usage ;
- **pas de Mapbox ni de fond de tuiles** — clé d'API, dépendance réseau, coût
  au chargement ;
- **aucune clé d'API, aucune requête sortante.**

Les données sont figées dans le dépôt, projetées une fois pour toutes, et
livrées sous forme de chaînes `d` SVG. Le coût réseau de la carte est **nul**
au-delà du HTML qui la contient.

---

## 2. Sources

| Donnée | Source | Producteur | Licence | Récupéré le |
| --- | --- | --- | --- | --- |
| Contour de la région Normandie | [france-geojson](https://github.com/gregoiredavid/france-geojson) — `regions/normandie/region-normandie.geojson` | Grégoire David, d'après le **découpage administratif de l'IGN** (ADMIN-EXPRESS) | **Licence ODbL** | 31 août 2026 |
| Contours des 5 départements normands | [france-geojson](https://github.com/gregoiredavid/france-geojson) — `regions/normandie/departements-normandie.geojson` | idem | **Licence ODbL** | 31 août 2026 |
| Coordonnées des 26 communes | [`geo.api.gouv.fr`](https://geo.api.gouv.fr/communes) | **Étalab / DINUM** (API officielle de l'État français), d'après le Code officiel géographique INSEE et l'IGN | **Licence Ouverte 2.0** | 31 août 2026 |
| Tracé de la Seine | [Natural Earth](https://www.naturalearthdata.com/) — `ne_10m_rivers_lake_centerlines` | Natural Earth | **Domaine public (CC0)** | 31 août 2026 |
| Limites des 71 communes de la Métropole Rouen Normandie | [`geo.api.gouv.fr`](https://geo.api.gouv.fr/epcis/200023414/communes) — EPCI 200023414 | **Étalab / DINUM**, d'après l'IGN | **Licence Ouverte 2.0** | 31 août 2026 |
| **Départements français, pleine précision** (19 retenus dans le cadre) | [france-geojson](https://github.com/gregoiredavid/france-geojson) — `departements.geojson` | Grégoire David, d'après l'IGN | **Licence ODbL** | 31 août 2026 |

La dernière ligne a changé au correctif : le fichier
`departements-version-simplifiee.geojson` (542 Ko) a été **remplacé par la
version pleine précision** (3,3 Mo). Motif au § 4.

### Obligations de licence

**ODbL** — attribution et partage à l'identique de la base. Les contours sont
utilisés tels quels, simplifiés géométriquement, sans enrichissement : les
sources d'origine restent versionnées dans `data/geo/`, et cette attribution
tient lieu de mention. En cas de redistribution de la base dérivée, la même
licence s'applique.

**Licence Ouverte 2.0** — attribution du producteur, aucune autre contrainte.

> ~~À faire avant la mise en production (phase 18) : reporter ces attributions
> dans les **mentions légales** du site. Ce n'est pas fait à ce jour.~~
> **FAIT en phase 16B.** Les deux attributions figurent dans la rubrique
> « Propriété intellectuelle » de `/mentions-legales`
> (`src/app/mentions-legales/page.tsx`). Toute nouvelle source cartographique
> ajoutée ici doit y être reportée : l'ODbL impose l'attribution.

---

## 3. Fichiers du dépôt

| Chemin | Rôle | Poids |
| --- | --- | --- |
| `data/geo/region-normandie.geojson` | Source brute, contour régional | 87 Ko |
| `data/geo/departements-normandie.geojson` | Source brute, 5 départements | 183 Ko |
| `data/geo/communes.json` | Source brute, 26 communes avec centroïde | 3,4 Ko |
| `data/geo/seine.geojson` | Source brute, tracé de la Seine | 7,4 Ko |
| `data/geo/metropole-rouen-normandie.geojson` | Source brute, 71 communes de la métropole | 362 Ko |
| `data/geo/departements-france.geojson` | Source brute, 96 départements **pleine précision** | 3,3 Mo |
| `scripts/build-map-data.mjs` | Projection et simplification | — |
| `src/lib/map-data.ts` | **Généré.** Chemins SVG et coordonnées projetées | 40 Ko |

Les sources brutes sont conservées **dans le dépôt** plutôt que téléchargées à
la demande : le pipeline reste reproductible même si un dépôt tiers disparaît
ou change de structure, et l'origine de chaque tracé reste vérifiable.

`data/geo/` n'est **jamais importé par le code de l'application** — ni au
build, ni au runtime. Seul le script le lit, à la main :

```bash
node scripts/build-map-data.mjs
```

C'est ce qui rend acceptable le fichier de 3,3 Mo : il pèse sur le clone du
dépôt, jamais sur le visiteur. Il reste réductible aux seuls départements du
cadre si le poids du dépôt devient un sujet.

---

## 4. Projection — azimutale équidistante centrée sur Rouen

Le choix n'est pas esthétique, il est **imposé par ce que la carte affirme**.

La carte annonce une portée de 100 km. Dans une projection Mercator — celle de
tous les fonds de carte grand public — un cercle de 100 km tracé autour de
Rouen n'est pas un cercle : la distance réelle varie avec la direction, et
l'écart atteindrait plusieurs kilomètres entre le nord et l'est. La carte
mentirait, discrètement mais réellement.

En projection **azimutale équidistante centrée sur Rouen**, toute distance
mesurée depuis le centre est exacte. Le cercle de portée est donc un vrai
`<circle>`, et la distance affichée pour chaque commune est la distance
réelle.

Paramètres :

| Paramètre | Valeur |
| --- | --- |
| Centre | Rouen — 1,0912 E / 49,4412 N (commune 76540) |
| Rayon terrestre | 6 371,0088 km (rayon volumétrique moyen, IUGG) |
| Unité de sortie | **kilomètres depuis Rouen** |
| Cadre (`viewBox`) | `-112 -112 224 224` — carré, Rouen au centre |

Sortir des kilomètres plutôt que des unités arbitraires rend les données
lisibles et vérifiables : un point à `x: 72` est bien à 72 km à l'est.

### Simplification — une tolérance par rôle

Ramer–Douglas–Peucker, avec une tolérance **différente selon ce que le tracé
doit porter** (`TOLERANCE` dans le script) :

| Tracé | Tolérance | Pourquoi |
| --- | --- | --- |
| Seine-Maritime | **0,3 km** | Elle porte le trait de côte, repère principal de la carte |
| Métropole Rouen Normandie | **0,35 km** | 71 communes dans 20 km : au-delà, les limites fusionnent |
| Contour régional, Seine | **0,5 km** | Tracés d'accompagnement |
| Autres départements | **1 km** | Simple fond de carte |

Les anneaux de moins de **4 km²** sont écartés — îlots invisibles à cette
échelle qui alourdissaient les tracés. Le seuil descend à **0,4 km² pour la
métropole** : à 4 km², douze des soixante et onze communes disparaissaient,
dont plusieurs communes urbaines denses. Un seuil unique était le mauvais
réglage ; il est désormais indexé sur le type de tracé
(`MIN_RING_AREA_KM2`).

### Pourquoi la source pleine précision

Avec le fichier « version simplifiée » de l'amont, la simplification
s'appliquait **deux fois** : une première par le producteur, une seconde ici.
Le littoral cauchois en sortait rogné au point que **Le Havre, dont le centre
est à 3 km du rivage, tombait visuellement en mer**. La côte est un repère
fort de cette carte ; elle mérite ses kilo-octets.

Le passage à la source pleine précision, combiné à la tolérance de 0,3 km sur
la Seine-Maritime, a corrigé le défaut. **Vérifié par test point-dans-polygone
sur les communes chargées : aucune n'est hors terre.** Le reproche visuel
qui subsistait après cette correction portait en fait sur le placement des
étiquettes, pas sur les points — voir § 6.

Résultat global : de **4,1 Mo de GeoJSON à 40 Ko de TypeScript**, sans perte
visible au-delà de 280 px de large.

---

## 5. Communes chargées

Les communes proviennent toutes de `geo.api.gouv.fr`, par code INSEE. Leur
distance à Rouen est **calculée par la projection**, jamais saisie.

| Code | Commune | Distance | Affichée |
| --- | --- | --- | --- |
| 76540 | Rouen | 0 km | oui |
| 76451 | Mont-Saint-Aignan | 3 km | oui |
| 76681 | Sotteville-lès-Rouen | 3 km | oui |
| 76108 | Bois-Guillaume | 4 km | oui |
| 76322 | Le Grand-Quevilly | 5 km | oui |
| 76575 | Saint-Étienne-du-Rouvray | 6 km | liste seule |
| 76057 | Barentin | 15 km | non |
| 76165 | Caudebec-lès-Elbeuf | 18 km | non |
| 76231 | Elbeuf | 19 km | liste seule |
| 27375 | Louviers | 25 km | oui |
| 76758 | Yvetot | 30 km | oui |
| 76276 | Forges-les-Eaux | 39 km | non |
| 76384 | Lillebonne | 41 km | non |
| 27467 | Pont-Audemer | 42 km | oui |
| 76312 | Gournay-en-Bray | 45 km | non |
| 76114 | Bolbec | 46 km | non |
| 27229 | Évreux | 47 km | oui |
| 27681 | Vernon | 48 km | oui |
| 27284 | Gisors | 52 km | oui |
| 76217 | Dieppe | 53 km | oui |
| 27056 | Bernay | 53 km | oui |
| 76259 | Fécamp | 60 km | oui |
| 14333 | Honfleur | 62 km | non |
| 78361 | Mantes-la-Jolie | 66 km | oui |
| 76351 | Le Havre | 70 km | oui |
| 14366 | Lisieux | 70 km | oui |
| 76711 | Le Tréport | 71 km | oui |
| 60057 | Beauvais | 72 km | oui |
| 80001 | Abbeville | 91 km | oui |
| 80021 | Amiens | 100 km | oui |

**Vingt et une sont affichées**, choisies pour leur azimut et leur distance,
pas pour leur notoriété : la couronne doit **remplir** le cercle de 100 km, pas
le border. Neuf sont chargées sans être affichées — elles restent disponibles
pour un futur arbitrage éditorial, et leur distance calculée sert de
vérification. La sélection vit dans `src/lib/map-content.ts`, jamais ici.

Deux retraits explicites, décidés à la mesure :

- **Gournay-en-Bray** — même azimut que Beauvais, étiquettes superposées ;
- **Honfleur** — coincée entre Pont-Audemer et Lisieux, aucun placement libre.

**Aucune commune au-delà de 100 km n'est chargée.** Caen (110 km), présente
dans la première version, a été retirée des données : la montrer laisserait
croire qu'elle est dans la portée annoncée.

> **Aucune de ces communes n'est présentée comme desservie.** Le rayon est un
> argument commercial (`PROJECT.md` § 1), pas une couverture. Les libellés de
> la carte disent « déplacement possible selon le chantier ».

---

## 5 bis. Pourquoi dix-neuf départements et non cinq

Le cadre ne contenait d'abord que la Normandie. Conséquence : l'espace non
couvert par une forme mélangeait **la Manche et l'Oise**, donc impossible de
colorer la mer sans colorer aussi la Picardie. La carte n'avait ni trait de
côte ni contraste figure/fond, et le territoire flottait sur l'ivoire de la
page — le reproche exact du client.

**Tous les départements qui touchent le cadre** sont désormais chargés —
dix-neuf depuis l'élargissement à ±112 km : 14, 27, 28, 53, 59, 60, 61, 62,
72, 75, 76, 77, 78, 80, 91, 92, 93, 94, 95. Toute la terre ferme est couverte ;
ce qui reste est réellement la Manche, et se colore comme telle.

Le filtrage est automatique (`inFrame` dans le script) : changer le cadre
recharge le bon jeu de départements sans intervention.

---

## 6. Le défaut qui ressemblait à une erreur de données

Le reproche « il y a des villes dans la mer » a été signalé deux fois. La
première fois, il était **exact** : Le Havre tombait hors du trait de côte
(§ 4). La seconde fois, il était **faux au sens strict** — le test
point-dans-polygone renvoyait zéro commune hors terre — mais **juste
visuellement** : les étiquettes du Havre, de Fécamp et du Tréport étaient
posées côté large, et une étiquette en mer se lit comme une ville en mer.

D'où la règle inscrite dans `src/lib/map-content.ts` :

> **Une commune littorale porte son étiquette vers l'intérieur des terres.**

Elle prime sur la logique d'azimut. Le Havre en est le cas limite : son
étiquette part vers l'**est** et non vers le sud, parce qu'au sud du Havre il
y a l'estuaire, pas la terre.

C'est la trace d'une méthode, plus que d'un correctif : sur cette carte, ce
que l'œil signale et ce que la donnée dit ne coïncident pas toujours, et les
deux doivent être vérifiés séparément.

---

## 7. Ce qui reste à faire

- [ ] Reporter les attributions **ODbL** (contours IGN) et **Licence Ouverte**
      (communes) dans les mentions légales (phase 18). Natural Earth étant en
      domaine public, la Seine n'impose rien — elle y sera créditée quand même.
- [ ] Vérifier que le découpage administratif n'a pas changé si la carte est
      reprise dans plus d'un an — les fusions de communes sont fréquentes.
- [ ] Facultatif : réduire `departements-france.geojson` aux 19 départements du
      cadre si le poids du dépôt devient gênant. Sans effet sur le site livré.

---

## Retrait des quatre communes littorales

**Demande du client.** Le Havre, Dieppe, Fécamp et Le Tréport sont retirés du
site : de la carte, de la liste des communes, et de leurs pages.

C'est le **premier changement de donnée géographique** depuis la constitution du
registre. Il est consigné ici parce que la règle du projet l'exige : toute
modification des données de la carte doit être justifiée et documentée.

| | Avant | Après |
| --- | --- | --- |
| Communes dans `data/geo/communes.json` | 30 | **26** |
| Repères sur la carte générale | 23 | **19** |
| Pages locales | 23 | **19** |
| Routes statiques du site | 43 | **39** |

### Ce qui n'a pas bougé

`src/lib/map-data.ts` a été **régénéré** par `scripts/build-map-data.mjs`, et le
différentiel se limite aux quatre lignes de `CITIES`. Le trait de côte, les
contours départementaux, la Seine, les 71 communes de la métropole et le cadre
de projection sont **identiques au caractère près**. Le générateur est donc
bien déterministe, ce qui n'avait jamais été vérifié jusqu'ici.

Les quatre communes restent présentes dans les fichiers GeoJSON sources — ce
sont des découpages administratifs complets, pas des listes de communes
retenues. Seul `communes.json`, qui est la liste de travail, a changé.

### Conséquences à connaître

1. **La carte ne touche plus la côte.** La règle « une commune littorale porte
   son étiquette vers l'intérieur des terres » n'a plus d'objet ; elle reste
   consignée dans `map-content.ts` pour le jour où un repère côtier
   reviendrait.
2. **Le groupe « Reste de la Seine-Maritime » ne contient plus qu'Yvetot**, et
   sa description ne dit plus « au littoral ».
3. **Les voisinages ont été recalculés** par distance orthodromique réelle sur
   les 19 communes restantes. Dix pages sur dix-neuf ont changé de voisins.
   Effet de bord assumé : le nord-est du cadre s'étant vidé, les voisins les
   plus proches d'Abbeville et d'Amiens sont désormais à 87 et 96 km.
