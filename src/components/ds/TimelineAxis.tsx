import s from "./Timeline.module.css";

// Axe 0 h → 24 h, placé au-dessus des frises (mêmes colonnes que DayTimeline).
const HOURS = [0, 6, 12, 18, 24] as const;

export function TimelineAxis() {
  return (
    <div className={s.axis} aria-hidden="true">
      <span className={s.label} />
      <span className={s.scale}>
        {HOURS.map((h) => (
          <span
            key={h}
            className={h === 0 ? `${s.tick} ${s.tickStart}` : h === 24 ? `${s.tick} ${s.tickEnd}` : s.tick}
            style={{ "--at": `${(h / 24) * 100}%` }}
          >
            {h} h
          </span>
        ))}
      </span>
      <span className={s.totalCol} />
    </div>
  );
}
