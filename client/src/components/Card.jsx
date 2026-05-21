import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, style, className = '' }) => {
  return (
    <motion.div
      className={`card ${className}`}
      style={style}
      whileHover={{ 
        y: -8,
        boxShadow: "0 12px 40px rgba(168, 85, 247, 0.2)",
        borderColor: "var(--primary)"
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;  // ✅ MUST be default export