import s from "./Timeline.module.css";

const SWATCHES = ["var(--sommeil-ink)", "var(--sommeil-nap)", "var(--sommeil-future)"] as const;

export type TimelineLegendProps = {
  items?: readonly string[];
};

const ITEMS = ["nuit", "siestes", "pas encore arrivé"] as const;

export function TimelineLegend({ items = ITEMS }: TimelineLegendProps) {
  return (
    <div className={s.legend}>
      {items.map((t, i) => (
        <span key={t} className={s.legendItem}>
          <span className={s.swatch} style={{ background: SWATCHES[i % 3] }} />
          {t}
        </span>
      ))}
    </div>
  );
}
