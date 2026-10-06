// Extraction unique des articles de l'ancien blog (back.ourson.app est hors ligne) :
// lit __NEXT_DATA__ des pages statiques encore servies par www.ourson.app et écrit
// un fichier .mdx par article dans src/content/blog.
// Usage : node scripts/extract-blog.ts
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://www.ourson.app";
const OUT_DIR = path.join(import.meta.dirname, "..", "src", "content", "blog");
const RUBRIQUES = new Set(["nutrition", "sommeil", "activites"]);

// Fenêtre de dates attribuée aux articles jusque-là non publiés.
const NEW_FROM = Date.parse("2026-09-15T08:00:00Z");
const NEW_TO = Date.parse("2026-10-06T08:00:00Z");

type LegacyArticle = {
  slug: string;
  tags: string[];
  status?: string;
  author?: string;
  createdDate?: string;
  imageURL?: string;
  content: {
    title: string;
    subtitle?: string;
    summary?: string;
    longSummary?: string;
    body?: { content: string }[];
  };
};

async function nextData(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const html = await res.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  if (!match?.[1]) throw new Error(`__NEXT_DATA__ introuvable : ${url}`);
  return JSON.parse(match[1]);
}

// Le contenu doit rester du Markdown valide pour MDX : on neutralise les caractères JSX.
function toMdx(markdown: string): string {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/^### /gm, "## ")
    .replace(/[{}]/g, (c) => `\\${c}`)
    .replace(/</g, "&lt;")
    .trim();
}

function yamlString(value: string): string {
  return JSON.stringify(value.replace(/\s+/g, " ").trim());
}

function randomDate(seed: string): string {
  // Pseudo-aléatoire déterministe par slug, pour que la ré-exécution donne les mêmes dates.
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const t = NEW_FROM + ((h >>> 0) / 0xffffffff) * (NEW_TO - NEW_FROM);
  return new Date(Math.round(t / 60000) * 60000).toISOString();
}

const list: LegacyArticle[] = (await nextData(`${ORIGIN}/blog/toutes-les-sections`)).props.pageProps.articles;
console.log(`${list.length} articles listés`);

await mkdir(OUT_DIR, { recursive: true });
const failures: string[] = [];

for (const item of list) {
  const rubrique = item.tags[0];
  if (!rubrique || !RUBRIQUES.has(rubrique)) {
    failures.push(`${item.slug} : rubrique inconnue ${rubrique}`);
    continue;
  }
  const page = await nextData(`${ORIGIN}/blog/${rubrique}/${item.slug}`);
  const article: LegacyArticle | null = page.props.pageProps.article;
  const body = article?.content.body?.map((b) => b.content).filter(Boolean) ?? [];
  if (!article || body.length === 0) {
    failures.push(`${item.slug} : corps vide`);
    continue;
  }

  const wasPublished = article.status === "published";
  const date = wasPublished && article.createdDate ? article.createdDate : randomDate(article.slug);
  const description = article.content.subtitle ?? article.content.summary ?? "";

  const frontmatter = [
    "---",
    `title: ${yamlString(article.content.title)}`,
    `description: ${yamlString(description)}`,
    `summary: ${yamlString(article.content.summary ?? description)}`,
    `rubrique: ${rubrique}`,
    `date: ${date}`,
    `image: ${article.imageURL ?? ""}`,
    `author: ${yamlString(article.author ?? "L'équipe Ourson")}`,
    "---",
  ].join("\n");

  const lede = article.content.longSummary ? `${toMdx(article.content.longSummary)}\n\n` : "";
  const mdx = `${frontmatter}\n\n${lede}${body.map(toMdx).join("\n\n")}\n`;
  await writeFile(path.join(OUT_DIR, `${article.slug}.mdx`), mdx);
  console.log(`✓ ${rubrique}/${article.slug}${wasPublished ? "" : ` (nouvelle date ${date.slice(0, 10)})`}`);
}

if (failures.length) {
  console.error(`\n${failures.length} échec(s) :\n${failures.join("\n")}`);
  process.exitCode = 1;
}
