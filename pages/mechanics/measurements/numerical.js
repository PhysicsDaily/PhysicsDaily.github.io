// pages/mechanics/measurements/numerical.js

import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from '../../../styles/ContentPage.module.css';

// Array containing all the numerical problems for this page
const problems = [
  {
    id: 1,
    difficulty: 'Easy',
    question: 'A student measures the sides of a rectangular block as l = 15.12 cm, w = 3.45 cm, and h = 1.78 cm. Calculate the volume of the block, expressing the answer with the correct number of significant figures.',
    solution: (
      <>
        <h4>Step 1: Identify the operation and rule</h4>
        <p>The volume V is calculated by multiplication: <span className="equation">V = l × w × h</span>. The rule is that the result must have the same number of significant figures as the measurement with the fewest.</p>
        <h4>Step 2: Count significant figures</h4>
        <ul>
          <li>l = 15.12 cm (4 sig figs)</li>
          <li>w = 3.45 cm (3 sig figs)</li>
          <li>h = 1.78 cm (3 sig figs)</li>
        </ul>
        <p>The result must be rounded to 3 significant figures.</p>
        <h4>Step 3: Calculate and Round</h4>
        <p><span className="equation">V = 15.12 × 3.45 × 1.78 = 92.78592 cm³</span></p>
        <p>Rounding to 3 significant figures gives 92.8.</p>
        <div className={styles.finalAnswer}>
          <strong>Final Answer:</strong> The volume is <span className="equation">92.8 cm³</span>.
        </div>
      </>
    )
  },
  {
    id: 2,
    difficulty: 'Medium',
    question: "The period of a pendulum is given by T = 2π√(m/k). Check if this formula is dimensionally correct, given that the dimension of the spring constant k is [MT⁻²].",
    solution: (
      <>
        <h4>Step 1: Analyze the Left-Hand Side (LHS)</h4>
        <p>The dimension of the period T is <span className="equation">[T]</span>.</p>
        <h4>Step 2: Analyze the Right-Hand Side (RHS)</h4>
        <p>The term 2π is dimensionless. We analyze the dimensions of √(m/k).</p>
        <p>Dimension of m/k = [M] / [MT⁻²] = [M¹⁻¹ T²] = [T²].</p>
        <p>Taking the square root: √([T²]) = [T].</p>
        <h4>Step 3: Compare LHS and RHS</h4>
        <p>The dimensions match on both sides.</p>
        <div className={styles.finalAnswer}>
          <strong>Conclusion:</strong> The formula is dimensionally correct.
        </div>
      </>
    )
  },
  // Add more problems here by copying the object structure
];


export default function NumericalPage() {
  // A helper function to get the style class based on difficulty
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
        <title>Numerical Problems: Measurement - Physics Daily</title>
        <meta name="description" content="Practice numerical problems involving measurement, units, and dimensional analysis." />
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
            <span className="current">🧮 Numerical Problems</span>
          </nav>
        </div>
      </div>

      <header className={styles.header}>
        <div className="container">
          <h1>Numerical Problems</h1>
          <p className={styles.subtitle}>Chapter 1: Measurement</p>
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <div className="container">
          <div className={styles.section}>
            {problems.map(p => (
              <div key={p.id} className={styles.problem}>
                <div className={styles.problemHeader}>
                  <span className={styles.problemNumber}>Problem {p.id}</span>
                  <span className={`${styles.difficulty} ${getDifficultyClass(p.difficulty)}`}>{p.difficulty}</span>
                </div>
                <div className={styles.problemContent}>
                  <p>{p.question}</p>
                </div>
                <details>
                  <summary>View Solution</summary>
                  <div className={styles.solution}>
                    {p.solution}
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
