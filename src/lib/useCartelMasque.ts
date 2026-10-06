"use client";

import { useEffect, useState } from "react";

/**
 * Le cartel flottant s’efface dès qu’un autre bloc de téléchargement est à l’écran :
 * la section de fin de page (#telecharger) et, sur l’Accueil mobile, le badge du hero ([data-dl-hero]).
 * Masqué au départ, il apparaît (avec sa transition) dès le premier retour de l’observateur.
 */
export function useCartelMasque(): boolean {
  const [masque, setMasque] = useState(true);

  useEffect(() => {
    const fin = document.getElementById("telecharger");
    const cibles = [
      ...(fin ? [fin.closest("section") ?? fin] : []),
      ...document.querySelectorAll("[data-dl-hero]"),
      // Le pied de page : le cartel ne doit pas le recouvrir (il est masqué en mobile sur les pages de vente).
      ...document.querySelectorAll("footer"),
    ];
    const vu = new Map<Element, boolean>();
    const obs = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) vu.set(e.target, e.isIntersecting);
        setMasque(cibles.some((c) => vu.get(c)));
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    // Sans autre bloc sur la page, on observe la racine : le premier retour affiche le cartel.
    for (const c of cibles.length > 0 ? cibles : [document.documentElement]) obs.observe(c);
    return () => obs.disconnect();
  }, []);

  return masque;
}
