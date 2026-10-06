"use client";

import { useSyncExternalStore } from "react";
import { CONSENT_DUREE, CONSENT_KEY } from "./config";

export type Choix = "accepte" | "refuse";

const KEY = CONSENT_KEY;
const EVENT = "ourson-consentement";
const DUREE = CONSENT_DUREE;

type Stocke = { choix: Choix; le: number };

function lire(): Choix | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v: unknown = JSON.parse(raw);
    if (typeof v !== "object" || v === null || !("choix" in v) || !("le" in v)) return null;
    if (typeof v.le !== "number" || Date.now() - v.le > DUREE) return null;
    return v.choix === "accepte" || v.choix === "refuse" ? v.choix : null;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** undefined côté serveur, null tant qu'aucun choix n'est fait. */
export function useConsentement(): Choix | null | undefined {
  return useSyncExternalStore(subscribe, lire, () => undefined);
}

export function enregistrer(choix: Choix | null) {
  const avant = lire();
  try {
    if (choix) localStorage.setItem(KEY, JSON.stringify({ choix, le: Date.now() } satisfies Stocke));
    else localStorage.removeItem(KEY);
  } catch {
    // stockage indisponible : le choix vaut pour la page en cours
  }
  if (choix) document.documentElement.dataset.consent = choix;
  else delete document.documentElement.dataset.consent;
  window.dispatchEvent(new Event(EVENT));
  // Retrait du consentement : GTM est déjà chargé, on efface ses cookies et on repart d'une page propre.
  if (avant === "accepte" && choix !== "accepte") {
    for (const c of document.cookie.split(";")) {
      const nom = c.split("=")[0]?.trim();
      if (nom && /^(_ga|_gid|_gat|_gcl)/.test(nom)) {
        const domaine = location.hostname.replace(/^www\./, "");
        document.cookie = `${nom}=; Max-Age=0; path=/`;
        document.cookie = `${nom}=; Max-Age=0; path=/; domain=.${domaine}`;
      }
    }
    location.reload();
  }
}
