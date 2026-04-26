import React from 'react';
import { m } from 'framer-motion';

const PageLoader = () => (
  <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#F8F7F4]">
    <div className="flex gap-2 mb-4">
      {[0, 1, 2].map(i => (
        <m.div key={i} animate={{ y: [0, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-3 h-3 bg-accent rounded-full" />
      ))}
    </div>
    <span className="font-body text-sm font-bold text-text-muted uppercase tracking-widest">Loading EPEP</span>
  </div>
);
export default PageLoader;