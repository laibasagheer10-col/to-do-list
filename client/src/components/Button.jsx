import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, style, className = '', type = 'button', ...props }) => {
  return (
    <motion.button
      type={type}
      className={`button ${className}`}
      onClick={onClick}
      style={style}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;  // ✅ MUST be default export