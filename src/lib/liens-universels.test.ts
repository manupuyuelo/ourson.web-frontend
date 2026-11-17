import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  AASA,
  ANDROID_CERT_SHA256,
  APPLE_TEAM_ID,
  APP_ID,
  ASSETLINKS,
  aasa,
  assetlinks,
  ecrireWellKnown,
} from "./liens-universels";

const TEAM = "AB12CD34EF";
const PLAY =
  "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5";
const EAS = "fa".repeat(32);

describe("apple-app-site-association", () => {
  it("sans variable : le Team ID du code", () => {
    expect(JSON.parse(aasa({})!).applinks.details[0].appIDs).toEqual([`${APPLE_TEAM_ID}.${APP_ID}`]);
  });

  it("une variable vide retire le fichier", () => {
    expect(aasa({ APPLE_TEAM_ID: "  " })).toBeNull();
  });

  it("ouvre /invitation dans l’app (format components)", () => {
    expect(JSON.parse(aasa({ APPLE_TEAM_ID: ` ${TEAM.toLowerCase()} ` })!)).toEqual({
      applinks: {
        details: [
          {
            appIDs: [`${TEAM}.${APP_ID}`],
            components: [{ "/": "/invitation" }, { "/": "/invitation/*" }],
          },
        ],
      },
    });
  });

  it("refuse un Team ID mal formé (le build s’arrête)", () => {
    expect(() => aasa({ APPLE_TEAM_ID: "<TEAM_ID>" })).toThrow(/APPLE_TEAM_ID invalide/);
  });
});

describe("assetlinks.json", () => {
  it("sans variable : la clé Play, puis la clé d’envoi EAS", () => {
    expect(JSON.parse(assetlinks({})!)[0].target.sha256_cert_fingerprints).toEqual(
      ANDROID_CERT_SHA256.split(","),
    );
    expect(ANDROID_CERT_SHA256.split(",")).toHaveLength(2);
  });

  it("une variable vide retire le fichier", () => {
    expect(assetlinks({ ANDROID_CERT_SHA256: " , " })).toBeNull();
  });

  it("une entrée par certificat, au format de Google", () => {
    const [lien] = JSON.parse(assetlinks({ ANDROID_CERT_SHA256: `${PLAY}, ${EAS}` })!);
    expect(lien).toEqual({
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: APP_ID,
        sha256_cert_fingerprints: [PLAY, "FA:".repeat(31) + "FA"],
      },
    });
  });

  it("refuse une empreinte mal formée", () => {
    expect(() => assetlinks({ ANDROID_CERT_SHA256: "<SHA256>" })).toThrow(/ANDROID_CERT_SHA256 invalide/);
    expect(() => assetlinks({ ANDROID_CERT_SHA256: "AB:CD" })).toThrow(/invalide/);
  });
});

describe("écriture au build", () => {
  let dossier = "";
  beforeEach(async () => {
    dossier = path.join(await mkdtemp(path.join(tmpdir(), "well-known-")), ".well-known");
  });
  afterEach(() => rm(path.dirname(dossier), { recursive: true, force: true }));

  it("avec les deux variables : les deux fichiers", async () => {
    await ecrireWellKnown(dossier, { APPLE_TEAM_ID: TEAM, ANDROID_CERT_SHA256: PLAY });
    expect((await readdir(dossier)).toSorted()).toEqual([AASA, ASSETLINKS]);
    expect(JSON.parse(await readFile(path.join(dossier, AASA), "utf8")).applinks).toBeTruthy();
  });

  it("sans variable : les deux fichiers, avec les identifiants du code", async () => {
    await ecrireWellKnown(dossier, {});
    expect((await readdir(dossier)).toSorted()).toEqual([AASA, ASSETLINKS]);
  });

  it("variables vides : aucun fichier, même ceux d’un build précédent, et le journal le dit", async () => {
    await ecrireWellKnown(dossier, { APPLE_TEAM_ID: TEAM, ANDROID_CERT_SHA256: PLAY });
    await writeFile(path.join(dossier, AASA), "ancien");
    const journal = await ecrireWellKnown(dossier, { APPLE_TEAM_ID: "", ANDROID_CERT_SHA256: "" });
    expect(await readdir(dossier)).toEqual([]);
    expect(journal).toEqual([
      expect.stringMatching(/apple-app-site-association : non produit \(APPLE_TEAM_ID vide\)/),
      expect.stringMatching(/assetlinks\.json : non produit \(ANDROID_CERT_SHA256 vide\)/),
    ]);
  });
});
