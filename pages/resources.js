// pages/resources.js

import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Resources.module.css'; // We will create this file next

// --- COMPLETE DATA ARRAYS ---

const videoResources = [
  {
    title: "Flipping Physics",
    description: "A great website to utilize for AP Physics. Highly recommended for complete reliance. If you're confused about a unit, find that corresponding unit here!",
    href: "https://www.flippingphysics.com/",
    linkText: "🎬 Watch Videos"
  },
  {
    title: "Khan Academy",
    description: "Excellent for Algebra, AP Physics 1 & Calculus. Just magnificent explanations for introductory calculus and physics concepts.",
    href: "https://www.khanacademy.org/science/physics",
    linkText: "📚 Start Learning"
  },
  {
    title: "MIT OpenCourseWare",
    description: "Excellent calculus-based physics lectures from MIT. Comprehensive and rigorous approach to physics education.",
    href: "https://ocw.mit.edu/courses/physics/",
    linkText: "🎓 Access Courses"
  },
  {
    title: "The Organic Chemistry Tutor",
    description: "Explains basic and advanced physics concepts thoroughly with a problem-focused approach that helps you grasp complex topics.",
    href: "https://www.youtube.com/@TheOrganicChemistryTutor",
    linkText: "▶️ YouTube Channel"
  }
];

const textbookLists = [
    {
        title: "Algebra-based Physics (AP Physics 1&2)",
        books: [
            { name: "Hewitt", work: "Conceptual Physics" },
            { name: "Serway and Faughn", work: "Holt Physics" },
            { name: "Serway and Vuille", work: "College Physics" },
            { name: "Cutnell, Johnson, Young, and Stadler", work: "Physics" },
            { name: "Knight, Jones, and Field", work: "College Physics: A Strategic Approach" },
            { name: "Giancoli", work: "Physics: Principles with Applications" },
        ]
    },
    {
        title: "Calculus",
        books: [{ name: "Stewart", work: "Calculus: Early Transcendentals" }]
    },
    {
        title: "Calculus-based Physics (AP Physics C)",
        books: [
            { name: "Serway and Jewett", work: "Physics for Scientists and Engineers with Modern Physics" },
            { name: "Halliday, Resnick, and Walker", work: "Fundamentals of Physics" },
            { name: "Young and Freedman", work: "University Physics" },
            { name: "Sears and Zemansky", work: "University Physics with Modern Physics" },
            { name: "Tipler and Mosca", work: "Physics for Scientists and Engineers" },
            { name: "Giancoli", work: "Physics for Scientists & Engineers" },
            { name: "Knight", work: "Physics for Scientists and Engineers: A Strategic Approach with Modern Physics" },
        ]
    },
    {
        title: "Physics for JEE",
        books: [
            { name: "HC Verma", work: "Concepts of Physics Volume 1" },
            { name: "HC Verma", work: "Concepts of Physics Volume 2" },
        ]
    },
    {
        title: "Advanced Physics",
        books: [
            { name: "Halliday, Resnick, and Krane", work: "Physics (Primary source for advanced study)" },
            { name: "Morin", work: "Introduction to Classical Mechanics: With Problems and Solutions" },
        ]
    },
];

const reviewResources = [
    {
        title: "MIT AP Physics 1 Workbook",
        description: "Comprehensive workbook with practice problems and solutions for AP Physics 1.",
        href: "https://web.mit.edu/~yczeng/Public/WORKBOOK%201%20FULL.pdf",
        linkText: "📄 Download AP 1 Workbook"
    },
    {
        title: "MIT AP Physics 2 Workbook",
        description: "Complete workbook with practice problems and solutions for AP Physics 2.",
        href: "https://web.mit.edu/~yczeng/Public/AP%202%20workbook.pdf",
        linkText: "📄 Download AP 2 Workbook"
    },
    {
        title: "Physics Olympiads",
        description: "European Physics Olympiad (EuPhO) and International Physics Olympiad (IPhO) problems.",
        href: "https://www.eupho.ee/",
        linkText: "🏆 EuPhO Problems"
    },
    {
        title: "Basic Knowledge Test",
        description: "Comprehensive test of fundamental physics concepts to assess your understanding.",
        href: "https://sites.google.com/site/twuphysicslessons/",
        linkText: "🧪 Take Test"
    }
];

const problemSolvingBooks = {
    title: "Problem-Solving Books",
    books: [
        { name: "200 Puzzling Physics Problems", work: "With Hints and Solutions" },
        { name: "Problems In General Physics", work: "Comprehensive problem collection" },
        { name: "Pathfinder for Olympiad and JEE (Advanced) Physics", work: "Competition-level problems" },
        { name: "Aptitude Test Problem in Physics", work: "Test preparation" }
    ]
};

const funContent = [
    {
        title: "Fun to Imagine - Richard Feynman",
        description: "A true master of the subject talks about why physics is fun. Essential viewing for any physics enthusiast!",
        href: "https://www.youtube.com/watch?v=P1ww1IXRfTA",
        linkText: "▶️ Watch Video"
    },
    {
        title: "Feynman's Lectures on Physics",
        description: "Read and you'll see why it's different. A unique perspective on physics from one of the greatest physicists.",
        href: "https://www.feynmanlectures.caltech.edu/",
        linkText: "📚 Read Online"
    }
];

export default function ResourcesPage() {
  return (
    <div>
      <Head>
        <title>Learning Resources - Physics Daily</title>
        <meta name="description" content="Comprehensive collection of physics learning resources including textbooks, videos, lectures, and practice materials for all levels." />
      </Head>

      <Header />

      <header className={styles.header}>
        <div className="container">
          <h1>Learning Resources</h1>
          <p>Comprehensive collection of physics learning materials from beginner to advanced levels</p>
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <div className="container">

          <section className={styles.section}>
            <div className={styles.highlightBox}>
              <h3>📚 Key Principle for Success</h3>
              <p>For each subject, choose <strong>one reliable resource</strong> from the lists below and rely mainly on that! Cohesive resources like a great textbook can help you avoid confusion and maintain a structured learning path.</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${styles.videos}`}>🎥 Video Resources</h2>
            <div className={styles.resourceGrid}>
              {videoResources.map(resource => (
                <div key={resource.title} className={styles.resourceCard}>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <a href={resource.href} className={styles.resourceLink} target="_blank" rel="noopener noreferrer">
                    {resource.linkText}
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
             <h2 className={`${styles.sectionTitle} ${styles.textbooks}`}>📖 Textbook Recommendations</h2>
             {textbookLists.map(list => (
                <div key={list.title} className={styles.resourceList}>
                    <h3>{list.title}</h3>
                    <ul>
                        {list.books.map(book => (
                            <li key={book.name}>
                                <strong>{book.name}</strong>
                                <span>- {book.work}</span>
                            </li>
                        ))}
                    </ul>
                </div>
             ))}
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${styles.review}`}>📋 Review Resources</h2>
            <div className={styles.resourceGrid}>
              {reviewResources.map(resource => (
                <div key={resource.title} className={styles.resourceCard}>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <a href={resource.href} className={styles.resourceLink} target="_blank" rel="noopener noreferrer">
                    {resource.linkText}
                  </a>
                </div>
              ))}
            </div>
            <div className={styles.resourceList}>
              <h3>{problemSolvingBooks.title}</h3>
              <ul>
                {problemSolvingBooks.books.map(book => (
                  <li key={book.name}>
                    <strong>{book.name}</strong>
                    <span>- {book.work}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${styles.fun}`}>🎉 Fun Physics Content</h2>
            <div className={styles.resourceGrid}>
              {funContent.map(resource => (
                <div key={resource.title} className={styles.resourceCard}>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <a href={resource.href} className={styles.resourceLink} target="_blank" rel="noopener noreferrer">
                    {resource.linkText}
                  </a>
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
