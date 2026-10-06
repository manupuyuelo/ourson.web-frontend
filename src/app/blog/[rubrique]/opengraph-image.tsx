import { RUBRIQUES, RUBRIQUE_KEYS, isRubrique } from "@/lib/blog";
import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Le blog d'Ourson";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;

const FONDS = { repas: "#9E6512", sommeil: "#5868D6", eveil: "#3E9A59" } as const;

export function generateStaticParams() {
  return RUBRIQUE_KEYS.map((rubrique) => ({ rubrique }));
}

export default async function Image({ params }: { params: Promise<{ rubrique: string }> }) {
  const { rubrique } = await params;
  const r = isRubrique(rubrique) ? RUBRIQUES[rubrique] : RUBRIQUES.nutrition;
  return ogImage({
    titre: `Les articles ${r.label}`,
    surTitre: "Le blog",
    fond: FONDS[r.pilier],
    ours: r.pilier,
  });
}
