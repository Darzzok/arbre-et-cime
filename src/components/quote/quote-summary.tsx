import { cn } from "@/lib/cn";
import {
  CONSTRAINT_OPTIONS,
  COUNT_OPTIONS,
  HEIGHT_OPTIONS,
  OUTDOOR_SCALE_OPTIONS,
  OUTDOOR_WORK_OPTIONS,
  STUMP_SIZE_OPTIONS,
  choiceLabel,
  choiceLabels,
  needLabel,
} from "@/lib/quote";
import type { Chantier, QuoteDraft } from "@/lib/quote";

/**
 * Récapitulatif compact, posé à l'étape 5 — **pas une sixième étape**.
 *
 * `QUOTE_FLOW.md` § 2 demande un récapitulatif éditable avant l'envoi ; le
 * brief interdit d'ajouter une étape. Les deux tiennent ensemble ici : le
 * récapitulatif vit au-dessus des coordonnées, à l'endroit exact où la
 * personne s'apprête à s'engager, et chaque ligne renvoie à son étape.
 *
 * Volontairement **compact** : quatre lignes, pas une page de résumé. La
 * version complète est l'écran de fin.
 */

type SummaryProps = {
  draft: QuoteDraft;
  photoCount: number;
  onJump: (index: number) => void;
};

/** Résume le chantier en une ligne, quelle que soit sa variante. */
function describeChantier(chantier: Chantier): string {
  switch (chantier.kind) {
    case "arbre":
      return [
        choiceLabel(COUNT_OPTIONS, chantier.nombre),
        choiceLabel(HEIGHT_OPTIONS, chantier.hauteur),
        choiceLabels(CONSTRAINT_OPTIONS, chantier.contraintes),
      ]
        .filter(Boolean)
        .join(" · ");

    case "souche":
      return [
        choiceLabel(COUNT_OPTIONS, chantier.nombre),
        choiceLabel(STUMP_SIZE_OPTIONS, chantier.taille),
        choiceLabels(CONSTRAINT_OPTIONS, chantier.contraintes),
      ]
        .filter(Boolean)
        .join(" · ");

    case "exterieur":
      return [
        choiceLabels(OUTDOOR_WORK_OPTIONS, chantier.travaux),
        choiceLabel(OUTDOOR_SCALE_OPTIONS, chantier.ampleur),
        choiceLabels(CONSTRAINT_OPTIONS, chantier.contraintes),
      ]
        .filter(Boolean)
        .join(" · ");

    case "inconnu": {
      const description = chantier.description.trim();
      if (!description) return "À préciser au téléphone";
      // Tronqué : le récapitulatif est un coup d'œil, pas une relecture.
      return description.length > 90
        ? `${description.slice(0, 90)}…`
        : description;
    }
  }
}

export function QuoteSummary({ draft, photoCount, onJump }: SummaryProps) {
  const rows = [
    {
      label: "Intervention",
      value: needLabel(draft.besoin) || "—",
      stepIndex: 0,
    },
    {
      label: "Chantier",
      value: describeChantier(draft.chantier) || "—",
      stepIndex: 1,
    },
    {
      label: "Photos",
      value:
        photoCount > 0
          ? `${photoCount} photo${photoCount > 1 ? "s" : ""} jointe${photoCount > 1 ? "s" : ""}`
          : "Aucune photo",
      stepIndex: 2,
    },
    {
      label: "Lieu",
      value:
        [draft.lieu.adresse.trim(), `${draft.lieu.codePostal} ${draft.lieu.ville}`.trim()]
          .filter(Boolean)
          .join(", ") || "—",
      stepIndex: 3,
    },
  ];

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
