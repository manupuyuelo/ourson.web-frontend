import type { Route } from "next";
import Link from "next/link";
import { RUBRIQUES, formatDate, oursDeRubrique, type Article } from "@/lib/blog";
import { CloudinaryImage } from "./CloudinaryImage";
import { couleurs } from "./rubrique";
import s from "./ArticleCard.module.css";

/** Largeurs rendues des cartes de grille (colonne 430 px sous 900 px, 3 colonnes au-delà). */
const SIZES_GRILLE =
  "(min-width: 900px) 310px, (min-width: 640px) 170px, (min-width: 430px) 370px, calc(100vw - 60px)";
const SIZES_UNE = "(min-width: 900px) 530px, (min-width: 430px) 370px, calc(100vw - 64px)";

type Props = {
  article: Article;
  /** « une » : article à la une du blog · « grille » : liste du blog · « lie » : « À lire aussi ». */
  variante: "une" | "grille" | "lie";
  eager?: boolean;
};

export function ArticleCard({ article: a, variante, eager }: Props) {
  const une = variante === "une";
  const date = <time dateTime={a.date.toISOString()}>{formatDate(a.date)}</time>;
  const Titre = une ? "h2" : "h3";

  return (
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- les routes typées refusent un `${string}` (il pourrait contenir « / »).
    <Link href={a.href as Route} className={une ? s.une : s.carte} style={couleurs(a.rubrique)}>
      <CloudinaryImage
        src={a.image}
        repli={oursDeRubrique(a.rubrique)}
        alt=""
        sizes={une ? SIZES_UNE : SIZES_GRILLE}
        width={800}
        height={500}
        className={une ? s.imgUne : s.img}
        eager={eager}
      />
      <div className={une ? s.txtUne : s.txt}>
        {variante === "lie" ? (
          <div className={s.date}>{date}</div>
        ) : (
          <div className={s.meta}>
            <span className={une ? s.pastilleUne : s.pastille}>{RUBRIQUES[a.rubrique].label}</span>
            <span className={s.date}>{date}</span>
          </div>
        )}
        <Titre className={une ? s.h2 : variante === "lie" ? s.h3Lie : s.h3}>{a.title}</Titre>
        {variante !== "lie" && <p className={une ? s.descUne : s.desc}>{a.description}</p>}
        {une && <span className={s.lire}>Lire l&apos;article →</span>}
      </div>
    </Link>
  );
}
