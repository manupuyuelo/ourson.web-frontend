import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Le blog d'Ourson";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ titre: "Bienvenue sur le blog d'Ourson", surTitre: "Le blog" });
}
