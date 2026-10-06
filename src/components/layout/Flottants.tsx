"use client";

import { Telecharger } from "@/components/site/Telecharger";
import { useAppareil } from "@/lib/useAppareil";
import s from "./Flottants.module.css";

/**
 * Pages de vente : sur un téléphone ou une tablette, le cartel du store de l'appareil, à toutes les
 * largeurs (on ne fait pas scanner un QR à l'appareil qu'on tient). Sur ordinateur, le cartel QR dès 900 px.
 */
export function Flottants() {
  const appareil = useAppareil();
  if (!appareil) return null;
  if (appareil !== "desktop") {
    return (
      <div className={s.barre}>
        <div className={s.barreInner}>
          <Telecharger appareil={appareil} flottant />
        </div>
      </div>
    );
  }
  return (
    <div className={s.qr}>
      <Telecharger appareil="desktop" flottant />
    </div>
  );
}
