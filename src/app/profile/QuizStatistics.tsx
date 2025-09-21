
'use client';

import { useState, useEffect } from 'react';

interface QuizStatisticsProps {
  user: any;
}

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  date: string;
  icon: string;
}

interface StatsData {
  totalQuizzes: number;
  totalParticipants: number;
  averageScore: number;
  completionRate: number;
  topPerformingQuiz: string;
  recentActivity: ActivityItem[];
}

export default function QuizStatistics({ user }: QuizStatisticsProps) {
  const [stats, setStats] = useState<StatsData>({
    totalQuizzes: 0,
    totalParticipants: 0,
    averageScore: 0,
    completionRate: 0,
    topPerformingQuiz: '',
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    loadStatistics();
  }, [mounted, timeRange]);

  const loadStatistics = async () => {
    setLoading(true);
    
    try {
      // Simulated data - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalQuizzes: 24,
        totalParticipants: 1284,
        averageScore: 78.5,
        completionRate: 92.3,
        topPerformingQuiz: 'JavaScript Fundamentals',
        recentActivity: [
          { id: 1, type: 'quiz_created', title: 'React Advanced Concepts', date: '2024-01-15', icon: 'ri-add-circle-line' },
          { id: 2, type: 'high_score', title: 'New high score in Python Basics', date: '2024-01-14', icon: 'ri-trophy-line' },
          { id: 3, type: 'participant_milestone', title: '1000+ participants reached', date: '2024-01-12', icon: 'ri-user-star-line' },
          { id: 4, type: 'quiz_updated', title: 'Updated HTML/CSS Quiz', date: '2024-01-10', icon: 'ri-edit-line' },
          { id: 5, type: 'quiz_shared', title: 'Data Structures quiz shared 50+ times', date: '2024-01-08', icon: 'ri-share-line' }
        ]
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-24 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 h-16 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Statistics</h2>
            <p className="text-gray-600">Track your quiz performance and engagement</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 pr-8 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Quizzes</p>
              <p className="text-3xl font-bold">{stats.totalQuizzes}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-file-list-3-line text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <i className="ri-arrow-up-line text-green-300 mr-1"></i>
            <span className="text-green-300 text-sm">+3 this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Participants</p>
              <p className="text-3xl font-bold">{stats.totalParticipants.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <i className="ri-arrow-up-line text-green-300 mr-1"></i>
            <span className="text-green-300 text-sm">+127 this week</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Average Score</p>
              <p className="text-3xl font-bold">{stats.averageScore}%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-trophy-line text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <i className="ri-arrow-up-line text-green-300 mr-1"></i>
            <span className="text-green-300 text-sm">+2.3% improvement</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold">{stats.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-check-circle-line text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <i className="ri-arrow-up-line text-green-300 mr-1"></i>
            <span className="text-green-300 text-sm">Excellent rate!</span>
          </div>
        </div>
      </div>

      {/* Top Performing Quiz */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Quiz</h3>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
            <i className="ri-star-line text-2xl text-white"></i>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">{stats.topPerformingQuiz}</h4>
            <p className="text-gray-600">521 participants • 85.2% average score • 96% completion rate</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <i className={`${activity.icon} text-blue-600`}></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
                <div className="text-gray-400">
                  <i className="ri-arrow-right-s-line"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <i className="ri-bar-chart-line text-4xl text-gray-400 mb-2"></i>
            <p className="text-gray-600">Performance charts coming soon</p>
            <p className="text-sm text-gray-500">Advanced analytics and insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}
