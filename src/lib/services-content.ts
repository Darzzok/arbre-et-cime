import type { PatternName, Surface } from "@/components/ui";

import type { RouteId } from "./routes";

/**
 * Contenu rédactionnel des quatre pages services.
 *
 * Tout est réuni ici pour être **relu d'un bloc** : c'est le seul moyen de
 * vérifier que les quatre pages disent des choses réellement différentes, et
 * non le même texte avec un mot-clé permuté.
 *
 * Règles appliquées (`CONTENT_STRATEGY.md`) :
 * - aucune affirmation non vérifiée par le client ;
 * - aucun tarif, aucun délai chiffré, aucun diagnostic sanitaire ;
 * - vocabulaire du métier employé correctement ;
 * - « Rouen » apparaît dans le `h1` et une ou deux fois dans le corps, jamais
 *   à chaque paragraphe.
 */

export type ServiceCase = {
  title: string;
  body: string;
};

/**
 * Habillage visuel de la page — ajouté en phase 15B.4.
 *
 * POURQUOI CECI VIT DANS LE FICHIER DE CONTENU
 * --------------------------------------------
 * Les quatre pages services partageaient un gabarit identique et se
 * distinguaient uniquement par leur texte. Mesurées avant refonte, elles
 * avaient **la même hauteur de hero (608 px), le même nombre de sections (5),
 * la même dernière section (1 158 px)** et des totaux compris entre 4 144 et
 * 4 487 px. C'étaient quatre clones.
 *
 * Le gabarit reste unique — c'est ce que les moteurs attendent de pages sœurs,
 * et ce qui garantit qu'aucune ne dérive. Ce qui change, c'est la **suite de
 * surfaces** que chaque page parcourt. Elle est déclarée ici, à côté du texte
 * qu'elle habille, pour qu'on puisse vérifier d'un seul coup d'œil que deux
 * pages ne suivent pas le même chemin.
 *
 * RÈGLE TENUE PAR CONSTRUCTION
 * ----------------------------
 * Dans chaque page, **deux sections voisines ne partagent jamais la même
 * surface**, et les quatre pages ne commencent pas sur la même. Le tableau
 * complet est dans `DESIGN_SYSTEM.md`.
 */
export type ServiceTheme = {
  /** Suite des cinq surfaces traversées, dans l'ordre des sections. */
  hero: Surface;
  intro: Surface;
  cases: Surface;
  method: Surface;
  conversion: Surface;
  /** Motif de fond du hero. `null` = aucun. */
  heroPattern: PatternName | null;
  /** Motif de fond de la section des situations. */
  casesPattern: PatternName | null;
  /**
   * Ton des cartes de situations. Doit contraster avec `cases` : sur une
   * surface sombre on remonte d'un demi-ton, sur une claire on descend.
   */
  caseCardTone: "plain" | "sand" | "forest" | "deep";
};

export type ServiceContent = {
  eyebrow: string;
  /** `h1` — une seule occurrence par page. */
  heading: string;
  lead: string;

  intro: { title: string; paragraphs: readonly string[] };

  cases: { title: string; intro: string; items: readonly ServiceCase[] };

  method: {
    title: string;
    paragraphs: readonly string[];
    points: readonly string[];
    image: string;
    alt: string;
    position?: string;
  };

  /**
   * CE QUI FAIT VARIER LE DEVIS — ajouté en phase 17B, sur relevé d'audit.
   *
   * Deux manques se rejoignaient. D'un côté, les quatre pages services
   * plafonnaient entre 405 et 476 mots, là où une page qui se classe sur une
   * requête commerciale locale en compte plutôt 800 à 1 200. De l'autre, le
   * mot « prix » n'apparaissait nulle part : le visiteur devait franchir cinq
   * étapes de configurateur avant d'avoir le moindre ordre de grandeur.
   *
   * Ce bloc répond aux deux, **sans avancer un seul chiffre**. Aucun tarif n'a
   * été communiqué par le client ; publier une fourchette inventée serait la
   * faute la plus coûteuse possible sur une page de vente. Ce qu'on peut dire
   * en revanche, et qui est vrai pour tout élagueur, c'est ce qui pèse sur un
   * devis — et le dire désamorce l'essentiel de l'angoisse.
   *
   * Les facteurs sont propres à chaque prestation : la hauteur décide d'un
   * élagage, le diamètre décide d'un dessouchage. Un bloc générique aurait
   * reproduit le clonage que la charte interdit.
   */
  factors: {
    title: string;
    intro: string;
    items: readonly { title: string; body: string }[];
  };

  /** Précision propre à la prestation. Donne à chaque page un temps de plus. */
  note: { title: string; body: string };

  /**
   * Titre de la section de conversion, propre au service. « Parlons de votre
   * chantier » était identique sur les quatre pages : c'était la formulation
   * la plus interchangeable du site.
   */
  ctaTitle: string;

  /** Habillage visuel de la page. */
  theme: ServiceTheme;

  /** Trois autres services, pour le maillage interne. */
  related: readonly RouteId[];
};

export const servicesContent: Record<string, ServiceContent> = {
  /* ------------------------------------------------------------------ */
  elagage: {
    eyebrow: "Prestation",
    heading: "Élagage d’arbres à Rouen",
    lead: "Tailler un arbre que l’on conserve : réduire, éclaircir, sécuriser, sans compromettre sa santé ni sa forme.",

    intro: {
      title: "À quoi sert un élagage",
      paragraphs: [
        "L’élagage s’adresse à un arbre que l’on garde. Il consiste à retirer ce qui pose problème — bois mort, branche fragilisée, volume devenu trop important — en conservant la structure et la silhouette de l’arbre.",
        "Une taille bien conduite se voit peu. Elle enlève le nécessaire, respecte les points de coupe et laisse à l’arbre de quoi refermer ses plaies. À l’inverse, une coupe sévère répétée affaiblit durablement un sujet mature.",
      ],
    },

    cases: {
      title: "Dans quels cas intervenir",
      intro:
        "Cinq situations reviennent le plus souvent chez les particuliers comme chez les gestionnaires.",
      items: [
        {
          title: "Bois mort ou branche fragilisée",
          body: "Une branche sèche, fendue après un coup de vent ou mal insérée finit par tomber. On retire ce qui menace, en priorité au-dessus des zones de passage.",
        },
        {
          title: "Réduction du volume",
          body: "Un arbre devenu trop grand pour son emplacement se réduit progressivement, en respectant sa charpente — pas en le rabattant sur des moignons.",
        },
        {
          title: "Entretien d’un arbre mature",
          body: "Des passages espacés et légers valent mieux qu’une coupe sévère tous les dix ans. L’arbre encaisse mieux et garde sa forme.",
        },
        {
          title: "Proximité d’un bâtiment ou d’un passage",
          body: "Branches au-dessus d’une toiture, d’une terrasse, d’une voie ou d’une limite de propriété : le dégagement est mesuré, pas systématique.",
        },
        {
          title: "Taille adaptée à l’essence",
          body: "Le type de taille et la période dépendent de l’essence et de l’état du sujet. Certaines se taillent hors période de sève, d’autres non.",
        },
      ],
    },

    method: {
      title: "Comment nous intervenons",
      paragraphs: [
        "L’intervention se fait en grimpe, sur cordes et harnais. C’est ce qui permet d’atteindre le houppier d’un arbre mature là où une nacelle ne passe pas — jardin clos, passage étroit, sol qui ne supporterait pas un engin.",
      ],
      points: [
        "Travail sur cordes, EPI complets, zone de chantier sécurisée",
        "Matériel professionnel adapté à la taille et à l’essence",
        "Chantier laissé propre, évacuation selon l’intervention",
      ],
      image: "/images/details/materiel-harnais-corde-grimpe.jpg",
      alt: "Harnais et corde de grimpe préparés avant une intervention, en sous-bois",
      position: "object-[center_35%]",
    },

    factors: {
      title: "Ce qui fait varier un devis d’élagage",
      intro:
        "Il n’y a pas de tarif au forfait : deux arbres de même hauteur peuvent demander le double de temps selon ce qu’il y a autour. Voici ce qui pèse réellement, dans l’ordre.",
      items: [
        {
          title: "La hauteur et le volume de la couronne",
          body: "C’est le premier facteur. Un sujet de huit mètres se travaille en une matinée ; un grand arbre de vingt mètres demande davantage de montée, de repositionnement et de descente contrôlée des branches.",
        },
        {
          title: "L’accès au pied de l’arbre",
          body: "Peut-on approcher un véhicule, ou faut-il sortir chaque branche à la main par un portail de quatre-vingts centimètres ? C’est souvent ce qui sépare deux devis très différents pour un arbre identique.",
        },
        {
          title: "Ce qu’il y a en dessous",
          body: "Une toiture, une véranda, une serre, une clôture mitoyenne ou une ligne électrique imposent la descente contrôlée branche par branche, au lieu du démontage libre.",
        },
        {
          title: "Le volume de bois produit",
          body: "Une réduction de couronne génère un volume sans commune mesure avec un simple retrait de bois mort — et ce volume doit être manipulé, débité, puis rangé ou évacué.",
        },
        {
          title: "L’évacuation, ou non",
          body: "Le bois peut rester sur place, débité et rangé, ou partir entièrement. C’est une prestation distincte, qui apparaît telle quelle sur le devis plutôt que d’être noyée dans le prix de la taille.",
        },
      ],
    },

    note: {
      title: "Sur la période de taille",
      body: "Il n’y a pas de bonne saison unique : elle dépend de l’essence, de l’âge du sujet et du type de taille envisagé. C’est un point que nous voyons ensemble avant d’intervenir.",
    },

    ctaTitle: "Un arbre à élaguer ?",

    /*
     * FORÊT — le cœur de métier. La page ouvre sur la même teinte que
     *   l en-tête : la barre et le hero ne font qu un seul bloc, et la
     *   photographie verticale du grimpeur y prend toute sa hauteur.
     */
    theme: {
      hero: "dark",
      intro: "light",
      cases: "deep-forest",
      method: "light",
      conversion: "sand",
      heroPattern: "rings",
      casesPattern: "rings",
      caseCardTone: "forest",
    },

    related: ["abattage", "dessouchage", "entretien-exterieur"],
  },

  /* ------------------------------------------------------------------ */
  abattage: {
    eyebrow: "Prestation",
    heading: "Abattage d’arbres à Rouen",
    lead: "Retirer un arbre lorsque son maintien n’est plus adapté — y compris quand l’accès interdit la nacelle.",

    intro: {
      title: "Quand un abattage s’impose",
      paragraphs: [
        "Un abattage se décide quand l’arbre ne peut plus rester en place : sujet dépérissant, tronc fendu, système racinaire compromis, ou implantation devenue incompatible avec le bâti ou l’usage du terrain.",
        "La question n’est alors plus s’il faut couper, mais comment le faire sans rien abîmer autour. C’est le point d’accès et l’environnement immédiat qui déterminent la technique, pas la taille de l’arbre.",
      ],
    },

    cases: {
      title: "Les situations traitées",
      intro:
        "De l’abattage direct au démontage par sections, selon la place disponible au sol.",
      items: [
        {
          title: "Abattage direct",
          body: "Quand le dégagement au sol le permet, l’arbre est abattu d’un seul tenant, dans une direction maîtrisée, puis débité sur place.",
        },
        {
          title: "Démontage par sections",
          body: "Sans zone de chute suffisante, l’arbre est descendu morceau par morceau depuis le houppier, chaque section étant retenue par cordes.",
        },
        {
          title: "Accès complexe",
          body: "Jardin clos, passage étroit, sol fragile, absence de recul : le matériel et la méthode s’adaptent au chantier plutôt que l’inverse.",
        },
        {
          title: "Proximité immédiate d’un bâtiment",
          body: "Toiture, mur mitoyen, véranda, ligne aérienne : les sections sont guidées et freinées jusqu’au sol, une par une.",
        },
        {
          title: "Après un coup de vent",
          body: "Arbre tombé, penché ou fendu : le dégagement est traité en priorité, puis on statue sur ce qui peut être conservé.",
        },
      ],
    },

    method: {
      title: "Comment nous intervenons",
      paragraphs: [
        "Le démontage par sections se fait en grimpe, avec rétention : les pièces coupées ne tombent pas librement, elles sont retenues sur corde et descendues. C’est ce qui rend possible un abattage entre une haie et une toiture.",
      ],
      points: [
        "Zone de chantier balisée avant toute coupe",
        "Rétention sur corde pour les sections au-dessus d’un obstacle",
        "Débitage sur place, évacuation ou bois laissé selon votre choix",
      ],
      image: "/images/services/abattage-equipement-protection.jpg",
      alt: "Opérateur en équipement de protection, casque et protections auditives, à la tronçonneuse",
      position: "object-[center_30%]",
    },

    factors: {
      title: "Ce qui fait varier un devis d’abattage",
      intro:
        "Un abattage se chiffre moins à la taille de l’arbre qu’à la place disponible autour de lui. Ce qui compte, dans l’ordre :",
      items: [
        {
          title: "La place pour faire tomber l’arbre",
          body: "Un arbre qui peut tomber d’un bloc dans un pré se coupe en une fois. Sans dégagement, il faut le démonter par sections depuis le haut : le même arbre demande alors plusieurs heures de plus.",
        },
        {
          title: "Le diamètre du tronc",
          body: "Il décide du matériel, du nombre de coupes et du poids de chaque billon à déplacer. Au-delà d’un certain diamètre, le débitage devient à lui seul une part significative du chantier.",
        },
        {
          title: "Ce qui se trouve dans la zone de chute",
          body: "Habitation, véhicule, ligne aérienne, mur mitoyen, canalisation apparente : chaque contrainte réduit la marge et impose des techniques de retenue.",
        },
        {
          title: "L’état de l’arbre",
          body: "Un sujet sain se travaille de façon prévisible. Un arbre creux, fendu, penché ou déjà déraciné réclame davantage de précautions — c’est précisément le cas où l’on ne s’improvise pas.",
        },
        {
          title: "Le devenir du bois et de la souche",
          body: "Évacuation complète, bois laissé sur place en bûches, rognage de la souche : trois postes distincts, chiffrés séparément pour que vous puissiez arbitrer.",
        },
      ],
    },

    note: {
      title: "Avant d’engager les travaux",
      body: "Certaines communes encadrent l’abattage — plan local d’urbanisme, arbre protégé, espace boisé classé. Un renseignement en mairie avant de lancer le chantier évite une mauvaise surprise.",
    },

    ctaTitle: "Un arbre à abattre ?",

    /*
     * FORÊT PROFOND — la teinte la plus dense de la charte, pour la
     *   prestation la plus technique et la plus irréversible.
     */
    theme: {
      hero: "deep-forest",
      intro: "sand",
      cases: "dark",
      method: "light",
      conversion: "sand",
      heroPattern: "rings",
      casesPattern: null,
      caseCardTone: "deep",
    },

    related: ["elagage", "dessouchage", "entretien-exterieur"],
  },

  /* ------------------------------------------------------------------ */
  dessouchage: {
    eyebrow: "Prestation",
    heading: "Dessouchage à Rouen",
    lead: "Retirer ou réduire une souche pour libérer la zone et la remettre en état.",

    intro: {
      title: "Pourquoi retirer une souche",
      paragraphs: [
        "Une souche laissée en place reste un obstacle : elle gêne la tonte, empêche de replanter au même endroit, occupe une surface que l’on voudrait rendre praticable, et met des années à se dégrader.",
        "Le dessouchage n’est pas systématique. Si la zone n’est pas destinée à être réaménagée, une souche peut très bien rester. La question se pose surtout quand un projet suit l’abattage.",
      ],
    },

    cases: {
      title: "Quand cela se justifie",
      intro: "Quatre cas de figure, du plus courant au plus technique.",
      items: [
        {
          title: "Souche gênante à l’usage",
          body: "En plein passage, au milieu d’une pelouse ou contre une allée : elle accroche la tondeuse et rend la zone inutilisable.",
        },
        {
          title: "Avant un aménagement",
          body: "Terrasse, clôture, allée, nouvelle plantation : la souche et ses racines principales doivent partir avant que les travaux commencent.",
        },
        {
          title: "Dans la continuité d’un abattage",
          body: "Enchaîner sur le même chantier évite un second déplacement et une seconde remise en état du terrain.",
        },
        {
          title: "Remise en état du sol",
          body: "Une fois la souche retirée, le trou est comblé et la surface nivelée pour que la zone soit de nouveau utilisable.",
        },
      ],
    },

    method: {
      title: "Comment nous intervenons",
      paragraphs: [
        "Selon l’accès, la place disponible autour de la souche, son diamètre et ce que vous prévoyez de faire de la zone, elle est rognée ou extraite. Le choix se décide sur place : il n’y a pas de méthode unique.",
      ],
      points: [
        "Repérage des réseaux et obstacles avant intervention",
        "Méthode arrêtée selon l’accès et le projet d’aménagement",
        "Comblement et nivellement de la zone après retrait",
      ],
      image: "/images/services/dessouchage-souche-et-billons.jpg",
      alt: "Souche et billons de bois déposés sur un terrain enherbé",
      position: "object-[center_45%]",
    },

    factors: {
      title: "Ce qui fait varier un devis de dessouchage",
      intro:
        "Le dessouchage se chiffre surtout au diamètre et à l’accès — la souche, elle, ne bouge pas. Les points qui comptent :",
      items: [
        {
          title: "Le diamètre de la souche",
          body: "C’est le facteur principal : le temps de rognage croît beaucoup plus vite que le diamètre. Une souche de vingt centimètres et une souche d’un mètre ne sont pas le même chantier.",
        },
        {
          title: "L’accès pour la rogneuse",
          body: "La machine doit atteindre la souche. Un portail étroit, un escalier, une pente forte ou un sol détrempé changent l’équipement nécessaire, voire la méthode.",
        },
        {
          title: "La profondeur souhaitée",
          body: "Un engazonnement demande moins de profondeur qu’une nouvelle plantation ou qu’une terrasse. C’est l’usage prévu de l’emplacement qui fixe le travail, pas la souche.",
        },
        {
          title: "Ce qu’il y a autour et dessous",
          body: "Réseaux enterrés, arrosage automatique, dallage, muret, racines affleurantes contre une clôture : tout cela s’identifie avant de lancer la machine, jamais pendant.",
        },
        {
          title: "Les copeaux",
          body: "Le rognage produit un volume important de copeaux mêlés de terre. Ils peuvent combler le trou, être régalés sur place ou être évacués — ce dernier choix se chiffre à part.",
        },
      ],
    },

    note: {
      title: "Ce que devient le broyat",
      body: "Le rognage produit un mélange de copeaux et de terre. Il peut rester sur place pour combler le trou, ou être évacué si la zone doit être aménagée — c’est à décider avec vous.",
    },

    ctaTitle: "Une souche à retirer ?",

    /*
     * SABLE — une prestation de sol. Le hero est clair et large, la
     *   photographie cadrée en paysage plutôt qu en portrait.
     */
    theme: {
      hero: "sand",
      intro: "light",
      cases: "deep-forest",
      method: "sand",
      conversion: "light",
      heroPattern: "contour",
      casesPattern: "contour",
      caseCardTone: "forest",
    },

    related: ["abattage", "elagage", "entretien-exterieur"],
  },

  /* ------------------------------------------------------------------ */
  "entretien-exterieur": {
    eyebrow: "Prestation",
    heading: "Entretien extérieur à Rouen",
    lead: "Taille de haies, débroussaillage et entretien des espaces extérieurs, en ponctuel comme en suivi.",

    intro: {
      title: "Un terrain qui se tient",
      paragraphs: [
        "L’entretien extérieur regroupe ce qui maintient un terrain praticable et net : la haie ramenée à hauteur, la parcelle débroussaillée, les abords repris après l’hiver.",
        "Ces interventions se font au coup par coup ou en suivi régulier. Pour une copropriété, un professionnel ou une collectivité, un passage planifié coûte moins cher à l’année qu’un rattrapage sur un terrain laissé trois ans sans intervention.",
      ],
    },

    cases: {
      title: "Ce que cela recouvre",
      intro: "Quatre prestations, souvent combinées sur un même passage.",
      items: [
        {
          title: "Taille de haies",
          body: "Hauteur, largeur et fréquence dépendent de l’essence et de ce que la haie doit faire : masquer, délimiter, couper le vent.",
        },
        {
          title: "Débroussaillage",
          body: "Parcelle envahie, ronciers, terrain laissé à l’abandon : on remet la surface à plat pour pouvoir de nouveau l’entretenir normalement.",
        },
        {
          title: "Entretien d’espaces verts",
          body: "Reprise des abords, dégagement des allées et des limites, remise en ordre après une saison de pousse.",
        },
        {
          title: "Évacuation des déchets verts",
          body: "Selon l’intervention, les déchets sont broyés sur place ou emportés. Le volume et l’accès déterminent ce qui est le plus simple.",
        },
      ],
    },

    method: {
      title: "Comment nous intervenons",
      paragraphs: [
        "Le matériel s’adapte au terrain : taille-haie sur perche pour les haies hautes, débroussailleuse pour les parcelles, finition à la cisaille là où la précision compte. Le chantier est rendu propre à la fin de chaque passage.",
      ],
      points: [
        "Passage ponctuel ou entretien suivi, selon vos besoins",
        "Matériel choisi selon la hauteur, la densité et l’accès",
        "Déchets verts broyés sur place ou évacués",
      ],
      image: "/images/services/taille-de-haie-cisailles-manuelles.jpg",
      alt: "Finition d’une haie à la cisaille manuelle, en gros plan",
      position: "object-center",
    },

    factors: {
      title: "Ce qui fait varier un devis d’entretien",
      intro:
        "Ici, c’est le métrage et l’état de départ qui commandent, bien plus que la difficulté technique. Ce qui pèse :",
      items: [
        {
          title: "Le linéaire et la hauteur de haie",
          body: "Une haie se chiffre au mètre linéaire, mais la hauteur change tout : au-delà de deux mètres cinquante, le travail passe en échafaudage ou en nacelle, et la coupe se ramasse différemment.",
        },
        {
          title: "L’état de départ",
          body: "Une haie taillée chaque année se reprend vite. Une haie laissée trois ou quatre ans demande une remise en forme, avec un volume de déchets sans rapport avec un entretien courant.",
        },
        {
          title: "La surface à débroussailler",
          body: "Et surtout sa nature : une prairie haute n’est pas une friche avec ronciers et jeunes ligneux, qui réclame un matériel plus lourd et davantage de passages.",
        },
        {
          title: "Le relief et les obstacles",
          body: "Pente, terrain irrégulier, arbres isolés, mobilier, bordures : tout ce qui oblige à contourner ralentit un travail qui se fait autrement en ligne droite.",
        },
        {
          title: "Le volume de déchets verts",
          body: "C’est souvent le poste le plus sous-estimé. Broyage sur place, mise en tas ou évacuation en déchetterie professionnelle : trois options, trois coûts.",
        },
      ],
    },

    note: {
      title: "Sur l’évacuation",
      body: "Elle est chiffrée à part, selon le volume produit et la facilité d’accès au terrain. Un broyage sur place revient souvent moins cher qu’un emport, quand la zone s’y prête.",
    },

    ctaTitle: "Un extérieur à entretenir ?",

    /*
     * IVOIRE — la plus claire des quatre, pour la prestation la plus
     *   paysagère. Photographie panoramique.
     */
    theme: {
      hero: "light",
      intro: "sand",
      cases: "dark",
      method: "light",
      conversion: "sand",
      heroPattern: "contour",
      casesPattern: null,
      caseCardTone: "forest",
    },

    related: ["elagage", "abattage", "dessouchage"],
  },
};
