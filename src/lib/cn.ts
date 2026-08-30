type ClassValue = string | false | null | undefined;

/**
 * Concatene des classes en ignorant les valeurs vides.
 *
 * Volontairement minimal : pas de fusion de classes Tailwind concurrentes, donc
 * pas de dependance (`clsx`, `tailwind-merge`). La `className` passee a une
 * primitive doit rester ADDITIVE (espacement, largeur de colonne, alignement)
 * et ne jamais tenter d'ecraser une propriete deja posee par la primitive : ce
 * cas releve d'une variante a ajouter au composant.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
