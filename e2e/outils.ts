import type { Page } from "@playwright/test";

/**
 * Attend que React ait hydraté la page : le bandeau cookies, présent sur toutes les pages, expose
 * alors `window.oursonCookies`. Les tests naviguent en `domcontentloaded` (sans attendre les images),
 * il faut donc attendre l'hydratation avant de cliquer.
 */
export const pageHydratee = (page: Page) => page.waitForFunction(() => Boolean(window.oursonCookies));
