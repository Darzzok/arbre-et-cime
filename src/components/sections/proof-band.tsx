import { Card, Container, Reveal, Section } from "@/components/ui";
import { cn } from "@/lib/cn";
import { area, site } from "@/lib/site";

/**
 * Section 2 des 7 sections VERROUILLÉES — les preuves.
 *
 * REFAITE EN PHASE 15B.3 — DE LA RÉGLURE AUX CARTES
 * -------------------------------------------------
 * La version précédente était une bande de 121 px sur forêt, quatre colonnes
 * séparées par des filets d'un pixel. Mesurée telle quelle, elle se lisait
 * comme **une ligne de tableau** posée sous le hero : quatre valeurs alignées,
 * aucune matière, aucun poids.
 *
 * Elle est aussi ce qui rendait le hero interminable à l'œil — deux surfaces
 * sombres consécutives, la photographie puis la bande, sans respiration entre
 * les deux.
 *
 * Elle passe donc sur **sable** et devient quatre cartes. Le changement de
 * surface est le premier de la page : c'est lui qui annonce que le hero est
 * terminé.
 *
 * POURQUOI DES CARTES `plain` ET NON `sand`
 * -----------------------------------------
 * Sur une section sable, une carte `sand` serait invisible. Les cartes sont
 * donc `plain` : elles prennent le fond de la section et se détachent par leur
 * seul filet. C'est exactement l'effet recherché — une carte ne doit pas
 * devenir un bloc de couleur de plus.
 *
 * RIEN N'EST INVENTÉ
 * ------------------
 * Les quatre valeurs sortent de `site.ts` ou sont vérifiables dans
 * `PROJECT.md`. Aucune certification, aucun tarif, aucun délai.
 */

const proofs = [
  {
    value: `${site.experienceYears}+`,
    label: "Années d’expérience",
  },
  {
    value: "Diplômé",
    label: "CS Taille et soins des arbres",
  },
  {
    value: "Devis",
    label: "Gratuit et sans engagement",
  },
  {
    value: `${area.maxRadiusKm} km`,
    label: "Selon la nature du chantier",
  },
];

export function ProofBand() {
  return (
    <Section surface="sand" spacing="compact">
      <Container>
        {/*
          2 × 2 sur mobile, quatre colonnes à partir de `sm`. La bascule est
          posée à 480 px et non à 1024 : mesurée à 480 px, la valeur la plus
          longue (« Diplômé ») tient déjà sur une ligne dans un quart de
          largeur, il n'y a donc aucune raison d'attendre le desktop.
        */}
        <ul className="grid grid-cols-2 gap-(--card-gap) sm:grid-cols-4">
          {proofs.map((proof) => (
            <Reveal as="li" key={proof.label} className="h-full">
              <Card as="div" tone="plain" padding="md" className="h-full">
                {/* Accent réduit à un trait de 16 px : présent, jamais
                    dominant (règle de parcimonie, DESIGN_SYSTEM.md § 1). */}
                <span
                  aria-hidden="true"
                  className="mx-auto block h-0.5 w-4 bg-safety"
                />

                <p
                  className={cn(
                    // 24 px sur mobile pour que « 100 km » tienne sur une
                    // ligne dans une demi-colonne de 171 px.
                    "mt-4 font-display text-[1.5rem] lg:text-[1.75rem]",
                    "leading-none tracking-tight text-(--surface-heading)",
                  )}
                >
                  {proof.value}
                </p>

                <p className="mt-2.5 font-sans text-caption leading-snug text-(--surface-fg-muted) text-pretty">
                  {proof.label}
                </p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
