import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X } from 'lucide-react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import { storage } from '../../services/storage';

const InstallBanner = () => {
  const { canInstall, handleInstall } = useInstallPrompt();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isDismissed = storage.get('install_dismissed');
    const dismissedAt = isDismissed ? new Date(isDismissed).getTime() : 0;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

    if (canInstall && !isInstalled && (Date.now() - dismissedAt > sevenDays)) {
      const timer = setTimeout(() => setShow(true), 90000); // 90 seconds
      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  const dismiss = () => {
    storage.set('install_dismissed', new Date().toISOString());
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-[1000] bg-[#EBF2ED] border-t border-[#2D5A3D] p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2D5A3D]">
              <Smartphone size={20} />
            </div>
            <span className="font-['DM_Sans'] text-sm font-medium text-[#1A1814]">Install EPEP — works offline, like an app</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleInstall} className="bg-[#2D5A3D] text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm">Install</button>
            <button onClick={dismiss} className="text-[#6B6560]"><X size={20} /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default InstallBanner;