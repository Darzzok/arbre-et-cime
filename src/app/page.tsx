import { area, site } from "@/lib/site";

/**
 * Page d'attente du socle technique.
 * La homepage definitive est VERROUILLEE a 7 sections + footer (voir PROJECT.md).
 * Elle sera construite phase par phase a partir de la phase 5 de ROADMAP.md.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-6 px-(--spacing-gutter) py-(--spacing-section)">
      <p className="font-sans text-xs uppercase tracking-[0.24em] text-moss">
        Socle technique — chantier en cours
      </p>

      <h1 className="font-display text-4xl leading-[1.05] text-forest sm:text-5xl">
        {site.name}
      </h1>

      <p className="max-w-prose text-base leading-relaxed text-charcoal/80">
        {site.trade} à {area.city} et dans la {area.metro}. Environ{" "}
        {site.experienceYears} ans d’expérience, devis gratuit, intervention
        rapide et chantier propre.
      </p>

      <p className="max-w-prose text-sm leading-relaxed text-charcoal/60">
        Le design et les sections du site sont documentés dans les fichiers de
        référence à la racine du dépôt et seront développés phase par phase.
      </p>
    </main>
  );
}
