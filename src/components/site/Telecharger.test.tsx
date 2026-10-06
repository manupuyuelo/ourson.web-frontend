// @vitest-environment happy-dom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Telecharger } from "./Telecharger";

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
    document.body.innerHTML = "";
  });

  it("iOS : uniquement le badge App Store", () => {
    render(<Telecharger appareil="ios" />);
    expect(screen.getByAltText("Télécharger dans l’App Store")).toBeTruthy();
    expect(screen.queryByAltText("Disponible sur Google Play")).toBeNull();
  });

  it("Android : uniquement le badge Google Play", () => {
    render(<Telecharger appareil="android" />);
    expect(screen.getByAltText("Disponible sur Google Play")).toBeTruthy();
    expect(screen.queryByText("Téléchargez l’app")).toBeNull();
  });

  it("ordinateur : le bloc QR", () => {
    render(<Telecharger appareil="desktop" />);
    expect(screen.getByText("Téléchargez l’app")).toBeTruthy();
    expect(screen.getByAltText(/QR code/)).toBeTruthy();
  });

  it("cartel mobile : icône, titre et badge du store de l’appareil", () => {
    render(<Telecharger appareil="android" flottant />);
    act(() => rappel(false));
    expect(screen.getByText("Téléchargez l’app")).toBeTruthy();
    expect(screen.getByAltText("Disponible sur Google Play")).toBeTruthy();
  });

  it("cartel QR : QR 112 px et consigne", () => {
    render(<Telecharger appareil="desktop" flottant />);
    act(() => rappel(false));
    expect(screen.getByAltText(/QR code/).getAttribute("width")).toBe("112");
    expect(screen.getByText(/Scannez ce code/)).toBeTruthy();
  });

  it("cartel : s’efface quand la fin de page est à l’écran", () => {
    document.body.innerHTML = '<section><div id="telecharger"></div></section>';
    const { container } = render(<Telecharger appareil="ios" flottant />);
    const cartel = container.firstElementChild!;
    act(() => rappel(false));
    expect(cartel.getAttribute("aria-hidden")).toBeNull();
    act(() => rappel(true));
    expect(cartel.getAttribute("aria-hidden")).toBe("true");
    expect(cartel.hasAttribute("inert")).toBe(true);
  });
});
