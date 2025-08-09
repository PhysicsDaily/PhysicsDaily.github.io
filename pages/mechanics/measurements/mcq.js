// pages/mechanics/measurements/mcq.js

import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Quiz from '../../../components/Quiz'; // Import the new Quiz component
import styles from '../../../styles/ContentPage.module.css';

// The full list of questions for this quiz
const quizQuestions = [
    { question: "1. Which of the following is a fundamental SI unit?", options: ["Newton (N)", "Joule (J)", "Watt (W)", "Kilogram (kg)"], answer: "Kilogram (kg)", solution: "The SI system has seven base units. Newton, Joule, and Watt are derived units. Kilogram (mass) is a fundamental unit." },
    { question: "2. The principle of homogeneity states that:", options: ["All physical quantities must have the same units", "An equation must be dimensionally consistent", "The universe is uniform and homogeneous", "Derived units are homogeneous with fundamental units"], answer: "An equation must be dimensionally consistent", solution: "The principle of homogeneity requires that all terms added or subtracted in a physical equation must have the same dimensions." },
    { question: "3. The dimensional formula for torque is:", options: ["[MLT⁻²]", "[ML²T⁻²]", "[ML⁻¹T⁻²]", "[M⁻¹L³T⁻²]"], answer: "[ML²T⁻²]", solution: "Torque = Force × perpendicular distance. Dimensions are [MLT⁻²] × [L] = [ML²T⁻²]." },
    { question: "4. A light-year is a unit of:", options: ["Time", "Mass", "Distance", "Energy"], answer: "Distance", solution: "A light-year is the distance that light travels in one year. It is a unit of astronomical distance." },
    { question: "5. Which quantity has dimensions [ML⁻¹T⁻²]?", options: ["Force", "Pressure", "Energy", "Power"], answer: "Pressure", solution: "Pressure = Force / Area. Dimensions are [MLT⁻²] / [L²] = [ML⁻¹T⁻²]." },
    { question: "6. The 2019 SI redefinition was based on:", options: ["Physical artifacts", "Fundamental constants of nature", "Average measurements from multiple labs", "International committee decisions"], answer: "Fundamental constants of nature", solution: "The redefinition based units on fundamental physical constants (like Planck's constant) to make them more stable and universally reproducible." },
    { question: "7. Dimensional analysis can be used for all EXCEPT:", options: ["Checking equation validity", "Converting units", "Determining exact numerical constants", "Deriving relationships between quantities"], answer: "Determining exact numerical constants", solution: "Dimensional analysis cannot determine dimensionless constants (like 1/2 or 2π) as they have no dimensions." },
    { question: "8. The dimensional formula for angular momentum (mass × velocity × radius) is:", options: ["[MLT⁻¹]", "[ML²T⁻¹]", "[ML²T⁻²]", "[MLT⁻²]"], answer: "[ML²T⁻¹]", solution: "Angular momentum = mvr. Dimensions are [M] × [LT⁻¹] × [L] = [ML²T⁻¹]." },
    { question: "9. Which statement about significant figures is correct?", options: ["They represent absolute precision", "They indicate the reliability of a measurement", "They are always equal to the number of decimal places", "They are only important in theoretical physics"], answer: "They indicate the reliability of a measurement", solution: "Significant figures communicate the precision of a measurement, including all certain digits and one uncertain digit." },
    { question: "10. The meter is currently defined as:", options: ["1/40,000,000 of the Earth's circumference", "The length of a specific platinum-iridium bar", "The distance light travels in vacuum in 1/299,792,458 of a second", "1,650,763.73 wavelengths of krypton-86 radiation"], answer: "The distance light travels in vacuum in 1/299,792,458 of a second", solution: "This definition links the meter to the speed of light, a fundamental constant, and the second." }
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
          {/* We pass the questions into our new interactive quiz component */}
          <Quiz quizData={quizQuestions} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
