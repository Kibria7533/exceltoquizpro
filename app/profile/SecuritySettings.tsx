
'use client';

import { useState, useEffect } from 'react';

interface SecuritySettingsProps {
  user: any;
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [mounted, setMounted] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handlePasswordChange = async () => {
    if (!mounted) return;
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulated password change - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (!mounted) return;
    
    if (!confirm('Are you sure you want to log out from all devices? You will need to sign in again.')) {
      return;
    }

    try {
      // Simulated logout all devices - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.removeItem('user');
      localStorage.removeItem('session');
      localStorage.removeItem('supabase_session');
      localStorage.removeItem('user_data');
      
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      setMessage({ type: 'error', text: 'Failed to log out from all devices. Please try again.' });
    }
  };

  if (!mounted) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2>
        <p className="text-gray-600">Manage your account security and privacy</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <div className="flex items-center">
            <i className={`mr-2 ${
              message.type === 'success' ? 'ri-check-circle-line' : 'ri-error-warning-line'
            }`}></i>
            {message.text}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Password Change Section */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className={`${showPasswords.current ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className={`${showPasswords.new ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className={`${showPasswords.confirm ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handlePasswordChange}
                disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                {saving ? (
                  <div className="flex items-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Updating Password...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <i className="ri-lock-line mr-2"></i>
                    Update Password
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Account Security Section */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-orange-600 font-medium mr-3">Coming Soon</span>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Login Notifications</h4>
                <p className="text-sm text-gray-600">Get notified when someone signs into your account</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-green-600 font-medium mr-3">Enabled</span>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform duration-200"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Session Management</h4>
                <p className="text-sm text-gray-600">Log out from all devices except this one</p>
              </div>
              <button
                onClick={handleLogoutAllDevices}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-logout-circle-line mr-2"></i>
                Logout All Devices
              </button>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl">
              <div className="flex items-center">
                <i className="ri-calendar-line text-blue-600 mr-3"></i>
                <div>
                  <p className="text-sm text-gray-600">Account Created</p>
                  <p className="font-medium text-gray-900">{new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <div className="flex items-center">
                <i className="ri-time-line text-green-600 mr-3"></i>
                <div>
                  <p className="text-sm text-gray-600">Last Login</p>
                  <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <div className="flex items-center">
                <i className="ri-mail-line text-purple-600 mr-3"></i>
                <div>
                  <p className="text-sm text-gray-600">Email Status</p>
                  <p className="font-medium text-green-600 flex items-center">
                    <i className="ri-check-circle-line mr-1"></i>
                    Verified
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <div className="flex items-center">
                <i className="ri-shield-check-line text-blue-600 mr-3"></i>
                <div>
                  <p className="text-sm text-gray-600">Account Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
