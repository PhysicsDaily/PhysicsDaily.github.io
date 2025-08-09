// pages/mechanics/measurements/index.js

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from '../../../styles/ContentPage.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'theory-of-measurement', title: 'Theory of Measurement — Overview' },
  { id: 'quantities-units', title: 'Physical Quantities & Units' },
  { id: 'si-units', title: 'The SI System (2019 Redefinition)' },
  { id: 'dimensional-analysis', title: 'Dimensional Analysis & Buckingham Pi' },
  { id: 'significant-figures', title: 'Significant Figures & Rounding Rules' },
  { id: 'error-types', title: 'Types of Errors: Random vs Systematic' },
  { id: 'statistical-analysis', title: 'Statistical Treatment & Uncertainty' },
  { id: 'propagation', title: 'Propagation of Uncertainty (Advanced)' },
  { id: 'instruments-calibration', title: 'Instruments, Least Count & Calibration' },
  { id: 'graphing-fitting', title: 'Graphing, Linearization & Least Squares' },
  { id: 'special-topics', title: 'Special Topics: Metrology & Quantum Limits' },
  { id: 'prefixes-notation', title: 'SI Prefixes, Scientific Notation & Orders of Magnitude' },
  { id: 'greek-alphabet', title: 'Greek Alphabet — Upper & Lowercase (Reference)' },
  { id: 'exam-tips', title: 'Exam Techniques & Topic-Specific Tips' },
  { id: 'practice', title: 'Practice Problems & Solutions' },
  { id: 'references', title: 'Further Reading & References' },
];

export default function MeasurementsPage() {
  const [activeSection, setActiveSection] = useState('');
  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        if (intersectingEntry) {
          setActiveSection(intersectingEntry.target.id);
        }
      },
      { rootMargin: '-20% 0px -79% 0px' }
    );

    observer.current = io;

    const elements = sections
      .map(sec => typeof document !== 'undefined' ? document.getElementById(sec.id) : null)
      .filter(Boolean);

    elements.forEach((el) => io.observe(el));

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Chapter 1: Measurement — Complete Theory & Practice</title>
        <meta name="description" content="Comprehensive chapter on measurement, units, errors, uncertainty, dimensional analysis and exam-focused practice for Olympiad, JEE, IOE, CEE." />
      </Head>

      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-XN081SR2KP" />
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XN081SR2KP');`}
      </Script>

      <Header />

      <div className="breadcrumb">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">›</span>
            <Link href="/mechanics/foundations">Classical Mechanics</Link>
            <span className="separator">›</span>
            <span className="current">📏 Measurement — Full Theory</span>
          </nav>
        </div>
      </div>

      <header className={styles.pageHeader}>
        <div className="container">
          <h1>Chapter 1: Measurement — From Basics to Advanced</h1>
          <p className={styles.subtitle}>Complete theory, worked examples, olympiad tips, and practice problems</p>
          <p className={styles.description}>
            This chapter starts with foundations — what measurement means — and gradually builds to advanced metrology, statistical uncertainty, least-squares fitting, Buckingham Pi theorem and exam-focused problems for JEE, IOE, and physics olympiads.
          </p>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className="container">

          <aside className={styles.toc} aria-label="Table of contents">
            <h3>Contents</h3>
            <ul>
              {sections.map(s => (
                <li key={s.id} className={activeSection === s.id ? styles.activeTocItem : ''}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ul>
          </aside>

          <div id="intro" className={styles.section}>
            <h2>Introduction — What is Measurement and Why Care?</h2>
            <p>
              Measurement is the bridge between physical reality and mathematical description. A measurement assigns numbers to properties (quantities) of objects or events according to agreed rules. Physics uses measurement to test hypotheses, estimate parameters, and build predictive theories.
            </p>
            <div className={styles.highlightBox}>
              <h4>Key Pillars</h4>
              <ul>
                <li><strong>Standards:</strong> shared definitions (e.g., the second) that let everyone measure the same way.</li>
                <li><strong>Traceability:</strong> chain of calibrations back to national/international standards.</li>
                <li><strong>Uncertainty:</strong> quantified doubt about a measurement.</li>
              </ul>
            </div>
          </div>

          <div id="theory-of-measurement" className={styles.section}>
            <h2>Theory of Measurement — Overview</h2>
            <p>
              The mathematical theory of measurement addresses how to map empirical observations to numbers consistently. It uses concepts from metrology and statistics: measurement models, noise, bias, repeatability, reproducibility, and calibration. For competitive exams, understanding the practical rules and how to apply them is key; for olympiads, you should also understand the derivations and limiting cases.
            </p>

            <h3>Measurement Model</h3>
            <p>
              Every measurement can be written as: <span className="equation">y = f(x) + ε</span>, where <em>f(x)</em> is the deterministic relation and <em>ε</em> is the error (random + systematic). Properly separating these and quantifying them is the main job of experimental analysis.
            </p>

            <h3>Operational vs. Theoretical Definitions</h3>
            <p>
              An operational definition tells you “how to measure” (e.g., time by counting oscillations of a cesium atom's transition). A theoretical definition places the quantity inside a broader model (e.g., temperature as related to average kinetic energy). For exams, prefer operational definitions when asked what “a measurement” means.
            </p>

            <div className={styles.exampleBox}>
              <h4>Example</h4>
              <p>Measuring gravitational acceleration with a simple pendulum: theoretical period <span className="equation">T = 2π√(l/g)</span>. Rearranging measures <span className="equation">g = (2π)² l / T²</span>. The experiment's uncertainty depends on how precisely you measure <span className="equation">l</span> and <span className="equation">T</span>, and on systematic effects (air resistance, amplitude corrections).</p>
            </div>

          </div>

          <div id="quantities-units" className={styles.section}>
            <h2>Physical Quantities & Units</h2>
            <h3>Definitions</h3>
            <p>
              A <strong>quantity</strong> is a property that can be measured (length, mass, time). A <strong>unit</strong> is a specific magnitude of a quantity agreed upon for reference (meter, kilogram, second). Quantities are either base (independent) or derived (built from base quantities).
            </p>

            <h3>Scalars, Vectors & Tensors</h3>
            <p>
              Most early physics deals with scalars and vectors. Advanced topics (continuum mechanics, relativity) use tensors. For measurement theory, be comfortable with representing units and dimensions of scalars and components of vectors (each component has the same dimension as the scalar quantity it represents).
            </p>

            <h3>Dimensional Symbols</h3>
            <p>Common base dimension symbols: [M] mass, [L] length, [T] time, [I] current, [Θ] temperature, [N] amount (mole), [J] luminous intensity.</p>

          </div>

          <div id="si-units" className={styles.section}>
            <h2>The SI System (2019 Redefinition)</h2>
            <p>
              The SI system currently defines base units by fixing exact numerical values of fundamental constants (e.g., the speed of light <span className="equation">c</span>, Planck constant <span className="equation">h</span>, elementary charge <span className="equation">e</span>, Boltzmann constant <span className="equation">k_B</span>, Avogadro constant <span className="equation">N_A</span>, cesium hyperfine frequency <span className="equation">Δν_{Cs}</span>, and luminous efficacy <span className="equation">K_{cd}</span>).</p>

            <h3>Seven Base Units (quick table)</h3>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr><th>Quantity</th><th>Unit</th><th>Symbol</th></tr>
                </thead>
                <tbody>
                  <tr><td>Time</td><td>second</td><td>s</td></tr>
                  <tr><td>Length</td><td>metre</td><td>m</td></tr>
                  <tr><td>Mass</td><td>kilogram</td><td>kg</td></tr>
                  <tr><td>Electric current</td><td>ampere</td><td>A</td></tr>
                  <tr><td>Temperature</td><td>kelvin</td><td>K</td></tr>
                  <tr><td>Amount of substance</td><td>mole</td><td>mol</td></tr>
                  <tr><td>Luminous intensity</td><td>candela</td><td>cd</td></tr>
                </tbody>
              </table>
            </div>

            <h3>Useful Exam Note</h3>
            <p>
              JEE/IOE style problems assume SI unless otherwise stated. Many errors in conversion problems come from mixing base units (e.g., using cm with kg & s requires converting cm → m consistently).
            </p>
          </div>

          <div id="dimensional-analysis" className={styles.section}>
            <h2>Dimensional Analysis & Buckingham Pi Theorem</h2>
            <p>
              Dimensional analysis treats dimensions as algebraic quantities. It is used to check equations, derive scaling laws, and reduce the number of variables (Buckingham Pi).
            </p>

            <h3>Rules & Uses</h3>
            <ol>
              <li>Every term added/subtracted must have the same dimensions.</li>
              <li>Only dimensionless combinations can appear in transcendental functions (sin, exp, log).</li>
              <li>Buckingham Pi theorem: With <em>n</em> variables and <em>k</em> fundamental dimensions, form <em>n − k</em> independent dimensionless groups.</li>
            </ol>

            <div className={styles.exampleBox}>
              <h4>Worked Example: Period of Small Oscillations — Pendulum</h4>
              <p>We want T depending on length l, mass m, gravitational acceleration g, and amplitude θ₀ (small). List dimensions: [T], [L], [M], [LT⁻²], and dimensionless θ₀. Eliminating mass and dimensionless amplitude, we find T ∝ √(l/g) as usual. Buckingham Pi formalizes this and predicts the dimensionless group T√(g/l) as constant.</p>
            </div>

            <div className={styles.exampleBox}>
              <h4>Buckingham Pi — Fluid Drag Example</h4>
              <p>Drag force F depends on speed v, density ρ, viscosity η, and size L. Variables n=5, dimensions k=3 ([M],[L],[T]) ⇒ 2 π-groups. Usually choose Reynolds number Re = ρvL/η and C_d = F/(ρv²L²). Relationship: C_d = f(Re).</p>
            </div>

            <div className={styles.highlightBox}>
              <h4>Olympiad Tip</h4>
              <p>Dimensional analysis can quickly eliminate impossible answer choices and find dependence exponents up to a dimensionless constant. Combine with limiting-case tests to determine constants when possible.</p>
            </div>
          </div>

          <div id="significant-figures" className={styles.section}>
            <h2>Significant Figures & Rounding Rules</h2>
            <p>
              Significant figures communicate a measurement's precision. Exams expect you to round correctly and not falsely imply precision.
            </p>

            <h3>Rules (concise)</h3>
            <ol>
              <li>All non-zero digits are significant.</li>
              <li>Zeros between non-zero digits are significant.</li>
              <li>Leading zeros are not.</li>
              <li>Trailing zeros are significant only if there's a decimal point (or an overbar/notation indicates it).</li>
            </ol>

            <h3>Arithmetic Rules</h3>
            <p><strong>Add/Subtract:</strong> Round to the least precise decimal place. <strong>Multiply/Divide:</strong> Round to the least number of significant figures.</p>

            <h3>Exam Advice</h3>
            <p>
              For multi-step problems, carry extra guard digits through calculations and only round at the end unless instructed otherwise. If a number is exact (like π when symbolically used, or conversion factors like 1000 g = 1 kg when stated), it doesn't limit significant figures.
            </p>
          </div>

          <div id="error-types" className={styles.section}>
            <h2>Types of Errors — Random and Systematic</h2>
            <p>
              Errors are not "mistakes" but uncertainties. Distinguish between random (statistical scatter) and systematic (bias) errors.
            </p>

            <h3>Random Errors</h3>
            <ul>
              <li>Cause scatter; reduced by more measurements.</li>
              <li>Described by standard deviation.</li>
            </ul>

            <h3>Systematic Errors</h3>
            <ul>
              <li>Bias caused by miscalibration, environmental effects, or model assumptions.</li>
              <li>Cannot be reduced by averaging; must be identified and corrected or included as an uncertainty term.</li>
            </ul>

            <div className={styles.exampleBox}>
              <h4>Example</h4>
              <p>
                A weighing scale reads 0.5 g too high. All mass measurements have a +0.5 g systematic error. Averaging many measurements won't remove it.
              </p>
            </div>
          </div>

          <div id="statistical-analysis" className={styles.section}>
            <h2>Statistical Treatment & Uncertainty</h2>
            <p>
              For repeated measurements x_i (i=1..N), the basic statistics are:
            </p>
            <ul>
              <li><strong>Mean:</strong> <span className="equation">x̄ = (1/N) &Sigma; x_i</span></li>
              <li><strong>Variance:</strong> <span className="equation">s² = (1/(N-1)) &Sigma; (x_i - x̄)²</span> (sample variance)</li>
              <li><strong>Standard deviation:</strong> s = √(s²)</li>
              <li><strong>Standard error of the mean:</strong> <span className="equation">s_{x̄} = s / √N</span></li>
            </ul>

            <h3>Confidence Intervals</h3>
            <p>
              Report uncertainties as ±1σ (68% CL) or ±2σ (≈95% CL). For few measurements (small N), use t-distribution tables when quoting confidence intervals.
            </p>

            <div className={styles.exampleBox}>
              <h4>Worked Example</h4>
              <p>
                Five repeated measurements of time: 1.02, 1.00, 1.01, 0.99, 1.03 s. Mean = 1.01 s. Sample sd s ≈ 0.0141 s. Standard error = 0.0141/√5 ≈ 0.0063 s. Report as 1.01 ± 0.006 s (1σ).
              </p>
            </div>

            <h3>Combining Random and Systematic</h3>
            <p>
              When both exist, combine in quadrature if they're independent: <span className="equation">Δ_{total} = √(Δ_{rand}² + Δ_{sys}²)</span>. Document both components separately when possible.
            </p>
          </div>

          <div id="propagation" className={styles.section}>
            <h2>Propagation of Uncertainty (Advanced)</h2>
            <p>
              If z = f(x, y, ...), and x, y have uncertainties Δx, Δy, then to first order:
            </p>
            <p><span className="equation">(Δz)² = (∂f/∂x)² (Δx)² + (∂f/∂y)² (Δy)² + 2 (∂f/∂x)(∂f/∂y) Cov(x,y) + ...</span></p>
            <p>
              For uncorrelated variables, covariance terms vanish. This derivative method is essential for accurate olympiad/advanced exam answers when functions are nonlinear.
            </p>

            <div className={styles.exampleBox}>
              <h4>Example: Area of Rectangle</h4>
              <p>
                A = l × w. ΔA ≈ √((w Δl)² + (l Δw)²). If l=(10.0±0.1) cm and w=(5.00±0.05) cm → ΔA = √((5×0.1)² + (10×0.05)²) = √(0.25 + 0.25) = √0.5 ≈ 0.707 cm².
              </p>
            </div>

            <h3>Higher-order Corrections</h3>
            <p>
              If uncertainties are not small, include second-order terms or use Monte Carlo propagation (simulate many draws from distributions of inputs and compute distribution of output). For olympiad / exam settings first-order linear propagation is usually sufficient unless stated otherwise.
            </p>
          </div>

          <div id="instruments-calibration" className={styles.section}>
            <h2>Measurement Instruments, Least Count, Zero Error & Calibration</h2>
            <h3>Least Count</h3>
            <p>
              Least count is the smallest unit that an instrument can resolve (e.g., 1 mm on certain rulers). It is a component of measurement uncertainty; typical practice is to take an uncertainty of ±(LC/2) for analog scales if no better estimate exists.
            </p>

            <h3>Zero Error</h3>
            <p>
              If an instrument reads a non-zero value on true-zero, this is zero error. Correct readings by subtracting/adding the zero error and include uncertainty of that correction.
            </p>

            <h3>Calibration</h3>
            <p>
              Calibration compares an instrument to a standard to determine corrections and uncertainties. Labs maintain traceability chains to national institutes (NIST, BIPM, etc.). For exams, know how to correct readings and propagate the uncertainty introduced by calibration.
            </p>

            <h3>Common Instruments & Quick Notes</h3>
            <ul>
              <li><strong>Vernier Calipers:</strong> Learn how to read main scale and vernier scale; LC typically 0.1 mm or 0.02 mm depending on caliper.</li>
              <li><strong>Screw Gauge (Micrometer):</strong> Understand pitch, circular scale, and calculation of least count.</li>
              <li><strong>Stopwatch/Photogate:</strong> For timing — photogates reduce human reaction time errors drastically.</li>
              <li><strong>Digital Multimeter:</strong> Know resolution and input impedance; measure voltage, current, resistance carefully with ranges.</li>
            </ul>
          </div>

          <div id="graphing-fitting" className={styles.section}>
            <h2>Graphing, Linearization & Least Squares Fitting</h2>
            <h3>Linearization</h3>
            <p>
              Many relationships can be linearized for parameter extraction. E.g., y = A x^n → log y = log A + n log x. Slope gives exponent n.
            </p>

            <h3>Least Squares (Simple Linear)</h3>
            <p>
              For points (x_i, y_i) with uncertainties σ_i on y (assumed independent), the best-fit slope m and intercept c minimize χ² = &Sigma;[(y_i − (m x_i + c))/σ_i]². For equal σ_i, use simple formulas for m and c. Understanding derivation of these formulas is beneficial for olympiad-level problems.
            </p>

            <div className={styles.exampleBox}>
              <h4>Worked Example</h4>
              <p>
                Fit y = mx + c to points (0,1), (1,3), (2,5). The slope m = 2, intercept c =1 (exact here). For noisy data, compute sums &Sigma;x, &Sigma;y, &Sigma;xy, &Sigma;x² and use m = (N&Sigma;xy − &Sigma;x&Sigma;y)/(N&Sigma;x² − (&Sigma;x)²).
              </p>
            </div>

            <h3>Uncertainty of Fit</h3>
            <p>
              After finding m and c, their uncertainties come from covariance matrix. Propagate these to any derived quantity (e.g., when using fit to estimate physical constants) using the usual propagation formula.
            </p>
          </div>

          <div id="special-topics" className={styles.section}>
            <h2>Special Topics: Metrology, Quantum Limits & Modern Methods</h2>
            <h3>Metrology</h3>
            <p>
              Metrology is the science of measurement — includes definitions of units, traceability, uncertainty budgets, and inter-lab comparisons. For advanced students, reading about Kibble balances (defining kilogram) and atomic clocks (defining the second) is instructive.
            </p>

            <h3>Quantum Limits</h3>
            <p>
              The Heisenberg uncertainty principle places fundamental limits on simultaneous measurements (e.g., position & momentum). Quantum metrology explores entanglement and squeezed states to beat classical limits in certain contexts; this is active research but beyond most exam syllabi.
            </p>
          </div>

          <div id="prefixes-notation" className={styles.section}>
            <h2>SI Prefixes, Scientific Notation & Orders of Magnitude</h2>
            <p>
              Use scientific notation to avoid errors and show orders of magnitude. SI prefixes help present numbers cleanly.
            </p>
            <div className={styles.tableWrapper}>
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
                  <tr><td>tera</td><td>T</td><td>10¹²</td></tr>
                </tbody>
              </table>
            </div>

            <h3>Orders of Magnitude</h3>
            <p>
              Quickly compare scales: electron radius ~10⁻¹⁵ m, atom ~10⁻¹⁰ m, human ~1 m, earth ~10⁷ m. Estimation skills (Fermi problems) are invaluable in multiple-choice exams to reject options.
            </p>
          </div>

          <div id="greek-alphabet" className={styles.section}>
            <h2>Greek Alphabet — Uppercase & Lowercase (Reference)</h2>
            <p>Commonly used Greek letters in physics with typical meanings:</p>
            <div className={styles.tableWrapper}>
              <table>
                <thead><tr><th>Name</th><th>Uppercase</th><th>Lowercase</th><th>Common Uses</th></tr></thead>
                <tbody>
                  <tr><td>Alpha</td><td>Α</td><td>α</td><td>Angular acceleration, fine-structure constant</td></tr>
                  <tr><td>Beta</td><td>Β</td><td>β</td><td>Coefficient or velocity/c, beta decay</td></tr>
                  <tr><td>Gamma</td><td>Γ</td><td>γ</td><td>Lorentz factor γ, photon</td></tr>
                  <tr><td>Delta</td><td>Δ</td><td>δ</td><td>Finite change Δ, small change δ</td></tr>
                  <tr><td>Epsilon</td><td>Ε</td><td>ε</td><td>Permittivity, strain</td></tr>
                  <tr><td>Zeta</td><td>Ζ</td><td>ζ</td><td>Damping ratio</td></tr>
                  <tr><td>Eta</td><td>Η</td><td>η</td><td>Efficiency η, viscosity</td></tr>
                  <tr><td>Theta</td><td>Θ</td><td>θ</td><td>Angles, potential temperature</td></tr>
                  <tr><td>Lambda</td><td>Λ</td><td>λ</td><td>Wavelength λ, eigenvalues</td></tr>
                  <tr><td>Mu</td><td>Μ</td><td>μ</td><td>Coefficient of friction, permeability, micro-</td></tr>
                  <tr><td>Nu</td><td>Ν</td><td>ν</td><td>Frequency ν, kinematic viscosity</td></tr>
                  <tr><td>Pi</td><td>Π</td><td>π</td><td>Ratio of circle circumference, product operator</td></tr>
                  <tr><td>Rho</td><td>Ρ</td><td>ρ</td><td>Density, resistivity</td></tr>
                  <tr><td>Sigma</td><td>&Sigma;</td><td>σ</td><td>Sum operator &Sigma;, standard deviation σ, stress</td></tr>
                  <tr><td>Tau</td><td>Τ</td><td>τ</td><td>Torque, time constant</td></tr>
                  <tr><td>Phi</td><td>Φ</td><td>φ</td><td>Magnetic flux, angle, potential</td></tr>
                  <tr><td>Chi</td><td>Χ</td><td>χ</td><td>Susceptibility</td></tr>
                  <tr><td>Psi</td><td>Ψ</td><td>ψ</td><td>Wavefunction ψ</td></tr>
                  <tr><td>Omega</td><td>Ω</td><td>ω</td><td>Ohm (Ω), angular frequency ω</td></tr>
                </tbody>
              </table>
            </div>
            <p className={styles.smallNote}>Tip: Learn the visual shapes and common uses — it speeds up reading problems during exams.</p>
          </div>

          <div id="exam-tips" className={styles.section}>
            <h2>Exam Techniques & Topic-Specific Tips</h2>
            <ul>
              <li><strong>Dimension Check:</strong> Before calculation, check dimensional homogeneity to catch algebraic mistakes quickly.</li>
              <li><strong>Guard Digits:</strong> Keep 2-3 extra significant digits during intermediate steps; round only at the end.</li>
              <li><strong>Units Consistency:</strong> Convert everything to SI base units before plugging into formulas.</li>
              <li><strong>Estimate First:</strong> Use Fermi estimation to eliminate wildly wrong multiple-choice options.</li>
              <li><strong>Answer Format:</strong> For JEE/Advanced, present numeric answers with appropriate precision; for olympiads, justify scaling arguments and limiting cases.</li>
            </ul>

            <h3>Topic-Specific Notes</h3>
            <p>
              For pendulum and oscillation problems be careful with small-angle approximations (sin θ ≈ θ only if θ ≪ 1 rad). For fluid mechanics dimensional problems, remember Reynolds number and typical drag scaling. For energy/power problems check units of power (kg·m²·s⁻³).
            </p>
          </div>

          <div id="practice" className={styles.section}>
            <h2>Practice Problems & Solutions</h2>

            <h3>Conceptual (Short)</h3>
            <ol>
              <li>
                <strong>Question:</strong> If a scale has a systematic offset of +0.2 kg, and repeated measurements have a random standard deviation of 0.05 kg, what is the combined uncertainty? <br/>
                <strong>Solution:</strong> Combine in quadrature: √(0.2² + 0.05²) ≈ √(0.04 + 0.0025) ≈ √0.0425 ≈ 0.206 kg. Report measurement as x ± 0.21 kg (rounded).
              </li>

              <li>
                <strong>Question:</strong> You measure length l with a vernier caliper (LC = 0.1 mm) three times: 10.10, 10.12, 10.11 cm. What is the best way to report the result? <br/>
                <strong>Solution:</strong> Mean = 10.11 cm. Random sd ≈ 0.01 cm, LC/2 = 0.005 cm. Combine uncertainty ≈ √(0.01² + 0.005²) ≈ 0.011 cm. Report l = 10.11 ± 0.01 cm.
              </li>
            </ol>

            <h3>Numerical (Longer)</h3>
            <ol start={3}>
              <li>
                <strong>Problem — Density with Propagation:</strong> A cube's mass m = (100.0 ± 0.5) g, side L = (10.00 ± 0.02) cm. Find density ρ and its uncertainty.
                <br/>
                <strong>Solution:</strong> ρ = m/L³. Convert units: m = 0.1000 ± 0.0005 kg, L = 0.1000 ± 0.0002 m. Relative uncertainty: Δρ/ρ = Δm/m + 3(ΔL/L) = 0.005/0.1000 + 3(0.0002/0.1000) = 0.005 + 3(0.002) = 0.005 + 0.006 = 0.011. ρ = (0.1000)/(0.001000) = 100 kg/m³. Δρ = 100 × 0.011 = 1.1 kg/m³. Report: ρ = (100 ± 1.1) kg/m³.
              </li>

              <li>
                <strong>Problem — Buckingham Pi (Simple):</strong> Drag force F depends on velocity v, density ρ, viscosity η, and characteristic length L. Identify the π-groups.
                <br/>
                <strong>Solution:</strong> Choose ρ, v, L for repeating variables. Dimensionless groups: Re = ρvL/η and C_d = F/(ρ v² L²). So F = ρ v² L² × f(Re).
              </li>
            </ol>

            <h3>Olympiad-Level Question</h3>
            <p>
              <strong>Problem:</strong> A simple pendulum of length l oscillates with amplitude θ_0 (small but finite). Show to first nonlinear correction that the period depends weakly on amplitude: T(θ_0) ≈ 2π√(l/g) [1 + (1/16) θ_0² + ...]. (Sketch idea: expand integral expression for period).
              <br/>
              <strong>Sketch of Solution:</strong> The exact expression for period is T = 4√(l/g) ∫_0^{π/2} (1 − k² sin²φ)^(−1/2) dφ where k = sin(θ_0/2). Expand elliptic integral for small k: T ≈ 2π√(l/g) [1 + (1/16) θ_0² + ...]. This derivation uses series expansion of complete elliptic integrals; knowing the leading correction is often sufficient for olympiad answers.
            </p>

            <div className={styles.practiceFooter}>
              <p>Additional practice sets (MCQ, full-length timed quizzes, and interactive graph-fitting) are available through linked practice pages.</p>
              <Link href="/mechanics/measurements/conceptual" className={styles.button}>Conceptual Questions</Link>
              <Link href="/mechanics/measurements/numerical" className={styles.button}>Numerical Problems</Link>
              <Link href="/mechanics/measurements/mcq" className={styles.button}>Assessment Quiz</Link>
            </div>
          </div>

          <div id="references" className={styles.section}>
            <h2>Further Reading & References</h2>
            <ul>
              <li>JCGM 100:2008 (GUM) — Guide to the Expression of Uncertainty in Measurement.</li>
              <li>SI Brochure (BIPM) — current definition of SI units.</li>
              <li>Any thorough undergraduate physics lab manual (for practical calibration & instrument details).</li>
            </ul>
            <p className={styles.smallNote}>If you'd like, I can convert this chapter into a printable PDF, split it into smaller lesson pages, or add interactive problems with auto-grading. Tell me which you prefer.</p>
          </div>

        </div>
      </main>

      <section className={styles.practiceSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Want More — Tailored for Your Exam?</h2>
            <p className={styles.sectionSubtitle}>I can add: topic-wise past JEE/IOE/CEE questions, timed tests, or printable notes.</p>
            <div className={styles.ctaRow}>
              <Link href="/contact" className={styles.ctaButton}>Request Custom Problem Set</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
