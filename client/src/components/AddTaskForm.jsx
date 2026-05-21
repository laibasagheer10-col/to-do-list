import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Card from './Card';
import Button from './Button';

const AddTaskForm = ({ onAdd, onCancel }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    category: 'work',
    deadline: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim()) {
      alert('Please enter a title');
      return;
    }
    onAdd(task);
    setTask({ title: '', description: '', category: 'work', deadline: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>✨ Add New Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title *"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            required
          />
          
          <textarea
            placeholder="Description (optional)"
            rows="3"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
          
          <select
            value={task.category}
            onChange={(e) => setTask({ ...task, category: e.target.value })}
          >
            <option value="work">💼 Work</option>
            <option value="personal">👤 Personal</option>
            <option value="study">📚 Study</option>
            <option value="other">🎯 Other</option>
          </select>
          
          <input
            type="datetime-local"
            value={task.deadline}
            onChange={(e) => setTask({ ...task, deadline: e.target.value })}
          />
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Button type="submit" style={{ flex: 1 }}>
              <FaPlus style={{ marginRight: '0.5rem' }} /> Add Task
            </Button>
            <Button type="button" onClick={onCancel} className="button-secondary" style={{ flex: 1 }}>
              <FaTimes style={{ marginRight: '0.5rem' }} /> Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default AddTaskForm;