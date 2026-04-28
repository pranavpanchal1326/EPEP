/**
 * @fileoverview Network Connectivity Banner — EPEP
 * @module OfflineBanner
 *
 * Sticky top-bar notification that appears when the user is offline
 * or has just reconnected. Uses the EPEP design system colors:
 *   - Offline: #1A1814 (Ink Black)
 *   - Back Online: #2D5A3D (Forest Green)
 *
 * @param {Object} props
 * @param {boolean} props.isOnline   - Current connectivity state
 * @param {boolean} [props.wasOffline] - True if just reconnected
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useQueryClient } from '@tanstack/react-query';

const OfflineBanner = ({ isOnline: isOnlineProp, wasOffline: wasOfflineProp }) => {
  const status = useNetworkStatus();
  const isOnline = typeof isOnlineProp === 'boolean' ? isOnlineProp : status.isOnline;
  const wasOffline = typeof wasOfflineProp === 'boolean' ? wasOfflineProp : status.wasOffline;
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

OfflineBanner.propTypes = {
  isOnline:   PropTypes.bool.isRequired,
  wasOffline: PropTypes.bool,
}

OfflineBanner.defaultProps = {
  wasOffline: false,
}

export default OfflineBanner;
