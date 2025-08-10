import QuestionsPage from '../../../components/QuestionsPage';
import { conceptualQuestions } from '../../../data/questions/measurement/conceptual';
import { createBreadcrumbs } from '../../../utils/breadcrumbs';

export default function ConceptualPage() {
  const pageConfig = {
    title: 'Conceptual Questions',
    subtitle: 'Chapter 1: Measurement',
    description: 'Test your conceptual understanding of measurement, units, and dimensional analysis.',
    questions: conceptualQuestions,
    breadcrumbs: createBreadcrumbs('mechanics/measurements/conceptual')
  };

  return <QuestionsPage {...pageConfig} />;
}
