export type Appareil = "ios" | "android" | "desktop";

/**
 * Repris du handoff (ourson-site.js) : l’iPad qui se présente comme un Mac compte comme iOS.
 * Côté serveur (route /app), maxTouchPoints est inconnu : cet iPad-là passe pour un ordinateur.
 */
export function appareilDepuisUA(ua: string, maxTouchPoints = 0): Appareil {
  const ipadAsMac = /Macintosh/.test(ua) && maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || ipadAsMac) return "ios";
  if (/Android|Mobile|Tablet|webOS|BlackBerry|Windows Phone/i.test(ua)) return "android";
  return "desktop";
}

export function detectDevice(): Appareil {
  return appareilDepuisUA(navigator.userAgent, navigator.maxTouchPoints);
}
