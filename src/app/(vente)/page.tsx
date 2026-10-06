import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TrackCube, type Track } from "@/components/ds";
import { FinDePage } from "@/components/layout/FinDePage";
import { Age } from "@/components/site/Age";
import { Carte } from "@/components/site/Carte";
import { Telecharger } from "@/components/site/Telecharger";
import { OURS } from "@/lib/ours";
import { JsonLd, PARTAGE, application, meta } from "@/lib/seo";
import { SITE } from "@/lib/site";
import jeu from "@/assets/echantillons/eveil/jeux/deux_paniers.jpg";
import baleine from "@/assets/echantillons/eveil/histoires/la_baleine_qui_chante.jpg";
import etoiles from "@/assets/echantillons/sommeil/berceuses/berceuse_des_etoiles.jpg";
import s from "./accueil.module.css";

export const metadata: Metadata = meta({
  url: "/",
  titre: "Ourson, l’app des parents\u00a0: repas, sommeil, éveil",
  description: SITE.description,
  image: PARTAGE.ourson,
});

// Durée relative des 7 dernières nuits (hauteur des barres, en %).
const NUITS = [
  { jour: "lundi", h: 62 },
  { jour: "mardi", h: 55 },
  { jour: "mercredi", h: 70 },
  { jour: "jeudi", h: 66 },
  { jour: "vendredi", h: 80 },
  { jour: "samedi", h: 84 },
  { jour: "dimanche", h: 92 },
];

const CUBES: { track: Track; rotate: number; label: string }[] = [
  { track: "gross_motor", rotate: 0, label: "Motricité" },
  { track: "fine_motor", rotate: -6, label: "Mains" },
  { track: "language", rotate: 4, label: "Langage" },
  { track: "social", rotate: -3, label: "Social" },
  { track: "cognitive", rotate: 5, label: "Cognitif" },
  { track: "autonomy", rotate: -4, label: "Autonomie" },
];

export default function Accueil() {
  return (
    <div className={s.snap}>
      <section className={`${s.sec} ${s.hero}`} aria-labelledby="accueil-titre">
        <div className={`oDrop ${s.logo}`}>ourson</div>
        <div className={`oDrop ${s.slogan}`} style={{ "--d": ".15s", "--dur": ".6s" }}>
          l’app qui vous donne un coup de patte
        </div>
        <h1 id="accueil-titre" className={`oDrop ${s.h1}`} style={{ "--d": ".3s" }}>
          {/* Verbes dans la couleur de leur pilier, en écho aux trois cercles. */}
          On <span className={s.mange}>mange</span> quoi&#8239;? On <span className={s.dort}>dort</span>{" "}
          quand&#8239;? On <span className={s.joue}>joue</span> à quoi&#8239;?
        </h1>
        <p className={`oDrop ${s.chapeau}`} style={{ "--d": ".42s" }}>
          Les trois questions phares de 0 à 3 ans. On vous aide dans votre vie de parent heure par heure.
        </p>
        <div className={`oDrop ${s.dl}`} style={{ "--d": ".55s" }} data-dl-hero>
          <Telecharger emplacement="hero" />
        </div>
        <div className={`${s.vis} ${s.heroVis}`}>
          <div className={`oDrop ${s.cercle} ${s.cercle1}`} style={{ "--d": ".7s", "--dur": ".8s" }} />
          <div className={`oDrop ${s.cercle} ${s.cercle2}`} style={{ "--d": ".85s", "--dur": ".8s" }} />
          <div className={`oDrop ${s.cercle} ${s.cercle3}`} style={{ "--d": "1s", "--dur": ".8s" }} />
          <Image
            src={OURS.accueil}
            alt=""
            className={`oDrop ${s.heroOurs}`}
            style={{ "--d": ".9s", "--dur": ".9s" }}
            sizes="(min-width: 900px) 400px, (min-width: 600px) 340px, 270px"
            loading="eager"
            fetchPriority="high"
          />
          <div className={`oDrop ${s.bulle}`} style={{ "--d": "1.5s", "--dur": ".6s" }}>
            Par quoi on commence aujourd’hui&#8239;?
          </div>
        </div>
      </section>

      <section id="reveil" className={`${s.sec} ${s.reveil}`} aria-labelledby="reveil-titre">
        <div className={`oReveal ${s.time}`}>
          7<span>h</span>00
        </div>
        <h2 id="reveil-titre" className={`oReveal ${s.h2}`}>
          Une bonne nuit, un réveil en douceur.
        </h2>
        <p className={`oReveal ${s.texte}`}>
          Ourson repère ce qui marche pour son sommeil, et vous le dit dès le matin.
        </p>
        <div className={`oReveal ${s.vis} ${s.carteNuits}`} style={{ "--r": "1.5deg" }}>
          <div className={s.nuitsTete}>
            <div className={`${s.nowrap} ${s.nuitsTitre}`}>Nuits de Léa</div>
            <div className={`${s.nowrap} ${s.nuitsPeriode}`}>7 derniers jours</div>
          </div>
          <div className={s.barres} aria-hidden="true">
            {NUITS.map((n) => (
              <span key={n.jour} style={{ height: `${n.h}%` }} />
            ))}
          </div>
          <div className={s.jours} aria-hidden="true">
            {NUITS.map((n) => (
              <span key={n.jour}>{n.jour[0]?.toUpperCase()}</span>
            ))}
          </div>
          <div className={s.encart}>
            <span className={s.encartPuce} />
            <div className={s.encartTexte}>
              Au lit avant 20 h, Léa a dormi 11 h cette nuit. On garde ce rythme.
            </div>
          </div>
        </div>
      </section>

      <section id="repas" className={`${s.sec} ${s.plein} ${s.repas}`} aria-labelledby="repas-titre">
        <div className={`oReveal ${s.time}`}>
          12<span>h</span>15
        </div>
        <h2 id="repas-titre" className={`oReveal ${s.h2} ${s.h2Ours}`}>
          Un plat. Toute la tablée.
        </h2>
        <p className={`oReveal ${s.texte}`}>
          Une cuisson, une part par âge. Courses et diversification suivent.
        </p>
        <div className={`${s.vis} ${s.visRepas}`}>
          <Image
            src={OURS.repas}
            alt=""
            className={`${s.oursIn} ${s.wave}`}
            sizes="220px"
            data-boucle
            data-pause
          />
          <div className={`oReveal ${s.carteAge}`} style={{ "--r": "-2deg" }}>
            <Age
              compact
              sizes="(min-width: 900px) 436px, (min-width: 600px) 536px, (min-width: 430px) 366px, calc(100vw - 64px)"
            />
          </div>
        </div>
        <Link href="/nutrition" className={`oReveal ${s.bouton}`}>
          Tout sur la nutrition →
        </Link>
        <Image
          src={OURS.repas}
          alt=""
          className={`${s.ours} ${s.wave}`}
          sizes="140px"
          data-boucle
          data-pause
        />
      </section>

      <section id="sommeil" className={`${s.sec} ${s.plein} ${s.sommeil}`} aria-labelledby="sommeil-titre">
        <div className={`oReveal ${s.time}`}>
          13<span>h</span>05
        </div>
        <h2 id="sommeil-titre" className={`oReveal ${s.h2} ${s.h2Ours}`}>
          La sieste, au bon moment.
        </h2>
        <p className={`oReveal ${s.texte}`}>
          Notez coucher et réveil d’un geste. Ourson vous dit quand viendra la prochaine.
        </p>
        <div className={`${s.vis} ${s.visSommeil}`}>
          <Image
            src={OURS.sommeil}
            alt=""
            className={`${s.oursIn} ${s.float}`}
            data-boucle
            data-pause
            style={{ "--r": "-4deg" }}
            sizes="220px"
          />
          <div className={`oReveal ${s.carteJour}`} style={{ "--r": "-1.5deg" }}>
            <Carte which="jour" />
          </div>
          <div className={`oReveal ${s.carteObservation}`} style={{ "--r": "1.5deg" }}>
            <Carte which="observation" />
          </div>
        </div>
        <Link href="/sommeil" className={`oReveal ${s.bouton}`}>
          Tout sur le sommeil →
        </Link>
        <Image
          src={OURS.sommeil}
          alt=""
          className={`${s.ours} ${s.float}`}
          data-boucle
          data-pause
          style={{ "--r": "-4deg" }}
          sizes="150px"
        />
      </section>

      <section id="eveil" className={`${s.sec} ${s.plein} ${s.eveil}`} aria-labelledby="eveil-titre">
        <div className={`oReveal ${s.time} ${s.pad}`}>
          16<span>h</span>30
        </div>
        <h2 id="eveil-titre" className={`oReveal ${s.h2}`}>
          Ses jalons, un jeu par jour.
        </h2>
        <p className={`oReveal ${s.texte} ${s.pad}`}>Six domaines. Des activités à son rythme, pas à pas.</p>
        <div className={`oReveal ${s.cubes}`}>
          {CUBES.map((c) => (
            <div key={c.track} className={s.cube}>
              <TrackCube track={c.track} size={44} rotate={c.rotate} />
              <span>{c.label}</span>
            </div>
          ))}
        </div>
        <div className={`${s.vis} ${s.visEveil}`}>
          <Image
            src={OURS.eveil}
            alt=""
            className={`${s.oursIn} ${s.float}`}
            data-boucle
            data-pause
            style={{ "--r": "8deg" }}
            sizes="220px"
          />
          <div className={`oReveal ${s.carteJeu}`} style={{ "--r": "-2.5deg" }}>
            <Image
              src={jeu}
              alt=""
              sizes="(min-width: 900px) 440px, (min-width: 600px) 540px, (min-width: 430px) 370px, calc(100vw - 60px)"
              placeholder="blur"
            />
          </div>
        </div>
        <Link href="/eveil" className={`oReveal ${s.bouton}`}>
          Tout sur l’éveil →
        </Link>
        <Image
          src={OURS.eveil}
          alt=""
          className={`${s.ours} ${s.float}`}
          data-boucle
          data-pause
          style={{ "--r": "8deg" }}
          sizes="150px"
        />
      </section>

      <section id="soir" className={`${s.sec} ${s.plein} ${s.soir}`} aria-labelledby="soir-titre">
        <div className={`oReveal ${s.time}`}>
          19<span>h</span>45
        </div>
        <h2 id="soir-titre" className={`oReveal ${s.h2}`}>
          Le soir, une comptine et une histoire.
        </h2>
        <p className={`oReveal ${s.texte}`}>
          Une berceuse à chanter, une histoire qui reprend son prénom et son doudou.
        </p>
        <div className={`oReveal ${s.ecran}`}>
          Pas d’écran pour votre enfant&nbsp;: c’est vous qui chantez et racontez.
        </div>
        <div className={`${s.vis} ${s.visSoir}`}>
          <div className={`oReveal ${s.histoire}`} style={{ "--r": "1.5deg" }}>
            <Image
              src={baleine}
              alt=""
              sizes="(min-width: 900px) 460px, (min-width: 600px) 560px, (min-width: 430px) 390px, calc(100vw - 40px)"
              placeholder="blur"
            />
            <div className={s.histoireCorps}>
              <div className={s.histoireTete}>
                <div className={s.histoireTitre}>La baleine qui chante</div>
                <span className={s.pastille}>Histoire</span>
              </div>
              <div className={s.histoireTexte}>
                Au fond de la mer, une baleine chante tout doucement. Léa et Pompon l’écoutent.
              </div>
            </div>
          </div>
          <div className={`oReveal ${s.comptine}`} style={{ "--r": "-1.5deg" }}>
            <Image src={etoiles} alt="" width={56} height={56} sizes="56px" placeholder="blur" />
            <div className={s.comptineTexte}>
              <div className={s.comptineTitre}>Une étoile, deux étoiles</div>
              <div className={s.comptineSous}>Paroles, gestes et mélodie</div>
            </div>
            <span className={`${s.pastille} ${s.pastilleComptine}`}>Comptine</span>
          </div>
        </div>
      </section>

      <section id="foyer" className={`${s.sec} ${s.foyer}`} aria-labelledby="foyer-titre">
        <div className={`oReveal ${s.eyebrow}`}>Toute la famille</div>
        <h2 id="foyer-titre" className={`oReveal ${s.h2}`}>
          Un seul foyer. Toutes les infos.
        </h2>
        <p className={`oReveal ${s.texte}`}>
          Parents, nounou, grands-parents&nbsp;: ce que l’un note, les autres le voient aussitôt.
        </p>
        <div className={`${s.vis} ${s.visFoyer}`}>
          <div className="oReveal" style={{ "--r": "-1.5deg" }}>
            <Carte which="notif" text={"Inès a noté\u00a0: Léa a goûté le poulet, et aimé."} />
          </div>
          <div className="oReveal" style={{ "--r": "1.5deg" }}>
            <Carte which="notif" text="Noé dort depuis 13 h 05 (Mamie)." />
          </div>
          <div className="oReveal" style={{ "--r": "-1.5deg" }}>
            <Carte which="notif" text="Mamie a rejoint votre foyer." />
          </div>
        </div>
      </section>

      <FinDePage page="accueil" />
      <JsonLd data={application()} />
    </div>
  );
}
