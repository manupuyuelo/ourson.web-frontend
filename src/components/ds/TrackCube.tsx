import { Icon, type IconName } from "./Icon";
import s from "./TrackCube.module.css";

// Éveil › Jalons — cube de bois d'une piste : face tintée, arête basse, cadre pointillé.
const TRACKS = {
  gross_motor: ["var(--sun-tint)", "var(--sun-ink)", "var(--sun)", "run"],
  fine_motor: ["var(--coral-tint)", "var(--coral-ink)", "var(--coral-bright)", "hand"],
  language: ["var(--sommeil-tint)", "var(--sommeil-ink)", "var(--sommeil)", "bubble"],
  social: ["var(--mamie-tint)", "var(--mamie-ink)", "var(--mamie-edge)", "usersPair"],
  cognitive: ["var(--sky-tint)", "var(--sky-ink)", "var(--sky-edge)", "cubes"],
  autonomy: ["var(--eveil-tint)", "var(--eveil-ink)", "var(--eveil)", "spoon"],
} as const satisfies Record<string, readonly [string, string, string, IconName]>;

export type Track = keyof typeof TRACKS;

// [hauteur face, rayon, filet, chute, marge pointillé, icône] par taille de référence.
const SPEC = {
  96: [90, 18, 3.5, 9, 8, 38],
  76: [72, 15, 3, 7, 8, 30],
  48: [46, 12, 2.5, 5, 5, 22],
  44: [42, 11, 2.5, 5, 5, 20],
  38: [36, 10, 2, 4, 4, 20],
} as const;
const KEYS = [96, 76, 48, 44, 38] as const;
type Spec = readonly [number, number, number, number, number, number];
const scale = ([a, b, c, d, e, g]: Spec, k: number): Spec => [a * k, b * k, c * k, d * k, e * k, g * k];

export type TrackCubeProps = {
  track: Track;
  size?: number;
  rotate?: number;
};

export function TrackCube({ track, size = 76, rotate = 0 }: TrackCubeProps) {
  const [face, ink, edge, icon] = TRACKS[track];
  const key = KEYS.reduce<(typeof KEYS)[number]>(
    (b, k) => (Math.abs(k - size) < Math.abs(b - size) ? k : b),
    76,
  );
  // Valeurs de référence mises à l'échelle de la taille demandée.
  const [h, r, rim, drop, inset, isz] = scale(SPEC[key], size / key);

  const style = {
    width: size,
    height: h + drop,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
    "--face": face,
    "--edge": edge,
    "--h": `${h}px`,
    "--r": `${r}px`,
    "--rim": `${rim}px`,
    "--drop": `${drop}px`,
    "--dash-inset": `${inset - rim}px`,
    "--dash-r": `${r - inset / 2}px`,
  };

  return (
    <span className={s.cube} style={style}>
      <span className={s.edge} />
      <span className={s.face}>
        <span className={s.dash} />
        <Icon name={icon} size={Math.round(isz * 0.8)} color={ink} />
      </span>
    </span>
  );
}
