// Prépare les images sources du handoff pour next/image (qui servira ensuite AVIF/WebP).
// On réduit seulement les sources à 2× leur taille d'affichage max pour alléger le repo et le build.
// Usage : yarn images [dossier du handoff]
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const HANDOFF = process.argv[2] ?? path.join(process.env.HOME ?? "", "Downloads/design_handoff_site_vitrine");
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
const ECH = path.join(HANDOFF, "uploads/ourson-site-brief/echantillons");
for await (const file of walk(ECH)) {
  if (!file.endsWith(".jpg")) continue;
  await resize(file, path.join(ASSETS, "echantillons", path.relative(ECH, file)), 1000);
}
