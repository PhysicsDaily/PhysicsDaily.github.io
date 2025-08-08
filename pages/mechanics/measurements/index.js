// pages/mechanics/measurements/index.js

import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
// We will create this new CSS module in the next step
import styles from '../../../styles/ContentPage.module.css';

export default function MeasurementsPage() {
  return (
    <div>
      <Head>
        <title>Chapter 1: Measurement - Physics Daily</title>
        <meta name="description" content="Master scientific measurement, significant figures, and dimensional analysis in physics." />
      </Head>

      <Header />

      <div className="breadcrumb">
        <div className="container">
          <nav>
            <Link href="/">Home</Link>
            <span className="separator">›</span>
            <Link href="/mechanics/foundations">Classical Mechanics</Link>
            <span className="separator">›</span>
            <span className="current">📏 Measurement</span>
          </nav>
        </div>
      </div>

      <header className={styles.header}>
        <div className="container">
          <h1>Chapter 1: Measurement</h1>
          <p className={styles.subtitle}>Foundation of Scientific Physics</p>
          <p className={styles.description}>
            Master the fundamental concepts of measurement, units, and dimensional analysis that form the bedrock of all physics.
          </p>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className="container">
          <div className={styles.section}>
            <h2>🌟 Introduction: Why Measurement Matters</h2>
            <div className={styles.beginnerNote}>
              <h4>🔰 For Beginners:</h4>
              <p>Imagine trying to cook without measuring ingredients. Physics is similar - we need precise measurements to understand how the universe works! Every law of physics started with careful observations.</p>
            </div>
            <p><strong>Physics is fundamentally an experimental science.</strong> Every law, theory, and principle comes from careful observation and measurement. The GPS in your phone works because engineers understand Einstein's theory of relativity with incredible precision. Without it, your GPS would be off by miles!</p>
            <div className={styles.highlightBox}>
              <h4>The Power of Precise Measurement</h4>
              <p>The detection of gravitational waves required measuring distance changes smaller than 1/10,000th the width of a proton!</p>
            </div>
          </div>

          <div className={styles.section}>
            <h2>1.1 The International System of Units (SI)</h2>
            <p>The <strong>International System of Units (SI)</strong> is the modern form of the metric system. It's built on seven fundamental base units.</p>
            <h3>The Seven SI Base Units</h3>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Quantity</th>
                    <th>Unit Name</th>
                    <th>Symbol</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Time</td><td>second</td><td>s</td></tr>
                  <tr><td>Length</td><td>meter</td><td>m</td></tr>
                  <tr><td>Mass</td><td>kilogram</td><td>kg</td></tr>
                  <tr><td>Electric current</td><td>ampere</td><td>A</td></tr>
                  <tr><td>Temperature</td><td>kelvin</td><td>K</td></tr>
                  <tr><td>Amount of substance</td><td>mole</td><td>mol</td></tr>
                  <tr><td>Luminous intensity</td><td>candela</td><td>cd</td></tr>
                </tbody>
              </table>
            </div>
            <div className={styles.advancedNote}>
              <h4>🎓 The 2019 SI Redefinition:</h4>
              <p>All SI units are now defined using fundamental constants of nature (like the speed of light), ensuring universal reproducibility without needing physical artifacts.</p>
            </div>
          </div>
          
          <div className={styles.section}>
            <h2>1.2 Dimensional Analysis</h2>
            <p>Every physical quantity has <strong>dimensions</strong> expressed in terms of Mass [M], Length [L], and Time [T]. Dimensional analysis is a powerful tool for checking equations.</p>
            <div className={styles.exampleBox}>
                <h4>📝 Example: Checking a Kinematic Equation</h4>
                <p>Consider: <span className="equation">x = x₀ + v₀t + ½at²</span></p>
                <ul>
                    <li>Dimension of <span className="math">x</span>: <span className="equation">[L]</span></li>
                    <li>Dimension of <span className="math">v₀t</span>: <span className="equation">[L/T][T] = [L]</span></li>
                    <li>Dimension of <span className="math">½at²</span>: <span className="equation">[L/T²][T²] = [L]</span></li>
                </ul>
                <p>✅ All terms have the dimension of length [L], so the equation is dimensionally consistent.</p>
            </div>
          </div>
        </div>
      </main>

      <section className={styles.practiceSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Test Your Understanding</h2>
            <p className={styles.sectionSubtitle}>Apply what you've learned by tackling conceptual questions, numerical problems, and a comprehensive quiz.</p>
          </div>
          <div className={styles.practiceGrid}>
            <Link href="/mechanics/measurements/conceptual" passHref>
              <div className={styles.practiceCard}>
                  <div className={styles.icon}>🤔</div>
                  <h3>Conceptual Questions</h3>
                  <p>Challenge your understanding of the core principles and theoretical concepts.</p>
              </div>
            </Link>
            <Link href="/mechanics/measurements/numerical" passHref>
              <div className={styles.practiceCard}>
                <div className={styles.icon}>🧮</div>
                <h3>Numerical Problems</h3>
                <p>Sharpen your problem-solving skills with a variety of calculations and applications.</p>
              </div>
            </Link>
            <Link href="/mechanics/measurements/mcq" passHref>
              <div className={styles.practiceCard}>
                <div className={styles.icon}>📊</div>
                <h3>Assessment Quiz</h3>
                <p>Take a timed, comprehensive quiz to test your mastery of the entire chapter.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
