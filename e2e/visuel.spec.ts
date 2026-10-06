import { devices, expect, test, type Browser, type BrowserContextOptions } from "@playwright/test";

// Non-régression visuelle des formats de référence du handoff (téléphone et desktop).
// Références locales, hors Git (le rendu dépend de l'OS et des polices) :
//   VISUEL=1 yarn test:e2e visuel --update-snapshots   (sur le commit de référence)
//   VISUEL=1 yarn test:e2e visuel                       (après une modification : aucun écart attendu)
const PAGES = [
  ["accueil", "/"],
  ["nutrition", "/nutrition"],
  ["sommeil", "/sommeil"],
  ["eveil", "/eveil"],
  ["blog", "/blog"],
  ["article", "/blog/sommeil/importance-regularite-temps-endormissement-enfant"],
  ["confidentialite", "/confidentialite"],
] as const;

const FORMATS = [
  ["iphone-15", devices["iPhone 15"]],
  ["iphone-16-pro-max", devices["iPhone 16 Pro Max"]],
  ["desktop-1280", { viewport: { width: 1280, height: 800 } }],
  ["desktop-1440", { viewport: { width: 1440, height: 900 } }],
] as const;

const CONSENTEMENT = JSON.stringify({
  audience: false,
  pub: false,
  date: new Date().toISOString(),
  version: 1,
});

async function capturer(browser: Browser, options: BrowserContextOptions, path: string) {
  const ctx = await browser.newContext({ ...options, reducedMotion: "reduce" });
  await ctx.addInitScript((c) => localStorage.setItem("ourson-cookies", c), CONSENTEMENT);
  await ctx.route(/googletagmanager\.com/, (r) => r.fulfill({ body: "", contentType: "text/javascript" }));
  const page = await ctx.newPage();
  await page.goto(path);
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await page
    .waitForFunction(() => [...document.images].every((i) => i.complete || !i.checkVisibility()), null, {
      timeout: 5000,
    })
    .catch(() => {});
  await page.waitForTimeout(500);
  return { ctx, page };
}

test.describe("non-régression visuelle", () => {
  test.skip(!process.env.VISUEL, "lancé seulement avec VISUEL=1");
  test.describe.configure({ mode: "parallel" });

  for (const [format, options] of FORMATS) {
    for (const [nom, path] of PAGES) {
      test(`${format} · ${nom}`, async ({ browser }, info) => {
        test.skip(info.project.name !== "desktop", "formats fixés par le test : un seul projet suffit");
        test.setTimeout(60_000);
        const { ctx, page } = await capturer(browser, options, path);
        await expect(page).toHaveScreenshot(`${format}-${nom}.png`, {
          fullPage: true,
          animations: "disabled",
        });
        await ctx.close();
      });
    }
  }
});
