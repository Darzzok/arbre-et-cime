# QUOTE_FLOW.md — Configurateur de devis

Spécification du parcours de demande de devis. **L'interface est livrée en
phase 11** ; l'envoi et le stockage restent à faire (phases 12 et 13). Ce que
la phase 11 fait réellement, et ce qu'elle simule, est détaillé au § 6.

Périmètre `VERROUILLÉ` : **5 étapes, dans cet ordre.** Aucune étape ajoutée,
retirée ou réordonnée sans demande explicite du client.

---

## 1. Principes

- Le configurateur **ne calcule aucun prix**. Un chiffrage d'élagage dépend de
  l'accès, de la hauteur, de l'essence, de l'état de l'arbre et de l'évacuation :
  un prix automatique serait faux, décevrait le client et abîmerait la crédibilité
  de l'entreprise. Le configurateur **qualifie** la demande pour qu'Arbre et Cime
  chiffre vite et juste.
- Une décision par étape. Effort croissant, coordonnées en dernier.
- Rien n'est perdu : retour arrière libre, saisie conservée.
- Fonctionne sans JavaScript exotique, au clavier, au lecteur d'écran.
- Conçu à 390 px d'abord.

---

## 2. Les 5 étapes — `VERROUILLÉ`

### Étape 1 — Besoin

Ce que le client veut faire faire.

**Un seul choix, parmi cinq** — les quatre pages services plus une sortie :

| Choix | Correspondance |
| --- | --- |
| Élagage | page `/elagage` |
| Abattage | page `/abattage` |
| Dessouchage | page `/dessouchage` |
| Entretien extérieur | page `/entretien-exterieur` |
| Je ne sais pas encore | aucune — la qualification se fera au rappel |

Champ obligatoire : une intervention.

> **Écart assumé avec la spécification initiale**, sur demande explicite du
> client au brief de phase 11. La version d'origine prévoyait une sélection
> multiple parmi les **8 prestations**, plus un niveau d'urgence et un type de
> demandeur. Trois questions à la première étape, dont deux sans effet sur le
> chiffrage : c'est le meilleur moyen de perdre quelqu'un avant l'étape 2. Les
> quatre prestations secondaires (abattage difficile, débroussaillage, taille
> de haies, évacuation) sont couvertes par leur page parente, exactement comme
> dans la navigation. L'urgence et le type de demandeur se lisent dans le champ
> « Précisions » de l'étape 5, ou se demandent au rappel.

### Étape 2 — Informations chantier

Ce qui conditionne réellement le devis. **Trois questions, pas six.**

| Question | Réponses | Posée quand |
| --- | --- | --- |
| Ampleur | 1 · 2 à 3 · 4 à 10 · plus de 10 | toujours |
| Hauteur | < 5 m · 5-10 m · 10-20 m · > 20 m · je ne sais pas | seulement si la hauteur existe |
| Contraintes | accès difficile · proche d'une habitation · proche d'une route · proximité de câbles · aucune · autre | toujours, choix multiple |

**Deux adaptations, et deux seulement** (`src/lib/quote/`) :

- l'intitulé de l'ampleur suit le besoin — « combien d'arbres », « combien de
  souches » — et pour l'entretien extérieur l'échelle change (« une haie »,
  « un terrain entier ») : on ne compte pas une haie en unités ;
- **la hauteur disparaît** pour le dessouchage et l'entretien extérieur. Une
  souche n'a pas de hauteur ; poser la question produirait une donnée vide et
  donnerait au parcours l'air d'un formulaire générique.

Multiplier l'adaptativité au-delà rendrait le parcours imprévisible : deux
personnes ne verraient plus le même nombre d'écrans sans comprendre pourquoi.

« Aucune de ces situations » est **exclusive dans les deux sens** : la cocher
vide les autres, en cocher une autre la retire.

La hauteur propose « je ne sais pas ». **Ne jamais bloquer une demande parce
que le client ignore une donnée technique.**

### Étape 3 — Photos

L'étape qui a le plus de valeur pour le chiffrage.

- Dépôt de **1 à 5 photos**, optionnel mais fortement encouragé, avec
  l'argument affiché : « une vue d'ensemble et une photo du pied de l'arbre
  suffisent souvent ». Plafond ramené de 6 à 5 au brief de phase 11.
- Formats acceptés : JPEG, PNG, HEIC, WebP. Taille maximale **10 Mo par
  fichier**.
- Compression et redimensionnement **côté client** avant envoi (côté long max
  2000 px), pour tenir sur une connexion mobile.
- Prévisualisation avec suppression individuelle, indicateur de progression,
  message d'erreur explicite si un fichier est refusé.
- Zone de dépôt utilisable au clic **et** au clavier ; sur mobile, accès direct
  à l'appareil photo.

### Étape 4 — Lieu

Où se trouve le chantier.

- Code postal + commune (obligatoires).
- Adresse précise : optionnelle à ce stade, demandée à la prise de rendez-vous.
- Retour immédiat sur la zone : commune de la métropole rouennaise, ou dans le
  rayon d'intervention, ou hors zone habituelle — dans ce dernier cas le
  message reste **ouvert** (« déplacement possible selon le chantier, contactez-
  nous ») et n'empêche jamais l'envoi.

### Étape 5 — Coordonnées

- Nom (obligatoire).
- Téléphone (obligatoire, `inputmode="tel"`) — canal de rappel principal.
- E-mail (obligatoire, `inputmode="email"`).
- Créneau de rappel préféré (optionnel).
- Message libre (optionnel).
- Case de consentement explicite à l'utilisation des données pour traiter la
  demande, avec lien vers la politique de confidentialité.

Avant l'envoi : **récapitulatif complet**, éditable étape par étape.

---

## 3. Après l'envoi

- Écran de confirmation : rappel de ce qui a été envoyé, délai de réponse
  annoncé, et le numéro de téléphone pour les cas urgents.
- **Un seul e-mail**, à l'entreprise : récapitulatif structuré, photos en
  pièces jointes, et **`reply-to` positionné sur l'e-mail du client** pour
  répondre en un clic.

> **Ni numéro de demande, ni accusé de réception au prospect.** Les deux
> supposaient un stockage permanent des demandes — un numéro ne sert à rien
> s'il ne désigne rien de consultable, et un accusé automatique ajoute un
> second envoi, donc un second point de panne, pour une information que
> l'écran de confirmation donne déjà. L'architecture arrêtée n'enregistre
> aucune demande : l'e-mail **est** l'enregistrement.

---

## 4. Technique (phases 11 à 13)

### État et navigation

- Composant client isolé sous `src/components/quote/`.
- État local typé, une seule source de vérité, validation par étape.
- Étape reflétée dans l'URL (`?etape=2`) pour supporter le bouton retour du
  navigateur et la mesure d'abandon.
- Persistance en `sessionStorage` pour survivre à un rechargement accidentel —
  **jamais de photo stockée dans le navigateur**, seulement les champs texte.

### Validation

- Schéma de validation partagé client et serveur ; le serveur revalide toujours,
  sans exception.
- Validation d'une étape au passage à la suivante, pas à chaque frappe.
- Erreurs textuelles explicites sous le champ, plus un récapitulatif en tête de
  formulaire annoncé via `aria-live`.

### Envoi — architecture VERROUILLÉE

```
Next.js (statique)
  └── multipart/form-data
        └── endpoint PHP (Hostinger)
              ├── validation serveur
              ├── envoi SMTP
              └── suppression des fichiers temporaires
```

- **Un endpoint PHP hébergé sur Hostinger**, et non une route Next.js. Le site
  est intégralement pré-rendu en statique ; lui ajouter un runtime Node
  imposerait un hébergement applicatif pour une seule fonction. PHP est déjà
  disponible sur l'hébergement retenu.
- **Destinataire unique**, l'adresse de l'entreprise. Elle ne s'écrit pas en
  dur : elle vit dans la configuration du serveur, jamais dans le dépôt.
- Vérification serveur : type MIME réel, taille, nombre de fichiers.
- Limitation de débit et champ piège (honeypot) + délai minimal de
  remplissage ; ajouter un captcha seulement si le spam devient réel.
- **Aucun stockage.** Les photos transitent par le répertoire temporaire de
  PHP, sont contrôlées, jointes à l'e-mail, puis **supprimées**. Ni base de
  données, ni stockage objet, ni liens signés — rien à sécuriser dans la durée,
  rien à purger plus tard, rien à déclarer.
- Aucune clé côté client : `NEXT_PUBLIC_*` ne contient jamais de secret.

> **Rien n'est configurable aujourd'hui.** Le site n'est ni hébergé sur
> Hostinger ni rattaché à un domaine : aucun SMTP réel ne doit être renseigné
> avant que ces deux points soient réglés.

### Accessibilité

- Chaque étape est un `form` avec `fieldset`/`legend`.
- Progression annoncée textuellement (« Étape 3 sur 5 — Photos »), pas seulement
  par une barre colorée.
- Focus déplacé sur le titre de l'étape à chaque changement.
- Aucun piège au clavier, aucune dépendance au survol.

### Données personnelles

- Collecte minimale, finalité unique : établir un devis.
- Durée de conservation définie et documentée dans la politique de
  confidentialité.
- Pas de transmission à des tiers, hors prestataires techniques d'envoi et de
  stockage.
- Aucune donnée personnelle en paramètre d'URL.

---

## 5. Critères d'acceptation

1. Parcours complet réalisable à 390 px, en une main, au pouce.
2. Parcours complet réalisable au clavier seul et au lecteur d'écran.
3. Retour arrière sans perte de données saisies.
4. Envoi réussi avec **5 photos** sur connexion 4G lente.
5. Échec réseau : message clair et données conservées pour réessayer.
6. **Aucune demande perdue silencieusement.** Ce critère devient le plus
   important de la liste : l'architecture ne conservant rien, un e-mail qui
   part en erreur est une demande définitivement perdue. Toute erreur
   d'envoi doit être signalée à l'utilisateur, avec le numéro de téléphone en
   repli — jamais un échec silencieux.
7. Les six événements de mesure de `CONVERSION_STRATEGY.md` sont émis.

---

## 6. Modèle de données — phase 12

### Le chantier est une union discriminée

La phase 11 modélisait le chantier à plat : `nombre`, `hauteur`,
`contraintes`. Suffisant pour deux prestations, intenable pour cinq — il aurait
fallu ajouter `travaux`, `ampleur`, `taille`, `description`, tous facultatifs
et vides la plupart du temps. Un modèle où six champs sur huit sont vides ne
dit plus rien de ce qu'il représente, et le compilateur n'y interdit plus rien.

```ts
type Chantier =
  | { kind: "arbre";     contraintes; nombre; hauteur }
  | { kind: "souche";    contraintes; nombre; taille }
  | { kind: "exterieur"; contraintes; travaux[]; ampleur }
  | { kind: "inconnu";   contraintes; description }
```

**Lire `hauteur` sur un dessouchage est désormais une erreur de compilation**,
pas un bug découvert en recette. La règle « une souche n'a pas de hauteur » est
portée par le type.

Les **contraintes sont sur la base commune** : un accès difficile conditionne
le chiffrage quelle que soit la prestation, et les porter sur chaque variante
les ferait perdre au changement de service.

### Logique conditionnelle par prestation

| Besoin | `kind` | Questions |
| --- | --- | --- |
| Élagage, Abattage | `arbre` | nombre d'arbres · hauteur · contraintes |
| Dessouchage | `souche` | nombre de souches · **taille** · contraintes |
| Entretien extérieur | `exterieur` | travaux (multiple) · ampleur · contraintes |
| Je ne sais pas | `inconnu` | description libre, **rien d'obligatoire** |

La **hauteur ne s'affiche que pour un arbre**. La **taille de souche** est
décrite par des repères du quotidien — « comme une assiette », « comme un
couvercle de poubelle » — jamais en centimètres : un particulier ne mesure pas
un diamètre, et un devis n'en a pas besoin à ce stade.

Le parcours « je ne sais pas » ne valide **rien** : quelqu'un qui ne sait pas
nommer l'intervention ne saura pas davantage estimer une hauteur.

### Ce qui est conservé quand le besoin change

Seul ce qui devient réellement invalide est nettoyé :

| Transition | Conservé | Perdu |
| --- | --- | --- |
| élagage ↔ abattage | tout | rien |
| arbre → souche | contraintes, nombre | hauteur |
| souche → arbre | contraintes, nombre | taille |
| arbre/souche → extérieur | contraintes | nombre, hauteur/taille |
| vers « je ne sais pas » | contraintes | le reste |

*Vérifié à l'exécution* : arbre → souche conserve « 4 à 10 » et « accès
difficile » et vide la hauteur ; élagage → abattage ne perd rien.

---

## 7. Persistance — arbitrage

**`sessionStorage`, et non `localStorage`.** Les deux survivent à un F5 ; ils
diffèrent sur ce qui vient après.

| | `sessionStorage` | `localStorage` |
| --- | --- | --- |
| Survit à un rechargement | oui | oui |
| Survit à la fermeture de l'onglet | **non** | oui |
| Durée de vie | l'onglet | des mois |

Le besoin réel est le **rechargement accidentel pendant les deux minutes du
parcours**. `sessionStorage` le couvre entièrement ; `localStorage` ne
couvrirait rien de plus d'utile mais laisserait un devis à moitié rempli sur la
machine pendant des mois — poste partagé, ordinateur familial, ordinateur
professionnel.

### Ce qui est délibérément exclu du stockage

- **nom, téléphone, e-mail, commentaire, adresse précise** — données
  personnelles. Elles sont saisies à la toute fin ; les stocker ferait courir
  un risque réel pour un gain quasi nul, la ressaisie prenant vingt secondes.
- **le consentement** — un accord se redonne, il ne se restaure pas.
- **les photos** — ni fichier, ni base64. Seul leur **nombre** est retenu, pour
  pouvoir dire « vos photos sont à rajouter ».

*Vérifié à l'exécution* : l'enregistrement pèse **212 octets** et ne contient
que `besoin`, `chantier`, `codePostal`, `ville`, `stepIndex`, `furthest`,
`photoCount` et un numéro de version. Aucune trace du nom, du téléphone, de
l'e-mail ni du commentaire saisis juste avant.

### Après un rechargement

L'étape et les réponses compatibles sont **restaurées automatiquement** — ce
qui n'était pas acceptable en phase 11, où le stockage contenait des
coordonnées, et qui l'est maintenant qu'il n'en contient plus. Un bandeau
discret signale que les photos sont à rajouter. « Nouvelle demande » efface
tout.

---

## 8. Zone d'intervention — aucune déduction

Une version précédente affichait « ce secteur est dans le rayon » en lisant les
deux premiers chiffres du code postal. C'était une **approximation présentée
comme un fait** : un département n'est ni un rayon, ni une zone desservie.

Le message est désormais le même pour tout le monde, et il est vrai :

> La zone exacte sera confirmée lors de l'étude de votre demande.

---

## 9. État d'avancement — après la phase 12

La phase 11 livre **l'interface et rien d'autre**. Ce tableau fait foi.

### Fonctionne réellement, en local

| Ce qui marche | Où |
| --- | --- |
| Les 5 étapes, navigation avant / arrière | `quote-configurator.tsx` |
| Validation par étape, messages sous les champs | `src/lib/quote/` — `validateStep()` |
| Conservation de la saisie au retour arrière | état React, une seule source de vérité |
| Questions conditionnelles par prestation | `src/lib/quote/conditional.ts` |
| Nettoyage sélectif au changement de besoin | `changeNeed()` |
| Refus de doublon photo (nom + taille + date) | `use-quote-state.ts` |
| Reprise automatique après rechargement | `src/lib/quote/persistence.ts` |
| Événements de conversion (inertes) | `src/lib/quote/events.ts` |
| Étape reflétée dans l'URL (`?etape=3`), bouton « précédent » du navigateur | `history.pushState` + `popstate` |
| Reprise d'un brouillon après rechargement | `sessionStorage`, **sur proposition explicite** |
| Ajout, aperçu et suppression de photos | `photo-picker.tsx` — `URL.createObjectURL` |
| Refus motivé : format, poids, nombre | `isAcceptedPhoto()`, `MAX_PHOTO_BYTES`, `MAX_PHOTOS` |
| Retour de zone à partir du code postal | `zoneNoteFor()` |
| Récapitulatif éditable avant envoi | `quote-summary.tsx`, dans l'étape 5 |

### Fin de parcours — séquence puis récapitulatif

Le bouton « Envoyer ma demande » déclenche une **séquence de préparation**
(~1,8 s), puis le **récapitulatif complet**.

La séquence coche trois lignes, et **les trois sont vraies** : les
informations sont réellement validées, le récapitulatif réellement construit,
les photos réellement préparées en mémoire. L'anneau se remplit une fois et
s'arrête — ce n'est pas un *spinner* : un spinner tourne indéfiniment et ne
dit rien du temps restant.

Elle annonce **« Votre demande est prête »**, jamais « envoyée ». Quand l'envoi
arrivera en phase 12, la même séquence portera une quatrième ligne — « demande
transmise » — et ce sera vrai aussi.

Le récapitulatif reprend **tout** : intervention, chantier, lieu, coordonnées,
précisions, et les **vignettes des photos** (montrées, pas comptées — c'est la
pièce qui a demandé le plus d'effort). Il porte le statut réel en clair, et un
bouton « Modifier ma demande » qui ramène à l'étape 1 sans rien perdre.

Sous `prefers-reduced-motion`, la séquence est **entièrement sautée** : une
animation d'attente est exactement ce que ce réglage demande d'éviter.

### Volontairement simulé

**Le bouton « Envoyer ma demande » n'envoie rien.** Il valide, purge le
brouillon, et affiche un écran qui dit explicitement que la demande **n'a pas
été envoyée**, avec un moyen de contact réel.

Ce choix n'est pas de la prudence de développeur : le site est déployé
publiquement avec un contenu d'attente (`CLAUDE.md` § 10). Un visiteur réel
qui remplirait ce formulaire et lirait « votre demande a bien été envoyée »
attendrait un rappel qui ne viendrait jamais. Une confirmation fabriquée est
un mensonge affiché, pas un placeholder.

### Phase 13 — envoi vers un endpoint PHP

- `fetch` en **`multipart/form-data`** vers l'endpoint PHP, avec indicateur de
  progression. Le point de branchement est unique : le bloc final de
  `submit()` dans `use-quote-state.ts`.
- **Revalidation côté PHP** de toutes les règles de `validateStep()`. Elles
  seront réécrites en PHP : le langage change, pas les règles. C'est
  `src/lib/quote/validation.ts` qui fait foi, et toute évolution doit être
  reportée des deux côtés — c'est le prix de l'architecture retenue, et il est
  assumé.
- Écran de confirmation réel : rappel de l'envoi et délai annoncé. **Pas de
  numéro de demande** — il ne désignerait rien.
- **Un seul e-mail**, à l'entreprise, avec `reply-to` sur l'adresse du client.
- Honeypot, délai minimal de remplissage, limitation de débit.

### Phase 13 — photos

- Compression et redimensionnement **côté client** avant envoi (côté long max
  2000 px). Non fait avant : sans destination, compresser ne sert à rien.
- Côté PHP : contrôle du type MIME **réel** (pas de l'extension déclarée), de
  la taille et du nombre, puis **pièces jointes à l'e-mail**.
- **Suppression des fichiers temporaires après traitement.** Aucune photo n'est
  conservée sur le serveur, à aucun moment au-delà de l'envoi.

### Ce que la phase 11 ne persiste jamais

- **Aucune photo**, sous aucune forme — ni fichier, ni base64. Une seule photo
  de téléphone saturerait le quota de `sessionStorage`, et conserver l'image
  d'un domicile dans le navigateur n'a aucune justification.
- **Rien dans `localStorage`.** Le brouillon vit le temps de l'onglet : un
  devis à moitié rempli retrouvé trois semaines plus tard n'aide personne, et
  fait traîner des coordonnées sur un poste peut-être partagé.
- Le brouillon est **purgé** à la fin du parcours, et sur « Recommencer ».
- Aucune donnée personnelle en paramètre d'URL — seul le numéro d'étape y
  figure.
