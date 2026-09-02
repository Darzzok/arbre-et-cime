# SEO_STRATEGY.md — Stratégie SEO locale

Objectif : être une réponse évidente sur les recherches **« élagueur Rouen »** et
leurs variantes, sur la carte comme dans les résultats classiques, puis
transformer ce trafic en demandes de devis.

Principe directeur : **le SEO du site est ancré à Rouen et à la Métropole Rouen
Normandie.** Le rayon de 100 km est une **information commerciale**, affichée et
rassurante, mais il n'est ni un mot-clé cible, ni un prétexte à multiplier des
pages villes.

**État : architecture livrée en phase 3, pages services rédigées en phase 7,
`/a-propos`, `/realisations` puis `/zones-intervention` rédigées ensuite.**
Toutes les pages publiques ont désormais leur contenu, hors configurateur de
devis (phases 11 à 13).

---

## 1. Ce que l'on ne fera pas — `VERROUILLÉ`

- **Aucune génération massive de pages villes.** *Règle amendée en phase 14,
  sur demande explicite du client.* Vingt-trois pages locales existent
  désormais (§ 5 sexies) — mais l'interdiction de fond demeure : **pas de
  gabarit dupliqué avec le nom substitué**. Ce qui la rend tenable, c'est que
  la différenciation n'est plus une intention mais une **mesure** :
  `scripts/check-locations.mjs` échoue si deux pages partagent une phrase
  éditoriale, et le contrôle sur le HTML produit relève **70 à 89 % de phrases
  propres** à chaque page. Le jour où ce chiffre s'effondre, la règle a été
  contournée.
- **Aucune page croisant service et ville.** Pas de `/elagage-rouen`,
  `/abattage-rouen` et consorts : elles n'existeraient que pour les moteurs,
  se cannibaliseraient entre elles et diviseraient l'autorité du site. Une page
  service porte l'intention métier, une page ville l'intention géographique.
- **Aucune page dédiée par prestation secondaire.** Les huit prestations se
  rattachent à quatre pages services (voir § 4) : une prestation secondaire est
  une **section** de sa page parente, jamais une page mince de plus.
- Pas de page « élagage 100 km autour de Rouen » : personne ne cherche cela.
- Pas de contenu rédigé pour le moteur plutôt que pour le client.
- Pas de balisage de données structurées décrivant des faits non vérifiables
  (avis inventés, tarifs fictifs, adresse approximative, zone exagérée).

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

### Longue traîne éditoriale — plus tard

« quand élaguer un arbre en Normandie », « faut-il une autorisation pour abattre
un arbre », « élagage et voisinage : quelles règles », « comment reconnaître un
arbre dangereux ». Ces sujets servent l'autorité et la conversion, pas le
volume.

---

## 3. Architecture de routes — livrée

**Architecture plate.** Toute page publique est fille directe de la racine :
aucune imbrication `/prestations/…`, ce qui raccourcit les URLs, simplifie le
fil d'Ariane (deux niveaux au maximum) et évite une page intermédiaire sans
intention propre.

```
/                              Homepage
/elagage                       Service
/abattage                      Service
/dessouchage                   Service
/entretien-exterieur           Service
/realisations                  Preuve
/zones-intervention            Preuve
/devis                         Conversion
/a-propos                      Entreprise
/contact                       Conversion
/mentions-legales              Légal
/politique-confidentialite     Légal

/style-guide                   INTERNE — noindex, hors sitemap, hors navigation
```

Les slugs sont **sans accent, en minuscules, avec tirets**, et **définitifs** :
les changer plus tard coûterait des redirections inutiles.

> **Source de vérité unique : `src/lib/routes.ts`.** Chemins, libellés de
> navigation, titres, descriptions, intentions, priorités et indexabilité y sont
> déclarés une seule fois. Header, footer, fil d'Ariane, sitemap et métadonnées
> lisent tous ce fichier. **Ne jamais réécrire une URL en dur ailleurs.**

### Intention SEO par route

Une page = une intention. C'est le garde-fou contre la cannibalisation entre
pages services.

| Route | Intention principale |
| --- | --- |
| `/` | élagueur Rouen · élagueur-grimpeur Rouen · élagage Rouen · abattage d'arbres Rouen |
| `/elagage` | élagage Rouen — **tailler un arbre que l'on conserve** |
| `/abattage` | abattage d'arbres Rouen — **supprimer un arbre**, y compris cas difficiles et dangereux |
| `/dessouchage` | dessouchage Rouen — **supprimer la souche** après coupe |
| `/entretien-exterieur` | taille de haies et débroussaillage Rouen — **entretien récurrent d'un terrain** |
| `/realisations` | preuve par l'exemple — faible volume, fort effet sur la conversion |
| `/zones-intervention` | élagueur métropole rouennaise — répondre à « intervenez-vous chez moi ? » |
| `/devis` | devis élagage Rouen — intention commerciale la plus qualifiée |
| `/a-propos` | requêtes de marque et vérification de confiance |
| `/contact` | contact et urgence — intention immédiate, souvent au téléphone |
| pages légales | obligation légale, aucune intention de recherche |

La distinction **conserver / supprimer / dessoucher / entretenir** est ce qui
sépare réellement les quatre pages services. Toute rédaction future doit s'y
tenir : si deux pages répondent à la même question, l'une des deux est en trop.

### Pages locales — au cas par cas, jamais en série

L'architecture **permet** d'ajouter plus tard quelques pages locales, sans en
faire un automatisme :

```
/elagueur/[ville]     ex. /elagueur/mont-saint-aignan
```

Conditions **cumulatives** pour créer une telle page :

1. la commune représente une demande réelle et récurrente ;
2. il existe **au moins trois chantiers réalisés** documentés par des photos ;
3. le contenu est spécifique (essences, contraintes d'accès, réglementation
   locale, quartiers) et **non substituable** — remplacer le nom de la commune
   par un autre doit rendre le texte faux ;
4. le texte utile dépasse 500 mots réellement informatifs.

Candidates plausibles à moyen terme : Mont-Saint-Aignan, Bois-Guillaume,
Sotteville-lès-Rouen, Le Grand-Quevilly, Barentin, Elbeuf. **Aucune n'est créée
tant que les quatre conditions ne sont pas remplies, et elles se créent une par
une, jamais par lot.**

---

## 4. Rattachement des prestations aux pages services

Les huit prestations de référence (`src/lib/site.ts`, liste `VERROUILLÉE`) se
répartissent sur quatre pages :

| Prestation | Page |
| --- | --- |
| Élagage | `/elagage` |
| Abattage | `/abattage` |
| Abattage difficile / dangereux | `/abattage` |
| Dessouchage | `/dessouchage` |
| Débroussaillage | `/entretien-exterieur` |
| Taille de haies | `/entretien-exterieur` |
| Entretien extérieur | `/entretien-exterieur` |
| Évacuation des déchets | **aucune** — prestation complémentaire, présentée selon le chantier |

Ce rattachement est codé dans `servicePageBySlug` (`src/lib/routes.ts`) : il est
vérifié par le typage, une prestation ne peut pas être oubliée.

---

## 5. Gabarit d'une page service — livré en phase 7

**Cinq blocs, pas plus.** Une page service doit se lire, pas s'endurer.

| # | Bloc | Contenu |
| --- | --- | --- |
| 1 | **Hero** | Photographie plein cadre, surtitre, `h1` « Prestation à Rouen », chapô d'une phrase, CTA devis |
| 2 | **Intention** | À quoi sert la prestation, et quand elle ne se justifie pas |
| 3 | **Cas d'intervention** | 4 ou 5 situations concrètes, en panneaux sobres numérotés |
| 4 | **Méthode et sécurité** | Comment on intervient, trois points opérationnels, photographie de détail, plus une précision propre à la prestation |
| 5 | **Conversion** | Repères courts, « Parlons de votre chantier », CTA devis, et les trois autres services |

Le contenu rédactionnel des quatre pages vit dans
**`src/lib/services-content.ts`**, réuni là pour être relu d'un bloc : c'est
le seul moyen de vérifier qu'aucune page n'est la copie d'une autre avec un
mot-clé permuté. La structure, elle, est délibérément commune — c'est ce
qu'attendent les moteurs d'un ensemble de pages sœurs.

**Ce qui n'y figure volontairement pas :**

- **aucun tarif ni fourchette** — impossible à tenir sans voir le chantier ;
- **aucun diagnostic sanitaire** sur `/elagage` : promettre de « sauver » un
  arbre serait une affirmation que rien ne garantit ;
- **aucune technique de dessouchage nommée** tant que le matériel réel du
  client n'est pas confirmé — la page dit que le choix se décide sur place ;
- **aucune dramatisation** sur `/abattage` : la page décrit des situations,
  elle ne fabrique pas de l'urgence.

La FAQ et le détail « ce qui fait varier le devis » restent à écrire quand le
client aura confirmé son matériel et ses cas les plus fréquents.

---

## 5 bis. `/a-propos` — livrée

Six blocs : hero, parcours, qualifications, manière de travailler, zone,
conversion.

**Cette page ne vise pas « élagueur Rouen ».** Son intention déclarée dans
`src/lib/routes.ts` est la marque et la vérification de confiance. Deux pages
qui visent le même mot-clé se cannibalisent, et c'est la page d'accueil qui doit
gagner celui-là. « Rouen » n'apparaît donc que là où c'est factuellement
nécessaire : le chapô et la section zone.

La `description` a été réécrite après confirmation du nom du responsable :

> Arbres et Cimes Élagage, c'est Cédric Simon : élagueur-grimpeur diplômé, une
> dizaine d'années de métier, installé dans la métropole rouennaise depuis 2023.

153 caractères, la marque et la personne en tête — c'est ce que cherche
quelqu'un qui tape le nom de l'entreprise avant d'appeler.

**Maillage sortant :** `/devis` (panneau de conversion), `/zones-intervention`
(section zone), et les quatre pages services en fin de page.

### Pas de schéma `Person`

La page nomme un responsable, ce qui rend `Person` tentant. Il n'est pas émis,
pour la raison du § 7 : un `Person` réduit à un nom et un métier, sans
`LocalBusiness` publiable pour le rattacher — gelé faute de domaine, téléphone,
adresse et SIREN — ne décrit rien d'exploitable. Il n'ajouterait aucun fait
vérifiable, seulement du balisage.

À rouvrir en phase 14, **en même temps que `LocalBusiness`** et pas avant : les
deux n'ont de valeur que liés.

---

## 5 quater. `/realisations` — livrée en phase 9

Quatre blocs : hero compact, collection, lecture des chantiers, conversion.

**La description a été réécrite, l'ancienne était fausse.** Elle annonçait
des « photographies réelles et situées » alors que la photothèque du client
n'est pas livrée. Une description mensongère se paie deux fois : en taux de
rebond, et en crédibilité quand le visiteur s'en aperçoit.

> Élagage, abattage, évacuation : ce que montre un chantier, et ce qui décide
> de la méthode — l'accès, le voisinage, l'état de l'arbre et le volume de
> bois.

**À réécrire une troisième fois** le jour des vraies photographies : elle
pourra alors porter Rouen et la métropole sans mentir.

### Aucune route `/realisations/[slug]`

Tentant, et prématuré. Une page par chantier n'a de valeur que si elle porte
une commune, un contexte et des contraintes réels — sinon c'est exactement la
page mince que le § 1 interdit, multipliée par le nombre de photographies.

Condition de création, le jour venu : un chantier **documenté** (commune,
contexte, contrainte, photographies avant/pendant/après). Une par une, jamais
par lot — même règle que les pages locales.

### Aucune donnée structurée d'image

Ni `ImageObject`, ni `CreativeWork`. Baliser des photographies de banque comme
des réalisations de l'entreprise serait une affirmation non vérifiable, donc
interdite par le § 1. Seul `BreadcrumbList` est émis.

### Maillage

Entrant : la section Réalisations de l'accueil (trois cartes).
Sortant : `/devis` (panneau de conversion) et les quatre pages services.

L'intention reste la **preuve**, pas le volume : cette page ne vise pas
« élagueur Rouen ». Elle sert la conversion du visiteur prévoyant décrit dans
`CONVERSION_STRATEGY.md` § 2, celui qui compare trois à cinq prestataires.

---

## 5 quinquies. `/zones-intervention` — livrée en phase 10

Six blocs : hero clair, carte, zone principale, rayon de 100 km, secteurs,
conversion. Intention inchangée : **répondre à « intervenez-vous chez moi ? »**.

### Ce qui n'a PAS été fait, et c'est le point important

Une page de zone est l'endroit où la tentation du bourrage est la plus forte :
citer cinquante communes coûte cinq minutes et semble gratuit. Ce n'est pas le
cas — c'est la page mince que le § 1 interdit, et elle dilue l'autorité du
site sur ses vraies pages.

Onze communes apparaissent sur la carte, quinze dans le texte des secteurs.
Toutes ont des coordonnées vérifiées, toutes servent à **situer une
distance**. Aucune page locale n'est créée : les quatre conditions cumulatives
du § 3 restent inapplicables tant qu'aucun chantier n'est documenté.

Caen est chargée dans les données mais **jamais affichée** : à 110 km, elle
sort du rayon annoncé.

### Champ lexical, sans forçage

Rouen, métropole rouennaise, Seine-Maritime, zone d'intervention, élagage,
abattage — chacun présent là où il est factuellement nécessaire, jamais
répété mécaniquement. « Rouen » apparaît dans le `h1`, le chapô, les titres de
section et les libellés de la carte, parce que c'est le centre du sujet.

### Aucune donnée structurée de zone

Ni `GeoCircle`, ni `areaServed`, ni `GeoShape`. Ces propriétés appartiennent à
`LocalBusiness`, gelé faute de domaine, téléphone et adresse (§ 7). Émises
seules, elles ne décriraient rien.

**À rouvrir en phase 14, avec `LocalBusiness` :** `areaServed` est justement
le champ qui donnera sa valeur à cette page. Attention à ne pas y déclarer un
`GeoCircle` de 100 km — ce serait affirmer en données structurées exactement ce
que le texte de la page prend soin de ne pas promettre.

### Maillage

Entrant : section Zone de l'accueil, pied de page, navigation principale.
Sortant : `/devis` (deux fois) et les quatre pages services.

---

## 5 sexies. Pages locales — livrées en phase 14

Vingt-trois pages, une par commune affichée sur la carte, sous
`/zones-intervention/[ville]`.

### La règle qui tient l'ensemble

> **Tout point ville public de la carte possède une landing page locale
> correspondante — et réciproquement.**

Cette bijection n'est pas une intention : elle est **vérifiée
automatiquement** par `scripts/check-locations.mjs`, qui rapproche les
repères de `src/lib/map-content.ts` des entrées de
`src/content/locations.ts`. Un point sans page produit un lien mort ; une
page sans point produit une page orpheline. Ni l'un ni l'autre ne fait échouer
un build — d'où le contrôle.

### Source unique

`src/content/locations.ts` fait foi pour la carte, les pages, le hub, le
maillage et le sitemap. Avant la phase 14, la liste des communes existait à
trois endroits et divergeait déjà : Saint-Étienne-du-Rouvray et Elbeuf étaient
cités dans le texte de `/zones-intervention` sans figurer sur la carte.

Coordonnées : centroïdes officiels `geo.api.gouv.fr`. Distances :
**recalculées** par haversine depuis Rouen, jamais recopiées — et toujours
présentées comme des distances **à vol d'oiseau**, jamais routières.

### Trois niveaux, définis par des faits

| Niveau | Règle | Nombre | Discours |
| --- | --- | --- | --- |
| `core` | membre de la Métropole Rouen Normandie | 7 | « zone principale d'intervention » |
| `primary` | ≤ 60 km de Rouen | 9 | « interventions possibles selon le chantier » |
| `extended` | > 60 km de Rouen | 7 | « un déplacement peut être envisagé selon la nature, l'ampleur et l'organisation du chantier » |

L'appartenance à la métropole est une **donnée administrative vérifiable**,
pas une appréciation commerciale. Le seuil de 60 km sépare ensuite ce qui est
à moins d'une heure de ce qui ne l'est pas. Le contrôle automatique recalcule
le niveau de chaque commune et échoue si la donnée et la règle divergent.

**Une page `extended` n'affirme jamais une intervention.** La formulation
est conditionnelle du surtitre (« Déplacement à étudier ») au CTA (« Un
chantier à Amiens ? Parlons-en. »).

### Ce qui n'est jamais écrit sur une page locale

Aucune adresse locale, aucun établissement secondaire, aucun chantier réalisé,
aucun client, aucun quartier desservi, aucune essence d'arbre locale, aucun
délai, aucun règlement municipal, aucune statistique. Le contenu local se
limite à de la **géographie vérifiable** — relief, vallée, plateau, littoral,
département — et à ce qu'elle implique concrètement pour organiser un chantier.

### La FAQ — ajoutée en phase 17B

`/faq` est la seule page du site qui vise la **longue traîne
informationnelle** : « quand élaguer », « faut-il une autorisation pour
abattre », « que devient le bois ». Ces requêtes précèdent la demande de devis
de plusieurs semaines et amènent le premier contact.

Elle porte le balisage **`FAQPage`**, et c'est le seul schéma riche du site
qui **ne dépende d'aucune donnée client en attente** : `LocalBusiness` et
`Service` réclament le domaine, l'adresse et les horaires ; celui-ci ne décrit
que du contenu déjà publié. Il s'active dès que `SITE_INDEXABLE` passe à vrai.

> **Deux questions attendues en sont volontairement absentes.** Aucun tarif
> n'est chiffré — aucun n'a été communiqué — et l'assurance n'est pas
> mentionnée, le client ayant indiqué qu'il n'y avait rien à afficher. Poser
> une question sans pouvoir y répondre serait pire que de ne pas la poser.

### L'invariant du périmètre local — **19**

Le périmètre local est volontairement limité à **19 communes**. Ce n'est pas un
reliquat : c'est une décision produit, prise après la phase 15B.5, qui a retiré
Dieppe, Le Tréport, Fécamp et Le Havre avec leurs pages.

Cinq comptes qui doivent rester égaux :

| | |
| --- | --- |
| Communes dans `src/content/locations.ts` | **19** |
| Slugs uniques | **19** |
| Pages générées par `generateStaticParams` | **19** |
| Liens du hub `/zones-intervention` | **19** |
| Repères de la carte | **19** |

`scripts/qa-villes.mjs` vérifie l'égalité et échoue si l'un des cinq diverge.

> **Ne pas restaurer les communes retirées** — ni dans `locations.ts`, ni dans
> le hub, ni sur la carte, ni dans `generateStaticParams`, ni dans le sitemap,
> ni dans cette documentation.

### Données structurées

**Aucun `LocalBusiness` par commune.** Arbres & Cimes est une entreprise
unique ; déclarer un établissement par commune affirmerait **dix-neuf**
implantations qui n'existent pas. Une page ville décrit une **zone de
service**, pas une agence. Seul un `BreadcrumbList` est émis, et uniquement
quand le site est indexable.

> **Le siège n'est pas à Rouen.** Il est au Grand-Quevilly, confirmé en phase
> 16B. Rouen reste le **cœur du secteur d'intervention**, le centre de la
> projection cartographique et la **cible SEO principale** — mais aucune page
> n'affirme plus d'implantation rouennaise. Les formulations « basée à Rouen »
> et « commune d'attache » ont été corrigées en phase 17. Les expressions de
> service — « élagueur à Rouen », « intervention à Rouen », « secteur de
> Rouen » — restent, elles décrivent un service rendu, pas une adresse.

---

## 6. Métadonnées — livrées

**Fabrique unique : `buildMetadata(routeId)` dans `src/lib/seo.ts`.** Aucune
page ne compose ses métadonnées à la main.

- Titre, description et indexabilité proviennent de `src/lib/routes.ts`.
- Gabarit de titre : `%s | Arbres et Cimes Élagage`. La racine utilise un titre
  `absolute` pour éviter la répétition du nom.
- `title` de page : 55–60 caractères, **la ville dans la première moitié**.
- `description` : 140–155 caractères, un bénéfice concret, « Devis gratuit »
  quand c'est pertinent.
- `alternates.canonical` : URL absolue, sans slash final, une seule variante
  d'hôte. **Omise sur une page `noindex`** — demander à la fois de ne pas
  indexer et de désigner une URL de référence est contradictoire.
- Open Graph et Twitter Card générés depuis les mêmes valeurs.
- Une seule langue : `fr`. Pas de `hreflang`.

### Gestion de l'environnement — jamais de canonical `localhost`

`site.url` (`src/lib/site.ts`) vaut :

| Environnement | `NEXT_PUBLIC_SITE_URL` | `site.url` |
| --- | --- | --- |
| développement | absente | `http://localhost:3000` |
| production | absente ou invalide | **`null`** |
| tous | origine valide | origine normalisée, sans chemin ni slash final |

Quand `site.url` vaut `null`, **aucune URL absolue n'est émise** : ni
`metadataBase`, ni canonique, ni `og:url`, ni JSON-LD, et le sitemap est vide.
Vérifié au build : le HTML de production ne contient alors aucune occurrence de
`localhost`.

### Image Open Graph

`OG_IMAGE` dans `src/lib/seo.ts` vaut **`null`** tant que la photothèque client
n'est pas livrée : la charte impose une photographie réelle, et une balise
`og:image` pointant vers un fichier absent est pire que son absence. Déposer la
photo (1200 × 630) dans `public/og/` et renseigner l'objet suffit à l'activer
sur toutes les pages.

---

## 7. Données structurées (JSON-LD)

Architecture dans `src/lib/structured-data.ts`, rendu par
`<JsonLd>` (`src/components/seo/json-ld.tsx`).

**Principe : on ne balise que des faits vérifiés.** Chaque fabrique retourne
`null` tant qu'une donnée indispensable manque, et `<JsonLd>` ne rend alors
rien. Aucune valeur de remplissage n'est jamais émise.

| Schéma | État | Conditions de déblocage |
| --- | --- | --- |
| `BreadcrumbList` | **actif** sur les pages internes | ne dépend que des routes et de `NEXT_PUBLIC_SITE_URL` |
| `LocalBusiness` / `HomeAndConstructionBusiness` | **gelé** | domaine, téléphone, e-mail, adresse **ou** choix explicite d'une zone de service seule, horaires, raison sociale et SIREN |
| `Service` | **gelé** | dépend de `LocalBusiness` : un service sans fournisseur identifié n'a aucune valeur |
| `FAQPage` | à venir | une FAQ réelle publiée sur la page |
| `AggregateRating` / `Review` | à venir | des avis **authentiques et affichés**. Jamais autrement. |

La liste des données manquantes est retournée par `missingLocalBusinessData()` :
c'est la check-list de la phase 14.

---

## 8. SEO technique — livré

- **`src/app/sitemap.ts`** — généré depuis `sitemapRoutes`. Une route y figure
  seulement si elle est publique, indexable et marquée `inSitemap` :
  `/style-guide` en est exclue **automatiquement**, sans exception codée en dur.
  `lastModified` est volontairement omis (un `lastmod` égal à la date du build
  affirmerait que tout change à chaque déploiement, et serait ignoré).
- **`src/app/robots.ts`** — `Allow: /`, plus les lignes `Host` et `Sitemap`
  **seulement** si une origine publique valide existe.
  `/style-guide` n'y est **pas** interdite, volontairement : une page bloquée au
  crawl ne peut pas être lue, donc son `noindex` ne serait jamais vu et l'URL
  pourrait rester indexée sans description. Elle est laissée explorable et
  repose sur sa balise `noindex, nofollow`, qui désindexe réellement.
- HTML statique par défaut : **toutes les routes sont pré-rendues**.
- Une seule variante d'hôte (redirection `www` ↔ apex à décider une fois pour
  toutes, phase 18).
- Images `next/image`, dimensions explicites, `alt` rédigé, pas de CLS.
- Structure sémantique : un seul `h1` par page, hiérarchie continue, `main`
  unique, `<section>` nommée via `aria-labelledby`.
- Cœur des Web Vitals : cibles définies en phase 15.

### Garde-fou de préproduction — `NEXT_PUBLIC_SITE_INDEXABLE`

Le site est **déployé publiquement avant d'avoir son contenu définitif**. Sans
protection, douze pages d'attente entreraient dans l'index, ce qui nuirait
durablement au domaine — et une page une fois indexée met du temps à en sortir.

Un interrupteur global gouverne donc toute l'indexation, centralisé dans
`SITE_INDEXABLE` (`src/lib/seo.ts`). **Aucune page ne porte de condition.**

Il ne vaut `true` que si `NEXT_PUBLIC_SITE_INDEXABLE` est **exactement**
`"true"` (espaces de bord ignorés). Toute autre valeur — absente, vide,
`"false"`, `"1"`, `"TRUE"` — laisse le site protégé : **le défaut est le
comportement sûr**, et une faute de frappe ne peut pas ouvrir l'indexation par
accident.

| | Site **non indexable** (défaut) | Site **indexable** (`"true"`) |
| --- | --- | --- |
| Routes publiques | `noindex, follow` | `index, follow` + `max-image-preview:large` |
| `/style-guide` | `noindex, nofollow, nocache` | `noindex, nofollow, nocache` |
| `canonical` | **aucune** | URL absolue |
| `og:url` | **aucune** | URL absolue |
| `sitemap.xml` | vide | 12 URLs |
| `robots.txt` | `Allow: /`, sans ligne `Sitemap` | `Allow: /` + `Host` + `Sitemap` |
| JSON-LD | aucun | `BreadcrumbList` |

Trois choix méritent d'être explicités :

- **`noindex, follow`, pas `nofollow`.** Les pages restent explorées et les
  liens internes suivis : la structure du site continue d'être comprise, mais
  rien n'entre dans l'index. Le jour du lancement, le maillage est déjà connu.
- **Aucune `canonical` tant que le site n'est pas indexable.** Elle désignerait
  l'URL de préproduction Vercel, qui n'est pas l'adresse définitive du site.
- **`robots.txt` n'interdit rien**, même en préproduction. C'est le point le
  plus contre-intuitif : un `Disallow: /` empêcherait les moteurs de **lire**
  les balises `noindex`, et des URLs pourraient rester indexées sans
  description, sans moyen simple de les faire disparaître. Laisser explorer et
  répondre `noindex` est la seule combinaison qui désindexe réellement.

**À basculer une seule fois, au lancement définitif (phase 18).** Le garde-fou
est indépendant du champ `noindex` de `src/lib/routes.ts`, qui reste disponible
pour exclure une route en particulier : une route est indexable si le site l'est
**et** si elle ne se déclare pas `noindex`.

---

## 9. SEO local hors site — déterminant

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

## 9 bis. Google Business Profile — check-list de lancement

À dérouler avec le client au lancement (phase 18). Rien ne peut être fait
avant : la fiche exige une adresse, un téléphone et un domaine, dont aucun
n'est confirmé à ce jour.

| # | Étape | Précision |
| --- | --- | --- |
| 1 | Créer la fiche | Compte Google dédié à l'entreprise, pas un compte personnel |
| 2 | Vérifier l'établissement | Par courrier ou téléphone selon ce que Google propose |
| 3 | **Catégorie principale** | « Service d'élagage » — une seule, la plus précise |
| 4 | Catégories secondaires | « Entreprise d'aménagement paysager », « Service de jardinage ». Ne pas en empiler : chaque catégorie hors métier dilue la principale |
| 5 | **Zone desservie** | Rouen + communes de la métropole. **Ne pas déclarer 100 km** : une zone exagérée dégrade la pertinence locale |
| 6 | Adresse | Masquée si l'activité se fait chez le client — un élagueur n'accueille pas de public |
| 7 | Prestations | Les 8 de `src/lib/site.ts`, mêmes intitulés que le site |
| 8 | Horaires | Réels. Mieux vaut pas d'horaires que des horaires faux |
| 9 | Téléphone | **Identique au site au caractère près** (cohérence NAP) |
| 10 | Site web | Domaine définitif, jamais l'URL de préproduction |
| 11 | Photos | Photographies réelles récentes : chantiers, matériel, véhicule. Aucune image générée |
| 12 | Description | Reprendre le positionnement de `PROJECT.md`, sans bourrage de mots-clés |
| 13 | Avis | Sollicitation systématique après chantier, réponse à chacun. Levier le plus rentable du projet |
| 14 | **Search Console** | Propriété par domaine, validation DNS |
| 15 | **Sitemap** | Soumettre `/sitemap.xml` — seulement après bascule de `NEXT_PUBLIC_SITE_INDEXABLE` |
| 16 | Bing Webmaster Tools | Import depuis Search Console, coût nul |

---

## 9 ter. Check-list de passage en production

Dans cet ordre. Les trois premières lignes conditionnent toutes les autres.

| # | Contrôle | État |
| --- | --- | --- |
| 1 | Domaine définitif acquis et pointé | ⬜ client |
| 2 | `NEXT_PUBLIC_SITE_URL` renseignée en production | ⬜ |
| 3 | `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_PHONE_DISPLAY`, `NEXT_PUBLIC_EMAIL` renseignées | ⬜ client |
| 4 | Raison sociale, SIREN, assurance, mentions légales complétées | ⬜ client |
| 5 | Photothèque réelle livrée et intégrée | ⬜ client |
| 6 | Image Open Graph déposée (`OG_IMAGE` dans `src/lib/seo.ts`) | ⬜ |
| 7 | `localBusinessSchema()` débloqué — `missingLocalBusinessData()` renvoie une liste vide | ⬜ |
| 8 | Endpoint d'envoi du devis opérationnel (phase 13) | ⬜ |
| 9 | **`NEXT_PUBLIC_SITE_INDEXABLE="true"`** — une seule fois, en dernier | ⬜ |
| 10 | Vérifier : canoniques présentes, `robots` en `index, follow`, sitemap non vide | ⬜ |
| 11 | Vérifier : aucune occurrence de `localhost` ni de `vercel.app` dans le HTML | ⬜ |
| 12 | Soumettre le sitemap à Search Console | ⬜ |

> **La ligne 9 est la dernière.** Basculer l'indexation avant que les lignes 1
> à 8 soient faites ferait entrer dans l'index des pages au contenu d'attente,
> avec un coût durable sur le domaine.

---

## 10. Mesure

- Google Search Console : positions sur les requêtes « + Rouen », pages
  d'entrée, couverture.
- Google Business Profile Insights : appels, itinéraires, vues.
- Analytics respectueux de la vie privée (cf. `CONVERSION_STRATEGY.md`) :
  conversions `tel:` et devis, par page d'entrée.
- Revue mensuelle : positions cœur, volume de demandes de devis, part mobile.
