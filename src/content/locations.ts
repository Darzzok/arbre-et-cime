/**
 * Source unique des localisations — carte, pages villes, hub, sitemap, maillage.
 *
 * POURQUOI UN SEUL FICHIER
 * ------------------------
 * Avant la phase 14, la liste des communes existait à trois endroits :
 * `map-data.ts` (généré), `map-content.ts` (choix d'affichage) et le texte de
 * `/zones-intervention`. Trois listes divergentes, donc trois occasions de se
 * contredire — et c'est exactement ce qui était arrivé : Saint-Étienne-du-
 * Rouvray et Elbeuf étaient cités dans le texte sans exister sur la carte.
 *
 * Règle du projet désormais, inscrite à `SEO_STRATEGY.md` :
 * **tout point ville public de la carte possède une page locale**, et
 * réciproquement. Cette liste fait foi pour les deux.
 *
 * DONNÉES GÉOGRAPHIQUES — CALCULÉES, JAMAIS SAISIES
 * --------------------------------------------------
 * Coordonnées : `geo.api.gouv.fr`, centroïdes officiels (voir
 * `MAP_DATA_SOURCES.md`). Distances : recalculées par la formule de haversine
 * depuis Rouen, puis arrondies au kilomètre. Ce sont des **distances
 * géographiques indicatives**, pas des distances routières — le site ne dit
 * jamais « à X km en voiture ».
 *
 * Voisins : les communes les plus proches parmi celles qui possèdent une page,
 * calculées de la même façon. Aucune sélection arbitraire répétée d'une page à
 * l'autre.
 *
 * TROIS NIVEAUX, DÉFINIS PAR DES FAITS
 * -------------------------------------
 * | Niveau | Règle | Discours |
 * | --- | --- | --- |
 * | `core` | membre de la Métropole Rouen Normandie | zone principale d'intervention |
 * | `primary` | ≤ 60 km de Rouen | interventions possibles selon le chantier |
 * | `extended` | > 60 km de Rouen | déplacement envisageable selon le chantier |
 *
 * L'appartenance à la métropole est une donnée administrative vérifiable, pas
 * une appréciation commerciale. Le seuil de 60 km sépare ensuite ce qui est à
 * moins d'une heure de ce qui n'y est pas.
 *
 * CE QUI N'EST JAMAIS ÉCRIT ICI
 * ------------------------------
 * Aucun chantier réalisé, aucun client, aucun quartier desservi, aucune
 * essence d'arbre locale, aucun délai, aucun règlement municipal, aucune
 * statistique, aucune agence locale. Le contenu local se limite à de la
 * **géographie vérifiable** et à ce qu'elle implique concrètement pour
 * organiser un chantier.
 */

export type LocationTier = "core" | "primary" | "extended";

export type Location = {
  /** Code INSEE — clé de rapprochement avec les données de la carte. */
  id: string;
  slug: string;
  nom: string;
  /** « à Rouen », « au Grand-Quevilly » — la préposition n'est pas devinable. */
  a: string;
  /** « de Rouen », « du Havre ». */
  de: string;
  lon: number;
  lat: number;
  /** Kilomètres depuis Rouen, à vol d'oiseau. Calculé, jamais saisi. */
  km: number;
  /** Direction depuis Rouen, calculée depuis l'azimut. `null` pour Rouen. */
  direction: string | null;
  tier: LocationTier;
  departement: string;
  region: string;
  /** Slugs des communes voisines, du plus proche au plus éloigné. */
  voisins: readonly string[];
  /** Chapô du hero. Une à deux phrases, propres à la commune. */
  intro: string;
  /** Bloc local : la géographie, et ce qu'elle change pour un chantier. */
  contexte: string;
  /** Phrase d'introduction du bloc prestations. */
  servicesIntro: string;
  /** Description SEO, réellement adaptée. Jamais un gabarit à trous. */
  description: string;
};

/* -------------------------------------------------------------------------- */

export const LOCATIONS: readonly Location[] = [
  /* ------------------------------------------------------------- CORE --- */
  {
    id: "76540",
    slug: "rouen",
    nom: "Rouen",
    a: "à Rouen",
    de: "de Rouen",
    lon: 1.0912,
    lat: 49.4412,
    km: 0,
    direction: null,
    tier: "core",
    departement: "Seine-Maritime",
    region: "Normandie",
    voisins: [
      "mont-saint-aignan",
      "sotteville-les-rouen",
      "bois-guillaume",
      "le-grand-quevilly",
    ],
    intro:
      "Rouen se situe au cœur du secteur d’intervention d’Arbres & Cimes. C’est la commune où les chantiers demandent le moins d’organisation préalable, et le point de repère de toute la zone.",
    contexte:
      "Rouen s’étage entre les quais de Seine et les coteaux qui la ceinturent au nord comme au sud. Cette topographie change beaucoup de choses pour un élagueur : un jardin de coteau se travaille rarement depuis un véhicule garé au pied de l’arbre, et l’évacuation des bois se prépare avant de monter. Le centre ancien ajoute ses propres contraintes — rues étroites, stationnement compté, mitoyenneté immédiate.",
    servicesIntro:
      "Les quatre prestations sont assurées à Rouen, du jardin de centre-ville au grand sujet de coteau.",
    description:
      "Élagueur-grimpeur à Rouen : élagage, abattage, dessouchage et entretien extérieur, du jardin de centre-ville aux arbres de coteau. Devis gratuit.",
  },
  {
    id: "76451",
    slug: "mont-saint-aignan",
    nom: "Mont-Saint-Aignan",
    a: "à Mont-Saint-Aignan",
    de: "de Mont-Saint-Aignan",
    lon: 1.0806,
    lat: 49.4673,
    km: 3,
    direction: "nord",
    tier: "core",
    departement: "Seine-Maritime",
    region: "Normandie",
    voisins: [
      "bois-guillaume",
      "rouen",
      "sotteville-les-rouen",
      "le-grand-quevilly",
    ],
    intro:
      "Mont-Saint-Aignan est à trois kilomètres de Rouen, sur le plateau nord. Arbres & Cimes y intervient pour l’élagage, l’abattage, le dessouchage et l’entretien extérieur.",
    contexte:
      "La commune occupe le plateau qui domine Rouen, avec une rupture de pente marquée vers la vallée. Les parcelles résidentielles y sont souvent plus généreuses qu’en fond de vallée, et les sujets ont eu la place de vieillir. Sur le plateau, l’exposition au vent est plus franche qu’en contrebas — un paramètre qui compte pour juger de la tenue d’un arbre.",
    servicesIntro:
      "Sur des parcelles de plateau, souvent arborées de longue date, les quatre prestations se rejoignent fréquemment sur un même chantier.",
    description:
      "Élagueur-grimpeur à Mont-Saint-Aignan, à 3 km de Rouen. Élagage, abattage, dessouchage et entretien de vos extérieurs sur le plateau nord. Devis gratuit.",
  },
  {
    id: "76108",
    slug: "bois-guillaume",
    nom: "Bois-Guillaume",
    a: "à Bois-Guillaume",
    de: "de Bois-Guillaume",
    lon: 1.1194,
    lat: 49.4729,
    km: 4,
    direction: "nord-est",
    tier: "core",
    departement: "Seine-Maritime",
    region: "Normandie",
    voisins: [
      "mont-saint-aignan",
      "rouen",
      "sotteville-les-rouen",
      "le-grand-quevilly",
    ],
    intro:
      "Arbres & Cimes intervient à Bois-Guillaume pour l’élagage, l’abattage, le dessouchage et l’entretien extérieur. La commune est à quatre kilomètres du centre de Rouen.",
    contexte:
      "Bois-Guillaume s’étend sur le plateau nord-est, dans un tissu très majoritairement résidentiel. Les jardins y sont nombreux et les arbres de haute tige fréquents en limite de propriété — configuration où la question de la mitoyenneté et de la chute des bois se pose avant tout le reste. L’accès véhicule y est en général plus simple qu’en centre-ville rouennais.",
    servicesIntro:
      "En secteur pavillonnaire, l’élagage d’entretien et la taille de haies reviennent le plus souvent ; l’abattage et le dessouchage suivent quand un sujet doit céder la place.",
    description:
      "Élagueur-grimpeur à Bois-Guillaume, à 4 km de Rouen : élagage, abattage, dessouchage et taille de haies en secteur pavillonnaire. Devis gratuit.",
  },
  {
    id: "76681",
    slug: "sotteville-les-rouen",
    nom: "Sotteville-lès-Rouen",
    a: "à Sotteville-lès-Rouen",
    de: "de Sotteville-lès-Rouen",
    lon: 1.0944,
    lat: 49.4116,
    km: 3,
    direction: "sud",
    tier: "core",
    departement: "Seine-Maritime",
    region: "Normandie",
    voisins: [
      "saint-etienne-du-rouvray",
      "rouen",
      "le-grand-quevilly",
      "mont-saint-aignan",
    ],
    intro:
      "Sotteville-lès-Rouen jouxte Rouen sur la rive gauche. Arbres & Cimes y assure l’élagage, l’abattage, le dessouchage et l’entretien extérieur.",
    contexte:
      "Le tissu urbain y est dense et de plain-pied, sans le relief de la rive droite. Les parcelles sont souvent étroites et closes, avec des arbres proches des habitations et des limites séparatives. Dans cette configuration, c’est rarement la hauteur qui complique un chantier, mais le peu de place disponible pour faire tomber les bois et les évacuer.",
    servicesIntro:
      "Sur des parcelles resserrées, le démontage par sections remplace souvent l’abattage direct — et le dessouchage se règle au cas par cas selon l’accès.",
    description:
      "Élagueur-grimpeur à Sotteville-lès-Rouen, commune limitrophe de Rouen. Élagage, démontage, dessouchage et entretien extérieur. Devis gratuit et sans engagement.",
  },
  {
    id: "76322",
    slug: "le-grand-quevilly",
    nom: "Le Grand-Quevilly",
    a: "au Grand-Quevilly",
    de: "du Grand-Quevilly",
    lon: 1.0416,
    lat: 49.4118,
    km: 5,
    direction: "sud-ouest",
    tier: "core",
    departement: "Seine-Maritime",
    region: "Normandie",
    voisins: [
      "sotteville-les-rouen",
      "saint-etienne-du-rouvray",
      "rouen",
      "mont-saint-aignan",
    ],
    intro:
      "Arbres & Cimes intervient au Grand-Quevilly, à cinq kilomètres de Rouen sur la rive gauche, pour l’élagage, l’abattage, le dessouchage et l’entretien extérieur.",
    contexte:
      "La commune associe des quartiers résidentiels, de larges espaces verts publics et des secteurs d’activité en bord de Seine. Cette mixité se retrouve dans les demandes : un arbre de jardin particulier et un alignement en limite de zone d’activité ne se traitent pas de la même manière, ni avec les mêmes contraintes de circulation autour du chantier.",
    servicesIntro:
      "Particuliers, copropriétés et professionnels : la nature du site pèse ici autant que celle de l’arbre.",
    description:
      "Élagueur-grimpeur au Grand-Quevilly, rive gauche de Rouen : élagage, abattage, dessouchage et entretien extérieur pour particuliers et professionnels.",
  },
  {
    id: "76575",
    slug: "saint-etienne-du-rouvray",
    nom: "Saint-Étienne-du-Rouvray",
    a: "à Saint-Étienne-du-Rouvray",
    de: "de Saint-Étienne-du-Rouvray",
    lon: 1.0909,
    lat: 49.3833,
    km: 6,
    direction: "sud",
    tier: "core",
    departement: "Seine-Maritime",
    region: "Normandie",
    voisins: [
      "sotteville-les-rouen",
      "le-grand-quevilly",
      "rouen",
      "mont-saint-aignan",
    ],
    intro:
      "Saint-Étienne-du-Rouvray est à six kilomètres de Rouen, en lisière de la forêt du Rouvray. Arbres & Cimes y intervient sur l’ensemble de ses prestations.",
    contexte:
      "La commune borde un massif forestier, ce qui change la nature des demandes : en limite de boisement, les sujets sont plus hauts, filés par la concurrence, et souvent moins équilibrés que des arbres de plein jardin. Une propriété adossée à la forêt pose aussi la question des branches en surplomb et de la limite exacte d’intervention.",
    servicesIntro:
      "En lisière de massif, l’élagage de mise en sécurité et l’abattage de sujets dépérissants reviennent plus souvent qu’ailleurs.",
    description:
      "Élagueur-grimpeur à Saint-Étienne-du-Rouvray, en lisière de la forêt du Rouvray : élagage, abattage, dessouchage, entretien extérieur. Devis gratuit.",
  },
  {
    id: "76231",
    slug: "elbeuf",
    nom: "Elbeuf",
    a: "à Elbeuf",
    de: "d’Elbeuf",
    lon: 0.9974,
    lat: 49.2773,
    km: 19,
    direction: "sud",
    tier: "core",
    departement: "Seine-Maritime",
    region: "Normandie",
    voisins: [
      "louviers",
      "saint-etienne-du-rouvray",
      "le-grand-quevilly",
      "sotteville-les-rouen",
    ],
    intro:
      "Elbeuf appartient à la Métropole Rouen Normandie, à une vingtaine de kilomètres au sud de Rouen. Arbres & Cimes y intervient dans les mêmes conditions que sur le reste de la métropole.",
    contexte:
      "La ville est installée dans une boucle de la Seine, resserrée entre le fleuve et des coteaux boisés assez raides. Les propriétés de coteau y sont fréquentes, avec les mêmes conséquences qu’à Rouen : accès du matériel à étudier, sortie des bois par le haut ou par le bas selon la parcelle, et une pente qui interdit souvent d’approcher un véhicule.",
    servicesIntro:
      "Entre fond de vallée et coteau, deux réalités de chantier très différentes coexistent sur la même commune.",
    description:
      "Élagueur-grimpeur à Elbeuf, commune de la Métropole Rouen Normandie. Élagage, abattage, dessouchage et entretien extérieur, y compris en terrain pentu.",
  },

  /* ---------------------------------------------------------- PRIMARY --- */
  {
    id: "27375",
    slug: "louviers",
    nom: "Louviers",
    a: "à Louviers",
    de: "de Louviers",
    lon: 1.1562,
    lat: 49.2213,
    km: 25,
    direction: "sud",
    tier: "primary",
    departement: "Eure",
    region: "Normandie",
    voisins: [
      "elbeuf",
      "saint-etienne-du-rouvray",
      "sotteville-les-rouen",
      "evreux",
    ],
    intro:
      "Louviers est à environ vingt-cinq kilomètres au sud de Rouen, dans l’Eure. Les interventions y sont possibles selon la nature du chantier.",
    contexte:
      "La ville est traversée par l’Eure et bordée par un vaste massif forestier au nord. Les propriétés riveraines de la rivière ou adossées au bois présentent souvent des sujets élancés et des accès contraints par l’eau ou la clôture de lisière. La proximité de la forêt pose la même question qu’ailleurs : jusqu’où va la parcelle, et qui entretient quoi.",
    servicesIntro:
      "Élagage, abattage, dessouchage et entretien extérieur : la faisabilité se juge surtout sur l’accès au pied de l’arbre.",
    description:
      "Élagueur à Louviers, dans l’Eure, à 25 km de Rouen : élagage, abattage et dessouchage possibles selon la nature du chantier. Devis gratuit.",
  },
  {
    id: "76758",
    slug: "yvetot",
    nom: "Yvetot",
    a: "à Yvetot",
    de: "d’Yvetot",
    lon: 0.7685,
    lat: 49.6183,
    km: 30,
    direction: "nord-ouest",
    tier: "primary",
    departement: "Seine-Maritime",
    region: "Normandie",
    voisins: [
      "mont-saint-aignan",
      "bois-guillaume",
      "le-grand-quevilly",
      "rouen",
    ],
    intro:
      "Yvetot se trouve à une trentaine de kilomètres au nord-ouest de Rouen, au cœur du pays de Caux. Les interventions y sont possibles selon la nature du chantier.",
    contexte:
      "Le pays de Caux est un plateau ouvert, où les arbres sont fréquemment groupés en alignements ou en clos-masures autour des habitations — des ensembles plantés précisément pour couper le vent. Ces sujets ont poussé exposés, et leur entretien relève souvent de la mise en sécurité d’un alignement entier plutôt que d’un arbre isolé.",
    servicesIntro:
      "Sur le plateau cauchois, la demande porte souvent sur des ensembles d’arbres plutôt que sur un sujet unique.",
    description:
      "Élagueur à Yvetot, au cœur du pays de Caux, à 30 km de Rouen. Élagage, abattage et entretien d’alignements, selon la nature du chantier.",
  },
  {
    id: "27467",
    slug: "pont-audemer",
    nom: "Pont-Audemer",
    a: "à Pont-Audemer",
    de: "de Pont-Audemer",
    lon: 0.5259,
    lat: 49.3476,
    km: 42,
    direction: "ouest",
    tier: "primary",
    departement: "Eure",
    region: "Normandie",
    voisins: ["bernay", "lisieux", "yvetot", "elbeuf"],
    intro:
      "Pont-Audemer est à une quarantaine de kilomètres à l’ouest de Rouen, dans la vallée de la Risle. Les interventions y sont possibles selon la nature du chantier.",
    contexte:
      "La ville est installée dans une vallée humide, sillonnée de bras d’eau. Les terrains riverains y sont souvent souples, ce qui pèse directement sur le choix du matériel : un sol qui ne porte pas interdit d’approcher un engin, et l’évacuation des bois doit alors se prévoir autrement. C’est un paramètre qu’il vaut mieux signaler dès la demande de devis.",
    servicesIntro:
      "En fond de vallée, la portance du sol conditionne souvent la méthode retenue.",
    description:
      "Élagueur à Pont-Audemer, vallée de la Risle, à 42 km de Rouen. Élagage, abattage et dessouchage selon l’accès et la nature du terrain.",
  },
  {
    id: "27229",
    slug: "evreux",
    nom: "Évreux",
    a: "à Évreux",
    de: "d’Évreux",
    lon: 1.1406,
    lat: 49.018,
    km: 47,
    direction: "sud",
    tier: "primary",
    departement: "Eure",
    region: "Normandie",
    voisins: ["louviers", "vernon", "elbeuf", "mantes-la-jolie"],
    intro:
      "Évreux, préfecture de l’Eure, est à environ quarante-sept kilomètres au sud de Rouen. Les interventions y sont possibles selon la nature du chantier.",
    contexte:
      "La ville s’est développée dans la vallée de l’Iton, sur un axe direct depuis Rouen. Le tissu urbain mêle centre dense et faubourgs pavillonnaires plus arborés — deux contextes qui n’appellent pas les mêmes méthodes. Pour un chantier à cette distance, c’est l’ampleur qui décide : une journée complète s’organise sans difficulté, une intervention de trente minutes beaucoup moins.",
    servicesIntro:
      "À cette distance, regrouper plusieurs arbres ou plusieurs prestations sur une même venue est souvent la solution la plus simple.",
    description:
      "Élagueur à Évreux, préfecture de l’Eure, à 47 km de Rouen. Élagage, abattage, dessouchage : intervention possible selon l’ampleur du chantier.",
  },
  {
    id: "27681",
    slug: "vernon",
    nom: "Vernon",
    a: "à Vernon",
    de: "de Vernon",
    lon: 1.4827,
    lat: 49.0921,
    km: 48,
    direction: "sud-est",
    tier: "primary",
    departement: "Eure",
    region: "Normandie",
    voisins: ["mantes-la-jolie", "evreux", "louviers", "gisors"],
    intro:
      "Vernon est à une cinquantaine de kilomètres au sud-est de Rouen, en bord de Seine. Les interventions y sont possibles selon la nature du chantier.",
    contexte:
      "La commune occupe un élargissement de la vallée de la Seine, entre le fleuve et les coteaux calcaires qui la dominent. Les propriétés de bord de Seine et celles de coteau posent des problèmes opposés : les premières sont accessibles mais souvent exiguës, les secondes offrent de la place mais imposent de travailler en pente.",
    servicesIntro:
      "Bord de fleuve ou coteau : la configuration du terrain oriente le devis plus que l’essence de l’arbre.",
    description:
      "Élagueur à Vernon, en bord de Seine à 48 km de Rouen. Élagage, abattage et dessouchage, en fond de vallée comme en terrain pentu.",
  },
  {
    id: "27284",
    slug: "gisors",
    nom: "Gisors",
    a: "à Gisors",
    de: "de Gisors",
    lon: 1.7642,
    lat: 49.2775,
    km: 52,
    direction: "est",
    tier: "primary",
    departement: "Eure",
    region: "Normandie",
    voisins: ["vernon", "beauvais", "mantes-la-jolie", "louviers"],
    intro:
      "Gisors est à une cinquantaine de kilomètres à l’est de Rouen, dans le Vexin normand. Les interventions y sont possibles selon la nature du chantier.",
    contexte:
      "Le Vexin normand est un plateau agricole entaillé par la vallée de l’Epte, sur laquelle Gisors est installée. Les arbres y sont souvent isolés en pleine parcelle ou groupés en bosquets et alignements de bord de route — des situations où la question de la voie publique se pose dès la préparation du chantier.",
    servicesIntro:
      "Sujets isolés, alignements, bosquets : la proximité de la route est ici la contrainte la plus fréquente.",
    description:
      "Élagueur à Gisors, dans le Vexin normand, à 52 km de Rouen. Élagage, abattage et dessouchage, y compris à proximité d’une voie de circulation.",
  },
  {
    id: "27056",
    slug: "bernay",
    nom: "Bernay",
    a: "à Bernay",
    de: "de Bernay",
    lon: 0.5978,
    lat: 49.0912,
    km: 53,
    direction: "sud-ouest",
    tier: "primary",
    departement: "Eure",
    region: "Normandie",
    voisins: ["lisieux", "pont-audemer", "elbeuf", "evreux"],
    intro:
      "Bernay est à une cinquantaine de kilomètres au sud-ouest de Rouen, dans l’Eure. Les interventions y sont possibles selon la nature du chantier.",
    contexte:
      "Le secteur est vallonné, à la charnière entre la vallée de la Risle et les plateaux qui la bordent. L’habitat y est plus dispersé qu’en agglomération, avec des propriétés de bourg et des terrains isolés en pleine campagne. Pour ces derniers, la question de l’accès et de la sortie des bois se pose souvent avant celle de l’arbre lui-même.",
    servicesIntro:
      "Terrains de bourg ou parcelles isolées : deux organisations de chantier assez différentes.",
    description:
      "Élagueur à Bernay, dans l’Eure à 53 km de Rouen. Élagage, abattage, dessouchage et débroussaillage selon l’accès et l’ampleur du chantier.",
  },

  /* --------------------------------------------------------- EXTENDED --- */
  {
    id: "78361",
    slug: "mantes-la-jolie",
    nom: "Mantes-la-Jolie",
    a: "à Mantes-la-Jolie",
    de: "de Mantes-la-Jolie",
    lon: 1.6918,
    lat: 48.9961,
    km: 66,
    direction: "sud-est",
    tier: "extended",
    departement: "Yvelines",
    region: "Île-de-France",
    voisins: ["vernon", "gisors", "evreux", "louviers"],
    intro:
      "Un chantier à Mantes-la-Jolie ? Selon son ampleur et son organisation, un déplacement d’Arbres & Cimes peut être envisagé depuis Rouen.",
    contexte:
      "Mantes-la-Jolie se trouve dans les Yvelines, hors de la Normandie, à l’extrémité sud-est du rayon de déplacement. La commune reste sur l’axe de la vallée de la Seine, qui la relie directement à Rouen. À cette distance, un déplacement se justifie surtout pour un chantier d’une journée ou pour plusieurs arbres regroupés.",
    servicesIntro:
      "Le déplacement se décide au cas par cas : l’ampleur du chantier pèse davantage que la prestation demandée.",
    description:
      "Chantier d’élagage ou d’abattage à Mantes-la-Jolie ? Déplacement depuis Rouen envisageable selon l’ampleur et l’organisation. Devis gratuit.",
  },
  {
    id: "14366",
    slug: "lisieux",
    nom: "Lisieux",
    a: "à Lisieux",
    de: "de Lisieux",
    lon: 0.2426,
    lat: 49.1478,
    km: 70,
    direction: "sud-ouest",
    tier: "extended",
    departement: "Calvados",
    region: "Normandie",
    voisins: ["bernay", "pont-audemer", "elbeuf", "yvetot"],
    intro:
      "Un chantier à Lisieux ? Selon son ampleur et son organisation, un déplacement d’Arbres & Cimes peut être envisagé depuis Rouen.",
    contexte:
      "Lisieux est au cœur du pays d’Auge, dans le Calvados, à environ soixante-dix kilomètres de Rouen. Le secteur est bocager : arbres de haies, alignements de bord de parcelle et vergers y sont plus présents qu’en milieu urbain. Ce type de patrimoine se travaille souvent par ensembles, ce qui rend un déplacement plus facile à justifier qu’une intervention isolée.",
    servicesIntro:
      "En secteur bocager, un chantier porte rarement sur un seul arbre — c’est ce qui rend le déplacement envisageable.",
    description:
      "Élagage ou abattage à Lisieux, en pays d’Auge ? Déplacement depuis Rouen envisageable selon l’ampleur du chantier. Devis gratuit.",
  },
  {
    id: "60057",
    slug: "beauvais",
    nom: "Beauvais",
    a: "à Beauvais",
    de: "de Beauvais",
    lon: 2.0877,
    lat: 49.4425,
    km: 72,
    direction: "est",
    tier: "extended",
    departement: "Oise",
    region: "Hauts-de-France",
    voisins: ["gisors", "amiens", "mantes-la-jolie", "vernon"],
    intro:
      "Un chantier à Beauvais ? Selon son ampleur et son organisation, un déplacement d’Arbres & Cimes peut être envisagé depuis Rouen.",
    contexte:
      "Beauvais est dans l’Oise, en Hauts-de-France, plein est de Rouen à une soixante-douzaine de kilomètres. La commune est hors Normandie et hors du secteur d’intervention habituel : le déplacement n’a rien d’automatique et se décide chantier par chantier, en fonction du volume de travail à réaliser sur place.",
    servicesIntro:
      "Hors zone habituelle : le devis répond d’abord à la question de la faisabilité.",
    description:
      "Élagage ou abattage à Beauvais, dans l’Oise ? À 72 km de Rouen, le déplacement s’étudie au cas par cas selon le chantier. Devis gratuit.",
  },
  {
    id: "80001",
    slug: "abbeville",
    nom: "Abbeville",
    a: "à Abbeville",
    de: "d’Abbeville",
    lon: 1.8319,
    lat: 50.1101,
    km: 91,
    direction: "nord-est",
    tier: "extended",
    departement: "Somme",
    region: "Hauts-de-France",
    voisins: ["amiens", "beauvais", "bois-guillaume", "mont-saint-aignan"],
    intro:
      "Un chantier à Abbeville ? À plus de quatre-vingt-dix kilomètres de Rouen, un déplacement ne peut être envisagé que pour un chantier qui le justifie.",
    contexte:
      "Abbeville est dans la Somme, en Hauts-de-France, dans la basse vallée du fleuve. La commune se situe près de la limite du rayon de déplacement annoncé : à cette distance, une intervention ponctuelle n’est pas réaliste, et seul un chantier conséquent ou étalé sur plusieurs jours peut être organisé.",
    servicesIntro:
      "À cette distance, seul un chantier d’ampleur permet d’organiser une intervention.",
    description:
      "Chantier d’élagage ou d’abattage à Abbeville, dans la Somme ? À 91 km de Rouen, le déplacement s’étudie selon l’ampleur du chantier.",
  },
  {
    id: "80021",
    slug: "amiens",
    nom: "Amiens",
    a: "à Amiens",
    de: "d’Amiens",
    lon: 2.2847,
    lat: 49.8987,
    km: 100,
    direction: "nord-est",
    tier: "extended",
    departement: "Somme",
    region: "Hauts-de-France",
    voisins: ["abbeville", "beauvais", "gisors", "bois-guillaume"],
    intro:
      "Un chantier à Amiens ? Selon son ampleur et son organisation, un déplacement d’Arbres & Cimes peut être envisagé depuis Rouen.",
    contexte:
      "Amiens marque la limite du rayon de déplacement annoncé : cent kilomètres depuis Rouen, à vol d’oiseau. C’est le point le plus éloigné présenté sur la carte, et il est là pour donner une échelle, pas pour promettre une intervention. Un chantier amiénois se discute au téléphone avant toute chose.",
    servicesIntro:
      "À la limite du rayon annoncé, un échange préalable vaut mieux qu’un devis à l’aveugle.",
    description:
      "Chantier d’élagage ou d’abattage à Amiens ? À 100 km de Rouen, limite du rayon annoncé : le déplacement s’étudie au cas par cas.",
  },
] as const;

/* ------------------------------------------------------------- Accès --- */

const BY_SLUG = new Map(LOCATIONS.map((location) => [location.slug, location]));

export function getLocation(slug: string): Location | undefined {
  return BY_SLUG.get(slug);
}

export const LOCATION_SLUGS: readonly string[] = LOCATIONS.map((l) => l.slug);

/** Rapprochement avec les données de la carte, par code INSEE. */
const BY_CODE = new Map(LOCATIONS.map((location) => [location.id, location]));

export function locationByCode(code: string): Location | undefined {
  return BY_CODE.get(code);
}

/** Distance orthodromique entre deux communes, en kilomètres. */
function distanceKm(a: Location, b: Location): number {
  const R = 6371.0088;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Nombre maximal de voisins affichés sur une page ville. */
const MAX_VOISINS = 6;

/**
 * Voisins d'une commune — RENDUS RÉCIPROQUES en phase 17B.
 *
 * LE VOISINAGE N'ÉTAIT PAS SYMÉTRIQUE, ET C'ÉTAIT UN DÉFAUT DE MODÈLE
 * -------------------------------------------------------------------
 * Chaque commune citait ses quatre plus proches. Mais « être parmi les quatre
 * plus proches » ne se rend pas : Abbeville cite Amiens sans qu'aucune commune
 * ne cite Abbeville. Mesuré sur les dix-neuf :
 *
 * | Citée comme voisine | Communes |
 * | --- | --- |
 * | 7 fois | Mont-Saint-Aignan, Sotteville, Le Grand-Quevilly |
 * | **1 fois** | **Abbeville** |
 *
 * Les communes du cœur, déjà les mieux reliées, recevaient donc sept fois plus
 * de liens internes que les périphériques — exactement l'inverse de ce dont
 * ces dernières ont besoin pour exister dans l'index.
 *
 * La correction n'ajoute aucune donnée et ne choisit rien à la main : si A
 * cite B, alors B cite A. Le voisinage géographique **est** une relation
 * symétrique ; ne pas la modéliser ainsi était l'erreur.
 *
 * Résultat : plus aucune commune sous quatre voisins, et le lien devient
 * réciproque dans les deux sens de la navigation.
 *
 * TRI PAR DISTANCE RÉELLE, PAS PAR ORDRE D'INSERTION
 * ---------------------------------------------------
 * Les voisins ajoutés par réciprocité arriveraient sinon en fin de liste, quel
 * que soit leur éloignement. Le tri est recalculé sur les coordonnées, et la
 * liste est bornée à {@link MAX_VOISINS} : sans borne, Elbeuf en afficherait
 * huit, soit deux rangées de cartes pour un bloc secondaire.
 */
export function neighboursOf(location: Location): readonly Location[] {
  const slugs = new Set(location.voisins);

  for (const autre of LOCATIONS) {
    if (autre.slug !== location.slug && autre.voisins.includes(location.slug)) {
      slugs.add(autre.slug);
    }
  }

  return [...slugs]
    .map((slug) => BY_SLUG.get(slug))
    .filter((item): item is Location => item !== undefined)
    .sort((a, b) => distanceKm(location, a) - distanceKm(location, b))
    .slice(0, MAX_VOISINS);
}

/* ------------------------------------------------------- Regroupements --- */

export type LocationGroup = {
  id: string;
  titre: string;
  /** Une phrase : ce que le groupe recouvre réellement. */
  detail: string;
  locations: readonly Location[];
};

const inMetropole = (l: Location) => l.tier === "core";

/**
 * Quatre groupes pour le hub de `/zones-intervention`.
 *
 * Ils suivent des **faits géographiques**, pas un découpage commercial :
 * appartenance à la métropole, puis département, puis distance. Un visiteur
 * qui connaît la région doit y retrouver sa commune là où il l'attend.
 */
export const LOCATION_GROUPS: readonly LocationGroup[] = [
  {
    id: "metropole",
    titre: "Métropole Rouen Normandie",
    detail: "Zone principale d’intervention.",
    locations: LOCATIONS.filter(inMetropole),
  },
  {
    id: "seine-maritime",
    titre: "Reste de la Seine-Maritime",
    detail: "Le pays de Caux.",
    locations: LOCATIONS.filter(
      (l) => !inMetropole(l) && l.departement === "Seine-Maritime",
    ),
  },
  {
    id: "eure",
    titre: "Eure et vallée de Seine",
    detail: "Secteurs sud et ouest.",
    locations: LOCATIONS.filter((l) => l.departement === "Eure"),
  },
  {
    id: "elargie",
    titre: "Déplacements élargis",
    detail: "Hors Normandie ou au-delà de 60 km — selon le chantier.",
    locations: LOCATIONS.filter(
      (l) => l.departement !== "Seine-Maritime" && l.departement !== "Eure",
    ),
  },
] as const;
