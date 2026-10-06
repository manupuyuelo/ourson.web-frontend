import type { ImageLoaderProps } from "next/image";

/** Laisse Cloudinary redimensionner et choisir le format (AVIF/WebP), sans passer par l'optimiseur Vercel. */
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  const params = ["f_auto", quality ? `q_${quality}` : "q_auto", `w_${width}`, "c_limit"].join(",");
  return src.replace(/\/image\/upload\/(q_auto\/)?/, `/image/upload/${params}/`);
}
