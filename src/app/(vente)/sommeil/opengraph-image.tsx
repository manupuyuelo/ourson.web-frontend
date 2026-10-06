import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Comprenez enfin ses nuits · Ourson";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    titre: "Comprenez enfin ses nuits",
    surTitre: "Sommeil",
    fond: "#5868D6",
    ours: "sommeil",
  });
}
