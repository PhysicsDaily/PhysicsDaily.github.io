import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import useMathJax from '../../../hooks/useMathJax';
import styles from '../../../styles/ContentPage.module.css';

const problems = [
  { id: 1, difficulty: 'Easy', question: 'A student measures a rectangle with length $l = 15.12$ cm and width $w = 3.45$ cm. Calculate the area with the correct number of significant figures.', solution: `<h4>Steps:</h4><ol><li>Count significant figures: $l$ (4), $w$ (3). The result must have 3.</li><li>Calculate: $A = 15.12 \\times 3.45 = 52.164$ cm²</li><li>Round: Rounding to 3 significant figures gives 52.2.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> $52.2$ cm²</div>` },
  { id: 2, difficulty: 'Medium', question: 'The period of a spring-mass system is $T = 2\\pi\\sqrt{m/k}$. Check if this is dimensionally correct. (Dimension of spring constant $k$ is $[MT^{-2}]$)', solution: `<h4>Steps:</h4><ol><li>LHS dimension: $[T]$.</li><li>RHS dimension: $\\sqrt{[M] / [MT^{-2}]} = \\sqrt{[T^2]} = [T]$.</li><li>Conclusion: The dimensions match.</li></ol><div class="finalAnswer"><strong>Conclusion:</strong> The formula is dimensionally correct.</div>` },
  { id: 3, difficulty: 'Hard', question: 'A quantity P is related by $P = a^3b^2 / (\\sqrt{c} d)$. The percentage errors in a, b, c, and d are 1%, 3%, 4%, and 2% respectively. Find the percentage error in P.', solution: `<h4>Steps:</h4><ol><li>Error formula: $\\frac{\\Delta P}{P} = 3\\frac{\\Delta a}{a} + 2\\frac{\\Delta b}{b} + \\frac{1}{2}\\frac{\\Delta c}{c} + \\frac{\\Delta d}{d}$.</li><li>Add percentage errors: % Error = $3(1\\%) + 2(3\\%) + \\frac{1}{2}(4\\%) + 1(2\\%) = 3\\% + 6\\% + 2\\% + 2\\%$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 13%</div>` },
];

export default function NumericalPage() {
  useMathJax([problems]);

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
          <nav aria-label="Breadcrumb">
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

      <header className={styles.pageHeader}>
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
                <div className={styles.problemContent} dangerouslySetInnerHTML={{ __html: p.question }} />
                <details>
                  <summary>View Solution</summary>
                  <div className={styles.solution} dangerouslySetInnerHTML={{ __html: p.solution }} />
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
