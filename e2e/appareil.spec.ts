import { expect, test } from "@playwright/test";

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
    await page.goto("/");
    await expect(page.locator("#telecharger").getByAltText("Télécharger dans l’App Store")).toBeVisible();
    await ctx.close();
  });

  test("Android : badge Google Play", async ({ browser }) => {
    const ctx = await browser.newContext({ userAgent: UA.android, viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.locator("#telecharger").getByAltText("Disponible sur Google Play")).toBeVisible();
    await ctx.close();
  });
});

test("ordinateur : bloc QR", async ({ page, isMobile }) => {
  test.skip(isMobile, "vérifié en desktop");
  await page.goto("/");
  await expect(page.locator("#telecharger").getByText("Téléchargez l’app")).toBeVisible();
});

test("cartel mobile : masqué sur le hero et en fin de page, visible entre les deux", async ({
  browser,
  isMobile,
}) => {
  test.skip(!isMobile, "vérifié en viewport mobile");
  const ctx = await browser.newContext({ userAgent: UA.ios, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto("/");
  const cartel = page.locator('[data-cartel="ios"]');
  await expect(cartel).toHaveAttribute("aria-hidden", "true");
  await page.locator("#repas").scrollIntoViewIfNeeded();
  await expect(cartel).not.toHaveAttribute("aria-hidden", "true");
  await expect(cartel.getByAltText("Télécharger dans l’App Store")).toBeVisible();
  await page.locator("#telecharger").scrollIntoViewIfNeeded();
  await expect(cartel).toHaveAttribute("aria-hidden", "true");
  await ctx.close();
});

test("cartel QR : visible en desktop, masqué en fin de page", async ({ page, isMobile }) => {
  test.skip(isMobile, "vérifié en desktop");
  await page.goto("/nutrition");
  const cartel = page.locator('[data-cartel="desktop"]');
  await expect(cartel).toBeVisible();
  await expect(cartel).not.toHaveAttribute("aria-hidden", "true");
  await page.locator("#telecharger").scrollIntoViewIfNeeded();
  await expect(cartel).toHaveAttribute("aria-hidden", "true");
});

test("menu mobile : ouverture et fermeture", async ({ page, isMobile }) => {
  test.skip(!isMobile, "menu burger mobile");
  await page.goto("/nutrition");
  await page.getByRole("button", { name: "Menu" }).click();
  const menu = page.locator("dialog#menu-mobile");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});
