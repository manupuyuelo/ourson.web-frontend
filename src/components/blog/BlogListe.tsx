import type { CSSProperties } from "react";
import Link from "next/link";
import { RUBRIQUES, RUBRIQUE_KEYS, getArticles, type Rubrique } from "@/lib/blog";
import { ArticleCard } from "./ArticleCard";
import { couleurs } from "./rubrique";
import g from "./Grille.module.css";
import s from "./BlogListe.module.css";

/** Liste du blog (/blog et /blog/[rubrique]) : hero, filtres en liens, article à la une puis la grille. */
export async function BlogListe({ rubrique }: { rubrique?: Rubrique }) {
  const articles = (await getArticles()).filter((a) => !rubrique || a.rubrique === rubrique);
  const [une, ...reste] = articles;
  const filtres: {
    href: "/blog" | `/blog/${Rubrique}`;
    label: string;
    actif: boolean;
    style: CSSProperties;
  }[] = [
    { href: "/blog", label: "Tous les articles", actif: !rubrique, style: { "--c": "var(--coral)" } },
    ...RUBRIQUE_KEYS.map((k) => ({
      href: `/blog/${k}` as const,
      label: RUBRIQUES[k].label,
      actif: k === rubrique,
      style: couleurs(k),
    })),
  ];

  return (
    <>
      <section className={s.hero}>
        <div className={s.eyebrow}>Le blog</div>
        <h1 className={s.h1}>Bienvenue sur le blog d’Ourson</h1>
        <p className={s.chapeau}>Découvrez les derniers articles sur toutes les thématiques.</p>
        <nav aria-label="Rubriques du blog" className={s.filtres}>
          {filtres.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={s.puce}
              style={f.style}
              aria-current={f.actif ? "page" : undefined}
              scroll={false}
            >
              {f.label}
            </Link>
          ))}
        </nav>
      </section>

      <div className={s.corps}>
        {une && <ArticleCard article={une} variante="une" eager />}
        <div className={g.grille}>
          {reste.map((a) => (
            <ArticleCard key={a.slug} article={a} variante="grille" />
          ))}
        </div>
      </div>
    </>
  );
}
