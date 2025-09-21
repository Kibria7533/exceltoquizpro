
import QuizAccess from './QuizAccess';

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QuizAccess quizId={id} />;
}
