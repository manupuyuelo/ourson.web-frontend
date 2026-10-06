"use client";

import Image from "next/image";
import { useState } from "react";
import { AGES } from "@/lib/data";
import s from "./Age.module.css";

type Props = { compact?: boolean; sizes?: string };

/** Le même plat décliné par âge : photo en fondu entre trois états. */
export function Age({ compact = false, sizes = "(min-width: 900px) 460px, 100vw" }: Props) {
  const [i, setI] = useState(0);
  return (
    <div className={compact ? `${s.age} ${s.compact}` : s.age}>
      <div className={s.photo}>
        {AGES.map((a, k) => (
          <Image
            key={a.chip}
            src={a.src}
            alt={k === i ? a.chip : ""}
            fill
            sizes={sizes}
            style={{ opacity: k === i ? 1 : 0 }}
          />
        ))}
      </div>
      <fieldset className={s.chips}>
        <legend className="srOnly">Âge de l'enfant</legend>
        {AGES.map((a, k) => (
          <button key={a.chip} type="button" aria-pressed={k === i} onClick={() => setI(k)}>
            {a.chip}
          </button>
        ))}
      </fieldset>
    </div>
  );
}
