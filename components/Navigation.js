// components/Navigation.js

import Link from 'next/link';
// useRouter is a hook that gives us information about the current URL.
import { useRouter } from 'next/router';
import styles from '../styles/Navigation.module.css';

// An array to hold our navigation links. This makes it easy to add or remove links later.
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Resources', path: '/resources' },
  { name: 'About', path: '/about' },
  // Note: The 'Contribute' page was not in the file list, so it is commented out.
  // You can add 'contribute.js' to your pages folder and uncomment this line to add it back.
  // { name: 'Contribute', path: '/contribute' },
];

export default function Navigation() {
  // Get the current router object.
  const router = useRouter();

  return (
    <nav>
      <ul className={styles.navLinks}>
        {/* We map over the navLinks array to create each list item and link. */}
        {navLinks.map((link) => (
          <li key={link.name}>
            {/*
              The Link component handles navigation.
              We check if the router's current path matches the link's path.
              If it does, we apply the 'active' style from our CSS module.
            */}
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
