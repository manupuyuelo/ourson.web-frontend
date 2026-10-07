import type { Metadata } from "next";
import type { MDXContent } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { TEXTES, couleurs } from "@/components/blog/rubrique";
import g from "@/components/blog/Grille.module.css";
import prose from "@/components/blog/Prose.module.css";
import { RUBRIQUES, formatDate, getArticle, getArticles } from "@/lib/blog";
import { couverture } from "@/lib/couvertures";
import { OURS } from "@/lib/ours";
import { JsonLd, billet, filAriane, og, partageArticle } from "@/lib/seo";
import s from "./page.module.css";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ rubrique: a.rubrique, slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[rubrique]/[slug]">): Promise<Metadata> {
  const { rubrique, slug } = await params;
  const a = await getArticle(rubrique, slug);
  if (!a) return {};
  const titre = `${a.title} · Ourson`;
  return {
    title: { absolute: titre },
    description: a.description,
    alternates: { canonical: a.href },
    openGraph: og(
      {
        url: a.href,
        titre,
        description: a.description,
        image: partageArticle(a),
      },
      {
        type: "article",
        publishedTime: a.date.toISOString(),
        authors: [a.author],
        section: RUBRIQUES[a.rubrique].label,
      },
    ),
  };
}

export default async function ArticlePage({ params }: PageProps<"/blog/[rubrique]/[slug]">) {
  const { rubrique, slug } = await params;
  const a = await getArticle(rubrique, slug);
  if (!a) notFound();
  const { default: Contenu }: { default: MDXContent } = await import(`@/content/blog/${a.slug}.mdx`);
  const r = RUBRIQUES[a.rubrique];
  const textes = TEXTES[a.rubrique];
  const cover = await couverture(a.slug);
  const aLire = (await getArticles())
    .filter((x) => x.rubrique === a.rubrique && x.slug !== a.slug)
    .slice(0, 3);
  const date = a.date.toISOString();

  return (
    <div className={s.page} style={couleurs(a.rubrique)}>
      <section className={s.hero}>
        <nav aria-label="Fil d’Ariane">
          <ol className={s.ariane}>
            <li>
              <Link href="/blog" className={s.arianeBlog}>
                Blog
              </Link>
            </li>
            <li aria-hidden="true" className={s.sep}>
              ›
            </li>
            <li>
              <Link href={`/blog/${a.rubrique}`} className={s.arianeRub}>
                {r.label}
              </Link>
            </li>
          </ol>
        </nav>
        <h1 className={s.h1}>{a.title}</h1>
        <p className={s.chapeau}>{a.summary}</p>
        <div className={s.auteur}>
          <span>{a.author}</span>
          <span className={s.point} aria-hidden="true" />
          <time dateTime={date}>{formatDate(a.date)}</time>
        </div>
      </section>

      <div className={s.cover}>
        <Image
          src={cover}
          alt={a.title}
          sizes="(min-width: 900px) 1028px, (min-width: 600px) 560px, (min-width: 430px) 390px, calc(100vw - 40px)"
          placeholder="blur"
          className={s.coverImg}
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <article className={s.article}>
        <div className={prose.prose}>
          <Contenu />
        </div>

        <Link href={r.href} className={s.pilier}>
          <Image src={OURS[r.pilier]} alt="" sizes="64px" className={s.pilierOurs} />
          <span className={s.pilierTxt}>
            <span className={s.pilierTitre}>{textes.pilierTitre}</span>
            <span className={s.pilierLien}>{textes.pilierLien}</span>
          </span>
        </Link>
      </article>

      {aLire.length > 0 && (
        <section className={s.rel} aria-labelledby="a-lire-aussi">
          <div className={s.relHead}>
            <h2 id="a-lire-aussi" className={s.relH2}>
              À lire aussi
            </h2>
            <Link href={`/blog/${a.rubrique}`} className={s.relTout}>
              {textes.toute}
            </Link>
          </div>
          <div className={`${g.grille} ${g.uneColonne}`}>
            {aLire.map((x) => (
              <ArticleCard key={x.slug} article={x} variante="lie" />
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={[
          billet({
            title: a.title,
            description: a.description,
            path: a.href,
            image: cover.src,
            date,
            author: a.author,
          }),
          filAriane([
            { name: "Accueil", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: r.label, path: `/blog/${a.rubrique}` },
            { name: a.title, path: a.href },
          ]),
        ]}
      />
    </div>
  );
}
