import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';

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
export default NumberReveal;