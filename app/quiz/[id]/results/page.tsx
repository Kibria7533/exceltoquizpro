
import QuizResultsClient from './QuizResultsClient';

export default function QuizResultsPage({ params }: { params: { id: string } }) {
  return <QuizResultsClient quizId={params.id} />;
}
