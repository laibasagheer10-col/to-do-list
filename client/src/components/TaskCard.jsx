import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const TaskCard = ({ task, onDelete, onToggle, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  // ✅ MOVED isUrgent function INSIDE component (was outside before)
  const isUrgent = (deadline) => {
    if (!deadline) return false;
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 2 && daysLeft >= 0;
  };

  const getDeadlineStatus = () => {
    if (!task.deadline) return 'normal';
    const now = new Date();
    const deadline = new Date(task.deadline);
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (task.completed) return 'completed';
    if (now > deadline) return 'overdue';
    if (daysLeft <= 1) return 'urgent';
    if (daysLeft <= 3) return 'warning';
    return 'normal';
  };

  const status = getDeadlineStatus();
  const statusClass = status === 'urgent' ? 'urgent' : 
                      status === 'overdue' ? 'overdue' : 
                      status === 'completed' ? 'completed' : '';

  const handleSave = () => {
    onUpdate(task.id || task._id, editedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.id || task._id);
  };

  const handleToggle = () => {
    onToggle(task.id || task._id);
  };

  const formatDate = (date) => {
    if (!date) return 'No deadline';
    const d = new Date(date);
    const now = new Date();
    const daysLeft = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    
    let dateStr = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    if (status === 'urgent') dateStr += ' ⚠️ URGENT!';
    if (status === 'overdue') dateStr += ' 🔥 OVERDUE!';
    else if (daysLeft <= 3 && daysLeft >= 0 && !task.completed) dateStr += ` (${daysLeft} day${daysLeft !== 1 ? 's' : ''} left)`;
    
    return dateStr;
  };

  if (isEditing) {
    return (
      <motion.div 
        className={`task-card ${statusClass}`}
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          placeholder="Title"
          style={{ marginBottom: '0.5rem' }}
        />
        <textarea
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          placeholder="Description"
          rows="2"
          style={{ marginBottom: '0.5rem' }}
        />
        <select
          value={editedTask.category}
          onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
          style={{ marginBottom: '0.5rem' }}
        >
          <option value="work">💼 Work</option>
          <option value="personal">👤 Personal</option>
          <option value="study">📚 Study</option>
          <option value="other">🎯 Other</option>
        </select>
        <input
          type="datetime-local"
          value={editedTask.deadline?.slice(0, 16) || ''}
          onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
          style={{ marginBottom: '0.5rem' }}
        />
        <div className="task-actions">
          <button className="button" onClick={handleSave} style={{ padding: '0.5rem', flex: 1 }}>
            <FaSave /> Save
          </button>
          <button className="button-secondary" onClick={() => setIsEditing(false)} style={{ padding: '0.5rem', flex: 1 }}>
            <FaTimes /> Cancel
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`task-card ${statusClass}`}
      layout
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(168, 85, 247, 0.15)" }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
        <h3 className="task-title" style={{ 
          fontSize: '1.1rem', 
          fontWeight: '600',
          textDecoration: task.completed ? 'line-through' : 'none',
          opacity: task.completed ? 0.7 : 1
        }}>
          {task.title}
        </h3>
        <span style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--hover))',
          padding: '0.2rem 0.6rem', 
          borderRadius: '8px',
          fontSize: '0.75rem',
          textTransform: 'capitalize'
        }}>
          {task.category}
        </span>
      </div>
      
      <p className="task-desc" style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
        {task.description || 'No description'}
      </p>
      
      <div style={{ marginBottom: '0.75rem' }}>
        <span style={{ 
          fontSize: '0.8rem', 
          color: status === 'urgent' ? '#dc2626' : 
                 status === 'overdue' ? '#7f1d1d' : 
                 'var(--text-muted)',
          fontWeight: status === 'urgent' || status === 'overdue' ? '600' : 'normal'
        }}>
          📅 {formatDate(task.deadline)}
        </span>
      </div>
      
      <div className="task-actions">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          style={{ width: '22px', height: '22px', cursor: 'pointer' }}
        />
        <button className="edit-btn" onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
          <FaEdit />
        </button>
        <button className="delete-btn" onClick={handleDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
          <FaTrash />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;