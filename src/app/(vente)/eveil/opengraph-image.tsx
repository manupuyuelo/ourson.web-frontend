import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "L'accompagner dans son éveil, jour après jour";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    titre: "L'accompagner dans son éveil, jour après jour",
    surTitre: "Éveil",
    fond: "#3E9A59",
    ours: "eveil",
  });
}
