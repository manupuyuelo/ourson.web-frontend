import { expect, test } from "@playwright/test";
import { pageHydratee } from "./outils";

// GTM est chargé dès l'arrivée (Consent Mode avancé) : on le remplace par un script vide, hors réseau.
test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager\.com/, (r) => r.fulfill({ body: "", contentType: "text/javascript" }));
});

const PAGES = [
  "/",
  "/nutrition",
  "/sommeil",
  "/eveil",
  "/blog",
  "/blog/sommeil",
  "/confidentialite",
  "/cgu",
  "/sources",
];

for (const path of PAGES) {
  test(`${path} : rendu, un seul h1, pas d'erreur console`, async ({ page }) => {
    const erreurs: string[] = [];
    page.on("pageerror", (e) => erreurs.push(e.message));
    page.on("console", (m) => m.type() === "error" && erreurs.push(m.text()));
    const res = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    expect(erreurs).toEqual([]);
  });
}

test("Consent Mode avancé : refus par défaut avant GTM, puis le choix", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const accepter = page.getByRole("button", { name: "Miam, j’accepte" });
  await expect(accepter).toBeVisible();
  // GTM se charge à la première interaction ou après 3 s : on attend son événement avant de lire l'ordre.
  await expect
    .poll(() => page.evaluate(() => (window.dataLayer ?? []).some((d) => Object(d).event === "gtm.js")), {
      timeout: 10_000,
    })
    .toBe(true);
  // Ordre du dataLayer : consent default (script du <head>) avant l'événement gtm.js.
  const ordre = await page.evaluate(() =>
    (window.dataLayer ?? []).map((d) => {
      const v = Object.values(Object(d));
      return v[0] === "consent" ? `consent:${String(v[1])}` : String(Object(d).event);
    }),
  );
  expect(ordre.indexOf("consent:default")).toBeGreaterThanOrEqual(0);
  expect(ordre.indexOf("consent:default")).toBeLessThan(ordre.indexOf("gtm.js"));

  await pageHydratee(page);
  await accepter.click();
  await expect(accepter).toHaveCount(0);
  const evenement = await page.evaluate(() =>
    (window.dataLayer ?? []).find((d) => Object(d).event === "ourson_consent"),
  );
  expect(evenement).toMatchObject({ audience: true, pub: true });

  await page.reload();
  await expect(page.getByRole("button", { name: "Miam, j’accepte" })).toHaveCount(0);
});

test("refus : « Non merci » masque le bandeau, aussi après rechargement", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await pageHydratee(page);
  await page.getByRole("button", { name: "Non merci" }).click();
  await expect(page.getByRole("button", { name: "Miam, j’accepte" })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("button", { name: "Non merci" })).toHaveCount(0);
  const stocke = await page.evaluate(() => JSON.parse(localStorage.getItem("ourson-cookies") ?? "{}"));
  expect(stocke).toMatchObject({ audience: false, pub: false });
});

test("le lien « Cookies » rouvre le détail avec le choix en cours", async ({ page, isMobile }) => {
  await page.goto("/blog", { waitUntil: "domcontentloaded" });
  await pageHydratee(page);
  await page.getByRole("button", { name: "Miam, j’accepte" }).click();
  // Pied de page en desktop ; sur téléphone, le même lien est dans le menu.
  if (isMobile) {
    await page.getByRole("button", { name: "Menu" }).click();
    await page.locator("dialog#menu-mobile").getByRole("link", { name: "Cookies" }).click();
  } else {
    await page.getByRole("contentinfo").getByRole("link", { name: "Cookies" }).click();
  }
  await expect(page.getByRole("button", { name: "Valider mes choix" })).toBeVisible();
  await expect(page.getByRole("switch", { name: "Mesure d’audience" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await page.getByRole("switch", { name: "Publicité" }).click();
  await page.getByRole("button", { name: "Valider mes choix" }).click();
  await expect(page.getByRole("button", { name: "Valider mes choix" })).toHaveCount(0);
  const stocke = await page.evaluate(() => JSON.parse(localStorage.getItem("ourson-cookies") ?? "{}"));
  expect(stocke).toMatchObject({ audience: true, pub: false });
});

test("/app renvoie vers l'accueil tant que les stores ne sont pas publics", async ({ request }) => {
  const res = await request.get("/app", { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  expect(new URL(res.headers().location ?? "").pathname).toBe("/");
});

test("/suppression-compte ouvre la feuille de suppression, Échap la ferme", async ({ page }) => {
  await page.goto("/suppression-compte", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/confidentialite#suppression$/);
  const feuille = page.getByRole("dialog", { name: "Suppression de compte" });
  await expect(feuille).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(feuille).toHaveCount(0);
  await expect(page).not.toHaveURL(/#suppression/);
});

test("redirections des anciennes URLs", async ({ request }) => {
  for (const [from, to] of [
    ["/demo", "/"],
    ["/blog/toutes-les-sections", "/blog"],
    [
      "/blog/sommeil/strategies-gerer-troubles-sommeil-pouss%C3%A9es-dentaires",
      "/blog/sommeil/strategies-gerer-troubles-sommeil-poussees-dentaires",
    ],
  ] as const) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers().location).toBe(to);
  }
  const article = await request.get("/blog/sommeil/importance-regularite-temps-endormissement-enfant");
  expect(article.status()).toBe(200);
});

test("le filtre du blog navigue vers la rubrique", async ({ page }) => {
  await page.goto("/blog", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "Sommeil", exact: true }).last().click();
  await expect(page).toHaveURL(/\/blog\/sommeil$/);
});
