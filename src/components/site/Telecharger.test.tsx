// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Telecharger } from "./Telecharger";

describe("Telecharger", () => {
  afterEach(cleanup);

  it("iOS : uniquement le badge App Store", () => {
    render(<Telecharger appareil="ios" />);
    expect(screen.getByAltText("Télécharger dans l'App Store")).toBeTruthy();
    expect(screen.queryByAltText("Disponible sur Google Play")).toBeNull();
  });

  it("Android : uniquement le badge Google Play", () => {
    render(<Telecharger appareil="android" />);
    expect(screen.getByAltText("Disponible sur Google Play")).toBeTruthy();
    expect(screen.queryByText("Téléchargez l'app")).toBeNull();
  });

  it("ordinateur : le bloc QR", () => {
    render(<Telecharger appareil="desktop" />);
    expect(screen.getByText("Téléchargez l'app")).toBeTruthy();
    expect(screen.getByAltText(/QR code/)).toBeTruthy();
  });
});
