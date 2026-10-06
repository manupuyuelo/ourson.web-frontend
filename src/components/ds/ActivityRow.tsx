import Image, { type StaticImageData } from "next/image";
import { Icon } from "./Icon";
import s from "./ActivityRow.module.css";

// Ligne d’activité Éveil : vignette 58 r15 (46 r13 en compact), titre Baloo 15.5, sous-ligne, « Plutôt vers… ».
export type ActivityRowProps = {
  image?: StaticImageData;
  title: string;
  meta?: string;
  hint?: string;
  trailing?: "chevron";
  compact?: boolean;
  last?: boolean;
};

export function ActivityRow({
  image,
  title,
  meta,
  hint,
  trailing,
  compact = false,
  last = false,
}: ActivityRowProps) {
  const cls = [s.row, compact && s.compact, last && s.last].filter(Boolean).join(" ");
  return (
    <div className={cls}>
      <div className={s.inner}>
        {image ? (
          <Image src={image} alt="" className={s.thumb} sizes={compact ? "46px" : "58px"} />
        ) : (
          <span className={s.thumb} />
        )}
        <div className={s.body}>
          <div className={s.title}>{title}</div>
          {meta && <div className={s.meta}>{meta}</div>}
          {hint && <span className={s.hint}>{hint}</span>}
        </div>
        {trailing === "chevron" && <Icon name="chevronRight" size={22} color="var(--eveil-deep)" />}
      </div>
    </div>
  );
}
