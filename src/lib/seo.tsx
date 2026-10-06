import type {
  BlogPosting,
  BreadcrumbList,
  MobileApplication,
  Organization,
  Thing,
  WebSite,
  WithContext,
} from "schema-dts";
import type { Metadata } from "next";
import { SITE, storePublie } from "./site";

/** Image de partage : une vraie photo ou illustration, 1200 × 630, jamais de gabarit composé. */
export type ImagePartage = { url: string; alt: string };

export const PARTAGE = {
  ourson: { url: "/og/ourson.jpg", alt: "L’ourson d’Ourson fait coucou de la patte." },
  nutrition: {
    url: "/og/nutrition.jpg",
    alt: "Poêlée de betterave, boulgour et poulet au cumin, un plat pour toute la famille.",
  },
  sommeil: { url: "/og/sommeil.jpg", alt: "Illustration de l’histoire du soir « Bonne nuit, la lune »." },
  eveil: { url: "/og/eveil.jpg", alt: "Illustration du jeu d’éveil « Deux paniers, deux copains »." },
} as const satisfies Record<string, ImagePartage>;

/** Couverture Cloudinary recadrée en 1200 × 630 (JPEG, lisible par toutes les messageries). */
export const couverturePartage = (src: string) =>
  src.replace(/\/image\/upload\/(?:q_auto\/)?/, "/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/");

/**
 * Open Graph complet d’une page. Next fusionne les métadonnées en surface : un `openGraph`
 * déclaré par une page remplace entièrement celui du layout, d’où ce helper.
 * Le titre porte déjà la marque (« … · Ourson »), og:site_name la répète pour les messageries.
 */
export const og = (
  {
    url,
    titre,
    description,
    image,
  }: { url: string; titre: string; description: string; image: ImagePartage },
  extra: NonNullable<Metadata["openGraph"]> = {},
): Metadata["openGraph"] => ({
  type: "website",
  locale: SITE.locale,
  siteName: SITE.name,
  url,
  title: titre,
  description,
  images: [{ url: image.url, width: 1200, height: 630, alt: image.alt, type: "image/jpeg" }],
  ...extra,
});

/** Titre, description, URL canonique et partage d’une page, en une fois. */
export function meta(p: {
  url: string;
  /** Titre complet, marque comprise (ne passe pas par le gabarit « %s · Ourson »). */
  titre: string;
  description: string;
  image: ImagePartage;
}): Metadata {
  return {
    title: { absolute: p.titre },
    description: p.description,
    alternates: { canonical: p.url },
    openGraph: og(p),
  };
}

const abs = (path: string) => new URL(path, SITE.url).toString();

export function JsonLd({ data }: { data: WithContext<Thing> | WithContext<Thing>[] }) {
  return (
    <script
      type="application/ld+json"
      // Échappe « < » pour qu’un texte ne puisse pas fermer la balise script.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organisation = (): WithContext<Organization> => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organisation`,
  name: SITE.name,
  url: SITE.url,
  logo: abs("/icon-512.png"),
  email: SITE.email,
});

export const siteWeb = (): WithContext<WebSite> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#site`,
  name: SITE.name,
  url: SITE.url,
  inLanguage: "fr-FR",
  publisher: { "@id": `${SITE.url}/#organisation` },
});

export const application = (): WithContext<MobileApplication> => ({
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: SITE.name,
  description: SITE.description,
  operatingSystem: "iOS, Android",
  applicationCategory: "LifestyleApplication",
  inLanguage: "fr-FR",
  publisher: { "@id": `${SITE.url}/#organisation` },
  ...(storePublie(SITE.appStoreUrl) || storePublie(SITE.playStoreUrl)
    ? { downloadUrl: [SITE.appStoreUrl, SITE.playStoreUrl].filter(storePublie) }
    : {}),
});

export const filAriane = (items: { name: string; path: string }[]): WithContext<BreadcrumbList> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

export const billet = (a: {
  title: string;
  description: string;
  path: string;
  image: string;
  date: string;
  author: string;
}): WithContext<BlogPosting> => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: a.title,
  description: a.description,
  image: a.image,
  datePublished: a.date,
  dateModified: a.date,
  inLanguage: "fr-FR",
  mainEntityOfPage: abs(a.path),
  author: { "@type": "Organization", name: a.author, url: SITE.url },
  publisher: { "@id": `${SITE.url}/#organisation` },
});
