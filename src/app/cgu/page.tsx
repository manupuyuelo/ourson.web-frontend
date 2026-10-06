import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { PARTAGE, meta } from "@/lib/seo";
import { SITE } from "@/lib/site";
// Même gabarit visuel que les règles de confidentialité.
import s from "../confidentialite/confidentialite.module.css";

export const metadata: Metadata = meta({
  url: "/cgu",
  titre: "Conditions générales d’utilisation · Ourson",
  description:
    "Conditions d’utilisation de l’app et du site Ourson, mentions légales, contenus générés avec l’IA, foyer partagé et responsabilités.",
  image: PARTAGE.ourson,
});

/** Date d’entrée en vigueur : à mettre à jour à chaque modification des conditions. */
const EN_VIGUEUR = "6 octobre 2026";

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

function Liste({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className={s.liste}>
      {items.map((t, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- liste statique, jamais réordonnée
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

export default function Cgu() {
  return (
    <>
      <main>
        <section className={s.hero} aria-labelledby="cgu-titre">
          <p className={s.eyebrow}>Conditions</p>
          <h1 id="cgu-titre" className={s.h1}>
            Conditions générales d’utilisation
          </h1>
          <p className={s.accroche}>En vigueur au {EN_VIGUEUR}.</p>
          <p className={s.chapeau}>
            Ces conditions encadrent l’utilisation de l’application Ourson et du site ourson.app. Elles
            complètent nos <Link href="/confidentialite">règles de confidentialité</Link>, qui décrivent le
            traitement de vos données.
          </p>
        </section>

        <div className={s.corps}>
          <Section id="mentions-legales" titre="Mentions légales">
            <p className={s.texte}>
              Le site ourson.app et l’application Ourson sont édités par AddedSugar, SASU au capital de
              1&nbsp;000&nbsp;€, immatriculée sous le numéro SIREN 984&nbsp;930&nbsp;636, dont le siège est
              situé 12 rue du Buisson-Saint-Louis, 75010 Paris.
            </p>
            <Liste
              items={[
                <>
                  Contact&nbsp;: <Mail />
                </>,
                "Directeur de la publication : Manu Puyuelo, président d’AddedSugar",
                "Hébergement du site : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
                "Hébergement du back-office et de la base de données : Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Allemagne (serveurs situés à Nuremberg, dans l’Union européenne)",
              ]}
            />
          </Section>

          <Section id="objet" titre="Objet et acceptation">
            <p className={s.texte}>
              Ces conditions définissent les règles d’utilisation d’Ourson. En créant un compte, ou en
              utilisant l’application, vous les acceptez. Si vous n’êtes pas d’accord, n’utilisez pas le
              service.
            </p>
          </Section>

          <Section id="service" titre="Le service">
            <p className={s.texte}>Ourson aide les parents d’enfants de 0 à 3&nbsp;ans au quotidien&nbsp;:</p>
            <Liste
              items={[
                "Repas : menus de la semaine, parts adaptées à l’âge, liste de courses et suivi de la diversification",
                "Sommeil : suivi des nuits et des siestes, repères et prochaine sieste probable",
                "Éveil : jalons, activités, comptines et histoires",
                "Foyer : partage des informations avec les adultes que vous invitez",
              ]}
            />
            <p className={s.texte}>
              L’application est gratuite pour le moment. Le site ourson.app présente le service et publie un
              blog d’articles de conseil, accessibles sans compte.
            </p>
          </Section>

          <Section id="compte" titre="Votre compte et votre foyer">
            <Liste
              items={[
                "Ourson s’adresse aux adultes : vous devez avoir au moins 18 ans pour créer un compte. Les informations sur les enfants sont renseignées par leurs parents ou les adultes qui en ont la charge.",
                "Vous vous engagez à fournir des informations exactes et à garder votre mot de passe confidentiel. Toute action faite depuis votre compte est réputée faite par vous.",
                "Vous pouvez inviter d’autres adultes dans votre foyer (autre parent, nounou, grands-parents). Les membres d’un foyer voient et modifient les informations partagées : n’invitez que des personnes de confiance. Vous pouvez retirer un membre à tout moment.",
                "Prévenez-nous à " +
                  SITE.email +
                  " si vous pensez que votre compte est utilisé sans votre accord.",
              ]}
            />
          </Section>

          <Section id="sante" titre="Santé et sécurité de votre enfant">
            <p className={s.texte}>
              Les contenus d’Ourson sont des informations générales, appuyées sur des recommandations
              publiques (Santé publique France, HAS, ANSES, OMS, American Academy of Pediatrics, CDC).{" "}
              <strong>
                Ils ne remplacent ni l’avis d’un professionnel de santé, ni les examens de suivi de votre
                enfant.
              </strong>{" "}
              En cas de doute sur sa santé, son alimentation, son sommeil ou son développement, consultez
              votre médecin ou votre pédiatre.
            </p>
            <Liste
              items={[
                "Repas : vérifiez les allergies et intolérances de votre enfant, et adaptez textures et quantités à son âge et à ses capacités. Ne le laissez jamais manger sans surveillance.",
                "Activités : elles se font toujours sous la surveillance d’un adulte. Vérifiez que le matériel utilisé est adapté à l’âge de l’enfant (petits objets, cordons, eau).",
                "Sommeil : les heures proposées sont des estimations, à confronter aux signes de fatigue de votre enfant. Suivez les recommandations de couchage sécuritaire.",
              ]}
            />
          </Section>

          <Section id="ia" titre="Contenus créés avec l’IA">
            <p className={s.texte}>
              Une partie des contenus d’Ourson est générée ou rédigée avec l’aide d’outils d’intelligence
              artificielle, notamment les illustrations, les photos de plats et les versions chantées des
              comptines. Chaque contenu est relu et validé par un humain avant publication. Les filigranes
              apposés par ces outils (comme SynthID) sont conservés. Cette information est donnée en
              application de l’article 50 du règlement européen sur l’intelligence artificielle.
            </p>
          </Section>

          <Section id="vos-contenus" titre="Vos contenus">
            <p className={s.texte}>
              Les informations, notes et photos que vous ajoutez (par exemple dans le carnet des premières
              fois) vous appartiennent. Vous nous autorisez à les conserver et à les afficher aux membres de
              votre foyer, uniquement pour faire fonctionner le service. Les photos sont stockées dans un
              espace privé, propre à votre foyer.
            </p>
            <p className={s.texte}>
              Vous vous engagez à ne publier que des contenus licites, dont vous avez les droits, et à
              respecter l’image et la vie privée des personnes photographiées.
            </p>
          </Section>

          <Section id="propriete" titre="Propriété intellectuelle">
            <p className={s.texte}>
              La marque Ourson, le logo, les textes, recettes, illustrations, enregistrements et le logiciel
              sont la propriété d’AddedSugar ou de ses partenaires. Vous pouvez les utiliser dans
              l’application pour un usage personnel et familial. Toute reproduction ou diffusion en dehors de
              ce cadre nécessite notre accord écrit.
            </p>
          </Section>

          <Section id="disponibilite" titre="Disponibilité et responsabilité">
            <p className={s.texte}>
              Nous faisons notre possible pour que le service soit disponible et fiable, sans pouvoir le
              garantir en permanence&nbsp;: des maintenances ou des incidents peuvent l’interrompre. Nous
              pouvons faire évoluer les fonctionnalités.
            </p>
            <p className={s.texte}>
              Dans les limites permises par la loi, AddedSugar n’est pas responsable des décisions prises sur
              la seule base des contenus d’Ourson, ni d’une utilisation non conforme à ces conditions. Rien
              dans ces conditions ne limite les droits que vous tenez du droit de la consommation.
            </p>
          </Section>

          <Section id="options-payantes" titre="Options payantes">
            <p className={s.texte}>
              Ourson ne propose aujourd’hui aucun achat. Si des options payantes sont ajoutées, elles seront
              clairement indiquées avant tout paiement, vendues par l’intermédiaire de l’App Store ou de
              Google Play selon leurs propres conditions, et ces conditions seront complétées (prix, durée,
              résiliation, droit de rétractation, médiateur de la consommation).
            </p>
          </Section>

          <Section id="donnees" titre="Données personnelles et cookies">
            <p className={s.texte}>
              Le traitement de vos données est décrit dans nos{" "}
              <Link href="/confidentialite">règles de confidentialité</Link>. Vous pouvez à tout moment revoir
              vos choix de cookies sur le site grâce au lien «&nbsp;<a href="#cookies">Cookies</a>&nbsp;» en
              bas de page.
            </p>
          </Section>

          <Section id="fin" titre="Fin d’utilisation">
            <p className={s.texte}>
              Vous pouvez cesser d’utiliser Ourson et supprimer votre compte à tout moment, depuis
              l’application ou selon la procédure de{" "}
              <Link href="/confidentialite#suppression">suppression de compte</Link>. Nous pouvons suspendre
              un compte utilisé en violation de ces conditions, après vous en avoir informé sauf urgence.
            </p>
          </Section>

          <Section id="modifications" titre="Modification des conditions">
            <p className={s.texte}>
              Nous pouvons modifier ces conditions pour suivre l’évolution du service ou de la loi. En cas de
              changement important, nous vous prévenons dans l’application avant son entrée en vigueur. La
              date de la version en vigueur figure en haut de cette page.
            </p>
          </Section>

          <Section id="litiges" titre="Droit applicable et litiges" corail>
            <p className={s.texte}>
              Ces conditions sont soumises au droit français. En cas de difficulté, écrivez-nous d’abord à{" "}
              <Mail />
              &nbsp;: nous cherchons toujours une solution amiable. À défaut, le litige est porté devant les
              tribunaux compétents&#8239;; si vous êtes consommateur, vous pouvez saisir le tribunal de votre
              domicile.
            </p>
          </Section>
        </div>
      </main>
      <Footer actif="cgu" />
    </>
  );
}
