import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { Gtm } from "@/components/consent/Gtm";
import { CONSENT_SCRIPT } from "@/components/consent/config";
import { JsonLd, PARTAGE, og, organisation, siteWeb } from "@/lib/seo";
import { SITE } from "@/lib/site";
import "@/styles/globals.css";
import s from "./layout.module.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo", display: "swap" });
const bryndan = localFont({
  src: "../assets/fonts/BryndanWrite.woff2",
  variable: "--font-bryndan",
  display: "swap",
  fallback: ["Comic Sans MS", "cursive"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Ourson, l’app des parents\u00a0: repas, sommeil, éveil",
    template: "%s · Ourson",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "L’équipe Ourson" }],
  alternates: { canonical: "/" },
  // Repli pour les pages sans partage propre (404…) : l’ourson de l’accueil.
  openGraph: og({
    url: "/",
    titre: "Ourson, l’app des parents\u00a0: repas, sommeil, éveil",
    description: SITE.description,
    image: PARTAGE.ourson,
  }),
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  // Pas de bannière iOS (apple-itunes-app) : elle doublerait le cartel de téléchargement.
};

export const viewport: Viewport = {
  themeColor: "#FFF8F1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${nunito.variable} ${baloo.variable} ${bryndan.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Consent Mode v2 : le consentement par défaut doit précéder GTM. */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_SCRIPT }} />
      </head>
      <body>
        <div className={s.page}>
          <div className={s.col}>
            <Header />
            {children}
          </div>
        </div>
        <ConsentBanner />
        <Gtm />
        <JsonLd data={[organisation(), siteWeb()]} />
      </body>
    </html>
  );
}
