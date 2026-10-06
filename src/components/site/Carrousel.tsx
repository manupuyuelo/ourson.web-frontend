import Image from "next/image";
import { JEUX, SOIR, type CarteTag } from "@/lib/data";
import { CarrouselBoutons } from "./CarrouselBoutons";
import s from "./Carrousel.module.css";

const COULEURS: Record<CarteTag, [tint: string, ink: string, dot: string]> = {
  "À la maison": ["var(--eveil-tint)", "var(--eveil-ink)", "var(--eveil)"],
  Dehors: ["var(--sun-tint)", "var(--sun-ink)", "var(--sun)"],
  Comptine: ["var(--sommeil-tint)", "var(--sommeil-ink)", "var(--sommeil)"],
  Histoire: ["var(--coral-tint)", "var(--coral-ink)", "var(--coral)"],
};

type Props = { set: "jeux" | "soir"; label: string };

/** Rendu serveur ; seuls les boutons précédent / suivant sont un îlot client. */
export function Carrousel({ set, label }: Props) {
  const items = set === "soir" ? SOIR : JEUX;
  const id = `carrousel-${set}`;

  return (
    <div className={s.carrousel}>
      <ul id={id} className={s.piste} aria-label={label}>
        {items.map((it) => {
          const [tint, ink, dot] = COULEURS[it.tag];
          return (
            <li key={it.title} className={s.carte} style={{ "--tint": tint, "--ink-c": ink, "--dot": dot }}>
              <Image src={it.src} alt="" sizes="238px" placeholder="blur" />
              <div className={s.texte}>
                <span className={s.tag}>{it.tag}</span>
                <h3 className={s.titre}>{it.title}</h3>
              </div>
            </li>
          );
        })}
      </ul>
      <CarrouselBoutons piste={id} />
    </div>
  );
}
