import "server-only";
import type { StaticImageData } from "next/image";

/**
 * Couverture d’un article : `src/assets/blog/<slug>.jpg` (préparée par `yarn couverture`),
 * importée au build : dimensions, aperçu flou et AVIF/WebP par next/image. Une couverture
 * manquante fait échouer le build.
 */
export async function couverture(slug: string): Promise<StaticImageData> {
  const image: { default: StaticImageData } = await import(`@/assets/blog/${slug}.jpg`);
  return image.default;
}
