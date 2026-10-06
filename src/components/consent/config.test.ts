// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CONSENT_DUREE, CONSENT_KEY, CONSENT_KEY_V0, CONSENT_SCRIPT, CONSENT_VERSION } from "./config";

// Le script du <head> pose le consentement par défaut (tout refusé), applique un choix encore valide
// et masque le bandeau avant le premier rendu.
// oxlint-disable-next-line typescript/no-implied-eval -- on exécute la chaîne exacte injectée dans la page
const lance = () => new Function(CONSENT_SCRIPT)();
// Les commandes gtag sont des objets arguments : Object.values en restitue les valeurs dans l’ordre.
const commandes = (): unknown[][] => (window.dataLayer ?? []).map((a) => Object.values(Object(a)));
const choix = (c: object) => localStorage.setItem(CONSENT_KEY, JSON.stringify(c));

describe("script de consentement", () => {
  beforeEach(() => {
    window.dataLayer = [];
  });
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.consent;
  });

  it("refuse tout par défaut, avant GTM", () => {
    lance();
    expect(commandes()[0]).toEqual([
      "consent",
      "default",
      {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500,
      },
    ]);
    expect(document.documentElement.dataset.consent).toBeUndefined();
  });

  it("applique un choix récent et masque le bandeau", () => {
    choix({ audience: true, pub: false, date: new Date().toISOString(), version: CONSENT_VERSION });
    lance();
    expect(commandes()).toContainEqual([
      "consent",
      "update",
      {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      },
    ]);
    expect(document.documentElement.dataset.consent).toBe("");
  });

  it("ignore un choix expiré, d’une autre version ou corrompu", () => {
    const vieux = new Date(Date.now() - CONSENT_DUREE - 1000).toISOString();
    for (const valeur of [
      JSON.stringify({ audience: true, pub: true, date: vieux, version: CONSENT_VERSION }),
      JSON.stringify({ audience: true, pub: true, date: new Date().toISOString(), version: 0 }),
      "{pas du json",
    ]) {
      window.dataLayer = [];
      localStorage.setItem(CONSENT_KEY, valeur);
      lance();
      expect(commandes().some((c) => c[1] === "update")).toBe(false);
      expect(document.documentElement.dataset.consent).toBeUndefined();
    }
  });

  it("supprime la clé de la première version du bandeau", () => {
    localStorage.setItem(CONSENT_KEY_V0, JSON.stringify({ choix: "accepte", le: Date.now() }));
    lance();
    expect(localStorage.getItem(CONSENT_KEY_V0)).toBeNull();
  });
});
