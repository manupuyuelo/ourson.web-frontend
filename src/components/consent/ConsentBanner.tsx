"use client";

import Link from "next/link";
import { enregistrer, useConsentement } from "./consent";
import s from "./ConsentBanner.module.css";

// Rendu dès le HTML statique (sinon il apparaît après l'hydratation et devient l'élément LCP) ;
// le script du <head> le masque en CSS si un choix existe déjà.
export function ConsentBanner() {
  const choix = useConsentement();
  if (choix) return null;
  return (
    <section className={s.banner} aria-labelledby="consent-titre">
      <h2 id="consent-titre" className={s.title}>
        Un petit cookie ?
      </h2>
      <p className={s.text}>
        Avec votre accord, nous mesurons la fréquentation du site pour l&apos;améliorer. Rien n&apos;est
        déposé si vous refusez. <Link href="/confidentialite#cookies">En savoir plus</Link>
      </p>
      <div className={s.actions}>
        <button type="button" className={s.refuser} onClick={() => enregistrer("refuse")}>
          Refuser
        </button>
        <button type="button" className={s.accepter} onClick={() => enregistrer("accepte")}>
          Accepter
        </button>
      </div>
    </section>
  );
}
