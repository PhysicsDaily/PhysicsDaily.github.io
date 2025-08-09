import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Contribute.module.css';

export default function ContributePage() {
  return (
    <div>
      <Head>
        <title>Contribute - Physics Daily</title>
        <meta name="description" content="Help improve Physics Daily by contributing content, reporting errors, or suggesting new features." />
      </Head>

      <Header />

      <header className={styles.header}>
        <div className="container">
          <h1>Contribute to Physics Daily</h1>
          <p>Join our mission to make physics education accessible to everyone.</p>
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <div className="container">
          <section className={styles.section}>
            <h2>Why Contribute?</h2>
            <p>Physics Daily is a community-driven project. Your contributions, no matter how small, help us create a more accurate, comprehensive, and engaging resource for students and enthusiasts around the world. By sharing your knowledge, you can make a real impact on someone's learning journey.</p>
          </section>

          <section className={styles.section}>
            <h2>How You Can Help</h2>
            <div className={styles.grid}>
              <div className={styles.card}>
                <h3>📝 Add or Improve Content</h3>
                <p>Find a topic you're passionate about and help us expand our notes. You can add new sections, write detailed explanations, or provide worked examples.</p>
              </div>
              <div className={styles.card}>
                <h3>🐞 Report Errors</h3>
                <p>Found a typo, a factual error, or a broken link? Let us know by opening an issue on our GitHub repository. Every correction improves the quality of the resource.</p>
              </div>
              <div className={styles.card}>
                <h3>💡 Suggest Features</h3>
                <p>Have an idea for a new interactive feature, a simulation, or a topic we should cover? We'd love to hear your suggestions to make the platform even better.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Getting Started</h2>
            <p>The easiest way to contribute is through our GitHub repository. You can submit changes via a pull request or report issues directly.</p>
            <a href="https://github.com/PhysicsDaily/PhysicsDaily.github.io" className="btn" target="_blank" rel="noopener noreferrer">
              Visit GitHub Repository
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
