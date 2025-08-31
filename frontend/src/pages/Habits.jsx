import { useState, useEffect } from 'react';
import { Plus, Activity, Edit, Trash2, Eye, X, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { habitsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  const selectedCategory = watch('category');

  const habitCategories = [
    { value: 'study', label: 'Study', color: 'bg-blue-100 text-blue-800', icon: '📚' },
    { value: 'exercise', label: 'Exercise', color: 'bg-green-100 text-green-800', icon: '💪' },
    { value: 'sleep', label: 'Sleep', color: 'bg-purple-100 text-purple-800', icon: '😴' },
    { value: 'water', label: 'Water', color: 'bg-cyan-100 text-cyan-800', icon: '💧' },
    { value: 'meditation', label: 'Meditation', color: 'bg-indigo-100 text-indigo-800', icon: '🧘' },
    { value: 'social', label: 'Social', color: 'bg-pink-100 text-pink-800', icon: '👥' },
    { value: 'nutrition', label: 'Nutrition', color: 'bg-orange-100 text-orange-800', icon: '🥗' },
    { value: 'reading', label: 'Reading', color: 'bg-yellow-100 text-yellow-800', icon: '📖' }
  ];

  const units = [
    { value: 'times', label: 'Times' },
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'glasses', label: 'Glasses' },
    { value: 'pages', label: 'Pages' },
    { value: 'sets', label: 'Sets' },
    { value: 'reps', label: 'Reps' },
    { value: 'steps', label: 'Steps' }
  ];

  // Fetch habits on component mount
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await habitsAPI.getAll();
      console.log('Habits API response:', response);
      // Ensure habits is always an array - backend returns { habits: [...] }
      setHabits(Array.isArray(response.data.habits) ? response.data.habits : []);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
      // Set empty array on error
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      const habitData = {
        name: data.name,
        category: data.category,
        target: parseInt(data.target),
        unit: data.unit,
        color: data.color || '#3B82F6',
        icon: data.icon || 'Activity',
        active: true,
        reminders: data.reminders ? {
          enabled: true,
          time: data.reminderTime || '09:00'
        } : { enabled: false }
      };

      if (editingHabit) {
        await habitsAPI.update(editingHabit._id, habitData);
        toast.success('Habit updated successfully!');
      } else {
        await habitsAPI.create(habitData);
        toast.success('Habit created successfully!');
      }

      setShowAddModal(false);
      setEditingHabit(null);
      reset();
      fetchHabits();
    } catch (error) {
      console.error('Error saving habit:', error);
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      } else {
        toast.error(editingHabit ? 'Failed to update habit' : 'Failed to create habit');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setValue('name', habit.name);
    setValue('category', habit.category);
    setValue('target', habit.target);
    setValue('unit', habit.unit);
    setValue('color', habit.color);
    setValue('icon', habit.icon);
    setValue('reminders', habit.reminders?.enabled);
    setValue('reminderTime', habit.reminders?.time);
    setShowAddModal(true);
  };

  const handleDelete = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await habitsAPI.delete(habitId);
        toast.success('Habit deleted successfully!');
        fetchHabits();
      } catch (error) {
        console.error('Error deleting habit:', error);
        toast.error('Failed to delete habit');
      }
    }
  };

  const handleToggle = async (habitId) => {
    try {
      await habitsAPI.toggle(habitId);
      toast.success('Habit status updated!');
      fetchHabits();
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast.error('Failed to update habit status');
    }
  };

  const openAddModal = () => {
    setEditingHabit(null);
    reset();
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingHabit(null);
    reset();
  };

  const getCategoryColor = (category) => {
    const cat = habitCategories.find(c => c.value === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category) => {
    const cat = habitCategories.find(c => c.value === category);
    return cat ? cat.icon : '📋';
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Habits</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage your daily habits ({habits.length} total)
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No habits yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Start building healthy habits by creating your first one
          </p>
          <button 
            onClick={openAddModal}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(habits) && habits.map((habit) => (
            <div key={habit._id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                    <span className="text-lg">{getCategoryIcon(habit.category)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{habit.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(habit.category)}`}>
                      {habitCategories.find(c => c.value === habit.category)?.label || habit.category}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleToggle(habit._id)}
                    className={`p-1 rounded ${habit.active ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                    title={habit.active ? 'Deactivate' : 'Activate'}
                  >
                    <div className={`w-3 h-3 rounded-full ${habit.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </button>
                  <button 
                    onClick={() => handleEdit(habit)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(habit._id)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Target</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {habit.target} {habit.unit}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Current Streak</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {habit.currentStreak || 0} days
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    habit.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {habit.active ? 'Active' : 'Inactive'}
                  </span>
                  {habit.reminders?.enabled && (
                    <span className="text-xs text-gray-500">
                      ⏰ {habit.reminders.time}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingHabit ? 'Edit Habit' : 'Add New Habit'}
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
                  Habit Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Habit name is required' })}
                  className="input w-full"
                  placeholder="e.g., Study Session, Exercise, Water Intake"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input w-full"
                >
                  <option value="">Select a category</option>
                  {habitCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target *
                  </label>
                  <input
                    type="number"
                    {...register('target', { 
                      required: 'Target is required',
                      min: { value: 1, message: 'Target must be at least 1' }
                    })}
                    className="input w-full"
                    placeholder="e.g., 30"
                  />
                  {errors.target && (
                    <p className="text-red-500 text-sm mt-1">{errors.target.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit *
                  </label>
                  <select
                    {...register('unit', { required: 'Unit is required' })}
                    className="input w-full"
                  >
                    <option value="">Select unit</option>
                    {units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="reminders"
                  {...register('reminders')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="reminders" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable daily reminders
                </label>
              </div>

              {watch('reminders') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    {...register('reminderTime')}
                    className="input w-full"
                    defaultValue="09:00"
                  />
                </div>
              )}

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
                  {editingHabit ? 'Update' : 'Create'} Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;

