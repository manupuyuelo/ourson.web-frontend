"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { SITE, storePublie } from "@/lib/site";
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
const IOS_PUBLIE = storePublie(SITE.appStoreUrl);
const ANDROID_PUBLIE = storePublie(SITE.playStoreUrl);
// Avant la sortie de l’app : mention « Bientôt » (prévue par le handoff), badges sans lien.
const BIENTOT = "Bientôt sur l’App Store et Google Play.";
const SCANNEZ = "Scannez ce code avec l’appareil photo de votre téléphone.";
const CONSIGNE = IOS_PUBLIE || ANDROID_PUBLIE ? SCANNEZ : BIENTOT;

/** Lien vers un store, ou simple élément tant que la fiche n’est pas publiée (rien ne mène nulle part). */
function LienStore({
  store,
  emplacement,
  className,
  children,
}: {
  store: "app_store" | "google_play";
  emplacement: Emplacement;
  className?: string;
  children: ReactNode;
}) {
  const ios = store === "app_store";
  const nom = ios ? "l’App Store" : "Google Play";
  if (!(ios ? IOS_PUBLIE : ANDROID_PUBLIE)) {
    // La mention « Bientôt » qui accompagne chaque badge l’annonce aussi aux lecteurs d’écran.
    return <span className={className}>{children}</span>;
  }
  return (
    <a
      href={ios ? SITE.appStoreUrl : SITE.playStoreUrl}
      className={className}
      aria-label={`Ourson sur ${nom}`}
      onClick={() => suivreStore(store, emplacement)}
    >
      {children}
    </a>
  );
}

/** Un seul élément selon l’appareil : badge App Store (iOS), badge Google Play (autre mobile), QR (ordinateur). */
export function Telecharger({ sombre = false, appareil, flottant = false, emplacement }: Props) {
  const detecte = useAppareil();
  const dev = appareil ?? detecte;

  if (flottant) return dev ? <Cartel dev={dev} emplacement={emplacement} /> : null;

  if (dev === "ios") {
    return (
      <div className={s.wrap}>
        <LienStore store="app_store" emplacement={emplacement} className={s.badge}>
          <Image src={sombre ? appStoreBlanc : appStoreNoir} alt="Télécharger dans l’App Store" height={48} />
        </LienStore>
        {!IOS_PUBLIE && (
          <p className={sombre ? `${s.bientot} ${s.bientotSombre}` : s.bientot}>Bientôt disponible</p>
        )}
      </div>
    );
  }
  if (dev === "android") {
    return (
      <div className={s.wrap}>
        <LienStore store="google_play" emplacement={emplacement} className={s.badge}>
          <Image src={sombre ? playBlanc : playNoir} alt="Disponible sur Google Play" height={48} />
        </LienStore>
        {!ANDROID_PUBLIE && (
          <p className={sombre ? `${s.bientot} ${s.bientotSombre}` : s.bientot}>Bientôt disponible</p>
        )}
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
      <LienStore store="app_store" emplacement={emplacement}>
        <Image src={appleLogo} alt="" height={petit ? 22 : 24} className={s.apple} />
      </LienStore>
      <span className={s.dot} />
      <LienStore store="google_play" emplacement={emplacement}>
        <Image src={androidLogo} alt="" height={petit ? 18 : 20} className={s.android} />
      </LienStore>
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
  const publie = ios ? IOS_PUBLIE : ANDROID_PUBLIE;
  return (
    <div className={classe} aria-hidden={masque || undefined} inert={masque} data-cartel={dev}>
      <Image src={appIcon} alt="" width={44} height={44} sizes="44px" className={s.cartelIcone} />
      <div className={s.cartelTitre}>{publie ? "Téléchargez l’app" : "Bientôt disponible"}</div>
      <LienStore
        store={ios ? "app_store" : "google_play"}
        emplacement={emplacement}
        className={s.cartelBadge}
      >
        <Image
          src={ios ? appStoreNoir : playNoir}
          alt={ios ? "Télécharger dans l’App Store" : "Disponible sur Google Play"}
          height={40}
        />
      </LienStore>
    </div>
  );
}
