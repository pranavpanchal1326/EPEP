/**
 * @fileoverview Page Loading Indicator — EPEP
 * @module PageLoader
 *
 * Full-screen loading overlay used during route transitions
 * and initial application boot. Features the EPEP triple-dot
 * pulse animation in forest green.
 *
 * @param {Object} props
 * @param {string} [props.message] - Text displayed below the animation
 */
import React from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';

const PageLoader = ({ message }) => (
  <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#F8F7F4]">
    <div className="flex gap-2 mb-4">
      {[0, 1, 2].map(i => (
        <m.div key={i} animate={{ y: [0, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-3 h-3 bg-accent rounded-full" />
      ))}
    </div>
    <span className="font-body text-sm font-bold text-text-muted uppercase tracking-widest">{message}</span>
  </div>
);

PageLoader.propTypes = {
  message: PropTypes.string,
};

PageLoader.defaultProps = {
  message: 'Loading...',
};

export default PageLoader;
