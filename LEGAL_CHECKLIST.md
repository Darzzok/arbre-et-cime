# LEGAL_CHECKLIST.md — Ce qu'il reste à fournir avant la mise en production

Les deux pages légales sont **écrites et en ligne** depuis la phase 16B :
`/mentions-legales` et `/politique-confidentialite`. Elles n'affichent que des
données confirmées.

Ce fichier liste **uniquement ce qui manque encore**. Une case n'est cochée que
si l'information est réellement confirmée par le client et présente dans le
code.

> **Règle absolue.** Aucune de ces valeurs ne doit être devinée, déduite d'un
> annuaire, ni remplie « en attendant ». Un SIRET plausible mais faux est
> invérifiable pour le client et vérifiable en trente secondes par n'importe
> qui d'autre.

---

## 1. Identité de l'entreprise

- [x] **Nom commercial** — `Arbres et Cimes Élagage` (`src/lib/site.ts`)
- [x] **Activité** — Élagueur-grimpeur
- [x] **Responsable de la publication** — Cédric Simon (confirmé en phase 8)
- [x] **E-mail public** — `aec.elagage76@gmail.com` (confirmé en phase 15B.2)
- [x] **Téléphone public** — `06 28 77 82 40` (confirmé en phase 15B.6)
- [x] **Forme juridique** — entrepreneur individuel, régime de la
      micro-entreprise (« auto-entrepreneur »), confirmée en phase 16B. En
      entreprise individuelle, les mentions **RCS et capital social ne
      s'appliquent pas** : leur absence est normale, pas un oubli.
- [x] **SIRET** — `928 119 403 00014`, confirmé en phase 16B.

      > **Il a été vérifié, et c'est ce qui a évité une erreur.** Un SIREN et un
      > SIRET portent une clé de contrôle (algorithme de Luhn). Le premier
      > numéro communiqué se terminait par un `9` au lieu d'un `3` : il
      > échouait à la clé. Le validateur employé a été contrôlé sur quatre SIREN
      > publics connus, qu'il valide tous les quatre. Le numéro corrigé passe la
      > clé sur le SIREN **et** sur le SIRET complet.
      >
      > **Toute modification future de ce numéro doit repasser par la clé.**

- [ ] **Raison sociale exacte** — telle qu'elle figure sur l'avis de situation
      SIRENE. En entreprise individuelle, c'est en principe le nom du
      dirigeant ; à vérifier, car c'est cette mention qui fait foi et non le
      nom commercial.
- [ ] **Numéro de TVA intracommunautaire** — *seulement si l'entreprise y est
      assujettie.* Une micro-entreprise est le plus souvent en **franchise en
      base** : dans ce cas la mention n'a pas lieu d'être sur le site, et c'est
      « TVA non applicable, art. 293 B du CGI » qui doit figurer sur les devis
      et factures. **À confirmer** — ne rien afficher tant que ce n'est pas
      tranché.
- [x] **Commune du siège** — Le Grand-Quevilly, confirmée en phase 16B.
- [x] **Adresse postale complète** — **ne sera pas publiée.** Décision du
      client, prise après la phase 17 : les mentions légales portent la commune
      du siège et le SIRET, pas la voie ni le code postal. Enregistré dans
      `legal.adresseCompleteAffichee` (`src/lib/site.ts`), au même titre que la
      réponse sur l'assurance.

      **L'encadré « En cours de finalisation » de `/mentions-legales` a été
      supprimé**, à la demande du client : l'adresse était sa dernière entrée,
      et il annonçait donc une publication qui n'aura pas lieu. La liste qui
      l'alimentait est supprimée avec lui. Rien n'a été complété d'office : le
      code présent dans `data/geo/communes.json` (76322) est un code **INSEE**,
      pas un code postal.

      > Si une mention devait un jour redevenir « en attente de publication »,
      > c'est un bloc à réécrire dans `src/app/mentions-legales/page.tsx`, pas
      > à réactiver — il n'existe plus.

      > **⚠ Le point mérite d'être vérifié avec un conseil, et il l'est ici
      > sans être tranché à la place du client.** La LCEN demande à un éditeur
      > professionnel de faire figurer une adresse ; pour une entreprise
      > individuelle, c'est en principe celle de l'établissement. En pratique,
      > le SIRET publié rend l'adresse consultable sur l'annuaire public des
      > entreprises, sauf demande de non-diffusion. La décision appartient au
      > client ; elle est appliquée et tracée, pas commentée sur le site.
- [x] **Assurance professionnelle** — le client a répondu qu'il n'y en avait
      **pas à afficher** (phase 16B). Rien n'est donc publié, et rien n'est
      annoncé « à venir » : une absence assumée n'est pas une information
      manquante. Enregistré dans `legal.assuranceAffichee`.

> **⚠ À trancher — « basée à Rouen » contre siège au Grand-Quevilly.**
> Le siège administratif est au Grand-Quevilly. Or `src/content/locations.ts`
> fait de **Rouen** la commune d'attache, et la page `/zones-intervention/rouen`
> affiche : « Rouen est la commune d'attache d'Arbres & Cimes », doublée de
> « Arbres & Cimes est basée à Rouen ».
>
> Les deux ne sont pas incompatibles — Le Grand-Quevilly appartient à la
> Métropole Rouen Normandie, à cinq kilomètres de Rouen — mais ils ne disent
> pas la même chose : l'un est un siège administratif, l'autre un ancrage
> commercial et SEO.
>
> **Rien n'a été modifié.** Toucher à la commune d'attache déplacerait le
> centre du maillage local sur 19 pages, la carte et la stratégie SEO. C'est
> une décision client, pas une correction technique.

---

## 2. Hébergement

- [x] **Identité de l'hébergeur de production** — `Hostinger International
      Limited`. Mise en ligne chez Hostinger confirmée par le client.
- [x] **Adresse de l'hébergeur** — `61 Lordou Vironos str., 6023 Larnaca,
      Chypre`.
- [ ] **Téléphone de l'hébergeur** — **Hostinger n'en publie pas** : son
      support passe par chat et e-mail. Rien n'est inventé, la ligne ne
      s'affiche pas (`host.phone === null`). Si un numéro figure sur le contrat
      ou la facture du client, il peut être renseigné ; sinon le point reste
      ouvert en connaissance de cause.

**État réel du dossier :**

| | |
| --- | --- |
| Hébergement de production | **en place — Hostinger**, confirmé par le client |
| Entité publiée | `Hostinger International Limited`, entité contractante pour l'Union européenne |
| Domaine définitif | **non communiqué** (`NEXT_PUBLIC_SITE_URL` vide) |

La page `/mentions-legales` **nomme désormais l'hébergeur**. L'identité et
l'adresse ne sont pas écrites de mémoire : elles sont relevées sur les
conditions générales publiées par Hostinger, qui désignent l'entité
contractante pour les clients de l'Union européenne
(`hostinger.com/legal/universal-terms-of-service-agreement`). C'était la
condition posée en phase 16B pour renseigner cette rubrique.

> **⚠ À faire confirmer par le client.** Le groupe Hostinger compte plusieurs
> sociétés, et celle qui facture dépend du pays d'achat. **La facture ou le
> contrat fait foi** : si elle nomme une autre entité du groupe, c'est
> celle-là qui doit figurer dans `host` (`src/lib/site.ts`).

> **⚠ Deux points restent ouverts malgré la mise en ligne.**
>
> 1. `NEXT_PUBLIC_SITE_URL` est vide. Tant qu'elle l'est, les URLs absolues du
>    site (Open Graph, canoniques, JSON-LD) ne portent pas le vrai domaine.
>    **C'est à renseigner sur l'hébergement, pas dans le dépôt.**
> 2. `NEXT_PUBLIC_SITE_INDEXABLE` reste à `false`, et **n'a pas été touchée** :
>    être en ligne n'est pas être indexable. Le passage à `"true"` est la
>    phase 18, sur décision explicite du client, une seule fois
>    (`CLAUDE.md` § 3.10).

---

## 3. Traitement des demandes

- [ ] **Durée de conservation interne des demandes de devis.** Aucune durée
      chiffrée n'est publiée : la politique dit « la durée nécessaire au
      traitement de la demande et aux obligations administratives ou légales
      applicables ». C'est prudent et exact, mais une règle interne réelle vaut
      mieux — par exemple : suppression des demandes sans suite au bout de X
      mois, conservation des devis acceptés selon les obligations comptables.
      **Décision métier**, à prendre puis à reporter dans la rubrique
      « Combien de temps elles sont conservées ».
- [ ] **Adresse de réception des demandes** (`QUOTE_INBOX_EMAIL`). Prévue :
      l'adresse professionnelle. Elle vit dans la configuration du serveur,
      **jamais dans le dépôt**.
- [ ] **Médiateur de la consommation** — *à vérifier, pas à supposer.* Un
      professionnel qui contracte avec des particuliers doit en principe
      adhérer à un dispositif de médiation et en communiquer les coordonnées.
      Ce point n'est **pas** traité aujourd'hui sur le site. À confirmer avec
      le client ou son comptable, puis à ajouter aux mentions légales le cas
      échéant.

---

## 4. Ce qui est déjà exact et n'a rien à attendre

Vérifié dans le code, pas supposé — la politique de confidentialité décrit
l'état réel du site :

- [x] **Aucun cookie.** Aucune occurrence de `document.cookie` ni de
      `cookies()` dans `src/`. Vérifié à l'exécution sur les deux pages :
      `document.cookie` vide, `localStorage` et `sessionStorage` vides.
- [x] **Aucune mesure d'audience.** `emitQuoteEvent()`
      (`src/lib/quote/events.ts`) a un corps vide ; aucun script tiers n'est
      chargé.
- [x] **Aucun envoi réel.** `submit()` de `use-quote-state.ts` bascule
      l'affichage sur le récapitulatif ; il n'appelle rien.
- [x] **Aucune base de données.**
- [x] **`sessionStorage` décrit exactement.** Les champs cités dans la
      politique sont les clés de `StoredShape`
      (`src/lib/quote/persistence.ts`) : besoin, chantier, code postal,
      commune, étape, nombre de photos. Ni nom, ni téléphone, ni e-mail, ni
      commentaire, ni adresse précise, ni photographies.
- [x] **Attributions cartographiques publiées.** ODbL (IGN via france-geojson)
      et Licence Ouverte 2.0 (Étalab / DINUM) figurent dans la rubrique
      « Propriété intellectuelle ». `MAP_DATA_SOURCES.md` § 2 le réclamait
      depuis la phase 14.
- [x] **Aucun lien externe sur le site.** Aucune rubrique « liens externes »
      n'a donc été créée : elle ne décrirait rien. À réexaminer si un lien
      sortant est ajouté un jour.

---

## 5. Au moment de la mise en ligne (phase 18)

- [ ] Compléter la fiche éditeur avec ce qui reste au § 1 — adresse et
      assurance — puis **supprimer le bloc « En cours de finalisation »** de
      `/mentions-legales`. Il se vide tout seul au fur et à mesure : sa liste
      est construite à partir des drapeaux de `site.ts`.
- [ ] Compléter la rubrique « Hébergement ».
- [ ] Mettre à jour `LEGAL_UPDATED` dans `src/components/legal/legal.tsx` — la
      date d'édition est une constante, elle ne se met pas à jour toute seule.
      **C'est voulu :** une date calculée au rendu prétendrait une mise à jour
      qui n'a pas eu lieu.
- [ ] Relire la rubrique « Ce qui se passe aujourd'hui » de la politique : elle
      décrit un formulaire qui n'envoie rien. Elle devient fausse le jour où
      l'envoi est activé et doit être réécrite au même moment.
- [ ] `NEXT_PUBLIC_SITE_INDEXABLE=true` — une seule fois, sur décision
      explicite du client.

---

## 6. Ce que ce fichier n'est pas

Ce n'est pas un avis juridique. Il recense ce que le site ne peut pas savoir
tout seul et signale les points qui méritent une vérification par le client ou
son comptable — notamment la forme juridique, l'assujettissement à la TVA, la
médiation de la consommation et la durée de conservation.
