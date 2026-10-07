import { expect, test } from "@playwright/test";

// Partage et référencement de chaque page publiée, lus dans le HTML du build : toutes les URLs
// du sitemap ont un titre, une description et une image de partage à elles, servie et légère.
// Une page ajoutée sans image (ou oubliée du sitemap) fait échouer ce test : voir AGENTS.md.

const SITE = "https://www.ourson.app";

/** Valeur d’une balise <meta> (name ou property), entités HTML courantes décodées. */
function meta(html: string, cle: string): string | undefined {
  const balise = html.match(new RegExp(`<meta (?:name|property)="${cle}" content="([^"]*)"`))?.[1];
  return balise
    ?.replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

test.describe("partage", () => {
  test("chaque page du sitemap a son titre, sa description et son image de partage", async ({ request }) => {
    // Pas de rendu navigateur ici : le HTML est le même sur mobile, un seul projet suffit.
    test.skip(test.info().project.name !== "desktop", "HTML identique sur mobile");
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const chemins = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      ([, url = ""]) => url.replace(SITE, "") || "/",
    );
    expect(chemins.length).toBeGreaterThan(10);

    const vus = {
      titre: new Map<string, string>(),
      description: new Map<string, string>(),
      image: new Map<string, string>(),
    };
    const unique = (type: keyof typeof vus, valeur: string, chemin: string) => {
      expect
        .soft(vus[type].get(valeur), `${chemin} : même ${type} que ${vus[type].get(valeur)}`)
        .toBeUndefined();
      vus[type].set(valeur, chemin);
    };

    for (const chemin of chemins) {
      const res = await request.get(chemin);
      expect(res.status(), chemin).toBe(200);
      const html = await res.text();

      const titre = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      const description = meta(html, "description") ?? "";
      expect.soft(titre.length, `${chemin} : <title>`).toBeGreaterThan(10);
      expect.soft(description.length, `${chemin} : meta description`).toBeGreaterThanOrEqual(50);
      expect.soft(meta(html, "og:title"), `${chemin} : og:title`).toBeTruthy();
      expect.soft(meta(html, "og:description"), `${chemin} : og:description`).toBeTruthy();
      expect.soft(meta(html, "og:url"), `${chemin} : og:url`).toBe(`${SITE}${chemin === "/" ? "" : chemin}`);
      expect.soft(meta(html, "twitter:card"), `${chemin} : twitter:card`).toBe("summary_large_image");

      // L’image : générée par `yarn og`, versionnée, décrite, et propre à la page.
      const image = meta(html, "og:image") ?? "";
      expect
        .soft(image, `${chemin} : og:image (lancer yarn og ?)`)
        .toMatch(/^https:\/\/www\.ourson\.app\/og\/.+\.jpg\?v=[0-9a-f]{8}$/);
      expect.soft(meta(html, "og:image:width"), `${chemin} : og:image:width`).toBe("1200");
      expect.soft(meta(html, "og:image:height"), `${chemin} : og:image:height`).toBe("630");
      expect.soft(meta(html, "og:image:alt")?.length ?? 0, `${chemin} : og:image:alt`).toBeGreaterThan(10);

      unique("titre", titre, chemin);
      unique("description", description, chemin);
      unique("image", image, chemin);

      const fichier = await request.get(image.replace(SITE, ""));
      expect.soft(fichier.status(), `${chemin} : ${image} servie`).toBe(200);
      expect.soft(fichier.headers()["content-type"], `${chemin} : type de l’image`).toBe("image/jpeg");
      expect
        .soft((await fichier.body()).length, `${chemin} : image < 300 Ko (WhatsApp)`)
        .toBeLessThan(300 * 1024);
    }
  });
});
