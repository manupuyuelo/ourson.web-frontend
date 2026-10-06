// Planche de relecture : une page sur tous les formats de l'audit, côte à côte (même échelle).
// CAPTURES=1 yarn test:e2e ecrans   puis   node scripts/planche-ecrans.ts <page> [échelle] [formats…]
import { mkdirSync, readdirSync } from "node:fs";
import sharp from "sharp";

const [page, echelleArg = "0.3", ...filtre] = process.argv.slice(2);
if (!page) throw new Error("Usage : node scripts/planche-ecrans.ts <page> [échelle] [formats…]");
const echelle = Number(echelleArg);
const DIR = ".captures/ecrans";
const formats = readdirSync(DIR).filter((f) => filtre.length === 0 || filtre.includes(f));

const images = await Promise.all(
  formats.map(async (f) => {
    const src = sharp(`${DIR}/${f}/${page}.png`);
    const { width } = await src.metadata();
    const w = Math.round(width * echelle);
    const { data, info } = await src.resize(w).png().toBuffer({ resolveWithObject: true });
    const legende = Buffer.from(
      `<svg width="${w}" height="28"><text x="4" y="20" font-family="sans-serif" font-size="16">${f} (${width}px)</text></svg>`,
    );
    return { data, info, legende };
  }),
);
const ECART = 24;
const W = images.reduce((s, i) => s + i.info.width + ECART, 0);
const H = Math.max(...images.map((i) => i.info.height)) + 28;
let x = 0;
const calques = images.flatMap((i) => {
  const c = [
    { input: i.legende, left: x, top: 0 },
    { input: i.data, left: x, top: 28 },
  ];
  x += i.info.width + ECART;
  return c;
});
mkdirSync(".captures/planches", { recursive: true });
const sortie = `.captures/planches/${page}${filtre.length ? `-${filtre.join("+")}` : ""}.png`;
await sharp({ create: { width: W, height: H, channels: 3, background: "#999" } })
  .composite(calques)
  .png()
  .toFile(sortie);
console.log(sortie);
