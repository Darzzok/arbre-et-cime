# QUOTE_FLOW.md — Configurateur de devis

Spécification du parcours de demande de devis. **Rien n'est développé à ce
stade** : ce document cadre les phases 11 à 13 de `ROADMAP.md`.

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

- Sélection d'une ou plusieurs prestations parmi les 8 de référence (ordre et
  libellés identiques à `src/lib/site.ts`).
- Niveau d'urgence : `urgent (sous 48 h)` / `dans les semaines à venir` /
  `je me renseigne`.
- Type de demandeur : `particulier` / `professionnel` / `collectivité` — oriente
  le ton de la réponse et les pièces attendues.

Champ obligatoire : au moins une prestation.

### Étape 2 — Informations chantier

Ce qui conditionne réellement le devis.

- Nombre d'arbres ou linéaire de haie concerné (fourchettes, pas de précision
  illusoire).
- Hauteur estimée : `< 5 m` / `5 à 10 m` / `10 à 20 m` / `> 20 m` / `je ne sais
  pas`.
- Accès : `facile (véhicule au pied)` / `passage étroit` / `accès uniquement à
  pied` / `nacelle impossible`.
- Environnement : proximité de bâtiments, ligne électrique, voie publique,
  piscine, mitoyenneté.
- Évacuation des déchets souhaitée : oui / non / à voir.
- État de l'arbre si connu : sain, dépérissant, tombé, penché, cassé.

Tous ces champs proposent « je ne sais pas ». **Ne jamais bloquer une demande
parce que le client ignore une donnée technique.**

### Étape 3 — Photos

L'étape qui a le plus de valeur pour le chiffrage.

- Dépôt de **1 à 6 photos**, optionnel mais fortement encouragé, avec l'argument
  affiché : « une photo du pied de l'arbre et une vue d'ensemble permettent un
  devis beaucoup plus précis, et souvent sans visite ».
- Formats acceptés : JPEG, PNG, HEIC, WebP. Taille maximale **10 Mo par
  fichier**, 40 Mo au total.
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
