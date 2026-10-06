// Assemble les captures handoff / v2 côte à côte, en tranches : node scripts/compare-captures.ts <mobile|desktop> <page> <échelle> <hauteur>
import sharp from "sharp";
import { mkdirSync } from "node:fs";
const [proj, nom, scaleArg, chunkArg] = process.argv.slice(2) as [string, string, string, string];
const scale = Number(scaleArg);
const chunk = Number(chunkArg);
const dir = `.captures/${proj}`;
const out = `.captures/cmp/${proj}`;
mkdirSync(out, { recursive: true });
const load = async (f: string) => {
  const m = await sharp(f).metadata();
  const w = Math.round(m.width * scale);
  return sharp(f).resize(w).png().toBuffer({ resolveWithObject: true });
};
const a = await load(`${dir}/${nom}-handoff.png`);
const b = await load(`${dir}/${nom}-v2.png`);
const H = Math.max(a.info.height, b.info.height);
const W = a.info.width + b.info.width + 20;
const full = await sharp({ create: { width: W, height: H, channels: 3, background: "#888" } })
  .composite([
    { input: a.data, left: 0, top: 0 },
    { input: b.data, left: a.info.width + 20, top: 0 },
  ])
  .png()
  .toBuffer();
let i = 0;
for (let top = 0; top < H; top += chunk) {
  const h = Math.min(chunk, H - top);
  await sharp(full).extract({ left: 0, top, width: W, height: h }).toFile(`${out}/${nom}-${i++}.png`);
}
console.log(nom, H, i);
