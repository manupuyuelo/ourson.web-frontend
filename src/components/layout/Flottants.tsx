"use client";

import { Telecharger } from "@/components/site/Telecharger";
import { useAppareil } from "@/lib/useAppareil";
import s from "./Flottants.module.css";

/**
 * Pages de vente : cartel mobile (badge du store, téléphones et tablettes, sous 900 px)
 * et cartel QR (dès 900 px, quel que soit l’appareil : un iPad en paysage le voit aussi).
 */
export function Flottants() {
  const appareil = useAppareil();
  return (
    <>
      {appareil && appareil !== "desktop" && (
        <div className={s.barre}>
          <div className={s.barreInner}>
            <Telecharger appareil={appareil} flottant />
          </div>
        </div>
      )}
      <div className={s.qr}>
        <Telecharger appareil="desktop" flottant />
      </div>
    </>
  );
}
