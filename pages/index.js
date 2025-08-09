// pages/index.js

import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicCard from '../components/TopicCard';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/Home.module.css';

// This function runs at build time to fetch homepage data
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'homepage-topics.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const topicSections = JSON.parse(jsonData);
  return {
    props: {
      topicSections,
    },
  };
}

export default function Home({ topicSections }) {
  useScrollAnimation();

  return (
    <div>
      <Head>
        <title>Physics Daily - Comprehensive Physics Learning Platform</title>
        <meta name="description" content="Master physics concepts from fundamentals to advanced topics with comprehensive notes, examples, and interactive content." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <div className={styles.hero}>
          <div className="container">
            <h1 className={styles.heroTitle}>Physics Daily</h1>
            <p className={styles.heroSubtitle}>Advanced Physics Learning Platform</p>
            <p className={styles.heroDescription}>
              Master physics concepts with comprehensive notes, examples, and interactive content.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/mechanics/measurements" passHref>
                <a className="btn">📚 Start Learning</a>
              </Link>
              <a href="https://github.com/PhysicsDaily/PhysicsDaily.github.io" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
        </div>

        <div className={`${styles.mainContent} container`}>
          <section className={`${styles.statsSection} fade-in`}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}><span className={styles.statNumber}>52</span><span className={styles.statLabel}>Chapters</span></div>
              <div className={styles.statItem}><span className={styles.statNumber}>5</span><span className={styles.statLabel}>Major Areas</span></div>
              <div className={styles.statItem}><span className={styles.statNumber}>∞</span><span className={styles.statLabel}>Learning Opportunities</span></div>
              <div className={styles.statItem}><span className={styles.statNumber}>100%</span><span className={styles.statLabel}>Free Access</span></div>
            </div>
          </section>

          {topicSections.map((section) => (
            <section key={section.id} id={section.id} className={`${styles.topicSection} fade-in`}>
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
