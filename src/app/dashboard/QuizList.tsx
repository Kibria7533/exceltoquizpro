
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions_count: number;
  language: string;
  time_limit: number;
  created_at: string;
  status: string;
  is_published: boolean;
  share_link?: string;
}

interface QuizListProps {
  quizzes: Quiz[];
  onUpdate: () => void;
}

export default function QuizList({ quizzes, onUpdate }: QuizListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [localQuizzes, setLocalQuizzes] = useState<Quiz[]>(quizzes);
  const itemsPerPage = 6;

  useEffect(() => {
    setLocalQuizzes(quizzes);
  }, [quizzes]);

  const displayQuizzes = localQuizzes.length > 0 ? localQuizzes : quizzes;

  const filteredQuizzes = displayQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || quiz.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuizzes = filteredQuizzes.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    setCurrentPage(1);
  };

  const getLanguageLabel = (lang: string) => {
    const languages: { [key: string]: string } = {
      'en': 'English',
      'bn': 'বাংলা',
      'hi': 'हिंदी',
      'auto': 'Auto-detect',
      'mixed': 'Mixed'
    };
    return languages[lang] || lang;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Modified handlePublish with authentication
  const handlePublish = async (quizId: string) => {
    try {
      // Get user token for authentication
      const session = localStorage.getItem('session');
      if (!session) {
        alert('Please log in to publish quizzes');
        return;
      }

      let token;
      try {
        const sessionData = JSON.parse(session);
        token = sessionData.access_token;
        if (!token) {
          alert('Authentication error. Please log in again.');
          return;
        }
      } catch (parseError) {
        alert('Session error. Please log in again.');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/publish-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        },
        body: JSON.stringify({ quiz_id: quizId })
      });

      if (response.ok) {
        const data = await response.json();
        setShowShareModal(data.share_link);
        onUpdate();
        alert('Quiz published successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to publish quiz: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish quiz. Please try again.');
    }
  };

  const copyShareLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Share link copied to clipboard!');
  };

  // Modified handleDelete with authentication and edge function
  const handleDelete = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      // Get user token for authentication
      const session = localStorage.getItem('session');
      if (!session) {
        alert('Please log in to delete quizzes');
        return;
      }

      let token;
      try {
        const sessionData = JSON.parse(session);
        token = sessionData.access_token;
        if (!token) {
          alert('Authentication error. Please log in again.');
          return;
        }
      } catch (parseError) {
        alert('Session error. Please log in again.');
        return;
      }

      // Use Supabase Edge Function for deletion
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        },
        body: JSON.stringify({ quiz_id: quizId })
      });

      if (response.ok) {
        onUpdate();
        alert('Quiz deleted successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to delete quiz: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-questionnaire-line text-3xl text-gray-400"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No quizzes yet</h3>
        <p className="text-gray-500 mb-6">Upload your first Excel file to create a quiz</p>
        <button
          onClick={() => {
            const uploadTab = document.querySelector('[data-tab="upload"]') as HTMLElement;
            uploadTab?.click();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-upload-cloud-2-line mr-2"></i>
          Create Your First Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>

        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
        >
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
          <option value="hi">हिंदी</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {quiz.description}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    quiz.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {quiz.status}
                  </span>
                  {quiz.is_published && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Published
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Questions:</span>
                  <span className="font-medium text-gray-700">{quiz.questions_count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Language:</span>
                  <span className="font-medium text-gray-700">{getLanguageLabel(quiz.language)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Time Limit:</span>
                  <span className="font-medium text-gray-700">{quiz.time_limit} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium text-gray-700">{formatDate(quiz.created_at)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Link
                    href={`/quiz/${quiz.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl text-sm font-semibold transition-colors duration-300 text-center whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-play-circle-line mr-1"></i>
                    Take Quiz
                  </Link>
                  
                  {!quiz.is_published ? (
                    <button
                      onClick={() => handlePublish(quiz.id)}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-xl text-sm font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-share-line mr-1"></i>
                      Publish
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowShareModal(quiz.share_link || '')}
                      className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 px-4 rounded-xl text-sm font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-link mr-1"></i>
                      Share
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 py-2 px-3 rounded-xl text-sm font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line"></i>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Share Quiz</h3>
            <p className="text-gray-600 mb-4">Share this link with others to let them take your quiz:</p>
            
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={showShareModal}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
              />
              <button
                onClick={() => copyShareLink(showShareModal)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-file-copy-line"></i>
              </button>
            </div>
            
            <button
              onClick={() => setShowShareModal(null)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors duration-300 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {filteredQuizzes.length === 0 && quizzes.length > 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-search-line text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No quizzes found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
