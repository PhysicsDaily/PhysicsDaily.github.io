// pages/about.js

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/About.module.css'; // Import the new CSS module

export default function AboutPage() {
  return (
    <div>
      <Head>
        <title>About - Physics Daily</title>
        <meta name="description" content="About Physics Daily and its creator." />
      </Head>

      <Header />

      {/* This is the page-specific header, different from the main site header component */}
      <header className={styles.header}>
        <div className="container">
          <h1>About Physics Daily</h1>
          <p>The story and the person behind the project.</p>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={`container ${styles.aboutSection}`}>
          {/* Using a placeholder as in the original HTML. Replace the 'src' with your actual image path in the /public folder */}
          <Image 
            src="/images/profile-placeholder.png" // Example path: /public/images/profile-placeholder.png
            alt="Anjit Kandel"
            width={150}
            height={150}
            className={styles.profileImage}
          />
          <h2>Anjit Kandel</h2>
          <h3>Creator of Physics Daily</h3>
          <p>
            Physics Daily was created out of a passion for making physics accessible and understandable to everyone. My goal is to provide a comprehensive, well-structured learning platform for students, educators, and enthusiasts alike. Physics is the language of the universe, and I believe everyone deserves the opportunity to learn it in a clear and engaging way. This project is a labor of love, built with the hope of inspiring the next generation of scientists and problem-solvers.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
