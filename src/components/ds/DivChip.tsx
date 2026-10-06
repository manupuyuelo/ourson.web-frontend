import { Icon } from "./Icon";
import s from "./DivChip.module.css";

// Aliment de la diversification : `got` ocre plein, `next` pointillé vert + plus.
export type DivChipProps = {
  label: string;
  tone: "got" | "next";
};

export function DivChip({ label, tone }: DivChipProps) {
  return (
    <span className={`${s.chip} ${s[tone]}`}>
      {tone === "next" && <Icon name="plus" size={14} strokeWidth={2.4} color="var(--eveil)" />}
      {label}
    </span>
  );
}
