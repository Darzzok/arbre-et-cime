import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Capsule — primitive d'etiquette, introduite en phase 15B.
 *
 * Remplace progressivement le surtitre editorial « 01 ——— SECTION » par un
 * objet compact et scannable : c'est le changement de registre demande par la
 * nouvelle direction.
 *
 * QUATRE VARIANTES, CHOISIES PAR LA SURFACE
 * -----------------------------------------
 * | Variante | Fond | Texte | Ou |
 * | --- | --- | --- | --- |
 * | `light` | `--surface-inset` | `--surface-heading` | surfaces claires |
 * | `dark` | ivoire 10 % | ivoire | surfaces sombres **unies** |
 * | `photo` | foret 80 % | ivoire | par-dessus une PHOTOGRAPHIE |
 * | `accent` | jaune | foret | **rare** — une seule par ecran |
 *
 * `light` ETAIT SABLE EN DUR — 35 CAPSULES ETAIENT INVISIBLES
 * -----------------------------------------------------------
 * La variante posait `bg-sand`. Elle fonctionnait sur ivoire, et disparaissait
 * completement des qu'on la posait sur une surface SABLE : meme couleur de
 * part et d'autre, **contraste de fond 1,00**. Il ne restait que le texte et
 * la pastille, flottant sans pilule.
 *
 * Releve a l'ecran sur **11 pages et 35 capsules** — dont les quatre pages
 * services, `/contact`, `/devis`, `/realisations` et le hub des zones. Le
 * client l'avait vu sur `/dessouchage` ; ce n'etait qu'une occurrence.
 *
 * La cause n'etait pas le choix de variante fait par chaque page, mais le fait
 * que la variante decrive une COULEUR au lieu d'un ROLE. `--surface-inset`
 * existe precisement pour cela et est defini par les quatre surfaces : la
 * pilule se detache maintenant de son fond quel qu'il soit, sans qu'aucune
 * page ait a le savoir.
 *
 * > **Une variante qui nomme une couleur finit par mentir. Elle doit nommer un
 * > role.**
 *
 * La variante `accent` suit la meme regle de parcimonie que le bouton
 * primaire : c'est la rarete du jaune qui lui donne sa valeur.
 *
 * POURQUOI `photo` EXISTE — MESURE EN PHASE 15B.3
 * -----------------------------------------------
 * `dark` pose un fond d'ivoire a 10 % : sur un aplat sombre il suffit, parce
 * que le fond REEL est connu. Sur une photographie il ne garantit plus rien —
 * il laisse passer 90 % de ce qu'il y a dessous.
 *
 * Mesure faite sur le hero de l'accueil, en recomposant le recadrage
 * `object-cover` reel puis le degrade de lisibilite : les capsules tombaient
 * dans une bande ou le degrade ne vaut que 0,107 d'opacite, et le texte de
 * 13 px y ressortait a **3,64** — sous le seuil AA de 4,5.
 *
 * `photo` porte donc son propre fond, assez opaque pour que le resultat ne
 * depende plus de l'image : 7,43 dans le pire cas theorique (ciel blanc pur),
 * 10,95 sur la photographie effectivement servie.
 *
 * > **Une capsule posee sur une image utilise `photo`, jamais `dark`.**
 *
 * DECORATIVE PAR DEFAUT
 * ---------------------
 * Une capsule qui repete une information deja portee par le titre voisin ne
 * doit pas etre annoncee deux fois. `decorative` la retire de l'arbre
 * d'accessibilite — c'est le cas le plus frequent, d'ou la demande explicite
 * du brief de ne pas polluer l'accessibilite.
 *
 * COMPOSANT SERVEUR : aucune interaction, aucun etat.
 */

export type CapsuleVariant = "light" | "dark" | "photo" | "accent";

const variantClasses: Record<CapsuleVariant, string> = {
  light: "bg-(--surface-inset) text-(--surface-heading)",
  dark: "bg-ivory/10 text-ivory",
  photo: "bg-forest/80 text-ivory",
  accent: "bg-safety text-forest",
};

const dotClasses: Record<CapsuleVariant, string> = {
  light: "bg-moss",
  dark: "bg-safety",
  photo: "bg-safety",
  accent: "bg-forest",
};

type CapsuleProps = {
  as?: ElementType;
  variant?: CapsuleVariant;
  /** Pastille ronde en tete — un etat, une categorie. Purement visuelle. */
  dot?: boolean;
  /**
   * Retire la capsule de l'arbre d'accessibilite. Vrai par defaut : la
   * plupart des capsules redisent ce que le titre voisin dit deja.
   */
  decorative?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

export function Capsule({
  as = "span",
  variant = "light",
  dot = false,
  decorative = true,
  className,
  children,
  ...rest
}: CapsuleProps) {
  const Tag = as;

  return (
    <Tag
      {...(decorative ? { "aria-hidden": "true" } : {})}
      className={cn(
        // 32 px de haut, 36 px avec la pastille : la fourchette du brief.
        "inline-flex min-h-8 items-center gap-2 rounded-pill px-3.5 py-1.5",
        "font-sans text-caption font-semibold tracking-tight",
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn("size-1.5 shrink-0 rounded-pill", dotClasses[variant])}
        />
      ) : null}
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */

type CapsuleGroupProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Rangee de capsules. Existe pour une seule raison : le site est centre
 * (`main { text-align: center }`), et une rangee `flex` ne suit pas
 * `text-align` — elle a besoin de `justify-center`. L'oublier decale toute la
 * rangee a gauche, erreur deja commise en phase 4.
 */
export function CapsuleGroup({ className, children }: CapsuleGroupProps) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {children}
    </div>
  );
}
