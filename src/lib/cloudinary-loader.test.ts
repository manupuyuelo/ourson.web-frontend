import { describe, expect, it } from "vitest";
import { cloudinaryLoader } from "./cloudinary-loader";

const BASE = "https://res.cloudinary.com/djfrwyodt/image/upload/";

describe("cloudinaryLoader", () => {
  it("ajoute format, qualité et largeur en conservant le segment de version", () => {
    expect(cloudinaryLoader({ src: `${BASE}q_auto/v1686920217/a.jpg`, width: 640 })).toBe(
      `${BASE}f_auto,q_auto,w_640,c_limit/v1686920217/a.jpg`,
    );
  });

  it("fonctionne aussi sans transformation d'origine", () => {
    expect(cloudinaryLoader({ src: `${BASE}a.jpg`, width: 1080, quality: 90 })).toBe(
      `${BASE}f_auto,q_auto,w_1080,c_limit/a.jpg`,
    );
  });
});
