// pages/mechanics/measurements/mcq.js
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Quiz from '../../../components/Quiz';
import styles from '../../../styles/ContentPage.module.css';

// This function runs at build time to fetch the data
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'measurement-mcq.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const quizQuestions = JSON.parse(jsonData);
  return {
    props: {
      quizQuestions,
    },
  };
}

// The page component now receives the data as a prop
export default function MCQPage({ quizQuestions }) {
  return (
    <div>
      <Head>
        <title>Assessment Quiz: Measurement - Physics Daily</title>
        <meta name="description" content="A comprehensive multiple-choice quiz on measurement, units, and dimensional analysis." />
      </Head>

      <Header />

      <div className="breadcrumb">
        <div className="container">
          <nav>
            <Link href="/">Home</Link>
            <span className="separator">›</span>
            <Link href="/mechanics/foundations">Classical Mechanics</Link>
            <span className="separator">›</span>
            <Link href="/mechanics/measurements">📏 Measurement</Link>
            <span className="separator">›</span>
            <span className="current">📊 Assessment Quiz</span>
          </nav>
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className="container">
          <header className={styles.header} style={{ background: 'none', padding: '1rem 0' }}>
              <h1>Chapter 1: Assessment Quiz</h1>
              <p className={styles.subtitle}>Test your mastery of Measurement</p>
          </header>
          <Quiz quizData={quizQuestions} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
