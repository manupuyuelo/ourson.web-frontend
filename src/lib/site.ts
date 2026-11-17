export const SITE = {
  name: "Ourson",
  url: "https://www.ourson.app",
  description:
    "Un plat pour toute la famille, la sieste au bon moment, un jeu par jour. L’app des parents d’enfants de 0 à 3 ans, à partager avec tout le foyer.",
  email: "contact@ourson.app",
  locale: "fr_FR",
  gtmId: "GTM-M4VH94M",
  // Liens définitifs (les mêmes que dans l’app, `ourson-app/src/lib/links.ts`).
  appStoreUrl: "https://apps.apple.com/app/id6822294870",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.addedsugarsas.ourson",
} as const;

// TODO(stores) : passer à `true` quand les fiches sont publiques. D’ici là, badges sans lien et mention « Bientôt ».
export const STORES_OUVERTS = false;

/**
 * Pages relais, ouvertes depuis un email de l’app : hors sitemap, `noindex`, interdites aux robots
 * (`robots.ts`, vérifié par `partage.test.ts`). Le bandeau cookies ne s’y ouvre pas d’office : le
 * visiteur y passe pour rejoindre l’app, rien n’y est mesuré avec cookies faute de choix, et le
 * bandeau reste proposé sur les autres pages.
 */
export const PAGES_RELAIS: readonly string[] = ["/invitation"];

export type Pilier = "repas" | "sommeil" | "eveil";

export const PILIERS = {
  repas: { label: "Nutrition", href: "/nutrition", lien: "La nutrition →" },
  sommeil: { label: "Sommeil", href: "/sommeil", lien: "Le sommeil →" },
  eveil: { label: "Éveil", href: "/eveil", lien: "L’éveil →" },
} as const satisfies Record<Pilier, { label: string; href: string; lien: string }>;

/** Une fiche de store est publiée quand les stores sont ouverts et son lien renseigné (sinon « Bientôt », sans lien). */
export const storePublie = (url: string) => STORES_OUVERTS && url.startsWith("https://");
