import { expect, test } from "@playwright/test";

const PAGES = ["/", "/nutrition", "/sommeil", "/eveil", "/blog", "/blog/sommeil", "/confidentialite"];

for (const path of PAGES) {
  test(`${path} : rendu, un seul h1, pas d'erreur console`, async ({ page }) => {
    const erreurs: string[] = [];
    page.on("pageerror", (e) => erreurs.push(e.message));
    page.on("console", (m) => m.type() === "error" && erreurs.push(m.text()));
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    expect(erreurs).toEqual([]);
  });
}

test("aucune requête Google avant consentement, GTM après acceptation", async ({ page }) => {
  const google: string[] = [];
  page.on("request", (r) => /googletagmanager|google-analytics/.test(r.url()) && google.push(r.url()));
  await page.goto("/");
  // Laisse le temps à l'hydratation et aux scripts différés de partir s'ils devaient partir.
  await expect(page.getByRole("button", { name: "Accepter" })).toBeVisible();
  await page.waitForTimeout(1500);
  expect(google).toEqual([]);
  await page.getByRole("button", { name: "Accepter" }).click();
  await expect.poll(() => google.some((u) => u.includes("gtm.js"))).toBe(true);
});

test("refus : bandeau masqué et toujours aucune requête Google", async ({ page }) => {
  const google: string[] = [];
  page.on("request", (r) => /googletagmanager|google-analytics/.test(r.url()) && google.push(r.url()));
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser" }).click();
  await expect(page.getByRole("button", { name: "Accepter" })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("button", { name: "Accepter" })).toHaveCount(0);
  expect(google).toEqual([]);
});

test("/suppression-compte ouvre la feuille de suppression, Échap la ferme", async ({ page }) => {
  await page.goto("/suppression-compte");
  await expect(page).toHaveURL(/\/confidentialite#suppression$/);
  const feuille = page.locator("dialog[open]");
  await expect(feuille).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(feuille).toHaveCount(0);
  await expect(page).not.toHaveURL(/#suppression/);
});

test("redirections des anciennes URLs", async ({ request }) => {
  for (const [from, to] of [
    ["/demo", "/"],
    ["/blog/toutes-les-sections", "/blog"],
  ] as const) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers().location).toBe(to);
  }
  const article = await request.get("/blog/sommeil/importance-regularite-temps-endormissement-enfant");
  expect(article.status()).toBe(200);
});

test("le filtre du blog navigue vers la rubrique", async ({ page }) => {
  await page.goto("/blog");
  await page.getByRole("link", { name: "Sommeil", exact: true }).last().click();
  await expect(page).toHaveURL(/\/blog\/sommeil$/);
});
