const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
 
    const todo = new Todo({ 
      ...req.body, 
      userId: req.user.userId  
    });
    await todo.save();
    res.status(201).json({ success: true, todo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.get('/', auth, async (req, res) => {
  try {
    const { status, deadline, category, search } = req.query;
    
    const filter = { userId: req.user.userId };

    // Status filter
    if (status === 'completed') filter.completed = true;
    else if (status === 'pending') filter.completed = false;

    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Deadline filter
    const now = new Date();
    if (deadline === 'near') {
      const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      filter.deadline = { $gte: now, $lte: nextDay, $ne: null };
    } else if (deadline === 'overdue') {
      filter.deadline = { $lt: now };
      filter.completed = false;
    }

    const todos = await Todo.find(filter).sort({ deadline: 1, createdAt: -1 });
    res.json({ success: true, todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    // ✅ FIXED: Use 'userId' to match your Todo model
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!todo) return res.status(404).json({ message: 'Task not found' });
    res.json({ success: true, todo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    // ✅ FIXED: Use 'userId' to match your Todo model
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;