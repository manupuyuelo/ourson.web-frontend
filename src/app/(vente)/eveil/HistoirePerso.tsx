"use client";

import Image from "next/image";
import { useState } from "react";
import ouEsTuDoudou from "@/assets/echantillons/eveil/histoires/ou_es_tu_doudou.jpg";
import { HISTOIRE, fill } from "@/lib/data";
import s from "./eveil.module.css";

// Première page de « Où es-tu, doudou ? », réécrite avec le prénom et le doudou saisis.
const [texte, conseil] = HISTOIRE[0] ?? ["", ""];

export function HistoirePerso() {
  const [prenom, setPrenom] = useState("Léa");
  const [doudou, setDoudou] = useState("Pompon");

  return (
    <>
      <div className={s.histoire}>
        <Image src={ouEsTuDoudou} alt="" sizes="(min-width: 900px) 480px, 390px" />
        <div className={s.histoireCorps}>
          <div className={s.histoireHaut}>
            <div className={s.histoireTitre}>Où es-tu, doudou ?</div>
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
      <p className={s.aide}>Changez le prénom et le doudou : l&apos;histoire suit.</p>
    </>
  );
}
