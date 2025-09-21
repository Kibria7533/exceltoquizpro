
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileHeader from './ProfileHeader';
import AccountSettings from './AccountSettings';
import SecuritySettings from './SecuritySettings';
import QuizStatistics from './QuizStatistics';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('account');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
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
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, mounted]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ProfileHeader user={user} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/dashboard" className="hover:text-blue-600 cursor-pointer">
              Dashboard
            </Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900 font-medium">Profile</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors duration-200 cursor-pointer ${
                    activeTab === 'account'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-user-line mr-3 text-lg"></i>
                  Account Settings
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors duration-200 cursor-pointer ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-shield-line mr-3 text-lg"></i>
                  Security
                </button>
                
                <button
                  onClick={() => setActiveTab('statistics')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors duration-200 cursor-pointer ${
                    activeTab === 'statistics'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-bar-chart-line mr-3 text-lg"></i>
                  Statistics
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg">
              {activeTab === 'account' && <AccountSettings user={user} setUser={setUser} />}
              {activeTab === 'security' && <SecuritySettings user={user} />}
              {activeTab === 'statistics' && <QuizStatistics user={user} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
