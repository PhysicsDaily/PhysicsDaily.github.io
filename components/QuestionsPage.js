import Head from 'next/head';
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import useMathJax from '../hooks/useMathJax';
import styles from '../styles/ContentPage.module.css';

export default function QuestionsPage({ 
  title, 
  subtitle, 
  description, 
  questions, 
  breadcrumbs 
}) {
  useMathJax();

  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return styles.easy;
      case 'medium': return styles.medium;
      case 'hard': return styles.hard;
      default: return '';
    }
  };

  return (
    <div>
      <Head>
        <title>{title} - Physics Daily</title>
        <meta name="description" content={description} />
      </Head>

      <Header />

      {breadcrumbs && (
        <div className="breadcrumb">
          <div className="container">
            <nav aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, index) => (
                <span key={index}>
                  {index > 0 && <span className="separator">›</span>}
                  {crumb.href ? (
                    <Link href={crumb.href}>{crumb.text}</Link>
                  ) : (
                    <span className={crumb.current ? "current" : ""}>{crumb.text}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}

      <header className={styles.pageHeader}>
        <div className="container">
          <h1>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <div className="container">
          <div className={styles.section}>
            {questions.map(q => (
              <div key={q.id} className={styles.problem}>
                <div className={styles.problemHeader}>
                  <span className={styles.problemNumber}>Question {q.id}</span>
                  <span className={`${styles.difficulty} ${getDifficultyClass(q.difficulty)}`}>{q.difficulty}</span>
                </div>
                <div className={styles.problemContent} dangerouslySetInnerHTML={{ __html: q.question }} />
                <details>
                  <summary>View Answer</summary>
                  <div className={styles.solution} dangerouslySetInnerHTML={{ __html: q.answer }} />
                </details>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
