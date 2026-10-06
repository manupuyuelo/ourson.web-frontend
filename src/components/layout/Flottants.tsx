"use client";

import { Telecharger } from "@/components/site/Telecharger";
import { useAppareil } from "@/lib/useAppareil";
import s from "./Flottants.module.css";

/** Barre mobile (badge du store) et bloc QR desktop, sur les pages de vente. */
export function Flottants() {
  const appareil = useAppareil();
  return (
    <>
      {appareil && appareil !== "desktop" && (
        <div className={s.barre}>
          <div className={s.barreInner}>
            <Telecharger appareil={appareil} />
          </div>
        </div>
      )}
      {appareil === "desktop" && (
        <div className={s.qr}>
          <div className={s.qrInner}>
            <Telecharger appareil="desktop" />
          </div>
        </div>
      )}
    </>
  );
}
