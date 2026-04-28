import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useMotionConfig } from '../../hooks/useMotionConfig';

const TypingIndicator = ({ isVisible }) => {
  const { disableTranslation } = useMotionConfig();
  if (!isVisible) return null;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex justify-start mb-4">
      <div className="bg-surface border border-border-soft rounded-[16px] rounded-bl-[4px] px-4 py-3 flex gap-1.5 items-center shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.div 
            key={i} 
            animate={disableTranslation ? {} : { y: [0, -6, 0] }} 
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} 
            className="w-1.5 h-1.5 bg-accent rounded-full opacity-60" 
          />
        ))}
      </div>
    </motion.div>
  );
};

TypingIndicator.propTypes = {
  isVisible: PropTypes.bool.isRequired,
}

export default TypingIndicator;
