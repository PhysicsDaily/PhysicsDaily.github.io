// pages/mechanics/measurements/index.js
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import useMathJax from '../../../hooks/useMathJax';
import styles from '../../../styles/Measurements.module.css';

export default function MeasurementsPage() {
  // Use the shared MathJax hook instead of duplicate loading
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
    <>
      <Head>
        <title>Chapter 1: Measurement in Physics - Physics Daily</title>
        <meta name="description" content="Master the fundamentals of measurement in physics: units, significant figures, dimensional analysis, and error analysis. Perfect for students preparing for competitive exams." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <div className="breadcrumb">
        <div className="container">
          <Link href="/">Home</Link>
          <span className={styles.separator}>›</span>
          <Link href="/mechanics/foundations">Classical Mechanics</Link>
          <span className={styles.separator}>›</span>
          <span>📏 Measurement</span>
        </div>
      </div>

      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>📏 Chapter 1: Measurement in Physics</h1>
          <p className={styles.subtitle}>Foundation of Scientific Physics - From Basics to Advanced Problem Solving</p>
        </div>
      </header>

      <nav className={styles.pageNav}>
        <div className={styles.container}>
          <div className={styles.navLinks}>
            <a href="#introduction">Introduction</a>
            <a href="#physical-quantities">Physical Quantities</a>
            <a href="#si-units">SI Units</a>
            <a href="#dimensional-analysis">Dimensional Analysis</a>
            <a href="#significant-figures">Significant Figures</a>
            <a href="#errors">Errors & Uncertainty</a>
            <a href="#instruments">Instruments</a>
            <a href="#greek-alphabet">Greek Alphabet</a>
            <a href="#practice">Practice</a>
          </div>
        </div>
      </nav>

      <main>
        <div className={styles.container}>
          
          {/* Introduction */}
          <section id="introduction" className={styles.section}>
            <h2>🌟 Introduction: Why Measurement Matters</h2>
            
            <div className={styles.beginnerNote}>
              <h4>🔰 For Beginners:</h4>
              <p>Imagine trying to cook without measuring ingredients, or building a house without measuring dimensions. Physics is similar - we need precise measurements to understand how the universe works!</p>
            </div>
            
            <p><strong>Physics is fundamentally an experimental science.</strong> Every law, theory, and principle comes from careful observation and measurement. Consider these amazing examples:</p>
            
            <ul>
              <li>🛰️ GPS satellites need Einstein&apos;s relativity corrections to be accurate within meters</li>
              <li>🌊 LIGO detected gravitational waves by measuring changes smaller than 1/10,000th of a proton&apos;s width</li>
              <li>⚛️ Quantum mechanics emerged from precise measurements of blackbody radiation</li>
              <li>🌍 Climate science relies on temperature measurements accurate to 0.01°C</li>
            </ul>
            
            <div className={styles.keyPoint}>
              <h4>🎯 What You&apos;ll Master in This Chapter</h4>
              <ul>
                <li><strong>Physical Quantities:</strong> Understand what makes something measurable</li>
                <li><strong>SI Units:</strong> Master the international standard system</li>
                <li><strong>Dimensional Analysis:</strong> Use dimensions to check and derive equations</li>
                <li><strong>Significant Figures:</strong> Express precision correctly</li>
                <li><strong>Error Analysis:</strong> Quantify and minimize uncertainty</li>
                <li><strong>Instruments:</strong> Use measuring tools effectively</li>
                <li><strong>Problem Solving:</strong> Apply measurement concepts to solve problems</li>
              </ul>
            </div>
            
            <div className={styles.intermediateNote}>
              <h4>💡 Measurement Principles for Success:</h4>
              <ol>
                <li><strong>Precision:</strong> How close repeated measurements are to each other</li>
                <li><strong>Accuracy:</strong> How close measurements are to the true value</li>
                <li><strong>Resolution:</strong> The smallest change an instrument can detect</li>
                <li><strong>Reproducibility:</strong> Getting the same result in different conditions</li>
              </ol>
            </div>
          </section>

          {/* Physical Quantities */}
          <section id="physical-quantities" className={styles.section}>
            <h2>1.1 Physical Quantities and Their Classification</h2>
            
            <h3>What is a Physical Quantity?</h3>
            <p>A <strong>physical quantity</strong> is anything that can be measured numerically and expressed with appropriate units. It has two parts:</p>
            <ul>
              <li><strong>Numerical value</strong> (magnitude)</li>
              <li><strong>Unit</strong> (what we&apos;re measuring in)</li>
            </ul>
            
            <div className={styles.exampleBox}>
              <h4>📝 Examples of Physical Quantities</h4>
              <ul>
                <li><strong>Length:</strong> 5.2 meters</li>
                <li><strong>Time:</strong> 10.5 seconds</li>
                <li><strong>Mass:</strong> 2.3 kilograms</li>
                <li><strong>Temperature:</strong> 25°C</li>
                <li><strong>Speed:</strong> 60 km/h</li>
              </ul>
            </div>
            
            <h3>Classification by Mathematical Nature</h3>
            
            <div className={styles.intermediateNote}>
              <h4>💡 Scalar vs Vector Quantities</h4>
              <table>
                <thead>
                  <tr><th>Scalar Quantities</th><th>Vector Quantities</th></tr>
                </thead>
                <tbody>
                  <tr><td>Have magnitude only</td><td>Have both magnitude and direction</td></tr>
                  <tr><td>Add algebraically</td><td>Add vectorially</td></tr>
                  <tr><td>Examples: mass, time, speed, energy</td><td>Examples: displacement, velocity, force</td></tr>
                </tbody>
              </table>
            </div>
            
            <h3>Classification by Measurement Independence</h3>
            
            <div className={styles.keyPoint}>
              <h4>📏 Base vs Derived Quantities</h4>
              <p><strong>Base quantities</strong> are fundamental - they can&apos;t be expressed in terms of other quantities.</p>
              <p><strong>Derived quantities</strong> are combinations of base quantities.</p>
            </div>
            
            <h4>The Seven SI Base Quantities</h4>
            <table>
              <thead>
                <tr><th>Quantity</th><th>Symbol</th><th>SI Unit</th><th>Unit Symbol</th></tr>
              </thead>
              <tbody>
                <tr><td>Length</td><td>l, s, d, h</td><td>meter</td><td>m</td></tr>
                <tr><td>Mass</td><td>m</td><td>kilogram</td><td>kg</td></tr>
                <tr><td>Time</td><td>t</td><td>second</td><td>s</td></tr>
                <tr><td>Electric current</td><td>I</td><td>ampere</td><td>A</td></tr>
                <tr><td>Temperature</td><td>T</td><td>kelvin</td><td>K</td></tr>
                <tr><td>Amount of substance</td><td>n</td><td>mole</td><td>mol</td></tr>
                <tr><td>Luminous intensity</td><td>$I_v$</td><td>candela</td><td>cd</td></tr>
              </tbody>
            </table>
          </section>

          {/* Continue with remaining sections... */}
          <section id="si-units" className={styles.section}>
            <h2>1.2 The International System of Units (SI)</h2>
            <p>The <strong>International System of Units (SI)</strong> is the modern metric system used worldwide. It provides a consistent, precise way to measure all physical quantities.</p>
            
            <div className={styles.beginnerNote}>
              <h4>🔰 Why SI is Amazing:</h4>
              <ul>
                <li><strong>Universal:</strong> Same units used by scientists worldwide</li>
                <li><strong>Decimal-based:</strong> Easy conversions using powers of 10</li>
                <li><strong>Coherent:</strong> Derived units naturally follow from base units</li>
                <li><strong>Precise:</strong> Based on fundamental constants of nature (since 2019)</li>
                <li><strong>Expandable:</strong> New units can be easily added</li>
              </ul>
            </div>
          </section>

          {/* Add more sections as needed - the pattern continues... */}
          
        </div>
      </main>

      <Footer />

      <button 
        className={styles.scrollToTop}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Scroll to top"
      >
        ↑
      </button>
    </>
  );
}
