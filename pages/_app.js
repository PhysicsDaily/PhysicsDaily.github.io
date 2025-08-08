// Import the global CSS file. This file will contain all the styles
// that are shared across your entire website, like fonts, colors,
// and the dark mode theme variables.
import '../styles/globals.css';

// This is the main App component that Next.js uses.
// The 'Component' prop is the actual page being displayed (e.g., your homepage or about page).
// 'pageProps' are any initial properties that the page might have.
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
