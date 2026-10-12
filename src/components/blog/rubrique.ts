import type { CSSProperties } from "react";
import { RUBRIQUES, type Rubrique } from "@/lib/blog";

/** Variables de couleur d’une rubrique (couleurs de son pilier : activites → éveil). */
export function couleurs(r: Rubrique): CSSProperties {
  const p = RUBRIQUES[r].pilier;
  return {
    "--c": `var(--${p})`,
    "--deep": `var(--${p}-deep)`,
    "--tint": `var(--${p}-tint)`,
    "--surface": `var(--${p}-surface)`,
  };
}

/** Textes propres à chaque rubrique (titre de la page, « À lire aussi », encart vers le pilier — repris des titres de l’Accueil). */
export const TEXTES = {
  nutrition: {
    sujet: "la nutrition",
    titre: "Repas des tout-petits\u00a0: nos conseils",
    toute: "Toute la nutrition →",
    pilierTitre: "Un plat. Toute la tablée.",
    pilierLien: "Tout sur la nutrition dans Ourson →",
  },
  sommeil: {
    sujet: "le sommeil",
    titre: "Sommeil de bébé\u00a0: nos conseils",
    toute: "Tout le sommeil →",
    pilierTitre: "La sieste, au bon moment.",
    pilierLien: "Tout sur le sommeil dans Ourson →",
  },
  activites: {
    sujet: "l’éveil",
    titre: "Jeux et éveil de bébé\u00a0: nos idées",
    toute: "Tout l’éveil →",
    pilierTitre: "Ses jalons, un jeu par jour.",
    pilierLien: "Tout sur l’éveil dans Ourson →",
  },
} as const satisfies Record<Rubrique, Record<string, string>>;
