import QuestionsPage from '../../../components/QuestionsPage';
import { numericalQuestions } from '../../../data/questions/measurement/numerical';
import { createBreadcrumbs } from '../../../utils/breadcrumbs';

export default function NumericalPage() {
  const pageConfig = {
    title: 'Numerical Problems',
    subtitle: 'Chapter 1: Measurement',
    description: 'Solve numerical problems related to measurement, units, and calculations.',
    questions: numericalQuestions,
    breadcrumbs: createBreadcrumbs('mechanics/measurements/numerical')
  };

  return <QuestionsPage {...pageConfig} />;
}
