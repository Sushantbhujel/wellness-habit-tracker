import { useState, useEffect } from 'react';
import { Plus, Target, Edit, Trash2, Eye, Calendar, X, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { goalsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm();

  const goalCategories = [
    { value: 'academic', label: 'Academic', color: 'bg-blue-100 text-blue-800' },
    { value: 'fitness', label: 'Fitness', color: 'bg-green-100 text-green-800' },
    { value: 'wellness', label: 'Wellness', color: 'bg-purple-100 text-purple-800' },
    { value: 'personal', label: 'Personal', color: 'bg-pink-100 text-pink-800' },
    { value: 'career', label: 'Career', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'social', label: 'Social', color: 'bg-orange-100 text-orange-800' }
  ];

  const goalTypes = [
    { value: 'short-term', label: 'Short Term' },
    { value: 'long-term', label: 'Long Term' }
  ];

  const goalStatuses = [
    { value: 'not-started', label: 'Not Started', color: 'bg-gray-100 text-gray-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'paused', label: 'Paused', color: 'bg-yellow-100 text-yellow-800' }
  ];

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsAPI.getAll();
      console.log('Goals API response:', response);
      // Ensure goals is always an array - backend returns { goals: [...] }
      setGoals(Array.isArray(response.data.goals) ? response.data.goals : []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
      // Set empty array on error
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      const goalData = {
        title: data.title,
        description: data.description,
        category: data.category,
        type: data.type,
        target: {
          value: parseInt(data.target),
          unit: data.unit || 'times',
          deadline: data.deadline ? new Date(data.deadline).toISOString() : new Date().toISOString()
        },
        progress: {
          current: parseInt(data.currentProgress) || 0
        },
        status: data.status || 'not-started',
        priority: data.priority || 'medium'
      };

      if (editingGoal) {
        await goalsAPI.update(editingGoal._id, goalData);
        toast.success('Goal updated successfully!');
      } else {
        await goalsAPI.create(goalData);
        toast.success('Goal created successfully!');
      }

      setShowAddModal(false);
      setEditingGoal(null);
      reset();
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      } else {
        toast.error(editingGoal ? 'Failed to update goal' : 'Failed to create goal');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setValue('title', goal.title);
    setValue('description', goal.description);
    setValue('category', goal.category);
    setValue('type', goal.type);
    setValue('target', goal.target?.value || goal.target);
    setValue('unit', goal.target?.unit || 'times');
    setValue('currentProgress', goal.progress?.current || goal.currentProgress || 0);
    setValue('deadline', goal.target?.deadline?.split('T')[0] || goal.deadline?.split('T')[0]);
    setValue('status', goal.status);
    setValue('priority', goal.priority);
    setShowAddModal(true);
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsAPI.delete(goalId);
        toast.success('Goal deleted successfully!');
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
        toast.error('Failed to delete goal');
      }
    }
  };

  const updateProgress = async (goalId, newProgress) => {
    try {
      await goalsAPI.updateProgress(goalId, { current: newProgress });
      toast.success('Progress updated!');
      fetchGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const openAddModal = () => {
    setEditingGoal(null);
    reset();
    // Set default date to today
    setValue('deadline', new Date().toISOString().split('T')[0]);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingGoal(null);
    reset();
  };

  const getStatusColor = (status) => {
    const statusObj = goalStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const cat = goalCategories.find(c => c.value === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = (goal) => {
    const target = goal.target?.value || goal.target;
    const current = goal.progress?.current || goal.currentProgress || 0;
    if (!target) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Goals</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Set and track your personal goals ({goals.length} total)
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No goals yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Start achieving your dreams by setting your first goal
          </p>
          <button 
            onClick={openAddModal}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(goals) && goals.map((goal) => {
            const progress = calculateProgress(goal);
            return (
              <div key={goal._id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Target className="h-6 w-6 text-primary-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                          {goalCategories.find(c => c.value === goal.category)?.label || goal.category}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goalStatuses.find(s => s.value === goal.status)?.label || goal.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(goal)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(goal._id)}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Progress</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                                         <div className="flex justify-between items-center mt-1">
                       <p className="text-sm text-gray-600 dark:text-gray-300">
                         {(goal.progress?.current || goal.currentProgress || 0)} / {(goal.target?.value || goal.target)} ({progress}%)
                       </p>
                      <button
                                                 onClick={() => {
                           const currentProgress = goal.progress?.current || goal.currentProgress || 0;
                           const newProgress = prompt('Enter new progress value:', currentProgress);
                           if (newProgress !== null && !isNaN(newProgress)) {
                             updateProgress(goal._id, parseInt(newProgress));
                           }
                         }}
                        className="text-xs text-primary-600 hover:text-primary-800"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                                         <div className="flex items-center">
                       <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                       <span className="text-sm text-gray-600 dark:text-gray-300">
                         Due {formatDate(goal.target?.deadline || goal.deadline)}
                       </span>
                     </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {goalTypes.find(t => t.value === goal.type)?.label || goal.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingGoal ? 'Edit Goal' : 'Add New Goal'}
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
                  Goal Title *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Goal title is required' })}
                  className="input w-full"
                  placeholder="e.g., Complete 30 days of exercise"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className="input w-full"
                  rows="3"
                  placeholder="Describe your goal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="input w-full"
                  >
                    <option value="">Select category</option>
                    {goalCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    {...register('type', { required: 'Type is required' })}
                    className="input w-full"
                  >
                    <option value="">Select type</option>
                    {goalTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                    Unit
                  </label>
                  <input
                    type="text"
                    {...register('unit')}
                    className="input w-full"
                    placeholder="e.g., days, books"
                    defaultValue="times"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Progress
                  </label>
                  <input
                    type="number"
                    {...register('currentProgress', { 
                      min: { value: 0, message: 'Progress cannot be negative' }
                    })}
                    className="input w-full"
                    placeholder="0"
                    defaultValue="0"
                  />
                  {errors.currentProgress && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentProgress.message}</p>
                  )}
                </div>
              </div>

                             <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Deadline *
                 </label>
                 <input
                   type="date"
                   {...register('deadline', { required: 'Deadline is required' })}
                   className="input w-full"
                 />
                 {errors.deadline && (
                   <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
                 )}
               </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="input w-full"
                  defaultValue="not-started"
                >
                  {goalStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
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
                  {editingGoal ? 'Update' : 'Create'} Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
