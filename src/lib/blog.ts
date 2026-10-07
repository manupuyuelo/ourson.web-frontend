import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import { z } from "zod";

const DIR = path.join(process.cwd(), "src", "content", "blog");

export const RUBRIQUES = {
  nutrition: { label: "Nutrition", pilier: "repas", href: "/nutrition" },
  sommeil: { label: "Sommeil", pilier: "sommeil", href: "/sommeil" },
  activites: { label: "Éveil", pilier: "eveil", href: "/eveil" },
} as const;

export const RUBRIQUE_KEYS = [
  "nutrition",
  "sommeil",
  "activites",
] as const satisfies (keyof typeof RUBRIQUES)[];
export type Rubrique = (typeof RUBRIQUE_KEYS)[number];

export const isRubrique = (v: string): v is Rubrique => v in RUBRIQUES;

const Frontmatter = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  summary: z.string().min(1),
  rubrique: z.enum(RUBRIQUE_KEYS),
  date: z.coerce.date(),
  author: z.string().min(1),
});

export type Article = z.infer<typeof Frontmatter> & { slug: string; href: `/blog/${Rubrique}/${string}` };

/** Index des articles (frontmatter seul, sans compiler le MDX), du plus récent au plus ancien. */
export const getArticles = cache(async (): Promise<Article[]> => {
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".mdx"));
  const articles = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await readFile(path.join(DIR, file), "utf8");
      const yaml = raw.match(/^---\n([\s\S]*?)\n---/)?.[1];
      if (!yaml) throw new Error(`Frontmatter manquant : ${file}`);
      const fm = Frontmatter.parse(parse(yaml));
      return { ...fm, slug, href: `/blog/${fm.rubrique}/${slug}` as const };
    }),
  );
  return articles.toSorted((a, b) => b.date.getTime() - a.date.getTime());
});

export async function getArticle(rubrique: string, slug: string) {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug && a.rubrique === rubrique);
}

const DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});
export const formatDate = (d: Date) => DATE.format(d);
