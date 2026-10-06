"use client";

import Image from "next/image";
import { useRef } from "react";
import { Icon } from "@/components/ds";
import { JEUX, SOIR, type CarteTag } from "@/lib/data";
import s from "./Carrousel.module.css";

const COULEURS: Record<CarteTag, [tint: string, ink: string, dot: string]> = {
  "À la maison": ["var(--eveil-tint)", "var(--eveil-ink)", "var(--eveil)"],
  Dehors: ["var(--sun-tint)", "var(--sun-ink)", "var(--sun)"],
  Comptine: ["var(--sommeil-tint)", "var(--sommeil-ink)", "var(--sommeil)"],
  Histoire: ["var(--coral-tint)", "var(--coral-ink)", "var(--coral)"],
};

type Props = { set: "jeux" | "soir"; label: string };

export function Carrousel({ set, label }: Props) {
  const piste = useRef<HTMLUListElement>(null);
  const items = set === "soir" ? SOIR : JEUX;
  const defiler = (sens: 1 | -1) => piste.current?.scrollBy({ left: sens * 264, behavior: "smooth" });

  return (
    <div className={s.carrousel}>
      <ul ref={piste} className={s.piste} aria-label={label}>
        {items.map((it) => {
          const [tint, ink, dot] = COULEURS[it.tag];
          return (
            <li key={it.title} className={s.carte} style={{ "--tint": tint, "--ink-c": ink, "--dot": dot }}>
              <Image src={it.src} alt="" sizes="238px" />
              <div className={s.texte}>
                <span className={s.tag}>{it.tag}</span>
                <h3 className={s.titre}>{it.title}</h3>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={s.boutons}>
        <button type="button" aria-label="Précédent" onClick={() => defiler(-1)}>
          <Icon name="chevronLeft" size={20} />
        </button>
        <button type="button" aria-label="Suivant" onClick={() => defiler(1)}>
          <Icon name="chevronRight" size={20} />
        </button>
      </div>
    </div>
  );
}
