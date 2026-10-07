import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import images from "./partage.json";

// Images de partage (`yarn og`) : une par article, toutes présentes et assez légères pour WhatsApp.
const RACINE = path.join(import.meta.dirname, "..", "..");
const ARTICLES = readdirSync(path.join(RACINE, "src", "content", "blog"))
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => f.replace(/\.mdx$/, ""));

// Pages de l’app : chaque page.tsx déclare son image de partage, et chaque page fixe est au sitemap
// (le test e2e `partage` vérifie ensuite le HTML de toutes les URLs du sitemap).
const APP = path.join(RACINE, "src", "app");
const PAGES = readdirSync(APP, { recursive: true, encoding: "utf8" })
  .filter((f) => path.basename(f) === "page.tsx")
  .map((f) => ({
    fichier: f,
    route: `/${path.dirname(f)}`.replace(/\/\([^)]+\)/g, "").replace(/^\/\.?$/, "/") || "/",
  }));
const SITEMAP = readFileSync(path.join(APP, "sitemap.ts"), "utf8");

describe("pages", () => {
  it.each(PAGES)("$fichier déclare son image de partage", ({ fichier }) => {
    expect(readFileSync(path.join(APP, fichier), "utf8")).toMatch(/\bpartage(?:Article)?\(/);
  });

  it.each(PAGES.filter((p) => !p.route.includes("[")))("$route est au sitemap", ({ route }) => {
    expect(SITEMAP).toContain(`url("${route}")`);
  });
});

describe("images de partage", () => {
  it.each(ARTICLES)("l’article %s a la sienne (sinon : yarn og)", (slug) => {
    expect(Object.keys(images)).toContain(`blog/${slug}`);
  });

  it.each(Object.keys(images))("%s existe, est un JPEG de moins de 300 Ko", (nom) => {
    const fichier = path.join(RACINE, "public", "og", `${nom}.jpg`);
    expect(statSync(fichier).size).toBeLessThan(300 * 1024);
    expect(readFileSync(fichier).subarray(0, 2)).toEqual(Buffer.from([0xff, 0xd8]));
  });
});
