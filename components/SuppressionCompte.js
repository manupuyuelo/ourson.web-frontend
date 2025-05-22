// components/SuppressionCompte.js
import styles from "../styles/Article.module.css";

export default function SuppressionCompte() {
  return (
    <main className={styles.main}>
      <div className={styles.firstSection}>
        <div className={styles.sumUpContainer}></div>

        <div className={styles.sectionContainer}>
          <article className={styles.markdownContent}>
            <div className={styles.titleConfidentiality}>
              <h1 className={styles.title}>
                <mark className={styles.mark}>Suppression de compte</mark>
              </h1>
              <h2 className={styles.subtitle}>
                Vous avez le contrôle total sur vos données.
              </h2>
            </div>
            <div className={styles.contentConfidentiality}>
              <p>
                Chez Ourson, nous croyons que chaque utilisateur doit pouvoir
                supprimer son compte et les données associées facilement et de
                manière sécurisée.
              </p>

              <h3>Comment supprimer votre compte ?</h3>
              <p>
                Depuis l'application, accédez à la page{" "}
                <strong>Paramètres</strong>, puis cliquez sur{" "}
                <strong>"Supprimer mon compte"</strong>. Un message de
                confirmation vous sera affiché, et toutes vos données
                personnelles seront supprimées de manière définitive.
              </p>

              <h3>Données supprimées</h3>
              <p>Voici les données qui seront effacées :</p>
              <ul>
                <li>Votre adresse e-mail</li>
                <li>Votre mot de passe (hashé)</li>
                <li>Le prénom et l’âge de vos enfants</li>
                <li>
                  Les informations nutritionnelles, de sommeil et d’activités
                  enregistrées
                </li>
                <li>Les préférences de votre foyer</li>
              </ul>

              <h3>Données conservées</h3>
              <p>
                Aucune donnée personnelle identifiable n’est conservée après
                suppression. Certaines données statistiques anonymisées (non
                liées à votre compte) peuvent être conservées à des fins
                d’analyse globale d’usage.
              </p>

              <h3>Besoin d’aide ?</h3>
              <p>
                Si vous ne parvenez pas à supprimer votre compte depuis
                l’application, vous pouvez nous écrire à{" "}
                <a href="mailto:contact@ourson.app">contact@ourson.app</a> en
                précisant l’adresse e-mail utilisée pour créer votre compte.
              </p>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
