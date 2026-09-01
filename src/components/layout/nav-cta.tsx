import { ButtonLink } from "@/components/ui";
import { contact, telHref } from "@/lib/site";

/**
 * Actions de conversion — refaites en phase 15B.2.
 *
 * DU LIEN TEXTE AU BOUTON PLEIN
 * -----------------------------
 * Jusqu'ici le CTA devis était un lien souligné d'un filet jaune. C'était
 * cohérent avec la direction éditoriale ; ça ne l'est plus. `CONVERSION_STRATEGY.md`
 * § 3 demande **un seul CTA primaire par écran visible**, et un lien souligné
 * ne remplit pas ce rôle dans une barre de navigation : il se lit comme une
 * sixième entrée de menu.
 *
 * Le CTA devient donc un `Button` **primaire** — aplat accent, texte forêt
 * (8,06). C'est la seule occurrence pleine de jaune de l'en-tête.
 *
 * LE BOUTON « APPELER » DÉPEND D'UN FAIT, PAS D'UNE ENVIE
 * ------------------------------------------------------
 * Il n'apparaît que si `contact.phoneConfirmed` est vrai. À ce jour le numéro
 * n'est **pas** confirmé : le bouton n'existe donc nulle part, et aucun numéro
 * n'est inventé. Renseigner `NEXT_PUBLIC_PHONE` le fait apparaître partout à
 * la fois — en-tête, menu mobile, barre d'action, pied de page — sans toucher
 * une ligne de composant.
 *
 * COMPOSANT SERVEUR : aucun état, aucun événement.
 */

type NavCtaProps = {
  /**
   * `inline` : en ligne, pour la barre de navigation.
   * `stack`  : empilé et pleine largeur, pour le menu mobile et le pied de page.
   */
  layout?: "inline" | "stack";
  /** Taille des boutons. `lg` pour le menu mobile et le pied de page. */
  size?: "md" | "lg";
  /**
   * Contexte d'émission, pour la mesure de la phase 16. Rien n'est envoyé
   * aujourd'hui : l'attribut sert seulement à distinguer les emplacements
   * quand l'outil de mesure sera branché.
   */
  source: string;
  className?: string;
};

export function NavCta({
  layout = "inline",
  size = "md",
  source,
  className,
}: NavCtaProps) {
  const tel = telHref();

  return (
    <div
      className={
        layout === "stack"
          ? `flex flex-col gap-3 ${className ?? ""}`
          : `flex items-center gap-3 ${className ?? ""}`
      }
    >
      <ButtonLink
        href={contact.quotePath}
        variant="primary"
        size={size}
        block={layout === "stack"}
        data-cta="devis"
        data-cta-source={source}
      >
        Demander un devis
      </ButtonLink>

      {tel ? (
        <ButtonLink
          href={tel}
          variant={layout === "stack" ? "light" : "ghost"}
          size={size}
          block={layout === "stack"}
          data-cta="appel"
          data-cta-source={source}
        >
          Appeler{contact.phoneDisplay ? ` ${contact.phoneDisplay}` : ""}
        </ButtonLink>
      ) : null}
    </div>
  );
}
