"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Switch } from "@/components/ds";
import { OURS } from "@/lib/ours";
import { enregistrer, lire, useConsentement, type Consentement } from "./consent";
import s from "./ConsentBanner.module.css";

const SORTIE_MS = 350;

/**
 * Bandeau « Miam, des cookies ! » (handoff : Cookies.dc.html).
 * Rendu dès le HTML statique ; le script du <head> le masque en CSS si un choix valide existe.
 * Tout lien href="#cookies" (pied de page, menu) ou window.oursonCookies.open() le rouvre sur le détail.
 */
export function ConsentBanner() {
  const choix = useConsentement();
  // Rouvert par l’utilisateur alors qu’un choix existe déjà.
  const [rouvert, setRouvert] = useState(false);
  const [sortie, setSortie] = useState(false);
  const [detail, setDetail] = useState(false);
  const [audience, setAudience] = useState(false);
  const [pub, setPub] = useState(false);
  const racine = useRef<HTMLDialogElement>(null);
  const declencheur = useRef<HTMLElement | null>(null);
  const minuteur = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const ouvrir = () => {
      clearTimeout(minuteur.current);
      declencheur.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const actuel = lire();
      setAudience(actuel?.audience ?? false);
      setPub(actuel?.pub ?? false);
      setDetail(true);
      setSortie(false);
      setRouvert(true);
    };
    const onClick = (e: MouseEvent) => {
      const lien = e.target instanceof Element ? e.target.closest('a[href="#cookies"]') : null;
      if (!lien) return;
      e.preventDefault();
      ouvrir();
    };
    document.addEventListener("click", onClick);
    window.oursonCookies = { open: ouvrir };
    return () => {
      document.removeEventListener("click", onClick);
      delete window.oursonCookies;
      clearTimeout(minuteur.current);
    };
  }, []);

  const fermer = useCallback(() => {
    setSortie(true);
    minuteur.current = setTimeout(() => {
      setRouvert(false);
      setSortie(false);
      setDetail(false);
      declencheur.current?.focus();
      declencheur.current = null;
    }, SORTIE_MS);
  }, []);

  // Rouvert : le focus entre dans le bandeau.
  useEffect(() => {
    if (rouvert && !sortie) racine.current?.focus();
  }, [rouvert, sortie]);

  // Rouvert : Échap ferme sans changer le choix, et Tab reste dans le bandeau.
  useEffect(() => {
    const el = racine.current;
    if (!el || !rouvert) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        fermer();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = el.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]");
      const premier = focusables[0];
      const dernier = focusables[focusables.length - 1];
      if (e.shiftKey && (document.activeElement === premier || document.activeElement === el)) {
        e.preventDefault();
        dernier?.focus();
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault();
        premier?.focus();
      }
    };
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [rouvert, fermer]);

  const choisir = (c: Consentement) => {
    enregistrer(c);
    fermer();
  };

  // Un choix existe et le bandeau n’est pas rouvert : rien à afficher (sauf pendant la sortie).
  const visible = choix === undefined || choix === null || rouvert || sortie;
  if (!visible) return null;

  const classes = [s.banner, choix !== undefined && s.hydrate, sortie && s.sortie].filter(Boolean).join(" ");

  return (
    // <dialog open> non modal : la page reste utilisable, refuser est aussi simple qu’accepter.
    <dialog ref={racine} open className={classes} aria-labelledby="ck-titre" tabIndex={-1}>
      <Image src={OURS.repas} alt="" className={s.ours} sizes="92px" />
      <div className={s.carte}>
        <h2 id="ck-titre" className={s.titre}>
          Miam, des cookies&#8239;!
        </h2>
        <p className={s.texte}>
          On aimerait en grignoter quelques-uns pour savoir quelles pages vous régalent et améliorer le site.
          C’est vous qui choisissez ce qu’il y a dans l’assiette.
        </p>

        {detail && (
          <div className={s.detail}>
            <div className={s.ligne}>
              <div className={s.ligneTexte}>
                <div className={s.ligneTitre}>Les essentiels</div>
                <div className={s.ligneDesc}>
                  Le minimum pour que le site tienne debout, dont le souvenir de votre choix.
                </div>
              </div>
              <span className={s.toujours}>Toujours au menu</span>
            </div>
            <div className={s.ligne}>
              <div className={s.ligneTexte}>
                <div className={s.ligneTitre}>Mesure d’audience</div>
                <div className={s.ligneDesc}>
                  Pour compter les visites et voir ce qui plaît (Google Analytics).
                </div>
              </div>
              <Switch value={audience} onChange={setAudience} label="Mesure d’audience" />
            </div>
            <div className={s.ligne}>
              <div className={s.ligneTexte}>
                <div className={s.ligneTitre}>Publicité</div>
                <div className={s.ligneDesc}>
                  Pour savoir si nos annonces sur d’autres sites vous ont menés jusqu’ici.
                </div>
              </div>
              <Switch value={pub} onChange={setPub} label="Publicité" />
            </div>
          </div>
        )}

        <div className={s.boutons}>
          <Button variant="ghost" size="sm" onClick={() => choisir({ audience: false, pub: false })}>
            {detail ? "Tout refuser" : "Non merci"}
          </Button>
          <Button
            size="sm"
            onClick={() => choisir(detail ? { audience, pub } : { audience: true, pub: true })}
          >
            {detail ? "Valider mes choix" : "Miam, j’accepte"}
          </Button>
        </div>
        <div className={s.bas}>
          <button
            type="button"
            className={s.basculer}
            aria-expanded={detail}
            onClick={() => setDetail((d) => !d)}
          >
            {detail ? "Masquer le détail" : "Choisir mes cookies"}
          </button>
          <Link href="/confidentialite#cookies-audience" className={s.savoir}>
            En savoir plus
          </Link>
        </div>
      </div>
    </dialog>
  );
}
