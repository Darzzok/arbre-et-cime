"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { QuotePhoto } from "@/components/quote/use-quote-state";
import { Body, Button, ButtonLink } from "@/components/ui";
import {
  CONSTRAINT_OPTIONS,
  COUNT_OPTIONS,
  HEIGHT_OPTIONS,
  OUTDOOR_SCALE_OPTIONS,
  OUTDOOR_WORK_OPTIONS,
  STUMP_SIZE_OPTIONS,
  choiceLabel,
  choiceLabels,
  countQuestionFor,
  needLabel,
} from "@/lib/quote";
import type { Chantier, QuoteDraft } from "@/lib/quote";
import { getRoute } from "@/lib/routes";
import { area, site } from "@/lib/site";

/**
 * Fin de parcours — séquence de préparation, puis récapitulatif complet.
 *
 * CE QUE L'ANIMATION DIT, ET CE QU'ELLE NE DIT PAS
 * ------------------------------------------------
 * Elle annonce **« demande prête »**, jamais « demande envoyée » : en phase 12
 * rien ne part, et le site est déployé publiquement (`CLAUDE.md` § 10). Une
 * personne réelle qui verrait une coche et lirait « envoyé » attendrait un
 * rappel qui ne viendrait jamais.
 *
 * Les trois lignes de la séquence sont donc **vraies** : les informations sont
 * réellement validées, le récapitulatif réellement construit, les photos
 * réellement préparées en mémoire. En phase 13, la même séquence portera une
 * quatrième ligne — « demande transmise » — et ce sera vrai aussi.
 */

/* ------------------------------------------------------------ Séquence -- */

const SENDING_LINES = [
  "Informations vérifiées",
  "Récapitulatif préparé",
] as const;

export function QuoteSending({ photoCount }: { photoCount: number }) {
  const lines = [
    ...SENDING_LINES,
    photoCount > 0
      ? `${photoCount} photo${photoCount > 1 ? "s" : ""} préparée${photoCount > 1 ? "s" : ""}`
      : "Aucune photo jointe",
  ];

  return (
    <div className="overflow-hidden rounded-card border border-(--surface-rule)">
      <div
        data-surface="dark"
        className="bg-(--surface-bg) px-5 py-12 text-center sm:px-8 sm:py-16"
      >
        {/* L'anneau se REMPLIT une fois puis s'arrête. Ce n'est pas un spinner :
            un spinner tourne indéfiniment et ne dit rien du temps restant. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 64 64"
          className="mx-auto size-16"
          data-quote-ring=""
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="var(--surface-rule)"
            strokeWidth="2"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="var(--color-safety)"
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(-90 32 32)"
            data-quote-ring-track=""
          />
        </svg>

        <p
          aria-live="polite"
          className="mt-7 font-display text-subtitle text-(--surface-heading)"
        >
          Préparation de votre demande…
        </p>

        <ul className="mx-auto mt-7 inline-flex flex-col gap-3 text-left">
          {lines.map((line, index) => (
            <li
              key={line}
              data-quote-check=""
              style={{ "--check-index": index } as React.CSSProperties}
              className="flex items-center gap-3 font-sans text-caption text-(--surface-fg-muted)"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-safety text-charcoal">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3">
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
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- Récapitulatif -- */

type RecapProps = {
  draft: QuoteDraft;
  photos: readonly QuotePhoto[];
  onEdit: (stepIndex: number) => void;
  onRestart: () => void;
};

type Ligne = { label: string; valeur: string };
type Bloc = { titre: string; stepIndex: number; lignes: Ligne[] };

/** Détaille le chantier ligne à ligne, selon sa variante. */
function chantierLignes(chantier: Chantier): Ligne[] {
  const contraintes: Ligne = {
    label: "Contraintes",
    valeur: choiceLabels(CONSTRAINT_OPTIONS, chantier.contraintes) || "—",
  };

  switch (chantier.kind) {
    case "arbre":
      return [
        {
          label: countQuestionFor("arbre").replace(/\s*\?$/, ""),
          valeur: choiceLabel(COUNT_OPTIONS, chantier.nombre) || "—",
        },
        {
          label: "Hauteur approximative",
          valeur: choiceLabel(HEIGHT_OPTIONS, chantier.hauteur) || "—",
        },
        contraintes,
      ];

    case "souche":
      return [
        {
          label: countQuestionFor("souche").replace(/\s*\?$/, ""),
          valeur: choiceLabel(COUNT_OPTIONS, chantier.nombre) || "—",
        },
        {
          label: "Taille de la souche",
          valeur: choiceLabel(STUMP_SIZE_OPTIONS, chantier.taille) || "—",
        },
        contraintes,
      ];

    case "exterieur":
      return [
        {
          label: "Travaux",
          valeur: choiceLabels(OUTDOOR_WORK_OPTIONS, chantier.travaux) || "—",
        },
        {
          label: "Ampleur",
          valeur: choiceLabel(OUTDOOR_SCALE_OPTIONS, chantier.ampleur) || "—",
        },
        contraintes,
      ];

    case "inconnu":
      return chantier.description.trim()
        ? [{ label: "Description", valeur: chantier.description.trim() }]
        : [{ label: "Description", valeur: "À préciser au téléphone" }];
  }
}

export function QuoteRecap({ draft, photos, onEdit, onRestart }: RecapProps) {
  const contact = getRoute("contact");
  const hasPhone = site.phone.length > 0;
  const titleRef = useRef<HTMLHeadingElement>(null);

  /*
   * Le focus arrive sur le titre : sans cela, la personne au clavier resterait
   * sur un bouton « Envoyer » disparu, et un lecteur d'écran n'annoncerait
   * jamais que le parcours est terminé.
   */
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const blocks: Bloc[] = [
    {
      titre: "Intervention",
      stepIndex: 0,
      lignes: [{ label: "Besoin", valeur: needLabel(draft.besoin) || "—" }],
    },
    { titre: "Chantier", stepIndex: 1, lignes: chantierLignes(draft.chantier) },
    {
      titre: "Lieu",
      stepIndex: 3,
      lignes: [
        {
          label: "Commune",
          valeur:
            `${draft.lieu.codePostal} ${draft.lieu.ville}`.trim() || "—",
        },
        ...(draft.lieu.adresse.trim()
          ? [{ label: "Adresse", valeur: draft.lieu.adresse.trim() }]
          : []),
      ],
    },
    {
      titre: "Coordonnées",
      stepIndex: 4,
      lignes: [
        { label: "Nom", valeur: draft.contact.nom.trim() || "—" },
        { label: "Téléphone", valeur: draft.contact.telephone.trim() || "—" },
        { label: "E-mail", valeur: draft.contact.email.trim() || "—" },
        ...(draft.contact.commentaire.trim()
          ? [{ label: "Précisions", valeur: draft.contact.commentaire.trim() }]
          : []),
      ],
    },
  ];

  return (
    <div
      data-quote-recap=""
      className="overflow-hidden rounded-card border border-(--surface-rule) text-left"
    >
      {/* ------------------------------------------------ Bandeau sombre --- */}
      <div
        data-surface="dark"
        className="bg-(--surface-bg) px-5 py-9 text-center sm:px-8 sm:py-10"
      >
        <span
          aria-hidden="true"
          data-quote-seal=""
          className="mx-auto flex size-14 items-center justify-center rounded-full bg-safety text-charcoal"
        >
          <svg viewBox="0 0 16 16" className="size-7">
            <path
              d="M3.5 8.5l3 3 6-6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <h2
          ref={titleRef}
          tabIndex={-1}
          data-quote-recap-title=""
          className="mt-6 font-display text-title text-(--surface-heading) text-balance"
        >
          Votre demande est prête
        </h2>

        <Body className="mx-auto mt-4 max-w-[48ch] text-(--surface-fg-muted)">
          Voici ce qui sera transmis à {site.shortName}. Relisez, et corrigez si
          nécessaire.
        </Body>
      </div>

      {/* ------------------------------------------------ Récapitulatif --- */}
      <div className="bg-(--surface-bg) px-5 py-8 sm:px-8 sm:py-10">
        <dl className="space-y-7">
          {blocks.map((block, index) => (
            <div
              key={block.titre}
              data-quote-recap-block=""
              style={{ "--block-index": index } as React.CSSProperties}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-sans text-caption font-semibold uppercase tracking-[0.12em] text-(--surface-fg-muted)">
                  {block.titre}
                </p>

                <button
                  type="button"
                  onClick={() => onEdit(block.stepIndex)}
                  className="shrink-0 rounded-edge font-sans text-caption font-semibold text-(--surface-fg-muted) underline underline-offset-4 hover:text-(--surface-fg)"
                >
                  Modifier
                  <span className="sr-only"> {block.titre.toLowerCase()}</span>
                </button>
              </div>

              <div className="mt-3 space-y-2.5 border-t border-(--surface-rule) pt-3.5">
                {block.lignes.map((ligne) => (
                  <div
                    key={ligne.label}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5"
                  >
                    <dt className="font-sans text-caption text-(--surface-fg-muted)">
                      {ligne.label}
                    </dt>
                    <dd className="min-w-0 flex-1 text-right font-sans text-body text-(--surface-fg)">
                      {ligne.valeur}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Les photos sont MONTRÉES, pas comptées : c'est la pièce qui a
              demandé le plus d'effort, la voir confirme qu'elle est prise en
              compte. */}
          {photos.length > 0 ? (
            <div
              data-quote-recap-block=""
              style={{ "--block-index": blocks.length } as React.CSSProperties}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-sans text-caption font-semibold uppercase tracking-[0.12em] text-(--surface-fg-muted)">
                  Photos ({photos.length})
                </p>

                <button
                  type="button"
                  onClick={() => onEdit(2)}
                  className="shrink-0 rounded-edge font-sans text-caption font-semibold text-(--surface-fg-muted) underline underline-offset-4 hover:text-(--surface-fg)"
                >
                  Modifier<span className="sr-only"> les photos</span>
                </button>
              </div>

              <ul className="mt-3 grid grid-cols-3 gap-2.5 border-t border-(--surface-rule) pt-3.5 sm:grid-cols-5">
                {photos.map((photo) => (
                  <li
                    key={photo.id}
                    className="relative aspect-square overflow-hidden rounded-edge border border-(--surface-rule)"
                  >
                    <Image
                      src={photo.url}
                      alt={`Aperçu de ${photo.file.name}`}
                      fill
                      unoptimized
                      sizes="(min-width: 30rem) 20vw, 30vw"
                      className="object-cover"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </dl>

        {/* ------------------------------------------------- Statut réel --- */}
        <div className="mt-9 rounded-card border border-(--surface-rule) bg-(--surface-inset) p-5">
          <p className="font-sans text-caption font-semibold uppercase tracking-[0.12em] text-(--surface-fg-muted)">
            Envoi pas encore actif
          </p>

          <Body className="mt-3 text-(--surface-fg)">
            Le configurateur est en cours de mise en service :{" "}
            <strong className="font-semibold">
              cette demande n’a pas été envoyée
            </strong>{" "}
            et rien n’a quitté votre navigateur. Pour une demande réelle dès
            maintenant, joignez-nous directement.
          </Body>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {hasPhone ? (
              <ButtonLink href={`tel:${site.phone}`} variant="primary" size="lg">
                Appeler {site.phoneDisplay}
              </ButtonLink>
            ) : null}

            <ButtonLink
              href={contact.path}
              variant={hasPhone ? "outline" : "primary"}
              size="lg"
            >
              Nous contacter
            </ButtonLink>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-(--surface-rule) pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-caption text-(--surface-fg-muted)">
            {area.metro} et jusqu’à {area.maxRadiusKm} km selon le chantier.
          </p>

          <Button variant="outline" onClick={onRestart} className="sm:w-auto" block>
            Nouvelle demande
          </Button>
        </div>
      </div>
    </div>
  );
}
