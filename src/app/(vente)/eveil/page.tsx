import type { Metadata } from "next";
import { og } from "@/lib/seo";
import Image from "next/image";
import cacheCacheFoulard from "@/assets/echantillons/eveil/jeux/cache_cache_foulard.jpg";
import deuxPaniers from "@/assets/echantillons/eveil/jeux/deux_paniers.jpg";
import { ActivityRow, Icon, TrackCube, type Track } from "@/components/ds";
import { FinDePage } from "@/components/layout/FinDePage";
import p from "@/components/layout/Pilier.module.css";
import { Carrousel } from "@/components/site/Carrousel";
import { Carte } from "@/components/site/Carte";
import { OURS } from "@/lib/ours";
import ouEsTuDoudou from "@/assets/echantillons/eveil/histoires/ou_es_tu_doudou.jpg";
import { HistoirePerso } from "./HistoirePerso";
import s from "./eveil.module.css";

const TITRE = "L'accompagner dans son éveil, jour après jour";

export const metadata: Metadata = {
  title: TITRE,
  description:
    "Ourson suit ses progrès et vous propose chaque jour une activité qui l'aide là où il en est, avec ce que vous avez à la maison. Et le soir, une comptine et une histoire.",
  alternates: { canonical: "/eveil" },
  openGraph: og("/eveil"),
};

const PISTES: { id: Track; label: string; sub: string; rot: number }[] = [
  { id: "gross_motor", label: "Motricité", sub: "Tient assise", rot: -3 },
  { id: "fine_motor", label: "Mains", sub: "Passe d’une main à l’autre", rot: 3 },
  { id: "language", label: "Langage", sub: "Babille", rot: -3 },
  { id: "social", label: "Social", sub: "Joue à coucou", rot: 3 },
  { id: "cognitive", label: "Cognitif", sub: "Cherche l’objet caché", rot: -3 },
  { id: "autonomy", label: "Autonomie", sub: "Tient son biberon", rot: 3 },
];

export default function EveilPage() {
  return (
    <div className={`${p.page} ${s.eveil}`}>
      <section className={`${p.sec} ${p.hero} ${s.heroEveil}`} aria-labelledby="eveil-titre">
        <div className={`${p.txt} ${p.heroTxt}`}>
          <div className={`oDrop ${p.eyebrow}`} style={{ "--c": "var(--eveil-surface)", "--dur": ".6s" }}>
            Éveil
          </div>
          <h1 id="eveil-titre" className={`oDrop ${p.h1}`} style={{ "--d": ".1s" }}>
            {TITRE}
          </h1>
          <p className={`oDrop ${p.chapeau}`} style={{ "--d": ".25s" }}>
            Ourson suit ses progrès et vous propose chaque jour une activité qui l&apos;aide là où il en est,
            avec ce que vous avez à la maison. Et le soir, une comptine et une histoire.
          </p>
          <div className={`oDrop ${p.puces}`} style={{ "--d": ".35s" }}>
            <span>Ses progrès suivis</span>
            <span>Une activité par jour</span>
            <span>Histoires et berceuses</span>
          </div>
        </div>
        <div className={`oDrop ${p.vis} ${s.heroVis}`} style={{ "--d": ".45s", "--dur": ".8s" }}>
          <div className={s.photo}>
            <Image
              src={cacheCacheFoulard}
              placeholder="blur"
              alt=""
              sizes="(min-width: 900px) 460px, 370px"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className={s.idee}>
            <div className={s.ideeHaut}>
              <div className={s.ideeSurTitre}>Idée du jour · Léa, 8 mois</div>
              <div className={s.ideeDuree}>5 min · un foulard</div>
            </div>
            <div className={s.ideeTitre}>Cache-cache foulard</div>
            <div className={s.puce}>
              Léa commence à chercher l&apos;objet caché. Ce jeu l&apos;aide à comprendre qu&apos;un objet
              existe même quand elle ne le voit plus.
            </div>
          </div>
        </div>
        <Image
          src={OURS.eveil}
          alt=""
          className={`${p.bear} ${p.float} ${s.ours}`}
          style={{ "--r": "8deg" }}
          sizes="(min-width: 900px) 270px, 175px"
        />
      </section>

      <section className={`${p.sec} ${p.flip} ${s.jalonsSec}`} aria-labelledby="eveil-jalons">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--eveil)" }}>
            Les jalons
          </div>
          <h2 id="eveil-jalons" className={p.h2}>
            Ses progrès dans six domaines
          </h2>
          <p className={p.texte}>
            Motricité, mains, langage, social, cognitif, autonomie : vous cochez ce que votre enfant sait déjà
            faire. Ourson en déduit ce qu&apos;il apprend en ce moment, et choisit les activités qui
            l&apos;encouragent là où il en est.
          </p>
          <div className={s.sources}>
            <span className={s.sourcesIcone}>
              <Icon name="stethoscope" size={20} />
            </span>
            <p>
              Les jalons reprennent les repères de développement du CDC et de l&apos;American Academy of
              Pediatrics, cités dans l&apos;app.
            </p>
          </div>
        </div>
        <div className={`oReveal ${p.vis} ${s.jalons}`} style={{ "--r": "-1.5deg" }}>
          <h3 className={s.jalonsTitre}>Ce que Léa sait déjà faire</h3>
          <ul className={s.pistes}>
            {PISTES.map((t) => (
              <li key={t.id} className={s.piste}>
                <TrackCube track={t.id} size={64} rotate={t.rot} />
                <div className={s.pisteNom}>{t.label}</div>
                <div className={s.pisteAcquis}>{t.sub}</div>
              </li>
            ))}
          </ul>
          <div className={s.filet} />
          <div className={s.micro}>Pour l&apos;encourager cette semaine</div>
          <ActivityRow
            image={cacheCacheFoulard}
            title="Cache-cache foulard"
            meta="Social et émotions · 5 min"
            hint="Plutôt vers 6–12 mois"
            trailing="chevron"
            compact
          />
          <ActivityRow
            image={deuxPaniers}
            title="Deux paniers"
            meta="Mains · 10 min"
            trailing="chevron"
            compact
            last
          />
        </div>
      </section>

      <section className={`${p.wide} ${s.large} ${s.activites}`} aria-labelledby="eveil-activites">
        <div className={`oReveal ${s.pad} ${s.intro}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--eveil)" }}>
            Les activités
          </div>
          <h2 id="eveil-activites" className={p.h2}>
            Une activité par jour, avec ce que vous avez à la maison
          </h2>
          <p className={p.texte}>
            Un foulard, une bassine, du scotch : chaque activité est choisie selon son âge et ce qu&apos;il
            apprend en ce moment. Vous la faites, vous cochez, le foyer le voit.
          </p>
        </div>
        <div className={`oReveal ${s.marge}`}>
          <Carrousel set="jeux" label="Exemples d'activités" />
        </div>
        <p className={`${s.pad} ${s.total}`}>122 activités, à la maison comme dehors.</p>
      </section>

      <section className={`${p.sec} ${p.flip} ${p.plein} ${s.nuit}`} aria-labelledby="eveil-soir">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--sommeil-surface)" }}>
            Comptines et histoires
          </div>
          <h2 id="eveil-soir" className={p.h2}>
            Le soir, une comptine et une histoire
          </h2>
          <p className={`${p.texte} ${s.attenue}`}>
            En fin de journée, Ourson vous propose une berceuse et une histoire à raconter. L&apos;histoire
            reprend le prénom de votre enfant et le nom de son doudou.
          </p>
          <p className={`${p.texte} ${s.attenue}`}>
            Des comptines avec les paroles, les gestes et la mélodie pour les apprendre.
          </p>
          <div className={s.sansEcran}>
            Pas d&apos;écran pour votre enfant : c&apos;est vous qui jouez, chantez et racontez.
          </div>
        </div>
        <div className={`oReveal ${p.vis}`} style={{ "--r": "1.5deg" }}>
          <HistoirePerso
            illustration={
              <Image src={ouEsTuDoudou} alt="" sizes="(min-width: 900px) 480px, 390px" placeholder="blur" />
            }
          />
        </div>
      </section>

      <section className={`${p.wide} ${s.large} ${s.tight} ${s.nuit}`} aria-labelledby="eveil-ce-soir">
        <div className={`${s.pad} ${s.soirTitre}`}>
          <h2 id="eveil-ce-soir">Ce soir, au choix</h2>
          <p>107 comptines et 121 histoires.</p>
        </div>
        <div className={`oReveal ${s.marge}`}>
          <Carrousel set="soir" label="Comptines et histoires du soir" />
        </div>
      </section>

      <section className={`${p.sec} ${p.plein} ${s.carnet}`} aria-labelledby="eveil-famille">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--coral-surface)" }}>
            Toute la famille
          </div>
          <h2 id="eveil-famille" className={p.h2}>
            Ses premières fois, vues par tout le foyer
          </h2>
          <p className={p.texte}>
            Un carnet pour garder ses premières fois en photo. La nounou ou les grands-parents y ajoutent un
            souvenir de la journée, vous le découvrez le soir.
          </p>
        </div>
        <div className={`oReveal ${p.vis}`} style={{ "--r": "-1.5deg" }}>
          <Carte which="premiere" />
          <Carte which="notif" text="Inès a ajouté un souvenir au carnet de Léa." />
        </div>
      </section>

      <FinDePage page="eveil" />
    </div>
  );
}
