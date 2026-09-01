import { cn } from "@/lib/cn";

/**
 * Pastille de choix de l'étape 2 — radio ou case à cocher selon la question.
 *
 * Même principe que `ChoiceCard` : le contrôle natif existe réellement,
 * masqué en `sr-only` et enveloppé par le `<label>`. Un groupe de radios reste
 * donc parcourable aux flèches, une case à cocher reste basculable à la barre
 * d'espace, et le lecteur d'écran annonce le bon rôle sans un seul attribut
 * `aria-*`.
 *
 * TRAITEMENT REPRIS — LA PASTILLE EST UN OBJET, PAS UN CONTOUR
 * ------------------------------------------------------------
 * La première version posait un simple filet sur le fond de page : une rangée
 * de rectangles vides, sans matière, qui donnait à l'étape 2 son air de
 * formulaire administratif. Désormais :
 *
 * - **au repos**, la pastille a un fond (`--surface-inset`) : elle se lit
 *   comme une chose qu'on peut toucher, pas comme un cadre dessiné ;
 * - **sélectionnée**, elle bascule en **aplat forêt, texte ivoire**. C'est le
 *   contraste le plus fort de la charte (14,04), donc le choix retenu se
 *   repère d'un coup d'œil au milieu de six options.
 *
 * Le jaune sécurité reste réservé au **repère de validation** : il compte une
 * dizaine de pixels et ne devient jamais un aplat, conformément à la règle
 * « maximum une occurrence pleine par écran visible ».
 */

type ChoiceChipProps = {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  describedBy?: string;
  /** Rang dans le groupe — cadence l'apparition en cascade. */
  index?: number;
};

export function ChoiceChip({
  type,
  name,
  value,
  checked,
  onChange,
  label,
  describedBy,
  index = 0,
}: ChoiceChipProps) {
  return (
    <label
      data-quote-chip=""
      style={{ "--chip-index": index } as React.CSSProperties}
      className={cn(
        "group relative inline-flex min-h-11 cursor-pointer items-center gap-2.5",
        "rounded-edge px-4 py-2.5 text-left",
        "border font-sans text-body",
        "motion-safe:transition-[background-color,border-color,color,scale]",
        "motion-safe:duration-(--duration-micro) motion-safe:ease-cime",
        checked
          ? "border-forest bg-forest font-semibold text-ivory motion-safe:scale-[1.02]"
          : "border-(--surface-rule) bg-(--surface-inset) text-(--surface-fg) hover:border-(--surface-fg-muted) hover:bg-(--surface-inset)",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2",
        "has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--focus-ring)",
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        aria-describedby={describedBy}
        className="sr-only"
      />

      {/* Repère de sélection : la couleur ne porte jamais l'information seule.
          Carré pour un choix multiple, rond pour un choix unique — la forme
          annonce le comportement avant même la première sélection. */}
      <span
        aria-hidden="true"
        className={cn(
          "flex size-5 shrink-0 items-center justify-center border",
          type === "checkbox" ? "rounded-edge" : "rounded-full",
          "motion-safe:transition-colors",
          "motion-safe:duration-(--duration-micro) motion-safe:ease-cime",
          checked
            ? "border-safety bg-safety text-charcoal"
            : "border-(--surface-rule) bg-transparent text-transparent",
        )}
      >
        <svg
          viewBox="0 0 16 16"
          className={cn(
            "size-3",
            "motion-safe:transition-transform motion-safe:duration-(--duration-micro)",
            "motion-safe:ease-cime",
            checked ? "motion-safe:scale-100" : "motion-safe:scale-50",
          )}
        >
          <path
            d="M3.5 8.5l3 3 6-6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {label}
    </label>
  );
}
