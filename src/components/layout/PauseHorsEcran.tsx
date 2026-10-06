"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Les animations en boucle ([data-boucle] : ourson qui se balance ou flotte, pulsation « En cours »)
 * sont rendues en pause ([data-pause]) et ne tournent que tant qu'elles sont à l'écran :
 * leurs quelques cycles ne s'épuisent pas hors de vue.
 */
export function PauseHorsEcran() {
  // Le layout des pages de vente persiste d'une page à l'autre : on repart de zéro à chaque page.
  return <Observateur key={usePathname()} />;
}

function Observateur() {
  useEffect(() => {
    const obs = new IntersectionObserver((entrees) => {
      for (const e of entrees) e.target.toggleAttribute("data-pause", !e.isIntersecting);
    });
    for (const el of document.querySelectorAll("[data-boucle]")) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return null;
}
