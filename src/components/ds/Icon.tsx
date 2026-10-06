import type { CSSProperties, SVGAttributes } from "react";

// Glyphes « Doudou » du design system (repris de _ds_bundle.js), limités à ceux du site.
// Parties : ["c",cx,cy,r] · ["r",x,y,w,h,rx] · ["e",cx,cy,rx,ry] · ["p",d]. Mode (dernier élément) :
// "F" = toujours plein · "S" / "S<n>" = toujours trait (épaisseur n) · rien = suit `filled`.
type Mode = "F" | "S" | `S${number}` | undefined;
type Part =
  | readonly ["c", number, number, number, Mode?]
  | readonly ["r", number, number, number, number, number, Mode?]
  | readonly ["e", number, number, number, number, Mode?]
  | readonly ["p", string, Mode?];

const G = {
  check: [["p", "m5 12.5 4.2 4.5L19 7"]],
  plus: [["p", "M12 5.5v13M5.5 12h13"]],
  chevronLeft: [["p", "M14.5 5.5 8 12l6.5 6.5"]],
  chevronRight: [["p", "M9.5 5.5 16 12l-6.5 6.5"]],
  heart: [["p", "M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7-2.5C19 11.5 12 20 12 20Z"]],
  leaf: [
    ["p", "M5 19c0-8 6-13 14-13 0 8-6 13-14 13Z"],
    ["p", "M5 19c3-5 7-7 11-8", "S"],
  ],
  flame: [["p", "M12 3c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1.5 1.5 2 2 2 0-3-1-4 1-7Z"]],
  sleepMoon: [["p", "M20 15.4A7.5 7.5 0 1 1 11 6.2a6 6 0 0 0 9 9.2Z"]],
  sun: [
    ["c", 12, 12, 4.2],
    ["p", "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4", "S"],
  ],
  stethoscope: [
    ["p", "M6 4v5a4 4 0 0 0 8 0V4"],
    ["p", "M10 13v2a4 4 0 0 0 8 0v-1"],
    ["c", 18, 11, 2],
  ],
  hand: [
    [
      "p",
      "M8 12V6.5a1.5 1.5 0 0 1 3 0V11M11 10.5V5a1.5 1.5 0 0 1 3 0v6M14 10.5V6.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.9-2.6L4 14.4a1.5 1.5 0 0 1 2.4-1.8L8 14",
    ],
  ],
  run: [
    ["c", 14, 4.5, 1.8],
    ["p", "M9 21l2.5-5.5L14 17v4M6.5 12l3-3.5 4 .5 2.5 3 2.5.5M11.5 15.5l1.5-6"],
  ],
  bubble: [
    [
      "p",
      "M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V16h0A2.5 2.5 0 0 1 5 13.5z",
    ],
  ],
  usersPair: [
    ["c", 9, 8.5, 3],
    ["p", "M3.5 20a5.5 5.5 0 0 1 11 0"],
    ["p", "M16 6.2a3 3 0 0 1 0 5.6"],
    ["p", "M17.5 20a5.6 5.6 0 0 0-1.6-3.9"],
  ],
  spoon: [
    ["e", 12, 7, 3.2, 4],
    ["p", "M12 11v9.5", "S"],
  ],
  cubes: [
    ["r", 4, 12, 7, 7, 1.5],
    ["r", 13, 12, 7, 7, 1.5],
    ["r", 8.5, 4, 7, 7, 1.5],
  ],
  camera: [
    [
      "p",
      "M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.5-2h5.4l1.5 2h2.3A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z",
    ],
    ["c", 12, 13, 3.4, "S"],
  ],
  bag: [
    ["p", "M5.5 8h13l-1 12h-11z"],
    ["p", "M9 8a3 3 0 0 1 6 0", "S"],
  ],
} as const satisfies Record<string, readonly Part[]>;

export type IconName = keyof typeof G;

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
  style?: CSSProperties;
};

export function Icon({
  name,
  size = 22,
  color = "currentColor",
  strokeWidth = 2.1,
  filled = false,
  style,
}: IconProps) {
  const attrs = (mode: string | undefined): SVGAttributes<SVGElement> => {
    const round = { strokeLinecap: "round", strokeLinejoin: "round" } as const;
    if (mode && mode.startsWith("S") && mode.length > 1) {
      return { fill: "none", stroke: color, strokeWidth: Number(mode.slice(1)), ...round };
    }
    const fill = mode === "F" || (mode !== "S" && filled);
    const stroke = mode !== "F" && !(fill && mode !== "S");
    return { fill: fill ? color : "none", stroke: stroke ? color : "none", strokeWidth, ...round };
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ flex: "none", display: "block", ...style }}
      aria-hidden="true"
    >
      {(G[name] as readonly Part[]).map((p) => {
        switch (p[0]) {
          case "c":
            return <circle key={p.join()} cx={p[1]} cy={p[2]} r={p[3]} {...attrs(p[4])} />;
          case "r":
            return (
              <rect key={p.join()} x={p[1]} y={p[2]} width={p[3]} height={p[4]} rx={p[5]} {...attrs(p[6])} />
            );
          case "e":
            return <ellipse key={p.join()} cx={p[1]} cy={p[2]} rx={p[3]} ry={p[4]} {...attrs(p[5])} />;
          default:
            return <path key={p.join()} d={p[1]} {...attrs(p[2])} />;
        }
      })}
    </svg>
  );
}
