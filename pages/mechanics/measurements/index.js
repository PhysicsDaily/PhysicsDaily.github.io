import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from '../../../styles/ContentPage.module.css';

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
  { id: 'practice', title: 'Practice Problems' },
];

export default function MeasurementsPage() {
  const [activeSection, setActiveSection] = useState('');
  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        if (intersectingEntry) {
          setActiveSection(intersectingEntry.target.id);
        }
      },
      { rootMargin: '-20% 0px -79% 0px' }
    );

    const elements = sections.map(sec => document.getElementById(sec.id)).filter(el => el);
    elements.forEach((el) => observer.current.observe(el));
    
    return () => observer.current.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Chapter 1: Measurement - Physics Daily</title>
        <meta name="description" content="Master scientific measurement, significant figures, and dimensional analysis in physics." />
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

      <Header />

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

      <header className={styles.pageHeader}>
        <div className="container">
          <h1>Chapter 1: Measurement</h1>
          <p className={styles.subtitle}>Foundation of Scientific Physics</p>
          <p className={styles.description}>
            Master the fundamental concepts of measurement, units, and dimensional analysis that form the bedrock of all physics - from basic concepts to advanced applications.
          </p>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className="container">
          {/* Go to Questions Button - Fixed position (scroll down) */}
          <div className={styles.questionsButton}>
            <button
              type="button"
              aria-label="Jump to Questions"
              className={styles.goToQuestions}
              onClick={() => {
                const el = document.getElementById('questions-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <span className={styles.questionsIcon} aria-hidden="true">⬇️</span>
            </button>
          </div>

          <div id="intro" className={styles.section}>
            <h2>🌟 Introduction: Why Measurement Matters</h2>
            <div className={styles.beginnerNote}>
              <h4>🔰 For Beginners:</h4>
              <p>Imagine trying to cook without measuring ingredients. Physics is similar - we need precise measurements to understand how the universe works! Every law of physics started with careful observations.</p>
            </div>
            <p><strong>Physics is fundamentally an experimental science.</strong> Every law, theory, and principle comes from careful observation and measurement. The GPS in your phone works because engineers understand Einstein&apos;s theory of relativity with incredible precision. Without it, your GPS would be off by miles!</p>
            <div className={styles.highlightBox}>
              <h4>The Power of Precise Measurement</h4>
              <p>The detection of gravitational waves required measuring distance changes smaller than 1/10,000th the width of a proton!</p>
            </div>
            <h3>Measurement Chain and Traceability</h3>
            <p>Reliable measurements trace back to national/international standards via calibrated instruments. This &quot;traceability chain&quot; ensures comparability across labs and time.</p>
            <div className={styles.highlightBox}>
              <h4>Key Ideas</h4>
              <ul>
                <li><strong>Resolution:</strong> smallest distinguishable change (instrument property).</li>
                <li><strong>Accuracy:</strong> closeness to true value (affected by systematic errors).</li>
                <li><strong>Precision:</strong> repeatability (scatter due to random errors).</li>
              </ul>
            </div>
          </div>

          <div id="physical-quantities" className={styles.section}>
            <h2>1.1 Physical Quantities, Standards, and Units</h2>
            <h3>What Are Physical Quantities?</h3>
            <p>A <strong>physical quantity</strong> is any measurable property of matter or energy.</p>
            <ul>
              <li><strong>Scalar quantities:</strong> magnitude only (mass, time, temperature, energy).</li>
              <li><strong>Vector quantities:</strong> magnitude and direction (displacement, velocity, acceleration, force).</li>
            </ul>
            <h3>Operational Definitions</h3>
            <p>Each quantity needs a clear operational definition—how it is measured.</p>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Defining Velocity</h4>
              <p>Operational definition: change in position per time interval: <span className="equation">v = Δx/Δt</span>.</p>
            </div>
            <h3>Characteristics of Good Standards</h3>
            <div className={styles.highlightBox}>
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
            <div className={styles.exampleBox}>
              <h4>📝 Olympiad Tip</h4>
              <p>Introduce or eliminate units quickly via coherence: if P = Fv, then [P] = [F][v] = (kg·m·s⁻²)(m·s⁻¹) = kg·m²·s⁻³ = W.</p>
            </div>
          </div>

          <div id="si-units" className={styles.section}>
            <h2>1.2 The International System of Units (SI)</h2>
            <p>The <strong>International System of Units (SI)</strong> is the modern metric system, defined from fundamental constants and built on seven base units.</p>
            <h3>The Seven SI Base Units</h3>
            <div className={styles.tableWrapper}>
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
            <h3>Defining Constants (Exact)</h3>
            <p>After 2019, fixed exact values define base units: c, h, e, k<sub>B</sub>, N<sub>A</sub>, K<sub>cd</sub>, Δν<sub>Cs</sub>.</p>
            <ul>
              <li>c = 299,792,458 m·s⁻¹ defines the meter via time.</li>
              <li>h = 6.62607015×10⁻³⁴ J·s defines the kilogram via Kibble balance.</li>
              <li>e, k<sub>B</sub>, N<sub>A</sub>, K<sub>cd</sub>, Δν<sub>Cs</sub> define A, K, mol, cd, s respectively.</li>
            </ul>
            <div className={styles.highlightBox}>
              <h4>Practice</h4>
              <p>Angles (rad) and solid angles (sr) are dimensionless in SI but carry named units for clarity.</p>
            </div>
          </div>

          <div id="quantities-list" className={styles.section}>
            <h2>1.3 Comprehensive List of Physical Quantities and Their Dimensions</h2>
            <p>Fundamental quantities form the basis; derived quantities combine them via relationships.</p>
            <h3>Mechanical Quantities (Selected)</h3>
            <div className={styles.tableWrapper}>
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
                  <tr><td>Young&apos;s modulus</td><td>Y</td><td>Pa</td><td>[ML⁻¹T⁻²]</td><td>Y = σ/ε</td></tr>
                  <tr><td>Viscosity</td><td>η</td><td>Pa·s</td><td>[ML⁻¹T⁻¹]</td><td>η = τ/(dv/dy)</td></tr>
                  <tr><td>Spring constant</td><td>k</td><td>N/m</td><td>[MT⁻²]</td><td>F = kx</td></tr>
                  <tr><td>Gravitational field</td><td>g</td><td>m/s²</td><td>[LT⁻²]</td><td>g = F/m</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="dimensional-analysis" className={styles.section}>
            <h2>1.4 Dimensional Analysis: Uses and Limitations</h2>
            <p>Dimensions are expressed using base symbols like [M], [L], [T], [I], [Θ], [N], [J]. Dimensional analysis helps validate, derive, convert, and interpret relationships.</p>
            <h3>1) Checking Dimensional Consistency</h3>
            <p>All terms in a valid equation must share the same dimension.</p>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Kinematics</h4>
              <p><span className="equation">x = x₀ + v₀t + ½at²</span>. Each term has dimension [L] ⇒ consistent.</p>
              <p><strong>Check:</strong> [x] = [L], [v₀t] = [LT⁻¹][T] = [L], [at²] = [LT⁻²][T²] = [L] ✓</p>
            </div>
            
            <h3>2) Deriving Relationships</h3>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Period of a Pendulum</h4>
              <p>Assume <span className="equation">T ∝ l^a m^b g^c</span>. Matching dimensions gives <span className="equation">b=0, c=-½, a=½</span> → <span className="equation">T = k√(l/g)</span> (k is dimensionless).</p>
              <p><strong>Step-by-step:</strong></p>
              <p>[T] = [L]^a [M]^b [LT⁻²]^c = [L^(a+c)][M^b][T^(-2c)]</p>
              <p>For dimensional consistency: a+c = 0, b = 0, -2c = 1</p>
              <p>Solving: c = -½, a = ½, b = 0</p>
            </div>

            <div className={styles.exampleBox}>
              <h4>📝 Advanced Example: Drag Force on a Sphere</h4>
              <p>For a sphere moving through a fluid, assume drag depends on:</p>
              <ul>
                <li>Velocity v [LT⁻¹]</li>
                <li>Sphere radius r [L]</li>
                <li>Fluid density ρ [ML⁻³]</li>
                <li>Fluid viscosity η [ML⁻¹T⁻¹]</li>
              </ul>
              <p>Let <span className="equation">F_d = k v^a r^b ρ^c η^d</span></p>
              <p>[MLT⁻²] = [LT⁻¹]^a [L]^b [ML⁻³]^c [ML⁻¹T⁻¹]^d</p>
              <p>This gives us two possible regimes:</p>
              <ul>
                <li><strong>Stokes regime (low Re):</strong> F_d ∝ ηrv</li>
                <li><strong>Newton regime (high Re):</strong> F_d ∝ ρr²v²</li>
              </ul>
            </div>
            
            <h3>3) Converting Units</h3>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Newtons to Dynes</h4>
              <p>1 N = 1 kg·m·s⁻² = (10³ g)(10² cm)s⁻² = <span className="equation">10⁵ dyn</span>.</p>
            </div>

            <div className={styles.exampleBox}>
              <h4>📝 Advanced Conversion: Energy Units</h4>
              <p>Convert 1 eV (electron volt) to Joules:</p>
              <p>1 eV = energy gained by electron through 1V potential difference</p>
              <p>1 eV = e × 1V = (1.602 × 10⁻¹⁹ C)(1 V) = 1.602 × 10⁻¹⁹ J</p>
              <p><strong>Useful conversions:</strong></p>
              <ul>
                <li>1 eV = 1.602 × 10⁻¹⁹ J</li>
                <li>1 u (atomic mass unit) = 931.5 MeV/c²</li>
                <li>1 cal = 4.184 J (thermochemical calorie)</li>
                <li>1 kWh = 3.6 × 10⁶ J</li>
              </ul>
            </div>
            
            <h3>4) Dimensions of Constants</h3>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Gravitational Constant G</h4>
              <p>From <span className="equation">F = G m₁ m₂ / r²</span> → <span className="equation">[G] = [M⁻¹L³T⁻²]</span>.</p>
            </div>
            
            <div className={styles.highlightBox}>
              <h4>Pitfalls and Limitations</h4>
              <ul>
                <li>Trigonometric/exponential/log arguments must be dimensionless.</li>
                <li>Linear sums can&apos;t be deduced; only product-type relations up to constants.</li>
                <li>Cannot determine dimensionless constants (like 2π in pendulum formula).</li>
                <li>Cannot handle discontinuous relationships or phase transitions.</li>
                <li>Assumes all relevant variables are included in analysis.</li>
              </ul>
            </div>

            <div className={styles.exampleBox}>
              <h4>📝 Problem-Solving Strategy</h4>
              <ol>
                <li><strong>Identify</strong> all relevant physical variables</li>
                <li><strong>Write</strong> their dimensions in terms of fundamental units</li>
                <li><strong>Set up</strong> the general functional form</li>
                <li><strong>Equate</strong> powers of fundamental dimensions</li>
                <li><strong>Solve</strong> the resulting system of equations</li>
                <li><strong>Check</strong> limiting cases and physical reasonableness</li>
              </ol>
            </div>
          </div>

          <div id="sig-figs" className={styles.section}>
            <h2>1.5 Precision and Significant Figures</h2>
            <p><strong>Significant figures</strong> indicate the precision of a measurement - they include all digits that are known with certainty plus the first uncertain digit.</p>
            <div className={styles.highlightBox}>
              <h4>📊 Rules for Significant Figures</h4>
              <ol>
                <li>Non-zero digits are always significant. (e.g., 1.234 has 4)</li>
                <li>Zeros between significant digits are significant. (e.g., 506 has 3)</li>
                <li>Leading zeros are not significant. (e.g., 0.0078 has 2)</li>
                <li>Trailing zeros with a decimal point are significant. (e.g., 90.00 has 4)</li>
                <li>Trailing zeros in whole numbers without decimal points are ambiguous</li>
              </ol>
            </div>

            <div className={styles.exampleBox}>
              <h4>📝 Detailed Examples</h4>
              <div className={styles.tableWrapper}>
                <table>
                  <thead>
                    <tr><th>Number</th><th>Sig Figs</th><th>Explanation</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>123.45</td><td>5</td><td>All digits are significant</td></tr>
                    <tr><td>0.00456</td><td>3</td><td>Leading zeros don&apos;t count</td></tr>
                    <tr><td>1.200</td><td>4</td><td>Trailing zeros after decimal count</td></tr>
                    <tr><td>1200</td><td>2 or 4</td><td>Ambiguous - use scientific notation</td></tr>
                    <tr><td>1.200 × 10³</td><td>4</td><td>Clear with scientific notation</td></tr>
                    <tr><td>5.67 × 10⁻⁸</td><td>3</td><td>Exponent doesn&apos;t affect sig figs</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h4>🧮 Operations with Significant Figures</h4>
            <p><strong>Addition/Subtraction Rule:</strong> The result is rounded to the same number of decimal places as the measurement with the fewest decimal places.</p>
            
            <div className={styles.exampleBox}>
              <h4>📝 Addition/Subtraction Examples</h4>
              <p><strong>Example 1:</strong> 12.345 + 1.2 = 13.545 → 13.5 (limited by 1.2&apos;s one decimal place)</p>
              <p><strong>Example 2:</strong> 156.7 - 0.32 = 156.38 → 156.4 (limited by 156.7&apos;s one decimal place)</p>
              <p><strong>Complex Example:</strong></p>
              <p>125.67 + 12.1 + 0.456 = 138.226</p>
              <p>Limiting factor: 12.1 (one decimal place) → Answer: 138.2</p>
            </div>

            <p><strong>Multiplication/Division Rule:</strong> The result has the same number of significant figures as the measurement with the fewest significant figures.</p>
            
            <div className={styles.exampleBox}>
              <h4>📝 Multiplication/Division Examples</h4>
              <p><strong>Example 1:</strong> 3.14 × 2.0 = 6.28 → 6.3 (limited by 2.0&apos;s 2 sig figs)</p>
              <p><strong>Example 2:</strong> 45.678 ÷ 1.23 = 37.1365... → 37.1 (limited by 1.23&apos;s 3 sig figs)</p>
              <p><strong>Complex Example:</strong></p>
              <p>(2.54 × 10²) × (3.1 × 10⁻⁴) ÷ (1.234 × 10⁻¹)</p>
              <p>= 6.389... × 10⁻¹ → 6.4 × 10⁻¹ (limited by 3.1&apos;s 2 sig figs)</p>
            </div>

            <h4>🎯 Special Cases and Advanced Rules</h4>
            <div className={styles.advancedNote}>
              <h4>🎓 Professional Considerations</h4>
              <ul>
                <li><strong>Exact numbers:</strong> π, e, conversion factors (12 inches = 1 foot) have infinite precision</li>
                <li><strong>Counting:</strong> &quot;5 students&quot; is exact, not measured</li>
                <li><strong>Intermediate calculations:</strong> Keep extra digits, round only final answer</li>
                <li><strong>Logarithms:</strong> Number of decimal places = sig figs of argument</li>
                <li><strong>Powers:</strong> Result has same sig figs as base (exponent can be exact)</li>
              </ul>
            </div>

            <div className={styles.exampleBox}>
              <h4>📝 Logarithm Examples</h4>
              <p><strong>log(2.54 × 10³):</strong> 2.54 has 3 sig figs → answer has 3 decimal places</p>
              <p>log(2540) = 3.405 (3 decimal places)</p>
              <p><strong>ln(6.02 × 10²³):</strong> 6.02 has 3 sig figs → answer has 3 decimal places</p>
              <p>ln(6.02 × 10²³) = 54.972</p>
            </div>

            <h4>🔧 Practical Tips for Calculations</h4>
            <div className={styles.highlightBox}>
              <ol>
                <li><strong>Identify</strong> the limiting measurement first</li>
                <li><strong>Perform</strong> calculations with extra digits</li>
                <li><strong>Round</strong> only the final answer</li>
                <li><strong>Use scientific notation</strong> to avoid ambiguity</li>
                <li><strong>Be consistent</strong> with measurement uncertainty</li>
              </ol>
            </div>

            <div className={styles.exampleBox}>
              <h4>📝 Multi-step Problem</h4>
              <p><strong>Problem:</strong> Calculate density of a rectangular block</p>
              <p>Mass = 45.67 g, Length = 12.1 cm, Width = 3.45 cm, Height = 2.1 cm</p>
              <p><strong>Solution:</strong></p>
              <p>Volume = L × W × H = 12.1 × 3.45 × 2.1 = 87.6105 cm³</p>
              <p>For volume: limited by 2.1 (2 sig figs) → V = 88 cm³</p>
              <p>Density = m/V = 45.67/88 = 0.5189... g/cm³</p>
              <p>For density: limited by 88 (2 sig figs) → ρ = 0.52 g/cm³</p>
            </div>
          </div>

          <div id="error-analysis" className={styles.section}>
            <h2>1.6 Error Analysis: Quantifying Uncertainty</h2>
            <p>Every measurement has uncertainty. Report results with both a value and an uncertainty.</p>
            
            <h3>Types of Uncertainty</h3>
            <div className={styles.highlightBox}>
              <h4>Statistical vs. Systematic Uncertainty</h4>
              <ul>
                <li><strong>Statistical (Random):</strong> Varies unpredictably, reduced by repeated measurements</li>
                <li><strong>Systematic:</strong> Consistent bias, must be identified and corrected</li>
              </ul>
            </div>

            <h3>Statistical Analysis of Repeated Measurements</h3>
            <p><strong>For n repeated measurements x₁, x₂, ..., xₙ:</strong></p>
            <ul>
              <li><strong>Mean:</strong> x̄ = (x₁ + x₂ + ... + xₙ)/n</li>
              <li><strong>Standard deviation:</strong> σ = √[Σ(xᵢ - x̄)²/(n-1)]</li>
              <li><strong>Standard error:</strong> σₘ = σ/√n (uncertainty in the mean)</li>
              <li><strong>Result:</strong> x̄ ± σₘ (for large n) or x̄ ± tσₘ (for small n, t from t-distribution)</li>
            </ul>

            <div className={styles.exampleBox}>
              <h4>📝 Statistical Analysis Example</h4>
              <p><strong>Problem:</strong> Five measurements of a pendulum period (s): 2.01, 1.98, 2.03, 1.99, 2.02</p>
              <p><strong>Solution:</strong></p>
              <p>Mean: x̄ = (2.01 + 1.98 + 2.03 + 1.99 + 2.02)/5 = 2.006 s</p>
              <p>Deviations: -0.004, 0.026, -0.024, 0.016, -0.014</p>
              <p>σ = √[(0.004² + 0.026² + 0.024² + 0.016² + 0.014²)/4] = 0.019 s</p>
              <p>σₘ = 0.019/√5 = 0.0085 s</p>
              <p><strong>Result:</strong> T = 2.01 ± 0.01 s (rounded appropriately)</p>
            </div>

            <h3>Absolute, Relative, and Percentage Error</h3>
            <div className={styles.highlightBox}>
              <ol>
                <li><strong>Absolute uncertainty:</strong> Δx (same units as measurement)</li>
                <li><strong>Relative uncertainty:</strong> Δx/x (dimensionless)</li>
                <li><strong>Percentage uncertainty:</strong> (Δx/x) × 100%</li>
              </ol>
            </div>

            <div className={styles.exampleBox}>
              <h4>📝 Error Types Example</h4>
              <p>Measurement: L = 25.4 ± 0.2 cm</p>
              <ul>
                <li><strong>Absolute uncertainty:</strong> ±0.2 cm</li>
                <li><strong>Relative uncertainty:</strong> 0.2/25.4 = 0.0079</li>
                <li><strong>Percentage uncertainty:</strong> 0.79%</li>
              </ul>
            </div>

            <h3>Propagation of Uncertainties</h3>
            <p>When combining measurements, uncertainties propagate according to specific rules:</p>
            
            <p><strong>General Propagation Formula:</strong></p>
            <p>For f(x,y,z,...), the uncertainty is:</p>
            <p><span className="equation">Δf = √[(∂f/∂x)²(Δx)² + (∂f/∂y)²(Δy)² + (∂f/∂z)²(Δz)² + ...]</span></p>
            <p><strong>Common cases:</strong></p>
            <ul>
              <li><strong>Addition/Subtraction:</strong> f = x ± y → Δf = √[(Δx)² + (Δy)²]</li>
              <li><strong>Multiplication/Division:</strong> f = xy or x/y → Δf/f = √[(Δx/x)² + (Δy/y)²]</li>
              <li><strong>Powers:</strong> f = xⁿ → Δf/f = |n|(Δx/x)</li>
              <li><strong>Exponentials:</strong> f = eˣ → Δf/f = Δx</li>
              <li><strong>Logarithms:</strong> f = ln(x) → Δf = Δx/x</li>
            </ul>

            <div className={styles.exampleBox}>
              <h4>📝 Comprehensive Propagation Example</h4>
              <p><strong>Problem:</strong> Calculate the volume and its uncertainty for a cylinder</p>
              <p>Radius: r = 5.2 ± 0.1 cm, Height: h = 12.3 ± 0.2 cm</p>
              <p>Volume: V = πr²h</p>
              <p><strong>Solution using relative uncertainties:</strong></p>
              <p>V = π(5.2)²(12.3) = 1048 cm³</p>
              <p>Δr/r = 0.1/5.2 = 0.0192</p>
              <p>Δh/h = 0.2/12.3 = 0.0163</p>
              <p>Since V = πr²h, we have: ΔV/V = √[(2 × Δr/r)² + (Δh/h)²]</p>
              <p>ΔV/V = √[(2 × 0.0192)² + (0.0163)²] = √[0.00147 + 0.000266] = 0.0416</p>
              <p>ΔV = 0.0416 × 1048 = 44 cm³</p>
              <p><strong>Result:</strong> V = 1048 ± 44 cm³ or V = (1.05 ± 0.04) × 10³ cm³</p>
            </div>

            <h3>Advanced Topics in Error Analysis</h3>
            
            <div className={styles.advancedNote}>
              <h4>🎓 Covariance and Correlated Errors</h4>
              <p>When measurements x and y are correlated, the general formula becomes:</p>
              <p>Δf = √[(∂f/∂x)²(Δx)² + (∂f/∂y)²(Δy)² + 2(∂f/∂x)(∂f/∂y)cov(x,y)]</p>
              <p>This is crucial when the same instrument measures both quantities.</p>
            </div>

            <div className={styles.exampleBox}>
              <h4>📝 Weighted Averages</h4>
              <p>When combining measurements with different uncertainties:</p>
              <p><strong>Weighted mean:</strong> x̄ = Σ(wᵢxᵢ)/Σwᵢ where wᵢ = 1/(Δxᵢ)²</p>
              <p><strong>Uncertainty:</strong> Δx̄ = 1/√(Σwᵢ)</p>
              <p><strong>Example:</strong> Combining x₁ = 10.2 ± 0.3 and x₂ = 10.6 ± 0.1</p>
              <p>w₁ = 1/0.3² = 11.11, w₂ = 1/0.1² = 100</p>
              <p>x̄ = (11.11 × 10.2 + 100 × 10.6)/(11.11 + 100) = 10.56</p>
              <p>Δx̄ = 1/√111.11 = 0.095</p>
              <p><strong>Result:</strong> x̄ = 10.56 ± 0.10</p>
            </div>

            <h3>Reporting Uncertainties</h3>
            <div className={styles.highlightBox}>
              <h4>📋 Best Practices</h4>
              <ol>
                <li><strong>Round uncertainty</strong> to 1 significant figure (2 if first digit is 1)</li>
                <li><strong>Match decimal places</strong> of value to uncertainty</li>
                <li><strong>Use scientific notation</strong> for clarity</li>
                <li><strong>Include confidence level</strong> when appropriate</li>
                <li><strong>State measurement method</strong> and conditions</li>
              </ol>
            </div>

            <div className={styles.exampleBox}>
              <h4>📝 Proper Reporting Examples</h4>
              <ul>
                <li><strong>Good:</strong> g = 9.81 ± 0.05 m/s² (95% confidence)</li>
                <li><strong>Good:</strong> E = (1.602 ± 0.003) × 10⁻¹⁹ C</li>
                <li><strong>Poor:</strong> g = 9.8134 ± 0.05432 m/s² (too many digits)</li>
                <li><strong>Poor:</strong> g = 9.8 ± 0.054 m/s² (mismatched precision)</li>
              </ul>
            </div>
          </div>

          <div id="error-types" className={styles.section}>
            <h2>1.7 Types of Errors & Accuracy vs. Precision</h2>
            <div className={styles.beginnerNote}>
              <h4>🔰 Note:</h4>
              <p>&quot;Error&quot; means uncertainty, not a mistake. No measurement is perfectly exact.</p>
            </div>
            <h3>Types of Errors</h3>
            <div className={styles.highlightBox}>
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

          <div id="prefixes-notation" className={styles.section}>
            <h2>1.8 SI Prefixes, Scientific Notation, and Orders of Magnitude</h2>
            <p>Use scientific notation and SI prefixes to express very large/small values cleanly and to minimize rounding mistakes.</p>
            <h3>Common SI Prefixes</h3>
            <div className={styles.tableWrapper}>
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

          <div id="instruments" className={styles.section}>
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
        </div>
      </main>

  <section id="questions-section" className={styles.practiceSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Test Your Understanding</h2>
            <p className={styles.sectionSubtitle}>Apply what you&apos;ve learned by tackling conceptual questions, numerical problems, and a comprehensive quiz.</p>
          </div>
          <div className={styles.practiceGrid}>
            <Link href="/mechanics/measurements/conceptual" className={styles.practiceCard}>
              <div className={styles.icon}>🤔</div>
              <h3>Conceptual Questions</h3>
              <p>Challenge your understanding of the core principles and theoretical concepts.</p>
            </Link>
            <Link href="/mechanics/measurements/numerical" className={styles.practiceCard}>
              <div className={styles.icon}>🧮</div>
              <h3>Numerical Problems</h3>
              <p>Sharpen your problem-solving skills with a variety of calculations and applications.</p>
            </Link>
            <Link href="/mechanics/measurements/mcq" className={styles.practiceCard}>
              <div className={styles.icon}>📊</div>
              <h3>Assessment Quiz</h3>
              <p>Take a timed, comprehensive quiz to test your mastery of the entire chapter.</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
