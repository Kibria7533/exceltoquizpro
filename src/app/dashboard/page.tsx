
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from './DashboardHeader';
import QuizUpload from './QuizUpload';
import QuizList from './QuizList';
import RecentActivity from './RecentActivity';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upload');
  const [user, setUser] = useState<any>(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || authChecked) return;
    
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      const sessionData = localStorage.getItem('session');
      
      if (!userData || !sessionData) {
        router.push('/login');
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        const parsedSession = JSON.parse(sessionData);
        
        if (!parsedUser || !parsedSession.access_token) {
          router.push('/login');
          return;
        }
        
        setUser(parsedUser);
        setAuthChecked(true);
        loadQuizzes();
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, mounted, authChecked]);

  const loadQuizzes = async () => {
    if (!mounted) return;
    
    try {
      setLoading(true);
      
      const session = localStorage.getItem('session');
      if (!session) {
        setLoading(false);
        return;
      }

      let sessionData;
      let token;
      
      try {
        sessionData = JSON.parse(session);
        token = sessionData.access_token;
        
        if (!token) {
          setLoading(false);
          return;
        }
      } catch (parseError) {
        console.error('Session parse error:', parseError);
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-user-quizzes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      } else {
        console.error('Failed to fetch quizzes, status:', response.status);
        
        if (response.status === 401) {
          localStorage.removeItem('session');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        
        setQuizzes([]);
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (!mounted) return;
    
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    localStorage.removeItem('supabase_session');
    localStorage.removeItem('user_data');
    router.push('/login');
  };

  const handleQuizCreated = () => {
    setActiveTab('quizzes');
    loadQuizzes();
  };

  // Show loading only when auth is not checked yet
  if (!mounted || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Create amazing multilingual quizzes from your Excel files
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{quizzes.length}</p>
                <p className="text-sm sm:text-base text-gray-600">Total Quizzes</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-file-list-3-line text-lg sm:text-xl text-blue-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">50+</p>
                <p className="text-sm sm:text-base text-gray-600">Languages Supported</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="ri-global-line text-lg sm:text-xl text-purple-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">∞</p>
                <p className="text-sm sm:text-base text-gray-600">Storage Space</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-cloud-line text-lg sm:text-xl text-green-600"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap cursor-pointer ${
                  activeTab === 'upload'
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                data-tab="upload"
              >
                <i className="ri-upload-cloud-2-line mr-2"></i>
                Upload Quiz
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap cursor-pointer ${
                  activeTab === 'quizzes'
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="ri-file-list-3-line mr-2"></i>
                My Quizzes
              </button>
              <button
                onClick={() => setActiveTab('leaderboards')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap cursor-pointer ${
                  activeTab === 'leaderboards'
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="ri-trophy-line mr-2"></i>
                Leaderboards
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'upload' && <QuizUpload onQuizCreated={handleQuizCreated} />}
            {activeTab === 'quizzes' && (
              loading ? (
                <div className="text-center py-8">
                  <i className="ri-loader-4-line text-2xl text-blue-600 animate-spin mb-2"></i>
                  <p className="text-gray-600">Loading quizzes...</p>
                </div>
              ) : (
                <QuizList quizzes={quizzes} onUpdate={loadQuizzes} />
              )
            )}
            {activeTab === 'leaderboards' && <RecentActivity />}
          </div>
        </div>
      </div>
    </div>
  );
}
