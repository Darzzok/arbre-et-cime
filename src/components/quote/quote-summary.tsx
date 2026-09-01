import { cn } from "@/lib/cn";
import {
  CONSTRAINT_OPTIONS,
  HEIGHT_OPTIONS,
  type QuoteDraft,
  choiceLabel,
  countOptionsFor,
  needLabel,
  needsHeight,
} from "@/lib/quote-flow";

/**
 * Récapitulatif éditable, posé à l'étape 5 — **pas une sixième étape**.
 *
 * `QUOTE_FLOW.md` § 2 demande « un récapitulatif complet, éditable étape par
 * étape » avant l'envoi ; le brief interdit d'ajouter une étape. Les deux
 * tiennent ensemble ici : le récapitulatif vit au-dessus des coordonnées, à
 * l'endroit exact où la personne s'apprête à s'engager, et chaque ligne
 * renvoie à son étape.
 *
 * Les photos sont comptées, jamais listées : leurs vignettes sont à l'étape 3,
 * les répéter ici allongerait l'écran sans rien apprendre.
 */

type SummaryProps = {
  draft: QuoteDraft;
  photoCount: number;
  onJump: (index: number) => void;
};

type Row = {
  label: string;
  value: string;
  stepIndex: number;
};

export function QuoteSummary({ draft, photoCount, onJump }: SummaryProps) {
  const rows: Row[] = [];

  rows.push({
    label: "Intervention",
    value: needLabel(draft.besoin) || "—",
    stepIndex: 0,
  });

  const chantier = [
    choiceLabel(countOptionsFor(draft.besoin), draft.nombre),
    needsHeight(draft.besoin)
      ? choiceLabel(HEIGHT_OPTIONS, draft.hauteur)
      : "",
    draft.contraintes
      .map((id) => choiceLabel(CONSTRAINT_OPTIONS, id))
      .filter(Boolean)
      .join(", "),
  ].filter(Boolean);

  rows.push({
    label: "Chantier",
    value: chantier.length > 0 ? chantier.join(" · ") : "—",
    stepIndex: 1,
  });

  rows.push({
    label: "Photos",
    value:
      photoCount > 0
        ? `${photoCount} photo${photoCount > 1 ? "s" : ""} jointe${photoCount > 1 ? "s" : ""}`
        : "Aucune photo",
    stepIndex: 2,
  });

  const lieu = [draft.adresse.trim(), `${draft.codePostal} ${draft.ville}`.trim()]
    .filter(Boolean)
    .join(", ");

  rows.push({
    label: "Lieu",
    value: lieu || "—",
    stepIndex: 3,
  });

  return (
    <div className="rounded-card border border-(--surface-rule) bg-(--surface-inset) p-5 text-left sm:p-6">
      <h3 className="font-sans text-caption font-semibold uppercase tracking-[0.12em] text-(--surface-fg-muted)">
        Votre demande
      </h3>

      <dl className="mt-4 space-y-3.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-(--surface-rule) pt-3.5 first:border-t-0 first:pt-0"
          >
            <dt className="font-sans text-caption uppercase tracking-[0.12em] text-(--surface-fg-muted)">
              {row.label}
            </dt>

            <dd className="flex min-w-0 flex-1 items-baseline justify-end gap-3">
              <span className="min-w-0 text-right font-sans text-body text-(--surface-fg)">
                {row.value}
              </span>

              <button
                type="button"
                onClick={() => onJump(row.stepIndex)}
                className={cn(
                  "shrink-0 rounded-edge font-sans text-caption font-semibold",
                  "text-(--surface-fg-muted) underline underline-offset-4",
                  "motion-safe:transition-colors motion-safe:duration-(--duration-micro)",
                  "hover:text-(--surface-fg)",
                )}
              >
                Modifier
                <span className="sr-only"> {row.label.toLowerCase()}</span>
              </button>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
