import type { Metadata } from "next";
import { BlogListe } from "@/components/blog/BlogListe";
import { JsonLd, PARTAGE, filAriane, meta } from "@/lib/seo";

export const metadata: Metadata = meta({
  url: "/blog",
  titre: "Le blog d’Ourson\u00a0: repas, sommeil et éveil",
  description:
    "Conseils pratiques pour les parents de tout-petits\u00a0: alimentation, sommeil et activités d’éveil.",
  image: PARTAGE.ourson,
});

export default function BlogPage() {
  return (
    <>
      <BlogListe />
      <JsonLd
        data={filAriane([
          { name: "Accueil", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
    </>
  );
}
