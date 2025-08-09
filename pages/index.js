// pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicCard from '../components/TopicCard';
import styles from '../styles/Home.module.css';

// This function runs at build time to fetch homepage data from the JSON file
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'homepage-data.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(jsonData);
  return {
    props: {
      topicSections: data.topicSections,
      features: data.features,
    },
  };
}

export default function Home({ topicSections, features }) {
  return (
    <div>
      <Head>
        <title>Physics Daily - Comprehensive Physics Learning Platform</title>
        <meta name="description" content="Master physics concepts from fundamentals to advanced topics with comprehensive notes, examples, and interactive content." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <div className={styles.pageHeader}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Physics Daily</h1>
              <p className={styles.heroSubtitle}>Advanced Physics Learning Platform</p>
              <p className={styles.heroDescription}>
                Master physics concepts with comprehensive notes, examples, and interactive content. 
                From classical mechanics to modern physics, build a solid foundation with our structured curriculum.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="#foundations" className="btn">
                  🚀 Start Learning
                </Link>
                <a href="https://github.com/PhysicsDaily/PhysicsDaily.github.io" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                  ⭐ Star on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <section className={styles.statsSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Complete Physics Education</h2>
            <p className={styles.sectionSubtitle}>Comprehensive coverage with modern, interactive learning tools</p>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>52</span>
                <span className={styles.statLabel}>Chapters</span>
                <span className={styles.statDetail}>Complete curriculum</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>5</span>
                <span className={styles.statLabel}>Major Areas</span>
                <span className={styles.statDetail}>From classical to modern</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>∞</span>
                <span className={styles.statLabel}>Learning Opportunities</span>
                <span className={styles.statDetail}>Unlimited practice</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Free Access</span>
                <span className={styles.statDetail}>Always free</span>
              </div>
            </div>
          </div>
        </section>

        <div className={`${styles.mainContent} container`}>
          {topicSections.map((section, index) => (
            <section key={section.id} id={section.id} className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionMeta}>
                  <span className={styles.sectionIcon}>{section.icon}</span>
                </div>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <p className={styles.sectionSubtitle}>{section.subtitle}</p>
                <div className={styles.progressIndicator}>
                  <span className={styles.stepNumber}>Step {index + 1} of {topicSections.length}</span>
                </div>
              </div>
              <div className={styles.topicGrid}>
                {section.cards.map((card) => (
                  <TopicCard key={card.title} cardData={card} type={section.card_type || section.id} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className={styles.featuresSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Why Choose Physics Daily?</h2>
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureCard}>
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
