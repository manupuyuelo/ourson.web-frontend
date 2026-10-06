"use client";

import Script from "next/script";
import { SITE } from "@/lib/site";
import { useConsentement } from "./consent";

/** GTM n'est chargé qu'après acceptation (Consent Mode « basic ») : aucune requête Google avant. */
export function Gtm() {
  if (useConsentement() !== "accepte") return null;
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
gtag('consent','update',{analytics_storage:'granted'});
dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${SITE.gtmId}';document.head.appendChild(s);`}
    </Script>
  );
}
