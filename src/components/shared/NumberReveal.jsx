/**
 * @fileoverview Animated Number Reveal — EPEP UI Component
 * @module NumberReveal
 *
 * Provides smooth, spring-animated number transitions with
 * regional formatting support (Indian/Standard/Percentage).
 * Used for score screens, dashboard stats, and map popups.
 *
 * @param {Object} props
 * @param {number} props.value     - Target number to animate to
 * @param {number} [props.duration]- Animation length in ms
 * @param {string} [props.prefix]  - Text prefix (e.g. "₹")
 * @param {string} [props.suffix]  - Text suffix (e.g. " Cr")
 * @param {string} [props.format]  - 'indian' | 'standard' | 'percentage'
 * @param {string} [props.className]- Custom CSS classes
 */
import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import PropTypes from 'prop-types';

const NumberReveal = ({ value, prefix = '', suffix = '', format = 'standard', className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (isInView) count.set(value);
  }, [isInView, value, count]);

  const display = useTransform(spring, (latest) => {
    const num = Math.round(latest);
    if (format === 'indian') return num.toLocaleString('en-IN');
    if (format === 'percentage') return num.toFixed(1) + '%';
    return num.toLocaleString();
  });

  return (
    <motion.span ref={ref} className={"font-['JetBrains_Mono'] " + className} style={{ willChange: 'transform' }}>
      {prefix}<motion.span>{display}</motion.span>{suffix}
    </motion.span>
  );
};

NumberReveal.propTypes = {
  value: PropTypes.number.isRequired,
  duration: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  format: PropTypes.oneOf(['indian', 'standard', 'percentage']),
  className: PropTypes.string,
};

NumberReveal.defaultProps = {
  duration: 800,
  prefix: '',
  suffix: '',
  format: 'standard',
  className: '',
};

export default NumberReveal;
