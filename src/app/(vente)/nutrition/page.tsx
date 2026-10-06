import type { Metadata } from "next";
import { PARTAGE, meta } from "@/lib/seo";
import Image, { type StaticImageData } from "next/image";
import { Fragment } from "react";
import { DivChip, DivHead, Icon, ShopItem, type IconName, type ShopItemProps } from "@/components/ds";
import { FinDePage } from "@/components/layout/FinDePage";
import { Age } from "@/components/site/Age";
import { Carte } from "@/components/site/Carte";
import { OURS } from "@/lib/ours";
import p from "@/components/layout/Pilier.module.css";
import s from "./nutrition.module.css";
import gratinBetterave from "@/assets/echantillons/repas/plats-famille/beetroot_mozzarella_gratin.jpg";
import daurade from "@/assets/echantillons/repas/plats-famille/fennel_polenta_sea_bream.jpg";
import wok from "@/assets/echantillons/repas/plats-famille/cherry_tomato_rice_noodle_wok.jpg";
import premierePuree from "@/assets/echantillons/repas/recettes-bebe/white_cabbage_potato_first_mash.jpg";
import lentilles from "@/assets/echantillons/repas/recettes-bebe/beetroot_parsnip_red_lentil.jpg";
import potiron from "@/assets/echantillons/repas/recettes-bebe/cheese_pumpkin_potato.jpg";

const CHAPEAU =
  "Ourson vous propose les menus de la semaine. Pour chaque plat, l’app vous explique comment adapter la part de chaque enfant à son âge\u00a0: en purée, écrasée ou en petits morceaux.";

export const metadata: Metadata = meta({
  url: "/nutrition",
  titre: "Un seul plat pour toute la famille · Ourson",
  description:
    "Une cuisson, une part par âge\u00a0: purée lisse dès 4 mois, morceaux fondants dès 10 mois. Liste de courses et diversification suivies.",
  image: PARTAGE.nutrition,
});

type Rayon = { icone: IconName; nom: string; articles: ShopItemProps[] };

const COURSES: Rayon[] = [
  {
    icone: "leaf",
    nom: "Fruits et légumes",
    articles: [
      { label: "Betterave", sub: "Poêlée de mardi", qty: "3", checked: true },
      { label: "Courgette", sub: "Gratin de jeudi", qty: "2", checked: true },
    ],
  },
  {
    icone: "flame",
    nom: "Boucherie",
    articles: [{ label: "Poulet", sub: "Poêlée de mardi · Wok de samedi", qty: "650 g" }],
  },
  {
    icone: "bag",
    nom: "Épicerie",
    articles: [
      { label: "Boulgour", qty: "250 g" },
      { label: "Cumin", qty: "1" },
    ],
  },
];

const DEJA_GOUTES = ["Carotte", "Betterave", "Courgette", "Pomme"];
const A_PROPOSER = ["Poulet", "Lentilles corail", "Boulgour"];

type Plat = { src: StaticImageData; nom: string } & ({ type: "famille" } | { type: "bebe"; tag: string });

const PLATS: Plat[] = [
  {
    type: "bebe",
    src: premierePuree,
    nom: "Première purée chou et pomme de terre",
    tag: "Dès 4 mois · purée lisse",
  },
  { type: "famille", src: gratinBetterave, nom: "Gratin de betterave à la mozzarella" },
  {
    type: "bebe",
    src: lentilles,
    nom: "Betterave, panais et lentilles corail",
    tag: "Dès 8 mois · écrasé fin",
  },
  { type: "famille", src: daurade, nom: "Daurade, fenouil et polenta" },
  {
    type: "bebe",
    src: potiron,
    nom: "Potiron, pomme de terre et fromage",
    tag: "Dès 10 mois · morceaux fondants",
  },
  { type: "famille", src: wok, nom: "Wok de nouilles de riz aux tomates cerises" },
];

const NOTIFS = [
  { r: "-1.5deg", text: "Inès a noté\u00a0: Léa a goûté le poulet, et aimé." },
  { r: "1.5deg", text: "Papa a coché la betterave sur la liste de courses." },
  { r: "-1deg", text: "Mamie a rejoint votre foyer." },
];

export default function NutritionPage() {
  return (
    <div className={`${p.page} ${s.nutrition}`}>
      <section className={`${p.sec} ${p.hero} ${s.hero}`} aria-labelledby="nutrition-titre">
        <div className={`${p.txt} ${p.heroTxt}`}>
          <div className={`oDrop ${p.eyebrow}`} style={{ "--c": "var(--repas-surface)", "--dur": ".6s" }}>
            Nutrition
          </div>
          <h1 id="nutrition-titre" className={`oDrop ${p.h1}`} style={{ "--d": ".1s" }}>
            Un seul plat pour toute la famille
          </h1>
          <p className={`oDrop ${p.chapeau}`} style={{ "--d": ".25s" }}>
            {CHAPEAU}
          </p>
          <div className={`oDrop ${p.puces}`} style={{ "--d": ".35s" }}>
            <span>Une seule cuisson</span>
            <span>Courses automatiques</span>
            <span>Diversification suivie</span>
          </div>
        </div>
        <div
          className={`oDrop ${p.vis} ${p.carteVisuel} ${s.heroVis}`}
          style={{ "--d": ".45s", "--dur": ".8s" }}
        >
          <Age
            eager
            sizes="(min-width: 900px) 452px, (min-width: 600px) 532px, (min-width: 430px) 362px, calc(100vw - 68px)"
          />
        </div>
        <Image
          src={OURS.repas}
          alt=""
          className={`${p.bear} ${p.wave}`}
          data-boucle
          data-pause
          sizes="(min-width: 900px) 200px, 130px"
          loading="eager"
        />
      </section>

      <section className={`${p.sec} ${p.flip}`} aria-labelledby="nutrition-cuisson">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--repas)" }}>
            Le gain de temps
          </div>
          <h2 id="nutrition-cuisson" className={p.h2}>
            Une cuisson, une part par âge
          </h2>
          <p className={p.texte}>
            Pour chaque enfant&nbsp;: la quantité à mettre de côté, les ingrédients à retirer et la bonne
            texture. Vous prélevez au bon moment, le reste de la recette se poursuit pour les grands.
          </p>
          <p className={p.texte}>Une recette sur mesure si le plat ne lui convient pas.</p>
        </div>
        <div className={`oReveal ${p.vis}`} style={{ "--r": "-1.5deg" }}>
          <Carte which="prochain" />
          <Carte which="parts" />
        </div>
      </section>

      <section className={`${p.sec} ${s.tint}`} aria-labelledby="nutrition-courses">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--repas)" }}>
            Les courses
          </div>
          <h2 id="nutrition-courses" className={p.h2}>
            La liste de courses, calculée pour toute la famille
          </h2>
          <p className={p.texte}>
            Les menus de la semaine, prêts dès la première ouverture. La liste s’en déduit toute seule,
            quantités comprises. Celui qui passe au magasin coche, les autres le voient.
          </p>
        </div>
        <div className={`oReveal ${p.vis} ${s.courses}`} style={{ "--r": "1.5deg" }}>
          <div className={s.coursesTete}>
            <div className={s.coursesTitre}>Liste de courses</div>
            <div className={s.reste}>Reste à prendre · 12</div>
          </div>
          <div className={s.bascule}>
            <span className={s.actif}>Par rayon</span>
            <span>Par recette</span>
          </div>
          {COURSES.map((rayon) => (
            <Fragment key={rayon.nom}>
              <div className={s.rayon}>
                <span className={s.rayonIcone}>
                  <Icon name={rayon.icone} size={15} />
                </span>
                <span className={s.micro}>{rayon.nom}</span>
              </div>
              {rayon.articles.map((a) => (
                <ShopItem key={a.label} {...a} />
              ))}
            </Fragment>
          ))}
        </div>
      </section>

      <section className={`${p.sec} ${p.flip}`} aria-labelledby="nutrition-diversification">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--repas)" }}>
            La diversification
          </div>
          <h2 id="nutrition-diversification" className={p.h2}>
            Chaque aliment au bon moment
          </h2>
          <p className={p.texte}>
            Ourson garde la trace de ce que votre enfant a déjà goûté et vous propose les aliments à découvrir
            maintenant, selon son âge. Les menus de la semaine en tiennent compte.
          </p>
          <p className={p.texte}>Noté par celui qui a donné le repas, visible par tout le foyer.</p>
        </div>
        <div className={`oReveal ${p.vis} ${s.diversification}`} style={{ "--r": "-1.5deg" }}>
          <DivHead
            value={23}
            total={60}
            kicker="Diversification"
            title="Ce que Léa a goûté"
            text="23 aliments découverts. 3 nouveaux à proposer cette semaine."
          />
          <div className={s.aliments}>
            <div className={s.micro}>Déjà goûtés</div>
            <div className={s.chips}>
              {DEJA_GOUTES.map((a) => (
                <DivChip key={a} label={a} tone="got" />
              ))}
            </div>
            <div className={s.micro}>À proposer cette semaine</div>
            <div className={s.chips}>
              {A_PROPOSER.map((a) => (
                <DivChip key={a} label={a} tone="next" />
              ))}
            </div>
          </div>
          <div className={s.soleil}>
            <span />
            <p>Le poulet est au menu de mardi&nbsp;: une première pour Léa.</p>
          </div>
        </div>
      </section>

      <section className={`${p.sec} ${p.wide} ${s.catalogue}`} aria-labelledby="nutrition-catalogue">
        <div className={`oReveal ${s.catTete}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--repas-surface)" }}>
            Le catalogue
          </div>
          <h2 id="nutrition-catalogue" className={`${p.h2} ${s.sansMax}`}>
            1 373 recettes variées de saison
          </h2>
          <p className={s.catTexte}>
            Des plats de famille, et des recettes à part pour les plus petits quand le plat ne leur convient
            pas encore.
          </p>
        </div>
        <ul className={s.grille}>
          {PLATS.map((plat) => (
            <li key={plat.nom} className={`oReveal ${s.plat}`}>
              <div className={s.platPhoto}>
                <Image
                  src={plat.src}
                  placeholder="blur"
                  alt=""
                  fill
                  sizes="(min-width: 900px) 330px, (min-width: 600px) 180px, (min-width: 430px) 177px, calc(50vw - 38px)"
                />
              </div>
              <div className={s.platCorps}>
                <span className={`${s.tag} ${s[plat.type]}`}>
                  {plat.type === "famille" ? "Toute la famille" : plat.tag}
                </span>
                <span className={s.platNom}>{plat.nom}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className={`oReveal ${s.sources}`}>
          <span className={s.sourcesIcone}>
            <Icon name="stethoscope" size={20} />
          </span>
          <p>
            Âges d’introduction et textures suivent les recommandations de Santé publique France, de l’ANSES
            et de l’OMS, toutes citées dans l’app.
          </p>
        </div>
      </section>

      <section className={`${p.sec} ${p.plein} ${s.foyer}`} aria-labelledby="nutrition-foyer">
        <div className={`oReveal ${p.txt}`}>
          <div className={p.eyebrow} style={{ "--c": "var(--coral-surface)" }}>
            Toute la famille
          </div>
          <h2 id="nutrition-foyer" className={`${p.h2} ${s.foyerH2}`}>
            Ce que l’un note, les autres le voient aussitôt
          </h2>
          <p className={`${p.texte} ${s.foyerTexte}`}>
            Invitez l’autre parent, la nounou ou les grands-parents. Un aliment goûté chez Mamie, une course
            cochée par Papa&nbsp;: tout est au même endroit.
          </p>
        </div>
        <div className={`${p.vis} ${s.notifs}`}>
          {NOTIFS.map((n) => (
            <div key={n.text} className="oReveal" style={{ "--r": n.r }}>
              <Carte which="notif" text={n.text} />
            </div>
          ))}
        </div>
      </section>

      <FinDePage page="repas" />
    </div>
  );
}
