// components/TopicCard.js

import Link from 'next/link';
import styles from '../styles/TopicCard.module.css';

// The component receives 'cardData' and 'type' as props from the homepage
export default function TopicCard({ cardData, type }) {
  return (
    // The Link component makes the entire card a clickable link
    <Link href={cardData.href} passHref>
      {/* We combine multiple CSS classes. 'styles.topicCard' is the base style,
          and 'styles[type]' (e.g., styles.mechanics) adds the correct color. */}
      <div className={`${styles.topicCard} ${styles[type]}`}>
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
      </div>
    </Link>
  );
}
