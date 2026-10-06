"use client";

import { Icon } from "@/components/ds";
import s from "./Carrousel.module.css";

const ECART = 14;
const GOUTTIERE = 20;

/** Fait défiler la piste d’autant de cartes qu’il en tient à l’écran (une seule en mobile). */
export function CarrouselBoutons({ piste }: { piste: string }) {
  const defiler = (sens: 1 | -1) => {
    const el = document.getElementById(piste);
    if (!el) return;
    const carte = el.querySelector("li");
    const pas = carte ? carte.offsetWidth + ECART : 264;
    const n = Math.max(1, Math.floor((el.clientWidth - 2 * GOUTTIERE + ECART) / pas));
    const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: sens * pas * n, behavior: reduit ? "auto" : "smooth" });
  };

  return (
    <div className={s.boutons}>
      <button type="button" aria-label="Précédent" aria-controls={piste} onClick={() => defiler(-1)}>
        <Icon name="chevronLeft" size={20} />
      </button>
      <button type="button" aria-label="Suivant" aria-controls={piste} onClick={() => defiler(1)}>
        <Icon name="chevronRight" size={20} />
      </button>
    </div>
  );
}
