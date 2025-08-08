// pages/index.js

import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicCard from '../components/TopicCard'; // We will create this component soon
import styles from '../styles/Home.module.css';

// Data for all the topic sections on the homepage.
// This makes the page easier to manage.
const topicSections = [
  {
    id: 'mechanics',
    title: 'Classical Mechanics',
    subtitle: 'Foundations of physics: measurement, kinematics, dynamics, energy, momentum, and rotational motion',
    cards: [
      {
        chapters: '1-7',
        title: 'Foundations & Kinematics',
        description: "Measurement, motion in 1D/2D/3D, Newton's laws, applications, momentum, and particle systems",
        topics: ['Measurement', '1D Motion', "Newton's Laws", '2D & 3D Motion', 'Momentum'],
        href: '/mechanics/foundations',
      },
      // ... more cards for mechanics would go here
    ],
  },
  // ... more sections like Thermodynamics, E&M, etc. would go here
];

export default function Home() {
  return (
    <div>
      <Head>
        <title>Physics Daily - Comprehensive Physics Learning Platform</title>
        <meta name="description" content="Master physics concepts from fundamentals to advanced topics with comprehensive notes, examples, and interactive content." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        {/* This replaces the main <header> section from your old index.html */}
        <div className={styles.pageHeader}>
          <div className="container">
            <h1>Physics Daily</h1>
            <p className={styles.subtitle}>Advanced Physics Learning Platform</p>
            <p className={styles.description}>
              Master physics concepts with comprehensive notes, examples, and interactive content.
            </p>
            <div className={styles.ctaButtons}>
              <a href="#foundations" className="btn">
                📚 Start Learning
              </a>
              <a href="https://github.com/PhysicsDaily/PhysicsDaily.github.io" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* This replaces the hero-section from your old index.html */}
        <section className={styles.heroSection}>
          <div className="container">
            <h2>Complete Physics Education</h2>
            <p>Comprehensive coverage of major physics topics with modern, interactive learning tools.</p>
          </div>
        </section>

        <div className={`${styles.mainContent} container`}>
          {/* This replaces the stats-section from your old index.html */}
          <section className={styles.statsSection}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>52</span>
                <span className={styles.statLabel}>Chapters</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>5</span>
                <span className={styles.statLabel}>Major Areas</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>∞</span>
                <span className={styles.statLabel}>Learning Opportunities</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Free Access</span>
              </div>
            </div>
          </section>

          {/* Dynamically render each topic section and its cards */}
          {topicSections.map((section) => (
            <section key={section.id} id="foundations" className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <p className={styles.sectionSubtitle}>{section.subtitle}</p>
              </div>
              <div className={styles.topicGrid}>
                {section.cards.map((card) => (
                  <TopicCard key={card.title} cardData={card} type={section.id} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
