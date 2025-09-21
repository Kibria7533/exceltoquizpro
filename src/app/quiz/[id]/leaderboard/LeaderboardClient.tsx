
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LeaderboardEntry {
  participant_name: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_taken: number;
  submitted_at: string;
  percentage: number;
}

interface Quiz {
  title: string;
  description: string;
}

interface LeaderboardStats {
  totalParticipants: number;
  averageScore: number;
  highestScore: number;
}

interface LeaderboardClientProps {
  quizId: string;
}

export default function LeaderboardClient({ quizId }: LeaderboardClientProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    totalParticipants: 0,
    averageScore: 0,
    highestScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [quizId]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-quiz-leaderboard-fixed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ quiz_id: quizId }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
        setLeaderboard(data.leaderboard || []);
        setStats(data.stats || { totalParticipants: 0, averageScore: 0, highestScore: 0 });
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load leaderboard');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Invalid Date') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-yellow-500 text-white';
    if (index === 1) return 'bg-gray-400 text-white';
    if (index === 2) return 'bg-amber-600 text-white';
    return 'bg-blue-100 text-blue-800';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return 'ri-trophy-fill';
    if (index === 1) return 'ri-medal-fill';
    if (index === 2) return 'ri-award-fill';
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-2xl text-red-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Unable to Load</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchLeaderboard}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              Try Again
            </button>
            <Link
              href={`/quiz/${quizId}`}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              Take Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-trophy-line text-2xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
            {quiz && (
              <>
                <h2 className="text-xl text-gray-600 mb-2">{quiz.title}</h2>
                {quiz.description && <p className="text-gray-500">{quiz.description}</p>}
              </>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-group-line text-xl text-blue-600"></i>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalParticipants}</div>
            <div className="text-gray-600">Total Participants</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-bar-chart-line text-xl text-green-600"></i>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.averageScore}%</div>
            <div className="text-gray-600">Average Score</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-star-line text-xl text-yellow-600"></i>
            </div>
            <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.highestScore}%</div>
            <div className="text-gray-600">Best Score</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <i className="ri-trophy-line mr-2"></i>
              Top Performers
            </h3>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-trophy-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-3">No Results Yet</h3>
              <p className="text-gray-500 mb-8">Be the first to take this quiz and claim the top spot!</p>
              <Link
                href={`/quiz/${quizId}`}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer inline-flex items-center"
              >
                <i className="ri-play-circle-line mr-2"></i>
                Take Quiz Now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leaderboard.map((entry, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getRankStyle(index)}`}>
                        {index < 3 && getRankIcon(index) ? (
                          <i className={`${getRankIcon(index)} text-lg`}></i>
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">{entry.participant_name}</h4>
                        <p className="text-sm text-gray-500">
                          {entry.correct_answers}/{entry.total_questions} correct • {formatDate(entry.submitted_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{entry.score}%</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                      <div>
                        <div className="text-lg font-medium text-blue-600">{formatTime(entry.time_taken)}</div>
                        <div className="text-xs text-gray-500">Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/quiz/${quizId}`}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
            >
              <i className="ri-play-circle-line mr-2"></i>
              Take Quiz
            </Link>
            <Link
              href={`/quiz/${quizId}/results`}
              className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
            >
              <i className="ri-bar-chart-line mr-2"></i>
              View All Results
            </Link>
            <Link
              href={`/quiz/${quizId}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
            >
              <i className="ri-refresh-line mr-2"></i>
              Try Again
            </Link>
            <button
              onClick={fetchLeaderboard}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
            >
              <i className="ri-refresh-line mr-2"></i>
              Refresh Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
