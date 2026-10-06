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

/** Textes propres à chaque rubrique (« À lire aussi », encart vers le pilier — repris des titres de l’Accueil). */
export const TEXTES = {
  nutrition: {
    sujet: "la nutrition",
    toute: "Toute la nutrition →",
    pilierTitre: "Un plat. Toute la tablée.",
    pilierLien: "Tout sur la nutrition dans Ourson →",
  },
  sommeil: {
    sujet: "le sommeil",
    toute: "Tout le sommeil →",
    pilierTitre: "La sieste, au bon moment.",
    pilierLien: "Tout sur le sommeil dans Ourson →",
  },
  activites: {
    sujet: "l’éveil",
    toute: "Tout l’éveil →",
    pilierTitre: "Ses jalons, un jeu par jour.",
    pilierLien: "Tout sur l’éveil dans Ourson →",
  },
} as const satisfies Record<Rubrique, Record<string, string>>;
