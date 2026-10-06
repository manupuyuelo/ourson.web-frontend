import QRCode from "qrcode";
import { SITE } from "@/lib/site";

// QR du bloc de téléchargement desktop, généré une fois au build (correction H : l'icône recouvre le centre).
export const dynamic = "force-static";

export async function GET() {
  const svg = await QRCode.toString(SITE.url, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 0,
    color: { dark: "#000000", light: "#ffffff" },
  });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
