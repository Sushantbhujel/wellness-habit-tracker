import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Activity, 
  Target, 
  BarChart3, 
  Plus, 
  TrendingUp, 
  Calendar,
  Clock,
  Award,
  Flame,
  BookOpen,
  Heart,
  Droplets
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalHabits: 0,
    activeHabits: 0,
    completedGoals: 0,
    currentStreak: 0,
    totalDays: 0
  });

  const [recentHabits, setRecentHabits] = useState([]);
  const [upcomingGoals, setUpcomingGoals] = useState([]);

  useEffect(() => {
    // TODO: Fetch actual data from API
    // For now, using mock data
    setStats({
      totalHabits: 8,
      activeHabits: 6,
      completedGoals: 3,
      currentStreak: 12,
      totalDays: 45
    });

    setRecentHabits([
      { id: 1, name: 'Study Session', category: 'study', completed: true, target: 2, current: 2.5, unit: 'hours' },
      { id: 2, name: 'Exercise', category: 'exercise', completed: false, target: 30, current: 20, unit: 'minutes' },
      { id: 3, name: 'Water Intake', category: 'water', completed: true, target: 8, current: 8, unit: 'glasses' },
      { id: 4, name: 'Sleep', category: 'sleep', completed: false, target: 8, current: 6, unit: 'hours' }
    ]);

    setUpcomingGoals([
      { id: 1, title: 'Complete 30 days of exercise', deadline: '2024-02-15', progress: 80 },
      { id: 2, title: 'Read 10 books this semester', deadline: '2024-05-01', progress: 60 },
      { id: 3, title: 'Maintain 8 hours sleep for a month', deadline: '2024-03-01', progress: 40 }
    ]);
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      study: BookOpen,
      exercise: Activity,
      sleep: Heart,
      water: Droplets,
      meditation: Activity,
      social: Activity
    };
    return icons[category] || Activity;
  };

  const getCategoryColor = (category) => {
    const colors = {
      study: 'text-blue-500',
      exercise: 'text-green-500',
      sleep: 'text-purple-500',
      water: 'text-cyan-500',
      meditation: 'text-indigo-500',
      social: 'text-pink-500'
    };
    return colors[category] || 'text-gray-500';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-primary-100">
          Let's continue your wellness journey. You're doing great!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Activity className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Habits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalHabits}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Habits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeHabits}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Goals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedGoals}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Flame className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.currentStreak} days</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDays}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/habits"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">
                Add Habit
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Track a new habit</p>
            </div>
            <Plus className="h-8 w-8 text-primary-600" />
          </div>
        </Link>

        <Link
          to="/goals"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">
                Set Goal
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Create a new goal</p>
            </div>
            <Target className="h-8 w-8 text-primary-600" />
          </div>
        </Link>

        <Link
          to="/progress"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">
                View Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-300">See your analytics</p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary-600" />
          </div>
        </Link>

        <Link
          to="/profile"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">
                Update Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Manage your settings</p>
            </div>
            <Award className="h-8 w-8 text-primary-600" />
          </div>
        </Link>
      </div>

      {/* Recent Activity and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Habits */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Today's Habits</h3>
            <p className="card-description">Track your daily progress</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentHabits.map((habit) => {
                const Icon = getCategoryIcon(habit.category);
                const progress = (habit.current / habit.target) * 100;
                
                return (
                  <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center">
                      <Icon className={`h-5 w-5 ${getCategoryColor(habit.category)} mr-3`} />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{habit.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {habit.current}/{habit.target} {habit.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      {habit.completed && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <Link
                to="/habits"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                View all habits →
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Goals */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Goals</h3>
            <p className="card-description">Track your goal progress</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {upcomingGoals.map((goal) => (
                <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Due {formatDate(goal.deadline)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {goal.progress}% complete
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/goals"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                View all goals →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
