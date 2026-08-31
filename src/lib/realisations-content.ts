/**
 * Contenu de la section « Réalisations » (accueil) et de la page
 * `/realisations`.
 *
 * Réuni ici pour une raison précise : c'est le contenu du site le plus exposé
 * au risque d'affirmation fausse. Une page de réalisations invite à écrire une
 * commune, une date, un client, une hauteur d'arbre. **Rien de tout cela n'est
 * confirmé.** Regrouper les textes permet de vérifier d'un seul coup d'œil
 * qu'aucun n'a glissé vers le chantier inventé.
 *
 * Règle de rédaction, non négociable tant que le client n'a pas livré ses
 * propres photographies (`MEDIA_SOURCES.md` § 6) :
 *
 * - jamais de commune, de date, de client, de hauteur, de durée, de prix ;
 * - les titres décrivent un **type d'intervention**, pas un chantier réalisé ;
 * - les textes disent ce que la photographie **montre** et ce que cela
 *   **implique techniquement** — deux choses vérifiables sur l'image même.
 *
 * Le jour où de vraies photographies arriveront, ce fichier accueillera les
 * champs `commune`, `contexte` et `contraintes`, et la mention de transparence
 * de la page disparaîtra.
 *
 * ---
 *
 * **Répartition des photographies — correctif 9B.** Aucune photographie
 * n'apparaît sur deux pages différentes. Le broyeur était employé sur trois
 * surfaces à la fois (accueil, `/realisations`, `/a-propos`) ; il ne sert plus
 * qu'ici. Les trois reprises de la page d'accueil sont volontairement des
 * entrées de cette collection — c'est le principe d'une accroche, pas une
 * répétition : la page en montre trois de plus.
 */

/** Familles d'intervention affichées en étiquette. */
export type RealisationCategory =
  | "Élagage"
  | "Abattage"
  | "Gestion du bois"
  | "Évacuation";

export type Realisation = {
  id: string;
  category: RealisationCategory;
  /** Décrit un type d'intervention, jamais un chantier identifié. */
  title: string;
  /** Une ligne — version accueil. */
  teaser: string;
  /** Deux à trois lignes — version page. */
  body: string;
  image: string;
  alt: string;
  /** Classe `object-position`, quand le centrage par défaut coupe mal. */
  position?: string;
  /** Reprise dans la section de la page d'accueil (trois au maximum). */
  onHome: boolean;
};

export const realisations: readonly Realisation[] = [
  {
    id: "elagage-en-hauteur",
    category: "Élagage",
    title: "Élagage en hauteur, sur cordes",
    teaser: "Travailler depuis l’arbre, quand aucun engin n’y accède.",
    body: "La grimpe encordée permet d’atteindre une charpentière que ni nacelle ni échelle ne desservent, et de choisir chaque coupe depuis l’arbre plutôt que depuis le sol. C’est aussi ce qui rend possible le travail au-dessus d’un jardin planté, sans écraser ce qu’il y a dessous.",
    image: "/images/realisations/chantier-grimpe-encordee-elagage.jpg",
    alt: "Élagueur encordé installé sur une charpentière, cordes et mousquetons, dans un boisement en hiver",
    position: "object-[center_35%]",
    onHome: true,
  },
  {
    id: "proximite-habitations",
    category: "Abattage",
    title: "Coupe à proximité d’habitations",
    teaser: "Des maisons à quelques mètres : rien ne peut tomber librement.",
    body: "En lisière ou en limite de propriété, la chute libre est exclue. L’arbre descend par sections retenues, et le bois reste au sol le temps d’être débité puis évacué.",
    image: "/images/realisations/chantier-billons-lisiere-hiver.jpg",
    alt: "Billons et souche fraîchement coupés en lisière d’un terrain, habitations visibles en arrière-plan",
    position: "object-[center_60%]",
    onHome: true,
  },
  {
    id: "gestion-du-bois",
    category: "Gestion du bois",
    title: "Le bois, une fois l’arbre au sol",
    teaser: "Débité, rangé, marqué : ce qui reste après la coupe.",
    body: "Un arbre abattu devient un volume de bois qu’il faut débiter, ranger et parfois marquer avant de décider de son sort. C’est ce volume, plus que la hauteur de l’arbre, qui détermine le temps passé sur place et le nombre de rotations.",
    image: "/images/realisations/chantier-billons-marques-automne.jpg",
    alt: "Pile de billons fraîchement coupés portant des marques de repérage à la peinture, en sous-bois d’automne",
    onHome: true,
  },
  {
    id: "abattage-debitage",
    category: "Abattage",
    title: "Abattage et débitage sur place",
    teaser: "Un tronc débité là où il est tombé.",
    body: "Quand l’accès ne permet pas de sortir un arbre entier, il est débité sur place en billons manipulables. La section fraîche renseigne au passage sur l’état réel du bois, que l’écorce ne laissait pas deviner.",
    image: "/images/realisations/chantier-grume-abattue-sous-bois.jpg",
    alt: "Tronc d’arbre abattu et tronçonné en sous-bois, section fraîche visible sur un sol moussu",
    onHome: false,
  },
  {
    id: "taille-en-tetard",
    category: "Élagage",
    title: "Taille en têtard",
    teaser: "Une silhouette entretenue par tailles successives au même point.",
    body: "Cette forme se conduit par tailles successives au même endroit, année après année. Elle demande un suivi régulier : laissée sans reprise, elle produit des rejets nombreux qu’il faut ensuite reprendre plus lourdement.",
    image: "/images/services/elagage-arbre-taille-en-tetard.jpg",
    alt: "Arbre conduit en têtard, charpentière courte et rejets taillés, sur ciel dégagé",
    onHome: false,
  },
  {
    id: "evacuation-broyage",
    category: "Évacuation",
    title: "Broyage et évacuation des branches",
    teaser: "La fin de chantier, quand l’évacuation est demandée.",
    body: "Le broyage réduit le volume des branches et permet de quitter un terrain propre. Selon la prestation, le broyat est laissé sur place ou emporté — c’est une décision prise avec le client, pas une évidence.",
    image: "/images/realisations/chantier-broyage-branches-evacuation.jpg",
    alt: "Branches introduites dans un broyeur monté sur remorque, en fin de chantier",
    position: "object-[center_40%]",
    onHome: false,
  },
];

/** Les trois reprises sur la page d'accueil, dans l'ordre du fichier. */
export const homeRealisations = realisations.filter((item) => item.onHome);

/**
 * Ce qui décide réellement d'une intervention.
 *
 * Cinq critères, tous **lisibles sur une photographie de chantier** — c'est ce
 * qui justifie leur présence sur cette page plutôt que sur une page service.
 */
export const readingCriteria = [
  {
    title: "L’accès",
    body: "Ce qui peut entrer sur le terrain décide souvent de la méthode avant l’arbre lui-même.",
  },
  {
    title: "La proximité des bâtiments",
    body: "Une toiture, une clôture ou une ligne à quelques mètres exclut la chute libre.",
  },
  {
    title: "L’état de l’arbre",
    body: "Un sujet sain et un sujet affaibli ne se travaillent pas de la même façon.",
  },
  {
    title: "Le volume de bois",
    body: "Il détermine le débitage, le nombre de rotations et le temps passé sur place.",
  },
  {
    title: "L’évacuation",
    body: "Laisser le bois, le broyer ou l’emporter : c’est une décision, pas une évidence.",
  },
];
