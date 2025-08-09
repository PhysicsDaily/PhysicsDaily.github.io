// pages/index.js

import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicCard from '../components/TopicCard';
// import useScrollAnimation from '../hooks/useScrollAnimation'; // Animation hook removed for stability
import styles from '../styles/Home.module.css';

// Data for all the topic sections on the homepage.
const topicSections = [
    {
        id: 'foundations', // Changed ID to 'foundations' to match the "Start Learning" button link
        card_type: 'mechanics', // Added a separate key for styling to preserve the card's look
        title: 'Classical Mechanics',
        subtitle: 'Foundations of physics: measurement, kinematics, dynamics, energy, momentum, and rotational motion',
        cards: [
          { chapters: '1-7', title: 'Foundations & Kinematics', description: "Measurement, motion in 1D/2D/3D, Newton's laws, applications, momentum, and particle systems.", topics: ['Measurement', '1D Motion', 'Force & Newton\'s Laws', '2D & 3D Motion', 'Applications of Newton\'s Laws', 'Momentum', 'Systems of Particles'], href: '/mechanics/foundations' },
          { chapters: '8-10', title: 'Rotational Motion', description: "Rotational kinematics, dynamics, moment of inertia, torque, and angular momentum conservation.", topics: ['Rotational Kinematics', 'Rotational Dynamics', 'Angular Momentum'], href: '/mechanics/rotation' },
          { chapters: '11-14', title: 'Energy & Gravitation', description: "Work-energy theorem, potential energy, conservation of energy, and universal gravitation.", topics: ['Work & Kinetic Energy', 'Potential Energy', 'Energy Conservation', 'Gravitation'], href: '/mechanics/energy' },
        ],
    },
    {
        id: 'thermodynamics',
        title: 'Fluids, Waves & Thermodynamics',
        subtitle: 'Fluid mechanics, oscillations, wave motion, sound, special relativity, and thermal physics',
        cards: [
            { chapters: '15-17', title: 'Fluid Mechanics & Oscillations', description: "Fluid statics and dynamics, Bernoulli's equation, simple harmonic motion, and oscillating systems.", topics: ['Fluid Statics', 'Fluid Dynamics', 'Oscillations'], href: '/fluids/mechanics' },
            { chapters: '18-20', title: 'Waves & Special Relativity', description: "Wave motion, sound waves, Doppler effect, and Einstein's special theory of relativity.", topics: ['Wave Motion', 'Sound Waves', 'Special Relativity'], href: '/waves/motion-sound' },
            { chapters: '21-24', title: 'Thermodynamics', description: "Temperature, molecular properties of gases, first and second laws of thermodynamics, and entropy.", topics: ['Temperature', 'Molecular Properties', 'First Law', 'Second Law & Entropy'], href: '/thermodynamics/thermal' },
        ],
    },
    {
        id: 'electromagnetism',
        title: 'Electricity & Magnetism',
        subtitle: 'Electric fields, potential, capacitors, current, magnetic fields, induction, and AC circuits',
        cards: [
            { chapters: '25-30', title: 'Electrostatics', description: "Electric charge, electric field, Gauss's law, electric potential, capacitors, and dielectrics.", topics: ['Electric Charge', 'Electric Field', 'Gauss\'s Law', 'Electric Potential', 'Potential Energy', 'Capacitors'], href: '/electromagnetism/electrostatics' },
            { chapters: '31-36', title: 'Current & Magnetism', description: "DC circuits, magnetic fields of currents, magnetic forces, electromagnetic induction, and inductance.", topics: ['DC Circuits', 'Magnetic Field', 'Field of Current', 'Faraday\'s Law', 'Magnetic Properties', 'Inductance'], href: '/electromagnetism/current-magnetism' },
            { chapters: '37-39', title: 'AC Circuits & Light', description: "Alternating current circuits, Maxwell's equations, electromagnetic waves, and the nature of light.", topics: ['AC Circuits', 'Maxwell\'s Equations', 'Light Waves'], href: '/electromagnetism/ac-maxwell' },
        ],
    },
    {
        id: 'optics',
        title: 'Optics',
        subtitle: 'Geometric optics, wave optics, interference, diffraction, and polarization',
        cards: [
            { chapters: '40-42', title: 'Geometric Optics', description: "Mirrors, lenses, optical instruments, interference phenomena, and diffraction patterns.", topics: ['Mirrors & Lenses', 'Interference', 'Diffraction'], href: '/optics/geometric' },
            { chapters: '43-45', title: 'Wave Properties of Light', description: "Gratings, spectra, polarization, thermal radiation, photoelectric effect, and photon interactions.", topics: ['Gratings & Spectra', 'Polarization', 'Nature of Light'], href: '/optics/wave-properties' },
        ],
    },
    {
        id: 'modern',
        title: 'Modern Physics',
        subtitle: 'Quantum mechanics, atomic physics, nuclear physics, and elementary particles',
        cards: [
            { chapters: '46-49', title: 'Quantum & Atomic Physics', description: "Matter waves, Schrödinger equation, electrons in potential wells, atomic structure, and electron configurations.", topics: ['Nature of Matter', 'Electrons in Wells', 'Atomic Structure', 'Conduction'], href: '/modern/quantum-atomic' },
            { chapters: '50-52', title: 'Nuclear & Particle Physics', description: "Nuclear structure, radioactive decay, nuclear reactions, energy from the nucleus, and elementary particles.", topics: ['Nuclear Physics', 'Energy from Nucleus', 'Particle Physics'], href: '/modern/nuclear-particle' },
        ],
    }
];

export default function Home() {
  // useScrollAnimation(); // Removed this line to prevent content from being hidden

  // SEO helpers
  const siteUrl = 'https://physicsdaily.github.io';
  const ogImage = `${siteUrl}/og-image.png`;
  const seoDescription = "Master physics concepts from fundamentals to advanced topics with comprehensive notes, examples, and interactive content.";

  return (
    <div>
      <Head>
        <title>Physics Daily - Comprehensive Physics Learning Platform</title>
        <meta name="description" content={seoDescription} />
        <link rel="icon" href="/favicon.ico" />
        {/* SEO enhancements */}
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta name="robots" content="index,follow" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Physics Daily" />
        <meta property="og:title" content="Physics Daily - Comprehensive Physics Learning Platform" />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Physics Daily - Comprehensive Physics Learning Platform" />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={ogImage} />
        <script
          type="application/ld+json"
          // Structured data (WebSite)
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Physics Daily",
              url: `${siteUrl}/`,
              description: seoDescription
            })
          }}
        />
      </Head>

      <Header />

      <main id="main-content">
        <div className={styles.pageHeader}>
          <div className="container">
            <h1>Physics Daily</h1>
            <p className={styles.subtitle}>Advanced Physics Learning Platform</p>
            <p className={styles.description}>
              Master physics concepts with comprehensive notes, examples, and interactive content.
            </p>
            <div className={styles.ctaButtons} aria-label="Primary actions">
              <a href="#foundations" className="btn" title="Jump to Classical Mechanics foundations">
                📚 Start Learning
              </a>
              <a
                href="https://github.com/PhysicsDaily/PhysicsDaily.github.io"
                className="btn btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open PhysicsDaily repository on GitHub"
                title="Open PhysicsDaily repository on GitHub"
              >
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
        </div>

        <section className={styles.heroSection} aria-labelledby="hero-title">
          <div className="container">
            <h2 id="hero-title">Complete Physics Education</h2>
            <p>Comprehensive coverage of 52 chapters with modern, interactive learning tools for advanced physics study.</p>
          </div>
        </section>

        <div className={`${styles.mainContent} container`}>
          <section className={styles.statsSection} aria-label="Site statistics">
            <div className={styles.statsGrid} role="list">
              <div className={styles.statItem} role="listitem" aria-label="52 Chapters">
                <span className={styles.statNumber}>52</span>
                <span className={styles.statLabel}>Chapters</span>
              </div>
              <div className={styles.statItem} role="listitem" aria-label="5 Major Areas">
                <span className={styles.statNumber}>5</span>
                <span className={styles.statLabel}>Major Areas</span>
              </div>
              <div className={styles.statItem} role="listitem" aria-label="Unlimited Learning Opportunities">
                <span className={styles.statNumber}>∞</span>
                <span className={styles.statLabel}>Learning Opportunities</span>
              </div>
              <div className={styles.statItem} role="listitem" aria-label="100% Free Access">
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Free Access</span>
              </div>
            </div>
          </section>

          {topicSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={styles.section}
              aria-labelledby={`${section.id}-title`}
            >
              <div className={styles.sectionHeader}>
                <h2 id={`${section.id}-title`} className={styles.sectionTitle}>{section.title}</h2>
                <p className={styles.sectionSubtitle}>{section.subtitle}</p>
              </div>
              <div className={styles.topicGrid}>
                {section.cards.map((card) => (
                  <TopicCard key={card.title} cardData={card} type={section.card_type || section.id} />
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
