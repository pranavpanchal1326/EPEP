import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useQueryClient } from '@tanstack/react-query';

const OfflineBanner = () => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (wasOffline && isOnline) {
      queryClient.invalidateQueries();
    }
  }, [isOnline, wasOffline, queryClient]);

  return (
    <AnimatePresence>
      {(!isOnline || wasOffline) && (
        <motion.div
          initial={{ y: -40 }}
          animate={{ y: 0 }}
          exit={{ y: -40 }}
          className={`fixed top-0 left-0 right-0 z-[9999] h-10 flex items-center justify-center gap-3 font-['DM_Sans'] text-sm text-white ${!isOnline ? 'bg-[#1A1814]' : 'bg-[#2D5A3D]'}`}
        >
          {!isOnline ? (
            <>
              <WifiOff size={16} />
              <span>You're offline. Showing cached data — all features still work.</span>
            </>
          ) : (
            <>
              <Wifi size={16} />
              <span>Back online — refreshing data...</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default OfflineBanner;