import type { ImageLoaderProps } from "next/image";

/**
 * Laisse Cloudinary redimensionner, choisir le format (AVIF/WebP) et la qualité (q_auto),
 * sans passer par l’optimiseur Vercel. La qualité demandée par next/image est ignorée :
 * q_auto ajuste le poids image par image, mieux qu’un 75 fixe.
 */
export function cloudinaryLoader({ src, width }: ImageLoaderProps) {
  return src.replace(/\/image\/upload\/(?:q_auto\/)?/, `/image/upload/f_auto,q_auto,w_${width},c_limit/`);
}
