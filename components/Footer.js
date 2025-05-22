import styles from "../styles/Footer.module.css";
import Image from "next/image";

function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerLogo}>
        <a href="/">
          <Image
            src="/mailSignatureOurson.png"
            alt="Ourson Logo"
            layout="fill"
            objectFit="cover"
          />
        </a>
      </div>

      <div className={styles.sectionContainer}>
        <div className={styles.contactSection}>
          <p className={styles.sectionTitles}>Une question ?</p>
          <a href="mailto:contact@ourson.app" className={styles.sectionLinks}>
            contact@ourson.app
          </a>
        </div>
        <div className={styles.aboutSection}>
          <p className={styles.sectionTitles}>À propos :</p>
          <a href="/" className={styles.sectionLinks}>
            Ourson.app
          </a>
          <a href="/demo" className={styles.sectionLinks}>
            Démo Vidéo
          </a>
          <a href="/confidentialite" className={styles.sectionLinks}>
            Règles de confidentialité
          </a>
        </div>

        <div className={styles.blogSection}>
          <p className={styles.sectionTitles}>Blog :</p>
          <a href="/blog/nutrition" className={styles.sectionLinks}>
            Nutrition
          </a>
          <a href="/blog/sommeil" className={styles.sectionLinks}>
            Sommeil
          </a>
          <a href="/blog/activites" className={styles.sectionLinks}>
            Activités
          </a>
        </div>

        <div className={styles.appSection}>
          <p className={styles.sectionTitles}>Téléchargez l'app :</p>
          <div className={styles.heroButtons}>
            <div className={styles.heroButton}>
              <div className={styles.heroButtonGoogle} />
            </div>
            <div className={styles.heroButton}>
              <div className={styles.heroButtonApple} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
