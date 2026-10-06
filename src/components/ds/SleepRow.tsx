import { Icon } from "./Icon";
import s from "./SleepRow.module.css";

// Ligne d'un sommeil (nuit ou sieste) : tuile 48, surtitre, nom Baloo 16, heures, signature, durée, chevron.

// Teintes des adultes du foyer, dans l'ordre d'arrivée (theme.ts · personTints).
const PERSON = [
  ["var(--sommeil-tint)", "var(--sommeil-ink)"],
  ["var(--coral-tint)", "var(--coral-ink)"],
  ["var(--mamie-tint)", "var(--mamie-ink)"],
  ["var(--sun-tint)", "var(--sun-ink)"],
  ["var(--sky-tint)", "var(--sky-ink)"],
] as const;

const TAG = {
  green: ["var(--eveil-tint)", "var(--eveil-ink)"],
  fix: ["var(--sun-tint)", "var(--sun-ink)"],
  sommeil: ["var(--sommeil-tint)", "var(--sommeil-ink)"],
} as const;

export type SleepTag = { label: string; tone: keyof typeof TAG };

export type SleepRowProps = {
  kind: "night" | "nap";
  eyebrow?: string;
  title?: string;
  times: string;
  inBed?: string;
  duration: string;
  by?: string;
  byIndex?: number;
  tags?: readonly SleepTag[];
  running?: boolean;
};

const NO_TAGS: readonly SleepTag[] = [];

const tint = ([bg, fg]: readonly [string, string]) => ({ "--bg-c": bg, "--fg-c": fg });

export function SleepRow({
  kind,
  eyebrow,
  title,
  times,
  inBed,
  duration,
  by,
  byIndex = 1,
  tags = NO_TAGS,
  running = false,
}: SleepRowProps) {
  const night = kind === "night";
  const person = PERSON[byIndex % PERSON.length] ?? PERSON[0];
  return (
    <div className={night ? `${s.row} ${s.night}` : s.row}>
      <span className={s.tile}>
        <Icon name={night ? "sleepMoon" : "sun"} size={20} color={night ? "#fff" : "var(--sun-ink)"} />
      </span>
      <div className={s.body}>
        {eyebrow && <div className={s.eyebrow}>{eyebrow}</div>}
        <div className={s.title}>{title ?? (night ? "Nuit" : "Sieste")}</div>
        <div className={s.times}>{times}</div>
        {inBed && <div className={s.times}>{inBed}</div>}
        {(by || tags.length > 0) && (
          <div className={s.meta}>
            {by && (
              <>
                <span className={s.initial} style={tint(person)}>
                  {by.charAt(0).toUpperCase()}
                </span>
                <span className={s.by}>par {by}</span>
              </>
            )}
            {tags.map((t) => (
              <span key={t.label} className={s.tag} style={tint(TAG[t.tone])}>
                {t.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={s.end}>
        <div className={s.duration}>{duration}</div>
        {!running && <div className={s.slept}>dormi</div>}
      </div>
      {!running && <Icon name="chevronRight" size={22} color="var(--sommeil-deep)" />}
    </div>
  );
}
