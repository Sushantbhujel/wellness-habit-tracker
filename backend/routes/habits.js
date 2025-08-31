const express = require('express');
const { body, validationResult } = require('express-validator');
const Habit = require('../models/Habit');
const Progress = require('../models/Progress');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/habits
// @desc    Get all habits for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const query = { user: req.user._id };

    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const habits = await Habit.find(query).sort({ createdAt: -1 });
    res.json({ habits });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Habit name is required'),
  body('category').isIn(['study', 'sleep', 'exercise', 'meditation', 'water', 'nutrition', 'social', 'other']).withMessage('Invalid category'),
  body('target.value').isNumeric().withMessage('Target value must be a number'),
  body('target.unit').isIn(['hours', 'minutes', 'glasses', 'times', 'pages', 'steps', 'calories']).withMessage('Invalid unit'),
  body('target.frequency').optional().isIn(['daily', 'weekly', 'monthly']).withMessage('Invalid frequency')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const habit = new Habit({
      ...req.body,
      user: req.user._id
    });

    await habit.save();
    res.status(201).json({ message: 'Habit created successfully', habit });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/habits/:id
// @desc    Get a specific habit
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ habit });
  } catch (error) {
    console.error('Get habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Habit name cannot be empty'),
  body('category').optional().isIn(['study', 'sleep', 'exercise', 'meditation', 'water', 'nutrition', 'social', 'other']).withMessage('Invalid category'),
  body('target.value').optional().isNumeric().withMessage('Target value must be a number'),
  body('target.unit').optional().isIn(['hours', 'minutes', 'glasses', 'times', 'pages', 'steps', 'calories']).withMessage('Invalid unit')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ message: 'Habit updated successfully', habit });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Also delete related progress entries
    await Progress.deleteMany({ habit: req.params.id });

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/habits/:id/toggle
// @desc    Toggle habit active status
// @access  Private
router.post('/:id/toggle', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    habit.isActive = !habit.isActive;
    await habit.save();

    res.json({ message: `Habit ${habit.isActive ? 'activated' : 'deactivated'} successfully`, habit });
  } catch (error) {
    console.error('Toggle habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/habits/:id/progress
// @desc    Get progress for a specific habit
// @access  Private
router.get('/:id/progress', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { habit: req.params.id, user: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const progress = await Progress.find(query).sort({ date: -1 });
    res.json({ progress });
  } catch (error) {
    console.error('Get habit progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
