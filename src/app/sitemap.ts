import type { MetadataRoute } from "next";
import { getArticles, RUBRIQUE_KEYS } from "@/lib/blog";
import { SITE } from "@/lib/site";

const url = (path: string) => `${SITE.url}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const dernier = articles[0]?.date;
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/nutrition"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/sommeil"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/eveil"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/blog"), lastModified: dernier, changeFrequency: "weekly", priority: 0.8 },
    ...RUBRIQUE_KEYS.map((r) => ({
      url: url(`/blog/${r}`),
      lastModified: articles.find((a) => a.rubrique === r)?.date,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: url(a.href),
      lastModified: a.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: url("/confidentialite"), changeFrequency: "yearly", priority: 0.3 },
    { url: url("/cgu"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
