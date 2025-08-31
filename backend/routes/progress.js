const express = require('express');
const { body, validationResult } = require('express-validator');
const Progress = require('../models/Progress');
const Habit = require('../models/Habit');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/progress
// @desc    Get progress entries for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { habit, startDate, endDate, limit = 50 } = req.query;
    const query = { user: req.user._id };

    if (habit) query.habit = habit;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const progress = await Progress.find(query)
      .populate('habit', 'name category target')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/progress
// @desc    Log progress for a habit
// @access  Private
router.post('/', auth, [
  body('habit').isMongoId().withMessage('Valid habit ID is required'),
  body('value').isNumeric().withMessage('Progress value must be a number'),
  body('unit').trim().isLength({ min: 1 }).withMessage('Unit is required'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('notes').optional().trim(),
  body('mood').optional().isIn(['excellent', 'good', 'okay', 'bad', 'terrible']).withMessage('Invalid mood'),
  body('difficulty').optional().isIn(['very-easy', 'easy', 'moderate', 'hard', 'very-hard']).withMessage('Invalid difficulty'),
  body('timeSpent').optional().isNumeric().withMessage('Time spent must be a number'),
  body('location').optional().trim(),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { habit: habitId, date = new Date(), ...progressData } = req.body;

    // Check if habit exists and belongs to user
    const habit = await Habit.findOne({ _id: habitId, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Check if progress already exists for this date
    const existingProgress = await Progress.findOne({
      habit: habitId,
      user: req.user._id,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      }
    });

    if (existingProgress) {
      return res.status(400).json({ message: 'Progress already logged for this date' });
    }

    // Determine if target was met
    const targetMet = progressData.value >= habit.target.value;
    const completed = targetMet;

    const progress = new Progress({
      habit: habitId,
      user: req.user._id,
      date,
      completed,
      ...progressData
    });

    await progress.save();

    // Update habit streak if completed
    if (completed) {
      const yesterday = new Date(date);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const yesterdayProgress = await Progress.findOne({
        habit: habitId,
        user: req.user._id,
        date: {
          $gte: new Date(yesterday).setHours(0, 0, 0, 0),
          $lt: new Date(yesterday).setHours(23, 59, 59, 999)
        },
        completed: true
      });

      if (yesterdayProgress) {
        habit.streak.current += 1;
      } else {
        habit.streak.current = 1;
      }

      if (habit.streak.current > habit.streak.longest) {
        habit.streak.longest = habit.streak.current;
      }

      habit.streak.lastCompleted = date;
      await habit.save();
    }

    const populatedProgress = await Progress.findById(progress._id)
      .populate('habit', 'name category target');

    res.status(201).json({
      message: 'Progress logged successfully',
      progress: populatedProgress
    });
  } catch (error) {
    console.error('Log progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/:id
// @desc    Get a specific progress entry
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('habit', 'name category target');

    if (!progress) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }

    res.json({ progress });
  } catch (error) {
    console.error('Get progress entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/progress/:id
// @desc    Update a progress entry
// @access  Private
router.put('/:id', auth, [
  body('value').optional().isNumeric().withMessage('Progress value must be a number'),
  body('unit').optional().trim().isLength({ min: 1 }).withMessage('Unit cannot be empty'),
  body('notes').optional().trim(),
  body('mood').optional().isIn(['excellent', 'good', 'okay', 'bad', 'terrible']).withMessage('Invalid mood'),
  body('difficulty').optional().isIn(['very-easy', 'easy', 'moderate', 'hard', 'very-hard']).withMessage('Invalid difficulty'),
  body('timeSpent').optional().isNumeric().withMessage('Time spent must be a number'),
  body('location').optional().trim(),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const progress = await Progress.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('habit');

    if (!progress) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        progress[key] = req.body[key];
      }
    });

    // Recalculate completion status if value changed
    if (req.body.value !== undefined && progress.habit) {
      const targetMet = req.body.value >= progress.habit.target.value;
      progress.completed = targetMet;
    }

    await progress.save();

    const updatedProgress = await Progress.findById(progress._id)
      .populate('habit', 'name category target');

    res.json({
      message: 'Progress updated successfully',
      progress: updatedProgress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/progress/:id
// @desc    Delete a progress entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }

    res.json({ message: 'Progress entry deleted successfully' });
  } catch (error) {
    console.error('Delete progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/stats/summary
// @desc    Get progress summary statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalEntries = await Progress.countDocuments(query);
    const completedEntries = await Progress.countDocuments({ ...query, completed: true });
    const completionRate = totalEntries > 0 ? (completedEntries / totalEntries) * 100 : 0;

    const averageValue = await Progress.aggregate([
      { $match: query },
      { $group: { _id: null, avgValue: { $avg: '$value' } } }
    ]);

    const moodStats = await Progress.aggregate([
      { $match: query },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const difficultyStats = await Progress.aggregate([
      { $match: query },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      summary: {
        totalEntries,
        completedEntries,
        completionRate: Math.round(completionRate * 100) / 100,
        averageValue: averageValue[0]?.avgValue || 0
      },
      moodStats,
      difficultyStats
    });
  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
