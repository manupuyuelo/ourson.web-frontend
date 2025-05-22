// pages/suppression-compte.js
import SuppressionCompte from "../components/SuppressionCompte";

export default function SuppressionComptePage() {
  return <SuppressionCompte />;
}

export async function getStaticProps() {
  const meta = {
    title: "Suppression de compte - Ourson",
    keywords:
      "Suppression compte bébé, Supprimer mes données Ourson, Vie privée, Effacer données personnelles, Application parents enfants, Contrôle des données, Ourson app",
    ogTitle: "Suppression de compte - Ourson",
    ogDescription:
      "Vous souhaitez supprimer votre compte Ourson et vos données ? Voici les étapes à suivre pour une suppression claire et sécurisée.",
    ogUrl: "https://www.ourson.app/suppression-compte",
  };

  return {
    props: {
      meta,
    },
  };
}
