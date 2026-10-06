import type { NextRequest } from "next/server";
import { destinationStore } from "@/lib/store";

// Un seul QR pour tous : la route lit le user-agent du téléphone qui l’a scanné.
export function GET(request: NextRequest) {
  const cible = new URL(destinationStore(request.headers.get("user-agent") ?? ""), request.url);
  return new Response(null, {
    status: 307,
    headers: { Location: cible.toString(), "X-Robots-Tag": "noindex", "Cache-Control": "no-store" },
  });
}
