import type {
  BlogPosting,
  BreadcrumbList,
  MobileApplication,
  Organization,
  Thing,
  WebSite,
  WithContext,
} from "schema-dts";
import { SITE } from "./site";

const abs = (path: string) => new URL(path, SITE.url).toString();

export function JsonLd({ data }: { data: WithContext<Thing> | WithContext<Thing>[] }) {
  return (
    <script
      type="application/ld+json"
      // Échappe « < » pour qu'un texte ne puisse pas fermer la balise script.
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
  ...(SITE.appStoreUrl !== "#" || SITE.playStoreUrl !== "#"
    ? { downloadUrl: [SITE.appStoreUrl, SITE.playStoreUrl].filter((u) => u !== "#") }
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
