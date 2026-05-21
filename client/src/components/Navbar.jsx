import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = ({ user, onLogout, onLogin, onRegister }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const result = await onLogin(formData.email, formData.password);
      if (result?.success) {
        setShowAuthModal(false);
        setFormData({ name: '', email: '', password: '' });
      } else {
        setError(result?.message || 'Login failed');
      }
    } else {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      const result = await onRegister(formData.name, formData.email, formData.password);
      if (result?.success) {
        setShowAuthModal(false);
        setFormData({ name: '', email: '', password: '' });
      } else {
        setError(result?.message || 'Registration failed');
      }
    }
  };

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="navbar-title"
          whileHover={{ scale: 1.05 }}
        >
          ✨ TaskMaster Pro
        </motion.div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaUser />
                <span>{user.name}</span>
              </div>
              <motion.button 
                className="logout-btn"
                onClick={onLogout}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt style={{ marginRight: '0.5rem' }} /> Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.button 
                className="logout-btn"
                onClick={() => {
                  setIsLogin(true);
                  setShowAuthModal(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignInAlt style={{ marginRight: '0.5rem' }} /> Login
              </motion.button>
              <motion.button 
                className="logout-btn"
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthModal(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserPlus style={{ marginRight: '0.5rem' }} /> Sign Up
              </motion.button>
            </>
          )}
        </div>
      </motion.nav>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -50 }}
              className="card"
              style={{ maxWidth: 400, width: '90%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                {isLogin ? 'Login' : 'Sign Up'}
              </h2>
              
              {error && (
                <div style={{ 
                  background: 'rgba(239,68,68,0.2)', 
                  color: '#ef4444', 
                  padding: '0.5rem', 
                  borderRadius: '8px', 
                  marginBottom: '1rem' 
                }}>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                )}
                
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                
                <button type="submit" className="button" style={{ width: '100%' }}>
                  {isLogin ? 'Login' : 'Create Account'}
                </button>
              </form>
              
              <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;