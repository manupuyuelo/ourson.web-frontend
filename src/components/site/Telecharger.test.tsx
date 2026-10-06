// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as site from "@/lib/site";
import { Telecharger } from "./Telecharger";

/** Le composant lit les liens des stores au chargement : on le recharge avec des fiches publiées. */
async function avecStoresPublies() {
  vi.resetModules();
  vi.doMock("@/lib/site", () => ({
    ...site,
    SITE: {
      ...site.SITE,
      appStoreUrl: "https://apps.apple.com/app/id1",
      playStoreUrl: "https://play.google.com/store/apps/details?id=app.ourson",
    },
  }));
  return (await import("./Telecharger")).Telecharger;
}

// IntersectionObserver piloté par le test : `rappel(true)` simule un autre bloc de téléchargement à l'écran.
let rappel: (visible: boolean) => void = () => {};
class FauxObservateur {
  private readonly cibles: Element[] = [];
  constructor(cb: (e: { target: Element; isIntersecting: boolean }[]) => void) {
    rappel = (visible) => cb(this.cibles.map((target) => ({ target, isIntersecting: visible })));
  }
  observe(el: Element) {
    this.cibles.push(el);
  }
  disconnect() {}
}

describe("Telecharger", () => {
  beforeEach(() => vi.stubGlobal("IntersectionObserver", FauxObservateur));
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.doUnmock("@/lib/site");
    document.body.innerHTML = "";
  });

  it("iOS : uniquement le badge App Store", () => {
    render(<Telecharger appareil="ios" emplacement="fin" />);
    expect(screen.getByAltText("Télécharger dans l’App Store")).toBeTruthy();
    expect(screen.queryByAltText("Disponible sur Google Play")).toBeNull();
  });

  it("Android : uniquement le badge Google Play", () => {
    render(<Telecharger appareil="android" emplacement="fin" />);
    expect(screen.getByAltText("Disponible sur Google Play")).toBeTruthy();
    expect(screen.queryByText("Téléchargez l’app")).toBeNull();
  });

  it("ordinateur : le bloc QR", () => {
    render(<Telecharger appareil="desktop" emplacement="fin" />);
    expect(screen.getByText("Téléchargez l’app")).toBeTruthy();
    expect(screen.getByAltText(/QR code/)).toBeTruthy();
  });

  it("cartel mobile : icône, titre et badge du store de l’appareil", async () => {
    const Publie = await avecStoresPublies();
    render(<Publie appareil="android" flottant emplacement="cartel" />);
    act(() => rappel(false));
    expect(screen.getByText("Téléchargez l’app")).toBeTruthy();
    expect(screen.getByAltText("Disponible sur Google Play")).toBeTruthy();
  });

  it("cartel QR : QR 112 px et consigne", () => {
    render(<Telecharger appareil="desktop" flottant emplacement="cartel" />);
    act(() => rappel(false));
    expect(screen.getByAltText(/QR code/).getAttribute("width")).toBe("112");
    expect(screen.getByText("Bientôt sur l’App Store et Google Play.")).toBeTruthy();
  });

  it("cartel : s’efface quand la fin de page est à l’écran", () => {
    document.body.innerHTML = '<section><div id="telecharger"></div></section>';
    const { container } = render(<Telecharger appareil="ios" flottant emplacement="cartel" />);
    const cartel = container.firstElementChild!;
    act(() => rappel(false));
    expect(cartel.getAttribute("aria-hidden")).toBeNull();
    act(() => rappel(true));
    expect(cartel.getAttribute("aria-hidden")).toBe("true");
    expect(cartel.hasAttribute("inert")).toBe(true);
  });

  it("avant la sortie : badges sans lien, mention « Bientôt », aucun événement", () => {
    window.dataLayer = [];
    render(<Telecharger appareil="ios" emplacement="fin" />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Bientôt disponible")).toBeTruthy();
    fireEvent.click(screen.getByAltText("Télécharger dans l’App Store"));
    expect(window.dataLayer).toEqual([]);
  });

  it("cartel mobile avant la sortie : « Bientôt disponible », sans lien", () => {
    render(<Telecharger appareil="android" flottant emplacement="cartel" />);
    act(() => rappel(false));
    expect(screen.getByText("Bientôt disponible")).toBeTruthy();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("clic sur un badge : événement ourson_store avec le store et l’emplacement", async () => {
    const Publie = await avecStoresPublies();
    window.dataLayer = [];
    render(<Publie appareil="ios" emplacement="fin" />);
    expect(screen.queryByText("Bientôt disponible")).toBeNull();
    fireEvent.click(screen.getByRole("link", { name: "Ourson sur l’App Store" }));
    expect(window.dataLayer).toContainEqual({
      event: "ourson_store",
      store: "app_store",
      emplacement: "fin",
    });
  });

  it("clic sur le logo Android du bloc QR : google_play", async () => {
    const Publie = await avecStoresPublies();
    window.dataLayer = [];
    render(<Publie appareil="desktop" emplacement="menu" />);
    expect(screen.getByText(/Scannez ce code/)).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: "Ourson sur Google Play" }));
    expect(window.dataLayer).toContainEqual({
      event: "ourson_store",
      store: "google_play",
      emplacement: "menu",
    });
  });
});
