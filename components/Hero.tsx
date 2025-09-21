
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const sessionData = localStorage.getItem('session');
    
    if (userData && sessionData) {
      try {
        const parsedUser = JSON.parse(userData);
        const parsedSession = JSON.parse(sessionData);
        
        if (parsedUser && parsedSession.access_token) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    }
  }, []);

  const handleStartCreating = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20digital%20learning%20platform%20with%20diverse%20students%20using%20tablets%20and%20computers%2C%20multilingual%20quiz%20interface%20showing%20Bengali%20and%20Hindi%20text%2C%20clean%20educational%20technology%20environment%20with%20bright%20colors%20and%20collaborative%20atmosphere&width=1920&height=1080&seq=hero-bg&orientation=landscape')`
        }}
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
      
      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-600"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 sm:mb-12">
          <h1 className="font-['Pacifico'] text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white mb-4 sm:mb-6">
            ExcelToQuiz
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
            Transform your Excel files into interactive multilingual quizzes instantly. 
            Support for Bangla, Hindi & 50+ languages.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
          <button 
            onClick={handleStartCreating}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-2xl whitespace-nowrap cursor-pointer"
          >
            <i className="ri-upload-cloud-2-line mr-2"></i>
            {mounted && isLoggedIn ? 'Go to Dashboard' : 'Start Creating Quizzes'}
          </button>
          
          {mounted && !isLoggedIn && (
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-white/20 transition-all duration-300 whitespace-nowrap cursor-pointer">
                <i className="ri-login-box-line mr-2"></i>
                Sign In
              </button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <i className="ri-file-upload-line text-xl sm:text-2xl text-white"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">One Feature</h3>
            <p className="text-sm sm:text-base text-blue-100">Upload Excel, get quiz. Simple as that.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <i className="ri-global-line text-xl sm:text-2xl text-white"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Multilingual</h3>
            <p className="text-sm sm:text-base text-blue-100">Bangla, Hindi, English & more supported.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <i className="ri-gift-line text-xl sm:text-2xl text-white"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Free Forever</h3>
            <p className="text-sm sm:text-base text-blue-100">No hidden costs. No limits. Always free.</p>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 px-4">
          <p className="text-sm sm:text-base text-blue-200 mb-4 sm:mb-6">
            Trusted by educators and trainers worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-60">
            <div className="text-xs sm:text-sm text-white font-semibold bg-white/10 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
              🌍 50+ Languages
            </div>
            <div className="text-xs sm:text-sm text-white font-semibold bg-white/10 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
              📊 Excel Compatible
            </div>
            <div className="text-xs sm:text-sm text-white font-semibold bg-white/10 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
              ⚡ Instant Generation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
