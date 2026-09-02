import { area, qualifications, site } from "@/lib/site";

/**
 * Questions fréquentes.
 *
 * POURQUOI CETTE PAGE EXISTE
 * --------------------------
 * Relevé en audit : le site répondait à « élagueur à Rouen » et à rien
 * d'autre. Ni « quand élaguer », ni « faut-il une autorisation pour abattre »,
 * ni « que devient le bois » — c'est-à-dire aucune des requêtes qui amènent le
 * premier contact, et qui précèdent de plusieurs semaines la demande de devis.
 *
 * CE QU'ELLE NE FAIT PAS
 * ----------------------
 * Elle n'invente rien, et deux questions attendues sont **délibérément
 * absentes** :
 *
 * - **« Combien ça coûte ? »** figure bien, mais SANS chiffre. Aucun tarif n'a
 *   été communiqué par le client ; publier une fourchette inventée serait la
 *   pire faute possible sur une page destinée à rassurer.
 * - **« Êtes-vous assuré ? »** n'y figure pas du tout. Le client a répondu
 *   qu'il n'y avait « pas d'assurance à mettre » : ne rien dire est la seule
 *   réponse honnête, et poser la question sans y répondre serait pire que de
 *   ne pas la poser.
 *
 * De même, aucun délai n'est chiffré : rien dans le projet ne permet de
 * promettre « sous 48 h ».
 *
 * LES RÉPONSES RÉGLEMENTAIRES RESTENT PRUDENTES
 * ---------------------------------------------
 * L'autorisation d'abattage dépend du PLU, d'un éventuel classement et parfois
 * du règlement de lotissement. La réponse dit **où se renseigner**, elle ne
 * tranche pas à la place de la mairie. Un site d'élagueur n'est pas un service
 * juridique.
 */

export type FaqEntry = {
  /** Identifiant d'ancre, stable — il peut être partagé et indexé. */
  id: string;
  question: string;
  /** Paragraphes. Le premier doit répondre ; les suivants nuancent. */
  reponse: readonly string[];
};

export const FAQ: readonly FaqEntry[] = [
  {
    id: "quand-elaguer",
    question: "À quelle période faut-il élaguer un arbre ?",
    reponse: [
      "La période la plus favorable va de novembre à mars, pendant le repos végétatif : l’arbre est moins sollicité, les plaies se referment mieux au redémarrage, et la structure des branches se lit sans les feuilles.",
      "Certaines essences se taillent au contraire en vert, une fois la pousse de printemps terminée. Et il faut éviter les périodes de gel comme les fortes chaleurs, qui compliquent la cicatrisation.",
      "Un point compte autant que le calendrier de l’arbre : la nidification. Entre mars et juillet, un arbre peut abriter une nichée, et une intervention non urgente se reporte.",
    ],
  },
  {
    id: "autorisation-abattage",
    question: "Faut-il une autorisation pour abattre un arbre ?",
    reponse: [
      "Souvent, oui — et cela ne dépend pas de nous. Un arbre peut être protégé par le plan local d’urbanisme, classé en espace boisé, situé dans le périmètre d’un monument, ou soumis au règlement d’un lotissement ou d’une copropriété.",
      "La démarche est toujours la même : se renseigner auprès du service urbanisme de sa commune avant d’engager quoi que ce soit. Une déclaration préalable est fréquemment demandée, et son délai d’instruction se compte en semaines.",
      "Nous ne réalisons pas cette démarche à votre place et ne pouvons pas nous prononcer sur votre situation : seule votre mairie fait autorité.",
    ],
  },
  {
    id: "elagage-ou-abattage",
    question: "Élagage ou abattage : comment savoir ?",
    reponse: [
      "L’abattage est un dernier recours. Un arbre dépérissant, fendu, déraciné ou devenu dangereux pour un bâtiment peut devoir être retiré ; un arbre simplement trop grand, trop dense ou mal équilibré se travaille presque toujours.",
      "Beaucoup de demandes d’abattage se règlent par un allègement de couronne ou une réduction raisonnée. C’est ce que l’étude de la demande sert à trancher — et cela se dit avant le chantier, pas pendant.",
    ],
  },
  {
    id: "prix",
    question: "Combien coûte une intervention ?",
    reponse: [
      "Il n’y a pas de tarif au forfait, parce qu’il n’y a pas deux chantiers identiques. Le chiffrage se fait après étude de la demande, et le devis est gratuit.",
      "Ce qui fait varier un prix, dans l’ordre : la hauteur et le volume de l’arbre, l’accès au pied (peut-on approcher un véhicule ?), la proximité d’une habitation, d’une route ou de câbles, le volume de bois produit, et le fait de l’évacuer ou non.",
      `C’est précisément ce que demande le configurateur de devis : quelques réponses et deux ou trois photos suffisent le plus souvent à chiffrer sans visite préalable.`,
    ],
  },
  {
    id: "devenir-du-bois",
    question: "Que devient le bois après l’intervention ?",
    reponse: [
      "Deux possibilités, décidées avec vous au moment du devis. Le bois peut être débité et laissé sur place — beaucoup de propriétaires le récupèrent en bois de chauffage — ou évacué entièrement, branches et rémanents compris.",
      "L’évacuation est une prestation à part entière : elle mobilise du matériel et du temps, et elle apparaît donc distinctement sur le devis plutôt que d’être noyée dans le prix de la coupe.",
    ],
  },
  {
    id: "souche",
    question: "Faut-il retirer la souche après un abattage ?",
    reponse: [
      "Ce n’est pas obligatoire, mais c’est souvent souhaitable. Une souche laissée en place gêne la tonte, peut rejeter, et attire à terme champignons et insectes xylophages.",
      "Le rognage la broie sous le niveau du sol et permet de replanter ou d’engazonner. La profondeur nécessaire dépend de ce que vous comptez faire de l’emplacement — un gazon et une nouvelle plantation ne demandent pas le même travail.",
    ],
  },
  {
    id: "zone",
    question: "Intervenez-vous dans ma commune ?",
    reponse: [
      `${area.city} et les communes de la ${area.metro} sont la zone principale : c’est là que les délais sont les plus courts et qu’une intervention ponctuelle se cale le plus facilement.`,
      `Au-delà, en ${area.department} et dans les départements limitrophes, les interventions sont possibles selon la nature du chantier. Un déplacement plus lointain — jusqu’à ${area.maxRadiusKm} km — s’étudie au cas par cas ; il n’est jamais automatique.`,
    ],
  },
  {
    id: "qualifications",
    question: "Quelles sont vos qualifications ?",
    reponse: [
      `${site.manager} est arboriste-grimpeur, titulaire du ${qualifications[0]} et d’un ${qualifications[1]}.`,
      "Le premier est le diplôme spécifique du métier : taille raisonnée, diagnostic de l’arbre, techniques de grimpe et de démontage. Le second couvre la gestion des espaces extérieurs et des milieux naturels.",
    ],
  },
  {
    id: "apres-tempete",
    question: "Que faire d’un arbre tombé après une tempête ?",
    reponse: [
      "D’abord ne pas s’en approcher, et surtout pas s’il touche une ligne électrique ou téléphonique : dans ce cas, c’est le gestionnaire du réseau qu’il faut appeler en premier, pas un élagueur.",
      "Un arbre couché reste sous tension : les branches pliées peuvent se détendre violemment à la première coupe. C’est le type de chantier où l’ordre des coupes compte plus que la puissance de la tronçonneuse.",
      "Photographiez la situation à distance et transmettez-la avec votre demande : cela permet de juger de l’urgence réelle et du matériel nécessaire sans se déplacer d’abord.",
    ],
  },
  {
    id: "deroulement-devis",
    question: "Comment se passe une demande de devis ?",
    reponse: [
      "Le configurateur pose cinq questions : la prestation, les caractéristiques du chantier, des photos facultatives, le lieu, puis vos coordonnées. Il faut environ deux minutes.",
      "Les photos ne sont pas obligatoires, mais elles changent beaucoup : une vue d’ensemble et une photo du pied de l’arbre suffisent le plus souvent à chiffrer sans visite préalable.",
      "La demande est ensuite étudiée, et la réponse arrive par e-mail. Si le chantier est complexe ou l’accès incertain, une visite est proposée avant tout engagement.",
    ],
  },
];
