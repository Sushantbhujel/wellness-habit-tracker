const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['study', 'sleep', 'exercise', 'meditation', 'water', 'nutrition', 'social', 'other'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  target: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      enum: ['hours', 'minutes', 'glasses', 'times', 'pages', 'steps', 'calories']
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    }
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  icon: {
    type: String,
    default: '📝'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reminder: {
    enabled: {
      type: Boolean,
      default: false
    },
    time: {
      type: String,
      default: '09:00'
    },
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastCompleted: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
habitSchema.index({ user: 1, category: 1 });
habitSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('Habit', habitSchema);
