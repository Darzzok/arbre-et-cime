import { ButtonLink, Container, Eyebrow, Reveal, Section } from "@/components/ui";
import { ESTIMATED_MINUTES, STEP_COUNT } from "@/lib/quote-flow";
import { getRoute } from "@/lib/routes";
import { area } from "@/lib/site";

/**
 * Section 7 des 7 sections VERROUILLÉES — entrée vers le devis.
 *
 * DEUX VERSIONS ÉCARTÉES AVANT CELLE-CI
 * --------------------------------------
 * 1. **Photo de fond** — retirée sur demande. La page compte déjà le hero,
 *    quatre cartes services et trois réalisations ; une septième photo
 *    n'ajoutait pas de preuve, elle diluait les précédentes.
 * 2. **Aplat forêt** — retiré aussi : le pied de page est lui-même en forêt,
 *    et les deux blocs sombres se fondaient en une seule masse de 900 px en
 *    fin de page. Le filet supérieur du pied de page ne suffisait pas à les
 *    séparer.
 *
 * Reste le vrai problème que ces deux versions masquaient : **la section était
 * vide**. Un titre, une phrase et un bouton, là où le visiteur se demande
 * précisément ce qui va lui être demandé s'il clique.
 *
 * D'où le contenu ajouté : **les trois moments du parcours**, avant le bouton.
 * Ce n'est pas du remplissage, c'est la levée de la dernière objection —
 * « combien de temps ça va me prendre, et qu'est-ce qu'on va me demander ».
 * Les trois moments sont vrais et vérifiables dans le configurateur.
 *
 * Le motif en trois colonnes à filet supérieur est **celui de la section Zone
 * d'intervention**, repris tel quel : le site n'invente pas une mise en page
 * par section (`CLAUDE.md` § 6).
 *
 * Le jaune sécurité n'apparaît **que dans le remplissage du bouton**. Sur
 * ivoire il tombe à 1,96 : aucun chiffre, aucun filet jaune ici. Les numéros
 * sont en forêt (14,04).
 */

const devis = getRoute("devis");

const MOMENTS = [
  {
    numero: "01",
    titre: "Décrivez le chantier",
    detail:
      "L’intervention, l’ampleur, les contraintes d’accès. Des questions à cliquer, pas un formulaire à rédiger.",
  },
  {
    numero: "02",
    titre: "Ajoutez des photos",
    detail:
      "Facultatif, mais c’est ce qui permet le plus souvent de chiffrer sans visite préalable.",
  },
  {
    numero: "03",
    titre: "On vous rappelle",
    detail:
      "Nous reprenons contact pour préciser ce qu’il faut, puis vous transmettre le chiffrage.",
  },
] as const;

export function Devis() {
  return (
    <Section surface="light" aria-labelledby="devis-titre">
      <Container>
        <Reveal className="mx-auto max-w-reading">
          <Eyebrow>Devis gratuit</Eyebrow>

          <h2
            id="devis-titre"
            className="mt-4 font-display text-title text-(--surface-heading) text-balance lg:text-[2.75rem] lg:leading-[1.06]"
          >
            Votre chantier commence ici.
          </h2>

          <p className="mx-auto mt-5 max-w-[48ch] font-sans text-lead text-(--surface-fg-muted) text-pretty">
            Quelques informations suffisent pour préparer votre demande.
            {" "}
            {STEP_COUNT} étapes, environ {ESTIMATED_MINUTES} minutes, sans
            engagement.
          </p>
        </Reveal>

        {/* Trois colonnes à filet supérieur — même motif que la section Zone. */}
        <Reveal>
          <ol className="mx-auto mt-12 grid max-w-4xl gap-x-8 gap-y-7 text-left sm:grid-cols-3 lg:mt-14">
            {MOMENTS.map((moment) => (
              <li
                key={moment.numero}
                className="border-t border-(--surface-rule) pt-4"
              >
                <span
                  aria-hidden="true"
                  className="font-sans text-eyebrow font-semibold tabular-nums tracking-[0.24em] text-(--surface-heading)"
                >
                  {moment.numero}
                </span>

                <h3 className="mt-2.5 font-display text-subtitle leading-tight text-(--surface-heading)">
                  {moment.titre}
                </h3>

                <p className="mt-2 font-sans text-caption leading-relaxed text-(--surface-fg-muted) text-pretty">
                  {moment.detail}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-12 lg:mt-14">
          <div className="flex justify-center">
            <ButtonLink href={devis.path} variant="primary" size="lg">
              Obtenir mon devis gratuit
            </ButtonLink>
          </div>

          <p className="mt-6 font-sans text-caption text-(--surface-fg-muted)">
            {area.metro} et jusqu’à {area.maxRadiusKm} km selon le chantier.
            Aucune donnée transmise à des tiers.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
