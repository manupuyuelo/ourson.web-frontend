import { describe, expect, it } from "vitest";
import { fill, HISTOIRE } from "./data";

describe("fill", () => {
  it("remplace prénom et doudou", () => {
    expect(fill("{prenom} serre {doudou}.", "Noé", "Nounours")).toBe("Noé serre Nounours.");
  });

  it("retombe sur Léa et Pompon si les champs sont vides", () => {
    expect(fill(HISTOIRE[0]![0], "", "")).toBe(
      "Ce soir, Léa et Pompon écoutent la mer. Qui chante tout au fond\u202f?",
    );
  });
});
