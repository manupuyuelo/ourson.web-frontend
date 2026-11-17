"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { Telecharger } from "@/components/site/Telecharger";
import { estInvitation, lienApp, lireInvitation, type Langue } from "@/lib/invitation";
import { OURS } from "@/lib/ours";
import s from "./invitation.module.css";

const TEXTES: Record<
  Langue,
  { titre: string; avecAdresse: [string, string]; sansAdresse: string; bouton: string; repli: string }
> = {
  fr: {
    titre: "Une invitation vous attend",
    avecAdresse: ["Ouvrez Ourson et inscrivez-vous avec l’adresse ", ", celle qui a reçu l’invitation."],
    sansAdresse: "Ouvrez Ourson : l’invitation vous attend sur l’accueil.",
    bouton: "Ouvrir Ourson",
    repli: "Pas encore l’app ? Téléchargez-la, puis revenez sur ce lien.",
  },
  en: {
    titre: "An invitation is waiting for you",
    avecAdresse: ["Open Ourson and sign up with ", ", the address that received the invitation."],
    sansAdresse: "Open Ourson: your invitation is waiting on the home screen.",
    bouton: "Open Ourson",
    repli: "Don’t have the app yet? Download it, then come back to this link.",
  },
};

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

/**
 * Le fragment n’existe que dans le navigateur : rendu serveur en français, sans adresse, puis
 * la langue et l’adresse du lien. La page n’ouvre jamais l’app d’elle-même : si elle s’affiche,
 * l’app manque ou le lien universel n’a pas joué (navigateur intégré, appui long), et
 * `ourson://` sans app ferait afficher « adresse non valide » à Safari.
 */
export function Invitation() {
  const fragment = useSyncExternalStore(surFragment, fragmentInvitation, () => "");
  const { email, langue } = lireInvitation(fragment);
  const t = TEXTES[langue];

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
            {t.avecAdresse[0]}
            <strong className={s.adresse}>{email}</strong>
            {t.avecAdresse[1]}
          </>
        ) : (
          t.sansAdresse
        )}
      </p>
      <a href={lienApp(email)} className={s.bouton}>
        {t.bouton}
      </a>
      <p className={s.repli}>{t.repli}</p>
      {/* Badges et mentions des stores : en français, comme le reste du site. */}
      <div lang="fr" className={s.stores}>
        <Telecharger emplacement="fin" />
      </div>
    </main>
  );
}
