"use client";

import Image from "next/image";
import { SITE } from "@/lib/site";
import { useAppareil } from "@/lib/useAppareil";
import { useCartelMasque } from "@/lib/useCartelMasque";
import { suivreStore, type Emplacement } from "@/lib/mesure";
import type { Appareil } from "@/lib/device";
import appStoreNoir from "@/assets/stores/app-store-badge-noir.svg";
import appStoreBlanc from "@/assets/stores/app-store-badge-blanc.svg";
import playNoir from "@/assets/stores/google-play-badge-noir.svg";
import playBlanc from "@/assets/stores/google-play-badge-blanc.svg";
import appleLogo from "@/assets/stores/apple-logo-noir.svg";
import androidLogo from "@/assets/stores/android-logo-noir.svg";
import appIcon from "@/assets/icon.png";
// Icône : `sizes` donne un srcset en largeurs, pour que les écrans ×3 reçoivent une image assez définie.
import s from "./Telecharger.module.css";

type Props = {
  /** Badges blancs, pour un fond sombre. */
  sombre?: boolean;
  /** Force un rendu (le cartel QR flottant est toujours en mode ordinateur). */
  appareil?: Appareil;
  /** Cartel compact fixé en bas de l’écran, qui s’efface devant les autres blocs de téléchargement. */
  flottant?: boolean;
  /** Origine des clics, envoyée avec l’événement `ourson_store`. */
  emplacement: Emplacement;
};

const QR_ALT = `QR code vers ${SITE.url}/app`;
const CONSIGNE = "Scannez ce code avec l’appareil photo de votre téléphone.";

/** Un seul élément selon l’appareil : badge App Store (iOS), badge Google Play (autre mobile), QR (ordinateur). */
export function Telecharger({ sombre = false, appareil, flottant = false, emplacement }: Props) {
  const detecte = useAppareil();
  const dev = appareil ?? detecte;

  if (flottant) return dev ? <Cartel dev={dev} emplacement={emplacement} /> : null;

  if (dev === "ios") {
    return (
      <div className={s.wrap}>
        <a
          href={SITE.appStoreUrl}
          className={s.badge}
          aria-label="Ourson sur l’App Store"
          onClick={() => suivreStore("app_store", emplacement)}
        >
          <Image src={sombre ? appStoreBlanc : appStoreNoir} alt="Télécharger dans l’App Store" height={48} />
        </a>
      </div>
    );
  }
  if (dev === "android") {
    return (
      <div className={s.wrap}>
        <a
          href={SITE.playStoreUrl}
          className={s.badge}
          aria-label="Ourson sur Google Play"
          onClick={() => suivreStore("google_play", emplacement)}
        >
          <Image src={sombre ? playBlanc : playNoir} alt="Disponible sur Google Play" height={48} />
        </a>
      </div>
    );
  }
  return (
    <div className={s.wrap}>
      {dev === null && <div className={s.pending} aria-hidden="true" />}
      <div className={dev === null ? `${s.qr} ${s.pendingQr}` : s.qr}>
        <div className={s.qrTitle}>Téléchargez l’app</div>
        <Stores emplacement={emplacement} />
        <div className={s.code}>
          <Image src="/qr.svg" alt={QR_ALT} width={180} height={180} unoptimized />
          <Image src={appIcon} alt="" width={44} height={44} sizes="44px" className={s.icon} />
        </div>
        <div className={s.hint}>{CONSIGNE}</div>
      </div>
    </div>
  );
}

function Stores({ petit = false, emplacement }: { petit?: boolean; emplacement: Emplacement }) {
  return (
    <div className={petit ? `${s.stores} ${s.storesPetit}` : s.stores}>
      <a
        href={SITE.appStoreUrl}
        aria-label="Ourson sur l’App Store"
        onClick={() => suivreStore("app_store", emplacement)}
      >
        <Image src={appleLogo} alt="" height={petit ? 22 : 24} className={s.apple} />
      </a>
      <span className={s.dot} />
      <a
        href={SITE.playStoreUrl}
        aria-label="Ourson sur Google Play"
        onClick={() => suivreStore("google_play", emplacement)}
      >
        <Image src={androidLogo} alt="" height={petit ? 18 : 20} className={s.android} />
      </a>
    </div>
  );
}

/** Mobile : icône, titre et badge du store. Ordinateur : QR 112 px, titre, consigne et logos. */
function Cartel({ dev, emplacement }: { dev: Appareil; emplacement: Emplacement }) {
  const masque = useCartelMasque();
  const classe = `${s.cartel} ${dev === "desktop" ? s.cartelQr : ""} ${masque ? s.masque : ""}`;

  if (dev === "desktop") {
    return (
      <div className={classe} aria-hidden={masque || undefined} inert={masque} data-cartel={dev}>
        <div className={s.cartelCode}>
          <Image src="/qr.svg" alt={QR_ALT} width={112} height={112} unoptimized />
          <Image src={appIcon} alt="" width={28} height={28} sizes="28px" className={s.cartelCodeIcone} />
        </div>
        <div className={s.cartelCorps}>
          <div className={s.cartelTitreQr}>Téléchargez l’app</div>
          <div className={s.cartelConsigne}>{CONSIGNE}</div>
          <Stores petit emplacement={emplacement} />
        </div>
      </div>
    );
  }

  const ios = dev === "ios";
  return (
    <div className={classe} aria-hidden={masque || undefined} inert={masque} data-cartel={dev}>
      <Image src={appIcon} alt="" width={44} height={44} sizes="44px" className={s.cartelIcone} />
      <div className={s.cartelTitre}>Téléchargez l’app</div>
      <a
        href={ios ? SITE.appStoreUrl : SITE.playStoreUrl}
        onClick={() => suivreStore(ios ? "app_store" : "google_play", emplacement)}
        className={s.cartelBadge}
        aria-label={ios ? "Ourson sur l’App Store" : "Ourson sur Google Play"}
      >
        <Image
          src={ios ? appStoreNoir : playNoir}
          alt={ios ? "Télécharger dans l’App Store" : "Disponible sur Google Play"}
          height={40}
        />
      </a>
    </div>
  );
}
