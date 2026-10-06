import Script from "next/script";
import { SITE } from "@/lib/site";

/**
 * GTM est chargé dès l'arrivée (Consent Mode v2 avancé) : le consentement par défaut, tout refusé,
 * est posé avant par CONSENT_SCRIPT dans le <head>. Sans accord, Google ne reçoit que des pings
 * sans cookie, qui servent à modéliser les conversions.
 */
export function Gtm() {
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${SITE.gtmId}';document.head.appendChild(s);`}
    </Script>
  );
}
