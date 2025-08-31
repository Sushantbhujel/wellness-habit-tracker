const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'bad', 'terrible'],
    default: 'good'
  },
  difficulty: {
    type: String,
    enum: ['very-easy', 'easy', 'moderate', 'hard', 'very-hard'],
    default: 'moderate'
  },
  timeSpent: {
    type: Number, // in minutes
    min: 0
  },
  location: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ user: 1, habit: 1, date: 1 }, { unique: true });
progressSchema.index({ user: 1, date: 1 });
progressSchema.index({ habit: 1, date: 1 });

// Virtual for checking if target was met
progressSchema.virtual('targetMet').get(function() {
  // This would need to be populated with habit data to compare
  return this.completed;
});

// Method to calculate completion percentage
progressSchema.methods.getCompletionPercentage = function(targetValue) {
  if (!targetValue || targetValue === 0) return 0;
  return Math.min(100, Math.round((this.value / targetValue) * 100));
};

module.exports = mongoose.model('Progress', progressSchema);
