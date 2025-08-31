import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, MapPin, Edit, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.profile?.age || '',
    gender: user?.profile?.gender || '',
    height: user?.profile?.height || '',
    weight: user?.profile?.weight || '',
    fitnessGoals: user?.profile?.fitnessGoals || []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        profile: {
          age: parseInt(formData.age) || undefined,
          gender: formData.gender || undefined,
          height: parseInt(formData.height) || undefined,
          weight: parseInt(formData.weight) || undefined,
          fitnessGoals: formData.fitnessGoals
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      age: user?.profile?.age || '',
      gender: user?.profile?.gender || '',
      height: user?.profile?.height || '',
      weight: user?.profile?.weight || '',
      fitnessGoals: user?.profile?.fitnessGoals || []
    });
    setIsEditing(false);
  };

  const fitnessGoalOptions = [
    'weight-loss',
    'muscle-gain',
    'endurance',
    'flexibility',
    'general-fitness'
  ];

  const toggleFitnessGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter(g => g !== goal)
        : [...prev.fitnessGoals, goal]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your personal information</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-outline"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {user?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </div>
                <div className="flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Personal Information</h3>
              <p className="card-description">Update your personal details and preferences</p>
            </div>
            <div className="card-content space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter your age"
                      min="13"
                      max="100"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {user?.profile?.age ? `${user.profile.age} years` : 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {user?.profile?.gender ? user.profile.gender.charAt(0).toUpperCase() + user.profile.gender.slice(1) : 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (cm)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter height in cm"
                      min="100"
                      max="250"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {user?.profile?.height ? `${user.profile.height} cm` : 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter weight in kg"
                      min="30"
                      max="300"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {user?.profile?.weight ? `${user.profile.weight} kg` : 'Not specified'}
                    </p>
                  )}
                </div>
              </div>

              {/* Fitness Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fitness Goals
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {fitnessGoalOptions.map((goal) => (
                      <label key={goal} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.fitnessGoals.includes(goal)}
                          onChange={() => toggleFitnessGoal(goal)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user?.profile?.fitnessGoals?.length > 0 ? (
                      user.profile.fitnessGoals.map((goal) => (
                        <span
                          key={goal}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No fitness goals set</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
