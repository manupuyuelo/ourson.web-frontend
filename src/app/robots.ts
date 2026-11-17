import type { MetadataRoute } from "next";
import { PAGES_RELAIS, SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/app", ...PAGES_RELAIS] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
