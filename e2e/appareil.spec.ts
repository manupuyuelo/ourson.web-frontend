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
    await expect(page.locator("#telecharger").getByAltText("Télécharger dans l'App Store")).toBeVisible();
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
  await expect(page.locator("#telecharger").getByText("Téléchargez l'app")).toBeVisible();
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
