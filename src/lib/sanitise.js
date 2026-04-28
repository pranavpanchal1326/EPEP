/**
 * @fileoverview Input Sanitisation Utilities - EPEP Security Layer
 * @module sanitise
 */

/**
 * Sanitise a user text input.
 *
 * @param {unknown} input
 * @param {number} [maxLen=500]
 * @returns {string}
 */
export const sanitiseInput = (input, maxLen = 500) => {
  try {
    if (typeof input !== 'string') return ''
    return input
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
      .slice(0, maxLen)
  } catch (err) {
    console.warn('[EPEP Sanitise] sanitiseInput failed:', err.message)
    return ''
  }
}

/**
 * Sanitise a search query.
 *
 * @param {unknown} query
 * @param {number} [max=200]
 * @returns {string}
 */
export const sanitiseQuery = (query, max = 200) => {
  try {
    if (typeof query !== 'string') return ''
    return query
      .replace(/<[^>]*>/g, '')
      .trim()
      .slice(0, max)
  } catch (err) {
    console.warn('[EPEP Sanitise] sanitiseQuery failed:', err.message)
    return ''
  }
}

/**
 * Validate a top-level API response shape.
 *
 * @param {unknown} data
 * @param {string[]} [required=[]]
 * @returns {boolean}
 */
export const isValidAPIResponse = (data, required = []) => {
  try {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false
    return required.every((key) => key in data)
  } catch (err) {
    console.warn('[EPEP Sanitise] isValidAPIResponse failed:', err.message)
    return false
  }
}
