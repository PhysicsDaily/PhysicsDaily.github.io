// pages/mechanics/measurements/mcq.js

import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import MCQComponent from '../../../components/MCQComponent'; // The quiz engine
import styles from '../../../styles/ContentPage.module.css';

// All the questions for this quiz are stored here.
const quizQuestions = [
    { question: "1. Which of the following is a fundamental SI unit?", options: ["Newton (N)", "Joule (J)", "Watt (W)", "Kilogram (kg)"], answer: "Kilogram (kg)" },
    { question: "2. The principle of homogeneity states that:", options: ["All physical quantities must have the same units", "An equation must be dimensionally consistent", "The universe is uniform and homogeneous", "Derived units are homogeneous with fundamental units"], answer: "An equation must be dimensionally consistent" },
    { question: "3. The dimensional formula for torque is:", options: ["[MLT⁻²]", "[ML²T⁻²]", "[ML⁻¹T⁻²]", "[M⁻¹L³T⁻²]"], answer: "[ML²T⁻²]" },
    { question: "4. A light-year is a unit of:", options: ["Time", "Mass", "Distance", "Energy"], answer: "Distance" },
    { question: "5. Which quantity has dimensions [ML⁻¹T⁻²]?", options: ["Force", "Pressure", "Energy", "Power"], answer: "Pressure" },
    { question: "6. The 2019 SI redefinition was based on:", options: ["Physical artifacts", "Fundamental constants of nature", "Average measurements from multiple labs", "International committee decisions"], answer: "Fundamental constants of nature" },
    { question: "7. Dimensional analysis can be used for all EXCEPT:", options: ["Checking equation validity", "Converting units", "Determining exact numerical constants", "Deriving relationships between quantities"], answer: "Determining exact numerical constants" },
    { question: "8. The dimensional formula for angular momentum is:", options: ["[MLT⁻¹]", "[ML²T⁻¹]", "[ML²T⁻²]", "[MLT⁻²]"], answer: "[ML²T⁻¹]" },
    { question: "9. Which statement about significant figures is correct?", options: ["They represent absolute precision", "They indicate the reliability of a measurement", "They are always equal to the number of decimal places", "They are only important in theoretical physics"], answer: "They indicate the reliability of a measurement" },
    { question: "10. The number of significant figures in 1.20 × 10³ is:", options: ["2", "3", "4", "Ambiguous"], answer: "3" },
];

export default function MCQPage() {
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
          {/* We pass the questions into our interactive quiz component */}
          <MCQComponent questions={quizQuestions} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
