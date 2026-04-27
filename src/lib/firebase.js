/**
 * @fileoverview Firebase Analytics Integration - EPEP
 * @module firebase
 */

import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'

/** @type {import('firebase/app').FirebaseApp | null} */
let app = null

/** @type {import('firebase/analytics').Analytics | null} */
let analytics = null

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
}

export const isConfigured = Boolean(firebaseConfig.projectId)

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    isSupported()
      .then((ok) => {
        if (ok) analytics = getAnalytics(app)
      })
      .catch(() => {
        analytics = null
      })
  } catch (error) {
    console.warn('[EPEP Firebase] Init skipped:', error?.message ?? 'unknown error')
  }
}

/**
 * Track a Firebase Analytics event safely.
 *
 * @param {string} eventName
 * @param {Record<string, unknown>} [params]
 * @returns {void}
 */
export const trackEvent = (eventName, params = {}) => {
  if (!analytics || !eventName) return
  try {
    logEvent(analytics, eventName, {
      ...params,
      app_name: 'EPEP',
      app_version: '1.0.0',
      platform: 'web',
    })
  } catch {
    // No-op by design: analytics must never break user experience.
  }
}

export { app, analytics }
