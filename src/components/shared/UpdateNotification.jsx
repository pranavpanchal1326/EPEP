import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UpdateNotification = ({ onUpdate }) => {
  const sw = useRegisterSW();
  const [offlineReady, setOfflineReady] = sw?.offlineReady || [false, () => {}];
  const [needUpdate, setNeedUpdate] = sw?.needUpdate || [false, () => {}];
  const updateServiceWorker = sw?.updateServiceWorker || (() => {});

  const close = () => {
    setOfflineReady(false);
    setNeedUpdate(false);
  };

  return (
    <AnimatePresence>
      {needUpdate && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-6 left-6 z-[1000] bg-white border border-[#E8E4DC] p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-start gap-4 max-w-sm"
        >
          <div className="w-10 h-10 bg-[#EBF2ED] rounded-full flex items-center justify-center text-[#2D5A3D] flex-shrink-0">
            <RefreshCw size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-['DM_Sans'] font-semibold text-sm text-[#1A1814]">Update Available</h4>
            <p className="font-['DM_Sans'] text-xs text-[#6B6560] mt-1">A new version of EPEP is ready for you.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { if (onUpdate) onUpdate(); updateServiceWorker(true); }} className="bg-[#2D5A3D] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#244831] transition-colors">Update Now</button>
              <button onClick={close} className="bg-transparent text-[#6B6560] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#F8F7F4] transition-colors">Later</button>
            </div>
          </div>
          <button onClick={close} className="text-[#6B6560] hover:text-[#1A1814]"><X size={16} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

UpdateNotification.propTypes = {
  onUpdate: PropTypes.func.isRequired,
}

export default UpdateNotification;
