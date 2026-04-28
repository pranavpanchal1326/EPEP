/**
 * @fileoverview Firebase Services — EPEP Google Integration Hub
 * @module firebase
 *
 * Comprehensive Google Firebase integration providing three services:
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  Service              │ Purpose                                 │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  Firebase Analytics   │ User interaction tracking (10 events)  │
 * │  Firebase Firestore   │ Quiz score persistence + leaderboard   │
 * │  Firebase Auth        │ Optional Google Sign-In                │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Resilience contract:
 *   Every Firebase operation is wrapped in try-catch.
 *   Firebase failure NEVER crashes the application.
 *   All features degrade gracefully to local fallbacks.
 *
 * @see https://firebase.google.com/docs
 */

import { QUIZ_SESSION_SIZE } from '../data/constants'

import { initializeApp }                        from 'firebase/app'
import { getAnalytics, logEvent, isSupported }   from 'firebase/analytics'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
}                                                from 'firebase/firestore'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
}                                                from 'firebase/auth'

// ── Firebase config ───────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY             ?? '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN         ?? '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID          ?? '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET      ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID              ?? '',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID      ?? '',
}

const isConfigured = Boolean(firebaseConfig.projectId)

// ── Initialise Firebase ───────────────────────────────────────────────────────
let app       = null
let analytics = null
let db        = null
let auth      = null

if (isConfigured) {
  try {
    app  = initializeApp(firebaseConfig)
    db   = getFirestore(app)
    auth = getAuth(app)

    isSupported()
      .then(ok => { if (ok) analytics = getAnalytics(app) })
      .catch(() => {})
  } catch (e) {
    console.error('[EPEP Firebase] Init skipped:', e.message)
  }
}

// ════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Track a user interaction event to Firebase Analytics.
 *
 * Called throughout EPEP on meaningful user interactions:
 *   page_view, quiz_started, quiz_completed, quiz_answer_submitted,
 *   evm_vote_cast, map_state_clicked, ai_chat_message_sent,
 *   ai_response_received, education_step_viewed, dashboard_filter_applied
 *
 * @param {string} eventName - GA4 snake_case event name
 * @param {Object} [params]  - Event dimensions
 * @returns {void}
 *
 * @example
 * trackEvent('quiz_completed', { score: 16, grade: 'Election Expert' })
 */
export const trackEvent = (eventName, params = {}) => {
  if (!analytics) return
  try {
    logEvent(analytics, eventName, {
      ...params,
      app_name:    'EPEP',
      app_version: '2.0.0',
      platform:    'web',
    })
  } catch {
    // Never crash on analytics failure
  }
}

// ════════════════════════════════════════════════════════════════════════════
// FIRESTORE — Quiz Score Persistence & Leaderboard
// ════════════════════════════════════════════════════════════════════════════

/**
 * Save a quiz result to Firebase Firestore.
 *
 * Stores quiz performance data for analytics and leaderboard display.
 * Falls back silently if Firestore is unavailable — localStorage
 * always saves the score regardless.
 *
 * @param {Object} result              - Quiz result data
 * @param {number} result.score        - Number of correct answers (0-20)
 * @param {number} result.percentage   - Score as percentage (0-100)
 * @param {string} result.grade        - Grade label (Novice/Informed/Expert)
 * @param {string} [result.userId]     - Firebase Auth UID if signed in
 * @param {string} [result.displayName]- User display name if signed in
 * @returns {Promise<string|null>}     - Firestore document ID, or null on failure
 *
 * @example
 * const docId = await saveQuizResult({
 *   score: 16, percentage: 80, grade: 'Election Expert'
 * })
 */
export const saveQuizResult = async (result) => {
  if (!db) return null
  try {
    const docRef = await addDoc(collection(db, 'quiz_results'), {
      score:       result.score,
      percentage:  result.percentage,
      grade:       result.grade,
      userId:      result.userId     ?? 'anonymous',
      displayName: result.displayName ?? 'Anonymous Voter',
      totalQuestions: QUIZ_SESSION_SIZE,
      timestamp:   serverTimestamp(),
      platform:    'web',
      version:     '2.0.0',
    })
    return docRef.id
  } catch (err) {
    console.error('[EPEP Firestore] saveQuizResult failed:', err.message)
    return null
  }
}

/**
 * Fetch top quiz scores from Firestore leaderboard.
 *
 * Retrieves the highest scoring quiz submissions for display
 * on the leaderboard. Returns empty array on failure.
 *
 * @param {number} [count=10] - Number of top scores to fetch
 * @returns {Promise<Array>}   - Array of score objects, sorted by percentage desc
 *
 * @example
 * const topScores = await getLeaderboard(10)
 * topScores.forEach(s => console.log(s.displayName, s.percentage))
 */
export const getLeaderboard = async (count = 10) => {
  if (!db) return []
  try {
    const q      = query(
      collection(db, 'quiz_results'),
      orderBy('percentage', 'desc'),
      limit(count)
    )
    const snap   = await getDocs(q)
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (err) {
    console.error('[EPEP Firestore] getLeaderboard failed:', err.message)
    return []
  }
}

/**
 * Save AI chat interaction metadata to Firestore.
 * Used to track which election topics users ask about most.
 *
 * @param {Object} interaction
 * @param {string} interaction.query      - Sanitised user question
 * @param {string} interaction.aiLayer    - Which AI layer responded
 * @param {string} interaction.model      - Model name used
 * @param {boolean} interaction.isOnline  - Network status at time of query
 * @returns {Promise<void>}
 */
export const saveAIInteraction = async (interaction) => {
  if (!db) return
  try {
    await addDoc(collection(db, 'ai_interactions'), {
      query:     interaction.query?.slice(0, 200) ?? '',
      aiLayer:   interaction.aiLayer,
      model:     interaction.model,
      isOnline:  interaction.isOnline,
      timestamp: serverTimestamp(),
    })
  } catch {
    // Silent failure — never disrupt chat flow
  }
}

// ════════════════════════════════════════════════════════════════════════════
// FIREBASE AUTH — Google Sign-In
// ════════════════════════════════════════════════════════════════════════════

/**
 * Sign in the user with Google via Firebase Authentication.
 *
 * Uses a popup flow — no redirect, no page reload.
 * Returns user object on success, null on failure or cancellation.
 * The app works fully without authentication — sign-in is optional.
 *
 * @returns {Promise<import('firebase/auth').User|null>}
 *
 * @example
 * const user = await signInWithGoogle()
 * if (user) console.log('Signed in as:', user.displayName)
 */
export const signInWithGoogle = async () => {
  if (!auth) return null
  try {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const result   = await signInWithPopup(auth, provider)
    trackEvent('user_signed_in', { method: 'google' })
    return result.user
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      console.error('[EPEP Auth] Sign-in failed:', err.message)
    }
    return null
  }
}

/**
 * Sign out the currently authenticated user.
 *
 * @returns {Promise<void>}
 *
 * @example
 * await signOutUser()
 */
export const signOutUser = async () => {
  if (!auth) return
  try {
    await signOut(auth)
    trackEvent('user_signed_out', {})
  } catch (err) {
    console.error('[EPEP Auth] Sign-out failed:', err.message)
  }
}

/**
 * Subscribe to Firebase Auth state changes.
 * Calls callback immediately with current user (null if not signed in).
 *
 * @param {Function} callback - Called with user object or null
 * @returns {Function}          Unsubscribe function — call on component unmount
 *
 * @example
 * const unsubscribe = onAuthChange(user => {
 *   setCurrentUser(user)
 * })
 * return () => unsubscribe()
 */
export const onAuthChange = (callback) => {
  if (!auth) { callback(null); return () => {} }
  return onAuthStateChanged(auth, callback)
}

export { app, analytics, db, auth, isConfigured }
