import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Ourson, l'app qui vous donne un coup de patte";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ titre: "Il mange quoi ? Il dort quand ? On joue à quoi ?" });
}
