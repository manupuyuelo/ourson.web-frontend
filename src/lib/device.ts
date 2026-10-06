export type Appareil = "ios" | "android" | "desktop";

/** Repris du handoff (ourson-site.js) : l'iPad qui se présente comme un Mac compte comme iOS. */
export function detectDevice(): Appareil {
  const ua = navigator.userAgent;
  const ipadAsMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || ipadAsMac) return "ios";
  if (/Android|Mobile|Tablet|webOS|BlackBerry|Windows Phone/i.test(ua)) return "android";
  return "desktop";
}
