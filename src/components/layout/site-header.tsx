"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { NavCta } from "@/components/layout/nav-cta";
import { useScrollPast } from "@/components/layout/use-scroll-past";
import { Wordmark } from "@/components/layout/wordmark";
import { Container } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  getRoute,
  primaryNav,
  routeList,
  type NavItem,
  type RouteDefinition,
} from "@/lib/routes";
import { area } from "@/lib/site";

/**
 * En-tête du site.
 *
 * Composant CLIENT, et c'est justifié : quatre besoins réels imposent l'état
 * côté navigateur — le menu mobile, le sous-menu Prestations, l'état de
 * défilement, et la lecture du chemin courant (variante d'en-tête et
 * `aria-current`). Les regrouper dans UNE seule frontière client coûte moins de
 * JavaScript que quatre îlots séparés. Le balisage complet reste rendu côté
 * serveur au premier chargement.
 *
 * L'en-tête est TOUJOURS sur surface sombre, y compris sur les pages internes.
 * Deux raisons : le jaune sécurité ne contraste qu'à 1,96 sur ivoire, donc les
 * accents du CTA ne seraient pas lisibles sur un en-tête clair ; et un bandeau
 * forêt en haut, un pied de page forêt en bas, du contenu ivoire entre les
 * deux, donne une reliure éditoriale nette.
 */

/** Variante d'en-tête de la route courante, `solid` par défaut. */
function headerVariantFor(pathname: string): "overlay" | "solid" {
  const match = routeList.find((route) => route.path === pathname);
  return match?.headerVariant ?? "solid";
}

function isActive(pathname: string, route: RouteDefinition): boolean {
  return pathname === route.path;
}

export function SiteHeader() {
  const pathname = usePathname();
  const variant = headerVariantFor(pathname);

  /* Au-delà de quelques pixels, l'en-tête se referme sur lui-même. */
  const scrolled = useScrollPast(24);

  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileGroupOpen, setMobileGroupOpen] = useState(false);

  const menuId = useId();
  const mobileGroupId = useId();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  /*
   * Fermeture à chaque changement de page.
   *
   * Ajustement d'état PENDANT LE RENDU, et non dans un effet : c'est le motif
   * recommandé par React pour réinitialiser un état quand une entrée change, et
   * il évite le rendu en cascade. Il couvre le clic sur un lien du menu comme
   * la navigation par les boutons précédent/suivant du navigateur.
   */
  const [renderedPath, setRenderedPath] = useState(pathname);

  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setMenuOpen(false);
    setOpenGroup(null);
    setMobileGroupOpen(false);
  }

  /* Verrou de défilement du corps pendant que le menu est ouvert. */
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  /* Focus initial sur le bouton de fermeture à l'ouverture. */
  useEffect(() => {
    if (menuOpen) {
      closeRef.current?.focus();
    }
  }, [menuOpen]);

  /* Échap ferme le menu mobile, ou à défaut le sous-menu desktop. */
  useEffect(() => {
    if (!menuOpen && !openGroup) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      if (menuOpen) {
        closeMenu();
      } else {
        setOpenGroup(null);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, openGroup, closeMenu]);

  /* Piège de focus dans le panneau mobile : Tab boucle sur son contenu. */
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  /* Un clic hors du sous-menu desktop le referme. */
  useEffect(() => {
    if (!openGroup) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as globalThis.Node)
      ) {
        setOpenGroup(null);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openGroup]);

  /* Le fond n'apparaît qu'une fois la photographie dépassée. */
  const showBackdrop = variant === "solid" || scrolled;

  return (
    <>
      {/*
       * Cale des pages internes. L'en-tete etant `fixed`, il ne reserve aucune
       * place dans le flux : cette cale la rend, a la hauteur DEPLIEE (elle ne
       * bouge donc pas quand l'en-tete se compacte, et ne provoque aucun
       * decalage de mise en page). Elle est en foret, comme l'en-tete : les
       * deux se confondent visuellement.
       * La page d'accueil n'en a pas — son en-tete flotte sur la photographie.
       */}
      {variant === "solid" ? (
        <div
          aria-hidden="true"
          data-surface="dark"
          className="h-18 bg-(--surface-bg) lg:h-28"
        />
      ) : null}

      <header
        data-surface="dark"
        className={cn(
          "fixed inset-x-0 top-0 z-40",
        "border-b transition-[background-color,border-color]",
        "duration-(--duration-reveal) ease-cime",
        showBackdrop
          ? "border-(--surface-rule) bg-forest/95"
          : "border-transparent bg-transparent",
      )}
    >
      <Container
        className={cn(
          "flex items-center justify-between gap-6",
          "transition-[height] duration-(--duration-reveal) ease-cime",
          scrolled ? "h-14 lg:h-20" : "h-18 lg:h-28",
        )}
      >
        <Wordmark size={scrolled ? "sm" : "md"} />

        {/* ---------------- Navigation desktop ---------------- */}
        <nav
          ref={navRef}
          aria-label="Navigation principale"
          className="hidden lg:block"
        >
          <ul className="flex items-center gap-8">
            {primaryNav.map((item) => (
              <li key={navKey(item)} className="relative">
                {item.kind === "route" ? (
                  <DesktopLink
                    route={getRoute(item.id)}
                    active={isActive(pathname, getRoute(item.id))}
                  />
                ) : (
                  <DesktopGroup
                    item={item}
                    pathname={pathname}
                    open={openGroup === item.label}
                    onToggle={() =>
                      setOpenGroup((current) =>
                        current === item.label ? null : item.label,
                      )
                    }
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center">
          <div className="hidden lg:block">
            <NavCta />
          </div>

          {/* ---------------- Bouton menu mobile ---------------- */}
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(
              "group inline-flex min-h-11 items-center gap-3 lg:hidden",
              "font-sans text-eyebrow font-semibold uppercase",
              "text-(--surface-fg)",
            )}
          >
            Menu
            <MenuGlyph />
          </button>
        </div>
      </Container>

      {/* ---------------- Panneau mobile ---------------- */}
      <div
        id={menuId}
        ref={panelRef}
        data-surface="dark"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        hidden={!menuOpen}
        className={cn(
          "fixed inset-0 z-50 flex flex-col overflow-y-auto",
          "bg-(--surface-bg) text-(--surface-fg) lg:hidden",
        )}
      >
        <Container className="flex h-18 shrink-0 items-center justify-between gap-6">
          <Wordmark />
          <button
            ref={closeRef}
            type="button"
            onClick={closeMenu}
            className={cn(
              "inline-flex min-h-11 items-center gap-3",
              "font-sans text-eyebrow font-semibold uppercase",
              "text-(--surface-fg)",
            )}
          >
            Fermer
            <CloseGlyph />
          </button>
        </Container>

        <Container className="flex flex-1 flex-col pt-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
          <nav aria-label="Navigation principale (mobile)">
            <ul className="border-t border-(--surface-rule)">
              {primaryNav.map((item, index) =>
                item.kind === "group" ? (
                  <MobileGroup
                    key={item.label}
                    item={item}
                    index={index}
                    pathname={pathname}
                    panelId={mobileGroupId}
                    open={mobileGroupOpen}
                    onToggle={() => setMobileGroupOpen((open) => !open)}
                  />
                ) : (
                  <MobileRow
                    key={item.id}
                    index={index}
                    route={getRoute(item.id)}
                    active={isActive(pathname, getRoute(item.id))}
                  />
                ),
              )}
            </ul>
          </nav>

          <div
            data-menu-item
            style={{ "--menu-index": primaryNav.length } as CSSProperties}
            className="mt-10"
          >
            <NavCta layout="row" />
          </div>

          <div
            data-menu-item
            style={{ "--menu-index": primaryNav.length + 1 } as CSSProperties}
            className="mt-8"
          >
            <p className="font-sans text-eyebrow font-semibold uppercase text-(--surface-fg-muted)">
              Zone d’intervention
            </p>
            <p className="mt-2 font-sans text-body text-(--surface-fg-muted)">
              {area.city} et la {area.metro}, jusqu’à {area.maxRadiusKm} km
              selon les chantiers.
            </p>
            <div className="mt-3">
              <Link
                href={getRoute("contact").path}
                className={cn(
                  "inline-flex min-h-11 items-center font-sans text-body",
                  "font-semibold text-(--surface-fg) underline decoration-1",
                  "underline-offset-[0.3em] decoration-(--surface-rule)",
                )}
              >
                Nous joindre
              </Link>
            </div>
          </div>
        </Container>
      </div>
      </header>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop                                                                     */
/* -------------------------------------------------------------------------- */

function navKey(item: NavItem): string {
  return item.kind === "group" ? item.label : item.id;
}

/**
 * Indicateur de lien : un filet qui se trace depuis la gauche.
 * Permanent quand la page est active, tracé au survol et au focus sinon.
 * Aucun déplacement du libellé : le mouvement reste dans le filet.
 */
function NavUnderline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-(--surface-fg)",
        "motion-safe:transition-transform motion-safe:duration-(--duration-micro)",
        "motion-safe:ease-line",
        active
          ? "scale-x-100"
          : cn(
              "scale-x-0",
              "group-hover:scale-x-100 group-focus-visible:scale-x-100",
            ),
      )}
    />
  );
}

const desktopTriggerClasses =
  "group relative inline-flex min-h-11 items-center font-sans text-body " +
  "text-(--surface-fg) no-underline";

function DesktopLink({
  route,
  active,
}: {
  route: RouteDefinition;
  active: boolean;
}) {
  return (
    <Link
      href={route.path}
      aria-current={active ? "page" : undefined}
      className={cn(desktopTriggerClasses, active && "font-semibold")}
    >
      <span className="relative">
        {route.navLabel}
        <NavUnderline active={active} />
      </span>
    </Link>
  );
}

/**
 * Sous-menu Prestations.
 *
 * Ouverture au CLIC et au clavier, jamais au seul survol : la charte interdit
 * toute interaction dépendant exclusivement du survol, et un menu qui s'ouvre
 * au passage de la souris est inutilisable au doigt comme au clavier.
 *
 * Présentation éditoriale — index, intitulé, sous-libellé — plutôt qu'une
 * grille de cartes : c'est ce qui le distingue d'un méga-menu.
 */
function DesktopGroup({
  item,
  pathname,
  open,
  onToggle,
}: {
  item: Extract<NavItem, { kind: "group" }>;
  pathname: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const routes = item.ids.map((id) => getRoute(id));
  const containsActive = routes.some((route) => isActive(pathname, route));

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          desktopTriggerClasses,
          "gap-2",
          containsActive && "font-semibold",
        )}
      >
        <span className="relative">
          {item.label}
          <NavUnderline active={containsActive || open} />
        </span>
        <Chevron open={open} />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "absolute left-0 top-full z-50 mt-4 w-80",
          "border border-(--surface-rule) bg-forest",
        )}
      >
        <ul>
          {routes.map((route, index) => {
            const active = isActive(pathname, route);

            return (
              <li key={route.id}>
                <Link
                  href={route.path}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-baseline gap-4 px-5 py-4",
                    "border-b border-(--surface-rule) last:border-b-0",
                    "no-underline transition-colors",
                    "duration-(--duration-micro) ease-cime",
                    "hover:bg-(--surface-inset) focus-visible:bg-(--surface-inset)",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "font-sans text-eyebrow font-semibold tabular-nums",
                      active
                        ? "text-(--color-safety)"
                        : "text-(--surface-fg-muted)",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex flex-col gap-0.5">
                    <span
                      className={cn(
                        "font-display text-subtitle leading-none",
                        "text-(--surface-heading)",
                      )}
                    >
                      {route.navLabel}
                    </span>
                    {route.navTagline ? (
                      <span className="font-sans text-caption text-(--surface-fg-muted)">
                        {route.navTagline}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile                                                                      */
/* -------------------------------------------------------------------------- */

const mobileRowClasses =
  "group flex w-full items-baseline gap-5 border-b border-(--surface-rule) " +
  "py-5 text-left no-underline";

function MobileIndex({ index, active }: { index: number; active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "font-sans text-eyebrow font-semibold tabular-nums",
        active ? "text-(--color-safety)" : "text-(--surface-fg-muted)",
      )}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

function MobileRow({
  index,
  route,
  active,
}: {
  index: number;
  route: RouteDefinition;
  active: boolean;
}) {
  return (
    <li data-menu-item style={{ "--menu-index": index } as CSSProperties}>
      <Link
        href={route.path}
        aria-current={active ? "page" : undefined}
        className={mobileRowClasses}
      >
        <MobileIndex index={index} active={active} />
        <span
          className={cn(
            "font-display text-title leading-none text-(--surface-heading)",
            active && "text-(--color-safety)",
          )}
        >
          {route.navLabel}
        </span>
      </Link>
    </li>
  );
}

function MobileGroup({
  item,
  index,
  pathname,
  panelId,
  open,
  onToggle,
}: {
  item: Extract<NavItem, { kind: "group" }>;
  index: number;
  pathname: string;
  panelId: string;
  open: boolean;
  onToggle: () => void;
}) {
  const routes = item.ids.map((id) => getRoute(id));
  const containsActive = routes.some((route) => isActive(pathname, route));

  return (
    <li data-menu-item style={{ "--menu-index": index } as CSSProperties}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(mobileRowClasses, "justify-between")}
      >
        <span className="flex items-baseline gap-5">
          <MobileIndex index={index} active={containsActive} />
          <span
            className={cn(
              "font-display text-title leading-none text-(--surface-heading)",
              containsActive && "text-(--color-safety)",
            )}
          >
            {item.label}
          </span>
        </span>
        <Chevron open={open} />
      </button>

      <ul id={panelId} hidden={!open} className="pb-2 pl-11">
        {routes.map((route, subIndex) => {
          const active = isActive(pathname, route);

          return (
            <li
              key={route.id}
              data-menu-item
              style={{ "--menu-index": subIndex } as CSSProperties}
            >
              <Link
                href={route.path}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col justify-center gap-0.5 py-2",
                  "no-underline",
                )}
              >
                <span
                  className={cn(
                    "font-sans text-body font-semibold text-(--surface-fg)",
                    active && "text-(--color-safety)",
                  )}
                >
                  {route.navLabel}
                </span>
                {route.navTagline ? (
                  <span className="font-sans text-caption text-(--surface-fg-muted)">
                    {route.navTagline}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Glyphes — traits simples, aucun jeu d'icônes importé                        */
/* -------------------------------------------------------------------------- */

/** Deux traits, dont le plus court s'allonge au survol. Pas de hamburger. */
function MenuGlyph() {
  return (
    <span aria-hidden="true" className="flex w-5 flex-col items-end gap-1.5">
      <span className="h-px w-full bg-(--surface-fg)" />
      <span
        className={cn(
          "h-px w-3 bg-(--surface-fg)",
          "motion-safe:transition-[width] motion-safe:duration-(--duration-micro)",
          "motion-safe:ease-line group-hover:w-full group-focus-visible:w-full",
        )}
      />
    </span>
  );
}

function CloseGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0">
      <path
        d="M3 3l10 10M13 3L3 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn(
        "size-3.5 shrink-0 text-(--surface-fg-muted)",
        "motion-safe:transition-transform motion-safe:duration-(--duration-micro)",
        "motion-safe:ease-cime",
        open && "rotate-180",
      )}
    >
      <path
        d="M3 6l5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
