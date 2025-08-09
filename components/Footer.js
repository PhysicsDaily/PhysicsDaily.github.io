// components/Footer.js
import styles from '../styles/Footer.module.css';

export default function Footer() {
  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerMain}>
            <p>&copy;  Physics Daily. Made with ❤️ for physics enthusiasts everywhere.</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="/about" className={styles.footerLink}>About</a>
            <a href="/contribute" className={styles.footerLink}>Contribute</a>
            <a href="https://github.com/PhysicsDaily" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
