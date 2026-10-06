"use client";

import { Icon } from "@/components/ds";
import s from "./Carrousel.module.css";

/** Fait défiler la piste d'une carte (250 px + 14 px d'écart) dans un sens ou dans l'autre. */
export function CarrouselBoutons({ piste }: { piste: string }) {
  const defiler = (sens: 1 | -1) =>
    document.getElementById(piste)?.scrollBy({ left: sens * 264, behavior: "smooth" });

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
