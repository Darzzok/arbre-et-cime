import {
  ButtonLink,
  Capsule,
  CapsuleGroup,
  Card,
  Container,
  Reveal,
  Section,
  SectionPattern,
} from "@/components/ui";
import { ESTIMATED_MINUTES, STEP_COUNT } from "@/lib/quote";
import { area, contact, telHref } from "@/lib/site";

/**
 * Section 7 des 7 sections VERROUILLÉES — entrée vers le devis.
 *
 * UNE CARTE, PAS UN ÉCRAN — REFAITE EN PHASE 15B.3
 * ------------------------------------------------
 * Trois versions ont été écartées avant celle-ci, et l'historique explique la
 * forme retenue :
 *
 * 1. **Photo de fond** — retirée sur demande du client : une septième
 *    photographie diluait les six précédentes.
 * 2. **Aplat forêt plein écran** — retiré aussi. Le pied de page est
 *    lui-même sombre : les deux blocs se fondaient en une seule masse de
 *    900 px, et le filet supérieur du pied ne suffisait pas à les séparer.
 * 3. **Trois « moments » numérotés sur ivoire** — la version précédente. Elle
 *    reprenait le motif exact de la section Zone, juste au-dessus, ce qui
 *    faisait deux fois la même mise en page en fin de page.
 *
 * D'où la forme actuelle : **une carte forêt profond posée sur une bande
 * sable**. Le contraste demandé est obtenu par la carte, pas par la section —
 * et la bande sable reste comme marche entre la carte et le pied de page. Le
 * problème n° 2 ne peut donc pas revenir.
 *
 * LES CAPSULES REMPLACENT LES TROIS MOMENTS
 * -----------------------------------------
 * Les trois moments répondaient à une objection réelle : « combien de temps ça
 * va me prendre, et qu'est-ce qu'on va me demander ». Cette information n'est
 * pas perdue, elle est **condensée** : durée, caractère facultatif des photos,
 * gratuité. Les trois valeurs restent tirées du configurateur lui-même
 * (`STEP_COUNT`, `ESTIMATED_MINUTES`), jamais écrites en dur.
 *
 * LE JAUNE
 * --------
 * Sur forêt profond, le jaune sécurité tient 9,19 : c'est ici qu'il peut être
 * plein. Une seule occurrence — le bouton primaire.
 */

export function Devis() {
  // La règle du téléphone est portée par `site.ts`, jamais réécrite ici :
  // sans numéro confirmé, aucun bouton, et surtout aucun emplacement vide.
  const tel = telHref();

  return (
    <Section surface="sand" aria-labelledby="devis-titre">
      <Container>
        <Reveal>
          <Card
            as="div"
            tone="deep"
            padding="none"
            className="mx-auto max-w-5xl"
          >
            <SectionPattern pattern="contour" opacity={0.05} />

            <div className="relative px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
              <CapsuleGroup>
                <Capsule variant="accent">Devis gratuit</Capsule>
                <Capsule variant="dark">
                  Environ {ESTIMATED_MINUTES} minutes
                </Capsule>
                <Capsule variant="dark">Photos facultatives</Capsule>
              </CapsuleGroup>

              <h2
                id="devis-titre"
                className="mx-auto mt-7 max-w-[18ch] font-display text-title text-(--surface-heading) text-balance lg:text-[3rem] lg:leading-[1.04]"
              >
                Votre chantier commence ici.
              </h2>

              <p className="mx-auto mt-5 max-w-[46ch] font-sans text-lead text-(--surface-fg-muted) text-pretty">
                Quelques informations suffisent pour préparer votre demande.{" "}
                {STEP_COUNT} étapes, sans engagement.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                {/* La largeur est portée par une ENVELOPPE : `cn()` ne fusionne
                    pas les classes concurrentes (cf. DESIGN_SYSTEM.md § 8). */}
                <div className="w-full sm:w-fit">
                  <ButtonLink
                    href={contact.quotePath}
                    variant="primary"
                    size="lg"
                    block
                    data-cta="devis"
                    data-cta-source="accueil-final"
                  >
                    Demander un devis
                  </ButtonLink>
                </div>

                {tel ? (
                  <div className="w-full sm:w-fit">
                    <ButtonLink
                      href={tel}
                      variant="light"
                      size="lg"
                      block
                      data-cta="appel"
                      data-cta-source="accueil-final"
                    >
                      Appeler
                    </ButtonLink>
                  </div>
                ) : null}
              </div>

              {/* `max-w` borné : sans lui, cette ligne atteignait 164
                  caracteres en 1440 px (mesure de la phase 15). */}
              <p className="mx-auto mt-7 max-w-[52ch] font-sans text-caption leading-relaxed text-(--surface-fg-muted)">
                {area.metro} et jusqu’à {area.maxRadiusKm} km selon le chantier.
                Aucune donnée transmise à des tiers.
              </p>
            </div>
          </Card>
        </Reveal>
      </Container>
    </Section>
  );
}
