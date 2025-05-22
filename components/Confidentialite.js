import styles from "../styles/Article.module.css";

export default function Confidentialite() {
  return (
    <main className={styles.main}>
      <div className={styles.firstSection}>
        <div className={styles.sumUpContainer}></div>

        <div className={styles.sectionContainer}>
          <article className={styles.markdownContent}>
            <div className={styles.titleConfidentiality}>
              <h1 className={styles.title}>
                <mark className={styles.mark}>Règles de confidentialité</mark>
              </h1>
              <h2 className={styles.subtitle}>
                La protection des données est notre priorité.
              </h2>
            </div>
            <div className={styles.contentConfidentiality}>
              <p>
                L’application Ourson accorde une grande importance à la
                confidentialité de vos données personnelles. Cette politique de
                confidentialité a pour but de vous informer sur la manière dont
                nous collectons, utilisons et protégeons les données liées à
                votre utilisation de notre application.
              </p>

              <h3>Données collectées</h3>
              <ul>
                <li>Adresse e-mail</li>
                <li>Mot de passe (hashé de manière sécurisée)</li>
                <li>Prénom et âge des enfants</li>
                <li>Nombre d’enfants</li>
                <li>Taille du foyer</li>
                <li>Régime alimentaire parental</li>
                <li>Données de suivi du sommeil</li>
              </ul>

              <h3>Utilisation des données</h3>
              <p>Les données collectées nous permettent de :</p>
              <ul>
                <li>
                  Personnaliser les recommandations de repas, sommeil et
                  activités
                </li>
                <li>
                  Suivre la progression et l’évolution des besoins de l’enfant
                </li>
                <li>Améliorer l’expérience utilisateur globale</li>
              </ul>

              <h3>Stockage des données</h3>
              <p>
                Toutes les données personnelles sont stockées dans une base
                sécurisée hébergée par Supabase. Nous utilisons également
                Firebase Analytics afin de comprendre l’usage de l’app et
                améliorer les fonctionnalités proposées.
              </p>

              <h3>Partage de données</h3>
              <p>
                Les données ne sont jamais revendues à des tiers. Elles ne sont
                partagées qu’en interne pour des fins d’analyse et
                d’amélioration du service.
              </p>

              <h3>Sécurité</h3>
              <p>
                Nous appliquons des mesures techniques et organisationnelles
                strictes pour protéger vos données contre tout accès non
                autorisé.
              </p>

              <h3>Monétisation</h3>
              <p>
                L’app est gratuite pour le moment. Si des options payantes sont
                ajoutées à l’avenir, elles seront clairement indiquées et ne
                modifieront en rien la protection de vos données.
              </p>

              <h3>Vos droits</h3>
              <p>
                Vous avez le droit de consulter, modifier ou supprimer vos
                données à tout moment. Pour toute demande, écrivez-nous à{" "}
                <a href="mailto:contact@ourson.app">contact@ourson.app</a>.
              </p>

              <p>
                Cette politique est susceptible d’évoluer. La version la plus
                récente sera toujours disponible depuis l’application et notre
                site web.
              </p>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
