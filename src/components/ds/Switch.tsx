import s from "./Switch.module.css";

// Interrupteur 51 × 31 du design system (components/forms/Switch) : corail actif, --line inactif.
export type SwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
};

export function Switch({ value, onChange, label, disabled = false }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      disabled={disabled}
      className={s.switch}
      onClick={() => onChange(!value)}
    >
      <span className={s.pouce} />
    </button>
  );
}
