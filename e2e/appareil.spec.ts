import { expect, test } from "@playwright/test";
import { SITE, storePublie } from "../src/lib/site";
import { pageHydratee } from "./outils";

const UA = {
  ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1",
  android:
    "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36",
};

test.describe("bloc de téléchargement selon l'appareil", () => {
  test.skip(({ isMobile }) => !isMobile, "vérifié en viewport mobile");

  test("iPhone : badge App Store", async ({ browser }) => {
    const ctx = await browser.newContext({ userAgent: UA.ios, viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#telecharger").getByAltText("Télécharger dans l’App Store")).toBeVisible();
    await ctx.close();
  });

  test("Android : badge Google Play", async ({ browser }) => {
    const ctx = await browser.newContext({ userAgent: UA.android, viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#telecharger").getByAltText("Disponible sur Google Play")).toBeVisible();
    await ctx.close();
  });
});

test("ordinateur : bloc QR", async ({ page, isMobile }) => {
  test.skip(isMobile, "vérifié en desktop");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#telecharger").getByText("Téléchargez l’app")).toBeVisible();
});

test("cartel mobile : masqué sur le hero et en fin de page, visible entre les deux", async ({
  browser,
  isMobile,
}) => {
  test.skip(!isMobile, "vérifié en viewport mobile");
  const ctx = await browser.newContext({ userAgent: UA.ios, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const cartel = page.locator('[data-cartel="ios"]');
  await expect(cartel).toHaveAttribute("aria-hidden", "true");
  await page.locator("#repas").scrollIntoViewIfNeeded();
  await expect(cartel).not.toHaveAttribute("aria-hidden", "true");
  await expect(cartel.getByAltText("Télécharger dans l’App Store")).toBeVisible();
  await page.locator("#telecharger").scrollIntoViewIfNeeded();
  await expect(cartel).toHaveAttribute("aria-hidden", "true");
  await ctx.close();
});

// Bandeau cookies déjà réglé : il ne doit pas intercepter les clics de navigation.
const CONSENTEMENT = JSON.stringify({
  audience: false,
  pub: false,
  date: new Date().toISOString(),
  version: 1,
});

test("cartel mobile : se masque encore après une navigation (le layout persiste)", async ({
  browser,
  isMobile,
}) => {
  test.skip(!isMobile, "vérifié en viewport mobile");
  const ctx = await browser.newContext({ userAgent: UA.ios, viewport: { width: 390, height: 844 } });
  await ctx.addInitScript((c) => localStorage.setItem("ourson-cookies", c), CONSENTEMENT);
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await pageHydratee(page);
  const cartel = page.locator('[data-cartel="ios"]');
  await page.locator("#telecharger").scrollIntoViewIfNeeded();
  await expect(cartel).toHaveAttribute("aria-hidden", "true");

  await page.locator('#telecharger ~ div a[href="/eveil"]').click();
  await page.waitForURL("**/eveil");
  await page.locator("#telecharger").scrollIntoViewIfNeeded();
  await expect(cartel).toHaveAttribute("aria-hidden", "true");

  await page.getByRole("link", { name: "Ourson, accueil" }).first().click();
  await page.waitForURL((url) => url.pathname === "/");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(cartel).toHaveAttribute("aria-hidden", "true");
  await page.locator("#repas").scrollIntoViewIfNeeded();
  await expect(cartel).not.toHaveAttribute("aria-hidden", "true");
  await page.locator("#telecharger").scrollIntoViewIfNeeded();
  await expect(cartel).toHaveAttribute("aria-hidden", "true");
  await ctx.close();
});

test("cartel QR : visible en desktop, masqué en fin de page", async ({ page, isMobile }) => {
  test.skip(isMobile, "vérifié en desktop");
  await page.goto("/nutrition", { waitUntil: "domcontentloaded" });
  const cartel = page.locator('[data-cartel="desktop"]');
  await expect(cartel).toBeVisible();
  await expect(cartel).not.toHaveAttribute("aria-hidden", "true");
  await page.locator("#telecharger").scrollIntoViewIfNeeded();
  await expect(cartel).toHaveAttribute("aria-hidden", "true");
});

test("iPad en paysage : badge App Store en cartel, pas de QR", async ({ browser, isMobile }) => {
  test.skip(isMobile, "un seul projet suffit");
  const ctx = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    viewport: { width: 1133, height: 744 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto("/nutrition", { waitUntil: "domcontentloaded" });
  await expect(
    page.locator('[data-cartel="ios"]').getByAltText("Télécharger dans l’App Store"),
  ).toBeVisible();
  await expect(page.locator('[data-cartel="desktop"]')).toHaveCount(0);
  await ctx.close();
});

test("avant la sortie : « Bientôt », sans lien vers les stores", async ({ page, isMobile }) => {
  test.skip(storePublie(SITE.appStoreUrl), "liens des stores renseignés");
  test.skip(isMobile, "vérifié en desktop");
  await page.goto("/nutrition", { waitUntil: "domcontentloaded" });
  await pageHydratee(page);
  const bloc = page.locator("#telecharger");
  await expect(bloc.getByText("Bientôt sur l’App Store et Google Play.")).toBeVisible();
  await expect(bloc.getByRole("link")).toHaveCount(0);
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
});

test("clic vers un store : événement ourson_store dans le dataLayer", async ({ page, isMobile }) => {
  test.skip(!storePublie(SITE.appStoreUrl), "liens des stores pas encore renseignés");
  test.skip(isMobile, "vérifié en desktop");
  await page.route(/googletagmanager\.com/, (r) => r.fulfill({ body: "", contentType: "text/javascript" }));
  await page.goto("/nutrition", { waitUntil: "domcontentloaded" });
  await pageHydratee(page);
  await page.locator("#telecharger").getByRole("link", { name: "Ourson sur l’App Store" }).click();
  const evenement = await page.evaluate(() =>
    (window.dataLayer ?? []).find((d) => Object(d).event === "ourson_store"),
  );
  expect(evenement).toEqual({ event: "ourson_store", store: "app_store", emplacement: "fin" });
});

test("menu mobile : ouverture et fermeture", async ({ page, isMobile }) => {
  test.skip(!isMobile, "menu burger mobile");
  await page.goto("/nutrition", { waitUntil: "domcontentloaded" });
  await pageHydratee(page);
  await page.getByRole("button", { name: "Menu" }).click();
  const menu = page.locator("dialog#menu-mobile");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});
