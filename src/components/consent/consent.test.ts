// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CONSENT_KEY, CONSENT_VERSION } from "./config";
import { enregistrer, lire, valider } from "./consent";

const maintenant = Date.parse("2026-10-06T12:00:00Z");
const stocke = (c: object) => JSON.stringify({ audience: true, pub: false, version: CONSENT_VERSION, ...c });

describe("valider", () => {
  it("accepte un choix de moins de 6 mois", () => {
    expect(valider(stocke({ date: "2026-09-01T00:00:00Z" }), maintenant)).toEqual({
      audience: true,
      pub: false,
    });
  });

  it("refuse un choix de plus de 6 mois, d’une autre version ou mal formé", () => {
    expect(valider(stocke({ date: "2026-01-01T00:00:00Z" }), maintenant)).toBeNull();
    expect(valider(stocke({ date: "2026-09-01T00:00:00Z", version: 99 }), maintenant)).toBeNull();
    expect(valider(stocke({ date: "pas une date" }), maintenant)).toBeNull();
    expect(valider("{", maintenant)).toBeNull();
    expect(valider(null, maintenant)).toBeNull();
  });
});

describe("enregistrer", () => {
  beforeEach(() => {
    window.dataLayer = [];
  });
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.consent;
    for (const c of document.cookie.split(";")) {
      const nom = c.split("=")[0]?.trim();
      if (nom) document.cookie = `${nom}=; Max-Age=0; path=/`;
    }
  });

  it("stocke le choix, met à jour Consent Mode et pousse ourson_consent", () => {
    enregistrer({ audience: true, pub: true });
    expect(lire()).toEqual({ audience: true, pub: true });
    const [update, evenement] = window.dataLayer ?? [];
    expect(Object.values(Object(update))).toEqual([
      "consent",
      "update",
      {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      },
    ]);
    expect(evenement).toEqual({ event: "ourson_consent", audience: true, pub: true });
    expect(JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "{}")).toMatchObject({ version: CONSENT_VERSION });
    expect(document.documentElement.dataset.consent).toBe("");
  });

  it("au retrait, efface les cookies de la finalité refusée", () => {
    enregistrer({ audience: true, pub: true });
    document.cookie = "_ga=GA1.1.123; path=/";
    document.cookie = "_gcl_au=1.1.456; path=/";
    enregistrer({ audience: false, pub: true });
    expect(document.cookie).not.toContain("_ga=");
    expect(document.cookie).toContain("_gcl_au=");
  });
});
