// components/TopicCard.js

import Link from 'next/link';
import styles from '../styles/TopicCard.module.css';

// The component receives 'cardData' and 'type' as props from the homepage
export default function TopicCard({ cardData, type }) {
  return (
    // By adding legacyBehavior, we can style the link tag directly.
    <Link href={cardData.href} passHref legacyBehavior>
      <a className={`${styles.topicCard} ${styles[type]}`}>
        <div className={styles.chapterNumber}>Chapters {cardData.chapters}</div>
        <h3>{cardData.title}</h3>
        <p className={styles.topicDescription}>
          {cardData.description}
        </p>
        <div className={styles.topicChapters}>
          {/* We loop over the 'topics' array in the data to create each tag */}
          {cardData.topics.map((topic) => (
            <span key={topic} className={styles.chapterTag}>
              {topic}
            </span>
          ))}
        </div>
      </a>
    </Link>
  );
}
