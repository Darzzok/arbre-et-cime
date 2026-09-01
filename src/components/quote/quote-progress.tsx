import { cn } from "@/lib/cn";
import { ESTIMATED_MINUTES, QUOTE_STEPS, STEP_COUNT } from "@/lib/quote-flow";

/**
 * Progression du configurateur — deux traitements, un seul état.
 *
 * Posée sur le **bandeau sombre** du configurateur : sur l'ivoire, le filet de
 * progression était un cheveu gris sur un fond crème, invisible à un mètre.
 * Sur forêt, le jaune sécurité atteint 7,16 et la progression devient le
 * premier repère lu en arrivant sur l'étape.
 *
 * Mobile : « 03 / 05 », un filet, le nom de l'étape. Rien de plus. Une grande
 * barre mangerait le premier écran d'un téléphone au profit d'une information
 * que deux chiffres portent aussi bien.
 *
 * Desktop : les cinq étapes nommées, chacune sur son filet. La place existe,
 * et voir le chemin restant réduit l'abandon.
 *
 * La progression est aussi **textuelle** (`QUOTE_FLOW.md` § 4) : « Étape 3 sur
 * 5 — Photos » est lisible par un lecteur d'écran, jamais porté par la seule
 * couleur d'un filet.
 */

type QuoteProgressProps = {
  current: number;
  /** Étapes déjà validées : seules celles-ci sont cliquables en arrière. */
  furthest: number;
  onJump: (index: number) => void;
};

export function QuoteProgress({
  current,
  furthest,
  onJump,
}: QuoteProgressProps) {
  const step = QUOTE_STEPS[current] ?? QUOTE_STEPS[0]!;
  const ratio = (current + 1) / STEP_COUNT;

  return (
    <div>
      {/* ------------------------------------------------------- Mobile --- */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-sans text-caption font-semibold tabular-nums tracking-[0.12em] text-(--surface-fg)">
            <span aria-hidden="true">
              <span className="text-(--color-safety)">
                {String(current + 1).padStart(2, "0")}
              </span>
              <span className="text-(--surface-fg-muted)">
                {" "}
                / {String(STEP_COUNT).padStart(2, "0")}
              </span>
            </span>
            <span className="sr-only">
              Étape {current + 1} sur {STEP_COUNT} — {step.label}
            </span>
          </p>

          <p className="font-sans text-caption text-(--surface-fg-muted)">
            {current === 0 ? `Environ ${ESTIMATED_MINUTES} minutes` : step.label}
          </p>
        </div>

        {/* 2 px et non 1 : sur un téléphone, un filet d'un pixel disparaît. */}
        <div
          aria-hidden="true"
          className="mt-3 h-0.5 w-full overflow-hidden rounded-edge bg-(--surface-rule)"
        >
          <div
            className={cn(
              "h-full rounded-edge bg-(--color-safety)",
              "motion-safe:transition-[width] motion-safe:duration-(--duration-reveal)",
              "motion-safe:ease-cime",
            )}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>

      {/* ------------------------------------------------------ Desktop --- */}
      <ol className="hidden md:flex md:items-start md:gap-2.5">
        {QUOTE_STEPS.map((item, index) => {
          const done = index < current;
          const active = index === current;
          const reachable = index <= furthest;

          return (
            <li key={item.id} className="flex-1">
              {/* Le filet EST le repère de progression : il se remplit, il ne
                  change pas d'épaisseur. L'étape en cours est pleine, les
                  précédentes aussi, les suivantes restent en creux. */}
              <span
                aria-hidden="true"
                className={cn(
                  "block h-0.5 w-full rounded-edge",
                  "motion-safe:transition-colors motion-safe:duration-(--duration-reveal)",
                  "motion-safe:ease-cime",
                  done || active
                    ? "bg-(--color-safety)"
                    : "bg-(--surface-rule)",
                )}
              />

              <button
                type="button"
                onClick={() => onJump(index)}
                disabled={!reachable || active}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "mt-3 flex w-full items-baseline gap-2 rounded-edge text-left",
                  "font-sans text-caption",
                  "motion-safe:transition-colors motion-safe:duration-(--duration-micro)",
                  active
                    ? "font-semibold text-(--surface-fg)"
                    : done
                      ? "text-(--surface-fg-muted)"
                      : "text-(--surface-fg-muted)/70",
                  reachable && !active
                    ? "hover:text-(--surface-fg)"
                    : "cursor-default",
                  "disabled:cursor-default",
                )}
              >
                <span
                  className={cn(
                    "tabular-nums",
                    active && "text-(--color-safety)",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
                <span className="sr-only">
                  {done
                    ? "— étape complétée, revenir à cette étape"
                    : active
                      ? `— étape en cours, ${index + 1} sur ${STEP_COUNT}`
                      : "— étape à venir"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
