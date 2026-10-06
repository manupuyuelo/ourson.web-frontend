export const CONSENT_KEY = "ourson-cookies";
/** Clé de la première version du bandeau (choix unique accepte / refuse), supprimée au chargement. */
export const CONSENT_KEY_V0 = "ourson-consentement";
/** À incrémenter quand les finalités changent : le bandeau est alors proposé de nouveau. */
export const CONSENT_VERSION = 1;
export const CONSENT_DUREE = 1000 * 60 * 60 * 24 * 182; // 6 mois, recommandation CNIL

/**
 * Script inline du <head>, avant GTM (Consent Mode v2 avancé) :
 * tout est refusé par défaut, puis un choix encore valide est appliqué aussitôt.
 * data-consent masque le bandeau en CSS avant le premier rendu, sans clignotement.
 */
export const CONSENT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);
try{localStorage.removeItem(${JSON.stringify(CONSENT_KEY_V0)});var v=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)})||"null");
if(v&&v.version===${CONSENT_VERSION}&&Date.now()-Date.parse(v.date)<${CONSENT_DUREE}){var g=function(b){return b?'granted':'denied'};
gtag('consent','update',{analytics_storage:g(v.audience),ad_storage:g(v.pub),ad_user_data:g(v.pub),ad_personalization:g(v.pub)});
document.documentElement.dataset.consent=''}}catch(e){}`;
