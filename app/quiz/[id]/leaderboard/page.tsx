
import LeaderboardClient from './LeaderboardClient';

export default function QuizLeaderboardPage({ params }: { params: { id: string } }) {
  return <LeaderboardClient quizId={params.id} />;
}
