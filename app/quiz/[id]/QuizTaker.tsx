
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: number;
  time_limit: number;
  image_url?: string;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  time_limit: number;
  questions_per_quiz: number;
  created_by: string;
  is_published: boolean;
}

interface QuizTakerProps {
  quizId: string;
}

export default function QuizTaker({ quizId }: QuizTakerProps) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, quizStarted, quizCompleted]);

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
        if (data.quiz && data.quiz.questions && Array.isArray(data.quiz.questions)) {
          setQuiz(data.quiz);
          setTimeLeft(data.quiz.time_limit * 60); // Convert minutes to seconds
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

  const startQuiz = () => {
    if (!participantName.trim()) {
      alert('Please enter your name to start the quiz');
      return;
    }
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answerIndex + 1,
    });
  };

  const nextQuestion = () => {
    if (quiz && quiz.questions && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleTimeUp = () => {
    finishQuiz();
  };

  const finishQuiz = async () => {
    if (!quiz || !quiz.questions) return;

    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000 / 60); // Convert to minutes

    setScore(finalScore);
    setQuizCompleted(true);
    
    // Submit quiz result
    await submitQuizResult(correctAnswers, finalScore, timeElapsed);
  };

  const submitQuizResult = async (correctAnswers: number, finalScore: number, timeElapsed: number) => {
    if (!participantName.trim() || !quiz) {
      setSubmitError('Please enter your name before submitting');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const submissionData = {
        quiz_id: quiz.id,
        participant_name: participantName.trim(),
        participant_email: participantEmail.trim() || null,
        score: finalScore,
        correct_answers: correctAnswers,
        total_questions: quiz.questions.length,
        time_taken: timeElapsed,
        answers: answers
      };

      console.log('Submitting quiz result:', submissionData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-quiz-result-final-working`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      console.log('Submission result:', result);

      if (result.success) {
        console.log('Quiz result submitted successfully!');
        // Navigate to results page
        router.push(`/quiz/${quiz.id}/results?score=${finalScore}&correct=${correctAnswers}&total=${quiz.questions.length}&time=${timeElapsed}&name=${encodeURIComponent(participantName)}`);
      } else {
        console.error('Submission failed:', result.error);
        setSubmitError('Failed to submit quiz result: ' + (result.error || 'Unknown error'));
        setShowResults(true); // Show results anyway
      }
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      setSubmitError('Error submitting quiz result. Please try again.');
      setShowResults(true); // Show results anyway
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent! Outstanding performance!';
    if (score >= 80) return 'Great job! Well done!';
    if (score >= 70) return 'Good work! Keep it up!';
    if (score >= 60) return 'Not bad! Room for improvement.';
    return 'Keep practicing! You can do better!';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm md:max-w-md w-full">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-xl md:text-2xl text-red-600"></i>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Quiz Not Available</h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">{error}</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm md:max-w-md w-full">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-information-line text-xl md:text-2xl text-yellow-600"></i>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Quiz Not Ready</h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">This quiz has no questions or is not properly configured.</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Quiz completed - show results
  if (quizCompleted && showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 text-center">
            {submitError && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center justify-center text-yellow-800">
                  <i className="ri-information-line mr-2"></i>
                  <span className="text-xs md:text-sm">{submitError}</span>
                </div>
              </div>
            )}

            <div className="mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-trophy-line text-2xl md:text-3xl text-blue-600"></i>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h1>
              <p className="text-gray-600 text-sm md:text-base">{quiz.title}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-blue-50 rounded-xl p-4 md:p-6">
                <div className={`text-2xl md:text-3xl font-bold mb-2 ${getScoreColor(score)}`}>{score}%</div>
                <p className="text-gray-600 text-sm md:text-base">Final Score</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">
                  {Object.values(answers).filter(
                    (answer, index) => answer === quiz.questions[index]?.correct_answer
                  ).length}
                </div>
                <p className="text-gray-600 text-sm md:text-base">Correct Answers</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 md:p-6">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">
                  {formatTime(quiz.time_limit * 60 - timeLeft)}
                </div>
                <p className="text-gray-600 text-sm md:text-base">Time Taken</p>
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <h3 className={`text-lg md:text-xl font-semibold mb-4 ${getScoreColor(score)}`}>
                {getScoreMessage(score)}
              </h3>
            </div>

            <div className="space-y-4 mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Review Your Answers</h3>
              <div className="grid gap-3 md:gap-4 text-left max-h-72 md:max-h-96 overflow-y-auto">
                {quiz.questions.map((question, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === question.correct_answer;
                  return (
                    <div
                      key={index}
                      className={`border rounded-xl p-3 md:p-4 ${
                        isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-2 md:gap-3">
                        <div
                          className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCorrect ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          <i className={`ri-${isCorrect ? 'check' : 'close'}-line text-white text-xs md:text-sm`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                            {index + 1}. {question.question_text}
                          </h4>
                          <div className="space-y-1 text-xs md:text-sm">
                            <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                              Your answer:{' '}
                              {userAnswer && question.options && question.options[userAnswer - 1] 
                                ? question.options[userAnswer - 1] 
                                : 'Not answered'}
                            </p>
                            {!isCorrect && question.options && question.options[question.correct_answer - 1] && (
                              <p className="text-green-700">
                                Correct answer: {question.options[question.correct_answer - 1]}
                              </p>
                            )}
                            {question.explanation && (
                              <p className="text-gray-600 mt-2 p-2 md:p-3 bg-gray-100 rounded-lg">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-4 md:flex-row justify-center">
              <Link
                href={`/quiz/${quizId}/leaderboard`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
              >
                <i className="ri-trophy-line mr-2"></i>
                View Leaderboard
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-refresh-line mr-2"></i>
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz completed but submitting
  if (quizCompleted && isSubmitting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">Submitting your results...</p>
          <p className="text-gray-500 text-xs md:text-sm mt-2">Please wait while we save your score</p>
        </div>
      </div>
    );
  }

  // Quiz not started - show intro
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-questionnaire-line text-xl md:text-2xl text-blue-600"></i>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
              {quiz.description && <p className="text-gray-600 text-sm md:text-base">{quiz.description}</p>}
            </div>

            <div className="bg-blue-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-semibold text-blue-800 mb-4">Quiz Information</h3>
              <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                <div>
                  <div className="text-xl md:text-2xl font-bold text-blue-600">{quiz.questions.length}</div>
                  <div className="text-xs md:text-sm text-blue-700">Questions</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-blue-600">{quiz.time_limit}</div>
                  <div className="text-xs md:text-sm text-blue-700">Minutes</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-blue-600">100</div>
                  <div className="text-xs md:text-sm text-blue-700">Max Points</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6 md:mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  value={participantName}
                  onChange={e => setParticipantName(e.target.value)}
                  className="w-full px-3 md:px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={participantEmail}
                  onChange={e => setParticipantEmail(e.target.value)}
                  className="w-full px-3 md:px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 md:p-4 mb-6 md:mb-8">
              <h4 className="font-semibold text-yellow-800 mb-2 text-sm md:text-base">
                <i className="ri-information-line mr-2"></i>
                Instructions
              </h4>
              <ul className="text-xs md:text-sm text-yellow-700 space-y-1">
                <li>• Read each question carefully</li>
                <li>• Select the best answer from the options</li>
                <li>• You can navigate between questions</li>
                <li>• Submit when you're ready or when time runs out</li>
                <li>• Make sure you have a stable internet connection</li>
              </ul>
            </div>

            <button
              onClick={startQuiz}
              disabled={!participantName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 md:py-4 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer text-sm md:text-base"
            >
              <i className="ri-play-line mr-2"></i>
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress - check if current question exists
  if (!quiz.questions[currentQuestion]) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm md:max-w-md w-full">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-xl md:text-2xl text-yellow-600"></i>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Question Not Found</h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">The current question could not be loaded.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz in progress
  const currentQuestionData = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h1 className="text-lg md:text-xl font-bold text-gray-800">{quiz.title}</h1>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-xs md:text-sm text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </div>
              <div className={`text-base md:text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                <i className="ri-time-line mr-1"></i>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-4">{currentQuestionData.question_text}</h2>

            {currentQuestionData.image_url && (
              <div className="mb-4 md:mb-6">
                <img
                  src={currentQuestionData.image_url}
                  alt="Question image"
                  className="max-w-full h-auto rounded-xl shadow-md"
                />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {currentQuestionData.options && Array.isArray(currentQuestionData.options) ? (
              currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-3 md:p-4 text-left border-2 rounded-xl transition-all duration-300 ${
                    answers[currentQuestion] === index + 1
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center mr-3 md:mr-4 ${
                        answers[currentQuestion] === index + 1 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}
                    >
                      {answers[currentQuestion] === index + 1 && <i className="ri-check-line text-white text-xs md:text-sm"></i>}
                    </div>
                    <span className="font-medium text-sm md:text-base">{option}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No options available for this question</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white px-4 md:px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer text-sm md:text-base"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Previous
            </button>

            <div className="text-xs md:text-sm text-gray-600 text-center">
              {Object.keys(answers).length} of {quiz.questions.length} answered
            </div>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={finishQuiz}
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 md:px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line mr-2"></i>
                    Finish Quiz
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer text-sm md:text-base"
              >
                Next
                <i className="ri-arrow-right-line ml-2"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
