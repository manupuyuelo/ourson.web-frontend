import { compile } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { describe, expect, it } from "vitest";
import remarkPoints from "./remark-points";

const rendu = async (md: string) =>
  String(
    await compile(md, {
      remarkPlugins: [remarkFrontmatter, remarkGfm, remarkPoints],
      outputFormat: "function-body",
    }),
  );

describe("remark-points", () => {
  it("regroupe les items numérotés au format « Titre. texte »", async () => {
    const js = await rendu(
      "Voici pourquoi :\n\n**1. Repères rassurants** : La régularité.\n\n**2. Rythme** : Le corps.\n",
    );
    expect(js).toContain("_jsxs(Points");
    expect(js).not.toContain("encadre");
    expect(js).toContain('"1. Repères rassurants."');
    expect(js).toContain('" La régularité."');
  });

  it("encadre la liste quand l’intro parle de conseils", async () => {
    const js = await rendu("Voici quelques conseils pratiques :\n\n**1. Horaires** : Fixez-les.\n");
    expect(js).toMatch(/encadre: true/);
  });

  it("laisse les paragraphes ordinaires", async () => {
    const js = await rendu("Un paragraphe **en gras** : rien à faire.\n");
    expect(js).not.toContain("Points");
  });
});
