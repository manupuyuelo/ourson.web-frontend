import type { Metadata } from "next";
import { PARTAGE, meta } from "@/lib/seo";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/site";
import { SuppressionSheet } from "./SuppressionSheet";
import s from "./confidentialite.module.css";

export const metadata: Metadata = meta({
  url: "/confidentialite",
  titre: "Règles de confidentialité · Ourson",
  description: "Données collectées, utilisation, stockage, vos droits et suppression de compte.",
  image: PARTAGE.ourson,
});

const DONNEES = [
  "Adresse e-mail",
  "Mot de passe (hashé de manière sécurisée)",
  "Prénom et âge des enfants",
  "Nombre d’enfants",
  "Taille du foyer",
  "Régime alimentaire parental",
  "Données de suivi du sommeil",
];

const UTILISATIONS = [
  "Personnaliser les recommandations de repas, sommeil et activités",
  "Suivre la progression et l’évolution des besoins de l’enfant",
  "Améliorer l’expérience utilisateur globale",
];

const SUPPRIMEES = [
  "Votre adresse e-mail",
  "Votre mot de passe (hashé)",
  "Le prénom et l’âge de vos enfants",
  "Les informations nutritionnelles, de sommeil et d’activités enregistrées",
  "Les préférences de votre foyer",
];

const Mail = () => <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;

function Section({
  id,
  titre,
  corail,
  children,
}: {
  id: string;
  titre: string;
  corail?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={corail ? `${s.carte} ${s.corail}` : s.carte} aria-labelledby={id}>
      <h2 id={id} className={s.h2}>
        {titre}
      </h2>
      {children}
    </section>
  );
}

function Liste({ items }: { items: readonly string[] }) {
  return (
    <ul className={s.liste}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export default function Confidentialite() {
  return (
    <>
      <main>
        <section className={s.hero} aria-labelledby="conf-titre">
          <p className={s.eyebrow}>Confidentialité</p>
          <h1 id="conf-titre" className={s.h1}>
            Règles de confidentialité
          </h1>
          <p className={s.accroche}>La protection des données est notre priorité.</p>
          <p className={s.chapeau}>
            L’application Ourson accorde une grande importance à la confidentialité de vos données
            personnelles. Cette politique de confidentialité a pour but de vous informer sur la manière dont
            nous collectons, utilisons et protégeons les données liées à votre utilisation de notre
            application.
          </p>
        </section>

        <div className={s.corps}>
          <Section id="donnees" titre="Données collectées">
            <ul className={s.puces}>
              {DONNEES.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Section>

          <Section id="utilisation" titre="Utilisation des données">
            <p className={s.texte}>Les données collectées nous permettent de&nbsp;:</p>
            <Liste items={UTILISATIONS} />
          </Section>

          <Section id="stockage" titre="Stockage des données">
            <p className={s.texte}>
              Toutes les données personnelles sont stockées dans une base sécurisée hébergée par Supabase.
              Nous utilisons également Firebase Analytics afin de comprendre l’usage de l’app et améliorer les
              fonctionnalités proposées.
            </p>
          </Section>

          <Section id="partage" titre="Partage de données">
            <p className={s.texte}>
              Les données ne sont jamais revendues à des tiers. Elles ne sont partagées qu’en interne pour des
              fins d’analyse et d’amélioration du service.
            </p>
          </Section>

          <Section id="securite" titre="Sécurité">
            <p className={s.texte}>
              Nous appliquons des mesures techniques et organisationnelles strictes pour protéger vos données
              contre tout accès non autorisé.
            </p>
          </Section>

          <Section id="monetisation" titre="Monétisation">
            <p className={s.texte}>
              L’app est gratuite pour le moment. Si des options payantes sont ajoutées à l’avenir, elles
              seront clairement indiquées et ne modifieront en rien la protection de vos données.
            </p>
          </Section>

          {/* Absente du handoff : décrit le bandeau de consentement du site. TODO(texte) : à valider. */}
          <Section id="cookies-audience" titre="Cookies du site">
            <p className={s.texte}>
              Ce site utilise Google Tag Manager. Tant que vous n’avez rien accepté, aucun cookie de mesure
              n’est déposé&nbsp;: Google ne reçoit que des signaux anonymes, sans cookie ni identifiant.
            </p>
            <p className={s.texte}>Avec votre accord, et seulement pour ce que vous acceptez&nbsp;:</p>
            <Liste
              items={[
                "Mesure d’audience (Google Analytics)\u00a0: compter les visites et voir les pages qui plaisent.",
                "Publicité (Google Ads)\u00a0: savoir si nos annonces sur d’autres sites vous ont menés jusqu’ici. Aucune publicité n’est affichée sur ce site.",
              ]}
            />
            <p className={s.texte}>
              Votre choix est conservé 6 mois. Vous pouvez le modifier à tout moment grâce au lien
              «&nbsp;Cookies&nbsp;» en bas de page.
            </p>
          </Section>

          <Section id="droits" titre="Vos droits" corail>
            <p className={s.texte}>
              Vous avez le droit de consulter, modifier ou supprimer vos données à tout moment. Pour toute
              demande, écrivez-nous à <Mail />.
            </p>
            <p className={s.texte}>
              Si vous souhaitez supprimer votre compte et l’ensemble des données associées, vous pouvez le
              faire directement depuis l’application ou en suivant la procédure décrite sur cette page&nbsp;:{" "}
              <a href="#suppression">Suppression de compte</a>.
            </p>
          </Section>

          <p className={s.note}>
            Cette politique est susceptible d’évoluer. La version la plus récente sera toujours disponible
            depuis l’application et notre site web.
          </p>
        </div>

        <SuppressionSheet
          titreId="suppr-titre"
          entete={
            <div className={s.supprTete}>
              <h2 id="suppr-titre" className={s.supprTitre}>
                Suppression de compte
              </h2>
              <p className={s.supprAccroche}>Vous avez le contrôle total sur vos données.</p>
            </div>
          }
        >
          <p className={s.supprIntro}>
            Chez Ourson, nous croyons que chaque utilisateur doit pouvoir supprimer son compte et les données
            associées facilement et de manière sécurisée.
          </p>

          <section className={s.bloc} aria-labelledby="suppr-comment">
            <h3 id="suppr-comment" className={s.h3}>
              Comment supprimer votre compte&#8239;?
            </h3>
            <p className={s.texte}>
              Depuis l’application, accédez à la page Paramètres, puis cliquez sur «&nbsp;Supprimer mon
              compte&nbsp;». Un message de confirmation vous sera affiché, et toutes vos données personnelles
              seront supprimées de manière définitive.
            </p>
          </section>

          <section className={s.bloc} aria-labelledby="suppr-effacees">
            <h3 id="suppr-effacees" className={s.h3}>
              Données supprimées
            </h3>
            <p className={s.texte}>Voici les données qui seront effacées&nbsp;:</p>
            <Liste items={SUPPRIMEES} />
          </section>

          <section className={s.bloc} aria-labelledby="suppr-conservees">
            <h3 id="suppr-conservees" className={s.h3}>
              Données conservées
            </h3>
            <p className={s.texte}>
              Aucune donnée personnelle identifiable n’est conservée après suppression. Certaines données
              statistiques anonymisées (non liées à votre compte) peuvent être conservées à des fins d’analyse
              globale d’usage.
            </p>
          </section>

          <section className={`${s.bloc} ${s.corail}`} aria-labelledby="suppr-aide">
            <h3 id="suppr-aide" className={s.h3}>
              Besoin d’aide&#8239;?
            </h3>
            <p className={s.texte}>
              Si vous ne parvenez pas à supprimer votre compte depuis l’application, vous pouvez nous écrire à{" "}
              <Mail /> en précisant l’adresse e-mail utilisée pour créer votre compte.
            </p>
          </section>
        </SuppressionSheet>
      </main>
      <Footer actif="confidentialite" />
    </>
  );
}
