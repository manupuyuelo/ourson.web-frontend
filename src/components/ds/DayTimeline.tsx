import s from "./Timeline.module.css";

// Une journée sur 24 h : libellé 46, piste 22 r7 quadrillée, blocs nuit (encre) et siestes, total Baloo 11.5.
export type Segment = {
  /** Début et fin en fraction de journée (0 → 1). */
  from: number;
  to: number;
  nap?: boolean;
};

export type DayTimelineProps = {
  label: string;
  segments: readonly Segment[];
  total: string;
  today?: boolean;
};

/** Raccourci : segment en heures (h(13.4, 14.3, true) = sieste de 13 h 24 à 14 h 18). */
export const h = (from: number, to: number, nap = false): Segment => ({ from: from / 24, to: to / 24, nap });

export function DayTimeline({ label, segments, total, today = false }: DayTimelineProps) {
  return (
    <div className={today ? `${s.day} ${s.today}` : s.day}>
      <span className={s.dayLabel}>{label}</span>
      <span className={s.track}>
        {[25, 50, 75].map((p) => (
          <span key={p} className={s.grid} style={{ left: `${p}%` }} />
        ))}
        {segments.map((sg) => (
          <span
            key={`${sg.from}-${sg.to}`}
            className={sg.nap ? `${s.seg} ${s.nap}` : s.seg}
            style={{ left: `${sg.from * 100}%`, width: `${Math.max(0.4, (sg.to - sg.from) * 100)}%` }}
          />
        ))}
      </span>
      <span className={s.total}>{total}</span>
    </div>
  );
}
