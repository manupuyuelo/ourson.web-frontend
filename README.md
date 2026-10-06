# www.ourson.app

Site vitrine de l'app Ourson : Next.js 16 (App Router), React 19, TypeScript 7, CSS Modules et tokens du design system, tout statique (SSG).

## Démarrer

```bash
nvm use            # Node 24
yarn               # installe aussi le hook de pré-commit (oxfmt + oxlint)
yarn dev
```

| Script                                                                | Rôle                                                                       |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `yarn verify`                                                         | oxlint, puis `oxfmt --check`, puis types                                   |
| `yarn build`                                                          | build de production (toutes les routes doivent être statiques : `○` / `●`) |
| `yarn test:e2e`                                                       | Playwright sur le build de production (mobile + desktop)                   |
| `CAPTURES=1 HANDOFF_URL=http://localhost:3200 yarn test:e2e captures` | captures pleine page v2 / handoff dans `.captures/`                        |
| `yarn images [dossier-handoff]`                                       | régénère les images sources depuis le handoff                              |

## Organisation

- `src/app/(vente)/` : Accueil + Nutrition, Sommeil, Éveil. Le layout ajoute la barre store mobile, le QR desktop et le pied de page desktop.
- `src/app/blog/` : liste, rubriques (`nutrition`, `sommeil`, `activites`) et articles.
- `src/app/confidentialite/` : règles de confidentialité et feuille « Suppression de compte » (`#suppression`). `/suppression-compte` y redirige. L'app pointe sur cette URL (`LEGAL_URL`).
- `src/content/blog/*.mdx` : articles. Le frontmatter est validé par zod (`src/lib/blog.ts`). Pour publier un article, ajoutez un fichier.
- `src/components/ds/` : composants du design system Ourson, portés du handoff.
- `src/components/site/` et `src/components/layout/` : composants du site.
- `src/lib/site.ts` : URLs des stores, e-mail, ID GTM, lien CGV. **Les liens stores et la CGV sont encore à `#`.**
- `src/styles/tokens/` : tokens CSS du design system.

## Choix techniques

- **Lint et format :** oxlint (plugins `nextjs`, `react`, `jsx-a11y`, `import`, avec règles type-aware via `oxlint-tsgolint`) et oxfmt. Next 16 ne lance plus de lint au build.
- **TypeScript 7 :** `next build` utilise la CLI `tsc`. Le plugin IDE de Next ne se charge pas tant que TS 7.1 n'a pas publié son API de plugins.
- **Appareil :** il est détecté côté client (`useAppareil`) pour garder les pages statiques. Pendant le rendu serveur, un emplacement à taille fixe évite tout décalage de mise en page.
- **QR de téléchargement :** il est généré au build en SVG (`/qr.svg`).
- **GTM :** il n'est chargé qu'après acceptation du bandeau (Consent Mode « basic »). Le choix est conservé 6 mois.
- **Images :** `next/image` sert de l'AVIF ou du WebP. Les couvertures du blog sont transformées directement par Cloudinary (`src/lib/cloudinary-loader.ts`).
