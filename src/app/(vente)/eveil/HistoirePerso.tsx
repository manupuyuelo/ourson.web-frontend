"use client";

import { useState, type ReactNode } from "react";
import { HISTOIRE, fill } from "@/lib/data";
import s from "./eveil.module.css";

// Première page de « La baleine qui chante », réécrite avec le prénom et le doudou saisis.
const [texte, conseil] = HISTOIRE[0] ?? ["", ""];

/** `illustration` est rendue côté serveur : l’îlot client ne porte que les champs et le texte. */
export function HistoirePerso({ illustration }: { illustration: ReactNode }) {
  const [prenom, setPrenom] = useState("Léa");
  const [doudou, setDoudou] = useState("Pompon");

  return (
    <>
      <div className={s.histoire}>
        {illustration}
        <div className={s.histoireCorps}>
          <div className={s.histoireHaut}>
            <div className={s.histoireTitre}>La baleine qui chante</div>
            <span className={s.page1}>Page 1 sur 6</span>
          </div>
          <p className={s.histoireTexte}>{fill(texte, prenom, doudou)}</p>
          <div className={`${s.puce} ${s.soleil}`}>{fill(conseil, prenom, doudou)}</div>
        </div>
      </div>
      <div className={s.champs}>
        <label className={s.champ}>
          <span className="srOnly">Prénom</span>
          <input value={prenom} onChange={(e) => setPrenom(e.target.value)} autoComplete="off" />
        </label>
        <label className={s.champ}>
          <span className="srOnly">Doudou</span>
          <input value={doudou} onChange={(e) => setDoudou(e.target.value)} autoComplete="off" />
        </label>
      </div>
      <p className={s.aide}>Changez le prénom et le doudou&nbsp;: l’histoire suit.</p>
    </>
  );
}
