import Confidentialite from "../components/Confidentialite";

export default function ConfidentialitePage() {
  return <Confidentialite />;
}

export async function getStaticProps() {
  const meta = {
    title: "Règles de confidentialité - Ourson",
    keywords:
      "Confidentialité bébé, Données personnelles, Protection de la vie privée, Application pour enfants, Sécurité des données, Supabase, Firebase, Ourson app, Nutrition bébé, Sommeil bébé, Activité bébé",
    ogTitle: "Règles de confidentialité de l'app Ourson",
    ogDescription:
      "Découvrez comment l'app Ourson protège vos données personnelles et celles de votre enfant. Transparence et sécurité avant tout.",
    ogUrl: "https://www.ourson.app/confidentialite",
  };

  return {
    props: {
      meta,
    },
  };
}
