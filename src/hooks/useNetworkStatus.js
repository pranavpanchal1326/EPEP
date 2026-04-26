import { useState, useEffect } from 'react'

export const useNetworkStatus = () => {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    wasOffline: false
  })

  useEffect(() => {
    const handleOnline = () => setStatus(prev => ({ isOnline: true, wasOffline: !prev.isOnline }))
    const handleOffline = () => setStatus({ isOnline: false, wasOffline: false })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return status
};