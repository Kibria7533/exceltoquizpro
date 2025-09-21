
import QuizAccess from './QuizAccess';

export default function QuizPage({ params }: { params: { id: string } }) {
  return <QuizAccess quizId={params.id} />;
}
