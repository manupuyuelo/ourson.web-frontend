import { describe, expect, it } from "vitest";
import { appareilDepuisUA } from "./device";
import { destinationStore } from "./store";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15";
const ANDROID = "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Mobile";
const MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15";

describe("appareilDepuisUA", () => {
  it("sans maxTouchPoints (côté serveur), un iPad qui se présente comme un Mac passe pour un ordinateur", () => {
    expect(appareilDepuisUA(MAC)).toBe("desktop");
    expect(appareilDepuisUA(MAC, 5)).toBe("ios");
  });
});

describe("destinationStore (route /app)", () => {
  it("renvoie vers l’accueil tant que les liens des stores sont à « # »", () => {
    for (const ua of [IPHONE, ANDROID, MAC, ""]) expect(destinationStore(ua)).toBe("/");
  });
});
