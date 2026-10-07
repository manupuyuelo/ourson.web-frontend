# www.ourson.app : guide pour les agents

Site vitrine de **Ourson**, l'app des parents d'enfants de 0 à 3 ans (repas, sommeil, éveil, partagés avec le foyer). Le site présente l'app, publie un blog de conseils et porte les pages légales. Édité par AddedSugar (SASU). L'app elle-même vit dans un autre dépôt, `ourson-app` (Expo / React Native, Supabase).

Ce fichier est la source unique des consignes (`CLAUDE.md` l'importe). Le bloc entre les marqueurs `nextjs-agent-rules`, en bas, est géré par Next.js : ne pas le modifier.

## Pile

Next.js 16 (App Router, Turbopack, React Compiler), React 19, TypeScript 7, CSS Modules et tokens du design system (pas de Tailwind), MDX pour le blog, Yarn classic, oxlint et oxfmt, Vitest, Playwright, Node 24. Tout est statique (SSG) sauf la route `/app`. Hébergé sur Vercel (fonctions à Paris, `cdg1`).

## Commandes

| Commande                                                                                                      | Rôle                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `yarn dev`                                                                                                    | développement, http://localhost:3000                                                                                                                   |
| `yarn verify`                                                                                                 | types, lint (`--deny-warnings`), format, tests unitaires : à lancer avant tout commit (le pre-push le fait)                                            |
| `yarn build`                                                                                                  | build de production : toutes les routes doivent rester `○` ou `●`, sauf `ƒ /app`                                                                       |
| `yarn test:e2e`                                                                                               | Playwright sur le build (`E2E_SKIP_BUILD=1` si le build est déjà fait)                                                                                 |
| `VISUEL=1 yarn test:e2e visuel`                                                                               | non-régression au pixel près (iPhone 15, 16 Pro Max, 1280, 1440). Références locales : `--update-snapshots` **avant** de modifier, puis comparer après |
| `ECRANS=1 yarn test:e2e ecrans` (+ `CAPTURES=1` et `node scripts/planche-ecrans.ts <page>` pour les captures) | audit sur 24 formats (téléphones, foldables, tablettes, paysage, ordinateurs) et planche de relecture                                                  |
| `yarn lighthouse`                                                                                             | budget Lighthouse (9 pages)                                                                                                                            |
| `yarn test:e2e partage`                                                                                       | titre, description et image de partage de chaque URL du sitemap                                                                                        |
| `yarn couverture <image> <slug>`                                                                              | prépare la couverture d’un article (1600 px max, JPEG léger)                                                                                           |
| `yarn images` / `yarn og`                                                                                     | régénère les images depuis le handoff / les images de partage 1200 × 630 (dans la DA de chaque page, à partir des images du dépôt)                     |

## Organisation

- `src/app/(vente)/` : pages de vente (Accueil, `nutrition`, `sommeil`, `eveil`). Leur layout ajoute les cartels de téléchargement flottants (`Flottants`), le pied de page et la pause des animations hors écran. Le pied de page (`Footer`) n'existe qu'en desktop : sur téléphone et tablette, ses liens sont dans le menu.
- `src/app/blog/` : liste, rubriques (`nutrition`, `sommeil`, `activites`), articles `/blog/<rubrique>/<slug>` (URLs de l'ancien site, à conserver).
- `src/app/confidentialite/` (+ feuille `#suppression`, lien donné aux stores), `src/app/cgu/` (CGU et mentions légales), `src/app/sources/` (sources institutionnelles).
- `src/app/app/route.ts` : cible du QR, redirige vers le store de l'appareil (vers `/` tant que les liens sont à `#`). `src/app/qr.svg/` : le QR, généré au build.
- `src/content/blog/*.mdx` : articles. Frontmatter validé par zod (`src/lib/blog.ts`) ; publier = ajouter le fichier, sa couverture (`yarn couverture <image> <slug>` → `src/assets/blog/<slug>.jpg`, obligatoire : sans elle le build échoue), puis `yarn og` pour son image de partage. Les listes « **1. Titre** : texte » sont mises en forme par `src/lib/remark-points.ts`.
- `src/components/ds/` : composants du design system Ourson portés du handoff. `components/site/` (Telecharger, Carte, Age, Carrousel), `components/layout/` (Header, Footer, FinDePage, Flottants, gabarit `Pilier.module.css`), `components/consent/` (bandeau et Consent Mode), `components/blog/`.
- `src/lib/` : `site.ts` (URLs, e-mail, ID GTM), `seo.tsx` (`meta()`, `og()`, `partage()` / `partageArticle()`, JSON-LD), `partage.json` (manifeste des images de partage, écrit par `yarn og`), `couvertures.ts` (couvertures d’articles), `data.ts` (contenus des pages), `sources.ts`, `mesure.ts` (événements GTM), `device.ts` / `useAppareil.ts`, `useCartelMasque.ts`.
- `src/styles/` : tokens (`tokens/*.css`), `globals.css`, `motion.css`.
- `e2e/` : `smoke`, `appareil`, `ecrans` (audit multi-formats), `visuel` (non-régression), `partage` (titre, description et image de partage de chaque URL), `captures` (comparaison avec le handoff).
- `scripts/` : images, images de partage, couvertures d’articles, planches, comparaison de captures, hooks Git.

## Règles à respecter

- **Le handoff fait foi.** Référence actuelle : `~/Downloads/design_handoff_site_ourson` (prototypes `.dc.html` : styles en ligne = mobile, bloc `@media (min-width:900px)` = desktop). Textes et valeurs repris tels quels. Quand le README du handoff contredit un prototype, le prototype gagne.
- **Trois paliers, pilotés par la gouttière `--g`** (`globals.css`) : téléphone < 600 px (contenu de 390 px, le design du handoff), tablette 600–899 px (colonne de 560 px, sections à la hauteur du contenu, oursons posés sur les visuels), desktop ≥ 900 px (contenu de 1140 px). Fonds toujours bord à bord. Toute marge latérale de section passe par `var(--g)`.
- **Pas de régression** : avant une modification visuelle, générer les références `visuel`, puis vérifier qu'aucun écart n'apparaît hors de ce qui est voulu. Lancer aussi l'audit `ecrans` (pas de défilement horizontal, pas de texte hors écran, pas de vide de plus de 200 px, un seul bloc de téléchargement visible).
- **Typographie française** (site, hors articles MDX) : apostrophe courbe `’`, espace fine insécable (U+202F) avant `? ! ;`, insécable (U+00A0) avant `:` et dans « ». Dans le JSX : `&#8239;` et `&nbsp;` ; dans les chaînes : ` ` et ` `, **jamais dans un attribut JSX entre guillemets** (utiliser `{"…"}`). Vérifié par `src/lib/typo.test.ts`.
- **Code en français** (noms, commentaires, messages de commit), comme le reste du dépôt. Commits atomiques, message au présent, une étape par commit.
- **Statique avant tout** : la détection d'appareil se fait côté client (`useAppareil`) ; pendant le rendu serveur, la place est réservée pour éviter tout décalage.
- **Consentement** (Consent Mode v2 avancé) : le script du `<head>` (`components/consent/config.ts`) refuse tout par défaut, avant GTM. GTM se charge à la première interaction ou après 3 s (`Gtm.tsx`) pour ne pas bloquer le démarrage sur les téléphones modestes ; ce qui est poussé avant dans le dataLayer est traité à son arrivée. Deux finalités : audience (`analytics_storage`) et publicité (`ad_*`). Choix dans `localStorage['ourson-cookies']`, 6 mois ; incrémenter `CONSENT_VERSION` pour le redemander. Tout lien `#cookies` rouvre le bandeau. Un nouveau domaine tiers doit être ajouté à la CSP (`next.config.ts`) et soumis au consentement.
- **Mesure** : chaque clic vers un store pousse `ourson_store` (`store`, `emplacement`) via `src/lib/mesure.ts`.
- **Images** : `next/image` avec `sizes` qui couvre les trois paliers ; image LCP en `eager` + `fetchPriority="high"`. Partage : une image 1200 × 630 par page, composée dans la DA de son hero (`yarn og`, `scripts/og-images.ts`) ; ourson et couleur dans le carré central (vignettes WhatsApp), JPEG < 300 Ko, URL versionnée par `src/lib/partage.json` (à régénérer quand un titre de hero change). Chaque article a la sienne (couverture, titre, ourson de la rubrique) : **publier un article = lancer `yarn og`**, sinon `partage.test.ts` échoue. Une page sans image déclarée hérite de celle de l’Accueil (layout).
- **Animations** en boucle (`data-boucle`) : quelques cycles seulement, en pause hors écran. Mouvement réduit respecté.
- **Accessibilité** : focus visible (`--focus`, blanc sur fond plein), lien « Aller au contenu », contrastes du handoff conservés tels quels (choix assumé). Les boucles d’animation (9 à 16 s, sans bouton pause) dépassent les 5 s du critère WCAG 2.2.2 : choix assumé, compensé par l’arrêt automatique, la pause hors écran et le mouvement réduit.

## Ajouter ou modifier une page

À chaque page ajoutée ou modifiée, article compris :

1. **Métadonnées** : `meta({ url, titre, description, image })` (`src/lib/seo.tsx`). Titre et description propres à la page (description d’au moins 50 caractères), titre avec la marque (« … · Ourson »).
2. **Couverture** (article) : `yarn couverture <image> <slug>`. Toutes les images vivent dans le dépôt, aucune n’est servie par un service tiers.
3. **Image de partage** : une page lambda ajoute sa composition dans `scripts/og-images.ts` (sur le modèle de `simple()` ou `pilier()`) et la déclare avec `partage("<nom>")`. Un article n’a rien à déclarer. Dans les deux cas, lancer **`yarn og`**, puis relire l’image dans `public/og/`. À relancer aussi quand un titre de hero ou d’article change.
4. **Sitemap** : ajouter la page fixe dans `src/app/sitemap.ts`.
5. **Vérifier** : `yarn verify` contrôle que chaque `page.tsx` déclare son image, que chaque page fixe est au sitemap et que chaque article a son image (`src/lib/partage.test.ts`). `yarn test:e2e partage` lit le HTML du build pour toutes les URLs du sitemap : titre, description, `og:*`, image unique à la page, servie, en JPEG de moins de 300 Ko.

## Points ouverts

- Liens App Store / Google Play à renseigner dans `src/lib/site.ts` à la sortie de l'app (`TODO(stores)`). D'ici là, `storePublie()` affiche les badges sans lien avec la mention « Bientôt », et aucun `ourson_store` n'est envoyé.
- Section « Cookies du site » de la Confidentialité à valider (`TODO(texte)`), CGU à relire (code postal, directeur de la publication, contenus IA).
- Carte « Une première fois ! » (Éveil) : l'emplacement « Photo de l'enfant » attend une vraie photo.
- Dans `ourson-app`, `LEGAL_URL` (`src/lib/links.ts`) doit pointer vers `/cgu`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
