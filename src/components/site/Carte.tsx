import Image from "next/image";
import { Icon } from "@/components/ds";
import appIcon from "@/assets/icon.png";
import s from "./Carte.module.css";

// Morceaux d’écran de l’app recomposés (handoff : Carte.dc.html), textes du § 6 du socle.
type Props =
  | { which: "notif"; text: string }
  | { which: "observation"; text?: string }
  | { which: "prochain" | "parts" | "jour" | "essai" | "premiere" };

const OBSERVATION =
  "Pour Noé, quand la sieste commence avant 13 h, elle dure 1 h 30\u202f; après 13 h, 50 min.";

export function Carte(props: Props) {
  switch (props.which) {
    case "notif":
      return (
        <div className={`${s.carte} ${s.notif}`}>
          <Image src={appIcon} alt="" width={40} height={40} sizes="40px" className={s.notifIcon} />
          <div className={s.notifBody}>
            <div className={s.notifMeta}>Ourson · à l’instant</div>
            <div className={s.notifText}>{props.text}</div>
          </div>
        </div>
      );
    case "prochain":
      return (
        <div className={`${s.carte} ${s.blanche} ${s.prochain}`}>
          <div className={s.micro} style={{ color: "var(--repas)" }}>
            Prochain repas
          </div>
          <div className={s.titre}>Poêlée de betterave, boulgour et poulet au cumin</div>
          <div className={s.pastille}>Décliné pour 2 enfants</div>
        </div>
      );
    case "parts":
      return (
        <div className={`${s.carte} ${s.blanche} ${s.parts}`}>
          <div className={s.titre}>Les parts des enfants</div>
          <div className={s.muted}>Prélevez 150 g de plat par enfant avant d’assaisonner.</div>
          <div className={s.filet} />
          <div className={s.enfant}>
            <div className={s.avatar} style={{ background: "var(--coral-tint)", color: "var(--coral-ink)" }}>
              L
            </div>
            <div className={s.enfantTexte}>
              <div className={s.enfantNom}>Léa · Écrasé fin</div>
              <div className={s.enfantNote}>Écrasez sa part finement à la fourchette.</div>
            </div>
          </div>
          <div className={`${s.enfant} ${s.enfantCentre}`}>
            <div
              className={s.avatar}
              style={{ background: "var(--sommeil-tint)", color: "var(--sommeil-ink)" }}
            >
              N
            </div>
            <div className={s.enfantNom}>Noé · Morceaux 1 cm</div>
          </div>
        </div>
      );
    case "jour":
      return (
        <div className={`${s.carte} ${s.jour}`}>
          <div className={s.jourTitre}>Éveillé depuis 2 h 06</div>
          <div className={s.jourTexte}>
            Prochaine sieste probablement entre 13 h 10 et 13 h 50, d’après 14 jours notés.
          </div>
        </div>
      );
    case "observation":
      return (
        <div className={`${s.carte} ${s.observation}`}>
          <div className={s.puce} />
          <div className={s.observationTexte}>{props.text ?? OBSERVATION}</div>
        </div>
      );
    case "essai":
      return (
        <div className={s.essai}>
          <span />
          Essai · jour 3 sur 7
        </div>
      );
    case "premiere":
      return (
        <div className={`${s.carte} ${s.blanche} ${s.premiere}`}>
          <div className={s.photo}>
            <Icon name="camera" size={32} />
            Photo de l’enfant
          </div>
          <div className={s.premiereBas}>
            <span />
            <div className={s.titre}>Une première fois&#8239;!</div>
          </div>
        </div>
      );
    default: {
      const inconnu: never = props;
      return inconnu;
    }
  }
}
