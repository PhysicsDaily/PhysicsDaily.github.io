// pages/mechanics/measurements/numerical.js
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from '../../../styles/ContentPage.module.css';

const problems = [
  { id: 1, difficulty: 'Easy', question: 'A student measures the sides of a rectangular block as l = 15.12 cm, w = 3.45 cm, and h = 1.78 cm. Calculate the volume with the correct number of significant figures.', solution: `<h4>Steps:</h4><ol><li>Count significant figures: l (4), w (3), h (3). The result must have 3.</li><li>Calculate: V = 15.12 × 3.45 × 1.78 = 92.78592 cm³</li><li>Round: Rounding to 3 significant figures gives 92.8.</li></ol><div class="${styles.finalAnswer}"><strong>Final Answer:</strong> 92.8 cm³</div>` },
  { id: 2, difficulty: 'Easy', question: 'The speed of light is 3.00 × 10⁸ m/s. Convert this to kilometers per hour (km/h).', solution: `<h4>Steps:</h4><ol><li>Conversion factors: 1 km = 1000 m, 1 hour = 3600 s.</li><li>Calculation: (3.00 × 10⁸ m/s) × (1 km / 1000 m) × (3600 s / 1 hour) = 1.08 × 10⁹ km/h.</li></ol><div class="${styles.finalAnswer}"><strong>Final Answer:</strong> 1.08 × 10⁹ km/h</div>` },
  { id: 3, difficulty: 'Medium', question: 'The period of a spring-mass system is T = 2π√(m/k). Check if this is dimensionally correct. (Dimension of k is [MT⁻²])', solution: `<h4>Steps:</h4><ol><li>LHS dimension: [T].</li><li>RHS dimension: √([M] / [MT⁻²]) = √([T²]) = [T].</li><li>Conclusion: The dimensions match, so the formula is correct.</li></ol><div class="${styles.finalAnswer}"><strong>Conclusion:</strong> The formula is dimensionally correct.</div>` },
  { id: 4, difficulty: 'Hard', question: 'A quantity P = a³b² / (√c d). The percentage errors in a, b, c, and d are 1%, 3%, 4%, and 2% respectively. Find the percentage error in P.', solution: `<h4>Steps:</h4><ol><li>Error formula: ΔP/P = 3(Δa/a) + 2(Δb/b) + (1/2)(Δc/c) + (Δd/d).</li><li>Add percentage errors: % Error = 3(1%) + 2(3%) + (1/2)(4%) + 1(2%) = 3% + 6% + 2% + 2%.</li></ol><div class="${styles.finalAnswer}"><strong>Final Answer:</strong> 13%</div>` },
];

export default function NumericalPage() { /* ... same component code as before ... */ }
