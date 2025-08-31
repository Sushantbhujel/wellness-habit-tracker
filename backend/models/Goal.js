const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['academic', 'fitness', 'wellness', 'personal', 'career', 'social'],
    required: true
  },
  type: {
    type: String,
    enum: ['short-term', 'long-term'],
    required: true
  },
  target: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    }
  },
  progress: {
    current: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'paused'],
    default: 'not-started'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  milestones: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    targetValue: Number,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  color: {
    type: String,
    default: '#10B981'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate progress percentage
goalSchema.methods.updateProgress = function() {
  if (this.target.value > 0) {
    this.progress.percentage = Math.min(100, Math.round((this.progress.current / this.target.value) * 100));
  }
  
  // Update status based on progress
  if (this.progress.percentage >= 100) {
    this.status = 'completed';
  } else if (this.progress.percentage > 0) {
    this.status = 'in-progress';
  } else {
    this.status = 'not-started';
  }
};

// Index for efficient queries
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, category: 1 });
goalSchema.index({ user: 1, deadline: 1 });

module.exports = mongoose.model('Goal', goalSchema);
