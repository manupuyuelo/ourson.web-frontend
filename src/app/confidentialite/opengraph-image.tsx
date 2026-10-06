import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Règles de confidentialité d'Ourson";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ titre: "Règles de confidentialité", surTitre: "Confidentialité" });
}
