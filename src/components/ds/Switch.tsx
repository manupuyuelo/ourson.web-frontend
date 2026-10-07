import s from "./Switch.module.css";

// Interrupteur 51 × 31 du design system (components/forms/Switch) : corail actif, --line inactif.
export type SwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  /** id de l’élément qui décrit le réglage, lu après le nom. */
  describedBy?: string;
  disabled?: boolean;
};

export function Switch({ value, onChange, label, describedBy, disabled = false }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      aria-describedby={describedBy}
      disabled={disabled}
      className={s.switch}
      onClick={() => onChange(!value)}
    >
      <span className={s.pouce} />
    </button>
  );
}
