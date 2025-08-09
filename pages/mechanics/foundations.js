// pages/mechanics/foundations.js

import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/Foundations.module.css';

// Data for the learning objectives section
const objectives = [
  { icon: '📏', title: 'Measurement & Units', description: 'Master scientific measurement, significant figures, and dimensional analysis.' },
  { icon: '🚀', title: 'Motion Analysis', description: 'Understand kinematics in 1D, 2D, and 3D coordinate systems.' },
  { icon: '⚖️', title: 'Newton\'s Laws', description: 'Apply fundamental principles to solve real-world problems.' },
  { icon: '💫', title: 'Momentum', description: 'Analyze collisions and particle systems using conservation laws.' },
];

// Data for all seven chapter cards in this section
const chapters = [
  { 
    id: 1, 
    title: 'Measurement', 
    difficulty: 'Beginner', 
    description: "Learn the foundations of scientific measurement, units, significant figures, and dimensional analysis.",
    stats: { time: '4-5 hours', topics: 3 },
    href: '/mechanics/measurements'
  },
  { 
    id: 2, 
    title: 'Motion in One Dimension', 
    difficulty: 'Beginner', 
    description: "Master the concepts of position, velocity, acceleration, and kinematic equations for 1D motion.",
    stats: { time: '5-6 hours', topics: 3 },
    href: '/mechanics/kinematics' 
  },
  { 
    id: 3, 
    title: 'Force and Newton\'s Laws', 
    difficulty: 'Intermediate', 
    description: "Understand force concepts and master Newton's three laws of motion with practical applications.",
    stats: { time: '6-7 hours', topics: 3 },
    href: '/mechanics/newtons-laws'
  },
  { 
    id: 4, 
    title: 'Motion in 2D & 3D', 
    difficulty: 'Intermediate', 
    description: "Extend motion analysis to multiple dimensions including projectile motion and circular motion.",
    stats: { time: '5-6 hours', topics: 3 },
    href: '/mechanics/motion-2d-3d'
  },
  { 
    id: 5, 
    title: 'Applications of Newton\'s Laws', 
    difficulty: 'Intermediate', 
    description: "Apply Newton's laws to real-world scenarios including friction, inclined planes, and pulley systems.",
    stats: { time: '6-7 hours', topics: 3 },
    href: '/mechanics/applications'
  },
  { 
    id: 6, 
    title: 'Momentum', 
    difficulty: 'Intermediate', 
    description: "Master momentum conservation, the impulse-momentum theorem, and collision analysis.",
    stats: { time: '5-6 hours', topics: 3 },
    href: '/mechanics/momentum'
  },
  { 
    id: 7, 
    title: 'Systems of Particles', 
    difficulty: 'Advanced', 
    description: "Analyze multi-particle systems, center of mass motion, and systems with variable mass.",
    stats: { time: '4-5 hours', topics: 3 },
    href: '/mechanics/particle-systems'
  },
];


export default function FoundationsPage() {
  return (
    <div>
      <Head>
        <title>Classical Mechanics: Foundations & Kinematics - Physics Daily</title>
        <meta name="description" content="Master classical mechanics fundamentals including measurement, motion, Newton's laws, and momentum." />
      </Head>

      <Header />

      <div className="breadcrumb">
        <div className="container">
          <nav>
            <Link href="/">Home</Link>
            <span className="separator">›</span>
            <Link href="/#mechanics">Classical Mechanics</Link>
            <span className="separator">›</span>
            <span className="current">Foundations & Kinematics</span>
          </nav>
        </div>
      </div>

      <header className={styles.header}>
        <div className="container">
          <h1>Classical Mechanics: Foundations & Kinematics</h1>
          <p className={styles.subtitle}>Chapters 1-7: Master the fundamentals of physics</p>
          <p className={styles.description}>
            Build a solid foundation in physics with comprehensive coverage of measurement, motion, forces, and momentum. These seven chapters form the cornerstone of classical mechanics.
          </p>
        </div>
      </header>
      
      <section className={styles.objectivesSection}>
        <div className="container">
            <div className={styles.objectivesCard}>
                <h2>🎯 Learning Objectives</h2>
                <div className={styles.objectivesGrid}>
                    {objectives.map(obj => (
                        <div key={obj.title} className={styles.objectiveItem}>
                            <span className={styles.objectiveIcon}>{obj.icon}</span>
                            <h3>{obj.title}</h3>
                            <p>{obj.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      <main className={styles.mainContent}>
        <div className="container">
            <section className={styles.chaptersSection}>
                <h2>📚 Chapters Overview</h2>
                <div className={styles.chapterGrid}>
                    {chapters.map(chapter => (
                        <div key={chapter.id} className={styles.chapterCard}>
                             <div className={styles.chapterHeader}>
                                <div className={styles.chapterNumber}>Chapter {chapter.id}</div>
                                <div className={`${styles.difficultyBadge} ${styles[chapter.difficulty.toLowerCase()]}`}>{chapter.difficulty}</div>
                            </div>
                            <h3>{chapter.title}</h3>
                            <p className={styles.chapterDescription}>{chapter.description}</p>
                            <div className={styles.chapterStats}>
                                <span>⏱️ {chapter.stats.time}</span>
                                <span>📖 {chapter.stats.topics} topics</span>
                            </div>
                             <div className={styles.chapterActions}>
                                <Link href={chapter.href} className="btn">Start Chapter</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
