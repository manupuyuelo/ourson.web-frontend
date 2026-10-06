import { appareilDepuisUA } from "./device";
import { SITE } from "./site";

/** Destination du QR (/app) : le store de l’appareil, ou l’accueil tant que la fiche n’est pas publique. */
export function destinationStore(ua: string): string {
  const appareil = appareilDepuisUA(ua);
  const store = appareil === "ios" ? SITE.appStoreUrl : appareil === "android" ? SITE.playStoreUrl : "#";
  return store.startsWith("http") ? store : "/";
}
