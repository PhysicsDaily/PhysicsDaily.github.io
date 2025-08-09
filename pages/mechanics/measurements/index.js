// pages/mechanics/measurements/index.js

import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
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
            <Link href="/">Home</Link><span className="separator">›</span>
            <Link href="/mechanics/foundations">Classical Mechanics</Link><span className="separator">›</span>
            <span className="current">📏 Measurement</span>
          </nav>
        </div>
      </div>

      <header className={styles.header}>
        <div className="container">
          <h1>Chapter 1: Measurement</h1>
          <p className={styles.subtitle}>Foundation of Scientific Physics</p>
          <p className={styles.description}>Master the fundamental concepts of measurement, units, and dimensional analysis that form the bedrock of all physics.</p>
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
            <div className={styles.advancedNote}>
              <h4>🎓 Advanced Insight:</h4>
              <p>Modern physics reaches quantum limits of precision. The Heisenberg uncertainty principle imposes a fundamental bound on simultaneous measurements (like position and momentum). This is not a technological constraint—it's built into nature.</p>
            </div>
            <h3>Measurement Chain and Traceability</h3>
            <p>Reliable measurements trace back to national/international standards via calibrated instruments. This “traceability chain” ensures comparability across labs and time.</p>
            <div className={styles.highlightBox}>
              <h4>Key Ideas</h4>
              <ul>
                <li><strong>Resolution:</strong> smallest distinguishable change (instrument property).</li>
                <li><strong>Accuracy:</strong> closeness to true value (affected by systematic errors).</li>
                <li><strong>Precision:</strong> repeatability (scatter due to random errors).</li>
              </ul>
            </div>
          </div>

          <div className={styles.section}>
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

          <div className={styles.section}>
            <h2>1.2 The International System of Units (SI)</h2>
            <p>The <strong>International System of Units (SI)</strong> is the modern metric system, defined from fundamental constants and built on seven base units.</p>
            <h3>The Seven SI Base Units</h3>
            <div className={styles.tableContainer}>
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
            <div className={styles.advancedNote}>
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
            <div className={styles.highlightBox}>
              <h4>Practice</h4>
              <p>Angles (rad) and solid angles (sr) are dimensionless in SI but carry named units for clarity.</p>
            </div>
          </div>

          <div className={styles.section}>
            <h2>1.3 Comprehensive List of Physical Quantities and Their Dimensions</h2>
            <p>Fundamental quantities form the basis; derived quantities combine them via relationships.</p>
            <h3>Mechanical Quantities (Selected)</h3>
            <div className={styles.tableContainer}>
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
                </tbody>
              </table>
            </div>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr><th>Quantity</th><th>Symbol</th><th>SI Unit</th><th>Dimension</th><th>Formula</th></tr>
                </thead>
                <tbody>
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

          <div className={styles.section}>
            <h2>1.4 Dimensional Analysis: Uses and Limitations</h2>
            <p>Dimensions are expressed using base symbols like [M], [L], [T], [I], [Θ], [N], [J]. Dimensional analysis helps validate, derive, convert, and interpret relationships.</p>

            <h3>1) Checking Dimensional Consistency</h3>
            <p>All terms in a valid equation must share the same dimension.</p>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Kinematics</h4>
              <p><span className="equation">x = x₀ + v₀t + ½at²</span>. Each term has dimension [L] ⇒ consistent.</p>
            </div>

            <h3>2) Deriving Relationships</h3>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Period of a Pendulum</h4>
              <p>Assume <span className="equation">T ∝ l^a m^b g^c</span>. Matching dimensions gives <span className="equation">b=0, c=-½, a=½</span> → <span className="equation">T = k√(l/g)</span> (k is dimensionless).</p>
            </div>

            <h3>3) Converting Units</h3>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Newtons to Dynes</h4>
              <p>1 N = 1 kg·m·s⁻² = (10³ g)(10² cm)s⁻² = <span className="equation">10⁵ dyn</span>.</p>
            </div>

            <h3>4) Dimensions of Constants</h3>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Gravitational Constant G</h4>
              <p>From <span className="equation">F = G m₁ m₂ / r²</span> → <span className="equation">[G] = [M⁻¹L³T⁻²]</span>.</p>
            </div>

            <h3>Further Checks and Examples</h3>
            <div className={styles.exampleBox}>
              <h4>📝 Example: RC Discharge</h4>
              <p>q(t) = q₀ e^{-t/RC}. Exponent must be dimensionless ⇒ [RC] = [T].</p>
            </div>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Capillary Rise</h4>
              <p>h depends on surface tension γ [MT⁻²], density ρ [ML⁻³], g [LT⁻²], radius r [L]. Dimensional analysis gives h ∝ γ/(ρgr) up to a factor of 2cosθ.</p>
            </div>
            <div className={styles.highlightBox}>
              <h4>Pitfalls</h4>
              <ul>
                <li>Trigonometric/exponential/log arguments must be dimensionless.</li>
                <li>Linear sums can’t be deduced; only product-type relations up to constants.</li>
              </ul>
            </div>
          </div>

          <div className={styles.section}>
            <h2>1.5 Precision and Significant Figures</h2>
            <p><strong>Significant figures</strong> indicate the precision of a measurement - they include all digits that are known with certainty plus the first uncertain digit.</p>
            <div className={styles.highlightBox}>
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
            <h3>Advanced Notes</h3>
            <ul>
              <li><strong>Exact numbers:</strong> counts and defined constants (e.g., 2 in KE = ½mv²; 1 min = 60 s) have infinite sig figs.</li>
              <li><strong>Conversion factors:</strong> defined (post-2019 SI) ⇒ do not limit sig figs.</li>
              <li><strong>Ties:</strong> if digit to drop is exactly 5 with all trailing zeros, round to even (bankers’ rounding) unless exam specifies otherwise.</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>📝 Example</h4>
              <p>12.250 rounded to 3 sig figs → 12.3 (since 12.25 → 12.2 or 12.3 depends on rule; round-to-even gives 12.2 if previous is even, else 12.3).</p>
            </div>
          </div>

          <div className={styles.section}>
            <h2>1.6 Error Analysis: Quantifying Uncertainty</h2>
            <p>Every measurement has uncertainty. Report results with both a value and an uncertainty.</p>
            <h3>Absolute, Relative, and Percentage Error</h3>
            <div className={styles.highlightBox}>
              <ol>
                <li><strong>Mean (best estimate):</strong> average of measurements.</li>
                <li><strong>Absolute error:</strong> |mean − individual|.</li>
                <li><strong>Mean absolute error:</strong> average of absolute errors.</li>
                <li><strong>Relative error:</strong> (mean absolute error)/(mean).</li>
                <li><strong>Percentage error:</strong> relative error × 100%.</li>
              </ol>
            </div>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Period of a Pendulum</h4>
              <p>Readings: 2.63, 2.56, 2.42, 2.71, 2.80 s → mean ≈ 2.62 s.</p>
              <p>Mean absolute error ≈ 0.11 s → <span className="equation">T = 2.62 ± 0.11 s</span>, ~4.2%.</p>
            </div>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Refractive Index</h4>
              <p>Readings: 1.52, 1.50, 1.53, 1.51, 1.54 → mean = 1.52.</p>
              <p>Mean absolute error ≈ 0.01 → <span className="equation">n = 1.52 ± 0.01</span>, ~0.66%.</p>
            </div>
            <h3>Type A (Statistical) Uncertainty</h3>
            <ul>
              <li>Sample mean: x̄ = (Σxᵢ)/N; sample standard deviation: s = √(Σ(xᵢ−x̄)²/(N−1)).</li>
              <li>Uncertainty of the mean (SEM): sₓ̄ = s/√N.</li>
            </ul>
            <h3>Combining Independent Uncertainties</h3>
            <div className={styles.advancedNote}>
              <ul>
                <li><strong>Quadrature (random, independent):</strong> ΔZ = √(ΔA² + ΔB² + …)</li>
                <li><strong>Linear (worst-case bound):</strong> ΔZ = ΔA + ΔB + …</li>
              </ul>
            </div>
            <div className={styles.exampleBox}>
              <h4>🧮 Example: Sum with Independent Errors</h4>
              <p>Z = A + B, ΔA = 0.3, ΔB = 0.4 (random) ⇒ ΔZ ≈ √(0.3²+0.4²) ≈ 0.5.</p>
            </div>
            <h3>Propagation of Errors</h3>
            <div className={styles.advancedNote}>
              <ul>
                <li><strong>Add/Sub:</strong> <span className="equation">ΔZ = ΔA + ΔB</span></li>
                <li><strong>Mul/Div:</strong> <span className="equation">ΔZ/Z = ΔA/A + ΔB/B</span></li>
                <li><strong>Powers:</strong> <span className="equation">Z = Aⁿ ⇒ ΔZ/Z = n(ΔA/A)</span></li>
              </ul>
            </div>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Density of a Cube</h4>
              <p><span className="equation">m = (100 ± 2) g</span>, <span className="equation">L = (10.0 ± 0.1) cm</span>, <span className="equation">ρ = m/L³</span>.</p>
              <p><span className="equation">Δρ/ρ = Δm/m + 3(ΔL/L) = 0.02 + 0.03 = 0.05</span> → 5%.</p>
            </div>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Kinetic Energy</h4>
              <p><span className="equation">m = (4.0 ± 0.2) kg</span>, <span className="equation">v = (10.0 ± 0.5) m/s</span>, <span className="equation">KE = ½mv²</span>.</p>
              <p><span className="equation">ΔKE/KE = 0.05 + 2(0.05) = 0.15</span>; KE = 200 J ⇒ <span className="equation">ΔKE ≈ 30 J</span>.</p>
              <p><strong>KE = (200 ± 30) J</strong>.</p>
            </div>
          </div>

          <div className={styles.section}>
            <h2>1.7 Types of Errors & Accuracy vs. Precision</h2>
            <div className={styles.beginnerNote}>
              <h4>🔰 Note:</h4>
              <p>“Error” means uncertainty, not a mistake. No measurement is perfectly exact.</p>
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
            <h3>Accuracy vs. Precision</h3>
            <div className={styles.exampleBox}>
              <p>High accuracy + high precision: tight cluster on bullseye.</p>
              <p>Low accuracy + high precision: tight cluster away from bullseye.</p>
              <p>High accuracy + low precision: scattered but average at bullseye.</p>
              <p>Low accuracy + low precision: scattered and biased.</p>
            </div>
            <h3>Minimizing Errors</h3>
            <ul>
              <li>Reduce random errors: repeat and average; increase measurement time or sample size.</li>
              <li>Reduce systematic errors: calibrate, eliminate parallax, use zero-correction, control environment.</li>
            </ul>
            <div className={styles.highlightBox}>
              <h4>Exam Strategy</h4>
              <p>Sketch error bars, check limits (e.g., g→0), and verify dimensional homogeneity before computing.</p>
            </div>
          </div>

          {/* New: 1.8 SI prefixes, scientific notation, orders of magnitude */}
          <div className={styles.section}>
            <h2>1.8 SI Prefixes, Scientific Notation, and Orders of Magnitude</h2>
            <p>Use scientific notation and SI prefixes to express very large/small values cleanly and to minimize rounding mistakes.</p>
            <h3>Common SI Prefixes</h3>
            <div className={styles.tableContainer}>
              <table>
                <thead><tr><th>Prefix</th><th>Symbol</th><th>Factor</th></tr></thead>
                <tbody>
                  <tr><td>pico</td><td>p</td><td>10⁻¹²</td></tr>
                  <tr><td>nano</td><td>n</td><td>10⁻⁹</td></tr>
                  <tr><td>micro</td><td>μ</td><td>10⁻⁶</td></tr>
                  <tr><td>milli</td><td>m</td><td>10⁻³</td></tr>
                  <tr><td>centi</td><td>c</td><td>10⁻²</td></tr>
                  <tr><td>kilo</td><td>k</td><td>10³</td></tr>
                  <tr><td>mega</td><td>M</td><td>10⁶</td></tr>
                  <tr><td>giga</td><td>G</td><td>10⁹</td></tr>
                </tbody>
              </table>
            </div>
            <h3>Best Practices</h3>
            <ul>
              <li>Keep 1–3 significant digits in the coefficient: e.g., 3.20 × 10⁻³ m, not 0.00320 m.</li>
              <li>Carry extra guard digits in intermediate steps; round once at the end.</li>
              <li>Order-of-magnitude estimate: round the base to 1 or 10; compare exponents quickly.</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>📝 Examples</h4>
              <p>0.000047 s = 4.7 × 10⁻⁵ s = 47 μs. 7.2 km = 7.2 × 10³ m.</p>
              <p>Compare 3.2 × 10⁷ and 9.5 × 10⁶ → 3.2 × 10⁷ is about 3.4× larger.</p>
            </div>
          </div>

          {/* New: 1.9 Instruments, least count, zero error */}
          <div className={styles.section}>
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
            <div className={styles.exampleBox}>
              <h4>🧮 Screw Gauge Example</h4>
              <p>Pitch = 0.5 mm; 50 divisions ⇒ LC = 0.01 mm. MSR = 2.50 mm; CSR = 23 divisions ⇒ 23 × 0.01 = 0.23 mm.</p>
              <p>Zero error = −3 divisions ⇒ −0.03 mm (negative). Corrected diameter = 2.50 + 0.23 − (−0.03) = 2.76 mm.</p>
            </div>
            <div className={styles.exampleBox}>
              <h4>🧮 Vernier Calipers Example</h4>
              <p>MSR = 24.0 mm; vernier coincidence = 6th division; LC = 0.1 mm.</p>
              <p>Reading = 24.0 + 6 × 0.1 = 24.6 mm. If zero error = +0.2 mm ⇒ corrected = 24.6 − 0.2 = 24.4 mm.</p>
            </div>
            <div className={styles.advancedNote}>
              <h4>Calibration Tips</h4>
              <ul>
                <li>Check zero with gauge blocks; map systematic offsets across range.</li>
                <li>Report instrument LC if it dominates the uncertainty budget.</li>
              </ul>
            </div>
          </div>

          {/* New: 1.10 Reporting & rounding (incl. logs) */}
          <div className={styles.section}>
            <h2>1.10 Reporting, Rounding, Logs, and Antilogs</h2>
            <h3>Reporting with Uncertainty</h3>
            <ul>
              <li>Match the value’s decimals to the uncertainty’s first significant digit.</li>
              <li>Prefer one significant digit in the uncertainty (two if the first digit is 1–2).</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>📝 Examples</h4>
              <p>(12.347 ± 0.821) s → (12.35 ± 0.82) s; (9.80665 ± 0.0131) m/s² → (9.8067 ± 0.013) m/s².</p>
            </div>
            <h3>Rounding Discipline</h3>
            <ul>
              <li>Do not round mid-calculation; keep guard digits.</li>
              <li>Use scientific notation for very big/small numbers to avoid place-value errors.</li>
            </ul>
            <h3>Logs and Antilogs in Significant Figures</h3>
            <ul>
              <li>log₁₀(x): number of decimal places in mantissa equals significant figures in x.</li>
              <li>antilog: number of significant figures in result equals decimal places of mantissa.</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>📝 Example</h4>
              <p>x = 3.20 (3 sig figs) ⇒ log₁₀x ≈ 0.50515 → record as 0.505 (3 decimals). antilog(1.234) → result with 3 sig figs.</p>
            </div>
          </div>

          {/* New: 1.11 Buckingham Pi theorem, similarity, scaling */}
          <div className={styles.section}>
            <h2>1.11 Buckingham Pi Theorem, Similarity, and Scaling Laws</h2>
            <p>Dimensional analysis generalizes via the Pi theorem: with n variables and k fundamental dimensions, expect n−k independent dimensionless groups (π terms).</p>
            <h3>Workflow</h3>
            <ol>
              <li>List variables and their dimensions.</li>
              <li>Choose k repeating variables spanning the fundamental dimensions.</li>
              <li>Build π-groups so each is dimensionless; solve exponents.</li>
            </ol>
            <div className={styles.exampleBox}>
              <h4>🧮 Example: Quadratic Drag</h4>
              <p>F depends on ρ, v, L, μ. With {`{`}M,L,T{`}`}: n=5, k=3 ⇒ 2 groups. One choice yields π₁ = F/(ρ v² L²), π₂ = ρ v L/μ = Re.</p>
              <p>Thus F = ρ v² L² f(Re). For large Re, F ∝ ρ v² A (A ~ L²).</p>
            </div>
            <div className={styles.exampleBox}>
              <h4>🧮 Example: Gravity Waves (Deep Water)</h4>
              <p>Wave speed v depends on g and wavelength λ: dimensions give v ∝ √(gλ). Then T = λ/v ∝ √(λ/g).</p>
            </div>
            <div className={styles.exampleBox}>
              <h4>🧮 Example: Range of Projectile (No Air Drag)</h4>
              <p>Range R depends on v₀ and g: only combination with length is v₀²/g → R ∝ v₀²/g (dimensionless factor depends on angle).</p>
            </div>
            <div className={styles.advancedNote}>
              <h4>Dimensionless Numbers</h4>
              <ul>
                <li>Reynolds Re = ρ v L / μ (inertia/viscous).</li>
                <li>Froude Fr = v / √(gL) (inertia/gravity).</li>
                <li>Mach Ma = v / c (inertia/compressibility).</li>
              </ul>
            </div>
          </div>

          {/* New: 1.12 Graphing, linearization, slope/intercept uncertainty */}
          <div className={styles.section}>
            <h2>1.12 Graphing, Linearization, and Uncertainty of Fit</h2>
            <h3>Linearization</h3>
            <ul>
              <li>Power law y = A xⁿ ⇒ log y = log A + n log x (slope n on log–log plot).</li>
              <li>Exponential y = A e^{kx} ⇒ ln y = ln A + kx (semi-log plot).</li>
            </ul>
            <h3>Estimating Slope and Its Uncertainty (Quick Method)</h3>
            <ul>
              <li>Draw best-fit line by eye; compute slope m.</li>
              <li>Draw steepest and shallowest lines within all error bars; m_max, m_min.</li>
              <li>Uncertainty: Δm ≈ (m_max − m_min)/2; report m ± Δm.</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>📝 Example: Spring Oscillator</h4>
              <p>Hypothesis T = 2π√(m/k). Plot T² vs m; slope ≈ (4π²)/k ⇒ k ≈ 4π² / slope. Propagate Δk from Δslope.</p>
            </div>
            <div className={styles.advancedNote}>
              <h4>Pro Tips</h4>
              <ul>
                <li>Use weighted least squares when uncertainties vary by point.</li>
                <li>Always include axes labels, units, and uncertainty bars.</li>
              </ul>
            </div>
          </div>

          {/* New: 1.13 Fermi Estimation and Sanity Checks */}
          <div className={styles.section}>
            <h2>1.13 Fermi Estimation and Sanity Checks</h2>
            <p>Fast, rough estimates are vital in olympiads and entrance exams to eliminate options.</p>
            <ul>
              <li>Simplify to core parameters; assume round numbers; track powers of ten.</li>
              <li>Check limits: set parameters to 0 or ∞ to see if the form makes sense.</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>🧮 Example: Terminal Speed Scaling</h4>
              <p>Balance mg with drag ~ C ρ A v² ⇒ v_t ~ √(mg/(ρA)). Mass doubles, area constant ⇒ v_t increases by √2.</p>
            </div>
          </div>

          {/* New: 1.14 Quick Conversions and Exam Tips */}
          <div className={styles.section}>
            <h2>1.14 Quick Conversions and Exam Tips</h2>
            <h3>Handy Conversions (SI↔CGS)</h3>
            <ul>
              <li>1 N = 10⁵ dyn; 1 J = 10⁷ erg; 1 Pa = 10 dyn/cm²; 1 m/s = 100 cm/s.</li>
              <li>g ≈ 9.8 m/s² ≈ 980 cm/s²; 1 atm ≈ 1.013 × 10⁵ Pa.</li>
            </ul>
            <h3>Exam Technique</h3>
            <ul>
              <li>Always check dimensional homogeneity and limiting cases.</li>
              <li>Convert to base SI before plugging numbers; keep guard digits.</li>
              <li>State assumptions clearly (small-angle, negligible drag, rigid body, etc.).</li>
              <li>Report results with justified significant figures and uncertainty.</li>
            </ul>
          </div>

          {/* New: 1.15 Greek Alphabet Reference */}
          <div className={styles.section}>
            <h2>1.15 Greek Alphabet Reference</h2>
            <p>Common Greek symbols used across physics (uppercase, lowercase) with typical meanings.</p>
            <div className={styles.tableContainer}>
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
                  <tr><td>Iota</td><td>Ι</td><td>ι</td><td>Rarely used</td></tr>
                  <tr><td>Kappa</td><td>Κ</td><td>κ</td><td>Dielectric constant, thermal conductivity</td></tr>
                  <tr><td>Lambda</td><td>Λ</td><td>λ</td><td>Cosmological constant (Λ), wavelength (λ)</td></tr>
                  <tr><td>Mu</td><td>Μ</td><td>μ</td><td>Coefficient of friction (μ), micro- prefix, permeability (μ)</td></tr>
                  <tr><td>Nu</td><td>Ν</td><td>ν</td><td>Frequency in particle physics, kinematic viscosity (ν)</td></tr>
                  <tr><td>Xi</td><td>Ξ</td><td>ξ</td><td>Random variable, damping, correlation length</td></tr>
                  <tr><td>Omicron</td><td>Ο</td><td>ο</td><td>Rarely used</td></tr>
                  <tr><td>Pi</td><td>Π</td><td>π</td><td>Product symbol (Π), 3.14159…, osmotic pressure</td></tr>
                  <tr><td>Rho</td><td>Ρ</td><td>ρ</td><td>Density (ρ), charge density</td></tr>
                  <tr><td>Sigma</td><td>Σ</td><td>σ</td><td>Sum (Σ), standard deviation (σ), stress, cross-section</td></tr>
                  <tr><td>Tau</td><td>Τ</td><td>τ</td><td>Torque (τ), time constant (RC), shear stress</td></tr>
                  <tr><td>Upsilon</td><td>Υ</td><td>υ</td><td>Upsilon meson; rarely used in basics</td></tr>
                  <tr><td>Phi</td><td>Φ</td><td>φ</td><td>Magnetic flux (Φ), potential (φ), angle</td></tr>
                  <tr><td>Chi</td><td>Χ</td><td>χ</td><td>Susceptibility (χ), chi-square</td></tr>
                  <tr><td>Psi</td><td>Ψ</td><td>ψ</td><td>Wavefunction (ψ), stream function</td></tr>
                  <tr><td>Omega</td><td>Ω</td><td>ω</td><td>Ohm (Ω), angular speed (ω), solid angle (Ω)</td></tr>
                </tbody>
              </table>
            </div>
            <div className={styles.advancedNote}>
              <h4>Notes</h4>
              <ul>
                <li>Sigma has special lowercase forms: σ (middle), ς (final form in Greek text).</li>
                <li>Use clear fonts to distinguish ν (nu) from v, η (eta) from n, and μ (mu) from m.</li>
              </ul>
            </div>
          </div>

          <section className={styles.practiceSection}>
            <div className="container">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Test Your Understanding</h2>
                <p className={styles.sectionSubtitle}>Apply what you've learned by tackling conceptual questions, numerical problems, and a comprehensive quiz.</p>
              </div>
              <div className={styles.practiceGrid}>
                <Link href="/mechanics/measurements/conceptual" passHref><div className={styles.practiceCard}><div className={styles.icon}>🤔</div><h3>Conceptual Questions</h3><p>Challenge your understanding of the core principles and theoretical concepts.</p></div></Link>
                <Link href="/mechanics/measurements/numerical" passHref><div className={styles.practiceCard}><div className={styles.icon}>🧮</div><h3>Numerical Problems</h3><p>Sharpen your problem-solving skills with a variety of calculations and applications.</p></div></Link>
                <Link href="/mechanics/measurements/mcq" passHref><div className={styles.practiceCard}><div className={styles.icon}>📊</div><h3>Assessment Quiz</h3><p>Take a timed, comprehensive quiz to test your mastery of the entire chapter.</p></div></Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
