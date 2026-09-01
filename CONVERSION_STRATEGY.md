# CONVERSION_STRATEGY.md — Stratégie de conversion

Le site a **un seul objectif** : transformer un visiteur en demande de devis
qualifiée. Tout le reste est secondaire.

---

## 1. Actions mesurées

| Rang | Action | Pourquoi |
| --- | --- | --- |
| 1 | **Appel téléphonique** (`tel:`) | Le canal le plus rentable en dépannage local, surtout en urgence. Conversion immédiate. |
| 2 | **Demande de devis complétée** (configurateur 5 étapes) | Demande qualifiée, photos jointes, chiffrage plus rapide. Convient aux visites hors horaires. |
| 3 | Envoi d'un e-mail / contact simple | Repli. |

Micro-conversions suivies : ouverture du configurateur, passage d'une étape,
ajout d'une photo, consultation d'une page prestation, consultation de la zone
d'intervention.

---

## 2. Comprendre le visiteur

Trois profils, trois urgences différentes :

- **L'urgent** — arbre tombé, branche menaçante, tempête. Il veut un numéro,
  tout de suite. Il ne lit pas. → L'appel doit être visible sans défiler, sur
  toutes les pages, et l'argument « intervention rapide / urgences » doit être
  lisible dans le premier écran.
- **Le prévoyant** — élagage de saison, haie, entretien. Il compare 3 à 5
  prestataires. Il veut de la preuve, de la méthode, un prix d'ordre de
  grandeur. → Preuves, réalisations, pages services, configurateur.
- **Le professionnel ou la collectivité** — copropriété, gestionnaire, mairie.
  Il veut du sérieux administratif : qualifications, assurances, capacité,
  propreté du chantier. → Section « Pourquoi Arbre et Cime », mentions de
  qualifications, références professionnelles.

Le site sert les trois sans se disperser : l'urgent est servi par le châssis
(appel omniprésent), les deux autres par le contenu.

---

## 3. Hiérarchie des CTA

- **Un seul CTA primaire par écran visible.** Le jaune sécurité rempli est
  réservé à cela.
- **« Appeler » et « Devis gratuit » vont toujours ensemble** dans le hero et
  dans la barre d'action mobile. L'un ne remplace pas l'autre.
- Libellés explicites et orientés bénéfice : « Demander un devis gratuit »,
  « Appeler maintenant », « Envoyer mes photos ». Jamais « En savoir plus »
  seul, jamais « Cliquez ici ».
- Le numéro de téléphone est **toujours un lien `tel:`**, jamais une image ni du
  texte brut.
- Chaque page prestation se termine par un bloc de conversion : appel + devis,
  avec un rappel de la zone.

---

## 4. Leviers de confiance, dans l'ordre d'apparition

1. **Photo réelle du grimpeur en action** dès le hero — preuve implicite la plus
   forte du métier.
2. **Preuves (section 2 de la homepage)** : ~10 ans d'expérience, CS Taille et
   soins des arbres, BP Paysagiste, travail sécurisé, chantier propre, devis
   gratuit. Formulées en clair, sans jargon commercial.
3. **Réalisations** : chantiers datés et situés, avant/après quand c'est
   possible. Une photo réelle vaut dix arguments.
4. **Zone d'intervention** : dissipe le doute « intervient-il chez moi ? ».
5. **Avis clients** — à intégrer dès que le client dispose d'avis
   authentiques. Ils vont dans Preuves ou Réalisations, pas dans une section
   supplémentaire (la homepage est verrouillée à 7 sections).

---

## 5. Réduction des frictions

- **Aucune obligation de compte, aucune inscription.**
- Le configurateur demande les coordonnées **en dernier** (étape 5), une fois
  l'effort déjà engagé.
- Une seule décision par étape ; progression visible ; retour arrière toujours
  possible sans perte de saisie.
- Les photos sont **optionnelles mais fortement encouragées** : elles accélèrent
  le chiffrage, et le dire explicitement augmente le taux de dépôt.
- Engagements affichés à proximité du formulaire : gratuit, sans engagement,
  réponse rapide, données non transmises à des tiers.
- Aucune fenêtre modale d'interruption, aucun compte à rebours, aucun message
  de rareté artificielle.

---

## 6. Spécificités mobile

Le trafic est majoritairement mobile et souvent en situation d'urgence.

- **Barre d'action persistante** en bas : « Appeler » + « Devis gratuit ».
- Le hero contient le double CTA **au-dessus de la ligne de flottaison à
  390 px**, avant tout défilement.
- Cibles tactiles ≥ 44 × 44 px, espacées d'au moins 8 px.
- Formulaire : `inputmode` et `autocomplete` corrects (`tel`, `email`,
  `postal-code`), clavier adapté, un champ par ligne.
- Un site lent perd l'urgent : les objectifs de performance de la phase 15 sont
  une contrainte de conversion, pas de confort.

---

## 6 bis. La section 7 de l'accueil — entrée vers le devis

Livrée en phase 11. **La plus courte section du site**, et c'est délibéré :
elle est la dernière chose que lit un visiteur qui a déjà parcouru six
sections. Un titre, une phrase, un bouton.

| Élément | Texte |
| --- | --- |
| Titre | « Votre chantier commence ici. » |
| Phrase | « Quelques informations suffisent pour préparer votre demande. » |
| CTA | « Obtenir mon devis gratuit » |
| Réassurance | « Environ 2 minutes. Sans engagement. » |

**Surface claire, sans photographie.** Deux versions ont été écartées avant
celle-ci, et chacune a appris quelque chose :

1. **Photo de fond** — retirée sur demande. La page compte déjà le hero,
   quatre cartes services et trois réalisations. Une septième photo n'ajoutait
   pas de preuve, elle diluait les précédentes.
2. **Aplat forêt** — retiré aussi : le pied de page est lui-même en forêt, et
   les deux blocs sombres se fondaient en **une seule masse de 900 px** en fin
   de page. Le filet supérieur du pied de page ne suffisait pas à les séparer.

Ces deux versions masquaient le vrai défaut : **la section était vide**. Un
titre, une phrase et un bouton, là où le visiteur se demande exactement ce
qu'on va lui demander s'il clique.

### Les trois moments — la dernière objection levée

Avant le bouton, le parcours est annoncé :

| | Moment | Ce que ça lève |
| --- | --- | --- |
| 01 | Décrivez le chantier | « ça va être long à remplir » |
| 02 | Ajoutez des photos | « je vais devoir tout expliquer par écrit » |
| 03 | On vous rappelle | « je ne saurai jamais ce qui se passe ensuite » |

Ce n'est pas du remplissage : c'est la réponse à « combien de temps ça va me
prendre, et qu'est-ce qu'on va me demander » — la dernière hésitation avant un
formulaire. Les trois moments sont vrais et vérifiables dans le configurateur.

Le motif en trois colonnes à filet supérieur est **celui de la section Zone
d'intervention**, repris tel quel : le site n'invente pas une mise en page par
section.

**Le jaune n'apparaît que dans le remplissage du bouton.** Sur ivoire il tombe
à 1,96 : aucun chiffre, aucun filet jaune ici — les numéros sont en forêt
(14,04).

> « Environ 2 minutes » n'est pas un argument marketing mais une **promesse
> vérifiable** : cinq étapes dont trois sont des choix à cliquer, une
> facultative, et six champs au total. Elle est tenable.

---

## 7. Mesure et instrumentation (phase 16)

Analytics respectueux de la vie privée, sans cookie de suivi si possible
(Plausible ou Umami), afin d'éviter tout bandeau de consentement invasif. Si un
outil nécessitant consentement est retenu, le bandeau doit être conforme et
refusable en un clic.

Événements à suivre :

| Événement | Déclencheur |
| --- | --- |
| `appel_clic` | Clic sur un lien `tel:`, avec l'emplacement (hero, barre mobile, footer, page service) |
| `devis_ouvert` | Affichage de l'étape 1 du configurateur |
| `devis_etape` | Passage à l'étape suivante (1→2, 2→3, 3→4, 4→5) |
| `devis_photo_ajoutee` | Au moins une photo jointe |
| `devis_envoye` | Soumission réussie |
| `devis_erreur` | Échec d'envoi |

**Aucun de ces événements n'est émis à ce jour.** La phase 11 livre le
parcours ; l'instrumentation est la phase 16. Deux préparatifs sont toutefois
déjà en place et n'auront pas à être repris :

- l'étape est reflétée dans l'URL (`?etape=3`), donc le **taux d'abandon par
  étape** — l'indicateur le plus utile de la liste — sera mesurable sans
  instrumenter chaque bouton ;
- la validation par étape est centralisée dans `validateStep()` : un seul
  endroit à instrumenter pour `devis_etape`.

Indicateurs suivis : taux de clic appel par page d'entrée, taux d'ouverture du
configurateur, **taux d'abandon par étape** (le diagnostic le plus utile), taux
de complétion global, part des demandes avec photos.

---

## 8. Objectifs de référence

À affiner après un mois de données réelles :

- Taux de conversion global (appel + devis) : **5 à 8 %** des sessions.
- Taux de complétion du configurateur une fois l'étape 1 atteinte : **> 45 %**.
- Part des demandes de devis contenant au moins une photo : **> 50 %**.
- Délai de première réponse à une demande : **< 24 h ouvrées** — engagement à
  afficher seulement s'il est tenable.
