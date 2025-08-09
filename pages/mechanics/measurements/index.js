// pages/mechanics/measurements/index.js

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from '../../../styles/ContentPage.module.css';

const sections = [
  { id: 'intro', title: 'Introduction & Roadmap' },
  { id: 'foundations', title: '0. Foundations: Quantities, Models, and Metrology' },
  { id: 'si-units', title: '1. SI Units and Standards (Post-2019)' },
  { id: 'prefixes', title: '2. SI Prefixes & Scientific Notation' },
  { id: 'physical-quantities', title: '3. Physical Quantities and Dimensions' },
  { id: 'derived-mechanical', title: '4. Derived Quantities: Mechanics' },
  { id: 'derived-em', title: '5. Derived Quantities: Electricity & Magnetism' },
  { id: 'derived-thermal', title: '6. Derived Quantities: Thermo & Waves' },
  { id: 'dimensional-analysis', title: '7. Dimensional Analysis & Non-dimensionalization' },
  { id: 'pi-theorem', title: '8. Buckingham Π Theorem & Similarity' },
  { id: 'sig-figs', title: '9. Precision & Significant Figures' },
  { id: 'uncertainty', title: '10. Uncertainty: Type A/B, GUM approach' },
  { id: 'propagation', title: '11. Propagation of Uncertainty (with Covariance)' },
  { id: 'statistics', title: '12. Statistics: Distributions, SEM, t-tests' },
  { id: 'outliers', title: '13. Outliers: Grubbs, Chauvenet, Residuals' },
  { id: 'instruments', title: '14. Instruments: LC, Zero Error, ADC & Noise' },
  { id: 'calibration', title: '15. Calibration, Traceability & Uncertainty Budget' },
  { id: 'graphing', title: '16. Graphs, Linearization & Weighted Fits' },
  { id: 'fermi', title: '17. Fermi Estimates & Orders of Magnitude' },
  { id: 'conversions', title: '18. Unit Conversions & Non-SI Units' },
  { id: 'constants', title: '19. Fundamental Constants (Exact & Measured)' },
  { id: 'greek-alphabet', title: '20. Greek Alphabet Reference' },
  { id: 'checklist', title: '21. Problem-Solving Checklist' },
  { id: 'practice', title: 'Practice Problems' },
];

export default function MeasurementsPage() {
  const [activeSection, setActiveSection] = useState('');
  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        const first = entries.find((e) => e.isIntersecting);
        if (first) setActiveSection(first.target.id);
      },
      { rootMargin: '-20% 0px -79% 0px' }
    );
    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.current.observe(el);
    });
    return () => observer.current?.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Chapter 1: Measurement - Physics Daily</title>
        <meta
          name="description"
          content="Complete theory of measurements: SI units, dimensional analysis, significant figures, uncertainty (GUM), calibration, graphs, and scaling laws with examples."
        />
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
          <p className={styles.subtitle}>From Basics to Advanced Methods</p>
          <p className={styles.description}>
            Build a rigorous foundation in measurement: units, dimensional analysis, significant figures, uncertainty, calibration, graphing, and scaling laws—with worked examples and practice.
          </p>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className="container">

          <div id="intro" className={styles.section}>
            <h2>Introduction & Roadmap</h2>
            <div className={styles.beginnerNote}>
              <h4>For Beginners</h4>
              <p>
                Measurement tells us “how much” of a physical quantity we have. Good measurements are repeatable (precise) and close to the true value (accurate).
                This chapter builds your toolkit to measure, report, and reason with confidence.
              </p>
            </div>
            <div className={styles.advancedNote}>
              <h4>Advanced Angle</h4>
              <p>
                Modern metrology defines units via fundamental constants. Uncertainty is quantified rigorously (GUM), and analysis blends dimensional reasoning,
                statistical inference, and calibration models to achieve traceable, reproducible results.
              </p>
            </div>
            <div className={styles.highlightBox}>
              <h4>Roadmap</h4>
              <ul>
                <li>Foundations: quantities, SI, dimensions</li>
                <li>Precision: significant figures and uncertainty (Type A/B)</li>
                <li>Analysis: propagation with covariance, weighted fits, residuals</li>
                <li>Design: instruments, ADC, noise, calibration, traceability</li>
                <li>Reasoning: dimensional analysis, Π theorem, scaling laws, Fermi estimates</li>
              </ul>
            </div>
          </div>

          <div id="foundations" className={styles.section}>
            <h2>0. Foundations: Quantities, Models, and Metrology</h2>
            <h3>Physical Quantity</h3>
            <p>A measurable attribute (length, time, mass, current, temperature). Each has an operational definition: a clear procedure to measure it.</p>
            <ul>
              <li>Scalar: magnitude only (mass, time, temperature, energy).</li>
              <li>Vector: magnitude + direction (velocity, force, electric field).</li>
              <li>Tensor: multi-index object (stress, inertia tensor, permittivity tensor).</li>
            </ul>
            <h3>Measurement Model</h3>
            <p>Reading = true value + systematic bias + random noise. The goal is to estimate the true value and its uncertainty.</p>
            <h3>Metrology Pillars</h3>
            <ul>
              <li>Traceability: unbroken chain to SI standards via calibrations with stated uncertainties.</li>
              <li>Reproducibility: independent labs obtain consistent results.</li>
              <li>Comparability: results across time and space are comparable because definitions are stable.</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>Example: Defining Average Speed</h4>
              <p>Operational definition: v_avg = Δx / Δt, measured with a meter and a stopwatch.</p>
            </div>
          </div>

          <div id="si-units" className={styles.section}>
            <h2>1. SI Units and Standards (Post-2019)</h2>
            <p>The International System of Units (SI) uses seven base quantities; all units are defined by exact values of fundamental constants.</p>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr><th>Quantity</th><th>Unit</th><th>Symbol</th><th>Defined via</th></tr>
                </thead>
                <tbody>
                  <tr><td>Time</td><td>second</td><td>s</td><td>Δν(Cs) = 9,192,631,770 Hz (exact)</td></tr>
                  <tr><td>Length</td><td>meter</td><td>m</td><td>c = 299,792,458 m·s⁻¹ (exact)</td></tr>
                  <tr><td>Mass</td><td>kilogram</td><td>kg</td><td>h = 6.62607015×10⁻³⁴ J·s (exact)</td></tr>
                  <tr><td>Electric current</td><td>ampere</td><td>A</td><td>e = 1.602176634×10⁻¹⁹ C (exact)</td></tr>
                  <tr><td>Temperature</td><td>kelvin</td><td>K</td><td>k_B = 1.380649×10⁻²³ J·K⁻¹ (exact)</td></tr>
                  <tr><td>Amount of substance</td><td>mole</td><td>mol</td><td>N_A = 6.02214076×10²³ mol⁻¹ (exact)</td></tr>
                  <tr><td>Luminous intensity</td><td>candela</td><td>cd</td><td>K_cd = 683 lm·W⁻¹ at 540 THz (exact)</td></tr>
                </tbody>
              </table>
            </div>
            <p>Coherence: derived units are products/powers of base units without extra numerical factors.</p>
          </div>

          <div id="prefixes" className={styles.section}>
            <h2>2. SI Prefixes & Scientific Notation</h2>
            <p>Use scientific notation and SI prefixes to express very small/large numbers cleanly.</p>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr><th>Prefix</th><th>Symbol</th><th>Factor</th><th>Prefix</th><th>Symbol</th><th>Factor</th></tr>
                </thead>
                <tbody>
                  <tr><td>yocto</td><td>y</td><td>10⁻²⁴</td><td>yotta</td><td>Y</td><td>10²⁴</td></tr>
                  <tr><td>ronto</td><td>r</td><td>10⁻²⁷</td><td>ronna</td><td>R</td><td>10²⁷</td></tr>
                  <tr><td>quecto</td><td>q</td><td>10⁻³⁰</td><td>quetta</td><td>Q</td><td>10³⁰</td></tr>
                  <tr><td>zepto</td><td>z</td><td>10⁻²¹</td><td>zetta</td><td>Z</td><td>10²¹</td></tr>
                  <tr><td>atto</td><td>a</td><td>10⁻¹⁸</td><td>exa</td><td>E</td><td>10¹⁸</td></tr>
                  <tr><td>femto</td><td>f</td><td>10⁻¹⁵</td><td>peta</td><td>P</td><td>10¹⁵</td></tr>
                  <tr><td>pico</td><td>p</td><td>10⁻¹²</td><td>tera</td><td>T</td><td>10¹²</td></tr>
                  <tr><td>nano</td><td>n</td><td>10⁻⁹</td><td>giga</td><td>G</td><td>10⁹</td></tr>
                  <tr><td>micro</td><td>μ</td><td>10⁻⁶</td><td>mega</td><td>M</td><td>10⁶</td></tr>
                  <tr><td>milli</td><td>m</td><td>10⁻³</td><td>kilo</td><td>k</td><td>10³</td></tr>
                  <tr><td>centi</td><td>c</td><td>10⁻²</td><td>hecto</td><td>h</td><td>10²</td></tr>
                  <tr><td>deci</td><td>d</td><td>10⁻¹</td><td>deka</td><td>da</td><td>10¹</td></tr>
                </tbody>
              </table>
            </div>
            <div className={styles.exampleBox}>
              <h4>Example: Converting Units Quickly</h4>
              <p>1 N = 1 kg·m·s⁻² = (10³ g)(10² cm)s⁻² = 10⁵ dyn.</p>
            </div>
          </div>

          <div id="physical-quantities" className={styles.section}>
            <h2>3. Physical Quantities and Dimensions</h2>
            <p>Dimensions express how a quantity depends on base quantities: [M], [L], [T], [I], [Θ], [N], [J]. Angles (rad), solid angles (sr) are dimensionless.</p>
            <div className={styles.exampleBox}>
              <h4>Check: Dimensional Consistency</h4>
              <p>x = x₀ + v₀t + ½at² → each term has [L]. Equation is consistent.</p>
            </div>
          </div>

          <div id="derived-mechanical" className={styles.section}>
            <h2>4. Derived Quantities: Mechanics</h2>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr><th>Quantity</th><th>Symbol</th><th>Unit</th><th>Dimension</th><th>Relation</th></tr>
                </thead>
                <tbody>
                  <tr><td>Velocity</td><td>v</td><td>m·s⁻¹</td><td>[LT⁻¹]</td><td>v = dx/dt</td></tr>
                  <tr><td>Acceleration</td><td>a</td><td>m·s⁻²</td><td>[LT⁻²]</td><td>a = dv/dt</td></tr>
                  <tr><td>Force</td><td>F</td><td>N</td><td>[MLT⁻²]</td><td>F = ma</td></tr>
                  <tr><td>Work/Energy</td><td>W, E</td><td>J</td><td>[ML²T⁻²]</td><td>W = ∫F·dr</td></tr>
                  <tr><td>Power</td><td>P</td><td>W</td><td>[ML²T⁻³]</td><td>P = dW/dt = F·v</td></tr>
                  <tr><td>Momentum</td><td>p</td><td>kg·m·s⁻¹</td><td>[MLT⁻¹]</td><td>p = mv</td></tr>
                  <tr><td>Pressure</td><td>p</td><td>Pa</td><td>[ML⁻¹T⁻²]</td><td>p = F/A</td></tr>
                  <tr><td>Angular momentum</td><td>L</td><td>kg·m²·s⁻¹</td><td>[ML²T⁻¹]</td><td>L = Iω</td></tr>
                  <tr><td>Torque</td><td>τ</td><td>N·m</td><td>[ML²T⁻²]</td><td>τ = r × F</td></tr>
                  <tr><td>Moment of inertia</td><td>I</td><td>kg·m²</td><td>[ML²]</td><td>I = Σmr²</td></tr>
                  <tr><td>Stress</td><td>σ</td><td>Pa</td><td>[ML⁻¹T⁻²]</td><td>σ = F/A</td></tr>
                  <tr><td>Strain</td><td>ε</td><td>1</td><td>[1]</td><td>ε = ΔL/L</td></tr>
                  <tr><td>Young’s modulus</td><td>Y</td><td>Pa</td><td>[ML⁻¹T⁻²]</td><td>Y = σ/ε</td></tr>
                  <tr><td>Viscosity (dyn.)</td><td>η</td><td>Pa·s</td><td>[ML⁻¹T⁻¹]</td><td>τ = η dv/dy</td></tr>
                </tbody>
              </table>
            </div>
            <div className={styles.exampleBox}>
              <h4>Example: Dimensional Derivation (Pendulum)</h4>
              <p>Assume T ∝ lᵃ gᶜ. Match [T] = [L]ᵃ [LT⁻²]ᶜ ⇒ a = 1/2, c = −1/2 → T = k√(l/g).</p>
            </div>
          </div>

          <div id="derived-em" className={styles.section}>
            <h2>5. Derived Quantities: Electricity & Magnetism</h2>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr><th>Quantity</th><th>Symbol</th><th>Unit</th><th>Dimension</th><th>Relation</th></tr>
                </thead>
                <tbody>
                  <tr><td>Charge</td><td>q</td><td>C</td><td>[IT]</td><td>q = ∫i dt</td></tr>
                  <tr><td>Potential</td><td>V</td><td>V</td><td>[ML²T⁻³I⁻¹]</td><td>V = W/q</td></tr>
                  <tr><td>Capacitance</td><td>C</td><td>F</td><td>[M⁻¹L⁻²T⁴I²]</td><td>q = CV</td></tr>
                  <tr><td>Resistance</td><td>R</td><td>Ω</td><td>[ML²T⁻³I⁻²]</td><td>V = iR</td></tr>
                  <tr><td>Conductance</td><td>G</td><td>S</td><td>[M⁻¹L⁻²T³I²]</td><td>G = 1/R</td></tr>
                  <tr><td>Inductance</td><td>L</td><td>H</td><td>[ML²T⁻²I⁻²]</td><td>V = L di/dt</td></tr>
                  <tr><td>Magnetic flux</td><td>Φ</td><td>Wb</td><td>[ML²T⁻²I⁻¹]</td><td>Φ = ∫B·dA</td></tr>
                  <tr><td>Magnetic field</td><td>B</td><td>T</td><td>[MT⁻²I⁻¹]</td><td>F = qvB (⊥)</td></tr>
                  <tr><td>Permittivity</td><td>ε</td><td>F·m⁻¹</td><td>[M⁻¹L⁻³T⁴I²]</td><td>ε₀ ≈ 8.854×10⁻¹²</td></tr>
                  <tr><td>Permeability</td><td>μ</td><td>N·A⁻²</td><td>[MLT⁻²I⁻²]</td><td>μ₀ = 4π×10⁻⁷</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="derived-thermal" className={styles.section}>
            <h2>6. Derived Quantities: Thermo & Waves</h2>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr><th>Quantity</th><th>Symbol</th><th>Unit</th><th>Dimension</th><th>Relation</th></tr>
                </thead>
                <tbody>
                  <tr><td>Heat</td><td>Q</td><td>J</td><td>[ML²T⁻²]</td><td>Q = mcΔT</td></tr>
                  <tr><td>Specific heat</td><td>c</td><td>J·kg⁻¹·K⁻¹</td><td>[L²T⁻²Θ⁻¹]</td><td>c = Q/(mΔT)</td></tr>
                  <tr><td>Entropy</td><td>S</td><td>J·K⁻¹</td><td>[ML²T⁻²Θ⁻¹]</td><td>dS = dQ_rev/T</td></tr>
                  <tr><td>Thermal conductivity</td><td>k</td><td>W·m⁻¹·K⁻¹</td><td>[MLT⁻³Θ⁻¹]</td><td>Q̇ = −kA dT/dx</td></tr>
                  <tr><td>Frequency</td><td>f</td><td>Hz</td><td>[T⁻¹]</td><td>f = 1/T</td></tr>
                  <tr><td>Wavelength</td><td>λ</td><td>m</td><td>[L]</td><td>v = fλ</td></tr>
                  <tr><td>Wavenumber</td><td>k</td><td>m⁻¹</td><td>[L⁻¹]</td><td>k = 2π/λ</td></tr>
                  <tr><td>Intensity</td><td>I</td><td>W·m⁻²</td><td>[MT⁻³]</td><td>I ∝ A² (wave amplitude)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="dimensional-analysis" className={styles.section}>
            <h2>7. Dimensional Analysis & Non-dimensionalization</h2>
            <p>Use dimensions to check equations, derive forms, and scale problems.</p>
            <ul>
              <li>Arguments of exp, log, sin, cos must be dimensionless.</li>
              <li>Non-dimensionalization reveals controlling parameters and limits.</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>Example: Drag Force Form</h4>
              <p>
                Assume F depends on ρ (fluid density), v (speed), A (area), μ (viscosity). Dimensional reasoning yields regimes:
                low Re: F ∝ μvA/L; high Re: F ∝ ½C_D ρv²A.
              </p>
            </div>
          </div>

          <div id="pi-theorem" className={styles.section}>
            <h2>8. Buckingham Π Theorem & Similarity</h2>
            <p>With n variables and k base dimensions ⇒ expect n−k independent dimensionless groups (Π terms).</p>
            <div className={styles.highlightBox}>
              <h4>Common Dimensionless Numbers</h4>
              <ul>
                <li>Reynolds: Re = ρvL/μ (inertia/viscosity)</li>
                <li>Froude: Fr = v/√(gL) (inertia/gravity)</li>
                <li>Mach: Ma = v/c (flow/compressibility)</li>
                <li>Strouhal: St = fL/v (unsteadiness)</li>
                <li>Prandtl: Pr = ν/α (momentum/thermal diffusion)</li>
                <li>Grashof: Gr = gβΔTL³/ν² (buoyancy/viscous)</li>
              </ul>
            </div>
            <div className={styles.exampleBox}>
              <h4>Example: Pendulum with Amplitude</h4>
              <p>Variables: T, l, g, θ₀ ⇒ k = 2 (L,T) ⇒ expect 2 Π groups. One choice: Π₁ = T√(g/l), Π₂ = θ₀. Small-angle: Π₁ ≈ constant.</p>
            </div>
          </div>

          <div id="sig-figs" className={styles.section}>
            <h2>9. Precision & Significant Figures</h2>
            <p>Significant figures communicate precision. Keep guard digits during intermediate steps; round at the end.</p>
            <div className={styles.highlightBox}>
              <h4>Rules</h4>
              <ol>
                <li>Non-zero digits significant; zeros between significant digits count.</li>
                <li>Leading zeros not significant; trailing zeros after a decimal are significant.</li>
                <li>Add/Sub: match least decimal places; Mul/Div: match least significant figures.</li>
                <li>Rounding: round-to-even for halves reduces bias (e.g., 2.5 → 2, 3.5 → 4).</li>
              </ol>
            </div>
            <div className={styles.exampleBox}>
              <h4>Example</h4>
              <p>3.1416 × 2.0 = 6.2832 → 6.3 (2 significant figures).</p>
            </div>
          </div>

          <div id="uncertainty" className={styles.section}>
            <h2>10. Uncertainty: Type A/B, GUM approach</h2>
            <p>Every measurement is incomplete without its uncertainty. Report X = x ± u with coverage (e.g., 95%).</p>
            <ul>
              <li>Type A: statistical evaluation (repeatability, standard deviation).</li>
              <li>Type B: other information (spec sheets, calibration, resolution, prior knowledge).</li>
            </ul>
            <h3>Basic Quantities</h3>
            <ul>
              <li>Mean: x̄ = (1/n) Σxᵢ</li>
              <li>Sample standard deviation: s = √[Σ(xᵢ−x̄)²/(n−1)]</li>
              <li>Standard uncertainty of mean: u(x̄) = s/√n</li>
              <li>Coverage: expanded uncertainty U = k·u_c (k ≈ 2 for ≈95% if normal).</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>Example: Reading a Ruler</h4>
              <p>Resolution ±0.5 mm (uniform). Type B standard u = a/√3 = 0.5/√3 mm.</p>
            </div>
          </div>

          <div id="propagation" className={styles.section}>
            <h2>11. Propagation of Uncertainty (with Covariance)</h2>
            <p>For y = f(x₁,…,x_m), linearize around means: u²(y) ≈ ΣΣ (∂f/∂x_i)(∂f/∂x_j) cov(x_i, x_j).</p>
            <ul>
              <li>Independent: cov = 0 → u²(y) = Σ (∂f/∂x_i)² u²(x_i)</li>
              <li>Relative form (products/powers): u(y)/y = √[Σ (a_i u(x_i)/x_i)² + 2ΣΣ a_i a_j ρ<sub>ij</sub> u_i u_j/(x_i x_j)]</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>Example: Density of a Cylinder</h4>
              <p>ρ = m/(πr²h). Independent m, r, h.</p>
              <p>Relative: (uρ/ρ)² = (um/m)² + (2 ur/r)² + (uh/h)².</p>
            </div>
            <div className={styles.advancedNote}>
              <h4>Advanced</h4>
              <p>For non-linear, large-uncertainty cases, use Monte Carlo propagation: sample inputs per their PDFs and compute y distribution.</p>
            </div>
          </div>

          <div id="statistics" className={styles.section}>
            <h2>12. Statistics: Distributions, SEM, t-tests</h2>
            <ul>
              <li>Normal distribution: many noise sources sum to Gaussian by CLT.</li>
              <li>Small n: mean confidence interval uses Student’s t with ν = n−1.</li>
              <li>Standard error of mean (SEM): s/√n; 95% CI: x̄ ± t<sub>0.975,ν</sub>·SEM.</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>Example: 5 Timing Trials</h4>
              <p>n=5, x̄=2.13 s, s=0.05 s. SEM = 0.022 s. t≈2.776 → 95% CI: 2.13 ± 0.061 s.</p>
            </div>
          </div>

          <div id="outliers" className={styles.section}>
            <h2>13. Outliers: Grubbs, Chauvenet, Residuals</h2>
            <p>Outlier handling must be principled; document decisions.</p>
            <ul>
              <li>Chauvenet: reject if probability of deviation less than 1/(2n).</li>
              <li>Grubbs: test largest |xᵢ−x̄|/s against threshold.</li>
              <li>Model-based: examine residuals after fit; look for non-normality/heteroscedasticity.</li>
            </ul>
          </div>

          <div id="instruments" className={styles.section}>
            <h2>14. Instruments: LC, Zero Error, ADC & Noise</h2>
            <h3>Least Count (Resolution)</h3>
            <ul>
              <li>Analog scale: smallest subdivision; digital: 1 count of display/ADC.</li>
              <li>Vernier: LC = 1 MSD − 1 VSD (commonly 0.1 mm). Screw gauge: LC = pitch/number of divisions.</li>
            </ul>
            <h3>Zero Error</h3>
            <ul>
              <li>Positive zero error: reading high at zero; subtract correction.</li>
              <li>Negative zero error: reading low at zero; add correction.</li>
            </ul>
            <h3>ADC & Quantization</h3>
            <ul>
              <li>n-bit ADC full-scale V_FS: LSB = V_FS/2ⁿ; quantization RMS ≈ LSB/√12.</li>
              <li>Sampling theorem: f_s ≥ 2 f_max to avoid aliasing; use anti-alias filters.</li>
            </ul>
            <h3>Noise & Drift</h3>
            <ul>
              <li>White noise (flat), 1/f noise (low-frequency), thermal noise: √(4k_BTRΔf).</li>
              <li>Drift (slow change), hysteresis (path-dependence), dead band, backlash (mechanical).</li>
            </ul>
          </div>

          <div id="calibration" className={styles.section}>
            <h2>15. Calibration, Traceability & Uncertainty Budget</h2>
            <p>Calibration relates instrument readings to reference standards, providing a calibration curve and uncertainty.</p>
            <ul>
              <li>Procedures: compare to standard at multiple points; model bias; estimate uncertainty.</li>
              <li>Least-squares calibration: y = a + bx; use weighted fit if variances differ.</li>
              <li>Uncertainty budget: list all sources (Type A/B), sensitivity coefficients, combine in quadrature.</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>Example: Thermistor Calibration</h4>
              <p>Fit 1/T = A + B ln R + C (ln R)³ (Steinhart–Hart); propagate uncertainties in R and fit parameters to T.</p>
            </div>
          </div>

          <div id="graphing" className={styles.section}>
            <h2>16. Graphs, Linearization & Weighted Fits</h2>
            <ul>
              <li>Power law y = A xⁿ → log y = log A + n log x (slope = n).</li>
              <li>Exponential y = A e<sup>kx</sup> → ln y = ln A + kx.</li>
              <li>Error bars: show ±u (or ±1σ). Use weighted least squares if σ varies: weights wᵢ = 1/σᵢ².</li>
              <li>Goodness-of-fit: χ² = Σ wᵢ (yᵢ − ŷᵢ)²; reduced χ² ≈ 1 indicates consistent uncertainties.</li>
              <li>Residuals: check for trends (model misspecification) and non-constant variance.</li>
            </ul>
            <div className={styles.exampleBox}>
              <h4>Example: Weighted Linear Fit</h4>
              <p>Fit y = a + bx with weights wᵢ. b = [S_w S_xy − S_x S_y]/[S_w S_xx − S_x²], where S_x = Σ wᵢ xᵢ, etc.</p>
            </div>
          </div>

          <div id="fermi" className={styles.section}>
            <h2>17. Fermi Estimates & Orders of Magnitude</h2>
            <p>Break problems into factors, estimate each, and multiply. Use order-of-magnitude thinking to bound answers and sanity-check results.</p>
            <div className={styles.exampleBox}>
              <h4>Example: Air Molecules in a Room</h4>
              <p>Room 5×4×3 m → V≈60 m³; at STP n≈(P V)/(R T) ≈ (10⁵·60)/(8.3·300) ≈ 2.4×10³ mol → ~1.4×10²⁷ molecules.</p>
            </div>
          </div>

          <div id="conversions" className={styles.section}>
            <h2>18. Unit Conversions & Non-SI Units</h2>
            <ul>
              <li>Time: min = 60 s; h = 3600 s; day = 86400 s.</li>
              <li>Length: 1 in = 2.54 cm (exact); 1 Å = 10⁻¹⁰ m.</li>
              <li>Volume: 1 L = 10⁻³ m³; 1 mL = 1 cm³.</li>
              <li>Pressure: 1 bar = 10⁵ Pa; 1 atm = 101325 Pa; 1 torr ≈ 133.322 Pa.</li>
              <li>Energy: 1 eV = 1.602176634×10⁻¹⁹ J (exact); 1 cal ≈ 4.184 J.</li>
              <li>Angles: degree: 180° = π rad.</li>
            </ul>
            <div className={styles.highlightBox}>
              <h4>Tip</h4>
              <p>Convert all inputs to base SI before computing. Keep guard digits; round at the end.</p>
            </div>
          </div>

          <div id="constants" className={styles.section}>
            <h2>19. Fundamental Constants (Exact & Measured)</h2>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr><th>Constant</th><th>Symbol</th><th>Value</th><th>Note</th></tr>
                </thead>
                <tbody>
                  <tr><td>Speed of light</td><td>c</td><td>299,792,458 m·s⁻¹</td><td>exact</td></tr>
                  <tr><td>Planck constant</td><td>h</td><td>6.62607015×10⁻³⁴ J·s</td><td>exact</td></tr>
                  <tr><td>Elementary charge</td><td>e</td><td>1.602176634×10⁻¹⁹ C</td><td>exact</td></tr>
                  <tr><td>Boltzmann constant</td><td>k_B</td><td>1.380649×10⁻²³ J·K⁻¹</td><td>exact</td></tr>
                  <tr><td>Avogadro constant</td><td>N_A</td><td>6.02214076×10²³ mol⁻¹</td><td>exact</td></tr>
                  <tr><td>Magnetic constant</td><td>μ₀</td><td>4π×10⁻⁷ N·A⁻²</td><td>defined value</td></tr>
                  <tr><td>Gravitational constant</td><td>G</td><td>≈ 6.674×10⁻¹¹ m³·kg⁻¹·s⁻²</td><td>measured</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="greek-alphabet" className={styles.section}>
            <h2>20. Greek Alphabet Reference</h2>
            <p>Common uppercase/lowercase symbols with typical uses.</p>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr><th>Name</th><th>Uppercase</th><th>Lowercase</th><th>Common Uses</th></tr>
                </thead>
                <tbody>
                  <tr><td>Alpha</td><td>Α</td><td>α</td><td>Angular acceleration, fine-structure constant, coefficients</td></tr>
                  <tr><td>Beta</td><td>Β</td><td>β</td><td>Beta decay, velocity ratio v/c, coefficients</td></tr>
                  <tr><td>Gamma</td><td>Γ</td><td>γ</td><td>Lorentz factor γ, surface tension, photons</td></tr>
                  <tr><td>Delta</td><td>Δ</td><td>δ</td><td>Finite change (Δ), small variation/error (δ)</td></tr>
                  <tr><td>Epsilon</td><td>Ε</td><td>ε</td><td>Permittivity ε, strain ε, small quantity</td></tr>
                  <tr><td>Zeta</td><td>Ζ</td><td>ζ</td><td>Damping ratio ζ</td></tr>
                  <tr><td>Eta</td><td>Η</td><td>η</td><td>Efficiency η, dynamic viscosity η</td></tr>
                  <tr><td>Theta</td><td>Θ</td><td>θ</td><td>Angles, absolute temperature (Θ in some contexts)</td></tr>
                  <tr><td>Lambda</td><td>Λ</td><td>λ</td><td>Wavelength λ, cosmological constant Λ</td></tr>
                  <tr><td>Mu</td><td>Μ</td><td>μ</td><td>Friction μ, permeability μ, micro- prefix</td></tr>
                  <tr><td>Nu</td><td>Ν</td><td>ν</td><td>Frequency ν, kinematic viscosity ν</td></tr>
                  <tr><td>Xi</td><td>Ξ</td><td>ξ</td><td>Random variable, displacement, damping</td></tr>
                  <tr><td>Omicron</td><td>Ο</td><td>ο</td><td>Rare in physics notation</td></tr>
                  <tr><td>Pi</td><td>Π</td><td>π</td><td>3.14159…, Π theorem, osmotic pressure</td></tr>
                  <tr><td>Rho</td><td>Ρ</td><td>ρ</td><td>Density ρ, charge density</td></tr>
                  <tr><td>Sigma</td><td>Σ</td><td>σ</td><td>Sum Σ, stress σ, cross-section σ</td></tr>
                  <tr><td>Tau</td><td>Τ</td><td>τ</td><td>Torque τ, time constant τ</td></tr>
                  <tr><td>Upsilon</td><td>Υ</td><td>υ</td><td>Upsilon particle, velocity (rarely)</td></tr>
                  <tr><td>Phi</td><td>Φ</td><td>φ</td><td>Magnetic flux Φ, potential φ, angles</td></tr>
                  <tr><td>Chi</td><td>Χ</td><td>χ</td><td>Susceptibility χ, chi-squared χ²</td></tr>
                  <tr><td>Psi</td><td>Ψ</td><td>ψ</td><td>Wavefunction ψ</td></tr>
                  <tr><td>Omega</td><td>Ω</td><td>ω</td><td>Ohm Ω, angular frequency ω</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="checklist" className={styles.section}>
            <h2>21. Problem-Solving Checklist</h2>
            <ul>
              <li>Define the physical quantities and choose consistent SI units.</li>
              <li>Check dimensional homogeneity of equations.</li>
              <li>Identify assumptions and limiting cases (small-angle, steady state, etc.).</li>
              <li>Estimate orders of magnitude to sanity-check the answer.</li>
              <li>Quantify uncertainty; propagate and report with appropriate sig figs.</li>
              <li>Graph data with error bars; use weighted fits when needed; inspect residuals.</li>
            </ul>
          </div>

          <div id="practice" className={styles.section}>
            <h2>Practice Problems</h2>

            <h3>A) Conceptual</h3>
            <ol>
              <li>Why must the argument of a sine function be dimensionless? Give two physical examples.</li>
              <li>Explain the difference between accuracy and precision with an instrument example.</li>
              <li>Describe Type A vs. Type B uncertainty with one example of each.</li>
              <li>What information does a reduced χ² ≫ 1 convey about your model/uncertainties?</li>
            </ol>

            <h3>B) Numerical</h3>
            <ol>
              <li>
                A length is measured as 12.34 ± 0.02 cm and time as 2.0 ± 0.1 s. Compute speed and its uncertainty.
                Show significant-figure reasoning and final rounding.
              </li>
              <li>
                A sphere’s diameter D = (2.000 ± 0.005) cm and mass m = (33.51 ± 0.03) g. Compute density with uncertainty.
              </li>
              <li>
                Output voltage V depends linearly on temperature T. Data have unequal standard deviations. Perform a weighted fit and estimate the slope with uncertainty.
              </li>
            </ol>

            <h3>C) Challenge</h3>
            <ol>
              <li>
                A pendulum’s period T depends on length l, gravity g, and amplitude θ₀. Use Π theorem to propose a functional form and discuss limits θ₀→0, θ₀→π/2.
              </li>
              <li>
                For y = A xⁿ e<sup>kx</sup>, derive the Jacobian-based propagation of uncertainty for y given u(A), u(n), u(k), u(x) and correlations ρ<sub>ij</sub>.
              </li>
            </ol>

            <div className={styles.highlightBox}>
              <h4>Answer Sketches</h4>
              <ul>
                <li>Dimensionless arguments: θ in sin θ; kx in e<sup>kx</sup>. Examples: SHM phase, wave phase kx−ωt.</li>
                <li>Accuracy vs precision: a miscalibrated scale can be precise but inaccurate.</li>
                <li>Type A: repeat readings; Type B: spec sheet resolution, calibration certificate.</li>
                <li>χ²<sub>red</sub> ≫ 1: under-estimated uncertainties or wrong model; χ²<sub>red</sub> ≪ 1: over-estimated uncertainties.</li>
              </ul>
            </div>

            <div className={styles.practiceGrid}>
              <Link href="/mechanics/measurements/conceptual" className={styles.practiceCard}>
                <div className={styles.icon}>🤔</div>
                <h3>Conceptual Questions</h3>
                <p>Deepen understanding of core principles with qualitative reasoning.</p>
              </Link>
              <Link href="/mechanics/measurements/numerical" className={styles.practiceCard}>
                <div className={styles.icon}>🧮</div>
                <h3>Numerical Problems</h3>
                <p>Sharpen calculations, conversions, and uncertainty propagation.</p>
              </Link>
              <Link href="/mechanics/measurements/mcq" className={styles.practiceCard}>
                <div className={styles.icon}>📊</div>
                <h3>Assessment Quiz</h3>
                <p>Timed mixed-topic questions to test mastery.</p>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
