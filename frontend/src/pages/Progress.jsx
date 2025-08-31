import { useState, useEffect } from 'react';
import { Plus, BarChart3, Edit, Trash2, Calendar, X, Save, Loader2, TrendingUp, Clock, Target, Award, Activity } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { progressAPI, habitsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Progress = () => {
  const [progressEntries, setProgressEntries] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [stats, setStats] = useState({
    totalEntries: 0,
    completed: 0,
    completionRate: 0,
    averageValue: 0,
    currentStreak: 0,
    bestHabit: '',
    worstHabit: '',
    totalTimeSpent: 0,
    averageMood: 'good',
    consistencyScore: 0
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  const selectedHabit = watch('habitId');

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const moods = [
    { value: 'excellent', label: '😊 Excellent', color: 'text-green-600' },
    { value: 'good', label: '🙂 Good', color: 'text-blue-600' },
    { value: 'okay', label: '😐 Okay', color: 'text-yellow-600' },
    { value: 'poor', label: '😞 Poor', color: 'text-red-600' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'text-green-600' },
    { value: 'moderate', label: 'Moderate', color: 'text-yellow-600' },
    { value: 'hard', label: 'Hard', color: 'text-red-600' }
  ];

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [progressResponse, habitsResponse, statsResponse] = await Promise.all([
        progressAPI.getAll({ period: selectedPeriod }),
        habitsAPI.getAll(),
        progressAPI.getSummary()
      ]);
      
      console.log('Progress API response:', progressResponse);
      console.log('Habits API response:', habitsResponse);
      console.log('Stats API response:', statsResponse);
      
      // Handle different response structures
      setProgressEntries(Array.isArray(progressResponse.data) ? progressResponse.data : 
                        Array.isArray(progressResponse.data.progress) ? progressResponse.data.progress : []);
      
      setHabits(Array.isArray(habitsResponse.data) ? habitsResponse.data : 
                Array.isArray(habitsResponse.data.habits) ? habitsResponse.data.habits : []);
      
      const progressData = Array.isArray(progressResponse.data) ? progressResponse.data : 
                          Array.isArray(progressResponse.data.progress) ? progressResponse.data.progress : [];
      const habitsData = Array.isArray(habitsResponse.data) ? habitsResponse.data : 
                        Array.isArray(habitsResponse.data.habits) ? habitsResponse.data.habits : [];
      
      setProgressEntries(progressData);
      setHabits(habitsData);
      
      // Calculate analytics from the data
      const calculatedStats = calculateAnalytics(progressData, habitsData);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load progress data');
      // Set empty arrays on error
      setProgressEntries([]);
      setHabits([]);
      setStats({
        totalEntries: 0,
        completed: 0,
        completionRate: 0,
        averageValue: 0,
        currentStreak: 0,
        bestHabit: '',
        worstHabit: '',
        totalTimeSpent: 0,
        averageMood: 'good',
        consistencyScore: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      const progressData = {
        habitId: data.habitId,
        date: data.date,
        value: parseFloat(data.value),
        unit: data.unit,
        completed: data.completed === 'true',
        notes: data.notes,
        mood: data.mood,
        difficulty: data.difficulty,
        timeSpent: data.timeSpent ? parseInt(data.timeSpent) : null,
        location: data.location,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
      };

      if (editingEntry) {
        await progressAPI.update(editingEntry._id, progressData);
        toast.success('Progress entry updated successfully!');
      } else {
        await progressAPI.create(progressData);
        toast.success('Progress logged successfully!');
      }

      setShowAddModal(false);
      setEditingEntry(null);
      reset();
      fetchData();
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error(editingEntry ? 'Failed to update entry' : 'Failed to log progress');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setValue('habitId', entry.habitId);
    setValue('date', entry.date?.split('T')[0]);
    setValue('value', entry.value);
    setValue('unit', entry.unit);
    setValue('completed', entry.completed.toString());
    setValue('notes', entry.notes);
    setValue('mood', entry.mood);
    setValue('difficulty', entry.difficulty);
    setValue('timeSpent', entry.timeSpent);
    setValue('location', entry.location);
    setValue('tags', entry.tags?.join(', '));
    setShowAddModal(true);
  };

  const handleDelete = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this progress entry?')) {
      try {
        await progressAPI.delete(entryId);
        toast.success('Progress entry deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting entry:', error);
        toast.error('Failed to delete entry');
      }
    }
  };

  const openAddModal = () => {
    setEditingEntry(null);
    reset();
    setValue('date', new Date().toISOString().split('T')[0]);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingEntry(null);
    reset();
  };

  const getHabitName = (habitId) => {
    const habit = habits.find(h => h._id === habitId);
    return habit ? habit.name : 'Unknown Habit';
  };

  const getHabitCategory = (habitId) => {
    const habit = habits.find(h => h._id === habitId);
    return habit ? habit.category : 'unknown';
  };

  const getCategoryColor = (category) => {
    const colors = {
      study: 'bg-blue-100 text-blue-800',
      exercise: 'bg-green-100 text-green-800',
      sleep: 'bg-purple-100 text-purple-800',
      water: 'bg-cyan-100 text-cyan-800',
      meditation: 'bg-indigo-100 text-indigo-800',
      social: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getMoodColor = (mood) => {
    const moodObj = moods.find(m => m.value === mood);
    return moodObj ? moodObj.color : 'text-gray-600';
  };

  const getDifficultyColor = (difficulty) => {
    const diffObj = difficulties.find(d => d.value === difficulty);
    return diffObj ? diffObj.color : 'text-gray-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateAnalytics = (entries, habitsList) => {
    if (!Array.isArray(entries) || entries.length === 0) {
      return {
        totalEntries: 0,
        completed: 0,
        completionRate: 0,
        averageValue: 0,
        currentStreak: 0,
        bestHabit: '',
        worstHabit: '',
        totalTimeSpent: 0,
        averageMood: 'good',
        consistencyScore: 0
      };
    }

    const completed = entries.filter(entry => entry.completed).length;
    const totalEntries = entries.length;
    const completionRate = totalEntries > 0 ? Math.round((completed / totalEntries) * 100) : 0;
    const averageValue = entries.reduce((sum, entry) => sum + (entry.value || 0), 0) / totalEntries;
    const totalTimeSpent = entries.reduce((sum, entry) => sum + (entry.timeSpent || 0), 0);

    // Calculate habit performance
    const habitStats = {};
    entries.forEach(entry => {
      const habitName = getHabitName(entry.habitId);
      if (!habitStats[habitName]) {
        habitStats[habitName] = { completed: 0, total: 0, value: 0 };
      }
      habitStats[habitName].total++;
      if (entry.completed) habitStats[habitName].completed++;
      habitStats[habitName].value += entry.value || 0;
    });

    const bestHabit = Object.keys(habitStats).reduce((best, habit) => {
      const rate = habitStats[habit].completed / habitStats[habit].total;
      const bestRate = habitStats[best] ? habitStats[best].completed / habitStats[best].total : 0;
      return rate > bestRate ? habit : best;
    }, '');

    const worstHabit = Object.keys(habitStats).reduce((worst, habit) => {
      const rate = habitStats[habit].completed / habitStats[habit].total;
      const worstRate = habitStats[worst] ? habitStats[worst].completed / habitStats[worst].total : 1;
      return rate < worstRate ? habit : worst;
    }, '');

    // Calculate average mood
    const moodValues = { excellent: 4, good: 3, okay: 2, poor: 1 };
    const moodEntries = entries.filter(entry => entry.mood);
    const averageMoodValue = moodEntries.length > 0 
      ? moodEntries.reduce((sum, entry) => sum + (moodValues[entry.mood] || 0), 0) / moodEntries.length 
      : 3;
    
    const averageMood = Object.keys(moodValues).find(mood => moodValues[mood] === Math.round(averageMoodValue)) || 'good';

    // Calculate consistency score (based on daily completion)
    const dates = [...new Set(entries.map(entry => entry.date?.split('T')[0]))];
    const consistencyScore = dates.length > 0 ? Math.round((completed / dates.length) * 100) : 0;

    return {
      totalEntries,
      completed,
      completionRate,
      averageValue: Math.round(averageValue * 10) / 10,
      currentStreak: 0, // This would need more complex calculation
      bestHabit,
      worstHabit,
      totalTimeSpent,
      averageMood,
      consistencyScore
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and analyze your habit progress
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Progress
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex space-x-2">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === period.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEntries}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-sm font-bold">%</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 text-sm font-bold">Ø</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Average Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageValue}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-orange-600 text-sm font-bold">🔥</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.currentStreak}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Best Habit</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.bestHabit || 'None yet'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Needs Improvement</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.worstHabit || 'None yet'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Time</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.totalTimeSpent} min
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Consistency</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.consistencyScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Trend */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Progress Trend - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
        </h3>
        <div className="space-y-4">
          {Array.isArray(progressEntries) && progressEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Completion Rate</h4>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stats.completed} of {stats.totalEntries} tasks completed
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Consistency Score</h4>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${stats.consistencyScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stats.consistencyScore}% consistency achieved
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No progress data available for {selectedPeriod}. Start logging your progress to see trends!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Entries */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Progress ({progressEntries.length} entries)
        </h2>
        
        {progressEntries.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No progress entries yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start tracking your progress by logging your first entry
            </p>
            <button 
              onClick={openAddModal}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Your First Entry
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {Array.isArray(progressEntries) && progressEntries.map((entry) => (
              <div key={entry._id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white mr-2">
                        {getHabitName(entry.habitId)}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(getHabitCategory(entry.habitId))}`}>
                        {getHabitCategory(entry.habitId)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">Value</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {entry.value} {entry.unit}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">Status</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          entry.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.completed ? 'Completed' : 'Incomplete'}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">Mood</p>
                        <p className={`font-medium ${getMoodColor(entry.mood)}`}>
                          {moods.find(m => m.value === entry.mood)?.label || entry.mood}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                      {entry.timeSpent && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">Time Spent</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.timeSpent} min
                          </p>
                        </div>
                      )}
                      
                      {entry.difficulty && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">Difficulty</p>
                          <p className={`font-medium ${getDifficultyColor(entry.difficulty)}`}>
                            {difficulties.find(d => d.value === entry.difficulty)?.label || entry.difficulty}
                          </p>
                        </div>
                      )}
                      
                      {entry.location && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">Location</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.location}
                          </p>
                        </div>
                      )}
                      
                      {entry.tags && entry.tags.length > 0 && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">Tags</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {entry.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Notes</p>
                        <p className="text-sm text-gray-900 dark:text-white">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => handleEdit(entry)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(entry._id)}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Progress Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingEntry ? 'Edit Progress' : 'Log Progress'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Habit *
                </label>
                <select
                  {...register('habitId', { required: 'Habit is required' })}
                  className="input w-full"
                >
                  <option value="">Select a habit</option>
                  {Array.isArray(habits) && habits.map((habit) => (
                    <option key={habit._id} value={habit._id}>
                      {habit.name} ({habit.category})
                    </option>
                  ))}
                </select>
                {errors.habitId && (
                  <p className="text-red-500 text-sm mt-1">{errors.habitId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                    className="input w-full"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Value *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('value', { 
                      required: 'Value is required',
                      min: { value: 0, message: 'Value must be positive' }
                    })}
                    className="input w-full"
                    placeholder="e.g., 30"
                  />
                  {errors.value && (
                    <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    {...register('unit')}
                    className="input w-full"
                    placeholder="e.g., minutes, glasses"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Completed *
                  </label>
                  <select
                    {...register('completed', { required: 'Completion status is required' })}
                    className="input w-full"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                  {errors.completed && (
                    <p className="text-red-500 text-sm mt-1">{errors.completed.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mood
                </label>
                <select
                  {...register('mood')}
                  className="input w-full"
                >
                  <option value="">Select mood</option>
                  {moods.map((mood) => (
                    <option key={mood.value} value={mood.value}>
                      {mood.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  {...register('difficulty')}
                  className="input w-full"
                >
                  <option value="">Select difficulty</option>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Spent (minutes)
                  </label>
                  <input
                    type="number"
                    {...register('timeSpent')}
                    className="input w-full"
                    placeholder="e.g., 30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    {...register('location')}
                    className="input w-full"
                    placeholder="e.g., Home, Gym, Office"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="input w-full"
                  placeholder="e.g., morning, workout, study (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  className="input w-full"
                  rows="3"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-outline flex-1"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {editingEntry ? 'Update' : 'Log'} Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
