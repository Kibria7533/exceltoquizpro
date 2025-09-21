
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LeaderboardEntry {
  id: string;
  quiz_title: string;
  quiz_id: string;
  participant_name: string;
  score: number;
  total_questions: number;
  time_taken: number;
  submitted_at: string;
  rank: number;
}

interface QuizStats {
  totalQuizzes: number;
  totalParticipants: number;
  averageScore: number;
}

export default function RecentActivity() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    totalParticipants: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [error, setError] = useState('');

  useEffect(() => {
    loadGlobalLeaderboard();
  }, [selectedPeriod]);

  const loadGlobalLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');

      // Use the dedicated global leaderboard function
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-global-leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ global: true }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.globalResults) {
          // Filter by selected period using submitted_at
          const now = new Date();
          const filteredResults = data.globalResults.filter((result: any) => {
            const submittedAt = new Date(result.submitted_at);
            const daysDiff = (now.getTime() - submittedAt.getTime()) / (1000 * 3600 * 24);
            
            switch (selectedPeriod) {
              case 'today':
                return daysDiff < 1;
              case 'week':
                return daysDiff < 7;
              case 'month':
                return daysDiff < 30;
              default:
                return true;
            }
          });

          // Sort by score desc, then by time asc for tie-breaking
          filteredResults.sort((a: any, b: any) => {
            if (b.score !== a.score) {
              return b.score - a.score;
            }
            return a.time_taken - b.time_taken;
          });

          // Transform data and add rank
          const transformedData: LeaderboardEntry[] = filteredResults.map((result: any, index: number) => ({
            id: result.id,
            quiz_title: result.quiz_title || 'Unknown Quiz',
            quiz_id: result.quiz_id,
            participant_name: result.participant_name,
            score: result.score,
            total_questions: result.total_questions,
            time_taken: result.time_taken,
            submitted_at: result.submitted_at,
            rank: index + 1
          }));

          setLeaderboardData(transformedData);

          // Calculate stats
          const totalParticipants = transformedData.length;
          const averageScore = totalParticipants > 0 
            ? Math.round(transformedData.reduce((sum, entry) => sum + entry.score, 0) / totalParticipants)
            : 0;

          // Get unique quiz count
          const uniqueQuizzes = new Set(transformedData.map(entry => entry.quiz_id));
          
          setStats({
            totalQuizzes: uniqueQuizzes.size,
            totalParticipants,
            averageScore
          });
        } else {
          setError('No global leaderboard data available');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load global leaderboard');
      }
    } catch (error) {
      console.error('Failed to load global leaderboard:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Invalid Date') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return 'ri-trophy-fill text-yellow-500';
      case 2: return 'ri-medal-line text-gray-400';
      case 3: return 'ri-medal-line text-orange-400';
      default: return 'ri-hashtag text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <i className="ri-loader-4-line text-3xl text-blue-600 animate-spin"></i>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-error-warning-line text-3xl text-red-600"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={loadGlobalLeaderboard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-refresh-line mr-2"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Global Leaderboards</h2>
          <p className="text-sm sm:text-base text-gray-600">Top performers across all quizzes</p>
        </div>

        <div className="flex bg-gray-100 rounded-full p-1 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedPeriod('today')}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer flex-shrink-0 ${
              selectedPeriod === 'today'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer flex-shrink-0 ${
              selectedPeriod === 'week'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer flex-shrink-0 ${
              selectedPeriod === 'month'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {leaderboardData.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-trophy-line text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No quiz results yet</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6">Complete some quizzes to see leaderboards</p>
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-play-circle-line mr-2"></i>
            Take a Quiz
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="space-y-2 sm:space-y-4">
              {leaderboardData.slice(0, 10).map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors duration-200 ${
                    index < 3 ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {/* Rank Icon */}
                  <div className="flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 flex-shrink-0">
                    <i className={`text-base sm:text-xl ${getRankIcon(entry.rank)}`}></i>
                  </div>

                  {/* Quiz and User Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                      {entry.quiz_title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      by {entry.participant_name}
                    </p>
                  </div>

                  {/* Score and Time - Mobile Layout */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 text-right">
                    <div className="text-center">
                      <div className="text-sm sm:text-lg font-bold text-blue-600">
                        {entry.score}%
                      </div>
                      <div className="text-xs text-gray-500 hidden sm:block">
                        Score
                      </div>
                    </div>

                    <div className="text-center min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-700">
                        {Math.floor(entry.time_taken / 60)}:{(entry.time_taken % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-500 hidden sm:block">
                        {formatDate(entry.submitted_at)}
                      </div>
                    </div>

                    {/* Rank Number */}
                    <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-sm flex-shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-gray-600">
                        #{entry.rank}
                      </span>
                    </div>

                    {/* View Quiz Link - Hidden on mobile, shown on larger screens */}
                    <Link
                      href={`/quiz/${entry.quiz_id}/leaderboard`}
                      className="hidden sm:block text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap"
                    >
                      View Quiz →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {leaderboardData.length > 10 && (
            <div className="bg-gray-50 px-4 sm:px-6 py-4 text-center">
              <button 
                onClick={() => {/* Could expand to show more results */}}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm cursor-pointer"
              >
                View All Results ({leaderboardData.length} total)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800">Total Participants</h3>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-group-line text-lg sm:text-xl text-blue-600"></i>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalParticipants}</p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Active quiz takers</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800">Average Score</h3>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="ri-line-chart-line text-lg sm:text-xl text-green-600"></i>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.averageScore}%</p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Overall performance</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800">Active Quizzes</h3>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="ri-file-list-3-line text-lg sm:text-xl text-purple-600"></i>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.totalQuizzes}</p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Available quizzes</p>
        </div>
      </div>
    </div>
  );
}
