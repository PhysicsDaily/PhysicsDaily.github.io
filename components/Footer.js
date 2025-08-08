// components/Footer.js

// Import our CSS module for styling.
import styles from '../styles/Footer.module.css';

// Define the Footer component. This is a simple component with no logic.
export default function Footer() {
  return (
    // The main footer element, using a scoped class from the CSS module.
    <footer className={styles.footer}>
      {/* The container class centers the content. It's a global style. */}
      <div className="container">
        <p>&copy; Physics Daily. Made with ❤️ for physics enthusiasts everywhere.</p>
      </div>
    </footer>
  );
}
