// Images de partage (Open Graph), 1200 × 630 : une composition par page, dans la DA de son hero
// (fond plein du pilier, titre Baloo, carte visuel, ourson du pilier), rendue par Chromium
// avec les vrais tokens et les vraies polices, puis exportée en JPEG léger.
//
// Règles de partage, valables pour WhatsApp, iMessage, Facebook, Instagram (DM), Telegram, X, LinkedIn,
// Slack, Discord :
// - 1,91:1 en 1200 × 630, JPEG < 300 Ko (WhatsApp ignore les images trop lourdes) ;
// - rien d’important à moins de 40 px des bords (X rogne en 2:1, certaines messageries arrondissent) ;
// - l’ourson et la couleur du pilier tiennent dans le carré central (WhatsApp Android et les
//   aperçus compacts recadrent en vignette carrée) ;
// - l’URL porte l’empreinte du fichier (`?v=`), écrite dans `src/lib/partage.json` : les messageries
//   gardent une image en cache des semaines, une nouvelle empreinte force le rafraîchissement.
//
// Usage : yarn og
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { parse } from "yaml";
import { z } from "zod";

const RACINE = path.join(import.meta.dirname, "..");
// Tout vient du dépôt (oursons, échantillons, couvertures) : seules les polices Google passent par le réseau.
const ASSETS = path.join(RACINE, "src", "assets");
const OUT = path.join(RACINE, "public", "og");
const MANIFESTE = path.join(RACINE, "src", "lib", "partage.json");
const W = 1200;
const H = 630;

const f = (rel: string) => pathToFileURL(path.join(ASSETS, rel)).href;
const OURS = {
  accueil: f("ours/ourson-accueil.png"),
  repas: f("ours/ourson-repas.png"),
  sommeil: f("ours/ourson-sommeil.png"),
  eveil: f("ours/ourson-eveil.png"),
};

// Typographie française : espace fine insécable avant ? ! ; et insécable avant :
const FINE = " ";
const INS = "\u00a0";

const BASE = `
<link rel="stylesheet" href="${pathToFileURL(path.join(RACINE, "src/styles/tokens/colors.css")).href}">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@700;800&display=block">
<style>
  @font-face {
    font-family: "Bryndan";
    src: url("${pathToFileURL(path.join(RACINE, "src/assets/fonts/BryndanWrite.woff2")).href}") format("woff2");
    font-display: block;
  }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
  body {
    position: relative;
    font-family: "Nunito", sans-serif;
    color: #fff;
    -webkit-font-smoothing: antialiased;
  }
  /* La marque, sur chaque image : le nom et ce que c’est (une app), en Bryndan comme le hero de l’Accueil. */
  .marque { position: absolute; left: 72px; top: 40px; font-family: "Bryndan"; line-height: 1; }
  .marque b { display: block; font-weight: 400; font-size: 96px; line-height: 0.85; }
  .marque i { display: block; font-style: normal; font-size: 30px; margin-top: 8px; }
  .txt { position: absolute; left: 72px; top: 196px; bottom: 32px; display: flex; flex-direction: column; justify-content: center; gap: 22px; }
  h1 {
    font-family: "Baloo 2", sans-serif; font-weight: 800; font-size: 76px; line-height: 0.95;
    letter-spacing: -0.01em; text-wrap: balance;
  }
  .puces { display: flex; flex-wrap: wrap; gap: 10px; }
  .puces span { background: rgba(255, 255, 255, 0.18); border-radius: 30px; padding: 10px 18px; font-size: 19px; font-weight: 800; }
  .carte { position: absolute; background: #fff; border-radius: 34px; padding: 16px; box-shadow: 0 28px 60px rgba(0, 0, 0, 0.28); color: var(--ink); }
  .carte img { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 22px; }
  .ours { position: absolute; filter: drop-shadow(0 22px 30px rgba(0, 0, 0, 0.22)); }
</style>`;

const marque = (couleur = "#fff") =>
  `<div class="marque" style="color:${couleur}"><b>ourson</b><i>l’app qui vous donne un coup de patte</i></div>`;

const page = (fond: string, corps: string) =>
  `<!doctype html><html lang="fr"><head><meta charset="utf-8">${BASE}</head><body style="background:${fond}">${corps}</body></html>`;

/** Hero d’un pilier : fond plein, titre et puces à gauche, carte visuel à droite, ourson qui surgit du bas. */
const pilier = (p: {
  couleur: string;
  titre: string;
  largeurTitre: number;
  puces: string[];
  carte: string;
  ours: string;
}) =>
  page(
    `var(--${p.couleur})`,
    `${marque()}
     <div class="txt" style="width:${p.largeurTitre}px">
       <h1 style="font-size:70px">${p.titre}</h1>
       <div class="puces">${p.puces.map((t) => `<span>${t}</span>`).join("")}</div>
     </div>
     ${p.carte}
     ${p.ours}`,
  );

// Les sept nuits de la page Sommeil (durée en minutes, réveils), aujourd’hui en dernier.
const NUITS = [
  ["lun.", 612, 2],
  ["mar.", 636, 1],
  ["mer.", 588, 2],
  ["jeu.", 654, 1],
  ["ven.", 672, 0],
  ["sam.", 624, 1],
  ["auj.", 648, 1],
] as const;
const duree = (m: number) => `${Math.floor(m / 60)}${INS}h${INS}${String(m % 60).padStart(2, "0")}`;

const graphiqueNuits = `
<div class="carte" style="left:700px;top:96px;width:450px;padding:24px 26px 22px">
  <div style="display:flex;justify-content:space-between;align-items:baseline">
    <div style="font-family:'Baloo 2';font-weight:800;font-size:25px">Ses 7 dernières nuits</div>
    <div style="font-weight:800;font-size:15px;color:var(--sommeil)">Léa, 8 mois</div>
  </div>
  <div style="display:flex;justify-content:space-between;margin-top:18px;align-items:flex-end">
    ${NUITS.map(([jour, min, reveils], i) => {
      const auj = i === NUITS.length - 1;
      const h = 70 + (min - 580) * 0.9;
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:52px">
        <div style="font-size:12px;font-weight:800;color:var(--muted);white-space:nowrap">${duree(min)}</div>
        <div style="height:${h}px;width:38px;border-radius:11px;background:${auj ? "var(--sommeil)" : "var(--sommeil-surface)"};display:flex;flex-direction:column;justify-content:center;align-items:center;gap:7px">
          ${Array.from({ length: reveils }, () => `<i style="width:7px;height:7px;border-radius:50%;background:${auj ? "#fff" : "var(--sommeil-ink)"}"></i>`).join("")}
        </div>
        <div style="font-size:14px;font-weight:800;color:${auj ? "var(--sommeil)" : "var(--muted)"}">${jour}</div>
      </div>`;
    }).join("")}
  </div>
</div>`;

const IMAGES: Record<string, { html: string; alt: string }> = {
  accueil: {
    alt: `Ourson, l’app qui vous donne un coup de patte${INS}: on mange quoi${FINE}? On dort quand${FINE}? On joue à quoi${FINE}?`,
    html: page(
      "var(--gradient-hero)",
      `<div style="position:absolute;left:72px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;color:var(--ink)">
         <div style="font-family:Bryndan;font-size:104px;line-height:.9;color:var(--coral)">ourson</div>
         <div style="font-family:Bryndan;font-size:30px;color:var(--coral);margin:10px 0 30px">l’app qui vous donne un coup de patte</div>
         <h1 style="font-size:64px;line-height:1.02">On <span style="color:var(--repas)">mange</span> quoi${FINE}?<br>On <span style="color:var(--sommeil)">dort</span> quand${FINE}?<br>On <span style="color:var(--eveil)">joue</span> à quoi${FINE}?</h1>
       </div>
       <div style="position:absolute;left:880px;top:78px;width:280px;height:280px;border-radius:50%;background:var(--sommeil)"></div>
       <div style="position:absolute;left:626px;top:330px;width:210px;height:210px;border-radius:50%;background:var(--repas)"></div>
       <div style="position:absolute;left:826px;top:520px;width:250px;height:250px;border-radius:50%;background:var(--eveil)"></div>
       <img class="ours" src="${OURS.accueil}" style="left:660px;top:96px;height:600px">
       <div style="position:absolute;left:584px;top:388px;background:#fff;color:var(--ink);border-radius:22px 22px 22px 6px;padding:14px 18px;font-family:'Baloo 2';font-weight:800;font-size:21px;line-height:1.1;width:200px;box-shadow:0 14px 30px rgba(120,60,30,.16)">Par quoi on commence aujourd’hui${FINE}?</div>`,
    ),
  },
  nutrition: {
    alt: `Un seul plat pour toute la famille${INS}: une poêlée à partager et l’ourson cuisinier d’Ourson.`,
    html: pilier({
      couleur: "repas",
      titre: "Un seul plat pour toute la famille",
      largeurTitre: 480,
      puces: ["Une seule cuisson", "Courses automatiques"],
      carte: `<div class="carte" style="left:700px;top:64px;width:440px;height:440px"><img src="${f("echantillons/repas/un-plat-toute-la-tablee/beetroot_chicken_cumin_pan__0_famille.jpg")}"></div>`,
      ours: `<img class="ours" src="${OURS.repas}" style="left:560px;top:300px;height:400px">`,
    }),
  },
  sommeil: {
    alt: `Comprenez enfin ses nuits${INS}: les sept dernières nuits de Léa et l’ourson en bonnet de nuit.`,
    html: pilier({
      couleur: "sommeil",
      titre: "Comprenez enfin ses nuits",
      largeurTitre: 520,
      puces: ["Ses nuits en un coup d’œil", "Partagé avec le foyer"],
      carte: graphiqueNuits,
      ours: `<img class="ours" src="${OURS.sommeil}" style="left:596px;top:392px;height:380px">`,
    }),
  },
  eveil: {
    alt: `L’accompagner dans son éveil, jour après jour${INS}: une activité du jour et l’ourson d’Ourson.`,
    html: pilier({
      couleur: "eveil",
      titre: "L’accompagner dans son éveil, jour après jour",
      largeurTitre: 560,
      puces: ["Une activité par jour", "Histoires et berceuses"],
      carte: `<div class="carte" style="left:660px;top:84px;width:480px;height:340px"><img src="${f("echantillons/eveil/jeux/deux_paniers.jpg")}"></div>`,
      ours: `<img class="ours" src="${OURS.eveil}" style="left:600px;top:340px;height:360px">`,
    }),
  },
  blog: {
    alt: `Le blog d’Ourson${INS}: nutrition, sommeil et éveil, avec les trois oursons de l’app.`,
    html: page(
      "var(--gradient-hero)",
      `${marque("var(--coral)")}
       <div class="txt" style="width:600px;color:var(--ink)">
         <h1 style="font-size:74px">Bienvenue sur le blog d’Ourson</h1>
         <div class="puces">${[
           ["Nutrition", "repas"],
           ["Sommeil", "sommeil"],
           ["Éveil", "eveil"],
         ]
           .map(
             ([t, c]) =>
               `<span style="background:#fff;border:2.5px solid var(--${c});color:var(--ink);font-family:'Baloo 2';font-size:22px;padding:6px 20px">${t}</span>`,
           )
           .join("")}</div>
       </div>
       <div style="position:absolute;left:700px;top:330px;width:200px;height:200px;border-radius:50%;background:var(--repas)"></div>
       <div style="position:absolute;left:930px;top:70px;width:220px;height:220px;border-radius:50%;background:var(--sommeil)"></div>
       <div style="position:absolute;left:900px;top:430px;width:240px;height:240px;border-radius:50%;background:var(--eveil)"></div>
       <img class="ours" src="${OURS.sommeil}" style="left:860px;top:86px;height:300px">
       <img class="ours" src="${OURS.repas}" style="left:640px;top:236px;height:360px">
       <img class="ours" src="${OURS.eveil}" style="left:880px;top:300px;height:320px">`,
    ),
  },
};

// Rubriques du blog : la couleur du pilier et son titre de l’Accueil, l’ourson du pilier.
const RUBRIQUES = [
  ["nutrition", "repas", "Un plat. Toute la tablée.", "Nutrition"],
  ["sommeil", "sommeil", "La sieste, au bon moment.", "Sommeil"],
  ["activites", "eveil", "Ses jalons, un jeu par jour.", "Éveil"],
] as const;
for (const [rubrique, couleur, titre, label] of RUBRIQUES) {
  IMAGES[`blog-${rubrique}`] = {
    alt: `${label}, le blog d’Ourson${INS}: ${titre}`,
    html: page(
      `var(--${couleur})`,
      `${marque()}
       <div class="txt" style="width:600px">
         <h1 style="font-size:76px">${titre}</h1>
         <div class="puces"><span>Le blog · ${label}</span></div>
       </div>
       <div style="position:absolute;left:760px;top:90px;width:420px;height:420px;border-radius:50%;background:var(--${couleur}-deep)"></div>
       <img class="ours" src="${OURS[couleur]}" style="left:${couleur === "eveil" ? 700 : 760}px;top:110px;height:560px">`,
    ),
  };
}

/** Page sans DA propre (pages légales) : fond pêche de l’Accueil, son titre, l’ourson qui salue. */
const simple = (titre: string) =>
  page(
    "var(--gradient-hero)",
    `${marque("var(--coral)")}
     <div class="txt" style="width:620px;color:var(--ink)"><h1 style="font-size:80px">${titre}</h1></div>
     <div style="position:absolute;left:830px;top:96px;width:340px;height:340px;border-radius:50%;background:var(--sommeil)"></div>
     <div style="position:absolute;left:700px;top:420px;width:200px;height:200px;border-radius:50%;background:var(--repas)"></div>
     <img class="ours" src="${OURS.accueil}" style="left:730px;top:120px;height:560px">`,
  );
for (const [nom, titre] of [
  ["confidentialite", "Règles de confidentialité"],
  ["cgu", "Conditions générales d’utilisation"],
  ["sources", "Nos sources"],
] as const) {
  IMAGES[nom] = { alt: `${titre}, Ourson, l’app qui vous donne un coup de patte.`, html: simple(titre) };
}

// Articles : la couverture (src/assets/blog) dans une carte, le titre, la couleur et l’ourson de la rubrique.
// Le titre s’ajuste à sa longueur (voir `ajuster` plus bas).
const PILIER_DE = { nutrition: "repas", sommeil: "sommeil", activites: "eveil" } as const;
const LABEL_DE = { nutrition: "Nutrition", sommeil: "Sommeil", activites: "Éveil" } as const;
// Les articles viennent de l’ancien site : apostrophes droites et espaces ordinaires à corriger.
const typo = (t: string) =>
  t
    .replace(/'/g, "’")
    .replace(/ ([?!;])/g, `${FINE}$1`)
    .replace(/ :/g, `${INS}:`);
const DIR_BLOG = path.join(RACINE, "src", "content", "blog");
for (const fichier of (await readdir(DIR_BLOG)).filter((n) => n.endsWith(".mdx"))) {
  const slug = fichier.replace(/\.mdx$/, "");
  const yaml =
    (await readFile(path.join(DIR_BLOG, fichier), "utf8")).match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const { title, rubrique } = z
    .object({ title: z.string(), rubrique: z.enum(["nutrition", "sommeil", "activites"]) })
    .parse(parse(yaml));
  const couleur = PILIER_DE[rubrique];
  const couverture = pathToFileURL(path.join(RACINE, "src", "assets", "blog", `${slug}.jpg`)).href;
  IMAGES[`blog/${slug}`] = {
    alt: `${typo(title)}, un article du blog d’Ourson.`,
    html: page(
      `var(--${couleur})`,
      `${marque()}
       <div class="txt" style="width:500px">
         <h1 data-ajuste="240" style="font-size:62px;line-height:1">${typo(title)}</h1>
         <div class="puces"><span>Le blog · ${LABEL_DE[rubrique]}</span></div>
       </div>
       <div class="carte" style="left:700px;top:64px;width:440px;height:440px"><img src="${couverture}"></div>
       <img class="ours" src="${OURS[couleur]}" style="left:${couleur === "eveil" ? 610 : 600}px;top:360px;height:350px">`,
    ),
  };
}

await mkdir(OUT, { recursive: true });
const tmp = await mkdtemp(path.join(tmpdir(), "ourson-og-"));
const navigateur = await chromium.launch();
const onglet = await navigateur.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const manifeste: Record<string, { v: string; alt: string }> = {};

try {
  for (const [nom, { html, alt }] of Object.entries(IMAGES)) {
    const fichier = path.join(tmp, `${nom.replace("/", "-")}.html`);
    await writeFile(fichier, html);
    await onglet.goto(pathToFileURL(fichier).href, { waitUntil: "networkidle" });
    await onglet.evaluate(() => document.fonts.ready);
    // Titres longs : réduit la taille jusqu’à tenir dans la hauteur donnée par data-ajuste.
    await onglet.evaluate(() => {
      for (const h of document.querySelectorAll<HTMLElement>("[data-ajuste]")) {
        const max = Number(h.dataset.ajuste);
        let taille = parseFloat(getComputedStyle(h).fontSize);
        while (h.offsetHeight > max && taille > 34) h.style.fontSize = `${(taille -= 2)}px`;
      }
    });
    // Rendu en 2x puis réduit : contours de texte et de l’ourson plus nets qu’un rendu direct.
    const png = await onglet.screenshot({ type: "png" });
    const dest = path.join(OUT, `${nom}.jpg`);
    await mkdir(path.dirname(dest), { recursive: true });
    await sharp(png)
      .resize(W, H)
      .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(dest);
    const v = createHash("sha256")
      .update(await readFile(dest))
      .digest("hex")
      .slice(0, 8);
    manifeste[nom] = { v, alt };
    console.log(`public/og/${nom}.jpg  ${Math.round((await stat(dest)).size / 1024)} Ko`);
  }
} finally {
  await navigateur.close();
  await rm(tmp, { recursive: true, force: true });
}

await writeFile(MANIFESTE, `${JSON.stringify(manifeste, null, 2)}\n`);
