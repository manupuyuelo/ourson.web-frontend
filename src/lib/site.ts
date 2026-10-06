export const SITE = {
  name: "Ourson",
  url: "https://www.ourson.app",
  description:
    "Un plat pour toute la famille, la sieste au bon moment, un jeu par jour. L’app des parents d’enfants de 0 à 3 ans, à partager avec tout le foyer.",
  email: "contact@ourson.app",
  locale: "fr_FR",
  gtmId: "GTM-M4VH94M",
  // TODO(stores) : à renseigner dès que les fiches sont publiques.
  appStoreUrl: "#",
  playStoreUrl: "#",
  // TODO(cgv) : page à rédiger sur le modèle de /confidentialite.
  cgvUrl: "#",
} as const;

export type Pilier = "repas" | "sommeil" | "eveil";

export const PILIERS = {
  repas: { label: "Nutrition", href: "/nutrition", lien: "La nutrition →" },
  sommeil: { label: "Sommeil", href: "/sommeil", lien: "Le sommeil →" },
  eveil: { label: "Éveil", href: "/eveil", lien: "L’éveil →" },
} as const satisfies Record<Pilier, { label: string; href: string; lien: string }>;
