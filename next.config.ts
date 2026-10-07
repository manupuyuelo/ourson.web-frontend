import type { NextConfig } from "next";
import path from "node:path";
import createMDX from "@next/mdx";

// En développement, React utilise eval() pour ses outils de débogage (piles d'appels, etc.).
// Jamais en production : la directive n'est ajoutée qu'avec `next dev`.
const dev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  // 'unsafe-inline' : un nonce rendrait toutes les pages dynamiques. GTM est chargé dès l'arrivée
  // (Consent Mode v2 avancé), avec les domaines de mesure GA4 et de conversion Google Ads.
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://www.google.com https://www.google.fr https://googleads.g.doubleclick.net https://*.doubleclick.net",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.google.com https://www.google.fr https://googleads.g.doubleclick.net https://*.doubleclick.net https://www.googleadservices.com",
  "frame-src https://www.googletagmanager.com https://td.doubleclick.net",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Turbopack : regroupe le CSS par route au lieu d'un gros fichier partagé chargé partout.
    cssChunking: "graph",
    // CSS dans le <head> plutôt qu'en fichiers bloquants : le site est surtout visité une fois
    // (pas de cache à exploiter) et le CSS d'une page est léger. Gain mesuré sur FCP et LCP.
    inlineCss: true,
  },
  typedRoutes: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // srcset plus courts : colonne de 430 px max en mobile, 1140 px en desktop (écrans 2x et 3x compris).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      { source: "/demo", destination: "/", permanent: true },
      { source: "/blog/toutes-les-sections", destination: "/blog", permanent: true },
      { source: "/suppression-compte", destination: "/confidentialite#suppression", permanent: true },
      // Ancien slug accentué : Next ne sert pas un paramètre statique non ASCII, l'article passe en ASCII.
      {
        source: "/blog/sommeil/strategies-gerer-troubles-sommeil-pouss%C3%A9es-dentaires",
        destination: "/blog/sommeil/strategies-gerer-troubles-sommeil-poussees-dentaires",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    // Chemins et noms en chaîne : Turbopack ne peut pas recevoir de fonctions JS.
    remarkPlugins: ["remark-frontmatter", "remark-gfm", path.resolve("src/lib/remark-points.ts")],
  },
});

export default withMDX(nextConfig);
