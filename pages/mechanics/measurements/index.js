// pages/mechanics/measurements/index.js

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';

// Data for Table of Contents and section rendering
const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'physical-quantities', title: '1.1 Physical Quantities, Units' },
  { id: 'si-units', title: '1.2 The SI System' },
  { id: 'quantities-list', title: '1.3 List of Quantities' },
  { id: 'dimensional-analysis', title: '1.4 Dimensional Analysis' },
  { id: 'sig-figs', title: '1.5 Significant Figures' },
  { id: 'error-analysis', title: '1.6 Error Analysis' },
  { id: 'error-types', title: '1.7 Types of Errors' },
  { id: 'prefixes-notation', title: '1.8 Prefixes & Notation' },
  { id: 'instruments', title: '1.9 Instruments & Calibration' },
  { id: 'reporting-rounding', title: '1.10 Reporting & Rounding' },
  { id: 'pi-theorem', title: '1.11 Buckingham Pi Theorem' },
  { id: 'graphing', title: '1.12 Graphing & Linearization' },
  { id: 'fermi-estimation', title: '1.13 Fermi Estimation' },
  { id: 'exam-tips', title: '1.14 Conversions & Tips' },
  { id: 'greek-alphabet', title: '1.15 Greek Alphabet' },
  { id: 'practice', title: 'Practice Problems' },
];

export default function MeasurementsPage() {
  const [activeSection, setActiveSection] = useState('');
  const [theme, setTheme] = useState('light');
  const observer = useRef(null);

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    // Disconnect previous observer if it exists
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create a new IntersectionObserver
    observer.current = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most visible in the viewport
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        if (intersectingEntry) {
          setActiveSection(intersectingEntry.target.id);
        }
      },
      // Options: trigger when a section is 20% from the top and 79% from the bottom
      { rootMargin: '-20% 0px -79% 0px' }
    );

    // Observe all section elements
    const elements = sections.map(sec => document.getElementById(sec.id)).filter(el => el);
    elements.forEach((el) => observer.current.observe(el));
    
    // Cleanup function to disconnect the observer
    return () => observer.current.disconnect();
  }, []); // Empty dependency array ensures this runs once on mount


  return (
    <>
      <Head>
        <title>Chapter 1: Measurement - Physics Daily</title>
        <meta name="description" content="Master scientific measurement, significant figures, and dimensional analysis in physics." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <style jsx global>{`
          :root {
            --primary-color: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary-color: #64748b;
            --accent-color: #06b6d4;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --danger-color: #ef4444;
            --text-primary: #1e293b;
            --text-secondary: #475569;
            --bg-primary: #ffffff;
            --bg-secondary: #f8fafc;
            --card-bg: #ffffff;
            --border-color: #e2e8f0;
            --border-hover: #cbd5e1;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --border-radius: 12px;
            --transition: all 0.2s ease;
          }

          [data-theme="dark"] {
            --text-primary: #f1f5f9;
            --text-secondary: #cbd5e1;
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --card-bg: #334155;
            --border-color: #475569;
            --border-hover: #64748b;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background-color: var(--bg-primary);
            transition: all 0.3s ease;
          }

          .math {
            font-family: 'JetBrains Mono', monospace;
            font-style: italic;
            font-weight: 500;
          }

          .equation {
            font-family: 'JetBrains Mono', monospace;
            font-size: 1.1em;
            font-weight: 500;
            background: var(--bg-secondary);
            padding: 0.2em 0.4em;
            border-radius: 4px;
            border: 1px solid var(--border-color);
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .nav {
            background: var(--card-bg);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
          }

          .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .nav-logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
            text-decoration: none;
          }

          .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
          }

          .nav-links a {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
          }

          .nav-links a:hover {
            color: var(--primary-color);
          }

          .breadcrumb {
            background: var(--bg-secondary);
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
          }

          .breadcrumb a {
            color: var(--text-secondary);
            text-decoration: none;
          }

          .breadcrumb a:hover {
            color: var(--primary-color);
          }

          .separator {
            margin: 0 0.5rem;
            color: var(--text-secondary);
          }

          .current {
            color: var(--text-primary);
            font-weight: 500;
          }

          .header {
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            color: white;
            padding: 4rem 0;
            text-align: center;
          }

          .header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
          }

          .subtitle {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            opacity: 0.9;
          }

          .description {
            font-size: 1.1rem;
            opacity: 0.8;
            max-width: 600px;
            margin: 0 auto;
          }

          .main-content {
            padding: 2rem 0;
          }

          .theme-toggle {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1000;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 25px;
            padding: 8px;
            box-shadow: var(--shadow-lg);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          .theme-toggle button {
            background: none;
            border: none;
            padding: 12px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            color: var(--text-secondary);
          }

          .theme-toggle button:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
            transform: scale(1.05);
          }

          .theme-toggle button.active {
            background: var(--primary-color);
            color: white;
            transform: scale(1.1);
            box-shadow: var(--shadow-md);
          }

          .theme-toggle button.active:hover {
            background: var(--primary-dark);
          }

          .section {
            margin: 32px 0;
            padding: 24px;
            border-radius: 12px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-md);
          }

          .section h2 {
            color: var(--primary-color);
            margin-bottom: 1rem;
            font-size: 1.8rem;
            font-weight: 600;
          }

          .section h3 {
            color: var(--text-primary);
            margin: 1.5rem 0 1rem 0;
            font-size: 1.3rem;
            font-weight: 600;
          }

          .section h4 {
            color: var(--text-primary);
            margin: 1rem 0 0.5rem 0;
            font-size: 1.1rem;
            font-weight: 600;
          }

          .section p {
            margin-bottom: 1rem;
            color: var(--text-secondary);
            text-align: justify;
          }

          .section ul, .section ol {
            margin: 1rem 0 1rem 2rem;
            color: var(--text-secondary);
          }

          .section li {
            margin-bottom: 0.5rem;
          }

          .highlight-box {
            background: linear-gradient(135deg, #e0f2fe, #f0f9ff);
            border-left: 4px solid var(--accent-color);
            padding: 16px;
            margin: 16px 0;
            border-radius: 8px;
          }

          [data-theme="dark"] .highlight-box {
            background: linear-gradient(135deg, #164e63, #0c4a6e);
          }

          .beginner-note {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border-left: 4px solid var(--warning-color);
            padding: 16px;
            margin: 16px 0;
            border-radius: 8px;
          }

          [data-theme="dark"] .beginner-note {
            background: linear-gradient(135deg, #451a03, #78350f);
          }

          .advanced-note {
            background: linear-gradient(135deg, #f3e8ff, #ede9fe);
            border-left: 4px solid #8b5cf6;
            padding: 16px;
            margin: 16px 0;
            border-radius: 8px;
          }

          [data-theme="dark"] .advanced-note {
            background: linear-gradient(135deg, #2d1b69, #3730a3);
          }
          
          .danger-note {
            background: linear-gradient(135deg, #ffe4e6, #fee2e2);
            border-left: 4px solid var(--danger-color);
            padding: 16px;
            margin: 16px 0;
            border-radius: 8px;
          }

          [data-theme="dark"] .danger-note {
            background: linear-gradient(135deg, #7f1d1d, #991b1b);
          }

          .formula-box {
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
            margin: 16px 0;
            text-align: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: 1.2rem;
            font-weight: 500;
          }

          .example-box {
            background: linear-gradient(135deg, #dcfce7, #bbf7d0);
            border-left: 4px solid var(--success-color);
            padding: 16px;
            margin: 16px 0;
            border-radius: 8px;
          }

          [data-theme="dark"] .example-box {
            background: linear-gradient(135deg, #14532d, #166534);
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: var(--card-bg);
            border-radius: 8px;
            overflow: hidden;
            font-size: 0.9rem;
          }

          th, td {
            border: 1px solid var(--border-color);
            padding: 8px 12px;
            text-align: left;
            vertical-align: top;
          }

          th {
            background: var(--bg-secondary);
            font-weight: 600;
            color: var(--text-primary);
          }

          td {
            color: var(--text-secondary);
          }

          .two-column-table {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }

          .column-table {
            overflow-x: auto;
          }

          .practice-section {
            padding: 2rem 0;
            background-color: var(--bg-secondary);
          }
          
          .section-header {
            text-align: center;
            margin-bottom: 3rem;
          }
          
          .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 1rem;
          }
          
          .section-subtitle {
            font-size: 1.2rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
          }
          
          .practice-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
          }
          
          .practice-card {
            background: var(--card-bg);
            border-radius: var(--border-radius);
            padding: 2rem;
            text-decoration: none;
            color: var(--text-primary);
            transition: var(--transition);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
            text-align: center;
          }
          
          .practice-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
            border-color: var(--primary-color);
          }
          
          .practice-card .icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          
          .practice-card h3 {
            font-size: 1.25rem;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
          }
          
          .practice-card p {
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
          }
          
          .btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            margin: 8px;
            font-weight: 500;
            transition: all 0.2s ease;
            display: inline-block;
            text-decoration: none;
          }

          .btn:hover {
            background: var(--primary-dark);
            transform: translateY(-1px);
          }
          
          .btn-practice {
            width: 100%;
          }

          .sig-figs-section {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }

          .operation-example {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
          }

          .footer {
            background: var(--bg-secondary);
            border-top: 1px solid var(--border-color);
            padding: 2rem 0;
            text-align: center;
            color: var(--text-secondary);
          }

          @media (max-width: 768px) {
            .theme-toggle {
              top: 80px;
              right: 10px;
              scale: 0.85;
            }

            .header h1 {
              font-size: 2rem;
            }

            .nav-links {
              display: none;
            }

            .two-column-table {
              grid-template-columns: 1fr;
            }

            table {
              font-size: 0.8rem;
            }

            th, td {
              padding: 6px 8px;
            }
          }
        `}</style>
      </Head>

      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-XN081SR2KP" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XN081SR2KP');
        `}
      </Script>

      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <Link href="/" className="nav-logo">Physics Daily</Link>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/resources">Resources</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contribute">Contribute</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="theme-toggle">
        <button 
          onClick={() => applyTheme('light')}
          className={theme === 'light' ? 'active' : ''}
          title="Light Theme"
        >
          ☀️
        </button>
        <button 
          onClick={() => applyTheme('dark')}
          className={theme === 'dark' ? 'active' : ''}
          title="Dark Theme"
        >
          🌙
        </button>
      </div>

      <div className="breadcrumb">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">›</span>
            <Link href="/mechanics/foundations">Classical Mechanics</Link>
            <span className="separator">›</span>
            <span className="current">📏 Measurement</span>
          </nav>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <h1>Chapter 1: Measurement</h1>
          <p className="subtitle">Foundation of Scientific Physics</p>
          <p className="description">
            Master the fundamental concepts of measurement, units, and dimensional analysis that form the bedrock of all physics - from basic concepts to advanced applications.
          </p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div id="intro" className="section">
            <h2>🌟 Introduction: Why Measurement Matters</h2>
            <div className="beginner-note">
              <h4>🔰 For Beginners:</h4>
              <p>Imagine trying to cook without measuring ingredients. Physics is similar - we need precise measurements to understand how the universe works! Every law of physics started with careful observations.</p>
            </div>
            <p><strong>Physics is fundamentally an experimental science.</strong> Every law, theory, and principle comes from careful observation and measurement. The GPS in your phone works because engineers understand Einstein's theory of relativity with incredible precision. Without it, your GPS would be off by miles!</p>
            <div className="highlight-box">
              <h4>The Power of Precise Measurement</h4>
              <p>The detection of gravitational waves required measuring distance changes smaller than 1/10,000th the width of a proton!</p>
            </div>
            <div className="advanced-note">
              <h4>🎓 Advanced Insight:</h4>
              <p>Modern physics reaches quantum limits of precision. The Heisenberg uncertainty principle imposes a fundamental bound on simultaneous measurements (like position and momentum). This is not a technological constraint—it's built into nature.</p>
            </div>
            <h3>Measurement Chain and Traceability</h3>
            <p>Reliable measurements trace back to national/international standards via calibrated instruments. This “traceability chain” ensures comparability across labs and time.</p>
            <div className="highlight-box">
              <h4>Key Ideas</h4>
              <ul>
                <li><strong>Resolution:</strong> smallest distinguishable change (instrument property).</li>
                <li><strong>Accuracy:</strong> closeness to true value (affected by systematic errors).</li>
                <li><strong>Precision:</strong> repeatability (scatter due to random errors).</li>
              </ul>
            </div>
          </div>

          <div id="physical-quantities" className="section">
            <h2>1.1 Physical Quantities, Standards, and Units</h2>
            <h3>What Are Physical Quantities?</h3>
            <p>A <strong>physical quantity</strong> is any measurable property of matter or energy.</p>
            <ul>
              <li><strong>Scalar quantities:</strong> magnitude only (mass, time, temperature, energy).</li>
              <li><strong>Vector quantities:</strong> magnitude and direction (displacement, velocity, acceleration, force).</li>
            </ul>
            <h3>Operational Definitions</h3>
            <p>Each quantity needs a clear operational definition—how it is measured.</p>
            <div className="example-box">
              <h4>📝 Example: Defining Velocity</h4>
              <p>Operational definition: change in position per time interval: <span className="equation">v = Δx/Δt</span>.</p>
            </div>
            <h3>Characteristics of Good Standards</h3>
            <div className="highlight-box">
              <ol>
                <li><strong>Accessibility:</strong> reproducible anywhere.</li>
                <li><strong>Invariability:</strong> unchanging over time and space.</li>
                <li><strong>Precision:</strong> supports desired accuracy.</li>
                <li><strong>Reproducibility:</strong> independent measurements agree.</li>
              </ol>
            </div>
            <h3>Base vs. Derived Quantities</h3>
            <ul>
              <li><strong>Base quantities:</strong> time, length, mass, current, temperature, amount, luminous intensity.</li>
              <li><strong>Derived quantities:</strong> built from base quantities (e.g., force = mass × acceleration).</li>
            </ul>
            <h3>Coherent Units and Special Names</h3>
            <p>SI is <em>coherent</em>: derived units come from base units without extra factors. Some have special names:</p>
            <ul>
              <li>newton (N) = kg·m·s⁻², joule (J) = N·m, watt (W) = J·s⁻¹</li>
              <li>pascal (Pa) = N·m⁻², coulomb (C) = A·s, volt (V) = W·A⁻¹</li>
              <li>ohm (Ω) = V·A⁻¹, tesla (T) = N·A⁻¹·m⁻¹, henry (H) = Ω·s</li>
            </ul>
            <div className="example-box">
              <h4>📝 Olympiad Tip</h4>
              <p>Introduce or eliminate units quickly via coherence: if P = Fv, then [P] = [F][v] = (kg·m·s⁻²)(m·s⁻¹) = kg·m²·s⁻³ = W.</p>
            </div>
          </div>

          <div id="si-units" className="section">
            <h2>1.2 The International System of Units (SI)</h2>
            <p>The <strong>International System of Units (SI)</strong> is the modern metric system, defined from fundamental constants and built on seven base units.</p>
            <h3>The Seven SI Base Units</h3>
            <div className="column-table">
              <table>
                <thead>
                  <tr><th>Quantity</th><th>Unit Name</th><th>Symbol</th></tr>
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
            <div className="advanced-note">
              <h4>🎓 The 2019 SI Redefinition:</h4>
              <p>All SI units are defined via fundamental constants (c, h, e, k, N<sub>A</sub>, etc.), eliminating dependence on physical artifacts and enabling universal reproducibility.</p>
            </div>
            <h3>Defining Constants (Exact)</h3>
            <p>After 2019, fixed exact values define base units: c, h, e, k<sub>B</sub>, N<sub>A</sub>, K<sub>cd</sub>, Δν<sub>Cs</sub>.</p>
            <ul>
              <li>c = 299,792,458 m·s⁻¹ defines the meter via time.</li>
              <li>h = 6.62607015×10⁻³⁴ J·s defines the kilogram via Kibble balance.</li>
              <li>e, k<sub>B</sub>, N<sub>A</sub>, K<sub>cd</sub>, Δν<sub>Cs</sub> define A, K, mol, cd, s respectively.</li>
            </ul>
            <div className="highlight-box">
              <h4>Practice</h4>
              <p>Angles (rad) and solid angles (sr) are dimensionless in SI but carry named units for clarity.</p>
            </div>
          </div>

          <div id="quantities-list" className="section">
            <h2>1.3 Comprehensive List of Physical Quantities and Their Dimensions</h2>
            <p>Fundamental quantities form the basis; derived quantities combine them via relationships.</p>
            <h3>Mechanical Quantities (Selected)</h3>
            <div className="column-table">
              <table>
                <thead>
                  <tr><th>Quantity</th><th>Symbol</th><th>SI Unit</th><th>Dimension</th><th>Formula</th></tr>
                </thead>
                <tbody>
                  <tr><td>Length</td><td>l, x</td><td>m</td><td>[L]</td><td>fundamental</td></tr>
                  <tr><td>Mass</td><td>m</td><td>kg</td><td>[M]</td><td>fundamental</td></tr>
                  <tr><td>Time</td><td>t</td><td>s</td><td>[T]</td><td>fundamental</td></tr>
                  <tr><td>Area</td><td>A</td><td>m²</td><td>[L²]</td><td>A = l × w</td></tr>
                  <tr><td>Volume</td><td>V</td><td>m³</td><td>[L³]</td><td>V = l × w × h</td></tr>
                  <tr><td>Density</td><td>ρ</td><td>kg/m³</td><td>[ML⁻³]</td><td>ρ = m/V</td></tr>
                  <tr><td>Velocity</td><td>v</td><td>m/s</td><td>[LT⁻¹]</td><td>v = dx/dt</td></tr>
                  <tr><td>Acceleration</td><td>a</td><td>m/s²</td><td>[LT⁻²]</td><td>a = dv/dt</td></tr>
                  <tr><td>Force</td><td>F</td><td>N</td><td>[MLT⁻²]</td><td>F = ma</td></tr>
                  <tr><td>Momentum</td><td>p</td><td>kg·m/s</td><td>[MLT⁻¹]</td><td>p = mv</td></tr>
                  <tr><td>Work/Energy</td><td>W, E</td><td>J</td><td>[ML²T⁻²]</td><td>W = F·d</td></tr>
                  <tr><td>Power</td><td>P</td><td>W</td><td>[ML²T⁻³]</td><td>P = W/t</td></tr>
                  <tr><td>Pressure</td><td>p</td><td>Pa</td><td>[ML⁻¹T⁻²]</td><td>p = F/A</td></tr>
                  <tr><td>Angular velocity</td><td>ω</td><td>rad/s</td><td>[T⁻¹]</td><td>ω = dθ/dt</td></tr>
                  <tr><td>Angular momentum</td><td>L</td><td>kg·m²/s</td><td>[ML²T⁻¹]</td><td>L = Iω</td></tr>
                  <tr><td>Torque</td><td>τ</td><td>N·m</td><td>[ML²T⁻²]</td><td>τ = r × F</td></tr>
                  <tr><td>Moment of inertia</td><td>I</td><td>kg·m²</td><td>[ML²]</td><td>I = Σmr²</td></tr>
                  <tr><td>Frequency</td><td>f</td><td>Hz</td><td>[T⁻¹]</td><td>f = 1/T</td></tr>
                  <tr><td>Period</td><td>T</td><td>s</td><td>[T]</td><td>T = 1/f</td></tr>
                  <tr><td>Stress</td><td>σ</td><td>Pa</td><td>[ML⁻¹T⁻²]</td><td>σ = F/A</td></tr>
                  <tr><td>Strain</td><td>ε</td><td>1</td><td>[1]</td><td>ε = ΔL/L</td></tr>
                  <tr><td>Young’s modulus</td><td>Y</td><td>Pa</td><td>[ML⁻¹T⁻²]</td><td>Y = σ/ε</td></tr>
                  <tr><td>Viscosity</td><td>η</td><td>Pa·s</td><td>[ML⁻¹T⁻¹]</td><td>η = τ/(dv/dy)</td></tr>
                  <tr><td>Spring constant</td><td>k</td><td>N/m</td><td>[MT⁻²]</td><td>F = kx</td></tr>
                  <tr><td>Gravitational field</td><td>g</td><td>m/s²</td><td>[LT⁻²]</td><td>g = F/m</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="dimensional-analysis" className="section">
            <h2>1.4 Dimensional Analysis: Uses and Limitations</h2>
            <p>Dimensions are expressed using base symbols like [M], [L], [T], [I], [Θ], [N], [J]. Dimensional analysis helps validate, derive, convert, and interpret relationships.</p>
            <h3>1) Checking Dimensional Consistency</h3>
            <p>All terms in a valid equation must share the same dimension.</p>
            <div className="example-box">
              <h4>📝 Example: Kinematics</h4>
              <p><span className="equation">x = x₀ + v₀t + ½at²</span>. Each term has dimension [L] ⇒ consistent.</p>
            </div>
            <h3>2) Deriving Relationships</h3>
            <div className="example-box">
              <h4>📝 Example: Period of a Pendulum</h4>
              <p>Assume <span className="equation">T ∝ l^a m^b g^c</span>. Matching dimensions gives <span className="equation">b=0, c=-½, a=½</span> → <span className="equation">T = k√(l/g)</span> (k is dimensionless).</p>
            </div>
            <h3>3) Converting Units</h3>
            <div className="example-box">
              <h4>📝 Example: Newtons to Dynes</h4>
              <p>1 N = 1 kg·m·s⁻² = (10³ g)(10² cm)s⁻² = <span className="equation">10⁵ dyn</span>.</p>
            </div>
            <h3>4) Dimensions of Constants</h3>
            <div className="example-box">
              <h4>📝 Example: Gravitational Constant G</h4>
              <p>From <span className="equation">F = G m₁ m₂ / r²</span> → <span className="equation">[G] = [M⁻¹L³T⁻²]</span>.</p>
            </div>
            <div className="highlight-box">
              <h4>Pitfalls</h4>
              <ul>
                <li>Trigonometric/exponential/log arguments must be dimensionless.</li>
                <li>Linear sums can’t be deduced; only product-type relations up to constants.</li>
              </ul>
            </div>
          </div>

          <div id="sig-figs" className="section">
            <h2>1.5 Precision and Significant Figures</h2>
            <p><strong>Significant figures</strong> indicate the precision of a measurement - they include all digits that are known with certainty plus the first uncertain digit.</p>
            <div className="highlight-box">
              <h4>📊 Rules for Significant Figures</h4>
              <ol>
                <li>Non-zero digits are always significant. (e.g., 1.234 has 4)</li>
                <li>Zeros between significant digits are significant. (e.g., 506 has 3)</li>
                <li>Leading zeros are not significant. (e.g., 0.0078 has 2)</li>
                <li>Trailing zeros with a decimal point are significant. (e.g., 90.00 has 4)</li>
              </ol>
            </div>
            <h4>🧮 Operations with Significant Figures</h4>
            <p><strong>Addition/Subtraction Rule:</strong> The result is rounded to the same number of decimal places as the measurement with the fewest decimal places. (e.g., 12.345 + 1.2 = 13.5)</p>
            <p><strong>Multiplication/Division Rule:</strong> The result has the same number of significant figures as the measurement with the fewest significant figures. (e.g., 3.14 × 2.0 = 6.3)</p>
          </div>

          <div id="error-analysis" className="section">
            <h2>1.6 Error Analysis: Quantifying Uncertainty</h2>
            <p>Every measurement has uncertainty. Report results with both a value and an uncertainty.</p>
            <h3>Absolute, Relative, and Percentage Error</h3>
            <div className="highlight-box">
              <ol>
                <li><strong>Mean (best estimate):</strong> average of measurements.</li>
                <li><strong>Absolute error:</strong> |mean − individual|.</li>
                <li><strong>Mean absolute error:</strong> average of absolute errors.</li>
                <li><strong>Relative error:</strong> (mean absolute error)/(mean).</li>
                <li><strong>Percentage error:</strong> relative error × 100%.</li>
              </ol>
            </div>
            <h3>Propagation of Errors</h3>
            <div className="advanced-note">
              <ul>
                <li><strong>Add/Sub:</strong> <span className="equation">ΔZ = ΔA + ΔB</span></li>
                <li><strong>Mul/Div:</strong> <span className="equation">ΔZ/Z = ΔA/A + ΔB/B</span></li>
                <li><strong>Powers:</strong> <span className="equation">Z = Aⁿ ⇒ ΔZ/Z = n(ΔA/A)</span></li>
              </ul>
            </div>
            <div className="example-box">
              <h4>📝 Example: Density of a Cube</h4>
              <p><span className="equation">m = (100 ± 2) g</span>, <span className="equation">L = (10.0 ± 0.1) cm</span>, <span className="equation">ρ = m/L³</span>.</p>
              <p><span className="equation">Δρ/ρ = Δm/m + 3(ΔL/L) = 0.02 + 0.03 = 0.05</span> → 5%.</p>
            </div>
          </div>

          <div id="error-types" className="section">
            <h2>1.7 Types of Errors & Accuracy vs. Precision</h2>
            <div className="beginner-note">
              <h4>🔰 Note:</h4>
              <p>“Error” means uncertainty, not a mistake. No measurement is perfectly exact.</p>
            </div>
            <h3>Types of Errors</h3>
            <div className="highlight-box">
              <h4>Random Errors</h4>
              <ul>
                <li>Unpredictable fluctuations; reduce by averaging.</li>
                <li>Affect precision (scatter of readings).</li>
              </ul>
              <h4>Systematic Errors</h4>
              <ul>
                <li>Consistent bias (e.g., miscalibration); must be identified/corrected.</li>
                <li>Affect accuracy (closeness to true value).</li>
              </ul>
            </div>
          </div>

          <div id="prefixes-notation" className="section">
            <h2>1.8 SI Prefixes, Scientific Notation, and Orders of Magnitude</h2>
            <p>Use scientific notation and SI prefixes to express very large/small values cleanly and to minimize rounding mistakes.</p>
            <h3>Common SI Prefixes</h3>
            <div className="column-table">
              <table>
                <thead><tr><th>Prefix</th><th>Symbol</th><th>Factor</th></tr></thead>
                <tbody>
                  <tr><td>pico</td><td>p</td><td>10⁻¹²</td></tr>
                  <tr><td>nano</td><td>n</td><td>10⁻⁹</td></tr>
                  <tr><td>micro</td><td>μ</td><td>10⁻⁶</td></tr>
                  <tr><td>milli</td><td>m</td><td>10⁻³</td></tr>
                  <tr><td>kilo</td><td>k</td><td>10³</td></tr>
                  <tr><td>mega</td><td>M</td><td>10⁶</td></tr>
                  <tr><td>giga</td><td>G</td><td>10⁹</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="instruments" className="section">
            <h2>1.9 Measurement Instruments: Least Count, Zero Error, Calibration</h2>
            <h3>Least Count (LC)</h3>
            <p>Smallest change an instrument can resolve.</p>
            <ul>
              <li>Vernier calipers: LC = 1 MSD − 1 VSD (commonly 0.1 mm).</li>
              <li>Screw gauge: LC = pitch / number of circular divisions.</li>
            </ul>
            <h3>Zero Error</h3>
            <ul>
              <li>Positive zero error: reading is high at zero; subtract correction.</li>
              <li>Negative zero error: reading is low at zero; add correction.</li>
            </ul>
          </div>

          <div id="reporting-rounding" className="section">
            <h2>1.10 Reporting, Rounding, Logs, and Antilogs</h2>
            <h3>Reporting with Uncertainty</h3>
            <ul>
              <li>Match the value’s decimals to the uncertainty’s first significant digit.</li>
              <li>Prefer one significant digit in the uncertainty (two if the first digit is 1–2).</li>
            </ul>
          </div>

          <div id="pi-theorem" className="section">
            <h2>1.11 Buckingham Pi Theorem, Similarity, and Scaling Laws</h2>
            <p>Dimensional analysis generalizes via the Pi theorem: with n variables and k fundamental dimensions, expect n−k independent dimensionless groups (π terms).</p>
          </div>

          <div id="graphing" className="section">
            <h2>1.12 Graphing, Linearization, and Uncertainty of Fit</h2>
            <h3>Linearization</h3>
            <ul>
              <li>Power law y = A xⁿ ⇒ log y = log A + n log x (slope n on log–log plot).</li>
              <li>Exponential y = A {'e^{kx}'} ⇒ ln y = ln A + kx (semi-log plot).</li>
            </ul>
          </div>

          <div id="fermi-estimation" className="section">
            <h2>1.13 Fermi Estimation and Sanity Checks</h2>
            <p>Fast, rough estimates are vital in olympiads and entrance exams to eliminate options.</p>
          </div>

          <div id="exam-tips" className="section">
            <h2>1.14 Quick Conversions and Exam Tips</h2>
            <h3>Exam Technique</h3>
            <ul>
              <li>Always check dimensional homogeneity and limiting cases.</li>
              <li>Convert to base SI before plugging numbers; keep guard digits.</li>
              <li>State assumptions clearly (small-angle, negligible drag, rigid body, etc.).</li>
            </ul>
          </div>

          <div id="greek-alphabet" className="section">
            <h2>1.15 Greek Alphabet Reference</h2>
            <p>Common Greek symbols used across physics (uppercase, lowercase) with typical meanings.</p>
            <div className="column-table">
              <table>
                <thead>
                  <tr><th>Name</th><th>Uppercase</th><th>Lowercase</th><th>Common Uses</th></tr>
                </thead>
                <tbody>
                  <tr><td>Alpha</td><td>Α</td><td>α</td><td>Angular acceleration, fine-structure constant</td></tr>
                  <tr><td>Beta</td><td>Β</td><td>β</td><td>Beta decay, coefficient</td></tr>
                  <tr><td>Gamma</td><td>Γ</td><td>γ</td><td>Lorentz factor (γ), surface tension (γ), photons</td></tr>
                  <tr><td>Delta</td><td>Δ</td><td>δ</td><td>Finite change (Δ), small variation/error (δ)</td></tr>
                  <tr><td>Epsilon</td><td>Ε</td><td>ε</td><td>Permittivity, strain (ε), small quantity</td></tr>
                  <tr><td>Zeta</td><td>Ζ</td><td>ζ</td><td>Damping ratio</td></tr>
                  <tr><td>Eta</td><td>Η</td><td>η</td><td>Efficiency (η), viscosity (η)</td></tr>
                  <tr><td>Theta</td><td>Θ</td><td>θ</td><td>Angle, temperature (Θ) in some contexts</td></tr>
                  <tr><td>Lambda</td><td>Λ</td><td>λ</td><td>Cosmological constant (Λ), wavelength (λ)</td></tr>
                  <tr><td>Mu</td><td>Μ</td><td>μ</td><td>Coefficient of friction (μ), permeability (μ)</td></tr>
                  <tr><td>Nu</td><td>Ν</td><td>ν</td><td>Frequency, kinematic viscosity (ν)</td></tr>
                  <tr><td>Pi</td><td>Π</td><td>π</td><td>3.14159…, osmotic pressure</td></tr>
                  <tr><td>Rho</td><td>Ρ</td><td>ρ</td><td>Density (ρ), charge density</td></tr>
                  <tr><td>Sigma</td><td>Σ</td><td>σ</td><td>Sum (Σ), stress, cross-section</td></tr>
                  <tr><td>Tau</td><td>Τ</td><td>τ</td><td>Torque (τ), time constant (RC)</td></tr>
                  <tr><td>Phi</td><td>Φ</td><td>φ</td><td>Magnetic flux (Φ), potential (φ), angle</td></tr>
                  <tr><td>Chi</td><td>Χ</td><td>χ</td><td>Susceptibility (χ)</td></tr>
                  <tr><td>Psi</td><td>Ψ</td><td>ψ</td><td>Wavefunction (ψ)</td></tr>
                  <tr><td>Omega</td><td>Ω</td><td>ω</td><td>Ohm (Ω), angular speed (ω)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          </div>
      </main>

      <section className="practice-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Test Your Understanding</h2>
            <p className="section-subtitle">Apply what you've learned by tackling conceptual questions, numerical problems, and a comprehensive quiz.</p>
          </div>
          <div className="practice-grid">
            <Link href="/mechanics/measurements/conceptual" className="practice-card">
              <div className="icon">🤔</div>
              <h3>Conceptual Questions</h3>
              <p>Challenge your understanding of the core principles and theoretical concepts.</p>
            </Link>
            <Link href="/mechanics/measurements/numerical" className="practice-card">
              <div className="icon">🧮</div>
              <h3>Numerical Problems</h3>
              <p>Sharpen your problem-solving skills with a variety of calculations and applications.</p>
            </Link>
            <Link href="/mechanics/measurements/mcq" className="practice-card">
              <div className="icon">📊</div>
              <h3>Assessment Quiz</h3>
              <p>Take a timed, comprehensive quiz to test your mastery of the entire chapter.</p>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; Physics Daily. Made with ❤️ for physics enthusiasts everywhere.</p>
        </div>
      </footer>
    </>
  );
}
