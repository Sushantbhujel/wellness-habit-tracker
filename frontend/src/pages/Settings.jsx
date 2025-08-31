import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Settings as SettingsIcon, Moon, Sun, Bell, Shield, Download } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: user?.profile?.preferences?.notifications?.email ?? true,
    push: user?.profile?.preferences?.notifications?.push ?? true
  });

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your app preferences and account settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <SettingsIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="card-title">Appearance</h3>
            </div>
            <p className="card-description">Customize the look and feel of the application</p>
          </div>
          <div className="card-content space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Theme</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Choose between light and dark mode
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'light' ? (
                  <>
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <Bell className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="card-title">Notifications</h3>
            </div>
            <p className="card-description">Manage your notification preferences</p>
          </div>
          <div className="card-content space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Receive updates and reminders via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get instant notifications in your browser
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => handleNotificationChange('push')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <Download className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="card-title">Data Export</h3>
            </div>
            <p className="card-description">Export your data for backup or analysis</p>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Export Progress Data</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Download your habit and goal progress as CSV
                </p>
              </div>
              <button className="btn btn-outline btn-sm">
                Export CSV
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Export Report</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Generate a detailed PDF report of your progress
                </p>
              </div>
              <button className="btn btn-outline btn-sm">
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="card-title">Privacy & Security</h3>
            </div>
            <p className="card-description">Manage your privacy and security settings</p>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Change Password</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Update your account password
                </p>
              </div>
              <button className="btn btn-outline btn-sm">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Delete Account</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Permanently delete your account and all data
                </p>
              </div>
              <button className="btn btn-outline btn-sm text-red-600 hover:text-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Account Information</h3>
          <p className="card-description">Your account details and membership information</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account ID
              </label>
              <p className="text-gray-900 dark:text-white font-mono text-sm">
                {user?._id || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Member Since
              </label>
              <p className="text-gray-900 dark:text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Login
              </label>
              <p className="text-gray-900 dark:text-white">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Status
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
