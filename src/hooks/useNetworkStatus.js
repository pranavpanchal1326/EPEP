/**
 * @fileoverview Network Status Hook — EPEP
 * @module useNetworkStatus
 *
 * Detects online/offline state changes and exposes them reactively.
 * Drives the OfflineBanner component and AI fallback decisions.
 *
 * @returns {Object}  network state
 * @returns {boolean} .isOnline    - Current network connectivity
 * @returns {boolean} .wasOffline  - True briefly after reconnecting
 *                                   (used to trigger data refresh)
 */

import { useState, useEffect } from 'react'

/**
 * Track browser network status and reconnect transitions.
 *
 * @returns {{isOnline: boolean, wasOffline: boolean}}
 */
export const useNetworkStatus = () => {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    wasOffline: false,
  })

  useEffect(() => {
    const handleOnline = () => setStatus((prev) => ({ isOnline: true, wasOffline: !prev.isOnline }))
    const handleOffline = () => setStatus({ isOnline: false, wasOffline: false })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return status
}
