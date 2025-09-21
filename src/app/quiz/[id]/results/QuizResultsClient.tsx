
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface QuizResult {
  participant_name: string;
  score: number;
  total_questions: number;
  time_taken: number;
  submitted_at: string;
  percentage: number;
}

interface Quiz {
  title: string;
  description: string;
  total_questions: number;
}

interface QuizResultsClientProps {
  quizId: string;
}

export default function QuizResultsClient({ quizId }: QuizResultsClientProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');

  const resultsPerPage = 15;

  useEffect(() => {
    fetchResults();
  }, [quizId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-quiz-leaderboard-fixed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          },
          body: JSON.stringify({ quiz_id: quizId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.success) {
          setQuiz(data.quiz || null);
          setResults(Array.isArray(data.leaderboard) ? data.leaderboard : []);
          setError('');
        } else {
          setError(data?.error || 'Failed to load results');
          setResults([]);
        }
      } else {
        // Safely attempt to parse error JSON; fall back to an empty object if parsing fails
        const errorData = await response
          .json()
          .catch(() => ({}));
        setError(errorData?.error || 'Failed to load results');
        setResults([]);
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to connect to server. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = Array.isArray(results)
    ? results.filter((result) => {
        if (!result) return false;
        const percentage = result.percentage || 0;

        if (filterBy === 'all') return true;
        if (filterBy === 'excellent') return percentage >= 90;
        if (filterBy === 'good') return percentage >= 70 && percentage < 90;
        if (filterBy === 'average') return percentage >= 50 && percentage < 70;
        if (filterBy === 'below') return percentage < 50;
        return true;
      })
    : [];

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (!a || !b) return 0;

    let aValue: any = a[sortBy as keyof QuizResult];
    let bValue: any = b[sortBy as keyof QuizResult];

    if (sortBy === 'submitted_at') {
      aValue = new Date(a.submitted_at || 0).getTime();
      bValue = new Date(b.submitted_at || 0).getTime();
    }

    if (aValue === undefined || aValue === null) aValue = 0;
    if (bValue === undefined || bValue === null) bValue = 0;

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedResults.length / resultsPerPage));
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = sortedResults.slice(startIndex, startIndex + resultsPerPage);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Invalid Date') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  const formatTime = (seconds: number) => {
    const safeSeconds = Number(seconds) || 0;
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = (percentage: number) => {
    const safePercentage = Number(percentage) || 0;
    if (safePercentage >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (safePercentage >= 70) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (safePercentage >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getPerformanceLabel = (percentage: number) => {
    const safePercentage = Number(percentage) || 0;
    if (safePercentage >= 90) return 'Excellent';
    if (safePercentage >= 70) return 'Good';
    if (safePercentage >= 50) return 'Average';
    return 'Below Average';
  };

  const calculateStats = () => {
    if (!Array.isArray(results) || results.length === 0) {
      return { avgScore: 0, totalAttempts: 0, passRate: 0 };
    }

    const validResults = results.filter((result) => result && typeof result.percentage === 'number');
    if (validResults.length === 0) {
      return { avgScore: 0, totalAttempts: results.length, passRate: 0 };
    }

    const totalScore = validResults.reduce((sum, result) => sum + (result.percentage || 0), 0);
    const avgScore = Math.round(totalScore / validResults.length);
    const passCount = validResults.filter((result) => (result.percentage || 0) >= 60).length;
    const passRate = Math.round((passCount / validResults.length) * 100);

    return { avgScore, totalAttempts: results.length, passRate };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm md:text-base">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center max-w-sm md:max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-xl md:text-2xl text-red-600"></i>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Unable to Load</h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchResults}
              className="bg-purple-600 hover:bg-purple-7
              00 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer text-sm md:text-base"
            >
              Try Again
            </button>
            <Link
              href={`/quiz/${quizId}`}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer text-sm md:text-base inline-block text-center"
            >
              Take Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-4 md:mb-6 cursor-pointer text-sm md:text-base"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Dashboard
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {quiz?.title || 'Quiz Results'}
                </h1>
                {quiz?.description && (
                  <p className="text-gray-600 text-sm md:text-base">{quiz.description}</p>
                )}
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <i className="ri-bar-chart-line text-xl md:text-2xl text-white"></i>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center p-3 md:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">{stats.totalAttempts}</div>
                <div className="text-xs md:text-sm text-blue-700 font-medium">Total Attempts</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <div className="text-2xl md:text-3xl font-bold text-green-600">{stats.avgScore}%</div>
                <div className="text-xs md:text-sm text-green-700 font-medium">Average Score</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div className="text-2xl md:text-3xl font-bold text-purple-600">{stats.passRate}%</div>
                <div className="text-xs md:text-sm text-purple-700 font-medium">Pass Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 flex-1">
                <label className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs md:text-sm pr-8"
                >
                  <option value="all">All Results</option>
                  <option value="excellent">Excellent (90%+)</option>
                  <option value="good">Good (70-89%)</option>
                  <option value="average">Average (50-69%)</option>
                  <option value="below">Below Average (&lt;50%)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <label className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs md:text-sm pr-8"
                >
                  <option value="percentage">Score</option>
                  <option value="time_taken">Time</option>
                  <option value="submitted_at">Date</option>
                  <option value="participant_name">Name</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'} text-sm`}></i>
                </button>
              </div>
            </div>

            <button
              onClick={fetchResults}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap text-sm md:text-base"
            >
              <i className="ri-refresh-line mr-2"></i>
              Refresh
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-white flex items-center">
              <i className="ri-bar-chart-2-line mr-2"></i>
              Quiz Results ({sortedResults.length} total)
            </h2>
          </div>

          {!Array.isArray(sortedResults) || sortedResults.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-file-list-line text-2xl md:text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-3">No Results Found</h3>
              <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
                {filterBy === 'all'
                  ? 'No one has completed this quiz yet'
                  : `No results match the ${filterBy} filter`}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                {filterBy !== 'all' && (
                  <button
                    onClick={() => setFilterBy('all')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer text-sm md:text-base"
                  >
                    Clear Filter
                  </button>
                )}
                <Link
                  href={`/quiz/${quizId}`}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer text-sm md:text-base inline-block text-center"
                >
                  <i className="ri-play-circle-line mr-2"></i>
                  Take Quiz
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden">
                <div className="divide-y divide-gray-200">
                  {paginatedResults.map((result, index) => {
                    if (!result) return null;
                    return (
                      <div key={`mobile-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold">
                              {startIndex + index + 1}
                            </span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {result.participant_name || 'Anonymous'}
                              </div>
                              <div className="text-xs text-gray-500">{formatDate(result.submitted_at)}</div>
                            </div>
                          </div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPerformanceColor(
                              result.percentage
                            )}`}
                          >
                            {getPerformanceLabel(result.percentage)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500 text-xs">Score</div>
                            <div className="font-bold text-gray-900">
                              {result.score || 0}/{result.total_questions || 0}
                              <span className="text-xs text-gray-500 ml-1">({result.percentage || 0}%)</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs">Time</div>
                            <div className="font-medium text-gray-900">{formatTime(result.time_taken)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedResults.map((result, index) => {
                      if (!result) return null;
                      return (
                        <tr key={`desktop-${index}`} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold">
                                {startIndex + index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {result.participant_name || 'Anonymous'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">
                              {result.score || 0}/{result.total_questions || 0}
                            </div>
                            <div className="text-xs text-gray-500">{result.percentage || 0}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPerformanceColor(
                                result.percentage
                              )}`}
                            >
                              {getPerformanceLabel(result.percentage)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {formatTime(result.time_taken)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(result.submitted_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs md:text-sm text-gray-700 text-center sm:text-left">
                      Showing {startIndex + 1} to{' '}
                      {Math.min(startIndex + resultsPerPage, sortedResults.length)} of {sortedResults.length}{' '}
                      results
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer font-medium text-xs md:text-sm whitespace-nowrap"
                      >
                        Previous
                      </button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        if (pageNum > totalPages) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 md:px-4 py-2 rounded-lg transition-colors cursor-pointer font-medium text-xs md:text-sm ${
                              currentPage === pageNum
                                ? 'bg-purple-600 text-white'
                                : 'border border-gray-300 hover:bg-white'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer font-medium text-xs md:text-sm whitespace-nowrap"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-6 md:mt-8">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              href={`/quiz/${quizId}`}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer inline-flex items-center justify-center text-sm md:text-base"
            >
              <i className="ri-play-circle-line mr-2"></i>
              Take Quiz
            </Link>
            <Link
              href={`/quiz/${quizId}/leaderboard`}
              className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer inline-flex items-center justify-center text-sm md:text-base"
            >
              <i className="ri-trophy-line mr-2"></i>
              View Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
