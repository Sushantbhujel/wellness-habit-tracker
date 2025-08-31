const express = require('express');
const { body, validationResult } = require('express-validator');
const Goal = require('../models/Goal');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/goals
// @desc    Get all goals for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, status, type } = req.query;
    const query = { user: req.user._id };

    if (category) query.category = category;
    if (status) query.status = status;
    if (type) query.type = type;

    const goals = await Goal.find(query).sort({ createdAt: -1 });
    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Goal title is required'),
  body('category').isIn(['academic', 'fitness', 'wellness', 'personal', 'career', 'social']).withMessage('Invalid category'),
  body('type').isIn(['short-term', 'long-term']).withMessage('Invalid goal type'),
  body('target.value').isNumeric().withMessage('Target value must be a number'),
  body('target.unit').trim().isLength({ min: 1 }).withMessage('Target unit is required'),
  body('target.deadline').isISO8601().withMessage('Valid deadline is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = new Goal({
      ...req.body,
      user: req.user._id
    });

    await goal.save();
    res.status(201).json({ message: 'Goal created successfully', goal });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/goals/:id
// @desc    Get a specific goal
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ goal });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Goal title cannot be empty'),
  body('category').optional().isIn(['academic', 'fitness', 'wellness', 'personal', 'career', 'social']).withMessage('Invalid category'),
  body('type').optional().isIn(['short-term', 'long-term']).withMessage('Invalid goal type'),
  body('target.value').optional().isNumeric().withMessage('Target value must be a number'),
  body('target.unit').optional().trim().isLength({ min: 1 }).withMessage('Target unit cannot be empty'),
  body('target.deadline').optional().isISO8601().withMessage('Valid deadline is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal updated successfully', goal });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/goals/:id/progress
// @desc    Update goal progress
// @access  Private
router.put('/:id/progress', auth, [
  body('current').isNumeric().withMessage('Progress value must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.progress.current = req.body.current;
    goal.updateProgress();
    await goal.save();

    res.json({ message: 'Goal progress updated successfully', goal });
  } catch (error) {
    console.error('Update goal progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/goals/:id/milestones
// @desc    Add milestone to a goal
// @access  Private
router.post('/:id/milestones', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Milestone title is required'),
  body('targetValue').optional().isNumeric().withMessage('Target value must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.milestones.push(req.body);
    await goal.save();

    res.json({ message: 'Milestone added successfully', goal });
  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/goals/:id/milestones/:milestoneId
// @desc    Update milestone completion status
// @access  Private
router.put('/:id/milestones/:milestoneId', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const milestone = goal.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    milestone.completed = !milestone.completed;
    if (milestone.completed) {
      milestone.completedAt = new Date();
    } else {
      milestone.completedAt = undefined;
    }

    await goal.save();

    res.json({ message: 'Milestone updated successfully', goal });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
