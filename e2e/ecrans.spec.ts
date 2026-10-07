import { devices, expect, test, type BrowserContextOptions, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";

// Audit de mise en page sur toute la gamme d'écrans : téléphones, foldables, tablettes, paysage, ordinateurs.
// ECRANS=1 yarn test:e2e ecrans. Contrôles bloquants : pas de défilement horizontal, pas de texte hors écran, pas de grand vide
// dans une section, pas d'ourson sur un texte, un seul bloc de téléchargement visible. CAPTURES=1 enregistre aussi les pages
// dans .captures/ecrans/ (puis node scripts/planche-ecrans.ts <page>).

const IPAD_UA =
  "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const tactile = (ua: string, width: number, height: number, dpr = 2): BrowserContextOptions => ({
  userAgent: ua,
  viewport: { width, height },
  deviceScaleFactor: dpr,
  isMobile: true,
  hasTouch: true,
});
const ordinateur = (width: number, height: number): BrowserContextOptions => ({
  viewport: { width, height },
});
const PIXEL_UA = devices["Pixel 9 Pro"].userAgent;

const FORMATS: [string, BrowserContextOptions][] = [
  ["galaxy-s24", devices["Galaxy S24"]],
  ["pixel-9", devices["Pixel 9"]],
  ["galaxy-z-fold-7-ferme", devices["Galaxy Z Fold 7 Cover"]],
  ["iphone-16e", devices["iPhone 16e"]],
  ["iphone-15", devices["iPhone 15"]],
  ["iphone-16-pro", devices["iPhone 16 Pro"]],
  ["pixel-9-pro-fold-ferme", tactile(PIXEL_UA, 410, 920, 2.625)],
  ["pixel-10-pro", devices["Pixel 10 Pro"]],
  ["iphone-16-pro-max", devices["iPhone 16 Pro Max"]],
  ["pixel-9-pro-xl", devices["Pixel 9 Pro XL"]],
  ["galaxy-z-fold-6-ferme", devices["Galaxy Z Fold 6 Cover"]],
  ["galaxy-tab-s9", devices["Galaxy Tab S9"]],
  ["ipad-mini", tactile(IPAD_UA, 744, 1133)],
  ["pixel-9-pro-fold-ouvert", tactile(PIXEL_UA, 790, 870, 2.625)],
  ["ipad-pro-11", devices["iPad Pro 11"]],
  ["iphone-15-paysage", devices["iPhone 15 landscape"]],
  ["galaxy-z-fold-6-ouvert", devices["Galaxy Z Fold 6"]],
  ["iphone-16-pro-max-paysage", devices["iPhone 16 Pro Max landscape"]],
  ["galaxy-z-fold-7-ouvert", devices["Galaxy Z Fold 7"]],
  ["ipad-mini-paysage", tactile(IPAD_UA, 1133, 744)],
  ["ordinateur-1024", ordinateur(1024, 768)],
  ["ordinateur-1280", ordinateur(1280, 800)],
  ["ordinateur-1440", ordinateur(1440, 900)],
  ["ordinateur-1920", ordinateur(1920, 1080)],
];

const PAGES = [
  ["accueil", "/"],
  ["nutrition", "/nutrition"],
  ["sommeil", "/sommeil"],
  ["eveil", "/eveil"],
  ["blog", "/blog"],
  ["article", "/blog/sommeil/importance-regularite-temps-endormissement-enfant"],
  ["confidentialite", "/confidentialite"],
  ["cgu", "/cgu"],
  ["sources", "/sources"],
] as const;

/**
 * Plus grand écart vertical toléré entre deux blocs consécutifs d'une section. Sur téléphone, l'Accueil
 * pousse volontairement ses visuels en bas d'écran (handoff) : environ 140 px sur un iPhone 16 Pro Max.
 */
const VIDE_MAX = 200;

const CONSENTEMENT = JSON.stringify({
  audience: false,
  pub: false,
  date: new Date().toISOString(),
  version: 1,
});

async function preparer(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 20));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

/** Mesures faites dans la page : débordements, textes hors écran, plus grand vide par section. */
function mesurer() {
  const largeur = document.documentElement.clientWidth;
  // oxlint-disable-next-line unicorn/consistent-function-scoping -- sérialisée dans la page par page.evaluate
  const visible = (el: Element) => el.checkVisibility() && el.getBoundingClientRect().width > 0;
  // Un texte dans une piste qui défile (carrousel, filtres) peut légitimement dépasser l'écran.
  // oxlint-disable-next-line unicorn/consistent-function-scoping -- sérialisée dans la page par page.evaluate
  const dansPiste = (el: Element) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      if (/auto|scroll/.test(getComputedStyle(p).overflowX)) return true;
    }
    return false;
  };
  const horsEcran = [...document.querySelectorAll("h1, h2, h3, p, a, button, li")]
    .filter((el) => visible(el) && !dansPiste(el) && getComputedStyle(el).position !== "fixed")
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.left < -1 || r.right > largeur + 1;
    })
    .map((el) => `${el.tagName} « ${(el.textContent ?? "").trim().slice(0, 40)} »`);

  const vides = [...document.querySelectorAll("main section")].map((sec) => {
    const blocs = [...sec.children]
      .filter((el) => visible(el) && !/absolute|fixed/.test(getComputedStyle(el).position))
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.height > 0)
      .toSorted((a, b) => a.top - b.top);
    let max = 0;
    let bas = blocs[0]?.bottom ?? 0;
    for (const r of blocs.slice(1)) {
      max = Math.max(max, r.top - bas);
      bas = Math.max(bas, r.bottom);
    }
    const titre = sec.querySelector("h1, h2")?.textContent?.trim().slice(0, 30) ?? "?";
    return { titre, vide: Math.round(max) };
  });

  // Oursons posés en absolu (coupés au bord, ou sur un visuel) : aucun ne doit recouvrir une ligne de texte.
  // Le rectangle de l'image est resserré pour ignorer le transparent du PNG ; on compare aux lignes de texte
  // elles-mêmes (Range), et non à la boîte de l'élément, pour ne pas compter la place réservée en padding.
  const oursSurTexte = [...document.querySelectorAll("main img[data-boucle]")]
    .filter((img) => visible(img) && getComputedStyle(img).position === "absolute")
    .flatMap((img) => {
      const b = img.getBoundingClientRect();
      const ours = {
        left: b.left + b.width * 0.15,
        right: b.right - b.width * 0.15,
        top: b.top + b.height * 0.1,
        bottom: b.bottom - b.height * 0.1,
      };
      const section = img.closest("section");
      if (!section) return [];
      return [...section.querySelectorAll("h1, h2, p")]
        .filter((el) => visible(el))
        .filter((el) => {
          const r = document.createRange();
          r.selectNodeContents(el);
          return [...r.getClientRects()].some(
            (l) =>
              l.width > 0 &&
              l.left < ours.right &&
              l.right > ours.left &&
              l.top < ours.bottom &&
              l.bottom > ours.top,
          );
        })
        .map((el) => `${el.tagName} « ${(el.textContent ?? "").trim().slice(0, 40)} »`);
    });

  return {
    oursSurTexte,
    defilementHorizontal: document.documentElement.scrollWidth - largeur,
    horsEcran,
    vides,
  };
}

test.describe.configure({ mode: "parallel" });
// Long (24 formats × 9 pages) : lancé à la demande avant une modification visuelle, pas en CI.
test.skip(!process.env.ECRANS && !process.env.CAPTURES, "lancé seulement avec ECRANS=1 ou CAPTURES=1");

for (const [format, options] of FORMATS) {
  test.describe(format, () => {
    for (const [nom, path] of PAGES) {
      test(nom, async ({ browser }, info) => {
        test.skip(info.project.name !== "desktop", "formats fixés par le test : un seul projet suffit");
        test.setTimeout(60_000);
        const ctx = await browser.newContext({ ...options, reducedMotion: "reduce" });
        await ctx.addInitScript((c) => localStorage.setItem("ourson-cookies", c), CONSENTEMENT);
        await ctx.route(/googletagmanager\.com/, (r) =>
          r.fulfill({ body: "", contentType: "text/javascript" }),
        );
        const page = await ctx.newPage();
        await page.goto(path, { waitUntil: "domcontentloaded" });
        await preparer(page);

        const m = await page.evaluate(mesurer);
        if (process.env.MESURE) console.log(format, nom, JSON.stringify(m.vides.filter((v) => v.vide > 120)));

        expect(m.defilementHorizontal, "défilement horizontal").toBeLessThanOrEqual(0);
        expect(m.horsEcran, "textes hors écran").toEqual([]);
        expect(m.oursSurTexte, "ourson sur le texte").toEqual([]);
        expect(
          m.vides.filter((v) => v.vide > VIDE_MAX),
          `vides de plus de ${VIDE_MAX} px`,
        ).toEqual([]);

        // Un seul bloc de téléchargement à l'écran à la fois (en haut de page).
        const blocsVisibles = await page.evaluate(() => {
          const h = window.innerHeight;
          const aLEcran = (el: Element | null) => {
            if (!el?.checkVisibility()) return false;
            const r = el.getBoundingClientRect();
            return r.height > 0 && r.bottom > 0 && r.top < h;
          };
          const cartels = [...document.querySelectorAll("[data-cartel]")].filter(
            (el) => aLEcran(el) && el.getAttribute("aria-hidden") !== "true",
          );
          return (
            cartels.length +
            [...document.querySelectorAll("[data-dl-hero], #telecharger")].filter(aLEcran).length
          );
        });
        expect(blocsVisibles, "blocs de téléchargement visibles").toBeLessThanOrEqual(1);

        if (process.env.CAPTURES) {
          mkdirSync(`.captures/ecrans/${format}`, { recursive: true });
          await page.screenshot({ path: `.captures/ecrans/${format}/${nom}.png`, fullPage: true });
        }
        await ctx.close();
      });
    }
  });
}
