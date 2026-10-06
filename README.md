# www.ourson.app

Site vitrine de l'app Ourson : Next.js 16 (App Router), React 19, TypeScript 7, CSS Modules et tokens du design system, tout statique (SSG).

## Démarrer

```bash
nvm use            # Node 24
yarn               # installe aussi les hooks git (core.hooksPath = .githooks)
yarn dev           # http://localhost:3000
```

| Script                                                                         | Rôle                                                                                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `yarn dev`                                                                     | serveur de développement (Turbopack)                                                                                           |
| `yarn verify`                                                                  | types, oxlint (`--deny-warnings`), `oxfmt --check`, tests unitaires : la porte du pre-push et de la CI                         |
| `yarn test` / `yarn test:watch`                                                | tests unitaires Vitest, dont la validation de chaque article MDX (frontmatter, slug, image, compilation)                       |
| `yarn build`                                                                   | build de production (toutes les routes doivent être statiques : `○` / `●`)                                                     |
| `yarn test:e2e`                                                                | Playwright sur le build de production (mobile + desktop)                                                                       |
| `npx @lhci/cli@0.15.1 autorun`                                                 | budget Lighthouse local (rapports dans `.lighthouseci/`)                                                                       |
| `CAPTURES=1 HANDOFF_URL=http://localhost:3200 yarn test:e2e captures`          | captures pleine page v2 / handoff dans `.captures/` (puis `node scripts/compare-captures.ts`)                                  |
| `VISUEL=1 yarn test:e2e visuel [--update-snapshots]`                           | non-régression au pixel près sur iPhone 15, 16 Pro Max, 1280 et 1440 px (références locales, à générer avant une modification) |
| `CAPTURES=1 yarn test:e2e ecrans` puis `node scripts/planche-ecrans.ts <page>` | audit sur 24 formats (téléphones, foldables, tablettes, paysage, ordinateurs) et planche de relecture                          |
| `yarn images [dossier-handoff]`                                                | régénère les images sources depuis le handoff (seulement celles importées dans `src/`)                                         |
| `yarn og [dossier-handoff]`                                                    | régénère les images de partage 1200 × 630 dans `public/og/`                                                                    |

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

- `src/app/(vente)/` : Accueil + Nutrition, Sommeil, Éveil. Le layout ajoute le cartel de téléchargement mobile, le cartel QR desktop et le pied de page desktop. Les cartels s'effacent quand un autre bloc de téléchargement est à l'écran.
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
- **Handoff de référence :** `~/Downloads/design_handoff_site_ourson` (prototypes `.dc.html`), mobile d'abord puis desktop pleine largeur. Trois paliers, tous pilotés par la gouttière `--g` : téléphone (< 600 px, contenu de 390 px comme le handoff), tablette (600–899 px, colonne de 560 px, sections à la hauteur de leur contenu) et desktop (≥ 900 px). Sur un écran tactile, le cartel montre le badge du store à toutes les largeurs ; le QR est réservé aux ordinateurs.
- **QR de téléchargement :** il est généré au build en SVG (`/qr.svg`) et pointe vers `/app`, qui redirige vers le store de l'appareil (vers l'accueil tant que les liens des stores sont à `#`).
- **Cookies et GTM :** Consent Mode v2 avancé. Le script du `<head>` refuse tout par défaut, puis GTM est chargé. Le bandeau « Miam, des cookies ! » propose deux finalités : mesure d'audience (`analytics_storage`) et publicité, c'est-à-dire la mesure des campagnes (`ad_*`). Le choix est stocké dans `localStorage['ourson-cookies']` pendant 6 mois (incrémenter `CONSENT_VERSION` pour le redemander). Tout lien `#cookies` rouvre le bandeau. Chaque clic vers un store pousse `ourson_store` (`store` : `app_store` | `google_play`, `emplacement` : `hero` | `cartel` | `fin` | `menu`), à utiliser comme conversion dans GTM.
- **Partage :** pas de gabarit composé, une vraie image 1200 × 630 par page (`public/og/`, couverture Cloudinary recadrée pour les articles), déclarée par `meta()` et `og()` dans `src/lib/seo.tsx`.
- **Typographie :** apostrophe courbe, espace fine insécable avant `? ! ;`, insécable avant `:` (vérifié par `src/lib/typo.test.ts`, hors articles MDX).
- **Images :** `next/image` sert de l'AVIF ou du WebP, avec des srcset resserrés (`deviceSizes`) et un flou de chargement (`placeholder="blur"`) sur les photos. L'image LCP de chaque page est en `loading="eager"` + `fetchPriority="high"`. Les couvertures du blog sont transformées directement par Cloudinary (`f_auto,q_auto`, voir `src/lib/cloudinary-loader.ts`).
- **CSS :** `experimental.cssChunking: "graph"`, pour que chaque route ne charge que son CSS.
- **Sans clignotement :**
  - le bandeau cookies est dans le HTML statique, et un script du `<head>` le masque avant le premier rendu si un choix existe ;
  - avant la détection de l'appareil, la place est réservée selon le type de pointeur ;
  - la barre mobile entre en animation.
- **Polices :** Nunito et Baloo 2 en variable via `next/font`. Bryndan Write est réduite aux minuscules du logo et du slogan (3,6 Ko). Si un texte en Bryndan utilise d'autres caractères, il faut régénérer le sous-ensemble.
- **Slugs :** un slug doit rester en ASCII (le test le vérifie). Next ne sert pas un paramètre statique accentué ; l'ancienne URL accentuée redirige.
