import { Icon } from "./Icon";
import s from "./ShopItem.module.css";

// Ligne de la liste de courses : case 24 r8 (ocre cochée), nom 14/700, sous-ligne 11/700, quantité 13/800.
export type ShopItemProps = {
  label: string;
  sub?: string;
  qty: string;
  checked?: boolean;
};

export function ShopItem({ label, sub, qty, checked = false }: ShopItemProps) {
  return (
    <div className={checked ? `${s.item} ${s.checked}` : s.item}>
      <span className={s.box}>{checked && <Icon name="check" size={15} color="#fff" />}</span>
      <div className={s.body}>
        <div className={s.label}>{label}</div>
        {sub && <div className={s.sub}>{sub}</div>}
      </div>
      <span className={s.qty}>{qty}</span>
    </div>
  );
}
