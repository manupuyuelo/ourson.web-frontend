// Images de partage (Open Graph) : une vraie image par page, 1200 × 630, sans gabarit composé.
// Paysage pour l'aperçu grand format (WhatsApp, iMessage, réseaux), JPEG léger (< 300 Ko).
// Usage : yarn og [dossier du handoff]
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp, { type Sharp } from "sharp";

const HANDOFF = process.argv[2] ?? path.join(process.env.HOME ?? "", "Downloads/design_handoff_site_ourson");
const ASSETS = path.join(HANDOFF, "site/assets");
const OUT = path.join(import.meta.dirname, "..", "public", "og");
const W = 1200;
const H = 630;
const FOND = "#FFF8F1"; // --bg

await mkdir(OUT, { recursive: true });

async function ecrire(nom: string, img: Sharp) {
  const dest = path.join(OUT, `${nom}.jpg`);
  await img.jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
  console.log(`public/og/${nom}.jpg  ${Math.round((await stat(dest)).size / 1024)} Ko`);
}

// Photos de l'app recadrées (le sujet est au centre des illustrations).
const PHOTOS = {
  nutrition: "echantillons/repas/un-plat-toute-la-tablee/beetroot_chicken_cumin_pan__0_famille.jpg",
  sommeil: "echantillons/sommeil/histoires-du-soir/bonne_nuit_la_lune.jpg",
  eveil: "echantillons/eveil/jeux/deux_paniers.jpg",
};
for (const [nom, rel] of Object.entries(PHOTOS)) {
  await ecrire(nom, sharp(path.join(ASSETS, rel)).resize(W, H, { fit: "cover", position: "attention" }));
}

// Accueil, blog, confidentialité : l'ourson de l'accueil, seul, sur le fond du site.
const ours = await sharp(path.join(ASSETS, "ourson-accueil.png"))
  .resize({ height: 560, withoutEnlargement: true })
  .toBuffer();
await ecrire(
  "ourson",
  sharp({ create: { width: W, height: H, channels: 3, background: FOND } }).composite([
    { input: ours, gravity: "south" },
  ]),
);
