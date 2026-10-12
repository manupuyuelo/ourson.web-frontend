import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListe } from "@/components/blog/BlogListe";
import { TEXTES } from "@/components/blog/rubrique";
import { RUBRIQUES, RUBRIQUE_KEYS, isRubrique } from "@/lib/blog";
import { JsonLd, partage, filAriane, meta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return RUBRIQUE_KEYS.map((rubrique) => ({ rubrique }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[rubrique]">): Promise<Metadata> {
  const { rubrique } = await params;
  if (!isRubrique(rubrique)) return {};
  const { titre, sujet } = TEXTES[rubrique];
  return meta({
    url: `/blog/${rubrique}`,
    titre: `${titre} · Le blog d’Ourson`,
    description: `Conseils pratiques et repères sur ${sujet} des 0-3\u00a0ans\u00a0: des articles courts, sourcés, pour les parents et tout le foyer.`,
    image: partage(`blog-${rubrique}`),
  });
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
