"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { FieldError } from "@/components/quote/field";
import type { QuotePhoto } from "@/components/quote/use-quote-state";
import { cn } from "@/lib/cn";
import { MAX_PHOTOS, formatBytes } from "@/lib/quote";

/**
 * Étape 3 — dépôt de photos, **100 % local à cette phase**.
 *
 * Aucun octet ne quitte le navigateur : les fichiers restent en mémoire, les
 * aperçus sont des `blob:` créés par `URL.createObjectURL`. L'envoi réel est
 * la phase 12. Le composant est donc déjà dans sa forme définitive côté
 * interface — seule la destination changera.
 *
 * Les fichiers ne sont **jamais** persistés (ni `sessionStorage`, ni base64) :
 * voir `QUOTE_FLOW.md` § 4.
 */

type PhotoPickerProps = {
  photos: readonly QuotePhoto[];
  onAdd: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  /** Fichiers refusés au dernier ajout : format, poids, nombre ou doublon. */
  rejections: readonly string[];
  /** Attribut `accept` des deux inputs, fourni par l'état. */
  accept: string;
};

export function PhotoPicker({
  photos,
  onAdd,
  onRemove,
  rejections,
  accept,
}: PhotoPickerProps) {
  const galleryInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const full = photos.length >= MAX_PHOTOS;
  const remaining = MAX_PHOTOS - photos.length;

  return (
    <div className="text-left">
      {/* Les deux inputs sont réels et masqués : ce sont eux qui ouvrent la
          galerie et l'appareil photo. `capture` n'a d'effet que sur mobile,
          d'où le bouton dédié qui n'apparaît pas au-delà de 768 px. */}
      <input
        ref={galleryInput}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={(event) => {
          onAdd(event.target.files);
          event.target.value = "";
        }}
      />
      <input
        ref={cameraInput}
        type="file"
        accept={accept}
        capture="environment"
        className="sr-only"
        onChange={(event) => {
          onAdd(event.target.files);
          event.target.value = "";
        }}
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!full) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!full) onAdd(event.dataTransfer.files);
        }}
        className={cn(
          "rounded-card border border-dashed p-6 text-center sm:p-8",
          "motion-safe:transition-colors motion-safe:duration-(--duration-micro)",
          "motion-safe:ease-cime",
          dragging
            ? "border-safety bg-safety/10"
            : "border-(--surface-rule) bg-(--surface-inset)",
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="mx-auto size-8 text-(--surface-fg-muted)"
        >
          <path
            d="M3 17.5V6.5A1.5 1.5 0 014.5 5h3l1.2-1.8h6.6L16.5 5h3A1.5 1.5 0 0121 6.5v11a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="3.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>

        <p className="mt-3 font-sans text-body text-(--surface-fg)">
          {full
            ? `Vous avez atteint le maximum de ${MAX_PHOTOS} photos.`
            : "Une vue d’ensemble et une photo du pied de l’arbre suffisent souvent."}
        </p>

        {!full ? (
          <p className="mt-1 font-sans text-caption text-(--surface-fg-muted)">
            <span className="hidden md:inline">
              Glissez vos photos ici, ou utilisez les boutons.{" "}
            </span>
            Encore {remaining} {remaining > 1 ? "photos possibles" : "photo possible"}.
          </p>
        ) : null}

        {/* Deux boutons pleine largeur sur mobile : ce sont les cibles les plus
            sollicitées de l'étape, elles doivent être atteignables au pouce. */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            disabled={full}
            onClick={() => cameraInput.current?.click()}
            className={cn(
              "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-edge px-5",
              "border border-(--btn-outline-border) font-sans text-body font-semibold",
              "text-(--surface-fg) md:hidden",
              "motion-safe:transition-colors motion-safe:duration-(--duration-micro)",
              "hover:border-(--surface-fg) disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            Prendre une photo
          </button>

          <button
            type="button"
            disabled={full}
            onClick={() => galleryInput.current?.click()}
            className={cn(
              "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-edge px-5",
              "border border-(--btn-outline-border) font-sans text-body font-semibold",
              "text-(--surface-fg)",
              "motion-safe:transition-colors motion-safe:duration-(--duration-micro)",
              "hover:border-(--surface-fg) disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            Choisir des photos
          </button>
        </div>
      </div>

      {/* Refus du dernier ajout. `aria-live` : le message apparaît sans qu'un
          élément prenne le focus, il doit être annoncé. */}
      <div aria-live="polite" className="empty:hidden">
        {rejections.map((message) => (
          <FieldError key={message} id={`photo-refus-${message}`} message={message} />
        ))}
      </div>

      {photos.length > 0 ? (
        <>
          <p className="mt-6 font-sans text-caption font-semibold uppercase tracking-[0.12em] text-(--surface-fg-muted)">
            {photos.length} photo{photos.length > 1 ? "s" : ""} jointe
            {photos.length > 1 ? "s" : ""}
          </p>

          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => (
              <li
                key={photo.id}
                className="relative overflow-hidden rounded-card border border-(--surface-rule)"
              >
                <span className="relative block aspect-square">
                  {/* `unoptimized` : c'est un `blob:` local, il n'y a rien à
                      optimiser côté serveur et l'optimiseur échouerait. */}
                  <Image
                    src={photo.url}
                    alt={`Aperçu de ${photo.file.name}`}
                    fill
                    unoptimized
                    sizes="(min-width: 30rem) 33vw, 50vw"
                    className="object-cover"
                  />
                </span>

                <button
                  type="button"
                  onClick={() => onRemove(photo.id)}
                  className={cn(
                    "absolute right-2 top-2 flex size-11 items-center justify-center",
                    "rounded-full bg-forest/85 text-ivory",
                    "motion-safe:transition-colors motion-safe:duration-(--duration-micro)",
                    "hover:bg-forest",
                  )}
                >
                  <span className="sr-only">Retirer {photo.file.name}</span>
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <span
                  data-surface="dark"
                  className="absolute inset-x-0 bottom-0 block truncate bg-forest/85 px-2.5 py-1.5 text-left font-sans text-caption text-(--surface-fg-muted)"
                >
                  {formatBytes(photo.file.size)}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
