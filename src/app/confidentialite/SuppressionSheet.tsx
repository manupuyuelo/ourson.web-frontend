"use client";

import { useEffect, useRef, type ReactNode } from "react";
import s from "./SuppressionSheet.module.css";

const HASH = "#suppression";

type Props = {
  /** id du titre de la feuille (rendu dans `entete`). */
  titreId: string;
  entete: ReactNode;
  children: ReactNode;
};

// Feuille « Suppression de compte », synchronisée avec #suppression (lien donné aux stores).
export function SuppressionSheet({ titreId, entete, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;

    const synchroniser = () => {
      if (location.hash === HASH) {
        if (!dialog.open) {
          dialog.showModal();
          document.body.style.overflow = "hidden";
        }
      } else if (dialog.open) {
        dialog.close();
      }
    };

    // Fermeture (✕, Échap, voile) : on débloque le corps et on retire le hash sans défiler.
    const surFermeture = () => {
      document.body.style.overflow = "";
      if (location.hash === HASH) history.replaceState(null, "", location.pathname + location.search);
    };

    // Liens #suppression : pas de nouvelle entrée d’historique (comme le prototype).
    const surClicLien = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!(e.target instanceof Element) || !e.target.closest(`a[href="${HASH}"]`)) return;
      e.preventDefault();
      history.replaceState(null, "", HASH);
      synchroniser();
    };

    // Clic sur le voile : la cible est le <dialog> lui-même (le contenu est dans un conteneur intérieur).
    // On vérifie aussi le pointerdown pour ne pas fermer à la fin d’une sélection de texte.
    let appuiSurVoile = false;
    const surAppui = (e: PointerEvent) => {
      appuiSurVoile = e.target === dialog;
    };
    const surClicVoile = (e: MouseEvent) => {
      if (e.target === dialog && appuiSurVoile) dialog.close();
      appuiSurVoile = false;
    };

    synchroniser();
    addEventListener("hashchange", synchroniser);
    document.addEventListener("click", surClicLien);
    dialog.addEventListener("close", surFermeture);
    dialog.addEventListener("pointerdown", surAppui);
    dialog.addEventListener("click", surClicVoile);
    return () => {
      removeEventListener("hashchange", synchroniser);
      document.removeEventListener("click", surClicLien);
      dialog.removeEventListener("close", surFermeture);
      dialog.removeEventListener("pointerdown", surAppui);
      dialog.removeEventListener("click", surClicVoile);
      if (dialog.open) dialog.close();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <dialog ref={ref} id="suppression" className={s.feuille} aria-labelledby={titreId}>
      <div className={s.contenu}>
        <div className={s.poignee} aria-hidden="true" />
        <div className={s.entete}>
          {entete}
          <button type="button" className={s.fermer} aria-label="Fermer" onClick={() => ref.current?.close()}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
