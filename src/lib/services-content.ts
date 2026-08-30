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

export type ServiceContent = {
  eyebrow: string;
  /** `h1` — une seule occurrence par page. */
  heading: string;
  lead: string;

  hero: { image: string; alt: string; position?: string };

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

  /** Précision propre à la prestation. Donne à chaque page un temps de plus. */
  note: { title: string; body: string };

  /** Trois autres services, pour le maillage interne. */
  related: readonly RouteId[];
};

export const servicesContent: Record<string, ServiceContent> = {
  /* ------------------------------------------------------------------ */
  elagage: {
    eyebrow: "Prestation",
    heading: "Élagage d’arbres à Rouen",
    lead: "Tailler un arbre que l’on conserve : réduire, éclaircir, sécuriser, sans compromettre sa santé ni sa forme.",

    hero: {
      image: "/images/services/elagage-travail-sur-corde-securite.jpg",
      alt: "Élagueur-grimpeur suspendu à sa corde, taillant les branches d’un arbre au pied d’un bâtiment",
      position: "object-[center_38%]",
    },

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

    note: {
      title: "Sur la période de taille",
      body: "Il n’y a pas de bonne saison unique : elle dépend de l’essence, de l’âge du sujet et du type de taille envisagé. C’est un point que nous voyons ensemble avant d’intervenir.",
    },

    related: ["abattage", "dessouchage", "entretien-exterieur"],
  },

  /* ------------------------------------------------------------------ */
  abattage: {
    eyebrow: "Prestation",
    heading: "Abattage d’arbres à Rouen",
    lead: "Retirer un arbre lorsque son maintien n’est plus adapté — y compris quand l’accès interdit la nacelle.",

    hero: {
      image: "/images/services/abattage-arbre-tombe-intervention-urgence.jpg",
      alt: "Grand arbre abattu, débité en sections sur un terrain arboré",
      position: "object-center",
    },

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

    note: {
      title: "Avant d’engager les travaux",
      body: "Certaines communes encadrent l’abattage — plan local d’urbanisme, arbre protégé, espace boisé classé. Un renseignement en mairie avant de lancer le chantier évite une mauvaise surprise.",
    },

    related: ["elagage", "dessouchage", "entretien-exterieur"],
  },

  /* ------------------------------------------------------------------ */
  dessouchage: {
    eyebrow: "Prestation",
    heading: "Dessouchage à Rouen",
    lead: "Retirer ou réduire une souche pour libérer la zone et la remettre en état.",

    hero: {
      image: "/images/services/dessouchage-souche-fraiche-sciure.jpg",
      alt: "Souche fraîchement coupée, entourée de sciure",
      position: "object-center",
    },

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

    note: {
      title: "Ce que devient le broyat",
      body: "Le rognage produit un mélange de copeaux et de terre. Il peut rester sur place pour combler le trou, ou être évacué si la zone doit être aménagée — c’est à décider avec vous.",
    },

    related: ["abattage", "elagage", "entretien-exterieur"],
  },

  /* ------------------------------------------------------------------ */
  "entretien-exterieur": {
    eyebrow: "Prestation",
    heading: "Entretien extérieur à Rouen",
    lead: "Taille de haies, débroussaillage et entretien des espaces extérieurs, en ponctuel comme en suivi.",

    hero: {
      image: "/images/services/taille-de-haie-taille-haie-thermique.jpg",
      alt: "Taille d’une haie de conifères au taille-haie thermique",
      position: "object-[center_42%]",
    },

    intro: {
      title: "Un terrain qui se tient",
      paragraphs: [
        "L’entretien extérieur regroupe ce qui maintient un terrain praticable et net : la haie ramenée à hauteur, la parcelle débroussaillée, les abords repris après l’hiver.",
        "Ces interventions se font au coup par coup ou en suivi régulier. Pour une copropriété, un professionnel ou une collectivité, un passage planifié coûte moins cher à l’année qu’un rattrapage sur un terrain laissé trois ans sans intervention.",
      ],
    },

    cases: {
      title: "Ce que cela recouvre",
      intro:
        "Quatre prestations, souvent combinées sur un même passage.",
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

    note: {
      title: "Sur l’évacuation",
      body: "Elle est chiffrée à part, selon le volume produit et la facilité d’accès au terrain. Un broyage sur place revient souvent moins cher qu’un emport, quand la zone s’y prête.",
    },

    related: ["elagage", "abattage", "dessouchage"],
  },
};
