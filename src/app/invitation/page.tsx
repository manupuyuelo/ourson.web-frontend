import type { Metadata } from "next";
import { meta, partage } from "@/lib/seo";
import { SITE, storePublie } from "@/lib/site";
import { Invitation } from "./Invitation";

// Page relais de l’email d’invitation, hors sitemap et hors index (voir `src/lib/invitation.ts`).
export const metadata: Metadata = {
  ...meta({
    url: "/invitation",
    titre: "Votre invitation · Ourson",
    description:
      "Une invitation à rejoindre une famille sur Ourson, l’app des parents d’enfants de 0 à 3 ans\u00a0: ouvrez l’app ou téléchargez-la.",
    image: partage("accueil"),
  }),
  robots: { index: false, follow: false },
  // Bannière de l’App Store dans Safari (« Ouvrir » si l’app est là, « Obtenir » sinon), une fois la
  // fiche publique. L’app reçoit le lien et l’ouvre sur l’accueil (`ourson-app/app/+native-intent.tsx`).
  ...(storePublie(SITE.appStoreUrl) && {
    itunes: { appId: SITE.appStoreId, appArgument: `${SITE.url}/invitation` },
  }),
};

export default function Page() {
  return <Invitation />;
}
