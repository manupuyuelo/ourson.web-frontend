import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Footer } from "@/components/layout/Footer";
import { partage, meta } from "@/lib/seo";
import { SOURCES_EVEIL, SOURCES_REPAS, SOURCES_SOMMEIL, type Source } from "@/lib/sources";
import c from "../confidentialite/confidentialite.module.css";
import s from "./sources.module.css";

export const metadata: Metadata = meta({
  url: "/sources",
  titre: "Nos sources · Ourson",
  description:
    "Les recommandations officielles et les études scientifiques sur lesquelles s’appuient les repères d’Ourson\u00a0: repas, sommeil et éveil des 0-3 ans.",
  image: partage("sources"),
});

type Pilier = {
  id: "repas" | "sommeil" | "eveil";
  surTitre: string;
  titre: string;
  intro: string;
  sources: Source[];
  mentions?: string[];
};

const PILIERS: Pilier[] = [
  {
    id: "repas",
    surTitre: "Nutrition",
    titre: "Repas et diversification",
    intro:
      "Les âges d’introduction, les textures et les portions suivent les recommandations françaises de santé publique. Les valeurs nutritionnelles viennent de bases de données ouvertes.",
    sources: SOURCES_REPAS,
    mentions: [
      "Ciqual : Anses, 2025, Table de composition nutritionnelle des aliments Ciqual, sous Licence Ouverte Etalab 2.0.",
      "Open Food Facts : base de données sous licence Open Database License (ODbL), © les contributeurs d’Open Food Facts.",
    ],
  },
  {
    id: "sommeil",
    surTitre: "Sommeil",
    titre: "Nuits et siestes",
    intro:
      "Durées de sommeil, siestes et couchage sûr suivent les recommandations des sociétés savantes. Ourson compare d’abord votre enfant à lui-même : les références situent, elles ne jugent pas.",
    sources: SOURCES_SOMMEIL,
  },
  {
    id: "eveil",
    surTitre: "Éveil",
    titre: "Jalons, activités et histoires",
    intro:
      "Les jalons reprennent les repères de développement publiés par les autorités de santé. Les activités s’inspirent de programmes d’éducation de la petite enfance, réécrits pour Ourson.",
    sources: SOURCES_EVEIL,
    mentions: [
      "Jalons d’après CDC Learn the Signs. Act Early. (2022), sans endossement du CDC ni du département américain de la Santé.",
      "Fenêtres d’acquisition motrice d’après l’étude multicentrique de l’OMS (2006), sans caution de l’OMS.",
      "Grille DIA-TND 2024, réutilisée sous Licence Ouverte Etalab 2.0.",
    ],
  },
];

const couleurs = (p: Pilier["id"]) =>
  ({ "--c": `var(--${p})`, "--deep": `var(--${p}-deep)`, "--tint": `var(--${p}-tint)` }) as CSSProperties;

export default function Sources() {
  return (
    <>
      <main id="contenu">
        <section className={c.hero} aria-labelledby="sources-titre">
          <p className={c.eyebrow}>Sources</p>
          <h1 id="sources-titre" className={c.h1}>
            Nos sources
          </h1>
          <p className={c.accroche}>Des repères appuyés sur la science, pas sur des intuitions.</p>
          <p className={c.chapeau}>
            Les repères d’Ourson reprennent les recommandations des autorités de santé et des études publiées.
            Chaque contenu est relu par un humain avant publication. Ourson ne remplace ni l’avis d’un
            professionnel de santé, ni les examens de suivi de votre enfant.
          </p>
        </section>

        <div className={c.corps}>
          <section className={c.carte} aria-labelledby="sources-etudes">
            <h2 id="sources-etudes" className={c.h2}>
              Et les études&#8239;?
            </h2>
            <p className={c.texte}>
              Ces recommandations officielles sont complétées par plus d’une centaine d’études scientifiques,
              toutes citées dans l’app (Profil › Nos sources), avec leur niveau de preuve.
            </p>
          </section>

          {PILIERS.map((p) => (
            <section
              key={p.id}
              id={p.id}
              className={`${c.carte} ${s.pilier}`}
              style={couleurs(p.id)}
              aria-labelledby={`${p.id}-titre`}
            >
              <p className={s.surTitre}>{p.surTitre}</p>
              <h2 id={`${p.id}-titre`} className={c.h2}>
                {p.titre}
              </h2>
              <p className={c.texte}>{p.intro}</p>
              <ul className={s.refs}>
                {p.sources.map((src) => (
                  <li key={src.citation}>
                    <span>
                      {src.citation}
                      {src.lien && (
                        <>
                          {" "}
                          <a href={src.lien} target="_blank" rel="noopener noreferrer">
                            Consulter<span className="srOnly"> (nouvel onglet)</span>&nbsp;↗
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              {p.mentions?.map((m) => (
                <p key={m} className={s.mention}>
                  {m}
                </p>
              ))}
            </section>
          ))}

          <p className={c.note}>
            Une source manque ou vous semble mal citée&#8239;? Écrivez-nous à{" "}
            <a href="mailto:contact@ourson.app">contact@ourson.app</a>. Voir aussi nos{" "}
            <Link href="/cgu">conditions d’utilisation</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
