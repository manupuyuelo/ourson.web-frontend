import { RUBRIQUES, getArticle, getArticles } from "@/lib/blog";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Article du blog Ourson";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ rubrique: a.rubrique, slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ rubrique: string; slug: string }> }) {
  const { rubrique, slug } = await params;
  const a = await getArticle(rubrique, slug);
  if (!a) return new Response(null, { status: 404 });
  const r = RUBRIQUES[a.rubrique];
  // JPEG fixe : satori ne lit pas l'AVIF/WebP que renverrait f_auto.
  const image = a.image.replace(/\/image\/upload\/(q_auto\/)?/, "/image/upload/w_920,c_limit,q_auto,f_jpg/");
  // Couverture absente → ourson de la rubrique, plutôt qu'un échec de génération.
  const ok = await fetch(image, { method: "HEAD" }).then(
    (res) => res.ok,
    () => false,
  );
  return ogImage({ titre: a.title, surTitre: r.label, ours: r.pilier, ...(ok ? { image } : {}) });
}
