import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Ourson Nutrition : un seul plat pour toute la famille";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    titre: "Un seul plat pour toute la famille",
    surTitre: "Nutrition",
    fond: "#9E6512",
    ours: "repas",
  });
}
