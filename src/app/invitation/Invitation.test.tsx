// @vitest-environment happy-dom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { lienApp, lireInvitation } from "@/lib/invitation";
import { Invitation } from "./Invitation";

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
});

describe("page /invitation", () => {
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
});
