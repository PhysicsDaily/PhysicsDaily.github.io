// components/Footer.js
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.footerText}>
          Made with ❤️ for physics enthusiasts everywhere.
        </p>
      </div>
    </footer>
  );
}
