// components/Header.js

// Import React hooks for managing state and side effects.
import { useState, useEffect } from 'react';
// Import the Link component for client-side navigation.
import Link from 'next/link';
// Import the Navigation component which we will create next.
import Navigation from './Navigation';
// Import our CSS module for styling.
import styles from '../styles/Header.module.css';

// Define the Header component.
export default function Header() {
  // 'theme' state holds the current theme ('light' or 'dark').
  // 'setTheme' is the function to update it. We default to 'light'.
  const [theme, setTheme] = useState('light');

  // useEffect runs after the component mounts. This is where we handle
  // interactions with the browser, like localStorage.
  useEffect(() => {
    // Check if a theme is saved in the user's browser.
    const savedTheme = localStorage.getItem('theme') || 'light';
    // Update our component's state to match the saved theme.
    setTheme(savedTheme);
    // Apply the theme to the main <html> element.
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []); // The empty array [] means this effect runs only once on mount.

  // This function is called when a theme button is clicked.
  const handleThemeChange = (newTheme) => {
    // Update the component's state.
    setTheme(newTheme);
    // Save the new theme to the browser's localStorage.
    localStorage.setItem('theme', newTheme);
    // Update the <html> element to apply the new CSS variables from globals.css.
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    // The main header element, using styles from Header.module.css
    <header className={styles.nav}>
      <div className="container">
        <div className={styles.navContent}>
          {/* Logo link pointing to the homepage */}
          <Link href="/" passHref>
            <div className={styles.navLogo}>Physics Daily</div>
          </Link>

          {/* We will place the main navigation links here */}
          <Navigation />
          
          {/* Theme Toggle Buttons */}
          <div className={styles.themeToggle}>
            <button
              id="light-theme"
              title="Light Theme"
              // Add 'active' class if the current theme is 'light'
              className={theme === 'light' ? styles.active : ''}
              // Call the handler function on click
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
