// components/Header.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [theme, setTheme] = useState('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Prevent hydration mismatch by checking if we're on client side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      setIsLoaded(true);
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    if (typeof window !== 'undefined') {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  return (
    <header className={styles.nav}>
      <div className="container">
        <div className={styles.navContent}>
          <Link href="/" className={styles.navLogo}>
            <span>Physics Daily</span>
          </Link>

          <Navigation />
          
          <div className={styles.themeToggle}>
            <button
              type="button"
              title="Light Theme"
              className={`${styles.themeButton} ${theme === 'light' ? styles.active : ''}`}
              onClick={() => handleThemeChange('light')}
              aria-label="Switch to light theme"
            >
              ☀️
            </button>
            <button
              type="button"
              title="Dark Theme"
              className={`${styles.themeButton} ${theme === 'dark' ? styles.active : ''}`}
              onClick={() => handleThemeChange('dark')}
              aria-label="Switch to dark theme"
            >
              🌙
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
