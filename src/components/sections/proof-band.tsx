import { Container, Reveal } from "@/components/ui";
import { cn } from "@/lib/cn";
import { area, site } from "@/lib/site";

/**
 * Section 2 des 7 sections VERROUILLÉES — les preuves.
 *
 * Bande **compacte**, posée sous le hero sur la même surface forêt : une ligne
 * de repères qui se lit d'un coup d'œil, pas un bloc à part entière.
 *
 * Valeurs en **Manrope**, pas en Fraunces : un serif de grande taille
 * occuperait toute la hauteur et ferait « section », alors qu'on veut une
 * réglure. Aucune carte, aucun pictogramme, aucune ombre.
 *
 * Pas de `<section>` : sans titre visible, un point de repère anonyme n'aide
 * personne. Un `<div>` porteur d'une liste est plus juste.
 */

/**
 * Quatre repères, pas un de plus. Tous vérifiables dans `PROJECT.md` :
 * aucune certification inventée, aucun tarif, aucune promesse de délai.
 */
const proofs = [
  { value: `${site.experienceYears} ans`, label: "d’expérience du métier" },
  { value: "Diplômé", label: "CS Taille et soins des arbres" },
  { value: "Devis gratuit", label: "et sans engagement" },
  { value: `Jusqu’à ${area.maxRadiusKm} km`, label: "de rayon d’intervention" },
];

export function ProofBand() {
  return (
    <div
      data-surface="dark"
      className="border-t border-(--surface-rule) bg-(--surface-bg) text-(--surface-fg)"
    >
      <Container>
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {proofs.map((proof) => (
            <Reveal
              as="li"
              key={proof.value}
              className={cn(
                "py-5 lg:py-6",
                "border-(--surface-rule)",
                // Filets mobiles : entre les deux colonnes, entre les rangées.
                "[&:nth-child(even)]:border-l",
                "[&:nth-child(n+3)]:border-t",
                // Desktop : quatre colonnes, un filet vertical entre chacune.
                "lg:border-l lg:[&:nth-child(n+3)]:border-t-0",
                "lg:first:border-l-0",
              )}
            >
              {/* Accent jaune réduit à un trait de 16 px : présent, jamais
                  dominant (règle de parcimonie, DESIGN_SYSTEM.md § 1). */}
              <span
                aria-hidden="true"
                className="mx-auto block h-0.5 w-4 bg-safety"
              />

              <p
                className={cn(
                  // 20 px sur mobile pour que « Jusqu'à 100 km » tienne sur
                  // une ligne dans une colonne de 168 px, 26 px au-delà.
                  "mt-3.5 font-sans text-[1.25rem] font-semibold lg:text-subtitle",
                  "leading-none tracking-tight text-(--surface-heading)",
                )}
              >
                {proof.value}
              </p>

              <p className="mt-2 font-sans text-caption text-(--surface-fg-muted)">
                {proof.label}
              </p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </div>
  );
}
