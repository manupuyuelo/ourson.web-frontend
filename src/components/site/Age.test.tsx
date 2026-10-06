// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Age } from "./Age";

describe("Age", () => {
  afterEach(cleanup);

  it("change d'âge au clic et ne garde qu'une puce active", () => {
    render(<Age />);
    const puree = screen.getByRole("button", { name: "Dès 4 mois : purée lisse" });
    expect(screen.getByRole("button", { name: "Le plat des parents" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
    fireEvent.click(puree);
    expect(puree.getAttribute("aria-pressed")).toBe("true");
    expect(
      screen.getAllByRole("button").filter((b) => b.getAttribute("aria-pressed") === "true"),
    ).toHaveLength(1);
  });
});
