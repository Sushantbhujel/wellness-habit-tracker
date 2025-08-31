import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Activity, 
  Target, 
  BarChart3, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Heart,
  Droplets,
  Brain
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Activity,
      title: 'Habit Tracking',
      description: 'Track your daily habits like studying, exercise, sleep, and more with easy-to-use interfaces.'
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Set short-term and long-term goals with milestones to keep you motivated and on track.'
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Visualize your progress with charts and graphs to understand your patterns and improvements.'
    },
    {
      icon: Users,
      title: 'Role-based Access',
      description: 'Students, teachers, and mentors can collaborate with different levels of access and features.'
    }
  ];

  const habitCategories = [
    { icon: BookOpen, name: 'Study', color: 'text-blue-500' },
    { icon: Activity, name: 'Exercise', color: 'text-green-500' },
    { icon: Heart, name: 'Sleep', color: 'text-purple-500' },
    { icon: Droplets, name: 'Water', color: 'text-cyan-500' },
    { icon: Brain, name: 'Meditation', color: 'text-indigo-500' },
    { icon: Users, name: 'Social', color: 'text-pink-500' },
  ];

  const benefits = [
    'Track multiple wellness habits in one place',
    'Set personalized goals with deadlines',
    'View detailed progress analytics',
    'Get motivational reminders and notifications',
    'Export your data for analysis',
    'Responsive design for all devices',
    'Dark and light theme support',
    'Secure authentication system'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Wellness Tracker</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Transform Your
            <span className="text-primary-600"> Wellness Journey</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            A comprehensive platform for students to track habits, set goals, and monitor progress 
            across all aspects of wellness - from study habits to physical fitness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <>
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline btn-lg"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Powerful features designed to help you build better habits and achieve your goals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white dark:bg-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Track Multiple Wellness Areas
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            From academic performance to physical health, track everything that matters
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {habitCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Icon className={`h-8 w-8 ${category.color}`} />
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor your {category.name.toLowerCase()} habits and track your progress over time.
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Wellness Tracker?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Built specifically for students and educational environments, our platform provides 
              everything you need to develop healthy habits and achieve your wellness goals.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-8">
            <div className="text-center">
              <Zap className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join thousands of students who are already transforming their wellness journey
              </p>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg w-full"
                >
                  Create Your Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">Wellness Tracker</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering students to build better habits and achieve their wellness goals
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Wellness Tracker. Created by Sushank Timilsena & Sushant Bhujel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
