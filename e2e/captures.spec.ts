import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";

// Captures pleine page pour la comparaison visuelle avec le handoff (non bloquant).
// HANDOFF_URL=http://localhost:3200 yarn test:e2e captures  (handoff servi par `npx serve` dans son dossier)
const PAGES = [
  ["accueil", "/", "Ourson Accueil.dc.html"],
  ["nutrition", "/nutrition", "Ourson Nutrition.dc.html"],
  ["sommeil", "/sommeil", "Ourson Sommeil.dc.html"],
  ["eveil", "/eveil", "Ourson Eveil.dc.html"],
  ["blog", "/blog", "Ourson Blog.dc.html"],
  ["article", "/blog/sommeil/importance-regularite-temps-endormissement-enfant", "Ourson Article.dc.html"],
  ["confidentialite", "/confidentialite", "Ourson Confidentialite.dc.html"],
] as const;

test.describe.configure({ mode: "parallel" });

for (const [nom, path, handoff] of PAGES) {
  test(`capture ${nom}`, async ({ page }, info) => {
    test.skip(!process.env.CAPTURES, "lancé seulement avec CAPTURES=1");
    const dir = `.captures/${info.project.name}`;
    mkdirSync(dir, { recursive: true });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.evaluate(() =>
      localStorage.setItem(
        "ourson-cookies",
        JSON.stringify({ audience: false, pub: false, date: new Date().toISOString(), version: 1 }),
      ),
    );
    await page.reload();
    // Fait défiler toute la page pour charger les images différées (loading="lazy"), puis remonte.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    // Images masquées (display: none) ou hors champ d'un carrousel : jamais chargées, on n'attend que 5 s.
    await page
      .waitForFunction(() => [...document.images].every((i) => i.complete || !i.checkVisibility()), null, {
        timeout: 5000,
      })
      .catch(() => {});
    await page.screenshot({ path: `${dir}/${nom}-v2.png`, fullPage: true });
    if (process.env.HANDOFF_URL) {
      await page.goto(`${process.env.HANDOFF_URL}/${encodeURIComponent(handoff)}`);
      await page.waitForTimeout(2500);
      await page.screenshot({ path: `${dir}/${nom}-handoff.png`, fullPage: true });
    }
  });
}
