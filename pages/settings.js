import PageLayout from '../components/PageLayout';
import styles from '../styles/ContentPage.module.css';

export default function Settings() {
  return (
    <PageLayout
      title="Settings - Physics Daily"
      description="Customize your Physics Daily experience with theme and preference settings."
      breadcrumbItems={[
        { href: '/', label: 'Home' },
        { label: 'Settings' },
      ]}
    >
      <header className={styles.pageHeader}>
        <div className="container">
          <h1>Settings</h1>
          <p className={styles.subtitle}>Customize Your Experience</p>
          <p className={styles.description}>
            Adjust your preferences to enhance your learning experience on Physics Daily.
          </p>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className="container">
          <div className={styles.section}>
            <h2>Theme Settings</h2>
            <p>
              Use the vertical theme toggle on the right edge to switch between light and dark modes.
              Your choice is saved automatically.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Coming Soon</h2>
            <p>More customization options will be available in future updates.</p>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}