// components/Navigation.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '../styles/Navigation.module.css';

const navLinks = [
  { name: 'Home', path: '/', description: 'Homepage' },
  { name: 'Resources', path: '/resources', description: 'Study Resources' },
  { name: 'About', path: '/about', description: 'About Us' },
  { name: 'Contribute', path: '/contribute', description: 'Contribute to Project' },
];

export default function Navigation() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.navigation}`)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={styles.navigation}>
      <button
        type="button"
        className={styles.mobileMenuToggle}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
      </button>

      <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        {navLinks.map((link) => (
          <li key={link.name} className={styles.navItem}>
            <Link 
              href={link.path} 
              className={`${styles.navLink} ${router.pathname === link.path ? styles.active : ''}`}
              title={link.description}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
