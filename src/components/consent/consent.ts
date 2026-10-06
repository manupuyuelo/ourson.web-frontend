"use client";

import { useSyncExternalStore } from "react";
import { CONSENT_DUREE, CONSENT_KEY, CONSENT_VERSION } from "./config";

/** audience → GA4 (analytics_storage) ; pub → mesure des campagnes Google Ads (ad_*). */
export type Consentement = { audience: boolean; pub: boolean };

type Stocke = Consentement & { date: string; version: number };

declare global {
  interface Window {
    dataLayer?: unknown[];
    oursonCookies?: { open: () => void };
  }
}

const EVENT = "ourson-cookies";

/** Valide un choix stocké : bonne version, moins de 6 mois. */
export function valider(raw: string | null, maintenant = Date.now()): Consentement | null {
  if (!raw) return null;
  try {
    const v: unknown = JSON.parse(raw);
    if (typeof v !== "object" || v === null) return null;
    const { audience, pub, date, version } = v as Partial<Stocke>;
    if (version !== CONSENT_VERSION || typeof date !== "string") return null;
    if (!(maintenant - Date.parse(date) < CONSENT_DUREE)) return null;
    return { audience: audience === true, pub: pub === true };
  } catch {
    return null;
  }
}

// useSyncExternalStore exige un instantané stable : on le recalcule seulement si le stockage change.
let dernierRaw: string | null | undefined;
let dernier: Consentement | null = null;

/** Choix valide enregistré (lecture directe, hors rendu React). */
export function lire(): Consentement | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(CONSENT_KEY);
  } catch {
    // stockage indisponible : aucun choix
  }
  if (raw !== dernierRaw) {
    dernierRaw = raw;
    dernier = valider(raw);
  }
  return dernier;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** undefined côté serveur et pendant l’hydratation, null tant qu’aucun choix valide n’existe. */
export function useConsentement(): Consentement | null | undefined {
  return useSyncExternalStore(subscribe, lire, () => undefined);
}

function gtag(..._args: unknown[]) {
  // gtag.js attend l’objet arguments lui-même, pas un tableau.
  // oxlint-disable-next-line prefer-rest-params
  (window.dataLayer ??= []).push(arguments);
}

const g = (b: boolean) => (b ? "granted" : "denied");

export function enregistrer(c: Consentement) {
  const avant = lire();
  const v: Stocke = { ...c, date: new Date().toISOString(), version: CONSENT_VERSION };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(v));
  } catch {
    // stockage indisponible : le choix vaut pour la page en cours
  }
  gtag("consent", "update", {
    analytics_storage: g(c.audience),
    ad_storage: g(c.pub),
    ad_user_data: g(c.pub),
    ad_personalization: g(c.pub),
  });
  (window.dataLayer ??= []).push({ event: "ourson_consent", audience: c.audience, pub: c.pub });
  document.documentElement.dataset.consent = "";
  // Retrait : Google cesse d’écrire, on efface ce qu’il a déjà déposé.
  if (avant?.audience && !c.audience) effacer(/^(_ga|_gid|_gat)/);
  if (avant?.pub && !c.pub) effacer(/^(_gcl|_gac)/);
  window.dispatchEvent(new Event(EVENT));
}

function effacer(motif: RegExp) {
  const domaine = location.hostname.replace(/^www\./, "");
  for (const c of document.cookie.split(";")) {
    const nom = c.split("=")[0]?.trim();
    if (nom && motif.test(nom)) {
      document.cookie = `${nom}=; Max-Age=0; path=/`;
      document.cookie = `${nom}=; Max-Age=0; path=/; domain=.${domaine}`;
    }
  }
}
