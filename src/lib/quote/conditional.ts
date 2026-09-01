import type {
  Chantier,
  ChantierKind,
  NeedId,
  QuoteDraft,
} from "@/lib/quote/types";

/**
 * Logique conditionnelle : quelles questions, et que garder quand le besoin
 * change.
 *
 * Tout est ici, et rien n'est ailleurs. Un composant qui déciderait lui-même
 * de masquer une question ferait diverger l'affichage de la validation — le
 * bouton « Continuer » resterait bloqué sur un champ invisible.
 */

/* ---------------------------------------------------- Besoin → chantier -- */

const KIND_BY_NEED: Record<NeedId, ChantierKind> = {
  elagage: "arbre",
  abattage: "arbre",
  dessouchage: "souche",
  "entretien-exterieur": "exterieur",
  inconnu: "inconnu",
};

export function chantierKindFor(besoin: NeedId | ""): ChantierKind {
  return besoin === "" ? "inconnu" : KIND_BY_NEED[besoin];
}

/** Chantier vide du bon type. Jamais de champ `undefined` à l'écran. */
export function emptyChantier(kind: ChantierKind): Chantier {
  switch (kind) {
    case "arbre":
      return { kind, contraintes: [], nombre: "", hauteur: "" };
    case "souche":
      return { kind, contraintes: [], nombre: "", taille: "" };
    case "exterieur":
      return { kind, contraintes: [], travaux: [], ampleur: "" };
    case "inconnu":
      return { kind, contraintes: [], description: "" };
  }
}

/**
 * Change le besoin en **conservant tout ce qui reste valable**.
 *
 * C'est la règle du § 4 du brief : ne nettoyer que ce qui est réellement
 * devenu invalide. Concrètement :
 *
 * | Transition | Conservé | Perdu |
 * | --- | --- | --- |
 * | élagage ↔ abattage | tout | rien |
 * | arbre → souche | contraintes, nombre | hauteur |
 * | souche → arbre | contraintes, nombre | taille |
 * | arbre/souche → extérieur | contraintes | nombre, hauteur/taille |
 * | vers « je ne sais pas » | contraintes | le reste |
 *
 * Les **contraintes survivent toujours** : un accès difficile le reste quelle
 * que soit la prestation. Le `nombre` survit entre arbre et souche : « 2 à 3 »
 * garde le même sens. La hauteur ne survit pas vers une souche — c'est
 * précisément ce que le type interdit.
 */
export function changeNeed(draft: QuoteDraft, besoin: NeedId): QuoteDraft {
  const nextKind = chantierKindFor(besoin);
  const previous = draft.chantier;

  if (previous.kind === nextKind) {
    return { ...draft, besoin };
  }

  const base = emptyChantier(nextKind);
  const contraintes = previous.contraintes;

  // Le nombre traverse arbre ↔ souche : la fourchette a le même sens.
  const nombre =
    (previous.kind === "arbre" || previous.kind === "souche") &&
    (base.kind === "arbre" || base.kind === "souche")
      ? previous.nombre
      : "";

  switch (base.kind) {
    case "arbre":
      return { ...draft, besoin, chantier: { ...base, contraintes, nombre } };
    case "souche":
      return { ...draft, besoin, chantier: { ...base, contraintes, nombre } };
    case "exterieur":
      return { ...draft, besoin, chantier: { ...base, contraintes } };
    case "inconnu":
      return { ...draft, besoin, chantier: { ...base, contraintes } };
  }
}

/* ------------------------------------------------------- Intitulés liés -- */

/**
 * L'intitulé du « combien » suit le sujet compté.
 *
 * Les réponses, elles, ne changent pas : compter des souches n'est pas
 * compter des arbres, mais les mêmes fourchettes conviennent aux deux.
 */
export function countQuestionFor(kind: ChantierKind): string {
  switch (kind) {
    case "arbre":
      return "Combien d’arbres sont concernés ?";
    case "souche":
      return "Combien de souches sont concernées ?";
    default:
      return "Combien de sujets sont concernés ?";
  }
}

/** Le chantier a-t-il quelque chose à compter ? */
export function hasCount(kind: ChantierKind): boolean {
  return kind === "arbre" || kind === "souche";
}

/**
 * La hauteur n'est posée que pour un arbre.
 *
 * Une souche n'a pas de hauteur ; une haie se taille à hauteur d'homme. Poser
 * la question produirait une donnée vide et donnerait au parcours l'air d'un
 * formulaire générique.
 */
export function hasHeight(kind: ChantierKind): boolean {
  return kind === "arbre";
}
