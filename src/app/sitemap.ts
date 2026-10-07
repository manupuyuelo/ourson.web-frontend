import type { MetadataRoute } from "next";
import { getArticles, RUBRIQUE_KEYS } from "@/lib/blog";
import { SITE } from "@/lib/site";

const url = (path: string) => `${SITE.url}${path}`;

// Dates seulement quand elles sont exactes (le blog) ; changeFrequency et priority sont ignorés par Google.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const dernier = articles[0]?.date;
  return [
    { url: url("/") },
    { url: url("/nutrition") },
    { url: url("/sommeil") },
    { url: url("/eveil") },
    { url: url("/blog"), lastModified: dernier },
    ...RUBRIQUE_KEYS.map((r) => ({
      url: url(`/blog/${r}`),
      lastModified: articles.find((a) => a.rubrique === r)?.date,
    })),
    ...articles.map((a) => ({
      url: url(a.href),
      lastModified: a.date,
    })),
    { url: url("/confidentialite") },
    { url: url("/sources") },
    { url: url("/cgu") },
  ];
}
