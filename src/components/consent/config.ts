export const CONSENT_KEY = "ourson-consentement";
export const CONSENT_DUREE = 1000 * 60 * 60 * 24 * 182; // 6 mois, recommandation CNIL

/** Script inline du <head> : pose data-consent avant le premier rendu pour masquer le bandeau sans clignotement. */
export const CONSENT_SCRIPT = `try{var v=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)})||"null");if(v&&typeof v.le==="number"&&Date.now()-v.le<${CONSENT_DUREE}&&(v.choix==="accepte"||v.choix==="refuse"))document.documentElement.dataset.consent=v.choix}catch(e){}`;
