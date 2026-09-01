import type { NeedId, QuoteStepId } from "@/lib/quote/types";

/**
 * Point d'émission des événements de conversion — **inerte en phase 12**.
 *
 * Aucun service d'analytics n'est connecté, aucune requête n'est faite, aucun
 * script tiers n'est chargé. Ce module existe pour une seule raison : que la
 * phase 16 n'ait pas à rouvrir les composants du configurateur.
 *
 * Les points d'appel sont posés **maintenant**, pendant qu'on écrit la logique
 * et qu'on sait exactement ce qui se passe à chaque endroit. Les retrouver
 * dans six mois, dans un composant qu'on aura oublié, coûterait bien plus cher
 * qu'une fonction vide aujourd'hui.
 *
 * BRANCHEMENT EN PHASE 16
 * -----------------------
 * Remplacer le corps de `emitQuoteEvent()` par l'appel de l'outil retenu
 * (Plausible ou Umami — sans cookie, donc sans bandeau de consentement, voir
 * `CONVERSION_STRATEGY.md` § 7). Rien d'autre à modifier.
 *
 * **Aucune donnée personnelle ne doit jamais transiter par ici.** Les charges
 * utiles ci-dessous sont volontairement limitées à des identifiants d'étape,
 * des noms de prestation et des compteurs. Ni nom, ni téléphone, ni e-mail, ni
 * adresse, ni nom de fichier — l'interface elle-même rend l'erreur difficile.
 */

export type QuoteEvent =
  | { name: "quote_started" }
  | { name: "quote_step_completed"; step: QuoteStepId; index: number }
  | { name: "quote_photo_added"; count: number }
  | { name: "quote_ready_to_submit"; besoin: NeedId | ""; photoCount: number };

/**
 * Émet un événement de parcours.
 *
 * En phase 12 : **ne fait rien**. Volontairement pas de `console.log` — le
 * brief interdit de journaliser les données de formulaire, et prendre
 * l'habitude de tracer ici finirait par y faire passer un jour une donnée
 * personnelle.
 */
export function emitQuoteEvent(event: QuoteEvent): void {
  // Phase 16 : brancher ici l'outil de mesure.
  void event;
}
