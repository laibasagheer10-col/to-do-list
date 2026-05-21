import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaCalendarAlt, FaTag, FaTimes } from 'react-icons/fa';
import TaskCard from './TaskCard';
import { ThreeDots } from 'react-loader-spinner';

const TaskList = ({ tasks, onDelete, onToggle, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from tasks
  const categories = ['all', ...new Set(tasks.map(task => task.category).filter(Boolean))];

  // Check if task is urgent
  const isUrgent = (deadline) => {
    if (!deadline) return false;
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 2 && daysLeft >= 0;
  };

  // Check if task is overdue
  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  // Filter tasks based on search term and all filters
  const filteredTasks = tasks.filter(task => {
    // Search by title, description, category (CASE INSENSITIVE)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      task.title?.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower) ||
      task.category?.toLowerCase().includes(searchLower);
    
    // Status filter
    const matchesStatus = filter === 'all' ? true :
                          filter === 'completed' ? task.completed :
                          filter === 'pending' ? !task.completed :
                          filter === 'urgent' ? isUrgent(task.deadline) && !task.completed :
                          filter === 'overdue' ? isOverdue(task.deadline) && !task.completed :
                          true;
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' ? true : task.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
    setCategoryFilter('all');
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', marginTop: '2rem' }}>
      {/* Search and Filter Bar */}
      <div className="search-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            id="search"
            name="search"
            placeholder="🔍 Search by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '0.5rem 1rem',
            marginBottom: '1rem',
            cursor: 'pointer',
            color: 'var(--text)'
          }}
        >
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'} 
          {(filter !== 'all' || categoryFilter !== 'all') && (
            <span style={{ background: 'var(--primary)', padding: '2px 6px', borderRadius: '10px', fontSize: '12px' }}>
              Active
            </span>
          )}
        </button>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="filters-panel"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '600' }}>
                <FaTag style={{ marginRight: '0.5rem' }} /> Category
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                    style={{
                      background: categoryFilter === cat ? 'var(--primary)' : 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.4rem 1rem',
                      cursor: 'pointer',
                      color: categoryFilter === cat ? 'white' : 'var(--text)',
                      textTransform: 'capitalize'
                    }}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '600' }}>
                <FaCalendarAlt style={{ marginRight: '0.5rem' }} /> Status
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { value: 'all', label: 'All Tasks', emoji: '📋' },
                  { value: 'pending', label: 'Pending', emoji: '⏳' },
                  { value: 'completed', label: 'Completed', emoji: '✅' },
                  { value: 'urgent', label: 'Urgent (≤2 days)', emoji: '⚠️' },
                  { value: 'overdue', label: 'Overdue', emoji: '🔥' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className={`filter-btn ${filter === opt.value ? 'active' : ''}`}
                    style={{
                      background: filter === opt.value ? 'var(--primary)' : 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.4rem 1rem',
                      cursor: 'pointer',
                      color: filter === opt.value ? 'white' : 'var(--text)'
                    }}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {(filter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
              <button
                onClick={clearFilters}
                style={{
                  marginTop: '1rem',
                  background: 'transparent',
                  border: '1px solid var(--danger)',
                  borderRadius: '8px',
                  padding: '0.4rem 1rem',
                  cursor: 'pointer',
                  color: 'var(--danger)',
                  width: '100%'
                }}
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Found {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        {searchTerm && ` matching "${searchTerm}"`}
        {categoryFilter !== 'all' && ` in ${categoryFilter}`}
        {filter !== 'all' && ` (${filter})`}
      </div>

      {/* Task Grid */}
      <div className="task-grid">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.div
              key={task._id || task.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <TaskCard
                task={task}
                onDelete={onDelete}
                onToggle={onToggle}
                onUpdate={onUpdate}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results Message */}
      {filteredTasks.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}
        >
          {tasks.length === 0 ? (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <p>No tasks yet. Create your first task!</p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p>No tasks match your search criteria.</p>
              <button
                onClick={clearFilters}
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  marginTop: '1rem',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                Clear Filters
              </button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;