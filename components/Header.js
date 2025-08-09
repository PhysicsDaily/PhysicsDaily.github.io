// components/Header.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className={styles.nav}>
      <div className="container">
        <div className={styles.navContent}>
          <Link href="/" passHref>
            <div className={styles.navLogo}>Physics Daily</div>
          </Link>
          <Navigation />
          <div className={styles.themeToggle}>
            <button
              id="light-theme"
              title="Light Theme"
              className={theme === 'light' ? styles.active : ''}
              onClick={() => handleThemeChange('light')}
            >
              ☀️
            </button>
            <button
              id="dark-theme"
              title="Dark Theme"
              className={theme === 'dark' ? styles.active : ''}
              onClick={() => handleThemeChange('dark')}
            >
              🌙
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
