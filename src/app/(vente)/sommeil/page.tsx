import type { Metadata } from "next";
import Image from "next/image";
import { DayTimeline, h, Icon, SleepRow, TimelineAxis, TimelineLegend } from "@/components/ds";
import { FinDePage } from "@/components/layout/FinDePage";
import p from "@/components/layout/Pilier.module.css";
import { Carte } from "@/components/site/Carte";
import { OURS } from "@/lib/ours";
import s from "./sommeil.module.css";

export const metadata: Metadata = {
  title: "Comprenez enfin ses nuits",
  description:
    "Notez le coucher et chaque réveil en un geste, même à 3 h du matin. Ourson vous montre ce qui l'aide à mieux dormir, la nuit comme à la sieste.",
  alternates: { canonical: "/sommeil" },
  openGraph: { url: "/sommeil" },
};

// Ses 7 dernières nuits : jour, durée (h), nombre de réveils. La dernière est « aujourd'hui ».
const NUITS = [
  ["lun.", 10.2, 2],
  ["mar.", 10.6, 1],
  ["mer.", 9.8, 2],
  ["jeu.", 10.9, 1],
  ["ven.", 11.2, 0],
  ["sam.", 10.4, 1],
  ["auj.", 10.8, 1],
] as const;

const duree = (d: number) => `${Math.floor(d)} h ${String(Math.round((d % 1) * 60)).padStart(2, "0")}`;

const JOURS = [
  { label: "ven.", total: "12 h 40", segments: [h(0, 6.7), h(13.4, 14.3, true), h(20, 24)] },
  { label: "sam.", total: "13 h 05", segments: [h(0, 6.9), h(12.9, 14.4, true), h(19.9, 24)] },
  { label: "dim.", total: "12 h 20", segments: [h(0, 6.5), h(13.6, 14.4, true), h(20.1, 24)] },
  { label: "lun.", total: "13 h 15", segments: [h(0, 7), h(12.8, 14.4, true), h(19.8, 24)] },
  { label: "mar.", total: "12 h 50", segments: [h(0, 6.8), h(13.2, 14.3, true), h(19.9, 24)] },
  { label: "auj.", total: "11 h 32", segments: [h(0, 6.7), h(13.1, 13.8, true)], today: true },
];

const TAGS_SIESTE = [{ label: "Chez Mamie", tone: "green" }] as const;

export default function SommeilPage() {
  return (
    <div className={p.page}>
      <section className={`${p.sec} ${p.hero} ${s.hero}`} aria-labelledby="sommeil-titre">
        <div className={`${p.txt} ${p.heroTxt}`}>
          <div className={`oDrop ${p.eyebrow}`} style={{ "--c": "var(--sommeil-surface)", "--dur": ".6s" }}>
            Sommeil
          </div>
          <h1 id="sommeil-titre" className={`oDrop ${p.h1}`} style={{ "--d": ".1s" }}>
            Comprenez enfin ses nuits
          </h1>
          <p className={`oDrop ${p.chapeau}`} style={{ "--d": ".25s" }}>
            Notez le coucher et chaque réveil en un geste, même à 3 h du matin. Ourson vous montre ce qui
            l&apos;aide à mieux dormir, la nuit comme à la sieste.
          </p>
          <div className={`oDrop ${p.puces}`} style={{ "--d": ".35s" }}>
            <span>Ses nuits en un coup d&apos;œil</span>
            <span>Ses propres repères</span>
            <span>Partagé avec le foyer</span>
          </div>
        </div>
        <div className={`oDrop ${p.vis} ${s.heroVis}`} style={{ "--d": ".45s", "--dur": ".8s" }}>
          <div className={s.nuits}>
            <div className={s.tete}>
              <div className={s.teteTitre}>Ses 7 dernières nuits</div>
              <div className={s.teteMeta}>Léa, 8 mois</div>
            </div>
            <div className={s.barres}>
              {NUITS.map(([j, d, r], i) => (
                <div key={j} className={i === NUITS.length - 1 ? `${s.nuit} ${s.auj}` : s.nuit}>
                  <div className={s.nuitDuree}>{duree(d)}</div>
                  <div className={s.nuitPiste}>
                    <div className={s.barre} style={{ "--h": `${Math.round(((d - 7) / 5) * 100)}%` }}>
                      {Array.from({ length: r }, (_, k) => (
                        <span key={k} />
                      ))}
                    </div>
                  </div>
                  <div className={s.nuitJour}>{j}</div>
                </div>
              ))}
            </div>
            <div className={s.legende}>
              <span>
                <span className={s.carre} />
                Durée de la nuit
              </span>
              <span>
                <span className={s.point} />
                Un réveil
              </span>
            </div>
          </div>
        </div>
        <Image
          src={OURS.sommeil}
          alt=""
          className={`${p.bear} ${p.float} ${s.bear}`}
          sizes="(min-width: 900px) 200px, 140px"
          loading="eager"
          fetchPriority="high"
        />
      </section>

      <section className={p.sec} aria-labelledby="sommeil-nuits">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--sommeil)" }}>
            Les nuits
          </div>
          <h2 id="sommeil-nuits" className={p.h2}>
            Le matin, sa nuit en un coup d&apos;œil
          </h2>
          <p className={p.texte}>
            Un réveil en pleine nuit se note en un geste, sur un écran sombre qui ne réveille personne. Au
            matin, vous voyez combien de temps il a dormi, combien de fois il s&apos;est réveillé et qui
            s&apos;est levé.
          </p>
          <p className={p.texte}>
            Nuit après nuit, Ourson repère ce qui les allonge&nbsp;: l&apos;heure du coucher, la dernière
            sieste.
          </p>
        </div>
        <div className={`oReveal ${p.vis} ${s.carte} ${s.carteNuit}`} style={{ "--r": "1.5deg" }}>
          <div className={s.tete}>
            <div className={s.teteTitre}>Cette nuit · Léa</div>
            <div className={s.teteMeta}>10 h 50</div>
          </div>
          <div className={s.ligne}>
            <SleepRow
              kind="night"
              eyebrow="Nuit · 1 réveil"
              title="Nuit"
              times="19 h 50 → 6 h 40"
              duration="10 h 50"
              by="Maman"
              byIndex={1}
            />
          </div>
          <div className={s.reveil}>
            <span>Réveil à 3 h 12 · Papa</span>
            <span className={s.reveilDuree}>14 min</span>
          </div>
          <Carte
            which="observation"
            text={"Pour Léa, quand le coucher a lieu avant 20\u00a0h, la nuit dure 40\u00a0min de plus."}
          />
        </div>
      </section>

      <section className={`${p.sec} ${p.flip} ${s.tint}`} aria-labelledby="sommeil-suivi">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--sommeil)" }}>
            Le suivi
          </div>
          <h2 id="sommeil-suivi" className={p.h2}>
            Un geste pour le coucher, un geste pour le réveil
          </h2>
          <p className={p.texte}>
            Qui l&apos;a couché, où, à quelle heure : tout est noté d&apos;une main, par celui qui est avec
            lui. Vous êtes au travail ? Vous savez quand Mamie a couché Noé, et combien de temps il a dormi.
          </p>
        </div>
        <div className={`oReveal ${p.vis} ${s.carte} ${s.carteSuivi}`} style={{ "--r": "-1.5deg" }}>
          <div className={`${s.tete} ${s.teteSimple}`}>
            <div className={s.teteTitre}>Aujourd&apos;hui · Noé</div>
            <div className={`${s.teteMeta} ${s.enCours}`}>
              <span className={s.pulse} aria-hidden="true" />
              En cours
            </div>
          </div>
          <div className={s.ligne}>
            <SleepRow
              kind="night"
              eyebrow="Nuit · 1 réveil"
              title="Nuit"
              times="19 h 50 → 6 h 40"
              duration="10 h 50"
              by="Papa"
              byIndex={0}
            />
          </div>
          <div className={s.ligne}>
            <SleepRow
              kind="nap"
              eyebrow="Sieste en cours"
              title="Sieste"
              times="Couché à 13 h 05"
              duration="0 h 42"
              by="Mamie"
              byIndex={2}
              running
              tags={TAGS_SIESTE}
            />
          </div>
          {/* Aperçu de l'écran de l'app : bouton factice, non interactif. */}
          <div className={s.cta}>Réveil de Noé</div>
        </div>
      </section>

      <section className={p.sec} aria-labelledby="sommeil-moment">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--sommeil)" }}>
            Le bon moment
          </div>
          <h2 id="sommeil-moment" className={p.h2}>
            La prochaine sieste, avant qu&apos;il ne soit trop tard
          </h2>
          <p className={p.texte}>
            L&apos;heure probable de sa prochaine sieste, calculée sur ses 14 derniers jours. Une plage, pas
            une alarme : vous couchez votre enfant quand il est prêt, et ses nuits en profitent.
          </p>
        </div>
        <div className={`oReveal ${p.vis} ${s.carte} ${s.carteJours}`} style={{ "--r": "1.5deg" }}>
          <div className={`${s.tete} ${s.teteSimple} ${s.teteJours}`}>
            <div className={s.teteTitre}>Ses 14 derniers jours</div>
            <div className={s.teteMeta}>Noé, 2 ans</div>
          </div>
          {JOURS.map((j) => (
            <DayTimeline
              key={j.label}
              label={j.label}
              segments={j.segments}
              total={j.total}
              today={j.today}
            />
          ))}
          <TimelineAxis />
          <TimelineLegend />
          <div className={s.jour}>
            <Carte which="jour" />
          </div>
        </div>
      </section>

      <section className={`${p.sec} ${p.flip} ${s.tint}`} aria-labelledby="sommeil-reperes">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--sommeil)" }}>
            Ses repères
          </div>
          <h2 id="sommeil-reperes" className={p.h2}>
            Ce qui l&apos;aide à bien dormir, lui
          </h2>
          <p className={p.texte}>
            Ourson compare ses propres nuits et siestes entre elles : l&apos;heure, le lieu, l&apos;adulte qui
            le couche. Puis vous propose un essai de 7 jours pour tester un nouvel horaire et voir ce qui
            change.
          </p>
          <div className={s.sources}>
            <span className={s.sourcesIcone}>
              <Icon name="stethoscope" size={20} />
            </span>
            <div className={s.sourcesTexte}>
              Des repères appuyés sur les recommandations de l&apos;American Academy of Pediatrics, de la HAS
              et de Santé publique France, toutes citées dans l&apos;app.
            </div>
          </div>
        </div>
        <div className={`oReveal ${p.vis}`} style={{ "--r": "-1.5deg" }}>
          <Carte which="observation" />
          <div className={s.essai}>
            <div className={s.essaiTete}>
              <div className={s.essaiTitre}>Coucher Noé avant 13 h</div>
              <Carte which="essai" />
            </div>
            <div className={s.essaiGrille}>
              <div className={s.essaiCol}>
                <div className={s.essaiLabel}>Avant</div>
                <div className={s.jauge}>
                  <div className={s.jaugeAvant} />
                </div>
                <div className={s.essaiValeur}>50 min</div>
              </div>
              <div className={`${s.essaiCol} ${s.essaiApres}`}>
                <div className={s.essaiLabel}>Jours 1 à 3</div>
                <div className={s.jauge}>
                  <div className={s.jaugeApres} />
                </div>
                <div className={s.essaiValeur}>1 h 25</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${p.sec} ${p.plein} ${s.foyer}`} aria-labelledby="sommeil-foyer">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--coral-surface)" }}>
            Toute la famille
          </div>
          <h2 id="sommeil-foyer" className={`${p.h2} ${s.foyerTitre}`}>
            Ce que l&apos;un note, les autres le voient aussitôt
          </h2>
          <p className={`${p.texte} ${s.foyerTexte}`}>
            Invitez l&apos;autre parent, la nounou ou les grands-parents. Quand l&apos;un d&apos;eux note une
            sieste, tout le monde le voit aussitôt, et les repères d&apos;Ourson tiennent compte de toutes les
            siestes, chez qui qu&apos;elles aient eu lieu.
          </p>
        </div>
        <div className={`${p.vis} ${s.notifs}`}>
          <div className="oReveal" style={{ "--r": "-1.5deg" }}>
            <Carte which="notif" text="Noé s'est réveillé à 14 h 40, après 1 h 35 de sommeil." />
          </div>
          <div className="oReveal" style={{ "--r": "1.5deg" }}>
            <Carte which="notif" text="Noé dort depuis 13 h 05 (Mamie)." />
          </div>
          <div className="oReveal" style={{ "--r": "-1deg" }}>
            <Carte which="notif" text="Mamie a rejoint votre foyer." />
          </div>
        </div>
      </section>

      <FinDePage page="sommeil" />
    </div>
  );
}
