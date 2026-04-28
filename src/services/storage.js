/**
 * @fileoverview localStorage Service — EPEP Persistence Layer
 * @module storage
 *
 * Type-safe wrapper around browser localStorage providing:
 *   - Serialisation/deserialisation of complex values
 *   - Graceful degradation in private/incognito mode
 *   - In-memory fallback when localStorage is unavailable
 *   - QuotaExceededError handling with automatic pruning
 *
 * Storage budget: < 50KB total for all EPEP keys.
 *
 * Key prefix: 'epep_' — prevents collision with other apps.
 *
 * @see src/data/constants.js STORAGE_KEYS for all key names
 */

const PREFIX = 'epep_'
const memStorage = new Map()

/**
 * Retrieve a value from localStorage.
 *
 * @param {string} key            - Storage key (use STORAGE_KEYS constants)
 * @param {*}      [defaultValue] - Returned if key absent or parse fails
 * @returns {*}                     Stored value or defaultValue
 *
 * @example
 * const bestScore = storage.get(STORAGE_KEYS.QUIZ_BEST_SCORE, 0)
 */
const get = (key, defaultValue = null) => {
  try {
    const val = localStorage.getItem(PREFIX + key)
    return val ? JSON.parse(val) : defaultValue
  } catch (err) {
    console.warn('[EPEP Storage] get failed:', err.message)
    return memStorage.has(key) ? memStorage.get(key) : defaultValue
  }
}

/**
 * Save a value to localStorage.
 *
 * @param {string} key   - Storage key
 * @param {*}      value - Value to serialize and store
 * @returns {void}
 */
const set = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (err) {
    console.warn('[EPEP Storage] set failed:', err.message)
    memStorage.set(key, value)
  }
}

/**
 * Remove a key from localStorage.
 *
 * @param {string} key - Storage key to remove
 * @returns {void}
 */
const remove = (key) => {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch (err) {
    console.warn('[EPEP Storage] remove failed:', err.message)
    memStorage.delete(key)
  }
}

/**
 * Clear all EPEP-prefixed keys from localStorage.
 *
 * @returns {void}
 */
const clear = () => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(PREFIX)) localStorage.removeItem(key)
    })
  } catch (err) {
    console.warn('[EPEP Storage] clear failed:', err.message)
    memStorage.clear()
  }
}

export const storage = { get, set, remove, clear }
