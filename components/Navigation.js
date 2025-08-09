// components/Navigation.js

import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Navigation.module.css';

// Updated array with the "Contribute" link.
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Resources', path: '/resources' },
  { name: 'About', path: '/about' },
  { name: 'Contribute', path: '/contribute' }, // Added "Contribute" link
];

export default function Navigation() {
  const router = useRouter();

  return (
    <nav>
      <ul className={styles.navLinks}>
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link href={link.path} passHref>
              <div className={router.pathname === link.path ? styles.active : ''}>
                {link.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
