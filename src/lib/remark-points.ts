// Plugin remark des articles : regroupe les paragraphes « **1. Titre** : texte » en une liste <Points>.
// Format du handoff : « **Titre.** texte ». La liste est encadrée (pastilles claires) quand le paragraphe
// qui l’introduit parle de conseils ou d’astuces, sinon pastilles pleines sans encadré.
// Chargé par @next/mdx sous forme de chemin (Turbopack n’accepte pas de fonction dans next.config).
import type { Paragraph, Root, RootContent, Strong } from "mdast";

const NUMERO = /^\d+\.\s*/;
const INTRO_ENCADRE = /conseil|astuce/i;

type Point = Paragraph & { children: [Strong, ...Paragraph["children"]] };

function estPoint(n: RootContent | undefined): n is Point {
  if (n?.type !== "paragraph") return false;
  const premier = n.children[0];
  const texte = premier?.type === "strong" ? premier.children[0] : undefined;
  return texte?.type === "text" && NUMERO.test(texte.value);
}

function texteDe(n: RootContent): string {
  if ("value" in n && typeof n.value === "string") return n.value;
  return "children" in n ? n.children.map((c) => texteDe(c as RootContent)).join("") : "";
}

/** « 1. Titre » + « : texte » → « 1. Titre. » + « texte » (le numéro est lu par le composant P). */
function normaliser(p: Point) {
  const lead = p.children[0].children.at(-1);
  if (lead?.type === "text") {
    lead.value = lead.value.replace(/\s*:\s*$/, "");
    if (!/[.!?…]$/.test(lead.value)) lead.value += ".";
  }
  const suite = p.children[1];
  if (suite?.type === "text") suite.value = suite.value.replace(/^\s*:\s*/, " ");
}

export default function remarkPoints() {
  return (tree: Root) => {
    const sortie: RootContent[] = [];
    const enfants = tree.children;
    for (let i = 0; i < enfants.length;) {
      const n = enfants[i];
      if (!estPoint(n)) {
        if (n) sortie.push(n);
        i++;
        continue;
      }
      const serie: Point[] = [];
      for (let p = enfants[i]; estPoint(p); p = enfants[++i]) {
        normaliser(p);
        serie.push(p);
      }
      const intro = sortie.at(-1);
      const encadre = intro?.type === "paragraph" && INTRO_ENCADRE.test(texteDe(intro));
      sortie.push({
        type: "mdxJsxFlowElement",
        name: "Points",
        attributes: encadre ? [{ type: "mdxJsxAttribute", name: "encadre", value: null }] : [],
        children: serie,
      });
    }
    tree.children = sortie;
  };
}
