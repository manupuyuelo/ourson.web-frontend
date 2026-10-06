import s from "./DivHead.module.css";

// En-tête de la diversification : anneau de progression 92, valeur Baloo 22, kicker 11/800, titre Baloo 17.
export type DivHeadProps = {
  value: number;
  total: number;
  kicker: string;
  title: string;
  text: string;
};

export function DivHead({ value, total, kicker, title, text }: DivHeadProps) {
  return (
    <div className={s.head}>
      <span className={s.ring} style={{ "--deg": `${(value / total) * 360}deg` }}>
        <span className={s.hole}>
          <span className={s.value}>{value}</span>
          <span className={s.total}>sur {total}</span>
        </span>
      </span>
      <div className={s.body}>
        <div className={s.kicker}>{kicker}</div>
        <div className={s.title}>{title}</div>
        <div className={s.text}>{text}</div>
      </div>
    </div>
  );
}
