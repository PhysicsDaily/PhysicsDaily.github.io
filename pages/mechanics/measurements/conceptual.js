import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import useMathJax from '../../../hooks/useMathJax';
import styles from '../../../styles/ContentPage.module.css';

const questions = [
  { id: 1, difficulty: 'Easy', question: 'Can an equation be dimensionally correct but still be physically wrong? Provide an example.', answer: `<p>Yes. For kinetic energy, both $K = mv^2$ and $K = \\frac{1}{2}mv^2$ are dimensionally correct (both are $[ML^2T^{-2}]$). However, only the second formula is physically correct. Dimensional consistency is a necessary, but not sufficient, condition for an equation to be correct.</p>` },
  { id: 2, difficulty: 'Medium', question: 'Explain the difference between accuracy and precision in measurement.', answer: `<p><strong>Accuracy</strong> refers to how close measurements are to the true value. <strong>Precision</strong> refers to how close repeated measurements are to each other. You can be precise but not accurate if all your measurements are tightly clustered in the wrong place.</p>` },
  { id: 3, difficulty: 'Hard', question: 'Why must arguments of transcendental functions like $\\sin(x)$, $\\cos(x)$, or $e^x$ be dimensionless?', answer: `<p>These functions are defined by their infinite series expansions. For example, $e^x = 1 + x + x^2/2! + ...$. For this sum to be valid, every term must have the same dimension. If $x$ had a dimension (e.g., length $[L]$), the terms would have dimensions of $[1]$, $[L]$, $[L^2]$, etc., which cannot be added together. Therefore, the argument $x$ must be dimensionless.</p>` },
];

export default function ConceptualPage() {
  useMathJax([questions]);

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
            <Link href="/">Home</Link><span className="separator">›</span>
            <Link href="/mechanics/foundations">Classical Mechanics</Link><span className="separator">›</span>
            <Link href="/mechanics/measurements">📏 Measurement</Link><span className="separator">›</span>
            <span className="current">🤔 Conceptual Questions</span>
          </nav>
        </div>
      </div>
      
      <main className={styles.mainContent}>
        <div className="container">
          <div className={styles.section}>
            <header className={styles.header} style={{ background: 'none', padding: 0, textAlign: 'left' }}>
              <h1>Conceptual Questions</h1>
              <p className={styles.subtitle}>Chapter 1: Measurement</p>
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
