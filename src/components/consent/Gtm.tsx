import Script from "next/script";
import { SITE } from "@/lib/site";

/** Délai maximal avant le chargement de GTM sans interaction du visiteur. */
const GTM_DELAI_MS = 3000;

/**
 * GTM (Consent Mode v2 avancé) : le consentement par défaut, tout refusé, est posé avant par
 * CONSENT_SCRIPT dans le <head>. Sans accord, Google ne reçoit que des pings sans cookie (modélisation).
 *
 * Chargement différé à la première interaction (défilement, toucher, clavier) ou après 3 s : sur un
 * téléphone modeste, GTM et GA4 bloquent sinon le fil principal ~700 ms pendant le chargement (TBT).
 * Rien n'est perdu : ce qui est poussé dans le dataLayer avant (consentement, clics vers les stores)
 * est traité dans l'ordre à l'arrivée de GTM. Seules les visites de moins de 3 s sans interaction
 * ne sont pas comptées.
 */
export function Gtm() {
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(){var fait=false,ev=["scroll","pointerdown","keydown","touchstart"];
function charger(){if(fait)return;fait=true;ev.forEach(function(e){removeEventListener(e,charger)});
window.dataLayer=window.dataLayer||[];dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${SITE.gtmId}';document.head.appendChild(s);}
ev.forEach(function(e){addEventListener(e,charger,{passive:true})});setTimeout(charger,${GTM_DELAI_MS});})();`}
    </Script>
  );
}
