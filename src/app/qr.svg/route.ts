import QRCode from "qrcode";
import { SITE } from "@/lib/site";

// QR des blocs de téléchargement desktop, généré une fois au build (correction H : l’icône recouvre le centre).
// Il pointe vers /app, qui renvoie vers le bon store selon le téléphone.
export const dynamic = "force-static";

export async function GET() {
  const svg = await QRCode.toString(`${SITE.url}/app`, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 0,
    color: { dark: "#000000", light: "#ffffff" },
  });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
