// Bannière de la page entreprise LinkedIn, 1128 × 191 (et 2256 × 382 pour les écrans denses),
// dans l’univers des visuels des stores : dégradé héros, mot-symbole, les trois questions aux verbes
// colorés et l’ourson qui fait coucou devant les bulles des trois piliers. Rendue par Chromium avec les
// vrais tokens et les vraies polices.
//
// Contraintes LinkedIn :
// - le logo de la page recouvre le bas à gauche : rien d’important sur les 300 premiers pixels ;
// - sur mobile, la bannière est rognée sur les côtés (environ un quart de chaque côté, au format 3:1) et
//   le logo y recouvre le bas à gauche de ce qui reste : le texte commence assez loin pour l’éviter.
//
// Usage : node scripts/banniere-linkedin.ts [--simulation <dossier>]
// L’option écrit aussi une planche qui simule le logo (desktop) et le recadrage mobile.
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const RACINE = path.join(import.meta.dirname, "..");
const OUT = path.join(RACINE, "public", "partage", "linkedin");
const W = 1128;
const H = 191;

const f = (rel: string) => pathToFileURL(path.join(RACINE, rel)).href;

// Typographie française : espace fine insécable avant ?
const FINE = " ";

const BANNIERE = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link rel="stylesheet" href="${f("src/styles/tokens/colors.css")}">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&display=block">
<style>
  @font-face {
    font-family: "Bryndan";
    src: url("${f("src/assets/fonts/BryndanWrite.woff2")}") format("woff2");
    font-display: block;
  }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
  body { position: relative; background: var(--gradient-hero); color: var(--ink); -webkit-font-smoothing: antialiased; }
  .bulle { position: absolute; border-radius: 50%; }
  .txt { position: absolute; left: 408px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; }
  .marque { font-family: "Bryndan"; font-size: 32px; line-height: 0.8; color: var(--coral); }
  h1 { margin-top: 10px; font-family: "Baloo 2", sans-serif; font-weight: 800; font-size: 32px; line-height: 0.98; letter-spacing: -0.02em; }
  h1 div { white-space: nowrap; }
  .ours { position: absolute; left: 652px; top: 10px; width: 180px; filter: drop-shadow(0 12px 14px rgba(42, 32, 28, 0.22)); }
</style></head><body>
  <div class="bulle" style="left:640px;top:100px;width:110px;height:110px;background:var(--repas)"></div>
  <div class="bulle" style="left:762px;top:-22px;width:140px;height:140px;background:var(--sommeil)"></div>
  <div class="bulle" style="left:738px;top:126px;width:160px;height:160px;background:var(--eveil)"></div>
  <div class="txt">
    <div class="marque">ourson</div>
    <h1>
      <div>On <span style="color:var(--repas)">mange</span> quoi${FINE}?</div>
      <div>On <span style="color:var(--sommeil)">dort</span> quand${FINE}?</div>
      <div>On <span style="color:var(--eveil)">joue</span> à quoi${FINE}?</div>
    </h1>
  </div>
  <img class="ours" src="${f("src/assets/ours/ourson-accueil.png")}" alt="">
</body></html>`;

// Planche de relecture : la page LinkedIn sur ordinateur (logo de 104 px, débordant de moitié) et sur
// téléphone (390 px de large, bannière en 3:1 rognée au centre, logo de 64 px).
const simulation = (
  banniere: string,
  logo: string,
) => `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { background: #f4f2ee; font: 600 14px system-ui, sans-serif; color: #555; padding: 32px; width: 1192px; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 10px; }
  .carte { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 0 1px #e0dfdc; margin-bottom: 40px; }
  .ban { position: relative; }
  .ban img.b { display: block; }
  .logo { position: absolute; border: 4px solid #fff; border-radius: 6px; background: #fff; }
  .zone { position: absolute; left: 0; top: 0; bottom: 0; width: 300px; border-right: 1px dashed rgba(0,0,0,.35); }
  .nom { padding: 64px 24px 24px; font-size: 22px; color: #191919; font-weight: 700; }
  .nom small { display: block; font-size: 14px; color: #666; font-weight: 400; margin-top: 4px; }
  .rang { display: flex; gap: 40px; align-items: flex-start; }
  .tel { width: 390px; background: #fff; border-radius: 28px; overflow: hidden; box-shadow: 0 0 0 1px #e0dfdc; }
  .tel .ban { position: relative; width: 390px; height: 130px; }
  .tel .clip { position: absolute; inset: 0; overflow: hidden; }
  .tel .ban img.b { height: 130px; width: auto; position: absolute; left: 50%; transform: translateX(-50%); }
  .tel .nom { padding-top: 48px; font-size: 19px; }
  .entier { position: relative; }
  .cadre { position: absolute; top: 0; height: 100%; border: 2px solid #e8542f; }
  .note { max-width: 520px; line-height: 1.5; font-weight: 400; color: #444; }
</style></head><body>
  <h2>Ordinateur · logo de la page en bas à gauche (zone de 300 px en pointillé)</h2>
  <div class="carte">
    <div class="ban"><img class="b" src="${banniere}" width="1128" height="191"><div class="zone"></div>
      <img class="logo" src="${logo}" style="left:24px;top:135px;width:112px;height:112px"></div>
    <div class="nom">Ourson<small>Logiciels · Paris</small></div>
  </div>
  <h2>Téléphone · recadrage central en 3:1 (390 × 130)</h2>
  <div class="rang">
    <div class="tel">
      <div class="ban"><div class="clip"><img class="b" src="${banniere}"></div><img class="logo" src="${logo}" style="left:16px;top:94px;width:72px;height:72px"></div>
      <div class="nom">Ourson<small>Logiciels · Paris</small></div>
    </div>
    <div>
      <div class="entier"><img class="b" src="${banniere}" width="560" style="display:block;opacity:.45">
        <div class="cadre" style="left:${(560 * (W - H * 3)) / 2 / W}px;width:${(560 * H * 3) / W}px"></div></div>
      <p class="note" style="margin-top:12px">Le cadre orange montre la partie gardée sur téléphone (573 px au centre de la bannière). Les applis rognent plus ou moins selon la largeur de l’écran : c’est l’hypothèse la plus serrée courante.</p>
    </div>
  </div>
</body></html>`;

const args = process.argv.slice(2);
const iSim = args.indexOf("--simulation");
const dossierSim = iSim >= 0 ? path.resolve(args[iSim + 1] ?? ".") : null;

await mkdir(OUT, { recursive: true });
// Les fichiers locaux (tokens, police, ourson) ne se chargent que depuis une page servie en file://.
const tmp = await mkdtemp(path.join(tmpdir(), "banniere-"));
const source = path.join(tmp, "banniere.html");
await writeFile(source, BANNIERE);
const navigateur = await chromium.launch();
try {
  for (const [echelle, nom] of [
    [1, "banniere-ourson.png"],
    [2, "banniere-ourson@2x.png"],
  ] as const) {
    const page = await navigateur.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: echelle });
    await page.goto(pathToFileURL(source).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, nom) });
    await page.close();
    console.log(`public/partage/linkedin/${nom}`);
  }

  if (dossierSim) {
    await mkdir(dossierSim, { recursive: true });
    const html = simulation(
      pathToFileURL(path.join(OUT, "banniere-ourson@2x.png")).href,
      f("public/icon-512.png"),
    );
    const fichier = path.join(dossierSim, "simulation-linkedin.html");
    await writeFile(fichier, html);
    const page = await navigateur.newPage({ viewport: { width: 1256, height: 800 }, deviceScaleFactor: 2 });
    await page.goto(pathToFileURL(fichier).href, { waitUntil: "load" });
    await page.screenshot({ path: path.join(dossierSim, "simulation-linkedin.png"), fullPage: true });
    await page.close();
    console.log(path.join(dossierSim, "simulation-linkedin.png"));
  }
} finally {
  await navigateur.close();
  await rm(tmp, { recursive: true, force: true });
}
