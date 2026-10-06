import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Typographie française du site (hors articles MDX) : apostrophe courbe, espace fine insécable
// avant ? ! ; et insécable avant :. Les fichiers de code purs (scripts injectés) sont exclus.
const RACINE = path.join(import.meta.dirname, "..");
const EXCLUS = new Set(["content", "test", "types"]);
const SCRIPTS = new Set(["components/consent/config.ts", "components/consent/Gtm.tsx"]);

function fichiers(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    const rel = path.relative(RACINE, full);
    if (e.isDirectory()) return EXCLUS.has(rel) ? [] : fichiers(full);
    return /\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name) && !SCRIPTS.has(rel) ? [full] : [];
  });
}

/** Lignes de texte français (hors commentaires) qui enfreignent la règle. */
function fautes(source: string): string[] {
  return source.split("\n").filter((ligne) => {
    const t = ligne.trim();
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("{/*")) return false;
    if (t.includes("&apos;")) return true;
    // Apostrophe droite entre deux lettres : une élision (l'app, d'un…).
    if (/\p{L}'\p{L}/u.test(t)) return true;
    // Espace ordinaire avant ? ! ; : dans une chaîne (littéraux lus de gauche à droite)…
    for (const [chaine] of t.matchAll(/"(?:[^"\\]|\\.)*"/g)) if (/\p{L} [?!;:]/u.test(chaine)) return true;
    // Échappement \u dans un attribut JSX : il n'est pas interprété et s'affiche tel quel.
    if (/="[^"]*\\u[0-9a-f]{4}/.test(t)) return true;
    // … ou dans une ligne de texte JSX (sans code : pas d'opérateur ternaire possible).
    return /^[^=(){}?:"]*\p{L}(?: |&nbsp;)[?!;](?:\s|$)/u.test(t);
  });
}

describe("typographie française", () => {
  it("repère les fautes, pas le code", () => {
    expect(fautes('const t = "Bonjour l\'app";')).toHaveLength(1);
    expect(fautes('const t = "Vous êtes là ?";')).toHaveLength(1);
    expect(fautes("          Besoin d’un coup de patte ?")).toHaveLength(1);
    expect(fautes("          Besoin d’un coup de patte&#8239;?")).toHaveLength(0);
    expect(fautes('const v = ok ? "oui" : "non";')).toHaveLength(0);
    expect(fautes('<Carte text="Inès a noté\\u00a0: Léa" />')).toHaveLength(1);
  });

  it.each(fichiers(RACINE).map((f) => [path.relative(RACINE, f), f]))("%s", (_, f) => {
    expect(fautes(readFileSync(f, "utf8"))).toEqual([]);
  });
});
