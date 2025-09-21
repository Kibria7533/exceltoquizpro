
import QuizResultsClient from './QuizResultsClient';

export default async function QuizResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QuizResultsClient quizId={id} />;
}
