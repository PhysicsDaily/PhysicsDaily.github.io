import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TestMCQPage() {
  return (
    <div>
      <Head>
        <title>Test MCQ - Physics Daily</title>
        <meta name="description" content="Test MCQ page for Physics Daily" />
      </Head>

      <Header />

      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Test MCQ Page</h1>
        <p>This is a test page for MCQ functionality.</p>
      </main>

      <Footer />
    </div>
  );
}