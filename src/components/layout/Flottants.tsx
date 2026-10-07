"use client";

import { usePathname } from "next/navigation";
import { Telecharger } from "@/components/site/Telecharger";
import { useAppareil } from "@/lib/useAppareil";
import s from "./Flottants.module.css";

/**
 * Pages de vente : sur un téléphone ou une tablette, le cartel du store de l'appareil, à toutes les
 * largeurs (on ne fait pas scanner un QR à l'appareil qu'on tient). Sur ordinateur, le cartel QR dès 900 px.
 */
export function Flottants() {
  const appareil = useAppareil();
  // Le layout des pages de vente persiste d’une page à l’autre : le cartel repart de zéro à chaque page.
  const page = usePathname();
  if (!appareil) return null;
  if (appareil !== "desktop") {
    return (
      <div className={s.barre}>
        <div className={s.barreInner}>
          <Telecharger key={page} appareil={appareil} flottant emplacement="cartel" />
        </div>
      </div>
    );
  }
  return (
    <div className={s.qr}>
      <Telecharger key={page} appareil="desktop" flottant emplacement="cartel" />
    </div>
  );
}
