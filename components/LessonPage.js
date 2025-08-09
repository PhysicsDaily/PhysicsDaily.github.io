// components/LessonPage.js
import { useEffect } from 'react';
import PageLayout from './PageLayout';
import useMathJax from '../hooks/useMathJax';
import styles from '../styles/Measurements.module.css';

export default function LessonPage({
  title,
  description,
  breadcrumbItems,
  chapterTitle,
  chapterSubtitle,
  navigationLinks = [],
  children
}) {
  // Use the shared MathJax hook
  useMathJax();

  useEffect(() => {
    // Scroll to top functionality
    const handleScroll = () => {
      const scrollButton = document.querySelector(`.${styles.scrollToTop}`);
      if (scrollButton) {
        scrollButton.style.display = window.pageYOffset > 300 ? 'block' : 'none';
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <PageLayout
      title={title}
      description={description}
      breadcrumbItems={breadcrumbItems}
    >
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>{chapterTitle}</h1>
          <p className={styles.subtitle}>{chapterSubtitle}</p>
        </div>
      </header>

      {navigationLinks.length > 0 && (
        <nav className={styles.pageNav}>
          <div className={styles.container}>
            <div className={styles.navLinks}>
              {navigationLinks.map((link, index) => (
                <a key={index} href={link.href}>{link.label}</a>
              ))}
            </div>
          </div>
        </nav>
      )}

      <main>
        <div className={styles.container}>
          {children}
        </div>
      </main>

      <button 
        className={styles.scrollToTop}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Scroll to top"
      >
        ↑
      </button>
    </PageLayout>
  );
}