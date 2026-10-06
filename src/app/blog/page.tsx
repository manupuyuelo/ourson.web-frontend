import type { Metadata } from "next";
import { BlogListe } from "@/components/blog/BlogListe";
import { JsonLd, filAriane, og } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Le blog",
  description:
    "Découvrez les derniers articles sur toutes les thématiques : nutrition, sommeil et éveil des 0-3 ans.",
  alternates: { canonical: "/blog" },
  openGraph: og("/blog"),
};

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
