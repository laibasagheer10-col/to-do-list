import './theme.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Card from './components/Card';
import Button from './components/Button';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import SplashScreen from './SplashScreen';
import Confetti from 'react-confetti';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchTasks(token);
    }
    setLoading(false);
  }, []);

  const fetchTasks = async (token) => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setTasks(data.todos);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  const addTask = async (newTask) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });
      const data = await response.json();
      if (data.success) {
        setTasks([data.todo, ...tasks]);
        setShowAddForm(false);
        toast.success('🎉 Task added successfully!');
      } else {
        toast.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Something went wrong');
    }
  };

  const deleteTask = async (id) => {
    if (!id) {
      console.error('No ID provided for delete');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => (task._id || task.id) !== id));
      toast.success('Task deleted', {
        icon: '🗑️',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const toggleComplete = async (id) => {
    if (!id) {
      console.error('No ID provided for toggle');
      return;
    }
    const task = tasks.find(t => (t._id || t.id) === id);
    if (!task) {
      console.error('Task not found');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !task.completed })
      });
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map(t => 
          (t._id || t.id) === id ? { ...t, completed: !t.completed } : t
        ));
        
        // Show confetti when task is completed
        if (!task.completed) {
          setShowConfetti(true);
          toast.success('🎉 Great job! Task completed!', {
            duration: 4000,
            icon: '🏆'
          });
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          toast('Task marked as incomplete', { icon: '🔄' });
        }
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const updateTask = async (id, updatedTask) => {
    if (!id) {
      console.error('No ID provided for update');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTask)
      });
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map(t => 
          (t._id || t.id) === id ? { ...t, ...updatedTask } : t
        ));
        toast.success('Task updated successfully!');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        fetchTasks(data.token);
        toast.success('Welcome aboard! 🎉 Account created successfully!');
        return { success: true };
      }
      toast.error(data.message || 'Registration failed');
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Network error. Please try again.');
      return { success: false, message: 'Network error' };
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        fetchTasks(data.token);
        toast.success(`Welcome back, ${data.user.name}! 👋`);
        return { success: true };
      }
      toast.error(data.message || 'Invalid credentials');
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
      return { success: false, message: 'Network error' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]);
    toast.success('Logged out successfully! 👋');
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        marginTop: '5rem', 
        color: 'var(--primary)' 
      }}>
        <div className="loader"></div>
        <p>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>TaskMaster Pro - Smart Todo App</title>
        <meta name="description" content="Beautiful purple-themed todo app with deadlines, filters, and animations" />
        <meta name="keywords" content="todo, tasks, productivity, deadline, purple theme" />
        <meta property="og:title" content="TaskMaster Pro" />
        <meta property="og:description" content="Manage your tasks efficiently" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#a855f7" />
      </Helmet>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a24',
            color: '#fff',
            border: '1px solid #a855f7',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#a855f7', '#c084fc', '#9333ea', '#fff']}
        />
      )}
      
      <div className="app-container">
        <Navbar 
          user={user}
          onLogout={handleLogout}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
        
        {user ? (
          <>
            <Card>
              <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                Welcome back, {user.name}! 👋
              </h2>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <FaPlus style={{ marginRight: '0.5rem' }} /> 
                {showAddForm ? 'Cancel' : 'Add Task'}
              </Button>
            </Card>

            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}
                >
                  <AddTaskForm onAdd={addTask} onCancel={() => setShowAddForm(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            <TaskList 
              tasks={tasks} 
              onDelete={deleteTask}
              onToggle={toggleComplete}
              onUpdate={updateTask}
            />
          </>
        ) : (
          <Card>
            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Welcome to TaskMaster Pro</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Please login or sign up to manage your tasks
            </p>
          </Card>
        )}
      </div>
    </HelmetProvider>
  );
}

export default App;