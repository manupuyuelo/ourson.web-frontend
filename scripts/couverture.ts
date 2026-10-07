// Prépare la couverture d’un article pour next/image (qui servira ensuite AVIF/WebP à la bonne taille) :
// 1600 px de large au plus (couverture affichée sur 1028 px en desktop), JPEG léger, sans métadonnées.
// Usage : yarn couverture <image> <slug de l’article>   →   src/assets/blog/<slug>.jpg
// Puis `yarn og` pour l’image de partage de l’article.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [source, slug] = process.argv.slice(2);
if (!source || !slug) {
  console.error("Usage : yarn couverture <image> <slug de l’article>");
  process.exit(1);
}

const dest = path.join(import.meta.dirname, "..", "src", "assets", "blog", `${slug}.jpg`);
await mkdir(path.dirname(dest), { recursive: true });
const info = await sharp(source)
  .rotate() // applique l’orientation EXIF avant de retirer les métadonnées
  .resize({ width: 1600, withoutEnlargement: true })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(dest);
console.log(
  `src/assets/blog/${slug}.jpg  ${info.width} × ${info.height}  ${Math.round(info.size / 1024)} Ko`,
);
