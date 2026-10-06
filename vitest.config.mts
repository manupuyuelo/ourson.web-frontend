import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, type Plugin } from "vitest/config";

// Next transforme `import img from "x.png"` en { src, width, height } ; Vite renverrait une URL.
const imagesStatiques: Plugin = {
  name: "images-statiques-next",
  enforce: "pre",
  load(id) {
    if (/\.(png|jpe?g|svg|webp|avif)$/.test(id)) {
      return `export default { src: ${JSON.stringify(id)}, width: 100, height: 100, blurDataURL: "data:image/png;base64,iVBORw0KGgo=" };`;
    }
    return null;
  },
};

export default defineConfig({
  plugins: [imagesStatiques, tsconfigPaths(), react()],
  resolve: {
    // `server-only` lève une erreur hors bundler React Server : neutralisé en test.
    alias: { "server-only": new URL("./src/test/vide.ts", import.meta.url).pathname },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});
