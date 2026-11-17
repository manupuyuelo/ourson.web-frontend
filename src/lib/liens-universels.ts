// Liens universels de l’app (iOS Universal Links, Android App Links) : les deux fichiers que
// iOS et Android lisent sur https://www.ourson.app/.well-known/ pour ouvrir `/invitation` dans
// l’app plutôt que dans le navigateur. Générés au build (`scripts/well-known.ts`, lancé par
// `yarn build`) à partir des identifiants ci-dessous, publics par nature (ils sont servis tels
// quels). Seul le domaine de prod compte : l’app ne fait confiance qu’à `www.ourson.app`.
// Deux variables d’environnement peuvent les remplacer (un essai, une clé qui change) :
//  • APPLE_TEAM_ID : le Team ID Apple (10 caractères, `eas credentials -p ios`) ;
//  • ANDROID_CERT_SHA256 : les empreintes SHA-256 des certificats Android, séparées par des
//    virgules (clé Play App Signing, puis clé d’envoi EAS).
// Une variable posée mais vide retire le fichier : `/invitation` reste alors une simple page web.
// Ce module ne passe pas par l’alias `@/` : Node l’exécute tel quel depuis le script.
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { SITE } from "./site.ts";

/** Identifiant de l’app, le même sur les deux plateformes (`ourson-app/app.json`). */
export const APP_ID = SITE.appId;

/** Team ID Apple de l’équipe AddedSugar (`eas credentials -p ios`, profil production). */
export const APPLE_TEAM_ID = "6SUF3N8NZP";

/**
 * Empreintes SHA-256 des certificats Android : la clé de signature d’application de Google Play
 * (Play Console › Signature d’application, celle des installations depuis le store), puis la clé
 * d’envoi EAS (`eas credentials -p android`, profil production : les builds installés à la main).
 */
export const ANDROID_CERT_SHA256 = [
  "97:A9:70:28:99:10:B1:74:0D:2C:5C:EB:E5:45:CB:40:DD:45:AE:8F:64:9D:9B:17:45:C6:C5:8F:31:48:00:59",
  "A7:AD:04:CF:8F:08:97:D1:24:50:94:8E:67:C0:68:30:C0:88:9F:32:4F:D8:54:CF:41:F7:AF:9B:16:E1:37:80",
].join(",");

/** La valeur retenue : la variable d’environnement si elle est posée, sinon l’identifiant du code. */
function identifiant(env: Variables, nom: "APPLE_TEAM_ID" | "ANDROID_CERT_SHA256"): string {
  const posee = env[nom];
  if (posee !== undefined) return posee;
  return nom === "APPLE_TEAM_ID" ? APPLE_TEAM_ID : ANDROID_CERT_SHA256;
}

/** Chemins ouverts dans l’app : la page relais de l’email d’invitation. */
export const CHEMINS_APP = ["/invitation", "/invitation/*"] as const;

export const AASA = "apple-app-site-association";
export const ASSETLINKS = "assetlinks.json";

/** `process.env`, ou un sous-ensemble dans les tests. */
export type Variables = {
  [nom: string]: string | undefined;
  APPLE_TEAM_ID?: string;
  ANDROID_CERT_SHA256?: string;
};

/** Team ID Apple : 10 lettres majuscules ou chiffres. */
function teamId(valeur: string): string {
  const id = valeur.trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(id)) {
    throw new Error(`APPLE_TEAM_ID invalide : 10 lettres ou chiffres attendus, reçu « ${valeur} ».`);
  }
  return id;
}

/** Empreinte SHA-256, avec ou sans deux-points, rendue au format de Google : `AB:CD:…` (32 octets). */
function empreinte(valeur: string): string {
  const hex = valeur.trim().replace(/:/g, "").toUpperCase();
  if (!/^[0-9A-F]{64}$/.test(hex)) {
    throw new Error(`ANDROID_CERT_SHA256 invalide : 32 octets hexadécimaux attendus, reçu « ${valeur} ».`);
  }
  return hex.match(/../g)!.join(":");
}

/** `apple-app-site-association` (format `components`, iOS 13 et plus), ou null sans Team ID. */
export function aasa(env: Variables): string | null {
  const team = identifiant(env, "APPLE_TEAM_ID");
  if (!team.trim()) return null;
  return `${JSON.stringify(
    {
      applinks: {
        details: [
          {
            appIDs: [`${teamId(team)}.${APP_ID}`],
            components: CHEMINS_APP.map((chemin) => ({ "/": chemin })),
          },
        ],
      },
    },
    null,
    2,
  )}\n`;
}

/** `assetlinks.json` (Digital Asset Links), ou null sans empreinte. */
export function assetlinks(env: Variables): string | null {
  const empreintes = identifiant(env, "ANDROID_CERT_SHA256")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (empreintes.length === 0) return null;
  return `${JSON.stringify(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: APP_ID,
          sha256_cert_fingerprints: empreintes.map(empreinte),
        },
      },
    ],
    null,
    2,
  )}\n`;
}

/**
 * Écrit les deux fichiers dans `dossier` (`public/.well-known`), ou les retire quand leur variable
 * manque (aucun reste d’un build précédent). Rend une ligne de journal par fichier.
 */
export async function ecrireWellKnown(dossier: string, env: Variables): Promise<string[]> {
  const fichiers = [
    { nom: AASA, contenu: aasa(env), variable: "APPLE_TEAM_ID" },
    { nom: ASSETLINKS, contenu: assetlinks(env), variable: "ANDROID_CERT_SHA256" },
  ];
  await mkdir(dossier, { recursive: true });
  return Promise.all(
    fichiers.map(async ({ nom, contenu, variable }) => {
      const cible = path.join(dossier, nom);
      if (contenu === null) {
        await rm(cible, { force: true });
        return `.well-known/${nom} : non produit (${variable} vide), /invitation reste une page web.`;
      }
      await writeFile(cible, contenu);
      return `.well-known/${nom} : produit.`;
    }),
  );
}
