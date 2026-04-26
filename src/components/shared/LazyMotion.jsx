import React from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

const loadFeatures = () => import('framer-motion').then(res => res.domAnimation);

export function MotionProvider({ children }) {
  return (
    <LazyMotion features={loadFeatures}>
      {children}
    </LazyMotion>
  );
}