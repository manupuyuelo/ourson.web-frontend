"use client";

import Image from "next/image";
import { SITE } from "@/lib/site";
import { useAppareil } from "@/lib/useAppareil";
import type { Appareil } from "@/lib/device";
import appStoreNoir from "@/assets/stores/app-store-badge-noir.svg";
import appStoreBlanc from "@/assets/stores/app-store-badge-blanc.svg";
import playNoir from "@/assets/stores/google-play-badge-noir.svg";
import playBlanc from "@/assets/stores/google-play-badge-blanc.svg";
import appleLogo from "@/assets/stores/apple-logo-noir.svg";
import androidLogo from "@/assets/stores/android-logo-noir.svg";
import appIcon from "@/assets/icon.png";
import s from "./Telecharger.module.css";

type Props = {
  /** Badges blancs, pour un fond sombre. */
  sombre?: boolean;
  /** Force un rendu (le bloc QR flottant est toujours en mode ordinateur). */
  appareil?: Appareil;
};

/** Un seul élément selon l'appareil : badge App Store (iOS), badge Google Play (autre mobile), QR (ordinateur). */
export function Telecharger({ sombre = false, appareil }: Props) {
  const detecte = useAppareil();
  const dev = appareil ?? detecte;

  if (dev === "ios") {
    return (
      <div className={s.wrap}>
        <a href={SITE.appStoreUrl} className={s.badge} aria-label="Ourson sur l'App Store">
          <Image src={sombre ? appStoreBlanc : appStoreNoir} alt="Télécharger dans l'App Store" height={48} />
        </a>
      </div>
    );
  }
  if (dev === "android") {
    return (
      <div className={s.wrap}>
        <a href={SITE.playStoreUrl} className={s.badge} aria-label="Ourson sur Google Play">
          <Image src={sombre ? playBlanc : playNoir} alt="Disponible sur Google Play" height={48} />
        </a>
      </div>
    );
  }
  return (
    <div className={s.wrap}>
      {dev === null && <div className={s.pending} aria-hidden="true" />}
      <div className={dev === null ? `${s.qr} ${s.pendingQr}` : s.qr}>
        <div className={s.qrTitle}>Téléchargez l&apos;app</div>
        <div className={s.stores}>
          <a href={SITE.appStoreUrl} aria-label="Ourson sur l'App Store">
            <Image src={appleLogo} alt="" height={20} />
          </a>
          <span className={s.dot} />
          <a href={SITE.playStoreUrl} aria-label="Ourson sur Google Play">
            <Image src={androidLogo} alt="" height={20} />
          </a>
        </div>
        <div className={s.code}>
          <Image src="/qr.svg" alt={`QR code vers ${SITE.url}`} width={180} height={180} unoptimized />
          <Image src={appIcon} alt="" width={44} height={44} className={s.icon} />
        </div>
        <div className={s.hint}>Scannez ce code avec l&apos;appareil photo de votre téléphone.</div>
      </div>
    </div>
  );
}
