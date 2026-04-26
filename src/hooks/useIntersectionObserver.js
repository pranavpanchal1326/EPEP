import { useState, useEffect } from 'react';

/**
 * useIntersectionObserver Hook
 * Returns boolean indicating if element is in viewport.
 */
export const useIntersectionObserver = (ref, options = { threshold: 0.1, rootMargin: '0px' }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold, options.rootMargin]);

  return isIntersecting;
};
