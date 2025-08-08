// pages/mechanics/measurements/conceptual.js

import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from '../../../styles/ContentPage.module.css';

// Array containing all the conceptual questions for this page
const questions = [
  {
    id: 1,
    difficulty: 'Easy',
    question: 'Can a quantity have dimensions but still be dimensionless? Explain with an example.',
    answer: (
      <>
        <p>No, this is a contradiction in terms. A quantity either has dimensions or it is dimensionless. However, a quantity can have units but be dimensionless. A great example is an angle.</p>
        <p>An angle in radians is defined as the ratio of arc length (s) to the radius (r), both of which have dimensions of length [L].</p>
        <p><span className="equation">θ = s / r</span></p>
        <p>The dimensions are <span className="equation">[L] / [L] = 1</span>. The dimensions cancel out, making the angle a dimensionless quantity, even though it has a unit (radians).</p>
      </>
    )
  },
  {
    id: 2,
    difficulty: 'Medium',
    question: 'Three students measure the length of a rod and record their results as 15.3 cm, 15.31 cm, and 15.312 cm. Which measurement is the most precise, and which is the most accurate? Can you tell from the data given?',
    answer: (
      <>
        <p><strong>Precision</strong> refers to the level of detail or the number of decimal places in a measurement. The measurement <strong>15.312 cm</strong> is the most precise because it is measured to the thousandths place.</p>
        <p><strong>Accuracy</strong> refers to how close a measurement is to the true or accepted value. From the data given, we **cannot determine which measurement is the most accurate** because we do not know the true length of the rod. For example, if the true length was exactly 15.3 cm, the first measurement would be the most accurate despite being the least precise.</p>
      </>
    )
  },
  // Add more questions here by copying the object structure
];

export default function ConceptualPage() {
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
        <title>Conceptual Questions: Measurement - Physics Daily</title>
        <meta name="description" content="Test your conceptual understanding of measurement, units, and dimensional analysis." />
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
            <span className="current">🤔 Conceptual Questions</span>
          </nav>
        </div>
      </div>
      
      <main className={styles.mainContent}>
        <div className="container">
          <div className={styles.section}>
            <header className={styles.header}>
              <div className="container">
                <h1>Conceptual Questions</h1>
                <p className={styles.subtitle}>Chapter 1: Measurement</p>
              </div>
            </header>
            {questions.map(q => (
              <div key={q.id} className={styles.problem}>
                <div className={styles.problemHeader}>
                  <span className={styles.problemNumber}>Question {q.id}</span>
                  <span className={`${styles.difficulty} ${getDifficultyClass(q.difficulty)}`}>{q.difficulty}</span>
                </div>
                <div className={styles.problemContent}>
                  <p>{q.question}</p>
                </div>
                <details>
                  <summary>View Answer</summary>
                  <div className={styles.solution}>
                    {q.answer}
                  </div>
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
