import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Target, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  X,
  Activity,
  BookOpen,
  Heart,
  Droplets,
  Brain,
  Users,
  Zap
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview of your wellness journey'
    },
    {
      name: 'Habits',
      href: '/habits',
      icon: Activity,
      description: 'Track your daily habits'
    },
    {
      name: 'Goals',
      href: '/goals',
      icon: Target,
      description: 'Set and monitor your goals'
    },
    {
      name: 'Progress',
      href: '/progress',
      icon: BarChart3,
      description: 'View your progress analytics'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Manage your profile'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'App preferences and settings'
    }
  ];

  const habitCategories = [
    { name: 'Study', icon: BookOpen, color: 'text-blue-500' },
    { name: 'Exercise', icon: Activity, color: 'text-green-500' },
    { name: 'Sleep', icon: Heart, color: 'text-purple-500' },
    { name: 'Water', icon: Droplets, color: 'text-cyan-500' },
    { name: 'Meditation', icon: Brain, color: 'text-indigo-500' },
    { name: 'Social', icon: Users, color: 'text-pink-500' },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {/* Logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">Wellness</span>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`}
                      title={item.description}
                    >
                      <Icon
                        className={`mr-3 h-5 w-5 ${
                          isActive(item.href)
                            ? 'text-primary-500'
                            : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              {/* Habit Categories */}
              <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Habit Categories
                </h3>
                <div className="mt-2 space-y-1">
                  {habitCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div
                        key={category.name}
                        className="flex items-center px-2 py-1 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <Icon className={`mr-2 h-4 w-4 ${category.color}`} />
                        {category.name}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Logout */}
              <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={logout}
                  className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-primary-600">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">Wellness</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-white hover:bg-primary-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive(item.href)
                          ? 'text-primary-500'
                          : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* Logout */}
            <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
