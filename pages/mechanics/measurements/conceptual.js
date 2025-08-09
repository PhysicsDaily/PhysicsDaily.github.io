// pages/mechanics/measurements/conceptual.js
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from '../../../styles/ContentPage.module.css';

const questions = [
  { id: 1, difficulty: 'Easy', question: 'What are the key characteristics that make a physical standard suitable for scientific measurement?', answer: `<p>A good physical standard must be: <strong>Accessible</strong> (reproducible worldwide), <strong>Invariable</strong> (unchanging over time), <strong>Precise</strong>, and <strong>Reproducible</strong>. These are essential because science relies on verifying results.</p>` },
  { id: 2, difficulty: 'Easy', question: 'Why did the SI system transition from physical artifacts to fundamental constants in 2019?', answer: `<p>The transition provides <strong>Universal accessibility</strong> (no need to compare with a physical object), <strong>Ultimate stability</strong> (constants don't change), and <strong>Improved precision</strong> for future technologies.</p>` },
  { id: 3, difficulty: 'Medium', question: 'Explain why dimensional analysis can determine the functional form of relationships but not numerical constants.', answer: `<p>Dimensional analysis works by ensuring dimensional consistency, which constrains the powers of variables but not dimensionless constants. For a pendulum, it correctly finds that T ∝ √(l/g), but it cannot determine the constant of proportionality, which is 2π.</p>` },
  { id: 4, difficulty: 'Medium', question: 'Can an equation be dimensionally correct but still be physically wrong? Provide an example.', answer: `<p>Yes. For kinetic energy, both K = mv² and K = ½mv² are dimensionally correct ([ML²T⁻²]). However, only the second formula is physically correct. Dimensional analysis can't find the error because the missing factor (1/2) is dimensionless.</p>` },
  { id: 5, difficulty: 'Hard', question: 'Why must arguments of transcendental functions (like sin, cos, ln, exp) be dimensionless?', answer: `<p>These functions are defined by infinite series (e.g., eˣ = 1 + x + x²/2! + ...). For the sum to be valid, every term must have the same dimension. If x had a dimension [L], the terms would have dimensions [1], [L], [L²], etc., which cannot be added. Therefore, x must be dimensionless.</p>` },
];

export default function ConceptualPage() { /* ... same component code as before ... */ }
