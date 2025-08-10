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
  // Added Problems
  { id: 4, difficulty: 'Easy', question: 'Convert a speed of 72 km/h into m/s.', solution: '<h4>Steps:</h4><ol><li>Use conversion factors: $1 \\text{ km} = 1000 \\text{ m}$ and $1 \\text{ h} = 3600 \\text{ s}$.</li><li>Calculation: $72 \\frac{\\text{km}}{\\text{h}} = 72 \\times \\frac{1000 \\text{ m}}{3600 \\text{ s}} = 20 \\text{ m/s}$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 20 m/s</div>' },
  { id: 5, difficulty: 'Easy', question: 'The density of a material is 8.6 g/cm³. Express it in kg/m³.', solution: '<h4>Steps:</h4><ol><li>Use conversion factors: $1 \\text{ g} = 10^{-3} \\text{ kg}$ and $1 \\text{ cm} = 10^{-2} \\text{ m}$, so $1 \\text{ cm}^3 = (10^{-2})^3 \\text{ m}^3 = 10^{-6} \\text{ m}^3$.</li><li>Calculation: $8.6 \\frac{\\text{g}}{\\text{cm}^3} = 8.6 \\times \\frac{10^{-3} \\text{ kg}}{10^{-6} \\text{ m}^3} = 8.6 \\times 10^3 \\text{ kg/m}^3$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 8600 kg/m³</div>' },
  { id: 6, difficulty: 'Easy', question: 'Add 2.34 kg and 15.2 kg and give the result to the correct number of decimal places.', solution: '<h4>Steps:</h4><ol><li>Perform the addition: $2.34 + 15.2 = 17.54$.</li><li>In addition, the result must be rounded to the same number of decimal places as the number with the least decimal places. 15.2 has one decimal place.</li><li>Round: Rounding 17.54 to one decimal place gives 17.5.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 17.5 kg</div>' },
  { id: 7, difficulty: 'Easy', question: 'A screw gauge has a least count of 0.001 cm and zero error of +0.005 cm. Find the correct diameter if the measured value is 0.250 cm.', solution: '<h4>Steps:</h4><ol><li>Formula for correct reading: Correct Reading = Measured Reading - Zero Error.</li><li>Calculation: $0.250 \\text{ cm} - (+0.005 \\text{ cm}) = 0.245 \\text{ cm}$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 0.245 cm</div>' },
  { id: 8, difficulty: 'Easy', question: 'The side of a cube is measured to be $5.2 \\pm 0.1$ cm. What is the uncertainty in the volume?', solution: '<h4>Steps:</h4><ol><li>Volume $V = s^3$. Relative error in volume is $3 \\times (\\text{relative error in side})$.</li><li>Relative error in side: $\\frac{\\Delta s}{s} = \\frac{0.1}{5.2}$.</li><li>Relative error in volume: $\\frac{\\Delta V}{V} = 3 \\times \\frac{0.1}{5.2} \\approx 0.0577$.</li><li>Volume $V = (5.2)^3 = 140.608 \\text{ cm}^3$.</li><li>Uncertainty $\\Delta V = V \\times 0.0577 = 140.608 \\times 0.0577 \\approx 8.1 \\text{ cm}^3$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> Uncertainty is approximately 8.1 cm³</div>' },
  { id: 9, difficulty: 'Easy', question: 'What is the dimensional formula for gravitational constant G?', solution: '<h4>Steps:</h4><ol><li>Start with Newton\'s law of gravitation: $F = G \\frac{m_1 m_2}{r^2}$.</li><li>Rearrange for G: $G = \\frac{F r^2}{m_1 m_2}$.</li><li>Substitute dimensions: $[G] = \\frac{[MLT^{-2}][L^2]}{[M][M]} = [M^{-1}L^3T^{-2}]$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> $[M^{-1}L^3T^{-2}]$</div>' },
  { id: 10, difficulty: 'Easy', question: 'The length of a rod is measured as 25.0 cm. This measurement has how many significant figures?', solution: '<p>The measurement 25.0 cm has three significant figures. The trailing zero after the decimal point indicates that the measurement is precise to the first decimal place.</p><div class="finalAnswer"><strong>Final Answer:</strong> 3</div>' },
  { id: 11, difficulty: 'Medium', question: 'The resistance R is $V/I$ where $V = (100 \\pm 5)$ V and $I = (10 \\pm 0.2)$ A. Find the percentage error in R.', solution: '<h4>Steps:</h4><ol><li>Percentage error in V: $\\frac{5}{100} \\times 100\\% = 5\\%$.</li><li>Percentage error in I: $\\frac{0.2}{10} \\times 100\\% = 2\\%$.</li><li>The percentage error in R is the sum of the percentage errors in V and I.</li><li>Total % Error = $5\\% + 2\\% = 7\\%$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 7%</div>' },
  { id: 12, difficulty: 'Medium', question: 'The radius of a sphere is measured to be $(2.1 \\pm 0.5)$ cm. Calculate its surface area with error limits.', solution: '<h4>Steps:</h4><ol><li>Surface area $A = 4\\pi r^2$.</li><li>Calculate area: $A = 4\\pi (2.1)^2 = 55.417... \\approx 55.4 \\text{ cm}^2$.</li><li>Relative error in A: $\\frac{\\Delta A}{A} = 2 \\frac{\\Delta r}{r} = 2 \\times \\frac{0.5}{2.1} \\approx 0.476$.</li><li>Absolute error $\\Delta A = A \\times 0.476 = 55.4 \\times 0.476 \\approx 26.4 \\text{ cm}^2$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> $(55.4 \\pm 26.4)$ cm²</div>' },
  { id: 13, difficulty: 'Medium', question: 'A laser signal sent to the moon returns in 2.56 s. If the speed of light is $3 \\times 10^8$ m/s, what is the distance of the moon from the Earth?', solution: '<h4>Steps:</h4><ol><li>The time taken is for the round trip (Earth-Moon-Earth). Time for one way is $t = 2.56 / 2 = 1.28$ s.</li><li>Distance = Speed × Time.</li><li>Calculation: $d = (3 \\times 10^8 \\text{ m/s}) \\times 1.28 \\text{ s} = 3.84 \\times 10^8 \\text{ m}$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> $3.84 \\times 10^8$ m</div>' },
  { id: 14, difficulty: 'Medium', question: 'The dimensional formula for angular momentum is the same as for which other physical quantity?', solution: '<p>Angular momentum $L = I\\omega = (ML^2)(T^{-1}) = [ML^2T^{-1}]$.<br/>Planck\'s constant $h$ from $E=h\\nu$ has dimensions $[h] = [E]/[\\nu] = [ML^2T^{-2}]/[T^{-1}] = [ML^2T^{-1}]$.</p><div class="finalAnswer"><strong>Final Answer:</strong> Planck\'s constant</div>' },
  { id: 15, difficulty: 'Medium', question: 'In a vernier caliper, 10 vernier scale divisions coincide with 9 main scale divisions. If one main scale division is 1 mm, what is the least count?', solution: '<h4>Steps:</h4><ol><li>Value of 1 VSD = $9/10$ MSD = 0.9 mm.</li><li>Least Count = 1 MSD - 1 VSD.</li><li>Calculation: LC = 1 mm - 0.9 mm = 0.1 mm.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 0.1 mm or 0.01 cm</div>' },
  { id: 16, difficulty: 'Medium', question: 'The specific resistance $\\rho$ of a wire of radius $r$, length $l$, and resistance $R$ is given by $\\rho = \\frac{\\pi r^2 R}{l}$. Given $r=0.24\\pm0.02$ cm, $R=30\\pm1$ $\\Omega$, and $l=4.80\\pm0.01$ cm. Calculate the percentage error in $\\rho$.', solution: '<h4>Steps:</h4><ol><li>Percentage error formula: $\\frac{\\Delta\\rho}{\\rho} = 2\\frac{\\Delta r}{r} + \\frac{\\Delta R}{R} + \\frac{\\Delta l}{l}$.</li><li>Calculate individual % errors: $2(\\frac{0.02}{0.24})100\\% + (\\frac{1}{30})100\\% + (\\frac{0.01}{4.80})100\\%$.</li><li>Sum them up: $16.67\\% + 3.33\\% + 0.21\\% = 20.21\\%$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 20.21%</div>' },
  { id: 17, difficulty: 'Medium', question: 'Check the dimensional correctness of the equation $\\frac{1}{2}mv^2 = mgh$.', solution: '<h4>Steps:</h4><ol><li>LHS dimension: $[M][LT^{-1}]^2 = [ML^2T^{-2}]$.</li><li>RHS dimension: $[M][LT^{-2}][L] = [ML^2T^{-2}]$.</li><li>Since LHS dimensions = RHS dimensions, the equation is correct.</li></ol><div class="finalAnswer"><strong>Conclusion:</strong> The equation is dimensionally correct.</div>' },
  { id: 18, difficulty: 'Hard', question: 'The time period of an oscillating drop of radius $r$, density $\\rho$ and surface tension $S$ is $T = k r^a \\rho^b S^c$. Find the values of a, b, and c.', solution: '<h4>Steps:</h4><ol><li>Dimensions: $T=[T]$, $r=[L]$, $\\rho=[ML^{-3}]$, $S=[MT^{-2}]$.</li><li>$[T] = [L]^a [ML^{-3}]^b [MT^{-2}]^c = [M^{b+c} L^{a-3b} T^{-2c}]$.</li><li>Equating powers: For T: $1=-2c \\implies c=-1/2$. For M: $b+c=0 \\implies b=-c=1/2$. For L: $a-3b=0 \\implies a=3b=3/2$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> a = 3/2, b = 1/2, c = -1/2</div>' },
  { id: 19, difficulty: 'Hard', question: 'The velocity of water waves $v$ may depend on their wavelength $\\lambda$, the density of water $\\rho$, and the acceleration due to gravity $g$. Find the relation between these quantities by dimensional analysis.', solution: '<h4>Steps:</h4><ol><li>Let $v = k \\lambda^a \\rho^b g^c$. Dimensions: $v=[LT^{-1}]$, $\\lambda=[L]$, $\\rho=[ML^{-3}]$, $g=[LT^{-2}]$.</li><li>$[LT^{-1}] = [L]^a [ML^{-3}]^b [LT^{-2}]^c = [M^b L^{a-3b+c} T^{-2c}]$.</li><li>Equating powers: For M: $b=0$. For T: $-1=-2c \\implies c=1/2$. For L: $1=a-3b+c \\implies 1=a-0+1/2 \\implies a=1/2$.</li><li>So, $v = k \\lambda^{1/2} g^{1/2} = k\\sqrt{\\lambda g}$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> $v \\propto \\sqrt{\\lambda g}$</div>' },
  { id: 20, difficulty: 'Hard', question: 'A wire has a mass $0.3 \\pm 0.003$ g, radius $0.5 \\pm 0.005$ mm and length $6 \\pm 0.06$ cm. What is the maximum percentage error in the measurement of its density?', solution: '<h4>Steps:</h4><ol><li>Density $\\rho = \\frac{m}{V} = \\frac{m}{\\pi r^2 l}$.</li><li>% error in $\\rho$ = % error in m + 2(% error in r) + % error in l.</li><li>% error in m = $(\\frac{0.003}{0.3})100\\% = 1\\%$.</li><li>% error in r = $(\\frac{0.005}{0.5})100\\% = 1\\%$.</li><li>% error in l = $(\\frac{0.06}{6})100\\% = 1\\%$.</li><li>Total % error = $1\\% + 2(1\\%) + 1\\% = 4\\%$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 4%</div>' },
  { id: 21, difficulty: 'Hard', question: 'The potential energy U of a particle varies with distance x as $U = \\frac{A\\sqrt{x}}{x+B}$. Find the dimensional formula for $AB$.', solution: '<h4>Steps:</h4><ol><li>From the denominator, the dimension of B must be the same as x, so $[B] = [L]$.</li><li>The dimension of U is energy, $[ML^2T^{-2}]$.</li><li>Dimension of $A\\sqrt{x}$ must be $[U][x] = [ML^2T^{-2}][L] = [ML^3T^{-2}]$.</li><li>$[A][L^{1/2}] = [ML^3T^{-2}] \\implies [A] = [ML^{5/2}T^{-2}]$.</li><li>Dimensional formula for $AB$ is $[ML^{5/2}T^{-2}][L] = [ML^{7/2}T^{-2}]$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> $[ML^{7/2}T^{-2}]$</div>' },
  { id: 22, difficulty: 'Hard', question: 'The number of particles crossing a unit area perpendicular to the x-axis in unit time is given by $n = -D \\frac{n_2 - n_1}{x_2 - x_1}$, where $n_1$ and $n_2$ are number of particles per unit volume. What is the dimension of the diffusion constant D?', solution: '<h4>Steps:</h4><ol><li>Dimensions: $n$ is number per area per time, $[L^{-2}T^{-1}]$. $n_1, n_2$ are number per volume, $[L^{-3}]$. $x_1, x_2$ are positions, $[L]$.</li><li>$[L^{-2}T^{-1}] = [D] \\frac{[L^{-3}]}{[L]} = [D][L^{-4}]$.</li><li>$[D] = \\frac{[L^{-2}T^{-1}]}{[L^{-4}]} = [L^2T^{-1}]$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> $[L^2T^{-1}]$</div>' },
  { id: 23, difficulty: 'Hard', question: 'Young\'s modulus of steel is $1.9 \\times 10^{11} \\text{ N/m}^2$. Express it in dyne/cm². (1 N = $10^5$ dyne, 1 m = 100 cm)', solution: '<h4>Steps:</h4><ol><li>$1.9 \\times 10^{11} \\frac{\\text{N}}{\\text{m}^2} = 1.9 \\times 10^{11} \\frac{10^5 \\text{ dyne}}{(100 \\text{ cm})^2}$.</li><li>Calculation: $1.9 \\times 10^{11} \\frac{10^5}{10^4} = 1.9 \\times 10^{11} \\times 10 = 1.9 \\times 10^{12} \\text{ dyne/cm}^2$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> $1.9 \\times 10^{12}$ dyne/cm²</div>' },
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
