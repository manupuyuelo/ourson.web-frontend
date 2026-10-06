import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListe } from "@/components/blog/BlogListe";
import { TEXTES } from "@/components/blog/rubrique";
import { RUBRIQUES, RUBRIQUE_KEYS, isRubrique } from "@/lib/blog";
import { JsonLd, filAriane, og } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return RUBRIQUE_KEYS.map((rubrique) => ({ rubrique }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[rubrique]">): Promise<Metadata> {
  const { rubrique } = await params;
  if (!isRubrique(rubrique)) return {};
  const { label } = RUBRIQUES[rubrique];
  return {
    title: `${label} · Le blog`,
    description: `Les articles du blog d'Ourson sur ${TEXTES[rubrique].sujet} des 0-3 ans.`,
    alternates: { canonical: `/blog/${rubrique}` },
    openGraph: og(`/blog/${rubrique}`),
  };
}

export default async function RubriquePage({ params }: PageProps<"/blog/[rubrique]">) {
  const { rubrique } = await params;
  if (!isRubrique(rubrique)) notFound();
  return (
    <>
      <BlogListe rubrique={rubrique} />
      <JsonLd
        data={filAriane([
          { name: "Accueil", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: RUBRIQUES[rubrique].label, path: `/blog/${rubrique}` },
        ])}
      />
    </>
  );
}
