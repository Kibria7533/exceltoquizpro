'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QuizTaker from './QuizTaker';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
  time_limit: number;
  questions_per_quiz: number;
  created_by: string;
  is_published: boolean;
}

interface QuizAccessProps {
  quizId: string;
}

export default function QuizAccess({ quizId }: QuizAccessProps) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    checkAuthentication();
    fetchQuiz();
  }, [quizId]);

  const checkAuthentication = () => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData.access_token && sessionData.user) {
          setIsAuthenticated(true);
          return;
        }
      } catch (error) {
        console.error('Session parse error:', error);
      }
    }
    setIsAuthenticated(false);
  };

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({ quiz_id: quizId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.quiz) {
          setQuiz(data.quiz);
        } else {
          setError('Quiz not found or not published');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load quiz');
      }
    } catch (err: any) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTakeQuizClick = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-2xl text-red-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  // If authenticated, show quiz taker directly
  if (isAuthenticated) {
    return <QuizTaker quizId={quizId} />;
  }

  // Show quiz preview with auth prompt
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Quiz Preview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-questionnaire-line text-3xl text-blue-600"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-gray-600 text-lg mb-6">{quiz.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{quiz.questions.length}</div>
              <p className="text-blue-700 font-medium">Questions</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{quiz.time_limit}</div>
              <p className="text-green-700 font-medium">Minutes</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">100</div>
              <p className="text-purple-700 font-medium">Max Points</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleTakeQuizClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-300 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-play-circle-line mr-2"></i>
              Take Quiz
            </button>
          </div>
        </div>

        {/* Authentication Prompt Modal */}
        {showAuthPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-line text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Join to Take Quiz</h3>
                <p className="text-gray-600">Please login or create an account to participate in this quiz</p>
              </div>

              <div className="space-y-4">
                <Link
                  href={`/login?redirect=/quiz/${quizId}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-300 text-center block whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-login-box-line mr-2"></i>
                  Login
                </Link>
                
                <Link
                  href={`/signup?redirect=/quiz/${quizId}`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-300 text-center block whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-user-add-line mr-2"></i>
                  Create Account
                </Link>

                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2">Why do I need to login?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Track your quiz results</li>
                  <li>• Compete on leaderboards</li>
                  <li>• Save your progress</li>
                  <li>• View your quiz history</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}