import { emptyChantier } from "@/lib/quote/conditional";
import type {
  QuoteDraft,
  QuoteErrors,
  QuoteStepId,
} from "@/lib/quote/types";

/**
 * Règles de validation — centralisées, pures, testables.
 *
 * Aucune de ces fonctions ne touche au DOM, à React ni au stockage. C'est ce
 * qui permettra à la route serveur de la phase 13 d'appeler `validateStep()`
 * telle quelle : le navigateur et le serveur appliqueront la même règle, sans
 * duplication et sans dérive possible.
 *
 * Les messages sont rédigés pour la personne qui remplit, pas pour un
 * développeur : ils disent quoi faire, jamais « champ invalide ».
 */

/* ------------------------------------------------------------ Brouillon -- */

export const EMPTY_DRAFT: QuoteDraft = {
  besoin: "",
  chantier: emptyChantier("inconnu"),
  lieu: { codePostal: "", ville: "", adresse: "" },
  contact: {
    nom: "",
    telephone: "",
    email: "",
    commentaire: "",
    consentement: false,
  },
};

/* -------------------------------------------------------------- Formats -- */

const POSTAL_CODE = /^\d{5}$/;

/**
 * Adresse e-mail — volontairement permissive.
 *
 * Une expression rationnelle « complète » au sens de la RFC 5322 fait des
 * centaines de caractères et rejette des adresses valides. Le seul test qui
 * compte ici est structurel : quelque chose, un `@`, un domaine avec un point.
 * La vérification réelle, c'est l'e-mail qui arrive — phase 13.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Retire tout ce qui n'est pas un chiffre ou un `+` initial. */
export function normalisePhone(value: string): string {
  return value.replace(/[\s.\-()/]/g, "");
}

/**
 * Téléphone français — raisonnable, pas tatillon.
 *
 * Accepte `0612345678`, `06 12 34 56 78`, `+33612345678`, `0033 6 12 34 56 78`.
 * Le brief est explicite : ne pas être excessivement strict sur les espaces ou
 * le préfixe. Refuser un numéro correct mal espacé fait perdre un prospect,
 * ce qui coûte infiniment plus cher qu'un numéro douteux à rappeler.
 */
export function isValidPhone(value: string): boolean {
  const digits = normalisePhone(value);
  return /^(?:\+33|0033|0)[1-9]\d{8}$/.test(digits);
}

export function isValidPostalCode(value: string): boolean {
  return POSTAL_CODE.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

/* ----------------------------------------------------------- Validation -- */

/**
 * Valide UNE étape. Objet vide = étape franchissable.
 *
 * Seuls les champs **réellement requis pour le besoin choisi** sont contrôlés :
 * la validation lit la même union discriminée que l'affichage, donc elle ne
 * peut pas exiger une hauteur sur un dessouchage — le champ n'existe pas.
 */
export function validateStep(
  step: QuoteStepId,
  draft: QuoteDraft,
): QuoteErrors {
  const errors: QuoteErrors = {};

  switch (step) {
    case "besoin": {
      if (!draft.besoin) {
        errors.besoin = "Choisissez une intervention pour continuer.";
      }
      return errors;
    }

    case "chantier": {
      const chantier = draft.chantier;

      if (chantier.kind === "arbre") {
        if (!chantier.nombre) {
          errors.nombre = "Indiquez combien d’arbres sont concernés.";
        }
        if (!chantier.hauteur) {
          errors.hauteur =
            "Indiquez une hauteur approximative, ou « Je ne sais pas ».";
        }
      }

      if (chantier.kind === "souche") {
        if (!chantier.nombre) {
          errors.nombre = "Indiquez combien de souches sont concernées.";
        }
        if (!chantier.taille) {
          errors.taille = "Indiquez une taille, ou « Je ne sais pas ».";
        }
      }

      if (chantier.kind === "exterieur") {
        if (chantier.travaux.length === 0) {
          errors.travaux = "Sélectionnez au moins un type de travaux.";
        }
        if (!chantier.ampleur) {
          errors.ampleur = "Indiquez l’ampleur, ou « Je ne sais pas ».";
        }
      }

      /*
       * « Je ne sais pas » ne valide RIEN.
       *
       * C'est le parcours simplifié demandé au brief : quelqu'un qui ne sait
       * pas nommer l'intervention ne doit pas être arrêté par une question.
       * La description est proposée, jamais exigée — le reste se règle au
       * téléphone.
       */
      if (chantier.kind === "inconnu") {
        return errors;
      }

      if (chantier.contraintes.length === 0) {
        errors.contraintes =
          "Sélectionnez au moins une situation, ou « Aucune de ces situations ».";
      }

      return errors;
    }

    // Les photos accélèrent le chiffrage, elles ne conditionnent jamais la
    // demande (`CONVERSION_STRATEGY.md` § 5).
    case "photos":
      return errors;

    case "lieu": {
      if (!isValidPostalCode(draft.lieu.codePostal)) {
        errors.codePostal = "Indiquez un code postal à 5 chiffres.";
      }
      if (draft.lieu.ville.trim().length < 2) {
        errors.ville = "Indiquez la commune du chantier.";
      }
      // L'adresse reste facultative à ce stade : elle est demandée à la prise
      // de rendez-vous, pas pour établir un devis.
      return errors;
    }

    case "coordonnees": {
      const { nom, telephone, email, consentement } = draft.contact;

      if (!nom.trim()) {
        errors.nom = "Indiquez votre nom.";
      }

      if (!telephone.trim()) {
        errors.telephone = "Indiquez un numéro pour vous rappeler.";
      } else if (!isValidPhone(telephone)) {
        errors.telephone =
          "Ce numéro semble incomplet. Exemple : 06 12 34 56 78.";
      }

      if (!email.trim()) {
        errors.email = "Indiquez une adresse e-mail.";
      } else if (!isValidEmail(email)) {
        errors.email = "Cette adresse e-mail semble incomplète.";
      }

      if (!consentement) {
        errors.consentement =
          "Votre accord est nécessaire pour traiter la demande.";
      }

      return errors;
    }
  }
}

export function isStepComplete(step: QuoteStepId, draft: QuoteDraft): boolean {
  return Object.keys(validateStep(step, draft)).length === 0;
}

/** Toutes les étapes sont-elles valides ? Utilisé avant l'envoi. */
export function isDraftComplete(draft: QuoteDraft): boolean {
  return (
    isStepComplete("besoin", draft) &&
    isStepComplete("chantier", draft) &&
    isStepComplete("lieu", draft) &&
    isStepComplete("coordonnees", draft)
  );
}
