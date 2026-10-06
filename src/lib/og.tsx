import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const asset = (p: string) => readFile(path.join(process.cwd(), "src", "assets", p));

type Options = {
  titre: string;
  surTitre?: string;
  /** Couleur de fond (hex), par défaut le dégradé de l'accueil. */
  fond?: string;
  ours?: "accueil" | "repas" | "sommeil" | "eveil";
  /** Image distante (couverture d'article) affichée à droite à la place de l'ourson. */
  image?: string;
};

/** Image de partage commune : logo, sur-titre, titre et ourson (ou couverture). */
export async function ogImage({ titre, surTitre, fond, ours = "accueil", image }: Options) {
  const [baloo, bryndan, png] = await Promise.all([
    asset("fonts/Baloo2-ExtraBold.ttf"),
    asset("fonts/BryndanWrite-og.ttf"),
    image ? null : asset(`ours/ourson-${ours}.png`),
  ]);
  const visuel = image ?? `data:image/png;base64,${png?.toString("base64")}`;
  const clair = !fond;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "56px 64px",
        gap: 48,
        background: fond ?? "linear-gradient(180deg, #FFD8C4 0%, #FFF1E6 55%, #FFF8F1 100%)",
        color: clair ? "#2A201C" : "#fff",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 18 }}>
        <div
          style={{ fontFamily: "Bryndan", fontSize: 72, lineHeight: 0.8, color: clair ? "#FF5436" : "#fff" }}
        >
          ourson
        </div>
        {surTitre && (
          <div
            style={{
              fontFamily: "Baloo",
              fontSize: 26,
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            {surTitre}
          </div>
        )}
        <div style={{ fontFamily: "Baloo", fontSize: titre.length > 70 ? 52 : 64, lineHeight: 1 }}>
          {titre}
        </div>
      </div>
      {/* oxlint-disable-next-line nextjs/no-img-element -- rendu par satori, pas par le navigateur */}
      <img
        src={visuel}
        alt=""
        width={image ? 460 : 340}
        height={image ? 345 : 440}
        style={{ objectFit: image ? "cover" : "contain", borderRadius: image ? 28 : 0 }}
      />
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Baloo", data: baloo, weight: 800, style: "normal" },
        { name: "Bryndan", data: bryndan, weight: 400, style: "normal" },
      ],
    },
  );
}
