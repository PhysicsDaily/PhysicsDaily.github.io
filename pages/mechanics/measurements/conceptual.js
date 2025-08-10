import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import useMathJax from '../../../hooks/useMathJax';
import styles from '../../../styles/ContentPage.module.css';

const questions = [
  // Easy Questions (1-8)
  { id: 1, difficulty: 'Easy', question: 'Can an equation be dimensionally correct but still be physically wrong? Provide an example.', answer: `<p>Yes. For kinetic energy, both $K = mv^2$ and $K = \frac{1}{2}mv^2$ are dimensionally correct (both are $[ML^2T^{-2}]$). However, only the second formula is physically correct. Dimensional consistency is a necessary, but not sufficient, condition for an equation to be correct.</p>` },
  { id: 2, difficulty: 'Easy', question: 'What is the fundamental principle of homogeneity of dimensions?', answer: '<p>The principle of homogeneity of dimensions states that an equation is dimensionally correct if the dimensions of all the terms on both sides of the equation are the same. This means you can only add or subtract quantities that have the same dimensions.</p>' },
  { id: 3, difficulty: 'Easy', question: 'Why are units important in physics?', answer: '<p>Units provide a standard for measuring physical quantities. Without units, a numerical value is meaningless. They allow scientists to communicate results consistently and ensure that calculations are based on a common reference frame.</p>' },
  { id: 4, difficulty: 'Easy', question: 'What is a systematic error? Give an example.', answer: '<p>A systematic error is an error that is consistent and repeatable, usually due to a flaw in the experimental apparatus or design. For example, a weighing scale that is not zeroed correctly will consistently give readings that are off by a fixed amount.</p>' },
  { id: 5, difficulty: 'Easy', question: 'What is a random error? Give an example.', answer: '<p>A random error is an unpredictable variation in measurements. These errors are caused by unknown and unpredictable changes in the experiment. An example is the fluctuation in readings when measuring the length of an object due to slight variations in how the observer reads the scale.</p>' },
  { id: 6, difficulty: 'Easy', question: 'How many significant figures are in the number 0.05020?', answer: '<p>There are 4 significant figures. The non-zero digits (5, 0, 2) are significant, and the trailing zero after the decimal point is also significant. The leading zeros are not significant.</p>' },
  { id: 7, difficulty: 'Easy', question: 'What is the difference between a fundamental unit and a derived unit?', answer: '<p>A fundamental unit is a unit for a base quantity that is defined independently (e.g., meter, kilogram, second). A derived unit is a unit that is formed by a combination of fundamental units (e.g., meter/second for speed, Newton for force).</p>' },
  { id: 8, difficulty: 'Easy', question: 'Can a dimensionless quantity have a unit?', answer: '<p>Yes. A classic example is the radian, which is a unit for an angle. An angle is defined as the ratio of arc length to radius ($s/r$), so its dimension is $[L]/[L] = 1$ (dimensionless). However, it has a unit, the radian.</p>' },
  
  // Medium Questions (9-16)
  { id: 9, difficulty: 'Medium', question: 'Explain the difference between accuracy and precision in measurement.', answer: `<p><strong>Accuracy</strong> refers to how close measurements are to the true value. <strong>Precision</strong> refers to how close repeated measurements are to each other. You can be precise but not accurate if all your measurements are tightly clustered in the wrong place.</p>` },
  { id: 10, difficulty: 'Medium', question: 'The velocity $v$ of a particle depends on time $t$ as $v = At^2 + Bt + C$. What are the dimensions of A, B, and C?', answer: '<p>According to the principle of homogeneity, each term must have the dimension of velocity, $[LT^{-1}]$.<br>For $At^2$: $[A][T^2] = [LT^{-1}] \implies [A] = [LT^{-3}]$.<br>For $Bt$: $[B][T] = [LT^{-1}] \implies [B] = [LT^{-2}]$.<br>For $C$: $[C] = [LT^{-1}]$.</p>' },
  { id: 11, difficulty: 'Medium', question: 'If the unit of force is 100 N, the unit of length is 10 m, and the unit of time is 100 s, what is the unit of mass in this system?', answer: '<p>We know Force = Mass × Acceleration, so Mass = Force / Acceleration. Dimensions are $[M] = [F] / [LT^{-2}] = [F][L^{-1}][T^2]$.<br>Unit of Mass = (100 N) / (10 m / (100 s)^2) = (100) / (10 / 10000) = 100 / (0.001) = 100,000 kg or $10^5$ kg.</p>' },
  { id: 12, difficulty: 'Medium', question: 'Explain how parallax is used to measure the distance of nearby stars.', answer: '<p>The parallax method involves observing a star from two different positions of the Earth in its orbit around the Sun (e.g., 6 months apart). The apparent shift in the star\'s position against the background of distant stars is measured. This shift, called the parallax angle, along with the known diameter of Earth\'s orbit, forms a triangle. Using trigonometry, the distance to the star can be calculated as $d = b / \theta$, where $b$ is the baseline (diameter of Earth\'s orbit) and $\theta$ is the parallax angle.</p>' },
  { id: 13, difficulty: 'Medium', question: 'A physical quantity is given by $X = [M^a L^b T^c]$. The percentage error in measurement of M, L and T are $\alpha\%$, $\beta\%$ and $\gamma\%$ respectively. What is the maximum percentage error in X?', answer: '<p>The maximum relative error in X is given by the sum of the relative errors in the base quantities, multiplied by the magnitude of their exponents. So, $\frac{\Delta X}{X} = |a|\frac{\Delta M}{M} + |b|\frac{\Delta L}{L} + |c|\frac{\Delta T}{T}$. The maximum percentage error is $(|a|\alpha + |b|\beta + |c|\gamma)\%$.</p>' },
  { id: 14, difficulty: 'Medium', question: 'What is the least count of an instrument? How does it affect the precision of a measurement?', answer: '<p>The least count of a measuring instrument is the smallest value that can be measured by the instrument accurately. It is directly related to the precision of the measurements. A smaller least count implies a more precise instrument, as it can resolve smaller differences in the measured quantity.</p>' },
  { id: 15, difficulty: 'Medium', question: 'In the equation $(P + a/V^2)(V - b) = RT$, where P is pressure and V is volume, what are the dimensions of $a$ and $b$?', answer: '<p>According to the principle of homogeneity, quantities can only be added or subtracted if they have the same dimensions. Therefore, the dimension of $b$ must be the same as the dimension of volume, $[L^3]$. Similarly, the dimension of $a/V^2$ must be the same as the dimension of pressure, $[ML^{-1}T^{-2}]$. So, $[a]/[L^6] = [ML^{-1}T^{-2}]$, which gives $[a] = [ML^5T^{-2}]$.</p>' },
  { id: 16, difficulty: 'Medium', question: 'Why is it not possible to add a velocity to a displacement?', answer: '<p>It is not possible because of the principle of homogeneity of dimensions. Velocity has dimensions of $[LT^{-1}]$, while displacement has dimensions of $[L]$. Since their dimensions are different, they represent different physical quantities and cannot be added together in a physically meaningful equation.</p>' },
  
  // Hard Questions (17-23)
  { id: 17, difficulty: 'Hard', question: 'Why must arguments of transcendental functions like $\sin(x)$, $\cos(x)$, or $e^x$ be dimensionless?', answer: `<p>These functions are defined by their infinite series expansions. For example, $e^x = 1 + x + x^2/2! + ...$. For this sum to be valid, every term must have the same dimension. If $x$ had a dimension (e.g., length $[L]$), the terms would have dimensions of $[1]$, $[L]$, $[L^2]$, etc., which cannot be added together. Therefore, the argument $x$ must be dimensionless.</p>` },
  { id: 18, difficulty: 'Hard', question: 'The frequency $f$ of a vibrating string depends on the length $l$, tension $T$ and linear mass density $\mu$. Derive the formula for $f$ using dimensional analysis.', answer: '<p>Let $f = k \cdot l^a T^b \mu^c$. Dimensions: $f=[T^{-1}]$, $l=[L]$, Tension $T=[MLT^{-2}]$, $\mu=[ML^{-1}]$.<br>$[T^{-1}] = [L]^a [MLT^{-2}]^b [ML^{-1}]^c = [M^{b+c} L^{a+b-c} T^{-2b}]$.<br>Equating powers:<br>For M: $b+c=0 \implies b=-c$.<br>For T: $-1=-2b \implies b=1/2$. So $c=-1/2$.<br>For L: $a+b-c=0 \implies a + 1/2 - (-1/2) = 0 \implies a = -1$.<br>So, $f = k \cdot l^{-1} T^{1/2} \mu^{-1/2} = \frac{k}{l}\sqrt{\frac{T}{\mu}}$.</p>' },
  { id: 19, difficulty: 'Hard', question: 'A planet moves around the sun in a circular orbit of radius $r$. The time period $T$ depends on the radius $r$, the mass of the sun $M$, and the gravitational constant $G$. Show dimensionally that $T^2 \propto r^3$.', answer: '<p>Let $T = k \cdot r^a M^b G^c$. Dimensions: $T=[T]$, $r=[L]$, $M=[M]$, $G=[M^{-1}L^3T^{-2}]$.<br>$[T] = [L]^a [M]^b [M^{-1}L^3T^{-2}]^c = [M^{b-c} L^{a+3c} T^{-2c}]$.<br>Equating powers:<br>For T: $1=-2c \implies c=-1/2$.<br>For M: $b-c=0 \implies b=c=-1/2$.<br>For L: $a+3c=0 \implies a=-3c = -3(-1/2) = 3/2$.<br>So, $T = k \cdot r^{3/2} M^{-1/2} G^{-1/2}$. Squaring both sides gives $T^2 = k^2 \frac{r^3}{MG}$, which shows $T^2 \propto r^3$.</p>' },
  { id: 20, difficulty: 'Hard', question: 'What are the limitations of dimensional analysis?', answer: '<p>Dimensional analysis has several limitations: 1. It cannot determine the value of dimensionless constants (like $k$ in an equation). 2. It cannot be used to derive relationships involving trigonometric, logarithmic, or exponential functions. 3. It fails if a physical quantity depends on more than three fundamental quantities. 4. It does not indicate whether a quantity is a scalar or a vector.</p>' },
  { id: 21, difficulty: 'Hard', question: 'Explain the concept of the "method of least squares" for error reduction.', answer: '<p>The method of least squares is a statistical procedure to find the best-fit line for a set of data points by minimizing the sum of the squares of the offsets (residuals) of the points from the curve. By finding the line that is "closest" to all data points simultaneously, it reduces the effect of random errors and provides the most probable values for the coefficients of the function.</p>' },
  { id: 22, difficulty: 'Hard', question: 'The refractive index $\mu$ of a material is found to have values 1.54, 1.53, 1.56, 1.54, 1.55. Calculate the mean absolute error, relative error, and percentage error.', answer: '<p>1. Mean value: $\bar{\mu} = (1.54+1.53+1.56+1.54+1.55)/5 = 1.544$.<br>2. Absolute errors: 0.004, 0.014, 0.016, 0.004, 0.006.<br>3. Mean absolute error: $\Delta\bar{\mu} = (0.004+0.014+0.016+0.004+0.006)/5 = 0.0088 \approx 0.01$.<br>4. Relative error: $\Delta\bar{\mu} / \bar{\mu} = 0.01 / 1.544 \approx 0.0065$.<br>5. Percentage error: $0.0065 \times 100\% = 0.65\%$.</p>' },
  { id: 23, difficulty: 'Hard', question: 'If all measurements in an experiment are made with high precision, can the result still be inaccurate? Explain with an example.', answer: '<p>Yes. High precision means that repeated measurements are very close to each other, but it does not guarantee they are close to the true value. This situation arises when there is a significant systematic error. For example, if you use a miscalibrated thermometer that consistently reads 2°C higher than the actual temperature, your measurements might be very precise (e.g., 27.1, 27.0, 27.1 °C), but they are all inaccurate because the true temperature is around 25°C.</p>' },
];


// It's safe to use useMathJax([questions]) here, but since questions never change, useMathJax([]) is also fine.
export default function ConceptualPage() {
  useMathJax([]);

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
        <title>Conceptual Questions: Measurement - Physics Daily</title>
        <meta name="description" content="Test your conceptual understanding of measurement, units, and dimensional analysis." />
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
            <span className="current">🤔 Conceptual Questions</span>
          </nav>
        </div>
      </div>

      <header className={styles.pageHeader}>
        <div className="container">
          <h1>Conceptual Questions</h1>
          <p className={styles.subtitle}>Chapter 1: Measurement</p>
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <div className="container">
          <div className={styles.section}>
            {questions.map(q => (
              <div key={q.id} className={styles.problem}>
                <div className={styles.problemHeader}>
                  <span className={styles.problemNumber}>Question {q.id}</span>
                  <span className={`${styles.difficulty} ${getDifficultyClass(q.difficulty)}`}>{q.difficulty}</span>
                </div>
                <div className={styles.problemContent} dangerouslySetInnerHTML={{ __html: q.question }} />
                <details>
                  <summary>View Answer</summary>
                  <div className={styles.solution} dangerouslySetInnerHTML={{ __html: q.answer }} />
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
