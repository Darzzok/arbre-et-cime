# CONTENT_STRATEGY.md — Stratégie de contenu

Le contenu porte le positionnement « arboriculture éditoriale premium ». Il doit
sonner comme un professionnel qui connaît son métier — pas comme une agence.

---

## 1. Ton

**Sobre, technique, précis, sans esbroufe.**

- Phrases courtes. Vocabulaire du métier employé correctement : grimpe,
  démontage, rétention, haubanage, cépée, houppier, taille douce, essence, tire-
  sève.
- On explique ce qu'on fait et **pourquoi on le fait ainsi**. La compétence se
  démontre par la précision, pas par les superlatifs.
- Le client est vouvoyé. L'entreprise parle à la première personne du pluriel ou
  reste impersonnelle — jamais de « nous sommes votre partenaire de confiance ».
- Un chiffre vaut mieux qu'un adjectif : « environ 10 ans d'expérience » plutôt
  que « une longue expérience ».

### Interdits rédactionnels

- « Solutions sur mesure », « partenaire de confiance », « à l'écoute de vos
  besoins », « qualité et savoir-faire », « à votre service depuis toujours ».
- Points d'exclamation.
- Superlatifs invérifiables (« le meilleur élagueur de Normandie »).
- Emoji.
- Texte de remplissage : si un paragraphe n'apporte rien, il est supprimé.
- Toute affirmation non vérifiée par le client (certifications, assurances,
  nombre de chantiers, avis).

---

## 2. Messages clés, par ordre de priorité

1. **Élagueur-grimpeur à Rouen et dans la métropole rouennaise.** Le métier et
   le lieu, immédiatement.
2. **Travail sécurisé et qualifié** — CS Taille et soins des arbres, BP
   Paysagiste, environ 10 ans d'expérience.
3. **Devis gratuit, intervention rapide, urgences prises en charge.**
4. **Chantier propre, évacuation comprise.** C'est la peur n° 1 du particulier :
   se retrouver avec le jardin dévasté.
5. **Déplacement possible jusqu'à 100 km selon les chantiers** — argument
   commercial, jamais mis en avant avant l'ancrage rouennais.

---

## 3. Trame de la homepage

Sept sections `VERROUILLÉES` (cf. `PROJECT.md`). Intentions rédactionnelles :

| Section | Ce que le texte doit faire |
| --- | --- |
| **Hero** | Dire le métier, la ville, et proposer les deux actions. Un `h1` court, un chapô d'une phrase. Rien d'autre. |
| **Preuves** | Aligner des faits vérifiables : années d'expérience, qualifications, sécurité, propreté, devis gratuit. Formulation brève, sans phrase de liaison marketing. |
| **Prestations** | Les 8 prestations dans l'ordre de référence, chacune avec une ligne qui dit à qui elle s'adresse et ce qu'elle règle. Lien vers la page dédiée. |
| **Pourquoi Arbre et Cime** | Trois à quatre différenciateurs argumentés (méthode de grimpe, sécurité, propreté, réactivité) — pas une liste d'adjectifs. |
| **Réalisations** | Photos réelles, légendes factuelles : commune, prestation, contrainte particulière. La légende fait le travail. |
| **Zone d'intervention** | Rouen et la métropole nommément, puis la mention du rayon jusqu'à 100 km. |
| **Devis interactif** | Une promesse simple : décrire le besoin, joindre des photos, être rappelé. Lever la friction avant l'entrée dans le parcours. |
| **Footer** | NAP, prestations, zone, mentions, rappel des deux CTA. |

---

## 4. Photographie — la ressource critique

**Vraies photographies uniquement. Aucune image générée par IA** pour
représenter l'activité, les chantiers, le matériel ou les personnes.

### Ce dont le projet a besoin (à demander au client)

| Priorité | Sujet | Usage |
| --- | --- | --- |
| 1 | Grimpeur en action dans le houppier, cordes visibles | Hero |
| 2 | Vue depuis la cime vers le sol | Hero alternatif, zone |
| 3 | Démontage par sections, rétention | Réalisations, abattage difficile |
| 4 | Avant / après sur un même chantier | Réalisations — le plus convaincant |
| 5 | Chantier remis en ordre, sol propre | Preuve « chantier propre » |
| 6 | Matériel : tronçonneuse d'élagage, EPI, harnais, broyeur | Pourquoi Arbre et Cime |
| 7 | Portrait de l'élagueur en situation | Preuves, confiance |
| 8 | Haies taillées, terrain débroussaillé | Pages services |

Consignes de prise de vue : format horizontal **et** vertical pour chaque sujet
(le vertical sert le mobile), lumière naturelle, pas de zoom numérique, JPEG
d'origine sans filtre, fichier le plus lourd possible transmis tel quel.

### Repli — en place depuis la phase 5A

**18 photographies libres sont en place**, sous licence Pexels, dans
`public/images/` (`hero`, `services`, `details`, `realisations`). Chacune est
consignée dans **`MEDIA_SOURCES.md`** : fichier, usage, auteur, URL de la page
source, licence, date, et remarques sur les logos ou personnes identifiables.

Ce sont des **sources temporaires**, à remplacer par les photos client dès
réception. Le registre indique pour chacune quelle photo client la remplacera.

Critères appliqués à la sélection, et à réappliquer pour tout ajout :

- banques d'images **libres** uniquement — jamais Unsplash+, ni image payante,
  ni filigrane, ni Google Images, ni Pinterest ;
- **aucune image générée** ;
- arboriculture européenne : essences, paysages et EPI plausibles en Normandie —
  une rue pavillonnaire nord-américaine ou une forêt tropicale est refusée ;
- **aucun logo de marque ou d'entreprise tierce lisible** ;
- **aucune situation de sécurité irréaliste** : une tronçonneuse tenue sans EPI
  ruinerait l'argument « travail sécurisé » ;
- aucune personne posant face à l'objectif — elle serait prise pour le dirigeant
  d'Arbre et Cime ;
- cohérence chromatique avec la charte : verts, bois, pierre. Les bleus saturés
  et les vêtements criards cassent l'ensemble.

`MEDIA_SOURCES.md` § 7 consigne aussi les **images écartées et le motif du
rejet**, pour qu'elles ne reviennent pas par inadvertance.

> **Légendes des réalisations.** Tant que les photos sont des replis, aucune
> légende ne doit mentionner une commune, une date ou un client : ce serait une
> fausse affirmation. Légendes neutres jusqu'au remplacement.

### Traitement et intégration

- Optimisation avant intégration : recadrage éditorial, côté long ≤ 2400 px pour
  les visuels pleine largeur.
- `next/image` systématique, `sizes` explicite, `priority` réservé au seul
  visuel LCP du hero.
- Nommage : descriptif, en minuscules, sans accent, sans identifiant de source
  (`abattage-arbre-tombe-intervention-urgence.jpg`). Jamais `pexels-photo-123`.
- Stockage : `public/images/`, en quatre dossiers — `hero`, `services`,
  `details`, `realisations`.
- Toute image y figurant doit avoir sa ligne dans `MEDIA_SOURCES.md`.

---

## 5. Textes alternatifs

L'`alt` décrit ce que montre la photo, pas ce qu'on veut référencer.

- ✅ « Élagueur-grimpeur en rappel dans un tilleul, démontage par sections à
  Rouen »
- ❌ « élagage Rouen élagueur Rouen abattage Rouen »
- ❌ « photo1 »

Une image purement décorative reçoit `alt=""`. Une légende visible est
préférable à un `alt` long quand l'information est utile à tous.

---

## 6. Rédaction des pages services

Structure définie dans `SEO_STRATEGY.md`. Points de vigilance rédactionnels :

- Ouvrir sur le **problème du client**, pas sur la définition de la prestation.
- Nommer les cas concrets : arbre en limite de propriété, branche au-dessus
  d'une toiture, souche à araser pour une terrasse, haie de 40 mètres à ramener
  à hauteur.
- Expliquer ce qui fait varier le prix, sans donner de tarif ferme.
- Dire explicitement ce qui est inclus, en particulier l'évacuation.
- FAQ : uniquement des questions réellement posées par les clients.

---

## 7. Éditorial — plus tard, si le temps le permet

Quelques articles utiles, jamais un blog alimenté pour le volume :

- Quand élaguer selon l'essence, sous climat normand.
- Élagage et voisinage : ce que dit la loi.
- Reconnaître un arbre dangereux après une tempête.
- Que devient le bois après un abattage.

Un article n'est publié que s'il apporte une information qu'un client cherche
vraiment, et il renvoie vers la prestation correspondante.

---

## 8. Contenus à obtenir du client avant mise en production

- [ ] Photothèque (cf. tableau § 4)
- [ ] Numéro de téléphone et e-mail publics
- [ ] Raison sociale, SIREN, adresse ou zone de service
- [ ] Attestations d'assurance (RC pro, décennale si applicable)
- [ ] Copies des diplômes / attestations de qualification
- [ ] Avis clients existants et autorisation de les citer
- [ ] Horaires, y compris conditions d'intervention en urgence
- [ ] Validation des textes finaux, section par section
