/** Store visé par un clic de téléchargement. */
export type Store = "app_store" | "google_play";

/** Bloc de téléchargement d'où part le clic. */
export type Emplacement = "hero" | "cartel" | "fin" | "menu";

/**
 * Clic vers un store : événement `ourson_store` dans le dataLayer, pour en faire une conversion dans GTM
 * (GA4, Google Ads). Le consentement est respecté par les balises elles-mêmes (Consent Mode).
 */
export function suivreStore(store: Store, emplacement: Emplacement) {
  (window.dataLayer ??= []).push({ event: "ourson_store", store, emplacement });
}
