// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { CONSENT_DUREE, CONSENT_KEY, CONSENT_SCRIPT } from "./config";

// Le script du <head> doit masquer le bandeau avant le premier rendu, et seulement pour un choix valide.
// oxlint-disable-next-line typescript/no-implied-eval -- on exécute la chaîne exacte injectée dans la page
const lance = () => new Function(CONSENT_SCRIPT)();

describe("script de consentement", () => {
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.consent;
  });

  it("pose data-consent pour un choix récent", () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ choix: "refuse", le: Date.now() }));
    lance();
    expect(document.documentElement.dataset.consent).toBe("refuse");
  });

  it("ignore un choix expiré, absent ou corrompu", () => {
    for (const valeur of [
      JSON.stringify({ choix: "accepte", le: Date.now() - CONSENT_DUREE - 1 }),
      JSON.stringify({ choix: "peut-être", le: Date.now() }),
      "{pas du json",
    ]) {
      localStorage.setItem(CONSENT_KEY, valeur);
      lance();
      expect(document.documentElement.dataset.consent).toBeUndefined();
    }
  });
});
