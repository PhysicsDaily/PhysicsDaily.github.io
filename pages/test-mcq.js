import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MCQComponent from '../components/MCQComponent';
import path from 'path';
import fs from 'fs';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'measurement-mcq.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const questions = JSON.parse(fileContents);
  return { props: { questions } };
}

export default function TestMCQPage({ questions }) {
  return (
    <div>
      <Head>
        <title>Test MCQ - Physics Daily</title>
        <meta name="description" content="Test MCQ page for Physics Daily" />
      </Head>

      <Header />

      <main style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Test MCQ Quiz</h1>
        <MCQComponent questions={questions} timeLimit={900} />
      </main>

      <Footer />
    </div>
  );
}