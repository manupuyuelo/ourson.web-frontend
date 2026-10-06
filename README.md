# www.ourson.app

Site vitrine de l'app **Ourson** (parents d'enfants de 0 à 3 ans : repas, sommeil, éveil) : pages de vente, blog de conseils, sources, pages légales. Next.js 16 (App Router), React 19, TypeScript 7, CSS Modules et tokens du design system, MDX. Tout est statique, sauf la redirection `/app`. Édité par AddedSugar, hébergé sur Vercel.

Les consignes détaillées (organisation du code, règles, points ouverts) sont dans [`AGENTS.md`](AGENTS.md), lu par les agents comme par les humains.

## Démarrer

```bash
nvm use            # Node 24
yarn               # installe aussi les hooks git (core.hooksPath = .githooks)
yarn dev           # http://localhost:3000
```

| Script                                                                                                              | Rôle                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `yarn dev`                                                                                                          | serveur de développement (Turbopack)                                                                                             |
| `yarn verify`                                                                                                       | types, oxlint (`--deny-warnings`), `oxfmt --check`, tests unitaires : la porte du pre-push et de la CI                           |
| `yarn test` / `yarn test:watch`                                                                                     | tests unitaires Vitest (dont la validation de chaque article MDX et la typographie française)                                    |
| `yarn build`                                                                                                        | build de production : chaque route doit rester statique (`○` / `●`), sauf `ƒ /app`                                               |
| `yarn test:e2e`                                                                                                     | Playwright sur le build de production, en mobile et en desktop                                                                   |
| `VISUEL=1 yarn test:e2e visuel [--update-snapshots]`                                                                | non-régression au pixel près (iPhone 15, 16 Pro Max, 1280 et 1440 px). Références locales, à générer avant une modification      |
| `ECRANS=1 yarn test:e2e ecrans` (avec `CAPTURES=1`, puis `node scripts/planche-ecrans.ts <page>` pour les captures) | audit sur 24 formats (téléphones, foldables, tablettes, paysage, ordinateurs) et planche de relecture dans `.captures/planches/` |
| `CAPTURES=1 HANDOFF_URL=http://localhost:3200 yarn test:e2e captures`                                               | captures v2 / handoff côte à côte (puis `node scripts/compare-captures.ts`)                                                      |
| `yarn lighthouse`                                                                                                   | budget Lighthouse local (rapports dans `.lighthouseci/`)                                                                         |
| `yarn images [dossier-handoff]`                                                                                     | régénère les images sources depuis le handoff (seulement celles importées dans `src/`)                                           |
| `yarn og [dossier-handoff]`                                                                                         | régénère les images de partage 1200 × 630 dans `public/og/`                                                                      |

## Portes de qualité

- **pre-commit** (`.githooks/pre-commit`) : `lint-staged` lance oxlint et oxfmt sur les fichiers indexés.
- **pre-push** (`.githooks/pre-push`) : `yarn verify`. Pour passer outre : `git push --no-verify`.
- **CI** (`.github/workflows/verify.yml`), sur chaque PR et sur `main`, en étapes séparées :
  - installation figée ;
  - types, lint, format ;
  - tests unitaires ;
  - build (échoue si une route devient dynamique) ;
  - Playwright (rendu des pages, bandeau, cartels, redirections ; l’audit multi-formats se lance à la main, `ECRANS=1`).
- **Lighthouse** (`yarn lighthouse`, 9 pages, `lighthouserc.json`) : en local, avant une mise en production, et non en CI (les machines partagées de GitHub faussent les mesures de performance). Seuils : SEO 100, accessibilité et bonnes pratiques ≥ 95, CLS ≤ 0,05, TBT ≤ 300 ms ; avertissements : performance < 90, LCP > 3 s.

## Pages

| URL                                                    | Contenu                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `/`                                                    | Accueil : la journée heure par heure (7 h → 19 h 45), le foyer                              |
| `/nutrition`, `/sommeil`, `/eveil`                     | un pilier par page                                                                          |
| `/blog`, `/blog/<rubrique>`, `/blog/<rubrique>/<slug>` | 59 articles MDX ; URLs de l'ancien site conservées                                          |
| `/sources`                                             | recommandations officielles par pilier                                                      |
| `/confidentialite` (`#suppression`), `/cgu`            | règles de confidentialité, suppression de compte (lien des stores), CGU et mentions légales |
| `/app`                                                 | cible du QR : redirige vers le store de l'appareil                                          |

## Choix techniques

- **Handoff de référence :** `~/Downloads/design_handoff_site_ourson`, qui fait foi pour les textes et le rendu.
- **Trois paliers**, pilotés par une seule gouttière CSS `--g` :
  - téléphone (< 600 px) : le design mobile du handoff, contenu de 390 px ;
  - tablette (600–899 px) : colonne de 560 px, sections à la hauteur de leur contenu ;
  - desktop (≥ 900 px) : contenu de 1140 px ;
  - fonds bord à bord partout.
- **Téléchargement :**
  - un seul bloc visible à la fois ;
  - le cartel flottant s'efface devant les autres blocs et le pied de page ;
  - écran tactile : badge du store de l'appareil, à toutes les largeurs ;
  - ordinateur : QR (généré au build, `/qr.svg`), qui pointe vers `/app`.
- **Cookies et mesure :** Consent Mode v2 avancé.
  - Tout est refusé par défaut dans le `<head>`. GTM se charge à la première interaction du visiteur ou après 3 s, pour ne pas bloquer le démarrage sur les téléphones modestes (rien n'est perdu : le `dataLayer` met en file d'attente).
  - Le bandeau « Miam, des cookies ! » propose deux finalités : audience et publicité.
  - Le choix est conservé 6 mois.
  - Chaque clic vers un store pousse l'événement `ourson_store`, branché dans GTM (`GA4 - Événement - clic_store`).
- **Partage :** une vraie image 1200 × 630 par page (`public/og/`), la couverture Cloudinary recadrée pour les articles. Aucun gabarit composé.
- **Typographie française :** apostrophe courbe et espaces insécables, vérifiées par un test (hors articles MDX).
- **Performance :**
  - CSS intégré à la page (`experimental.inlineCss`) ;
  - images AVIF / WebP, avec des `sizes` qui couvrent les trois paliers ;
  - image LCP chargée en priorité ;
  - polices via `next/font`, Bryndan Write réduite aux lettres du logo.
- **Sans clignotement :**
  - le bandeau cookies est dans le HTML statique, masqué avant le premier rendu si un choix existe ;
  - la place des blocs qui dépendent de l'appareil est réservée.
- **Slugs :** toujours en ASCII (vérifié par un test). L'ancienne URL accentuée redirige.

## Mise en ligne

1. Renseigner les liens des stores dans `src/lib/site.ts`, ou afficher « Bientôt sur l'App Store et Google Play ».
2. Sur la préversion Vercel, vérifier :
   - le consentement dans GTM (mode Prévisualiser) ;
   - la console : aucune erreur de politique de sécurité (CSP) ;
   - les aperçus de partage (WhatsApp, débogueur de partage Facebook) ;
   - le rendu sur de vrais iPhone, iPad et pliables.
3. Après la bascule :
   - soumettre `https://www.ourson.app/sitemap.xml` dans Search Console ;
   - pointer `LEGAL_URL` de l'app vers `/cgu` ;
   - supprimer le CNAME `back` chez OVH et ce domaine du projet Vercel.
