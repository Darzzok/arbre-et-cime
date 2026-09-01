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

**Deux adaptations, et deux seulement** (`quote-flow.ts`) :

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

- Écran de confirmation avec numéro de demande, rappel de ce qui a été envoyé,
  délai de réponse annoncé, et le numéro de téléphone pour les cas urgents.
- E-mail de confirmation au client (accusé de réception).
- E-mail de notification à l'entreprise : récapitulatif structuré, photos en
  pièces jointes ou liens, et **`reply-to` positionné sur l'e-mail du client**
  pour répondre en un clic.

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

### Envoi et stockage

- Route Handler `POST /api/devis` (Node runtime, jamais mis en cache).
- Vérification serveur : type MIME réel, taille, nombre de fichiers.
- Limitation de débit par IP et champ piège (honeypot) + délai minimal de
  remplissage ; ajouter un captcha (Turnstile) seulement si le spam devient
  réel.
- Photos envoyées vers un stockage objet privé ; l'entreprise reçoit des liens
  signés à durée limitée.
- Aucune clé côté client : `NEXT_PUBLIC_*` ne contient jamais de secret.

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
4. Envoi réussi avec 6 photos sur connexion 4G lente.
5. Échec réseau : message clair et données conservées pour réessayer.
6. Aucune demande perdue silencieusement : toute erreur serveur est journalisée
   et signalée à l'utilisateur.
7. Les six événements de mesure de `CONVERSION_STRATEGY.md` sont émis.

---

## 6. État d'avancement — après la phase 11

La phase 11 livre **l'interface et rien d'autre**. Ce tableau fait foi.

### Fonctionne réellement, en local

| Ce qui marche | Où |
| --- | --- |
| Les 5 étapes, navigation avant / arrière | `quote-configurator.tsx` |
| Validation par étape, messages sous les champs | `quote-flow.ts` — `validateStep()` |
| Conservation de la saisie au retour arrière | état React, une seule source de vérité |
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

### Phase 12 — envoi

- Route Handler `POST /api/devis`, runtime Node, jamais mis en cache.
- Revalidation serveur avec **le même `validateStep()`** — c'est la raison pour
  laquelle `quote-flow.ts` ne contient aucun JSX et n'est pas un module client.
- Écran de confirmation réel : numéro de demande, rappel de l'envoi, délai
  annoncé.
- E-mail d'accusé au client, e-mail de notification à l'entreprise avec
  `reply-to` sur l'adresse du client.
- Honeypot, délai minimal de remplissage, limitation par IP.

### Phase 13 — photos et stockage

- Compression et redimensionnement **côté client** avant envoi (côté long max
  2000 px). Non fait en phase 11 : sans destination, compresser ne sert à rien.
- Envoi multipart avec indicateur de progression par fichier.
- Stockage objet privé, liens signés à durée limitée pour l'entreprise.
- Vérification serveur du type MIME **réel**, pas de l'extension déclarée.

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
