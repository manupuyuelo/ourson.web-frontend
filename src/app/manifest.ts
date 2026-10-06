import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ourson",
    short_name: "Ourson",
    description: SITE.description,
    lang: "fr",
    start_url: "/",
    display: "browser",
    background_color: "#FFF8F1",
    theme_color: "#FF5436",
    icons: [{ src: "/icon-512.png", sizes: "512x512", type: "image/png" }],
  };
}
