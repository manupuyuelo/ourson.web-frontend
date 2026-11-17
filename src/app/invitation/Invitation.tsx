"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Telecharger } from "@/components/site/Telecharger";
import appIcon from "@/assets/icon.png";
import {
  estInvitation,
  lienAndroid,
  lienApp,
  lienInvitation,
  lireInvitation,
  type Langue,
} from "@/lib/invitation";
import { OURS } from "@/lib/ours";
import { SITE, storePublie } from "@/lib/site";
import { useAppareil } from "@/lib/useAppareil";
import s from "./invitation.module.css";

type Textes = {
  titre: string;
  avecAdresse: [string, string];
  sansAdresse: string;
  bouton: string;
  repli: string;
  /** Sur ordinateur, l’app n’existe pas : la page renvoie vers le téléphone par un QR du lien. */
  ordinateur: {
    avecAdresse: [string, string];
    sansAdresse: string;
    carte: string;
    consigne: string;
    alt: string;
    repli: string;
  };
};

const TEXTES: Record<Langue, Textes> = {
  fr: {
    titre: "Une invitation vous attend",
    avecAdresse: ["Ouvrez Ourson et inscrivez-vous avec l’adresse ", ", celle qui a reçu l’invitation."],
    sansAdresse: "Ouvrez Ourson : l’invitation vous attend sur l’accueil.",
    bouton: "Ouvrir Ourson",
    repli: "Pas encore l’app ? Téléchargez-la, puis revenez sur ce lien.",
    ordinateur: {
      avecAdresse: [
        "Ourson s’utilise sur téléphone. Scannez ce code avec votre téléphone pour vous inscrire avec l’adresse ",
        ", celle qui a reçu l’invitation.",
      ],
      sansAdresse:
        "Ourson s’utilise sur téléphone. Scannez ce code avec votre téléphone : l’invitation vous attend sur l’accueil de l’app.",
      carte: "Continuez sur votre téléphone",
      consigne: "Scannez ce code avec l’appareil photo de votre téléphone.",
      alt: "QR code de votre invitation",
      repli: "Vous pouvez aussi ouvrir l’email directement sur votre téléphone.",
    },
  },
  en: {
    titre: "An invitation is waiting for you",
    avecAdresse: ["Open Ourson and sign up with ", ", the address that received the invitation."],
    sansAdresse: "Open Ourson: your invitation is waiting on the home screen.",
    bouton: "Open Ourson",
    repli: "Don’t have the app yet? Download it, then come back to this link.",
    ordinateur: {
      avecAdresse: [
        "Ourson is a phone app. Scan this code with your phone to sign up with ",
        ", the address that received the invitation.",
      ],
      sansAdresse:
        "Ourson is a phone app. Scan this code with your phone: your invitation is waiting on the app’s home screen.",
      carte: "Continue on your phone",
      consigne: "Scan this code with your phone’s camera.",
      alt: "QR code for your invitation",
      repli: "You can also open the email directly on your phone.",
    },
  },
};

/** Android, stores ouverts : l’app si elle est installée, sinon la fiche Play Store, en un appui. */
const PLAY_PUBLIE = storePublie(SITE.playStoreUrl);

/**
 * Le dernier fragment qui porte une invitation : un autre (« Aller au contenu », `#contenu`) ne
 * l’efface pas ; une URL sans fragment repart de zéro.
 */
let dernier = "";
const fragmentInvitation = () => {
  if (location.hash === "" || estInvitation(location.hash)) dernier = location.hash;
  return dernier;
};

const surFragment = (rappel: () => void) => {
  window.addEventListener("hashchange", rappel);
  return () => window.removeEventListener("hashchange", rappel);
};

/** QR du lien d’invitation, calculé dans le navigateur : l’adresse ne part sur aucun serveur. */
function useQr(url: string | null): string | null {
  const [qr, setQr] = useState<{ url: string; src: string } | null>(null);
  useEffect(() => {
    if (!url) return undefined;
    let actif = true;
    void import("qrcode")
      .then(({ default: QRCode }) =>
        QRCode.toString(url, {
          type: "svg",
          errorCorrectionLevel: "H",
          margin: 0,
          color: { dark: "#000000", light: "#ffffff" },
        }),
      )
      .then((svg) => {
        if (actif) setQr({ url, src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` });
      });
    return () => {
      actif = false;
    };
  }, [url]);
  return qr && qr.url === url ? qr.src : null;
}

/**
 * La page ne s’affiche que si le lien universel n’a pas ouvert l’app (app absente, navigateur
 * intégré, appui long). Elle n’ouvre jamais l’app d’elle-même : `ourson://` sans app ferait
 * afficher « adresse non valide » à Safari. Selon l’appareil :
 *  • iPhone : « Ouvrir Ourson » (`ourson://`), puis le badge App Store (et la bannière de Safari) ;
 *  • Android : « Ouvrir Ourson » en `intent://`, qui bascule seul sur le Play Store sans l’app ;
 *  • ordinateur : pas de bouton, un QR du lien d’invitation pour continuer sur le téléphone.
 * Le fragment n’existe que dans le navigateur : rendu serveur en français, sans adresse. Tant que
 * l’appareil est inconnu, la version téléphone et la version ordinateur sont rendues, l’une ou
 * l’autre masquée en CSS selon le pointeur, comme Telecharger réserve sa place.
 */
export function Invitation() {
  const fragment = useSyncExternalStore(surFragment, fragmentInvitation, () => "");
  const { email, langue } = lireInvitation(fragment);
  const appareil = useAppareil();
  const t = TEXTES[langue];
  const enAttente = appareil === null;
  const telephone = appareil !== "desktop";
  const ordinateur = appareil === "desktop" || enAttente;
  const qr = useQr(ordinateur ? lienInvitation(email, langue) : null);

  const lien = appareil === "android" && PLAY_PUBLIE ? lienAndroid(email, SITE.playStoreUrl) : lienApp(email);
  const texte = appareil === "desktop" ? t.ordinateur : t;
  const versionTelephone = enAttente ? s.telephoneEnAttente : undefined;

  return (
    <main id="contenu" className={s.page} lang={langue}>
      <Image
        src={OURS.accueil}
        alt=""
        className={s.ours}
        sizes="160px"
        loading="eager"
        fetchPriority="high"
      />
      <h1 className={s.titre}>{t.titre}</h1>
      <p className={s.texte}>
        {email ? (
          <>
            {texte.avecAdresse[0]}
            <strong className={s.adresse}>{email}</strong>
            {texte.avecAdresse[1]}
          </>
        ) : (
          texte.sansAdresse
        )}
      </p>
      {telephone && (
        <>
          <a href={lien} className={[s.bouton, versionTelephone].filter(Boolean).join(" ")}>
            {t.bouton}
          </a>
          <p className={[s.repli, versionTelephone].filter(Boolean).join(" ")}>{t.repli}</p>
        </>
      )}
      {ordinateur && (
        <div className={enAttente ? `${s.carte} ${s.ordinateurEnAttente}` : s.carte}>
          <div className={s.carteTitre}>{t.ordinateur.carte}</div>
          <div className={s.code}>
            {qr ? (
              // oxlint-disable-next-line nextjs/no-img-element -- SVG calculé dans le navigateur (data:)
              <img src={qr} alt={t.ordinateur.alt} width={180} height={180} />
            ) : (
              <div className={s.qrVide} aria-hidden="true" />
            )}
            <Image src={appIcon} alt="" width={44} height={44} sizes="44px" className={s.icone} />
          </div>
          <div className={s.consigne}>{t.ordinateur.consigne}</div>
        </div>
      )}
      {appareil === "desktop" && <p className={s.repli}>{t.ordinateur.repli}</p>}
      {telephone && (
        // Badges et mentions des stores : en français, comme le reste du site.
        <div lang="fr" className={[s.stores, versionTelephone].filter(Boolean).join(" ")}>
          <Telecharger emplacement="fin" />
        </div>
      )}
    </main>
  );
}
