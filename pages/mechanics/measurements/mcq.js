// pages/mechanics/measurements/mcq.js

import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Quiz from '../../../components/Quiz';
import styles from '../../../styles/ContentPage.module.css';

// Full list of 35 questions for the quiz
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
    { question: "10. The meter is currently defined as:", options: ["1/40,000,000 of the Earth's circumference", "The length of a specific platinum-iridium bar", "The distance light travels in vacuum in 1/299,792,458 of a second", "1,650,763.73 wavelengths of krypton-86 radiation"], answer: "The distance light travels in vacuum in 1/299,792,458 of a second", solution: "This definition links the meter to the speed of light, a fundamental constant, and the second." },
    { question: "11. Which represents the largest number of significant figures?", options: ["0.00456", "4.560", "456", "4.56 × 10²"], answer: "4.560", solution: "0.00456 has 3 sig figs. 4.560 has 4 sig figs (trailing zero after decimal is significant). 456 has 3 sig figs. 4.56 × 10² has 3 sig figs." },
    { question: "12. The main advantage of the 2019 SI redefinition is:", options: ["Easier calculations", "Universal reproducibility without physical artifacts", "Simpler unit conversions", "Lower cost of standards"], answer: "Universal reproducibility without physical artifacts", solution: "Basing units on fundamental constants allows any lab with the right equipment to reproduce them, removing reliance on a single physical object." },
    { question: "13. In uncertainty propagation, when adding two independent measurements A ± δA and B ± δB, the uncertainty in the sum is:", options: ["δA + δB", "√(δA² + δB²)", "|δA - δB|", "δA × δB"], answer: "√(δA² + δB²)", solution: "For addition or subtraction of independent quantities, their absolute uncertainties are added in quadrature (the square root of the sum of the squares)." },
    { question: "14. Which is a vector quantity?", options: ["Speed", "Distance", "Displacement", "Mass"], answer: "Displacement", solution: "Displacement has both magnitude and direction (e.g., 5 meters North), while speed, distance, and mass are scalars." },
    { question: "15. The sum 12.345 + 1.2 + 0.07 should be reported as:", options: ["13.615", "13.62", "13.6", "14"], answer: "13.6", solution: "In addition/subtraction, the result is rounded to the last decimal place of the least precise number, which is 1.2 (one decimal place)." },
    { question: "16. Arguments of transcendental functions (e.g., sin, log) must be dimensionless because:", options: ["It's a mathematical convention", "Their Taylor series expansions would be dimensionally inconsistent", "They can only be calculated with calculators", "It simplifies the math"], answer: "Their Taylor series expansions would be dimensionally inconsistent", solution: "The series expansion (e.g., sin(x) = x - x³/3! +...) requires adding terms of different powers. This is only dimensionally consistent if x is dimensionless." },
    { question: "17. Which of the following is NOT a fundamental SI unit?", options: ["Kelvin", "Candela", "Coulomb", "Mole"], answer: "Coulomb", solution: "The fundamental unit of electric current is the Ampere (A). The Coulomb (C) is a derived unit of charge (1 C = 1 A⋅s)." },
    { question: "18. The dimensional formula for gravitational constant G from F = Gm₁m₂/r² is:", options: ["[M⁻¹L³T⁻²]", "[MLT⁻²]", "[M⁻¹L²T⁻¹]", "[ML³T⁻²]"], answer: "[M⁻¹L³T⁻²]", solution: "[G] = [Fr²]/[m₁m₂] = [MLT⁻²][L²]/[M²] = [M⁻¹L³T⁻²]." },
    { question: "19. If force [F], length [L], and time [T] are chosen as fundamental quantities, the dimensions of mass would be:", options: ["[FL⁻¹T²]", "[FLT⁻²]", "[FL⁻¹T⁻²]", "[FLT²]"], answer: "[FL⁻¹T²]", solution: "From F=ma, we have [M] = [F]/[a] = [F]/[LT⁻²] = [FL⁻¹T²]." },
    { question: "20. Which is NOT a characteristic of a good physical standard?", options: ["Accessibility", "Invariability", "Uniqueness (exists in only one place)", "Reproducibility"], answer: "Uniqueness (exists in only one place)", solution: "A good standard should be accessible and reproducible anywhere, not unique to a single location." },
    { question: "21. The product 3.14159 × 2.0 should be reported as:", options: ["6.28318", "6.2832", "6.28", "6.3"], answer: "6.3", solution: "The result of multiplication must be rounded to the number of significant figures in the least precise measurement. 2.0 has two significant figures." },
    { question: "22. Which quantity has dimensions of energy?", options: ["Force × Distance", "Mass × Velocity", "Mass × Acceleration", "Force / Area"], answer: "Force × Distance", solution: "Work (Energy) = Force × Distance. Its dimensions are [MLT⁻²] × [L] = [ML²T⁻²]." },
    { question: "23. Order of magnitude of the number of seconds in a year is:", options: ["10⁵", "10⁶", "10⁷", "10⁸"], answer: "10⁷", solution: "1 year ≈ 365 days × 24 hr/day × 3600 s/hr ≈ 3.15 × 10⁷ seconds. The order of magnitude is 10⁷." },
    { question: "24. The prefix 'pico' stands for:", options: ["10⁻⁹", "10⁻¹²", "10⁻¹⁵", "10⁻⁶"], answer: "10⁻¹²", solution: "Pico (p) is the SI prefix for a factor of 10⁻¹²." },
    { question: "25. A measurement that is very close to the true value is said to be:", options: ["Precise", "Accurate", "Significant", "Consistent"], answer: "Accurate", solution: "Accuracy refers to the closeness of a measured value to a standard or known value. Precision refers to the closeness of two or more measurements to each other." },
    { question: "26. The dimensional formula for Planck's constant (h) from E=hν is the same as that for:", options: ["Energy", "Momentum", "Angular Momentum", "Power"], answer: "Angular Momentum", solution: "[h] = [E]/[ν] = [ML²T⁻²]/[T⁻¹] = [ML²T⁻¹]. This is the same dimension as angular momentum." },
    { question: "27. Which error is reduced by taking multiple measurements and averaging?", options: ["Systematic error", "Random error", "Both systematic and random errors", "Neither systematic nor random errors"], answer: "Random error", solution: "Random errors cause unpredictable fluctuations. Averaging multiple readings tends to cancel out these fluctuations, improving precision." },
    { question: "28. The number of significant figures in 1.20 × 10³ is:", options: ["2", "3", "4", "Ambiguous"], answer: "3", solution: "In scientific notation, all digits in the coefficient (1.20) are significant. The trailing zero is significant." },
    { question: "29. Which of the following is dimensionless?", options: ["Angle (in radians)", "Solid Angle (in steradians)", "Refractive Index", "All of the above"], answer: "All of the above", solution: "Angle (arc length/radius), solid angle (area/radius²), and refractive index (speed of light in vacuum / speed in medium) are all ratios of similar quantities, making them dimensionless." },
    { question: "30. What is the SI unit of electric charge?", options: ["Ampere", "Volt", "Ohm", "Coulomb"], answer: "Coulomb", solution: "The Coulomb (C) is the SI derived unit of electric charge." },
    { question: "31. The dimensional formula for power (Energy/time) is:", options: ["[MLT⁻²]", "[ML²T⁻²]", "[ML²T⁻³]", "[MLT⁻¹]"], answer: "[ML²T⁻³]", solution: "Power = Energy / Time. Dimensions are [ML²T⁻²] / [T] = [ML²T⁻³]." },
    { question: "32. Which of these is a derived unit?", options: ["Second", "Meter", "Kilogram", "Watt"], answer: "Watt", solution: "Watt (for power) is a derived unit (Joule/second). Second, Meter, and Kilogram are fundamental SI units." },
    { question: "33. When multiplying 12.3 by 1.23, the result should have how many significant figures?", options: ["2", "3", "4", "5"], answer: "3", solution: "Both numbers have three significant figures, so the result should be rounded to three significant figures." },
    { question: "34. The prefix 'femto' stands for:", options: ["10⁻⁹", "10⁻¹²", "10⁻¹⁵", "10⁻¹⁸"], answer: "10⁻¹⁵", solution: "Femto (f) is the SI prefix for a factor of 10⁻¹⁵." },
    { question: "35. A furlong is 220 yards, and a fortnight is 2 weeks. If a snail moves at 2.5 mm/s, its speed in furlongs per fortnight is approximately:", options: ["15", "1.5 × 10³", "1.5 × 10⁵", "1.5 × 10⁷"], answer: "1.5 × 10³", solution: "This is a unit conversion problem. 2.5 mm/s ≈ 1.5 × 10³ furlongs/fortnight. The key is careful conversion of length (mm to furlongs) and time (seconds to fortnights)." }
]; // This closing bracket was missing

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
          <Quiz quizData={quizQuestions} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
