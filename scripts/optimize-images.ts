// Prépare les images sources du handoff pour next/image (qui servira ensuite AVIF/WebP).
// On réduit seulement les sources à 2× leur taille d'affichage max pour alléger le repo et le build.
// Usage : yarn images [dossier du handoff]
import { mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const HANDOFF = process.argv[2] ?? path.join(process.env.HOME ?? "", "Downloads/design_handoff_site_ourson");
const ASSETS = path.join(import.meta.dirname, "..", "src", "assets");

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function resize(src: string, dest: string, width: number) {
  await mkdir(path.dirname(dest), { recursive: true });
  const img = sharp(src).resize({ width, withoutEnlargement: true });
  const out = dest.endsWith(".png")
    ? img.png({ compressionLevel: 9, palette: true, quality: 90 })
    : img.jpeg({ quality: 82, mozjpeg: true });
  const info = await out.toFile(dest);
  console.log(`${path.relative(ASSETS, dest)}  ${Math.round(info.size / 1024)} Ko`);
}

// Oursons : affichés jusqu'à 400 px de large (hero desktop).
for (const name of ["ourson-accueil", "ourson-repas", "ourson-sommeil", "ourson-eveil"]) {
  await resize(
    path.join(HANDOFF, "site/assets", `${name}.png`),
    path.join(ASSETS, "ours", `${name}.png`),
    800,
  );
}
// Icône de l'app : 44 px au centre du QR, 40 px dans les notifications.
await resize(path.join(HANDOFF, "site/assets/icon.png"), path.join(ASSETS, "icon.png"), 176);

// Photos et illustrations de l'app : cartes de 250 à 560 px de large.
// Seules les images importées dans src/ sont copiées (le handoff en contient une centaine).
const ECH = path.join(HANDOFF, "site/assets/echantillons");
const SRC = path.join(import.meta.dirname, "..", "src");
const utilisees = new Set<string>();
for await (const file of walk(SRC)) {
  if (!/\.(tsx?|mdx?)$/.test(file)) continue;
  for (const m of (await readFile(file, "utf8")).matchAll(/@\/assets\/echantillons\/([^"']+\.jpg)/g)) {
    if (m[1]) utilisees.add(m[1]);
  }
}
for (const rel of [...utilisees].toSorted()) {
  await resize(path.join(ECH, rel), path.join(ASSETS, "echantillons", rel), 1000);
}
