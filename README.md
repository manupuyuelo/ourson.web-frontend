# www.ourson.app

Site vitrine de l'app Ourson : Next.js 16 (App Router), React 19, TypeScript 7, CSS Modules et tokens du design system, tout statique (SSG).

## Démarrer

```bash
nvm use            # Node 24
yarn               # installe aussi les hooks git (core.hooksPath = .githooks)
yarn dev           # http://localhost:3000
```

| Script                                                                | Rôle                                                                                                     |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `yarn dev`                                                            | serveur de développement (Turbopack)                                                                     |
| `yarn verify`                                                         | types, oxlint (`--deny-warnings`), `oxfmt --check`, tests unitaires : la porte du pre-push et de la CI   |
| `yarn test` / `yarn test:watch`                                       | tests unitaires Vitest, dont la validation de chaque article MDX (frontmatter, slug, image, compilation) |
| `yarn build`                                                          | build de production (toutes les routes doivent être statiques : `○` / `●`)                               |
| `yarn test:e2e`                                                       | Playwright sur le build de production (mobile + desktop)                                                 |
| `npx @lhci/cli@0.15.1 autorun`                                        | budget Lighthouse local (rapports dans `.lighthouseci/`)                                                 |
| `CAPTURES=1 HANDOFF_URL=http://localhost:3200 yarn test:e2e captures` | captures pleine page v2 / handoff dans `.captures/` (puis `node scripts/compare-captures.ts`)            |
| `yarn images [dossier-handoff]`                                       | régénère les images sources depuis le handoff                                                            |

## Portes de qualité

Comme dans `ourson-app` :

- **pre-commit** (`.githooks/pre-commit`) : `lint-staged` lance oxlint et oxfmt sur les fichiers indexés.
- **pre-push** (`.githooks/pre-push`) : `yarn verify`. Pour passer outre : `git push --no-verify`.
- **CI** (`.github/workflows/verify.yml`), sur chaque PR et sur `main`. Les étapes sont séparées, pour que l'onglet Checks nomme celle qui échoue :
  - installation figée ;
  - types, lint, format ;
  - tests unitaires ;
  - build (échoue si une route devient dynamique) ;
  - Playwright ;
  - budget Lighthouse (`lighthouserc.json`). Seuils bloquants : SEO 100, accessibilité et bonnes pratiques ≥ 95, CLS ≤ 0,05, TBT ≤ 300 ms. Avertissements : performance < 90, LCP > 3 s.

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
- **Images :** `next/image` sert de l'AVIF ou du WebP, avec des srcset resserrés (`deviceSizes`) et un flou de chargement (`placeholder="blur"`) sur les photos. L'image LCP de chaque page est en `loading="eager"` + `fetchPriority="high"`. Les couvertures du blog sont transformées directement par Cloudinary (`f_auto,q_auto`, voir `src/lib/cloudinary-loader.ts`).
- **CSS :** `experimental.cssChunking: "graph"`, pour que chaque route ne charge que son CSS.
- **Sans clignotement :**
  - le bandeau cookies est dans le HTML statique, et un script du `<head>` le masque avant le premier rendu si un choix existe ;
  - avant la détection de l'appareil, la place est réservée selon le type de pointeur ;
  - la barre mobile entre en animation.
- **Polices :** Nunito et Baloo 2 en variable via `next/font`. Bryndan Write est réduite aux minuscules du logo et du slogan (3,6 Ko). Si un texte en Bryndan utilise d'autres caractères, il faut régénérer le sous-ensemble.
- **Slugs :** un slug doit rester en ASCII (le test le vérifie). Next ne sert pas un paramètre statique accentué ; l'ancienne URL accentuée redirige.
