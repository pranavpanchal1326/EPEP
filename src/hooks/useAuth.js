/**
 * @fileoverview Firebase Authentication Hook — EPEP
 * @module useAuth
 *
 * React hook for Firebase Google Authentication state management.
 * Provides current user, sign-in, and sign-out functionality
 * to any component that needs authentication context.
 *
 * Authentication is entirely optional in EPEP.
 * All features work without signing in.
 * Sign-in enhances the experience with:
 *   - Personalised quiz leaderboard entry
 *   - Score history tied to Google account
 *   - Display name on leaderboard
 *
 * @returns {Object} auth state and actions
 * @returns {import('firebase/auth').User|null} .user - Current user or null
 * @returns {boolean}  .isLoading  - True while auth state resolving
 * @returns {boolean}  .isSignedIn - True when user is authenticated
 * @returns {Function} .signIn     - Trigger Google sign-in popup
 * @returns {Function} .signOut    - Sign out current user
 *
 * @example
 * const { user, isSignedIn, signIn, signOut } = useAuth()
 *
 * return isSignedIn
 *   ? <button onClick={signOut}>Sign out {user.displayName}</button>
 *   : <button onClick={signIn}>Sign in with Google</button>
 */

import { useState, useEffect } from 'react'
import {
  signInWithGoogle,
  signOutUser,
  onAuthChange,
} from '../lib/firebase'

/**
 * @typedef {Object} AuthState
 * @property {import('firebase/auth').User|null} user
 * @property {boolean} isLoading
 * @property {boolean} isSignedIn
 * @property {Function} signIn
 * @property {Function} signOut
 */

/**
 * useAuth — Firebase Authentication state hook
 * @returns {AuthState}
 */
const useAuth = () => {
  const [user,      setUser]      = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Subscribe to auth state changes on mount
    const unsubscribe = onAuthChange(currentUser => {
      setUser(currentUser)
      setIsLoading(false)
    })

    // Unsubscribe on unmount to prevent memory leaks
    return () => unsubscribe()
  }, [])

  /**
   * Trigger Google Sign-In popup.
   * Sets user state on success, does nothing on cancel.
   * @returns {Promise<void>}
   */
  const signIn = async () => {
    setIsLoading(true)
    const result = await signInWithGoogle()
    if (result) setUser(result)
    setIsLoading(false)
  }

  /**
   * Sign out the current user.
   * Clears user state.
   * @returns {Promise<void>}
   */
  const signOut = async () => {
    await signOutUser()
    setUser(null)
  }

  return {
    user,
    isLoading,
    isSignedIn: Boolean(user),
    signIn,
    signOut,
  }
}

export default useAuth
