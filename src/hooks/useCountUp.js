import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp Hook
 * Animates a number from 0 to targetValue over duration.
 */
export const useCountUp = (targetValue, duration = 800, shouldStart = false) => {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);
  const animationFrame = useRef(null);

  useEffect(() => {
    if (!shouldStart) {
      setCount(0);
      startTime.current = null;
      return;
    }

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOut curve: 1 - Math.pow(1 - t, 3)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easedProgress * targetValue));

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [targetValue, duration, shouldStart]);

  return count;
};
