// @vitest-environment happy-dom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Appareil } from "@/lib/device";
import { lienAndroid, lienApp, lienInvitation, lireInvitation } from "@/lib/invitation";
import { SITE } from "@/lib/site";
import { Invitation } from "./Invitation";

const appareil = vi.hoisted(() => ({ actuel: "ios" as Appareil | null }));
vi.mock("@/lib/useAppareil", () => ({ useAppareil: () => appareil.actuel }));
const qrcode = vi.hoisted(() => ({ urls: [] as string[] }));
vi.mock("qrcode", () => ({
  default: {
    toString: async (url: string) => {
      qrcode.urls.push(url);
      return "<svg xmlns='http://www.w3.org/2000/svg'/>";
    },
  },
}));

describe("lireInvitation", () => {
  it("lit l’adresse et la langue du fragment", () => {
    expect(lireInvitation("#email=sarah%2Blou%40ourson.fr&lang=en")).toEqual({
      email: "sarah+lou@ourson.fr",
      langue: "en",
    });
  });

  it("français par défaut, adresse ignorée si elle n’en est pas une", () => {
    expect(lireInvitation("")).toEqual({ email: null, langue: "fr" });
    expect(lireInvitation("#email=bonjour&lang=de")).toEqual({ email: null, langue: "fr" });
    // Une phrase avec une arobase n’est pas une adresse (texte affiché sur ourson.app).
    expect(lireInvitation("#email=appelez%20le%2006%20%40%20moi").email).toBeNull();
    expect(lireInvitation("#email=a%40b%40c.fr").email).toBeNull();
    expect(lireInvitation("#email=a%40b").email).toBeNull();
    expect(lireInvitation("#email=%E0%A4%A&lang=en")).toEqual({ email: null, langue: "en" });
  });

  it("lien de l’app : l’inscription préremplie, ou l’app seule", () => {
    expect(lienApp("sarah+lou@ourson.fr")).toBe("ourson://compte?email=sarah%2Blou%40ourson.fr");
    expect(lienApp(null)).toBe("ourson://");
  });

  it("Android : intent:// ouvre l’app, sinon la fiche Play Store", () => {
    const repli = "https://play.google.com/store/apps/details?id=com.addedsugarsas.ourson";
    expect(lienAndroid("sarah+lou@ourson.fr", repli)).toBe(
      "intent://compte?email=sarah%2Blou%40ourson.fr#Intent;scheme=ourson;package=com.addedsugarsas.ourson;" +
        `S.browser_fallback_url=${encodeURIComponent(repli)};end`,
    );
    expect(lienAndroid(null, repli)).toMatch(/^intent:\/\/#Intent;scheme=ourson;/);
  });

  it("le lien d’invitation du QR : domaine de prod, adresse et langue dans le fragment", () => {
    expect(lienInvitation("a@b.fr", "en")).toBe("https://www.ourson.app/invitation#email=a%40b.fr&lang=en");
    expect(lienInvitation(null, "fr")).toBe("https://www.ourson.app/invitation#lang=fr");
  });

  it("l’identifiant App Store de la bannière Safari est celui de la fiche", () => {
    expect(SITE.appStoreUrl).toContain(`/id${SITE.appStoreId}`);
    expect(SITE.playStoreUrl).toContain(`id=${SITE.appId}`);
  });
});

describe("page /invitation", () => {
  beforeEach(() => {
    appareil.actuel = "ios";
  });

  afterEach(() => {
    cleanup();
    history.replaceState(null, "", "/");
  });

  it("français : l’adresse, « Ouvrir Ourson » vers l’inscription, sans ouvrir l’app d’elle-même", () => {
    history.replaceState(null, "", "/invitation#email=sarah%40ourson.fr&lang=fr");
    const { container } = render(<Invitation />);
    expect(screen.getByRole("heading", { name: "Une invitation vous attend" })).toBeTruthy();
    expect(screen.getByText("sarah@ourson.fr")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ouvrir Ourson" }).getAttribute("href")).toBe(
      "ourson://compte?email=sarah%40ourson.fr",
    );
    expect(container.querySelector("main")?.getAttribute("lang")).toBe("fr");
    expect(location.href).toContain("/invitation");
  });

  it("anglais, compte existant (sans adresse) : ouvre l’app telle quelle", () => {
    history.replaceState(null, "", "/invitation#lang=en");
    const { container } = render(<Invitation />);
    expect(screen.getByRole("heading", { name: "An invitation is waiting for you" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Open Ourson" }).getAttribute("href")).toBe("ourson://");
    expect(container.querySelector("main")?.getAttribute("lang")).toBe("en");
  });

  it("suit un changement de fragment", () => {
    history.replaceState(null, "", "/invitation");
    render(<Invitation />);
    expect(screen.getByRole("link", { name: "Ouvrir Ourson" })).toBeTruthy();
    act(() => {
      history.replaceState(null, "", "/invitation#lang=en");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.getByRole("link", { name: "Open Ourson" })).toBeTruthy();
  });

  it("« Aller au contenu » (#contenu) n’efface pas l’invitation", () => {
    history.replaceState(null, "", "/invitation#email=sarah%40ourson.fr&lang=en");
    render(<Invitation />);
    act(() => {
      history.replaceState(null, "", "/invitation#contenu");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.getByRole("link", { name: "Open Ourson" }).getAttribute("href")).toBe(
      "ourson://compte?email=sarah%40ourson.fr",
    );
  });

  it("ordinateur : pas de bouton vers l’app, un QR du lien d’invitation", async () => {
    appareil.actuel = "desktop";
    history.replaceState(null, "", "/invitation#email=sarah%2Blou%40ourson.fr&lang=fr");
    render(<Invitation />);
    expect(screen.queryByRole("link", { name: "Ouvrir Ourson" })).toBeNull();
    expect(document.querySelector('a[href^="ourson:"], a[href^="intent:"]')).toBeNull();
    expect(screen.getByText("Continuez sur votre téléphone")).toBeTruthy();
    expect(screen.getByText("sarah+lou@ourson.fr")).toBeTruthy();
    const qr = await screen.findByRole("img", { name: "QR code de votre invitation" });
    expect(qr.getAttribute("src")).toMatch(/^data:image\/svg\+xml/);
    expect(qrcode.urls.at(-1)).toBe(
      "https://www.ourson.app/invitation#email=sarah%2Blou%40ourson.fr&lang=fr",
    );
  });

  it("Android, stores fermés : « Ouvrir Ourson » reste un lien ourson:// (pas de repli vers le store)", () => {
    appareil.actuel = "android";
    history.replaceState(null, "", "/invitation#email=sarah%40ourson.fr&lang=fr");
    render(<Invitation />);
    expect(screen.getByRole("link", { name: "Ouvrir Ourson" }).getAttribute("href")).toBe(
      "ourson://compte?email=sarah%40ourson.fr",
    );
    expect(screen.queryByText("Continuez sur votre téléphone")).toBeNull();
  });

  it("appareil pas encore détecté : les deux versions, chacune masquable en CSS", () => {
    appareil.actuel = null;
    history.replaceState(null, "", "/invitation#lang=fr");
    render(<Invitation />);
    expect(screen.getByRole("link", { name: "Ouvrir Ourson" }).className).toMatch(/telephoneEnAttente/);
    expect(screen.getByText("Continuez sur votre téléphone").parentElement?.className).toMatch(
      /ordinateurEnAttente/,
    );
  });
});
