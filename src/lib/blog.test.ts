import { existsSync } from "node:fs";
import { compile } from "@mdx-js/mdx";
import { readFile } from "node:fs/promises";
import path from "node:path";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { describe, expect, it } from "vitest";
import { getArticles, RUBRIQUE_KEYS } from "./blog";

// Garde-fou du contenu : un article ajouté ou modifié qui casserait le build échoue ici d'abord.
const articles = await getArticles();

describe("contenu du blog", () => {
  it("contient les articles, avec des slugs uniques", () => {
    expect(articles.length).toBeGreaterThanOrEqual(59);
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
  });

  it("couvre les trois rubriques", () => {
    expect(new Set(articles.map((a) => a.rubrique))).toEqual(new Set(RUBRIQUE_KEYS));
  });

  it("est trié du plus récent au plus ancien", () => {
    const dates = articles.map((a) => a.date.getTime());
    expect(dates).toEqual(dates.toSorted((a, b) => b - a));
  });

  it.each(articles.map((a) => [a.slug, a] as const))("%s : slug, couverture et date valides", (slug, a) => {
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/); // ASCII : Next ne sert pas un paramètre statique accentué
    // Couverture préparée par `yarn couverture <image> <slug>`.
    expect(existsSync(path.join(process.cwd(), "src/assets/blog", `${slug}.jpg`))).toBe(true);
    expect(a.date.getTime()).toBeLessThanOrEqual(Date.now() + 86_400_000);
    expect(a.href).toBe(`/blog/${a.rubrique}/${slug}`);
  });

  it.each(articles.map((a) => a.slug))("%s : le MDX compile et contient des intertitres", async (slug) => {
    const source = await readFile(path.join(process.cwd(), "src/content/blog", `${slug}.mdx`), "utf8");
    await expect(compile(source, { remarkPlugins: [remarkFrontmatter, remarkGfm] })).resolves.toBeDefined();
    expect(source).toMatch(/^## /m);
  });
});
