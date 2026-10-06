"use client";

import { enregistrer } from "./consent";

export function GererCookies() {
  return (
    <button type="button" onClick={() => enregistrer(null)}>
      Gérer les cookies
    </button>
  );
}
