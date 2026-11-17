// Page relais de l’email d’invitation (`/invitation`). L’email de l’app y renvoie avec un fragment,
// `#email=…&lang=fr|en` : le fragment ne part jamais au serveur ni dans la mesure d’audience
// (GA4 lit l’URL sans lui). Quand l’app est installée, iOS et Android l’ouvrent directement
// (liens universels, `liens-universels.ts`) ; la page ne s’affiche que sinon.

export type Langue = "fr" | "en";

export type Invitation = { email: string | null; langue: Langue };

/** Une adresse plausible : une seule arobase, sans espace, un domaine avec un point. */
const ADRESSE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Le fragment porte-t-il une invitation (`email=` ou `lang=`) ? Sinon (`#contenu`…), on l’ignore. */
export function estInvitation(fragment: string): boolean {
  return /(^#?|&)(email|lang)=/.test(fragment);
}

/** Lit le fragment (`#email=…&lang=…`). Tout ce qui est mal formé est ignoré. */
export function lireInvitation(fragment: string): Invitation {
  const valeurs = new Map<string, string>();
  for (const paire of fragment.replace(/^#/, "").split("&")) {
    const i = paire.indexOf("=");
    if (i <= 0) continue;
    try {
      valeurs.set(paire.slice(0, i), decodeURIComponent(paire.slice(i + 1)).trim());
    } catch {
      // Séquence %… invalide : la valeur est ignorée.
    }
  }
  const email = valeurs.get("email");
  return {
    email: email && email.length <= 254 && ADRESSE.test(email) ? email : null,
    langue: valeurs.get("lang") === "en" ? "en" : "fr",
  };
}

/** Le schéma de l’app : l’inscription, adresse préremplie, ou l’app telle quelle sans adresse. */
export function lienApp(email: string | null): string {
  if (!email) return "ourson://";
  return `ourson://compte?email=${encodeURIComponent(email)}`;
}
